'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { cn } from '@/lib/utils';

export function AboutPreview() {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className={cn(
          'max-w-4xl mx-auto text-center',
          isRtl && 'text-center'
        )}>
          <AnimatedReveal>
            <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4">
              {t('aboutUs')}
            </span>
          </AnimatedReveal>
          
          <AnimatedReveal delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
              {t('aboutTitle')}
            </h2>
          </AnimatedReveal>
          
          <AnimatedReveal delay={0.2}>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 text-pretty">
              {t('aboutDesc')}
            </p>
          </AnimatedReveal>
          
          <AnimatedReveal delay={0.3}>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                {tCta('learnMore')}
              </Button>
            </Link>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
