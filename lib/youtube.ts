/** Extract YouTube video id from full/partial URLs or raw id */
export function extractYoutubeId(input: string): string | null {
  const raw = (input || '').trim();
  if (!raw) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  const normalized = raw.startsWith('http') ? raw : `https://${raw.replace(/^\/+/, '')}`;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/watch\?.*&v=)([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /(?:^|\/)be\/([a-zA-Z0-9_-]{11})/,
    /(?:^|\/)watch\?v=([a-zA-Z0-9_-]{11})/,
  ];

  for (const re of patterns) {
    const m = normalized.match(re) || raw.match(re);
    if (m?.[1]) return m[1];
  }

  return null;
}

export function normalizeYoutubeWatchUrl(input: string): string {
  const id = extractYoutubeId(input);
  return id ? `https://www.youtube.com/watch?v=${id}` : (input || '').trim();
}

export function toYoutubeEmbedUrl(input: string): string | null {
  const id = extractYoutubeId(input);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/** Prefer videoUrl; fall back to buttonUrl when it looks like YouTube */
export function resolveSectionVideoUrl(
  videoUrl?: string,
  buttonUrl?: string
): string {
  const v = (videoUrl || '').trim();
  if (v && extractYoutubeId(v)) return normalizeYoutubeWatchUrl(v);

  const b = (buttonUrl || '').trim();
  if (b && extractYoutubeId(b)) return normalizeYoutubeWatchUrl(b);

  return v || '';
}
