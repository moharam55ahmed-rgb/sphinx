'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MediaSelector } from '@/components/admin/MediaSelector';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Phone, Share2, Info, Image as ImageIcon } from 'lucide-react';

export default function WebsiteSettings() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/settings');
      // Transform array of {key, value} to object
      const settingsObj = res.data.data.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {});
      setSettings(settingsObj);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const saveSettings = async (group: string, keys: string[]) => {
    try {
      setSaving(true);
      const promises = keys.map(key => 
        apiClient.put(`/settings/${key}`, { 
          key, 
          group, 
          value: settings[key] || {} 
        })
      );
      await Promise.all(promises);
      toast.success(`${group.charAt(0).toUpperCase() + group.slice(1)} settings updated`);
    } catch (err) {
      toast.error("Failed to save some settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Website Settings</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-card border w-full justify-start h-12 p-1">
          <TabsTrigger value="general" className="flex gap-2"><Info className="w-4 h-4"/> General</TabsTrigger>
          <TabsTrigger value="contact" className="flex gap-2"><Phone className="w-4 h-4"/> Contact Info</TabsTrigger>
          <TabsTrigger value="social" className="flex gap-2"><Share2 className="w-4 h-4"/> Social Media</TabsTrigger>
          <TabsTrigger value="branding" className="flex gap-2"><ImageIcon className="w-4 h-4"/> Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
              <CardDescription>Main website details and configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Website Name</Label>
                <Input 
                  value={settings.siteName?.text || ''} 
                  onChange={e => updateSetting('siteName', { text: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Website Description (Meta)</Label>
                <Textarea 
                  value={settings.siteDescription?.text || ''} 
                  onChange={e => updateSetting('siteDescription', { text: e.target.value })} 
                />
              </div>
              <div className="pt-4">
                <Button onClick={() => saveSettings('general', ['siteName', 'siteDescription'])} disabled={saving}>
                  Save General Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Details</CardTitle>
              <CardDescription>
                Numbers for floating call/WhatsApp buttons, footer, and contact page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-4">
                <p className="text-sm font-medium text-foreground">
                  Floating buttons (bottom of site)
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Call button — phone number</Label>
                    <Input
                      dir="ltr"
                      placeholder="19474"
                      value={settings.phone?.text || ''}
                      onChange={(e) =>
                        updateSetting('phone', { text: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Short code or full number (e.g. 19474 or +201234567890)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp button — number</Label>
                    <Input
                      dir="ltr"
                      placeholder="+201000000000"
                      value={settings.whatsapp?.text || ''}
                      onChange={(e) =>
                        updateSetting('whatsapp', { text: e.target.value })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Country code, no spaces (e.g. +201012345678)
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={settings.email?.text || ''}
                    onChange={(e) =>
                      updateSetting('email', { text: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address (English)</Label>
                <Textarea 
                  value={settings.addressEn?.text || ''} 
                  onChange={e => updateSetting('addressEn', { text: e.target.value })} 
                />
              </div>
              <div className="space-y-2">
                <Label>Address (Arabic)</Label>
                <Textarea 
                  dir="rtl"
                  value={settings.addressAr?.text || ''} 
                  onChange={e => updateSetting('addressAr', { text: e.target.value })} 
                />
              </div>
              <div className="pt-4">
                <Button onClick={() => saveSettings('contact', ['phone', 'whatsapp', 'email', 'addressEn', 'addressAr'])} disabled={saving}>
                  Save Contact Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Configure URLs for your social media profiles</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {['facebook', 'instagram', 'linkedin', 'youtube'].map(platform => (
                <div key={platform} className="space-y-2">
                  <Label className="capitalize">{platform} URL</Label>
                  <Input 
                    value={settings.socialLinks?.[platform] || ''} 
                    onChange={e => updateSetting('socialLinks', { ...settings.socialLinks, [platform]: e.target.value })} 
                  />
                </div>
              ))}
              <div className="pt-4">
                <Button onClick={() => saveSettings('social', ['socialLinks'])} disabled={saving}>
                  Save Social Links
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Brand Assets</CardTitle>
              <CardDescription>Upload logos and favicons</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label>Main Logo</Label>
                  <div className="p-4 border rounded-lg bg-muted/10 flex flex-col items-center gap-4">
                    {settings.logo?.url ? (
                      <img src={settings.logo.url} className="h-20 object-contain" />
                    ) : (
                      <div className="h-20 w-20 flex items-center justify-center border border-dashed rounded text-muted-foreground italic text-xs">No Logo</div>
                    )}
                    <MediaSelector onSelect={(url) => updateSetting('logo', { url })} triggerText="Select Logo" />
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Favicon</Label>
                  <div className="p-4 border rounded-lg bg-muted/10 flex flex-col items-center gap-4">
                    {settings.favicon?.url ? (
                      <img src={settings.favicon.url} className="h-10 w-10 object-contain" />
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center border border-dashed rounded text-muted-foreground italic text-xs">None</div>
                    )}
                    <MediaSelector onSelect={(url) => updateSetting('favicon', { url })} triggerText="Select Favicon" />
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <Button onClick={() => saveSettings('branding', ['logo', 'favicon'])} disabled={saving}>
                  Save Branding
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
