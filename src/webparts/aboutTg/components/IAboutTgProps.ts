import { SPHttpClient } from '@microsoft/sp-http';

export interface IAboutTgProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  contactEmail: string;
  /** When true, this web part renders chrome (WebView). Set false when Application Customizer owns chrome. */
  renderOwnChrome: boolean;
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  webServerRelativeUrl: string;
  pageServerRelativeUrl?: string;
  listId?: string;
  listItemId?: number;
}
