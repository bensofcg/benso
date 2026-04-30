'use client';

import { type ReactNode, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function ScrollReveal({ 
  children, 
  className = '', 
  style 
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  
  return (
    <motion.section
      ref={ref}
      className={`reveal-section ${className}`.trim()}
      style={style}
      initial={{ opacity: 0, y: 35 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 35 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className = '', 
  delay = 0 
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        ease: 'easeOut',
        delay
      }}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export function AnimatedCard({ 
  children, 
  className = '', 
  index = 0 
}: AnimatedCardProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.4,
        ease: 'easeOut',
        delay: index * 0.08
      }}
    >
      {children}
    </motion.div>
  );
}