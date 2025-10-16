'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/landing/Navbar';

const BenefitsTechnicianDetailPage = () => {
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
      category: 'Thu nhập & Cơ hội kiếm tiền',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-emerald-500',
      items: [
        {
          title: 'Nhận việc liên tục không lo thiếu',
          description: 'Hệ thống AI tự động kết nối bạn với hàng ngàn khách hàng đang cần dịch vụ mỗi ngày. Không phải lo chạy việc hay ngồi chờ.',
          highlight: 'Nhiều việc',
        },
        {
          title: 'Thu nhập minh bạch, rõ ràng',
          description: 'Bạn tự báo giá và thỏa thuận với khách hàng. EzyFix chỉ thu phí dịch vụ hợp lý, phần còn lại đều về túi bạn.',
          highlight: '70-80% lợi nhuận',
        },
        {
          title: 'Thanh toán nhanh & An toàn',
          description: 'Tiền công được chuyển vào ví ngay sau khi hoàn thành công việc. Rút tiền về tài khoản bất cứ lúc nào.',
          highlight: 'Tức thì',
        },
        {
          title: 'Thu nhập tăng theo năng lực',
          description: 'Càng làm tốt, rating cao, bạn càng nhận được nhiều việc ưu tiên và có thể tăng giá dịch vụ.',
          highlight: 'Không giới hạn',
        },
      ],
    },
    {
      category: 'Hỗ trợ & Phát triển nghề nghiệp',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      items: [
        {
          title: 'Đào tạo & Nâng cao kỹ năng miễn phí',
          description: 'EzyFix tổ chức các khóa đào tạo kỹ năng nghề, kỹ năng mềm, cách giao tiếp với khách hàng để bạn chuyên nghiệp hơn.',
          highlight: 'Miễn phí',
        },
        {
          title: 'Công cụ quản lý công việc hiện đại',
          description: 'Ứng dụng thợ với đầy đủ tính năng: Nhận việc, báo giá, điều hướng GPS, lịch sử đơn hàng, thống kê thu nhập.',
          highlight: 'Công nghệ',
        },
        {
          title: 'Chương trình Thợ xuất sắc',
          description: 'Thợ có thành tích tốt được vinh danh, nhận huy hiệu và ưu tiên trong việc nhận đơn hàng lớn, khách VIP.',
          highlight: 'Tôn vinh',
        },
        {
          title: 'Hỗ trợ pháp lý & Giải quyết tranh chấp',
          description: 'Đội ngũ EzyFix luôn đồng hành, hỗ trợ giải quyết mọi vấn đề phát sinh với khách hàng một cách công bằng.',
          highlight: 'Bảo vệ quyền lợi',
        },
      ],
    },
    {
      category: 'Linh hoạt & Tự do',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      items: [
        {
          title: 'Tự do chọn giờ làm việc',
          description: 'Bạn quyết định làm vào thời gian nào, không bị ràng buộc. Muốn nghỉ ngơi thì tắt nhận việc, muốn tăng thu nhập thì bật lên.',
          highlight: 'Tự chủ 100%',
        },
        {
          title: 'Chọn khu vực làm việc phù hợp',
          description: 'Bạn tự thiết lập bán kính hoạt động, chỉ nhận việc trong khu vực mà bạn mong muốn để tiết kiệm chi phí di chuyển.',
          highlight: 'Linh hoạt',
        },
        {
          title: 'Tự quyết định nhận hay từ chối việc',
          description: 'Mỗi đơn hàng bạn có quyền xem thông tin trước, quyết định có nhận hay không. Không bắt buộc phải nhận tất cả.',
          highlight: 'Tự do chọn',
        },
        {
          title: 'Làm part-time hoặc full-time',
          description: 'Dù bạn muốn làm thêm thu nhập hay làm chính nghề, EzyFix đều phù hợp. Không yêu cầu cam kết thời gian.',
          highlight: 'Linh động',
        },
      ],
    },
    {
      category: 'Uy tín & Xây dựng thương hiệu cá nhân',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'from-amber-500 to-orange-500',
      items: [
        {
          title: 'Hồ sơ chuyên nghiệp với Rating',
          description: 'Mỗi thợ có trang cá nhân với ảnh, mô tả kỹ năng, đánh giá từ khách hàng. Làm tốt sẽ có rating cao, tăng uy tín.',
          highlight: '⭐ Chuyên nghiệp',
        },
        {
          title: 'Khách hàng tin tưởng hơn',
          description: 'Khi làm việc qua nền tảng uy tín như EzyFix, khách hàng an tâm hơn và sẵn sàng trả giá cao hơn cho dịch vụ chất lượng.',
          highlight: 'Giá trị gia tăng',
        },
        {
          title: 'Xây dựng danh tiếng dài hạn',
          description: 'Tích lũy đánh giá 5 sao và feedback tích cực giúp bạn xây dựng thương hiệu cá nhân bền vững trong ngành.',
          highlight: 'Dài hạn',
        },
        {
          title: 'Cơ hội trở thành Top Thợ',
          description: 'Những thợ xuất sắc nhất sẽ được EzyFix quảng bá rộng rãi, tăng độ nhận diện và thu hút nhiều khách hàng cao cấp.',
          highlight: 'Nổi bật',
        },
      ],
    },
    {
      category: 'Tiện ích & Ưu đãi đặc biệt',
      icon: (
        <svg className="size-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
        </svg>
      ),
      color: 'from-rose-500 to-red-500',
      items: [
        {
          title: 'Thưởng & Khuyến mãi hấp dẫn',
          description: 'Nhận thưởng khi hoàn thành số đơn nhất định, thưởng tháng xuất sắc, quà tặng vào các dịp lễ tết.',
          highlight: 'Bonus',
        },
        {
          title: 'Ưu đãi mua dụng cụ & Linh kiện',
          description: 'EzyFix hợp tác với các nhà cung cấp uy tín, giúp thợ mua dụng cụ, linh kiện với giá ưu đãi đặc biệt.',
          highlight: 'Giảm giá',
        },
        {
          title: 'Bảo hiểm tai nạn lao động',
          description: 'Thợ tham gia chương trình bảo hiểm được hỗ trợ một phần phí để đảm bảo an toàn khi làm việc.',
          highlight: 'An tâm',
        },
        {
          title: 'Cộng đồng thợ năng động',
          description: 'Tham gia group thợ EzyFix để học hỏi kinh nghiệm, chia sẻ mẹo hay, kết nối và hỗ trợ lẫn nhau.',
          highlight: 'Kết nối',
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
                Quyền lợi Thợ Sửa Chữa
                <br />
                <span className="text-white/90">khi tham gia EzyFix</span>
              </h1>
              <p className="mx-auto max-w-3xl text-lg text-white/90 md:text-xl">
                Phát triển nghề nghiệp, tăng thu nhập và xây dựng uy tín với nền tảng hàng đầu
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
