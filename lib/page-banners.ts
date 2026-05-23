import type { CmsSection } from '@/lib/section-media';
import { findSection, getSectionHeroImage } from '@/lib/section-media';

export type PageBannerConfig = {
  id: string;
  pageSlug: string;
  sectionKey: string;
  labelEn: string;
  labelAr: string;
  previewPath: string;
  sortOrder: number;
};

/** Single source of truth — admin + public site use the same keys. */
export const PAGE_BANNERS: PageBannerConfig[] = [
  {
    id: 'about',
    pageSlug: 'about',
    sectionKey: 'about-main',
    labelEn: 'About Us',
    labelAr: 'من نحن',
    previewPath: '/about',
    sortOrder: 1,
  },
  {
    id: 'team',
    pageSlug: 'team',
    sectionKey: 'team-hero',
    labelEn: 'Team',
    labelAr: 'فريق العمل',
    previewPath: '/team',
    sortOrder: 1,
  },
  {
    id: 'gallery-photos',
    pageSlug: 'gallery',
    sectionKey: 'gallery-photos-hero',
    labelEn: 'Photo Gallery',
    labelAr: 'ألبوم الصور',
    previewPath: '/gallery/photos',
    sortOrder: 1,
  },
  {
    id: 'gallery-videos',
    pageSlug: 'gallery',
    sectionKey: 'gallery-videos-hero',
    labelEn: 'Video Gallery',
    labelAr: 'ألبوم الفيديو',
    previewPath: '/gallery/videos',
    sortOrder: 2,
  },
  {
    id: 'projects',
    pageSlug: 'projects',
    sectionKey: 'projects-hero',
    labelEn: 'Projects',
    labelAr: 'المشاريع',
    previewPath: '/projects',
    sortOrder: 1,
  },
  {
    id: 'news',
    pageSlug: 'news',
    sectionKey: 'news-hero',
    labelEn: 'News',
    labelAr: 'الأخبار',
    previewPath: '/news',
    sortOrder: 1,
  },
  {
    id: 'contact',
    pageSlug: 'contact',
    sectionKey: 'contact-hero',
    labelEn: 'Contact',
    labelAr: 'اتصل بنا',
    previewPath: '/contact',
    sortOrder: 1,
  },
  {
    id: 'careers',
    pageSlug: 'careers',
    sectionKey: 'careers-hero',
    labelEn: 'Careers',
    labelAr: 'التوظيف',
    previewPath: '/careers',
    sortOrder: 1,
  },
];

export function getBannerImage(
  sections: CmsSection[] | undefined,
  sectionKey: string
): string | undefined {
  return getSectionHeroImage(findSection(sections, sectionKey));
}

export function buildNewBannerSection(
  config: PageBannerConfig,
  pageId: string,
  image: string
) {
  return {
    pageId,
    sectionKey: config.sectionKey,
    sectionName: config.labelEn,
    title: { en: config.labelEn, ar: config.labelAr },
    subtitle: { en: '', ar: '' },
    description: { en: '', ar: '' },
    buttonText: { en: '', ar: '' },
    buttonUrl: '',
    image,
    backgroundImage: '',
    videoUrl: '',
    customData: [],
    sortOrder: config.sortOrder,
    isActive: true,
  };
}
