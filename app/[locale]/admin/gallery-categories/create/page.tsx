'use client';

import { ContentCategoryForm } from '@/components/admin/ContentCategoryForm';

export default function CreateGalleryCategoryPage() {
  return (
    <ContentCategoryForm
      apiBase="/gallery-categories"
      listPath="/admin/gallery-categories"
      titleCreate="Add Gallery Category"
      titleEdit="Edit Gallery Category"
    />
  );
}
