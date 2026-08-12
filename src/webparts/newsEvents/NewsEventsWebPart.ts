import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewsEventsWebPartStrings';
import NewsEvents from './components/NewsEvents';
import { INewsEventsProps } from './components/INewsEventsProps';
import { getRawPageServerRelativeUrl } from '../../shared/pageChrome';

export interface INewsEventsWebPartProps {
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
}

const NEWS_FULLWIDTH_CLASS = 'ae-news-fullwidth';

const DEFAULT_YAMMER =
  'https://www.yammer.com/dbs.com/#/threads/inGroup?type=in_group&feedId=9349680&view=all';

/** Canonical Events list — remaps blank / legacy "Events" saved in property pane. */
const CANONICAL_EVENTS_LIST = 'Agility Exchange Events';

function resolveEventsListTitle(raw?: string): string {
  const title = (raw || '').trim();
  if (!title || /^events$/i.test(title)) {
    return CANONICAL_EVENTS_LIST;
  }
  return title;
}

export default class NewsEventsWebPart extends BaseClientSideWebPart<INewsEventsWebPartProps> {

  protected onInit(): Promise<void> {
    document.body.classList.add(NEWS_FULLWIDTH_CLASS);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<INewsEventsProps> = React.createElement(NewsEvents, {
      homeUrl: this.properties.homeUrl || '#',
      newsEventsUrl: this.properties.newsEventsUrl || 'news-events.aspx',
      aboutUrl: this.properties.aboutUrl || 'about-tg.aspx',
      agility101Url: this.properties.agility101Url || 'agility-101.aspx',
      jitPackUrl: this.properties.jitPackUrl || 'JIT-pack.aspx',
      newsDetailUrl: this.properties.newsDetailUrl || 'news-detail.aspx',
      yammerUrl: this.properties.yammerUrl || DEFAULT_YAMMER,
      newsListTitle: this.properties.newsListTitle || 'News',
      eventsListTitle: resolveEventsListTitle(this.properties.eventsListTitle),
      contactEmail: this.properties.contactEmail || 'agilityexchange@dbs.com',
      renderOwnChrome: this.properties.renderOwnChrome !== false,
      spHttpClient: this.context.spHttpClient,
      webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
      webServerRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
      pageServerRelativeUrl: getRawPageServerRelativeUrl(this.context.pageContext),
      listId: this.context.pageContext.list ? this.context.pageContext.list.id.toString() : undefined,
      listItemId: this.context.pageContext.listItem ? this.context.pageContext.listItem.id : undefined
    });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    document.body.classList.remove(NEWS_FULLWIDTH_CLASS);
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.LinksGroupName,
              groupFields: [
                PropertyPaneTextField('homeUrl', { label: strings.HomeUrlFieldLabel }),
                PropertyPaneTextField('newsEventsUrl', { label: strings.NewsEventsUrlFieldLabel }),
                PropertyPaneTextField('aboutUrl', { label: strings.AboutUrlFieldLabel }),
                PropertyPaneTextField('agility101Url', { label: strings.Agility101UrlFieldLabel }),
                PropertyPaneTextField('jitPackUrl', { label: strings.JitPackUrlFieldLabel }),
                PropertyPaneTextField('newsDetailUrl', { label: strings.NewsDetailUrlFieldLabel }),
                PropertyPaneTextField('yammerUrl', { label: strings.YammerUrlFieldLabel })
              ]
            },
            {
              groupName: strings.ListsGroupName,
              groupFields: [
                PropertyPaneTextField('newsListTitle', { label: strings.NewsListTitleFieldLabel }),
                PropertyPaneTextField('eventsListTitle', { label: strings.EventsListTitleFieldLabel })
              ]
            },
            {
              groupName: strings.ContactGroupName,
              groupFields: [
                PropertyPaneTextField('contactEmail', { label: strings.ContactEmailFieldLabel }),
                PropertyPaneToggle('renderOwnChrome', {
                  label: strings.RenderOwnChromeFieldLabel,
                  onText: 'On (this web part)',
                  offText: 'Off (Application Customizer)'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
