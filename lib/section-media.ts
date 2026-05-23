export type CmsSection = {
  sectionKey?: string;
  image?: string | null;
  backgroundImage?: string | null;
  title?: unknown;
  subtitle?: unknown;
  description?: unknown;
  customData?: unknown;
  isActive?: boolean;
  [key: string]: unknown;
};

export function findSection(
  sections: CmsSection[] | undefined,
  key: string
): CmsSection | undefined {
  return sections?.find((s) => s.sectionKey === key);
}

/** Header/hero image from a CMS section — backgroundImage wins over image. */
export function getSectionHeroImage(section?: CmsSection | null): string | undefined {
  if (!section) return undefined;
  const image = section.backgroundImage || section.image;
  return typeof image === 'string' && image.trim() ? image : undefined;
}

/** First section on a page that defines a hero/header image. */
export function findPageHeroSection(sections?: CmsSection[]): CmsSection | undefined {
  if (!sections?.length) return undefined;
  return sections.find((s) => getSectionHeroImage(s));
}
