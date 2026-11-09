<div align="center">
  <img width="140" src="https://user-images.githubusercontent.com/6661165/91657958-61b4fd00-eb00-11ea-9def-dc7ef5367e34.png" alt="GitHub Profile Trophy Renewed"/>
  <h2 align="center">GitHub Profile Trophy Renewed</h2>
  <p align="center">Rank trophies for a GitHub profile README</p>
  <p align="center">
    Patched fork by <a href="https://github.com/vmbr0">VMBR0</a>
    · Original project by <a href="https://github.com/ryo-ma">ryo-ma</a>
  </p>
</div>

<div align="center">

[![stargazers](https://img.shields.io/github/stars/vmbr0/github-profile-trophy)](https://github.com/vmbr0/github-profile-trophy/stargazers)
[![forks](https://img.shields.io/github/forks/vmbr0/github-profile-trophy)](https://github.com/vmbr0/github-profile-trophy/network/members)
[![issues](https://img.shields.io/github/issues/vmbr0/github-profile-trophy)](https://github.com/vmbr0/github-profile-trophy/issues)
[![license](https://img.shields.io/github/license/vmbr0/github-profile-trophy)](https://github.com/vmbr0/github-profile-trophy/blob/master/LICENSE)

</div>

<p align="center">
  <img src="https://cdn.jsdelivr.net/gh/vmbr0/github-profile-trophy@v1.0.0/trophy.svg" alt="Trophies for vmbr0"/>
</p>

# About

**GitHub Profile Trophy Renewed** is a patched fork of
[ryo-ma/github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy).
It renders a row of GitHub trophies (stars, commits, followers, and the other
ranks below) as an SVG you can put on a profile README.

The upstream site often fails, and a stock Vercel deploy of that code crashes
before it returns an image. GitHub then shows a broken image. This fork fixes
that, refreshes the card frame, and can publish the SVG with no server.

## Credits

| Role                | Who                                                                             |
| ------------------- | ------------------------------------------------------------------------------- |
| Patch               | [VMBR0](https://github.com/vmbr0)                                               |
| Original author     | [ryo-ma](https://github.com/ryo-ma)                                             |
| Original repository | [ryo-ma/github-profile-trophy](https://github.com/ryo-ma/github-profile-trophy) |
| License             | MIT, copyright (c) 2020 ryo-ma. See [LICENSE](./LICENSE).                       |
| Upstream sponsors   | [github.com/sponsors/ryo-ma](https://github.com/sponsors/ryo-ma)                |

Trophy art, rank rules, and themes come from the original project. The patch is
the work of VMBR0.

## What the patch changes

- Vercel can start the function. The upstream `@std/dotenv/load` import does not
  resolve on `vercel-deno` and every request returned 500. This fork loads
  dotenv from a full URL.
- API failures return an SVG error card instead of an HTML page, so a profile
  README still shows an image. Opening the site with no `username` still shows
  the HTML form.
- `render_svg.ts` can write `trophy.svg` in the current directory.
- Each card has a rounded, rank-colored frame. The progress bar has a real
  width, so it still draws when GitHub strips the CSS animation.
- `trophy.svg` in this repo is a ready-made card for `vmbr0`, refreshed by
  GitHub Actions.

# Quick start

Paste this into a profile README. It loads the card already generated for
`vmbr0`.

```md
[![trophy](https://cdn.jsdelivr.net/gh/vmbr0/github-profile-trophy@v1.0.0/trophy.svg)](https://github.com/vmbr0/github-profile-trophy)
```

`v1.0.0` stays on this release. Use `@master` instead if you want the copy that
the daily workflow rewrites:

```md
[![trophy](https://cdn.jsdelivr.net/gh/vmbr0/github-profile-trophy@master/trophy.svg)](https://github.com/vmbr0/github-profile-trophy)
```

jsDelivr is required. An SVG from `raw.githubusercontent.com` usually shows up
as a broken image on GitHub.

Want the card for another username? Use the [GitHub Action](#github-action),
[generate it locally](#generate-an-svg-locally), or
[self-host](#self-host-on-vercel) and pass `?username=`.

# Setup

## Static image in this repo

`.github/workflows/update-trophy.yml` rebuilds `trophy.svg` for the owner of the
repository. It runs every day at 07:15 UTC and when you click **Run workflow**.

On a fork, open the Actions tab once and enable workflows. Scheduled runs stay
off until you do.

## GitHub Action

Use the action from this repository in any repo. `GITHUB_TOKEN` is enough for
public contribution data. A personal access token with the `repo` scope is only
needed when private contributions should count.

```yaml
- name: Generate trophy
  uses: vmbr0/github-profile-trophy@v1.0.0
  with:
    username: your-username
    output_path: trophy.svg
    token: ${{ secrets.GITHUB_TOKEN }}
    theme: default
```

Commit `trophy.svg` and embed it with jsDelivr, the same way as the quick start.
Replace `vmbr0/github-profile-trophy` with your repository.

## Generate an SVG locally

Copy [env-example](env-example) to `.env` and set a GitHub token:

```properties
GITHUB_TOKEN1=your_token
GITHUB_TOKEN2=your_token
```

Both variables can be the same token. Scopes: `read:user` and `public_repo`. Add
`repo` only if private contributions should count.

```bash
deno run --allow-net --allow-env --allow-read --allow-write ./render_svg.ts USERNAME trophy.svg THEME
```

Example:

```bash
deno run --allow-net --allow-env --allow-read --allow-write ./render_svg.ts vmbr0 trophy.svg onedark
```

Run the server locally with `deno task start`, then open
`http://localhost:8080/?username=vmbr0`.

## Self-host on Vercel

1. Import this repository in Vercel. Until the patch is on the default branch,
   deploy `cursor/fix-github-trophy-image-c7c6`.
2. Create a token:
   [new token](https://github.com/settings/tokens/new?scopes=public_repo,read:user&description=github-profile-trophy).
3. Set both environment variables to that token:

```properties
GITHUB_TOKEN1=your_token
GITHUB_TOKEN2=your_token
```

4. Set Vercel Authentication to preview deployments only. If production asks
   visitors to log in, GitHub receives an HTML page and the image breaks.
5. Use the deployment URL:

```md
[![trophy](https://YOUR-APP.vercel.app/?username=YOUR_NAME)](https://github.com/vmbr0/github-profile-trophy)
```

Optional Redis settings are in [env-example](env-example). The app works without
Redis.

# Ranks

Ranks are `SSS` `SS` `S` `AAA` `AA` `A` `B` `C` `UNKNOWN` `SECRET`.

| Rank       | Meaning                            |
| ---------- | ---------------------------------- |
| SSS, SS, S | Hard to reach.                     |
| AAA, AA, A | Reachable if you keep at it.       |
| B, C       | In progress.                       |
| UNKNOWN    | Shown as `?`. Nothing counted yet. |
| SECRET     | Hidden until its condition is met. |

The border color follows the rank: gold for S, silver for A, bronze for B,
neutral for C and unknown, and the theme's secret color for secret trophies.

<p align="center">
  <img width="220" src="https://user-images.githubusercontent.com/6661165/91642962-6333e600-ea6a-11ea-83af-e371e996bfa6.png" alt="Parts of a trophy card"/>
</p>

1. Title of what is counted.
2. Current rank, drawn inside the trophy.
3. Rank title.
4. Score.
5. Progress toward the next rank.

# Query parameters

These apply to a self-hosted URL (`https://YOUR-APP.vercel.app/`). Replace
`YOUR_NAME`.

| Parameter  | Default   | What it does                                                            |
| ---------- | --------- | ----------------------------------------------------------------------- |
| `username` | required  | GitHub login.                                                           |
| `theme`    | `default` | Color theme. Names are listed below.                                    |
| `title`    | all       | Comma-separated titles to keep. Prefix a title with `-` to drop it.     |
| `rank`     | all       | Comma-separated ranks to keep. Prefix with `-` to drop. Unknown is `?`. |
| `column`   | `8`       | Max columns. `-1` fits every trophy on one row and ignores `row`.       |
| `row`      | `3`       | Max rows. Extra trophies are hidden.                                    |
| `margin-w` | `0`       | Horizontal gap, in pixels.                                              |
| `margin-h` | `0`       | Vertical gap, in pixels.                                                |
| `no-bg`    | `false`   | `true` makes the card background transparent.                           |
| `no-frame` | `false`   | `true` hides the rank-colored frame.                                    |

Examples:

```text
https://YOUR-APP.vercel.app/?username=YOUR_NAME&theme=onedark
https://YOUR-APP.vercel.app/?username=YOUR_NAME&title=Stars,Followers
https://YOUR-APP.vercel.app/?username=YOUR_NAME&title=-Stars,-Followers
https://YOUR-APP.vercel.app/?username=YOUR_NAME&rank=S,AAA
https://YOUR-APP.vercel.app/?username=YOUR_NAME&rank=-C,-B
https://YOUR-APP.vercel.app/?username=YOUR_NAME&column=3&row=2&margin-w=12&margin-h=12
https://YOUR-APP.vercel.app/?username=YOUR_NAME&no-bg=true&no-frame=true
```

Titles you can filter: `Stars`, `Commits`, `Repositories`, `Followers`,
`Issues`, `PullRequest`, `Reviews`, `Experience`, `MultiLanguage`,
`Organizations`, plus the secret titles when they are unlocked.

## Themes

`default`, `flat`, `onedark`, `gruvbox`, `dracula`, `monokai`, `chalk`, `nord`,
`alduin`, `darkhub`, `juicyfresh`, `buddhism`, `oldie`, `radical`, `onestar`,
`discord`, `algolia`, `gitdimmed`, `tokyonight`, `matrix`, `apprentice`,
`dark_dimmed`, `dark_lover`, `kimbie_dark`, `aura`.

Pass one as `theme` on a self-hosted URL, as the third argument of
`render_svg.ts`, or as the `theme` input of the GitHub Action.

# Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

# License

MIT. Copyright (c) 2020 [ryo-ma](https://github.com/ryo-ma). The patch in this
fork is by [VMBR0](https://github.com/vmbr0). See [LICENSE](./LICENSE).
