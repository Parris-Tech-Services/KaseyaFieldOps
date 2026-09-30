import type { AppModule, Scenario, Flashcard } from '../types';

export const module: AppModule = {
  id: 'datto-azure-backup',
  name: 'Datto Backup for Microsoft Azure',
  description: 'Off-tenant BCDR solution specifically for Microsoft Azure workloads.',
  iconName: 'Cloud',
  color: 'bg-cyan-600',
  order: 4,
  problemSolved: 'Protects Azure VMs, Azure Files, and Azure Blob storage from data loss by backing them up to an independent, secure Datto Cloud (off-tenant).',
  mentalModel: 'Don\'t put all your eggs in one basket. If a client\'s Azure environment is compromised or a rogue admin deletes VMs, Azure\'s native backups might also be destroyed. This tool backs up Azure workloads to an entirely separate Datto-managed cloud.',
  actualUseCases: [
    'Providing true BCDR for Azure Virtual Machines.',
    'Protecting against Azure tenant-level compromises (where an attacker deletes both the VM and the Azure Recovery Services vault).',
    'Restoring an Azure VM in the Datto Cloud during a major Azure region outage.',
  ],
  commonWorkflows: [
    'Pairing an Azure subscription to the Kaseya/Datto portal.',
    'Selecting Azure VMs and storage accounts for protection.',
    'Performing a cloud virtualization of an Azure VM in the Datto Cloud.',
  ],
  whenNotToUse: [
    'Do not use this for backing up on-premises hardware (use Datto SIRIS/ALTO).',
    'Do not use this for backing up Microsoft 365 Exchange/OneDrive data (use Datto SaaS Protection).',
  ],
  keyTerminology: [
    { term: 'Off-Tenant Backup', definition: 'Storing backups outside of the primary cloud provider\'s environment to prevent a single point of failure.' },
    { term: 'Virtual SIRIS', definition: 'The cloud-hosted appliance architecture that Datto uses to protect Azure workloads.' },
  ],
  relatedProducts: ['Datto Backup', 'Datto SaaS Protection'],
  commonConfusions: [
    'Confused with Datto SaaS Protection: Azure Backup protects infrastructure (VMs, Blob storage). SaaS Protection protects user data (Emails, Teams, SharePoint).',
    'Confused with Azure Native Backup: Azure Native Backup stays in Azure. Datto Azure Backup moves the data to the Datto Cloud.',
  ],
  sources: [
    {
      title: "Datto Backup for Microsoft Azure",
      url: "https://www.datto.com/products/backup-for-microsoft-azure/",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Off-tenant protection", "Azure VM/Files/Blob coverage", "Virtual SIRIS architecture"]
    }
  ]
};

export const scenarios: Scenario[] = [
  {
    id: 'azure-tenant-compromise',
    moduleId: 'datto-azure-backup',
    title: 'Tenant-Level Compromise',
    description: 'A rogue admin deleted Azure VMs and their native backups.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'A malicious actor gained Global Admin access to a client\'s Azure tenant. They deleted critical VMs and intentionally purged the Azure Recovery Services vault (native backups). The client uses Datto Backup for Microsoft Azure. Are the backups safe?',
        options: [
          { id: 'opt-1-1', text: 'Yes, because Datto Backup for Azure stores the backups off-tenant in the secure Datto Cloud.', isCorrect: true, feedback: 'Correct. The separation of backup data from the production tenant is the primary value proposition here.', nextStepId: 'step-2' },
          { id: 'opt-1-2', text: 'No, if the Azure tenant is compromised, the Datto backups are automatically deleted.', isCorrect: false, feedback: 'Incorrect. The backups are isolated from Azure.', nextStepId: 'step-1' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you restore the VMs while the Azure tenant is still locked down and being investigated?',
        options: [
          { id: 'opt-2-1', text: 'Virtualize the VMs directly in the Datto Cloud via the Datto partner portal.', isCorrect: true, feedback: 'Yes. You can spin them up in Datto\'s environment to maintain business continuity.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'procedure',
        text: 'Once the Azure tenant is secured, how do you get the VMs back to Azure?',
        options: [
          { id: 'opt-3-1', text: 'Perform a restore back to the Azure subscription from the Datto portal.', isCorrect: true, feedback: 'Correct. Datto allows restoring the workloads back to the Azure environment.' }
        ]
      }
    }
  }
];

export const cards: Flashcard[] = [
  { id: 'fc-azure-1', moduleId: 'datto-azure-backup', question: 'What is the main architectural advantage of Datto Backup for Microsoft Azure?', answer: 'It provides off-tenant, independent, and secure backups stored in the Datto Cloud, protecting against Azure-level compromises.' },
  { id: 'fc-azure-2', moduleId: 'datto-azure-backup', question: 'Which Azure workloads does it protect?', answer: 'Azure Virtual Machines (VMs), Azure Files, and Azure Blob Storage.' },
  { id: 'fc-azure-3', moduleId: 'datto-azure-backup', question: 'How is it billed?', answer: 'Typically on a flat-fee, predictable pricing model, unlike the variable consumption-based pricing of native Azure backup.' },
  { id: 'fc-azure-4', moduleId: 'datto-azure-backup', question: 'What happens if a whole Azure region goes down?', answer: 'Since the backups are in the Datto Cloud, you can virtualize the VMs there and maintain continuity independent of Azure.' }
];
