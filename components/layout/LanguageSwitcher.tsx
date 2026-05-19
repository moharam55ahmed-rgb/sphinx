'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1 border border-border">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale('ar')}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium transition-all',
          locale === 'ar'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-background'
        )}
      >
        AR
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale('en')}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium transition-all',
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground hover:bg-background'
        )}
      >
        EN
      </Button>
    </div>
  );
}
