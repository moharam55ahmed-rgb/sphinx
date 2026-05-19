'use client';

import { useRef, useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useInView } from 'framer-motion';
import { stats } from '@/data/site';
import { cn } from '@/lib/utils';
import { t as translate } from '@/lib/translate';

export function StatsSection({ data }: { data?: any }) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const displayStats =
    data?.customData && Array.isArray(data.customData) && data.customData.length > 0
      ? data.customData.map((item: any) => ({
          value: translate(item.title, locale),
          label: translate(item.text || item.description, locale),
        }))
      : stats.map((stat) => ({
          value: isRtl ? stat.valueAr : stat.valueEn,
          label: isRtl ? stat.labelAr : stat.labelEn,
        }));

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-20 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={cn(
            'grid grid-cols-2 md:grid-cols-4 gap-8',
            isRtl && 'text-right'
          )}
        >
          {displayStats.map((stat: any, index: number) => (
            <StatCard
              key={index}
              value={stat.value}
              label={stat.label}
              isInView={isInView}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  value: string;
  label: string;
  isInView: boolean;
  delay: number;
}

function StatCard({ value, label, isInView, delay }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    const numericPart = value.replace(/[^0-9]/g, '');
    const prefix = value.startsWith('+') ? '+' : '';
    const target = parseInt(numericPart, 10);

    if (isNaN(target)) {
      setDisplayValue(value);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += target / steps;
        if (current >= target) {
          setDisplayValue(`${prefix}${target}`);
          clearInterval(interval);
        } else {
          setDisplayValue(`${prefix}${Math.floor(current)}`);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [isInView, value, delay]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
        {displayValue}
      </div>
      <div className="text-muted-foreground text-sm md:text-base">{label}</div>
    </div>
  );
}
