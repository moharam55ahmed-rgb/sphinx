import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { NewsDetail } from './NewsDetail';
import { news } from '@/data/site';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return news.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const item = news.find((n) => n.slug === slug);

  if (!item) {
    return { title: 'News Not Found' };
  }

  const isArabic = locale === 'ar';

  return {
    title: `${isArabic ? item.titleAr : item.titleEn} | ${isArabic ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
    description: isArabic ? item.excerptAr : item.excerptEn,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = news.find((n) => n.slug === slug);

  if (!item) {
    notFound();
  }

  return <NewsDetail item={item} />;
}
