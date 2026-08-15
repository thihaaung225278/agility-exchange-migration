import * as React from 'react';
import * as ReactDom from 'react-dom';
import styles from './Chrome.module.scss';
import { withWebViewEnv } from './webViewEnv';

export type SiteNavKey = 'home' | 'news' | 'about';

function getLastSegment(value: string): string {
  const [pathOnly] = value.split(/[?#]/, 1);
  const clean = pathOnly.replace(/\/+$/, '');
  const segment = clean.substring(clean.lastIndexOf('/') + 1).toLowerCase();
  const dotIndex = segment.lastIndexOf('.');

  return dotIndex > 0 ? segment.substring(0, dotIndex) : segment;
}

function isHomeSegment(segment: string): boolean {
  return !segment || segment === 'index' || segment === 'default' || segment === 'home';
}

function resolveActiveState(targetUrl: string, fallbackKey: SiteNavKey, activeNav?: SiteNavKey): boolean {
  if (typeof window === 'undefined') {
    return activeNav === fallbackKey;
  }

  const currentSegment = getLastSegment(window.location.pathname);
  const targetSegment = getLastSegment(targetUrl);

  if (isHomeSegment(currentSegment)) {
    return fallbackKey === 'home' && isHomeSegment(targetSegment);
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
  const homeUrl = withWebViewEnv(props.homeUrl);
  const newsEventsUrl = withWebViewEnv(props.newsEventsUrl);
  const aboutUrl = withWebViewEnv(props.aboutUrl);
  const agility101Url = withWebViewEnv(props.agility101Url);
  const jitPackUrl = withWebViewEnv(props.jitPackUrl);

  React.useEffect(() => {
    const onDocClick = (e: MouseEvent): void => {
      if (focusRef.current && !focusRef.current.contains(e.target as Node)) {
        setFocusOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const closeMobileMenu = React.useCallback((): void => {
    setMobileOpen(false);
    setMobileFocusOpen(false);
  }, []);

  React.useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [mobileOpen, closeMobileMenu]);

  const focusPanel = (
    <div className={styles.ddWrapper}>
      <div className={styles.ddList}>
        <a href={agility101Url} className={styles.ddThumbLink} aria-hidden="true" tabIndex={-1} onClick={closeMobileMenu}>
          <div
            className={`${styles.leftContent} ${styles.ddThumbAgile}`}
            style={{ backgroundImage: `url(${props.cardAgileSrc})` }}
          />
        </a>
        <div className={styles.rightContent}>
          <h4><a href={agility101Url} onClick={closeMobileMenu}>Agile 101</a></h4>
          <p>Agile is a way of working for teams to collaborate to get work done and deliver products &amp; services that drive business value and mitigate risk.</p>
        </div>
      </div>
      <div className={styles.ddList}>
        <a href={jitPackUrl} className={styles.ddThumbLink} aria-hidden="true" tabIndex={-1} onClick={closeMobileMenu}>
          <div
            className={`${styles.leftContent} ${styles.ddThumbJit}`}
            style={{ backgroundImage: `url(${props.cardJitSrc})` }}
          />
        </a>
        <div className={styles.rightContent}>
          <h4><a href={jitPackUrl} onClick={closeMobileMenu}>Agile Practices for Deep Learners</a></h4>
          <p>JIT Training Packs are self-hub guides that you can use in your own time</p>
        </div>
      </div>
    </div>
  );

  return (
    <header className={styles.siteHeader} data-ae-site-chrome="header">
      <nav className={styles.desktopNav} aria-label="Primary">
        <div className={styles.navInner}>
          <a href={homeUrl}>
            <img className={styles.logo} src={props.logoSrc} alt="Agility Exchange" />
          </a>

          <ul className={styles.navCenter}>
            <li className={isHomeActive ? styles.navActive : undefined}>
              <a href={homeUrl} data-active="home" aria-current={isHomeActive ? 'page' : undefined}>
                <span><img src={props.iconHome} alt="" /></span>
                HOME
              </a>
            </li>
            <li className={isNewsActive ? styles.navActive : undefined}>
              <a href={newsEventsUrl} data-active="news-events" aria-current={isNewsActive ? 'page' : undefined}>
                <span><img src={props.iconNews} alt="" /></span>
                News &amp; Events
              </a>
            </li>
            <li className={isAboutActive ? styles.navActive : undefined}>
              <a href={aboutUrl} data-active="about-tg" aria-current={isAboutActive ? 'page' : undefined}>
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
        <a href={homeUrl}>
          <img className={styles.logo} src={props.logoSrc} alt="Agility Exchange" />
        </a>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={mobileOpen}
          aria-controls="ae-site-mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => {
            if (mobileOpen) {
              closeMobileMenu();
            } else {
              setMobileOpen(true);
            }
          }}
        >
          <svg className={styles.menuIcon} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
            <rect x="2" y="4" width="16" height="1" fill="currentColor" />
            <rect x="2" y="9" width="16" height="1" fill="currentColor" />
            <rect x="2" y="14" width="16" height="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {mobileOpen &&
        ReactDom.createPortal(
          <div className={styles.offcanvas} id="ae-site-mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div
              className={`${styles.offcanvasBar}${mobileFocusOpen ? ` ${styles.offcanvasBarFocusOpen}` : ''}`}
            >
              <button
                type="button"
                className={styles.offcanvasClose}
                aria-label="Close menu"
                onClick={closeMobileMenu}
              >
                <svg className={styles.offcanvasCloseIcon} width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                  <path fill="none" stroke="currentColor" strokeWidth="1.06" d="M16,16 L4,4" />
                  <path fill="none" stroke="currentColor" strokeWidth="1.06" d="M16,4 L4,16" />
                </svg>
              </button>
              <ul className={styles.offcanvasList}>
                <li className={isHomeActive ? styles.navActive : undefined}>
                  <a href={homeUrl} data-active="home" aria-current={isHomeActive ? 'page' : undefined} onClick={closeMobileMenu}>
                    <span><img src={props.iconHome} alt="" /></span>Home
                  </a>
                </li>
                <li className={isNewsActive ? styles.navActive : undefined}>
                  <a href={newsEventsUrl} data-active="news-events" aria-current={isNewsActive ? 'page' : undefined} onClick={closeMobileMenu}>
                    <span><img src={props.iconNews} alt="" /></span>News &amp; Events
                  </a>
                </li>
                <li className={isAboutActive ? styles.navActive : undefined}>
                  <a href={aboutUrl} data-active="about-tg" aria-current={isAboutActive ? 'page' : undefined} onClick={closeMobileMenu}>
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
                    <span><img src={props.iconFocus} alt="" /></span>
                    Focus Area
                    <svg
                      className={`${styles.mobileFocusChevron}${mobileFocusOpen ? ` ${styles.mobileFocusChevronOpen}` : ''}`}
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path
                        fill="currentColor"
                        d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6l1.41-1.41z"
                      />
                    </svg>
                  </button>
                  {mobileFocusOpen && (
                    <div className={styles.mobileFocusPanel}>
                      {focusPanel}
                    </div>
                  )}
                </li>
              </ul>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default SiteHeader;
