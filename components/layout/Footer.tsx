'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Facebook, Youtube, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { projects, contactInfo, socialLinks } from '@/data/site';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const quickLinks = [
    { href: '/', label: tNav('home') },
    { href: '/about', label: tNav('about') },
    { href: '/projects', label: tNav('projects') },
    { href: '/news', label: tNav('news') },
    { href: '/careers', label: tNav('careers') },
    { href: '/contact', label: tNav('contact') },
  ];

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container mx-auto px-4 py-16">
        {/*
          Grid columns flow in reading direction automatically with dir attribute.
          In RTL: first column → FAR RIGHT, last → FAR LEFT
          In LTR: first column → FAR LEFT, last → FAR RIGHT
          Logo column is first → appears on RIGHT in Arabic ✓
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Column 1: Logo + About — RIGHT in Arabic */}
          <div className="space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/images/sphinx-logo-final.png"
                alt={isRtl ? 'سفنكس للتطوير العقاري' : 'SPHINX Real Estate Development'}
                width={200}
                height={56}
                className="h-16 w-auto object-contain dark:mix-blend-screen mix-blend-multiply dark:invert-0 invert"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t('about')}
            </p>
            {/* Social icons — flex-row, in RTL they flow right→left automatically */}
            <div className="flex gap-3">
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </a>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Projects */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('ourProjects')}</h3>
            <ul className="space-y-2">
              {projects.map((project) => (
                <li key={project.slug}>
                  <Link href={`/projects/${project.slug}`}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {isRtl ? project.nameAr : project.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Info — LEFT in Arabic */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{t('contactInfo')}</h3>
            <ul className="space-y-3">
              {/*
                flex items: icon (first) + text (second).
                In RTL dir: icon appears on the RIGHT, text on the LEFT ✓
                No flex-row-reverse needed.
              */}
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{contactInfo.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">{contactInfo.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground text-sm">
                  {isRtl ? contactInfo.addressAr : contactInfo.addressEn}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground text-sm">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
