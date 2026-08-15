import { SPHttpClient } from '@microsoft/sp-http';
import { parseYesNo } from '../pageChrome';
import { escapeODataString, getSpJson } from './spRest';

export interface INewsItem {
  id: number;
  title: string;
  description: string;
  newsDate?: string;
  isFeatured: boolean;
  hasBody: boolean;
  imageUrl?: string;
}

export interface INewsDetailItem extends INewsItem {
  bodyContent: string;
}

interface IAttachmentFile {
  ServerRelativeUrl?: string;
}

interface INewsListItem {
  Id?: number;
  ID?: number;
  Title?: string;
  Description?: string;
  NewsDate?: string;
  isFeatured?: boolean | string | number;
  BodyContent?: string;
  ImageURL?: string;
  Attachments?: boolean;
  AttachmentFiles?: IAttachmentFile[];
}

interface INewsListResponse {
  value?: INewsListItem[];
}

const NEWS_ITEM_SELECT =
  'Id,Title,Description,NewsDate,isFeatured,BodyContent,ImageURL,Attachments,AttachmentFiles';

function itemId(item: INewsListItem): number {
  if (typeof item.Id === 'number') {
    return item.Id;
  }
  if (typeof item.ID === 'number') {
    return item.ID;
  }
  return 0;
}

function firstAttachmentUrl(item: INewsListItem): string | undefined {
  const files = item.AttachmentFiles;
  if (!files || !files.length || !files[0].ServerRelativeUrl) {
    return undefined;
  }
  return files[0].ServerRelativeUrl;
}

function encodeSpaces(url: string): string {
  return url.replace(/ /g, '%20');
}

function webOrigin(webAbsoluteUrl: string): string {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  try {
    return new URL(web).origin;
  } catch {
    return web;
  }
}

/**
 * Site Assets / attachment paths → absolute URL.
 * Allow http(s) and site-relative paths only (img src + CSS url('…')).
 */
function resolveNewsImageUrl(webAbsoluteUrl: string, raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.indexOf("'") >= 0 || trimmed.indexOf('"') >= 0 || trimmed.indexOf(')') >= 0) {
    return undefined;
  }

  const lower = trimmed.toLowerCase();
  const web = webAbsoluteUrl.replace(/\/$/, '');
  if (lower.indexOf('https://') === 0 || lower.indexOf('http://') === 0) {
    return encodeSpaces(trimmed);
  }
  if (trimmed.indexOf(':') >= 0) {
    return undefined;
  }
  if (trimmed.charAt(0) === '/') {
    return encodeSpaces(webOrigin(web) + trimmed);
  }

  const relative = trimmed.replace(/^\.\//, '');
  return encodeSpaces(web + '/' + relative);
}

function newsItemImageUrl(webAbsoluteUrl: string, item: INewsListItem): string | undefined {
  const fromField = resolveNewsImageUrl(webAbsoluteUrl, item.ImageURL);
  if (fromField) {
    return fromField;
  }
  return resolveNewsImageUrl(webAbsoluteUrl, firstAttachmentUrl(item));
}

function mapNewsItem(webAbsoluteUrl: string, row: INewsListItem): INewsItem | undefined {
  const id = itemId(row);
  if (!id) {
    return undefined;
  }
  return {
    id,
    title: row.Title || '',
    description: row.Description || '',
    newsDate: row.NewsDate || undefined,
    isFeatured: parseYesNo(row.isFeatured) === true,
    hasBody: !!(row.BodyContent && String(row.BodyContent).trim()),
    imageUrl: newsItemImageUrl(webAbsoluteUrl, row)
  };
}

export async function getPublishedNews(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string
): Promise<INewsItem[]> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const endpoint =
    web +
    "/_api/web/lists/getbytitle('" + title + "')" +
    '/items?$select=' + NEWS_ITEM_SELECT +
    '&$expand=AttachmentFiles' +
    "&$filter=Status eq 'Published'" +
    '&$orderby=NewsDate desc' +
    '&$top=200';

  const json = await getSpJson<INewsListResponse>(client, endpoint);
  const rows = json.value || [];
  const items: INewsItem[] = [];

  for (let i = 0; i < rows.length; i++) {
    const mapped = mapNewsItem(webAbsoluteUrl, rows[i]);
    if (mapped) {
      items.push(mapped);
    }
  }

  return items;
}

export async function getPublishedNewsDetail(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  itemIdValue: number
): Promise<INewsDetailItem | undefined> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const endpoint =
    web +
    "/_api/web/lists/getbytitle('" + title + "')" +
    '/items?$select=' + NEWS_ITEM_SELECT +
    '&$expand=AttachmentFiles' +
    "&$filter=Status eq 'Published' and Id eq " + itemIdValue +
    '&$top=1';

  const json = await getSpJson<INewsListResponse>(client, endpoint);
  const row = (json.value || [])[0];
  if (!row) {
    return undefined;
  }

  const mapped = mapNewsItem(webAbsoluteUrl, row);
  if (!mapped) {
    return undefined;
  }

  return {
    id: mapped.id,
    title: mapped.title,
    description: mapped.description,
    newsDate: mapped.newsDate,
    isFeatured: mapped.isFeatured,
    hasBody: mapped.hasBody,
    imageUrl: mapped.imageUrl,
    bodyContent: row.BodyContent || ''
  };
}

export function pickFeaturedNews(items: INewsItem[]): INewsItem | undefined {
  let latest: INewsItem | undefined;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.isFeatured) {
      continue;
    }
    if (!latest) {
      latest = item;
      continue;
    }
    const a = item.newsDate ? new Date(item.newsDate).getTime() : 0;
    const b = latest.newsDate ? new Date(latest.newsDate).getTime() : 0;
    if (a > b) {
      latest = item;
    }
  }
  return latest;
}
