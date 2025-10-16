'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const RulesCustomerPage = () => {
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
      number: '01',
      title: 'Tôn trọng và Giao tiếp Văn minh',
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      items: [
        'Giao tiếp lịch sự: Vui lòng giữ thái độ hòa nhã, lịch sự và tôn trọng với thợ sửa chữa trong suốt quá trình dịch vụ',
        'Không phân biệt đối xử: Nghiêm cấm mọi hành vi sử dụng lời lẽ, cử chỉ mang tính miệt thị, phân biệt đối xử, quấy rối hoặc xúc phạm đến thợ sửa chữa',
      ],
    },
    {
      number: '02',
      title: 'Minh bạch và Trung thực',
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      items: [
        'Mô tả công việc chính xác: Cung cấp thông tin về tình trạng hỏng hóc một cách chi tiết và trung thực để nhận được báo giá chính xác',
        'Không thay đổi phạm vi công việc đột ngột: Tránh thay đổi hoàn toàn yêu cầu sau khi thợ đã đến nơi. Nếu có phát sinh, vui lòng trao đổi và thống nhất',
      ],
    },
    {
      number: '03',
      title: 'An toàn là Trên hết',
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      items: [
        'Đảm bảo môi trường làm việc an toàn: Đảm bảo không gian làm việc an toàn, không có nguy cơ điện giật, hóa chất độc hại, vật nuôi hung dữ không được kiểm soát',
        'Bảo quản tài sản cá nhân: Tự quản lý và cất giữ tài sản có giá trị trước khi thợ đến làm việc để tránh thất thoát',
      ],
    },
    {
      number: '04',
      title: 'Tuân thủ Quy trình',
      icon: (
        <svg className="size-12 text-[#609CEF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      items: [
        'Xác nhận và thanh toán qua ứng dụng: Mọi thỏa thuận về giá cả và thanh toán cần được thực hiện qua ứng dụng EzyFix',
        'Không giao dịch ngoài luồng: Tránh thỏa thuận riêng ngoài ứng dụng để đảm bảo quyền lợi của bạn được bảo vệ',
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
                <span className="text-sm font-medium">Hiệu lực từ 01/01/2025</span>
              </div>
              <h1 className="mb-4 text-4xl font-extrabold md:text-5xl lg:text-6xl">
                Quy tắc Ứng xử
                <br />
                <span className="text-white/90">dành cho Khách hàng</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                Cùng xây dựng một cộng đồng dịch vụ an toàn, minh bạch và tôn trọng lẫn nhau
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-white p-8 shadow-lg md:p-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Chào mừng đến với EzyFix!</h2>
              <div className="space-y-4 text-lg leading-relaxed text-gray-600">
                <p>
                  Tại EzyFix, chúng tôi cam kết xây dựng một hệ sinh thái dịch vụ sửa chữa an toàn, minh bạch và tôn trọng lẫn nhau.
                  Để làm được điều đó, chúng tôi không chỉ đặt ra các tiêu chuẩn cao cho Thợ sửa chữa mà còn rất mong nhận được sự
                  hợp tác từ phía Quý Khách hàng.
                </p>
                <p>
                  Bộ Quy tắc này được tạo ra để đảm bảo mọi tương tác trên nền tảng đều diễn ra một cách văn minh và hiệu quả,
                  bảo vệ quyền lợi chính đáng cho cả Khách hàng và Thợ sửa chữa.
                </p>
                <div className="mt-6 rounded-lg bg-gradient-to-r from-[#609CEF]/10 to-[#3D7CE0]/10 p-6">
                  <p className="font-semibold text-[#609CEF]">
                    Bằng việc sử dụng dịch vụ, bạn đã đồng ý tuân thủ các quy tắc dưới đây.
                  </p>
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
                Các Quy tắc
                {' '}
                <span className="bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] bg-clip-text text-transparent">
                  Vàng
                </span>
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                4 nguyên tắc cơ bản để đảm bảo trải nghiệm dịch vụ tốt nhất
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
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 p-8 md:p-12">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">Xử lý Vi phạm</h2>
              <p className="mb-8 text-lg text-gray-600">
                Để duy trì môi trường công bằng, EzyFix sẽ áp dụng các biện pháp khi có hành vi vi phạm:
              </p>
              <div className="space-y-4">
                {[
                  {
                    title: 'Nhắc nhở hoặc Cảnh cáo',
                    description: 'Đối với các vi phạm lần đầu và ở mức độ nhẹ',
                    color: 'from-yellow-500 to-orange-500',
                  },
                  {
                    title: 'Tạm khóa tính năng',
                    description: 'Nếu tái phạm hoặc có hành vi như "bom" lịch nhiều lần, đánh giá sai sự thật',
                    color: 'from-orange-500 to-red-500',
                  },
                  {
                    title: 'Khóa tài khoản vĩnh viễn',
                    description: 'Đối với vi phạm nghiêm trọng như tấn công, đe dọa, quấy rối, lừa đảo hoặc vi phạm pháp luật',
                    color: 'from-red-500 to-red-700',
                  },
                ].map((violation, index) => (
                  <div key={index} className="flex gap-4 rounded-xl bg-white p-6 shadow-sm">
                    <div className={`mt-1 size-3 shrink-0 rounded-full bg-gradient-to-r ${violation.color}`} />
                    <div>
                      <h4 className="mb-1 font-bold text-gray-900">{violation.title}</h4>
                      <p className="text-gray-600">{violation.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl bg-gradient-to-br from-[#609CEF] to-[#3D7CE0] p-8 text-white shadow-xl md:p-12">
              <h2 className="mb-6 text-3xl font-bold">Cam kết từ EzyFix</h2>
              <div className="space-y-4 text-lg">
                <p>EzyFix cam kết không ngừng nỗ lực mang đến trải nghiệm dịch vụ tốt nhất thông qua:</p>
                <ul className="space-y-3">
                  {[
                    'Kết nối với các thợ sửa chữa có hồ sơ, lý lịch đã được xác minh',
                    'Cung cấp nền tảng công nghệ AI để tìm kiếm và kết nối dễ dàng, minh bạch',
                    'Hỗ trợ giải quyết tranh chấp với vai trò trung gian công bằng',
                    'Tiếp nhận phản hồi để liên tục cải thiện chất lượng dịch vụ',
                  ].map((item, index) => (
                    <li key={index} className="flex gap-3">
                      <svg className="mt-1 size-6 shrink-0 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 rounded-xl bg-white/10 p-6 backdrop-blur-sm">
                <p className="text-center text-xl font-semibold">
                  Cảm ơn bạn đã là một phần quan trọng trong cộng đồng EzyFix! 🎉
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default RulesCustomerPage;
