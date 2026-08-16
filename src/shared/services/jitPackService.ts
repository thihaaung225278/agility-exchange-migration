import { SPHttpClient } from '@microsoft/sp-http';
import { escapeODataString, getSpJson } from './spRest';

export interface IJitCategory {
  id: number;
  title: string;
}

export interface IJitCardItem {
  id: number;
  title: string;
  categoryId: number;
  /** Cover illustration (JIT `CoverImageUrl`, Tools/MtJ `Url`) resolved to absolute when possible. */
  imageUrl?: string;
  /** Download or open target (attachment preferred, else ExternalUrl). */
  href?: string;
  /** When href comes from an attachment — use download attribute. */
  isDownload: boolean;
  /** Open in new tab when ExternalUrl (not attachment). */
  openInNewTab: boolean;
  /** Classic long card when a cover image URL is present. */
  isLong: boolean;
}

export interface IJitAccordionSection {
  category: IJitCategory;
  cards: IJitCardItem[];
}

export interface IJitPackListTitles {
  jitPacks: string;
  jitPacksCategory: string;
  tools: string;
  toolsCategory: string;
  mtjAgile: string;
  mtjAgileCategory: string;
}

export const DEFAULT_JIT_LIST_TITLES: IJitPackListTitles = {
  jitPacks: 'JIT Training Packs',
  jitPacksCategory: 'JIT Training Packs Category',
  tools: 'Tools',
  toolsCategory: 'Tools Category',
  mtjAgile: 'Mtj Agile',
  mtjAgileCategory: 'MtJ Agile Category'
};

/**
 * Classic `config.workingDir` — relative Tools/MtJ `Url` values join this folder
 * (classic image = `config.homeURL + data.Url`). JIT Packs use tenant-relative
 * `CoverImageUrl` (`/sites/…/SiteAssets/…`) and do not need this base.
 */
export const DEFAULT_JIT_ASSET_BASE_PATH = '/Shared%20Documents/main/';

/** Modern JIT Training Packs cover field (classic list used `Url`). */
export const JIT_PACKS_IMAGE_FIELD = 'CoverImageUrl';

/** Classic Tools / MtJ cover field. */
export const JIT_CLASSIC_IMAGE_FIELD = 'Url';

interface IAttachmentFile {
  ServerRelativeUrl?: string;
}

interface ISpHyperlink {
  Url?: string;
  Description?: string;
}

interface ISpListItem {
  Id?: number;
  ID?: number;
  Title?: string;
  /** Classic Tools/MtJ cover path (text or Hyperlink). */
  Url?: string | ISpHyperlink;
  /** Modern JIT Training Packs cover path (text or Hyperlink). */
  CoverImageUrl?: string | ISpHyperlink;
  ExternalUrl?: string;
  CategoryId?: number;
  OrderNo?: number;
  Order_NO?: number;
  Attachments?: boolean;
  AttachmentFiles?: IAttachmentFile[];
}

interface ISpListResponse {
  value?: ISpListItem[];
}

function itemId(item: ISpListItem): number {
  if (typeof item.Id === 'number') {
    return item.Id;
  }
  if (typeof item.ID === 'number') {
    return item.ID;
  }
  return 0;
}

function firstAttachmentUrl(item: ISpListItem): string | undefined {
  const files = item.AttachmentFiles;
  if (!files || !files.length || !files[0].ServerRelativeUrl) {
    return undefined;
  }
  return files[0].ServerRelativeUrl;
}

/** Normalize list cover field (plain text or Hyperlink { Url }). */
function coerceUrlField(raw: string | ISpHyperlink | undefined): string | undefined {
  if (raw === null || raw === undefined) {
    return undefined;
  }
  if (typeof raw === 'string') {
    return raw;
  }
  if (typeof raw === 'object' && typeof raw.Url === 'string') {
    return raw.Url;
  }
  return undefined;
}

function normalizeAssetBasePath(assetBasePath?: string): string {
  const raw = (assetBasePath || DEFAULT_JIT_ASSET_BASE_PATH).trim();
  if (!raw) {
    return DEFAULT_JIT_ASSET_BASE_PATH;
  }
  let path = raw.replace(/\\/g, '/');
  if (path.charAt(0) !== '/') {
    path = '/' + path;
  }
  if (path.charAt(path.length - 1) !== '/') {
    path = path + '/';
  }
  return path;
}

/** Encode spaces only — preserve existing %XX and slashes (classic homeURL concat). */
function encodeSpaces(url: string): string {
  return url.replace(/ /g, '%20');
}

