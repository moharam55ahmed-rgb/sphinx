'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function CreateSetting() { return <SettingForm /> }

export function SettingForm({ initialData }: any) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || {"key":"","group":"","value":""});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if(isEdit) await apiClient.put(`/settings/${initialData.id}`, formData);
      else await apiClient.post('/settings', formData);
      router.push('/admin/settings');
      router.refresh();
    } catch(err:any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit Setting' : 'Create Setting'}</h1>
      {error && <div className="text-destructive bg-destructive/10 p-3 rounded">{error}</div>}
      
      
      <div className="space-y-2">
        <Label>key</Label>
        <Input value={formData.key} onChange={e => setFormData({...formData, key: e.target.value})} />
      </div>\n
      <div className="space-y-2">
        <Label>group</Label>
        <Input value={formData.group} onChange={e => setFormData({...formData, group: e.target.value})} />
      </div>\n
      <div className="space-y-2">
        <Label>value</Label>
        <Textarea value={typeof formData.value === 'object' ? JSON.stringify(formData.value) : formData.value} onChange={e => setFormData({...formData, value: e.target.value})} />
      </div>

      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
    </form>
  );
}