import { SPHttpClient } from '@microsoft/sp-http';

export interface IHomeProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  bannerCtaUrl: string;
  quickLinkMtjUrl: string;
  quickLinkPlatformUrl: string;
  contactEmail: string;
  /** Deferred: classic registerPopupController — not implemented in this slice */
  enableRegisterPrompt: boolean;
  /** When true, Home renders chrome (WebView). Set false when Application Customizer owns chrome. */
  renderOwnChrome: boolean;
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  webServerRelativeUrl: string;
  pageServerRelativeUrl?: string;
  listId?: string;
  listItemId?: number;
}
