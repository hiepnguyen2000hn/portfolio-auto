import { profile } from '@/data/profile';

export const siteConfig = {
  name: profile.name,
  title: `${profile.name} · ${profile.headline}`,
  description: profile.tagline,
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://alexnguyen.dev',
  keywords: [
    'Senior Software Engineer',
    'Staff Engineer',
    'Full-Stack Developer',
    'Three.js',
    'WebGL',
    'Next.js 16',
    'TypeScript',
    'Distributed Systems',
    'Cloud Architecture',
    'React 19',
  ],
  authors: [{ name: profile.name, url: process.env.NEXT_PUBLIC_SITE_URL }],
  creator: profile.name,
  locale: 'vi_VN',
  alternateLocale: 'en_US',
};

export function getPersonJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    description: profile.tagline,
    url: siteConfig.url,
    image: `${siteConfig.url}${profile.avatar}`,
    email: profile.email,
    sameAs: [
      profile.socials.github,
      profile.socials.linkedin,
      profile.socials.x,
      profile.socials.blog,
    ].filter(Boolean),
    knowsAbout: [
      'Next.js',
      'React',
      'TypeScript',
      'Three.js',
      'Go',
      'Distributed Systems',
      'Kubernetes',
      'Cloud Architecture',
    ],
  };
}
