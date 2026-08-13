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
const valueIcon1Left = require('../assets/value-icon-1-left.png') as string;
const valueIcon1Right = require('../assets/value-icon-1-right.png') as string;
const valueIcon2Left = require('../assets/value-icon-2-left.png') as string;
const valueIcon2Right = require('../assets/value-icon-2-right.png') as string;
const valueIcon3Left = require('../assets/value-icon-3-left.png') as string;
const valueIcon3Right = require('../assets/value-icon-3-right.png') as string;
const valueIcon4Left = require('../assets/value-icon-4-left.png') as string;
const valueIcon4Right = require('../assets/value-icon-4-right.png') as string;
const principleIcon1 = require('../assets/principle-icon-1.png') as string;
const principleIcon2 = require('../assets/principle-icon-2.png') as string;
const principleIcon3 = require('../assets/principle-icon-3.png') as string;
const principleIcon4 = require('../assets/principle-icon-4.png') as string;
const principleIcon5 = require('../assets/principle-icon-5.png') as string;
const principleIcon6 = require('../assets/principle-icon-6.png') as string;
const principleIcon7 = require('../assets/principle-icon-7.png') as string;
const principleIcon8 = require('../assets/principle-icon-8.png') as string;
const principleIcon9 = require('../assets/principle-icon-9.png') as string;
const principleIcon10 = require('../assets/principle-icon-10.png') as string;
const principleIcon11 = require('../assets/principle-icon-11.png') as string;
const principleIcon12 = require('../assets/principle-icon-12.png') as string;
/* eslint-enable @typescript-eslint/no-var-requires */

const AGILE_ORIGINS_VIDEO_URL = 'https://www.youtube.com/embed/AsFMHnSfI2I?si=rcB1XYte1z5frAAC';

type OuterTabKey = 'what' | 'why' | 'how';
type InnerTabKey = 'mindset' | 'values' | 'principle' | 'practice';

interface IInnerTabItem {
  key: InnerTabKey;
  label: string;
  icon: React.ReactNode;
  title: string;
  paragraphs: string[];
}

/** Classic agility-101.aspx inner-tab SVGs (exact viewBox + path). */
const INNER_TAB_ICON_GRAD_ID = 'aeInnerTabIconGrad';

