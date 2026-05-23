'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

export function AboutPreview({ data }: { data?: any }) {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const aboutImage = resolveMediaUrl(
    data?.image || '/images/hero/hero-1.jpg'
  );

  return (
    <section className="py-24 relative overflow-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <AnimatedReveal direction={isRtl ? 'right' : 'left'}>
            <div className="relative">
              <div className="relative aspect-[4/5] md:aspect-square rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Image
                  src={aboutImage}
                  alt={data?.title ? translate(data.title, locale) : 'About SPHINX'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized
                />
              </div>
              <div className={cn(
                "absolute w-48 h-48 bg-primary rounded-3xl -z-10 hidden md:block",
                isRtl ? "-bottom-8 -left-8" : "-bottom-8 -right-8"
              )} />
            </div>
          </AnimatedReveal>

          <AnimatedReveal direction={isRtl ? 'left' : 'right'}>
            <div className={cn('space-y-6', isRtl && 'text-right')} dir={isRtl ? 'rtl' : 'ltr'}>
              <SectionHeading
                label={t('about')}
                title={translate(data?.title, locale) || "SPHINX Real Estate Development"}
                description={translate(data?.description, locale) || "A leading force in real estate development with a vision for modern living and investment."}
                centered={false}
              />

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary">15+</h4>
                  <p className="text-muted-foreground">{t('yearsExperience')}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-4xl font-bold text-primary">500+</h4>
                  <p className="text-muted-foreground">{t('clients')}</p>
                </div>
              </div>

              <div className="pt-8">
                <Link href="/about">
                  <Button size="lg" className="px-8 w-full sm:w-auto">
                    {tCta('readMore')}
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
