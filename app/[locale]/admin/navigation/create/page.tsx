'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { formatBilingual } from '@/lib/translate';
import { useAdminPath } from '@/lib/admin-path';

function normalizeLabel(label: any) {
  if (!label) return { en: '', ar: '' };
  if (typeof label === 'string') return { en: label, ar: label };
  if (typeof label === 'object' && ('en' in label || 'ar' in label)) {
    return { en: label.en || '', ar: label.ar || '' };
  }
  return { en: '', ar: '' };
}

export default function CreateNavigation() {
  return <NavigationForm />;
}

export function NavigationForm({ initialData }: { initialData?: any }) {
  const router = useRouter();
  const adminPath = useAdminPath();
  const isEdit = !!initialData;
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        ...initialData,
        label: normalizeLabel(initialData.label),
        location: (initialData.location || 'header').toLowerCase(),
      };
    }
    return {
      label: { en: '', ar: '' },
      url: '',
      location: 'header',
      parentId: null,
      sortOrder: 0,
      isActive: true,
      openInNewTab: false,
    };
  });
  const [loading, setLoading] = useState(false);
  const [potentialParents, setPotentialParents] = useState<any[]>([]);

  useEffect(() => {
    apiClient
      .get('/navigation')
      .then((res) => {
        const filtered = res.data.data.filter(
          (item: any) => !item.parentId && item.id !== initialData?.id
        );
        setPotentialParents(filtered);
      })
      .catch(() => {});
  }, [initialData?.id]);

  const updateLabel = (lang: 'en' | 'ar', value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      label: { ...prev.label, [lang]: value },
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        location: String(formData.location).toLowerCase(),
      };
      if (isEdit) await apiClient.put(`/navigation/${initialData.id}`, payload);
      else await apiClient.post('/navigation', payload);
      toast.success('Navigation item saved');
      router.push(adminPath('/admin/navigation'));
      router.refresh();
    } catch {
      toast.error('Failed to save navigation item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isEdit ? 'Edit Menu Item' : 'Create Menu Item'}
        </h1>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Item'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Link Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={activeLang} onValueChange={(v) => setActiveLang(v as 'en' | 'ar')}>
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            <TabsContent value="en" className="space-y-2 pt-2">
              <Label>Label (English)</Label>
              <Input
                required={activeLang === 'en'}
                value={formData.label.en}
                onChange={(e) => updateLabel('en', e.target.value)}
                placeholder="Home, Projects, etc."
              />
            </TabsContent>
            <TabsContent value="ar" className="space-y-2 pt-2">
              <Label>Label (Arabic)</Label>
              <Input
                required={activeLang === 'ar'}
                value={formData.label.ar}
                onChange={(e) => updateLabel('ar', e.target.value)}
                dir="rtl"
                placeholder="الرئيسية، المشاريع..."
              />
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label>URL / Path</Label>
            <Input
              required
              value={formData.url}
              onChange={(e) => updateField('url', e.target.value)}
              placeholder="/projects or https://..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <select
                className="w-full h-10 px-3 py-2 bg-background border rounded-md"
                value={formData.location}
                onChange={(e) => updateField('location', e.target.value)}
              >
                <option value="header">Header Menu</option>
                <option value="footer">Footer Menu</option>
                <option value="mobile">Mobile Menu</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Parent Item (For dropdowns)</Label>
              <select
                className="w-full h-10 px-3 py-2 bg-background border rounded-md"
                value={formData.parentId || ''}
                onChange={(e) => updateField('parentId', e.target.value || null)}
              >
                <option value="">None (Top Level)</option>
                {potentialParents.map((p) => (
                  <option key={p.id} value={p.id}>
                    {formatBilingual(p.label)} ({p.location})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input
                type="number"
                value={formData.sortOrder}
                onChange={(e) => updateField('sortOrder', parseInt(e.target.value, 10) || 0)}
              />
            </div>
            <div className="flex flex-col gap-4 justify-center">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.isActive}
                  onChange={(e) => updateField('isActive', e.target.checked)}
                />
                <Label htmlFor="active">Is Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newTab"
                  checked={formData.openInNewTab}
                  onChange={(e) => updateField('openInNewTab', e.target.checked)}
                />
                <Label htmlFor="newTab">Open in New Tab</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
