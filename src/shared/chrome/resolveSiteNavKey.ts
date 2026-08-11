import type { SiteNavKey } from './SiteHeader';

export function resolveSiteNavKey(pathname: string): SiteNavKey {
  const path = pathname.toLowerCase();
  if (path.indexOf('news-events') >= 0) {
    return 'news';
  }
  if (path.indexOf('about-tg') >= 0 || path.indexOf('about') >= 0) {
    return 'about';
  }
  return 'home';
}
