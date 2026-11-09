// Parent directory of a file path, or null when the file is written in the
// current directory. "trophy.svg" must not be treated as a directory name:
// Deno.mkdir("trophy.svg") then makes writeTextFile fail.
export function outputDirectory(outputPath: string): string | null {
  const normalized = outputPath.replaceAll("\\", "/");
  const slash = normalized.lastIndexOf("/");
  if (slash < 0) return null;
  const dir = normalized.slice(0, slash);
  if (dir === "" || dir === ".") return null;
  return dir;
}
