import * as React from 'react';
import styles from './JitPack.module.scss';
import type { IJitPackProps } from './IJitPackProps';
import SiteHeader from '../../../shared/chrome/SiteHeader';
import SiteFooter from '../../../shared/chrome/SiteFooter';
import { chromeAssets } from '../../../shared/chrome/chromeAssets';
import { usePageChromeFlags } from '../../../shared/pageChrome';
import {
  DEFAULT_JIT_LIST_TITLES,
  loadJitPackSections,
  loadToolsSections,
  loadMtjAgileSections,
  type IJitAccordionSection,
  type IJitCardItem
} from '../../../shared/services/jitPackService';
import {
  additionalInfoColumns,
  additionalInfoSectionHeading,
  type IAdditionalInfoColumn,
  type IAdditionalInfoItem,
  type IContentLink as IAdditionalInfoLink
} from '../content/additionalInfoContent';
import {
  agileTrainingCourses,
  agileTrainingExpandHint,
  agileTrainingIntroParagraphs,
  agileTrainingLearningHubLink,
  agileTrainingSectionHeading,
  learningPathwayIntroParagraphs,
  trainingInnerTabs,
  type AccordionBlock,
  type IListItem,
  type ITrainingCourse
} from '../content/trainingContent';
import {
  guildCharacteristics,
  guildClosingParagraph,
  guildIntroParagraphs,
  guildPurposeHeading,
  type IGuildCharacteristic
} from '../content/guildContent';

/* eslint-disable @typescript-eslint/no-var-requires */
const bannerImg = require('../assets/banner-img.png') as string;
const innerTabImg = require('../assets/inner-tab-img.png') as string;
/* eslint-enable @typescript-eslint/no-var-requires */

type OuterTabKey = 'selfHelp' | 'training' | 'guild';
type SelfHelpInner = 'jit' | 'tools' | 'mtj' | 'additional';
type TrainingInner = 'agileTraining' | 'learningPathway';

/** Unique gradient id for JIT Pack inner-tab active SVG strokes. */
const INNER_TAB_ICON_GRAD_ID = 'aeJitInnerTabIconGrad';

interface IOuterTabItem {
  key: OuterTabKey;
  label: string;
}

interface ISelfHelpTabItem {
  key: SelfHelpInner;
  label: string;
  icon?: React.ReactNode;
  intro?: string;
}

const outerTabs: IOuterTabItem[] = [
  { key: 'selfHelp', label: 'Self-help' },
  { key: 'training', label: 'Agile Training' },
  { key: 'guild', label: 'DBS Agile Guild' }
];

