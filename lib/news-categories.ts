import { t as translate } from '@/lib/translate';

/** Fallback when API categories are unavailable */
export const NEWS_CATEGORY_OPTIONS: {
  value: string;
  labelEn: string;
  labelAr: string;
}[] = [
  { value: 'real-estate', labelEn: 'Real Estate', labelAr: 'عقارات' },
  { value: 'investment', labelEn: 'Investment', labelAr: 'استثمار' },
  { value: 'projects', labelEn: 'Projects', labelAr: 'مشروعات' },
  { value: 'exhibitions', labelEn: 'Exhibitions', labelAr: 'معارض' },
];

export type NewsCategoryRecord = {
  slug: string;
  name: { en: string; ar: string } | Record<string, string>;
};

export function getNewsCategoryLabel(
  value: string,
  locale: string,
  categories?: NewsCategoryRecord[]
): string {
  const fromApi = categories?.find((c) => c.slug === value);
  if (fromApi) return translate(fromApi.name, locale);

  const opt = NEWS_CATEGORY_OPTIONS.find((o) => o.value === value);
  if (!opt) return value;
  return locale === 'ar' ? opt.labelAr : opt.labelEn;
}

export function buildNewsFilterTabs(
  categories: NewsCategoryRecord[],
  locale: string,
  allLabel: string
) {
  return [
    { value: 'all', label: allLabel },
    ...categories.map((cat) => ({
      value: cat.slug,
      label: translate(cat.name, locale),
    })),
  ];
}
