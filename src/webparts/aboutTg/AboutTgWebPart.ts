import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'AboutTgWebPartStrings';
import AboutTg from './components/AboutTg';
import { IAboutTgProps } from './components/IAboutTgProps';
import { getRawPageServerRelativeUrl } from '../../shared/pageChrome';

export interface IAboutTgWebPartProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  contactEmail: string;
  renderOwnChrome: boolean;
}

const ABOUT_FULLWIDTH_CLASS = 'ae-about-fullwidth';

export default class AboutTgWebPart extends BaseClientSideWebPart<IAboutTgWebPartProps> {

  protected onInit(): Promise<void> {
    document.body.classList.add(ABOUT_FULLWIDTH_CLASS);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IAboutTgProps> = React.createElement(AboutTg, {
      homeUrl: this.properties.homeUrl || '#',
      newsEventsUrl: this.properties.newsEventsUrl || 'news-events.aspx',
      aboutUrl: this.properties.aboutUrl || 'about-tg.aspx',
      agility101Url: this.properties.agility101Url || 'agility-101.aspx',
      jitPackUrl: this.properties.jitPackUrl || 'JIT-pack.aspx',
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
    document.body.classList.remove(ABOUT_FULLWIDTH_CLASS);
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
                PropertyPaneTextField('jitPackUrl', { label: strings.JitPackUrlFieldLabel })
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
