import type { ReactNode } from 'react';

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  large?: boolean;
  tall?: boolean;
  style?: React.CSSProperties;
  dataCategory?: string;
}

export function BentoCard({ 
  children, 
  className = '', 
  large, 
  tall,
  style,
  dataCategory
}: BentoCardProps) {
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
    >
      {children}
    </div>
  );
}
