import type { Metadata } from 'next';
import { Inter, Cairo, Tajawal } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { FloatingContactButtons } from '@/components/layout/FloatingContactButtons';
import { LocaleHtmlAttributes } from '@/components/providers/locale-html-attributes';
import { VisitTracker } from '@/components/analytics/VisitTracker';
import { getSeoBySlug, getSettings } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800', '900'],
  variable: '--font-tajawal',
});

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const isArabic = locale === 'ar';

  let seo: any = null;
  let settings: any = null;
  try {
    const [seoRes, settingsRes] = await Promise.all([
      getSeoBySlug('home'),
      getSettings(),
    ]);
    seo = seoRes;
    settings = settingsRes;
  } catch (err) {
    console.error('Metadata fetch error', err);
  }

  const defaultTitle = isArabic
    ? 'سفنكس للتطوير العقاري | فرص استثمارية عقارية مميزة'
    : 'SPHINX Real Estate Development | Premium Real Estate Investment';
  const defaultDescription = isArabic
    ? 'شركة سفنكس للتطوير العقاري تقدم مشروعات تجارية وإدارية وطبية بمدينة الشروق برؤية عصرية وفرص استثمارية موثوقة.'
    : 'SPHINX Real Estate Development offers commercial, administrative, and medical real estate projects in El Shorouk City with a modern vision and trusted investment opportunities.';

  const metaTitle = seo?.metaTitle
    ? translate(seo.metaTitle, locale)
    : defaultTitle;
  const metaDescription = seo?.metaDescription
    ? translate(seo.metaDescription, locale)
    : defaultDescription;

  const faviconUrl = resolveMediaUrl(settings?.favicon?.url || '/favicon.svg');
  const faviconType = faviconUrl.endsWith('.svg')
    ? 'image/svg+xml'
    : faviconUrl.endsWith('.png')
      ? 'image/png'
      : undefined;

  return {
    title: metaTitle,
    description: metaDescription,
    icons: {
      icon: faviconType
        ? [{ url: faviconUrl, type: faviconType }]
        : faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: seo
      ? {
          title: translate(seo.ogTitle || seo.metaTitle, locale),
          description: translate(
            seo.ogDescription || seo.metaDescription,
            locale
          ),
          images: seo.ogImage ? [{ url: resolveMediaUrl(seo.ogImage) }] : [],
        }
      : undefined,
    twitter: seo
      ? {
          title: translate(
            seo.twitterTitle || seo.ogTitle || seo.metaTitle,
            locale
          ),
          description: translate(
            seo.twitterDescription || seo.ogDescription || seo.metaDescription,
            locale
          ),
          images: seo.twitterImage ? [resolveMediaUrl(seo.twitterImage)] : [],
        }
      : undefined,
    alternates: {
      canonical: seo?.canonicalUrl || undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const isArabic = locale === 'ar';

  return (
    <>
      <LocaleHtmlAttributes locale={locale} />
      <div
        className={`${inter.variable} ${tajawal.variable} ${cairo.variable} ${
          isArabic ? 'font-arabic' : 'font-sans'
        } min-h-screen antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <div className="min-h-screen flex flex-col">
            <VisitTracker />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollToTop />
          <FloatingContactButtons />
        </NextIntlClientProvider>
      </div>
    </>
  );
}
