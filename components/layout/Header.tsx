'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { projects } from '@/data/site';

export function Header() {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRtl = locale === 'ar';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/about', label: t('about') },
    {
      href: '/projects',
      label: t('projects'),
      dropdown: projects.map((p) => ({
        href: `/projects/${p.slug}`,
        label: isRtl ? p.nameAr : p.nameEn,
      })),
    },
    {
      href: '/gallery/photos',
      label: t('gallery'),
      dropdown: [
        { href: '/gallery/photos', label: t('photos') },
        { href: '/gallery/videos', label: t('videos') },
      ],
    },
    { href: '/news', label: t('news') },
    { href: '/team', label: t('team') },
    { href: '/careers', label: t('careers') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-border py-3'
          : 'bg-background/50 backdrop-blur-md py-5 border-b border-transparent dark:bg-transparent dark:border-none'
      )}
    >
      <div className="container mx-auto px-4">
        {/*
          dir="rtl" on <html> already makes flex-row go right→left.
          Logo (first) → FAR RIGHT in Arabic ✓
          Nav (second) → CENTER ✓
          Actions (last) → FAR LEFT in Arabic ✓
          NO flex-row-reverse needed.
        */}
        <div className="flex items-center justify-between">
          {/* Logo — first child: appears on RIGHT in RTL, LEFT in LTR */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/images/sphinx-logo-final.png"
              alt={isRtl ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate Development'}
              width={200}
              height={56}
              className="h-16 w-auto object-contain dark:mix-blend-screen mix-blend-multiply dark:invert-0 invert"
              priority
            />
          </Link>

          {/* Desktop Nav — items flow in reading direction automatically */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.href}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={cn(
                        'flex items-center gap-1 px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors',
                        pathname.startsWith(item.href) && item.href !== '/' && 'text-primary'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={isRtl ? 'end' : 'start'}
                    dir={isRtl ? 'rtl' : 'ltr'}
                    className="bg-card/95 backdrop-blur-xl border-border min-w-[200px]"
                  >
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.href} asChild>
                        <Link
                          href={subItem.href}
                          className={cn("cursor-pointer text-foreground/80 hover:text-foreground hover:bg-foreground/5", isRtl && "text-right w-full block")}
                        >
                          {subItem.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors',
                    pathname === item.href && 'text-primary'
                  )}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions — last child: appears on LEFT in RTL, RIGHT in LTR */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <LanguageSwitcher />
            <Link href="/contact" className="hidden lg:block">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                {tCta('contactUs')}
              </Button>
            </Link>
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRtl ? 'right' : 'left'}
                className="bg-background border-border w-[300px]"
              >
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center justify-between">
                    <Image
                      src="/images/sphinx-logo-new.png"
                      alt={isRtl ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate Development'}
                      width={160}
                      height={44}
                      className="h-12 w-auto object-contain dark:mix-blend-screen mix-blend-multiply dark:invert-0 invert"
                    />
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="text-foreground">
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-2 w-full">
                    {navItems.map((item) => (
                      <div key={item.href}>
                        <SheetClose asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'block px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors w-full',
                              pathname === item.href && 'text-primary bg-foreground/5',
                              isRtl && 'text-right'
                            )}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                        {item.dropdown && (
                          <div className={cn('mt-1', isRtl ? 'pr-4' : 'pl-4')}>
                            {item.dropdown.map((subItem) => (
                              <SheetClose asChild key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={cn("block px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors", isRtl && "text-right")}
                                >
                                  {subItem.label}
                                </Link>
                              </SheetClose>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="pt-4 border-t border-border w-full">
                    <Link href="/contact" className="block">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        {tCta('contactUs')}
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
