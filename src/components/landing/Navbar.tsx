'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Link, usePathname } from '@/libs/I18nNavigation';
import { routing } from '@/libs/I18nRouting';

const FlagVN = () => (
  <Image
    src="/assets/images/flags/vn.jpg"
    alt="Việt Nam"
    width={20}
    height={14}
    className="rounded"
  />
);

const FlagGB = () => (
  <Image
    src="/assets/images/flags/en.jpg"
    alt="United Kingdom"
    width={20}
    height={14}
    className="rounded"
  />
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('Navbar');

  const localeLabels: Record<string, string> = {
    vi: 'Tiếng Việt',
    en: 'English',
  };

  const localeFlags: Record<string, React.ReactNode> = {
    vi: <FlagVN />,
    en: <FlagGB />,
  };

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past hero section
      setIsScrolled(currentScrollY > 50);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, []);

  // Close dropdowns when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Only apply to desktop (when mobile menu is closed)
      if (!isMobileMenuOpen && !target.closest('.dropdown-container')) {
        setOpenDropdown(null);
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const navLinks = [
    {
      href: '#customer',
      label: t('customer'),
      hasDropdown: true,
      submenu: [
        { href: '/benefits/customer', label: t('benefits'), isPage: true },
        { href: '/rules/customer', label: t('rules'), isPage: true },
      ],
    },
    {
      href: '#technician',
      label: t('technician'),
      hasDropdown: true,
      submenu: [
        { href: '/benefits/technician', label: t('benefits'), isPage: true },
        { href: '/rules/technician', label: t('rules'), isPage: true },
      ],
    },
  ];

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);

    if (element) {
      const navbarHeight = 64; // Height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      setIsMobileMenuOpen(false);
      setOpenDropdown(null);
    }
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <Image
              src="/assets/images/logo/ezyfix-icon.png"
              alt="EzyFix Logo"
              width={200}
              height={65}
              className="relative top-1 h-12 w-auto md:h-16"
              priority
            />
            <span className="bg-gradient-to-r from-[#C3EAFA] to-[#5E9BEF] bg-clip-text text-xl font-bold text-transparent md:text-2xl">
              EzyFix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map(link => (
              <div key={link.href} className="dropdown-container relative">
                {link.hasDropdown
                  ? (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(link.label)}
                          className={`flex cursor-pointer items-center gap-1 text-sm font-medium transition-colors ${
                            isScrolled
                              ? 'text-gray-700 hover:text-[#609CEF]'
                              : 'text-gray-800 hover:text-[#3D7CE0]'
                          }`}
                        >
                          {link.label}
                          <svg
                            className={`size-4 transition-transform duration-200 ${
                              openDropdown === link.label ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdown === link.label && (
                          <div className="animate-fade-in absolute top-full left-0 z-10 mt-3 w-max">
                            <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-900/5">
                              <div className="py-2">
                                {link.submenu?.map((subItem, index) => (
                                  subItem.isPage
                                    ? (
                                        <Link
                                          key={subItem.href}
                                          href={subItem.href}
                                          onClick={() => setOpenDropdown(null)}
                                          className="block px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#609CEF]"
                                          style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                          {subItem.label}
                                        </Link>
                                      )
                                    : (
                                        <a
                                          key={subItem.href}
                                          href={subItem.href}
                                          onClick={e => handleSmoothScroll(e, subItem.href)}
                                          className="block px-4 py-2.5 text-sm font-medium whitespace-nowrap text-gray-700 transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#609CEF]"
                                          style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                          {subItem.label}
                                        </a>
                                      )
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  : (
                      <a
                        href={link.href}
                        onClick={e => handleSmoothScroll(e, link.href)}
                        className={`cursor-pointer text-sm font-medium transition-colors ${
                          isScrolled
                            ? 'text-gray-700 hover:text-[#609CEF]'
                            : 'text-gray-800 hover:text-[#3D7CE0]'
                        }`}
                      >
                        {link.label}
                      </a>
                    )}
              </div>
            ))}

            {/* CH Play Button */}
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className={`rounded-lg px-4 py-2 text-sm font-semibold shadow-md transition-all hover:scale-105 ${
                isScrolled
                  ? 'bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] text-white'
                  : 'bg-white text-[#609CEF] shadow-lg'
              }`}
            >
              {t('download_app')}
            </a>

            {/* Language Selector */}
            <div className="dropdown-container relative">
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className={`flex items-center space-x-2 text-sm font-medium transition-colors ${
                  isScrolled
                    ? 'text-gray-700 hover:text-[#609CEF]'
                    : 'text-gray-800 hover:text-[#3D7CE0]'
                }`}
              >
                <span className="text-2xl">{localeFlags[locale]}</span>
                <span>{locale.toUpperCase()}</span>
                <svg
                  className={`size-4 transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Language Dropdown Menu */}
              {isLangDropdownOpen && (
                <div className="absolute top-full right-0 z-10 mt-3 w-max">
                  <div className="overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-900/5">
                    <div className="py-2">
                      {routing.locales.map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => {
                            router.push(`/${lang}${pathname}`);
                            router.refresh();
                            setIsLangDropdownOpen(false);
                          }}
                          className={`flex w-full items-center space-x-2 px-4 py-2.5 text-left text-sm font-medium transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-[#609CEF] ${
                            locale === lang ? 'bg-blue-50 text-[#609CEF]' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-xl">{localeFlags[lang]}</span>
                          <span>{localeLabels[lang] || lang.toUpperCase()}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className={`size-6 ${isScrolled ? 'text-gray-700' : 'text-gray-800'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen
                ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )
                : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full right-0 left-0 border-t border-gray-200 bg-white shadow-lg md:hidden">
            <div className="space-y-3 px-2 pt-4 pb-4">
              {navLinks.map(link => (
                <div key={link.href}>
                  {link.hasDropdown
                    ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => toggleDropdown(link.label)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#609CEF]"
                          >
                            {link.label}
                            <svg
                              className={`size-4 transition-transform duration-200 ${
                                openDropdown === link.label ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          {openDropdown === link.label && link.submenu && (
                            <div className="animate-fade-in mt-2 ml-4 space-y-1 border-l-2 border-blue-200 pl-4">
                              {link.submenu.map(subItem => (
                                subItem.isPage
                                  ? (
                                      <Link
                                        key={subItem.href}
                                        href={subItem.href}
                                        onClick={() => {
                                          setIsMobileMenuOpen(false);
                                          setOpenDropdown(null);
                                        }}
                                        className="block py-2 text-sm text-gray-600 transition-colors hover:text-[#609CEF]"
                                      >
                                        {subItem.label}
                                      </Link>
                                    )
                                  : (
                                      <a
                                        key={subItem.href}
                                        href={subItem.href}
                                        onClick={e => handleSmoothScroll(e, subItem.href)}
                                        className="block py-2 text-sm text-gray-600 transition-colors hover:text-[#609CEF]"
                                      >
                                        {subItem.label}
                                      </a>
                                    )
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    : (
                        <a
                          href={link.href}
                          onClick={e => handleSmoothScroll(e, link.href)}
                          className="block cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#609CEF]"
                        >
                          {link.label}
                        </a>
                      )}
                </div>
              ))}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 mt-2 block rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition-shadow hover:shadow-lg"
              >
                {t('download_app')}
              </a>

              {/* Mobile Language Selector */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-[#609CEF]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{localeFlags[locale]}</span>
                    <span>{localeLabels[locale] || locale.toUpperCase()}</span>
                  </div>
                  <svg
                    className={`size-4 transition-transform duration-200 ${
                      isLangDropdownOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isLangDropdownOpen && (
                  <div className="animate-fade-in mt-2 ml-4 space-y-1 border-l-2 border-blue-200 pl-4">
                    {routing.locales.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          router.push(`/${lang}${pathname}`);
                          router.refresh();
                          setIsLangDropdownOpen(false);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`flex w-full items-center space-x-2 py-2 text-left text-sm transition-colors ${
                          locale === lang ? 'font-semibold text-[#609CEF]' : 'text-gray-600 hover:text-[#609CEF]'
                        }`}
                      >
                        <span className="text-xl">{localeFlags[lang]}</span>
                        <span>{localeLabels[lang] || lang.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
