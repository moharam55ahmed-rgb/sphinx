'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { cn } from '@/lib/utils';
import { teamMembers } from '@/data/site';

export function TeamContent() {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <>
      <PageHero
        title={t('ourTeam')}
        subtitle={t('teamIntro')}
        backgroundImage="/images/hero/hero-1.jpg"
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {teamMembers.map((member, index) => (
              <AnimatedReveal key={member.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className={cn(
                    'glass-card rounded-2xl overflow-hidden text-center',
                    isRtl && 'text-center'
                  )}
                >
                  {/* Avatar */}
                  <div className="relative aspect-square overflow-hidden bg-secondary/50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-12 h-12 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {isRtl ? member.titleAr : member.titleEn}
                    </h3>
                  </div>
                </motion.div>
              </AnimatedReveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
