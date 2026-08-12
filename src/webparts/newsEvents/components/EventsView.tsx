import * as React from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Keyboard } from 'swiper/modules';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import styles from './NewsEvents.module.scss';
import {
  buildMonthGrid,
  compareYmd,
  endOfMonthYmd,
  formatDayChip,
  formatEventClock,
  formatLongDay,
  formatMonthShort,
  indexOfYmd,
  monthsOfYear,
  readValidViewYmd,
  startOfMonthYmd,
  todayYmd,
  writeViewParam,
  yearOf,
  yearsBetween
} from '../../../shared/services/dateUtils';
import {
  eventDaysOfMonth,
  eventRangeFlags,
  eventsOnDay,
  getEventDateBounds,
  getPublishedEventsBetween,
  isEventPast,
  type IEventItem
} from '../../../shared/services/eventsService';

/* eslint-disable @typescript-eslint/no-var-requires */
const eventsHero = require('../assets/events-hero.webp');
const calendarArt = require('../assets/calendar.webp');
/* eslint-enable @typescript-eslint/no-var-requires */

const WEEKDAYS: string[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SLIDE_MS = 300;

const DdChevronIcon: React.FC = () => (
  <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
    <polyline points="2 4 6 8 10 4" />
  </svg>
);

/** Classic uses UIKit chevron (ratio 1) — thin stroke, ~20px. */
const StripChevronIcon: React.FC<{ direction: 'left' | 'right' }> = ({ direction }) => (
  <svg
    className={styles.stripNavIcon}
    viewBox="0 0 20 20"
    width="20"
    height="20"
    aria-hidden="true"
    focusable="false"
  >
    <polyline
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      points={direction === 'left' ? '12.5 4.5 7.5 10 12.5 15.5' : '7.5 4.5 12.5 10 7.5 15.5'}
    />
  </svg>
);

export interface IEventsViewProps {
  spHttpClient: SPHttpClient;
  webAbsoluteUrl: string;
  listTitle: string;
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const EventsView: React.FC<IEventsViewProps> = (props) => {
  const today = todayYmd();
  const [boundsStatus, setBoundsStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [startBound, setStartBound] = React.useState<string | undefined>();
  const [endBound, setEndBound] = React.useState<string | undefined>();
  const [cursorYmd, setCursorYmd] = React.useState(() => readValidViewYmd() ?? todayYmd());
  const [monthEvents, setMonthEvents] = React.useState<IEventItem[]>([]);
  const [eventDays, setEventDays] = React.useState<string[]>([]);
  const [selectedYmd, setSelectedYmd] = React.useState(() => readValidViewYmd() ?? todayYmd());
  const [monthStatus, setMonthStatus] = React.useState<'loading' | 'ready' | 'error'>('loading');
  const [openDd, setOpenDd] = React.useState<'month' | 'year' | undefined>();
  const monthRef = React.useRef<HTMLDivElement>(null);
  const yearRef = React.useRef<HTMLDivElement>(null);
  const swiperRef = React.useRef<SwiperInstance | null>(null);
  const syncingFromSwiper = React.useRef(false);
  const urlSyncReady = React.useRef(false);

  React.useEffect(() => {
    const onDoc = (e: MouseEvent): void => {
      const t = e.target as Node;
      if (monthRef.current && monthRef.current.contains(t)) {
        return;
      }
      if (yearRef.current && yearRef.current.contains(t)) {
        return;
      }
      setOpenDd(undefined);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') {
        setOpenDd(undefined);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const initialView = readValidViewYmd();
    setBoundsStatus('loading');
    getEventDateBounds(props.spHttpClient, props.webAbsoluteUrl, props.listTitle)
      .then((bounds) => {
        if (cancelled) {
          return;
        }
        setStartBound(bounds.startYmd);
        setEndBound(bounds.endYmd);
        let next = today;
        if (initialView) {
          next = initialView;
        }
        if (bounds.endYmd && compareYmd(next, bounds.endYmd) > 0) {
          next = bounds.endYmd;
        }
        if (bounds.startYmd && compareYmd(next, bounds.startYmd) < 0) {
          next = bounds.startYmd;
        }
        setCursorYmd(next);
        setSelectedYmd(next);
        setBoundsStatus('ready');
      })
      .catch(() => {
        if (!cancelled) {
          // Bounds failed — do not invent today's year in the year control.
          setStartBound(undefined);
          setEndBound(undefined);
          if (initialView) {
            setCursorYmd(initialView);
            setSelectedYmd(initialView);
          }
          setBoundsStatus('ready');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [props.spHttpClient, props.webAbsoluteUrl, props.listTitle, today]);

  React.useEffect(() => {
    if (boundsStatus !== 'ready') {
      return;
    }
    let cancelled = false;
    const from = startOfMonthYmd(cursorYmd);
    const to = endOfMonthYmd(cursorYmd);
    setMonthStatus('loading');
    getPublishedEventsBetween(props.spHttpClient, props.webAbsoluteUrl, props.listTitle, from, to)
      .then((rows) => {
        if (cancelled) {
          return;
        }
        const days = eventDaysOfMonth(rows);
        setMonthEvents(rows);
        setEventDays(days);
        if (days.length) {
          // Classic: default first event day; URL ?view= overrides when that day is in month.
          let pick = days[0];
          const view = readValidViewYmd();
          const cursorMonth = cursorYmd.substring(0, 7);
          if (view && view.substring(0, 7) === cursorMonth) {
            const viewIdx = indexOfYmd(days, view);
            if (viewIdx >= 0) {
              pick = days[viewIdx];
            }
          }
          setSelectedYmd(pick);
        }
        if (!cancelled) {
          urlSyncReady.current = true;
          setMonthStatus('ready');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMonthEvents([]);
          setEventDays([]);
          urlSyncReady.current = true;
          setMonthStatus('error');
        }
      });
    return () => {
      cancelled = true;
    };
    // selectedYmd omitted: month fetch should not loop when day chip changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boundsStatus, cursorYmd, props.spHttpClient, props.webAbsoluteUrl, props.listTitle, today]);

  React.useEffect(() => {
    if (!urlSyncReady.current) {
      return;
    }
    writeViewParam(selectedYmd, today);
  }, [selectedYmd, today]);

  // Only years covered by Published event bounds — never invent today's year (e.g. 2026).
  const years = startBound && endBound ? yearsBetween(startBound, endBound) : [];
  const cursorYear = yearOf(cursorYmd);
  const yearInBounds = years.indexOf(cursorYear) >= 0;
  const yearLabel: string | number = years.length
    ? (yearInBounds ? cursorYear : years[years.length - 1])
    : '—';
  const lastBoundYear = years.length ? years[years.length - 1] : undefined;

  React.useEffect(() => {
    if (lastBoundYear === undefined || yearInBounds) {
      return;
    }
    const monthPart = cursorYmd.substring(5, 7);
    setCursorYmd(lastBoundYear + '-' + monthPart + '-01');
  }, [lastBoundYear, yearInBounds, cursorYmd]);

  const months = monthsOfYear(yearOf(cursorYmd));
  const grid = buildMonthGrid(cursorYmd);
  const selectedIndex = indexOfYmd(eventDays, selectedYmd);
  const dayEvents = eventsOnDay(monthEvents, selectedYmd);
  const slideSpeed = prefersReducedMotion() ? 0 : SLIDE_MS;

  const selectDay = (ymd: string): void => {
    setSelectedYmd(ymd);
    if (ymd.substring(0, 7) !== cursorYmd.substring(0, 7)) {
      setCursorYmd(ymd);
    }
  };

  // Keep Swiper index in sync when selection changes outside the slider (month load / URL).
  React.useEffect(() => {
    if (syncingFromSwiper.current) {
      syncingFromSwiper.current = false;
      return;
    }
    const swiper = swiperRef.current;
    if (!swiper || selectedIndex < 0) {
      return;
    }
    if (swiper.activeIndex !== selectedIndex) {
      swiper.slideTo(selectedIndex, slideSpeed);
    }
  }, [selectedIndex, slideSpeed, eventDays]);

  const onYearPick = (year: number): void => {
    setOpenDd(undefined);
    const monthPart = cursorYmd.substring(5, 7);
    setCursorYmd(year + '-' + monthPart + '-01');
  };

  const onMonthPick = (monthYmd: string): void => {
    setOpenDd(undefined);
    setCursorYmd(monthYmd);
  };

  const hasEventDays = eventDays.length > 0;

  const calendarCard = (mobileTitle: boolean): JSX.Element => (
    <div className={styles.calendarCard}>
      <div className={styles.calCardLeft}>
        <h3>{mobileTitle ? 'Upcoming Events' : <span>Upcoming <br />Events</span>}</h3>
      </div>
      <div className={styles.calCardRight}>
        <img src={calendarArt} alt="" />
      </div>
    </div>
  );

  const renderDateStrip = (): JSX.Element => (
    <div
      className={`${styles.dateSlide} ${hasEventDays ? styles.hasEvents : styles.emptyEvents}`}
      aria-hidden={!hasEventDays ? true : undefined}
    >
      {hasEventDays ? (
        <>
          {/* Classic: .swiper.date-swiper > .swiper-wrapper > .swiper-slide > span.date */}
          <Swiper
            key={cursorYmd.substring(0, 7) + ':' + eventDays.length}
            modules={[Keyboard]}
            className={styles.dateSwiper}
            slidesPerView={7}
            spaceBetween={30}
            centeredSlides={true}
            slideToClickedSlide={true}
            initialSlide={selectedIndex < 0 ? 0 : selectedIndex}
            speed={slideSpeed}
            watchOverflow={true}
            keyboard={{ enabled: true, onlyInViewport: true }}
            breakpoints={{
              0: { slidesPerView: 3, spaceBetween: 20 },
              640: { slidesPerView: 5, spaceBetween: 20 },
              940: { slidesPerView: 7, spaceBetween: 30 }
            }}
            onSwiper={(instance: SwiperInstance) => {
              swiperRef.current = instance;
            }}
            onSlideChangeTransitionEnd={(instance: SwiperInstance) => {
              const day = eventDays[instance.activeIndex];
              if (!day || day === selectedYmd) {
                return;
              }
              syncingFromSwiper.current = true;
              selectDay(day);
            }}
          >
            {eventDays.map((day) => (
              <SwiperSlide key={day} className={styles.dateSlideItem}>
                <span
                  role="option"
                  tabIndex={0}
                  aria-selected={day === selectedYmd}
                  className={styles.stripDayLabel}
                  data-date={day}
                  onClick={() => {
                    const idx = indexOfYmd(eventDays, day);
                    if (idx >= 0) {
                      swiperRef.current?.slideTo(idx, slideSpeed);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' && e.key !== ' ') {
                      return;
                    }
                    e.preventDefault();
                    const idx = indexOfYmd(eventDays, day);
                    if (idx >= 0) {
                      swiperRef.current?.slideTo(idx, slideSpeed);
                    }
                  }}
                >
                  {formatDayChip(day)}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Classic: .outer-swiper > .swiper-button-next / .swiper-button-prev (absolute in .date-slide) */}
          <div className={styles.outerSwiper}>
            <button
              type="button"
              className={`${styles.stripNav} ${styles.stripNext}`}
              aria-label="Next event day"
              disabled={selectedIndex < 0 || selectedIndex >= eventDays.length - 1}
              onClick={() => swiperRef.current?.slideNext(slideSpeed)}
            >
              <StripChevronIcon direction="right" />
            </button>
            <button
              type="button"
              className={`${styles.stripNav} ${styles.stripPrev}`}
              aria-label="Previous event day"
              disabled={selectedIndex <= 0}
              onClick={() => swiperRef.current?.slidePrev(slideSpeed)}
            >
              <StripChevronIcon direction="left" />
            </button>
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <div>
      <div className={styles.newsContentsWrap}>
        <div className={styles.contentsWrap}>
          <div className={styles.contentDesc}>
            <h3 className={styles.eventsHeroTitle}>
              Watch out for our
              <br />
              upcoming events!
            </h3>
          </div>
          <img className={styles.contentImg} src={eventsHero} alt="" />
        </div>
      </div>

      <div className={styles.showOnMobile}>{calendarCard(true)}</div>

      <div className={styles.calWrapper}>
        <div className={styles.calLeft}>
          <div className={styles.hideOnMobile}>{calendarCard(false)}</div>
          {renderDateStrip()}
        </div>

        <div className={styles.calView}>
          <div className={styles.dateDropdowns}>
            <div className={styles.eventDd} ref={monthRef}>
              <button
                type="button"
                className={styles.selectedVal}
                aria-label="Select month"
                aria-expanded={openDd === 'month'}
                aria-haspopup="listbox"
                onClick={() => setOpenDd(openDd === 'month' ? undefined : 'month')}
              >
                <span className={styles.ddLabel}>{formatMonthShort(cursorYmd)}</span>
                <span className={styles.ddChevron} aria-hidden="true">
                  <DdChevronIcon />
                </span>
              </button>
              {openDd === 'month' && (
                <ul className={styles.ddList} role="listbox" aria-label="Months">
                  {months.map((m) => {
                    const selected = m.substring(0, 7) === cursorYmd.substring(0, 7);
                    return (
                      <li key={m} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={selected ? styles.ddSelected : undefined}
                          onClick={() => onMonthPick(m)}
                        >
                          {formatMonthShort(m)}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className={styles.eventDd} ref={yearRef}>
              <button
                type="button"
                className={styles.selectedVal}
                aria-label="Select year"
                aria-expanded={openDd === 'year'}
                aria-haspopup="listbox"
                disabled={!years.length}
                onClick={() => {
                  if (!years.length) {
                    return;
                  }
                  setOpenDd(openDd === 'year' ? undefined : 'year');
                }}
              >
                <span className={styles.ddLabel}>{yearLabel}</span>
                <span className={styles.ddChevron} aria-hidden="true">
                  <DdChevronIcon />
                </span>
              </button>
              {openDd === 'year' && years.length > 0 && (
                <ul className={styles.ddList} role="listbox" aria-label="Years">
                  {years.map((y) => {
                    const selected = y === yearOf(cursorYmd);
                    return (
                      <li key={y} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={selected}
                          className={selected ? styles.ddSelected : undefined}
                          onClick={() => onYearPick(y)}
                        >
                          {y}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          {monthStatus === 'error' && (
            <p className={styles.statusMsg} role="alert">Unable to load events.</p>
          )}

          <div className={styles.monthCal} role="grid" aria-label="Events calendar">
            <div className={styles.calHead} role="row">
              {WEEKDAYS.map((d) => (
                <div key={d} className={styles.calDow} role="columnheader">{d}</div>
              ))}
            </div>
            <div className={styles.calBody}>
              {grid.map((cell) => {
                // Display-only: marks mirror slider eventDays (same monthEvents source).
                const dayEventsCell = eventsOnDay(monthEvents, cell.ymd);
                const hasEvent = dayEventsCell.length > 0;
                const first = hasEvent ? dayEventsCell[0] : undefined;
                const flags = first ? eventRangeFlags(first, cell.ymd) : { isStart: false, isEnd: false };
                const isPast = compareYmd(cell.ymd, today) < 0;
                const isToday = cell.ymd === today;
                const singleDay = flags.isStart && flags.isEnd;
                const cellClass = [
                  styles.calCell,
                  hasEvent ? styles.isEvent : '',
                  flags.isStart ? styles.isStart : '',
                  flags.isEnd ? styles.isEnd : '',
                  singleDay ? styles.isSingle : '',
                  hasEvent && !flags.isStart && !flags.isEnd ? styles.isBetween : '',
                  hasEvent && isPast ? styles.isPast : '',
                  isToday ? styles.isToday : '',
                  !cell.inMonth ? styles.outMonth : ''
                ].join(' ');
                return (
                  <div
                    key={cell.ymd}
                    role="gridcell"
                    aria-label={
                      hasEvent
                        ? formatLongDay(cell.ymd) + ' (has event)'
                        : formatLongDay(cell.ymd)
                    }
                    className={cellClass}
                  >
                    <span className={styles.calNum}>{cell.dayNum}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.eventsContents}>
        {monthStatus === 'loading' || boundsStatus === 'loading' ? (
          <p className={styles.statusMsg} role="status">Loading events…</p>
        ) : monthStatus === 'error' ? (
          <div className={styles.emptyEvent} role="alert">Unable to load events. Check the Events list title and permissions.</div>
        ) : !eventDays.length ? (
          <div className={styles.emptyEvent}>There are no events this month</div>
        ) : !dayEvents.length ? (
          <div className={styles.emptyEvent}>There is no event on {formatLongDay(selectedYmd)}</div>
        ) : (
          dayEvents.map((ev) => {
            const start = formatEventClock(ev.startDate);
            const end = formatEventClock(ev.endDate);
            const past = isEventPast(ev);
            return (
              <article
                key={ev.id}
                id={'event-' + ev.id}
                className={`${styles.eventRow} ${past ? styles.timePastEvent : ''}`}
              >
                <div className={styles.eventWhen}>
                  <div className={styles.lineWrap} aria-hidden="true">
                    <div className={styles.dot} />
                    <div className={styles.line} />
                  </div>
                  <div className={styles.dateText}>
                    {start.timeNumber} <sup>{start.meridiem} (SGT)</sup>
                    <br />
                    <span className={styles.dash} />
                    <br />
                    {end.timeNumber} <sup>{end.meridiem} (SGT)</sup>
                  </div>
                </div>
                <div className={styles.eventBody}>
                  <h3 className={styles.eventTitle}>{ev.title}</h3>
                  {ev.classId && <p className={styles.eventMeta}>Class ID - {ev.classId}</p>}
                  {ev.courseId && <p className={styles.eventMeta}>Course ID - {ev.courseId}</p>}
                </div>
                <div className={styles.eventActions}>
                  <span className={styles.saveTheDate} aria-disabled="true">Save the date</span>
                  {ev.joinLink && (
                    <a className={styles.join} href={ev.joinLink} target="_blank" rel="noopener noreferrer">
                      Join
                    </a>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EventsView;
