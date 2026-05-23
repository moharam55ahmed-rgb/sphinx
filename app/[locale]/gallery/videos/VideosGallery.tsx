'use client';

import { useEffect, useState } from 'react';
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
import { videos } from '@/data/site';
import { getGallery, getGalleryCategories, getPageBySlug } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';
import { getBannerImage } from '@/lib/page-banners';

export function VideosGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const t = useTranslations('sections');
  const tFilters = useTranslations('filters');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const [filters, setFilters] = useState([{ value: 'all', label: tFilters('all') }]);
  const [videoItems, setVideoItems] = useState(videos);
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState('/images/hero/hero-3.jpg');

  useEffect(() => {
    getPageBySlug('gallery')
      .then((page) => {
        const hero = getBannerImage(page?.sections, 'gallery-videos-hero');
        if (hero) setHeroImage(hero);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    getGalleryCategories()
      .then((cats) => {
        if (cats?.length) {
          setFilters([
            { value: 'all', label: tFilters('all') },
            ...cats.map((cat: any) => ({
              value: cat.slug,
              label: translate(cat.name, locale),
            })),
          ]);
        }
      })
      .catch(() => {});
  }, [locale, tFilters]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getGallery({
          type: 'video',
          category: activeFilter !== 'all' ? activeFilter : undefined,
        });
        if (data?.length) {
          setVideoItems(
            data.map((item: any) => {
              let titleObj = item.title;
              if (typeof titleObj === 'string') {
                try {
                  titleObj = JSON.parse(titleObj);
                } catch {
                  titleObj = { en: titleObj, ar: titleObj };
                }
              }
              return {
                id: item.id,
                titleAr:
                  typeof titleObj === 'object' ? titleObj.ar : item.originalName,
                titleEn:
                  typeof titleObj === 'object' ? titleObj.en : item.originalName,
                thumbnail: resolveMediaUrl(item.fileUrl) || '/images/video-thumbnail.jpg',
                fileUrl: item.fileUrl,
                youtubeId: 'dQw4w9WgXcQ',
                project: item.galleryCategory?.slug || 'all',
              };
            })
          );
        } else if (activeFilter === 'all') {
          setVideoItems(videos);
        } else {
          setVideoItems([]);
        }
      } catch (err) {
        console.error('Failed to load gallery videos', err);
      }
    };
    load();
  }, [activeFilter]);

  const filteredVideos =
    activeFilter === 'all'
      ? videoItems
      : videoItems.filter((v) => v.project === activeFilter);

  return (
    <>
      <PageHero
        title={t('videosGallery')}
        backgroundImage={heroImage}
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
                  onClick={() => {
                    if (video.youtubeId) setSelectedVideo(video.youtubeId);
                    else if (video.fileUrl) setSelectedFileUrl(resolveMediaUrl(video.fileUrl));
                  }}
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
        {(selectedVideo || selectedFileUrl) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => {
              setSelectedVideo(null);
              setSelectedFileUrl(null);
            }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => {
                setSelectedVideo(null);
                setSelectedFileUrl(null);
              }}
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
              {selectedFileUrl ? (
                <video
                  src={selectedFileUrl}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <p>{isRtl ? 'فيديو يوتيوب' : 'YouTube Video'}</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection />
    </>
  );
}
