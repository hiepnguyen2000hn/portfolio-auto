import { Profile, ProfileSchema } from '@/types/content';

/**
 * Personal profile data
 * TODO: Replace the placeholder values below with your own personal and professional details.
 */
export const profileData: Profile = {
  // TODO: Replace with your full name
  name: 'Alex Nguyen',

  // TODO: Replace with your primary professional title / headline
  headline: 'Staff Full-Stack & Systems Engineer',

  // TODO: Replace with your elevator pitch / tagline
  tagline:
    'Architecting high-scale distributed systems, low-latency microservices, and interactive 3D web applications.',

  // TODO: Replace with your current location (City, Country)
  location: 'San Francisco, CA / Remote',

  // TODO: Replace with your total years of professional engineering experience
  yearsOfExperience: 8,

  // TODO: Set your job availability ('open' | 'not-looking' | 'freelance')
  availability: 'open',

  // TODO: Replace with your primary contact email
  email: 'alex.nguyen.eng@example.com',

  // TODO: Replace with your social media / professional profiles
  socials: {
    github: 'https://github.com/alexnguyen-dev',
    linkedin: 'https://linkedin.com/in/alexnguyen-dev',
    x: 'https://x.com/alexnguyen_dev',
    blog: 'https://alexnguyen.dev/blog',
  },

  // TODO: Replace with the path to your avatar image in public/
  avatar: '/images/avatar.webp',

  // TODO: Replace with the path to your downloadable CV / resume in public/
  cvUrl: '/cv.pdf',

  // TODO: Provide key summary points highlighting your engineering expertise and focus areas
  summary: [
    '8+ years designing and operating high-throughput distributed systems handling 50M+ daily events with 99.99% uptime.',
    'Deep specialization in full-stack architecture, Next.js, React 19, TypeScript, Go, and cloud-native infrastructure on AWS/GCP.',
    'Proven track record leading engineering teams, mentoring senior developers, and driving system-wide modernization initiatives.',
    'Passion for fluid user experiences, 3D web visualizations with Three.js/WebGL, and high-performance frontend engineering.',
  ],
};

// Validate profile data at load time against the schema
export const profile = ProfileSchema.parse(profileData);
