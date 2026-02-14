import { forwardRef } from 'react';
import type { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  large?: boolean;
  tall?: boolean;
  style?: React.CSSProperties;
  dataCategory?: string;
}

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(function BentoCard({ 
  children, 
  className = '', 
  large, 
  tall,
  style,
  dataCategory
}, ref) {
  const classes = [
    'bento-card',
    large ? 'large' : '',
    tall ? 'tall' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes} 
      style={style}
      data-category={dataCategory}
      ref={ref}
    >
      {children}
    </div>
  );
});
