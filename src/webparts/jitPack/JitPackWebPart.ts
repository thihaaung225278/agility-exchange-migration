import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'JitPackWebPartStrings';
import JitPack from './components/JitPack';
import { IJitPackProps } from './components/IJitPackProps';
import { getRawPageServerRelativeUrl } from '../../shared/pageChrome';
import { resolveHomeUrl } from '../../shared/chrome/resolveHomeUrl';
import { DEFAULT_JIT_ASSET_BASE_PATH, DEFAULT_JIT_LIST_TITLES } from '../../shared/services/jitPackService';

export interface IJitPackWebPartProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  contactEmail: string;
  renderOwnChrome: boolean;
  jitPacksListTitle: string;
  jitPacksCategoryListTitle: string;
  toolsListTitle: string;
  toolsCategoryListTitle: string;
  mtjAgileListTitle: string;
  mtjAgileCategoryListTitle: string;
  /** Classic `config.workingDir` — relative card Url images. */
  jitAssetBasePath: string;
}

const JIT_FULLWIDTH_CLASS = 'ae-jitpack-fullwidth';

const HOST_FULLWIDTH_SELECTOR = [
  '#workbenchPageContent',
  '.CanvasComponent',
  '.CanvasZone',
  '.CanvasZone--default',
  '.CanvasSection',
  '.CanvasSection--default',
  '.CanvasSection-col',
  '.CanvasLayout',
  '.SPCanvas-canvas',
  '#spPageCanvasContent',
  '[data-automation-id="CanvasZone"]',
  '[data-automation-id="CanvasSection"]',
  '[data-automation-id="CanvasSection-SectionContainer"]',
  '[data-automation-id="CanvasZone-SectionContainer"]',
  '.ControlZone',
  '.ControlZone--control',
  '.ControlZone-control'
].join(',');

interface IHostStylePatch {
  el: HTMLElement;
  maxWidth: string;
  width: string;
  marginLeft: string;
  marginRight: string;
  paddingLeft: string;
  paddingRight: string;
}

export default class JitPackWebPart extends BaseClientSideWebPart<IJitPackWebPartProps> {
  private _hostPatches: IHostStylePatch[] = [];

  protected onInit(): Promise<void> {
    document.body.classList.add(JIT_FULLWIDTH_CLASS);
    return Promise.resolve();
  }

  public render(): void {
    const element = React.createElement<IJitPackProps>(JitPack, {
      homeUrl: resolveHomeUrl(this.properties.homeUrl),
      newsEventsUrl: this.properties.newsEventsUrl || 'news-events.aspx',
      aboutUrl: this.properties.aboutUrl || 'about-tg.aspx',
      agility101Url: this.properties.agility101Url || 'agility-101.aspx',
      jitPackUrl: this.properties.jitPackUrl || 'JIT-pack.aspx',
      contactEmail: this.properties.contactEmail || 'agilityexchange@dbs.com',
      renderOwnChrome: this.properties.renderOwnChrome !== false,
      jitPacksListTitle: this.properties.jitPacksListTitle || DEFAULT_JIT_LIST_TITLES.jitPacks,
      jitPacksCategoryListTitle:
        this.properties.jitPacksCategoryListTitle || DEFAULT_JIT_LIST_TITLES.jitPacksCategory,
      toolsListTitle: this.properties.toolsListTitle || DEFAULT_JIT_LIST_TITLES.tools,
      toolsCategoryListTitle:
        this.properties.toolsCategoryListTitle || DEFAULT_JIT_LIST_TITLES.toolsCategory,
      mtjAgileListTitle: this.properties.mtjAgileListTitle || DEFAULT_JIT_LIST_TITLES.mtjAgile,
      mtjAgileCategoryListTitle:
        this.properties.mtjAgileCategoryListTitle || DEFAULT_JIT_LIST_TITLES.mtjAgileCategory,
      jitAssetBasePath: this.properties.jitAssetBasePath || DEFAULT_JIT_ASSET_BASE_PATH,
      spHttpClient: this.context.spHttpClient,
      webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
      webServerRelativeUrl: this.context.pageContext.web.serverRelativeUrl,
      pageServerRelativeUrl: getRawPageServerRelativeUrl(this.context.pageContext),
      listId: this.context.pageContext.list ? this.context.pageContext.list.id.toString() : undefined,
      listItemId: this.context.pageContext.listItem ? this.context.pageContext.listItem.id : undefined
    });

    ReactDom.render(element, this.domElement);
    this._widenHostChain();
  }

