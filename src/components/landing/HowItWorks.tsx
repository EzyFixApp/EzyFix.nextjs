'use client';

import { useEffect, useRef, useState } from 'react';

const HowItWorks = () => {
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

  const steps = [
    {
      number: '01',
      title: 'Đặt dịch vụ',
      description:
        'Chọn loại dịch vụ cần sửa chữa, nhập thông tin và gửi yêu cầu qua ứng dụng',
      icon: (
        <svg className="size-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Thợ tới sửa',
      description:
        'AI tự động kết nối với thợ phù hợp gần bạn nhất. Thợ sẽ liên hệ và đến ngay',
      icon: (
        <svg className="size-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Hoàn thành & Thanh toán',
      description:
        'Công việc hoàn thành, bạn thanh toán an toàn qua ứng dụng và đánh giá thợ',
      icon: (
        <svg className="size-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="bg-white py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Cách thức
            {' '}
            <span className="bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] bg-clip-text text-transparent">
              Hoạt động
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Chỉ 3 bước đơn giản để nhận dịch vụ sửa chữa chuyên nghiệp
          </p>
        </div>

        {/* Desktop view - horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-24 right-0 left-0 h-1 bg-gradient-to-r from-[#609CEF] via-[#4F8BE8] to-[#3D7CE0]" />

            <div className="grid grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div
                  key={step.number}
                  className={`relative transition-all duration-700 ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  {/* Number circle */}
                  <div className="relative z-10 mx-auto mb-8 flex size-48 items-center justify-center rounded-full bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] shadow-xl">
                    <div className="text-center">
                      <div className="mb-2 flex justify-center">{step.icon}</div>
                      <div className="text-2xl font-bold text-white">
                        {step.number}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="mb-3 text-2xl font-bold text-gray-900">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile view - vertical */}
        <div className="md:hidden">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex gap-6 transition-all duration-700 ${
                  isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                {/* Number circle */}
                <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] shadow-lg">
                  <div className="text-center">
                    <div className="mb-1 flex justify-center">{step.icon}</div>
                    <div className="text-lg font-bold text-white">
                      {step.number}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
