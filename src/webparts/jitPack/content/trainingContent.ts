/**
 * Static content for JIT Pack → Agile Training outer tab (inner tabs).
 * Source: agile-exchange/JIT-pack.aspx (active blocks only; commented HTML skipped).
 * Image paths are classic-relative (public/images/JIT-training-pack/...).
 */

export interface IContentLink {
  label: string;
  href: string;
}

/** Plain text segment; optional bold for classic <strong> without HTML injection. */
export interface ITextPart {
  text: string;
  bold?: boolean;
}

export type RichText = string | ITextPart[];

export interface IListItem {
  /** Leading text before an optional inline link. */
  text: string;
  link?: IContentLink;
}

export type AccordionBlock =
  | { type: 'paragraph'; text: string; italic?: boolean }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: IListItem[] };

export interface ITrainingCourse {
  title: string;
  initiallyOpen?: boolean;
  blocks: AccordionBlock[];
}

export interface IIbfInfoBlock {
  heading: string;
  paragraphs?: RichText[];
  listItems?: RichText[];
}

export interface IIbfColumn {
  blocks: IIbfInfoBlock[];
}

export interface IIbfFooterLink {
  prefix: string;
  link: IContentLink;
}

export const agileTrainingIntroParagraphs: string[] = [
  'Please see following for the list of Agile Training. Head over to DBS Learning Hub to view and register for any of the Agile training.',
  'Please note: Registration closes 3 weeks before the start date of each course.',
  'No withdrawals are allowed after registration has closed.',
  'For Permanent and Contract staff'
];

export const agileTrainingLearningHubLink: IContentLink = {
  label: 'DBS Learning Hub',
  href: 'https://dbslearninghub.sabacloud.com/'
};

export const agileTrainingSectionHeading: string = 'Agile Training';

export const agileTrainingExpandHint: string =
  'Expand the titles below to see full description of each course.';

