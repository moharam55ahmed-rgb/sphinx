'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Building2 } from 'lucide-react';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';
import {
  parseRelatedCompaniesCustomData,
  getCompanyName,
  companyPagePath,
  DEFAULT_RELATED_COMPANIES,
  MAX_RELATED_COMPANIES,
} from '@/lib/related-companies';

export function RelatedCompaniesSection({
  data,
}: {
  data?: {
    customData?: unknown;
    title?: unknown;
    subtitle?: unknown;
    isActive?: boolean;
  };
}) {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (data?.isActive === false) return null;

  const fromCms = data?.customData ? parseRelatedCompaniesCustomData(data.customData) : [];
  const companies = (
    fromCms.length > 0 ? fromCms : data ? [] : DEFAULT_RELATED_COMPANIES
  ).slice(0, MAX_RELATED_COMPANIES);

  if (companies.length === 0) return null;

  return (
    <section
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative py-20 md:py-28 bg-secondary/20 border-y border-border/60 overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, hsl(var(--primary) / 0.08), transparent 70%)',
        }}
      />
      <div className="container mx-auto px-4 relative">
        <AnimatedReveal>
          <SectionHeading
            title={t('relatedCompanies')}
            description={t('relatedCompaniesDesc')}
          />
        </AnimatedReveal>

        <div
          dir={isRtl ? 'rtl' : 'ltr'}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5"
        >
          {companies.map((company, index) => {
            const name = getCompanyName(company, locale);
            const href = company.pageSlug ? companyPagePath(company.pageSlug) : null;

            const cardInner = (
              <>
                <div className="absolute inset-0">
                  {company.logo ? (
                    <Image
                      src={resolveMediaUrl(company.logo)}
                      alt={name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/15">
                      <Building2 className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
                {name && (
                  <p className="absolute bottom-0 inset-x-0 z-10 px-3 py-3 sm:px-4 sm:py-4 text-sm sm:text-base font-semibold text-white text-center leading-snug drop-shadow-md">
                    {name}
                  </p>
                )}
              </>
            );

            const cardClass = cn(
              'group relative block aspect-[4/3] sm:aspect-square overflow-hidden rounded-2xl',
              'border border-border/60 shadow-md',
              'hover:shadow-xl hover:border-primary/50 transition-shadow duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
            );

            return (
              <AnimatedReveal key={company.id} delay={index * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                >
                  {href ? (
                    <Link href={href} className={cardClass}>
                      {cardInner}
                    </Link>
                  ) : (
                    <div className={cardClass}>{cardInner}</div>
                  )}
                </motion.div>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
