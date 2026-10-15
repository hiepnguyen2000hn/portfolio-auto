import { Achievement, AchievementSchema } from '@/types/content';
import { z } from 'zod';

/**
 * Key engineering milestones, awards, and certifications
 * TODO: Replace with your personal honors, certifications, open-source milestones, or talks.
 */
export const achievementsData: Achievement[] = [
  {
    title: 'AWS Certified Solutions Architect – Professional',
    detail: 'Demonstrated advanced expertise in designing distributed, decoupled cloud-native systems on AWS.',
    year: '2024',
    icon: 'award',
  },
  {
    title: 'Speaker at Conf42 Distributed Systems',
    detail: 'Delivered technical keynote: "Scaling Real-Time Collaborative Surfaces with CRDTs and WebSockets".',
    year: '2023',
    icon: 'mic',
  },
  {
    title: 'Top 1% Contributor – Open Source Ecosystem',
    detail: 'Author and maintainer of high-performance TypeScript state synchronization and rate-limiting utilities.',
    year: '2022',
    icon: 'git-pull-request',
  },
  {
    title: 'Engineering Excellence Award',
    detail: 'Recognized at Nexus Scale Labs for spearheading zero-downtime multi-region Kubernetes migration.',
    year: '2021',
    icon: 'trophy',
  },
];

// Validate all achievements against AchievementSchema
export const achievements = z.array(AchievementSchema).parse(achievementsData);
