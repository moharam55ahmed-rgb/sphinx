'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { toast } from 'sonner';
import { useAdminPath } from '@/lib/admin-path';
import { formatBilingual } from '@/lib/translate';
import { resolveMediaUrl } from '@/lib/media-url';

export function NewsForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const adminPath = useAdminPath();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || {
    title: { en: '', ar: '' },
    slug: '',
    content: { en: '', ar: '' },
    excerpt: { en: '', ar: '' },
    category: 'projects',
    status: 'published',
    mainImage: '',
    publishedAt: new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    apiClient
      .get('/news-categories')
      .then((res) => setCategories(res.data.data || []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await apiClient.put(`/news/${initialData.id}`, formData);
        toast.success("Article updated");
      } else {
        await apiClient.post('/news', formData);
        toast.success("Article created");
      }
      router.push(adminPath('/admin/news'));
      router.refresh();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save');
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl bg-card p-8 border border-border rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isEdit ? 'Edit Article' : 'Create New Article'}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Title ({activeLang})</Label>
          <Input
            required
            value={formData.title?.[activeLang] || ''}
            onChange={e => updateTranslatable('title', activeLang, e.target.value)}
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="space-y-2">
          <Label>Slug (URL)</Label>
          <Input
            required
            value={formData.slug}
            onChange={e => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., new-project-launch"
          />
        </div>

        <div className="space-y-2">
          <Label>Category / التصنيف</Label>
          <Select
            value={formData.category || 'projects'}
            onValueChange={(v) => setFormData({ ...formData, category: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.slug} value={cat.slug}>
                  {formatBilingual(cat.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Publish Date</Label>
          <Input
            type="date"
            value={formData.publishedAt?.split('T')[0]}
            onChange={e => setFormData({ ...formData, publishedAt: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Excerpt / Summary ({activeLang})</Label>
        <Textarea
          value={formData.excerpt?.[activeLang] || ''}
          onChange={e => updateTranslatable('excerpt', activeLang, e.target.value)}
          rows={2}
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-2">
        <Label>Full Content ({activeLang})</Label>
        <Textarea
          value={formData.content?.[activeLang] || ''}
          onChange={e => updateTranslatable('content', activeLang, e.target.value)}
          rows={10}
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-2">
        <Label>Featured Image</Label>
        <div className="space-y-2">
          {formData.mainImage && <img src={resolveMediaUrl(formData.mainImage)} className="h-40 w-full object-cover rounded-lg border" />}
          <MediaSelector onSelect={url => setFormData({ ...formData, mainImage: url })} triggerText={formData.mainImage ? "Change Image" : "Select Image"} />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Article'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
