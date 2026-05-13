import { ContactContent } from './ContactContent';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic ? 'اتصل بنا | سفنكس للتطوير العقاري' : 'Contact Us | SPHINX Real Estate',
    description: isArabic
      ? 'تواصل معنا للاستفسار عن مشاريعنا والفرص الاستثمارية المتاحة'
      : 'Contact us to inquire about our projects and available investment opportunities',
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
