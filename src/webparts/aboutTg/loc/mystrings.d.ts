declare interface IAboutTgWebPartStrings {
  PropertyPaneDescription: string;
  LinksGroupName: string;
  ContactGroupName: string;
  HomeUrlFieldLabel: string;
  NewsEventsUrlFieldLabel: string;
  AboutUrlFieldLabel: string;
  Agility101UrlFieldLabel: string;
  JitPackUrlFieldLabel: string;
  ContactEmailFieldLabel: string;
  RenderOwnChromeFieldLabel: string;
}

declare module 'AboutTgWebPartStrings' {
  const strings: IAboutTgWebPartStrings;
  export = strings;
}
