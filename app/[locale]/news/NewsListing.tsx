'use client';

import { useState } from 'react';
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
import { news } from '@/data/site';

export function NewsListing() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = useTranslations('sections');
  const tCategories = useTranslations('newsCategories');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const categories = [
    { value: 'all', label: isRtl ? 'الكل' : 'All' },
    { value: 'real-estate', label: tCategories('realEstate') },
    { value: 'investment', label: tCategories('investment') },
    { value: 'projects', label: tCategories('projects') },
    { value: 'exhibitions', label: tCategories('exhibitions') },
  ];

  const filteredNews = news.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const title = isRtl ? item.titleAr : item.titleEn;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <PageHero
        title={t('latestNews')}
        backgroundImage="/images/hero/hero-4.jpg"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <AnimatedReveal>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
              {/* Category Filters (First in RTL = Right) */}
              <Tabs
                value={activeCategory}
                onValueChange={setActiveCategory}
                className="w-auto"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <TabsList className="bg-secondary/50 p-1 flex-wrap h-auto">
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat.value}
                      value={cat.value}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 text-sm"
                    >
                      {cat.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Search (Second in RTL = Left) */}
              <div className="relative w-full md:w-80">
                <Search className={cn(
                  'absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground',
                  isRtl ? 'right-3' : 'left-3'
                )} />
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

          {/* News Grid */}
          {filteredNews.length > 0 ? (
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
