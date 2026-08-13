/**
 * Static content for JIT Pack → Self-help → Additional Information.
 * Source: agile-exchange/JIT-pack.aspx (active blocks only; commented HTML skipped).
 */

export interface IContentLink {
  label: string;
  href: string;
}

export interface IAdditionalInfoItem {
  description: string;
  isNew?: boolean;
  links: IContentLink[];
}

export interface IAdditionalInfoColumn {
  heading: string;
  /** Distinguishes the two classic "Articles" columns (external vs platform). */
  key: 'articles' | 'videos' | 'others' | 'articlesPlatform';
  items: IAdditionalInfoItem[];
}

export const additionalInfoSectionHeading: string = 'Click on each section to view';

export const additionalInfoColumns: IAdditionalInfoColumn[] = [
  {
    key: 'articles',
    heading: 'Articles',
    items: [
      {
        description: 'The digital reinvention of of an Asan Bank - McKinsey Quarterly',
        isNew: true,
        links: [
          {
            label: 'Read Here',
            href:
              'https://dbs1bank.sharepoint.com/:b:/r/sites/sgtnoAgilityX/Knowledge%20Hub/Additional%20Materials/The-digital-reinvention-of-an-Asian-bank%20(1).pdf?csf=1&e=dvhBFk'
          }
        ]
      },
      {
        description: 'Agile at Scale - Harvard Business Review',
        isNew: true,
        links: [
          {
            label: 'Read Here',
            href:
              'https://dbs1bank.sharepoint.com/:b:/r/sites/sgtnoAgilityX/Knowledge%20Hub/Additional%20Materials/Agile%20at%20Scale%20-%20HBR%20.PDF?csf=1&e=gbTmxH'
          }
        ]
      },
      {
        description: 'Scaling Agile @ Spotify with Tribes, Squads, Chapters & Guild',
        links: [
          {
            label: 'Read Here',
            href:
              'https://dbs1bank.sharepoint.com/sites/sgtnoAgilityX/Knowledge%20Hub/Additional%20Materials/113617905-scaling-agile-spotify-11[1].pdf?csf=1'
          }
        ]
      }
    ]
  },
  {
    key: 'videos',
    heading: 'Videos',
    items: [
      {
        description:
          'Jeff Sutherland, one of the inventors of Scrum, shares how agile has gone beyond software development and is being used in education.',
        links: [
          {
            label: 'Watch Video',
            href: 'https://www.youtube.com/watch?v=Zne-hiFFs74'
          }
        ]
      },
      {
        description:
          'Find out how small businesses in Cornwall are using agile to get ahead of their competition',
        links: [
          {
            label: 'Watch Video',
            href: 'https://www.youtube.com/watch?v=eoxxsfXsulQ'
          }
        ]
      }
    ]
  },
  {
    key: 'others',
    heading: 'Others',
    items: [
      {
        description: 'Agile Recommended Readings by Role',
        links: [
          {
            label: 'Read Here',
            href:
              'https://dbs1bank.sharepoint.com/sites/sgtnoAgilityX/Knowledge%20Hub/Tools%20and%20Templates/SH_AM_Recommended%20Agile%20Reading_v1.0.pdf'
          }
        ]
      },
      {
        description: 'Role Comparison Guide',
        links: [
          {
            label: 'Read Here',
            href:
              'https://dbs1bank.sharepoint.com/sites/sgtnoAgilityX/_layouts/15/WopiFrame.aspx?sourcedoc=%7b6F8CA7CA-5AD6-4CCA-9631-DAADB08607DC%7d&file=Role%20Comparison%20Guide_v1.0.pptx&action=default'
          }
        ]
      }
    ]
  },
  {
    key: 'articlesPlatform',
    heading: 'Articles',
    items: [
      {
        description:
          'Agile Matters - Why and How"  - Back 2 School - Archana, David and Cameron',
        links: [
          {
            label: 'Watch Video',
            href:
              'https://dbs1bank.sharepoint.com/sites/sgc2eengage/SiteAssets/SitePages/Back2School/03_Session%20Recordings/Day%209/5.%20Agile%20Matters%20-%20Why%20and%20How.mp4'
          },
          {
            label: 'Material',
            href: ''
          }
        ]
      }
    ]
  }
];
