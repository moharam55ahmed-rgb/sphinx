'use client';

import { useState } from 'react';
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
import { jobs } from '@/data/site';

export function CareersContent() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const t = useTranslations('sections');
  const tForm = useTranslations('form');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <>
      <PageHero
        title={t('careersTitle')}
        subtitle={t('careersIntro')}
        backgroundImage="/images/hero/hero-5.jpg"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-12',
            isRtl && 'lg:flex-row-reverse'
          )}>
            {/* Job Listings */}
            <div>
              <AnimatedReveal>
                <SectionHeading
                  title={isRtl ? 'الوظائف المتاحة' : 'Available Positions'}
                  centered={false}
                />
              </AnimatedReveal>

              <div className="space-y-4">
                {jobs.map((job, index) => (
                  <AnimatedReveal key={job.id} delay={index * 0.1}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={cn(
                        'glass-card rounded-xl p-6 cursor-pointer transition-all',
                        selectedJob === job.id && 'border-primary/50',
                        isRtl && 'text-right'
                      )}
                      onClick={() => setSelectedJob(job.id)}
                    >
                      <div className={cn(
                        'flex items-start gap-4',
                        isRtl && 'flex-row-reverse'
                      )}>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Briefcase className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">
                            {isRtl ? job.titleAr : job.titleEn}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3">
                            {isRtl ? job.descriptionAr : job.descriptionEn}
                          </p>
                          <div className={cn(
                            'flex items-center gap-2 text-muted-foreground text-xs',
                            isRtl && 'flex-row-reverse'
                          )}>
                            <Calendar className="w-4 h-4" />
                            <span>{isRtl ? job.dateAr : job.dateEn}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatedReveal>
                ))}
              </div>
            </div>

            {/* Application Form */}
            <div>
              <AnimatedReveal direction={isRtl ? 'left' : 'right'}>
                <Card className="glass-card border-white/10 sticky top-24">
                  <CardHeader>
                    <CardTitle className={cn('text-white', isRtl && 'text-right')}>
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
                          className="bg-secondary/50 border-white/10"
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
                          className="bg-secondary/50 border-white/10"
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
                          className="bg-secondary/50 border-white/10"
                          dir="ltr"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="position" className={cn(isRtl && 'block text-right')}>
                          {tForm('desiredPosition')}
                        </Label>
                        <Input
                          id="position"
                          className="bg-secondary/50 border-white/10"
                          dir={isRtl ? 'rtl' : 'ltr'}
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
                          className="bg-secondary/50 border-white/10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message" className={cn(isRtl && 'block text-right')}>
                          {tForm('message')}
                        </Label>
                        <Textarea
                          id="message"
                          rows={4}
                          className="bg-secondary/50 border-white/10 resize-none"
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
