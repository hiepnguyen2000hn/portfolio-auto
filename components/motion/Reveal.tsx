'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { dur, ease } from '@/lib/motion';

export type RevealVariant =
  | 'fadeUp'
  | 'fadeIn'
  | 'fade'
  | 'scaleIn'
  | 'slideLeft'
  | 'blurIn'
  | 'clipUp';

export interface RevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  className?: string;
  tag?: 'div' | 'section' | 'article' | 'span';
  once?: boolean;
}

const variantsMap: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(8px)', y: 12 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
  clipUp: {
    hidden: { opacity: 0, clipPath: 'inset(100% 0 0 0)', y: 20 },
    visible: { opacity: 1, clipPath: 'inset(0% 0 0 0)', y: 0 },
  },
};

const reducedMotionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function Reveal({
  children,
  variant = 'fadeUp',
  delay,
  duration = dur.normal,
  className = '',
  tag = 'div',
  once = true,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const MotionTag = motion[tag] as typeof motion.div;

  if (prefersReducedMotion) {
    return (
      <MotionTag
        initial={mounted ? 'hidden' : false}
        whileInView="visible"
        viewport={{ once, amount: 0.25 }}
        variants={reducedMotionVariants}
        transition={{ duration: dur.fast, ease: 'easeOut' }}
        className={className}
        data-reveal
      >
        {children}
      </MotionTag>
    );
  }

  const selectedVariant = variantsMap[variant] || variantsMap.fadeUp;

  return (
    <MotionTag
      initial={mounted ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once, amount: 0.25 }}
      variants={selectedVariant}
      transition={{
        duration,
        ...(delay !== undefined ? { delay } : {}),
        ease: ease.out,
      }}
      className={className}
      data-reveal
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
