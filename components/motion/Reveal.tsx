'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface RevealProps {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'fadeIn' | 'scaleIn' | 'slideLeft';
  delay?: number;
  duration?: number;
  className?: string;
  tag?: 'div' | 'section' | 'article' | 'span';
}

const variantsMap = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
};

export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.5,
  className = '',
  tag = 'div',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (prefersReducedMotion) {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  }

  const selectedVariant = variantsMap[variant] || variantsMap.fadeUp;
  const MotionTag = motion[tag] as typeof motion.div;

  return (
    <MotionTag
      initial={mounted ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once: true, amount: 0.05, margin: '0px' }}
      variants={selectedVariant}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
      data-reveal
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
