'use client';

import { type CSSProperties } from 'react';

interface BackgroundProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export function Background({ className = '', style, children }: BackgroundProps) {
  return (
    <div
      className={`hero-background ${className}`.trim()}
      style={style}
    >
      <div className="hero-gradient" />
      {children}
    </div>
  );
}
