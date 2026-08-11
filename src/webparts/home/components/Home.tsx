import * as React from 'react';
import styles from './Home.module.scss';
import type { IHomeProps } from './IHomeProps';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import BannerSlider, { IBannerSlide } from './BannerSlider';
import { usePageChromeFlags } from '../../../shared/pageChrome';

/* eslint-disable @typescript-eslint/no-var-requires */
const logo = require('../assets/logo.webp');
const bannerHero = require('../assets/banner-hero.webp');
const cardAgile = require('../assets/card-agile101.webp');
const cardJit = require('../assets/card-jit.webp');
const cardNews = require('../assets/card-news.webp');
const welcomeBg = require('../assets/welcome-bg.webp');
const iconHome = require('../assets/icon-home.webp');
const iconNews = require('../assets/icon-news.webp');
const iconAbout = require('../assets/icon-about.webp');
const iconFocus = require('../assets/icon-focus.webp');
const iconDd = require('../assets/icon-dd.webp');
const iconMail = require('../assets/icon-mail.webp');
/* eslint-enable @typescript-eslint/no-var-requires */

const ChevronRight: React.FC = () => (
  <span className={styles.chevron} aria-hidden="true">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" focusable="false">
      <polyline fill="none" stroke="currentColor" strokeWidth="2" points="9 6 15 12 9 18" />
    </svg>
  </span>
);

const Home: React.FC<IHomeProps> = (props) => {
  // enableRegisterPrompt reserved for future registerPopupController port
  const {
    homeUrl,
    newsEventsUrl,
    aboutUrl,
    agility101Url,
    jitPackUrl,
    bannerCtaUrl,
    quickLinkMtjUrl,
    quickLinkPlatformUrl,
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

  const slides: IBannerSlide[] = [
    {
      title: 'Enterprise Agility',
      subtitle: 'Knowledge Hub',
      tagline: (
        <>
          Work <span>Better</span> | Work <span>Faster</span> | Work <span>Smarter</span>
        </>
      ),
      description: 'The ability to sense and respond rapidly to customers and changing market needs',
      ctaLabel: 'Find out more',
      ctaUrl: bannerCtaUrl,
      imageSrc: bannerHero,
      imageAlt: 'Enterprise Agility illustration'
    }
  ];

  const isExternal = (url: string): boolean => /^https?:\/\//i.test(url);

  const linkProps = (url: string): React.AnchorHTMLAttributes<HTMLAnchorElement> =>
    isExternal(url) ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <div className={styles.home}>
      <section>
        <div className={styles.mainContainer}>
          <div className={styles.headerBanner}>
            {showHeader && (
              <HomeHeader
                homeUrl={homeUrl}
                newsEventsUrl={newsEventsUrl}
                aboutUrl={aboutUrl}
                agility101Url={agility101Url}
                jitPackUrl={jitPackUrl}
                logoSrc={logo}
                iconHome={iconHome}
                iconNews={iconNews}
                iconAbout={iconAbout}
                iconFocus={iconFocus}
                iconDd={iconDd}
                cardAgileSrc={cardAgile}
                cardJitSrc={cardJit}
                activeNav="home"
              />
            )}
            <BannerSlider slides={slides} />
          </div>
        </div>
      </section>

      <section className={styles.welcomeSec} aria-labelledby="home-welcome-heading">
        <div className={styles.container}>
          <div className={styles.welcomeWrap}>
            <div className={styles.welcomeContent}>
              <div className={styles.welcomeText}>
                <h2 id="home-welcome-heading">
                  Welcome to <br />
                  <span> Agility Exchange </span>
                </h2>
              </div>
              <div
                className={styles.welcomeImage}
                style={{ backgroundImage: `url(${welcomeBg})` }}
                role="img"
                aria-label="Agility Exchange welcome"
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.threeCardSec} aria-label="Featured areas">
        <div className={styles.container}>
          <div className={styles.cardLgWrap}>
            <article className={styles.featureCard}>
              <a href={agility101Url} {...linkProps(agility101Url)}>
                <img src={cardAgile} alt="" />
              </a>
              <h3 className={styles.cardTitle}>
                <a href={agility101Url} {...linkProps(agility101Url)}>Agile 101</a>
              </h3>
              <p className={styles.desc}>
                Agile is a way of working for teams to collaborate to get work done and deliver products &amp; services that drive business value and mitigate risk.
              </p>
            </article>

            <article className={styles.featureCard}>
              <a href={jitPackUrl} {...linkProps(jitPackUrl)}>
                <img src={cardJit} alt="" />
              </a>
              <h3 className={styles.cardTitle}>
                <a href={jitPackUrl} {...linkProps(jitPackUrl)}>Agile Practices for Deep Learners</a>
              </h3>
              <p className={styles.desc}>
                IT Training Packs are self-hub guides that you can use in your own time
              </p>
            </article>

            <article className={styles.featureCard}>
              <a href={newsEventsUrl} {...linkProps(newsEventsUrl)}>
                <img src={cardNews} alt="" />
              </a>
              <h3 className={styles.cardTitle}>
                <a href={newsEventsUrl} {...linkProps(newsEventsUrl)}>News &amp; Events</a>
              </h3>
              <p className={styles.desc}>Find out what events are happening and how you can register for them</p>
            </article>
          </div>

          <div className={styles.cardSmWrap}>
            <div className={styles.quickCard}>
              <p>
                <a href={quickLinkMtjUrl} {...linkProps(quickLinkMtjUrl)}>
                  Managing through Journeys <ChevronRight />
                </a>
              </p>
            </div>
            <div className={styles.quickCard}>
              <p>
                <a href={quickLinkPlatformUrl} {...linkProps(quickLinkPlatformUrl)}>
                  Platform Operating Model <ChevronRight />
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {showFooter && <HomeFooter contactEmail={contactEmail} mailIconSrc={iconMail} />}
    </div>
  );
};

export default Home;
