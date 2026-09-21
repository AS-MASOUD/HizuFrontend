/**
 * Utility to reliably resolve and normalize image URLs across dev, production, and Docker environments.
 */

export function getImageUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "";

  // Normalize Windows backslashes
  const normalized = pathOrUrl.trim().replace(/\\/g, "/");

  // If already absolute or blob/data URL
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("blob:") ||
    normalized.startsWith("data:")
  ) {
    return normalized;
  }

  // Next.js static assets in public/ directory
  if (
    normalized.startsWith("/slideshow/") ||
    normalized.startsWith("/images/") ||
    normalized.startsWith("/fonts/") ||
    normalized.startsWith("/favicon") ||
    normalized.startsWith("/logo.") ||
    normalized.startsWith("/Hizu-logo")
  ) {
    return normalized;
  }

  // Ensure path starts with /
  const cleanPath = normalized.startsWith("/") ? normalized : `/${normalized}`;

  // Get backend host URL (stripping trailing /api or /)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
  const backendBase = apiUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

  // If running in browser and already on same origin or using Next.js proxy
  // We still prepend backendBase if cleanPath is /uploads/... to be 100% reliable across ports
  if (cleanPath.startsWith("/uploads/")) {
    return `${backendBase}${cleanPath}`;
  }

  return `${backendBase}${cleanPath}`;
}
