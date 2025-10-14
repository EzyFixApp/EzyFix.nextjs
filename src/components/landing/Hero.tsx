'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import RotatingEarth from './RotatingEarth';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#609CEF] via-[#4F8BE8] to-[#3D7CE0] pt-16"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 size-64 animate-pulse rounded-full bg-white blur-3xl" />
        <div className="absolute right-10 bottom-20 size-96 animate-pulse rounded-full bg-white blur-3xl delay-700" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-15 sm:px-6 lg:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-2">
          {/* Left side - Text content */}
          <div
            className={`transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
            {/* Main heading */}
            <h1 className="mb-6 text-5xl leading-tight font-extrabold text-white md:text-6xl lg:text-7xl">
              App trên tay
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
                Thợ tới ngay
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-xl text-white/90 md:text-2xl">
              Kết nối nhanh chóng giữa khách hàng và thợ sửa chữa chuyên nghiệp
              với công nghệ AI thông minh
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-[#609CEF] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>Tải trên CH Play</span>
              </a>

              <a
                href="#about"
                className="rounded-full border-2 border-white px-8 py-4 text-center text-lg font-bold text-white transition-all hover:bg-white hover:text-[#609CEF]"
              >
                Tìm hiểu thêm
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div
                className={`transition-all delay-100 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-3xl font-bold text-white lg:text-4xl">10,000+</div>
                <div className="mt-2 text-sm text-white/80 lg:text-base">Thợ sửa chữa</div>
              </div>
              <div
                className={`transition-all delay-200 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-3xl font-bold text-white lg:text-4xl">50,000+</div>
                <div className="mt-2 text-sm text-white/80 lg:text-base">Khách hàng tin dùng</div>
              </div>
              <div
                className={`transition-all delay-300 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-3xl font-bold text-white lg:text-4xl">4.8★</div>
                <div className="mt-2 text-sm text-white/80 lg:text-base">Đánh giá trung bình</div>
              </div>
            </div>
          </div>

          {/* Right side - Phone mockup */}
          <div
            className={`relative flex items-end justify-center transition-all delay-200 duration-1000 lg:justify-center ${
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`}
          >
            {/* 3D Rotating Earth - independent position */}
            <div className="absolute inset-0 -z-20 ml-16 flex items-center justify-center lg:ml-24">
              <RotatingEarth />
            </div>

            {/* Phone with offset positioning */}
            <div className="relative -mb-4 -ml-16 lg:-mb-17 lg:-ml-32">
              <Image
                src="/assets/images/showphone.png"
                alt="EzyFix App"
                width={400}
                height={800}
                className="relative z-10 h-auto w-64 drop-shadow-2xl lg:w-96"
                priority
              />
              {/* Glow effect - static without pulse */}
              <div className="absolute inset-0 -z-10 rounded-3xl bg-white/10 blur-3xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
