'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const BenefitsCustomerDetailPage = () => {
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
      category: 'Tiện lợi & Tiết kiệm thời gian',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      items: [
        {
          title: 'Đặt dịch vụ mọi lúc, mọi nơi',
          description: 'Chỉ cần vài thao tác trên điện thoại, bạn có thể đặt dịch vụ sửa chữa bất cứ lúc nào trong ngày, không cần gọi điện hay đi tìm thợ.',
          highlight: '24/7',
        },
        {
          title: 'AI tự động kết nối thợ gần nhất',
          description: 'Hệ thống AI của EzyFix sẽ tự động tìm và kết nối bạn với thợ sửa chữa gần bạn nhất, tiết kiệm thời gian chờ đợi.',
          highlight: 'Nhanh chóng',
        },
        {
          title: 'Theo dõi tiến trình real-time',
          description: 'Cập nhật trạng thái công việc theo thời gian thực: thợ đang trên đường, đang sửa, hay đã hoàn thành.',
          highlight: 'Minh bạch',
        },
        {
          title: 'Lịch sử dịch vụ đầy đủ',
          description: 'Mọi đơn dịch vụ đều được lưu trữ, giúp bạn dễ dàng tra cứu và đặt lại dịch vụ khi cần.',
          highlight: 'Quản lý dễ dàng',
        },
      ],
    },
    {
      category: 'An toàn & Uy tín',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      items: [
        {
          title: 'Thợ được xác minh danh tính',
          description: 'Tất cả thợ sửa chữa trên EzyFix đều được xác thực danh tính qua CCCD và kiểm tra lý lịch cẩn thận.',
          highlight: 'eKYC',
        },
        {
          title: 'Đánh giá & Review minh bạch',
          description: 'Xem đánh giá thực tế từ khách hàng khác trước khi quyết định chọn thợ. Rating và review không thể giả mạo.',
          highlight: '⭐ Tin cậy',
        },
        {
          title: 'Bảo hiểm & Cam kết chất lượng',
          description: 'EzyFix cam kết hỗ trợ giải quyết nếu có sự cố xảy ra trong quá trình sửa chữa hoặc sau khi hoàn thành.',
          highlight: 'Bảo vệ 100%',
        },
        {
          title: 'Hỗ trợ khách hàng 24/7',
          description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ qua chat, điện thoại để giải đáp mọi thắc mắc.',
          highlight: 'Hotline',
        },
      ],
    },
    {
      category: 'Giá cả & Thanh toán',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          title: 'Báo giá minh bạch trước khi làm',
          description: 'Nhận báo giá chi tiết từ thợ trước khi quyết định. Không phát sinh chi phí ẩn.',
          highlight: 'Rõ ràng',
        },
        {
          title: 'So sánh giá từ nhiều thợ',
          description: 'Có thể nhận nhiều báo giá từ các thợ khác nhau để chọn mức giá phù hợp nhất với ngân sách.',
          highlight: 'Tự chọn',
        },
        {
          title: 'Thanh toán đa dạng & an toàn',
          description: 'Hỗ trợ nhiều phương thức: Tiền mặt, chuyển khoản, ví điện tử (MoMo, ZaloPay), thẻ tín dụng.',
          highlight: 'Linh hoạt',
        },
        {
          title: 'Ưu đãi & Khuyến mãi thường xuyên',
          description: 'Nhận voucher giảm giá, cashback và các chương trình khuyến mãi dành riêng cho khách hàng thân thiết.',
          highlight: 'Tiết kiệm',
        },
      ],
    },
    {
      category: 'Chất lượng dịch vụ',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
      items: [
        {
          title: 'Thợ giỏi, có kinh nghiệm',
          description: 'Thợ trên nền tảng đều phải vượt qua bài kiểm tra nghiệp vụ, đảm bảo có đủ kỹ năng và kinh nghiệm.',
          highlight: 'Chuyên nghiệp',
        },
        {
          title: 'Dụng cụ & Linh kiện chính hãng',
          description: 'Thợ cam kết sử dụng dụng cụ chuẩn và linh kiện có nguồn gốc rõ ràng, có bảo hành.',
          highlight: 'Chất lượng',
        },
        {
          title: 'Bảo hành sau sửa chữa',
          description: 'Các công việc sửa chữa đều có thời gian bảo hành cụ thể, giúp bạn yên tâm sử dụng.',
          highlight: 'Bảo hành',
        },
        {
          title: 'Quyền khiếu nại & Hoàn tiền',
          description: 'Nếu không hài lòng với chất lượng, bạn có quyền khiếu nại và được hỗ trợ hoàn tiền theo chính sách.',
          highlight: 'Cam kết',
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
                Quyền lợi Khách hàng
                <br />
                <span className="text-white/90">khi sử dụng EzyFix</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                Trải nghiệm dịch vụ sửa chữa tiện lợi, an toàn và chất lượng cao
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
                Sẵn sàng trải nghiệm?
              </h2>
              <p className="mb-8 text-lg text-white/90">
                Tải ứng dụng EzyFix ngay hôm nay và tận hưởng tất cả quyền lợi trên!
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
