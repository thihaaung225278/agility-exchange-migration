declare interface IHomeWebPartStrings {
  PropertyPaneDescription: string;
  LinksGroupName: string;
  ContactGroupName: string;
  HomeUrlFieldLabel: string;
  NewsEventsUrlFieldLabel: string;
  AboutUrlFieldLabel: string;
  Agility101UrlFieldLabel: string;
  JitPackUrlFieldLabel: string;
  BannerCtaUrlFieldLabel: string;
  QuickLinkMtjUrlFieldLabel: string;
  QuickLinkPlatformUrlFieldLabel: string;
  ContactEmailFieldLabel: string;
  EnableRegisterPromptFieldLabel: string;
  AllowEmailQueryOverrideFieldLabel: string;
  RenderOwnChromeFieldLabel: string;
}

declare module 'HomeWebPartStrings' {
  const strings: IHomeWebPartStrings;
  export = strings;
}