function isSiteAssetsPath(path: string): boolean {
  const lower = path.toLowerCase().replace(/\\/g, '/');
  // Only web-library Site Assets roots — not `/sites/…/SiteAssets/…`
  return (
    lower === 'siteassets' ||
    lower === '/siteassets' ||
    lower.indexOf('siteassets/') === 0 ||
    lower.indexOf('/siteassets/') === 0
  );
}

/** `/sites/…` (or `sites/…`) is tenant server-relative — join origin only. */
function isTenantServerRelative(path: string): boolean {
  const lower = path.toLowerCase().replace(/\\/g, '/');
  return lower.indexOf('/sites/') === 0 || lower.indexOf('sites/') === 0;
}

/**
 * Resolve list/attachment paths to absolute URLs.
 * - Absolute http(s) → unchanged
 * - Tenant server-relative (`/sites/…`, `sites/…`) → origin + path
 * - Web-relative Site Assets (`/SiteAssets/…`, `SiteAssets/…`) → web + path
 *   (do not use origin alone — that drops `/sites/<web>`)
 * - Relative (`public/images/…`) → web + assetBase (classic homeURL + Url)
 * - Other server-relative (`/Lists/…` attachments) → origin + path
 */
function resolveAssetUrl(
  webAbsoluteUrl: string,
  raw: string | undefined,
  options?: { useAssetBase?: boolean; assetBasePath?: string }
): string | undefined {
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

  let origin = web;
  try {
    origin = new URL(web).origin;
  } catch {
    /* keep web */
  }

  const normalized = trimmed.replace(/\\/g, '/');

  if (isTenantServerRelative(normalized)) {
    if (normalized.charAt(0) === '/') {
      return encodeSpaces(origin + normalized);
    }
    return encodeSpaces(origin + '/' + normalized);
  }

  // `/SiteAssets/…` must stay under the current web, not tenant root.
  if (isSiteAssetsPath(normalized)) {
    if (normalized.charAt(0) === '/') {
      return encodeSpaces(web + normalized);
    }
    return encodeSpaces(web + '/' + normalized);
  }

  if (normalized.charAt(0) === '/') {
    return encodeSpaces(origin + normalized);
  }

  const relative = normalized.replace(/^\.\//, '');
  if (options && options.useAssetBase) {
    const base = normalizeAssetBasePath(options.assetBasePath);
    return encodeSpaces(web + base + relative);
  }

  return encodeSpaces(web + '/' + relative);
}

function mapCard(
  webAbsoluteUrl: string,
  row: ISpListItem,
  assetBasePath?: string
): IJitCardItem | undefined {
  const id = itemId(row);
  if (!id) {
    return undefined;
  }

  const categoryId = typeof row.CategoryId === 'number' ? row.CategoryId : 0;
  const urlField = coerceUrlField(row.CoverImageUrl) || coerceUrlField(row.Url);
  const imageUrl = resolveAssetUrl(webAbsoluteUrl, urlField, {
    useAssetBase: true,
    assetBasePath
  });
  const attachment = firstAttachmentUrl(row);
  const attachmentAbs = resolveAssetUrl(webAbsoluteUrl, attachment);
  const external = (row.ExternalUrl || '').trim();

  let href: string | undefined;
  let isDownload = false;
  let openInNewTab = false;

  if (attachmentAbs) {
    href = attachmentAbs;
    isDownload = true;
  } else if (external) {
    href = external;
    openInNewTab = true;
  }

  return {
    id,
    title: row.Title || '',
    categoryId,
    imageUrl,
    href,
    isDownload,
    openInNewTab,
    isLong: !!imageUrl
  };
}

async function getCategories(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  orderField: string
): Promise<IJitCategory[]> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const endpoint =
    web +
    "/_api/web/lists/getbytitle('" +
    title +
    "')" +
    '/items?$select=Id,Title,' +
    encodeURIComponent(orderField) +
    '&$orderby=' +
    encodeURIComponent(orderField + ' asc') +
    '&$top=500';

  const json = await getSpJson<ISpListResponse>(client, endpoint);
  const rows = json.value || [];
  const categories: IJitCategory[] = [];
  for (let i = 0; i < rows.length; i++) {
    const id = itemId(rows[i]);
    if (!id) {
      continue;
    }
    categories.push({
      id,
      title: rows[i].Title || ''
    });
  }
  return categories;
}

