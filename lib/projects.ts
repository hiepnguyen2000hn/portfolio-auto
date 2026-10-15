import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Project, ProjectSchema } from '@/types/content';

const PROJECTS_DIRECTORY = path.join(process.cwd(), 'content', 'projects');

/**
 * Returns all MDX project slugs available in the content directory.
 */
export function getProjectSlugs(): string[] {
  if (!fs.existsSync(PROJECTS_DIRECTORY)) {
    return [];
  }
  return fs
    .readdirSync(PROJECTS_DIRECTORY)
    .filter((file) => /\.mdx?$/.test(file))
    .map((file) => file.replace(/\.mdx?$/, ''));
}

/**
 * Reads all project MDX files from `content/projects/*.mdx`,
 * validates frontmatter with ProjectSchema, and returns them sorted by `order`.
 */
export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIRECTORY)) {
    return [];
  }

  const files = fs.readdirSync(PROJECTS_DIRECTORY);
  const mdxFiles = files.filter((file) => /\.mdx?$/.test(file));

  const projects: Project[] = mdxFiles
    .map((fileName) => {
      const fullPath = path.join(PROJECTS_DIRECTORY, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const fileSlug = fileName.replace(/\.mdx?$/, '');

      return ProjectSchema.parse({
        slug: fileSlug,
        ...data,
        content: content.trim(),
      });
    })
    .sort((a, b) => a.order - b.order);

  return projects;
}

/**
 * Returns only the projects flagged with `featured: true`.
 */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((project) => project.featured);
}

/**
 * Retrieves a single project by its slug, including markdown content.
 * Returns null if the project is not found or fails validation.
 */
export function getProjectBySlug(slug: string): Project | null {
  try {
    const mdxPath = path.join(PROJECTS_DIRECTORY, `${slug}.mdx`);
    const mdPath = path.join(PROJECTS_DIRECTORY, `${slug}.md`);

    let fullPath = '';
    if (fs.existsSync(mdxPath)) {
      fullPath = mdxPath;
    } else if (fs.existsSync(mdPath)) {
      fullPath = mdPath;
    } else {
      const match = getAllProjects().find((p) => p.slug === slug);
      return match ?? null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return ProjectSchema.parse({
      slug,
      ...data,
      content: content.trim(),
    });
  } catch (error) {
    console.error(`Error loading project with slug "${slug}":`, error);
    return null;
  }
}
