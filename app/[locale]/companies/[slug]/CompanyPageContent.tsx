'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';

export function CompanyPageContent({ page }: { page: { title?: unknown; sections?: Array<Record<string, unknown>> } }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const sections = page?.sections || [];
  const hero = sections.find((s) => s.sectionKey === 'company-hero');
  const main = sections.find((s) => s.sectionKey === 'company-main');

  const title = translate(page?.title ?? hero?.title, locale);
  const subtitle = hero?.subtitle ? translate(hero.subtitle, locale) : undefined;
  const heroImage =
    (hero?.backgroundImage as string) ||
    (hero?.image as string) ||
    undefined;

  return (
    <>
      <PageHero title={title} subtitle={subtitle} backgroundImage={heroImage} />

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className={cn('max-w-3xl mx-auto', isRtl && 'text-right')}>
            {main?.image && (
              <AnimatedReveal>
                <div className="relative aspect-video rounded-2xl overflow-hidden mb-10 border border-border">
                  <Image
                    src={main.image as string}
                    alt={title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </AnimatedReveal>
            )}
            <AnimatedReveal delay={0.1}>
              <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                {main?.description
                  ? translate(main.description, locale)
                  : main?.subtitle
                    ? translate(main.subtitle, locale)
                    : null}
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
