import { setRequestLocale } from 'next-intl/server';
import { getHomeData } from '@/lib/public-api';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { VideoIntroSection } from '@/components/sections/VideoIntroSection';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { VisionMissionValues } from '@/components/sections/VisionMissionValues';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { WhyInvestSection } from '@/components/sections/WhyInvestSection';
import { StatsSection } from '@/components/shared/StatsSection';
import { LatestNewsSection } from '@/components/sections/LatestNewsSection';
import { RelatedCompaniesSection } from '@/components/sections/RelatedCompaniesSection';
import { findRelatedCompaniesSection } from '@/lib/related-companies';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  let sections: any[] = [];
  try {
    sections = await getHomeData();
  } catch (err) {
    console.error("Failed to fetch home sections", err);
  }

  // Helper to get section data by key
  const getSection = (key: string) => sections.find(s => s.sectionKey === key);

  return (
    <>
      <HeroSlider data={getSection('hero-slider')} />
      <VideoIntroSection data={getSection('video-intro')} />
      <AboutPreview data={getSection('about-preview')} />
      <VisionMissionValues data={getSection('vision-mission')} />
      <ProjectsSection data={getSection('projects-preview')} />
      <WhyInvestSection data={getSection('why-invest')} />
      <StatsSection data={getSection('stats')} />
      <LatestNewsSection data={getSection('news-preview')} />
      <RelatedCompaniesSection data={findRelatedCompaniesSection(sections)} />
      <CTASection data={getSection('cta')} />
    </>
  );
}
