import { setRequestLocale } from 'next-intl/server';
import { HeroSlider } from '@/components/sections/HeroSlider';
import { VideoIntroSection } from '@/components/sections/VideoIntroSection';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { VisionMissionValues } from '@/components/sections/VisionMissionValues';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { WhyInvestSection } from '@/components/sections/WhyInvestSection';
import { StatsSection } from '@/components/shared/StatsSection';
import { LatestNewsSection } from '@/components/sections/LatestNewsSection';
import { CTASection } from '@/components/shared/CTASection';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSlider />
      <VideoIntroSection />
      <AboutPreview />
      <VisionMissionValues />
      <ProjectsSection />
      <WhyInvestSection />
      <StatsSection />
      <LatestNewsSection />
      <CTASection />
    </>
  );
}
