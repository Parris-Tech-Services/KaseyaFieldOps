import type { AppModule, Scenario, Flashcard, RealTicketCase } from '../types';

export const module: AppModule = {
  id: 'datto-saas-protection',
  name: 'Datto SaaS Protection',
  description: 'Cloud-to-cloud backup for Microsoft 365 and Google Workspace.',
  iconName: 'CloudRain',
  color: 'bg-cyan-600',
  order: 2,
  problemSolved: 'Microsoft and Google do not back up your cloud data natively. They ensure uptime, but if a user deletes a file or gets ransomware, the data is gone. SaaS Protection provides an independent backup of that data.',
  mentalModel: 'It is a safety net for cloud emails and files. It connects directly to Microsoft/Google APIs and copies the data to Datto\'s cloud three times a day.',
  keyTerminology: [
    
    { term: 'Timestamped Restore Folder', definition: 'A designated folder created during a restore that prevents existing current data from being overwritten.' },
    { term: 'ICR (Infinite Cloud Retention)', definition: 'Keeping backups forever as long as the subscription is active, even if the user is deleted.' }
  ],
  actualUseCases: [
    'Restoring an email a user accidentally permanently deleted',
    'Rolling back a OneDrive that was encrypted by ransomware',
    'Exporting a departed executive\'s mailbox to a PST file for legal retention',
    'Restoring a deleted SharePoint document library'
  ],
  commonWorkflows: [
    'Connecting a new M365 tenant and enabling Auto-Add',
    'Performing a direct-to-mailbox restore of a lost folder',
    'Managing seat caps and unprotecting archived users to free up licenses'
  ],
  whenNotToUse: [
    'Do not use this to back up local files on a laptop (use File Protection).',
    'Do not use this to back up an Azure VM or on-prem server (use BCDR/Azure Backup).',
    'Do not use this to block phishing emails (use INKY).'
  ],
  relatedProducts: ['Datto Backup', 'Datto File Protection', 'INKY'],
  commonConfusions: [
    'Confused with INKY: SaaS Protection backs up emails, INKY blocks bad emails.',
    'Confused with Datto Backup (BCDR): SaaS Protection is for M365 cloud data, BCDR is for whole servers.',
    'Confused with Datto File Protection: SaaS Protection backs up OneDrive/SharePoint, File Protection backs up the local C: drive.'
  ],
  sources: [
    {
      title: "Datto SaaS Protection Overview",
      url: "https://www.datto.com/products/saas-protection/",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Cloud-to-cloud backup", "3x daily backups", "M365 & Google Workspace"]
    },
    {
      title: "Migrating from Backupify to Datto SaaS Protection",
      url: "https://help.one.kaseya.com/help/Content/1_Configuration/backupify-migrate.htm",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Backupify migration path"]
    }
  ]
};


