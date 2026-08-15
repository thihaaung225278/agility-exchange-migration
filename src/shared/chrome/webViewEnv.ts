export const WEB_VIEW_QUERY_PARAM = 'env';
export const WEB_VIEW_QUERY_VALUE = 'WebView';
export const NO_REDIRECT_QUERY_PARAM = 'noredirect';

const SKIP_SCHEME = /^(mailto:|tel:|javascript:|data:)/i;
const SYSTEM_PATH = /\/_layouts\/|\/_api\/|\/_vti_|\/_catalogs\//i;
const NO_REDIRECT_FALSE = /^(false|0|no)$/i;

function isRewritableHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed || trimmed === '#' || trimmed.charAt(0) === '#') {
    return false;
  }
  return !SKIP_SCHEME.test(trimmed);
}

function isWorkbenchPath(pathname: string): boolean {
  return pathname.toLowerCase().indexOf('workbench.aspx') >= 0;
}

function isSystemPath(pathname: string): boolean {
  return SYSTEM_PATH.test(pathname) || isWorkbenchPath(pathname);
}

function isEditQuery(params: URLSearchParams): boolean {
  const mode = params.get('Mode') || params.get('mode');
  return !!mode && mode.toLowerCase() === 'edit';
}

/** Presence of noredirect skips WebView inject; false/0/no do not. */
function hasNoRedirect(params: URLSearchParams): boolean {
  if (!params.has(NO_REDIRECT_QUERY_PARAM)) {
    return false;
  }
  const raw = (params.get(NO_REDIRECT_QUERY_PARAM) || '').trim();
  return !NO_REDIRECT_FALSE.test(raw);
}

function isInCurrentWeb(url: URL, webAbsoluteUrl: string): boolean {
  let web: URL;
  try {
    web = new URL(webAbsoluteUrl);
  } catch {
    return false;
  }
  if (url.origin !== web.origin) {
    return false;
  }
  const webPath = web.pathname.replace(/\/+$/, '');
  const path = url.pathname;
  return path === webPath || path.indexOf(webPath + '/') === 0;
}

function resolveUrl(href: string, baseHref: string): URL | undefined {
  try {
    return new URL(href, baseHref);
  } catch {
    return undefined;
  }
}

function currentBaseHref(webAbsoluteUrl?: string): string {
  if (typeof window !== 'undefined' && window.location && window.location.href) {
    return window.location.href;
  }
  return webAbsoluteUrl || 'https://local.invalid/';
}

/**
 * Append `env=WebView` without replacing an existing `env` (e.g. Embedded).
 * Relative hrefs stay relative.
 */
export function withWebViewEnv(href: string): string {
  if (!isRewritableHref(href)) {
    return href;
  }
  const url = resolveUrl(href, currentBaseHref());
  if (!url || isSystemPath(url.pathname) || isEditQuery(url.searchParams) || hasNoRedirect(url.searchParams)) {
    return href;
  }
  if (url.searchParams.get(WEB_VIEW_QUERY_PARAM)) {
    return href;
  }
  url.searchParams.set(WEB_VIEW_QUERY_PARAM, WEB_VIEW_QUERY_VALUE);
  if (/^https?:\/\//i.test(href)) {
    return url.toString();
  }
  const qIndex = href.search(/[?#]/);
  const pathPart = qIndex >= 0 ? href.substring(0, qIndex) : href;
  return pathPart + url.search + url.hash;
}

export function ensureWebViewQuery(params: URLSearchParams): void {
  if (isEditQuery(params) || hasNoRedirect(params)) {
    return;
  }
  if (params.get(WEB_VIEW_QUERY_PARAM)) {
    return;
  }
  params.set(WEB_VIEW_QUERY_PARAM, WEB_VIEW_QUERY_VALUE);
}

/** Absolute href for `location.replace`, or undefined when no navigation is needed. */
export function getRequiredWebViewRedirectHref(
  currentHref: string,
  webAbsoluteUrl: string
): string | undefined {
  const url = resolveUrl(currentHref, currentHref);
  if (!url) {
    return undefined;
  }
  if (isSystemPath(url.pathname) || isEditQuery(url.searchParams) || hasNoRedirect(url.searchParams)) {
    return undefined;
  }
  if (!isInCurrentWeb(url, webAbsoluteUrl)) {
    return undefined;
  }
  if (url.searchParams.get(WEB_VIEW_QUERY_PARAM)) {
    return undefined;
  }
  url.searchParams.set(WEB_VIEW_QUERY_PARAM, WEB_VIEW_QUERY_VALUE);
  return url.toString();
}

/** Rewritten href for an in-web page link, or undefined when the original should be kept. */
export function rewriteInWebHref(href: string, webAbsoluteUrl: string): string | undefined {
  if (!isRewritableHref(href)) {
    return undefined;
  }
  const url = resolveUrl(href, currentBaseHref(webAbsoluteUrl));
  if (!url) {
    return undefined;
  }
  if (
    !isInCurrentWeb(url, webAbsoluteUrl) ||
    isSystemPath(url.pathname) ||
    isEditQuery(url.searchParams) ||
    hasNoRedirect(url.searchParams)
  ) {
    return undefined;
  }
  if (url.searchParams.get(WEB_VIEW_QUERY_PARAM)) {
    return undefined;
  }
  const next = withWebViewEnv(href);
  return next !== href ? next : undefined;
}
