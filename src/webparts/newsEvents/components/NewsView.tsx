import * as React from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './NewsEvents.module.scss';
import {
  getPublishedNews,
  pickFeaturedNews,
  type INewsItem
} from '../../../shared/services/newsService';
import { formatNewsDate, newsDetailHref } from '../../../shared/services/dateUtils';

export interface INewsViewProps {
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  listTitle: string;
  newsDetailUrl: string;
}

const NewsView: React.FC<INewsViewProps> = (props) => {
  const [status, setStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [items, setItems] = React.useState<INewsItem[]>([]);

  React.useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    getPublishedNews(props.spHttpClient, props.webAbsoluteUrl, props.listTitle)
      .then((rows) => {
        if (!cancelled) {
          setItems(rows);
          setStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [props.spHttpClient, props.webAbsoluteUrl, props.listTitle]);

  if (status === 'loading') {
    return <p className={styles.statusMsg} role="status">Loading news…</p>;
  }
  if (status === 'error') {
    return <p className={styles.statusMsg} role="alert">Unable to load news.</p>;
  }
  if (!items.length) {
    return <p className={styles.statusMsg}>No published news yet.</p>;
  }

  const featured = pickFeaturedNews(items);
  const listing: INewsItem[] = [];
  for (let i = 0; i < items.length; i++) {
    if (!featured || items[i].id !== featured.id) {
      listing.push(items[i]);
    }
  }

  return (
    <div>
      {featured && (
        <div className={styles.newsContentsWrap}>
          <div className={`${styles.contentsWrap} ${featured.imageUrl ? styles.contentsNewsWrap : ''}`}>
            <div className={`${styles.contentDesc} ${featured.imageUrl ? '' : styles.fullWidth}`}>
              <p className={styles.label}>Featured</p>
              <h3 className={styles.featuredTitle}>
                <a href={newsDetailHref(props.newsDetailUrl, featured.id)}>{featured.title}</a>
              </h3>
              {featured.newsDate && (
                <p className={styles.newsDate}>{formatNewsDate(featured.newsDate)}</p>
              )}
              {featured.description && <p className={styles.desc}>{featured.description}</p>}
              {featured.hasBody && (
                <div className={styles.btnLink}>
                  <a href={newsDetailHref(props.newsDetailUrl, featured.id)} target="_blank" rel="noopener noreferrer">
                    Read More
                  </a>
                </div>
              )}
            </div>
            {featured.imageUrl && (
              <a className={styles.imgWrap} href={newsDetailHref(props.newsDetailUrl, featured.id)}>
                <img src={featured.imageUrl} alt={featured.title} />
              </a>
            )}
          </div>
        </div>
      )}

      {listing.map((item) => (
        <article key={item.id} className={styles.oneCard}>
          <div className={`${styles.cardContents} ${item.imageUrl ? '' : styles.fullWidth}`}>
            <h4>
              <a href={newsDetailHref(props.newsDetailUrl, item.id)}>{item.title}</a>
            </h4>
            {item.newsDate && <p className={styles.newsDate}>{formatNewsDate(item.newsDate)}</p>}
            {item.description && <p>{item.description}</p>}
            {item.hasBody && (
              <div className={`${styles.btnLink} ${styles.btnLinkDetail}`}>
                <a href={newsDetailHref(props.newsDetailUrl, item.id)} target="_blank" rel="noopener noreferrer">
                  Read More
                </a>
              </div>
            )}
          </div>
          {item.imageUrl && (
            <a href={newsDetailHref(props.newsDetailUrl, item.id)}>
              <div className={styles.newImgWrapper}>
                <img src={item.imageUrl} alt={item.title} />
              </div>
            </a>
          )}
        </article>
      ))}
    </div>
  );
};

export default NewsView;
