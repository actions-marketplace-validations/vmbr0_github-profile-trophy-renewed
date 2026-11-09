import { EServiceKindError, ServiceError } from "../Types/index.ts";

// Fixed copy so a GraphQL error cannot inject markup into the SVG.
function messageFor(error: ServiceError): string {
  switch (error.cause) {
    case EServiceKindError.RATE_LIMIT:
      return "GitHub API rate limit reached. Try again in a few minutes.";
    case EServiceKindError.NOT_FOUND:
      return "User not found. Check the username and the server token.";
    case EServiceKindError.UPSTREAM:
      return "GitHub returned an unexpected response.";
    default:
      return "Could not render trophies.";
  }
}

export function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function errorSvg(message: string): string {
  const text = escapeXml(message);
  const width = 560;
  const height = 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${text}">
  <rect width="100%" height="100%" rx="8" fill="#0d1117" stroke="#30363d"/>
  <text x="24" y="46" fill="#f0f6fc" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="16" font-weight="600">GitHub Profile Trophy</text>
  <text x="24" y="78" fill="#8b949e" font-family="Segoe UI, Ubuntu, Sans-Serif" font-size="14">${text}</text>
</svg>`;
}

export function renderErrorImage(error: ServiceError): string {
  return errorSvg(messageFor(error));
}
