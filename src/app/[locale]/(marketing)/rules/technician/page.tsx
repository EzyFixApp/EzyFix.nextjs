'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const RulesTechnicianPage = () => {
  const t = useTranslations('RulesTechnicianPage');
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

  const sections = [
    {
      title: t('section1_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      items: [
        {
          subtitle: t('section1_sub1_title'),
          points: [
            t('section1_sub1_point1'),
            t('section1_sub1_point2'),
            t('section1_sub1_point3'),
          ],
        },
        {
          subtitle: t('section1_sub2_title'),
          points: [
            t('section1_sub2_point1'),
            t('section1_sub2_point2'),
            t('section1_sub2_point3'),
          ],
        },
      ],
    },
    {
      title: t('section2_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      items: [
        {
          subtitle: t('section2_sub1_title'),
          points: [
            t('section2_sub1_point1'),
            t('section2_sub1_point2'),
            t('section2_sub1_point3'),
          ],
        },
        {
          subtitle: t('section2_sub2_title'),
          points: [
            t('section2_sub2_point1'),
            t('section2_sub2_point2'),
            t('section2_sub2_point3'),
          ],
        },
      ],
    },
    {
      title: t('section3_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      items: [
        {
          subtitle: t('section3_sub1_title'),
          points: [
            t('section3_sub1_point1'),
            t('section3_sub1_point2'),
          ],
        },
        {
          subtitle: t('section3_sub2_title'),
          points: [
            t('section3_sub2_point1'),
            t('section3_sub2_point2'),
          ],
        },
      ],
    },
    {
      title: t('section4_title'),
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      items: [
        {
          subtitle: t('section4_title2'),
          points: [
            t('section4_point1'),
            t('section4_point2'),
            t('section4_point3'),
          ],
        },
        {
          subtitle: t('section5_title'),
          points: [
            t('section5_item1'),
            t('section5_item2'),
            t('section5_item3'),
            t('section5_item4'),
          ],
        },
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

        {/* Main Sections */}
        <section ref={sectionRef} className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-16">
              {sections.map((section, sectionIndex) => (
                <div
                  key={sectionIndex}
                  className={`transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${sectionIndex * 200}ms` }}
                >
                  {/* Section Header */}
                  <div className="mb-8 flex items-center gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-[#609CEF]/10 to-[#3D7CE0]/10 p-4">
                      {section.icon}
                    </div>
                    <div>
                      <div className="text-base font-bold text-[#609CEF]">
                        0
                        {sectionIndex + 1}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{section.title}</h2>
                    </div>
                  </div>

                  {/* Section Content */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {section.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="group overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
                      >
                        <h3 className="mb-4 text-xl font-bold text-gray-900">
                          {item.subtitle}
                        </h3>
                        <ul className="space-y-3">
                          {item.points.map((point, pointIndex) => (
                            <li key={pointIndex} className="flex gap-3">
                              <div className="mt-1 shrink-0">
                                <svg className="size-5 text-[#609CEF]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <p className="text-gray-600">{point}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Rewards Section */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border-4 border-emerald-200 bg-white shadow-lg">
              <div className="bg-gradient-to-r from-emerald-100 to-green-100 p-8 md:p-12">
                <div className="mb-8 flex items-center gap-4">
                  <div className="rounded-full bg-emerald-200/50 p-3 backdrop-blur-sm">
                    <svg className="size-8 text-emerald-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-emerald-900">{t('reward_title')}</h2>
                </div>
                <p className="mb-8 text-lg text-emerald-800">
                  {t('reward_desc')}
                </p>
              </div>
              <div className="bg-white p-8 md:p-12">
                <div className="grid gap-6 md:grid-cols-3">
                  {[
                    {
                      icon: (
                        <svg className="size-6 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ),
                      title: t('reward1_title'),
                      description: t('reward1_desc'),
                    },
                    {
                      icon: (
                        <svg className="size-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                        </svg>
                      ),
                      title: t('reward2_title'),
                      description: t('reward2_desc'),
                    },
                    {
                      icon: (
                        <svg className="size-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                      ),
                      title: t('reward3_title'),
                      description: t('reward3_desc'),
                    },
                  ].map((reward, index) => (
                    <div key={index} className="group rounded-xl border-2 border-gray-100 bg-gray-50 p-6 text-center transition-all hover:border-emerald-300 hover:shadow-md">
                      <div className="mb-4 inline-flex rounded-full bg-white p-4 shadow-sm">
                        {reward.icon}
                      </div>
                      <h4 className="mb-2 font-bold text-gray-900">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment */}
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
                    {t('intro_welcome')}
                    {' '}
                    {t('intro_platform')}
                  </p>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[
                      {
                        icon: (
                          <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ),
                        text: t('commitment_item1'),
                      },
                      {
                        icon: (
                          <svg className="size-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
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
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
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
                    {t('closing_message1')}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {t('closing_message2')}
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

export default RulesTechnicianPage;
