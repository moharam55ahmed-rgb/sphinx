'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import { getSettings } from '@/lib/public-api';
import { contactInfo } from '@/data/site';
import {
  getSettingText,
  toTelHref,
  toWhatsAppHref,
} from '@/lib/contact-links';

export function FloatingContactButtons() {
  const locale = useLocale();
  const pathname = usePathname();
  const isRtl = locale === 'ar';
  const [phone, setPhone] = useState(contactInfo.phone);
  const [whatsapp, setWhatsapp] = useState(contactInfo.whatsapp);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    getSettings()
      .then((data) => {
        setPhone(getSettingText(data?.phone, contactInfo.phone, locale));
        setWhatsapp(
          getSettingText(data?.whatsapp, contactInfo.whatsapp, locale)
        );
      })
      .catch(() => {
        /* keep defaults */
      });
  }, [pathname, locale]);

  if (pathname.startsWith('/admin')) return null;

  const telHref = toTelHref(phone);
  const waHref = toWhatsAppHref(whatsapp);

  if (!telHref && !waHref) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {telHref && (
        <motion.a
          href={telHref}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg hover:shadow-xl transition-shadow"
          aria-label={isRtl ? 'اتصل بنا' : 'Call us'}
          title={isRtl ? 'اتصل بنا' : 'Call us'}
        >
          <Phone className="w-6 h-6" />
        </motion.a>
      )}

      {waHref && (
        <motion.a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow"
          aria-label={isRtl ? 'واتساب' : 'WhatsApp'}
          title={isRtl ? 'واتساب' : 'WhatsApp'}
        >
          <MessageCircle className="w-7 h-7" />
        </motion.a>
      )}
    </div>
  );
}
