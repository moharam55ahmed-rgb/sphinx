'use client';

import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  centered = true,
  className = '',
}: SectionHeadingProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <div
      className={cn(
        'space-y-4 mb-12',
        centered && 'text-center',
        !centered && isRtl && 'text-right',
        className
      )}
    >
      {label && (
        <span className="inline-block text-primary text-sm font-medium tracking-wider uppercase">
          {label}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-balance">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
