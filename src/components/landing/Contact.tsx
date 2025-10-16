'use client';

import { useEffect, useRef, useState } from 'react';

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // TODO: Implement form submission logic
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="bg-gradient-to-br from-gray-50 to-blue-50 py-20 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="mb-4 text-4xl font-extrabold text-gray-900 md:text-5xl">
            Liên hệ &
            {' '}
            <span className="bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] bg-clip-text text-transparent">
              Tải ứng dụng
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Bắt đầu trải nghiệm dịch vụ của EzyFix ngay hôm nay
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Download App Section */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
            }`}
          >
            <div className="rounded-3xl bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] p-8 text-white md:p-12">
              <h3 className="mb-4 text-3xl font-bold">Tải ứng dụng EzyFix</h3>
              <p className="mb-8 text-lg opacity-90">
                Trải nghiệm đầy đủ tính năng trên ứng dụng di động
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
                  <div className="text-xs">Tải trên</div>
                  <div className="text-xl font-bold">Google Play</div>
                </div>
              </a>

              {/* Features */}
              <div className="mt-8 space-y-4">
                {['Miễn phí tải về', 'Dễ sử dụng', 'An toàn & bảo mật'].map(feature => (
                  <div key={feature} className="flex items-center gap-3">
                    <svg
                      className="size-6 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            <div className="rounded-3xl bg-white p-8 shadow-xl md:p-12">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Gửi tin nhắn cho chúng tôi
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#609CEF] focus:ring-2 focus:ring-[#609CEF]/20 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#609CEF] focus:ring-2 focus:ring-[#609CEF]/20 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#609CEF] focus:ring-2 focus:ring-[#609CEF]/20 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Nội dung
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-[#609CEF] focus:ring-2 focus:ring-[#609CEF]/20 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] px-6 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl"
                >
                  Gửi tin nhắn
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
