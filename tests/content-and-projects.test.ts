import { describe, it, expect } from 'vitest';
import {
  ProfileSchema,
  ExperienceSchema,
  SkillSchema,
  SkillCategorySchema,
  TestimonialSchema,
  AchievementSchema,
  ProjectSchema,
} from '@/types/content';
import { profile, profileData } from '@/data/profile';
import { experiences, experiencesData } from '@/data/experience';
import { skills, skillsData, getSkillsByCategory } from '@/data/skills';
import { testimonials, testimonialsData } from '@/data/testimonials';
import { achievements, achievementsData } from '@/data/achievements';
import {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectSlugs,
} from '@/lib/projects';

describe('Content Model Schemas', () => {
  it('validates a correct Profile object', () => {
    const result = ProfileSchema.safeParse(profileData);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid Profile email or negative years of experience', () => {
    const invalidEmail = {
      ...profileData,
      email: 'not-an-email',
    };
    expect(ProfileSchema.safeParse(invalidEmail).success).toBe(false);

    const negativeYears = {
      ...profileData,
      yearsOfExperience: -1,
    };
    expect(ProfileSchema.safeParse(negativeYears).success).toBe(false);
  });

  it('validates Experience schema with present or date string end', () => {
    for (const exp of experiencesData) {
      const res = ExperienceSchema.safeParse(exp);
      expect(res.success).toBe(true);
    }
  });

  it('validates Skill categories and level bounds', () => {
    expect(SkillCategorySchema.safeParse('Frontend').success).toBe(true);
    expect(SkillCategorySchema.safeParse('InvalidCategory').success).toBe(false);

    const validSkill = {
      name: 'TypeScript',
      category: 'Frontend',
      level: 5,
    };
    expect(SkillSchema.safeParse(validSkill).success).toBe(true);

    const invalidSkillLevel = {
      name: 'TypeScript',
      category: 'Frontend',
      level: 6,
    };
    expect(SkillSchema.safeParse(invalidSkillLevel).success).toBe(false);

    for (const skill of skillsData) {
      expect(SkillSchema.safeParse(skill).success).toBe(true);
    }
  });

  it('validates Testimonial and Achievement schemas', () => {
    for (const test of testimonialsData) {
      expect(TestimonialSchema.safeParse(test).success).toBe(true);
    }
    for (const ach of achievementsData) {
      expect(AchievementSchema.safeParse(ach).success).toBe(true);
    }
  });

  it('validates Project schema', () => {
    const sampleProject = {
      slug: 'test-project',
      title: 'Test Project',
      summary: 'Short summary of the test project',
      coverImage: '/images/projects/test.webp',
      role: 'Staff Engineer',
      period: '2024',
      teamSize: 4,
      metrics: [{ label: 'Speed', value: '10x' }],
      stack: ['Next.js', 'Go'],
      order: 1,
      featured: true,
    };
    expect(ProjectSchema.safeParse(sampleProject).success).toBe(true);
  });
});

describe('Static Data Integrity', () => {
  it('loads valid profile data with required fields', () => {
    expect(profile.name).toBeDefined();
    expect(profile.email).toContain('@');
    expect(profile.availability).toBe('open');
    expect(profile.summary.length).toBeGreaterThanOrEqual(1);
  });

  it('loads 3 experiences with non-empty highlights and stacks', () => {
    expect(experiences).toHaveLength(3);
    for (const exp of experiences) {
      expect(exp.highlights.length).toBeGreaterThan(0);
      expect(exp.stack.length).toBeGreaterThan(0);
    }
  });

  it('loads skills across multiple categories and filters properly', () => {
    expect(skills.length).toBeGreaterThan(10);
    const frontendSkills = getSkillsByCategory('Frontend');
    expect(frontendSkills.length).toBeGreaterThan(0);
    expect(frontendSkills.every((s) => s.category === 'Frontend')).toBe(true);

    const backendSkills = getSkillsByCategory('Backend');
    expect(backendSkills.length).toBeGreaterThan(0);

    const devopsSkills = getSkillsByCategory('DevOps/Cloud');
    expect(devopsSkills.length).toBeGreaterThan(0);
  });

  it('loads testimonials and achievements', () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    expect(achievements.length).toBeGreaterThanOrEqual(4);
  });
});

describe('Projects & MDX Reader (lib/projects)', () => {
  it('reads all projects and sorts by order ascending', () => {
    const projects = getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(3);

    const slugs = projects.map((p) => p.slug);
    expect(slugs).toContain('distributed-cache');
    expect(slugs).toContain('realtime-collab');
    expect(slugs).toContain('cloud-scale');

    // Verify ordering
    for (let i = 0; i < projects.length - 1; i++) {
      expect(projects[i]!.order).toBeLessThanOrEqual(projects[i + 1]!.order);
    }
  });

  it('reads markdown content inside MDX files', () => {
    const project = getProjectBySlug('distributed-cache');
    expect(project).not.toBeNull();
    expect(project?.title).toBe('High-Throughput Distributed Cache System');
    expect(project?.content).toContain('Executive Overview');
    expect(project?.metrics.length).toBeGreaterThan(0);
    expect(project?.stack).toContain('Go');
  });

  it('filters featured projects correctly', () => {
    const featured = getFeaturedProjects();
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.every((p) => p.featured)).toBe(true);
  });

  it('returns null for nonexistent project slug', () => {
    const nonExistent = getProjectBySlug('non-existent-project-xyz');
    expect(nonExistent).toBeNull();
  });

  it('lists available slugs with getProjectSlugs()', () => {
    const slugs = getProjectSlugs();
    expect(slugs).toContain('distributed-cache');
    expect(slugs).toContain('realtime-collab');
    expect(slugs).toContain('cloud-scale');
  });
});
