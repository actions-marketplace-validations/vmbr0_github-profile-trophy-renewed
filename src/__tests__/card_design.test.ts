import { assertEquals, assertStringIncludes } from "../../deps.ts";
import { getNextRankBar, rankAccent } from "../icons.ts";
import { COLORS } from "../theme.ts";
import { RANK } from "../utils.ts";

Deno.test("rankAccent uses the medal color and does not treat SECRET as S", () => {
  const theme = COLORS.default;
  assertEquals(rankAccent(theme, RANK.SECRET), theme.SECRET_RANK_2);
  assertEquals(rankAccent(theme, RANK.SSS), theme.S_RANK_BASE);
  assertEquals(rankAccent(theme, RANK.AA), theme.A_RANK_BASE);
  assertEquals(rankAccent(theme, RANK.B), theme.B_RANK_BASE);
  assertEquals(rankAccent(theme, RANK.C), theme.DEFAULT_RANK_BASE);
});

Deno.test("progress bar has a real width so it still shows without CSS", () => {
  const bar = getNextRankBar("Stars", 0.5, "#0366d6", 115);

  assertStringIncludes(bar, 'width="43.5"');
  assertStringIncludes(bar, 'width="87"');
  assertStringIncludes(bar, 'rx="2.5"');
});

Deno.test("progress bar clamps out of range percentages", () => {
  const empty = getNextRankBar("Commits", -1, "#0366d6", 110);
  const full = getNextRankBar("Commits", 4, "#0366d6", 110);

  assertStringIncludes(empty, 'width="0"');
  assertStringIncludes(full, 'width="82"');
});
