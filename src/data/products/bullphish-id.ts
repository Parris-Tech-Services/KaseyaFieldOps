import type { AppModule, Scenario, Flashcard, RealTicketCase } from '../types';

export const module: AppModule = {
  id: 'bullphish-id',
  name: 'BullPhish ID',
  description: 'Security awareness training and phishing simulation.',
  iconName: 'Fish',
  color: 'bg-emerald-600',
  order: 5,
  problemSolved: 'The biggest vulnerability in any network is the human. Technical controls (firewalls, email filters) fail, and users click bad links. BullPhish trains users not to click by testing them with safe, simulated attacks.',
  mentalModel: 'It is a fire drill for email. You send fake phishing emails to employees. If they click, they get enrolled in training instead of getting hacked.',
  keyTerminology: [
    { term: 'Simulated Phishing', definition: 'Sending safe, fake malicious emails to test user awareness.' },
    { term: 'Catch and Release', definition: 'Immediately showing a training video right after a user clicks a test link.' },
    { term: 'Submitted Data', definition: 'The highest severity failure—the user clicked the link AND typed their password into the fake landing page.' }
  ],
  actualUseCases: [
    'Running a monthly test to see who clicks fake "UPS Delivery" emails',
    'Rolling out mandatory annual HIPAA compliance training videos',
    'Automatically assigning remedial training to users who fail tests'
  ],
  commonWorkflows: [
    'Configuring M365 Advanced Delivery for simulation bypass',
    'Syncing users from Microsoft 365 / Azure AD',
    'Creating custom localized phishing templates'
  ],
  whenNotToUse: [
    'Do not use this to stop real incoming phishing emails (use INKY).',
    'Do not use this to check if credentials are already leaked on the dark web (use Dark Web ID).'
  ],
  relatedProducts: ['Dark Web ID', 'INKY'],
  commonConfusions: [
    'Confused with INKY: BullPhish sends fake tests, INKY stops real attacks.',
    'Confused with Dark Web ID: BullPhish prevents future credential theft via training, Dark Web ID monitors for past theft.'
  ],
  sources: [
    {
      title: "Integrating BullPhish ID with INKY",
      url: "https://help.bullphishid.kaseya.com/help/Content/11_Integrations/Integrating-bpid-inky.htm",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Native INKY integration", "No manual allowlisting for INKY"]
    },
    {
      title: "BullPhish ID Overview",
      url: "https://www.kaseya.com/products/bullphish-id/",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Phishing simulations", "Video training"]
    }
  ]
};


