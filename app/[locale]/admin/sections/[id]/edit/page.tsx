'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { apiClient } from '@/lib/api-client';
import { SectionForm } from '../../create/page';
import { useAdminPath } from '@/lib/admin-path';
import { Button } from '@/components/ui/button';
import { useLocale } from 'next-intl';

function getDedicatedEditorPath(sectionKey: string, adminPath: (path: string) => string) {
  switch (sectionKey) {
    case 'related-companies':
      return adminPath('/admin/related-companies');
    case 'team-members':
      return adminPath('/admin/team');
    default:
      return null;
  }
}

export default function EditSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [initialData, setInitialData] = useState<any>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'redirecting'>('loading');

  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    setStatus('loading');
    setInitialData(null);

    apiClient
      .get(`/sections/${id}`)
      .then((res) => {
        if (cancelled) return;
        const data = res.data.data;
        const dedicatedEditor = getDedicatedEditorPath(data?.sectionKey ?? '', adminPath);
        if (dedicatedEditor) {
          setStatus('redirecting');
          router.replace(dedicatedEditor);
          return;
        }
        setInitialData(data);
        setStatus('ready');
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Failed to load section', err);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [id, router, adminPath]);

  if (status === 'loading' || status === 'redirecting') {
    return (
      <div className="p-8 text-center">
        {status === 'redirecting'
          ? isRtl
            ? 'جاري التوجيه إلى المحرر المناسب...'
            : 'Redirecting to the dedicated editor...'
          : isRtl
            ? 'جاري تحميل بيانات القسم...'
            : 'Loading section data...'}
      </div>
    );
  }

  if (status === 'error' || !initialData) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground">
          {isRtl
            ? 'القسم غير موجود. ربما تمت إعادة تهيئة قاعدة البيانات وتغيّرت المعرفات.'
            : 'Section not found. The database may have been re-seeded and IDs changed.'}
        </p>
        <Button asChild variant="outline">
          <Link href={adminPath('/admin/pages')}>
            {isRtl ? 'العودة إلى الصفحات' : 'Back to Pages'}
          </Link>
        </Button>
      </div>
    );
  }

  return <SectionForm initialData={initialData} />;
}
