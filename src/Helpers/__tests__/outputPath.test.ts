import { assertEquals } from "../../../deps.ts";
import { outputDirectory } from "../outputPath.ts";

Deno.test("outputDirectory ignores a bare filename", () => {
  assertEquals(outputDirectory("trophy.svg"), null);
  assertEquals(outputDirectory("./trophy.svg"), null);
});

Deno.test("outputDirectory returns the parent of a nested path", () => {
  assertEquals(outputDirectory("profile/trophy.svg"), "profile");
  assertEquals(outputDirectory("a/b/trophy.svg"), "a/b");
  assertEquals(outputDirectory("/tmp/trophy.svg"), "/tmp");
});
