'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreatePage() { return <PageForm /> }

export function PageForm({ initialData }: any) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || { 
    title: { en: "", ar: "" }, 
    slug: "", 
    templateKey: "default", 
    status: "published" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) await apiClient.put(`/pages/${initialData.id}`, formData);
      else await apiClient.post('/pages', formData);
      router.push('/admin/pages');
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
      [field]: { ...(prev[field] || {}), [lang]: value }
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold">{isEdit ? 'Page Settings' : 'Create New Page'}</h3>
        <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
          <Button 
            type="button" 
            variant={activeLang === 'en' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveLang('en')}
            className="h-7 text-[10px] px-2"
          >
            EN
          </Button>
          <Button 
            type="button" 
            variant={activeLang === 'ar' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setActiveLang('ar')}
            className="h-7 text-[10px] px-2"
          >
            AR
          </Button>
        </div>
      </div>
      
      {error && <div className="text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 text-sm">{error}</div>}
      
      <div className="space-y-2">
        <Label htmlFor="title">Page Title ({activeLang})</Label>
        <Input 
          id="title"
          value={formData.title?.[activeLang] || ''} 
          onChange={e => updateTranslatable('title', activeLang, e.target.value)} 
          placeholder={activeLang === 'en' ? 'e.g., About Us' : 'مثلاً: من نحن'}
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
          placeholder="e.g., about-us"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <select 
          id="status"
          className="w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm focus:ring-2 focus:ring-primary"
          value={formData.status}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Saving...' : 'Save Page'}
      </Button>
    </form>
  );
}