export const agileTrainingCourses: ITrainingCourse[] = [
  {
    title: 'Introduction to Agile (e-Learning)',
    initiallyOpen: true,
    blocks: [
      {
        type: 'paragraph',
        italic: true,
        text:
          '*Participants may choose to attend either Introduction to Agile e-Learning or classroom'
      },
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          { text: 'What agility is' },
          { text: 'The genesis and evolution of the Agile approach' },
          { text: 'The philosophy of Agile' },
          { text: 'What the Agile mindset is' },
          { text: 'Key Agile values and principles' },
          { text: 'Scrum framework overview' },
          { text: 'The Agile Journey' },
          { text: 'Self-assessment to validate your understanding' }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        text:
          'This eLearning course provides you with an independent introduction and overview of Agile.  You will learn why the Agile mindset is essential to the success of an Agile adoption in an organisation. You will cover the core Agile practices and how Scrum, eXtreme Programming and Kanban work as well as learn the typical roles in an Agile team and the importance of effective communication and collaboration among team members to deliver value to the customer.'
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          { text: 'Team members becoming involved in Agile delivery' },
          { text: 'Leaders of teams involved in Agile delivery' },
          { text: 'Anyone interested in beginning his/her Agile journey' }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          {
            text: 'Location: Web-based ',
            link: {
              label: 'Click here to access DigiFY',
              href:
                'https://dbs1bank.sharepoint.com/sites/dbsacademy/DigiFY_Site/SitePages/skills-agile.aspx'
            }
          },
          { text: 'Time: At your own time' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'Free' }]
      }
    ]
  },
  {
    title: 'Introduction to Agile (Classroom)',
    blocks: [
      {
        type: 'paragraph',
        italic: true,
        text:
          '*Participants may choose to attend either Introduction to Agile e-Learning or classroom'
      },
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          { text: 'The business value of adopting Agile approaches' },
          {
            text:
              'The background, core practices and philosophies behind this way of working'
          },
          {
            text:
              'Organisational and people challenges, and how these can be overcome'
          },
          {
            text:
              'The opportunities that the Agile approach brings to the software/solutions development process'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        text:
          'What is Agile and how does it work? This course is designed for those with limited Agile experience, to provide you with an introduction to the Agile approach.  You will look at the underlying philosophy and motivation and examine the core values, principles, practices and techniques that fall under the broad Agile umbrella. Independent of any single brand or methodology, this introductory course looks at the key factors that are needed to apply Agile effectively. This program will give you hands-on experience of what it means to work and think in an Agile manner.'
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          { text: 'Team members starting out in Agile delivery' },
          { text: 'Leaders of teams involved in Agile delivery' },
          {
            text:
              'Business SMEs, customers and clients involved with the solution'
          },
          {
            text:
              'Anyone interested in working and thinking in an Agile manner can attend this course'
          }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 1 day' },
          { text: 'Location: External' },
          { text: 'Time: 9am to 5pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'SGD 520 per pax' }]
      }
    ]
  },
  {
    title: '(ICAgile) Certified Agile Fundamentals',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          { text: 'The background to participating in an Agile delivery' },
          {
            text:
              'The roles and responsibilities of a typical Agile delivery team'
          },
          {
            text:
              'The various tools available to Agile teams to facilitate the delivery'
          },
          {
            text:
              'How Agile teams cooperate and collaborate to deliver business value'
          },
          {
            text:
              'The important interpersonal skills Agile environments encourage and foster'
          },
          { text: 'How discipline and standards contribute to agility' }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        text:
          "Want to know what Agile is all about?  If you're new to the Agile world and need a solid introduction to the Agile way of thinking, and doing - this course is a perfect fit. It examines the roles and responsibilities of team members working on an Agile delivery. It delves into the specific practices used on Agile delivery, explains the theory and concepts behind the Agile approach, and prepares you to work confidently and effectively in an Agile environment.  Not only that, you will also learn about the structure for defining value to ensure you deliver the right product at the right time for the right customer."
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          { text: 'Team members starting out in Agile delivery' },
          { text: 'Leaders of teams involved in Agile delivery' },
          { text: 'Anyone wanting to embark on their Agile learning pathway' }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 3 days' },
          { text: 'Location: External' },
          { text: 'Time: 9am to 5pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'SGD 1170 per pax' }]
      }
    ]
  },
  {
    title: '(ICAgile) Certified Agile Product Ownership',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          { text: 'The roles and responsibilities involved in product ownership' },
          {
            text:
              'How to help identify which products should be built to maximise business value using tools such as purpose alignment model, Kano analysis, value stream mapping'
          },
          {
            text:
              'How to build a product roadmap and link that to business outcomes'
          },
          {
            text:
              'How to use personas and product design workshops to help define features and quality goals for building a product roadmap'
          },
          {
            text:
              'The shape of a well-formed backlog and how to populate it progressively'
          },
          {
            text:
              'Techniques such as story mapping, prioritisation and backlog grooming to build a release plan'
          },
          {
            text:
              'How to use paper prototyping and usability heuristics to guide the design of the product'
          },
          {
            text:
              'Stories for development on a just-in-time basis while ensuring the design principles and architectural guidelines are adhered to'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        italic: true,
        text: 'Prerequisite: Agile Fundamentals'
      },
      {
        type: 'paragraph',
        text:
          'Through this course you will gain the techniques and tools to enable you to become an effective Product Owner who is equipped to guide product development, and lead product ownership teams. Our course focuses on the leadership needed to ensure product fit, and how these practices work in an Agile development process. You will also cover value management, and how collaboration is so important to identifying the most important aspects and features of a product'
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          {
            text:
              'Product Manager, Product Owner, Business Analyst or if you form part of the extended team of people supporting the Product Owner'
          }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 3 days' },
          { text: 'Location: External' },
          { text: 'Time: 9am to 6pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'SGD 1170 per pax' }]
      }
    ]
  },
  {
    title: '(ICAgile) Certified Agile Iteration and Facilitation Management',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          {
            text:
              'Understand the value of facilitation skills in collaborative work environments'
          },
          {
            text:
              'Understand how to apply a variety of tools and techniques and the context in which they are useful'
          },
          {
            text: 'Understand how to facilitate the various Agile work practices'
          },
          {
            text:
              'Understand the role of the Iteration Manager/Scrum Master and how it can help collaborative teams on their agile journey with heuristics to guide the design of the product'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        text:
          'Learn how collaborative workshops can be planned, organised and run; and how each team member can contribute to achieving maximum effectiveness - while identifying potential pitfalls and how to avoid and address these. This program will also assist you in addressing aspects of your role to build capability across the wider team.'
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          {
            text:
              'Iteration Managers/Scrum Masters, Agile Coaches, Product Owners, Agile PMs and those needed to facilitate Agile practices'
          }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 2 days' },
          { text: 'Location: External' },
          { text: 'Time: 9am to 5pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'SGD 1170 per pax' }]
      }
    ]
  },
  {
    title: 'Kanban Training',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          { text: 'Lean approach to Agile delivery' },
          {
            text:
              'New way of team work based on Lean principles in order to reach higher effectiveness and create a culture of continuous improvement'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        italic: true,
        text: 'Prerequisite: Introduction to Agile'
      },
      {
        type: 'list',
        items: [
          { text: 'Kanban Core Practices' },
          { text: 'Presentation of a Kanban System' },
          { text: 'Sample Kanban Systems' },
          { text: 'Underlying principles' }
        ]
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          {
            text:
              'People at all levels of skill and authority acros the organisation, both in business and in IT'
          }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 1 day' },
          { text: 'Location: DBS Academy' },
          { text: 'Time: 9am to 5pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'SGD 350 per pax' }]
      },
      {
        type: 'paragraph',
        text:
          'Please drop a mail to agilityexchange@dbs.com for more details as this course is only offered In House & a minimum of 10 pax required.'
      }
    ]
  },
  {
    title: '(Scrum Alliance) Certified Scrum Product Owner (NUS)',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          {
            text:
              'Approach all aspects of the Product Owner role with skills and confidence'
          },
          { text: 'Gather and write requirements using user stories' },
          { text: 'Create a effective Product Backlog' },
          {
            text:
              'Estimate and plan projects/releases, and manging them to successful completion'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        italic: true,
        text: 'Prerequisite: Introduction to Agile'
      },
      {
        type: 'list',
        items: [
          { text: 'Writing Agile requirements with user stories' },
          { text: 'Techniques for estimating business value' },
          { text: 'Techniques for prioritizing the product backlog' },
          {
            text:
              'Agile project estimation, including velocity and relative estimation'
          },
          {
            text: 'Techniques for relative estimation and estimating velocity'
          },
          {
            text:
              'Estimating fixed date, fixed scope, fixed cost projects and fixed/variable projects'
          },
          { text: 'Estimating large/multi-team projects' },
          { text: 'Agile contracts' },
          { text: 'Release models' },
          { text: 'Minimum viable product' },
          { text: 'Definition of done and managing project risk' },
          { text: 'Strategies for splitting product backlog items' },
          { text: 'Managing requirements change' },
          { text: 'Release backlog and burndown chart' },
          { text: '7 strategies to responding to behind-schedule projects' }
        ]
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          {
            text:
              'Business Analyst Lead, Business Analyst, Business Owner and Product Owner'
          }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 2 days' },
          { text: 'Time: 9am to 6pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [
          {
            text:
              'SGD: $1926 (course) + $77.58 (exam) including GST per pax'
          }
        ]
      }
    ]
  },
  {
    title: '(Scrum Alliance) NICF - Certified Scrum Master (NUS)',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          {
            text:
              'Understand concepts, fundamentals, best practices of using Agile SCRUM to build software'
          },
          {
            text:
              'Learn essential techniques in managing agile development using SCRUM'
          },
          {
            text:
              'Prepare for certification of Scrum Master Assessment conducted by Scrum Alliance'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        italic: true,
        text: 'Prerequisite: Introduction to Agile'
      },
      {
        type: 'list',
        items: [
          { text: 'SCRUM Fundamentals, Roles & Framework' },
          { text: 'Requirements definition and management' },
          { text: 'Project Planning & Estimation' },
          { text: 'Project tracking and leading change' },
          { text: 'Scrum and the orgnaisation' },
          { text: 'Distrubted/ multi-location Scrum' },
          { text: 'Managing Scrum' },
          { text: 'Scrum and development practices/ tools' }
        ]
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration: 3 days' },
          { text: 'Time: 9am to 6pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [
          {
            text:
              'SGD: $1605 (course) + $77.58 (exam) including GST per pax'
          }
        ]
      }
    ]
  },
  {
    title: '(ICAgile Certified) Agile Project Management',
    blocks: [
      { type: 'heading', text: 'Course Objective' },
      {
        type: 'list',
        items: [
          {
            text:
              'The background to and the driving forces for taking an Agile approach to software and solutions development'
          },
          {
            text:
              'The core practices and philosophies behind a number of specific Agile methodologies'
          },
          {
            text:
              'How to apply a number of tools and techniques to develop the project community, from structuring and coordinating self-organising teams to ensuring continuous feedback across all layers of the organization'
          },
          {
            text:
              'How to use Agile techniques to plan, track and monitor Agile projects, programs and portfolios'
          },
          {
            text:
              'The importance of value-driven delivery and continuous customer and user feedback in increasing team effectiveness'
          },
          {
            text:
              'How to apply a variety of Agile tools and techniques to provide a guidance and decision making framework for self-organising Agile teams to ensure their continuous alignment with organizational goals'
          }
        ]
      },
      { type: 'heading', text: 'Course Description' },
      {
        type: 'paragraph',
        text:
          "Want to improve the success rate of your projects? While some organisations using Agile development do not use the title of 'Project Manager' and put a strong emphasis on self-organising teams, Agile project management skills are key to working more cohesively, communicating more effectively with stakeholders, and supporting the team with an appropriate level and combination of leadership and guidance, coordination and facilitation."
      },
      {
        type: 'paragraph',
        text:
          'Our Agile Project Management course will help you learn the skills, techniques, and mindset needed to manage projects using an Agile approach.  You will learn how to collaborate with stakeholders and support self-organising teams in continuously adjusting and refining their efforts to increase efficiency and effectiveness.'
      },
      { type: 'heading', text: 'Target Audience' },
      {
        type: 'list',
        items: [
          {
            text:
              'Managers and Executives responsible for software and solutions development'
          },
          {
            text: 'Iteration Managers and ScrumMasters working on Agile projects'
          },
          {
            text:
              'Project Managers responsible for software and solutions development projects'
          },
          {
            text:
              'Business Analysts gathering requirements for software and solutions development'
          },
          { text: 'Team Leaders and Developers building software systems' },
          {
            text:
              'Business Managers who have to sponsor and are responsible for the introduction of new computer-based information systems'
          }
        ]
      },
      { type: 'heading', text: 'Prerequisites:' },
      {
        type: 'paragraph',
        text:
          'This is an expert level course designed for people with prior experience and fundamental training within Agile and Project Management.  If you need to learn more about Agile practices, then we recommend our Agile Fundamentals course as a lead-in.'
      },
      { type: 'heading', text: 'Schedule' },
      {
        type: 'list',
        items: [
          { text: 'Duration : 2 days' },
          { text: 'Location : External' },
          { text: 'Time : 9am - 6pm' }
        ]
      },
      { type: 'heading', text: 'Cost' },
      {
        type: 'list',
        items: [{ text: 'SGD 1170' }]
      }
    ]
  }
];

