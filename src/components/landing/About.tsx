'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('AboutSection');

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

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-white py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {/* Section title */}
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            {t('title')}
            {' '}
            <span className="bg-gradient-to-r from-[#C3EAFA] to-[#5E9BEF] bg-clip-text text-transparent">
              {t('title_highlight')}
            </span>
          </h2>
          <div className="mx-auto mb-12 h-1 w-24 rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0]" />

          {/* Description */}
          <p className="mx-auto mb-12 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
            {t('description')}
          </p>

          {/* Key features grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div
              className={`rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg transition-all duration-700 hover:shadow-xl ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '100ms' }}
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0]">
                <svg
                  className="size-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {t('feature1_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature1_desc')}
              </p>
            </div>

            {/* Feature 2 */}
            <div
              className={`rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg transition-all duration-700 hover:shadow-xl ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0]">
                <svg
                  className="size-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {t('feature2_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature2_desc')}
              </p>
            </div>

            {/* Feature 3 */}
            <div
              className={`rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 shadow-lg transition-all duration-700 hover:shadow-xl ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0]">
                <svg
                  className="size-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900">
                {t('feature3_title')}
              </h3>
              <p className="text-gray-600">
                {t('feature3_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
