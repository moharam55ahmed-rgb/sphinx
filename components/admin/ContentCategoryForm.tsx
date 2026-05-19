'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAdminPath } from '@/lib/admin-path';

type ContentCategoryFormProps = {
  apiBase: string;
  listPath: string;
  titleCreate: string;
  titleEdit: string;
  initialData?: any;
};

export function ContentCategoryForm({
  apiBase,
  listPath,
  titleCreate,
  titleEdit,
  initialData,
}: ContentCategoryFormProps) {
  const router = useRouter();
  const adminPath = useAdminPath();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(
    initialData || {
      name: { en: '', ar: '' },
      slug: '',
      sortOrder: 0,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder) || 0,
      };
      if (isEdit) await apiClient.put(`${apiBase}/${initialData.id}`, payload);
      else await apiClient.post(apiBase, payload);
      router.push(adminPath(listPath));
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const updateTranslatable = (field: string, lang: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value },
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-card p-6 border border-border rounded-lg shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? titleEdit : titleCreate}
        </h1>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeLang === 'en' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveLang('en')}
          >
            English
          </Button>
          <Button
            type="button"
            variant={activeLang === 'ar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveLang('ar')}
          >
            العربية
          </Button>
        </div>
      </div>

      {error && (
        <div className="text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Name ({activeLang})</Label>
        <Input
          value={formData.name?.[activeLang] || ''}
          onChange={(e) => updateTranslatable('name', activeLang, e.target.value)}
          required
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-2">
        <Label>Slug (used in filters)</Label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., exhibitions"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Sort order</Label>
        <Input
          type="number"
          value={formData.sortOrder ?? 0}
          onChange={(e) =>
            setFormData({ ...formData, sortOrder: parseInt(e.target.value, 10) || 0 })
          }
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
