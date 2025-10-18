'use client';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

import { preloadEarthTexture } from './preloadTextures';
import RotatingEarthWrapper from './RotatingEarthWrapper';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Hero');

  useEffect(() => {
    // Preload texture first
    preloadEarthTexture();

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    e.preventDefault();
    const id = targetId.replace('#', '');
    const target = document.getElementById(id);
    if (target) {
      const navbarHeight = 64; // h-16 = 64px
      const targetPosition
        = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      ref={heroRef}
      className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFFFF] via-[#E0F2FE] to-[#93C5FD] pt-16"
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
            <h1 className="mb-6 text-5xl leading-tight font-extrabold text-gray-800 md:text-6xl lg:text-7xl">
              {t('title_line1')}
              <br />
              <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
                {t('title_line2')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mb-8 text-xl text-gray-700 md:text-2xl">
              {t('subtitle')}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                onClick={e => handleSmoothScroll(e, '#contact')}
                className="group flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-bold text-[#609CEF] shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <svg className="size-6" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="playIconGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00D7FF" />
                      <stop offset="100%" stopColor="#0095D5" />
                    </linearGradient>
                    <linearGradient id="playIconGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF3A44" />
                      <stop offset="100%" stopColor="#C31162" />
                    </linearGradient>
                    <linearGradient id="playIconGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD800" />
                      <stop offset="100%" stopColor="#FF8800" />
                    </linearGradient>
                    <linearGradient id="playIconGradient4" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00F076" />
                      <stop offset="100%" stopColor="#00C96B" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#playIconGradient1)" d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5Z" />
                  <path fill="url(#playIconGradient2)" d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z" />
                  <path fill="url(#playIconGradient3)" d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z" />
                  <path fill="url(#playIconGradient4)" d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                <span>{t('download_chplay')}</span>
              </a>

              <a
                href="#about"
                onClick={e => handleSmoothScroll(e, '#about')}
                className="rounded-full border-2 border-gray-700 px-8 py-4 text-center text-lg font-bold text-gray-800 transition-all hover:bg-gray-800 hover:text-white"
              >
                {t('learn_more')}
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div
                className={`transition-all delay-100 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-3xl font-bold text-gray-800 lg:text-4xl">10,000+</div>
                <div className="mt-2 text-sm text-gray-700 lg:text-base">{t('stats_technicians')}</div>
              </div>
              <div
                className={`transition-all delay-200 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-3xl font-bold text-gray-800 lg:text-4xl">50,000+</div>
                <div className="mt-2 text-sm text-gray-700 lg:text-base">{t('stats_customers')}</div>
              </div>
              <div
                className={`transition-all delay-300 duration-1000 ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="text-3xl font-bold text-gray-800 lg:text-4xl">
                  4.8
                  <span className="text-[#F59E0B]"> ★</span>
                </div>
                <div className="mt-2 text-sm text-gray-700 lg:text-base">{t('stats_rating')}</div>
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
              <RotatingEarthWrapper />
            </div>

            {/* Phone with offset positioning */}
            <div className="relative -mb-16 -ml-16 md:-mb-4 lg:-mb-17 lg:-ml-32">
              <Image
                src="/assets/images/showphone.png"
                alt="EzyFix App"
                width={400}
                height={800}
                className="relative z-10 h-auto w-72 drop-shadow-2xl lg:w-[420px]"
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
