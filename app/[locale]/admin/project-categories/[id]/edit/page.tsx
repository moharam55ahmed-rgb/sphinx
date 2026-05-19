'use client';
import { useEffect, useState, use } from 'react';
import { apiClient } from '@/lib/api-client';
import { CategoryForm } from '../../create/page';

export default function EditCategory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<any>(null);
  
  useEffect(() => { 
    if (id) {
      apiClient.get(`/project-categories/${id}`)
        .then(res => setInitialData(res.data.data))
        .catch(err => console.error("Failed to load category", err));
    }
  }, [id]);
  
  if(!initialData) return <div className="p-8 text-center">Loading category data...</div>;
  return <CategoryForm initialData={initialData} />;
}