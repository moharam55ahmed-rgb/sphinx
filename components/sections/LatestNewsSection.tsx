'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';
import { news } from '@/data/site';

export function LatestNewsSection() {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const latestNews = news.slice(0, 6);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <AnimatedReveal>
          <div className="flex items-center justify-between mb-12">
            <SectionHeading title={t('latestNews')} centered={false} className="mb-0" />
            <Link href="/news">
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 gap-2"
              >
                {isRtl ? (
                  <ArrowLeft className="w-4 h-4 ml-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 mr-2" />
                )}
                {tCommon('viewAll')}
              </Button>
            </Link>
          </div>
        </AnimatedReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestNews.map((item, index) => (
            <AnimatedReveal key={item.id} delay={index * 0.1}>
              <Link href={`/news/${item.slug}`}>
                <motion.article
                  whileHover={{ y: -8 }}
                  className={cn(
                    'group glass-card rounded-2xl overflow-hidden h-full',
                    isRtl && 'text-right'
                  )}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={isRtl ? item.titleAr : item.titleEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{item.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {isRtl ? item.titleAr : item.titleEn}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {isRtl ? item.excerptAr : item.excerptEn}
                    </p>
                  </div>
                </motion.article>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
