/**
 * Static content for JIT Pack → DBS Agile Guild.
 * Source: agile-exchange/JIT-pack.aspx (active blocks only; commented HTML skipped).
 */

export interface IGuildCharacteristic {
  label: string;
  text: string;
}

export const guildIntroParagraphs: string[] = [
  'DBS Agile Guild refers to our community of practice within the organization who share a common interest or expertise in agile principles and practices. Guilds are focused to promote knowledge sharing, collaboration, and continuous learning among members of an organization who are involved in agile development processes.'
];

export const guildPurposeHeading: string = 'Key purpose and focus areas :';

export const guildCharacteristics: IGuildCharacteristic[] = [
  {
    label: 'Common Interest',
    text:
      'Guild members share a common interest in agile practices, methodologies, or specific aspects of agile, such as Scrum, Kanban, Lean, or DevOps.'
  },
  {
    label: 'Cross-Functional',
    text:
      'Guilds often consists of members from various roles and departments within the organization, including developers, testers, product owners, Scrum Masters, and other stakeholders. This diversity can help promote a broader understanding of agile across the organization.'
  },
  {
    label: 'Knowledge Sharing',
    text:
      'Guilds facilitate the exchange of knowledge and best practices related to agile. We co-create a backlog with intrested areas to learn and conduct periodic sessions to foster cross learning.'
  },
  {
    label: 'Continuous Learning',
    text:
      'Agile Guilds emphasize continuous learning and improvement. We may invite external experts to present on relevant topics, or they may collectively tackle challenges and experiment with new agile techniques.'
  },
  {
    label: 'Community Building',
    text:
      'Guilds can foster a sense of community and camaraderie among those who are passionate about agile. This sense of belonging can encourage greater engagement and commitment to agile practices.'
  },
  {
    label: 'Alignment with Organizational Goals',
    text:
      "Agile Guilds align their activities and initiatives with the broader goals of the organization, ensuring that the agile practices they promote are in sync with the business's needs and objectives."
  }
];

export const guildClosingParagraph: string =
  'In DBS the Agile Guilds are just one way our organisational functions and teams can promote agile principles and practices. They can complement other agile structures like Scrum Teams, Agile CoEs (Centers of Excellence), and communities of practice. The specific roles and activities of the Agile Guild may vary, but the central focus is on improving agility and sharing knowledge throughout the organization.';
