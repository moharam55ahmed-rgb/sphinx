'use client';

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { SectionForm } from '../../create/page';
import { useAdminPath } from '@/lib/admin-path';

export default function EditSection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const adminPath = useAdminPath();
  const [initialData, setInitialData] = useState<any>(null);
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || loadedIdRef.current === id) return;

    let cancelled = false;
    loadedIdRef.current = id;

    apiClient
      .get(`/sections/${id}`)
      .then((res) => {
        if (cancelled) return;
        const data = res.data.data;
        const key = (data?.sectionKey ?? '').toLowerCase();
        if (
          key === 'related-companies' ||
          key.includes('related') ||
          key.includes('compan')
        ) {
          router.replace(adminPath('/admin/related-companies'));
          return;
        }
        setInitialData(data);
      })
      .catch((err) => {
        if (!cancelled) console.error('Failed to load section', err);
        loadedIdRef.current = null;
      });

    return () => {
      cancelled = true;
    };
  }, [id, router, adminPath]);

  if (!initialData) {
    return <div className="p-8 text-center">Loading section data...</div>;
  }
  return <SectionForm initialData={initialData} />;
}
