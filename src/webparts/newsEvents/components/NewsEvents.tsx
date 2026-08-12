import * as React from 'react';
import styles from './NewsEvents.module.scss';
import type { INewsEventsProps } from './INewsEventsProps';
import NewsHeader from './NewsHeader';
import NewsFooter from './NewsFooter';
import EventsView from './EventsView';
import NewsView from './NewsView';
import NewsDetailView from './NewsDetailView';
import { chromeAssets } from '../../../shared/chrome/chromeAssets';
import { usePageChromeFlags } from '../../../shared/pageChrome';
import { isSafeJoinUrl } from '../../../shared/services/dateUtils';

/* eslint-disable @typescript-eslint/no-var-requires */
const newsBanner = require('../assets/news-banner.webp');
const yammerDiscussion = require('../assets/yammer-discussion.webp');
const yammerQuestion = require('../assets/yammer-question.webp');
const yammerPraise = require('../assets/yammer-praise.webp');
const yammerPoll = require('../assets/yammer-poll.webp');
/* eslint-enable @typescript-eslint/no-var-requires */

type TabKey = 'events' | 'news' | 'yammer';

function readNewsDetailId(): number | undefined {
  if (typeof window === 'undefined' || !window.location || !window.location.search) {
    return undefined;
  }
  const raw = new URLSearchParams(window.location.search).get('id');
  if (!raw || !/^\d+$/.test(raw)) {
    return undefined;
  }
  const value = parseInt(raw, 10);
  return value > 0 ? value : undefined;
}

