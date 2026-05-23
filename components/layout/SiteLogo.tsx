'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media-url';

export const DEFAULT_SITE_LOGO = '/images/sphinx-logo-final.png';

type SiteLogoProps = {
  logoUrl?: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
};

export function resolveSiteLogoUrl(logo: unknown): string | null {
  if (!logo) return null;
  if (typeof logo === 'string' && logo.trim()) return resolveMediaUrl(logo);
  if (typeof logo === 'object' && logo !== null && 'url' in logo) {
    const url = (logo as { url?: unknown }).url;
    return typeof url === 'string' && url.trim() ? resolveMediaUrl(url) : null;
  }
  return null;
}

export function SiteLogo({
  logoUrl,
  alt,
  width = 200,
  height = 56,
  className,
  priority,
}: SiteLogoProps) {
  const src = logoUrl ? resolveMediaUrl(logoUrl) : DEFAULT_SITE_LOGO;

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={cn(
        'w-auto object-contain object-left mix-blend-multiply invert dark:mix-blend-screen dark:invert-0',
        className
      )}
      priority={priority}
      unoptimized
    />
  );
}
