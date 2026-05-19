'use client';
import { useEffect, useState, use } from 'react';
import { apiClient } from '@/lib/api-client';
import { NewsForm } from '@/components/admin/NewsForm';

export default function EditNews({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<any>(null);
  
  useEffect(() => { 
    if (id) {
      apiClient.get(`/news/${id}`)
        .then(res => setInitialData(res.data.data))
        .catch(err => console.error("Failed to load news", err));
    }
  }, [id]);
  
  if(!initialData) return <div className="p-8 text-center">Loading article data...</div>;
  return <NewsForm initialData={initialData} />;
}
