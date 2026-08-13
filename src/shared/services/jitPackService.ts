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
  /** Background illustration path from list Url field (resolved absolute when possible). */
  imageUrl?: string;
  /** Download or open target (attachment preferred, else ExternalUrl). */
  href?: string;
  /** When href comes from an attachment — use download attribute. */
  isDownload: boolean;
  /** Open in new tab when ExternalUrl (not attachment). */
  openInNewTab: boolean;
  /** Classic long card when Url (image) is present. */
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

interface IAttachmentFile {
  ServerRelativeUrl?: string;
}

interface ISpListItem {
  Id?: number;
  ID?: number;
  Title?: string;
  Url?: string;
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

function resolveAssetUrl(webAbsoluteUrl: string, raw?: string): string | undefined {
  if (!raw) {
    return undefined;
  }
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const web = webAbsoluteUrl.replace(/\/$/, '');
  if (trimmed.charAt(0) === '/') {
    // Server-relative — keep origin from webAbsoluteUrl
    try {
      const origin = new URL(web).origin;
      return origin + trimmed;
    } catch {
      return web + trimmed;
    }
  }
  return web + '/' + trimmed.replace(/^\.\//, '');
}

function mapCard(webAbsoluteUrl: string, row: ISpListItem): IJitCardItem | undefined {
  const id = itemId(row);
  if (!id) {
    return undefined;
  }

  const categoryId = typeof row.CategoryId === 'number' ? row.CategoryId : 0;
  const imageUrl = resolveAssetUrl(webAbsoluteUrl, row.Url);
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

async function getCards(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  listTitle: string
): Promise<IJitCardItem[]> {
  const web = webAbsoluteUrl.replace(/\/$/, '');
  const title = escapeODataString(listTitle);
  const endpoint =
    web +
    "/_api/web/lists/getbytitle('" +
    title +
    "')" +
    '/items?$select=Id,Title,Url,ExternalUrl,CategoryId,OrderNo,Attachments,AttachmentFiles' +
    '&$expand=AttachmentFiles' +
    '&$orderby=OrderNo asc' +
    '&$top=5000';

  const json = await getSpJson<ISpListResponse>(client, endpoint);
  const rows = json.value || [];
  const cards: IJitCardItem[] = [];
  for (let i = 0; i < rows.length; i++) {
    const card = mapCard(webAbsoluteUrl, rows[i]);
    if (card) {
      cards.push(card);
    }
  }
  return cards;
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
  lists: IJitPackListTitles
): Promise<IJitAccordionSection[]> {
  const [categories, cards] = await Promise.all([
    getCategories(client, webAbsoluteUrl, lists.jitPacksCategory, 'Order_NO'),
    getCards(client, webAbsoluteUrl, lists.jitPacks)
  ]);
  return groupByCategory(categories, cards);
}

export async function loadToolsSections(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  lists: IJitPackListTitles
): Promise<IJitAccordionSection[]> {
  const [categories, cards] = await Promise.all([
    getCategories(client, webAbsoluteUrl, lists.toolsCategory, 'OrderNo'),
    getCards(client, webAbsoluteUrl, lists.tools)
  ]);
  return groupByCategory(categories, cards);
}

export async function loadMtjAgileSections(
  client: SPHttpClient,
  webAbsoluteUrl: string,
  lists: IJitPackListTitles
): Promise<IJitAccordionSection[]> {
  const [categories, cards] = await Promise.all([
    getCategories(client, webAbsoluteUrl, lists.mtjAgileCategory, 'OrderNo'),
    getCards(client, webAbsoluteUrl, lists.mtjAgile)
  ]);
  return groupByCategory(categories, cards);
}
