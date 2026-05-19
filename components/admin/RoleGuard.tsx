'use client';
import { useAuthStore } from '@/store/auth-store';

export function RoleGuard({ roles, children, fallback = null }: { roles: string[], children: React.ReactNode, fallback?: React.ReactNode }) {
  const { user } = useAuthStore();
  
  // If no user or user role not in allowed roles
  if (!user || (!roles.includes(user.role) && user.role !== 'SUPER_ADMIN')) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}