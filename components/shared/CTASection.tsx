'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from './AnimatedReveal';

export function CTASection() {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero/hero-2.jpg"
        alt=""
        fill
        className="object-cover"
        priority={false}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      {/* Gold gradient accent */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedReveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 text-balance">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg text-white/70 mb-8 text-pretty">
              {t('ctaDesc')}
            </p>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg shadow-lg shadow-primary/20"
              >
                {tCta('contactNow')}
              </Button>
            </Link>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
