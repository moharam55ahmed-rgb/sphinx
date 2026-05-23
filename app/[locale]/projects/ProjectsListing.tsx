'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { getProjects, getCategories, getPageBySlug } from '@/lib/public-api';
import { getBannerImage } from '@/lib/page-banners';
import { projects as staticProjects } from '@/data/site';

import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

export function ProjectsListing() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroImage, setHeroImage] = useState('/images/hero/hero-1.jpg');

  const t = useTranslations('sections');
  const tFilters = useTranslations('filters');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes, page] = await Promise.all([
          getProjects(),
          getCategories(),
          getPageBySlug('projects'),
        ]);
        setDynamicProjects(projectsRes);
        setCategories(categoriesRes);
        const hero = getBannerImage(page?.sections, 'projects-hero');
        if (hero) setHeroImage(hero);
      } catch (err) {
        console.error("Failed to fetch projects data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayProjects = dynamicProjects.length > 0 ? dynamicProjects : staticProjects;
  
  const filteredProjects = activeFilter === 'all'
    ? displayProjects
    : displayProjects.filter((p) => p.categoryId === activeFilter || p.category?.slug === activeFilter || p.category === activeFilter);


  return (
    <>
      <PageHero 
        title={t('projects')}
        backgroundImage={heroImage}
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <AnimatedReveal>
            <div className="flex justify-center mb-12">
              <Tabs
                value={activeFilter}
                onValueChange={(v) => setActiveFilter(v)}
                className="w-auto"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <TabsList className="bg-secondary/50 p-1 flex-wrap h-auto">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
                  >
                    {tFilters('all')}
                  </TabsTrigger>
                  {categories.map((cat) => (
                    <TabsTrigger
                      key={cat.id}
                      value={cat.id}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2"
                    >
                      {translate(cat.name, locale)}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </AnimatedReveal>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <AnimatedReveal key={project.id} delay={index * 0.1}>
                <Link href={`/projects/${project.slug}`}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group glass-card rounded-2xl overflow-hidden h-full"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={resolveMediaUrl(project.mainImage || project.image)}
                        alt={translate(project.title, locale)}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Project Number */}
                      <div className={cn(
                        'absolute top-4 text-6xl font-bold text-foreground/10',
                        isRtl ? 'right-4' : 'left-4'
                      )}>
                        0{index + 1}
                      </div>
                    </div>

                    {/* Content */}
                    <div className={cn('p-6', isRtl && 'text-right')}>
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {translate(project.title, locale)}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {translate(project.shortDescription || project.shortDesc || project.description, locale)}
                      </p>

                      {/* Tags */}
                      <div className={cn('flex flex-wrap gap-2 mb-4', isRtl && 'justify-end')}>
                        {project.category && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/20 text-primary hover:bg-primary/30"
                          >
                            {translate(project.category.name, locale)}
                          </Badge>
                        )}
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

      <CTASection />
    </>
  );
}
