'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { cn } from '@/lib/utils';
import { getProjects } from '@/lib/public-api';
import { projects as staticProjects } from '@/data/site';
import { t as translate } from '@/lib/translate';

export function ProjectsSection({ data }: { data?: any }) {
  const t = useTranslations('sections');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getProjects({ featured: true, limit: 4 });
        setDynamicProjects(res);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const displayProjects = dynamicProjects.length > 0 ? dynamicProjects : staticProjects;

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <AnimatedReveal>
          <SectionHeading
            title={data?.title || t('projects')}
            description={data?.subtitle || data?.description}
          />
        </AnimatedReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayProjects.map((project, index) => {
            const title = project.title ? translate(project.title, locale) : (isRtl ? project.nameAr : project.nameEn);
            const description = project.shortDescription || project.shortDesc || project.description;
            const descText = typeof description === 'object' || (typeof description === 'string' && (description.startsWith('{') || description.startsWith('['))) 
              ? translate(description, locale) 
              : (isRtl ? project.shortDescAr : project.shortDescEn);
            
            const categoryName = project.category?.name 
              ? translate(project.category.name, locale) 
              : (isRtl ? (project.categoryAr || project.category) : (project.categoryEn || project.category));

            return (
              <AnimatedReveal key={project.id || index} delay={index * 0.1}>
                <Link href={`/projects/${project.slug || '#'}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative glass-card rounded-2xl overflow-hidden h-full flex flex-col border border-primary/10 hover:border-primary/30 transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={project.mainImage || project.image || '/images/placeholder.jpg'}
                        alt={title || ''}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Project Number */}
                      <div className={cn(
                        'absolute top-4 text-6xl font-bold text-white/10 select-none',
                        isRtl ? 'right-4' : 'left-4'
                      )}>
                        0{index + 1}
                      </div>

                      {/* Category Badge on Image for mobile/compact look */}
                      <div className={cn(
                        'absolute bottom-4 flex gap-2',
                        isRtl ? 'right-6' : 'left-6'
                      )}>
                         {categoryName && (
                          <Badge
                            className="bg-primary/90 text-primary-foreground border-none backdrop-blur-md"
                          >
                            {categoryName}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={cn('p-6 flex-grow flex flex-col', isRtl ? 'text-right' : 'text-left')}>
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-1">
                        {title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">
                        {descText}
                      </p>

                      {/* Action Button */}
                      <div className={cn('mt-auto flex', isRtl ? 'justify-start' : 'justify-start')}>
                        <Button
                          variant="link"
                          className={cn(
                            'p-0 h-auto text-primary hover:text-primary/80 group/btn gap-2 flex items-center transition-all',
                            isRtl ? 'flex-row-reverse' : 'flex-row'
                          )}
                        >
                          <span className="text-sm font-semibold uppercase tracking-wider">{tCta('viewDetails')}</span>
                          {isRtl ? (
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover/btn:-translate-x-2" />
                          ) : (
                            <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-2" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </AnimatedReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
