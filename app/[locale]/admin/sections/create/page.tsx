'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Layout, Image as ImageIcon, List, Layers } from 'lucide-react';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { TeamMembersEditor } from '@/components/admin/TeamMembersEditor';
import { RelatedCompaniesEditor } from '@/components/admin/RelatedCompaniesEditor';
import { normalizeTeamMembers } from '@/lib/team';
import { normalizeRelatedCompanies } from '@/lib/related-companies';
import { toast } from 'sonner';
import { useLocale } from 'next-intl';
import { resolveMediaUrl } from '@/lib/media-url';

export default function CreateSection() { return <SectionForm /> }

const EMPTY_SECTION_FORM = {
  pageId: '',
  sectionKey: '',
  sectionName: '',
  title: { en: '', ar: '' },
  subtitle: { en: '', ar: '' },
  description: { en: '', ar: '' },
  buttonText: { en: '', ar: '' },
  buttonUrl: '',
  image: '',
  backgroundImage: '',
  videoUrl: '',
  sortOrder: 0,
  isActive: true,
  customData: [] as any[],
};

function normalizeTranslatable(
  value: unknown,
  fallback = ''
): { en: string; ar: string } {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const v = value as { en?: string | null; ar?: string | null };
    return { en: v.en ?? fallback, ar: v.ar ?? fallback };
  }
  const text = typeof value === 'string' ? value : fallback;
  return { en: text, ar: text };
}

function normalizeCustomData(raw: unknown, sectionKey?: string): any[] {
  if (sectionKey === 'team-members') {
    return normalizeTeamMembers(raw);
  }
  if (sectionKey === 'related-companies') {
    return normalizeRelatedCompanies(raw);
  }

  let items: any[] = [];
  if (Array.isArray(raw)) items = raw;
  else if (raw && typeof raw === 'object') items = Object.values(raw as object);

  return items.map((item, index) => ({
    id: item.id ?? `item-${index}-${crypto.randomUUID?.() ?? Date.now()}`,
    title: normalizeTranslatable(item.title),
    text: normalizeTranslatable(item.text ?? item.description),
    icon: item.icon ?? '',
    image: item.image ?? '',
    link: item.link ?? item.buttonUrl ?? '',
  }));
}

export function normalizeSectionForm(data?: any) {
  if (!data) return { ...EMPTY_SECTION_FORM, customData: [] };

  return {
    ...EMPTY_SECTION_FORM,
    ...data,
    pageId: data.pageId ?? '',
    sectionKey: data.sectionKey ?? '',
    sectionName: data.sectionName ?? '',
    title: normalizeTranslatable(data.title),
    subtitle: normalizeTranslatable(data.subtitle),
    description: normalizeTranslatable(data.description),
    buttonText: normalizeTranslatable(data.buttonText),
    buttonUrl: data.buttonUrl ?? '',
    image: data.image ?? '',
    backgroundImage: data.backgroundImage ?? '',
    videoUrl: data.videoUrl ?? '',
    sortOrder: data.sortOrder ?? 0,
    isActive: data.isActive ?? true,
    customData: normalizeCustomData(data.customData, data.sectionKey),
  };
}

