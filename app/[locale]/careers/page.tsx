import { setRequestLocale, getTranslations } from 'next-intl/server';
import { CareersContent } from './CareersContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections' });

  return {
    title: `${t('careersTitle')} | ${locale === 'ar' ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
  };
}

export default async function CareersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CareersContent />;
}
