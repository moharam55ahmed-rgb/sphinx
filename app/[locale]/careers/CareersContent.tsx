'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar, Briefcase, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { jobs as staticJobs } from '@/data/site';
import { getPageBySlug } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';

type JobItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

function mapStaticJobs(isRtl: boolean): JobItem[] {
  return staticJobs.map((j) => ({
    id: j.id,
    title: isRtl ? j.titleAr : j.titleEn,
    description: isRtl ? j.descriptionAr : j.descriptionEn,
    date: isRtl ? j.dateAr : j.dateEn,
  }));
}

function mapApiJobs(custom: unknown[], locale: string): JobItem[] {
  const items = Array.isArray(custom)
    ? custom
    : custom && typeof custom === 'object'
      ? Object.values(custom as object)
      : [];

  return items.map((j: any, i: number) => ({
    id: j.id ? String(j.id) : String(i + 1),
    title: translate(j.title, locale),
    description: translate(j.text || j.description, locale),
    date: translate(j.date, locale) || '',
  }));
}

export function CareersContent() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const t = useTranslations('sections');
  const tForm = useTranslations('form');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    const load = async () => {
      try {
        const page = await getPageBySlug('careers');
        const section = page?.sections?.find(
          (s: { sectionKey: string }) => s.sectionKey === 'careers-list'
        );
        const custom = section?.customData;
        const mapped = mapApiJobs(
          Array.isArray(custom) ? custom : custom ? [custom] : [],
          locale
        );
        if (mapped.length > 0 && mapped.some((j) => j.title)) {
          setJobs(mapped);
          return;
        }
      } catch {
        /* fallback */
      }
      setJobs(mapStaticJobs(isRtl));
    };
    load();
  }, [locale, isRtl]);

  const selectedTitle =
    jobs.find((j) => j.id === selectedJob)?.title ?? '';

  return (
    <>
      <PageHero
        title={t('careersTitle')}
        subtitle={t('careersIntro')}
        backgroundImage="/images/hero/hero-5.jpg"
      />

      <section className="py-16 bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <AnimatedReveal>
                <SectionHeading
                  title={isRtl ? 'الوظائف المتاحة' : 'Available Positions'}
                  centered={false}
                />
              </AnimatedReveal>

              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    {isRtl ? 'لا توجد وظائف متاحة حالياً' : 'No open positions at the moment'}
                  </p>
                ) : (
                  jobs.map((job, index) => (
                    <AnimatedReveal key={job.id} delay={index * 0.1}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          'glass-card rounded-xl p-6 cursor-pointer transition-all border border-transparent',
                          selectedJob === job.id && 'border-primary/50',
                          isRtl && 'text-right'
                        )}
                        onClick={() => setSelectedJob(job.id)}
                      >
                        <div
                          className="flex items-start gap-4"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        >
                          <div
                            className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
                            aria-hidden
                          >
                            <Briefcase className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0 text-start">
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {job.title}
                            </h3>
                            {job.description && (
                              <p className="text-muted-foreground text-sm mb-3">
                                {job.description}
                              </p>
                            )}
                            {job.date && (
                              <div
                                className="flex items-center gap-2 text-muted-foreground text-xs"
                                dir={isRtl ? 'rtl' : 'ltr'}
                              >
                                <Calendar className="w-4 h-4 shrink-0" />
                                <span>{job.date}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </AnimatedReveal>
                  ))
                )}
              </div>
            </div>

            <div>
              <AnimatedReveal direction={isRtl ? 'left' : 'right'}>
                <Card className="glass-card border-border sticky top-24">
                  <CardHeader>
                    <CardTitle className={cn('text-foreground', isRtl && 'text-right')}>
                      {isRtl ? 'تقديم طلب توظيف' : 'Submit Application'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className={cn(isRtl && 'block text-right')}>
                          {tForm('name')}
                        </Label>
                        <Input
                          id="name"
                          className="bg-background border-border"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className={cn(isRtl && 'block text-right')}>
                          {tForm('phone')}
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          className="bg-background border-border"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className={cn(isRtl && 'block text-right')}>
                          {tForm('email')}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          className="bg-background border-border"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position" className={cn(isRtl && 'block text-right')}>
                          {tForm('desiredPosition')}
                        </Label>
                        <Input
                          id="position"
                          className="bg-background border-border"
                          dir={isRtl ? 'rtl' : 'ltr'}
                          defaultValue={selectedTitle}
                          key={selectedJob ?? 'empty'}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cv" className={cn(isRtl && 'block text-right')}>
                          {tForm('cv')}
                        </Label>
                        <Input
                          id="cv"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="bg-background border-border"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className={cn(isRtl && 'block text-right')}>
                          {tForm('message')}
                        </Label>
                        <Textarea
                          id="message"
                          rows={4}
                          className="bg-background border-border resize-none"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                      >
                        <Send className="w-4 h-4" />
                        {tCta('submitApplication')}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </AnimatedReveal>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
