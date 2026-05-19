'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { ContentCategoryForm } from '@/components/admin/ContentCategoryForm';

export default function EditNewsCategoryPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get(`/news-categories/${id}`)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>Category not found</div>;

  return (
    <ContentCategoryForm
      apiBase="/news-categories"
      listPath="/admin/news-categories"
      titleCreate="Add News Category"
      titleEdit="Edit News Category"
      initialData={data}
    />
  );
}
