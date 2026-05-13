'use client';

import { useLocale, useTranslations } from 'next-intl';
import { MapPin, Building2, Award, Wallet, Ruler, Users } from 'lucide-react';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';

const icons = [MapPin, Building2, Award, Wallet, Ruler, Users];

export function WhyInvestSection() {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const items = t.raw('whyInvestItems') as string[];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <AnimatedReveal>
          <SectionHeading title={t('whyInvest')} />
        </AnimatedReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <AnimatedReveal key={index} delay={index * 0.1}>
                <div
                  className={cn(
                    'group p-6 rounded-2xl bg-card/50 border border-white/5 hover:border-primary/30 transition-all duration-300',
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
