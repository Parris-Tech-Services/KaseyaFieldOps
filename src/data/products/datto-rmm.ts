import type { AppModule, Scenario, Flashcard } from '../types';

export const module: AppModule = {
  id: 'datto-rmm',
  name: 'Datto RMM',
  description: 'Remote Monitoring and Management for endpoints.',
  iconName: 'MonitorDot',
  color: 'bg-blue-600',
  order: 1,
  problemSolved: 'MSPs need a centralized way to monitor device health, deploy software, run scripts, and remote into hundreds of devices across multiple clients without traveling on-site.',
  mentalModel: 'It is the central nervous system for an MSP. It installs a lightweight agent on every computer, allowing you to control, monitor, and automate them from a single web dashboard.',
  actualUseCases: [
    'Remoting into a user\'s PC to fix a printer issue without interrupting them (Agent Browser).',
    'Deploying a mandatory software update to 500 computers overnight.',
    'Receiving an alert when a critical server is running out of disk space.',
  ],
  commonWorkflows: [
    'Writing a custom PowerShell component to automate a fix.',
    'Creating a monitoring policy to track CPU usage.',
    'Using Web Remote to assist an end user.',
  ],
  whenNotToUse: [
    'Do not use this as a primary cybersecurity defense tool (use Datto EDR/AV).',
    'Do not use this to back up endpoints (use Datto File Protection).',
  ],
  keyTerminology: [
    { term: 'Component', definition: 'A script, application installer, or monitor definition that can be deployed via RMM.' },
    { term: 'Execution Context', definition: 'Whether a component runs as the "System" account (admin rights) or "Logged In User" (user rights).' },
    { term: 'Job', definition: 'A scheduled task to deploy a component to one or more devices.' },
  ],
  relatedProducts: ['Datto EDR', 'Kaseya 365', 'Datto File Protection'],
  commonConfusions: [
    'Confused with Datto EDR: RMM is for IT management and automation; EDR is for threat detection and response.',
  ],
  sources: [
    {
      title: "Datto RMM Overview",
      url: "https://www.datto.com/products/rmm/",
      verifiedAt: "2026-08-20T00:00:00Z",
      supports: ["Agent Browser", "Components and Jobs", "Web Remote"]
    }
  ]
};

