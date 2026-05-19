const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'components', 'admin');
if (!fs.existsSync(basePath)) fs.mkdirSync(basePath, { recursive: true });

const files = {
  'DataTable.tsx': `'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';

export function DataTable({ columns, data, onEdit, onDelete, onStatusChange, editHref }: any) {
  if (!data || data.length === 0) {
    return <div className="text-center p-12 bg-card rounded-lg border border-border text-muted-foreground">No data found.</div>;
  }

  return (
    <div className="bg-card rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col: any) => <TableHead key={col.key}>{col.label}</TableHead>)}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any) => (
            <TableRow key={row.id}>
              {columns.map((col: any) => (
                <TableCell key={col.key}>
                  {col.render ? col.render(row) : row[col.key]?.toString()}
                </TableCell>
              ))}
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {editHref && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={editHref(row.id)}><Edit className="w-4 h-4" /></Link>
                    </Button>
                  )}
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={() => onEdit(row)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button variant="destructive" size="sm" onClick={() => {
                      if(confirm('Are you sure you want to delete this item?')) onDelete(row.id);
                    }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}`,

  'RoleGuard.tsx': `'use client';
import { useAuthStore } from '@/store/auth-store';

export function RoleGuard({ roles, children, fallback = null }: { roles: string[], children: React.ReactNode, fallback?: React.ReactNode }) {
  const { user } = useAuthStore();
  
  // If no user or user role not in allowed roles
  if (!user || (!roles.includes(user.role) && user.role !== 'SUPER_ADMIN')) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}`,

  'MediaSelector.tsx': `'use client';
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
}`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(basePath, name), content);
}
console.log('Core components generated.');
