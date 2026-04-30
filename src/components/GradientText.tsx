'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  pauseOnHover?: boolean;
  yoyo?: boolean;
}

export default function GradientText({
  children,
  className = '',
  colors = ['#0056d0', '#00a8ff', '#002c6a'],
  animationSpeed = 8,
  direction = 'horizontal',
  pauseOnHover = false,
  yoyo = true
}: GradientTextProps) {
  const [position, setPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const animationDuration = animationSpeed * 1000;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (isPaused) {
        lastTimeRef.current = null;
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      if (lastTimeRef.current === null) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;
      elapsedRef.current += deltaTime;

      if (yoyo) {
        const fullCycle = animationDuration * 2;
        const cycleTime = elapsedRef.current % fullCycle;

        if (cycleTime < animationDuration) {
          setPosition((cycleTime / animationDuration) * 100);
        } else {
          setPosition(100 - ((cycleTime - animationDuration) / animationDuration) * 100);
        }
      } else {
        setPosition((elapsedRef.current % animationDuration) / animationDuration * 100);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isPaused, animationDuration, yoyo]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientAngle =
    direction === 'horizontal' ? 'to right' : direction === 'vertical' ? 'to bottom' : 'to bottom right';
  const gradientColors = [...colors, colors[0]].join(', ');

  return (
    <span
      className={`gradient-text-animated ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        backgroundImage: `linear-gradient(${gradientAngle}, ${gradientColors})`,
        backgroundSize: '300% 100%',
        backgroundPosition: `${position}% 50%`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: 'transparent',
      }}
    >
      {children}
    </span>
  );
}
