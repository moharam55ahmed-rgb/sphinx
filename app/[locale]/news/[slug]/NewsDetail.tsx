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
import { news, type NewsItem } from '@/data/site';

interface NewsDetailProps {
  item: NewsItem;
}

export function NewsDetail({ item }: NewsDetailProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const otherNews = news.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <>
      <PageHero
        title={isRtl ? item.titleAr : item.titleEn}
        backgroundImage={item.image}
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Date */}
            <AnimatedReveal>
              <div className={cn(
                'flex items-center gap-2 text-muted-foreground mb-8',
                isRtl && 'flex-row-reverse justify-end'
              )}>
                <Calendar className="w-5 h-5" />
                <span>{t('postedOn')}: {item.date}</span>
              </div>
            </AnimatedReveal>

            {/* Featured Image */}
            <AnimatedReveal delay={0.1}>
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
                <Image
                  src={item.image}
                  alt={isRtl ? item.titleAr : item.titleEn}
                  fill
                  className="object-cover"
                />
              </div>
            </AnimatedReveal>

            {/* Content */}
            <AnimatedReveal delay={0.2}>
              <div className={cn('prose prose-invert max-w-none', isRtl && 'text-right')}>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {isRtl ? item.contentAr : item.contentEn}
                </p>
              </div>
            </AnimatedReveal>

            {/* Back Button */}
            <AnimatedReveal delay={0.3}>
              <div className="mt-12">
                <Link href="/news">
                  <Button
                    variant="outline"
                    className={cn(
                      'border-white/20 text-white hover:bg-white/5',
                      isRtl && 'flex-row-reverse'
                    )}
                  >
                    {isRtl ? (
                      <>
                        <ArrowRight className="w-4 h-4 ml-2" />
                        {'العودة للأخبار'}
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {'Back to News'}
                      </>
                    )}
                  </Button>
                </Link>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Related News */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedReveal>
            <SectionHeading title={isRtl ? 'أخبار أخرى' : 'Related News'} />
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherNews.map((newsItem, index) => (
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
                        src={newsItem.image}
                        alt={isRtl ? newsItem.titleAr : newsItem.titleEn}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {isRtl ? newsItem.titleAr : newsItem.titleEn}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {isRtl ? newsItem.excerptAr : newsItem.excerptEn}
                      </p>
                    </div>
                  </motion.article>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
