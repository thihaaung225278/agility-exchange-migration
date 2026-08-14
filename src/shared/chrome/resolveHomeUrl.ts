export const DEFAULT_HOME_URL = 'index.aspx';

/**
 * Classic header logo/HOME both use index.aspx.
 * Treat blank and leftover '#' pane values as that home page.
 */
export function resolveHomeUrl(raw?: string): string {
  const value = (raw || '').trim();
  if (!value || value === '#') {
    return DEFAULT_HOME_URL;
  }
  return value;
}
