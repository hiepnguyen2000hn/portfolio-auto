/**
 * Arctic Lab Motion System Tokens
 * Shared durations, transitions, and easing curves across the application
 */

export const dur = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.8,
  deliberate: 1.2,
  counter: 1.6,
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  expoOut: [0.16, 1, 0.3, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  spring: { type: 'spring', damping: 25, stiffness: 200 } as const,
  springSnappy: { type: 'spring', damping: 20, stiffness: 300 } as const,
  springGentle: { type: 'spring', damping: 30, stiffness: 120 } as const,
} as const;

export const stagger = {
  fast: 0.03,
  normal: 0.06,
  slow: 0.1,
} as const;
