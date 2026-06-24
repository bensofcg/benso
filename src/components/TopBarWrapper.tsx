'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PromoBanner } from './PromoBanner';
import { Header } from './Header';

export function TopBarWrapper() {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (wrapperRef.current) {
        const banner = wrapperRef.current.querySelector('.promo-banner') as HTMLElement;
        const header = wrapperRef.current.querySelector('header:not(.admin-header)') as HTMLElement;
        const bHeight = banner?.offsetHeight || 0;
        const hHeight = header?.offsetHeight || 0;
        setBannerHeight(bHeight);
        document.documentElement.style.setProperty('--navbar-height', `${bHeight + hHeight}px`);
        document.documentElement.style.setProperty('--banner-height', `${bHeight}px`);
      }
    };

    updateNavbarHeight();
    const resizeObserver = new ResizeObserver(updateNavbarHeight);
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }
    window.addEventListener('resize', updateNavbarHeight);
    return () => {
      window.removeEventListener('resize', updateNavbarHeight);
      resizeObserver.disconnect();
      document.documentElement.style.setProperty('--navbar-height', '0px');
      document.documentElement.style.setProperty('--banner-height', '0px');
    };
  }, []);

  return (
    <div ref={wrapperRef} className="nav-wrapper">
      <PromoBanner />
      <Header />
    </div>
  );
}
