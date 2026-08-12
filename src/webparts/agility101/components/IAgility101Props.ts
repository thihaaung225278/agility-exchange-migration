import type { SPHttpClient } from '@microsoft/sp-http';

export interface IAgility101Props {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  contactEmail: string;
  renderOwnChrome: boolean;
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  webServerRelativeUrl: string;
  pageServerRelativeUrl?: string;
  listId?: string;
  listItemId?: number;
}
