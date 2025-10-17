'use client';

import { useEffect, useState } from 'react';

const FloatingButtons = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút scroll to top khi scroll xuống > 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-4">
      {/* Facebook Button */}
      <a
        href="https://www.facebook.com/profile.php?id=61581405073489"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] shadow-lg transition-all hover:scale-110 hover:shadow-xl"
        aria-label="Liên hệ Facebook"
      >
        <svg
          className="size-7 text-white transition-transform group-hover:scale-110"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      </a>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="group flex size-14 items-center justify-center rounded-full bg-gradient-to-r from-[#609CEF] to-[#3D7CE0] shadow-lg transition-all hover:scale-110 hover:shadow-xl"
          aria-label="Cuộn lên đầu trang"
        >
          <svg
            className="size-6 text-white transition-transform group-hover:-translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default FloatingButtons;
