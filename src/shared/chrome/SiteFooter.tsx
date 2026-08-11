import * as React from 'react';
import styles from './Chrome.module.scss';

export interface ISiteFooterProps {
  contactEmail: string;
  mailIconSrc: string;
}

const SiteFooter: React.FC<ISiteFooterProps> = ({ contactEmail, mailIconSrc }) => {
  const mailto = `mailto:${contactEmail}`;

  return (
    <footer className={styles.siteFooter} data-ae-site-chrome="footer">
      <div className={styles.footerInner}>
        <div className={styles.footerContent}>
          <div className={styles.footerLeft}>
            <p><a href={mailto}>Got a question? Contact us</a></p>
          </div>
          <div className={styles.footerRight}>
            <a href={mailto}>
              {contactEmail}
              <span>
                <img src={mailIconSrc} alt="" />
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
