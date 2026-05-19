'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { LegalDocument } from '@/data/legal';

type LegalPageContentProps = {
  document: LegalDocument;
};

export function LegalPageContent({ document: doc }: LegalPageContentProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const lang = isRtl ? 'ar' : 'en';

  return (
    <>
      <PageHero title={doc.title} subtitle={doc.subtitle} />

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedReveal>
            <p
              className={cn(
                'text-sm text-muted-foreground mb-10 pb-6 border-b border-border',
                isRtl && 'text-right'
              )}
            >
              {isRtl ? 'آخر تحديث: ' : 'Last updated: '}
              <span className="text-foreground font-medium">
                {doc.lastUpdated[lang]}
              </span>
            </p>
          </AnimatedReveal>

          <div className="space-y-10">
            {doc.sections.map((section, index) => (
              <AnimatedReveal key={section.id} delay={index * 0.05}>
                <article
                  className={cn(
                    'glass-card rounded-2xl p-6 md:p-8 border border-border',
                    isRtl && 'text-right'
                  )}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.title[lang]}
                  </h2>
                  <div className="space-y-4 text-muted-foreground leading-relaxed">
                    {section.paragraphs[lang].map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                    {section.bullets?.[lang] && (
                      <ul
                        className={cn(
                          'list-disc space-y-2 marker:text-primary',
                          isRtl ? 'pr-5' : 'pl-5'
                        )}
                      >
                        {section.bullets[lang].map((item) => (
                          <li key={item.slice(0, 48)}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </article>
              </AnimatedReveal>
            ))}
          </div>

          <AnimatedReveal delay={0.2}>
            <div
              className={cn(
                'mt-12 pt-8 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between',
                isRtl && 'sm:flex-row-reverse'
              )}
            >
              <p className="text-muted-foreground text-sm text-center sm:text-start">
                {isRtl
                  ? 'للاستفسارات، تواصل مع فريق سفنكس.'
                  : 'For questions, contact the SPHINX team.'}
              </p>
              <Link href="/contact">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {isRtl ? 'اتصل بنا' : 'Contact Us'}
                </Button>
              </Link>
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </>
  );
}
