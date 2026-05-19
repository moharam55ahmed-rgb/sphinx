'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useAdminPath } from '@/lib/admin-path';

export default function SeoList() {
  const adminPath = useAdminPath();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const res = await apiClient.get('/seo');
      setData(res.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load SEO records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this SEO record?')) return;
    try {
      await apiClient.delete(`/seo/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const columns = [
    {
      key: 'slug',
      label: 'Slug',
      render: (row: any) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold">{row.slug}</span>
          <span className="text-xs text-muted-foreground">{row.pageType}</span>
        </div>
      ),
    },
    {
      key: 'metaTitle',
      label: 'Meta Title',
      render: (row: any) => (
        <span className="text-sm line-clamp-2">
          {typeof row.metaTitle === 'object'
            ? row.metaTitle?.en || row.metaTitle?.ar
            : row.metaTitle}
        </span>
      ),
    },
  ];

  if (loading) return <div>Loading SEO...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">SEO Management</h1>
        <Button asChild>
          <Link href={adminPath('/admin/seo/create')}>
            <Plus className="w-4 h-4 mr-2" /> Add SEO Record
          </Link>
        </Button>
      </div>
      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}
      <DataTable
        columns={columns}
        data={data}
        onDelete={handleDelete}
        editHref={(id: string) => adminPath(`/admin/seo/${id}/edit`)}
      />
    </div>
  );
}
