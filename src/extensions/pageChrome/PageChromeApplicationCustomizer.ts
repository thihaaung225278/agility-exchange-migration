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
import {
  getRequiredWebViewRedirectHref,
  rewriteInWebHref,
  withWebViewEnv
} from '../../shared/chrome/webViewEnv';
import chromeStyles from '../../shared/chrome/Chrome.module.scss';
import { getPageChromeFlags, getRawPageServerRelativeUrl } from '../../shared/pageChrome';
import {
  RegisterPromptHost,
  DEFAULT_BEST_DESCRIBE_LIST_TITLE,
  DEFAULT_BUSU_LIST_TITLE,
  DEFAULT_MARKETS_LIST_TITLE,
  DEFAULT_USER_LIST_TITLE
} from '../../shared/register';

export interface IPageChromeApplicationCustomizerProperties {
  homeUrl?: string;
  newsEventsUrl?: string;
  aboutUrl?: string;
  agility101Url?: string;
  jitPackUrl?: string;
  contactEmail?: string;
  enableRegisterPrompt?: boolean;
  allowEmailQueryOverride?: boolean;
  userListTitle?: string;
  busuListTitle?: string;
  marketsListTitle?: string;
  bestDescribeListTitle?: string;
}

export default class PageChromeApplicationCustomizer
  extends BaseApplicationCustomizer<IPageChromeApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;
  private _bottomPlaceholder: PlaceholderContent | undefined;
  private _registerRoot: HTMLElement | undefined;
  private _webAbsoluteUrl: string = '';
  private _linkCaptureBound: boolean = false;

  public onInit(): Promise<void> {
    this._webAbsoluteUrl = this.context.pageContext.web.absoluteUrl;
    this._ensureWebViewEnv();
    this._bindLinkCapture();
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceholders);
    this.context.application.navigatedEvent.add(this, this._onNavigated);
    return this._renderPlaceholders();
  }

  protected onDispose(): void {
    this._unbindLinkCapture();
    this.context.placeholderProvider.changedEvent.remove(this, this._renderPlaceholders);
    this.context.application.navigatedEvent.remove(this, this._onNavigated);
    this._unmountTop();
    this._unmountBottom();
    this._unmountRegister();
    super.onDispose();
  }

  private _onNavigated = (): Promise<void> => {
    this._ensureWebViewEnv();
    return this._renderPlaceholders();
  }

  private _ensureWebViewEnv(): void {
    if (typeof window === 'undefined' || !window.location || !this._webAbsoluteUrl) {
      return;
    }
    const next = getRequiredWebViewRedirectHref(window.location.href, this._webAbsoluteUrl);
    if (next) {
      window.location.replace(next);
    }
  }

  private _bindLinkCapture(): void {
    if (this._linkCaptureBound || typeof window === 'undefined') {
      return;
    }
    window.addEventListener('click', this._onAnchorActivate, true);
    window.addEventListener('auxclick', this._onAnchorActivate, true);
    this._linkCaptureBound = true;
  }

  private _unbindLinkCapture(): void {
    if (!this._linkCaptureBound || typeof window === 'undefined') {
      return;
    }
    window.removeEventListener('click', this._onAnchorActivate, true);
    window.removeEventListener('auxclick', this._onAnchorActivate, true);
    this._linkCaptureBound = false;
  }

  private _onAnchorActivate = (event: MouseEvent): void => {
    if (event.defaultPrevented) {
      return;
    }
    const anchor = closestAnchor(event.target || undefined);
    if (!anchor) {
      return;
    }
    if (anchor.getAttribute('download') !== null) {
      return;
    }
    const raw = anchor.getAttribute('href');
    if (!raw) {
      return;
    }
    const next = rewriteInWebHref(raw, this._webAbsoluteUrl);
    if (next) {
      anchor.setAttribute('href', next);
    }
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

    this._renderRegister();
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
          homeUrl: withWebViewEnv(resolveHomeUrl(properties.homeUrl)),
          newsEventsUrl: withWebViewEnv(properties.newsEventsUrl || 'news-events.aspx'),
          aboutUrl: withWebViewEnv(properties.aboutUrl || 'about-tg.aspx'),
          agility101Url: withWebViewEnv(properties.agility101Url || 'agility-101.aspx'),
          jitPackUrl: withWebViewEnv(properties.jitPackUrl || 'JIT-pack.aspx'),
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

  private _ensureRegisterRoot(): void {
    if (this._registerRoot || typeof document === 'undefined') {
      return;
    }
    const root = document.createElement('div');
    root.id = 'ae-register-prompt-root';
    document.body.appendChild(root);
    this._registerRoot = root;
  }

  private _renderRegister(): void {
    const enabled = this.properties.enableRegisterPrompt !== false;
    if (!enabled) {
      this._unmountRegister();
      return;
    }

    this._ensureRegisterRoot();
    if (!this._registerRoot) {
      return;
    }

    const user = this.context.pageContext.user;
    const pageServerRelativeUrl = getRawPageServerRelativeUrl(this.context.pageContext) || '';
    const search = typeof window !== 'undefined' && window.location ? window.location.search : '';

    const element: React.ReactElement = React.createElement(RegisterPromptHost, {
      enabled: true,
      spHttpClient: this.context.spHttpClient,
      webAbsoluteUrl: this.context.pageContext.web.absoluteUrl,
      userEmail: user ? user.email : undefined,
      userDisplayName: user ? user.displayName : undefined,
      allowEmailQueryOverride: this.properties.allowEmailQueryOverride !== false,
      userListTitle: this.properties.userListTitle || DEFAULT_USER_LIST_TITLE,
      busuListTitle: this.properties.busuListTitle || DEFAULT_BUSU_LIST_TITLE,
      marketsListTitle: this.properties.marketsListTitle || DEFAULT_MARKETS_LIST_TITLE,
      bestDescribeListTitle: this.properties.bestDescribeListTitle || DEFAULT_BEST_DESCRIBE_LIST_TITLE,
      pageKey: pageServerRelativeUrl + search
    });

    ReactDom.render(element, this._registerRoot);
  }

  private _unmountRegister = (): void => {
    if (this._registerRoot) {
      ReactDom.unmountComponentAtNode(this._registerRoot);
      if (this._registerRoot.parentNode) {
        this._registerRoot.parentNode.removeChild(this._registerRoot);
      }
      this._registerRoot = undefined;
    }
  }
}

function closestAnchor(target: EventTarget | undefined): HTMLAnchorElement | undefined {
  if (!target) {
    return undefined;
  }
  let node: Node | null = target as Node;
  while (node && node.nodeType !== 1) {
    node = node.parentNode;
  }
  const el = node as Element | null;
  if (!el || typeof el.closest !== 'function') {
    return undefined;
  }
  const a = el.closest('a');
  return a instanceof HTMLAnchorElement ? a : undefined;
}
