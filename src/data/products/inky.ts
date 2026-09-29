import type { AppModule, Scenario, Flashcard, RealTicketCase } from '../types';

export const module: AppModule = {
  id: 'inky',
  name: 'INKY',
  description: 'Advanced email security and phishing prevention.',
  iconName: 'MailWarning',
  color: 'bg-purple-600',
  order: 10,
  problemSolved: 'Standard email filters miss sophisticated phishing and Business Email Compromise (BEC) attacks. Users get tricked into clicking bad links or paying fake invoices.',
  mentalModel: 'INKY acts as a smart bodyguard for your inbox. It reads every email, looks for red flags (like fake logos or weird sender addresses), and stamps a colored warning banner directly on the email so the user knows if it\'s safe.',
  keyTerminology: [
    { term: 'Phish Fence', definition: 'The core engine that analyzes emails using machine learning and computer vision.' },
    { term: 'Banner', definition: 'The visual warning (Red, Yellow, Gray) injected at the top of the email body.' },
    { term: 'Journal Mode', definition: 'Monitoring mode where INKY scores emails but does not show banners or quarantine anything.' }
  ],
  actualUseCases: [
    'Stopping a fake "Urgent Invoice" email from reaching the CFO',
    'Warning a user that an email is from a first-time sender',
    'Detecting an internal compromised account sending spam'
  ],
  commonWorkflows: [
    'Investigating a user-reported email via the INKY dashboard',
    'Reclassifying a false positive (legitimate email marked as spam)',
    'Deploying INKY in Journal Mode for a new client'
  ],
  whenNotToUse: [
    'Do not use this to restore an email that was deleted a month ago (use SaaS Protection).',
    'Do not use this to send simulated phishing tests (use BullPhish ID).'
  ],
  relatedProducts: ['Datto SaaS Protection', 'BullPhish ID'],
  commonConfusions: [
    'Confused with SaaS Protection: INKY secures incoming mail, SaaS Protection backs up the mailbox.',
    'Confused with BullPhish ID: INKY blocks real attacks, BullPhish ID simulates fake ones for training.'
  ],
  sources: [
    {
      title: "INKY Email Security Overview",
      url: "https://www.kaseya.com/products/inky-email-security/",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["GenAI/Computer Vision detection", "Dynamic warning banners", "operates before the inbox"]
    }
  ]
};

