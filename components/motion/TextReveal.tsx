'use client';

import React, { useMemo } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { dur, ease, stagger } from '@/lib/motion';

export interface TextRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  by?: 'words' | 'chars';
  className?: string;
  delay?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  as: Tag = 'h1',
  by = 'words',
  className = '',
  delay = 0,
  once = true,
}: TextRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  // Split tokens deterministically
  const tokens = useMemo(() => {
    if (by === 'chars') {
      return Array.from(text);
    }
    // Split by spaces, preserving word boundaries
    return text.split(' ');
  }, [text, by]);

  if (prefersReducedMotion) {
    return (
      <Tag className={className}>
        <span>{text}</span>
      </Tag>
    );
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: by === 'chars' ? 0.015 : stagger.fast,
        delayChildren: delay,
      },
    },
  };

  const tokenVariants: Variants = {
    hidden: {
      y: '100%',
      opacity: 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: dur.normal,
        ease: ease.out,
      },
    },
  };

  return (
    <Tag className={className} aria-label={text}>
      {/* Hidden text for screen readers and SEO crawlability */}
      <span className="sr-only">{text}</span>

      {/* Visual animated tokens */}
      <motion.span
        className="inline-block"
        aria-hidden="true"
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount: 0.25 }}
        variants={containerVariants}
      >
        {tokens.map((token, index) => (
          <span
            key={`${token}-${index}`}
            className="inline-block overflow-hidden align-top"
          >
            <motion.span
              variants={tokenVariants}
              className="inline-block"
            >
              {token}
            </motion.span>
            {by === 'words' && index < tokens.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

export default TextReveal;
