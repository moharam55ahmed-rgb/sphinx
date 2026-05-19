export function t(field: any, locale: string = 'en'): string {
  if (field == null || field === '') return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);

  if (typeof field === 'object') {
    if ('text' in field && field.text != null) {
      return t(field.text, locale);
    }

    if (locale in field && typeof field[locale] === 'string') {
      return field[locale];
    }
    if ('en' in field && typeof field.en === 'string') {
      return field.en;
    }
    if ('ar' in field && typeof field.ar === 'string') {
      return field.ar;
    }

    const first = Object.values(field)[0];
    if (typeof first === 'string') return first;
    if (first != null && typeof first === 'object') {
      return t(first, locale);
    }

    return '';
  }

  return String(field);
}

/** Admin tables: show both locales, e.g. "Home (الرئيسية)" */
export function formatBilingual(field: any): string {
  if (field == null || field === '') return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'number' || typeof field === 'boolean') return String(field);

  if (typeof field === 'object') {
    if ('text' in field && field.text != null) {
      return formatBilingual(field.text);
    }
    const en = typeof field.en === 'string' ? field.en : '';
    const ar = typeof field.ar === 'string' ? field.ar : '';
    if (en && ar) return `${en} (${ar})`;
    if (en || ar) return en || ar;
    return '';
  }

  return String(field);
}
