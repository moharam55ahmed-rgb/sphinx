'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnimatedReveal } from '@/components/shared/AnimatedReveal';
import { PageHero } from '@/components/shared/PageHero';
import { cn } from '@/lib/utils';
import { getSettings, getProjects, submitContactForm } from '@/lib/public-api';
import { siteInfo, projects, socialLinks as staticSocial } from '@/data/site';
import { SocialLinks, resolveSocialLinks } from '@/components/shared/SocialLinks';
import { t as translate } from '@/lib/translate';
import { getSettingText } from '@/lib/contact-links';
import { findSection, findPageHeroSection, getSectionHeroImage, type CmsSection } from '@/lib/section-media';

function toHrefString(href: unknown): string {
  if (typeof href === 'string') return href;
  if (href && typeof href === 'object' && 'text' in href) {
    return String((href as { text: string }).text || '');
  }
  return '';
}

function isExternalUrl(href: unknown): boolean {
  const s = toHrefString(href);
  return s.startsWith('http://') || s.startsWith('https://');
}

function getContactHeroSection(pageData?: { sections?: CmsSection[] }) {
  const sections = pageData?.sections ?? [];
  return findSection(sections, 'contact-hero') || findPageHeroSection(sections);
}

export function ContactContent({
  pageData,
}: {
  pageData?: { sections?: Array<Record<string, unknown>> } | null;
}) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [dynamicProjects, setDynamicProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes] = await Promise.all([
          getSettings(),
          getProjects()
        ]);
        setSettings(settingsRes);
        setDynamicProjects(projectsRes);
      } catch (err) {
        console.error("Failed to fetch contact data", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: `New Request: ${formData.get('requestType')} - ${formData.get('preferredMall')}`,
      message: `Request Type: ${formData.get('requestType')}\nMall: ${formData.get('preferredMall')}\nUnit: ${formData.get('unitType')}\n\nMessage: ${formData.get('message')}`,
    };

    try {
      await submitContactForm(data);
      alert(isRtl ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert(isRtl ? 'حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.' : 'Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneText = getSettingText(settings?.phone, siteInfo.phone, locale);
  const emailText = getSettingText(settings?.email, siteInfo.email, locale);
  const mapsHref = getSettingText(
    settings?.googleMaps,
    siteInfo.googleMaps,
    locale
  );

  const contactItems = [
    {
      icon: Phone,
      label: isRtl ? 'الهاتف' : 'Phone',
      value: phoneText,
      href: phoneText ? `tel:${phoneText}` : undefined,
    },
    {
      icon: Mail,
      label: isRtl ? 'البريد الإلكتروني' : 'Email',
      value: emailText,
      href: emailText ? `mailto:${emailText}` : undefined,
    },
    {
      icon: MapPin,
      label: isRtl ? 'العنوان' : 'Address',
      value: isRtl
        ? getSettingText(settings?.addressAr, siteInfo.addressAr, locale)
        : getSettingText(settings?.addressEn, siteInfo.addressEn, locale),
      href: mapsHref || undefined,
    },
    {
      icon: Clock,
      label: isRtl ? 'ساعات العمل' : 'Working Hours',
      value: isRtl ? 'السبت - الخميس: 9 ص - 6 م' : 'Sat - Thu: 9 AM - 6 PM',
    },
  ];

  const displayProjects = dynamicProjects.length > 0 ? dynamicProjects : projects;

  const social = resolveSocialLinks(settings?.socialLinks, staticSocial);

  const heroSection = getContactHeroSection(pageData ?? undefined);
  const heroImage = getSectionHeroImage(heroSection);

  return (
    <>
      <PageHero
        title={
          heroSection?.title
            ? (heroSection.title as string | Record<string, string>)
            : isRtl
              ? 'اتصل بنا'
              : 'Contact Us'
        }
        subtitle={
          heroSection?.subtitle
            ? (heroSection.subtitle as string | Record<string, string>)
            : isRtl
              ? 'تواصل معنا وسيتم مناقشة استفسارك من خلال فريقنا المختص'
              : 'Get in touch with us and our specialized team will address your inquiries'
        }
        backgroundImage={heroImage}
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className={cn('grid lg:grid-cols-3 gap-12', isRtl && 'direction-rtl')}>
            {/* Contact Info — on right for RTL, left for LTR */}
            <div className={cn('lg:col-span-1', isRtl && 'lg:order-last')}>
              <AnimatedReveal>
                <div className="bg-card rounded-2xl p-8 border border-border h-full">
                  <h2 className="text-2xl font-bold text-foreground mb-8">
                    {isRtl ? 'معلومات التواصل' : 'Contact Information'}
                  </h2>

                  <div className="space-y-6">
                    {contactItems.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-4"
                          dir={isRtl ? 'rtl' : 'ltr'}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1 text-start">
                            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                            {item.href ? (
                              <a
                                href={toHrefString(item.href)}
                                target={isExternalUrl(item.href) ? '_blank' : undefined}
                                rel={
                                  isExternalUrl(item.href)
                                    ? 'noopener noreferrer'
                                    : undefined
                                }
                                className="text-foreground hover:text-primary transition-colors"
                              >
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-foreground">{item.value}</p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div className="mt-8 pt-8 border-t border-border" dir={isRtl ? 'rtl' : 'ltr'}>
                    <p className="text-sm text-muted-foreground mb-4 text-start">
                      {isRtl ? 'تابعنا على' : 'Follow Us'}
                    </p>
                    <SocialLinks links={social} alignEnd={isRtl} />
                  </div>
                </div>
              </AnimatedReveal>
            </div>

            {/* Contact Form */}
            <div className={cn('lg:col-span-2', isRtl && 'lg:order-first')}>
              <AnimatedReveal delay={0.2}>
                <div className="bg-card rounded-2xl p-8 border border-border">
                  <h2 className={cn('text-2xl font-bold text-foreground mb-8', isRtl && 'text-right')}>
                    {isRtl ? 'أرسل رسالة' : 'Send a Message'}
                  </h2>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    dir={isRtl ? 'rtl' : 'ltr'}
                  >
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t('form.name')}</Label>
                        <Input
                          id="name"
                          name="name"
                          required
                          className="bg-background border-border focus:border-primary"
                          placeholder={isRtl ? 'الاسم الكامل' : 'Full name'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('form.phone')}</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          dir="ltr"
                          className="bg-background border-border focus:border-primary"
                          placeholder="+20 1xx xxx xxxx"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t('form.email')}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        dir="ltr"
                        className="bg-background border-border focus:border-primary"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="requestType">{t('form.requestType')}</Label>
                        <Select name="requestType">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder={isRtl ? 'اختر نوع الطلب' : 'Select request type'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rent">{t('form.rent')}</SelectItem>
                            <SelectItem value="purchase">{t('form.purchase')}</SelectItem>
                            <SelectItem value="other">{t('form.other')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="preferredMall">{t('form.preferredMall')}</Label>
                        <Select name="preferredMall">
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue placeholder={isRtl ? 'اختر المول' : 'Select mall'} />
                          </SelectTrigger>
                          <SelectContent>
                            {displayProjects.map((project: any) => (
                              <SelectItem key={project.id || project.slug} value={project.slug}>
                                {project.title
                                  ? translate(project.title, locale)
                                  : isRtl
                                    ? project.nameAr
                                    : project.nameEn}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unitType">{t('form.unitType')}</Label>
                      <Select name="unitType">
                        <SelectTrigger className="bg-background border-border">
                          <SelectValue placeholder={isRtl ? 'اختر نوع الوحدة' : 'Select unit type'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="shop">{t('form.shop')}</SelectItem>
                          <SelectItem value="clinic">{t('form.clinic')}</SelectItem>
                          <SelectItem value="office">{t('form.office')}</SelectItem>
                          <SelectItem value="restaurant">{t('form.restaurant')}</SelectItem>
                          <SelectItem value="other">{t('form.other')}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">{t('form.message')}</Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={5}
                        className="bg-background border-border focus:border-primary resize-none"
                        placeholder={isRtl ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className={cn('flex items-center gap-2', isRtl && 'flex-row-reverse')}>
                          <span className="w-4 h-4 border-2 border-muted-foreground/30 border-t-primary rounded-full animate-spin" />
                          {isRtl ? 'جاري الإرسال...' : 'Sending...'}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className={cn("w-4 h-4", isRtl && "ml-2")} />
                          {t('cta.submit')}
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </AnimatedReveal>
            </div>
          </div>

          {/* Map Section */}
          <AnimatedReveal delay={0.3}>
            <div className="mt-16">
              <div className="rounded-2xl overflow-hidden border border-border h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55253.567508866736!2d31.5!3d30.08333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14581e2f0b5d5ae9%3A0x8b8e4e8e8e8e8e8e!2sEl%20Shorouk%20City%2C%20Egypt!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isRtl ? 'خريطة الموقع' : 'Location Map'}
                />
              </div>
            </div>
          </AnimatedReveal>
        </div>
      </section>
    </>
  );
}
