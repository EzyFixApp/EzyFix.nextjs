'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const RulesCustomerPage = () => {
  const t = useTranslations('RulesCustomerPage');
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = sectionRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const rules = [
    {
      number: t('rule1_number'),
      title: t('rule1_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      items: [
        t('rule1_item1'),
        t('rule1_item2'),
      ],
    },
    {
      number: t('rule2_number'),
      title: t('rule2_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      items: [
        t('rule2_item1'),
        t('rule2_item2'),
      ],
    },
    {
      number: t('rule3_number'),
      title: t('rule3_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      items: [
        t('rule3_item1'),
        t('rule3_item2'),
      ],
    },
    {
      number: t('rule4_number'),
      title: t('rule4_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      items: [
        t('rule4_item1'),
        t('rule4_item2'),
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] py-20 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{t('effective_date')}</span>
              </div>
              <h1 className="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
                {t('title')}
                <br />
                <span className="text-white/90">EzyFix</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
              <div className="mb-6 flex items-center gap-4">
                <div className="rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] p-3">
                  <svg className="size-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900">{t('intro_title')}</h2>
              </div>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  {t('intro_welcome')}
                  {' '}
                  <span className="font-semibold text-[#609CEF]">EzyFix</span>
                  {' '}
                  {t('intro_platform')}
                </p>
                <p>
                  {t('intro_purpose')}
                </p>
                <div className="mt-6 rounded-xl bg-gradient-to-r from-[#609CEF]/10 to-[#3D7CE0]/10 p-6">
                  <div className="flex gap-3">
                    <svg className="mt-1 size-6 shrink-0 text-[#609CEF]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium text-[#609CEF]">
                      {t('intro_agreement')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rules Section */}
        <section ref={sectionRef} className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-extrabold text-gray-900 md:text-4xl">
                {t('rules_section_title')}
                {' '}
                <span className="bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] bg-clip-text text-transparent">
                  {t('rules_section_highlight')}
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                {t('rules_section_subtitle')}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {rules.map((rule, index) => (
                <div
                  key={rule.number}
                  className={`group transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl">
                    {/* Number badge */}
                    <div className="absolute top-8 right-8 text-6xl font-extrabold text-[#609CEF]/30">
                      {rule.number}
                    </div>

                    {/* Icon and Title */}
                    <div className="relative mb-6">
                      <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-[#609CEF]/10 to-[#3D7CE0]/10 p-4 transition-transform duration-300 group-hover:scale-110">
                        {rule.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {rule.title}
                      </h3>
                    </div>

                    {/* Items */}
                    <ul className="space-y-4">
                      {rule.items.map((item, idx) => (
                        <li key={idx} className="flex gap-3">
                          <div className="mt-1 shrink-0">
                            <svg className="size-5 text-[#609CEF]" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="text-gray-600">{item}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Violations Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border-4 border-amber-200 bg-white shadow-lg">
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-8 md:p-12">
                <div className="mb-8 flex items-center gap-4">
                  <div className="rounded-full bg-amber-200/50 p-3 backdrop-blur-sm">
                    <svg className="size-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-amber-900">{t('violation_title')}</h2>
                </div>
                <p className="mb-8 text-lg text-amber-800">
                  {t('violation_desc')}
                </p>
              </div>
              <div className="bg-white p-8 md:p-12">
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    {
                      icon: (
                        <svg className="size-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ),
                      title: t('violation1_title'),
                      description: t('violation1_desc'),
                    },
                    {
                      icon: (
                        <svg className="size-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                      ),
                      title: t('violation2_title'),
                      description: t('violation2_desc'),
                    },
                    {
                      icon: (
                        <svg className="size-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                        </svg>
                      ),
                      title: t('violation3_title'),
                      description: t('violation3_desc'),
                    },
                  ].map((violation, index) => (
                    <div key={index} className="group rounded-xl border-2 border-gray-100 bg-gray-50 p-6 transition-all hover:border-amber-500 hover:shadow-md">
                      <div className="mb-4 inline-flex rounded-full bg-white p-3 shadow-sm">
                        {violation.icon}
                      </div>
                      <h4 className="mb-2 text-lg font-bold text-gray-900">{violation.title}</h4>
                      <p className="text-sm text-gray-600">{violation.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-8 text-center">
                  <div className="mb-4 inline-flex rounded-full bg-white/20 p-4 backdrop-blur-sm">
                    <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white">{t('commitment_title')}</h2>
                </div>
                <div className="mb-8 space-y-6 text-lg text-white/95">
                  <p className="text-center">
                    {t('intro_purpose')}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        icon: (
                          <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ),
                        text: t('commitment_item1'),
                      },
                      {
                        icon: (
                          <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7H7v6h6V7z" />
                            <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                          </svg>
                        ),
                        text: t('commitment_item2'),
                      },
                      {
                        icon: (
                          <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                        ),
                        text: t('commitment_item3'),
                      },
                      {
                        icon: (
                          <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                          </svg>
                        ),
                        text: t('commitment_item4'),
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center gap-3 rounded-xl bg-white/10 p-4 text-center backdrop-blur-sm">
                        <div className="shrink-0 text-white/90">{item.icon}</div>
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-white/20 p-6 text-center backdrop-blur-sm">
                  <p className="text-xl font-bold text-white">
                    {t('thanks_message')}
                  </p>
                  <p className="mt-2 text-white/90">
                    {t('community_message')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RulesCustomerPage;
