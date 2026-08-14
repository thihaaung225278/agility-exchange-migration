import * as React from 'react';
import styles from './NewsDetail.module.scss';
import type { INewsDetailProps } from './INewsDetailProps';
import NewsHeader from '../../newsEvents/components/NewsHeader';
import NewsFooter from '../../newsEvents/components/NewsFooter';
import NewsDetailView from './NewsDetailView';
import { chromeAssets } from '../../../shared/chrome/chromeAssets';
import { usePageChromeFlags } from '../../../shared/pageChrome';
import { readNewsDetailId } from '../../../shared/services/dateUtils';

const NewsDetail: React.FC<INewsDetailProps> = (props) => {
  const {
    homeUrl,
    newsEventsUrl,
    aboutUrl,
    agility101Url,
    jitPackUrl,
    newsListTitle,
    contactEmail,
    renderOwnChrome,
    spHttpClient,
    webAbsoluteUrl,
    webServerRelativeUrl,
    pageServerRelativeUrl,
    listId,
    listItemId
  } = props;

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
  const detailItemId = React.useMemo(() => readNewsDetailId(), []);

  return (
    <div className={styles.newsDetail}>
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
};

export default NewsDetail;
