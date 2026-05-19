'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Mail, Phone, Linkedin, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  type TeamMemberRecord,
  getMemberName,
  getMemberJobTitle,
  getMemberBio,
  formatLinkedInUrl,
} from '@/lib/team';

type Props = {
  member: TeamMemberRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TeamMemberDialog({ member, open, onOpenChange }: Props) {
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const name = member ? getMemberName(member, locale) : '';
  const jobTitle = member ? getMemberJobTitle(member, locale) : '';
  const bio = member ? getMemberBio(member, locale) : '';
  const linkedIn = member ? formatLinkedInUrl(member.linkedin) : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'w-[calc(100%-1.5rem)] max-w-[min(920px,96vw)] p-0 gap-0 overflow-hidden border-border',
          'sm:max-w-[min(920px,96vw)]',
          isRtl
            ? '[&>button]:top-3 [&>button]:start-3 [&>button]:end-auto [&>button]:left-3 [&>button]:right-auto'
            : '[&>button]:top-3 [&>button]:end-3 [&>button]:start-auto',
          '[&>button]:z-30 [&>button]:bg-background/95 [&>button]:backdrop-blur-sm [&>button]:rounded-full [&>button]:shadow-sm'
        )}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {!member ? (
          <DialogTitle className="sr-only">Team member</DialogTitle>
        ) : (
          <div className="flex flex-col md:flex-row md:min-h-[320px]">
            <aside
              className={cn(
                'shrink-0 flex items-center justify-center',
                'bg-secondary/30 border-border',
                'p-5 sm:p-6 md:w-[min(42%,300px)] md:min-w-[240px] md:max-w-[300px]',
                isRtl ? 'md:border-s border-b md:border-b-0' : 'md:border-e border-b md:border-b-0'
              )}
            >
              <div className="relative w-full max-w-[260px] aspect-[3/4] min-h-[220px] max-h-[min(70vh,380px)] mx-auto">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={name}
                    fill
                    className="object-contain object-center"
                    sizes="300px"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-muted/50">
                    <User className="w-16 h-16 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            </aside>

            <div
              dir={isRtl ? 'rtl' : 'ltr'}
              className={cn(
                'flex-1 flex flex-col min-w-0 max-h-[min(85vh,520px)] overflow-y-auto',
                'p-5 sm:p-6 md:p-8',
                isRtl ? 'items-start text-right' : 'items-start text-left'
              )}
            >
              {isRtl ? (
                <div className="mb-4 w-full space-y-2 text-right">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight text-right">
                    {name}
                  </h2>
                  {jobTitle && (
                    <p className="text-primary text-base sm:text-lg font-semibold text-right">
                      {jobTitle}
                    </p>
                  )}
                </div>
              ) : (
                <DialogHeader className="space-y-2 p-0 mb-4 w-full !items-start !text-left sm:!text-left">
                  <DialogTitle className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight w-full text-left">
                    {name}
                  </DialogTitle>
                  {jobTitle && (
                    <DialogDescription className="text-primary text-base sm:text-lg font-semibold w-full block text-left">
                      {jobTitle}
                    </DialogDescription>
                  )}
                </DialogHeader>
              )}

              {bio && (
                <p
                  className={cn(
                    'text-muted-foreground leading-relaxed text-sm sm:text-base whitespace-pre-wrap flex-1 w-full',
                    isRtl ? 'text-right' : 'text-left'
                  )}
                >
                  {bio}
                </p>
              )}

              {(member.phone || member.email || linkedIn) && (
                <div
                  className="flex flex-wrap gap-2 pt-5 mt-5 border-t border-border w-full justify-start"
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {member.phone && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={`tel:${member.phone.replace(/\s/g, '')}`}>
                        <Phone className="w-4 h-4 shrink-0" />
                        <span dir="ltr">{member.phone}</span>
                      </a>
                    </Button>
                  )}
                  {member.email && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="w-4 h-4 shrink-0" />
                        <span dir="ltr" className="break-all sm:break-normal">
                          {member.email}
                        </span>
                      </a>
                    </Button>
                  )}
                  {linkedIn && (
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <a href={linkedIn} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="w-4 h-4 shrink-0" />
                        LinkedIn
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
