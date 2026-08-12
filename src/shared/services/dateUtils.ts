const SG_TZ = 'Asia/Singapore';

export function pad2(n: number): string {
  return n < 10 ? '0' + n : String(n);
}

export function toYmd(date: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: SG_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function parseYmd(ymd: string): Date {
  return new Date(ymd + 'T12:00:00+08:00');
}

export function ymdFromIso(iso: string): string {
  return toYmd(new Date(iso));
}

export function todayYmd(): string {
  return toYmd(new Date());
}

export function compareYmd(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

export function addDaysYmd(ymd: string, days: number): string {
  const d = parseYmd(ymd);
  d.setDate(d.getDate() + days);
  return toYmd(d);
}

export function startOfMonthYmd(ymd: string): string {
  return ymd.substring(0, 8) + '01';
}

export function endOfMonthYmd(ymd: string): string {
  const d = parseYmd(startOfMonthYmd(ymd));
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return toYmd(d);
}

export function yearOf(ymd: string): number {
  return parseInt(ymd.substring(0, 4), 10);
}

export function weekdayMon0(ymd: string): number {
  const js = parseYmd(ymd).getDay();
  return js === 0 ? 6 : js - 1;
}

export function formatNewsDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SG_TZ,
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(new Date(iso));
}

export function formatDayChip(ymd: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SG_TZ,
    day: 'numeric',
    month: 'short'
  }).format(parseYmd(ymd));
}

export function formatMonthShort(ymd: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SG_TZ,
    month: 'short'
  }).format(parseYmd(ymd));
}

export function formatLongDay(ymd: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: SG_TZ,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(parseYmd(ymd));
}

export function formatEventClock(iso: string): { timeNumber: string; meridiem: string } {
  const raw = new Intl.DateTimeFormat('en-US', {
    timeZone: SG_TZ,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }).format(new Date(iso));
  const parts = raw.replace(/\u202f/g, ' ').split(' ');
  return {
    timeNumber: parts[0] || raw,
    meridiem: parts[1] ? parts[1].toUpperCase() : ''
  };
}

export interface ICalCell {
  ymd: string;
  dayNum: number;
  inMonth: boolean;
}

export function buildMonthGrid(ymd: string): ICalCell[] {
  const start = startOfMonthYmd(ymd);
  const first = addDaysYmd(start, -weekdayMon0(start));
  const cells: ICalCell[] = [];
  const monthKey = ymd.substring(0, 7);
  for (let i = 0; i < 42; i++) {
    const cellYmd = addDaysYmd(first, i);
    cells.push({
      ymd: cellYmd,
      dayNum: parseInt(cellYmd.substring(8, 10), 10),
      inMonth: cellYmd.substring(0, 7) === monthKey
    });
  }
  return cells;
}

export function yearsBetween(startYmd: string, endYmd: string): number[] {
  const a = yearOf(startYmd);
  const b = yearOf(endYmd);
  const out: number[] = [];
  for (let y = a; y <= b; y++) {
    out.push(y);
  }
  return out;
}

export function monthsOfYear(year: number): string[] {
  const out: string[] = [];
  for (let m = 1; m <= 12; m++) {
    out.push(year + '-' + pad2(m) + '-01');
  }
  return out;
}

export function uniqueSortedYmds(dates: string[]): string[] {
  const seen: { [key: string]: boolean } = {};
  const out: string[] = [];
  for (let i = 0; i < dates.length; i++) {
    const d = dates[i];
    if (!seen[d]) {
      seen[d] = true;
      out.push(d);
    }
  }
  out.sort();
  return out;
}

export function datesBetweenInclusive(startIso: string, endIso: string): string[] {
  const start = ymdFromIso(startIso);
  const end = ymdFromIso(endIso);
  const out: string[] = [];
  let cur = start;
  while (compareYmd(cur, end) <= 0) {
    out.push(cur);
    cur = addDaysYmd(cur, 1);
    if (out.length > 400) {
      break;
    }
  }
  return out;
}

export function isValidYmd(value: string): boolean {
  if (!value || value.length !== 10 || value.charAt(4) !== '-' || value.charAt(7) !== '-') {
    return false;
  }
  const y = parseInt(value.substring(0, 4), 10);
  const m = parseInt(value.substring(5, 7), 10);
  const d = parseInt(value.substring(8, 10), 10);
  return !isNaN(y) && !isNaN(m) && !isNaN(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31;
}

export function isSafeJoinUrl(raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }
  const t = raw.trim();
  const lower = t.toLowerCase();
  if (lower.indexOf('https://') === 0 || lower.indexOf('http://') === 0) {
    return t;
  }
  if (t.indexOf('/') === 0 && t.indexOf('//') !== 0) {
    return t;
  }
  return undefined;
}

export function newsDetailHref(base: string, id: number): string {
  if (!base || base === '#') {
    return '#';
  }
  return base.indexOf('?') >= 0 ? base + '&id=' + id : base + '?id=' + id;
}

export function readViewParam(): string | undefined {
  if (typeof window === 'undefined' || !window.location || !window.location.search) {
    return undefined;
  }
  const raw = window.location.search.charAt(0) === '?'
    ? window.location.search.substring(1)
    : window.location.search;
  const parts = raw.split('&');
  for (let i = 0; i < parts.length; i++) {
    const kv = parts[i].split('=');
    if (decodeURIComponent(kv[0]) === 'view' && kv[1]) {
      return decodeURIComponent(kv[1]);
    }
  }
  return undefined;
}

export function writeViewParam(ymd: string | undefined, today: string): void {
  if (typeof window === 'undefined' || !window.history || !window.location) {
    return;
  }
  const raw = window.location.search.charAt(0) === '?'
    ? window.location.search.substring(1)
    : window.location.search;
  const parts = raw ? raw.split('&') : [];
  const next: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    if (!parts[i]) {
      continue;
    }
    const kv = parts[i].split('=');
    if (decodeURIComponent(kv[0]) === 'view') {
      continue;
    }
    next.push(parts[i]);
  }
  if (ymd && ymd !== today) {
    next.push('view=' + encodeURIComponent(ymd));
  }
  const search = next.length ? '?' + next.join('&') : '';
  window.history.replaceState(null, '', window.location.pathname + search + window.location.hash);
}

export function indexOfYmd(days: string[], ymd: string): number {
  for (let i = 0; i < days.length; i++) {
    if (days[i] === ymd) {
      return i;
    }
  }
  return -1;
}