export const scenarios: Scenario[] = [
  {
    id: 'inky-suspicious-email',
    moduleId: 'inky',
    title: 'Suspicious Email Banner',
    description: 'An executive reports a yellow INKY banner on an email from a vendor.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'decisionMaking',
        text: 'The CFO forwards an email with a yellow INKY banner saying "First Time Sender". The sender claims to be a known vendor updating their payment details. What do you do?',
        options: [
          {
            id: 'opt-1-1',
            text: 'Whitelist the sender address in INKY to remove the banner.',
            isCorrect: false,
            feedback: 'Never blindly whitelist a first-time sender asking for payment detail changes. This is a classic BEC (Business Email Compromise) indicator.',
            nextStepId: 'step-1',
          },
          {
            id: 'opt-1-2',
            text: 'Analyze the email details in the INKY dashboard to check the sender\'s actual domain, SPF/DKIM/DMARC status.',
            isCorrect: true,
            feedback: 'Correct. You must investigate the technical headers and authentication status first.',
            nextStepId: 'step-2',
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'investigation',
        text: 'In the INKY dashboard, you see the domain is a lookalike (e.g., vend0r.com instead of vendor.com). What is your next action?',
        options: [
          {
            id: 'opt-2-1',
            text: 'Reply to the sender telling them they are blocked.',
            isCorrect: false,
            feedback: 'Do not engage with threat actors.',
            nextStepId: 'step-2',
          },
          {
            id: 'opt-2-2',
            text: 'Classify the message as Malicious/Phishing in INKY, which directs it to quarantine, and notify the CFO to disregard.',
            isCorrect: true,
            feedback: 'Exactly. Protect the user, classify correctly to train the model, and communicate clearly.',
          }
        ]
      }
    }
  },
  {
    id: 'inky-migration',
    moduleId: 'inky',
    title: 'Migrating to INKY',
    description: 'Migrating a client from Graphus or SaaS Defense to INKY.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'You are migrating a Microsoft 365 tenant from Graphus to INKY. What is the correct sequence regarding their active protection?',
        options: [
          { id: 'opt-1-1', text: 'Import Graphus settings (allow/block/VIPs) into INKY, deploy INKY alongside Graphus temporarily, then disable Graphus protection via its API integration.', isCorrect: true, feedback: 'Correct. Graphus scanned mail after delivery, while INKY operates before the inbox via connectors. You deploy INKY, ensure it is routing correctly, then disable Graphus.', nextStepId: 'step-2' },
          { id: 'opt-1-2', text: 'Remove Graphus mail flow rules and Exchange connectors first.', isCorrect: false, feedback: 'Incorrect. Graphus scanned mail post-delivery via API. INKY operates before the inbox using mail flow connectors.', nextStepId: 'step-1' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'With the old solution removed, you authorize the INKY application. What happens next?',
        options: [
          { id: 'opt-2-1', text: 'INKY creates its own mail flow rules and connectors in Exchange Online to route mail through its scanning engines.', isCorrect: true, feedback: 'Yes. INKY automates the setup, but you must ensure it completes successfully.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'procedure',
        text: 'How do you verify the new INKY setup is working correctly?',
        options: [
          { id: 'opt-3-1', text: 'Send test emails from an external address to an internal user and verify they receive the INKY banner.', isCorrect: true, feedback: 'Correct. The banner is the easiest visual proof that mail is flowing through INKY.' }
        ]
      }
    }
  },
  {
    id: 'inky-banner-customization',
    moduleId: 'inky',
    title: 'Banner Customization Edge Cases',
    description: 'A client wants to change the default behavior of INKY banners.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'A legal client wants to disable all INKY banners on emails originating from their own domain, even if they are spoofed, because they think it looks unprofessional. How do you advise them?',
        options: [
          { id: 'opt-1-1', text: 'Disable the banners as requested.', isCorrect: false, feedback: 'Disabling banners on spoofed internal emails disables one of INKY\'s most critical protections against BEC.', nextStepId: 'step-1' },
          { id: 'opt-1-2', text: 'Explain the risk of Business Email Compromise (BEC). Recommend keeping the banners but customizing the text to be less alarming for internal mail.', isCorrect: true, feedback: 'Correct. You must educate the client on the security risk while offering a compromise on the aesthetic.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'They agree to keep the banners. They want to change the yellow "External Sender" banner to a tiny gray footer. Can you do this?',
        options: [
          { id: 'opt-2-1', text: 'Administrators can customize branding, logos, detail levels, and supplemental text, but they cannot arbitrarily change the security classification (Red/Yellow/Gray) of a warning to make it less visually alarming.', isCorrect: true, feedback: 'Yes. INKY is highly customizable to fit corporate communication styles.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'What happens if a user views a customized banner email in plain text mode (e.g., on an old mobile client)?',
        options: [
          { id: 'opt-3-1', text: 'INKY inserts a plain-text version of the banner at the top of the email body.', isCorrect: true, feedback: 'Correct. INKY handles both HTML and plain-text gracefully.' }
        ]
      }
    }
  },
  {
    id: 'inky-pre-release',
    moduleId: 'inky',
    title: 'Pre-release Connector Setup',
    description: 'Setting up INKY for a new client before go-live.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'You are deploying INKY, but the client wants a 2-week "silent mode" to monitor false positives without showing banners to users. How do you accomplish this?',
        options: [
          { id: 'opt-1-1', text: 'Configure the INKY policies to run in "Journal Mode" or "Journal Mode," which scores emails but does not inject banners or quarantine them.', isCorrect: true, feedback: 'Correct. This is the standard way to baseline an environment.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'decisionMaking',
        text: 'During the monitoring phase, you see INKY flag a legitimate marketing newsletter as "Spam". What should you do?',
        options: [
          { id: 'opt-2-1', text: 'Classify it as "Safe" in the INKY dashboard to train the machine learning model for this tenant.', isCorrect: true, feedback: 'Yes. INKY learns from administrator feedback.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'procedure',
        text: 'When the 2 weeks are up, how do you enable protection?',
        options: [
          { id: 'opt-3-1', text: 'Change the policies from Journal Mode to Active (enabling banners and quarantine actions).', isCorrect: true, feedback: 'Correct. The system is now trained and ready to protect users.' }
        ]
      }
    }
  },
  {
    id: 'inky-internal-compromise',
    moduleId: 'inky',
    title: 'Handling a Compromised Internal Account',
    description: 'INKY flags an outbound email from a client employee as malicious.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You receive an INKY alert that an outbound email from jdoe@client.com was blocked because it contained a phishing link. What is the immediate concern?',
        options: [
          { id: 'opt-1-1', text: 'The user\'s account is likely compromised and is being used to send outbound spam/phishing.', isCorrect: true, feedback: 'Correct. Outbound malicious mail is a massive red flag for account compromise.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'What is your immediate technical action?',
        options: [
          { id: 'opt-2-1', text: 'Disable jdoe\'s sign-in in Microsoft 365, reset their password, and revoke all active sessions.', isCorrect: true, feedback: 'Yes. You must stop the bleeding immediately.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'investigation',
        text: 'After securing the account, what else should you check in M365?',
        options: [
          { id: 'opt-3-1', text: 'Check for hidden inbox rules (e.g., forwarding emails to RSS feeds or external addresses) created by the attacker.', isCorrect: true, feedback: 'Correct. Attackers may leave persistence mechanisms like forwarding rules.' }
        ]
      }
    }
  }
];

export const cards: Flashcard[] = [
  { id: 'fc-inky-1', moduleId: 'inky', question: 'What does a Yellow INKY banner indicate?', answer: 'Caution. It highlights something unusual, like a first-time sender or external sender, but not necessarily malicious.' },
  { id: 'fc-inky-2', moduleId: 'inky', question: 'What does a Red INKY banner indicate?', answer: 'Danger. The email is highly likely to be malicious, phishing, or a scam. Links and attachments are often disabled.' },
  { id: 'fc-inky-3', moduleId: 'inky', question: 'What does a Gray INKY banner indicate?', answer: 'Safe/Informational. It usually denotes an external sender that has been established as safe.' },
  { id: 'fc-inky-4', moduleId: 'inky', question: 'How does INKY integrate with Microsoft 365?', answer: 'Via API and mail flow rules (connectors). It does not require changing MX records.' },
  { id: 'fc-inky-5', moduleId: 'inky', question: 'What is INKY\'s "Phish Fence"?', answer: 'The core engine that analyzes emails for phishing, impersonation, and malware using machine learning.' },
  { id: 'fc-inky-6', moduleId: 'inky', question: 'Can users report emails via the INKY banner?', answer: 'Yes, the banner often includes a "Report This Email" link which allows users to provide feedback directly to INKY and the IT team.' },
  { id: 'fc-inky-7', moduleId: 'inky', question: 'What is "Journal Mode" in INKY?', answer: 'A monitoring state where INKY analyzes mail but does not insert banners or block emails, used for baselining.' },
  { id: 'fc-inky-8', moduleId: 'inky', question: 'Does INKY scan internal emails (user-to-user)?', answer: 'Yes, if configured to do so, which is critical for catching lateral movement from a compromised internal account.' },
  { id: 'fc-inky-9', moduleId: 'inky', question: 'How do you remediate a false positive in INKY?', answer: 'Use the INKY dashboard to search for the message and reclassify it as "Safe", which updates the machine learning model.' },
  { id: 'fc-inky-10', moduleId: 'inky', question: 'What is "Brand Impersonation"?', answer: 'When an attacker spoofs a well-known company (like Microsoft or UPS). INKY uses computer vision to detect fake logos and layouts.' },
  { id: 'fc-inky-11', moduleId: 'inky', question: 'What is a "Lookalike Domain"?', answer: 'A domain registered to look like the target company (e.g., rnicrosoft.com instead of microsoft.com), often flagged by INKY.' },
  { id: 'fc-inky-12', moduleId: 'inky', question: 'If you whitelist a sender in INKY, what happens to their emails?', answer: 'They bypass certain security checks and banners, which is why whitelisting should be done sparingly and carefully.' },
  { id: 'fc-inky-13', moduleId: 'inky', question: 'Can INKY rewrite URLs to protect users?', answer: 'Yes, similar to Safe Links, INKY can rewrite URLs so that when a user clicks, the destination is analyzed in real-time.' },
  { id: 'fc-inky-14', moduleId: 'inky', question: 'Does INKY protect against Business Email Compromise (BEC)?', answer: 'Yes, it is explicitly designed to catch text-only BEC attacks (like fake invoice requests) by analyzing sender behavior and stylometry.' },
  { id: 'fc-inky-15', moduleId: 'inky', question: 'What happens when INKY quarantines an email?', answer: 'The email is moved to a quarantine folder (either in M365 or the downstream quarantine) and is not delivered to the user\'s inbox.' }
];


export const ticketCases: RealTicketCase[] = [
  {
    id: 'inky-ticket-1',
    date: '2023-10-05T08:20:00Z',
    moduleId: 'inky',
    symptoms: 'User reports a yellow INKY banner on an email from a regular vendor asking to update wire transfer details.',
    initialThought: 'Probably a false positive or the vendor is using a new invoicing system.',
    investigation: 'Checked the INKY dashboard for the specific message ID. INKY flagged it as "First Time Sender" and noted a lookalike domain (e.g., vendor-billing.com instead of vendor.com). The email was a Business Email Compromise (BEC) attempt impersonating the vendor.',
    resolution: 'Classified the email as Malicious in INKY, which automatically moved it to quarantine. Advised the user to contact the vendor via a known good phone number to verify. Added the lookalike domain to the blocklist.',
    lessonsLearned: 'Never ignore yellow banners on financial requests. INKY\'s stylometry and domain analysis often catch BEC attempts that standard SPF/DKIM checks pass because the attacker registered a new, valid domain.',
    fasterNextTime: 'Train users to immediately escalate any email requesting payment changes, regardless of banner color, and use INKY\'s domain analysis tool first.'
  },
  {
    id: 'inky-ticket-2',
    date: '2024-01-12T13:10:00Z',
    moduleId: 'inky',
    symptoms: 'Alert: Outbound email blocked by INKY due to malicious content originating from an internal user.',
    initialThought: 'An internal user\'s account has been compromised and is being used to send spam/phishing.',
    investigation: 'Reviewed the blocked outbound message in INKY. It contained a generic "Please view secure document" phishing link. The user had successfully logged in from an anomalous IP in a foreign country (M365 logs confirmed).',
    resolution: 'Immediately disabled the user\'s AD/M365 account, revoked sessions, and reset the password. Checked for inbox rules (found a rule forwarding emails to an external address and deleted it). INKY prevented the company from being blacklisted by blocking the outbound spam.',
    lessonsLearned: 'Internal/Outbound scanning in INKY is just as critical as inbound. It acts as an early warning system for compromised accounts.',
    fasterNextTime: 'Create an automated runbook in the PSA/RMM to instantly lock an M365 account when an INKY outbound malicious alert is generated.'
  },
  {
    id: 'inky-ticket-3',
    date: '2024-06-18T16:00:00Z',
    moduleId: 'inky',
    symptoms: 'Client complains that INKY is adding banners to their automated internal ticketing system emails, making them hard to read.',
    initialThought: 'The internal ticketing system is sending unauthenticated mail or spoofing the internal domain.',
    investigation: 'Checked INKY logs. The ticketing system was sending emails from "support@clientdomain.com" but originating from a third-party IP address that was not listed in the client\'s SPF record.',
    resolution: 'Instead of whitelisting the ticketing system in INKY, updated the client\'s SPF and DKIM records to properly authenticate the third-party sender. Once authenticated, INKY stopped flagging the emails as spoofed.',
    lessonsLearned: 'Fix the root cause (DNS authentication) rather than creating bypass rules in the security tool.',
    fasterNextTime: 'Before deploying INKY in Active Mode, leave it in Journal Mode for 2 weeks to identify and fix all third-party services sending on behalf of the client.'
  }
];
