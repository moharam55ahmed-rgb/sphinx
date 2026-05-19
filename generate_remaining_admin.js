const fs = require('fs');
const path = require('path');

const modules = [
  { name: 'Pages', endpoint: 'pages', singular: 'Page', fields: [{name: 'title', type: 'string'}, {name: 'slug', type: 'string'}, {name: 'templateKey', type: 'string'}] },
  { name: 'Sections', endpoint: 'sections', singular: 'Section', fields: [{name: 'title', type: 'string'}, {name: 'subtitle', type: 'string'}, {name: 'description', type: 'textarea'}, {name: 'customData', type: 'textarea'}] },
  { name: 'Categories', endpoint: 'project-categories', singular: 'Category', fields: [{name: 'name', type: 'string'}, {name: 'slug', type: 'string'}, {name: 'description', type: 'textarea'}] },
  { name: 'Settings', endpoint: 'settings', singular: 'Setting', fields: [{name: 'key', type: 'string'}, {name: 'group', type: 'string'}, {name: 'value', type: 'textarea'}] },
  { name: 'SEO', endpoint: 'seo', singular: 'SEO Record', fields: [{name: 'slug', type: 'string'}, {name: 'metaTitle', type: 'string'}, {name: 'metaDescription', type: 'textarea'}, {name: 'schemaJson', type: 'textarea'}] },
  { name: 'Redirects', endpoint: 'redirects', singular: 'Redirect', fields: [{name: 'fromUrl', type: 'string'}, {name: 'toUrl', type: 'string'}] },
  { name: 'Navigation', endpoint: 'navigation', singular: 'Navigation Item', fields: [{name: 'label', type: 'string'}, {name: 'url', type: 'string'}, {name: 'location', type: 'string'}] },
  { name: 'Users', endpoint: 'users', singular: 'User', fields: [{name: 'name', type: 'string'}, {name: 'email', type: 'string'}, {name: 'role', type: 'string'}] },
];

const basePath = path.join(__dirname, 'app', '[locale]', 'admin');

modules.forEach(mod => {
  const dir = path.join(basePath, mod.endpoint);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const createDir = path.join(dir, 'create');
  if (!fs.existsSync(createDir)) fs.mkdirSync(createDir, { recursive: true });

  const editDir = path.join(dir, '[id]', 'edit');
  if (!fs.existsSync(editDir)) fs.mkdirSync(editDir, { recursive: true });

  const defaultState = mod.fields.reduce((acc, f) => ({ ...acc, [f.name]: '' }), {});

  const formFields = mod.fields.map(f => {
    if (f.type === 'textarea') {
      return `
      <div className="space-y-2">
        <Label>${f.name}</Label>
        <Textarea value={typeof formData.${f.name} === 'object' ? JSON.stringify(formData.${f.name}) : formData.${f.name}} onChange={e => setFormData({...formData, ${f.name}: e.target.value})} />
      </div>`;
    }
    return `
      <div className="space-y-2">
        <Label>${f.name}</Label>
        <Input value={formData.${f.name}} onChange={e => setFormData({...formData, ${f.name}: e.target.value})} />
      </div>`;
  }).join('\\n');

  const formCode = `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Create${mod.singular}() { return <${mod.singular}Form /> }

export function ${mod.singular}Form({ initialData }: any) {
  const router = useRouter();
  const isEdit = !!initialData;
  const [formData, setFormData] = useState(initialData || ${JSON.stringify(defaultState)});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if(isEdit) await apiClient.put(\`/${mod.endpoint}/\${initialData.id}\`, formData);
      else await apiClient.post('/${mod.endpoint}', formData);
      router.push('/admin/${mod.endpoint}');
      router.refresh();
    } catch(err:any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-card p-6 border rounded-lg">
      <h1 className="text-2xl font-bold">{isEdit ? 'Edit ${mod.singular}' : 'Create ${mod.singular}'}</h1>
      {error && <div className="text-destructive bg-destructive/10 p-3 rounded">{error}</div>}
      
      ${formFields}

      <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save'}</Button>
    </form>
  );
}`;

  fs.writeFileSync(path.join(createDir, 'page.tsx'), formCode);

  const editCode = `'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { ${mod.singular}Form } from '../../create/page';

export default function Edit${mod.singular}({ params }: any) {
  const [initialData, setInitialData] = useState<any>(null);
  useEffect(() => { apiClient.get(\`/${mod.endpoint}/\${params.id}\`).then(res => setInitialData(res.data.data)) }, [params.id]);
  if(!initialData) return <div>Loading...</div>;
  return <${mod.singular}Form initialData={initialData} />;
}`;

  fs.writeFileSync(path.join(editDir, 'page.tsx'), editCode);
});

console.log('Remaining admin CRUD modules generated');
