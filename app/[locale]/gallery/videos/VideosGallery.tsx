'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { videos, projects } from '@/data/site';

export function VideosGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const t = useTranslations('sections');
  const tFilters = useTranslations('filters');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const filters = [
    { value: 'all', label: tFilters('all') },
    ...projects.map((p) => ({
      value: p.slug,
      label: isRtl ? p.nameAr : p.nameEn,
    })),
  ];

  const filteredVideos = activeFilter === 'all'
    ? videos
    : videos.filter((v) => v.project === activeFilter);

  return (
    <>
      <PageHero
        title={t('videosGallery')}
        backgroundImage="/images/hero/hero-3.jpg"
      />

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <AnimatedReveal>
            <div className="flex justify-center mb-12 overflow-x-auto">
              <Tabs
                value={activeFilter}
                onValueChange={setActiveFilter}
                className="w-auto"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                <TabsList className="bg-secondary/50 p-1 flex-wrap h-auto">
                  {filters.map((filter) => (
                    <TabsTrigger
                      key={filter.value}
                      value={filter.value}
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2 text-sm whitespace-nowrap"
                    >
                      {filter.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </AnimatedReveal>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <AnimatedReveal key={video.id} delay={index * 0.05}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={cn(
                    'glass-card rounded-xl overflow-hidden cursor-pointer group',
                    isRtl && 'text-right'
                  )}
                  onClick={() => setSelectedVideo(video.youtubeId)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={isRtl ? video.titleAr : video.titleEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                      >
                        <Play className="w-7 h-7 ml-1" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-foreground font-medium line-clamp-2 group-hover:text-primary transition-colors">
                      {isRtl ? video.titleAr : video.titleEn}
                    </h3>
                  </div>
                </motion.div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedVideo(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setSelectedVideo(null)}
            >
              <X className="w-8 h-8" />
            </Button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full h-full flex items-center justify-center text-white">
                <p>{isRtl ? 'فيديو يوتيوب' : 'YouTube Video'}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection />
    </>
  );
}
