import { setRequestLocale } from 'next-intl/server';
import { AboutContent } from './AboutContent';
import { getPageBySlug, getSeoBySlug } from '@/lib/public-api';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  
  let seo: any = null;
  try {
    seo = await getSeoBySlug('/about');
  } catch (err) {}

  const isArabic = locale === 'ar';

  return {
    title: seo?.metaTitle || (isArabic ? 'من نحن | سفنكس للتطوير العقاري' : 'About Us | SPHINX Real Estate'),
    description: seo?.metaDescription,
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let pageData: any = null;
  try {
    pageData = await getPageBySlug('about');
  } catch (err) {}

  return <AboutContent data={pageData} />;
}

export const revalidate = 0;
