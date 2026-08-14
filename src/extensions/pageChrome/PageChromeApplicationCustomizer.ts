import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';

import SiteHeader from '../../shared/chrome/SiteHeader';
import SiteFooter from '../../shared/chrome/SiteFooter';
import { chromeAssets } from '../../shared/chrome/chromeAssets';
import { resolveSiteNavKey } from '../../shared/chrome/resolveSiteNavKey';
import { resolveHomeUrl } from '../../shared/chrome/resolveHomeUrl';
import chromeStyles from '../../shared/chrome/Chrome.module.scss';
import { getPageChromeFlags, getRawPageServerRelativeUrl } from '../../shared/pageChrome';

export interface IPageChromeApplicationCustomizerProperties {
  homeUrl?: string;
  newsEventsUrl?: string;
  aboutUrl?: string;
  agility101Url?: string;
  jitPackUrl?: string;
  contactEmail?: string;
}

export default class PageChromeApplicationCustomizer
  extends BaseApplicationCustomizer<IPageChromeApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;

  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholders);
    this.context.application.navigatedEvent.add(this, this._renderPlaceholders);
    return this._renderPlaceholders();
  }

  protected onDispose(): void {
    this.context.placeholderProvider.changedEvent.remove(this, this._renderPlaceholders);
    this.context.application.navigatedEvent.remove(this, this._renderPlaceholders);
    this._unmountTop();
    this._unmountBottom();
    super.onDispose();
  }

  private _renderPlaceholders = async (): Promise<void> => {
    const list = this.context.pageContext.list;
    const listItem = this.context.pageContext.listItem;
    const flags = await getPageChromeFlags(
      this.context.spHttpClient,
      this.context.pageContext.web.absoluteUrl,
      {
        listId: list ? list.id.toString() : undefined,
        listItemId: listItem ? listItem.id : undefined,
        pageServerRelativeUrl: getRawPageServerRelativeUrl(this.context.pageContext),
        webServerRelativeUrl: this.context.pageContext.web.serverRelativeUrl
      }
    );

    if (flags.showHeader) {
      this._ensureTop();
      this._renderHeader();
    } else {
      this._unmountTop();
    }

    if (flags.showFooter) {
      this._ensureBottom();
      this._renderFooter();
    } else {
      this._unmountBottom();
    }
  }

  private _ensureTop(): void {
    if (this._topPlaceholder) {
      return;
    }
    this._topPlaceholder = this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Top,
      { onDispose: this._unmountTop }
    );
  }

  private _ensureBottom(): void {
    if (this._bottomPlaceholder) {
      return;
    }
    this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(
      PlaceholderName.Bottom,
      { onDispose: this._unmountBottom }
    );
  }

  private _renderHeader(): void {
    if (!this._topPlaceholder || !this._topPlaceholder.domElement) {
      return;
    }

    const properties = this.properties;
    const element: React.ReactElement = React.createElement(
      'div',
      { className: chromeStyles.placeholder },
      React.createElement(
        'div',
        { className: chromeStyles.chromeContainer },
        React.createElement(SiteHeader, {
          homeUrl: resolveHomeUrl(properties.homeUrl),
          newsEventsUrl: properties.newsEventsUrl || 'news-events.aspx',
          aboutUrl: properties.aboutUrl || 'about-tg.aspx',
          agility101Url: properties.agility101Url || 'agility-101.aspx',
          jitPackUrl: properties.jitPackUrl || 'JIT-pack.aspx',
          logoSrc: chromeAssets.logo,
          iconHome: chromeAssets.iconHome,
          iconNews: chromeAssets.iconNews,
          iconAbout: chromeAssets.iconAbout,
          iconFocus: chromeAssets.iconFocus,
          iconDd: chromeAssets.iconDd,
          cardAgileSrc: chromeAssets.cardAgile,
          cardJitSrc: chromeAssets.cardJit,
          activeNav: resolveSiteNavKey(window.location.pathname)
        })
      )
    );

    ReactDom.render(element, this._topPlaceholder.domElement);
  }

  private _renderFooter(): void {
    if (!this._bottomPlaceholder || !this._bottomPlaceholder.domElement) {
      return;
    }

    const element: React.ReactElement = React.createElement(
      'div',
      { className: chromeStyles.placeholder },
      React.createElement(SiteFooter, {
        contactEmail: this.properties.contactEmail || 'agilityexchange@dbs.com',
        mailIconSrc: chromeAssets.iconMail
      })
    );

    ReactDom.render(element, this._bottomPlaceholder.domElement);
  }

  private _unmountTop = (): void => {
    if (this._topPlaceholder && this._topPlaceholder.domElement) {
      ReactDom.unmountComponentAtNode(this._topPlaceholder.domElement);
    }
    this._topPlaceholder = undefined;
  }

  private _unmountBottom = (): void => {
    if (this._bottomPlaceholder && this._bottomPlaceholder.domElement) {
      ReactDom.unmountComponentAtNode(this._bottomPlaceholder.domElement);
    }
    this._bottomPlaceholder = undefined;
  }
}
