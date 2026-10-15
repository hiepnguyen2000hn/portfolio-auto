'use client';

import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { stagger, dur, ease } from '@/lib/motion';

export interface StaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  delayChildren?: number;
  className?: string;
  tag?: 'div' | 'ul' | 'ol' | 'section';
  once?: boolean;
}

export function Stagger({
  children,
  staggerDelay = stagger.normal,
  delayChildren = 0,
  className = '',
  tag = 'div',
  once = true,
}: StaggerProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren,
      },
    },
  };

  const MotionTag = motion[tag] as typeof motion.div;

  return (
    <MotionTag
      initial={mounted ? 'hidden' : false}
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={containerVariants}
      className={className}
      data-stagger
    >
      {children}
    </MotionTag>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  tag?: 'div' | 'li' | 'span';
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: dur.normal,
      ease: ease.out,
    },
  },
};

const reducedItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: dur.fast,
      ease: 'easeOut',
    },
  },
};

export function StaggerItem({
  children,
  className = '',
  tag = 'div',
}: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[tag] as typeof motion.div;

  return (
    <MotionTag
      variants={prefersReducedMotion ? reducedItemVariants : itemVariants}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

export default Stagger;
