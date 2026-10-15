'use client';

import React from 'react';
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
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.94 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
};

export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className = '',
  tag = 'div',
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  }

  const selectedVariant = variantsMap[variant] || variantsMap.fadeUp;
  const MotionTag = motion[tag] as typeof motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={selectedVariant}
      transition={{ duration, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
