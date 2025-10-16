'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Link } from '@/libs/I18nNavigation';

const StaticNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navLinks = [
    { href: '/', label: 'Trang chủ', hasDropdown: false },
    {
      href: '#customer',
      label: 'Khách hàng',
      hasDropdown: true,
      submenu: [
        { href: '/benefits/customer', label: 'Quyền lợi', isPage: true },
        { href: '/rules/customer', label: 'Quy tắc ứng xử', isPage: true },
      ],
    },
    {
      href: '#technician',
      label: 'Thợ sửa chữa',
      hasDropdown: true,
      submenu: [
        { href: '/benefits/technician', label: 'Quyền lợi', isPage: true },
        { href: '/rules/technician', label: 'Quy tắc ứng xử', isPage: true },
      ],
    },
  ];

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <Image
              src="/assets/images/logo/EzyfixBiglogo.jpg"
              alt="EzyFix Logo"
              width={200}
              height={65}
              className="h-16 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navLinks.map(link => (
              <div key={link.label} className="relative">
                {link.hasDropdown
                  ? (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleDropdown(link.label)}
                          className="flex cursor-pointer items-center gap-1 text-sm font-medium text-gray-700 transition-colors hover:text-[#609CEF]"
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
                          <div className="absolute top-full left-0 z-10 mt-3 w-max">
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
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  : (
                      <Link
                        href={link.href}
                        className="cursor-pointer text-sm font-medium text-gray-700 transition-colors hover:text-[#609CEF]"
                      >
                        {link.label}
                      </Link>
                    )}
              </div>
            ))}

            {/* CH Play Button */}
            <a
              href="https://play.google.com/store"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:scale-105"
            >
              Tải ứng dụng
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg
              className="size-6 text-gray-700"
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
          <div className="border-t border-gray-200 pt-4 pb-4 md:hidden">
            <div className="space-y-3">
              {navLinks.map(link => (
                <div key={link.label}>
                  {link.hasDropdown
                    ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => toggleDropdown(link.label)}
                            className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#609CEF]"
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
                            <div className="ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
                              {link.submenu.map(subItem => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setOpenDropdown(null);
                                  }}
                                  className="block py-2 text-sm text-gray-600 hover:text-[#609CEF]"
                                >
                                  {subItem.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    : (
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-[#609CEF]"
                        >
                          {link.label}
                        </Link>
                      )}
                </div>
              ))}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="mx-4 block rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Tải ứng dụng
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default StaticNavbar;
