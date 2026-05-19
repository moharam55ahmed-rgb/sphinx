'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
} from 'lucide-react';
import { getSettings, getNavigation, getProjects } from '@/lib/public-api';
import { t as translate } from '@/lib/translate';
import {
  mapApiNavigation,
  getDefaultFooterNav,
  navLabel,
  type NavLink,
} from '@/lib/navigation';
import { projects, contactInfo, socialLinks as staticSocial } from '@/data/site';
import { SiteLogo, resolveSiteLogoUrl } from './SiteLogo';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const pathname = usePathname();

  const [settings, setSettings] = useState<any>(null);
  const [quickLinks, setQuickLinks] = useState<NavLink[]>(getDefaultFooterNav(tNav));
  const [footerProjects, setFooterProjects] = useState(projects);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    const fetchFooterData = async () => {
      try {
        const [settingsData, navData, projectsData] = await Promise.all([
          getSettings(),
          getNavigation('footer').catch(() => []),
          getProjects({ limit: 10 }).catch(() => []),
        ]);
        setSettings(settingsData);

        if (navData?.length) {
          setQuickLinks(mapApiNavigation(navData, locale));
        } else {
          setQuickLinks(getDefaultFooterNav(tNav));
        }

        if (projectsData?.length) {
          setFooterProjects(projectsData);
        }
      } catch (err) {
        console.error('Failed to fetch footer data', err);
        setQuickLinks(getDefaultFooterNav(tNav));
      }
    };
    fetchFooterData();
  }, [pathname, locale, tNav]);

  if (pathname.startsWith('/admin')) return null;

  const socialRaw = settings?.socialLinks ?? settings?.social;
  let apiSocial: Record<string, string> = {};
  if (socialRaw && typeof socialRaw === 'object' && !('text' in socialRaw)) {
    apiSocial = socialRaw as Record<string, string>;
  } else if (typeof socialRaw === 'string') {
    try {
      apiSocial = JSON.parse(socialRaw);
    } catch {
      apiSocial = {};
    }
  }

  const social = {
    facebook: apiSocial.facebook || staticSocial.facebook,
    youtube: apiSocial.youtube || staticSocial.youtube,
    instagram: apiSocial.instagram || staticSocial.instagram,
    twitter: apiSocial.twitter || staticSocial.twitter,
    linkedin: apiSocial.linkedin || staticSocial.linkedin,
  };

  const addressField =
    locale === 'ar' ? settings?.addressAr : settings?.addressEn;

  return (
    <footer className="bg-secondary/20 border-t border-border pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Company Info — logo + about + social (RTL via html dir) */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <SiteLogo
                logoUrl={resolveSiteLogoUrl(settings?.logo)}
                alt={
                  isRtl
                    ? 'سفنكس للتطوير العقاري'
                    : 'SPHINX Real Estate Development'
                }
                width={200}
                height={56}
                className="h-16"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm">
              {settings?.aboutText
                ? translate(settings.aboutText, locale)
                : t('about')}
            </p>
            <div className="flex gap-3">
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {social.linkedin && (
                <a
                  href={social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">{t('quickLinks')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {navLabel(link, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">{t('ourProjects')}</h4>
            <ul className="space-y-3">
              {footerProjects.map((project: {
                slug: string;
                title?: unknown;
                nameAr?: string;
                nameEn?: string;
              }) => (
                <li key={project.slug}>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {project.title
                      ? translate(project.title, locale)
                      : isRtl
                        ? project.nameAr
                        : project.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold">{t('contactInfo')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">
                  {addressField
                    ? translate(addressField, locale)
                    : isRtl
                      ? contactInfo.addressAr
                      : contactInfo.addressEn}
                </span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span dir="ltr" className="text-sm">
                  {settings?.phone
                    ? translate(settings.phone, locale)
                    : contactInfo.phone}
                </span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">
                  {settings?.email
                    ? translate(settings.email, locale)
                    : contactInfo.email}
                </span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm">
                  {settings?.officeHours
                    ? translate(settings.officeHours, locale)
                    : isRtl
                      ? '9:00 ص - 6:00 م'
                      : '9:00 AM - 6:00 PM'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted-foreground text-xs">
            {isRtl ? (
              <>
                جميع الحقوق محفوظة © تصميم{' '}
                <a
                  href="https://www.qeematech.net/"
                  rel="dofollow"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Qeematech
                </a>
              </>
            ) : (
              <>
                All Rights Reserved © Designed by{' '}
                <a
                  href="https://www.qeematech.net/"
                  rel="dofollow"
                  target="_blank"
                  className="text-primary hover:underline"
                >
                  Qeematech
                </a>
              </>
            )}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary text-xs transition-colors"
            >
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary text-xs transition-colors"
            >
              {isRtl ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