/** Second visible inner tab. */
export const learningPathwayTabLabel: string = 'Learning Pathway';

export const learningPathwayIntroParagraphs: string[] = [
  'We believe that to achieve sustainable agility, organizations need competent agilists at every level and across all disciplines. Imagine having not only knowledgeable, but also competent agile professionals in development, testing, coaching, engineering, etc. Our goal is to help professionals go on a learning journey that leads to mastery in their discipline of choice.'
];

export const learningPathwayImageSrc: string =
  'public/images/JIT-training-pack/inner-tab-img.png';

/**
 * Third inner tab content (classic tab title uses uk-hidden; body is active).
 */
export const ibfFundingTabLabel: string = 'IBF Funding';

export const ibfFundingHero = {
  redTitle: 'KNOWLEDGE HUB',
  title: 'COURSE FUNDING',
  introParagraph:
    'Learn more about funding schemes that are available for you here.',
  imageSrc: 'public/images/JIT-training-pack/IBF-Funding.png'
};

export const ibfFundingSectionHeading: string =
  'IBF FUNDING - FINANCIAL TRAINING SCHEME';

export const ibfFundingColumns: IIbfColumn[] = [
  {
    blocks: [
      {
        heading: 'WHAT IT IS?',
        paragraphs: [
          'Providing funding for financial sector - specific training programmes which are recognised under FTS'
        ]
      },
      {
        heading: 'ELIGIBILITY',
        listItems: [
          'Only company-sponsored individuals',
          'Singapore Citizens or Singapore Permanent Residents(physically based in Singapore)',
          'Must successfully complete programme (includes passing all relevant assessments and examinations to qualify for reimbursement)'
        ]
      },
      {
        heading: 'FUNDING QUANTUM',
        listItems: [
          '90% subsidy of direct training cost',
          [
            { text: 'Available for training programmes commencing between ' },
            {
              text: '8 April 2002 and 31 December 2021',
              bold: true
            },
            { text: ' (both dates inclusive)' }
          ]
        ]
      },
      {
        heading: 'GRANT CAP',
        paragraphs: [
          [
            {
              text: 'Up to S$2,000 per participant per programme',
              bold: true
            }
          ]
        ]
      }
    ]
  },
  {
    blocks: [
      {
        heading: 'APPLICATION PROCESS',
        paragraphs: [
          [
            {
              text:
                'It will take approximately 1 month from the date of submission for the funding to be approved before training sessions can be conducted. There is a funding application fee of '
            },
            {
              text: 'S$200 per programme upfront (non-reimbursable)',
              bold: true
            },
            { text: '.' }
          ]
        ]
      },
      {
        heading: 'REIMBURSEMENT',
        paragraphs: ['Reimbursement can take up to 6 months.']
      },
      {
        heading: 'FURTHER INSTRUCTION',
        listItems: [
          'SkillsFuture Credit (SFC) cannot be used to co-fund the programme fees of company-sponsored training programmes',
          'Subsidy is by programme. You may combine 2 courses into a single program but participants will be required to attend both courses to eligible for IBF will check relevancy through the training materials submitted during application.'
        ]
      }
    ]
  }
];

