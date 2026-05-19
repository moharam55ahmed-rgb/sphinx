import { t as translate } from '@/lib/translate';

export type BilingualText = { en: string; ar: string };

export const MAX_RELATED_COMPANIES = 4;

export type RelatedCompanyRecord = {
  id: string;
  name: BilingualText;
  logo: string;
  pageSlug: string;
  sortOrder: number;
};

function normalizeBilingual(value: unknown, fallback = ''): BilingualText {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = value as { en?: string | null; ar?: string | null };
    return { en: v.en ?? fallback, ar: v.ar ?? fallback };
  }
  const text = typeof value === 'string' ? value : fallback;
  return { en: text, ar: text };
}

function extractSlugFromLink(link: unknown): string {
  if (!link || typeof link !== 'string') return '';
  const cleaned = link.trim().replace(/^\//, '');
  if (!cleaned) return '';
  if (cleaned.includes('/')) {
    const parts = cleaned.split('/').filter(Boolean);
    return parts[parts.length - 1] ?? cleaned;
  }
  return cleaned;
}

export function slugifyCompanyName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);
}

/** للمحرّر — يحتفظ بصفوف فارغة أثناء الإضافة */
export function prepareCompaniesForEditor(raw: unknown): RelatedCompanyRecord[] {
  let items: any[] = [];
  if (Array.isArray(raw)) items = raw;
  else if (raw && typeof raw === 'object') items = Object.values(raw as object);

  return items.map((item, index) => ({
    id: String(item.id ?? `company-${index + 1}`),
    name: normalizeBilingual(item.name ?? item.title),
    logo: item.logo ?? item.image ?? '',
    pageSlug: (item.pageSlug ?? item.slug ?? extractSlugFromLink(item.link) ?? '')
      .replace(/^\//, '')
      .replace(/^companies\//, ''),
    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index,
  }));
}

export function normalizeRelatedCompanies(raw: unknown): RelatedCompanyRecord[] {
  let items: any[] = [];
  if (Array.isArray(raw)) items = raw;
  else if (raw && typeof raw === 'object') items = Object.values(raw as object);

  return items
    .map((item, index) => {
      const name = normalizeBilingual(item.name ?? item.title);
      const fallbackSlug = slugifyCompanyName(name.en || name.ar);
      const pageSlug = (
        item.pageSlug ??
        item.slug ??
        extractSlugFromLink(item.link ?? item.buttonUrl) ??
        fallbackSlug
      )
        .replace(/^\//, '')
        .replace(/^companies\//, '');

      return {
        id: String(item.id ?? `company-${index + 1}`),
        name,
        logo: item.logo ?? item.image ?? '',
        pageSlug,
        sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index,
      };
    })
    .filter((item) => {
      const hasName = Boolean(item.name.en?.trim() || item.name.ar?.trim());
      return hasName || item.logo || item.pageSlug;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, MAX_RELATED_COMPANIES);
}

export const DEFAULT_RELATED_COMPANIES: RelatedCompanyRecord[] = [
  {
    id: 'default-1',
    name: { en: 'Partner Company 1', ar: 'شركة شريكة ١' },
    logo: '',
    pageSlug: 'partner-company-1',
    sortOrder: 0,
  },
  {
    id: 'default-2',
    name: { en: 'Partner Company 2', ar: 'شركة شريكة ٢' },
    logo: '',
    pageSlug: 'partner-company-2',
    sortOrder: 1,
  },
  {
    id: 'default-3',
    name: { en: 'Partner Company 3', ar: 'شركة شريكة ٣' },
    logo: '',
    pageSlug: 'partner-company-3',
    sortOrder: 2,
  },
  {
    id: 'default-4',
    name: { en: 'Partner Company 4', ar: 'شركة شريكة ٤' },
    logo: '',
    pageSlug: 'partner-company-4',
    sortOrder: 3,
  },
];

export function parseRelatedCompaniesCustomData(raw: unknown): RelatedCompanyRecord[] {
  let data = raw;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }
  return normalizeRelatedCompanies(data);
}

/** قسم الشركات فقط — مفتاح related-companies (لا نلتقط السلايدر أو repeater آخر) */
export function findRelatedCompaniesSection(
  sections: Array<{ sectionKey?: string; customData?: unknown }>
) {
  if (!sections?.length) return undefined;
  return sections.find((s) => s.sectionKey === 'related-companies');
}

export function getCompanyName(company: RelatedCompanyRecord, locale: string) {
  return translate(company.name, locale);
}

export function companyPagePath(pageSlug: string) {
  const slug = pageSlug.replace(/^\//, '').replace(/^companies\//, '');
  if (!slug) return '#';
  return `/companies/${slug}`;
}

export type PageRecord = { id: string; slug: string; title?: unknown };

/** إنشاء/تحديث صفحات الشركات وربط الـ slug */
export async function syncCompanyPages(
  companies: RelatedCompanyRecord[],
  apiClient: { get: (url: string) => Promise<{ data: { data: PageRecord[] } }>; post: (url: string, body: unknown) => Promise<{ data: { data: PageRecord } }> }
): Promise<RelatedCompanyRecord[]> {
  const pagesRes = await apiClient.get('/pages');
  const pages = pagesRes.data.data ?? [];

  const updated: RelatedCompanyRecord[] = [];

  for (const company of companies) {
    const nameEn = company.name.en?.trim() || company.name.ar?.trim() || 'Company';
    const nameAr = company.name.ar?.trim() || company.name.en?.trim() || 'شركة';
    let slug =
      company.pageSlug?.trim().replace(/^\//, '').replace(/^companies\//, '') ||
      slugifyCompanyName(nameEn) ||
      slugifyCompanyName(nameAr) ||
      `company-${company.id}`;

    let page = pages.find((p) => p.slug === slug);

    if (!page) {
      const created = await apiClient.post('/pages', {
        title: { en: nameEn, ar: nameAr },
        slug,
        status: 'published',
      });
      page = created.data.data;
      pages.push(page);

      await apiClient.post('/sections', {
        pageId: page.id,
        sectionKey: 'company-hero',
        sectionName: 'Company Hero',
        title: { en: nameEn, ar: nameAr },
        subtitle: { en: 'Related Company', ar: 'شركة شريكة' },
        image: company.logo || undefined,
        sortOrder: 1,
        isActive: true,
      });

      await apiClient.post('/sections', {
        pageId: page.id,
        sectionKey: 'company-main',
        sectionName: 'Company Content',
        title: { en: nameEn, ar: nameAr },
        description: {
          en: `Learn more about ${nameEn}.`,
          ar: `تعرف على المزيد عن ${nameAr}.`,
        },
        image: company.logo || undefined,
        sortOrder: 2,
        isActive: true,
      });
    }

    updated.push({ ...company, pageSlug: slug });
  }

  return updated;
}
