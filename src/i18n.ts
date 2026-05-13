import { getRequestConfig } from 'next-intl/server';

// Can be imported from a shared config
export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
