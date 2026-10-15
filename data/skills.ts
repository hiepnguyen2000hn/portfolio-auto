import { Skill, SkillSchema } from '@/types/content';
import { z } from 'zod';

/**
 * Technical and leadership skills grouped by category
 * TODO: Adjust proficiency levels (1-5), add or remove skills to reflect your expertise.
 */
export const skillsData: Skill[] = [
  // Frontend
  { name: 'TypeScript', category: 'Frontend', level: 5, icon: 'typescript' },
  { name: 'React 19 / Next.js', category: 'Frontend', level: 5, icon: 'react' },
  { name: 'Three.js / WebGL / R3F', category: 'Frontend', level: 4, icon: 'threejs' },
  { name: 'Tailwind CSS / UI Systems', category: 'Frontend', level: 5, icon: 'tailwind' },
  { name: 'Performance Optimization & Web Vitals', category: 'Frontend', level: 5, icon: 'zap' },

  // Backend
  { name: 'Go (Golang)', category: 'Backend', level: 5, icon: 'go' },
  { name: 'Node.js / Express / Fastify', category: 'Backend', level: 5, icon: 'nodejs' },
  { name: 'Distributed Systems & Microservices', category: 'Backend', level: 5, icon: 'server' },
  { name: 'gRPC & Protocol Buffers', category: 'Backend', level: 4, icon: 'network' },
  { name: 'REST & GraphQL APIs', category: 'Backend', level: 5, icon: 'api' },

  // DevOps/Cloud
  { name: 'Kubernetes & Docker', category: 'DevOps/Cloud', level: 5, icon: 'docker' },
  { name: 'AWS & Google Cloud Platform', category: 'DevOps/Cloud', level: 5, icon: 'cloud' },
  { name: 'Terraform & Infrastructure as Code', category: 'DevOps/Cloud', level: 4, icon: 'terraform' },
  { name: 'CI/CD & GitHub Actions', category: 'DevOps/Cloud', level: 5, icon: 'git' },
  { name: 'Observability (Prometheus, Grafana, OpenTelemetry)', category: 'DevOps/Cloud', level: 4, icon: 'activity' },

  // Data
  { name: 'PostgreSQL & SQL Tuning', category: 'Data', level: 5, icon: 'database' },
  { name: 'Redis (Caching & Streams)', category: 'Data', level: 5, icon: 'database' },
  { name: 'Apache Kafka & Event Streaming', category: 'Data', level: 4, icon: 'layers' },
  { name: 'Prisma / Drizzle ORM', category: 'Data', level: 5, icon: 'database' },
  { name: 'Elasticsearch / OpenSearch', category: 'Data', level: 4, icon: 'search' },

  // Leadership
  { name: 'Technical Architecture & RFCs', category: 'Leadership', level: 5, icon: 'compass' },
  { name: 'Engineering Mentorship & Hiring', category: 'Leadership', level: 5, icon: 'users' },
  { name: 'Agile & Cross-functional Delivery', category: 'Leadership', level: 5, icon: 'briefcase' },
  { name: 'System Scalability Strategy', category: 'Leadership', level: 5, icon: 'trending-up' },
];

// Validate all skills against SkillSchema
export const skills = z.array(SkillSchema).parse(skillsData);

/**
 * Helper to get skills grouped by category
 */
export function getSkillsByCategory(category: Skill['category']): Skill[] {
  return skills.filter((skill) => skill.category === category);
}
