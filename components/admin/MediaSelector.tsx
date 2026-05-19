'use client';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ImageIcon, Upload } from 'lucide-react';
import Image from 'next/image';

export function MediaSelector({ onSelect, triggerText = "Select Image" }: { onSelect: (url: string) => void, triggerText?: string }) {
  const [media, setMedia] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/media');
      setMedia(res.data.data);
    } catch(e) {} finally { setLoading(false); }
  };

  useEffect(() => { if (open) fetchMedia(); }, [open]);

  const handleUpload = async (e: any) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setLoading(true);
      const res = await apiClient.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMedia([res.data.data, ...media]);
    } catch(e) { alert('Upload failed'); } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" type="button"><ImageIcon className="w-4 h-4 mr-2"/> {triggerText}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Media Library</DialogTitle>
        </DialogHeader>
        <div className="mb-4">
          <input type="file" onChange={handleUpload} className="hidden" id="media-upload" accept="image/*" />
          <label htmlFor="media-upload">
            <Button variant="secondary" asChild><span className="cursor-pointer"><Upload className="w-4 h-4 mr-2"/> Upload New</span></Button>
          </label>
        </div>
        {loading && !media.length ? <p>Loading...</p> : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.map(m => (
              <div key={m.id} className="relative aspect-square border rounded-md overflow-hidden cursor-pointer hover:border-primary"
                   onClick={() => { onSelect(m.fileUrl); setOpen(false); }}>
                <img src={m.fileUrl} alt={m.altText || ''} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}