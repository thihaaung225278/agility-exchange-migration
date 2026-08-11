import * as React from 'react';
import styles from './AboutTg.module.scss';
import type { IAboutTgProps } from './IAboutTgProps';
import AboutHeader from './AboutHeader';
import AboutFooter from './AboutFooter';
import { chromeAssets } from '../../../shared/chrome/chromeAssets';
import { usePageChromeFlags } from '../../../shared/pageChrome';

/* eslint-disable @typescript-eslint/no-var-requires */
const aboutHero = require('../assets/about-hero.webp');
/* eslint-enable @typescript-eslint/no-var-requires */

const AboutTg: React.FC<IAboutTgProps> = (props) => {
  const {
    homeUrl,
    newsEventsUrl,
    aboutUrl,
    agility101Url,
    jitPackUrl,
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

  return (
    <div className={styles.aboutTg}>
      {showHeader && (
        <section>
          <div className={styles.mainContainer}>
            <div className={styles.headerBanner}>
              <AboutHeader
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
                activeNav="about"
              />
            </div>
          </div>
        </section>
      )}

      <section className={styles.detailContents} aria-labelledby="about-hero-heading">
        <div className={styles.container}>
          <div className={styles.heroWrap}>
            <div className={styles.heroText}>
              <h1 id="about-hero-heading" className={styles.heroTitle}>
                About Agility Exchange
              </h1>
            </div>
            <img
              className={styles.heroImage}
              src={aboutHero}
              alt="About Agility Exchange"
            />
          </div>

          <div className={styles.detailList}>
            <h2 className={styles.detailHeading}>About Us</h2>
            <p>
              To get ahead of our competition in today&apos;s world, it is imperative for our organisation to hone our ability
              <strong> to sense and respond rapidly to changing market trends and conditions to meet our customers&apos; needs.</strong> At <strong>Agility eXchange</strong>, we want to co-create the DBS way of working! No matter where you are in your
              agile journey, you will find resources here to <strong>support you in your growth</strong> to become awesome agile practitioners and change champions.
            </p>
            <ul>
              <li>Self-help and reading for you to download, to empower and equip you and your teams with both the basics as well as best practices</li>
              <li>Agile learning pathways where you can sign up for your next training &amp; enablement class and furnish your agile career</li>
              <li>Stay updated on the developments across our bank and how our people are embracing this new way of working</li>
              <li>Ongoing knowledge and experience sharing of our successes and learnings through the guilds</li>
            </ul>
            <p>
              <strong>We are passionate</strong> about supporting our organisation&apos;s ambition to be #BBIW 2020, build in the start-up mindset, creating a safe environment for learning and challenging our status quo, collaborate and be nimble to achieve
              enterprise agility.
            </p>
            <p>
              <strong> We want to be a place of continuous learning.</strong> From learning what Agile is, to how others of the same craft are adopting it in their areas, this is where you can learn through what we share, as well as contribute back
              to the collective knowledge of our community. We want to hear from you if you have found better ways of doing things, share your knowledge and help the rest of the organisation learn as well.
            </p>
            <p>
              If you have challenges or are seeking guidance in adopting the Agile way of working in your context, we have also created an avenue for you to reach out for expertise support. <strong>Our goal is to enable you and your teams to be empowered and self-organising!</strong>
            </p>
            <p>Enjoy your visit here with us. Partake of these gems of information offered and get on board!</p>
          </div>
        </div>
      </section>

      {showFooter && <AboutFooter contactEmail={contactEmail} mailIconSrc={chromeAssets.iconMail} />}
    </div>
  );
};

export default AboutTg;
