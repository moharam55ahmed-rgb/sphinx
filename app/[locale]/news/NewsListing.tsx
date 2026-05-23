'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Calendar, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { news as staticNews } from '@/data/site';
import { getNews, getNewsCategories, getPageBySlug } from '@/lib/public-api';
import { getBannerImage } from '@/lib/page-banners';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';
import {
  buildNewsFilterTabs,
  getNewsCategoryLabel,
  NEWS_CATEGORY_OPTIONS,
} from '@/lib/news-categories';
import { Badge } from '@/components/ui/badge';

type NewsListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
};

function normalizeNewsItem(item: any, locale: string): NewsListItem {
  if (item.titleAr || item.titleEn) {
    return {
      id: item.id,
      slug: item.slug,
      title: locale === 'ar' ? item.titleAr : item.titleEn,
      excerpt: locale === 'ar' ? item.excerptAr : item.excerptEn,
      image: item.image ? resolveMediaUrl(item.image) : item.image,
      date: item.date,
      category: item.category,
    };
  }
  const published = item.publishedAt
    ? new Date(item.publishedAt).toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US')
    : '';
  return {
    id: item.id,
    slug: item.slug,
    title: translate(item.title, locale),
    excerpt: translate(item.excerpt || item.shortDescription, locale),
    image: resolveMediaUrl(item.mainImage || '/images/news/news-1.jpg'),
    date: published,
    category: item.category,
  };
}

export function NewsListing() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsItems, setNewsItems] = useState<NewsListItem[]>([]);
  const [categoryRecords, setCategoryRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState('/images/hero/hero-4.jpg');
  const t = useTranslations('sections');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const [data, page] = await Promise.all([
          getNews(),
          getPageBySlug('news'),
        ]);
        const hero = getBannerImage(page?.sections, 'news-hero');
        if (hero) setHeroImage(hero);
        if (data?.length) {
          setNewsItems(data.map((item: any) => normalizeNewsItem(item, locale)));
        } else {
          setNewsItems(staticNews.map((item) => normalizeNewsItem(item, locale)));
        }
      } catch {
        setNewsItems(staticNews.map((item) => normalizeNewsItem(item, locale)));
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, [locale]);

  useEffect(() => {
    getNewsCategories()
      .then((data) => setCategoryRecords(data || []))
      .catch(() => setCategoryRecords([]));
  }, []);

  const categories =
    categoryRecords.length > 0
      ? buildNewsFilterTabs(
          categoryRecords,
          locale,
          isRtl ? 'الكل' : 'All'
        )
      : [
          { value: 'all', label: isRtl ? 'الكل' : 'All' },
          ...NEWS_CATEGORY_OPTIONS.map((opt) => ({
            value: opt.value,
            label: isRtl ? opt.labelAr : opt.labelEn,
          })),
        ];

  const filteredNews = newsItems.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHero title={t('latestNews')} backgroundImage={heroImage} />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedReveal>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-auto"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <TabsList className="bg-muted border border-border rounded-full p-1.5 flex-wrap h-auto gap-0.5 shadow-sm">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat.value}
                      value={cat.value}
                      className="rounded-full px-5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-transparent data-[state=active]:shadow-none"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="relative w-full md:w-80">
                <Search
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground',
                    isRtl ? 'right-3' : 'left-3'
                  )}
                />
                <Input
                  type="text"
                  placeholder={tCommon('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    'bg-secondary/50 border-border',
                    isRtl ? 'pr-10' : 'pl-10'
                  )}
                />
              </div>
            </div>
          </AnimatedReveal>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item, index) => (
                <AnimatedReveal key={item.id} delay={index * 0.05}>
                  <Link href={`/news/${item.slug}`}>
                    <motion.article
                      whileHover={{ y: -8 }}
                      className={cn(
                        'group glass-card rounded-2xl overflow-hidden h-full',
                        isRtl && 'text-right'
                      )}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-2 flex-wrap text-muted-foreground text-sm mb-3">
                          {item.category && (
                            <Badge variant="secondary" className="text-xs">
                              {getNewsCategoryLabel(item.category, locale, categoryRecords)}
                            </Badge>
                          )}
                          <Calendar className="w-4 h-4" />
                          <span>{item.date}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {item.excerpt}
                        </p>
                      </div>
                    </motion.article>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{tCommon('noResults')}</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}
