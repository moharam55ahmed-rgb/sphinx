import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ProjectDetail } from './ProjectDetail';
import { projects } from '@/data/site';
import { getProjectBySlug, getProjects } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  try {
    const dynamicProjects = await getProjects();
    return dynamicProjects.map((project: any) => ({
      slug: project.slug,
    }));
  } catch (err) {
    return projects.map((project) => ({
      slug: project.slug,
    }));
  }
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  
  let project: any = null;
  try {
    project = await getProjectBySlug(slug);
  } catch (err) {
    project = projects.find((p) => p.slug === slug);
  }

  if (!project) {
    return { title: 'Project Not Found' };
  }

  const isArabic = locale === 'ar';

  const projectTitle = project.title
    ? translate(project.title, locale)
    : isArabic
      ? project.nameAr
      : project.nameEn;
  const projectDescription = translate(
    project.shortDescription || project.shortDesc || project.description,
    locale
  ) || (isArabic ? project.shortDescAr : project.shortDescEn);

  return {
    title: `${projectTitle} | ${isArabic ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
    description: projectDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let project: any = null;
  try {
    project = await getProjectBySlug(slug);
  } catch (err) {
    project = projects.find((p) => p.slug === slug);
  }

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
