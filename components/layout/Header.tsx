'use client';

import { useState, useEffect } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { SiteLogo, resolveSiteLogoUrl } from './SiteLogo';
import { getSettings, getProjects, getNavigation } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';
import {
  mapApiNavigation,
  getDefaultHeaderNav,
  navLabel,
  type NavLink,
} from '@/lib/navigation';

export function Header() {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const locale = useLocale();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  const isRtl = locale === 'ar';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const projectLinks: NavLink[] = [];
    const galleryDropdown: NavLink[] = [
      { href: '/gallery/photos', label: t('photos') },
      { href: '/gallery/videos', label: t('videos') },
    ];

    setNavItems(getDefaultHeaderNav(t, projectLinks));

    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes, navRes] = await Promise.all([
          getSettings(),
          getProjects({ limit: 10 }),
          getNavigation('header').catch(() => []),
        ]);

        if (projectsRes.length > 0) {
          projectsRes.forEach((p: { slug: string; title: unknown }) => {
            projectLinks.push({
              href: `/projects/${p.slug}`,
              label: translate(p.title, locale),
            });
          });
        }

        if (navRes?.length) {
          setNavItems(
            mapApiNavigation(navRes, locale, { projectLinks, galleryDropdown })
          );
        } else {
          setNavItems(getDefaultHeaderNav(t, projectLinks));
        }

        setSettings(settingsRes);
      } catch (err) {
        console.error('Failed to fetch header data', err);
        setNavItems(getDefaultHeaderNav(t, projectLinks));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [locale, t]);


  if (pathname.startsWith('/admin')) return null;

  const logoAlt = isRtl
    ? 'سفنكس للتطوير العقاري'
    : 'SPHINX Real Estate Development';
  const logoUrl = resolveSiteLogoUrl(settings?.logo);

  return (
    <motion.header
      initial={false}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        /* Light: solid header */
        'bg-background/98 backdrop-blur-md border-border shadow-[0_1px_0_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]',
        /* Dark: transparent over hero, solid when scrolled */
        'dark:shadow-none',
        isScrolled
          ? 'py-3 dark:bg-background/95 dark:backdrop-blur-xl dark:border-border dark:shadow-md'
          : 'py-5 dark:bg-transparent dark:border-transparent dark:backdrop-blur-md dark:shadow-none'
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
            <SiteLogo
              logoUrl={logoUrl}
              alt={logoAlt}
              width={200}
              height={56}
              className="h-16"
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
                        !isScrolled && 'dark:text-white/90 dark:hover:text-white',
                        pathname.startsWith(item.href) && item.href !== '/' && 'text-primary'
                      )}
                    >
                      {navLabel(item, locale)}
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
                          {navLabel(subItem, locale)}
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
                    !isScrolled && 'dark:text-white/90 dark:hover:text-white',
                    pathname === item.href && 'text-primary'
                  )}
                >
                  {navLabel(item, locale)}
                </Link>
              )
            )}
          </nav>

          {/* Actions — last child: appears on LEFT in RTL, RIGHT in LTR */}
          <div
            className={cn(
              'flex items-center gap-3',
              !isScrolled &&
                'dark:[&_button]:text-white/90 dark:[&_button]:hover:text-white dark:[&_button]:hover:bg-white/10'
            )}
          >
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
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'text-foreground',
                    !isScrolled && 'dark:text-white dark:hover:bg-white/10'
                  )}
                >
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRtl ? 'right' : 'left'}
                className="bg-background border-border w-[300px] [&>button:last-of-type]:hidden"
              >
                <SheetTitle className="sr-only">
                  {isRtl ? 'قائمة التنقل' : 'Navigation menu'}
                </SheetTitle>
                <div className="flex flex-col gap-6 mt-8">
                  <div className="flex items-center justify-between">
                    <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                      <SiteLogo
                        logoUrl={logoUrl}
                        alt={logoAlt}
                        width={160}
                        height={44}
                        className="h-12"
                      />
                    </Link>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon" className="text-foreground">
                        <X className="w-5 h-5" />
                      </Button>
                    </SheetClose>
                  </div>

                  <nav className="flex flex-col gap-2 w-full">
                    {navItems.map((item) => (
                      <div key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            'block px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors w-full',
                            pathname === item.href && 'text-primary bg-foreground/5',
                            isRtl && 'text-right'
                          )}
                        >
                          {navLabel(item, locale)}
                        </Link>
                        {item.dropdown && (
                          <div className={cn('mt-1', isRtl ? 'pr-4' : 'pl-4')}>
                            {item.dropdown.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  'block px-4 py-2 text-sm text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors',
                                  isRtl && 'text-right'
                                )}
                              >
                                {navLabel(subItem, locale)}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>

                  <div className="pt-4 border-t border-border w-full">
                    <Link
                      href="/contact"
                      className="block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
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
