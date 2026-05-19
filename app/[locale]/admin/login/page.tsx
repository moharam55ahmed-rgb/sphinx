'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useAdminPath } from '@/lib/admin-path';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';
import { AdminBrand } from '@/components/admin/AdminBrand';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';

export default function AdminLogin() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const adminPath = useAdminPath();
  const isRtl = locale === 'ar';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await apiClient.post('/auth/login', { email, password });
      if (res.data.success) {
        setAuth(res.data.data.user, res.data.data.token);
        router.push(adminPath('/admin'));
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Ensure backend is running and database is seeded.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-8 gap-4">
          <AdminBrand />
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">{t('loginTitle')}</h1>
            <p className="text-muted-foreground text-sm mt-2">{t('loginSubtitle')}</p>
          </div>
          <LanguageSwitcher />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>If you haven't setup MySQL yet, this login will fail.</p>
          <p>Check <code>backend/DATABASE_SETUP.md</code></p>
        </div>
      </div>
    </div>
  );
}
