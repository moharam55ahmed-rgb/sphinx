'use client';

import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Building2, Award, Wallet, Ruler, Users } from 'lucide-react';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';

const icons = [MapPin, Building2, Award, Wallet, Ruler, Users];

export function WhyInvestSection({ data }: { data?: any }) {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const staticItems = (t.raw('whyInvestItems') as unknown[]) || [];
  const items =
    data?.customData?.length > 0
      ? data.customData.map((item: any) =>
          translate(item.title || item.text || item.label || item, locale)
        )
      : staticItems.map((item) => translate(item, locale));

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedReveal>
          <SectionHeading
            title={data?.title ? translate(data.title, locale) : t('whyInvest')}
            description={
              data?.subtitle || data?.description
                ? translate(data.subtitle || data.description, locale)
                : undefined
            }
          />
        </AnimatedReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <AnimatedReveal key={index} delay={index * 0.1}>
                <div
                  className={cn(
                    'group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 shadow-sm',
                    isRtl && 'text-right'
                  )}
                >
                  {/*
                    icon (first) + text (second).
                    dir=rtl makes icon appear on RIGHT automatically. ✓
                  */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">{item}</h3>
                  </div>
                </div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
