import { setRequestLocale } from 'next-intl/server';
import { ContactContent } from './ContactContent';
import { getPageBySlug, getSeoBySlug } from '@/lib/public-api';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  
  let seo: any = null;
  try {
    seo = await getSeoBySlug('/contact');
  } catch (err) {}

  const isArabic = locale === 'ar';

  return {
    title: seo?.metaTitle || (isArabic ? 'اتصل بنا | سفنكس للتطوير العقاري' : 'Contact Us | SPHINX Real Estate'),
    description: seo?.metaDescription || (isArabic
      ? 'تواصل معنا للاستفسار عن مشاريعنا والفرص الاستثمارية المتاحة'
      : 'Contact us to inquire about our projects and available investment opportunities'),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let pageData: Awaited<ReturnType<typeof getPageBySlug>> | null = null;
  try {
    pageData = await getPageBySlug('contact');
  } catch {
    pageData = null;
  }

  return <ContactContent pageData={pageData} />;
}
