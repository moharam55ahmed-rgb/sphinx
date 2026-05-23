'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { User } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { CTASection } from '@/components/shared/CTASection';
import { TeamMemberDialog } from '@/components/team/TeamMemberDialog';
import { cn } from '@/lib/utils';
import { teamMembers as staticTeam } from '@/data/site';
import { getPageBySlug } from '@/lib/public-api';
import { resolveMediaUrl } from '@/lib/media-url';
import { getBannerImage } from '@/lib/page-banners';
import {
  normalizeTeamMembers,
  getMemberName,
  getMemberJobTitle,
  type TeamMemberRecord,
} from '@/lib/team';
import { findSection, getSectionHeroImage } from '@/lib/section-media';
function staticToRecords(isRtl: boolean): TeamMemberRecord[] {
  return staticTeam.map((m) => ({
    id: m.id,
    name: {
      en: m.nameEn || m.titleEn,
      ar: m.nameAr || m.titleAr,
    },
    jobTitle: {
      en: m.titleEn,
      ar: m.titleAr,
    },
    bio: {
      en: m.bioEn || '',
      ar: m.bioAr || '',
    },
    image: m.image,
    phone: m.phone || '',
    email: m.email || '',
    linkedin: m.linkedin || '',
  }));
}

export function TeamContent() {
  const t = useTranslations('sections');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [members, setMembers] = useState<TeamMemberRecord[]>([]);
  const [heroImage, setHeroImage] = useState('/images/hero/hero-1.jpg');
  const [selected, setSelected] = useState<TeamMemberRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const page = await getPageBySlug('team');
        const hero =
          getBannerImage(page?.sections, 'team-hero') ||
          getSectionHeroImage(findSection(page?.sections, 'about-main'));
        if (hero) setHeroImage(hero);

        const section = page?.sections?.find(
          (s: { sectionKey: string }) => s.sectionKey === 'team-members'
        );
        const custom = section?.customData;
        if (Array.isArray(custom) && custom.length > 0) {
          setMembers(normalizeTeamMembers(custom));
          return;
        }
      } catch {
        /* fallback */
      }
      setMembers(staticToRecords(isRtl));
    };
    load();
  }, [locale, isRtl]);

  const openMember = (member: TeamMemberRecord) => {
    setSelected(member);
    setDialogOpen(true);
  };

  return (
    <>
      <PageHero
        title={t('ourTeam')}
        subtitle={t('teamIntro')}
        backgroundImage={heroImage}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {members.map((member, index) => {
              const name = getMemberName(member, locale);
              const jobTitle = getMemberJobTitle(member, locale);

              return (
                <AnimatedReveal key={member.id} delay={index * 0.1}>
                  <motion.button
                    type="button"
                    whileHover={{ y: -8 }}
                    onClick={() => openMember(member)}
                    className={cn(
                      'glass-card rounded-2xl overflow-hidden text-center w-full cursor-pointer transition-shadow hover:shadow-lg hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                      isRtl && 'text-center'
                    )}
                  >
                    <div className="relative aspect-square overflow-hidden bg-secondary/50">
                      {member.image ? (
                        <Image
                          src={resolveMediaUrl(member.image)}
                          alt={name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <User className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="font-semibold text-foreground">{name}</h3>
                      {jobTitle && (
                        <p className="text-sm text-primary">{jobTitle}</p>
                      )}
                    </div>
                  </motion.button>
                </AnimatedReveal>
              );
            })}
          </div>
        </div>
      </section>

      <TeamMemberDialog
        member={selected}
        open={dialogOpen}
        onOpenChange={(next) => {
          setDialogOpen(next);
          if (!next) setSelected(null);
        }}
      />

      <CTASection />
    </>
  );
}
