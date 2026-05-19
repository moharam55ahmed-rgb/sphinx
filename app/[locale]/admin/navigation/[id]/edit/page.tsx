'use client';

import { use, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { NavigationForm } from '../../create/page';

export default function EditNavigationItem({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    apiClient.get(`/navigation/${id}`).then((res) => setInitialData(res.data.data));
  }, [id]);

  if (!initialData) return <div>Loading...</div>;
  return <NavigationForm initialData={initialData} />;
}