export function SectionForm({ initialData }: any) {
  const router = useRouter();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(() => normalizeSectionForm(initialData));
  const isTeamSection = formData.sectionKey === 'team-members';
  const isRelatedCompaniesSection = formData.sectionKey === 'related-companies';
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState<any[]>([]);
  const [activeLang, setActiveLang] = useState<'en' | 'ar'>('en');

  useEffect(() => {
    apiClient.get('/pages').then(res => setPages(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(normalizeSectionForm(initialData));
    }
  }, [initialData]);

  useEffect(() => {
    if (formData.sectionKey === 'team-members') {
      setFormData((prev: any) => ({
        ...prev,
        customData: normalizeTeamMembers(prev.customData),
      }));
    }
    if (formData.sectionKey === 'related-companies') {
      setFormData((prev: any) => ({
        ...prev,
        customData: normalizeRelatedCompanies(prev.customData),
      }));
    }
  }, [formData.sectionKey]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateTranslatable = (field: string, lang: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: { ...(prev[field] || {}), [lang]: value }
    }));
  };

  const addCustomItem = () => {
    const newItem = { id: Date.now(), title: { en: '', ar: '' }, text: { en: '', ar: '' }, icon: '', image: '', link: '' };
    updateField('customData', [...(formData.customData || []), newItem]);
  };

  const removeCustomItem = (id: any) => {
    updateField('customData', formData.customData.filter((i: any) => i.id !== id));
  };

  const updateCustomItem = (id: any, field: string, lang: string, value: string) => {
    updateField(
      'customData',
      formData.customData.map((i: any) => {
        if (i.id !== id) return i;
        if (field === 'title' || field === 'text') {
          return {
            ...i,
            [field]: { ...normalizeTranslatable(i[field]), [lang]: value },
          };
        }
        return { ...i, [field]: value ?? '' };
      })
    );
  };

  const updateCustomItemScalar = (id: any, field: string, value: string) => {
    updateField(
      'customData',
      formData.customData.map((i: any) =>
        i.id === id ? { ...i, [field]: value ?? '' } : i
      )
    );
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) await apiClient.put(`/sections/${initialData.id}`, formData);
      else await apiClient.post('/sections', formData);
      toast.success("Section saved");
      router.push('/admin/pages'); // Redirect to pages since sections are managed there
      router.refresh();
    } catch (err) {
      toast.error("Failed to save section");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Section' : 'Create Section'}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
            <Button 
              type="button" 
              variant={activeLang === 'en' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveLang('en')}
              className="h-8"
            >
              EN
            </Button>
            <Button 
              type="button" 
              variant={activeLang === 'ar' ? 'secondary' : 'ghost'} 
              size="sm"
              onClick={() => setActiveLang('ar')}
              className="h-8"
            >
              AR
            </Button>
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Section'}</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2"><Layout className="w-5 h-5"/> Basic Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Target Page</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 bg-background border rounded-md"
                    value={formData.pageId}
                    onChange={e => updateField('pageId', e.target.value)}
                  >
                    <option value="">Select a page</option>
                    {pages.map(p => (
                      <option key={p.id} value={p.id}>
                        {typeof p.title === 'object' ? p.title[activeLang] : p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Section Key (System ID)</Label>
                  <Input value={formData.sectionKey ?? ''} onChange={e => updateField('sectionKey', e.target.value)} placeholder="e.g., hero-slider" />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title ({activeLang})</Label>
                <Input 
                  value={formData.title?.[activeLang] || ''} 
                  onChange={e => updateTranslatable('title', activeLang, e.target.value)} 
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle ({activeLang})</Label>
                <Input 
                  value={formData.subtitle?.[activeLang] || ''} 
                  onChange={e => updateTranslatable('subtitle', activeLang, e.target.value)} 
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              <div className="space-y-2">
                <Label>Description ({activeLang})</Label>
                <Textarea 
                  value={formData.description?.[activeLang] || ''} 
                  onChange={e => updateTranslatable('description', activeLang, e.target.value)} 
                  dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Button Text ({activeLang})</Label>
                  <Input 
                    value={formData.buttonText?.[activeLang] || ''} 
                    onChange={e => updateTranslatable('buttonText', activeLang, e.target.value)} 
                    dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button URL</Label>
                  <Input value={formData.buttonUrl ?? ''} onChange={e => updateField('buttonUrl', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {isTeamSection ? (
            <TeamMembersEditor
              members={formData.customData}
              onChange={(customData) => updateField('customData', customData)}
              activeLang={activeLang}
              isRtl={isRtl}
            />
          ) : isRelatedCompaniesSection ? (
            <RelatedCompaniesEditor
              companies={formData.customData}
              onChange={(customData) => updateField('customData', customData)}
              activeLang={activeLang}
              isRtl={isRtl}
            />
          ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2"><Layers className="w-5 h-5"/> Repeater Items (Cards/List)</CardTitle>
              <Button type="button" variant="outline" size="sm" onClick={addCustomItem}><Plus className="w-4 h-4 mr-2"/> Add Item</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(!formData.customData || formData.customData.length === 0) ? (
                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                  No repeater items added yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.customData.map((item: any, index: number) => (
                    <div key={String(item.id ?? index)} className="p-4 border rounded-lg bg-card space-y-4 relative group">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="absolute top-2 right-2 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeCustomItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      
                      <div className="font-semibold text-sm border-b pb-2 mb-2">Item #{index + 1}</div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Item Title ({activeLang})</Label>
                          <Input 
                            value={item.title?.[activeLang] || ''} 
                            onChange={e => updateCustomItem(item.id, 'title', activeLang, e.target.value)} 
                            dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Icon / Label</Label>
                          <Input value={item.icon ?? ''} onChange={e => updateCustomItemScalar(item.id, 'icon', e.target.value)} />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs">Text / Description ({activeLang})</Label>
                        <Textarea 
                          className="h-20 text-sm" 
                          value={item.text?.[activeLang] || ''} 
                          onChange={e => updateCustomItem(item.id, 'text', activeLang, e.target.value)} 
                          dir={activeLang === 'ar' ? 'rtl' : 'ltr'}
                        />
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Image</Label>
                        <div className="flex gap-2 items-center">
                          {item.image && <img src={resolveMediaUrl(item.image)} className="h-10 w-10 object-cover rounded" />}
                          <MediaSelector onSelect={(url) => updateCustomItemScalar(item.id, 'image', url)} triggerText="Pick" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Media & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Main Image</Label>
                <div className="space-y-2">
                  {formData.image && <img src={resolveMediaUrl(formData.image)} className="w-full aspect-video object-cover rounded border" />}
                  <MediaSelector onSelect={(url) => updateField('image', url)} triggerText={formData.image ? "Change Image" : "Select Image"} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                <div className="space-y-2">
                  {formData.backgroundImage && <img src={resolveMediaUrl(formData.backgroundImage)} className="w-full aspect-video object-cover rounded border" />}
                  <MediaSelector onSelect={(url) => updateField('backgroundImage', url)} triggerText={formData.backgroundImage ? "Change Background" : "Select Background"} />
                </div>
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Section Active</Label>
                  <input type="checkbox" checked={formData.isActive} onChange={e => updateField('isActive', e.target.checked)} />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input type="number" value={formData.sortOrder ?? 0} onChange={e => updateField('sortOrder', parseInt(e.target.value, 10) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}