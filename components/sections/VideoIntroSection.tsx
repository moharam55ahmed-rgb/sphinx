'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { cn } from '@/lib/utils';

export function VideoIntroSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const t = useTranslations('sections');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className={cn(
          'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
        )}>
          {/* Video Thumbnail */}
          <AnimatedReveal direction={isRtl ? 'right' : 'left'} className={cn(isRtl && 'lg:order-last')}>
            <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setIsVideoOpen(true)}>
              <Image
                src="/images/video-thumbnail.jpg"
                alt="Company Video"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-2xl"
                >
                  <Play className="w-8 h-8" />
                </motion.button>
              </div>
              <div className={cn('absolute bottom-4 text-white text-sm', isRtl ? 'right-4 left-4 text-right' : 'left-4 right-4 text-left')}>
                {tCommon('watchVideo')}
              </div>
            </div>
          </AnimatedReveal>

          {/* Content */}
          <AnimatedReveal direction={isRtl ? 'left' : 'right'} delay={0.2}>
            <div className={cn(isRtl && 'text-right')}>
              <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4">
                {t('investmentSimplicity')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                {t('investmentTitle')}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed text-pretty">
                {t('investmentDesc')}
              </p>
            </div>
          </AnimatedReveal>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsVideoOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/10"
            onClick={() => setIsVideoOpen(false)}
          >
            <X className="w-8 h-8" />
          </Button>
          <div className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
            <div className="w-full h-full flex items-center justify-center text-white">
              <p>{isRtl ? 'فيديو تعريفي للشركة' : 'Company Introduction Video'}</p>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
