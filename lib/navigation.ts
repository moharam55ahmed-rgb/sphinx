import { t as translate } from '@/lib/translate';

export type NavLink = {
  href: string;
  label: string | { en?: string; ar?: string };
  dropdown?: NavLink[];
};

function normalizeHref(url: string): string {
  const href = url.startsWith('/') ? url : `/${url}`;
  return href.replace(/\/+$/, '') || '/';
}

export function isGalleryNavPath(href: string): boolean {
  const path = normalizeHref(href);
  return path === '/gallery' || path === '/gallery/photos' || path.startsWith('/gallery/');
}

/** Map API navigation rows to header/footer links with optional dropdowns */
export function mapApiNavigation(
  items: Array<{ url: string; label: unknown; sortOrder?: number }>,
  locale: string,
  options?: {
    projectLinks?: NavLink[];
    galleryDropdown?: NavLink[];
  }
): NavLink[] {
  const sorted = [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  let galleryIncluded = false;

  return sorted
    .filter((item) => {
      const href = normalizeHref(item.url);
      if (!isGalleryNavPath(href)) return true;
      if (galleryIncluded) return false;
      galleryIncluded = true;
      return true;
    })
    .map((item) => {
      let href = normalizeHref(item.url);
      const base: NavLink = {
        href,
        label: item.label as NavLink['label'],
      };

      if (href === '/projects' && options?.projectLinks?.length) {
        return { ...base, dropdown: options.projectLinks };
      }

      if (isGalleryNavPath(href)) {
        href = '/gallery/photos';
        return {
          ...base,
          href,
          ...(options?.galleryDropdown?.length
            ? { dropdown: options.galleryDropdown }
            : {}),
        };
      }

      return base;
    });
}

export function getDefaultHeaderNav(t: (key: string) => string, projectLinks: NavLink[]): NavLink[] {
  return [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    {
      href: '/projects',
      label: t('projects'),
      dropdown: projectLinks.length ? projectLinks : undefined,
    },
    {
      href: '/gallery/photos',
      label: t('gallery'),
      dropdown: [
        { href: '/gallery/photos', label: t('photos') },
        { href: '/gallery/videos', label: t('videos') },
      ],
    },
    { href: '/news', label: t('news') },
    { href: '/team', label: t('team') },
    { href: '/careers', label: t('careers') },
    { href: '/contact', label: t('contact') },
  ];
}

export function getDefaultFooterNav(t: (key: string) => string): NavLink[] {
  return [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/news', label: t('news') },
    { href: '/careers', label: t('careers') },
    { href: '/contact', label: t('contact') },
  ];
}

export function navLabel(item: NavLink, locale: string): string {
  if (typeof item.label === 'string') return item.label;
  return translate(item.label, locale);
}

/** YouTube watch/share URL → embed URL */
export function toYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  if (url.includes('/embed/')) return url;
  const idMatch =
    url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/) ||
    url.match(/^([a-zA-Z0-9_-]{11})$/);
  const id = idMatch?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
