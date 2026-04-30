'use client';

import { type CSSProperties, type ReactNode } from 'react';

interface GrainProps {
  className?: string;
  style?: CSSProperties;
  opacity?: number;
}

export function Grain({
  className = '',
  style,
  opacity = 0.04,
}: GrainProps) {
  return (
    <div
      className={`grain-overlay ${className}`.trim()}
      style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        pointerEvents: 'none',
        zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        animation: 'grain 0.5s steps(5) infinite',
        ...style,
      }}
    />
  );
}
