'use client';

import { useEffect, useState, use } from 'react';
import { apiClient } from '@/lib/api-client';
import { ProjectForm } from '@/components/admin/ProjectForm';

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.get(`/projects/${id}`)
      .then(res => {
        setInitialData(res.data.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load project');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading Project Data...</div>;
  if (error) return <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Edit Project</h2>
        <p className="text-muted-foreground">Modify the details of your project.</p>
      </div>
      <ProjectForm initialData={initialData} />
    </div>
  );
}