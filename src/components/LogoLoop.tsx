'use client';

import React, { useRef, useState } from 'react';

interface LogoItem {
  node: React.ReactNode;
  href?: string;
  title?: string;
  ariaLabel?: string;
}

interface LogoLoopProps {
  logos: LogoItem[];
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
  pauseOnHover?: boolean;
}

export default function LogoLoop({
  logos,
  speed = 120,
  direction = 'left',
  className = '',
  pauseOnHover = true,
}: LogoLoopProps) {
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const duplicatedLogos = [...logos, ...logos, ...logos];
  const logoWidth = 144;
  const totalWidth = logoWidth * logos.length;
  const duration = totalWidth / speed;

  return (
    <div
      ref={containerRef}
      className={`logo-loop-container ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <style>{`
        .logo-loop-container {
          width: 100%;
          overflow: hidden;
        }
        .logo-loop-track {
          display: flex;
          animation: logoScroll${direction === 'left' ? 'Left' : 'Right'} ${duration}s linear infinite;
          animation-play-state: ${isPaused ? 'paused' : 'running'};
          will-change: transform;
          transform: translate3d(0, 0, 0);
        }
        .logo-loop-track:hover {
          animation-play-state: paused;
        }
        @keyframes logoScrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @keyframes logoScrollRight {
          0% { transform: translateX(-66.666%); }
          100% { transform: translateX(0); }
        }
        .logo-loop-item {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 2rem;
          color: var(--primary);
          opacity: 0.7;
          transition: opacity 0.3s;
          backface-visibility: hidden;
        }
        .logo-loop-item:hover {
          opacity: 1;
        }
        .logo-loop-item svg {
          height: 40px;
          width: auto;
        }
      `}</style>
      <div className="logo-loop-track">
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="logo-loop-item">
            {logo.href ? (
              <a href={logo.href} title={logo.title} aria-label={logo.ariaLabel}>
                {logo.node}
              </a>
            ) : (
              logo.node
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
