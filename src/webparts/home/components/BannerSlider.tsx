import * as React from 'react';
import styles from './Home.module.scss';

export interface IBannerSlide {
  title: string;
  subtitle?: string;
  tagline: React.ReactNode;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
  imageSrc: string;
  imageAlt: string;
}

export interface IBannerSliderProps {
  slides: IBannerSlide[];
}

const BannerSlider: React.FC<IBannerSliderProps> = ({ slides }) => {
  const [index, setIndex] = React.useState(0);
  const total = slides.length;
  const showChrome = total >= 2;
  const current = slides[Math.min(index, Math.max(total - 1, 0))];

  const goPrev = (): void => {
    if (total < 2) {
      return;
    }
    setIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const goNext = (): void => {
    if (total < 2) {
      return;
    }
    setIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  };

  if (!current) {
    return null;
  }

  return (
    <div className={styles.bannerSlider}>
      <div
        className={styles.bannerSwiper}
        role="region"
        aria-roledescription={showChrome ? 'carousel' : undefined}
        aria-label="Home banner"
      >
        <div className={styles.slide}>
          <div className={styles.contentWrapper}>
            <div className={styles.imageContent}>
              <img src={current.imageSrc} alt={current.imageAlt} />
            </div>
            <div className={styles.textContent}>
              <h1 className={styles.bannerTitle}>{current.title}</h1>
              {current.subtitle && <h2 className={styles.bannerSubtitle}>{current.subtitle}</h2>}
              <div className={styles.subLabel}>
                <p>{current.tagline}</p>
              </div>
              <p className={styles.bannerBody}>{current.description}</p>
              <div className={styles.bannerRed}>
                <a href={current.ctaUrl}>{current.ctaLabel}</a>
              </div>
            </div>
          </div>
        </div>

        {showChrome && (
          <>
            <button type="button" className={styles.swiperPrev} onClick={goPrev} aria-label="Previous slide" />
            <button type="button" className={styles.swiperNext} onClick={goNext} aria-label="Next slide" />
            <div className={styles.pagination} role="tablist" aria-label="Banner slides">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`${styles.bullet}${i === index ? ` ${styles.bulletActive}` : ''}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BannerSlider;
