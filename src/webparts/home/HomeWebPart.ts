import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'HomeWebPartStrings';
import Home from './components/Home';
import { IHomeProps } from './components/IHomeProps';
import { getRawPageServerRelativeUrl } from '../../shared/pageChrome';
import { resolveHomeUrl } from '../../shared/chrome/resolveHomeUrl';

export interface IHomeWebPartProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  bannerCtaUrl: string;
  quickLinkMtjUrl: string;
  quickLinkPlatformUrl: string;
  contactEmail: string;
  enableRegisterPrompt: boolean;
  allowEmailQueryOverride: boolean;
  renderOwnChrome: boolean;
}

const HOME_FULLWIDTH_CLASS = 'ae-home-fullwidth';

export default class HomeWebPart extends BaseClientSideWebPart<IHomeWebPartProps> {

  protected onInit(): Promise<void> {
    document.body.classList.add(HOME_FULLWIDTH_CLASS);
    return Promise.resolve();
  }

  public render(): void {
    const element: React.ReactElement<IHomeProps> = React.createElement(Home, {
      homeUrl: resolveHomeUrl(this.properties.homeUrl),
      newsEventsUrl: this.properties.newsEventsUrl || 'news-events.aspx',
      aboutUrl: this.properties.aboutUrl || 'about-tg.aspx',
      agility101Url: this.properties.agility101Url || 'agility-101.aspx',
      jitPackUrl: this.properties.jitPackUrl || 'JIT-pack.aspx',
      bannerCtaUrl: this.properties.bannerCtaUrl || 'agility-101.aspx',
      quickLinkMtjUrl: this.properties.quickLinkMtjUrl || '',
      quickLinkPlatformUrl: this.properties.quickLinkPlatformUrl || '',
      contactEmail: this.properties.contactEmail || 'agilityexchange@dbs.com',
      enableRegisterPrompt: !!this.properties.enableRegisterPrompt,
      allowEmailQueryOverride: !!this.properties.allowEmailQueryOverride,
      userEmail: this.context.pageContext.user.email,
      userDisplayName: this.context.pageContext.user.displayName,
      isEditMode: this.displayMode === DisplayMode.Edit,
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
    document.body.classList.remove(HOME_FULLWIDTH_CLASS);
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
                PropertyPaneTextField('bannerCtaUrl', { label: strings.BannerCtaUrlFieldLabel }),
                PropertyPaneTextField('quickLinkMtjUrl', { label: strings.QuickLinkMtjUrlFieldLabel }),
                PropertyPaneTextField('quickLinkPlatformUrl', { label: strings.QuickLinkPlatformUrlFieldLabel })
              ]
            },
            {
              groupName: strings.ContactGroupName,
              groupFields: [
                PropertyPaneTextField('contactEmail', { label: strings.ContactEmailFieldLabel }),
                PropertyPaneToggle('enableRegisterPrompt', {
                  label: strings.EnableRegisterPromptFieldLabel,
                  onText: 'On (fallback if Page Chrome is not loaded)',
                  offText: 'Off'
                }),
                PropertyPaneToggle('allowEmailQueryOverride', {
                  label: strings.AllowEmailQueryOverrideFieldLabel,
                  onText: 'On (UAT ?email=)',
                  offText: 'Off'
                }),
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
