import type { SPHttpClient } from '@microsoft/sp-http';

export interface IJitPackProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  contactEmail: string;
  renderOwnChrome: boolean;
  jitPacksListTitle: string;
  jitPacksCategoryListTitle: string;
  toolsListTitle: string;
  toolsCategoryListTitle: string;
  mtjAgileListTitle: string;
  mtjAgileCategoryListTitle: string;
  /** Classic workingDir for relative list Url images (default `/Shared%20Documents/main/`). */
  jitAssetBasePath: string;
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  webServerRelativeUrl: string;
  pageServerRelativeUrl?: string;
  listId?: string;
  listItemId?: number;
}
