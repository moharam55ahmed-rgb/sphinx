import type { LegalDocument } from '@/data/legal';
import { legalDocuments } from '@/data/legal';

export const LEGAL_SECTION_KEY = 'legal-document';

export type LegalPageSlug = 'privacy' | 'terms';

export function isLegalPageSlug(slug: string | undefined): slug is LegalPageSlug {
  return slug === 'privacy' || slug === 'terms';
}

export function getDefaultLegalDocument(slug: LegalPageSlug): LegalDocument {
  return structuredClone(legalDocuments[slug]);
}

export function parseLegalDocumentFromPage(
  page: { slug?: string; sections?: any[] } | null | undefined,
  slug: LegalPageSlug
): LegalDocument | null {
  if (!page?.sections?.length) return null;

  const section = page.sections.find(
    (s) => s.sectionKey === LEGAL_SECTION_KEY && s.isActive !== false
  );
  if (!section) return null;

  let raw = section.customData;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      return null;
    }
  }

  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.sections)) {
    return null;
  }

  return {
    slug,
    title: raw.title ?? legalDocuments[slug].title,
    subtitle: raw.subtitle ?? legalDocuments[slug].subtitle,
    lastUpdated: raw.lastUpdated ?? legalDocuments[slug].lastUpdated,
    sections: raw.sections,
  } as LegalDocument;
}

export function resolveLegalDocument(
  page: { slug?: string; sections?: any[] } | null | undefined,
  slug: LegalPageSlug
): LegalDocument {
  return parseLegalDocumentFromPage(page, slug) ?? getDefaultLegalDocument(slug);
}
