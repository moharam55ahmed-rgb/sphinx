'use client';

import { useEffect, useState, useMemo } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Edit, Shield, Scale } from 'lucide-react';
import Link from 'next/link';
import { formatBilingual } from '@/lib/translate';
import { useAdminPath } from '@/lib/admin-path';
import { useLocale, useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isLegalPageSlug } from '@/lib/legal-cms';

const LEGAL_SLUGS = ['privacy', 'terms'] as const;

export default function PagesList() {
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const tTable = useTranslations('admin.table');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchdivata = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/pages');
      setItems(res.data.data);
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          (isRtl ? 'فشل تحميل الصفحات' : 'Failed to fetch pages')
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdivata();
  }, []);

  const { legalPages, otherPages } = useMemo(() => {
    const legal: any[] = [];
    const other: any[] = [];
    for (const item of items) {
      if (isLegalPageSlug(item.slug)) {
        legal.push(item);
      } else {
        other.push(item);
      }
    }
    const order = ['privacy', 'terms'];
    legal.sort(
      (a, b) => order.indexOf(a.slug) - order.indexOf(b.slug)
    );
    return { legalPages: legal, otherPages: other };
  }, [items]);

  const handledivelete = async (id: string, slug: string) => {
    if (isLegalPageSlug(slug)) {
      alert(
        isRtl
          ? 'لا يمكن حذف صفحات السياسة والشروط من هنا.'
          : 'Legal pages cannot be deleted from here.'
      );
      return;
    }
    if (!confirm(isRtl ? 'حذف هذه الصفحة؟' : 'divelete this page?')) return;
    try {
      await apiClient.delete(`/pages/${id}`);
      setItems(items.filter((item) => item.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || (isRtl ? 'فشل الحذف' : 'divelete failed'));
    }
  };

  const legalMeta: Record<
    string,
    { icon: typeof Shield; labelAr: string; labelEn: string }
  > = {
    privacy: {
      icon: Shield,
      labelAr: 'سياسة الخصوصية',
      labelEn: 'Privacy Policy',
    },
    terms: {
      icon: Scale,
      labelAr: 'الشروط والأحكام',
      labelEn: 'Terms & Conditions',
    },
  };

  if (loading) {
    return <div>{isRtl ? 'جاري التحميل...' : 'Loading...'}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isRtl ? 'الصفحات' : 'Pages'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isRtl
              ? 'تحرير سياسة الخصوصية والشروط من البطاقات أدناه.'
              : 'Edit privacy policy and terms from the cards below.'}
          </p>
        </div>
        <Button asChild>
          <Link href={adminPath('/admin/pages/create')}>
            <Plus className="w-4 h-4 me-2" />{' '}
            {isRtl ? 'إضافة صفحة' : 'Add Page'}
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {isRtl ? 'الصفحات القانونية' : 'Legal pages'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEGAL_SLUGS.map((slug) => {
            const page = legalPages.find((p) => p.slug === slug);
            const meta = legalMeta[slug];
            const Icon = meta.icon;
            const label = isRtl ? meta.labelAr : meta.labelEn;

            if (!page) {
              return (
                <Card key={slug} className="border-dashed opacity-70">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {isRtl
                        ? 'غير موجودة في قاعدة البيانات. شغّل seed للباك‌اند.'
                        : 'Not in database. Run backend seed.'}
                    </p>
                  </CardContent>
                </Card>
              );
            }

            return (
              <Card key={page.id} className="border-primary/30">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    {label}
                    <Badge variant="secondary" className="ms-auto text-xs">
                      {slug}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-sm text-muted-foreground">
                    {formatBilingual(page.title)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild>
                      <Link href={adminPath(`/admin/pages/${page.id}/edit`)}>
                        <Edit className="w-4 h-4 me-2" />
                        {isRtl ? 'تعديل المحتوى' : 'Edit content'}
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href={`/${locale}/${slug}`} target="_blank">
                        {isRtl ? 'معاينة' : 'Preview'}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {isRtl ? 'باقي الصفحات' : 'Other pages'}
        </h2>
        {otherPages.length === 0 ? (
          <div className="text-center p-12 bg-card rounded-lg border border-dashed border-border text-muted-foreground">
            {isRtl ? 'لا توجد صفحات أخرى.' : 'No other pages.'}
          </div>
        ) : (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tTable('title')}</TableHead>
                  <TableHead>{tTable('slug')}</TableHead>
                  <TableHead>{tTable('created')}</TableHead>
                  <TableHead className="text-end">{tTable('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {otherPages.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-semibold">
                      {formatBilingual(item.title || item.name)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.slug}
                    </TableCell>
                    <TableCell>
                      {new Date(item.createdAt).toLocaleDateString(
                        isRtl ? 'ar-EG' : 'en-GB'
                      )}
                    </TableCell>
                    <TableCell className="text-end">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={adminPath(`/admin/pages/${item.id}/edit`)}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handledivelete(item.id, item.slug)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
