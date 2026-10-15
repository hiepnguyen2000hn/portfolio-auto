import { Experience, ExperienceSchema } from '@/types/content';
import { z } from 'zod';

/**
 * Professional work experience history
 * TODO: Customize with your past employment, roles, impact metrics, and technology stacks.
 */
export const experiencesData: Experience[] = [
  {
    company: 'Nexus Scale Labs',
    companyUrl: 'https://example.com/nexus',
    role: 'Staff Systems Engineer & Tech Lead',
    start: '2022-03',
    end: 'present',
    location: 'San Francisco, CA (Remote)',
    highlights: [
      'Led core infrastructure modernization, migrating legacy monolithic workloads to event-driven Kubernetes microservices serving 40k RPS.',
      'Designed and deployed an in-memory caching tier reducing p99 API latencies by 68% and cloud infrastructure spend by $180k/year.',
      'Mentored 12 mid and senior engineers, instituted RFC design processes, and established automated canary deployment pipelines.',
    ],
    stack: ['Go', 'TypeScript', 'Next.js', 'Kubernetes', 'Redis', 'Kafka', 'AWS', 'Terraform'],
  },
  {
    company: 'HyperFlow Media',
    companyUrl: 'https://example.com/hyperflow',
    role: 'Senior Full-Stack Engineer',
    start: '2019-08',
    end: '2022-02',
    location: 'Seattle, WA',
    highlights: [
      'Engineered real-time collaborative video analytics canvas utilizing WebSockets, WebGL, and CRDTs for multiplayer synchronization.',
      'Spearheaded frontend performance optimizations, elevating Core Web Vitals to 98+ across all web properties.',
      'Integrated end-to-end telemetry and distributed tracing with OpenTelemetry, cutting mean time to resolution (MTTR) by 45%.',
    ],
    stack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Three.js', 'PostgreSQL', 'Docker', 'GCP'],
  },
  {
    company: 'Vanguard Software Solutions',
    companyUrl: 'https://example.com/vanguard',
    role: 'Software Engineer',
    start: '2017-06',
    end: '2019-07',
    location: 'Austin, TX',
    highlights: [
      'Built and maintained customer-facing billing and identity portals processing $25M+ in annual subscription volume.',
      'Refactored legacy REST APIs into typed GraphQL services with dataloader batching, slashing database query volume by 50%.',
      'Implemented robust CI/CD test automation suites achieving 92% code coverage and zero-downtime releases.',
    ],
    stack: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'GraphQL', 'PostgreSQL', 'Jest', 'AWS'],
  },
];

// Validate all experiences against ExperienceSchema
export const experiences = z.array(ExperienceSchema).parse(experiencesData);
