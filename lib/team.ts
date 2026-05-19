import { t as translate } from '@/lib/translate';

export type BilingualText = { en: string; ar: string };

export type TeamMemberRecord = {
  id: string;
  name: BilingualText;
  jobTitle: BilingualText;
  bio: BilingualText;
  image: string;
  phone: string;
  email: string;
  linkedin: string;
};

function normalizeBilingual(
  value: unknown,
  fallback = ''
): BilingualText {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = value as { en?: string | null; ar?: string | null };
    return { en: v.en ?? fallback, ar: v.ar ?? fallback };
  }
  const text = typeof value === 'string' ? value : fallback;
  return { en: text, ar: text };
}

export function normalizeTeamMembers(raw: unknown): TeamMemberRecord[] {
  let items: any[] = [];
  if (Array.isArray(raw)) items = raw;
  else if (raw && typeof raw === 'object') items = Object.values(raw as object);

  return items.map((item, index) => ({
    id: String(item.id ?? `team-${index + 1}`),
    name: normalizeBilingual(item.name),
    jobTitle: normalizeBilingual(item.jobTitle ?? item.title),
    bio: normalizeBilingual(item.bio ?? item.text ?? item.description),
    image: item.image ?? '',
    phone: item.phone ?? '',
    email: item.email ?? '',
    linkedin: item.linkedin ?? item.link ?? '',
  }));
}

export function getMemberName(member: TeamMemberRecord, locale: string) {
  const name = translate(member.name, locale);
  if (name) return name;
  return translate(member.jobTitle, locale);
}

export function getMemberJobTitle(member: TeamMemberRecord, locale: string) {
  return translate(member.jobTitle, locale);
}

export function getMemberBio(member: TeamMemberRecord, locale: string) {
  return translate(member.bio, locale);
}

export function formatLinkedInUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed.replace(/^\/+/, '')}`;
}
