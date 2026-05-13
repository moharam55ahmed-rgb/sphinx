import type { Metadata } from 'next';
import { Inter, Cairo, Tajawal } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeDirection, type Locale } from '@/i18n/config';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { ThemeProvider } from '@/components/providers/theme-provider';


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
  return locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  
  const isArabic = locale === 'ar';
  
  return {
    title: isArabic 
      ? 'سفنكس للتطوير العقاري | فرص استثمارية عقارية مميزة'
      : 'SPHINX Real Estate Development | Premium Real Estate Investment',
    description: isArabic
      ? 'شركة سفنكس للتطوير العقاري تقدم مشروعات تجارية وإدارية وطبية بمدينة الشروق برؤية عصرية وفرص استثمارية موثوقة.'
      : 'SPHINX Real Estate Development offers commercial, administrative, and medical real estate projects in El Shorouk City with a modern vision and trusted investment opportunities.',
    icons: {
      icon: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  
  if (!locales.includes(locale as Locale)) {
    notFound();
  }
  
  setRequestLocale(locale);
  
  const messages = await getMessages();
  const direction = localeDirection[locale as Locale];
  const isArabic = locale === 'ar';

  return (
    <html lang={locale} dir={direction} className="bg-background">
      <body
        className={`${inter.variable} ${tajawal.variable} ${cairo.variable} ${
          isArabic ? 'font-arabic' : 'font-sans'
        } antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <ScrollToTop />
            <WhatsAppButton />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
