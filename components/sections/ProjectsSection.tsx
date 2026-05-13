'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';
import { projects } from '@/data/site';

export function ProjectsSection() {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <AnimatedReveal>
          <SectionHeading title={t('projects')} />
        </AnimatedReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <AnimatedReveal key={project.id} delay={index * 0.1}>
              <Link href={`/projects/${project.slug}`}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative glass-card rounded-2xl overflow-hidden h-full"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={isRtl ? project.nameAr : project.nameEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Project Number */}
                    <div className={cn(
                      'absolute top-4 text-6xl font-bold text-white/10',
                      isRtl ? 'right-4' : 'left-4'
                    )}>
                      0{index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={cn('p-6', isRtl && 'text-right')}>
                    <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                      {isRtl ? project.nameAr : project.nameEn}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {isRtl ? project.shortDescAr : project.shortDescEn}
                    </p>

                    {/* Tags */}
                    <div className={cn('flex flex-wrap gap-2 mb-4', isRtl && 'justify-end')}>
                      {(isRtl ? project.tagsAr : project.tagsEn).slice(0, 3).map((tag, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-white/5 text-white/70 hover:bg-white/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Button */}
                    <Button
                      variant="ghost"
                      className={cn(
                        'p-0 h-auto text-primary hover:text-primary/80 group/btn gap-2',
                        isRtl && 'flex-row-reverse'
                      )}
                    >
                      {isRtl ? (
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-1" />
                      ) : (
                        <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                      )}
                      {tCta('viewDetails')}
                    </Button>
                  </div>
                </motion.div>
              </Link>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
