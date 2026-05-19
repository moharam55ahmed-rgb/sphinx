'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminPath } from '@/lib/admin-path';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateRedirect() { return <RedirectForm /> }

export function RedirectForm({ initialData }: any) {
  const router = useRouter();
  const adminPath = useAdminPath();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || {"fromUrl":"","toUrl":""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if(isEdit) await apiClient.put(`/redirects/${initialData.id}`, formData);
      else await apiClient.post('/redirects', formData);
      router.push(adminPath('/admin/redirects'));
      router.refresh();
    } catch(err:any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit Redirect' : 'Create Redirect'}</h1>
      {error && <div className="text-destructive bg-destructive/10 p-3 rounded">{error}</div>}
      
      
      <div className="space-y-2">
        <Label>fromUrl</Label>
        <Input value={formData.fromUrl} onChange={e => setFormData({...formData, fromUrl: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>toUrl</Label>
        <Input value={formData.toUrl} onChange={e => setFormData({...formData, toUrl: e.target.value})} />
      </div>

      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
    </form>
  );
}