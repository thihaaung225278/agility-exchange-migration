import * as React from 'react';
import styles from './Agility101.module.scss';
import type { IAgility101Props } from './IAgility101Props';
import SiteHeader from '../../../shared/chrome/SiteHeader';
import SiteFooter from '../../../shared/chrome/SiteFooter';
import { chromeAssets } from '../../../shared/chrome/chromeAssets';
import { usePageChromeFlags } from '../../../shared/pageChrome';

/* eslint-disable @typescript-eslint/no-var-requires */
const bannerImg = require('../assets/banner-img.webp') as string;
const bgImage1 = require('../assets/bg-image-1.png') as string;
const innerTabImg = require('../assets/inner-tab-img.webp') as string;
const leftCardImg = require('../assets/left-card-img.webp') as string;
const rightCardImg = require('../assets/right-card-img.webp') as string;
const iconMindset = require('../assets/inner-tab-icon-1.webp') as string;
const iconValues = require('../assets/inner-tab-icon-2.webp') as string;
const iconPrinciple = require('../assets/inner-tab-icon-3.webp') as string;
const iconPractice = require('../assets/inner-tab-icon-4.webp') as string;
const fourIcon1 = require('../assets/four-icon-1.webp') as string;
const fourIcon2 = require('../assets/four-icon-2.webp') as string;
const fourIcon3 = require('../assets/four-icon-3.webp') as string;
const fourIcon4 = require('../assets/four-icon-4.webp') as string;
const threeIcon1 = require('../assets/three-icon-1.webp') as string;
const threeIcon2 = require('../assets/three-icon-2.webp') as string;
const threeIcon3 = require('../assets/three-icon-3.webp') as string;
const howContentImg = require('../assets/how-content-img.webp') as string;
const fixedBrainImg = require('../assets/fixed.webp') as string;
const growthBrainImg = require('../assets/growth.webp') as string;
/* eslint-enable @typescript-eslint/no-var-requires */

type OuterTabKey = 'what' | 'why' | 'how';
type InnerTabKey = 'mindset' | 'values' | 'principle' | 'practice';

interface IInnerTabItem {
  key: InnerTabKey;
  label: string;
  icon: string;
  title: string;
  paragraphs: string[];
}

interface IOuterTabItem {
  key: OuterTabKey;
  label: string;
}

interface ITopicIcon {
  src: string;
  label: string;
}

const mindsetParagraphs: string[] = [
  'The Agile mindset is the foundation that supports the values, principles, practices and tools, that allows us to deliver work in an agile way. It helps us to imagine, design and deliver solutions to complex problems faster, better & cheaper than traditional approaches.',
  'At the enterprise level, it is a culture: the way we succeed at getting things done. It is also commonly described as a Growth Mindset and contrasted with a Fixed Mindset.'
];

const placeholderParagraphs: string[] = [
  'The agile mindset is the foundation that supports the values, principles, practices, and tools that allows us to deliver work in an agile way. It helps us to imagine, design, and deliver solutions to complex problems faster, better, and cheaper than traditional approaches.',
  'At the enterprise level, it is a culture: the way we succeed at getting things done. It is also commonly described as a Growth Mindset and contrasted with a Fixed Mindset.'
];

const fixedMindsetPoints: string[] = [
  'Desire to avoid failure in every situation regardless of the changes',
  'Avoids challenges and obstacles because of risk of failure, stick to what they know and can do',
  'Failure gives an impression of lack of competence, therefore quick to blame and be defensive',
  'Feedback and criticism hurts the individual as it impacts self-image',
  "Doesn't welcome change or learn so they prefer to push away the change as much as possible"
];

const growthMindsetPoints: string[] = [
  'Desire continuous learning. Take risks and learn.',
  'Embracing challenges because we will learn something new',
  'Not afraid to fail - an opportunity to learn.',
  'Prioritise learning and mastery',
  'Focus on outcomes vs output',
  'Elicit feedback as a source of new information and learning.'
];

