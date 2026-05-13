'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Check, Phone, MessageCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { projects, contactInfo, type Project } from '@/data/site';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const t = useTranslations('common');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const otherProjects = projects.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <>
      <PageHero
        title={isRtl ? project.nameAr : project.nameEn}
        subtitle={isRtl ? project.shortDescAr : project.shortDescEn}
        backgroundImage={project.image}
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className={cn(
            'grid grid-cols-1 lg:grid-cols-3 gap-12',
            isRtl && 'lg:flex-row-reverse'
          )}>
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <AnimatedReveal>
                <div className={cn(isRtl && 'text-right')}>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {isRtl ? project.longDescAr : project.longDescEn}
                  </p>
                </div>
              </AnimatedReveal>

              {/* Tags */}
              <AnimatedReveal delay={0.1}>
                <div className={cn('flex flex-wrap gap-2', isRtl && 'justify-end')}>
                  {(isRtl ? project.tagsAr : project.tagsEn).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-primary/10 text-primary border border-primary/20 px-4 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </AnimatedReveal>

              {/* Quick Facts */}
              <AnimatedReveal delay={0.2}>
                <div className={cn(isRtl && 'text-right')}>
                  <h3 className="text-2xl font-bold text-white mb-6">{t('quickFacts')}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.facts.map((fact, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-3 p-4 glass-card rounded-xl',
                          isRtl && 'flex-row-reverse'
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-white/90">{isRtl ? fact.ar : fact.en}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedReveal>

              {/* Gallery */}
              <AnimatedReveal delay={0.3}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-video rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={image}
                        alt={`${isRtl ? project.nameAr : project.nameEn} - ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </AnimatedReveal>
            </div>

            {/* Sidebar - Contact Card */}
            <div className="lg:col-span-1">
              <AnimatedReveal direction={isRtl ? 'left' : 'right'}>
                <Card className="sticky top-24 glass-card border-white/10">
                  <CardContent className="p-6 space-y-6">
                    <div className={cn('text-center', isRtl && 'text-center')}>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {isRtl ? 'هل ترغب في الاستثمار؟' : 'Interested in Investing?'}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {isRtl 
                          ? 'تواصل معنا للحصول على المزيد من التفاصيل'
                          : 'Contact us for more details'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
                        <Phone className="w-4 h-4" />
                        {contactInfo.phone}
                      </Button>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/5 gap-2">
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <Link href="/contact">
                        <Button variant="ghost" className="w-full text-primary hover:text-primary/80">
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

      {/* Similar Projects */}
      <section className="py-16 bg-secondary/30">
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
                        src={p.image}
                        alt={isRtl ? p.nameAr : p.nameEn}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    </div>
                    <div className={cn('p-6', isRtl && 'text-right')}>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
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
