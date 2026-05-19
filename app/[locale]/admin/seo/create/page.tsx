'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Share2, Code, AlertCircle } from 'lucide-react';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { toast } from 'sonner';
import { useAdminPath } from '@/lib/admin-path';

export default function CreateSEORecord() { return <SEOForm /> }

export function SEOForm({ initialData }: any) {
  const router = useRouter();
  const adminPath = useAdminPath();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || {
    slug: '',
    pageType: 'page',
    pageId: '',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    schemaJson: '',
    robotsIndex: true,
    robotsFollow: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate Schema JSON if provided
    if (formData.schemaJson) {
      try {
        if (typeof formData.schemaJson === 'string') JSON.parse(formData.schemaJson);
      } catch (err) {
        setError('Invalid Schema JSON format');
        setLoading(false);
        return;
      }
    }

    try {
      const payload = { ...formData };
      if (typeof payload.schemaJson === 'string' && payload.schemaJson) {
        payload.schemaJson = JSON.parse(payload.schemaJson);
      }
      
      if (isEdit) await apiClient.put(`/seo/${initialData.id}`, payload);
      else await apiClient.post('/seo', payload);
      
      toast.success(isEdit ? "SEO updated" : "SEO created");
      router.push(adminPath('/admin/seo'));
      router.refresh();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save SEO');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit SEO' : 'Create SEO'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">General SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Slug / Page Path</Label>
                  <Input 
                    required 
                    value={formData.slug} 
                    onChange={e => updateField('slug', e.target.value)} 
                    placeholder="/projects/example"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Page Type</Label>
                  <select 
                    className="w-full h-10 px-3 py-2 bg-background border rounded-md"
                    value={formData.pageType}
                    onChange={e => updateField('pageType', e.target.value)}
                  >
                    <option value="page">Page</option>
                    <option value="project">Project</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Meta Title</Label>
                  <span className={`text-xs ${formData.metaTitle?.length > 60 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                    {formData.metaTitle?.length || 0}/60
                  </span>
                </div>
                <Input 
                  value={formData.metaTitle} 
                  onChange={e => updateField('metaTitle', e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Meta Description</Label>
                  <span className={`text-xs ${formData.metaDescription?.length > 160 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                    {formData.metaDescription?.length || 0}/160
                  </span>
                </div>
                <Textarea 
                  className="h-24"
                  value={formData.metaDescription ?? ''} 
                  onChange={e => updateField('metaDescription', e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input 
                  value={formData.canonicalUrl} 
                  onChange={e => updateField('canonicalUrl', e.target.value)} 
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="og">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="og" className="flex gap-2"><Share2 className="w-4 h-4"/> OpenGraph</TabsTrigger>
              <TabsTrigger value="twitter" className="flex gap-2"><Share2 className="w-4 h-4"/> Twitter</TabsTrigger>
              <TabsTrigger value="schema" className="flex gap-2"><Code className="w-4 h-4"/> Schema Markup</TabsTrigger>
            </TabsList>
            
            <TabsContent value="og" className="space-y-4 p-4 border rounded-b-lg bg-card">
              <div className="space-y-2">
                <Label>OG Title</Label>
                <Input value={formData.ogTitle} onChange={e => updateField('ogTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>OG Description</Label>
                <Textarea value={formData.ogDescription ?? ''} onChange={e => updateField('ogDescription', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>OG Image</Label>
                <div className="flex gap-4 items-center">
                  {formData.ogImage && <img src={formData.ogImage} className="w-20 h-20 object-cover rounded border" />}
                  <MediaSelector onSelect={(url) => updateField('ogImage', url)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="twitter" className="space-y-4 p-4 border rounded-b-lg bg-card">
              <div className="space-y-2">
                <Label>Twitter Title</Label>
                <Input value={formData.twitterTitle} onChange={e => updateField('twitterTitle', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Twitter Description</Label>
                <Textarea value={formData.twitterDescription ?? ''} onChange={e => updateField('twitterDescription', e.target.value)} />
              </div>
            </TabsContent>

            <TabsContent value="schema" className="space-y-4 p-4 border rounded-b-lg bg-card">
              <div className="space-y-2">
                <Label>Schema JSON-LD</Label>
                <Textarea 
                  className="font-mono h-48 text-xs" 
                  value={typeof formData.schemaJson === 'object' ? JSON.stringify(formData.schemaJson, null, 2) : formData.schemaJson} 
                  onChange={e => updateField('schemaJson', e.target.value)} 
                  placeholder='{ "@context": "https://schema.org", "@type": "Organization", ... }'
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save SEO Configuration'}
          </Button>
          {error && <div className="p-3 bg-destructive/10 text-destructive rounded flex items-center gap-2"><AlertCircle className="w-4 h-4"/>{error}</div>}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Google Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="text-[#1a0dab] text-xl hover:underline truncate cursor-pointer">
                  {formData.metaTitle || 'Page Title Displayed Here'}
                </div>
                <div className="text-[#006621] text-sm truncate">
                  https://sphinx.com{formData.slug || '/page-slug'}
                </div>
                <div className="text-[#4d5156] text-sm line-clamp-2">
                  {formData.metaDescription || 'Add a meta description to see how this page will appear in Google search results.'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Social Preview (OG)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <div className="bg-[#f2f3f5] overflow-hidden border rounded-b-lg">
                <div className="aspect-[1200/630] bg-muted relative flex items-center justify-center">
                  {formData.ogImage ? (
                    <img src={formData.ogImage} className="w-full h-full object-cover" />
                  ) : (
                    <Globe className="w-12 h-12 text-muted-foreground opacity-20" />
                  )}
                </div>
                <div className="p-3 bg-white border-t space-y-1">
                  <div className="text-[#606770] uppercase text-[12px] font-semibold tracking-wide truncate">
                    SPHINX.COM
                  </div>
                  <div className="text-[#1d2129] font-bold text-base line-clamp-1">
                    {formData.ogTitle || formData.metaTitle || 'Shared Link Title'}
                  </div>
                  <div className="text-[#606770] text-sm line-clamp-2 leading-snug">
                    {formData.ogDescription || formData.metaDescription || 'Description for social media platforms...'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}