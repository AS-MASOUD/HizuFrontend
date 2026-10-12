/**
 * Utility to reliably resolve and normalize image URLs across dev, production, and Docker environments.
 */

export function getImageUrl(pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "";

  // Normalize Windows backslashes
  const normalized = pathOrUrl.trim().replace(/\\/g, "/");

  // Intercept any Unsplash or external slow image URLs to prevent network timeouts in Iran
  if (normalized.includes("images.unsplash.com") || normalized.includes("unsplash.com")) {
    const localFallbacks = [
      "/images/workshop-1.jpg",
      "/images/workshop-2.jpg",
      "/images/workshop-3.jpg",
      "/images/workshop-4.jpg",
      "/images/cnc-facility.jpg",
      "/images/product-placeholder.webp",
      "/images/product-placeholder-2.webp",
    ];
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = (hash << 5) - hash + normalized.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % localFallbacks.length;
    return localFallbacks[idx];
  }

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