const mindsetShiftRows: Array<{ from: string; to: string }> = [
  { from: 'How', to: 'Why' },
  { from: 'Output', to: 'Outcome' },
  { from: 'More is Better', to: 'Less is Best' },
  { from: 'Knowledge', to: 'Experience and Creativity' },
  { from: 'Measuring constraints', to: 'Measuring value' },
  { from: 'Procedures', to: 'Sense making' },
  { from: 'Past focus', to: 'Future focus' },
  { from: 'Controlling risk', to: 'Possibility' },
  { from: 'High-cost, low value perfection', to: 'Excellence' },
  { from: 'Resource assignment', to: 'Capability alignment' }
];

const innerTabItems: IInnerTabItem[] = [
  { key: 'mindset', label: 'Mindset', icon: iconMindset, title: 'Agile Foundation', paragraphs: mindsetParagraphs },
  { key: 'values', label: 'Values', icon: iconValues, title: 'Agile Foundation 2', paragraphs: placeholderParagraphs },
  { key: 'principle', label: 'Principle', icon: iconPrinciple, title: 'Agile Foundation 3', paragraphs: placeholderParagraphs },
  { key: 'practice', label: 'Practice', icon: iconPractice, title: 'Agile Foundation 4', paragraphs: placeholderParagraphs }
];

const outerTabs: IOuterTabItem[] = [
  { key: 'what', label: 'What' },
  { key: 'why', label: 'Why' },
  { key: 'how', label: 'How' }
];

const whyForceIcons: ITopicIcon[] = [
  { src: fourIcon1, label: 'Deregulation' },
  { src: fourIcon2, label: 'Industrialization' },
  { src: fourIcon3, label: 'Disruptive Technologies' },
  { src: fourIcon4, label: 'Greater global connectivity' }
];

const whyResultIcons: ITopicIcon[] = [
  { src: threeIcon1, label: 'Greater competition - from traditional & non-traditional competitors' },
  { src: threeIcon2, label: 'Faster pace' },
  { src: threeIcon3, label: 'Customer being the boss' }
];

const whyReadMoreItems: string[] = [
  'Become customer obsessed - Foster empathy towards customers, understand their needs and optimize the delivery of value to satisfy our customers',
  'Nimble - Become a continuous learning organization that is able to adapt quickly',
  'Empowered teams - Build High-performing teams empowered to make changes based on what they see & learn',
  'Data Driven - Make decisions based on empirical data of value delivered to customers',
  'Challenge the status quo - Create a safe environment to take risks within risk appetite'
];

const howValueItems: string[] = [
  'Deliver value better by learning faster',
  'Embrace changes and succeed in the face of uncertainty',
  'Gain competitive advantage through innovative solutions',
  'Help every employee reach and challenge their full potential.'
];

const TopicIconRow: React.FC<{ items: ITopicIcon[] }> = ({ items }) => (
  <ul className={styles.iconRow}>
    {items.map((item: ITopicIcon) => (
      <li key={item.label} className={styles.iconItem}>
        <div className={styles.iconWrap}>
          <img src={item.src} alt="" aria-hidden="true" />
        </div>
        <span>{item.label}</span>
      </li>
    ))}
  </ul>
);

interface IReadMoreSectionProps {
  expanded: boolean;
  controlsId: string;
  onToggle: () => void;
  children: React.ReactNode;
}

