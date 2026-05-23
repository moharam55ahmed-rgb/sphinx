/** Public backend origin — set NEXT_PUBLIC_BACK_URL in .env / Vercel */
export function getMediaBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_BACK_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  return apiUrl.replace(/\/api\/?$/, '');
}

/** Strip stored full URLs down to a path (legacy records). */
export function toMediaPath(path: string): string {
  if (!path) return path;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    try {
      return new URL(path).pathname;
    } catch {
      return path;
    }
  }
  return path;
}

/**
 * Browser-ready URL for <img> / next/image.
 * Uploads stay as relative `/uploads/...` so Next.js rewrites proxy to the backend.
 */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  return toMediaPath(path);
}

/** Full URL for copy-to-clipboard, Open Graph, etc. */
export function getAbsoluteMediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  const relative = toMediaPath(path);
  if (relative.startsWith('/')) {
    return `${getMediaBaseUrl()}${relative}`;
  }
  return relative;
}
