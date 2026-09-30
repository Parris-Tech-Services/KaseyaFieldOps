import type { AppModule, Scenario, Flashcard } from '../types';

export const module: AppModule = {
  id: 'datto-file-protection',
  name: 'Datto File Protection',
  description: 'Cloud-managed file and folder backup for endpoints.',
  iconName: 'Files',
  color: 'bg-indigo-500',
  order: 5,
  problemSolved: 'Provides continuous file and folder backup for workstations and laptops, especially for roaming users who rarely connect to the corporate network.',
  mentalModel: 'Think of it as a highly secure, centrally managed alternative to local hard drives or simple cloud sync. It silently backs up user files (Documents, Desktop, Downloads) continuously over any internet connection directly to the Datto Cloud.',
  actualUseCases: [
    'Backing up executive laptops that travel frequently.',
    'Protecting remote workers who don\'t connect to a central file server.',
    'Allowing end-users to self-restore a deleted file without opening a helpdesk ticket.',
  ],
  commonWorkflows: [
    'Deploying the Datto File Protection Desktop agent silently via Datto RMM.',
    'Creating backup profiles to specify which folders to include or exclude.',
    'Restoring a file from a previous version (up to 180 days retention).',
  ],
  whenNotToUse: [
    'Do not use this for backing up applications, databases, or operating systems (use Datto SIRIS/ALTO).',
    'Do not use this for backing up Microsoft 365 cloud data (use Datto SaaS Protection).',
  ],
  keyTerminology: [
    { term: 'DFP Desktop', definition: 'The software agent installed on workstations to facilitate backups.' },
    { term: 'DFP Server', definition: 'A specific version of the agent for backing up server file shares.' },
    { term: 'Backup Profile', definition: 'A centralized configuration dictating what paths are backed up and what file extensions are excluded.' },
  ],
  relatedProducts: ['Datto RMM', 'Datto Backup'],
  commonConfusions: [
    'Confused with Datto Backup (BCDR): DFP cannot restore an operating system or perform virtualization. It only restores files.',
    'Confused with OneDrive: While OneDrive syncs files, DFP is a true backup solution with version history (up to 180 days) managed entirely by the MSP.',
  ],
  sources: [
    {
      title: "Datto File Protection Overview",
      url: "https://www.datto.com/products/file-protection/",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Continuous file backup", "180-day retention", "RMM deployment integration"]
    }
  ]
};

export const scenarios: Scenario[] = [
  {
    id: 'dfp-roaming-laptop',
    moduleId: 'datto-file-protection',
    title: 'Stolen Remote Laptop',
    description: 'A remote salesperson\'s laptop is stolen at an airport.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'A salesperson calls the helpdesk. Their laptop was stolen. They had Datto File Protection installed. How do you ensure their files are safe from the thief?',
        options: [
          { id: 'opt-1-1', text: 'Issue a remote wipe command from the Datto File Protection Manager portal.', isCorrect: false, feedback: 'Incorrect. While some MDMs do this, DFP does not have a device wipe feature; it only backs up data.', nextStepId: 'step-1' },
          { id: 'opt-1-2', text: 'Nothing in DFP prevents access to the physical device. You rely on Windows BitLocker for that. DFP ensures you have a copy of their data.', isCorrect: true, feedback: 'Correct. DFP is for backup, not endpoint physical security. You use it to restore data to their replacement laptop.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'The user gets a replacement laptop. How do you restore their files?',
        options: [
          { id: 'opt-2-1', text: 'Install the DFP Desktop agent on the new laptop and use the restore feature to pull their backed-up files down from the Datto Cloud.', isCorrect: true, feedback: 'Yes. You can target the restore to the new device seamlessly.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'The user asks if they can just log into a website to grab an urgent presentation right now.',
        options: [
          { id: 'opt-3-1', text: 'Yes, they can log into the DFP web portal to securely download individual files immediately.', isCorrect: true, feedback: 'Correct. End-users have self-service web access to their backed-up files.' }
        ]
      }
    }
  }
];

export const cards: Flashcard[] = [
  { id: 'fc-dfp-1', moduleId: 'datto-file-protection', question: 'What does Datto File Protection back up?', answer: 'Files and folders on endpoints (workstations/laptops) and servers. It does NOT back up operating systems or applications.' },
  { id: 'fc-dfp-2', moduleId: 'datto-file-protection', question: 'How long are deleted files or file versions retained in DFP?', answer: 'Up to 180 days.' },
  { id: 'fc-dfp-3', moduleId: 'datto-file-protection', question: 'How is DFP typically deployed at scale?', answer: 'Silently via an RMM tool like Datto RMM or Kaseya VSA using a deployment script.' },
  { id: 'fc-dfp-4', moduleId: 'datto-file-protection', question: 'Can an end-user restore their own files?', answer: 'Yes, users can perform self-service restores via the desktop agent or the web portal without helpdesk intervention.' }
];
