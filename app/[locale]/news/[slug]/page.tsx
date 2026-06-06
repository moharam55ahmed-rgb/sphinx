import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { NewsDetail } from './NewsDetail';
import { getNews, getNewsBySlug } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const items = await getNews();
    return (items || []).map((item: { slug: string }) => ({ slug: item.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return { title: 'News Not Found' };
  }

  const title = translate(item.title, locale);
  const description = translate(item.excerpt, locale);

  return {
    title: `${title} | ${locale === 'ar' ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
    description,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const item = await getNewsBySlug(slug);
  if (!item) {
    notFound();
  }

  let related: any[] = [];
  try {
    const all = await getNews();
    related = (all || []).filter((n: any) => n.slug !== slug).slice(0, 3);
  } catch {
    related = [];
  }

  return <NewsDetail item={item} related={related} />;
}
