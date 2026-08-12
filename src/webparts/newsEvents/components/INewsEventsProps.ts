import { SPHttpClient } from '@microsoft/sp-http';

export interface INewsEventsProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  newsDetailUrl: string;
  yammerUrl: string;
  newsListTitle: string;
  eventsListTitle: string;
  contactEmail: string;
  renderOwnChrome: boolean;
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  webServerRelativeUrl: string;
  pageServerRelativeUrl?: string;
  listId?: string;
  listItemId?: number;
}
