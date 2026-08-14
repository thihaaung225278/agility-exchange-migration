import * as React from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './NewsDetail.module.scss';
import { formatNewsDate } from '../../../shared/services/dateUtils';
import { getPublishedNewsDetail, type INewsDetailItem } from '../../../shared/services/newsService';

export interface INewsDetailViewProps {
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  listTitle: string;
  newsEventsUrl: string;
  itemId?: number;
}

type DetailStatus = 'loading' | 'ready' | 'error' | 'notFound';

function sanitizeUrl(raw: string | undefined): string | undefined {
  if (!raw) {
    return undefined;
  }
  const trimmed = raw.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.indexOf('http://') === 0 ||
    lower.indexOf('https://') === 0 ||
    lower.indexOf('mailto:') === 0 ||
    lower.indexOf('tel:') === 0 ||
    trimmed.indexOf('/') === 0 ||
    trimmed.indexOf('./') === 0 ||
    trimmed.indexOf('../') === 0 ||
    trimmed.indexOf('#') === 0
  ) {
    return trimmed;
  }
  return undefined;
}

function sanitizeBodyHtml(html: string): string {
  if (!html || typeof window === 'undefined') {
    return '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const allowedTags: { [key: string]: true } = {
    A: true,
    B: true,
    BLOCKQUOTE: true,
    BR: true,
    DIV: true,
    EM: true,
    H1: true,
    H2: true,
    H3: true,
    H4: true,
    H5: true,
    H6: true,
    HR: true,
    I: true,
    IMG: true,
    LI: true,
    OL: true,
    P: true,
    SPAN: true,
    STRONG: true,
    SUB: true,
    SUP: true,
    U: true,
    UL: true
  };

  const sanitizeNode = (node: Node): void => {
    let child = node.firstChild;
    while (child) {
      const nextSibling = child.nextSibling;
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        if (!allowedTags[el.tagName]) {
          const frag = doc.createDocumentFragment();
          while (el.firstChild) {
            frag.appendChild(el.firstChild);
          }
          el.replaceWith(frag);
          sanitizeNode(node);
          child = nextSibling;
          continue;
        }

        for (let j = el.attributes.length - 1; j >= 0; j--) {
          const attr = el.attributes[j];
          const name = attr.name.toLowerCase();
          if (name.indexOf('on') === 0 || name === 'style' || name === 'srcset') {
            el.removeAttribute(attr.name);
            continue;
          }
          if (el.tagName === 'A' && name === 'href') {
            const safeHref = sanitizeUrl(attr.value);
            if (safeHref) {
              el.setAttribute('href', safeHref);
            } else {
              el.removeAttribute(attr.name);
            }
            continue;
          }
          if (el.tagName === 'A' && (name === 'target' || name === 'rel' || name === 'title')) {
            continue;
          }
          if (el.tagName === 'IMG' && (name === 'src' || name === 'alt' || name === 'title')) {
            if (name === 'src') {
              const safeSrc = sanitizeUrl(attr.value);
              if (safeSrc) {
                el.setAttribute('src', safeSrc);
              } else {
                el.remove();
              }
            }
            continue;
          }
          if (name !== 'class') {
            el.removeAttribute(attr.name);
          }
        }

        if (el.tagName === 'A') {
          if (el.getAttribute('target') === '_blank') {
            el.setAttribute('rel', 'noopener noreferrer');
          } else {
            el.removeAttribute('target');
            el.removeAttribute('rel');
          }
        }

        sanitizeNode(el);
      } else if (child.nodeType === Node.COMMENT_NODE) {
        child.parentNode?.removeChild(child);
      }
      child = nextSibling;
    }
  };

  sanitizeNode(doc.body);
  return doc.body.innerHTML;
}

const NewsDetailView: React.FC<INewsDetailViewProps> = (props) => {
  const [status, setStatus] = React.useState<DetailStatus>(props.itemId ? 'loading' : 'notFound');
  const [item, setItem] = React.useState<INewsDetailItem | undefined>();

  React.useEffect(() => {
    if (!props.itemId) {
      setItem(undefined);
      setStatus('notFound');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    getPublishedNewsDetail(props.spHttpClient, props.webAbsoluteUrl, props.listTitle, props.itemId)
      .then((result) => {
        if (cancelled) {
          return;
        }
        if (!result) {
          setItem(undefined);
          setStatus('notFound');
          return;
        }
        setItem(result);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          setItem(undefined);
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [props.spHttpClient, props.webAbsoluteUrl, props.listTitle, props.itemId]);

  const sanitizedBody = React.useMemo(() => sanitizeBodyHtml(item?.bodyContent || ''), [item?.bodyContent]);

  if (status === 'loading') {
    return (
      <section className={styles.detailContents}>
        <div className={styles.container}>
          <p className={styles.statusMsg} role="status">Loading news detail...</p>
        </div>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section className={styles.detailContents}>
        <div className={styles.container}>
          <div className={styles.detailListWrap} role="alert">
            <p className={styles.statusMsg}>Unable to load this news article.</p>
          </div>
          <div className={styles.backToSec}>
            <a className={styles.backToLink} href={props.newsEventsUrl}>
              <span className={styles.backToText}>Back to News</span>
              <span className={styles.backToIcon} aria-hidden="true">‹</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'notFound' || !item) {
    return (
      <section className={styles.detailContents}>
        <div className={styles.container}>
          <div className={styles.detailListWrap}>
            <p className={styles.statusMsg}>This news article could not be found.</p>
          </div>
          <div className={styles.backToSec}>
            <a className={styles.backToLink} href={props.newsEventsUrl}>
              <span className={styles.backToText}>Back to News</span>
              <span className={styles.backToIcon} aria-hidden="true">‹</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.detailContents}>
      <div className={styles.container}>
        <div className={styles.contentWrapBanner}>
          <div className={`${styles.detailTextContent} ${item.imageUrl ? '' : styles.fullWidth}`}>
            <h1 className={styles.detailTitle}>{item.title}</h1>
            {item.newsDate && <p className={styles.detailDate}>{formatNewsDate(item.newsDate)}</p>}
            {item.description && <p className={styles.detailSummary}>{item.description}</p>}
          </div>
          {item.imageUrl && (
            <div
              className={styles.detailImageContent}
              role="img"
              aria-label={item.title}
              style={{ backgroundImage: "url('" + item.imageUrl + "')" }}
            />
          )}
        </div>

        {sanitizedBody && (
          <div
            className={styles.detailListWrap}
            dangerouslySetInnerHTML={{ __html: sanitizedBody }}
          />
        )}

        <div className={styles.backToSec}>
          <a className={styles.backToLink} href={props.newsEventsUrl}>
            <span className={styles.backToText}>Back to News</span>
            <span className={styles.backToIcon} aria-hidden="true">‹</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsDetailView;