const InnerTabIconPack: React.FC = () => (
  <svg
    className={styles.innerTabIcon}
    width={22}
    height={18}
    viewBox="0 0 22 18"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M19.25 4.5L18.625 15.132C18.5913 15.705 18.3399 16.2436 17.9222 16.6373C17.5045 17.031 16.952 17.2502 16.378 17.25H5.622C5.04796 17.2502 4.49555 17.031 4.07783 16.6373C3.66011 16.2436 3.40868 15.705 3.375 15.132L2.75 4.5M9 8.25H13M2.375 4.5H19.625C20.246 4.5 20.75 3.996 20.75 3.375V1.875C20.75 1.254 20.246 0.75 19.625 0.75H2.375C1.754 0.75 1.25 1.254 1.25 1.875V3.375C1.25 3.996 1.754 4.5 2.375 4.5Z"
      stroke="#766767"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InnerTabIconWrench: React.FC = () => (
  <svg
    className={styles.innerTabIcon}
    width={22}
    height={22}
    viewBox="0 0 22 22"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M20.75 5.75C20.7501 6.37335 20.6206 6.98992 20.3699 7.56061C20.1191 8.1313 19.7525 8.64367 19.2934 9.06524C18.8342 9.48681 18.2924 9.80839 17.7024 10.0096C17.1125 10.2108 16.4871 10.2872 15.866 10.234C14.79 10.143 13.602 10.305 12.916 11.138L5.76402 19.822C5.53841 20.097 5.25772 20.3217 4.94002 20.4817C4.62231 20.6417 4.27463 20.7334 3.91935 20.7508C3.56407 20.7683 3.20907 20.7112 2.87719 20.5832C2.54531 20.4552 2.24391 20.2592 1.99239 20.0076C1.74086 19.7561 1.54479 19.4547 1.41679 19.1228C1.28878 18.791 1.23169 18.436 1.24917 18.0807C1.26666 17.7254 1.35834 17.3777 1.51832 17.06C1.67829 16.7423 1.90301 16.4616 2.17802 16.236L10.862 9.084C11.695 8.398 11.857 7.21 11.766 6.134C11.6989 5.35218 11.8374 4.56638 12.1677 3.8546C12.4981 3.14282 13.0088 2.52979 13.6492 2.07635C14.2896 1.62291 15.0375 1.34483 15.8186 1.26969C16.5997 1.19455 17.3869 1.32497 18.102 1.648L14.826 4.924C14.9528 5.4721 15.2309 5.97359 15.6286 6.37138C16.0264 6.76917 16.5279 7.04727 17.076 7.174L20.352 3.898C20.608 4.463 20.75 5.09 20.75 5.75Z"
      stroke="#766767"
      strokeOpacity="1"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InnerTabIconDocument: React.FC = () => (
  <svg
    className={styles.innerTabIcon}
    width={18}
    height={22}
    viewBox="0 0 18 22"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M6 11H9.75M6 14H9.75M6 17H9.75M12.75 17.75H15C15.5967 17.75 16.169 17.5129 16.591 17.091C17.0129 16.669 17.25 16.0967 17.25 15.5V5.108C17.25 3.973 16.405 3.01 15.274 2.916C14.9 2.88498 14.5256 2.85831 14.151 2.836M14.151 2.836C14.2174 3.05109 14.2501 3.27491 14.25 3.5C14.25 3.69891 14.171 3.88968 14.0303 4.03033C13.8897 4.17098 13.6989 4.25 13.5 4.25H9C8.586 4.25 8.25 3.914 8.25 3.5C8.25 3.269 8.285 3.046 8.35 2.836M14.151 2.836C13.868 1.918 13.012 1.25 12 1.25H10.5C10.0192 1.25011 9.55115 1.40414 9.16426 1.68954C8.77738 1.97493 8.49203 2.3767 8.35 2.836M8.35 2.836C7.974 2.859 7.6 2.886 7.226 2.916C6.095 3.01 5.25 3.973 5.25 5.108V7.25M5.25 7.25H1.875C1.254 7.25 0.75 7.754 0.75 8.375V19.625C0.75 20.246 1.254 20.75 1.875 20.75H11.625C12.246 20.75 12.75 20.246 12.75 19.625V8.375C12.75 7.754 12.246 7.25 11.625 7.25H5.25ZM3.75 11H3.758V11.008H3.75V11ZM3.75 14H3.758V14.008H3.75V14ZM3.75 17H3.758V17.008H3.75V17Z"
      stroke="#766767"
      strokeOpacity="1"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const selfHelpTabs: ISelfHelpTabItem[] = [
  {
    key: 'jit',
    label: 'JIT Training Packs',
    icon: <InnerTabIconPack />,
    intro: 'Click on each section to download the JIT Training Packs'
  },
  {
    key: 'tools',
    label: 'Tools and Templates',
    icon: <InnerTabIconWrench />,
    intro: 'Click on each section to download the tools and templates.'
  },
  {
    key: 'mtj',
    label: 'MtJ - Agile',
    intro: 'Click on each section to download the MtJ-Agile Guides.'
  },
  {
    key: 'additional',
    label: 'Additional Information',
    icon: <InnerTabIconDocument />
  }
];

const visibleTrainingTabs = trainingInnerTabs.filter(
  (tab: { key: string; tabHidden?: boolean }) => !tab.tabHidden
) as Array<{ key: TrainingInner; label: string }>;

const InnerTabIconGradientDefs: React.FC = () => (
  <svg className={styles.srOnly} width={0} height={0} aria-hidden="true" focusable="false">
    <defs>
      <linearGradient
        id={INNER_TAB_ICON_GRAD_ID}
        x1="1.25"
        y1="0.75"
        x2="20.8045"
        y2="0.814867"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#ED1C24" />
        <stop offset="1" stopColor="#9747FF" />
      </linearGradient>
    </defs>
  </svg>
);

function sectionKey(section: IJitAccordionSection): string {
  return String(section.category.id);
}

interface IPackCardProps {
  card: IJitCardItem;
}

const PackCard: React.FC<IPackCardProps> = ({ card }) => {
  const title = card.title;
  const className = card.isLong ? styles.longCard : styles.shortCard;

  const inner = card.isLong ? (
    <div className={styles.cardInner}>
      <div className={`${styles.cardLeft} ${styles.textPositionBottom}`}>
        <h4 className={styles.cardTitle}>{title}</h4>
      </div>
      <div className={styles.cardRight}>
        <div
          className={styles.cardBgImg}
          style={
            card.imageUrl && !/[\\"')\s]/.test(card.imageUrl)
              ? { backgroundImage: 'url("' + card.imageUrl + '")' }
              : undefined
          }
          aria-hidden="true"
        />
      </div>
    </div>
  ) : (
    <div className={`${styles.cardInner} ${styles.textPositionBottom}`}>
      <h4 className={styles.shortCardTitle}>{title}</h4>
    </div>
  );

  if (card.href) {
    return (
      <a
        className={className}
        href={card.href}
        download={card.isDownload ? true : undefined}
        target={card.openInNewTab ? '_blank' : undefined}
        rel={card.openInNewTab ? 'noopener noreferrer' : undefined}
      >
        {inner}
      </a>
    );
  }

  return <div className={className}>{inner}</div>;
};

interface IPackAccordionProps {
  sections: IJitAccordionSection[];
  openKeys: string[];
  onToggle: (key: string) => void;
  loading: boolean;
  error: string | undefined;
  idPrefix: string;
}

const PackAccordion: React.FC<IPackAccordionProps> = ({
  sections,
  openKeys,
  onToggle,
  loading,
  error,
  idPrefix
}) => {
  if (loading) {
    return (
      <div className={styles.loadingWrap} role="status">
        Loading…
      </div>
    );
  }

  if (error) {
    return (
      <p className={styles.errorMsg} role="alert">
        {error}
      </p>
    );
  }

  if (!sections.length) {
    return <p className={styles.emptyMsg}>No items found.</p>;
  }

  return (
    <section className={styles.accordionSection} aria-label="Download packs">
      <ul className={styles.accordion}>
        {sections.map((section: IJitAccordionSection) => {
          const key = sectionKey(section);
          const isOpen = openKeys.indexOf(key) >= 0;
          const buttonId = `${idPrefix}-acc-btn-${key}`;
          const panelId = `${idPrefix}-acc-panel-${key}`;
          return (
            <li
              key={key}
              className={
                isOpen ? `${styles.accordionItem} ${styles.accordionItemOpen}` : styles.accordionItem
              }
            >
              <button
                type="button"
                id={buttonId}
                className={styles.accordionTitle}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(key)}
              >
                {section.category.title}
                <span className={styles.accordionChevron} aria-hidden="true" />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={
                  isOpen
                    ? `${styles.accordionPanel} ${styles.accordionPanelOpen}`
                    : styles.accordionPanel
                }
                aria-hidden={!isOpen}
              >
                <div className={styles.accordionBody}>
                  <div className={styles.cardWrapper}>
                    {section.cards.map((card: IJitCardItem) => (
                      <PackCard key={card.id} card={card} />
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

const renderAccordionBlock = (block: AccordionBlock, blockKey: string): React.ReactNode => {
  if (block.type === 'paragraph') {
    return (
      <p key={blockKey}>
        {block.italic ? <em>{block.text}</em> : block.text}
      </p>
    );
  }

  if (block.type === 'heading') {
    return <h4 key={blockKey}>{block.text}</h4>;
  }

  return (
    <ul key={blockKey}>
      {block.items.map((item: IListItem, index: number) => (
        <li key={`${blockKey}-li-${index}`}>
          {item.text}
          {item.link ? (
            <>
              {' '}
              <a
                className={styles.digifyLink}
                href={item.link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.link.label}
              </a>
            </>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

interface ITextAccordionProps {
  courses: ITrainingCourse[];
  openKeys: string[];
  onToggle: (key: string) => void;
}

const TextAccordion: React.FC<ITextAccordionProps> = ({ courses, openKeys, onToggle }) => (
  /* Classic: section.accordion-cards-section > ul.accordion (no nested uk-container) */
  <section className={styles.accordionSection} aria-label="Agile Training courses">
    <ul className={styles.textAccordion}>
      {courses.map((course: ITrainingCourse, courseIndex: number) => {
        const key = `course-${courseIndex}`;
        const isOpen = openKeys.indexOf(key) >= 0;
        const buttonId = `training-course-btn-${courseIndex}`;
        const panelId = `training-course-panel-${courseIndex}`;
        return (
          <li
            key={key}
            className={
              isOpen
                ? `${styles.textAccordionItem} ${styles.accordionItemOpen}`
                : styles.textAccordionItem
            }
          >
            <button
              type="button"
              id={buttonId}
              className={styles.textAccordionTitle}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(key)}
            >
              {course.title}
              <span className={styles.accordionChevron} aria-hidden="true" />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={
                isOpen
                  ? `${styles.accordionPanel} ${styles.accordionPanelOpen}`
                  : styles.accordionPanel
              }
              aria-hidden={!isOpen}
            >
              {/* Shell has no padding so grid 0fr collapses to 0 like classic hidden content */}
              <div className={styles.textAccordionBody}>
                <div className={styles.textAccordionBodyInner}>
                  {course.blocks.map((block: AccordionBlock, blockIndex: number) =>
                    renderAccordionBlock(block, `${key}-block-${blockIndex}`)
                  )}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);

const AdditionalInfoPanel: React.FC = () => (
  <div className={styles.additionalInfo}>
    <h3 className={styles.additionalInfoHeading}>{additionalInfoSectionHeading}</h3>
    <div className={styles.additionalInfoGrid}>
      {additionalInfoColumns.map((column: IAdditionalInfoColumn) => (
        <div key={column.key} className={styles.additionalInfoColumn}>
          <div className={styles.additionalInfoColumnHeading}>{column.heading}</div>
          {column.items.map((item: IAdditionalInfoItem, itemIndex: number) => (
            <div key={`${column.key}-${itemIndex}`} className={styles.additionalInfoItem}>
              {item.description}
              {item.isNew ? (
                <>
                  {' '}
                  <strong>*NEW*</strong>
                </>
              ) : null}
              {item.links.map((link: IAdditionalInfoLink, linkIndex: number) => {
                const hasHref = Boolean(link.href && link.href.trim());
                return (
                  <div key={`${column.key}-${itemIndex}-link-${linkIndex}`} className={styles.btnLink}>
                    {hasHref ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label}
                      </a>
                    ) : (
                      <span aria-disabled="true">{link.label}</span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const initialCourseOpenKeys: string[] = agileTrainingCourses
  .map((course: ITrainingCourse, index: number) =>
    course.initiallyOpen ? `course-${index}` : ''
  )
  .filter((key: string) => key.length > 0);

const JitPack: React.FC<IJitPackProps> = (props) => {
  const {
    homeUrl,
    newsEventsUrl,
    aboutUrl,
    agility101Url,
    jitPackUrl,
    contactEmail,
    renderOwnChrome,
    jitPacksListTitle,
    jitPacksCategoryListTitle,
    toolsListTitle,
    toolsCategoryListTitle,
    mtjAgileListTitle,
    mtjAgileCategoryListTitle,
    spHttpClient,
    webAbsoluteUrl,
    webServerRelativeUrl,
    pageServerRelativeUrl,
    listId,
    listItemId
  } = props;

  const [activeOuterTab, setActiveOuterTab] = React.useState<OuterTabKey>('selfHelp');
  const [activeSelfHelpInner, setActiveSelfHelpInner] = React.useState<SelfHelpInner>('jit');
  const [activeTrainingInner, setActiveTrainingInner] = React.useState<TrainingInner>('agileTraining');

  const [jitSections, setJitSections] = React.useState<IJitAccordionSection[]>([]);
  const [toolsSections, setToolsSections] = React.useState<IJitAccordionSection[]>([]);
  const [mtjSections, setMtjSections] = React.useState<IJitAccordionSection[]>([]);
  const [loadingJit, setLoadingJit] = React.useState<boolean>(true);
  const [loadingTools, setLoadingTools] = React.useState<boolean>(true);
  const [loadingMtj, setLoadingMtj] = React.useState<boolean>(true);
  const [errorJit, setErrorJit] = React.useState<string | undefined>(undefined);
  const [errorTools, setErrorTools] = React.useState<string | undefined>(undefined);
  const [errorMtj, setErrorMtj] = React.useState<string | undefined>(undefined);

  const [openJitKeys, setOpenJitKeys] = React.useState<string[]>([]);
  const [openToolsKeys, setOpenToolsKeys] = React.useState<string[]>([]);
  const [openMtjKeys, setOpenMtjKeys] = React.useState<string[]>([]);
  const [openCourseKeys, setOpenCourseKeys] = React.useState<string[]>(initialCourseOpenKeys);

  const chromeFlags = usePageChromeFlags(renderOwnChrome, spHttpClient, webAbsoluteUrl, {
    listId,
    listItemId,
    pageServerRelativeUrl,
    webServerRelativeUrl
  });
  const showHeader = renderOwnChrome && chromeFlags.showHeader;
  const showFooter = renderOwnChrome && chromeFlags.showFooter;

  React.useEffect(() => {
    let cancelled = false;

    const lists = {
      jitPacks: jitPacksListTitle || DEFAULT_JIT_LIST_TITLES.jitPacks,
      jitPacksCategory: jitPacksCategoryListTitle || DEFAULT_JIT_LIST_TITLES.jitPacksCategory,
      tools: toolsListTitle || DEFAULT_JIT_LIST_TITLES.tools,
      toolsCategory: toolsCategoryListTitle || DEFAULT_JIT_LIST_TITLES.toolsCategory,
      mtjAgile: mtjAgileListTitle || DEFAULT_JIT_LIST_TITLES.mtjAgile,
      mtjAgileCategory: mtjAgileCategoryListTitle || DEFAULT_JIT_LIST_TITLES.mtjAgileCategory
    };

    setLoadingJit(true);
    setLoadingTools(true);
    setLoadingMtj(true);
    setErrorJit(undefined);
    setErrorTools(undefined);
    setErrorMtj(undefined);

    loadJitPackSections(spHttpClient, webAbsoluteUrl, lists)
      .then((sections: IJitAccordionSection[]) => {
        if (!cancelled) {
          setJitSections(sections);
          setLoadingJit(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorJit('Unable to load JIT Training Packs.');
          setLoadingJit(false);
        }
      });

    loadToolsSections(spHttpClient, webAbsoluteUrl, lists)
      .then((sections: IJitAccordionSection[]) => {
        if (!cancelled) {
          setToolsSections(sections);
          setLoadingTools(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorTools('Unable to load Tools and Templates.');
          setLoadingTools(false);
        }
      });

    loadMtjAgileSections(spHttpClient, webAbsoluteUrl, lists)
      .then((sections: IJitAccordionSection[]) => {
        if (!cancelled) {
          setMtjSections(sections);
          setLoadingMtj(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMtj('Unable to load MtJ - Agile guides.');
          setLoadingMtj(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    spHttpClient,
    webAbsoluteUrl,
    jitPacksListTitle,
    jitPacksCategoryListTitle,
    toolsListTitle,
    toolsCategoryListTitle,
    mtjAgileListTitle,
    mtjAgileCategoryListTitle
  ]);

  const toggleKey = React.useCallback(
    (setter: React.Dispatch<React.SetStateAction<string[]>>, key: string): void => {
      setter((prev: string[]) => {
        if (prev.indexOf(key) >= 0) {
          return prev.filter((item: string) => item !== key);
        }
        return prev.concat([key]);
      });
    },
    []
  );

  const currentSelfHelpTab =
    selfHelpTabs.filter((tab: ISelfHelpTabItem) => tab.key === activeSelfHelpInner)[0] ||
    selfHelpTabs[0];

  const renderSelfHelpPackPanel = (
    tabKey: SelfHelpInner,
    intro: string | undefined,
    sections: IJitAccordionSection[],
    openKeys: string[],
    onToggle: (key: string) => void,
    loading: boolean,
    error: string | undefined
  ): React.ReactNode => (
    <>
      <div
        className={styles.innerPanel}
        id={`inner-panel-selfHelp-${tabKey}`}
        role="tabpanel"
        aria-labelledby={`inner-tab-selfHelp-${tabKey}`}
      >
        <div className={styles.innerContent}>
          <div className={styles.innerCopy}>{intro ? <p>{intro}</p> : null}</div>
          <div className={styles.innerVisual}>
            <img src={innerTabImg} alt="" />
          </div>
        </div>
      </div>
      <PackAccordion
        sections={sections}
        openKeys={openKeys}
        onToggle={onToggle}
        loading={loading}
        error={error}
        idPrefix={tabKey}
      />
    </>
  );

  return (
    <div className={styles.jitPack}>
      <section>
        <div className={styles.mainContainer}>
          <div className={styles.headerBanner}>
            {showHeader && (
              <SiteHeader
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
              />
            )}

            <section className={styles.heroCard} aria-labelledby="jit-pack-hero-heading">
              <div className={styles.heroImageWrap}>
                <img src={bannerImg} alt="Agile Practices for Deep Learners banner illustration" />
              </div>
              <div className={styles.heroContent}>
                <div className={styles.heroCopy}>
                  <h1 id="jit-pack-hero-heading">Agile Practices for Deep Learners</h1>
                  <p className={styles.heroBody}>Download Just-In-Time (JIT) training packs</p>
                  <p className={styles.heroBody}>Find out more about training and workshops</p>
                  <p className={styles.heroBody}>Join our Agile Community</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className={styles.tabsSection} aria-labelledby="jit-pack-tabs-heading">
        <div className={styles.container}>
          <h2 id="jit-pack-tabs-heading" className={styles.srOnly}>
            JIT Pack topics
          </h2>

          <div className={styles.tabs}>
            <div className={styles.outerTabs} role="tablist" aria-label="JIT Pack topic groups">
              {outerTabs.map((tab: IOuterTabItem) => {
                const isSelected = tab.key === activeOuterTab;
                return (
                  <div
                    key={tab.key}
                    className={
                      isSelected
                        ? `${styles.outerTabItem} ${styles.outerTabItemActive}`
                        : styles.outerTabItem
                    }
                    role="none"
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`outer-tab-${tab.key}`}
                      aria-selected={isSelected}
                      aria-controls={`outer-panel-${tab.key}`}
                      className={
                        isSelected ? `${styles.outerTab} ${styles.outerTabActive}` : styles.outerTab
                      }
                      onClick={() => setActiveOuterTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                    <div className={styles.outerTabShape} aria-hidden="true" />
                  </div>
                );
              })}
            </div>

            <div
              className={`${styles.outerPanel} ${styles.outerPanelOnPage}`}
              id={`outer-panel-${activeOuterTab}`}
              role="tabpanel"
              aria-labelledby={`outer-tab-${activeOuterTab}`}
            >
              {activeOuterTab === 'selfHelp' && (
                <>
                  <div className={styles.innerTabs} role="tablist" aria-label="Self-help topics">
                    <InnerTabIconGradientDefs />
                    {selfHelpTabs.map((item: ISelfHelpTabItem) => {
                      const isSelected = item.key === currentSelfHelpTab.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          role="tab"
                          id={`inner-tab-selfHelp-${item.key}`}
                          aria-selected={isSelected}
                          aria-controls={`inner-panel-selfHelp-${item.key}`}
                          className={
                            isSelected
                              ? `${styles.innerTab} ${styles.innerTabActive}`
                              : styles.innerTab
                          }
                          onClick={() => setActiveSelfHelpInner(item.key)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activeSelfHelpInner === 'jit' &&
                    renderSelfHelpPackPanel(
                      'jit',
                      currentSelfHelpTab.intro,
                      jitSections,
                      openJitKeys,
                      (key: string) => toggleKey(setOpenJitKeys, key),
                      loadingJit,
                      errorJit
                    )}

                  {activeSelfHelpInner === 'tools' &&
                    renderSelfHelpPackPanel(
                      'tools',
                      selfHelpTabs[1].intro,
                      toolsSections,
                      openToolsKeys,
                      (key: string) => toggleKey(setOpenToolsKeys, key),
                      loadingTools,
                      errorTools
                    )}

                  {activeSelfHelpInner === 'mtj' &&
                    renderSelfHelpPackPanel(
                      'mtj',
                      selfHelpTabs[2].intro,
                      mtjSections,
                      openMtjKeys,
                      (key: string) => toggleKey(setOpenMtjKeys, key),
                      loadingMtj,
                      errorMtj
                    )}

                  {activeSelfHelpInner === 'additional' && (
                    <div
                      className={styles.innerPanel}
                      id="inner-panel-selfHelp-additional"
                      role="tabpanel"
                      aria-labelledby="inner-tab-selfHelp-additional"
                    >
                      <AdditionalInfoPanel />
                    </div>
                  )}
                </>
              )}

              {activeOuterTab === 'training' && (
                <>
                  <div
                    className={styles.innerTabs}
                    role="tablist"
                    aria-label="Agile Training topics"
                  >
                    <InnerTabIconGradientDefs />
                    {visibleTrainingTabs.map((tab: { key: TrainingInner; label: string }) => {
                      const isSelected = tab.key === activeTrainingInner;
                      return (
                        <button
                          key={tab.key}
                          type="button"
                          role="tab"
                          id={`inner-tab-training-${tab.key}`}
                          aria-selected={isSelected}
                          aria-controls={`inner-panel-training-${tab.key}`}
                          className={
                            isSelected
                              ? `${styles.innerTab} ${styles.innerTabActive}`
                              : styles.innerTab
                          }
                          onClick={() => setActiveTrainingInner(tab.key)}
                        >
                          {tab.key === 'agileTraining' ? <InnerTabIconPack /> : <InnerTabIconWrench />}
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {activeTrainingInner === 'agileTraining' && (
                    <div
                      className={styles.trainingPanel}
                      id="inner-panel-training-agileTraining"
                      role="tabpanel"
                      aria-labelledby="inner-tab-training-agileTraining"
                    >
                      {agileTrainingIntroParagraphs.map((paragraph: string, index: number) => (
                        <p key={`training-intro-${index}`}>{paragraph}</p>
                      ))}
                      <div className={styles.btnLink}>
                        <a
                          href={agileTrainingLearningHubLink.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {agileTrainingLearningHubLink.label}
                        </a>
                      </div>
                      <h3 className={styles.trainingHeading}>{agileTrainingSectionHeading}</h3>
                      <p className={styles.trainingHint}>{agileTrainingExpandHint}</p>
                      <TextAccordion
                        courses={agileTrainingCourses}
                        openKeys={openCourseKeys}
                        onToggle={(key: string) => toggleKey(setOpenCourseKeys, key)}
                      />
                    </div>
                  )}

                  {activeTrainingInner === 'learningPathway' && (
                    <div
                      className={styles.innerPanel}
                      id="inner-panel-training-learningPathway"
                      role="tabpanel"
                      aria-labelledby="inner-tab-training-learningPathway"
                    >
                      <div className={styles.innerContent}>
                        <div className={styles.innerCopy}>
                          {learningPathwayIntroParagraphs.map((paragraph: string, index: number) => (
                            <p key={`pathway-intro-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                        <div className={styles.innerVisual}>
                          <img src={innerTabImg} alt="" />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeOuterTab === 'guild' && (
                <div className={styles.guildPanel}>
                  {guildIntroParagraphs.map((paragraph: string, index: number) => (
                    <p key={`guild-intro-${index}`}>{paragraph}</p>
                  ))}
                  <p className={styles.textBold}>{guildPurposeHeading}</p>
                  {guildCharacteristics.map((item: IGuildCharacteristic) => (
                    <p key={item.label}>
                      <span className={styles.textBold}>{item.label}</span>
                      {': '}
                      {item.text}
                    </p>
                  ))}
                  <p>{guildClosingParagraph}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {showFooter && <SiteFooter contactEmail={contactEmail} mailIconSrc={chromeAssets.iconMail} />}
    </div>
  );
};

export default JitPack;
