import { describe, it, expect } from 'vitest';
import {
  formatRange,
  durationBetween,
  formatSingleDate,
  parseYearMonth,
} from '@/lib/date';

describe('Date Utilities - parseYearMonth & formatSingleDate', () => {
  it('parses YYYY-MM and YYYY-MM-DD correctly', () => {
    expect(parseYearMonth('2022-01')).toEqual({ year: 2022, month: 1 });
    expect(parseYearMonth('2023/12/25')).toEqual({ year: 2023, month: 12 });
  });

  it('formats single dates in vi and en', () => {
    expect(formatSingleDate('2022-01', 'vi')).toBe('Thg 1/2022');
    expect(formatSingleDate('2022-01', 'en')).toBe('Jan 2022');
    expect(formatSingleDate('2023-12', 'vi')).toBe('Thg 12/2023');
    expect(formatSingleDate('2023-12', 'en')).toBe('Dec 2023');
  });
});

describe('Date Utilities - formatRange', () => {
  it('formats range with present / current (Vietnamese default)', () => {
    expect(formatRange('2022-01')).toBe('Thg 1/2022 – Hiện tại');
    expect(formatRange('2022-01', 'present')).toBe('Thg 1/2022 – Hiện tại');
    expect(formatRange('2022-01', 'current')).toBe('Thg 1/2022 – Hiện tại');
  });

  it('formats range with present in English', () => {
    expect(formatRange('2022-01', 'present', 'en')).toBe('Jan 2022 – Present');
    expect(formatRange('2022-01', undefined, { locale: 'en' })).toBe('Jan 2022 – Present');
  });

  it('handles same month case (cùng tháng)', () => {
    expect(formatRange('2022-01', '2022-01')).toBe('Thg 1/2022');
    expect(formatRange('2022-05', '2022-05', 'en')).toBe('May 2022');
    expect(formatRange('2022-01-01', '2022-01-31')).toBe('Thg 1/2022');
  });

  it('formats range across years (qua năm)', () => {
    expect(formatRange('2022-01', '2023-12')).toBe('Thg 1/2022 – Thg 12/2023');
    expect(formatRange('2022-01', '2023-12', 'en')).toBe('Jan 2022 – Dec 2023');
  });

  it('formats range within the same year but different months', () => {
    expect(formatRange('2022-03', '2022-08')).toBe('Thg 3/2022 – Thg 8/2022');
    expect(formatRange('2022-03', '2022-08', 'en')).toBe('Mar 2022 – Aug 2022');
  });

  it('handles empty start date gracefully', () => {
    expect(formatRange('')).toBe('');
  });
});

describe('Date Utilities - durationBetween', () => {
  it('calculates exact duration in years and months (Vietnamese)', () => {
    // Jan 2020 to Sep 2022 inclusive: 33 months = 2 years 9 months
    expect(durationBetween('2020-01', '2022-09')).toBe('2 năm 9 tháng');
  });

  it('calculates full years with 0 months (Vietnamese)', () => {
    // Jan 2022 to Dec 2022 inclusive: 12 months = 1 year
    expect(durationBetween('2022-01', '2022-12')).toBe('1 năm');
    // Jan 2020 to Dec 2021 inclusive: 24 months = 2 years
    expect(durationBetween('2020-01', '2021-12')).toBe('2 năm');
  });

  it('calculates months only when under 1 year (Vietnamese)', () => {
    // Jan 2022 to Jun 2022 inclusive: 6 months
    expect(durationBetween('2022-01', '2022-06')).toBe('6 tháng');
    // Same month: 1 month
    expect(durationBetween('2022-01', '2022-01')).toBe('1 tháng');
  });

  it('calculates duration in English with proper pluralization', () => {
    expect(durationBetween('2020-01', '2022-09', 'en')).toBe('2 years 9 months');
    expect(durationBetween('2022-01', '2022-12', 'en')).toBe('1 year');
    expect(durationBetween('2022-01', '2022-01', 'en')).toBe('1 month');
    expect(durationBetween('2022-01', '2022-02', 'en')).toBe('2 months');
  });

  it('handles duration until present / current date without errors', () => {
    const resultVi = durationBetween('2020-01', 'present');
    expect(resultVi).toBeTruthy();
    expect(typeof resultVi).toBe('string');
    expect(resultVi).toMatch(/năm|tháng/);

    const resultEn = durationBetween('2020-01', undefined, { locale: 'en' });
    expect(resultEn).toBeTruthy();
    expect(resultEn).toMatch(/year|month/);
  });
});
