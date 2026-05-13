import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ProjectDetail } from './ProjectDetail';
import { projects } from '@/data/site';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const isArabic = locale === 'ar';

  return {
    title: `${isArabic ? project.nameAr : project.nameEn} | ${isArabic ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
    description: isArabic ? project.shortDescAr : project.shortDescEn,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
