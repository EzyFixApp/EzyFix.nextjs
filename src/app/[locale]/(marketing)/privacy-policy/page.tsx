'use client';

import {
  Clock,
  Globe,
  Lock,
  Mail,
  Phone,
  Shield,
  UserCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import Navbar from '@/components/landing/Navbar';

export default function PrivacyPolicyPage() {
  const t = useTranslations('PrivacyPolicy');

  const sections = [
    {
      id: 'info-collected',
      icon: UserCheck,
      title: t('section1_title'),
      content: [
        {
          subtitle: t('section1_subtitle1'),
          items: t.raw('section1_items1') as string[],
        },
        {
          subtitle: t('section1_subtitle2'),
          items: t.raw('section1_items2') as string[],
        },
        {
          subtitle: t('section1_subtitle3'),
          items: t.raw('section1_items3') as string[],
        },
      ],
    },
    {
      id: 'how-we-use',
      icon: Shield,
      title: t('section2_title'),
      content: [
        {
          subtitle: t('section2_subtitle1'),
          items: t.raw('section2_items1') as string[],
        },
        {
          subtitle: t('section2_subtitle2'),
          items: t.raw('section2_items2') as string[],
        },
        {
          subtitle: t('section2_subtitle3'),
          items: t.raw('section2_items3') as string[],
        },
        {
          subtitle: t('section2_subtitle4'),
          items: t.raw('section2_items4') as string[],
        },
      ],
    },
    {
      id: 'info-sharing',
      icon: Globe,
      title: t('section3_title'),
      content: [
        {
          subtitle: t('section3_subtitle1'),
          items: t.raw('section3_items1') as string[],
        },
        {
          subtitle: t('section3_subtitle2'),
          items: t.raw('section3_items2') as string[],
        },
        {
          subtitle: t('section3_subtitle3'),
          items: t.raw('section3_items3') as string[],
        },
        {
          subtitle: t('section3_subtitle4'),
          items: t.raw('section3_items4') as string[],
        },
      ],
    },
    {
      id: 'data-security',
      icon: Lock,
      title: t('section4_title'),
      content: [
        {
          subtitle: t('section4_subtitle1'),
          items: t.raw('section4_items1') as string[],
        },
        {
          subtitle: t('section4_subtitle2'),
          items: t.raw('section4_items2') as string[],
        },
        {
          subtitle: t('section4_subtitle3'),
          items: t.raw('section4_items3') as string[],
        },
      ],
    },
    {
      id: 'your-rights',
      icon: UserCheck,
      title: t('section5_title'),
      content: [
        {
          subtitle: t('section5_subtitle1'),
          items: t.raw('section5_items1') as string[],
        },
        {
          subtitle: t('section5_subtitle2'),
          items: t.raw('section5_items2') as string[],
        },
        {
          subtitle: t('section5_subtitle3'),
          items: t.raw('section5_items3') as string[],
        },
        {
          subtitle: t('section5_subtitle4'),
          items: t.raw('section5_items4') as string[],
        },
      ],
    },
    {
      id: 'data-retention',
      icon: Clock,
      title: t('section6_title'),
      content: [
        {
          subtitle: t('section6_subtitle1'),
          items: t.raw('section6_items1') as string[],
        },
        {
          subtitle: t('section6_subtitle2'),
          items: t.raw('section6_items2') as string[],
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-[#FFFFFF] via-[#E0F2FE] to-[#93C5FD] py-20 text-gray-800">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-blue-100 p-4">
                <Shield className="size-12 text-blue-600" />
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl">
                {t('title')}
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-700">
                {t('subtitle')}
              </p>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{t('effective_date')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="size-4" />
                  <span>{t('last_updated')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Introduction */}
          <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
            <p className="text-lg leading-relaxed text-gray-700">
              {t('introduction')}
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <div
                  key={section.id}
                  className="rounded-2xl bg-white p-8 shadow-lg transition-shadow hover:shadow-xl"
                >
                  <div className="mb-6 flex items-start gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      <IconComponent className="size-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {index + 1}
                        .
                        {' '}
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {section.content.map(subsection => (
                      <div key={subsection.subtitle}>
                        <h3 className="mb-3 font-semibold text-gray-800">
                          {subsection.subtitle}
                        </h3>
                        <ul className="space-y-2">
                          {subsection.items.map(item => (
                            <li
                              key={item}
                              className="flex items-start gap-3 text-gray-600"
                            >
                              <div className="mt-1.5 size-1.5 shrink-0 rounded-full bg-blue-500" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Important Notice */}
          <div className="mt-12 rounded-2xl border-2 border-yellow-200 bg-yellow-50 p-8">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-yellow-400 text-white">
                <svg
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                {t('notice_title')}
              </h3>
            </div>
            <p className="text-gray-700">
              {t('notice_content')}
            </p>
          </div>

          {/* Contact Section */}
          <div className="mt-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-8 text-white">
            <h3 className="mb-6 text-2xl font-bold">{t('contact_title')}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <h4 className="mb-4 flex items-center gap-2 font-semibold">
                  <Mail className="size-5" />
                  {t('contact_privacy')}
                </h4>
                <div className="space-y-2 text-blue-100">
                  <p>Email: privacy@ezyfix.site</p>
                  <p>
                    {t('phone')}
                    : 0787171612
                  </p>
                </div>
              </div>
              <div className="rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <h4 className="mb-4 flex items-center gap-2 font-semibold">
                  <Phone className="size-5" />
                  {t('contact_support')}
                </h4>
                <div className="space-y-2 text-blue-100">
                  <p>Email: support@ezyfix.site</p>
                  <p>Hotline: 0787171612</p>
                  <p>
                    {t('business_hours')}
                    : 8:00 - 22:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>{t('footer_note')}</p>
          </div>
        </div>
      </div>
    </>
  );
}