const InnerTabIconMindset: React.FC = () => (
  <svg className={styles.innerTabIcon} width={22} height={25} viewBox="0 0 22 25" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M11.975 18.175L11 22.075L3.2 23.05V17.2L1.25 16.225L3.2 12.325V9.40001V9.40001C3.2 5.09218 6.69219 1.60001 11 1.60001H11.975C16.8213 1.60001 20.75 5.5287 20.75 10.375V10.8625C20.75 12.4447 20.2368 13.9842 19.2875 15.25V15.25C18.3382 16.5158 17.825 18.0553 17.825 19.6375V24.025M12.1039 5.50001H11.0309C8.76256 5.50001 6.82668 7.13994 6.45376 9.37743V9.37743C6.27629 10.4423 7.04149 11.4333 8.11658 11.5311L14.7797 12.1368C15.8914 12.2379 16.85 11.3625 16.85 10.2461V10.2461C16.85 7.62492 14.7251 5.50001 12.1039 5.50001Z"
      stroke="#766767"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InnerTabIconValues: React.FC = () => (
  <svg className={styles.innerTabIcon} width={24} height={22} viewBox="0 0 24 22" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M18.5625 10.2812V10.2812C17.9416 11.5231 17.1245 12.6568 16.1427 13.6386L15.75 14.0312M12 5.59375L11.2135 4.21729C9.63988 1.46355 6.00888 0.712088 3.47158 2.61506V2.61506C1.81466 3.85776 1.0387 5.95538 1.48799 7.97722L1.54282 8.22392C2.24318 11.3756 3.99941 14.1933 6.52046 16.2101L12 20.5938L17.4795 16.2101C20.0006 14.1933 21.7568 11.3756 22.4572 8.22392L22.512 7.97722C22.9613 5.95538 22.1853 3.85776 20.5284 2.61506V2.61506C17.9911 0.712088 14.3601 1.46355 12.7865 4.21729L12 5.59375Z"
      stroke="#766767"
      strokeOpacity="1"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InnerTabIconPrinciples: React.FC = () => (
  <svg className={styles.innerTabIcon} width={24} height={18} viewBox="0 0 24 18" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M4.5 1.21875L5.52718 2.04049C7.52995 3.64271 10.4611 3.2706 12 1.21875V1.21875M4.5 1.21875L0.75 10.5938M4.5 1.21875L8.25 10.5938M12 1.21875V1.21875C13.5389 3.2706 16.47 3.64271 18.4728 2.04049L19.5 1.21875M12 1.21875V17.1562M19.5 1.21875L15.75 10.5938M19.5 1.21875L23.25 10.5938M0.75 10.5938H8.25M0.75 10.5938V10.5938C0.75 12.6648 2.42893 14.3438 4.5 14.3438V14.3438C6.57107 14.3438 8.25 12.6648 8.25 10.5938V10.5938M15.75 10.5938V10.5938C15.75 12.6648 17.4289 14.3438 19.5 14.3438V14.3438C21.5711 14.3438 23.25 12.6648 23.25 10.5938V10.5938M15.75 10.5938H23.25M6.375 17.1562H17.625"
      stroke="#766767"
      strokeOpacity="1"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InnerTabIconPractices: React.FC = () => (
  <svg className={styles.innerTabIcon} width={24} height={23} viewBox="0 0 24 23" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M22.5 18.6023V9.70455C22.5 8.61253 21.6147 7.72728 20.5227 7.72728V7.72728C19.4307 7.72728 18.5455 8.61253 18.5455 9.70455V14.6477V5.75001C18.5455 4.65799 17.6602 3.77273 16.5682 3.77273V3.77273C15.4762 3.77273 14.5909 4.65799 14.5909 5.75001V13.6591V2.7841C14.5909 1.69208 13.7057 0.806824 12.6136 0.806824V0.806824C11.5216 0.806824 10.6364 1.69208 10.6364 2.7841V12.6705V5.75001C10.6364 4.65799 9.75111 3.77273 8.65909 3.77273V3.77273C7.56707 3.77273 6.68182 4.65799 6.68182 5.75001V17.6136M6.68182 15.6364L4.201 14.1479C2.97582 13.4128 1.38871 14.0702 1.04217 15.4563V15.4563C0.86091 16.1814 1.07336 16.9484 1.60183 17.4768L4.00547 19.8805C4.45308 20.3281 4.70455 20.9352 4.70455 21.5682V21.5682"
      stroke="#766767"
      strokeOpacity="1"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

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

const valuesParagraphs: string[] = [
  'There are 4 values, prescribed by the Agile manifesto.',
  'These values drive the agile culture and ground all the principles and practices.',
  'The manifesto was created in 2001 as a way to deal with the problems of that age. Software projects often took years to deliver their first piece of value. By then, these no longer fulfilled the needs of the customers or end users. Hence, a group of people who founded more nimble software development approaches, came together to create the agile manifesto to address the issue. The manifesto consists of 4 values and 12 principles.'
];

const principleParagraphs: string[] = [
  'The 4 values are supported by 12 principles as a guide to expected behaviour and practices.'
];

const practiceParagraphs: string[] = [
  'Agile practices come in different flavours and are constantly evolving. As a learning organization, we need to continue to reflect and adapt while implementing those practices at our own areas of work.',
  'While Agile Practices are more visible and larger in number, Agile Principles and Values are much larger in impact and are stable guiding principles that will help ground the right behaviours and mindset when implementing these practices. Hence while practising Agile, it is important we understand the difference between "Being Agile" and "Doing Agile".'
];

interface IPracticeAccordionItem {
  key: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  bulletsIntro?: string;
}

const practiceAccordionItems: IPracticeAccordionItem[] = [
  {
    key: 'retrospective',
    title: 'Retrospective',
    paragraphs: [
      'A retrospective is a reflective assessment of the work over a defined time period with the intention of evolving the way the team works.',
      'Specifically we do Retrospectives at the end of a sprint, prior to Sprint Planning. The actions that come out of it need to feed into the Sprint Plan. When you do it may depend on who wants to attend.',
      'At the very least Retrospectives should be done at least once per sprint.'
    ]
  },
  {
    key: 'stand-ups',
    title: 'Stand Ups',
    paragraphs: [
      'A Stand Up is also commonly known as a daily huddle. It is where opportunities to collaborate, share or help each other are discovered.',
      'Stand Ups realise the principles of flexibility by adjusting the way we work, collaboration by working together to change the way we work, transparency of what we are working on and how it is progressing. In doing Stand Ups, we want to ensure that the team as a whole is working on the most valuable work for the customer.'
    ]
  },
  {
    key: 'backlog',
    title: 'Backlog Management',
    paragraphs: [
      'Teams need a single backlog of work to pull work from. This backlog needs be kept relevant and of a manageable size. Backlog should be prioritised based on business value and risk and relative estimates exists for next 2 sprints. Backlog should also be regularly groomed (preferably for each sprint planning meeting).'
    ]
  },
  {
    key: 'product-ownership',
    title: 'Product Ownership',
    paragraphs: [
      'The Product Owner is the one and only person responsible for managing the Product Backlog and ensuring the value of the work the team performs. This person maintains the Product Backlog and ensures that it is visible to everyone.',
      'The Product Owner turns customer needs into a Vision, Roadmap, then a Product Backlog.'
    ]
  },
  {
    key: 'visualisation',
    title: 'Visualisation',
    paragraphs: [
      'Using big visible charts/kanban boards is a powerful practice used to raise the visibility of work.',
      'Visual boards'
    ],
    bullets: [
      'Create an environment of trust, courage and honesty by pushing the information out into the open rather than hiding information in files',
      'Create a shared understanding amongst the team of the state of work',
      'Create transparency of progress, work-type, ownership, risks, issues',
      'Foster shared accountability for completion of work (intrinsic motivation)',
      'Reduce reporting effort by replacing the need for additional status reports',
      'Provide a central point of reference/discuss for team meetings'
    ]
  },
  {
    key: 'cross-functional',
    title: 'Cross-functional Team',
    paragraphs: [
      'A cross-functional team is made of individuals with different skills, from different functions or departments within an organization. These individuals should possess the necessary skill-sets to execute all that is required to deliver value to the customers. Additional SMEs may be co-opted into the team from time to time to augment the required skills.',
      'The cross-functional team should be persistent, autonomous, empowered and self-organising. The point is to bring people with different expertise together to solve a problem, or explore a potential solution in the way improves collaboration, communication and minimise handovers.'
    ]
  },
  {
    key: 'sprint-review',
    title: 'Sprint Review/Showcase',
    paragraphs: [
      'A Sprint Review/Showcase is a demonstration of the valuable things we have created in this sprint. The Sprint Review is a core ceremony that should happen at the end of every sprint.'
    ]
  },
  {
    key: 'co-location',
    title: 'Co-location',
    paragraphs: [
      'Co-location is the key to having face-to-face communication on a daily basis.'
    ],
    bulletsIntro: 'The distinguishing features of true co-location:',
    bullets: [
      'Team members sit together in the same office most of the time.',
      "Teams are integrated and x-functional, i.e. everyone in the value chain sits together including Product Owner, business SME's, developers, testers, business analysts, UI designers."
    ]
  },
  {
    key: 'sprint-management',
    title: 'Sprint Management',
    paragraphs: ['Sprint management refers to the key responsibilities of a Scrum Master, the agile process owner.'],
    bulletsIntro: 'The Scrum Master is responsible for',
    bullets: [
      'Removing impediments',
      'Coaching the team for high performance',
      'Protecting the team',
      'Supporting the team to make their work transparent to stakeholders',
      'Building trust within the team and with the customers',
      "Ensuring the teams successes and failures are celebrated",
      'Ensuring dependencies between teams are kept in sync and risk are managed'
    ]
  },
  {
    key: 'work-breakdown',
    title: 'Work Breakdown',
    paragraphs: [
      'Work breakdown is the process of subdividing a problem/initiative into its constituent parts to be able to form meaningful patterns, identifying important subcomponents and relationships between them.'
    ],
    bulletsIntro: "It's a good idea to break down pieces of work until they are of a manageable size:",
    bullets: [
      'To obtain a better understanding of the problem/solution spaces',
      'To be better able to estimate the amount of effort needed to create a solution',
      'To better understand the dependencies, constraints and unseen details of the system under discussion',
      'To facilitate continuous delivery (earlier and faster)',
      'To more effectively schedule and build the pieces of the proposed solution',
      'To visualise work'
    ]
  },
  {
    key: 'risk-management',
    title: 'Agile Risk Management',
    paragraphs: [
      'A Risk is any event that - should it happen - will prevent you from achieving your goal.',
      'Risk management addresses uncertainty and increases the likelihood of successful outcomes.'
    ]
  },
  {
    key: 'adaptive-planning',
    title: 'Adaptive Planning',
    paragraphs: [
      'Adaptive planning is about the collaborative identification, definition and planning of work and deliverables.',
      "Release and sprint planning produces an achievable plan that the team is confident to deliver. Work planned is regularly achieved with only small variations in progress. An overall (long-term) plan is maintainted and accurately reflects the team's understanding of work, timing, resources, dependencies, etc. sliders are used to inform planning. The long-term plan is adjusted every sprint and agreed with customer(s)."
    ]
  },
  {
    key: 'distributed-delivery',
    title: 'Distributed Delivery',
    paragraphs: [
      'Distributed Delivery is about managing a delivery team across different geographic locations.',
      "There should be equal participation from the whole distributed team, where hands-off between geographical locations are minimised and specific actions exist to increase every team member's capability."
    ]
  }
];

const practiceCompareItems: Array<{ title: string; description: string }> = [
  {
    title: 'Doing Agile',
    description: 'Applying the practices without the mindset and understanding of the principles behind the "why"'
  },
  {
    title: 'Being Agile',
    description:
      'Internalising the mindset, values and principles, then applying and tailoring the right practices to the situations as they arise'
  }
];

interface IPrincipleItem {
  key: string;
  title: string;
  description: string;
  icon: string;
}

const principleItems: IPrincipleItem[] = [
  {
    key: 'motivated',
    title: 'Motivated Individuals',
    description:
      'Build projects around motivated individuals. Give them the environment and support they need, and trust them to get the job done.',
    icon: principleIcon1
  },
  {
    key: 'self-organising',
    title: 'Self-Organising Teams',
    description: 'The best architectures, requirements, and designs emerge from self-organizing teams.',
    icon: principleIcon2
  },
  {
    key: 'customer',
    title: 'Customer Satisfaction',
    description:
      'Our highest priority is to satisfy the customer through early and continuous delivery of valuable software.',
    icon: principleIcon3
  },
  {
    key: 'working-software',
    title: 'Working Software',
    description: 'Working software is the primary measure of progress.',
    icon: principleIcon4
  },
  {
    key: 'frequent-delivery',
    title: 'Frequent Delivery of Value',
    description:
      'Deliver working software frequently, from a couple of weeks to a couple of months, with a preference to the shorter timescale.',
    icon: principleIcon5
  },
  {
    key: 'welcome-change',
    title: 'Welcome Change',
    description:
      "Welcome changing requirements, even late in development. Agile processes harness change for the customer's competitive advantage.",
    icon: principleIcon6
  },
  {
    key: 'collaboration',
    title: 'Collaboration',
    description: 'Business people and developers must work together daily throughout the project.',
    icon: principleIcon7
  },
  {
    key: 'sustainable-pace',
    title: 'Sustainable Pace',
    description:
      'Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.',
    icon: principleIcon8
  },
  {
    key: 'face-to-face',
    title: 'Face-to-Face Conversation',
    description:
      'The most efficient and effective method of conveying information to and within a development team is face-to-face conversation.',
    icon: principleIcon9
  },
  {
    key: 'simplicity',
    title: 'Simplicity',
    description: 'Simplicity--the art of maximizing the amount of work not done--is essential.',
    icon: principleIcon10
  },
  {
    key: 'technical-excellence',
    title: 'Technical Excellence',
    description: 'Continuous attention to technical excellence and good design enhances agility.',
    icon: principleIcon11
  },
  {
    key: 'continuous-improvement',
    title: 'Continuous Improvement',
    description:
      'At regular intervals, the team reflects on how to become more effective, then tunes and adjusts its behavior accordingly.',
    icon: principleIcon12
  }
];

interface IValueAccordionItem {
  key: string;
  leftTitle: string;
  rightTitle: string;
  leftIcon: string;
  rightIcon: string;
  paragraphs: string[];
  italicNote?: string;
  videoHeading?: string;
  videoUrl?: string;
}

const valueAccordionItems: IValueAccordionItem[] = [
  {
    key: 'individuals',
    leftTitle: 'Individuals and interactions',
    rightTitle: 'over processes and tools',
    leftIcon: valueIcon1Left,
    rightIcon: valueIcon1Right,
    paragraphs: [
      'Teams of people build software systems, and to do that they need to work together effectively - including but not limited to programmers, testers, project managers, modelers, and your customers.',
      'Who do you think would develop a better system: five software developers and with their own tools working together in a single room or five low-skilled "hamburger flippers" with a well-defined process, the most sophisticated tools available, and the best offices money could buy? If the project was reasonably complex my money would be on the software developers, wouldn\'t yours?',
      'The point is that the most important factors that you need to consider are the people and how they work together because if you don\'t get that right the best tools and processes won\'t be of any use. Tools and processes are important, it\'s just that they\'re not as important as working together effectively. Remember the old adage, a fool with a tool is still a fool. This can be difficult for management to accept because they often want to believe that people and time, or men and months, are interchangeable.'
    ]
  },
  {
    key: 'customer',
    leftTitle: 'Customer collaboration',
    rightTitle: 'over contract negotiation',
    leftIcon: valueIcon2Left,
    rightIcon: valueIcon2Right,
    paragraphs: [
      'Only your customers can tell you what they want. Yes, they likely do not have the skills to exactly specify the system. Yes, they likely won\'t get it right the first time. Working together with your customers is hard, but that\'s the reality of the job.',
      'Having a contract with your customers is important, having an understanding of everyone\'s rights and responsibilities may form the foundation of that contract, but a contract isn\'t a substitute for communication. Successful developers work closely with their customers, they invest the effort to discover what their customers need, and they educate their customers along the way.'
    ]
  },
  {
    key: 'software',
    leftTitle: 'Working software',
    rightTitle: 'over comprehensive documentation',
    leftIcon: valueIcon3Left,
    rightIcon: valueIcon3Right,
    paragraphs: [
      'When you ask a user whether they would want a fifty-page document describing what you intend to build or the actual software itself, what do you think they\'ll pick? Probably the software itself.',
      'If that is the case, doesn\'t it make more sense to work in such a manner that you produce software quickly and often, giving your users what they prefer? Furthermore, users will have a significantly easier time understanding any software that you produce rather than complex technical diagrams describing its internal workings or describing an abstraction of its usage.',
      'Documentation has its place, written properly, it is a valuable guide for people\'s understanding of how and why a system is built and how to work with the system. However, never forget that the primary goal of software development is to create software, not documents - otherwise it would be called documentation development, wouldn\'t it?'
    ],
    italicNote:
      'On a side note, time has moved on and although we still apply Agile for software development it can be used to deliver anything. So when you see "working software" think of it more as "valuable outcomes".'
  },
  {
    key: 'change',
    leftTitle: 'Responding to change',
    rightTitle: 'over following a plan',
    leftIcon: valueIcon4Left,
    rightIcon: valueIcon4Right,
    paragraphs: [
      'Note that even though we value the ones on the left more, it does not mean the values on the right are not important. Focusing on the left results in better outcomes.'
    ],
    videoHeading: 'Watch this quick video to learn more about the origins of Agile',
    videoUrl: AGILE_ORIGINS_VIDEO_URL
  }
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
  { key: 'mindset', label: 'Mindset', icon: <InnerTabIconMindset />, title: 'Agile Foundation', paragraphs: mindsetParagraphs },
  { key: 'values', label: 'Values', icon: <InnerTabIconValues />, title: 'Agile Foundation 2', paragraphs: valuesParagraphs },
  { key: 'principle', label: 'Principles', icon: <InnerTabIconPrinciples />, title: '', paragraphs: principleParagraphs },
  { key: 'practice', label: 'Practices', icon: <InnerTabIconPractices />, title: '', paragraphs: practiceParagraphs }
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

interface IValuesAccordionProps {
  openKeys: string[];
  onToggle: (key: string) => void;
}

const ValuesAccordion: React.FC<IValuesAccordionProps> = ({ openKeys, onToggle }) => (
  <section className={styles.valuesAccordion} aria-label="Agile manifesto values">
    <ul className={styles.valuesAccordionList}>
      {valueAccordionItems.map((item: IValueAccordionItem) => {
        const isOpen = openKeys.indexOf(item.key) >= 0;
        const panelId = `value-panel-${item.key}`;
        const buttonId = `value-button-${item.key}`;
        return (
          <li key={item.key} className={isOpen ? `${styles.valuesAccordionItem} ${styles.valuesAccordionItemOpen}` : styles.valuesAccordionItem}>
            <button
              type="button"
              id={buttonId}
              className={styles.valuesAccordionTitle}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(item.key)}
            >
              <span className={styles.valuesTitleLeft}>{item.leftTitle}</span>
              <span className={styles.valuesAccImg} aria-hidden="true">
                <img src={item.leftIcon} alt="" />
                <img src={item.rightIcon} alt="" />
              </span>
              <span className={styles.valuesTitleRight}>
                <span className={styles.valuesGrayTitle}>{item.rightTitle}</span>
              </span>
              <span className={styles.valuesChevron} aria-hidden="true" />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={isOpen ? `${styles.valuesAccordionPanel} ${styles.valuesAccordionPanelOpen}` : styles.valuesAccordionPanel}
              aria-hidden={!isOpen}
            >
              <div className={styles.valuesAccordionBody}>
                {item.paragraphs.map((paragraph: string, index: number) => (
                  <p key={`${item.key}-p-${index}`}>{paragraph}</p>
                ))}
                {item.italicNote && <p className={styles.textItalic}>{item.italicNote}</p>}
                {item.videoHeading && item.videoUrl && isOpen && (
                  <>
                    <h4>{item.videoHeading}</h4>
                    <div className={styles.videoContainer}>
                      <iframe
                        src={item.videoUrl}
                        title="YouTube video player — origins of Agile"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen={true}
                        loading="lazy"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
);

const PrinciplesGrid: React.FC = () => (
  <section className={styles.principlesGrid} aria-label="Twelve Agile principles">
    <ul className={styles.principlesList}>
      {principleItems.map((item: IPrincipleItem) => (
        <li key={item.key} className={styles.principleItem}>
          <div className={styles.principleIcon} aria-hidden="true">
            <img src={item.icon} alt="" />
          </div>
          <div className={styles.principleCopy}>
            <h5>{item.title}</h5>
            <p>{item.description}</p>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

interface IPracticesAccordionProps {
  openKeys: string[];
  onToggle: (key: string) => void;
}

const PracticesAccordion: React.FC<IPracticesAccordionProps> = ({ openKeys, onToggle }) => (
  <section className={styles.practicesAccordion} aria-label="Agile practices">
    <ul className={styles.practicesAccordionList}>
      {practiceAccordionItems.map((item: IPracticeAccordionItem) => {
        const isOpen = openKeys.indexOf(item.key) >= 0;
        const panelId = `practice-panel-${item.key}`;
        const buttonId = `practice-button-${item.key}`;
        return (
          <li
            key={item.key}
            className={
              isOpen
                ? `${styles.practicesAccordionItem} ${styles.practicesAccordionItemOpen}`
                : styles.practicesAccordionItem
            }
          >
            <button
              type="button"
              id={buttonId}
              className={styles.practicesAccordionTitle}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => onToggle(item.key)}
            >
              <span className={styles.practicesTitleText}>{item.title}</span>
              <span className={styles.practicesChevron} aria-hidden="true" />
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={
                isOpen
                  ? `${styles.practicesAccordionPanel} ${styles.practicesAccordionPanelOpen}`
                  : styles.practicesAccordionPanel
              }
              aria-hidden={!isOpen}
            >
              <div className={styles.practicesAccordionBody}>
                {item.paragraphs.map((paragraph: string, index: number) => (
                  <p key={`${item.key}-p-${index}`}>{paragraph}</p>
                ))}
                {item.bulletsIntro && <p>{item.bulletsIntro}</p>}
                {item.bullets && item.bullets.length > 0 && (
                  <ul>
                    {item.bullets.map((bullet: string) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  </section>
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
  const [valuesExpanded, setValuesExpanded] = React.useState<boolean>(false);
  const [principleExpanded, setPrincipleExpanded] = React.useState<boolean>(false);
  const [practiceExpanded, setPracticeExpanded] = React.useState<boolean>(false);
  const [openValueKeys, setOpenValueKeys] = React.useState<string[]>(['individuals']);
  const [openPracticeKeys, setOpenPracticeKeys] = React.useState<string[]>(['retrospective']);

  const toggleValueAccordion = React.useCallback((key: string): void => {
    setOpenValueKeys((prev: string[]) => {
      if (prev.indexOf(key) >= 0) {
        return prev.filter((item: string) => item !== key);
      }
      return prev.concat([key]);
    });
  }, []);

  const togglePracticeAccordion = React.useCallback((key: string): void => {
    setOpenPracticeKeys((prev: string[]) => {
      if (prev.indexOf(key) >= 0) {
        return prev.filter((item: string) => item !== key);
      }
      return prev.concat([key]);
    });
  }, []);

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
              className={`${styles.outerPanel} ${styles.outerPanelOnPage}`}
              id={`outer-panel-${activeOuterTab}`}
              role="tabpanel"
              aria-labelledby={`outer-tab-${activeOuterTab}`}
            >
            {activeOuterTab === 'what' && (
              <>
                <div className={styles.innerTabs} role="tablist" aria-label="What topics">
                  {/* Shared gradient for classic active icon stroke */}
                  <svg className={styles.srOnly} width={0} height={0} aria-hidden="true" focusable="false">
                    <defs>
                      <linearGradient
                        id={INNER_TAB_ICON_GRAD_ID}
                        x1="1.25"
                        y1="1.60001"
                        x2="20.8046"
                        y2="1.64773"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#ED1C24" />
                        <stop offset="1" stopColor="#9747FF" />
                      </linearGradient>
                    </defs>
                  </svg>
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
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Classic: white intro card only — accordion is a sibling on page bg */}
                <div
                  className={styles.innerPanel}
                  id={`inner-panel-what-${currentInnerItem.key}`}
                  role="tabpanel"
                  aria-labelledby={`inner-tab-what-${currentInnerItem.key}`}
                >
                  <div className={styles.innerContent}>
                    <div className={styles.innerCopy}>
                      {currentInnerItem.title ? <h3>{currentInnerItem.title}</h3> : null}
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

                {activeInnerTab === 'values' && (
                  <ReadMoreSection
                    expanded={valuesExpanded}
                    controlsId="values-read-more"
                    onToggle={() => setValuesExpanded((prev: boolean) => !prev)}
                  >
                    <ValuesAccordion openKeys={openValueKeys} onToggle={toggleValueAccordion} />
                  </ReadMoreSection>
                )}

                {activeInnerTab === 'principle' && (
                  <ReadMoreSection
                    expanded={principleExpanded}
                    controlsId="principle-read-more"
                    onToggle={() => setPrincipleExpanded((prev: boolean) => !prev)}
                  >
                    <PrinciplesGrid />
                  </ReadMoreSection>
                )}

                {activeInnerTab === 'practice' && (
                  <ReadMoreSection
                    expanded={practiceExpanded}
                    controlsId="practice-read-more"
                    onToggle={() => setPracticeExpanded((prev: boolean) => !prev)}
                  >
                    <div className={styles.practiceCompare}>
                      {practiceCompareItems.map((item: { title: string; description: string }) => (
                        <div key={item.title} className={styles.practiceCompareCard}>
                          <h5>{item.title}</h5>
                          <p>{item.description}</p>
                        </div>
                      ))}
                    </div>
                    <PracticesAccordion openKeys={openPracticeKeys} onToggle={togglePracticeAccordion} />
                  </ReadMoreSection>
                )}
              </>
            )}

            {activeOuterTab === 'why' && (
              <>
                {/* Classic .outer-tab-content-li-2 .outer-tab-contents — white intro card only */}
                <div className={styles.topicPanel}>
                  <h3 className={styles.whyTopicHeading}>
                    <span className={styles.textRed}>WHY</span> DOES DBS NEED ENTERPRISE AGILITY?
                  </h3>
                  <p className={`${styles.whyTopicLead} ${styles.textRed}`}>Our world has evolved...</p>
                  <p className={styles.whyTopicLead}>There are disruptive forces that are changing the world</p>
                  <TopicIconRow items={whyForceIcons} />
                  <p className={styles.whyTopicLead}>which results in...</p>
                  <TopicIconRow items={whyResultIcons} />
                </div>
                {/* Classic .read-more-div — sibling on page bg (#F1EEEE) */}
                <ReadMoreSection
                  expanded={whyExpanded}
                  controlsId="why-read-more"
                  onToggle={() => setWhyExpanded((prev: boolean) => !prev)}
                >
                  <p className={`${styles.textItalic} ${styles.textAlignCenter}`}>
                    We now live in an environment that is
                  </p>
                  <p className={`${styles.textAlignCenter} ${styles.textRed}`}>
                    Volatile, Uncertain, Complex and Ambiguous (VUCA).
                  </p>
                  <p className={styles.textRed}>
                    In response, we need to change the way we work as a 22,000 person &apos;start-up&apos; to achieve our ambition of becoming #BBIW.
                  </p>
                  <p>We want to</p>
                  <ul>
                    {whyReadMoreItems.map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </ReadMoreSection>
              </>
            )}

            {activeOuterTab === 'how' && (
              <>
                {/* Classic .outer-tab-contents — white intro card only */}
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
                </div>
                {/* Classic .read-more-div — sibling on page bg */}
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
              </>
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
