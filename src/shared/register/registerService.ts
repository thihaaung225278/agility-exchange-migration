import { SPHttpClient } from '@microsoft/sp-http';
import { withWebViewEnv } from '../chrome/webViewEnv';
import { escapeODataString, getSpJson, postSpJson } from '../services/spRest';

export interface IUserProfile {
  id: number;
  email: string;
  title: string;
  marketId?: number;
  busuId?: number;
  bestDescribeId?: number;
}

export interface ILookupOption {
  id: number;
  title: string;
  redirectUrl?: string;
}

interface IListResponse<T> {
  value?: T[];
}

interface IUserListItem {
  Id?: number;
  ID?: number;
  Title?: string;
  Email?: string;
  MarketId?: number | { Id?: number };
  BUSUId?: number | { Id?: number };
  bestDescribeId?: number | { Id?: number };
}

interface ILookupListItem {
  Id?: number;
  ID?: number;
  Title?: string;
  RedirectUrl?: string;
}

export function isProfileComplete(user: IUserProfile | undefined): boolean {
  if (!user) {
    return false;
  }
  return !!(user.marketId && user.busuId && user.bestDescribeId);
}

export async function getUserByEmail(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  email: string
): Promise<IUserProfile | undefined> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const emailFilter = escapeODataString(email);
  const endpoint =
    web +
    "/_api/web/lists/getbytitle('" +
    title +
    "')" +
    '/items?$select=Id,Title,Email,MarketId,BUSUId,bestDescribeId' +
    "&$filter=Email eq '" +
    emailFilter +
    "'" +
    '&$top=1';

  const json = await getSpJson<IListResponse<IUserListItem>>(client, endpoint);
  const row = json.value && json.value[0];
  if (!row) {
    return undefined;
  }
  const id = itemId(row);
  if (!id) {
    return undefined;
  }
  return {
    id,
    email: row.Email || email,
    title: row.Title || '',
    marketId: lookupId(row.MarketId),
    busuId: lookupId(row.BUSUId),
    bestDescribeId: lookupId(row.bestDescribeId)
  };
}

export async function getActiveLookups(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  includeRedirectUrl: boolean
): Promise<ILookupOption[]> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const select = includeRedirectUrl ? 'Id,Title,OrderNo,RedirectUrl' : 'Id,Title,OrderNo';
  const base =
    web +
    "/_api/web/lists/getbytitle('" +
    title +
    "')" +
    '/items?$select=' +
    select +
    "&$filter=Status eq 'Active'" +
    '&$top=5000';

  let json: IListResponse<ILookupListItem>;
  try {
    json = await getSpJson<IListResponse<ILookupListItem>>(client, base + '&$orderby=OrderNo asc');
  } catch {
    json = await getSpJson<IListResponse<ILookupListItem>>(client, base);
  }

  const rows = json.value || [];
  const items: ILookupOption[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const id = itemId(row);
    if (!id) {
      continue;
    }
    items.push({
      id,
      title: row.Title || '',
      redirectUrl: includeRedirectUrl ? row.RedirectUrl : undefined
    });
  }
  return items;
}

export async function saveUserProfile(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  identity: { email: string; title: string },
  existing: IUserProfile | undefined,
  values: { marketId: number; busuId: number; bestDescribeId: number }
): Promise<void> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const listUrl = web + "/_api/web/lists/getbytitle('" + title + "')/items";

  if (existing && existing.id) {
    await postSpJson(client, listUrl + '(' + existing.id + ')', JSON.stringify({
      MarketId: values.marketId,
      BUSUId: values.busuId,
      bestDescribeId: values.bestDescribeId
    }), {
      'IF-MATCH': '*',
      'X-HTTP-Method': 'MERGE'
    });
    return;
  }

  await postSpJson(client, listUrl, JSON.stringify({
    Title: identity.title,
    Email: identity.email,
    MarketId: values.marketId,
    BUSUId: values.busuId,
    bestDescribeId: values.bestDescribeId
  }));
}

export function resolveSafeRedirect(
  redirectUrl: string | undefined,
  webAbsoluteUrl: string
): string | undefined {
  if (!redirectUrl) {
    return undefined;
  }
  const trimmed = redirectUrl.trim();
  if (!trimmed) {
    return undefined;
  }

  let url: URL;
  try {
    url = new URL(trimmed, webAbsoluteUrl);
  } catch {
    return undefined;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return undefined;
  }

  let web: URL;
  try {
    web = new URL(webAbsoluteUrl);
  } catch {
    return undefined;
  }

  if (url.origin !== web.origin) {
    return undefined;
  }

  const webPath = web.pathname.replace(/\/+$/, '');
  const path = url.pathname;
  if (path !== webPath && path.indexOf(webPath + '/') !== 0) {
    return undefined;
  }

  return withWebViewEnv(url.toString());
}

function itemId(item: { Id?: number; ID?: number }): number {
  if (typeof item.Id === 'number') {
    return item.Id;
  }
  if (typeof item.ID === 'number') {
    return item.ID;
  }
  return 0;
}

function lookupId(value: number | { Id?: number } | undefined): number | undefined {
  if (typeof value === 'number' && value > 0) {
    return value;
  }
  if (value && typeof value === 'object' && typeof value.Id === 'number' && value.Id > 0) {
    return value.Id;
  }
  return undefined;
}
