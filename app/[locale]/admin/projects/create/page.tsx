'use client';

import { ProjectForm } from '@/components/admin/ProjectForm';

export default function CreateProject() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
        <p className="text-muted-foreground">Add a new project to your portfolio.</p>
      </div>
      <ProjectForm />
    </div>
  );
}