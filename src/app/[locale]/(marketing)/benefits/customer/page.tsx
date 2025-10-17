'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const BenefitsCustomerDetailPage = () => {
  const t = useTranslations('BenefitsCustomerPage');
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

  const benefits = [
    {
      category: t('convenience'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      items: [
        {
          title: t('convenience_item1_title'),
          description: t('convenience_item1_desc'),
          highlight: t('convenience_item1_highlight'),
        },
        {
          title: t('convenience_item2_title'),
          description: t('convenience_item2_desc'),
          highlight: t('convenience_item2_highlight'),
        },
        {
          title: t('convenience_item3_title'),
          description: t('convenience_item3_desc'),
          highlight: t('convenience_item3_highlight'),
        },
        {
          title: t('convenience_item4_title'),
          description: t('convenience_item4_desc'),
          highlight: t('convenience_item4_highlight'),
        },
      ],
    },
    {
      category: t('safety'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      items: [
        {
          title: t('safety_item1_title'),
          description: t('safety_item1_desc'),
          highlight: t('safety_item1_highlight'),
        },
        {
          title: t('safety_item2_title'),
          description: t('safety_item2_desc'),
          highlight: t('safety_item2_highlight'),
        },
        {
          title: t('safety_item3_title'),
          description: t('safety_item3_desc'),
          highlight: t('safety_item3_highlight'),
        },
        {
          title: t('safety_item4_title'),
          description: t('safety_item4_desc'),
          highlight: t('safety_item4_highlight'),
        },
      ],
    },
    {
      category: t('pricing'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          title: t('pricing_item1_title'),
          description: t('pricing_item1_desc'),
          highlight: t('pricing_item1_highlight'),
        },
        {
          title: t('pricing_item2_title'),
          description: t('pricing_item2_desc'),
          highlight: t('pricing_item2_highlight'),
        },
        {
          title: t('pricing_item3_title'),
          description: t('pricing_item3_desc'),
          highlight: t('pricing_item3_highlight'),
        },
        {
          title: t('pricing_item4_title'),
          description: t('pricing_item4_desc'),
          highlight: t('pricing_item4_highlight'),
        },
      ],
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] py-20 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
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

        {/* Benefits */}
        <section ref={sectionRef} className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-20">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.category}
                  className={`transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  {/* Category Header */}
                  <div className="mb-8 flex items-center gap-4">
                    <div className={`rounded-xl bg-gradient-to-br ${benefit.color} p-4 shadow-lg`}>
                      {benefit.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#609CEF]">
                        0
                        {index + 1}
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900">{benefit.category}</h2>
                    </div>
                  </div>

                  {/* Benefits Grid */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {benefit.items.map(item => (
                      <div
                        key={item.title}
                        className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl"
                      >
                        {/* Highlight Badge */}
                        <div className={`absolute top-4 right-4 rounded-full bg-gradient-to-r ${benefit.color} px-3 py-1 text-xs font-bold text-white shadow-md`}>
                          {item.highlight}
                        </div>

                        <h3 className="mb-3 pr-20 text-xl font-bold text-gray-900">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>

                        {/* Hover Accent */}
                        <div className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r ${benefit.color} transition-all duration-300 group-hover:w-full`} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] p-12 text-center text-white shadow-2xl">
              <h2 className="mb-4 text-3xl font-bold md:text-4xl">
                {t('cta_title')}
              </h2>
              <p className="mb-8 text-lg text-white/90">
                {t('cta_subtitle')}
              </p>
              {/* CH Play Button */}
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 text-gray-900 shadow-lg transition-all hover:scale-105"
              >
                <svg className="size-10" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="playIconGradientContact1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D7FF" />
                      <stop offset="100%" stopColor="#0095D5" />
                    </linearGradient>
                    <linearGradient id="playIconGradientContact2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF3A44" />
                      <stop offset="100%" stopColor="#C31162" />
                    </linearGradient>
                    <linearGradient id="playIconGradientContact3" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD800" />
                      <stop offset="100%" stopColor="#FF8800" />
                    </linearGradient>
                    <linearGradient id="playIconGradientContact4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00F076" />
                      <stop offset="100%" stopColor="#00C96B" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#playIconGradientContact1)" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5Z" />
                  <path fill="url(#playIconGradientContact2)" d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z" />
                  <path fill="url(#playIconGradientContact3)" d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z" />
                  <path fill="url(#playIconGradientContact4)" d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <div className="text-left">
                  <div className="text-xl font-bold">Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default BenefitsCustomerDetailPage;
