import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ProjectsListing } from './ProjectsListing';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'sections' });
  const tMeta = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: `${t('projects')} | ${locale === 'ar' ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate'}`,
    description: tMeta('description'),
  };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProjectsListing />;
}
