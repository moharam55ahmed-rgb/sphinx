'use client';

import { useState, useMemo, useEffect } from 'react';
import { getHomeData } from '@/lib/public-api';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { resolveSectionVideoUrl, toYoutubeEmbedUrl } from '@/lib/youtube';
import { resolveMediaUrl } from '@/lib/media-url';

export function VideoIntroSection({ data: initialData }: { data?: any }) {
  const [cmsData, setCmsData] = useState<any>(initialData);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    getHomeData()
      .then((sections) => {
        const section = sections?.find(
          (s: { sectionKey: string }) => s.sectionKey === 'video-intro'
        );
        if (section) setCmsData(section);
      })
      .catch(() => {});
  }, []);

  const data = cmsData ?? initialData;
  const t = useTranslations('sections');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const embedUrl = useMemo(() => {
    const source = resolveSectionVideoUrl(data?.videoUrl, data?.buttonUrl);
    if (source) {
      const fromUrl = toYoutubeEmbedUrl(source);
      if (fromUrl) return fromUrl;
    }
    const youtubeId = data?.customData?.youtubeId;
    if (youtubeId) return toYoutubeEmbedUrl(String(youtubeId));
    return null;
  }, [data]);

  const thumbnail = resolveMediaUrl(
    data?.image || '/images/videos/video-3.jpg'
  );

  return (
    <section className="py-24 bg-background" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedReveal
            direction={isRtl ? 'right' : 'left'}
            className={cn(isRtl && 'lg:order-last')}
          >
            <button
              type="button"
              className="relative aspect-video w-full rounded-2xl overflow-hidden group cursor-pointer text-left"
              onClick={() => embedUrl && setIsVideoOpen(true)}
              disabled={!embedUrl}
              aria-label={tCommon('watchVideo')}
            >
              <Image
                src={thumbnail}
                alt={data?.title ? translate(data.title, locale) : 'Company Video'}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
              <motion.div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-2xl"
                >
                  <Play className="w-8 h-8 ms-1" />
                </motion.span>
              </motion.div>
              <div
                className={cn(
                  'absolute bottom-4 text-white text-sm font-medium',
                  isRtl ? 'right-4 left-4 text-right' : 'left-4 right-4 text-left'
                )}
              >
                {data?.buttonText
                  ? translate(data.buttonText, locale)
                  : tCommon('watchVideo')}
              </div>
            </button>
          </AnimatedReveal>

          <AnimatedReveal direction={isRtl ? 'left' : 'right'} delay={0.2}>
            <div className={cn(isRtl && 'text-right')}>
              <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase mb-4">
                {data?.subtitle
                  ? translate(data.subtitle, locale)
                  : t('investmentSimplicity')}
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 text-balance">
                {data?.title ? translate(data.title, locale) : t('investmentTitle')}
              </h2>
              <p
                className="text-muted-foreground text-lg leading-relaxed text-pretty"
                dir={isRtl ? 'rtl' : 'ltr'}
              >
                {data?.description
                  ? translate(data.description, locale)
                  : t('investmentDesc')}
              </p>
            </div>
          </AnimatedReveal>
        </div>
      </div>

      <AnimatePresence>
        {isVideoOpen && embedUrl && (
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
              className={cn(
                'absolute top-4 text-white hover:bg-white/10 z-10',
                isRtl ? 'left-4' : 'right-4'
              )}
              onClick={() => setIsVideoOpen(false)}
            >
              <X className="w-8 h-8" />
            </Button>
            <motion.div
              className="w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${embedUrl}?autoplay=1`}
                title={data?.title ? translate(data.title, locale) : 'Video'}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
