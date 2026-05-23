'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Eye, Target, Heart } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { StatsSection } from '@/components/shared/StatsSection';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { findSection, getSectionHeroImage } from '@/lib/section-media';

export function AboutContent({ data }: { data?: any }) {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const sections = data?.sections || [];
  const getSection = (key: string) => findSection(sections, key);

  const vmvData = getSection('about-vmv');
  const defaultIcons = [Eye, Target, Heart];
  const cards = vmvData?.customData && Array.isArray(vmvData.customData) && vmvData.customData.length > 0
    ? vmvData.customData.map((item: any, i: number) => ({
        icon: defaultIcons[i] || Target,
        title: item.title,
        description: item.text || item.description,
      }))
    : [
        {
          icon: Eye,
          title: t('vision'),
          description: t('visionDesc'),
        },
        {
          icon: Target,
          title: t('mission'),
          description: t('missionDesc'),
        },
        {
          icon: Heart,
          title: t('values'),
          description: ((t.raw('valuesItems') as unknown[]) || [])
            .map((item) => translate(item, locale))
            .join(' • '),
        },
      ];

  const mainContent = getSection('about-main');
  const heroImage =
    getSectionHeroImage(mainContent) || '/images/hero/hero-1.jpg';

  return (
    <>
      <PageHero
        title={data?.title || t('aboutUs')}
        backgroundImage={heroImage}
      />

      {/* Main About Content */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className={cn('max-w-4xl mx-auto', isRtl && 'text-right')}>
            <AnimatedReveal>
              <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4">
                {mainContent?.subtitle
                  ? translate(mainContent.subtitle, locale)
                  : t('aboutUs')}
              </span>
            </AnimatedReveal>

            <AnimatedReveal delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 text-balance">
                {mainContent?.title
                  ? translate(mainContent.title, locale)
                  : t('aboutTitle')}
              </h2>
            </AnimatedReveal>

            <AnimatedReveal delay={0.2}>
              <div className="text-lg text-muted-foreground leading-relaxed mb-8 whitespace-pre-wrap">
                {mainContent?.description
                  ? translate(mainContent.description, locale)
                  : t('aboutLong')}
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cards.map((card, index) => (
              <AnimatedReveal key={index} delay={index * 0.15}>
                <div
                  className={cn(
                    'glass-card rounded-2xl p-8 h-full transition-all duration-300 hover:border-primary/30',
                    isRtl && 'text-right'
                  )}
                >
                  <div className={cn(
                    'w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6',
                    isRtl && 'mr-0 ml-auto'
                  )}>
                    <card.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-4">
                    {translate(card.title, locale)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {translate(card.description, locale)}
                  </p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      <StatsSection data={getSection('about-stats')} />
      <CTASection data={getSection('about-cta')} />
    </>
  );
}
