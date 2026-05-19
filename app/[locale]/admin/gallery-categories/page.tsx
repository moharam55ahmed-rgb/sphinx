'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { formatBilingual } from '@/lib/translate';
import { useAdminPath } from '@/lib/admin-path';
import { useLocale, useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

export default function GalleryCategoriesPage() {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('admin');
  const tTable = useTranslations('admin.table');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/gallery-categories');
      setItems(res.data.data);
      setError('');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || '';
      setError(
        msg.includes('findMany')
          ? 'Restart API: cd backend && npx prisma generate && npm run dev'
          : msg || 'Failed to fetch gallery categories'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await apiClient.delete(`/gallery-categories/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        Categories appear automatically in gallery photo & video filters on the website. Use the same slug when
        uploading media.
      </p>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t('galleryCategories')}</h1>
        <Button asChild>
          <Link href={adminPath('/admin/gallery-categories/create')}>
            <Plus className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
            {isRtl ? 'إضافة تصنيف' : 'Add Category'}
          </Link>
        </Button>
      </div>

      {error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-lg border border-border text-muted-foreground">
          No categories found.
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{tTable('name')}</TableHead>
                <TableHead>{tTable('slug')}</TableHead>
                <TableHead>{tTable('order')}</TableHead>
                <TableHead className="text-end">{tTable('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="font-semibold">{formatBilingual(item.name)}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{item.slug}</TableCell>
                  <TableCell>{item.sortOrder}</TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={adminPath(`/admin/gallery-categories/${item.id}/edit`)}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
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
