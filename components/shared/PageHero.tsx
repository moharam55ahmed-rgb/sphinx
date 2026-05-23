'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

interface PageHeroProps {
  title: string | Record<string, string>;
  subtitle?: string | Record<string, string>;
  backgroundImage?: string;
}

export function PageHero({ title, subtitle, backgroundImage }: PageHeroProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        {backgroundImage ? (
          <Image
            src={resolveMediaUrl(backgroundImage)}
            alt=""
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary to-background" />
        )}
        <div className="absolute inset-0 hero-overlay" />
      </div>

      <div
        className={cn(
          'relative z-10 container mx-auto px-4 pt-32 pb-16 text-center',
          isRtl && 'text-center'
        )}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
          {translate(title, locale)}
        </h1>
        {subtitle && (
          <p className="text-xl text-white/70 max-w-2xl mx-auto text-pretty">
            {translate(subtitle, locale)}
          </p>
        )}
      </div>
    </section>
  );
}
