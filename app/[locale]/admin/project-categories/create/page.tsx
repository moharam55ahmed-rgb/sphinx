'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateCategory() { return <CategoryForm /> }

export function CategoryForm({ initialData }: any) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || { 
    name: { en: "", ar: "" }, 
    slug: "", 
    description: { en: "", ar: "" } 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await apiClient.put(`/project-categories/${initialData.id}`, formData);
      else await apiClient.post('/project-categories', formData);
      router.push('/admin/project-categories');
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
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Edit Category' : 'Create Category'}</h1>
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
      
      {error && <div className="text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="name">Category Name ({activeLang})</Label>
        <Input 
          id="name"
          value={formData.name?.[activeLang] || ''} 
          onChange={e => updateTranslatable('name', activeLang, e.target.value)} 
          placeholder={activeLang === 'en' ? 'e.g., Commercial' : 'مثلاً: تجاري'}
          required
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <Input 
          id="slug"
          value={formData.slug} 
          onChange={e => setFormData({ ...formData, slug: e.target.value })} 
          placeholder="e.g., commercial"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description ({activeLang})</Label>
        <Textarea 
          id="description"
          value={formData.description?.[activeLang] || ''} 
          onChange={e => updateTranslatable('description', activeLang, e.target.value)} 
          placeholder="Category description..."
          rows={4}
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Category'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}