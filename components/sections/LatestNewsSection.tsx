'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';
import { getNews } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

export function LatestNewsSection({ data }: { data?: any }) {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [dynamicNews, setDynamicNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getNews({ limit: 3 });
        setDynamicNews(res);
      } catch(err) {
        console.error("Failed to fetch news", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const displayNews =
    dynamicNews.length > 0 ? dynamicNews : data?.items ?? [];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <AnimatedReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <SectionHeading
              label={t('news')}
              title={translate(data?.title, locale) || t('newsTitle')}
              centered={false}
              className="mb-0"
            />
            <Link href="/news" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full">
                {tCta('viewAllNews')}
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Button>
            </Link>
          </div>
        </AnimatedReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayNews.map((item: any, index: number) => {
            const title = translate(item.title, locale);
            const excerpt = translate(item.excerpt, locale);
            const date = item.publishedAt ? new Date(item.publishedAt).toLocaleDateString(locale) : item.date;

            return (
              <AnimatedReveal key={item.id || index} delay={index * 0.1}>
                <Link href={`/news/${item.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={resolveMediaUrl(item.mainImage || item.image || '/images/placeholder.jpg')}
                        alt={title || ''}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className={cn(
                        "absolute top-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full",
                        isRtl ? "left-4" : "right-4"
                      )}>
                        {date}
                      </div>
                    </div>
                    <div className={cn('p-6 flex flex-col flex-1', isRtl ? 'text-right' : 'text-left')}>
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 mb-6">
                        {excerpt}
                      </p>
                      <p
                        className={cn(
                          'mt-auto pt-4 border-t border-border flex items-center gap-2 text-primary font-medium text-sm w-fit',
                          isRtl ? 'me-auto' : 'ms-auto'
                        )}
                      >
                        {tCta('readMore')}
                        {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
