declare interface INewsDetailWebPartStrings {
  PropertyPaneDescription: string;
  LinksGroupName: string;
  ListsGroupName: string;
  ContactGroupName: string;
  HomeUrlFieldLabel: string;
  NewsEventsUrlFieldLabel: string;
  AboutUrlFieldLabel: string;
  Agility101UrlFieldLabel: string;
  JitPackUrlFieldLabel: string;
  NewsListTitleFieldLabel: string;
  ContactEmailFieldLabel: string;
  RenderOwnChromeFieldLabel: string;
}

declare module 'NewsDetailWebPartStrings' {
  const strings: INewsDetailWebPartStrings;
  export = strings;
}