const NewsEvents: React.FC<INewsEventsProps> = (props) => {
  const {
    homeUrl,
    newsEventsUrl,
    aboutUrl,
    agility101Url,
    jitPackUrl,
    newsDetailUrl,
    yammerUrl,
    newsListTitle,
    eventsListTitle,
    contactEmail,
    renderOwnChrome,
    spHttpClient,
    webAbsoluteUrl,
    webServerRelativeUrl,
    pageServerRelativeUrl,
    listId,
    listItemId
  } = props;

  const [tab, setTab] = React.useState<TabKey>('events');

  const chromeFlags = usePageChromeFlags(
    renderOwnChrome,
    spHttpClient,
    webAbsoluteUrl,
    {
      listId,
      listItemId,
      pageServerRelativeUrl,
      webServerRelativeUrl
    }
  );
  const showHeader = renderOwnChrome && chromeFlags.showHeader;
  const showFooter = renderOwnChrome && chromeFlags.showFooter;
  const safeYammer = isSafeJoinUrl(yammerUrl);
  const detailItemId = React.useMemo(() => readNewsDetailId(), []);

  if (detailItemId) {
    return (
      <div className={styles.newsEvents}>
        <section>
          <div className={styles.mainContainer}>
            <div className={`${styles.headerBanner} ${styles.detailHeaderBanner}`}>
              {showHeader && (
                <NewsHeader
                  homeUrl={homeUrl}
                  newsEventsUrl={newsEventsUrl}
                  aboutUrl={aboutUrl}
                  agility101Url={agility101Url}
                  jitPackUrl={jitPackUrl}
                  logoSrc={chromeAssets.logo}
                  iconHome={chromeAssets.iconHome}
                  iconNews={chromeAssets.iconNews}
                  iconAbout={chromeAssets.iconAbout}
                  iconFocus={chromeAssets.iconFocus}
                  iconDd={chromeAssets.iconDd}
                  cardAgileSrc={chromeAssets.cardAgile}
                  cardJitSrc={chromeAssets.cardJit}
                  activeNav="news"
                />
              )}
            </div>
          </div>
        </section>

        <NewsDetailView
          spHttpClient={spHttpClient}
          webAbsoluteUrl={webAbsoluteUrl}
          listTitle={newsListTitle}
          newsEventsUrl={newsEventsUrl}
          itemId={detailItemId}
        />

        {showFooter && <NewsFooter contactEmail={contactEmail} mailIconSrc={chromeAssets.iconMail} />}
      </div>
    );
  }

  return (
    <div className={styles.newsEvents}>
      <section>
        <div className={styles.mainContainer}>
          <div className={styles.headerBanner}>
            {showHeader && (
              <NewsHeader
                homeUrl={homeUrl}
                newsEventsUrl={newsEventsUrl}
                aboutUrl={aboutUrl}
                agility101Url={agility101Url}
                jitPackUrl={jitPackUrl}
                logoSrc={chromeAssets.logo}
                iconHome={chromeAssets.iconHome}
                iconNews={chromeAssets.iconNews}
                iconAbout={chromeAssets.iconAbout}
                iconFocus={chromeAssets.iconFocus}
                iconDd={chromeAssets.iconDd}
                cardAgileSrc={chromeAssets.cardAgile}
                cardJitSrc={chromeAssets.cardJit}
                activeNav="news"
              />
            )}

            <div className={styles.newsBanner}>
              <div className={styles.heroRow}>
                <div className={styles.heroImageWrap}>
                  <img src={newsBanner} alt="" />
                </div>
                <div className={styles.heroText}>
                  <h1>News &amp; Events</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.filterWrapper}>
        <div className={styles.container}>
          <div className={styles.sectionWrap}>
            <div className={styles.filterContent}>
              <div className={styles.subnav} role="tablist" aria-label="News and events">
                <div className={styles.subnavItem} role="none">
                  <button
                    type="button"
                    role="tab"
                    id="tab-events"
                    aria-selected={tab === 'events'}
                    aria-controls="panel-events"
                    className={tab === 'events' ? styles.tabActive : undefined}
                    onClick={() => setTab('events')}
                  >
                    Events
                  </button>
                  <span className={styles.tabNotch} aria-hidden="true" />
                </div>
                <div className={styles.subnavItem} role="none">
                  <button
                    type="button"
                    role="tab"
                    id="tab-news"
                    aria-selected={tab === 'news'}
                    aria-controls="panel-news"
                    className={tab === 'news' ? styles.tabActive : undefined}
                    onClick={() => setTab('news')}
                  >
                    News
                  </button>
                  <span className={styles.tabNotch} aria-hidden="true" />
                </div>
                <div className={styles.subnavItem} role="none">
                  <button
                    type="button"
                    role="tab"
                    id="tab-yammer"
                    aria-selected={tab === 'yammer'}
                    aria-controls="panel-yammer"
                    className={tab === 'yammer' ? styles.tabActive : undefined}
                    onClick={() => setTab('yammer')}
                  >
                    Yammer
                  </button>
                  <span className={styles.tabNotch} aria-hidden="true" />
                </div>
              </div>

              <div className={styles.panelStack}>
                <div
                  id="panel-events"
                  role="tabpanel"
                  aria-labelledby="tab-events"
                  hidden={tab !== 'events'}
                >
                  <EventsView
                    spHttpClient={spHttpClient}
                    webAbsoluteUrl={webAbsoluteUrl}
                    listTitle={eventsListTitle}
                  />
                </div>

                <div
                  id="panel-news"
                  role="tabpanel"
                  aria-labelledby="tab-news"
                  hidden={tab !== 'news'}
                >
                  <NewsView
                    spHttpClient={spHttpClient}
                    webAbsoluteUrl={webAbsoluteUrl}
                    listTitle={newsListTitle}
                    newsDetailUrl={newsDetailUrl}
                  />
                </div>

                <div
                  id="panel-yammer"
                  role="tabpanel"
                  aria-labelledby="tab-yammer"
                  hidden={tab !== 'yammer'}
                >
                  <div className={styles.newsContentsWrap}>
                    <div className={styles.yammerBlock}>
                      <p className={styles.yammerText}>
                        {safeYammer ? (
                          <a href={safeYammer} target="_blank" rel="noopener noreferrer">
                            Join our Agility eXchange Yammer community
                          </a>
                        ) : (
                          <span>Join our Agility eXchange Yammer community</span>
                        )}
                      </p>
                      <p className={styles.yammerText}>Share thoughts, ideas, or updates</p>
                      <div className={styles.yammerIcons}>
                        <div className={styles.yammerItem}>
                          <div className={styles.yammerImg}>
                            <img src={yammerDiscussion} alt="" />
                          </div>
                          <span>Discussion</span>
                        </div>
                        <div className={styles.yammerItem}>
                          <div className={styles.yammerImg}>
                            <img src={yammerQuestion} alt="" />
                          </div>
                          <span>Question</span>
                        </div>
                        <div className={styles.yammerItem}>
                          <div className={styles.yammerImg}>
                            <img src={yammerPraise} alt="" />
                          </div>
                          <span>Praise</span>
                        </div>
                        <div className={styles.yammerItem}>
                          <div className={styles.yammerImg}>
                            <img src={yammerPoll} alt="" />
                          </div>
                          <span>Poll</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showFooter && <NewsFooter contactEmail={contactEmail} mailIconSrc={chromeAssets.iconMail} />}
    </div>
  );
};

export default NewsEvents;
