'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const res = await apiClient.get('/projects');
      setData(res.data.data);
    } catch(e:any) { setError(e.response?.data?.message || 'Error loading'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/projects/${id}`);
      fetch();
    } catch(e:any) { alert(e.response?.data?.message || 'Delete failed'); }
  };

  const columns = [
    { 
      key: 'title', 
      label: 'Title', 
      render: (row: any) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground">
            {typeof row.title === 'object' ? `${row.title.en} (${row.title.ar})` : row.title}
          </span>
          <span className="text-xs text-muted-foreground">{row.slug}</span>
        </div>
      )
    },
    { key: 'status', label: 'Status' },
    { key: 'isFeatured', label: 'Featured', render: (row:any) => row.isFeatured ? 'Yes' : 'No' }
  ];

  if(loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild><Link href="/admin/projects/create"><Plus className="w-4 h-4 mr-2" /> Add Project</Link></Button>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      <DataTable columns={columns} data={data} onDelete={handleDelete} editHref={(id: string) => `/admin/projects/${id}/edit`} />
    </div>
  );
}