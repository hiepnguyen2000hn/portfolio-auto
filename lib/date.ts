const EN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const CURRENT_DATE = new Date();

export type Locale = 'vi' | 'en';

export interface DateOptions {
  locale?: Locale;
  inclusive?: boolean;
}

function resolveLocale(options?: Locale | DateOptions): { locale: Locale; inclusive: boolean } {
  if (typeof options === 'string') {
    return { locale: options, inclusive: true };
  }
  return {
    locale: options?.locale ?? 'vi',
    inclusive: options?.inclusive ?? true,
  };
}

export function parseYearMonth(dateStr: string): { year: number; month: number } | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  const match = trimmed.match(/^(\d{4})[-/.](\d{1,2})/);
  if (match && match[1] && match[2]) {
    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    if (!isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {
      return { year, month };
    }
  }

  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 };
  }
  return null;
}

export function isPresentDate(dateStr?: string | null): boolean {
  if (!dateStr) return true;
  const s = dateStr.trim().toLowerCase();
  return (
    s === '' ||
    s === 'present' ||
    s === 'current' ||
    s === 'now' ||
    s === 'hiện tại' ||
    s === 'hien tai' ||
    s === 'hien-tai'
  );
}

export function formatSingleDate(dateStr: string, locale: Locale = 'vi'): string {
  const parts = parseYearMonth(dateStr);
  if (!parts) return dateStr;
  const { year, month } = parts;

  if (locale === 'en') {
    const monthName = EN_MONTHS[month - 1] ?? `M${month}`;
    return `${monthName} ${year}`;
  }

  return `Thg ${month}/${year}`;
}

/**
 * Format a date range into standard presentation strings.
 * Example:
 *  - formatRange("2022-01", "present") -> "Thg 1/2022 – Hiện tại"
 *  - formatRange("2022-01", "2022-01") -> "Thg 1/2022" (same month)
 *  - formatRange("2022-01", "2023-12", "en") -> "Jan 2022 – Dec 2023"
 */
export function formatRange(
  start: string,
  end?: string,
  localeOrOptions?: Locale | DateOptions
): string {
  const { locale } = resolveLocale(localeOrOptions);

  if (!start) return '';

  const startFormatted = formatSingleDate(start, locale);
  const isPresent = isPresentDate(end);

  if (isPresent) {
    const presentLabel = locale === 'en' ? 'Present' : 'Hiện tại';
    return `${startFormatted} – ${presentLabel}`;
  }

  const startParts = parseYearMonth(start);
  const endParts = end ? parseYearMonth(end) : null;

  // Case: Same month & year
  if (
    startParts &&
    endParts &&
    startParts.year === endParts.year &&
    startParts.month === endParts.month
  ) {
    return startFormatted;
  }

  const endFormatted = end ? formatSingleDate(end, locale) : '';
  if (!endFormatted) {
    return startFormatted;
  }

  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Calculate the human-friendly duration between two dates.
 * Example:
 *  - durationBetween("2020-01", "2022-09") -> "2 năm 9 tháng"
 *  - durationBetween("2022-01", "2022-12") -> "1 năm"
 *  - durationBetween("2022-01", "2022-06", "en") -> "6 months"
 */
export function durationBetween(
  start: string,
  end?: string,
  localeOrOptions?: Locale | DateOptions
): string {
  const { locale, inclusive } = resolveLocale(localeOrOptions);

  const startParts = parseYearMonth(start);
  if (!startParts) return '';

  let endParts: { year: number; month: number } | null = null;
  if (isPresentDate(end)) {
    endParts = { year: CURRENT_DATE.getFullYear(), month: CURRENT_DATE.getMonth() + 1 };
  } else if (end) {
    endParts = parseYearMonth(end);
  }

  if (!endParts) return '';

  let totalMonths =
    (endParts.year - startParts.year) * 12 + (endParts.month - startParts.month);

  if (inclusive) {
    totalMonths += 1;
  }

  if (totalMonths <= 0) {
    return locale === 'en' ? '0 months' : '0 tháng';
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  if (locale === 'en') {
    const yearLabel = years === 1 ? 'year' : 'years';
    const monthLabel = months === 1 ? 'month' : 'months';

    if (years > 0 && months > 0) {
      return `${years} ${yearLabel} ${months} ${monthLabel}`;
    }
    if (years > 0) {
      return `${years} ${yearLabel}`;
    }
    return `${months} ${monthLabel}`;
  }

  // Vietnamese locale
  if (years > 0 && months > 0) {
    return `${years} năm ${months} tháng`;
  }
  if (years > 0) {
    return `${years} năm`;
  }
  return `${months} tháng`;
}
