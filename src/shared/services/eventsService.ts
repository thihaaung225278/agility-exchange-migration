import { SPHttpClient } from '@microsoft/sp-http';
import { compareYmd, datesBetweenInclusive, isSafeJoinUrl, uniqueSortedYmds, ymdFromIso } from './dateUtils';
import { escapeODataString, getSpJson } from './spRest';

export interface IEventItem {
  id: number;
  title: string;
  classId?: string;
  courseId?: string;
  joinLink?: string;
  startDate: string;
  endDate: string;
}

interface IEventListItem {
  Id?: number;
  ID?: number;
  Title?: string;
  ClassID?: string;
  CourseID?: string;
  JoinLink?: string;
  StartDate?: string;
  EndDate?: string;
}

interface IEventListResponse {
  value?: IEventListItem[];
}

function itemId(item: IEventListItem): number {
  if (typeof item.Id === 'number') {
    return item.Id;
  }
  if (typeof item.ID === 'number') {
    return item.ID;
  }
  return 0;
}

function mapEvent(row: IEventListItem): IEventItem | undefined {
  const id = itemId(row);
  if (!id || !row.StartDate || !row.EndDate) {
    return undefined;
  }
  return {
    id,
    title: row.Title || '',
    classId: row.ClassID || undefined,
    courseId: row.CourseID || undefined,
    joinLink: isSafeJoinUrl(row.JoinLink),
    startDate: row.StartDate,
    endDate: row.EndDate
  };
}

export async function getEventDateBounds(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string
): Promise<{ startYmd?: string; endYmd?: string }> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const base = web + "/_api/web/lists/getbytitle('" + title + "')/items";

  // Match month fetch: year range from Published items only (avoids draft/future noise).
  const published = encodeURIComponent("(Status eq 'Published')");
  const [first, last] = await Promise.all([
    getSpJson<IEventListResponse>(
      client,
      base + '?$select=StartDate&$filter=' + published + '&$orderby=StartDate asc&$top=1'
    ),
    getSpJson<IEventListResponse>(
      client,
      base + '?$select=EndDate&$filter=' + published + '&$orderby=EndDate desc&$top=1'
    )
  ]);

  const startIso = first.value && first.value[0] ? first.value[0].StartDate : undefined;
  const endIso = last.value && last.value[0] ? last.value[0].EndDate : undefined;

  return {
    startYmd: startIso ? ymdFromIso(startIso) : undefined,
    endYmd: endIso ? ymdFromIso(endIso) : undefined
  };
}

export async function getPublishedEventsBetween(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  startYmd: string,
  endYmd: string
): Promise<IEventItem[]> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);

  const load = async (overlap: string): Promise<IEventItem[]> => {
    const endpoint =
      web +
      "/_api/web/lists/getbytitle('" + title + "')" +
      '/items?$select=Id,Title,ClassID,CourseID,JoinLink,StartDate,EndDate' +
      '&$filter=' + encodeURIComponent(overlap + " and (Status eq 'Published')") +
      '&$orderby=StartDate asc' +
      '&$top=5000';

    const json = await getSpJson<IEventListResponse>(client, endpoint);
    const rows = json.value || [];
    const items: IEventItem[] = [];
    for (let i = 0; i < rows.length; i++) {
      const mapped = mapEvent(rows[i]);
      if (mapped) {
        items.push(mapped);
      }
    }
    return items;
  };

  const startDt = startYmd + 'T00:00:00';
  const endDt = endYmd + 'T23:59:59';
  const datetimeOverlap =
    '(' +
    "((StartDate le datetime'" + startDt + "') and (EndDate ge datetime'" + startDt + "'))" +
    ' or ' +
    "((StartDate le datetime'" + endDt + "') and (EndDate ge datetime'" + endDt + "'))" +
    ' or ' +
    "((StartDate le datetime'" + startDt + "') and (EndDate ge datetime'" + endDt + "'))" +
    ' or ' +
    "((StartDate ge datetime'" + startDt + "') and (EndDate le datetime'" + endDt + "'))" +
    ')';

  try {
    return await load(datetimeOverlap);
  } catch {
    // Classic CommonLib-style string compare — some list column types reject datetime' literals.
    const start = startYmd + ' 00:00:00';
    const end = endYmd + ' 23:59:59';
    const classicOverlap =
      '(' +
      "((StartDate le '" + start + "') and (EndDate ge '" + start + "'))" +
      ' or ' +
      "((StartDate le '" + end + "') and (EndDate ge '" + end + "'))" +
      ' or ' +
      "((StartDate le '" + start + "') and (EndDate ge '" + end + "'))" +
      ' or ' +
      "((StartDate ge '" + start + "') and (EndDate le '" + end + "'))" +
      ')';
    return load(classicOverlap);
  }
}

export function eventsOnDay(events: IEventItem[], dayYmd: string): IEventItem[] {
  const out: IEventItem[] = [];
  for (let i = 0; i < events.length; i++) {
    const ev = events[i];
    if (compareYmd(dayYmd, ymdFromIso(ev.startDate)) >= 0 && compareYmd(dayYmd, ymdFromIso(ev.endDate)) <= 0) {
      out.push(ev);
    }
  }
  return out;
}

export function eventDaysOfMonth(events: IEventItem[]): string[] {
  const days: string[] = [];
  for (let i = 0; i < events.length; i++) {
    const span = datesBetweenInclusive(events[i].startDate, events[i].endDate);
    for (let j = 0; j < span.length; j++) {
      days.push(span[j]);
    }
  }
  return uniqueSortedYmds(days);
}

export function eventRangeFlags(event: IEventItem, dayYmd: string): { isStart: boolean; isEnd: boolean } {
  return {
    isStart: ymdFromIso(event.startDate) === dayYmd,
    isEnd: ymdFromIso(event.endDate) === dayYmd
  };
}

export function isEventPast(event: IEventItem): boolean {
  return new Date(event.endDate).getTime() < Date.now();
}
