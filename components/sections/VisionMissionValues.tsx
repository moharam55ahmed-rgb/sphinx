'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Eye, Target, Heart } from 'lucide-react';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';

export function VisionMissionValues({ data }: { data?: any }) {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const defaultIcons = [Eye, Target, Heart];

  const cards = data?.customData && Array.isArray(data.customData) && data.customData.length > 0
    ? data.customData.map((item: any, i: number) => ({
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


  return (
    <section className="py-24 bg-background">
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
  );
}
