'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth-store';
import { apiClient } from '@/lib/api-client';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderOpen,
  Tags,
  Image as ImageIcon,
  LayoutTemplate,
  Settings,
  Search,
  Navigation,
  Users,
  UserCircle,
  Building2,
  MessageSquare,
  LogOut,
  BarChart3,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AdminBrand } from '@/components/admin/AdminBrand';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { useAdminLocale } from '@/lib/admin-path';

const sidebarLinks = [
  { href: '/admin', labelKey: 'dashboard', icon: LayoutDashboard, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER', 'SEO_MARKETING'] },
  { href: '/admin/analytics', labelKey: 'visitAnalytics', icon: BarChart3, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER', 'SEO_MARKETING'] },
  { href: '/admin/pages', labelKey: 'pages', icon: FileText, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER', 'SEO_MARKETING'] },
  { href: '/admin/banners', labelKey: 'pageBanners', icon: LayoutTemplate, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/projects', labelKey: 'projects', icon: Briefcase, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER', 'SEO_MARKETING'] },
  { href: '/admin/project-categories', labelKey: 'categories', icon: FolderOpen, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/news', labelKey: 'news', icon: FileText, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/team', labelKey: 'teamMembers', icon: UserCircle, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/related-companies', labelKey: 'relatedCompaniesAdmin', icon: Building2, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/news-categories', labelKey: 'newsCategories', icon: Tags, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/gallery', labelKey: 'gallery', icon: ImageIcon, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/gallery-categories', labelKey: 'galleryCategories', icon: Tags, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/media', labelKey: 'mediaLibrary', icon: ImageIcon, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/settings', labelKey: 'websiteSettings', icon: Settings, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/seo', labelKey: 'seo', icon: Search, roles: ['SUPER_ADMIN', 'SEO_MARKETING'] },
  { href: '/admin/navigation', labelKey: 'navigation', icon: Navigation, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/contact-messages', labelKey: 'inquiries', icon: MessageSquare, roles: ['SUPER_ADMIN', 'CONTENT_MANAGER'] },
  { href: '/admin/users', labelKey: 'users', icon: Users, roles: ['SUPER_ADMIN'] },
] as const;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('admin');
  const isRtl = locale === 'ar';
  const { user, token, setAuth, logout } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  const isLoginPage = pathname?.includes('/admin/login');
  const siteLocale = useAdminLocale();
  const publicSiteUrl = `/${siteLocale}`;
  const localePrefix = `/${locale}`;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!token && !isLoginPage) {
          router.push(`${localePrefix}/admin/login`);
          return;
        }

        if (token && !user && !isLoginPage) {
          const res = await apiClient.get('/auth/me');
          if (res.data.success) {
            setAuth(res.data.data, token);
          }
        }
      } catch {
        if (!isLoginPage) logout();
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [token, user, isLoginPage, router, setAuth, logout, localePrefix]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        {t('loading')}
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const allowedLinks = sidebarLinks.filter(
    (link) => user && link.roles.includes(user.role)
  );

  return (
    <div
      className="flex h-screen bg-muted/20 text-foreground font-sans"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border">
        <div className="p-5 border-b border-border space-y-4">
          <AdminBrand />
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {t('language')}
            </span>
            <LanguageSwitcher />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {allowedLinks.map((link) => {
              const Icon = link.icon;
              const cleanPath = pathname?.replace(/^\/[a-z]{2}/, '') || '';
              const isActive =
                cleanPath === link.href ||
                (link.href !== '/admin' && cleanPath.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={`${localePrefix}${link.href}`}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    {t(link.labelKey)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="px-3 py-3">
          <Button asChild className="w-full justify-start gap-2" variant="secondary">
            <Link href={publicSiteUrl} target="_blank" rel="noopener noreferrer">
              <Globe className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-start">{t('viewWebsite')}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 shrink-0" />
            </Link>
          </Button>
        </div>
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 overflow-hidden min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className={cn('w-4 h-4', isRtl ? 'ml-2' : 'mr-2')} />
            {t('logout')}
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto w-full text-start">{children}</div>
        </main>
      </div>
    </div>
  );
}
