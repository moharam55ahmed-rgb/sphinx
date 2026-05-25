/**
 * Browser: same-origin `/api/proxy` (Next rewrite → no CORS).
 * Server: direct upstream URL from API_UPSTREAM_URL.
 */
export function getApiBaseUrl(): string {
  const upstream =
    process.env.API_UPSTREAM_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000/api';

  if (typeof window !== 'undefined') {
    return '/api/proxy';
  }

  const base = upstream.replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

export function getApiUpstreamOrigin(): string {
  const url =
    process.env.API_UPSTREAM_URL ||
    process.env.NEXT_PUBLIC_BACK_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
    'http://localhost:5000';
  return url.replace(/\/$/, '');
}
