'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { galleryImages, projects } from '@/data/site';

export function PhotoGallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  const filteredImages = activeFilter === 'all'
    ? galleryImages
    : galleryImages.filter((img) => img.project === activeFilter);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  return (
    <>
      <PageHero
        title={t('photoGallery')}
        backgroundImage="/images/hero/hero-2.jpg"
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

          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((image, index) => (
              <AnimatedReveal key={image.id} delay={index * 0.05}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                      {image.alt}
                    </span>
                  </div>
                </motion.div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && filteredImages[currentImageIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-white hover:bg-white/10',
                isRtl ? 'right-4' : 'left-4'
              )}
              onClick={(e) => {
                e.stopPropagation();
                isRtl ? nextImage() : prevImage();
              }}
            >
              <ChevronLeft className="w-8 h-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-white hover:bg-white/10',
                isRtl ? 'left-4' : 'right-4'
              )}
              onClick={(e) => {
                e.stopPropagation();
                isRtl ? prevImage() : nextImage();
              }}
            >
              <ChevronRight className="w-8 h-8" />
            </Button>

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl max-h-[80vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filteredImages[currentImageIndex].src}
                alt={filteredImages[currentImageIndex].alt}
                fill
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection />
    </>
  );
}
