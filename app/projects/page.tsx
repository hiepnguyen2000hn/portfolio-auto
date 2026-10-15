import React from 'react';
import type { Metadata } from 'next';
import { getAllProjects } from '@/lib/projects';
import { Container } from '@/components/ui/Container';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';

export const metadata: Metadata = {
  title: 'Dự án Kỹ thuật & Case Studies',
  description: 'Tổng hợp các case study kiến trúc hệ thống, backend phân tán và ứng dụng web hiệu năng cao.',
};

export default function ProjectsPage() {
  const allProjects = getAllProjects();

  return (
    <div className="pt-28 pb-20">
      <Container>
        <SectionTitle
          eyebrow="Portfolio"
          title="Tất cả dự án & Case Studies"
          description="Khám phá chi tiết các dự án kỹ thuật quy mô lớn đã được thiết kế và triển khai production."
        />
      </Container>
      <FeaturedProjects projects={allProjects} />
    </div>
  );
}