export const scenarios: Scenario[] = [
  {
    id: 'bpid-campaign-setup',
    moduleId: 'bullphish-id',
    title: 'Phishing Campaign Setup',
    description: 'Setting up a monthly phishing simulation for a client.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'A client requests a monthly phishing test. You need to create a campaign. What is the first thing you must ensure is configured on the client\'s network before sending test emails?',
        options: [
          { id: 'opt-1-1', text: 'Ensure BullPhish ID is properly configured in the email filtering system. For INKY, this means enabling the native integration in the INKY dashboard. For third-party gateways or native M365, it requires manual allowlisting/Advanced Delivery config.', isCorrect: true, feedback: 'Correct. Delivery configuration is crucial. INKY handles BPID natively via a dashboard toggle, but other systems require manual allowlisting of IPs/domains.', nextStepId: 'step-2' },
          { id: 'opt-1-2', text: 'Tell the users the test is coming.', isCorrect: false, feedback: 'Announcing the test defeats the purpose of an unannounced simulation.', nextStepId: 'step-1' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'Whitelisting is done. You are selecting a phishing template. What type of template should you choose for their first test?',
        options: [
          { id: 'opt-2-1', text: 'A highly sophisticated, targeted spear-phishing attack.', isCorrect: false, feedback: 'Start simple. Baseline their awareness before using advanced tactics.', nextStepId: 'step-2' },
          { id: 'opt-2-2', text: 'A generic, broad-based template like a "Password Expiry" or "Package Delivery" notice.', isCorrect: true, feedback: 'Correct. Establish a baseline with common phishing themes first.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'How should you schedule the delivery of the emails?',
        options: [
          { id: 'opt-3-1', text: 'Stagger the delivery randomly over a few days or weeks.', isCorrect: true, feedback: 'Yes. If they all arrive at 9:00 AM on Monday, one user will warn the whole office.' }
        ]
      }
    }
  },
  {
    id: 'bpid-campaign-results',
    moduleId: 'bullphish-id',
    title: 'Interpreting Campaign Results',
    description: 'Analyzing the report after a phishing campaign completes.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'documentation',
        text: 'The campaign finished. The report shows a 20% "Clicked" rate and a 5% "Submitted Data" rate. What does "Submitted Data" mean?',
        options: [
          { id: 'opt-1-1', text: 'The user clicked the link in the email and then entered credentials into the fake landing page.', isCorrect: true, feedback: 'Correct. This is a severe failure, as it represents actual compromised credentials in a real attack.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'decisionMaking',
        text: 'What should you do with the users who submitted data?',
        options: [
          { id: 'opt-2-1', text: 'Automatically enroll them in remedial security awareness training.', isCorrect: true, feedback: 'Yes. BullPhish allows for automatic training enrollment based on campaign failures.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'procedure',
        text: 'The client is upset about the 20% click rate. How do you respond?',
        options: [
          { id: 'opt-3-1', text: 'Explain this is a baseline. The goal of ongoing training and testing is to drive this number down over time, proving ROI.', isCorrect: true, feedback: 'Correct. The initial high number proves the service is needed.' }
        ]
      }
    }
  },
  {
    id: 'bpid-training-rollout',
    moduleId: 'bullphish-id',
    title: 'Security Awareness Training Rollout',
    description: 'Deploying compliance training to an entire organization.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'A healthcare client needs to roll out HIPAA compliance training to all 100 employees via BullPhish ID. How do you import the users?',
        options: [
          { id: 'opt-1-1', text: 'Sync them automatically using the Microsoft Entra ID (Azure AD) or Google Workspace integration.', isCorrect: true, feedback: 'Correct. Directory sync is the most efficient and accurate way to manage users.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'You set up the training campaign. What is a key setting to ensure users actually complete the course?',
        options: [
          { id: 'opt-2-1', text: 'Enable automated reminder emails for users who have not completed the course before the deadline.', isCorrect: true, feedback: 'Yes. Users often forget; automated nagging is necessary for compliance.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'documentation',
        text: 'A user claims they completed the training, but the report shows them as "Incomplete." What is the likely cause?',
        options: [
          { id: 'opt-3-1', text: 'They watched the video but failed or did not take the quiz at the end.', isCorrect: true, feedback: 'Correct. Completion requires passing the quiz, not just playing the video.' }
        ]
      }
    }
  },
  {
    id: 'bpid-false-positives',
    moduleId: 'bullphish-id',
    title: 'Investigating False Positives',
    description: 'A campaign shows 100% click rate instantly.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'A client\'s click-through rate is suspiciously high (e.g., 100% clicks, 0% compromise). You investigate and find all clicks happened almost instantaneously. What is the likely cause?',
        options: [
          { id: 'opt-1-1', text: 'An email security gateway or M365 Defender scanned the emails and "clicked" the links automatically during analysis.', isCorrect: true, feedback: 'Correct. This is a classic symptom of missing or incorrect delivery configuration (like M365 Advanced Delivery).', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you fix this for future campaigns?',
        options: [
          { id: 'opt-2-1', text: 'Review the integration documentation (e.g., configuring M365 Advanced Delivery) to bypass link scanning for BullPhish IP addresses. Note: INKY handles this natively if integrated.', isCorrect: true, feedback: 'Yes, you must configure the security tools to treat these as training simulations.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'decisionMaking',
        text: 'What should you do about the ruined campaign data?',
        options: [
          { id: 'opt-3-1', text: 'Cancel/delete the campaign results, fix the configuration, and run a new campaign.', isCorrect: true, feedback: 'Correct. The data is hopelessly skewed; you must start over.' }
        ]
      }
    }
  },
  {
    id: 'bpid-custom-template',
    moduleId: 'bullphish-id',
    title: 'Creating a Custom Phishing Template',
    description: 'Building a relevant local lure for a specific client.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'decisionMaking',
        text: 'A client wants a phishing test that looks like it comes from their local HR portal ("AcmeHR"). How do you do this in BullPhish?',
        options: [
          { id: 'opt-1-1', text: 'Use the Template Builder to create a custom email template, choose a sending profile, and select a pre-existing landing page.', isCorrect: true, feedback: 'Correct. Custom templates yield higher engagement and test specific localized risks.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'You are designing the email. To make it convincing, you want to spoof the sender address to hr@acme.com. Is this possible?',
        options: [
          { id: 'opt-2-1', text: 'Yes, but it requires configuring a Custom Sending Domain, which must be validated through DNS before BullPhish can send on the client\'s behalf.', isCorrect: true, feedback: 'Yes. Spoofing internal domains requires DNS authentication to bypass spam filters.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'If you cannot modify their DNS, what is the alternative?',
        options: [
          { id: 'opt-3-1', text: 'Select an appropriate Global Sending Domain provided by BullPhish (e.g., hr-acme-portal.com).', isCorrect: true, feedback: 'Correct. Lookalike domains are easier to deploy and test users\' ability to spot subtle URL differences.' }
        ]
      }
    }
  }
];

export const cards: Flashcard[] = [
  { id: 'fc-bpid-1', moduleId: 'bullphish-id', question: 'What is the absolute most critical pre-requisite before running a phishing simulation?', answer: 'Ensuring delivery configuration (e.g., M365 Advanced Delivery) is complete so security tools do not block or falsely "click" the simulations.' },
  { id: 'fc-bpid-2', moduleId: 'bullphish-id', question: 'What happens to the training data if link scanning is not bypassed?', answer: 'Security tools will automatically scan the links, registering false "clicks" for every user.' },
  { id: 'fc-bpid-3', moduleId: 'bullphish-id', question: 'Which Kaseya 365 pillar does BullPhish ID belong to?', answer: 'The Prevent pillar.' },
  { id: 'fc-bpid-4', moduleId: 'bullphish-id', question: 'How long does a typical campaign take to set up?', answer: 'About 10 minutes.' },
  { id: 'fc-bpid-5', moduleId: 'bullphish-id', question: 'What happens if a security tool "clicks" all the links in a test campaign?', answer: 'It ruins the data, resulting in a false 100% click rate. You must fix M365 Advanced Delivery or gateway rules.' },
  { id: 'fc-bpid-6', moduleId: 'bullphish-id', question: 'What components make up BullPhish ID training?', answer: 'Simulated phishing emails, animated video lessons, and interactive quizzes.' },
  { id: 'fc-bpid-7', moduleId: 'bullphish-id', question: 'How does BullPhish ID integrate with INKY?', answer: 'Natively. INKY recognizes the simulations without manual IP allowlisting, and users receive a congratulations banner for correctly reporting.' },
  { id: 'fc-bpid-8', moduleId: 'bullphish-id', question: 'What is a common compliance use case for BullPhish ID?', answer: 'Providing proof of regular security awareness training for cyber insurance requirements.' },
  { id: 'fc-bpid-9', moduleId: 'bullphish-id', question: 'Can you train a multilingual workforce?', answer: 'Yes, campaigns and video content can be localized into multiple languages.' },
  { id: 'fc-bpid-10', moduleId: 'bullphish-id', question: 'If a client wants to see who failed the test, where do you look?', answer: 'The Campaign Results or Reporting dashboard.' },
  { id: 'fc-bpid-11', moduleId: 'bullphish-id', question: 'Why should you start with generic phishing templates for a new client?', answer: 'To establish a baseline of their security awareness before testing them with highly sophisticated spear-phishing.' },
  { id: 'fc-bpid-12', moduleId: 'bullphish-id', question: 'What is the purpose of Automated Reminders?', answer: 'To automatically email users who have not yet completed assigned training before the due date.' },
  { id: 'fc-bpid-13', moduleId: 'bullphish-id', question: 'Can BullPhish ID simulate internal HR emails?', answer: 'Yes, using custom templates and optionally spoofing the internal domain if DNS records are properly configured.' },
  { id: 'fc-bpid-14', moduleId: 'bullphish-id', question: 'What reporting metric is most critical for proving ROI to a client?', answer: 'The reduction in the "Click Rate" and "Submitted Data Rate" over time across multiple campaigns.' },
  { id: 'fc-bpid-15', moduleId: 'bullphish-id', question: 'If a user opens an email but does not click a link, is it a failure?', answer: 'Opening an email is tracked, but is generally not considered a failure unless they click a link or download an attachment.' }
];

export const ticketCases: RealTicketCase[] = [
  {
    id: 'bpid-ticket-1',
    date: '2023-08-10T11:00:00Z',
    moduleId: 'bullphish-id',
    symptoms: 'Client complains that 100% of their users clicked the phishing link in the latest BullPhish ID campaign.',
    initialThought: 'The email security gateway scanned the links and triggered false positives.',
    investigation: 'Checked the campaign logs. All "clicks" occurred within 3 minutes of the emails being sent, and the source IP addresses of the clicks belonged to Microsoft (M365 Defender). The client\'s IT contact had accidentally removed the BullPhish IP addresses from their Advanced Delivery bypass policy.',
    resolution: 'Re-added the BullPhish IP addresses to the M365 Defender Advanced Delivery simulation bypass list. Scrapped the ruined campaign data and scheduled a new, identical campaign for the following week.',
    lessonsLearned: 'Delivery configuration is brittle and must be verified before every major campaign, especially if the client makes their own tenant changes.',
    fasterNextTime: 'Implement a pre-flight checklist that sends a single test email to an admin account to verify link-scanning bypass before launching to 500 users.'
  },
  {
    id: 'bpid-ticket-2',
    date: '2024-04-15T09:30:00Z',
    moduleId: 'bullphish-id',
    symptoms: 'A user clicked a simulated phishing link, entered their credentials, and is now locked out of their M365 account.',
    initialThought: 'An automated security response triggered because the user failed the test severely.',
    investigation: 'Checked the PSA ticket history and M365 logs. The MSP had built a logic app that automatically disabled accounts if they reached the "Submitted Data" state in a BullPhish ID campaign to enforce immediate remedial training.',
    resolution: 'Contacted the user, explained they failed a simulated phishing test, and guided them to complete the required 15-minute remedial training module. Once completed, re-enabled their M365 account.',
    lessonsLearned: 'Automated punitive measures for failing phishing tests are effective but generate helpdesk tickets. The helpdesk needs a clear SOP for handling these lockouts.',
    fasterNextTime: 'Instead of full lockouts, use Conditional Access to restrict access to sensitive apps until the remedial training is completed, reducing complete work stoppage.'
  },
  {
    id: 'bpid-ticket-3',
    date: '2024-08-05T15:45:00Z',
    moduleId: 'bullphish-id',
    symptoms: 'Client requests a custom phishing campaign impersonating a specific internal HR policy update, but the emails are landing in Spam.',
    initialThought: 'The emails are failing SPF/DKIM checks because they are spoofing the client\'s internal domain without proper DNS authorization.',
    investigation: 'The tech used the client\'s exact domain (hr@clientdomain.com) in the BullPhish sender profile. The client\'s DMARC policy is set to "reject", so the receiving server rejected the unauthenticated emails.',
    resolution: 'Instead of modifying the client\'s complex DNS to authorize BullPhish to send as their domain, selected a pre-configured Global Sending Domain provided by BullPhish and ran the campaign from that domain instead. It successfully bypassed the spam filters.',
    lessonsLearned: 'Spoofing internal domains for simulations is technically complex and risky for mail flow. Lookalike domains achieve the same training goal with zero impact on production DNS.',
    fasterNextTime: 'Always default to using lookalike domains for custom campaigns unless the client specifically mandates testing their internal spoofing defenses.'
  }
];

