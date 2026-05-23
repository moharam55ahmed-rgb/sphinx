'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Check, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTASection } from '@/components/shared/CTASection';
import { ProjectGallery } from '@/components/projects/ProjectGallery';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';
import { projects, contactInfo } from '@/data/site';
import { getSettings } from '@/lib/public-api';
import {
  getSettingText,
  toTelHref,
  toWhatsAppHref,
} from '@/lib/contact-links';

function parseGallery(gallery: unknown): string[] {
  if (!gallery) return [];
  if (Array.isArray(gallery)) return gallery.filter((x): x is string => typeof x === 'string' && !!x);
  if (typeof gallery === 'string') {
    try {
      const parsed = JSON.parse(gallery);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [gallery];
    } catch {
      return gallery ? [gallery] : [];
    }
  }
  return [];
}

function getFeatureText(feature: unknown, locale: string): string {
  if (typeof feature === 'string') return feature;
  if (feature && typeof feature === 'object') {
    const f = feature as { en?: string; ar?: string };
    if (f.ar || f.en) return locale === 'ar' ? f.ar || f.en || '' : f.en || f.ar || '';
  }
  return translate(feature, locale);
}

export function ProjectDetail({ project }: { project: Record<string, unknown> }) {
  const t = useTranslations('common');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [phone, setPhone] = useState(contactInfo.phone);
  const [whatsapp, setWhatsapp] = useState(contactInfo.whatsapp);

  useEffect(() => {
    getSettings()
      .then((data) => {
        setPhone(getSettingText(data?.phone, contactInfo.phone, locale));
        setWhatsapp(getSettingText(data?.whatsapp, contactInfo.whatsapp, locale));
      })
      .catch(() => {
        /* keep defaults */
      });
  }, [locale]);

  const telHref = toTelHref(phone);
  const waHref = toWhatsAppHref(whatsapp);

  const staticFallback = projects.find((p) => p.slug === project.slug);

  const title = project.title
    ? translate(project.title, locale)
    : isRtl
      ? (project.nameAr as string)
      : (project.nameEn as string);
  const subtitle =
    translate(
      project.shortDescription || project.shortDesc || project.subtitle,
      locale
    ) || (isRtl ? (project.shortDescAr as string) : (project.shortDescEn as string));
  const description =
    translate(project.description, locale) ||
    (isRtl ? (project.longDescAr as string) : (project.longDescEn as string));
  const mainImage = (project.mainImage || project.image) as string;

  const apiGallery = parseGallery(project.gallery);
  const gallery =
    apiGallery.length > 0
      ? apiGallery
      : staticFallback?.gallery?.length
        ? staticFallback.gallery
        : mainImage
          ? [mainImage]
          : [];

  const apiFeatures = (project.features || project.facts) as unknown[] | undefined;
  const features =
    apiFeatures && apiFeatures.length > 0
      ? apiFeatures
      : staticFallback?.facts || [];

  const categoryLabel = project.category
    ? translate((project.category as { name: unknown }).name, locale)
    : null;

  const otherProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <PageHero title={title} subtitle={subtitle} backgroundImage={mainImage} />

      <section className="py-16 bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <AnimatedReveal>
                <div
                  className={cn(
                    'text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap',
                    isRtl && 'text-right'
                  )}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {description}
                </div>
              </AnimatedReveal>

              {(categoryLabel || features.length > 0) && (
                <AnimatedReveal delay={0.1}>
                  <div dir={isRtl ? 'rtl' : 'ltr'}>
                    {categoryLabel && (
                      <div className={cn('flex mb-6', isRtl ? 'justify-start' : 'justify-start')}>
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border border-primary/20 px-4 py-1.5 text-sm"
                        >
                          {categoryLabel}
                        </Badge>
                      </div>
                    )}

                    {features.length > 0 && (
                      <>
                        <h3
                          className={cn(
                            'text-2xl font-bold text-foreground mb-6',
                            isRtl && 'text-right'
                          )}
                        >
                          {t('quickFacts')}
                        </h3>
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        >
                          {features.map((feature, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-4 glass-card rounded-xl"
                              dir={isRtl ? 'rtl' : 'ltr'}
                            >
                              <div
                                className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
                                aria-hidden
                              >
                                <Check className="w-4 h-4 text-primary" />
                              </div>
                              <span
                                className="flex-1 text-foreground/90 text-start"
                                dir={isRtl ? 'rtl' : 'ltr'}
                              >
                                {getFeatureText(feature, locale)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </AnimatedReveal>
              )}

              <ProjectGallery images={gallery} title={title} />
            </div>

            <div className="lg:col-span-1">
              <AnimatedReveal direction={isRtl ? 'left' : 'right'}>
                <Card className="sticky top-24 glass-card border-border">
                  <CardContent className="p-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
                    <div className={cn('text-center', isRtl && 'text-right md:text-center')}>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {isRtl ? 'هل ترغب في الاستثمار؟' : 'Interested in Investing?'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {isRtl
                          ? 'تواصل معنا للحصول على المزيد من التفاصيل'
                          : 'Contact us for more details'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {telHref ? (
                        <Button
                          asChild
                          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <a
                            href={telHref}
                            className={cn(
                              'inline-flex items-center justify-center gap-2 w-full',
                              isRtl && 'flex-row-reverse'
                            )}
                          >
                            <Phone className="w-4 h-4 shrink-0" />
                            <span dir="ltr">{phone}</span>
                          </a>
                        </Button>
                      ) : (
                        <Button
                          disabled
                          className="w-full bg-primary text-primary-foreground opacity-50"
                        >
                          {phone}
                        </Button>
                      )}

                      {waHref ? (
                        <Button
                          asChild
                          variant="outline"
                          className="w-full border-border text-foreground hover:bg-muted"
                        >
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'inline-flex items-center justify-center gap-2 w-full',
                              isRtl && 'flex-row-reverse'
                            )}
                          >
                            <MessageCircle className="w-4 h-4 shrink-0" />
                            WhatsApp
                          </a>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          disabled
                          className="w-full border-border text-foreground opacity-50"
                        >
                          WhatsApp
                        </Button>
                      )}
                    </div>

                    <div className="pt-4 border-t border-border">
                      <Link href="/contact">
                        <Button
                          variant="ghost"
                          className="w-full text-primary hover:text-primary/80"
                        >
                          {tCta('contactNow')}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/30" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <AnimatedReveal>
            <SectionHeading title={t('similarProjects')} />
          </AnimatedReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {otherProjects.map((p, index) => (
              <AnimatedReveal key={p.id} delay={index * 0.1}>
                <Link href={`/projects/${p.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group glass-card rounded-2xl overflow-hidden"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={resolveMediaUrl(p.image)}
                        alt={isRtl ? p.nameAr : p.nameEn}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className={cn('p-6', isRtl && 'text-right')}>
                      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {isRtl ? p.nameAr : p.nameEn}
                      </h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {isRtl ? p.shortDescAr : p.shortDescEn}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
