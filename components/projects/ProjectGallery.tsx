'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { cn } from '@/lib/utils';
import { resolveMediaUrl } from '@/lib/media-url';

type ProjectGalleryProps = {
  images: string[];
  title: string;
}

export function ProjectGallery({ images, title }: ProjectGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  if (!images.length) return null;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const next = () => setCurrentIndex((i) => (i + 1) % images.length);
  const prev = () => setCurrentIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <>
      <AnimatedReveal delay={0.35}>
        <div dir={isRtl ? 'rtl' : 'ltr'} className={cn(isRtl && 'text-right')}>
          <h3 className="text-2xl font-bold text-foreground mb-6">{t('projectGallery')}</h3>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-4"
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => openLightbox(index)}
                className="relative aspect-[4/3] rounded-xl overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Image
                  src={resolveMediaUrl(src)}
                  alt={`${title} - ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              </button>
            ))}
          </motion.div>
        </div>
      </AnimatedReveal>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-4 text-white hover:bg-white/10 z-10',
                isRtl ? 'left-4' : 'right-4'
              )}
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10',
                isRtl ? 'right-4' : 'left-4'
              )}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
            >
              {isRtl ? (
                <ChevronRight className="w-8 h-8" />
              ) : (
                <ChevronLeft className="w-8 h-8" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-1/2 -translate-y-1/2 text-white hover:bg-white/10 z-10',
                isRtl ? 'left-4' : 'right-4'
              )}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
            >
              {isRtl ? (
                <ChevronLeft className="w-8 h-8" />
              ) : (
                <ChevronRight className="w-8 h-8" />
              )}
            </Button>

            <motion.div
              key={currentIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full max-w-5xl aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={resolveMediaUrl(images[currentIndex])}
                alt={`${title} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
