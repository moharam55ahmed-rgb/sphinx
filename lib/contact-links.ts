import { t as translate } from '@/lib/translate';

/** Extract display phone from settings value */
export function getSettingText(
  value: unknown,
  fallback: string,
  locale?: string
): string {
  if (!value) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && value !== null) {
    const v = value as { text?: string; en?: string; ar?: string };
    if (v.text) return v.text;
    if (locale && (v.en || v.ar)) return translate(value, locale);
  }
  return fallback;
}

export function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function toTelHref(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('tel:') ? trimmed : `tel:${trimmed}`;
}

export function toWhatsAppHref(phone: string): string {
  const digits = digitsOnly(phone);
  if (!digits) return '';
  return `https://wa.me/${digits}`;
}