  protected onDispose(): void {
    this._restoreHostChain();
    document.body.classList.remove(JIT_FULLWIDTH_CLASS);
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _widenHostChain(): void {
    this._restoreHostChain();

    const seen = new Set<HTMLElement>();

    let node: HTMLElement | null = this.domElement;
    while (node && node !== document.body) {
      if (this._isHostCandidate(node)) {
        this._patchHost(node, seen);
      }
      node = node.parentElement;
    }

    document.querySelectorAll(HOST_FULLWIDTH_SELECTOR).forEach((el: Element) => {
      this._patchHost(el as HTMLElement, seen);
    });
  }

  private _isHostCandidate(el: HTMLElement): boolean {
    const id = el.id || '';
    if (id === 'workbenchPageContent' || id === 'spPageCanvasContent') {
      return true;
    }

    const automationId = el.getAttribute('data-automation-id') || '';
    if (automationId.indexOf('Canvas') === 0) {
      return true;
    }

    const className = typeof el.className === 'string' ? el.className : '';
    return /Canvas|ControlZone|SPCanvas/i.test(className);
  }

  private _patchHost(el: HTMLElement, seen: Set<HTMLElement>): void {
    if (seen.has(el)) {
      return;
    }
    seen.add(el);

    this._hostPatches.push({
      el,
      maxWidth: el.style.maxWidth,
      width: el.style.width,
      marginLeft: el.style.marginLeft,
      marginRight: el.style.marginRight,
      paddingLeft: el.style.paddingLeft,
      paddingRight: el.style.paddingRight
    });

    el.style.setProperty('max-width', '100%', 'important');
    el.style.setProperty('width', '100%', 'important');
    el.style.setProperty('margin-left', '0', 'important');
    el.style.setProperty('margin-right', '0', 'important');
    el.style.setProperty('padding-left', '0', 'important');
    el.style.setProperty('padding-right', '0', 'important');
  }

  private _restoreHostChain(): void {
    this._hostPatches.forEach((patch: IHostStylePatch) => {
      const { el } = patch;
      el.style.removeProperty('max-width');
      el.style.removeProperty('width');
      el.style.removeProperty('margin-left');
      el.style.removeProperty('margin-right');
      el.style.removeProperty('padding-left');
      el.style.removeProperty('padding-right');

      if (patch.maxWidth) {
        el.style.maxWidth = patch.maxWidth;
      }
      if (patch.width) {
        el.style.width = patch.width;
      }
      if (patch.marginLeft) {
        el.style.marginLeft = patch.marginLeft;
      }
      if (patch.marginRight) {
        el.style.marginRight = patch.marginRight;
      }
      if (patch.paddingLeft) {
        el.style.paddingLeft = patch.paddingLeft;
      }
      if (patch.paddingRight) {
        el.style.paddingRight = patch.paddingRight;
      }
    });
    this._hostPatches = [];
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
              groupName: strings.ListsGroupName,
              groupFields: [
                PropertyPaneTextField('jitPacksListTitle', {
                  label: strings.JitPacksListTitleFieldLabel
                }),
                PropertyPaneTextField('jitPacksCategoryListTitle', {
                  label: strings.JitPacksCategoryListTitleFieldLabel
                }),
                PropertyPaneTextField('toolsListTitle', { label: strings.ToolsListTitleFieldLabel }),
                PropertyPaneTextField('toolsCategoryListTitle', {
                  label: strings.ToolsCategoryListTitleFieldLabel
                }),
                PropertyPaneTextField('mtjAgileListTitle', {
                  label: strings.MtjAgileListTitleFieldLabel
                }),
                PropertyPaneTextField('mtjAgileCategoryListTitle', {
                  label: strings.MtjAgileCategoryListTitleFieldLabel
                }),
                PropertyPaneTextField('jitAssetBasePath', {
                  label: strings.JitAssetBasePathFieldLabel,
                  description: 'Classic workingDir for relative Url images (e.g. /Shared%20Documents/main/)'
                })
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
