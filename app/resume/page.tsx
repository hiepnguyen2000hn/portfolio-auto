import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { experiences } from '@/data/experience';
import { skills } from '@/data/skills';
import { formatRange, durationBetween } from '@/lib/date';
import { ResumeToolbar } from '@/components/resume/ResumeToolbar';

export const metadata: Metadata = {
  title: `Resume | ${profile.name} - ${profile.headline}`,
  description: `Curriculum Vitae / Resume of ${profile.name}. ATS-friendly format, printable PDF.`,
};

export default function ResumePage() {
  const skillCategories = ['Frontend', 'Backend', 'DevOps/Cloud', 'Data', 'Leadership'] as const;

  return (
    <div className="min-h-screen bg-zinc-100 py-8 px-4 font-sans text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100 print:bg-white print:p-0 print:text-black">
      {/* Print Stylesheet */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            @media print {
              html, body {
                background: #ffffff !important;
                color: #000000 !important;
                font-size: 10pt !important;
                line-height: 1.35 !important;
              }
              .no-print, header[role="banner"], nav, footer, button {
                display: none !important;
              }
              .resume-container {
                box-shadow: none !important;
                border: none !important;
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                background: #ffffff !important;
                color: #000000 !important;
              }
              .break-inside-avoid {
                break-inside: avoid !important;
                page-break-inside: avoid !important;
              }
              a {
                text-decoration: none !important;
                color: #000000 !important;
              }
              a[href^="http"]:after {
                content: "" !important;
              }
            }
          `,
        }}
      />

      {/* Screen Toolbar */}
      <ResumeToolbar />

      {/* Main Resume Sheet */}
      <main className="resume-container mx-auto max-w-4xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 sm:p-12 print:max-w-none print:border-none print:bg-white print:p-0 print:text-black print:shadow-none">
        {/* ATS-friendly Header */}
        <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800 print:border-zinc-300 print:pb-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white print:text-2xl print:text-black">
            {profile.name}
          </h1>
          <p className="mt-1 text-lg font-medium text-zinc-700 dark:text-zinc-300 print:text-base print:text-zinc-800">
            {profile.headline}
          </p>

          <address className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm not-italic text-zinc-600 dark:text-zinc-400 print:text-xs print:text-zinc-700">
            <span>{profile.location}</span>
            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700 print:text-zinc-400">
              •
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="hover:underline focus:outline-none print:text-black"
            >
              {profile.email}
            </a>
            {profile.socials.linkedin && (
              <>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700 print:text-zinc-400">
                  •
                </span>
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline print:text-black"
                >
                  linkedin.com/in/alexnguyen-dev
                </a>
              </>
            )}
            {profile.socials.github && (
              <>
                <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700 print:text-zinc-400">
                  •
                </span>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline print:text-black"
                >
                  github.com/alexnguyen-dev
                </a>
              </>
            )}
          </address>
        </header>

        {/* Section: Professional Summary */}
        <section
          aria-labelledby="heading-summary"
          className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800 print:border-zinc-300 print:py-3 print:pb-3"
        >
          <h2
            id="heading-summary"
            className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 print:text-xs print:text-black"
          >
            Tóm tắt chuyên môn / Summary
          </h2>
          <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300 print:mt-1.5 print:text-xs print:text-zinc-800">
            {profile.summary.map((bullet, idx) => (
              <li key={idx} className="leading-relaxed">
                {bullet}
              </li>
            ))}
          </ul>
        </section>

        {/* Section: Experience */}
        <section
          aria-labelledby="heading-experience"
          className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800 print:border-zinc-300 print:py-3 print:pb-3"
        >
          <h2
            id="heading-experience"
            className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 print:text-xs print:text-black"
          >
            Kinh nghiệm làm việc / Work Experience
          </h2>

          <div className="mt-4 space-y-6 print:mt-2 print:space-y-4">
            {experiences.map((exp, index) => (
              <article key={index} className="break-inside-avoid">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white print:text-sm print:text-black">
                    {exp.role}{' '}
                    <span className="font-normal text-zinc-600 dark:text-zinc-400 print:text-zinc-800">
                      @ {exp.company}
                    </span>
                  </h3>
                  <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
                    <time dateTime={exp.start}>{formatRange(exp.start, exp.end)}</time>
                    <span className="ml-1 text-zinc-400 dark:text-zinc-500">
                      ({durationBetween(exp.start, exp.end)})
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
                  {exp.location}
                </p>

                <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-zinc-700 dark:text-zinc-300 print:mt-1 print:text-xs print:text-zinc-800">
                  {exp.highlights.map((highlight, hIdx) => (
                    <li key={hIdx} className="leading-relaxed">
                      {highlight}
                    </li>
                  ))}
                </ul>

                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 print:mt-1 print:text-[10px] print:text-zinc-600">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300 print:text-zinc-800">
                    Tech Stack:
                  </span>{' '}
                  {exp.stack.join(', ')}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Section: Technical Skills */}
        <section
          aria-labelledby="heading-skills"
          className="mt-6 border-b border-zinc-200 pb-6 dark:border-zinc-800 print:border-zinc-300 print:py-3 print:pb-3"
        >
          <h2
            id="heading-skills"
            className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 print:text-xs print:text-black"
          >
            Kỹ năng chuyên môn / Technical Skills
          </h2>

          <div className="mt-3 space-y-2 text-sm print:mt-1.5 print:text-xs">
            {skillCategories.map((category) => {
              const catSkills = skills.filter((s) => s.category === category);
              if (catSkills.length === 0) return null;
              return (
                <div key={category} className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-zinc-800 sm:w-36 shrink-0 dark:text-zinc-200 print:text-black">
                    {category}:
                  </span>
                  <span className="text-zinc-700 dark:text-zinc-300 print:text-zinc-800">
                    {catSkills.map((s) => s.name).join(', ')}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Education & Certifications */}
        <section
          aria-labelledby="heading-education"
          className="mt-6 print:py-3 print:pb-0"
        >
          <h2
            id="heading-education"
            className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100 print:text-xs print:text-black"
          >
            Học vấn & Chứng chỉ / Education & Certifications
          </h2>

          <div className="mt-3 space-y-3 text-sm print:mt-1.5 print:space-y-1.5 print:text-xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white print:text-black">
                  Bachelor of Science in Computer Science
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
                  Ho Chi Minh City University of Technology (HCMUT)
                </p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
                2013 – 2017
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <p className="font-semibold text-zinc-900 dark:text-white print:text-black">
                  AWS Certified Solutions Architect – Professional
                </p>
                <p className="text-zinc-600 dark:text-zinc-400 print:text-zinc-700">
                  Amazon Web Services
                </p>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 print:text-zinc-600">
                2023 – 2026
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
