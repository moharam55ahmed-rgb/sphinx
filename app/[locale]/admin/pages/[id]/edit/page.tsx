'use client';

import { useEffect, useState, use } from 'react';
import { apiClient } from '@/lib/api-client';
import { PageForm } from '../../create/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Layers, Building2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { formatBilingual } from '@/lib/translate';
import { LegalPageEditor } from '@/components/admin/LegalPageEditor';
import { isLegalPageSlug } from '@/lib/legal-cms';
import { useAdminPath } from '@/lib/admin-path';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const adminPath = useAdminPath();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [initialData, setInitialData] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, sectionsRes] = await Promise.all([
          apiClient.get(`/pages/${id}`),
          apiClient.get(`/sections?pageId=${id}`),
        ]);
        setInitialData(pageRes.data.data);
        setSections(sectionsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {isRtl ? 'جاري التحميل...' : 'Loading Page Data...'}
      </div>
    );
  }
  if (!initialData) {
    return <div>{isRtl ? 'الصفحة غير موجودة' : 'Page not found.'}</div>;
  }

  const isLegal = isLegalPageSlug(initialData.slug);
  const isHomePage = initialData.slug === 'home';
  const hasRelatedCompaniesSection = sections.some(
    (s: { sectionKey: string }) => s.sectionKey === 'related-companies'
  );

  if (isLegal) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {isRtl ? 'إعدادات الصفحة' : 'Page metadata'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PageForm initialData={initialData} />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2">
            <LegalPageEditor
              pageId={id}
              slug={initialData.slug}
              pageTitle={initialData.title}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">
          {isRtl ? 'إدارة الصفحة:' : 'Manage Page:'}{' '}
          {formatBilingual(initialData.title)}
        </h2>
        <p className="text-muted-foreground">
          {isRtl
            ? 'إعدادات الصفحة وأقسام المحتوى.'
            : 'Configure page settings and manage content sections.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PageForm initialData={initialData} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isHomePage && (
            <Card className="border-primary/40 bg-primary/5">
              <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className={cn('space-y-1', isRtl && 'text-right')}>
                  <p className="font-semibold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary shrink-0" />
                    {isRtl ? 'شركات ذات صلة' : 'Related companies'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {hasRelatedCompaniesSection
                      ? isRtl
                        ? 'يُعدَّل من صفحة مخصصة في القائمة الجانبية.'
                        : 'Edit from the dedicated sidebar page.'
                      : isRtl
                        ? 'غير ظاهر في القائمة أدناه — اضغط الزر لإنشائه وتعديله.'
                        : 'Not in the list below — click the button to create and edit.'}
                  </p>
                </div>
                <Button asChild>
                  <Link href={adminPath('/admin/related-companies')}>
                    <ExternalLink className="w-4 h-4 me-2" />
                    {isRtl ? 'فتح محرر الشركات' : 'Open companies editor'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card className="border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                {isRtl ? 'أقسام الصفحة' : 'Page Sections'}
              </CardTitle>
              <Button size="sm" asChild>
                <Link href={adminPath(`/admin/sections/create?pageId=${id}`)}>
                  <Plus className="w-4 h-4 me-2" />
                  {isRtl ? 'إضافة قسم' : 'Add Section'}
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {sections.length === 0 ? (
                <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed border-border text-muted-foreground">
                  {isRtl ? 'لا توجد أقسام.' : 'No sections found for this page.'}
                </div>
              ) : (
                <div className="space-y-3">
                  {sections
                    .sort((a, b) => a.sortOrder - b.sortOrder)
                    .map((section) => (
                      <div
                        key={section.id}
                        className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary font-mono text-xs">
                            {section.sortOrder}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">
                              {formatBilingual(section.title || section.sectionName) ||
                                section.sectionKey}
                            </h4>
                            <p className="text-xs text-muted-foreground font-mono">
                              {section.sectionKey}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <Link
                            href={
                              section.sectionKey === 'related-companies'
                                ? adminPath('/admin/related-companies')
                                : section.sectionKey === 'team-members'
                                  ? adminPath('/admin/team')
                                  : adminPath(`/admin/sections/${section.id}/edit`)
                            }
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
