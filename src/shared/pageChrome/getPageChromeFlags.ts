import { SPHttpClient, type SPHttpClientResponse } from '@microsoft/sp-http';
import {
  DEFAULT_PAGE_CHROME_FLAGS,
  type IPageChromeFlags
} from './IPageChromeFlags';
import { PAGE_CHROME_FIELDS } from './pageChromeFields';

export interface IPageChromeItemFields {
  ShowHeader?: boolean | string | number;
  ShowFooter?: boolean | string | number;
}

export interface IGetPageChromeFlagsOptions {
  listId?: string | { toString(): string };
  listItemId?: number;
  pageServerRelativeUrl?: string;
  webServerRelativeUrl?: string;
}

const HOST_PAGE_MARKERS: string[] = ['/_layouts/', '/workbench.aspx'];

export function toRestGuid(id: string | { toString(): string } | undefined): string | undefined {
  if (!id) {
    return undefined;
  }
  const raw = typeof id === 'string' ? id : id.toString();
  const trimmed = raw.replace(/[{}]/g, '');
  return trimmed || undefined;
}

export function getRawPageServerRelativeUrl(pageContext: {
  legacyPageContext?: { serverRequestPath?: string };
}): string | undefined {
  const legacy = pageContext.legacyPageContext;
  if (legacy && typeof legacy.serverRequestPath === 'string' && legacy.serverRequestPath) {
    return legacy.serverRequestPath;
  }
  if (typeof window !== 'undefined' && window.location) {
    return window.location.pathname;
  }
  return undefined;
}

export function sanitizePageServerRelativeUrl(
  webServerRelativeUrl: string | undefined,
  raw: string | undefined
): string | undefined {
  if (!raw) {
    return undefined;
  }

  let path: string;
  try {
    path = decodeURIComponent(raw);
  } catch {
    path = raw;
  }

  const hashIdx = path.indexOf('#');
  if (hashIdx >= 0) {
    path = path.substring(0, hashIdx);
  }
  const queryIdx = path.indexOf('?');
  if (queryIdx >= 0) {
    path = path.substring(0, queryIdx);
  }

  path = path.replace(/\\/g, '/');
  if (path.indexOf('..') >= 0) {
    return undefined;
  }

  const lower = path.toLowerCase();
  for (let i = 0; i < HOST_PAGE_MARKERS.length; i++) {
    if (lower.indexOf(HOST_PAGE_MARKERS[i]) >= 0) {
      return undefined;
    }
  }

  const webRoot = normalizeWebRoot(webServerRelativeUrl || '/');
  if (webRoot) {
    const webLower = webRoot.toLowerCase();
    if (lower !== webLower && lower.indexOf(webLower + '/') !== 0) {
      return undefined;
    }
    if (lower === webLower || lower === webLower + '/') {
      return undefined;
    }
  }

  return path;
}

function normalizeWebRoot(web: string): string {
  if (!web || web === '/') {
    return '';
  }
  return web.replace(/\/$/, '');
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

/** Yes/No, boolean, 1/0, "Yes"/"No" — explicit No hides; empty stays shown. */
export function parseYesNo(value: unknown): boolean | undefined {
  if (value === true || value === 1) {
    return true;
  }
  if (value === false || value === 0) {
    return false;
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === 'yes' || normalized === 'true' || normalized === '1') {
      return true;
    }
    if (normalized === 'no' || normalized === 'false' || normalized === '0') {
      return false;
    }
  }
  return undefined;
}

function flagFromField(value: unknown): boolean {
  return parseYesNo(value) !== false;
}

function toFlags(item: IPageChromeItemFields): IPageChromeFlags {
  return {
    showHeader: flagFromField(item.ShowHeader),
    showFooter: flagFromField(item.ShowFooter)
  };
}

async function tryGetItem(
  spHttpClient: SPHttpClient,
  endpoint: string
): Promise<IPageChromeItemFields | undefined> {
  const response: SPHttpClientResponse = await spHttpClient.get(
    endpoint,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: 'application/json;odata=nometadata'
      }
    }
  );

  if (!response.ok) {
    console.warn('getPageChromeFlags: list item read failed', response.status);
    return undefined;
  }

  return (await response.json()) as IPageChromeItemFields;
}

export async function getPageChromeFlags(
  spHttpClient: SPHttpClient,
  webAbsoluteUrl: string,
  options?: IGetPageChromeFlagsOptions
): Promise<IPageChromeFlags> {
  const opts = options || {};
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const select = `${PAGE_CHROME_FIELDS.showHeader},${PAGE_CHROME_FIELDS.showFooter}`;

  try {
    const pagePath = sanitizePageServerRelativeUrl(
      opts.webServerRelativeUrl,
      opts.pageServerRelativeUrl
    );

    if (pagePath) {
      const fileEndpoint =
        `${web}/_api/web/GetFileByServerRelativePath(decodedurl='${escapeODataString(pagePath)}')` +
        `/ListItemAllFields?$select=${select}`;
      const fromFile = await tryGetItem(spHttpClient, fileEndpoint);
      if (fromFile) {
        return toFlags(fromFile);
      }
    }

    const guid = toRestGuid(opts.listId);
    if (guid && opts.listItemId) {
      const itemEndpoint =
        `${web}/_api/web/lists(guid'${guid}')/items(${opts.listItemId})?$select=${select}`;
      const fromItem = await tryGetItem(spHttpClient, itemEndpoint);
      if (fromItem) {
        return toFlags(fromItem);
      }
    }
  } catch (error) {
    console.warn('getPageChromeFlags: request error', error);
  }

  return DEFAULT_PAGE_CHROME_FLAGS;
}
