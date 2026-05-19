'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaSelector } from '@/components/admin/MediaSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from 'lucide-react';

export function ProjectForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || {
    title: { en: '', ar: '' },
    slug: '',
    shortDescription: { en: '', ar: '' },
    description: { en: '', ar: '' },
    categoryId: '',
    status: 'published',
    isFeatured: false,
    mainImage: '',
    location: '',
    gallery: [] as string[],
    features: [] as { en: string; ar: string }[],
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    apiClient.get('/project-categories')
      .then(res => setCategories(res.data.data))
      .catch(err => console.error("Failed to fetch categories", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isEdit) {
        await apiClient.put(`/projects/${initialData.id}`, formData);
      } else {
        await apiClient.post('/projects', formData);
      }
      router.push('/admin/projects');
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save project');
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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl bg-card p-8 border border-border rounded-xl shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {isEdit ? 'Edit Project' : 'Create New Project'}
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

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title ({activeLang})</Label>
          <Input
            id="title"
            required
            value={formData.title?.[activeLang] || ''}
            onChange={e => updateTranslatable('title', activeLang, e.target.value)}
            placeholder={activeLang === 'en' ? 'e.g., City Hub Mall' : 'مثلاً: سيتي هاب مول'}
            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            required
            value={formData.slug}
            onChange={e => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., city-hub-mall"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={formData.categoryId || "none"}
            onValueChange={(val) => setFormData({ ...formData, categoryId: val === "none" ? null : val })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Category</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {typeof cat.name === 'object' ? cat.name[activeLang] : cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(val) => setFormData({ ...formData, status: val })}
          >
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDesc">Short Description ({activeLang})</Label>
        <Textarea
          id="shortDesc"
          value={formData.shortDescription?.[activeLang] || ''}
          onChange={e => updateTranslatable('shortDescription', activeLang, e.target.value)}
          placeholder="Brief summary for listings..."
          rows={2}
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc">Full Description ({activeLang})</Label>
        <Textarea
          id="desc"
          value={formData.description?.[activeLang] || ''}
          onChange={e => updateTranslatable('description', activeLang, e.target.value)}
          placeholder="Detailed project description..."
          rows={6}
          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-4">
        <Label>Main Image</Label>
        <div className="flex flex-col gap-4 p-4 border border-dashed rounded-lg bg-muted/30">
          {formData.mainImage && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <img src={formData.mainImage} alt="Preview" className="w-full h-full object-cover" />
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => setFormData({...formData, mainImage: ''})}
              >
                Remove
              </Button>
            </div>
          )}
          <div className="flex justify-center">
            <MediaSelector onSelect={(url) => setFormData({ ...formData, mainImage: url })} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Quick Facts / حقائق سريعة</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              setFormData({
                ...formData,
                features: [...(formData.features || []), { en: '', ar: '' }],
              })
            }
          >
            <Plus className="w-4 h-4 mr-1" />
            Add fact
          </Button>
        </div>
        {(formData.features || []).map((feat: { en: string; ar: string }, index: number) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-border rounded-lg relative"
          >
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">English</Label>
              <Input
                value={feat.en || ''}
                onChange={(e) => {
                  const next = [...(formData.features || [])];
                  next[index] = { ...next[index], en: e.target.value };
                  setFormData({ ...formData, features: next });
                }}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">العربية</Label>
              <Input
                value={feat.ar || ''}
                onChange={(e) => {
                  const next = [...(formData.features || [])];
                  next[index] = { ...next[index], ar: e.target.value };
                  setFormData({ ...formData, features: next });
                }}
                dir="rtl"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive"
              onClick={() => {
                const next = (formData.features || []).filter((_: unknown, i: number) => i !== index);
                setFormData({ ...formData, features: next });
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <Label>Project Gallery / معرض المشروع</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {(formData.gallery || []).map((url: string, index: number) => (
            <div key={`${url}-${index}`} className="relative aspect-[4/3] rounded-lg overflow-hidden border">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-7 w-7"
                onClick={() => {
                  const next = (formData.gallery || []).filter((_: string, i: number) => i !== index);
                  setFormData({ ...formData, gallery: next });
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
        <MediaSelector
          onSelect={(url) =>
            setFormData({
              ...formData,
              gallery: [...(formData.gallery || []), url],
            })
          }
        />
      </div>

      <div className="flex items-center space-x-2 p-4 bg-muted/20 rounded-lg">
        <Checkbox 
          id="isFeatured" 
          checked={formData.isFeatured} 
          onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked === true})} 
        />
        <Label htmlFor="isFeatured" className="cursor-pointer">Feature this project on the homepage</Label>
      </div>

      <div className="flex gap-4 pt-6 border-t">
        <Button type="submit" disabled={loading} className="flex-1 h-12 text-lg">
          {loading ? 'Saving Project...' : isEdit ? 'Update Project' : 'Create Project'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} className="h-12 px-8">
          Cancel
        </Button>
      </div>
    </form>
  );
}
