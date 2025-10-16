'use client';

import { useEffect, useRef, useState } from 'react';

const AISection = () => {
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

  return (
    <section
      ref={sectionRef}
      className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900 md:text-5xl">
              Matching thông minh với
              {' '}
              <span className="bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] bg-clip-text text-transparent">
                AI tiên tiến
              </span>
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-gray-600">
              Hệ thống AI của EzyFix phân tích nhu cầu của bạn và tự động kết
              nối với thợ sửa chữa phù hợp nhất dựa trên:
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: (
                    <svg className="size-8 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: 'Vị trí địa lý',
                  desc: 'Tìm thợ gần bạn nhất để tiết kiệm thời gian',
                },
                {
                  icon: (
                    <svg className="size-8 text-[#609CEF]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ),
                  title: 'Đánh giá & kinh nghiệm',
                  desc: 'Ưu tiên thợ có rating cao và phù hợp với công việc',
                },
                {
                  icon: (
                    <svg className="size-8 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Giá cả phù hợp',
                  desc: 'Gợi ý mức giá tối ưu dựa trên thị trường',
                },
                {
                  icon: (
                    <svg className="size-8 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: 'Chuyên môn phù hợp',
                  desc: 'Matching với thợ có kỹ năng đúng nhu cầu của bạn',
                },
              ].map(item => (
                <div
                  key={item.title}
                  className={`flex items-start gap-4 rounded-xl bg-white p-4 shadow-sm transition-all duration-500 hover:shadow-md ${
                    isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                  }`}
                >
                  <div className="shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="mb-1 font-bold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right illustration */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="relative">
              {/* AI Brain illustration */}
              <div className="relative mx-auto aspect-square w-full max-w-md">
                {/* Gradient background glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#609CEF]/20 via-purple-500/10 to-[#3D7CE0]/20 blur-3xl" />

                {/* Orbital rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Outer ring */}
                  <div className="absolute size-80 animate-spin rounded-full border-2 border-dashed border-[#609CEF]/30" style={{ animationDuration: '20s' }} />
                  {/* Middle ring */}
                  <div className="absolute size-64 animate-spin rounded-full border-2 border-dotted border-purple-400/40" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                  {/* Inner ring */}
                  <div className="absolute size-48 animate-spin rounded-full border-2 border-[#3D7CE0]/30" style={{ animationDuration: '10s' }} />
                </div>

                {/* Center AI Icon */}
                <div className="relative flex size-full items-center justify-center">
                  <div className="group relative">
                    <svg
                      className="size-32 text-[#609CEF] drop-shadow-2xl transition-all duration-500 hover:scale-110 hover:text-[#3D7CE0]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Floating feature cards */}
                <div className="absolute -top-4 -right-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0s' }}>
                  <div className="rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:ring-[#609CEF]">
                    <svg className="size-8 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute top-1/3 -left-4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
                  <div className="rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:ring-[#609CEF]">
                    <svg className="size-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute -bottom-4 left-1/4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1s' }}>
                  <div className="rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:ring-[#609CEF]">
                    <svg className="size-8 text-[#3D7CE0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>

                <div className="absolute -right-6 bottom-1/4 animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
                  <div className="rounded-xl bg-white p-4 shadow-lg ring-1 ring-gray-200 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:ring-[#609CEF]">
                    <svg className="size-8 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
