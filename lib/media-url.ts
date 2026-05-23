/** Public backend origin for uploaded files — change domain in .env only */
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

/** Turn a stored path into a browser-ready URL. Uploads use BACK_URL; static /images stay as-is. */
export function resolveMediaUrl(path: string | null | undefined): string {
  if (!path) return '';

  const relative = toMediaPath(path);

  if (relative.startsWith('/uploads/')) {
    return `${getMediaBaseUrl()}${relative}`;
  }

  return relative;
}
