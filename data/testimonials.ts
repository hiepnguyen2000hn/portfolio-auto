import { Testimonial, TestimonialSchema } from '@/types/content';
import { z } from 'zod';

/**
 * Professional testimonials and endorsements
 * TODO: Replace with recommendations and quotes from your managers, colleagues, or clients.
 */
export const testimonialsData: Testimonial[] = [
  {
    name: 'Sarah Jenkins',
    role: 'VP of Engineering',
    company: 'Nexus Scale Labs',
    avatar: '/images/testimonials/sarah-jenkins.webp',
    quote:
      'Alex is an exceptional staff-level engineer who bridges high-level architectural vision with hands-on technical execution. His redesign of our caching infrastructure delivered unprecedented reliability under intense black-Friday traffic spikes.',
  },
  {
    name: 'Marcus Chen',
    role: 'Principal System Architect',
    company: 'HyperFlow Media',
    avatar: '/images/testimonials/marcus-chen.webp',
    quote:
      'Working with Alex on our collaborative canvas was a masterclass in frontend performance and real-time synchronization. He has a rare ability to simplify complex distributed state problems into robust, elegant code.',
  },
  {
    name: 'Elena Rostova',
    role: 'Director of Product',
    company: 'Vanguard Software',
    avatar: '/images/testimonials/elena-rostova.webp',
    quote:
      'Beyond his stellar technical acumen, Alex has a sharp product sense. He consistently anticipates edge cases, champions user experience, and elevates everyone around him through thoughtful design docs and mentoring.',
  },
];

// Validate all testimonials against TestimonialSchema
export const testimonials = z.array(TestimonialSchema).parse(testimonialsData);
