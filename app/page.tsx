import React from 'react';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Skills } from '@/components/sections/Skills';
import { Experience } from '@/components/sections/Experience';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Achievements } from '@/components/sections/Achievements';
import { Contact } from '@/components/sections/Contact';
import { getFeaturedProjects } from '@/lib/projects';

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();

  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <FeaturedProjects projects={featuredProjects} />
      <Achievements />
      <Contact />
    </>
  );
}
