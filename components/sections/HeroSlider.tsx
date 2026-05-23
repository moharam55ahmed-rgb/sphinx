'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { heroSlides } from '@/data/site';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

export function HeroSlider({ data }: { data?: any }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const t = useTranslations('hero');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const slides =
    data?.customData && Array.isArray(data.customData) && data.customData.length > 0
      ? data.customData.map((slide: any) => ({
          ...slide,
          image: resolveMediaUrl(
            typeof slide.image === 'string'
              ? slide.image
              : slide.mainImage || '/images/hero/hero-1.jpg'
          ),
        }))
      : heroSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = slides[currentSlide];
  const slideKey = `slide${currentSlide + 1}` as keyof typeof t.raw;


  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt=""
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 hero-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className={cn(
                'max-w-4xl text-center mx-auto'
              )}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-primary/20 backdrop-blur-sm rounded-full text-primary text-sm font-medium mb-6"
              >
                {isRtl ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}
              </motion.span>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 text-balance leading-tight">
                {translate(slide.title, locale) || t(`${slideKey}.title` as any)}
              </h1>

              <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl text-pretty">
                {translate(slide.text || slide.subtitle, locale) || t(`${slideKey}.subtitle` as any)}
              </p>

              {(slide.link || slide.buttonUrl || currentSlide === 0) && (
                <div className={cn('flex flex-col sm:flex-row gap-4 justify-center')}>
                  <Link href={slide.link || slide.buttonUrl || "/projects"}>
                    <Button
                      size="sm"
                      className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 md:px-8 md:py-6 text-xs md:text-lg rounded-full h-10 md:h-auto"
                    >
                      {translate(slide.buttonText, locale) || tCta('exploreProjects')}
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full sm:w-auto border border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white px-4 py-2 md:px-8 md:py-6 text-xs md:text-lg rounded-full h-10 md:h-auto backdrop-blur-sm"
                    >
                      {tCta('contactUs')}
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={isRtl ? nextSlide : prevSlide}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors',
          isRtl ? 'right-6' : 'left-6'
        )}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={isRtl ? prevSlide : nextSlide}
        className={cn(
          'absolute top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-colors',
          isRtl ? 'left-6' : 'right-6'
        )}
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              currentSlide === index
                ? 'w-8 bg-primary'
                : 'w-2 bg-white/30 hover:bg-white/50'
            )}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block"
        style={{ marginBottom: '60px' }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