const ReadMoreSection: React.FC<IReadMoreSectionProps> = ({ expanded, controlsId, onToggle, children }) => (
  <div className={styles.readMore}>
    <div className={styles.readMoreButtonWrap}>
      <button
        type="button"
        className={styles.readMoreButton}
        aria-expanded={expanded}
        aria-controls={controlsId}
        onClick={onToggle}
      >
        {expanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
    {/* Classic jQuery slideToggle — CSS height + fade (no instant hidden) */}
    <div
      id={controlsId}
      className={expanded ? `${styles.readMorePanel} ${styles.readMorePanelOpen}` : styles.readMorePanel}
      aria-hidden={!expanded}
    >
      <div className={styles.readMoreContent}>{children}</div>
    </div>
  </div>
);

const Agility101: React.FC<IAgility101Props> = (props) => {
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

  const [activeOuterTab, setActiveOuterTab] = React.useState<OuterTabKey>('what');
  const [activeInnerTab, setActiveInnerTab] = React.useState<InnerTabKey>('mindset');
  const [whyExpanded, setWhyExpanded] = React.useState<boolean>(false);
  const [howExpanded, setHowExpanded] = React.useState<boolean>(false);
  const [mindsetExpanded, setMindsetExpanded] = React.useState<boolean>(false);

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

  const currentInnerItem = innerTabItems.filter((item: IInnerTabItem) => item.key === activeInnerTab)[0] || innerTabItems[0];

  return (
    <div className={styles.agility101}>
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

            {/* Classic .banner-card — direct child of .header-banner (no nested container) */}
            <section className={styles.heroCard} aria-labelledby="agility-101-hero-heading">
              <div className={styles.heroImageWrap}>
                <img src={bannerImg} alt="Agility 101 banner illustration" />
              </div>
              <div className={styles.heroContent}>
                <div className={styles.heroCopy}>
                  <h1 id="agility-101-hero-heading">Agile 101</h1>
                  <span className={styles.heroEyebrow}>What is Agile?</span>
                  <p className={styles.heroBody}>
                    Agile is a way of working for teams to collaborate to get work done and deliver products &amp; services that drive business value and mitigate risk.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className={styles.tabsSection} aria-labelledby="agility-101-tabs-heading">
        <div className={styles.container}>
          <h2 id="agility-101-tabs-heading" className={styles.srOnly}>Agility 101 learning topics</h2>

          {/* Classic .tabs — titles + contents share one overflow clip context */}
          <div className={styles.tabs}>
            <div className={styles.outerTabs} role="tablist" aria-label="Agility topic groups">
              {outerTabs.map((tab: IOuterTabItem) => {
                const isSelected = tab.key === activeOuterTab;
                return (
                  <div
                    key={tab.key}
                    className={isSelected ? `${styles.outerTabItem} ${styles.outerTabItemActive}` : styles.outerTabItem}
                    role="none"
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`outer-tab-${tab.key}`}
                      aria-selected={isSelected}
                      aria-controls={`outer-panel-${tab.key}`}
                      className={isSelected ? `${styles.outerTab} ${styles.outerTabActive}` : styles.outerTab}
                      onClick={() => setActiveOuterTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                    {/* Classic .outer-tab-titles li.uk-active > div */}
                    <div className={styles.outerTabShape} aria-hidden="true" />
                  </div>
                );
              })}
            </div>

            <div
              className={styles.outerPanel}
              id={`outer-panel-${activeOuterTab}`}
              role="tabpanel"
              aria-labelledby={`outer-tab-${activeOuterTab}`}
            >
            {activeOuterTab === 'what' && (
              <>
                <div className={styles.innerTabs} role="tablist" aria-label="What topics">
                  {innerTabItems.map((item: IInnerTabItem) => {
                    const isSelected = item.key === currentInnerItem.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        role="tab"
                        id={`inner-tab-what-${item.key}`}
                        aria-selected={isSelected}
                        aria-controls={`inner-panel-what-${item.key}`}
                        className={isSelected ? `${styles.innerTab} ${styles.innerTabActive}` : styles.innerTab}
                        onClick={() => setActiveInnerTab(item.key)}
                      >
                        <img src={item.icon} alt="" aria-hidden="true" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div
                  className={styles.innerPanel}
                  id={`inner-panel-what-${currentInnerItem.key}`}
                  role="tabpanel"
                  aria-labelledby={`inner-tab-what-${currentInnerItem.key}`}
                >
                  <div className={styles.innerContent}>
                    <div className={styles.innerCopy}>
                      <h3>{currentInnerItem.title}</h3>
                      {currentInnerItem.key === 'mindset' ? (
                        <>
                          <p>
                            <span className={styles.accentText}>The Agile mindset</span>
                            {currentInnerItem.paragraphs[0].replace(/^The Agile mindset/i, '')}
                          </p>
                          {currentInnerItem.paragraphs.slice(1).map((paragraph: string, index: number) => (
                            <p key={`${currentInnerItem.key}-${index + 1}`}>{paragraph}</p>
                          ))}
                        </>
                      ) : (
                        currentInnerItem.paragraphs.map((paragraph: string, index: number) => (
                          <p key={`${currentInnerItem.key}-${index}`}>{paragraph}</p>
                        ))
                      )}
                    </div>
                    <div className={styles.innerVisual}>
                      <img src={innerTabImg} alt={`${currentInnerItem.label} illustration`} />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeOuterTab === 'why' && (
              <div className={styles.topicPanel}>
                <h3 className={styles.topicHeading}>
                  <span className={styles.accentText}>WHY</span> DOES DBS NEED ENTERPRISE AGILITY?
                </h3>
                <p className={`${styles.topicLead} ${styles.accentText}`}>Our world has evolved...</p>
                <p className={styles.topicLead}>There are disruptive forces that are changing the world</p>
                <TopicIconRow items={whyForceIcons} />
                <p className={styles.topicLead}>which results in...</p>
                <TopicIconRow items={whyResultIcons} />
                <ReadMoreSection
                  expanded={whyExpanded}
                  controlsId="why-read-more"
                  onToggle={() => setWhyExpanded((prev: boolean) => !prev)}
                >
                  <p className={styles.readMoreItalic}>We now live in an environment that is</p>
                  <p className={`${styles.topicLead} ${styles.accentText}`}>
                    Volatile, Uncertain, Complex and Ambiguous (VUCA).
                  </p>
                  <p className={styles.accentText}>
                    In response, we need to change the way we work as a 22,000 person &apos;start-up&apos; to achieve our ambition of becoming #BBIW.
                  </p>
                  <p>We want to</p>
                  <ul>
                    {whyReadMoreItems.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </ReadMoreSection>
              </div>
            )}

            {activeOuterTab === 'how' && (
              <div className={styles.topicPanel}>
                <div className={styles.innerContent}>
                  <div className={styles.innerCopy}>
                    <h3 className={styles.howHeading}>
                      <span className={styles.accentText}>HOW</span> CAN DBS ACHIEVE ENTERPRISE AGILITY
                    </h3>
                    <p>
                      At DBS, we strive to achieve enterprise agility by changing the way we work, through embracing the Agile mindset, values, principles and leveraging on a set of practices and tools.
                    </p>
                    <p>
                      Agile is a <span className={styles.accentText}>way of working</span> for teams to collaborate to get work done and deliver products &amp; services, based on mindset, values, principles, practices and tools, that drive business value &amp; mitigate risks.
                    </p>
                    <p>
                      The journey towards achieving Enterprise Agility is also supported by enablers such as platform governance and funding.
                    </p>
                  </div>
                  <div className={styles.innerVisual}>
                    <img src={innerTabImg} alt="Agile mindset, values, principles, practices and tools illustration" />
                  </div>
                </div>
                <ReadMoreSection
                  expanded={howExpanded}
                  controlsId="how-read-more"
                  onToggle={() => setHowExpanded((prev: boolean) => !prev)}
                >
                  <h4>Why Agile?</h4>
                  <p>
                    Contrary to common belief, Agile is NOT about delivering more work within less time. Instead it is about working smarter to generate more value. It is about engaging our people to reach their fullest potential and becoming a learning organization.
                  </p>
                  <p>With Agile, DBS will be able to...</p>
                  <ul>
                    {howValueItems.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <h4>How is DBS adopting Agile?</h4>
                  <p>
                    As with most organisations, we started adopting agile in IT first (execution). But to truly achieve enterprise agility, we believe that the entire value chain from business to execution needs to align and work in tandem.
                  </p>
                  <div className={styles.howDiagram}>
                    <img
                      src={howContentImg}
                      alt="DBS Agile adoption across the value chain from business strategy to execution"
                      loading="lazy"
                    />
                  </div>
                  <p>
                    Translating business strategy to execution, all done quickly and nimbly is how DBS wants to build the capability to sense and respond. Hence the change in mindset and way of working needs to happen throughout the entire organization and not in isolation. This creates a new culture that is shared across the entire value chain. The unified way of working fosters greater alignment and collective ownership to enable continuous delivery of value for DBS.
                  </p>
                  <p>
                    The ultimate objective is for DBS to deliver the right outcome at the right time for our customers through end-to-end adoption of the Agile way of working.
                  </p>
                </ReadMoreSection>
              </div>
            )}
            </div>
          </div>
        </div>
      </section>

      {activeOuterTab === 'what' && activeInnerTab === 'mindset' && (
        <div className={styles.mindsetFlow}>
          <div className={styles.container}>
            <section className={styles.mindsetSection} aria-labelledby="mindset-highlight-heading">
              <div className={styles.mindsetBanner}>
                <div className={styles.mindsetText}>
                  <h2 id="mindset-highlight-heading">The Agile Mindset</h2>
                  <p>a Growth mindset</p>
                </div>
                <div className={styles.mindsetImage}>
                  <img src={bgImage1} alt="" aria-hidden="true" />
                </div>
              </div>
            </section>

            <section className={styles.comparisonSection} aria-labelledby="mindset-comparison-heading">
              <h2 id="mindset-comparison-heading" className={styles.srOnly}>Mindset comparison</h2>
              <div className={styles.comparisonGrid}>
                <div className={styles.comparisonCard}>
                  <div className={styles.comparisonTitleWrap}>
                    <h3>Fixed <br /> Mindset</h3>
                  </div>
                  <div className={styles.comparisonImageWrap}>
                    <img src={leftCardImg} alt="Fixed mindset illustration" />
                  </div>
                </div>

                <div className={styles.comparisonCard}>
                  <div className={styles.comparisonTitleWrap}>
                    <h3>Growth <br /> Mindset</h3>
                  </div>
                  <div className={styles.comparisonImageWrap}>
                    <img src={rightCardImg} alt="Growth mindset illustration" />
                  </div>
                </div>

                <div className={styles.textCard}>
                  <p>
                    I believe that my problem is knowable and static. I already know how to solve this problem. Success depends on implementing my solution with minimal interference. Requirements shouldn&apos;t change.
                  </p>
                  <ul>
                    {fixedMindsetPoints.map((point: string) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.textCard}>
                  <p>
                    I believe that my context, customer requirements and challenges evolve continuously, so my work needs to be continuously developed. True requirements in this context are unknown and unknowable.
                  </p>
                  <ul>
                    {growthMindsetPoints.map((point: string) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <div className={styles.brainSection}>
              <div className={styles.brainGrid}>
                <div className={styles.brainCard}>
                  <h3>Using an iterative approach</h3>
                  <img src={fixedBrainImg} alt="Fixed mindset iterative approach diagram" loading="lazy" />
                </div>
                <div className={styles.brainCard}>
                  <h3>Using an iterative approach</h3>
                  <img src={growthBrainImg} alt="Growth mindset iterative approach diagram" loading="lazy" />
                </div>
              </div>
            </div>

            <ReadMoreSection
              expanded={mindsetExpanded}
              controlsId="mindset-read-more"
              onToggle={() => setMindsetExpanded((prev: boolean) => !prev)}
            >
              <h4 className={styles.textAlignCenter}>At DBS, we want our mindset to shift....</h4>
              <table className={styles.fakeTable}>
                <caption className={styles.srOnly}>Mindset shift from and to</caption>
                <thead>
                  <tr>
                    <th scope="col">From</th>
                    <th scope="col">To</th>
                  </tr>
                </thead>
                <tbody>
                  {mindsetShiftRows.map((row: { from: string; to: string }) => (
                    <tr key={`${row.from}-${row.to}`}>
                      <td>{row.from}</td>
                      <td>{row.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p>
                It is crucial to take note that the Agile Mindset is the most important attribute of agility. Even though it is the least visible, as compared to practices and tools, it is the most powerful in terms of transformation and benefits flow.
              </p>
              <p className={styles.textItalic}>Without an Agile Mindset, no benefits will flow.</p>
              <p className={styles.textSemibold}>
                However, with an Agile Mindset, benefits will flow no matter what the process or practice.
              </p>
            </ReadMoreSection>
          </div>
        </div>
      )}

      {showFooter && <SiteFooter contactEmail={contactEmail} mailIconSrc={chromeAssets.iconMail} />}
    </div>
  );
};

export default Agility101;
