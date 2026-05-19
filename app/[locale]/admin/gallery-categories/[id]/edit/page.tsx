'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ContentCategoryForm } from '@/components/admin/ContentCategoryForm';

export default function EditGalleryCategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/gallery-categories/${id}`)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Category not found</p>;

  return (
    <ContentCategoryForm
      apiBase="/gallery-categories"
      listPath="/admin/gallery-categories"
      titleCreate="Add Gallery Category"
      titleEdit="Edit Gallery Category"
      initialData={data}
    />
  );
}
