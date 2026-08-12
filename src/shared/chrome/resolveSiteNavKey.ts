import type { SiteNavKey } from './SiteHeader';

/**
 * Extract the last path segment (without extension) so matching is
 * precise — e.g. "/sites/ax/SitePages/news-events.aspx" → "news-events".
 */
function lastSegment(pathname: string): string {
  const clean = pathname.replace(/\/+$/, '');
  const seg = clean.substring(clean.lastIndexOf('/') + 1);
  const dot = seg.lastIndexOf('.');
  return dot > 0 ? seg.substring(0, dot).toLowerCase() : seg.toLowerCase();
}

export function resolveSiteNavKey(pathname: string): SiteNavKey {
  const seg = lastSegment(pathname);

  if (seg === 'news-events') {
    return 'news';
  }
  if (seg === 'about-tg') {
    return 'about';
  }
  return 'home';
}
