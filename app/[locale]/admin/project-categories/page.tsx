'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { formatBilingual } from '@/lib/translate';
import { useTranslations } from 'next-intl';

export default function ProjectCategoriesList() {
  const tTable = useTranslations('admin.table');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/project-categories');
      setItems(res.data.data);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      await apiClient.delete(`/project-categories/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">ProjectCategories</h1>
        <Button asChild>
          <Link href={`/admin/project-categories/create`}>
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-lg border border-border text-muted-foreground">
          No ProjectCategories found.
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tTable('id')}</TableHead>
                <TableHead>{tTable('name')}</TableHead>
                <TableHead>{tTable('createdAt')}</TableHead>
                <TableHead className="text-end">{tTable('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.id.slice(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground">
                        {formatBilingual(item.name || item.title)}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.slug}</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/project-categories/${item.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}