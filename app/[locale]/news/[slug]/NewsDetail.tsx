'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

export interface NewsDetailItem {
  id: string;
  slug: string;
  title?: any;
  excerpt?: any;
  content?: any;
  mainImage?: string;
  image?: string;
  publishedAt?: string;
  date?: string;
  titleAr?: string;
  titleEn?: string;
  excerptAr?: string;
  excerptEn?: string;
  contentAr?: string;
  contentEn?: string;
}

interface NewsDetailProps {
  item: NewsDetailItem;
  related?: NewsDetailItem[];
}

function getTitle(item: NewsDetailItem, locale: string) {
  if (item.titleAr || item.titleEn) {
    return locale === 'ar' ? item.titleAr! : item.titleEn!;
  }
  return translate(item.title, locale);
}

function getExcerpt(item: NewsDetailItem, locale: string) {
  if (item.excerptAr || item.excerptEn) {
    return locale === 'ar' ? item.excerptAr! : item.excerptEn!;
  }
  return translate(item.excerpt, locale);
}

function getContent(item: NewsDetailItem, locale: string) {
  if (item.contentAr || item.contentEn) {
    return locale === 'ar' ? item.contentAr! : item.contentEn!;
  }
  return translate(item.content, locale);
}

function getImage(item: NewsDetailItem) {
  return resolveMediaUrl(item.mainImage || item.image || '/images/news/news-1.jpg');
}

function getDate(item: NewsDetailItem, locale: string) {
  if (item.date) return item.date;
  if (item.publishedAt) {
    return new Date(item.publishedAt).toLocaleDateString(
      locale === 'ar' ? 'ar-EG' : 'en-US'
    );
  }
  return '';
}

export function NewsDetail({ item, related = [] }: NewsDetailProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const title = getTitle(item, locale);
  const content = getContent(item, locale);
  const image = getImage(item);
  const date = getDate(item, locale);

  return (
    <>
      <PageHero title={title} backgroundImage={image} />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <AnimatedReveal>
              <div
                className={cn(
                  'flex items-center gap-2 text-muted-foreground mb-8',
                  isRtl && 'flex-row-reverse justify-end'
                )}
              >
                <Calendar className="w-5 h-5" />
                <span>
                  {t('postedOn')}: {date}
                </span>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.1}>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <Image src={image} alt={title} fill className="object-cover" />
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.2}>
              <div className={cn('prose dark:prose-invert max-w-none', isRtl && 'text-right')}>
                <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {content}
                </p>
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.3}>
              <div className="mt-12">
                <Link href="/news">
                  <Button
                    variant="outline"
                    className={cn(
                      'border-border text-foreground hover:bg-muted',
                      isRtl && 'flex-row-reverse'
                    )}
                  >
                    {isRtl ? (
                      <>
                        <ArrowRight className="w-4 h-4 ml-2" />
                        العودة للأخبار
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to News
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <AnimatedReveal>
              <SectionHeading title={isRtl ? 'أخبار أخرى' : 'Related News'} />
            </AnimatedReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((newsItem, index) => (
                <AnimatedReveal key={newsItem.id} delay={index * 0.1}>
                  <Link href={`/news/${newsItem.slug}`}>
                    <motion.article
                      whileHover={{ y: -8 }}
                      className={cn(
                        'group glass-card rounded-2xl overflow-hidden h-full',
                        isRtl && 'text-right'
                      )}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={getImage(newsItem)}
                          alt={getTitle(newsItem, locale)}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {getTitle(newsItem, locale)}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2">
                          {getExcerpt(newsItem, locale)}
                        </p>
                      </div>
                    </motion.article>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
