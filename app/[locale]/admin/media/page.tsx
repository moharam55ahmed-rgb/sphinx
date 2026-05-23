'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Edit2, 
  X, 
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatBilingual } from '@/lib/translate';
import { useAdminPath } from '@/lib/admin-path';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useLocale } from 'next-intl';

export default function MediaLibrary() {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [media, setMedia] = useState<any[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<any[]>([]);
  const [uploadCategoryId, setUploadCategoryId] = useState<string>('none');
  const [uploadShowInGallery, setUploadShowInGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copyingId, setCopyingId] = useState<string | null>(null);
  
  // Edit State
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    altText: '',
    galleryCategoryId: 'none',
    showInGallery: false,
  });

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/media');
      console.log(res)
      setMedia(res.data.data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || '';
      setError(
        msg.includes('findMany') || msg.includes('galleryCategory')
          ? 'Restart the API after: cd backend && npx prisma generate'
          : msg || (isRtl ? 'فشل تحميل المكتبة' : 'Failed to load media library')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    apiClient
      .get('/gallery-categories')
      .then((res) => setGalleryCategories(res.data.data || []))
      .catch(() => setGalleryCategories([]));
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    if (uploadCategoryId && uploadCategoryId !== 'none') {
      formData.append('galleryCategoryId', uploadCategoryId);
    }
    formData.append('showInGallery', uploadShowInGallery ? 'true' : 'false');

    try {
      toast.loading(isRtl ? 'جاري الرفع...' : 'Uploading...');
      const res = await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMedia([res.data.data, ...media]);
      toast.dismiss();
      toast.success(isRtl ? 'تم الرفع بنجاح' : 'File uploaded successfully');
    } catch (err) {
      toast.dismiss();
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      await apiClient.delete(`/media/${id}`);
      setMedia(media.filter(m => m.id !== id));
      toast.success("File deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopyingId(id);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopyingId(null), 2000);
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setEditForm({
      title: item.title || '',
      altText: item.altText || '',
      galleryCategoryId: item.galleryCategoryId || 'none',
      showInGallery: Boolean(item.showInGallery),
    });
  };

  const saveEdit = async () => {
    try {
      const payload = {
        title: editForm.title,
        altText: editForm.altText,
        showInGallery: editForm.showInGallery,
        galleryCategoryId:
          editForm.galleryCategoryId === 'none' ? null : editForm.galleryCategoryId,
      };
      const res = await apiClient.put(`/media/${editingItem.id}`, payload);
      setMedia(media.map(m => m.id === editingItem.id ? res.data.data : m));
      setEditingItem(null);
      toast.success("Metadata updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading && media.length === 0) return <div>Loading Media Library...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRtl ? 'مكتبة الوسائط' : 'Media Library'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
            {isRtl
              ? 'ارفع أي ملف للموقع. الجاليري العام يعرض فقط ما تفعّله «عرض في الجاليري». '
              : 'Upload any site file. Public gallery only shows items with “Show in gallery”. '}
            <Link href={adminPath('/admin/gallery-categories')} className="text-primary underline">
              {isRtl ? 'تصنيفات الجاليري' : 'Gallery categories'}
            </Link>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
          <div className="space-y-1 min-w-[200px]">
            <Label className="text-xs">Category on upload</Label>
            <Select value={uploadCategoryId} onValueChange={setUploadCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No category</SelectItem>
                {galleryCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {formatBilingual(cat.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
          <input
            type="file"
            id="main-upload"
            className="hidden"
            onChange={handleUpload}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <div className="flex items-center gap-2 pb-1">
            <Checkbox
              id="upload-show-gallery"
              checked={uploadShowInGallery}
              onCheckedChange={(v) => setUploadShowInGallery(v === true)}
            />
            <Label htmlFor="upload-show-gallery" className="text-xs cursor-pointer">
              {isRtl ? 'عرض في الجاليري العام' : 'Show in public gallery'}
            </Label>
          </div>
          <label htmlFor="main-upload">
            <Button asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" /> Upload New
              </span>
            </Button>
          </label>
          </div>
        </div>
      </div>

      {error && <div className="p-4 bg-destructive/10 text-destructive rounded-lg">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {media.map((item) => (
          <div key={item.id} className="group relative bg-card border rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
              {item.mimeType?.startsWith('image/') ? (
                <img
                  src={item.fileUrl}
                  alt={item.altText || ''}
                  className="object-cover w-full h-full transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="text-center p-2 text-muted-foreground">
                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <span className="text-[10px] uppercase">
                    {item.mimeType?.split('/')[0] || 'file'}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="secondary" onClick={() => handleCopyUrl(item.fileUrl, item.id)}>
                  {copyingId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="secondary" onClick={() => startEdit(item)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs truncate font-medium">{item.originalName}</p>
              {item.showInGallery ? (
                <Badge variant="secondary" className="text-[10px]">
                  {isRtl ? 'في الجاليري' : 'In gallery'}
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  {isRtl ? 'مخفي من الجاليري' : 'Not in gallery'}
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && !loading && (
        <div className="text-center p-12 bg-card rounded-lg border border-dashed border-border text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>Your media library is empty.</p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media Metadata</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input 
                value={editForm.title} 
                onChange={e => setEditForm({ ...editForm, title: e.target.value })} 
                placeholder="Image title"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input 
                value={editForm.altText} 
                onChange={e => setEditForm({ ...editForm, altText: e.target.value })} 
                placeholder="Describe the image for accessibility"
              />
            </div>
            <div className="space-y-2">
              <Label>Gallery Category</Label>
              <Select
                value={editForm.galleryCategoryId}
                onValueChange={(v) =>
                  setEditForm({ ...editForm, galleryCategoryId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No category</SelectItem>
                  {galleryCategories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {formatBilingual(cat.name)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="edit-show-gallery"
                checked={editForm.showInGallery}
                onCheckedChange={(v) =>
                  setEditForm({ ...editForm, showInGallery: v === true })
                }
              />
              <Label htmlFor="edit-show-gallery" className="cursor-pointer">
                {isRtl ? 'عرض في الجاليري العام' : 'Show in public gallery'}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingItem(null)}>Cancel</Button>
            <Button onClick={saveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