export const ibfFundingFooterLinks: IIbfFooterLink[] = [
  {
    prefix: 'For more information, refer to',
    link: {
      label: 'https://www.ibf.org.sg/programmes/Pages/IBF-FTS.aspx',
      href: 'https://www.ibf.org.sg/programmes/Pages/IBF-FTS.aspx'
    }
  },
  {
    prefix: 'Download the application form',
    link: {
      label: 'here',
      href:
        'https://dbs1bank.sharepoint.com/:w:/s/PlatformTransformationOffice/EbeoGbnat5BMuhhemmyaanQBoSH5O1__oP7Zrrf3pES_CA?e=MTfehd'
    }
  },
  {
    prefix: 'For further enquiries, email',
    link: {
      label: 'agilityexchange@dbs.com',
      href: 'mailto:agilityexchange@dbs.com'
    }
  }
];

/** Ordered inner tabs under Agile Training outer tab. */
export const trainingInnerTabs: Array<{
  key: 'agileTraining' | 'learningPathway' | 'ibfFunding';
  label: string;
  /** Classic uses uk-hidden on the IBF Funding tab title. */
  tabHidden?: boolean;
}> = [
  { key: 'agileTraining', label: 'Agile Training' },
  { key: 'learningPathway', label: learningPathwayTabLabel },
  { key: 'ibfFunding', label: ibfFundingTabLabel, tabHidden: true }
];
