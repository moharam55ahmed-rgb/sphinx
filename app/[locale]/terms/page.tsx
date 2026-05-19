import { setRequestLocale } from 'next-intl/server';
import { LegalPageContent } from '@/components/legal/LegalPageContent';
import { getPageBySlug, getSeoBySlug } from '@/lib/public-api';
import { resolveLegalDocument } from '@/lib/legal-cms';
import { t as translate } from '@/lib/translate';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;

  let seo: { metaTitle?: unknown; metaDescription?: unknown } | null = null;
  try {
    seo = await getSeoBySlug('/terms');
  } catch {
    /* use defaults */
  }

  const doc = await loadTermsDocument();

  return {
    title:
      (seo?.metaTitle && translate(seo.metaTitle, locale)) ||
      `${translate(doc.title, locale)} | SPHINX`,
    description:
      (seo?.metaDescription && translate(seo.metaDescription, locale)) ||
      translate(doc.subtitle, locale),
  };
}

async function loadTermsDocument() {
  try {
    const page = await getPageBySlug('terms');
    return resolveLegalDocument(page, 'terms');
  } catch {
    return resolveLegalDocument(null, 'terms');
  }
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const document = await loadTermsDocument();

  return <LegalPageContent document={document} />;
}
