import { CacheManager } from "./cache_manager.ts";
import { StaticRegenerationOptions } from "./types.ts";
import { getUrl, hashString, readCache } from "./utils.ts";

export async function staticRenderRegeneration(
  request: Request,
  options: StaticRegenerationOptions,
  render: (request: Request) => Promise<Response>,
) {
  // avoid TypeError: Invalid URL at deno:core
  const url = getUrl(request);

  // if more conditions are added, make sure to create a variable to skipCache
  if (url.pathname === "/favicon.ico") {
    return await render(request);
  }

  const cacheFile = await hashString(url.pathname + (url.search ?? ""));
  const cacheManager = new CacheManager(options.revalidate ?? 0, cacheFile);
  if (cacheManager.isCacheValid) {
    const cache = readCache(cacheManager.cacheFilePath);
    if (cache !== null) {
      return new Response(cache, {
        headers: options.headers ?? new Headers({}),
      });
    }
  }

  const response = await render(request);

  // Error cards are HTTP 200 so GitHub's image proxy will render them, but
  // they must not be stored: a missing token or a rate limit would otherwise
  // stick for the whole revalidate window.
  const skipCache = response.headers.get("x-trophy-no-cache") === "1";
  if (skipCache) {
    response.headers.delete("x-trophy-no-cache");
  } else if (response.status >= 200 && response.status < 300) {
    void cacheManager.save(response);
  }

  return response;
}