/** Encode each OData $select name; keep commas as field separators. */
function odataSelect(fields: string[]): string {
  const encoded: string[] = [];
  for (let i = 0; i < fields.length; i++) {
    const name = fields[i].trim();
    if (!name) {
      continue;
    }
    encoded.push(encodeURIComponent(name));
  }
  return encoded.join(',');
}

function isSpBadRequest(error: unknown): boolean {
  return error instanceof Error && error.message.indexOf('(400)') >= 0;
}

function splitImageFields(imageFieldInternalName: string): string[] {
  const parts = imageFieldInternalName.split(',');
  const fields: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const name = parts[i].trim();
    if (name) {
      fields.push(name);
    }
  }
  return fields;
}

/** Primary image $select, then classic `Url`, then no cover field. */
function imageFieldAttempts(imageFieldInternalName: string): string[][] {
  const primary = splitImageFields(imageFieldInternalName);
  const attempts: string[][] = [primary];
  const primaryIsUrlOnly =
    primary.length === 1 && primary[0] === JIT_CLASSIC_IMAGE_FIELD;
  if (primary.length > 0 && !primaryIsUrlOnly) {
    attempts.push([JIT_CLASSIC_IMAGE_FIELD]);
  }
  if (primary.length > 0) {
    attempts.push([]);
  }
  return attempts;
}

function cardsItemsEndpoint(web: string, listTitle: string, imageFields: string[]): string {
  const selectFields = ['Id', 'Title']
    .concat(imageFields)
    .concat(['ExternalUrl', 'CategoryId', 'OrderNo', 'Attachments', 'AttachmentFiles']);
  return (
    web +
    "/_api/web/lists/getbytitle('" +
    listTitle +
    "')" +
    '/items?$select=' +
    odataSelect(selectFields) +
    '&$expand=AttachmentFiles' +
    '&$orderby=OrderNo asc' +
    '&$top=5000'
  );
}

function mapCardRows(
  webAbsoluteUrl: string,
  rows: ISpListItem[],
  assetBasePath?: string
): IJitCardItem[] {
  const cards: IJitCardItem[] = [];
  for (let i = 0; i < rows.length; i++) {
    const card = mapCard(webAbsoluteUrl, rows[i], assetBasePath);
    if (card) {
      cards.push(card);
    }
  }
  return cards;
}

async function getCards(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string,
  assetBasePath?: string,
  imageFieldInternalName: string = JIT_CLASSIC_IMAGE_FIELD
): Promise<IJitCardItem[]> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const attempts = imageFieldAttempts(imageFieldInternalName);

  let lastError: unknown;
  for (let i = 0; i < attempts.length; i++) {
    try {
      const json = await getSpJson<ISpListResponse>(
        client,
        cardsItemsEndpoint(web, title, attempts[i])
      );
      return mapCardRows(webAbsoluteUrl, json.value || [], assetBasePath);
    } catch (error) {
      lastError = error;
      const hasMore = i < attempts.length - 1;
      if (!isSpBadRequest(error) || !hasMore) {
        throw error;
      }
    }
  }

  throw lastError;
}

function groupByCategory(categories: IJitCategory[], cards: IJitCardItem[]): IJitAccordionSection[] {
  return categories.map((category) => ({
    category,
    cards: cards.filter((card) => card.categoryId === category.id)
  }));
}

export async function loadJitPackSections(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  lists: IJitPackListTitles,
  assetBasePath?: string
): Promise<IJitAccordionSection[]> {
  const [categories, cards] = await Promise.all([
    getCategories(client, webAbsoluteUrl, lists.jitPacksCategory, 'Order_NO'),
    getCards(client, webAbsoluteUrl, lists.jitPacks, assetBasePath, JIT_PACKS_IMAGE_FIELD)
  ]);
  return groupByCategory(categories, cards);
}

export async function loadToolsSections(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  lists: IJitPackListTitles,
  assetBasePath?: string
): Promise<IJitAccordionSection[]> {
  const [categories, cards] = await Promise.all([
    getCategories(client, webAbsoluteUrl, lists.toolsCategory, 'OrderNo'),
    getCards(client, webAbsoluteUrl, lists.tools, assetBasePath)
  ]);
  return groupByCategory(categories, cards);
}

export async function loadMtjAgileSections(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  lists: IJitPackListTitles,
  assetBasePath?: string
): Promise<IJitAccordionSection[]> {
  const [categories, cards] = await Promise.all([
    getCategories(client, webAbsoluteUrl, lists.mtjAgileCategory, 'OrderNo'),
    getCards(client, webAbsoluteUrl, lists.mtjAgile, assetBasePath)
  ]);
  return groupByCategory(categories, cards);
}
