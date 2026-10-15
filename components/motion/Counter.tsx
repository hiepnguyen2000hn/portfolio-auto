'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';
import { dur, ease } from '@/lib/motion';

export interface CounterProps {
  value: number | string;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/**
 * Parses numeric value and optional trailing/leading symbols
 * e.g., "99.99%" -> { num: 99.99, suffix: "%", decimals: 2 }
 * e.g., "24+"    -> { num: 24, suffix: "+", decimals: 0 }
 */
function parseValue(val: number | string, customDecimals?: number) {
  if (typeof val === 'number') {
    return {
      num: val,
      suffix: '',
      decimals: customDecimals ?? (Number.isInteger(val) ? 0 : 2),
    };
  }

  const str = String(val).trim();
  const match = str.match(/^([^\d.]*)([\d.]+)(.*)$/);
  if (!match) {
    return { num: 0, suffix: str, decimals: 0 };
  }

  const rawPrefix = match[1] || '';
  const numStr = match[2] || '0';
  const rawSuffix = match[3] || '';
  const num = parseFloat(numStr) || 0;
  const decimals =
    customDecimals ?? (numStr.includes('.') ? numStr.split('.')[1]?.length ?? 0 : 0);

  return {
    prefix: rawPrefix,
    num,
    suffix: rawSuffix,
    decimals,
  };
}

export function Counter({
  value,
  duration = dur.counter,
  className = '',
  prefix = '',
  suffix = '',
  decimals: propDecimals,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const parsed = parseValue(value, propDecimals);
  const effectivePrefix = prefix || parsed.prefix || '';
  const effectiveSuffix = suffix || parsed.suffix || '';
  const targetNumber = parsed.num;
  const targetDecimals = parsed.decimals;

  const [displayValue, setDisplayValue] = useState<string>(() => {
    return `${effectivePrefix}${targetNumber.toFixed(targetDecimals)}${effectiveSuffix}`;
  });

  useEffect(() => {
    if (!isInView || prefersReducedMotion) {
      setDisplayValue(
        `${effectivePrefix}${targetNumber.toFixed(targetDecimals)}${effectiveSuffix}`
      );
      return;
    }

    const controls = animate(0, targetNumber, {
      duration,
      ease: ease.expoOut,
      onUpdate: (latest) => {
        setDisplayValue(
          `${effectivePrefix}${latest.toFixed(targetDecimals)}${effectiveSuffix}`
        );
      },
    });

    return () => controls.stop();
  }, [isInView, prefersReducedMotion, targetNumber, targetDecimals, duration, effectivePrefix, effectiveSuffix]);

  return (
    <span ref={ref} className={`tabular-nums font-mono ${className}`}>
      {displayValue}
    </span>
  );
}

export default Counter;
