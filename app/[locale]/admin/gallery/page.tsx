'use client';

import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Image as ImageIcon, FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminPath } from '@/lib/admin-path';
import { PageBannerEditor } from '@/components/admin/PageBannerEditor';
import { cn } from '@/lib/utils';

export default function AdminGalleryHubPage() {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const steps = [
    {
      step: '1',
      title: isRtl ? 'ارفع الملفات' : 'Upload files',
      text: isRtl
        ? 'من مكتبة الوسائط — أي صورة أو فيديو أو PDF. مش لازم تظهر في الجاليري.'
        : 'From Media Library — any image, video, or PDF. Gallery display is optional.',
      href: '/admin/media',
      primary: true,
    },
    {
      step: '2',
      title: isRtl ? 'تصنيفات الجاليري (اختياري)' : 'Gallery categories (optional)',
      text: isRtl
        ? 'لو عايز فلاتر في معرض الصور/الفيديو — أضف تصنيفات هنا.'
        : 'Only if you want filters on the public photo/video gallery pages.',
      href: '/admin/gallery-categories',
    },
    {
      step: '3',
      title: isRtl ? 'تفعيل الظهور في الجاليري' : 'Show in gallery',
      text: isRtl
        ? 'عند الرفع أو التعديل: فعّل «عرض في الجاليري» + اختَر التصنيف.'
        : 'On upload or edit: enable “Show in gallery” and pick a category.',
      href: '/admin/media',
    },
  ];

  const previewCards = [
    {
      title: isRtl ? 'معاينة الصور' : 'Preview photos',
      subtitle: isRtl ? 'الموقع العام' : 'Public site',
      href: '/gallery/photos',
      icon: ImageIcon,
    },
    {
      title: isRtl ? 'معاينة الفيديو' : 'Preview videos',
      subtitle: isRtl ? 'الموقع العام' : 'Public site',
      href: '/gallery/videos',
      icon: FolderOpen,
    },
  ];

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isRtl ? 'إدارة الجاليري والوسائط' : 'Gallery & Media'}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-3xl leading-relaxed">
          {isRtl ? (
            <>
              <strong>مكتبة الوسائط</strong> = كل ملفات الموقع (تقدر تخفيها من الجاليري).
              الجاليري العام يعرض فقط الملفات اللي عليها «عرض في الجاليري».
            </>
          ) : (
            <>
              <strong>Media Library</strong> = all site files (can stay hidden from gallery).
              Public gallery only shows items marked “Show in gallery”.
            </>
          )}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          {isRtl ? 'بانرات صفحات الجاليري' : 'Gallery page banners'}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PageBannerEditor pageSlug="gallery" sectionKey="gallery-photos-hero" />
          <PageBannerEditor pageSlug="gallery" sectionKey="gallery-videos-hero" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {steps.map((item) => (
          <div
            key={item.step}
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
          >
            <span className="text-primary font-bold text-lg">{item.step}</span>
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-sm text-muted-foreground flex-1">{item.text}</p>
            <Button
              asChild
              variant={item.primary ? 'default' : 'outline'}
              className={cn('w-fit', isRtl ? 'me-auto' : 'ms-auto')}
            >
              <Link href={adminPath(item.href)}>
                {isRtl ? 'افتح' : 'Open'}
                <ArrowLeft
                  className={cn('w-4 h-4', isRtl ? 'mr-2 rotate-180' : 'ml-2')}
                />
              </Link>
            </Button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {previewCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.href}
              className="bg-card/50 border border-dashed border-border rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div>
                  <h3 className="font-medium">{card.title}</h3>
                  <p className="text-xs text-muted-foreground">{card.subtitle}</p>
                </div>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn('w-fit', isRtl ? 'me-auto' : 'ms-auto')}
              >
                <Link href={card.href} target="_blank">
                  {isRtl ? 'معاينة' : 'Preview'}
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
