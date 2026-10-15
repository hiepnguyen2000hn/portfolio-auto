'use client';

import Link from 'next/link';
import { ArrowLeft, Printer, Download } from 'lucide-react';

export function ResumeToolbar() {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <aside
      aria-label="Resume Actions"
      className="no-print sticky top-4 z-50 mx-auto mb-8 flex max-w-4xl items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-md backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90 print:hidden"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Về trang chủ</span>
      </Link>

      <div className="flex items-center gap-2">
        <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
          Tối ưu ATS & Chuẩn in A4
        </span>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          <Printer className="h-4 w-4" />
          <span>In / Lưu PDF</span>
        </button>
      </div>
    </aside>
  );
}
