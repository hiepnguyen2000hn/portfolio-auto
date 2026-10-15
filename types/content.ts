import { z } from 'zod';

export const AvailabilitySchema = z.enum(['open', 'not-looking', 'freelance']);
export type Availability = z.infer<typeof AvailabilitySchema>;

export const SocialsSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  x: z.string().url().optional(),
  blog: z.string().url().optional(),
});
export type Socials = z.infer<typeof SocialsSchema>;

export const ProfileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  headline: z.string().min(1, 'Headline is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  location: z.string().min(1, 'Location is required'),
  yearsOfExperience: z.number().int().nonnegative('Years of experience must be non-negative'),
  availability: AvailabilitySchema,
  email: z.string().email('Invalid email address'),
  socials: SocialsSchema,
  avatar: z.string().min(1, 'Avatar path is required'),
  cvUrl: z.string().min(1, 'CV URL is required'),
  summary: z.array(z.string().min(1)).min(1, 'At least one summary bullet is required'),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const ExperienceSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  companyUrl: z.string().url().optional(),
  role: z.string().min(1, 'Role is required'),
  start: z.string().min(1, 'Start date is required'),
  end: z.union([z.string(), z.literal('present')]).optional(),
  location: z.string().min(1, 'Location is required'),
  highlights: z.array(z.string().min(1)).min(1, 'At least one highlight is required'),
  stack: z.array(z.string().min(1)).min(1, 'At least one technology is required'),
});
export type Experience = z.infer<typeof ExperienceSchema>;

export const SkillCategorySchema = z.enum([
  'Frontend',
  'Backend',
  'DevOps/Cloud',
  'Data',
  'Leadership',
]);
export type SkillCategory = z.infer<typeof SkillCategorySchema>;

export const SkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: SkillCategorySchema,
  level: z.number().int().min(1).max(5),
  icon: z.string().optional(),
});
export type Skill = z.infer<typeof SkillSchema>;

export const TestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  avatar: z.string().optional(),
  quote: z.string().min(1, 'Quote is required'),
});
export type Testimonial = z.infer<typeof TestimonialSchema>;

export const AchievementSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  detail: z.string().min(1, 'Detail is required'),
  year: z.union([z.number().int(), z.string().min(1)]),
  icon: z.string().optional(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const ProjectMetricSchema = z.object({
  label: z.string().min(1, 'Metric label is required'),
  value: z.string().min(1, 'Metric value is required'),
});
export type ProjectMetric = z.infer<typeof ProjectMetricSchema>;

export const ProjectSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  coverImage: z.string().min(1, 'Cover image path is required'),
  role: z.string().min(1, 'Role is required'),
  period: z.string().min(1, 'Period is required'),
  teamSize: z.union([z.number().int().positive(), z.string().min(1)]),
  metrics: z.array(ProjectMetricSchema).default([]),
  stack: z.array(z.string().min(1)).min(1, 'Stack must contain at least one item'),
  repoUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  order: z.number().int(),
  featured: z.boolean().default(false),
  content: z.string().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;
