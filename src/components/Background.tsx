import { useState, useEffect, useMemo } from 'react';

interface BlurCircle {
  id: number;
  size: number;
  x: number;
  y: number;
  opacity: number;
  color: string;
}

const COLORS = [
  'rgba(0, 86, 208, 0.18)',
  'rgba(0, 65, 157, 0.15)',
  'rgba(0, 44, 106, 0.12)',
];

function generateCircles(): BlurCircle[] {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i,
    size: 400 + Math.random() * 300,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: 0.6 + Math.random() * 0.4,
    color: COLORS[i % COLORS.length],
  }));
}

export function Background() {
  const circles = useMemo(() => generateCircles(), []);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    >
      {circles.map((circle) => {
        const speed = 0.02 + (circle.id % 3) * 0.015;
        const offsetY = scrollY * speed * (circle.id % 2 === 0 ? 1 : -1);
        const offsetX = scrollY * speed * 0.5 * (circle.id % 2 === 0 ? -1 : 1);

        return (
          <div
            key={circle.id}
            style={{
              position: 'absolute',
              width: `${circle.size}px`,
              height: `${circle.size}px`,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${circle.color} 0%, transparent 70%)`,
              filter: 'blur(100px)',
              opacity: circle.opacity,
              top: `${circle.y}%`,
              left: `${circle.x}%`,
              transform: `translate(${offsetX}px, ${offsetY}px)`,
              willChange: 'transform',
              transition: 'transform 0.1s linear',
            }}
          />
        );
      })}
    </div>
  );
}
