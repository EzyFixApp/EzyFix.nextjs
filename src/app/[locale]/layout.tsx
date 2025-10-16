import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import TopLoader from '@/components/TopLoader';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

export const metadata: Metadata = {
  icons: [
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/LogoEzyFix.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/LogoEzyFix.png',
    },
    {
      rel: 'icon',
      url: '/LogoEzyFix.png',
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body>
        <TopLoader />
        <NextIntlClientProvider>
          <PostHogProvider>
            {props.children}
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
