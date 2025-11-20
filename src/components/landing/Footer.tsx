import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center">
              <div className="flex translate-y-0.5 items-center justify-center">
                <Image
                  src="/assets/images/logo/ezyfix-icon.png"
                  alt="EzyFix Logo"
                  width={36}
                  height={40}
                  className="h-10 w-9"
                />
              </div>
              <span className="text-2xl leading-none font-bold">
                <span className="bg-gradient-to-r from-[#C3EAFA] to-[#5E9BEF] bg-clip-text text-transparent">EzyFix</span>
              </span>
            </div>
            <p className="mb-4 text-gray-400">
              {t('description')}
            </p>
            <p className="text-sm text-gray-500">
              {t('slogan')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{t('quicklinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="#customer"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {t('customer')}
                </Link>
              </li>
              <li>
                <Link
                  href="#technician"
                  className="text-gray-400 transition-colors hover:text-white"
                >
                  {t('technician')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-bold">{t('contact')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start gap-2">
                <svg
                  className="mt-1 size-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>contact@ezyfix.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-1 size-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  className="mt-1 size-5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{t('location')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links */}
        <div className="mt-8 flex items-center justify-center gap-4 border-t border-gray-800 pt-8">
          <a
            href="https://www.facebook.com/profile.php?id=61581405073489"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#609CEF]"
            aria-label="Facebook"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>
          <a
            href="https://zalo.me/ezyfix"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#609CEF]"
            aria-label="Zalo"
          >
            <span className="text-sm font-bold">Z</span>
          </a>
          <a
            href="https://youtube.com/@ezyfix"
            target="_blank"
            rel="noopener noreferrer"
            className="flex size-10 items-center justify-center rounded-full bg-gray-800 transition-colors hover:bg-[#609CEF]"
            aria-label="YouTube"
          >
            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            ©
            {' '}
            {currentYear}
            {' '}
            EzyFix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
