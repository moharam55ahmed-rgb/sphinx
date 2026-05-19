'use client';

import { use, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { RedirectForm } from '../../create/page';

export default function EditRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    apiClient.get(`/redirects/${id}`).then((res) => setInitialData(res.data.data));
  }, [id]);

  if (!initialData) return <div>Loading...</div>;
  return <RedirectForm initialData={initialData} />;
}
