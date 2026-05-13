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
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => switchLocale('ar')}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-medium transition-all',
          locale === 'ar'
            ? 'bg-primary text-primary-foreground'
            : 'text-white/70 hover:text-white hover:bg-white/10'
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
            : 'text-white/70 hover:text-white hover:bg-white/10'
        )}
      >
        EN
      </Button>
    </div>
  );
}
