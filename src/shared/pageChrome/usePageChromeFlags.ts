import * as React from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import {
  DEFAULT_PAGE_CHROME_FLAGS,
  type IPageChromeFlags
} from './IPageChromeFlags';
import {
  getPageChromeFlags,
  type IGetPageChromeFlagsOptions
} from './getPageChromeFlags';

export function usePageChromeFlags(
  enabled: boolean,
  spHttpClient: SPHttpClient | undefined,
  webAbsoluteUrl: string,
  options: IGetPageChromeFlagsOptions
): IPageChromeFlags {
  const [flags, setFlags] = React.useState<IPageChromeFlags>(DEFAULT_PAGE_CHROME_FLAGS);
  const listId = options.listId;
  const listItemId = options.listItemId;
  const pageServerRelativeUrl = options.pageServerRelativeUrl;
  const webServerRelativeUrl = options.webServerRelativeUrl;

  React.useEffect(() => {
    if (!enabled || !spHttpClient) {
      return;
    }

    let cancelled = false;

    getPageChromeFlags(spHttpClient, webAbsoluteUrl, {
      listId,
      listItemId,
      pageServerRelativeUrl,
      webServerRelativeUrl
    })
      .then((next: IPageChromeFlags) => {
        if (!cancelled) {
          setFlags(next);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFlags(DEFAULT_PAGE_CHROME_FLAGS);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, spHttpClient, webAbsoluteUrl, listId, listItemId, pageServerRelativeUrl, webServerRelativeUrl]);

  return flags;
}
