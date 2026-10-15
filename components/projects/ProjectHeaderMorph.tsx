'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export function ProjectTitleMorph({
  slug,
  title,
}: {
  slug: string;
  title: string;
}): React.JSX.Element {
  return (
    <motion.h1
      layoutId={`project-title-${slug}`}
      className="text-3xl sm:text-5xl font-extrabold text-[var(--fg)] tracking-tight leading-tight"
    >
      {title}
    </motion.h1>
  );
}

export function ProjectImageMorph({
  slug,
  title,
  coverImage,
}: {
  slug: string;
  title: string;
  coverImage: string;
}): React.JSX.Element {
  return (
    <div className="mt-10 relative aspect-[16/9] max-h-[500px] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl bg-[var(--bg-elevated)]">
      <motion.div
        layoutId={`project-img-${slug}`}
        className="relative w-full h-full"
      >
        <Image
          src={coverImage}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
