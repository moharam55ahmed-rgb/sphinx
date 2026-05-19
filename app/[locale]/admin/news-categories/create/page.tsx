'use client';

import { ContentCategoryForm } from '@/components/admin/ContentCategoryForm';

export default function CreateNewsCategoryPage() {
  return (
    <ContentCategoryForm
      apiBase="/news-categories"
      listPath="/admin/news-categories"
      titleCreate="Add News Category"
      titleEdit="Edit News Category"
    />
  );
}
