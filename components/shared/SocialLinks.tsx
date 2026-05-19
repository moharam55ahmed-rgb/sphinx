'use client';

import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const PLATFORMS: {
  key: string;
  Icon: typeof Facebook;
  label: string;
}[] = [
  { key: 'facebook', Icon: Facebook, label: 'Facebook' },
  { key: 'instagram', Icon: Instagram, label: 'Instagram' },
  { key: 'youtube', Icon: Youtube, label: 'YouTube' },
  { key: 'linkedin', Icon: Linkedin, label: 'LinkedIn' },
  { key: 'twitter', Icon: Twitter, label: 'X (Twitter)' },
];

type SocialLinksProps = {
  links: Record<string, string | undefined>;
  className?: string;
  /** When true, icons align to the visual right (for Arabic) */
  alignEnd?: boolean;
};

export function SocialLinks({ links, className, alignEnd }: SocialLinksProps) {
  const items = PLATFORMS.filter((p) => links[p.key]?.trim());

  if (!items.length) return null;

  return (
    <div
      className={cn('flex flex-wrap gap-3 justify-start', className)}
      dir={alignEnd ? 'rtl' : 'ltr'}
    >
      {items.map(({ key, Icon, label }) => (
        <a
          key={key}
          href={links[key]!}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-primary/20 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
        >
          <Icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
}

/** Build social URLs map from settings + static fallbacks */
export function resolveSocialLinks(
  settingsLinks: unknown,
  staticLinks: Record<string, string>
): Record<string, string> {
  let api: Record<string, string> = {};
  if (settingsLinks && typeof settingsLinks === 'object') {
    api = Object.fromEntries(
      Object.entries(settingsLinks as Record<string, unknown>)
        .map(([k, v]) => [k, typeof v === 'string' ? v : (v as { text?: string })?.text ?? ''])
        .filter(([, url]) => url)
    );
  }
  return {
    facebook: api.facebook || staticLinks.facebook || '',
    instagram: api.instagram || staticLinks.instagram || '',
    youtube: api.youtube || staticLinks.youtube || '',
    linkedin: api.linkedin || staticLinks.linkedin || '',
    twitter: api.twitter || staticLinks.twitter || '',
  };
}
