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
    seo = await getSeoBySlug('/privacy');
  } catch {
    /* use defaults */
  }

  const doc = await loadPrivacyDocument();

  return {
    title:
      (seo?.metaTitle && translate(seo.metaTitle, locale)) ||
      `${translate(doc.title, locale)} | SPHINX`,
    description:
      (seo?.metaDescription && translate(seo.metaDescription, locale)) ||
      translate(doc.subtitle, locale),
  };
}

async function loadPrivacyDocument() {
  try {
    const page = await getPageBySlug('privacy');
    return resolveLegalDocument(page, 'privacy');
  } catch {
    return resolveLegalDocument(null, 'privacy');
  }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const document = await loadPrivacyDocument();

  return <LegalPageContent document={document} />;
}
