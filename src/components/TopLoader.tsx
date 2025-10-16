'use client';

import NProgress from 'nprogress';
import { useEffect } from 'react';

// Cấu hình NProgress - chạy nhanh "vèo"
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 50, // Tốc độ rất nhanh
  minimum: 0.4, // Bắt đầu từ 40%
  easing: 'ease-in-out',
  speed: 300, // Animation nhanh
});

// CSS inline cho NProgress - màu xanh EzyFix
const styles = `
  #nprogress {
    pointer-events: none;
  }
  
  #nprogress .bar {
    background: linear-gradient(90deg, #3D7CE0, #609CEF);
    position: fixed;
    z-index: 9999;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    box-shadow: 0 0 10px rgba(61, 124, 224, 0.8);
  }
  
  #nprogress .peg {
    display: block;
    position: absolute;
    right: 0px;
    width: 100px;
    height: 100%;
    box-shadow: 0 0 15px #609CEF, 0 0 8px #3D7CE0;
    opacity: 1;
    transform: rotate(3deg) translate(0px, -4px);
  }
`;

export default function TopLoader() {
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    // Bắt đầu loading khi click vào link
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        const currentUrl = window.location.href;
        const targetUrl = anchor.href;
        // Chỉ start progress khi chuyển trang khác
        if (targetUrl !== currentUrl && !anchor.target && anchor.href.startsWith(window.location.origin)) {
          NProgress.set(0.4); // Bắt đầu từ 40%
          timer1 = setTimeout(() => {
            NProgress.inc(0.4); // Nhảy lên 80%
          }, 100);
          timer2 = setTimeout(() => {
            NProgress.done(); // Hoàn thành - chạy vèo đến 100%
          }, 300);
        }
      }
    };

    // Reset khi trang load xong
    const handleComplete = () => {
      NProgress.done();
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('popstate', handleComplete);
    // Cleanup
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('popstate', handleComplete);
    };
  }, []);

  return (
    <>
      <style>{styles}</style>
    </>
  );
}
