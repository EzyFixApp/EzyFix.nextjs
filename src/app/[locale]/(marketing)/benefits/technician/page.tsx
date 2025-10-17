'use client';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const BenefitsTechnicianDetailPage = () => {
  const t = useTranslations('BenefitsTechnicianPage');
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
      category: t('income'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      items: [
        {
          title: t('income_item1_title'),
          description: t('income_item1_desc'),
          highlight: t('income_item1_highlight'),
        },
        {
          title: t('income_item2_title'),
          description: t('income_item2_desc'),
          highlight: t('income_item2_highlight'),
        },
        {
          title: t('income_item3_title'),
          description: t('income_item3_desc'),
          highlight: t('income_item3_highlight'),
        },
        {
          title: t('income_item4_title'),
          description: t('income_item4_desc'),
          highlight: t('income_item4_highlight'),
        },
      ],
    },
    {
      category: t('support'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      items: [
        {
          title: t('support_item1_title'),
          description: t('support_item1_desc'),
          highlight: t('support_item1_highlight'),
        },
        {
          title: t('support_item2_title'),
          description: t('support_item2_desc'),
          highlight: t('support_item2_highlight'),
        },
        {
          title: t('support_item3_title'),
          description: t('support_item3_desc'),
          highlight: t('support_item3_highlight'),
        },
        {
          title: t('support_item4_title'),
          description: t('support_item4_desc'),
          highlight: t('support_item4_highlight'),
        },
      ],
    },
    {
      category: t('flexibility'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          title: t('flexibility_item1_title'),
          description: t('flexibility_item1_desc'),
          highlight: t('flexibility_item1_highlight'),
        },
        {
          title: t('flexibility_item2_title'),
          description: t('flexibility_item2_desc'),
          highlight: t('flexibility_item2_highlight'),
        },
        {
          title: t('flexibility_item3_title'),
          description: t('flexibility_item3_desc'),
          highlight: t('flexibility_item3_highlight'),
        },
        {
          title: t('flexibility_item4_title'),
          description: t('flexibility_item4_desc'),
          highlight: t('flexibility_item4_highlight'),
        },
      ],
    },
    {
      category: t('benefits'),
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      color: 'from-rose-500 to-red-500',
      items: [
        {
          title: t('benefits_item1_title'),
          description: t('benefits_item1_desc'),
          highlight: t('benefits_item1_highlight'),
        },
        {
          title: t('benefits_item2_title'),
          description: t('benefits_item2_desc'),
          highlight: t('benefits_item2_highlight'),
        },
        {
          title: t('benefits_item3_title'),
          description: t('benefits_item3_desc'),
          highlight: t('benefits_item3_highlight'),
        },
        {
          title: t('benefits_item4_title'),
          description: t('benefits_item4_desc'),
          highlight: t('benefits_item4_highlight'),
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
      </div>
    </>
  );
};

export default BenefitsTechnicianDetailPage;
