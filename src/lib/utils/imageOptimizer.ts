/**
 * Image Optimizer Utility
 * Resizes high-resolution product photos and compresses them to modern WebP format
 * in the browser before upload, drastically reducing file size (from 5-10MB to ~150-250KB)
 * while preserving high fidelity for product galleries.
 */

export interface OptimizeOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function optimizeProductImage(
  file: File,
  options: OptimizeOptions = {}
): Promise<File> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;

  // If already a tiny SVG or small gif, skip compression
  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.max(1, Math.round(width * ratio));
          height = Math.max(1, Math.round(height * ratio));
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          // Fallback if canvas context cannot be created
          resolve(file);
          return;
        }

        // High-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP blob (with automatic fallback to JPEG)
        const tryBlob = (format: string, ext: string, fallback?: () => void) => {
          try {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  if (fallback) fallback();
                  else resolve(file);
                  return;
                }
                const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
                const optimizedFile = new File([blob], `${originalNameWithoutExt}.${ext}`, {
                  type: format,
                  lastModified: Date.now(),
                });
                resolve(optimizedFile);
              },
              format,
              quality
            );
          } catch {
            if (fallback) fallback();
            else resolve(file);
          }
        };

        tryBlob("image/webp", "webp", () => {
          tryBlob("image/jpeg", "jpg", () => resolve(file));
        });
      };

      img.onerror = () => {
        // If image loading fails, return the original file
        resolve(file);
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error("خطا در خواندن فایل تصویری."));
    reader.readAsDataURL(file);
  });
}