export const scenarios: Scenario[] = [
  {
    id: 'rmm-offline-endpoint',
    moduleId: 'datto-rmm',
    title: 'Offline Endpoint Triage',
    description: 'A client reports a critical laptop hasn\'t checked in for 6 days.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'You receive a ticket: "Jane\'s laptop (LAPTOP-014) is offline and hasn\'t checked into Datto RMM in 6 days." What is your first investigative step?',
        options: [
          {
            id: 'opt-1-1',
            text: 'Reboot the device from the Datto RMM console.',
            isCorrect: false,
            feedback: 'The device is offline in RMM, so a remote reboot command will just queue and not execute until it checks in.',
            nextStepId: 'step-1',
          },
          {
            id: 'opt-1-2',
            text: 'Check the device details in Datto RMM for Last Check-In Time and Last Logged In User.',
            isCorrect: true,
            feedback: 'Correct. You need to gather facts first. Is it truly 6 days? Who was using it last?',
            nextStepId: 'step-2',
          }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'investigation',
        text: 'You see the last check-in was indeed 6 days ago. The last logged-in user was jsmith. What else should you check in the RMM console before reaching out?',
        options: [
          {
            id: 'opt-2-1',
            text: 'Check if there is an active Datto EDR alert for the device.',
            isCorrect: true,
            feedback: 'Good thinking. If EDR isolates the device, Datto RMM communication and Web Remote access are explicitly maintained.',
            nextStepId: 'step-3',
          }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'investigation',
        text: 'You check Datto EDR, but there are no alerts. You contact Jane. She says she has been on vacation and left the laptop at home, turned off. What is your ticket note?',
        options: [
          {
            id: 'opt-3-2',
            text: 'Investigated offline status for LAPTOP-014. Verified 6 days offline in RMM, no EDR isolations. Contacted user jsmith, who confirmed she is on vacation and device is powered off. No further action needed.',
            isCorrect: true,
            feedback: 'Excellent. You gathered evidence, formed a hypothesis, tested it with the user, and documented clearly.',
          }
        ]
      }
    }
  },
  {
    id: 'rmm-monitoring-conflict',
    moduleId: 'datto-rmm',
    title: 'Policy Conflict Resolution',
    description: 'A newly deployed monitoring policy isn\'t applying to a specific server.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'You created a "High CPU Alert" policy at the Global level, but SERVER-01 is not generating alerts when CPU hits 99%. Where do you look first?',
        options: [
          { id: 'opt-1-1', text: 'Re-push the agent to the server.', isCorrect: false, feedback: 'Reinstalling is a last resort. Check configuration first.', nextStepId: 'step-1' },
          { id: 'opt-1-2', text: 'Check the device\'s active policies in its Device Summary page.', isCorrect: true, feedback: 'Correct. You need to verify if the policy is actually applied or being overridden.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'The Device Summary shows a different policy named "Legacy Server CPU" is applied. Why did this happen?',
        options: [
          { id: 'opt-2-1', text: 'Check the assigned policy scopes and filters. A specific override mechanism exists for Patch Management, but for Monitoring, policies apply via scopes (Global/Site) and filters.', isCorrect: true, feedback: 'Exactly. RMM policies use scopes (Global or Site) and target devices using filters or groups. The Legacy policy is likely at the Site level.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'How should you resolve this so all servers use the new Global policy?',
        options: [
          { id: 'opt-3-1', text: 'Delete the Legacy Site-level policy.', isCorrect: true, feedback: 'Yes, managing targets via explicit filters and groups is best practice.' }
        ]
      }
    }
  },
  {
    id: 'rmm-patch-failure',
    moduleId: 'datto-rmm',
    title: 'Patch Management Failure',
    description: 'A critical Windows update fails repeatedly on a specific site.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'Ten workstations at a client site show as "Failed" for the latest cumulative update in the Patch Management dashboard. What is the first investigative step?',
        options: [
          { id: 'opt-1-1', text: 'Check the Patch Status details for the specific error code across the failed devices.', isCorrect: true, feedback: 'Correct. Finding a common error code helps identify the root cause.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'The error code is 0x8024402c, indicating a Windows Update connectivity issue. What is the most likely cause for an entire site failing with this?',
        options: [
          { id: 'opt-2-1', text: 'A firewall or content filter at the site is blocking access to Microsoft Update servers.', isCorrect: true, feedback: 'Yes, site-wide connectivity issues usually point to network-level blocking.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'knowledge',
        text: 'You confirm a new firewall rule was added yesterday. What is your next action?',
        options: [
          { id: 'opt-3-1', text: 'Adjust the firewall rule to allow Windows Update traffic, then trigger a manual patch scan in RMM.', isCorrect: true, feedback: 'Correct. Fix the network issue, then use RMM to verify the fix.' }
        ]
      }
    }
  },
  {
    id: 'rmm-component-script',
    moduleId: 'datto-rmm',
    title: 'Custom Component Deployment',
    description: 'A custom PowerShell script deployed via RMM is failing silently.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'You wrote a PowerShell script to clean temp files and added it as an RMM component. It runs, but files aren\'t deleted and there is no error output. What do you check?',
        options: [
          { id: 'opt-1-1', text: 'Check if the component is set to run as "System" or "Logged in User".', isCorrect: true, feedback: 'Correct. If it runs as System, it won\'t have access to the user\'s AppData Temp folder without specific coding.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'It is running as "System". The script uses $env:TEMP. Why did it fail silently?',
        options: [
          { id: 'opt-2-1', text: 'For the System account, $env:TEMP points to C:\\Windows\\Temp, not the user profile temp folder.', isCorrect: true, feedback: 'Exactly. It deleted the System temp files, which you didn\'t notice.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'procedure',
        text: 'How do you fix the component?',
        options: [
          { id: 'opt-3-1', text: 'Change the execution context in the RMM component settings to "Logged in User".', isCorrect: true, feedback: 'Correct, this is the simplest fix if you want to target the user profile.' }
        ]
      }
    }
  },
  {
    id: 'rmm-alert-fatigue',
    moduleId: 'datto-rmm',
    title: 'Managing Alert Fatigue',
    description: 'A disk space monitor is generating hundreds of tickets for small non-system drives.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'The helpdesk is overwhelmed with "Low Disk Space" tickets for small recovery partitions (e.g., Drive E: 500MB). How do you adjust the RMM monitor?',
        options: [
          { id: 'opt-1-1', text: 'Modify the monitor to exclude drives based on drive letter or size.', isCorrect: true, feedback: 'Correct. You can configure exclusions in the monitor settings.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'You open the monitor settings. What is the most robust way to exclude recovery partitions across all clients?',
        options: [
          { id: 'opt-2-1', text: 'Add a WMI filter to the monitor to only target System Drives, or exclude drives under 5GB.', isCorrect: true, feedback: 'Yes. Filtering by size or system flag is more robust than relying on drive letters.', nextStepId: 'step-3' }
        ]
      },
      'step-3': {
        id: 'step-3',
        competencyArea: 'decisionMaking',
        text: 'After updating the policy, you still see old alerts open in the dashboard. What should you do?',
        options: [
          { id: 'opt-3-1', text: 'Bulk resolve the existing alerts from the Alerts page, as the new policy will prevent future ones.', isCorrect: true, feedback: 'Correct. Updating a policy doesn\'t automatically close previously generated alerts.' }
        ]
      }
    }
  },
  {
    id: 'rmm-agent-reinstall',
    moduleId: 'datto-rmm',
    title: 'Agent Re-enrollment Procedure',
    description: 'An endpoint agent is completely broken and must be manually re-enrolled.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'The RMM agent on a critical Windows server is permanently disconnected. The service refuses to start. You have RDP access. What is the cleanest way to reinstall?',
        options: [
          { id: 'opt-1-1', text: 'Download a new agent installer from the site and run it over the broken one.', isCorrect: false, feedback: 'Running the installer over a broken installation often leaves corrupt registry keys intact.', nextStepId: 'step-1' },
          { id: 'opt-1-2', text: 'Use the standard Windows Add/Remove Programs or official silent uninstall command, then verify the directory is removed, then reinstall using a fresh site installer.', isCorrect: true, feedback: 'Correct. Standard uninstallation is usually sufficient, but verify the directory is removed if the agent service was deeply corrupted.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'After reinstalling, the server appears as a duplicate record in the RMM console. How do you fix this?',
        options: [
          { id: 'opt-2-1', text: 'Merge the devices in the RMM console or delete the old offline record.', isCorrect: true, feedback: 'Yes. The new installation generated a new Unique Identifier (UID), so you must manually clean up the old record.' }
        ]
      }
    }
  },
  {
    id: 'rmm-multi-site-policy',
    moduleId: 'datto-rmm',
    title: 'Multi-Site Policy Propagation',
    description: 'A global policy change is acting differently across various client sites.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You updated a Global monitoring policy to alert at 90% memory usage instead of 95%. However, Client A is still alerting at 95%, while Client B updated to 90%. Why?',
        options: [
          { id: 'opt-1-1', text: 'Client A has another policy targeting the device via a more specific filter.', isCorrect: true, feedback: 'Correct. Check the assigned policy scopes and filters. A specific override mechanism exists for Patch Management, but for Monitoring, policies apply via scopes (Global/Site) and filters.', nextStepId: 'step-2' },
          { id: 'opt-1-2', text: 'The Global policy hasn\'t finished syncing to Client A yet.', isCorrect: false, feedback: 'Policy syncs are generally immediate. It is much more likely a conflicting policy exists.', nextStepId: 'step-1' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'investigation',
        text: 'You check Client A\'s site policies but find NO memory monitoring policies. Why is it still overriding?',
        options: [
          { id: 'opt-2-1', text: 'A specific policy was assigned directly targeting all servers at Client A.', isCorrect: true, feedback: 'Yes. If it\'s not at the Site level, individual Device-level filter assignments are the next place to look.' }
        ]
      }
    }
  },
  {
    id: 'rmm-script-timeout',
    moduleId: 'datto-rmm',
    title: 'Script Deployment Timeout',
    description: 'A data collection script is timing out on multiple endpoints.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You pushed a PowerShell script to gather local admin accounts. The job fails with a "Timeout" error after 10 minutes on most endpoints. What is the likely cause?',
        options: [
          { id: 'opt-1-1', text: 'The script requires user interaction (like a prompt) and is hanging because it is running silently as System.', isCorrect: true, feedback: 'Correct. Background scripts must be completely silent. Any prompt will hang the execution until it hits the timeout limit.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you prevent this in the future?',
        options: [
          { id: 'opt-2-1', text: 'Test the script locally using PsExec running as SYSTEM to simulate the RMM environment before deploying.', isCorrect: true, feedback: 'Excellent. This is the best way to catch silent prompts or System-account quirks.' }
        ]
      }
    }
  },
  {
    id: 'rmm-mac-deployment',
    moduleId: 'datto-rmm',
    title: 'macOS Agent Deployment',
    description: 'Dealing with Privacy & Security prompts during a Mac deployment.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'You deploy the Datto RMM agent to a new MacBook. The agent checks in, but features like Web Remote and screenshot capture do not work. Why?',
        options: [
          { id: 'opt-1-1', text: 'The macOS firewall is blocking inbound connections.', isCorrect: false, feedback: 'Web Remote uses outbound connections, so inbound firewall rules do not affect it.', nextStepId: 'step-1' },
          { id: 'opt-1-2', text: 'The agent lacks Full Disk Access and Screen Recording permissions in macOS System Settings.', isCorrect: true, feedback: 'Correct. Apple requires explicit user approval or an MDM profile for these permissions.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'How can you deploy the agent to 50 Macs without manually clicking "Allow" on every single one?',
        options: [
          { id: 'opt-2-1', text: 'Deploy the agent via an MDM (like Jamf or Datto MDM) alongside a Privacy Preferences Policy Control (PPPC) profile.', isCorrect: true, feedback: 'Yes. An MDM is required to silently grant these permissions on modern macOS.' }
        ]
      }
    }
  },
  {
    id: 'rmm-network-discovery',
    moduleId: 'datto-rmm',
    title: 'Network Discovery Deployment',
    description: 'Scanning a new client subnet to find unmanaged devices.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'You onboard a new site and need to find all unmanaged switches and printers. How do you configure Network Discovery?',
        options: [
          { id: 'opt-1-1', text: 'Install the Datto RMM agent on a server, designate it as a Network Node, and configure a scan job for the local subnet.', isCorrect: true, feedback: 'Correct. You need a beachhead device (Node) to perform the localized SNMP/ping sweeps.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'The scan completes but fails to pull manufacturer names and models for the switches. What is missing?',
        options: [
          { id: 'opt-2-1', text: 'You need to add the switches\' SNMP read-only community strings to the Network Discovery configuration.', isCorrect: true, feedback: 'Correct. Without SNMP credentials, the Node can only ping the devices and cannot query their details.' }
        ]
      }
    }
  },
  {
    id: 'rmm-patch-audit-only',
    moduleId: 'datto-rmm',
    title: 'Patch policy stuck in Audit Only',
    description: 'A site\'s patches show as non-compliant but devices aren\'t rebooting or updating.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'A client complains their machines are missing patches, but the RMM patch management policy is active. You check the patch status and see many devices are non-compliant. What is the first thing to check in the policy configuration?',
        options: [
          { id: 'opt-1-1', text: 'Check if the policy is set to "Audit Only" mode.', isCorrect: true, feedback: 'Correct. Audit Only mode scans and reports on missing patches but explicitly does not install them or force reboots.', nextStepId: 'step-2' },
          { id: 'opt-1-2', text: 'Force an immediate patch scan on all devices.', isCorrect: false, feedback: 'If the policy is misconfigured, a manual scan won\'t fix the automatic installation issue.', nextStepId: 'step-1' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'You confirm the policy is in "Audit Only" mode. The client wants patches installed automatically on Tuesday nights. How do you fix this?',
        options: [
          { id: 'opt-2-1', text: 'Switch the policy to "Deploy" (Enforce) mode and set the maintenance window to Tuesday nights.', isCorrect: true, feedback: 'Yes. Moving from Audit to Deploy mode ensures patches are actually installed according to the schedule.' }
        ]
      }
    }
  },
  {
    id: 'rmm-site-patch-override',
    moduleId: 'datto-rmm',
    title: 'Monitoring policy conflict',
    description: 'Global patch policy says one thing, another assigned policy with a more specific filter or group contradicts it.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'You have a Global Patch Policy set to install updates on Wednesdays. Client A is complaining their servers rebooted on Sunday night. What do you check?',
        options: [
          { id: 'opt-1-1', text: 'Check Client A\'s site for a Site-level Patch Management Policy.', isCorrect: true, feedback: 'Correct. For Patch Management, Check the assigned policy scopes and filters. A specific override mechanism exists for Patch Management, but for Monitoring, policies apply via scopes (Global/Site) and filters.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'investigation',
        text: 'You find a Site-level policy for Client A that runs on Sundays. Why did this happen?',
        options: [
          { id: 'opt-2-1', text: 'Another technician likely created a custom schedule for Client A that overrides the global default via the documented Patch Management override.', isCorrect: true, feedback: 'Yes. Tracing policy assignments via filters and groups is critical for troubleshooting unexpected behavior.' }
        ]
      }
    }
  },
  {
    id: 'rmm-comstore-silent-fail',
    moduleId: 'datto-rmm',
    title: 'ComStore script deployment fails silently',
    description: 'A component pushed from ComStore shows as run but had no effect.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You downloaded a "Clear Print Queue" component from the ComStore and pushed it via a Quick Job to a workstation. The job completes successfully, but the print queue is still stuck. What is your next step?',
        options: [
          { id: 'opt-1-1', text: 'Open the Agent Browser, go to the Command Prompt or PowerShell tab, and manually run the script logic to see the output.', isCorrect: true, feedback: 'Correct. The Agent Browser allows you to run commands interactively to see errors that a silent background job might suppress.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'Running it manually reveals an "Access Denied" error because the script requires elevation, but the job ran as the logged-in user. How do you fix the component?',
        options: [
          { id: 'opt-2-1', text: 'Edit the component settings to run as "System" instead of "Logged-in User".', isCorrect: true, feedback: 'Yes. System account has the necessary rights to restart the print spooler service.' }
        ]
      }
    }
  },
  {
    id: 'rmm-local-cache-fail',
    moduleId: 'datto-rmm',
    title: 'Local caching not reducing bandwidth',
    description: 'Multiple devices on one site are pulling full patches from the internet.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'A client with 50 PCs complains of slow internet during patch windows. You have Local Caching enabled for the site. Why are PCs still downloading patches directly from the internet?',
        options: [
          { id: 'opt-1-1', text: 'Check if the designated Local Cache device is online and has sufficient free disk space.', isCorrect: true, feedback: 'Correct. If the cache drive is offline or full, agents will fall back to downloading directly from the internet.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'The cache device is a desktop that gets turned off at night by the user. How do you permanently resolve the bandwidth issue?',
        options: [
          { id: 'opt-2-1', text: 'Designate an always-on server at the site as the Local Cache device instead of a user desktop.', isCorrect: true, feedback: 'Yes. The cache proxy must be highly available during patch windows.' }
        ]
      }
    }
  },
  {
    id: 'rmm-ransomware-false-positive',
    moduleId: 'datto-rmm',
    title: 'Ransomware Detection alert — is it real or a false positive',
    description: 'A device is flagged and isolated via UDF 1; tech must verify via Agent Browser.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'procedure',
        text: 'Datto RMM alerts that Ransomware Detection has triggered on a device. The device is now isolated from the network. How do you safely investigate?',
        options: [
          { id: 'opt-1-1', text: 'Use the Agent Browser to connect to the device, as it bypasses network isolation.', isCorrect: true, feedback: 'Correct. The Datto RMM agent maintains a secure tunnel to the platform even when the device\'s network adapter is isolated.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'investigation',
        text: 'You open Agent Browser and check the process list and recent files. You see a legitimate line-of-business backup application rapidly modifying files. What is your conclusion?',
        options: [
          { id: 'opt-2-1', text: 'It\'s a false positive. You should remove the isolation, whitelist the backup app\'s path/hash in the policy, and monitor.', isCorrect: true, feedback: 'Yes. Legitimate software that acts like ransomware (rapid file encryption/modification) can trigger false positives and needs to be whitelisted.' }
        ]
      }
    }
  },
  {
    id: 'rmm-webremote-drop',
    moduleId: 'datto-rmm',
    title: 'Web Remote connection keeps dropping',
    description: 'Web Remote, RDP, and Splashtop integration options in sequence.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You connect to a device using Web Remote, but the connection keeps dropping every few seconds. The device appears online in the RMM console. What is your first troubleshooting step?',
        options: [
          { id: 'opt-1-1', text: 'Try connecting using the fallback Splashtop integration or an RDP tunnel.', isCorrect: true, feedback: 'Correct. Web Remote uses WebRTC, which can be sensitive to strict NATs or deep packet inspection firewalls. Having fallback connection methods is essential.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'Splashtop works perfectly. What does this tell you about the issue?',
        options: [
          { id: 'opt-2-1', text: 'The issue is likely a firewall or content filter blocking the specific STUN/TURN servers used by Web Remote\'s WebRTC implementation.', isCorrect: true, feedback: 'Yes. Since Splashtop (which uses different protocols/servers) works, the issue is specific to Web Remote\'s network requirements on that site.' }
        ]
      }
    }
  },
  {
    id: 'rmm-sw-mgmt-confusion',
    moduleId: 'datto-rmm',
    title: 'Third-party Software Management vs Standard Patch tier confusion',
    description: 'Client asks why an app isn\'t being patched.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'A client asks why their team\'s Slack and Zoom installations are not being automatically updated, even though they pay for Patch Management. You check their policy and they are on the "Standard" tier. What is the reason?',
        options: [
          { id: 'opt-1-1', text: 'Standard Patch Management only covers OS updates and a very limited set of legacy apps (like Java, Adobe Reader).', isCorrect: true, feedback: 'Correct. Standard does not cover modern web apps like Slack and Zoom.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you fulfill the client\'s request to keep Slack and Zoom updated?',
        options: [
          { id: 'opt-2-1', text: 'Upgrade the site to the Advanced Software Management add-on, which covers 200+ applications.', isCorrect: true, feedback: 'Yes. Advanced Software Management is required for broad third-party application patching.' }
        ]
      }
    }
  },
  {
    id: 'rmm-privacy-mode-bug',
    moduleId: 'datto-rmm',
    title: 'Privacy mode unexpectedly enabled',
    description: 'A device shows privacy mode active with no policy explanation.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You take over a new client. After deploying the Datto RMM agent, several devices show a "Privacy Mode Enabled" icon, meaning you must prompt the user before remote controlling. However, you have no Privacy Mode policies configured. What is the most likely cause?',
        options: [
          { id: 'opt-1-1', text: 'Residual registry keys or files from the previous MSP\'s RMM agent (or a previous Datto RMM instance) are forcing the privacy flag.', isCorrect: true, feedback: 'Correct. This is a known issue when taking over machines that weren\'t cleanly scrubbed of previous management tools.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you fix this without interrupting the user?',
        options: [
          { id: 'opt-2-1', text: 'Use the Agent Browser\'s registry editor or push a background script to scrub the old MSP\'s registry keys, then restart the agent service.', isCorrect: true, feedback: 'Yes. Clean up the residual configuration in the background to restore full silent access.' }
        ]
      }
    }
  },
  {
    id: 'rmm-m365-auto-deploy',
    moduleId: 'datto-rmm',
    title: 'M365 integration auto-deploying agents unexpectedly',
    description: 'M365 integration can auto-deploy agents to Windows devices.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'knowledge',
        text: 'You configure the M365 integration for a client to map users to devices. The next day, the client complains that the RMM agent installed itself on the CEO\'s personal home PC. How did this happen?',
        options: [
          { id: 'opt-1-1', text: 'The CEO added their personal PC to Microsoft Entra ID (Azure AD), and the M365 integration was configured to auto-deploy the agent to all Entra ID joined devices.', isCorrect: true, feedback: 'Correct. The integration can leverage Intune/Entra to push the agent automatically, which can catch personal devices if BYOD is not managed correctly.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'procedure',
        text: 'How do you prevent this from happening to other personal devices?',
        options: [
          { id: 'opt-2-1', text: 'Disable the auto-deployment feature in the M365 integration settings, or configure Entra ID to block personal device enrollment.', isCorrect: true, feedback: 'Yes. You must align the integration\'s auto-deploy behavior with the client\'s BYOD policies.' }
        ]
      }
    }
  },
  {
    id: 'rmm-autotask-alert-fail',
    moduleId: 'datto-rmm',
    title: 'Autotask alert-to-ticket not firing',
    description: 'An RMM alert should generate an Autotask ticket automatically and isn\'t.',
    firstStepId: 'step-1',
    steps: {
      'step-1': {
        id: 'step-1',
        competencyArea: 'investigation',
        text: 'A "Server Offline" alert triggered in Datto RMM, but a ticket was never created in Autotask PSA. You verify the integration is active. What is the first place to check?',
        options: [
          { id: 'opt-1-1', text: 'Check the RMM Monitor settings to ensure "Create Ticket" is checked in the response actions.', isCorrect: true, feedback: 'Correct. Alert generation does not automatically mean ticket generation unless explicitly configured in the monitor.', nextStepId: 'step-2' }
        ]
      },
      'step-2': {
        id: 'step-2',
        competencyArea: 'knowledge',
        text: 'The monitor is configured to create a ticket. What else could cause the ticket to fail?',
        options: [
          { id: 'opt-2-1', text: 'The device in RMM is not properly mapped to a Company/Configuration Item in Autotask.', isCorrect: true, feedback: 'Yes. If the integration doesn\'t know which Autotask company owns the device, it cannot create the ticket.' }
        ]
      }
    }
  }
];

export const cards: Flashcard[] = [
  { id: 'fc-rmm-1', moduleId: 'datto-rmm', question: 'What is the primary purpose of Datto RMM?', answer: 'Remote Monitoring and Management: managing endpoints, running remote actions, patching, and monitoring device health proactively.' },
  { id: 'fc-rmm-2', moduleId: 'datto-rmm', question: 'Where would you look in Datto RMM to see if a device is online?', answer: 'The Device Summary page or the Devices list, looking for the green online indicator next to the hostname.' },
  { id: 'fc-rmm-3', moduleId: 'datto-rmm', question: 'What is the policy inheritance hierarchy in Datto RMM?', answer: 'Policies are generally applied by scope (Global or Site) using filters and groups, rather than a strict global/site/device generic hierarchy.' },
  { id: 'fc-rmm-4', moduleId: 'datto-rmm', question: 'What is a "Component" in Datto RMM?', answer: 'A reusable script, application installer, or monitor definition that can be deployed via jobs or policies.' },
  { id: 'fc-rmm-5', moduleId: 'datto-rmm', question: 'How do you force an immediate check-in for an online device?', answer: 'Use the "Request Device Audit" or "Request Check-in" action from the device summary.' },
  { id: 'fc-rmm-6', moduleId: 'datto-rmm', question: 'What does "Execution Context" mean in a component?', answer: 'Whether the script runs as the "System" account (admin rights, no user profile) or "Logged In User" (user rights, accesses user profile).' },
  { id: 'fc-rmm-7', moduleId: 'datto-rmm', question: 'What is a "Job" in Datto RMM?', answer: 'A scheduled or immediate task to deploy a component to one or more devices.' },
  { id: 'fc-rmm-8', moduleId: 'datto-rmm', question: 'What is a "Site" in Datto RMM terminology?', answer: 'A logical grouping of devices, typically representing a specific client or a physical location.' },
  { id: 'fc-rmm-9', moduleId: 'datto-rmm', question: 'How do you deploy third-party software updates?', answer: 'Using the Software Management policies, which handle automated patching for supported third-party apps.' },
  { id: 'fc-rmm-10', moduleId: 'datto-rmm', question: 'What is the "Web Remote" feature?', answer: 'The built-in browser-based remote control tool in Datto RMM for screen sharing and command-line access.' },
  { id: 'fc-rmm-11', moduleId: 'datto-rmm', question: 'What is a "Filter" in Datto RMM?', answer: 'A dynamic search query used to group devices based on specific criteria (e.g., OS version, missing patches) for targeting policies or jobs.' },
  { id: 'fc-rmm-12', moduleId: 'datto-rmm', question: 'Why might a device show as "Online" but fail to execute a job?', answer: 'The Datto RMM agent service on the endpoint might be hung, or there could be a localized network/firewall issue blocking the job payload.' },
  { id: 'fc-rmm-13', moduleId: 'datto-rmm', question: 'What is the purpose of the "Agent Browser"?', answer: 'A technician tool to interact with a device\'s file system, registry, services, and processes in the background without disturbing the user.' },
  { id: 'fc-rmm-14', moduleId: 'datto-rmm', question: 'How can you automatically resolve an alert when a problem is fixed?', answer: 'Configure the monitor with an "Auto-Resolve" condition (e.g., if CPU drops below 80% for 5 minutes, resolve the alert).' },
  { id: 'fc-rmm-15', moduleId: 'datto-rmm', question: 'What is a "Quick Job"?', answer: 'A way to instantly deploy a single component to selected devices without setting up a full scheduled job.' },
  { id: 'fc-rmm-16', moduleId: 'datto-rmm', question: 'What is the policy inheritance hierarchy in Datto RMM for patch management?', answer: 'Check the assigned policy scopes and filters. A specific override mechanism exists for Patch Management, but for Monitoring, policies apply via scopes (Global/Site) and filters.' },
  { id: 'fc-rmm-17', moduleId: 'datto-rmm', question: 'What does "Audit Only" mode do in a Patch Management policy?', answer: 'It scans for and reports on missing patches but explicitly does not install them or force reboots.' },
  { id: 'fc-rmm-18', moduleId: 'datto-rmm', question: 'What happens to UDF 1 (User-Defined Field 1) when Ransomware Detection isolates a device?', answer: 'Datto RMM automatically populates UDF 1 with the isolation status and timestamp, which can be used to trigger dynamic filters and alerts.' },
  { id: 'fc-rmm-19', moduleId: 'datto-rmm', question: 'Can you still remotely access a device that has been network-isolated by Ransomware Detection?', answer: 'Yes, the Datto RMM agent maintains a secure tunnel back to the platform, allowing access via Agent Browser or Web Remote.' },
  { id: 'fc-rmm-20', moduleId: 'datto-rmm', question: 'How does Datto RMM integrate with Datto BCDR for ransomware recovery?', answer: 'If integrated, RMM can trigger a BCDR restore job directly from the RMM console to recover an isolated device to its last known good backup.' },
  { id: 'fc-rmm-21', moduleId: 'datto-rmm', question: 'What is the difference between Standard and Advanced Software Management?', answer: 'Standard covers a few basic apps (like Chrome, Java, Adobe Reader). Advanced covers patching for over 200+ third-party applications.' },
  { id: 'fc-rmm-22', moduleId: 'datto-rmm', question: 'What runtime framework does the modern Datto RMM Agent and Web Remote use?', answer: 'They moved to .NET 10 to future-proof the agent, as .NET 8 reaches end of support in Nov 2026.' },
  { id: 'fc-rmm-23', moduleId: 'datto-rmm', question: 'What are the main features of the Agent Browser?', answer: 'It provides background access to the command shell, registry editor, Windows services, event logs, and file system without interrupting the end user.' },
  { id: 'fc-rmm-24', moduleId: 'datto-rmm', question: 'What is the purpose of Local Caching in Patch Management?', answer: 'It allows one designated device on a local network to download patches from the internet once, and then distribute them to other local devices to save WAN bandwidth.' },
  { id: 'fc-rmm-25', moduleId: 'datto-rmm', question: 'How does OS Patching differ from Software Management?', answer: 'OS Patching handles core operating system updates (Windows Update, macOS updates). Software Management handles updates for third-party installed applications.' },
  { id: 'fc-rmm-26', moduleId: 'datto-rmm', question: 'What is the ComStore?', answer: 'A built-in repository of pre-written scripts, monitors, and applications created and maintained by Datto for easy deployment.' },
  { id: 'fc-rmm-27', moduleId: 'datto-rmm', question: 'Why might a PowerShell script component fail if it prompts for user input?', answer: 'Because scripts deployed via RMM usually run silently in the background (as System). A prompt will hang the execution until it times out.' },
  { id: 'fc-rmm-28', moduleId: 'datto-rmm', question: 'What are Role-Based Permissions in Datto RMM used for?', answer: 'To restrict technician access, such as preventing tier 1 techs from running destructive scripts or accessing VIP client sites.' },
  { id: 'fc-rmm-29', moduleId: 'datto-rmm', question: 'What is the Executive Summary Report?', answer: 'A scheduled report that provides clients with a high-level overview of their network health, patch compliance, and security posture.' },
  { id: 'fc-rmm-30', moduleId: 'datto-rmm', question: 'How can you automate the deployment of a specific software package to all newly enrolled devices?', answer: 'Create a Device Filter for new devices missing the software, and assign a recurring Job or an Initial Node configuration policy to that filter.' },
  { id: 'fc-rmm-31', moduleId: 'datto-rmm', question: 'What is a "Network Node" in Datto RMM?', answer: 'A specific device designated to perform network discovery scans and act as a local cache or SNMP polling engine for a site.' },
  { id: 'fc-rmm-32', moduleId: 'datto-rmm', question: 'How do you temporarily suppress alerts for a server during planned maintenance?', answer: 'Place the device in "Maintenance Mode" from the device summary page, which pauses all monitor alerting.' }
];
