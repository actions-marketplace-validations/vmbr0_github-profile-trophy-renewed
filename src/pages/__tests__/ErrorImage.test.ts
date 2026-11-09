import { assertEquals, assertStringIncludes } from "../../../deps.ts";
import { EServiceKindError, ServiceError } from "../../Types/index.ts";
import { errorSvg, renderErrorImage } from "../ErrorImage.ts";

Deno.test("errorSvg escapes markup so the card stays a valid image", () => {
  const svg = errorSvg(`<script>"&'</script>`);

  assertEquals(svg.includes("<script>"), false);
  assertStringIncludes(svg, "&lt;script&gt;&quot;&amp;&apos;&lt;/script&gt;");
  assertStringIncludes(svg, `xmlns="http://www.w3.org/2000/svg"`);
});

Deno.test("renderErrorImage explains the failure GitHub would otherwise hide", () => {
  const svg = renderErrorImage(
    new ServiceError("nope", EServiceKindError.NOT_FOUND),
  );

  assertStringIncludes(svg, "User not found");
  assertEquals(svg.startsWith("<svg "), true);
});

Deno.test("renderErrorImage keeps rate-limit and upstream messages distinct", () => {
  const rateLimit = renderErrorImage(
    new ServiceError("slow down", EServiceKindError.RATE_LIMIT),
  );
  const upstream = renderErrorImage(
    new ServiceError("boom", EServiceKindError.UPSTREAM),
  );

  assertStringIncludes(rateLimit, "rate limit");
  assertStringIncludes(upstream, "unexpected response");
  assertEquals(rateLimit.includes("slow down"), false);
  assertEquals(upstream.includes("boom"), false);
});
