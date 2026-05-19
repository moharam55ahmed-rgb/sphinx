'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getNewsCategoryLabel } from '@/lib/news-categories';

export default function NewsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    try {
      const res = await apiClient.get('/news');
      setData(res.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news item?')) return;
    try {
      await apiClient.delete(`/news/${id}`);
      fetchNews();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
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
    {
      key: 'category',
      label: 'Category',
      render: (row: any) => (
        <span className="text-sm capitalize">
          {getNewsCategoryLabel(row.category || 'projects', 'en')}
        </span>
      ),
    },
    { key: 'status', label: 'Status' },
    { 
      key: 'publishedAt', 
      label: 'Date', 
      render: (row: any) => new Date(row.publishedAt).toLocaleDateString() 
    }
  ];

  if (loading) return <div className="p-8 text-center">Loading news...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">News & Blog</h1>
        <Button asChild>
          <Link href="/admin/news/create">
            <Plus className="w-4 h-4 mr-2" />
            Add News Item
          </Link>
        </Button>
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">{error}</div>}

      <DataTable 
        columns={columns} 
        data={data} 
        onDelete={handleDelete} 
        editHref={(id) => `/admin/news/${id}/edit`} 
      />
    </div>
  );
}
