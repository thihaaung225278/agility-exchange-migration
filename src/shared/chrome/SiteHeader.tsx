import * as React from 'react';
import styles from './Chrome.module.scss';

export type SiteNavKey = 'home' | 'news' | 'about';

function getLastSegment(value: string): string {
  const [pathOnly] = value.split(/[?#]/, 1);
  const clean = pathOnly.replace(/\/+$/, '');
  const segment = clean.substring(clean.lastIndexOf('/') + 1).toLowerCase();
  const dotIndex = segment.lastIndexOf('.');

  return dotIndex > 0 ? segment.substring(0, dotIndex) : segment;
}

function resolveActiveState(targetUrl: string, fallbackKey: SiteNavKey, activeNav?: SiteNavKey): boolean {
  if (typeof window === 'undefined') {
    return activeNav === fallbackKey;
  }

  const currentSegment = getLastSegment(window.location.pathname);
  const targetSegment = getLastSegment(targetUrl);

  if (!currentSegment || currentSegment === 'index' || currentSegment === 'default') {
    return fallbackKey === 'home' && (!targetSegment || targetSegment === 'index' || targetSegment === 'default');
  }

  if (targetSegment) {
    return currentSegment === targetSegment;
  }

  return activeNav === fallbackKey;
}

export interface ISiteHeaderProps {
  homeUrl: string;
  newsEventsUrl: string;
  aboutUrl: string;
  agility101Url: string;
  jitPackUrl: string;
  logoSrc: string;
  iconHome: string;
  iconNews: string;
  iconAbout: string;
  iconFocus: string;
  iconDd: string;
  cardAgileSrc: string;
  cardJitSrc: string;
  activeNav?: SiteNavKey;
}

const SiteHeader: React.FC<ISiteHeaderProps> = (props) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [focusOpen, setFocusOpen] = React.useState(false);
  const [mobileFocusOpen, setMobileFocusOpen] = React.useState(false);
  const focusRef = React.useRef<HTMLDivElement>(null);
  const activeNav = props.activeNav || 'home';
  const isHomeActive = resolveActiveState(props.homeUrl, 'home', activeNav);
  const isNewsActive = resolveActiveState(props.newsEventsUrl, 'news', activeNav);
  const isAboutActive = resolveActiveState(props.aboutUrl, 'about', activeNav);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent): void => {
      if (focusRef.current && !focusRef.current.contains(e.target as Node)) {
        setFocusOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  const focusPanel = (
    <div className={styles.ddWrapper}>
      <div className={styles.ddList}>
        <a href={props.agility101Url} className={styles.ddThumbLink} aria-hidden="true" tabIndex={-1}>
          <div
            className={`${styles.leftContent} ${styles.ddThumbAgile}`}
            style={{ backgroundImage: `url(${props.cardAgileSrc})` }}
          />
        </a>
        <div className={styles.rightContent}>
          <h4><a href={props.agility101Url}>Agile 101</a></h4>
          <p>Agile is a way of working for teams to collaborate to get work done and deliver products &amp; services that drive business value and mitigate risk.</p>
        </div>
      </div>
      <div className={styles.ddList}>
        <a href={props.jitPackUrl} className={styles.ddThumbLink} aria-hidden="true" tabIndex={-1}>
          <div
            className={`${styles.leftContent} ${styles.ddThumbJit}`}
            style={{ backgroundImage: `url(${props.cardJitSrc})` }}
          />
        </a>
        <div className={styles.rightContent}>
          <h4><a href={props.jitPackUrl}>Agile Practices for Deep Learners</a></h4>
          <p>JIT Training Packs are self-hub guides that you can use in your own time</p>
        </div>
      </div>
    </div>
  );

  return (
    <header className={styles.siteHeader} data-ae-site-chrome="header">
      <nav className={styles.desktopNav} aria-label="Primary">
        <div className={styles.navInner}>
          <a href={props.homeUrl}>
            <img className={styles.logo} src={props.logoSrc} alt="Agility Exchange" />
          </a>

          <ul className={styles.navCenter}>
            <li className={isHomeActive ? styles.navActive : undefined}>
              <a href={props.homeUrl} data-active="home" aria-current={isHomeActive ? 'page' : undefined}>
                <span><img src={props.iconHome} alt="" /></span>
                HOME
              </a>
            </li>
            <li className={isNewsActive ? styles.navActive : undefined}>
              <a href={props.newsEventsUrl} data-active="news-events" aria-current={isNewsActive ? 'page' : undefined}>
                <span><img src={props.iconNews} alt="" /></span>
                News &amp; Events
              </a>
            </li>
            <li className={isAboutActive ? styles.navActive : undefined}>
              <a href={props.aboutUrl} data-active="about-tg" aria-current={isAboutActive ? 'page' : undefined}>
                <span><img src={props.iconAbout} alt="" /></span>
                <span>ABOUT A<span className={styles.axLower}>x</span></span>
              </a>
            </li>
          </ul>

          <div className={styles.navRight} ref={focusRef}>
            <button
              type="button"
              className={styles.parentNav}
              aria-expanded={focusOpen}
              aria-haspopup="true"
              onClick={() => setFocusOpen((v) => !v)}
            >
              <span><img src={props.iconFocus} alt="" /></span>
              Focus Area
              <span><img src={props.iconDd} className={`${styles.ddIcon}${focusOpen ? ` ${styles.ddIconOpen}` : ''}`} alt="" /></span>
            </button>
            {focusOpen && (
              <div className={styles.focusDropdown} role="menu">
                {focusPanel}
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className={styles.mobileNav}>
        <a href={props.homeUrl}>
          <img className={styles.logo} src={props.logoSrc} alt="Agility Exchange" />
        </a>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={mobileOpen}
          aria-controls="ae-site-mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className={styles.menuIcon} aria-hidden="true" />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.offcanvas} id="ae-site-mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
          <button
            type="button"
            className={styles.offcanvasClose}
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            ×
          </button>
          <ul className={styles.offcanvasList}>
            <li className={isHomeActive ? styles.navActive : undefined}>
              <a href={props.homeUrl} data-active="home" aria-current={isHomeActive ? 'page' : undefined} onClick={() => setMobileOpen(false)}>
                <span><img src={props.iconHome} alt="" /></span>Home
              </a>
            </li>
            <li className={isNewsActive ? styles.navActive : undefined}>
              <a href={props.newsEventsUrl} data-active="news-events" aria-current={isNewsActive ? 'page' : undefined} onClick={() => setMobileOpen(false)}>
                <span><img src={props.iconNews} alt="" /></span>News &amp; Events
              </a>
            </li>
            <li className={isAboutActive ? styles.navActive : undefined}>
              <a href={props.aboutUrl} data-active="about-tg" aria-current={isAboutActive ? 'page' : undefined} onClick={() => setMobileOpen(false)}>
                <span><img src={props.iconAbout} alt="" /></span>
                <span>About A<span className={styles.axLower}>x</span></span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className={styles.mobileFocusToggle}
                aria-expanded={mobileFocusOpen}
                onClick={() => setMobileFocusOpen((v) => !v)}
              >
                Focus Area
              </button>
              {mobileFocusOpen && (
                <div className={styles.mobileFocusPanel}>
                  {focusPanel}
                </div>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
