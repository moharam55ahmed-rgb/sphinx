import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { NewsDetail } from './NewsDetail';
import { news } from '@/data/site';
import { getNews, getNewsBySlug } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const dynamicNews = await getNews();
    if (dynamicNews?.length) {
      return dynamicNews.map((item: { slug: string }) => ({ slug: item.slug }));
    }
  } catch {
    /* fallback */
  }
  return news.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;

  let item: any = null;
  try {
    item = await getNewsBySlug(slug);
  } catch {
    item = news.find((n) => n.slug === slug);
  }

  if (!item) {
    return { title: 'News Not Found' };
  }

  const isArabic = locale === 'ar';
  const title = item.titleAr
    ? isArabic
      ? item.titleAr
      : item.titleEn
    : translate(item.title, locale);
  const description = item.excerptAr
    ? isArabic
      ? item.excerptAr
      : item.excerptEn
    : translate(item.excerpt, locale);

  return {
    title: `${title} | ${isArabic ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
    description,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let item: any = null;
  let related: any[] = [];

  try {
    item = await getNewsBySlug(slug);
    const all = await getNews();
    related = (all || []).filter((n: any) => n.slug !== slug).slice(0, 3);
  } catch {
  }

  if (!item) {
    item = news.find((n) => n.slug === slug);
    related = news.filter((n) => n.slug !== slug).slice(0, 3);
  }

  if (!item) {
    notFound();
  }

  return <NewsDetail item={item} related={related} />;
}
