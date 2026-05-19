'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAdminPath } from '@/lib/admin-path';

export const USER_ROLES = [
  {
    value: 'SUPER_ADMIN',
    labelEn: 'Super Admin',
    labelAr: 'مدير النظام (أدمن)',
    descriptionEn: 'Full access to dashboard and settings',
    descriptionAr: 'صلاحيات كاملة على لوحة التحكم والإعدادات',
  },
  {
    value: 'CONTENT_MANAGER',
    labelEn: 'Content Editor',
    labelAr: 'محرر محتوى',
    descriptionEn: 'Manage pages, news, projects, gallery, and media',
    descriptionAr: 'إدارة الصفحات والأخبار والمشاريع والجاليري والوسائط',
  },
  {
    value: 'SEO_MARKETING',
    labelEn: 'SEO & Marketing',
    labelAr: 'تسويق و SEO',
    descriptionEn: 'SEO, analytics, and marketing pages',
    descriptionAr: 'إدارة SEO والتحليلات وصفحات التسويق',
  },
] as const;

export type UserRole = (typeof USER_ROLES)[number]['value'];

const EMPTY_FORM = {
  name: '',
  email: '',
  role: 'CONTENT_MANAGER' as UserRole,
  password: '',
};

export default function CreateUser() {
  return <UserForm />;
}

export function UserForm({ initialData }: { initialData?: Record<string, unknown> }) {
  const router = useRouter();
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const isEdit = !!initialData;

  const [formData, setFormData] = useState(() => ({
    name: (initialData?.name as string) || '',
    email: (initialData?.email as string) || '',
    role: (initialData?.role as UserRole) || 'CONTENT_MANAGER',
    password: '',
  }));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedRole = USER_ROLES.find((r) => r.value === formData.role);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isEdit && !formData.password.trim()) {
      setError(isRtl ? 'كلمة المرور مطلوبة' : 'Password is required');
      setLoading(false);
      return;
    }

    try {
      const payload: Record<string, string> = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
      };
      if (formData.password.trim()) {
        payload.password = formData.password;
      }

      if (isEdit) {
        await apiClient.put(`/users/${initialData!.id}`, payload);
      } else {
        await apiClient.post('/users', payload);
      }
      router.push(adminPath('/admin/users'));
      router.refresh();
    } catch (err: unknown) {
      const message =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message;
      setError(message || (isRtl ? 'فشل الحفظ' : 'Failed to save'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-2xl bg-card p-6 border border-border rounded-lg text-start"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <h1 className="text-2xl font-bold">
        {isEdit
          ? isRtl
            ? 'تعديل مستخدم'
            : 'Edit User'
          : isRtl
            ? 'إضافة مستخدم'
            : 'Create User'}
      </h1>

      {error && (
        <div className="text-destructive bg-destructive/10 p-3 rounded-md text-sm border border-destructive/20">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="user-name">{isRtl ? 'الاسم' : 'Name'}</Label>
        <Input
          id="user-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          dir={isRtl ? 'rtl' : 'ltr'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-email">{isRtl ? 'البريد الإلكتروني' : 'Email'}</Label>
        <Input
          id="user-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          dir="ltr"
          className="text-start"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-role">{isRtl ? 'الصلاحية' : 'Role'}</Label>
        <Select
          value={formData.role}
          onValueChange={(value) =>
            setFormData({ ...formData, role: value as UserRole })
          }
        >
          <SelectTrigger id="user-role" className="w-full">
            <SelectValue placeholder={isRtl ? 'اختر الصلاحية' : 'Select role'} />
          </SelectTrigger>
          <SelectContent dir={isRtl ? 'rtl' : 'ltr'}>
            {USER_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {isRtl ? role.labelAr : role.labelEn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedRole && (
          <p className="text-xs text-muted-foreground">
            {isRtl ? selectedRole.descriptionAr : selectedRole.descriptionEn}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="user-password">
          {isEdit
            ? isRtl
              ? 'كلمة مرور جديدة (اختياري)'
              : 'New password (optional)'
            : isRtl
              ? 'كلمة المرور'
              : 'Password'}
        </Label>
        <Input
          id="user-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!isEdit}
          autoComplete={isEdit ? 'new-password' : 'off'}
          dir="ltr"
        />
      </div>

      <Button type="submit" disabled={loading} className="min-w-[120px]">
        {loading
          ? isRtl
            ? 'جاري الحفظ...'
            : 'Saving...'
          : isRtl
            ? 'حفظ'
            : 'Save'}
      </Button>
    </form>
  );
}