export const scenarios: Scenario[] = [
  {
    id: 'saas-missing-user',
    moduleId: 'datto-saas-protection',
    title: 'Missing User in Backup',
    description: 'A newly onboarded employee is not showing up in the Datto SaaS Protection backups for M365.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'A client submits a ticket that their new hire, Bob, is not being backed up in Datto SaaS Protection. You log into the dashboard. What is the first thing you should check?',
        options: [
          { id: 'opt-1-1', text: 'Check if Bob has a valid Microsoft 365 license assigned.', isCorrect: true, feedback: 'Correct. Datto SaaS Protection typically auto-discovers users based on them having a valid M365 license (like Business Basic or higher).', nextStepId: 'step-2' },
          { id: 'opt-1-2', text: 'Manually run a backup for the entire tenant.', isCorrect: false, feedback: 'Running a backup won\'t help if the user hasn\'t been discovered or licensed yet.', nextStepId: 'step-1' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'You confirm Bob has an M365 Business Standard license. Why might he still not be in SaaS Protection?',
        options: [
          { id: 'opt-2-1', text: 'The auto-add functionality is disabled in the SaaS Protection settings.', isCorrect: true, feedback: 'Yes. If "Auto Add New Users" is turned off, you must manually select and add new users to the backup task.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'You enable Auto-Add for the tenant. What happens next?',
        options: [
          { id: 'opt-3-1', text: 'Bob will be picked up during the next automatic sync (usually within 24 hours), or you can force a sync now.', isCorrect: true, feedback: 'Correct. You can wait for the sync or force one from the dashboard to add him immediately.' }
        ]
      }
    }
  },
  {
    id: 'saas-restore-email',
    moduleId: 'datto-saas-protection',
    title: 'Restoring a Deleted Email',
    description: 'A user accidentally permanently deleted a critical email folder.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'A user calls in a panic because they Shift+Deleted their "Contracts 2025" folder in Outlook. You go to Datto SaaS Protection. How do you find the data?',
        options: [
          { id: 'opt-1-1', text: 'Navigate to the user\'s Exchange backup, select a snapshot from before the deletion, and browse/search for the folder.', isCorrect: true, feedback: 'Correct. You must select a Snapshot before the data was deleted to restore it.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'You locate the "Contracts 2025" folder in yesterday\'s snapshot. What restore option should you choose?',
        options: [
          { id: 'opt-2-1', text: 'Restore directly to the user\'s mailbox.', isCorrect: true, feedback: 'Yes, doing a direct restore is usually the most seamless for the user.', nextStepId: 'step-3' },
          { id: 'opt-2-2', text: 'Export to PST.', isCorrect: false, feedback: 'While possible, exporting to PST and requiring the user to import it is a poor experience compared to a direct restore.', nextStepId: 'step-2' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'When you choose to restore directly, where does the data go by default?',
        options: [
          { id: 'opt-3-1', text: 'It restores to a new folder named "SaaS Protection Restore YYYY-MM-DD HH:MM:SS" in the user\'s mailbox.', isCorrect: true, feedback: 'Correct. It does not overwrite existing data; it places the restored items in a clearly marked folder.' }
        ]
      }
    }
  },
  {
    id: 'saas-sharepoint-site',
    moduleId: 'datto-saas-protection',
    title: 'SharePoint Site Backup',
    description: 'A newly created SharePoint site is missing from the backup.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'The client created a new "Marketing 2026" SharePoint site yesterday, but it is not listed in SaaS Protection. What is the cause?',
        options: [
          { id: 'opt-1-1', text: 'SharePoint sites, unlike users, are not always auto-added depending on settings. You need to check the Site discovery and auto-add settings.', isCorrect: true, feedback: 'Correct. SharePoint discovery can be handled differently than user discovery.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'You see the site in the "Unprotected Sites" list. How do you protect it?',
        options: [
          { id: 'opt-2-1', text: 'Select the site and click "Protect" to assign a license and begin backing it up.', isCorrect: true, feedback: 'Yes, manually assigning protection moves it to the active backup queue.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'Once protected, when will the first backup complete?',
        options: [
          { id: 'opt-3-1', text: 'An initial backup is scheduled immediately and may take some time depending on the site size.', isCorrect: true, feedback: 'Correct. The initial ingestion takes longer, subsequent backups are incremental.' }
        ]
      }
    }
  },
  {
    id: 'saas-seat-limit',
    moduleId: 'datto-saas-protection',
    title: 'Seat Limit Reached',
    description: 'Backups are failing for new users due to a licensing cap.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You get an alert that SaaS Protection failed to add 3 new users. The error says "Seat limit reached". What does this mean?',
        options: [
          { id: 'opt-1-1', text: 'The MSP\'s committed seat count or a hard cap set for the tenant has been exceeded.', isCorrect: true, feedback: 'Correct. Many environments use hard caps to prevent unexpected billing overages.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you resolve this?',
        options: [
          { id: 'opt-2-1', text: 'Increase the seat cap in the Datto Partner Portal for this tenant.', isCorrect: true, feedback: 'Yes, you need to authorize billing for more seats to allow the users to be protected.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'Alternatively, how could you free up seats without increasing the cap?',
        options: [
          { id: 'opt-3-1', text: 'Unprotect archived or departed users (keeping in mind retention policies) to free up their licenses.', isCorrect: true, feedback: 'Correct. Unprotecting stops future backups and frees the seat, though the historical data retention depends on the product (e.g., Infinite Cloud Retention).' }
        ]
      }
    }
  },
  {
    id: 'saas-onedrive-ransomware',
    moduleId: 'datto-saas-protection',
    title: 'OneDrive Ransomware Recovery',
    description: 'A user\'s OneDrive was hit by ransomware and all files are encrypted.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'A user clicked a bad link and their entire OneDrive is filled with .locked files. You need to restore it. What is the best approach?',
        options: [
          { id: 'opt-1-1', text: 'Use the Snapshot restore feature in Datto SaaS Protection for their OneDrive.', isCorrect: true, feedback: 'Correct. This is exactly what Snapshot restore is for—recovering from ransomware encrypting data.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'You have identified a clean snapshot from before the ransomware event. Where should you restore the data to?',
        options: [
          { id: 'opt-2-1', text: 'Choose a timestamped restore folder or an alternate location to avoid overwriting any unencrypted current data while verifying the restore.', isCorrect: true, feedback: 'Correct. Timestamped folders prevent overwriting any current legitimate files that may have synced.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'Before finalizing the restore, what must you confirm regarding the destination?',
        options: [
          { id: 'opt-3-1', text: 'Confirm the user\'s endpoint is completely cleaned of the ransomware, otherwise it will just encrypt the restored files again.', isCorrect: true, feedback: 'Crucial step. Never restore data to an infected environment.' }
        ]
      }
    }
  },
  {
    id: 'saas-export-offboarding',
    moduleId: 'datto-saas-protection',
    title: 'Exporting Data for Offboarding',
    description: 'A client requests an export of a departed executive\'s emails.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'The CEO of a client resigned. The client requests a full copy of their mailbox provided on a secure drive. How do you extract this from SaaS Protection?',
        options: [
          { id: 'opt-1-1', text: 'Navigate to the user\'s Exchange backup, select the latest snapshot, and choose the Export option.', isCorrect: true, feedback: 'Correct. Exporting is the right function for taking data out of the system.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'What format will the Exchange export be in?',
        options: [
          { id: 'opt-2-1', text: 'It will export as a PST file.', isCorrect: true, feedback: 'Yes, PST is the standard format for Exchange/Outlook data exports.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'procedure',
        text: 'The export is large (50GB). How do you retrieve it once initiated?',
        options: [
          { id: 'opt-3-1', text: 'SaaS Protection processes the export in the background. You download it from the Exports tab once it is ready.', isCorrect: true, feedback: 'Correct. You don\'t have to keep the browser open. It processes asynchronously.' }
        ]
      }
    }
  }
];

export const cards: Flashcard[] = [
  { id: 'fc-saas-1', moduleId: 'datto-saas-protection', question: 'How often does Datto SaaS Protection back up M365/Google Workspace by default?', answer: 'Three times a day automatically.' },
  { id: 'fc-saas-2', moduleId: 'datto-saas-protection', question: 'What is the default retention period for Datto SaaS Protection?', answer: 'Typically Infinite Cloud Retention (ICR), meaning data is kept forever as long as the service is active, but 1-year options exist.' },
  { id: 'fc-saas-3', moduleId: 'datto-saas-protection', question: 'Does pausing a user\'s backup delete their historical data?', answer: 'No, pausing (or unprotecting) stops new backups and frees a license seat, but historical data remains per the retention policy.' },
  { id: 'fc-saas-4', moduleId: 'datto-saas-protection', question: 'What format are OneDrive/Google Drive files exported in?', answer: 'A standard ZIP file containing the original file formats.' },
  { id: 'fc-saas-5', moduleId: 'datto-saas-protection', question: 'What does a "Partial" backup status mean?', answer: 'The backup ran, but some items failed to back up (e.g., due to API throttling from Microsoft/Google or a corrupt item).' },
  { id: 'fc-saas-6', moduleId: 'datto-saas-protection', question: 'Where do direct restores of emails go by default in M365?', answer: 'To a newly created folder named "SaaS Protection Restore" with the date and time, to prevent overwriting current data.' },
  { id: 'fc-saas-7', moduleId: 'datto-saas-protection', question: 'Can Datto SaaS Protection back up Microsoft Teams chats?', answer: 'Yes, it backs up Teams channels, files, and conversations, though API limitations sometimes affect private 1:1 chats depending on configuration.' },
  { id: 'fc-saas-8', moduleId: 'datto-saas-protection', question: 'What happens if you turn on "Auto-Add New Users"?', answer: 'SaaS Protection will automatically detect new users with valid licenses in the tenant and begin backing them up without manual intervention.' },
  { id: 'fc-saas-9', moduleId: 'datto-saas-protection', question: 'Is Datto SaaS Protection subject to Microsoft/Google API throttling?', answer: 'Yes. If a tenant is heavily utilized, Microsoft/Google may throttle the API, causing backups to take longer or fail temporarily.' },
  { id: 'fc-saas-10', moduleId: 'datto-saas-protection', question: 'How do you restore a deleted SharePoint document library?', answer: 'Go to the SharePoint section, select the site, pick a snapshot prior to deletion, and select the library to restore.' },
  { id: 'fc-saas-11', moduleId: 'datto-saas-protection', question: 'Can you restore a Google Workspace email to a different user\'s account?', answer: 'Yes, cross-user restores are supported in both Google Workspace and M365.' },
  { id: 'fc-saas-12', moduleId: 'datto-saas-protection', question: 'What is a best practice when restoring a large amount of ransomware-affected data?', answer: 'Restore to a timestamped folder or alternate location to avoid overwriting current data until you can verify it.' },
  { id: 'fc-saas-13', moduleId: 'datto-saas-protection', question: 'If a user is hard-deleted in M365, what happens to their SaaS Protection backup?', answer: 'The backups are retained indefinitely (if on ICR) even if the user is deleted in M365.' },
  { id: 'fc-saas-14', moduleId: 'datto-saas-protection', question: 'What permission level is required to authorize SaaS Protection for an M365 tenant?', answer: 'Global Administrator.' },
  { id: 'fc-saas-15', moduleId: 'datto-saas-protection', question: 'How are exports downloaded?', answer: 'Via the web browser from the Exports tab once the background generation is complete.' },
  { id: 'fc-saas-16', moduleId: 'datto-saas-protection', question: 'What is Snapshot Restore?', answer: 'A feature that restores snapshot data to a designated timestamped folder to recover from ransomware without overwriting current data.' },
  { id: 'fc-saas-17', moduleId: 'datto-saas-protection', question: 'Can you search for specific emails inside a backup without restoring?', answer: 'Yes, you can use the search bar to find emails by subject, sender, or date within a snapshot.' }
];

export const ticketCases: RealTicketCase[] = [
  {
    id: 'saas-ticket-1',
    date: '2023-11-15T14:30:00Z',
    moduleId: 'datto-saas-protection',
    symptoms: 'Client submitted a ticket stating a terminated employee\'s mailbox is missing from their M365 environment and needs to retrieve a contract from 3 years ago.',
    initialThought: 'The client probably hard-deleted the user in M365 without converting to a shared mailbox first.',
    investigation: 'Checked Datto SaaS Protection dashboard for the tenant. Found the user under the "Unprotected" or archived list. The Infinite Cloud Retention (ICR) policy means the data was still there even though the user was purged from Microsoft.',
    resolution: 'Used Snapshot Restore in Datto SaaS to perform an export of the user\'s entire mailbox to a PST file. Provided the PST securely to the client\'s HR department.',
    lessonsLearned: 'Always verify if ICR is enabled for a tenant. Datto SaaS protects against administrative mistakes like deleting a user without archiving them natively.',
    fasterNextTime: 'Instead of searching M365 audit logs for the deletion event first, immediately check the SaaS Protection archives to see if the data is safely retained.'
  },
  {
    id: 'saas-ticket-2',
    date: '2024-02-10T09:15:00Z',
    moduleId: 'datto-saas-protection',
    symptoms: 'Alert: "SaaS Protection Backup Failed - Seat Limit Reached" for a newly onboarded VIP user.',
    initialThought: 'The client\'s license count wasn\'t incremented when the new user was created in M365.',
    investigation: 'Logged into the partner portal and verified the seat cap for the tenant was set to 50. Checked the M365 tenant, and they had exactly 51 active licensed users. The auto-add feature attempted to protect the new user but was blocked by the hard cap.',
    resolution: 'Accessed the Datto Partner Portal, increased the SaaS Protection seat cap for the client from 50 to 55, and forced a manual sync. The new VIP user successfully backed up.',
    lessonsLearned: 'Hard caps prevent unexpected billing overages but require manual intervention during onboarding. Align onboarding checklists to include bumping the backup seat cap.',
    fasterNextTime: 'Include "Check/Increase Datto SaaS Seat Cap" in the standard new-user onboarding SOP to prevent the alert from firing in the first place.'
  },
  {
    id: 'saas-ticket-3',
    date: '2024-05-22T11:45:00Z',
    moduleId: 'datto-saas-protection',
    symptoms: 'User reports all files in their OneDrive are appended with .locked and they cannot open anything.',
    initialThought: 'Classic ransomware infection encrypting synced local files and propagating the changes to the cloud OneDrive.',
    investigation: 'Immediately disabled the user\'s sign-in and revoked M365 sessions to stop the spread. Verified the endpoint was infected. Checked SaaS Protection and found the latest backup from 2 hours ago contained the unencrypted files.',
    resolution: 'Contained the infected endpoint. Used the Snapshot Restore feature in SaaS Protection to perform a restore of the user\'s OneDrive to a timestamped folder, rolling it back to the snapshot from before the infection.',
    lessonsLearned: 'Snapshot restores to designated folders prevent accidental data loss of unaffected files while recovering from ransomware.',
    fasterNextTime: 'Don\'t waste time trying to clean the infected endpoint; isolate it immediately, verify the backup health, and proceed with a full Snapshot restore.'
  }
];

