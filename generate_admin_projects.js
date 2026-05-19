const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'app', '[locale]', 'admin', 'projects');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const listCode = `'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { DataTable } from '@/components/admin/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = async () => {
    try {
      const res = await apiClient.get('/projects');
      setData(res.data.data);
    } catch(e:any) { setError(e.response?.data?.message || 'Error loading'); } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(\`/projects/\${id}\`);
      fetch();
    } catch(e:any) { alert(e.response?.data?.message || 'Delete failed'); }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'isFeatured', label: 'Featured', render: (row:any) => row.isFeatured ? 'Yes' : 'No' }
  ];

  if(loading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild><Link href="/admin/projects/create"><Plus className="w-4 h-4 mr-2" /> Add Project</Link></Button>
      </div>
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      <DataTable columns={columns} data={data} onDelete={handleDelete} editHref={(id: string) => \`/admin/projects/\${id}/edit\`} />
    </div>
  );
}`;
fs.writeFileSync(path.join(dir, 'page.tsx'), listCode);

const createDir = path.join(dir, 'create');
if (!fs.existsSync(createDir)) fs.mkdirSync(createDir, { recursive: true });

const formCode = `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MediaSelector } from '@/components/admin/MediaSelector';

export default function ProjectForm({ params, initialData }: any) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || { title: '', slug: '', description: '', status: 'published', isFeatured: false, mainImage: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if(isEdit) await apiClient.put(\`/projects/\${initialData.id}\`, formData);
      else await apiClient.post('/projects', formData);
      router.push('/admin/projects');
      router.refresh();
    } catch(err:any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit Project' : 'Create Project'}</h1>
      {error && <div className="text-red-500 bg-red-100 p-3 rounded">{error}</div>}
      
      <div className="space-y-2">
        <Label>Title</Label>
        <Input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Slug</Label>
        <Input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
      </div>
      <div className="space-y-2">
        <Label>Main Image</Label>
        <div className="flex gap-4 items-center">
          {formData.mainImage && <img src={formData.mainImage} alt="Main" className="h-16 rounded" />}
          <MediaSelector onSelect={(url) => setFormData({...formData, mainImage: url})} />
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="featured" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} />
          <Label htmlFor="featured">Featured</Label>
        </div>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Project'}</Button>
    </form>
  );
}`;

fs.writeFileSync(path.join(createDir, 'page.tsx'), formCode.replace('export default function ProjectForm({ params, initialData }: any) {', `export default function CreateProject() { return <ProjectForm /> } \n\nfunction ProjectForm({ params, initialData }: any) {`));

const editDir = path.join(dir, '[id]', 'edit');
if (!fs.existsSync(editDir)) fs.mkdirSync(editDir, { recursive: true });
const editCode = `'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import ProjectForm from '../../create/page'; // This won't work perfectly via simple import since it's Next page, but for generation let's make it inline or separate component.

export default function EditProject({ params }: any) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    apiClient.get(\`/projects/\${params.id}\`).then(res => setData(res.data.data)).catch(e => setErr('Failed to load'));
  }, [params.id]);
  if(err) return <div>{err}</div>;
  if(!data) return <div>Loading...</div>;
  
  // Quick hack to reuse form logic: redirecting or refactoring would be better, but we need speed.
  return <div className="p-4 bg-red-100 text-red-700">Please extract ProjectForm to a shared component to render edit properly.</div>
}`;
// Wait, I will just output the full form for Edit directly to be safe.
const fullEditCode = formCode.replace('export default function ProjectForm({ params, initialData }: any) {', `import { useEffect } from 'react';\n\nexport default function EditProject({ params }: any) {\n  const [initialData, setInitialData] = useState<any>(null);\n  useEffect(() => { apiClient.get(\`/projects/\${params.id}\`).then(res => setInitialData(res.data.data)) }, [params.id]);\n  if(!initialData) return <div>Loading...</div>;\n  return <ProjectForm initialData={initialData} />;\n}\n\nfunction ProjectForm({ initialData }: any) {`);
fs.writeFileSync(path.join(editDir, 'page.tsx'), fullEditCode);

console.log('Projects module generated');
