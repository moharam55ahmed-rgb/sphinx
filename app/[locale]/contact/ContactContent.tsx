'use client';

import { useState } from 'react';
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
import { projects, siteInfo } from '@/data/site';

export function ContactContent() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert(isRtl ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!');
  };

  const contactItems = [
    {
      icon: Phone,
      label: isRtl ? 'الهاتف' : 'Phone',
      value: siteInfo.phone,
      href: `tel:${siteInfo.phone}`,
    },
    {
      icon: Mail,
      label: isRtl ? 'البريد الإلكتروني' : 'Email',
      value: siteInfo.email,
      href: `mailto:${siteInfo.email}`,
    },
    {
      icon: MapPin,
      label: isRtl ? 'العنوان' : 'Address',
      value: isRtl ? siteInfo.addressAr : siteInfo.addressEn,
      href: siteInfo.googleMaps,
    },
    {
      icon: Clock,
      label: isRtl ? 'ساعات العمل' : 'Working Hours',
      value: isRtl ? 'السبت - الخميس: 9 ص - 6 م' : 'Sat - Thu: 9 AM - 6 PM',
    },
  ];

  return (
    <>
      {/* Fixed: PageHero accepts title/subtitle — locale selected here */}
      <PageHero
        title={isRtl ? 'اتصل بنا' : 'Contact Us'}
        subtitle={
          isRtl
            ? 'تواصل معنا وسيتم مناقشة استفسارك من خلال فريقنا المختص'
            : 'Get in touch with us and our specialized team will address your inquiries'
        }
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
                          className={cn(
                            'flex items-start gap-4',
                            isRtl && 'text-right'
                          )}
                        >
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                            {item.href ? (
                              <a
                                href={item.href}
                                target={item.href.startsWith('http') ? '_blank' : undefined}
                                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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

                  {/* Social Links */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <p className={cn('text-sm text-muted-foreground mb-4', isRtl && 'text-right')}>
                      {isRtl ? 'تابعنا على' : 'Follow Us'}
                    </p>
                    <div className={cn('flex gap-3', isRtl && 'justify-end')}>
                      {Object.entries(siteInfo.social).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-full bg-foreground/5 hover:bg-primary/20 flex items-center justify-center text-foreground/60 hover:text-primary transition-colors"
                        >
                          <span className="sr-only">{platform}</span>
                          <span className="text-sm capitalize">{platform[0].toUpperCase()}</span>
                        </a>
                      ))}
                    </div>
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
                            {projects.map((project) => (
                              <SelectItem key={project.id} value={project.slug}>
                                {isRtl ? project.nameAr : project.nameEn}
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
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
