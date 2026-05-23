import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { getPageBySlug, getSeoBySlug } from '@/lib/public-api';
import { CompanyPageContent } from './CompanyPageContent';
import { t as translate } from '@/lib/translate';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  let seo: { metaTitle?: unknown; metaDescription?: unknown } | null = null;
  let page: { title?: unknown } | null = null;

  try {
    [seo, page] = await Promise.all([
      getSeoBySlug(`/companies/${slug}`),
      getPageBySlug(slug),
    ]);
  } catch {
    /* optional */
  }

  const isArabic = locale === 'ar';
  const defaultTitle = isArabic ? 'شركة شريكة' : 'Partner Company';

  return {
    title: seo?.metaTitle
      ? translate(seo.metaTitle, locale)
      : page?.title
        ? translate(page.title, locale)
        : defaultTitle,
    description: seo?.metaDescription
      ? translate(seo.metaDescription, locale)
      : undefined,
  };
}

export default async function CompanyPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let page = null;
  try {
    page = await getPageBySlug(slug);
  } catch {
    page = null;
  }

  if (!page) notFound();

  return <CompanyPageContent page={page} />;
}

export const revalidate = 0;
