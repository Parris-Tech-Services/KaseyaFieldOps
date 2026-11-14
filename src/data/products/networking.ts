// MSP networking fundamentals (DHCP through AD/Microsoft 365). Content lives
// in ../networking/networkingCurriculum.ts, shared with the other Parris Tech
// learning apps; this file adapts it to Field Ops modules, scenarios and cards.
import type { AppModule, Flashcard, Scenario, ScenarioStep } from '../types';
import {
  SOURCES_VERIFIED_AT,
  markdownTablesToLists,
  networkingCurriculum,
  type NetModule,
} from '../networking/networkingCurriculum';

const ICONS: Record<string, string> = {
  'net-dhcp': 'Network',
  'net-dns': 'Globe',
  'net-vlans': 'Split',
  'net-routing': 'Route',
  'net-nat-firewall': 'BrickWall',
  'net-ports': 'Plug',
  'net-vpn': 'LockKeyhole',
  'net-wifi': 'Wifi',
  'net-troubleshooting': 'Stethoscope',
  'net-ad-m365': 'Building2',
};

const STEP_COMPETENCIES: ScenarioStep['competencyArea'][] = ['investigation', 'decisionMaking', 'procedure'];

function firstParagraph(md: string): string {
  return md.split('\n\n')[0].replace(/\*\*/g, '').replace(/`/g, '');
}

function toModule(m: NetModule): AppModule {
  return {
    id: m.id,
    name: m.title,
    description: m.summary,
    iconName: ICONS[m.id] ?? 'Network',
    color: 'bg-cyan-700',
    order: 100 + m.order,
    category: 'networking',
    lessonSections: m.sections.map((s) => ({ title: s.title, body: markdownTablesToLists(s.body) })),
    problemSolved: m.whyItMatters,
    mentalModel: firstParagraph(m.sections[0].body),
    keyTerminology: m.keyTerms,
    actualUseCases: m.objectives,
    commonWorkflows: m.commands.map((c) => `${c.command}: ${c.purpose}`),
    whenNotToUse: m.commonMistakes,
    relatedProducts: m.prerequisites,
    sources: m.sources.map((s) => ({ ...s, verifiedAt: SOURCES_VERIFIED_AT })),
  };
}

function ticketScenario(m: NetModule): Scenario {
  const s = m.scenario;
  const steps: Record<string, ScenarioStep> = {};
  s.steps.forEach((step, i) => {
    const nextId = i + 1 < s.steps.length ? s.steps[i + 1].id : 'note';
    steps[step.id] = {
      id: step.id,
      competencyArea: STEP_COMPETENCIES[i] ?? 'decisionMaking',
      text: i === 0 ? `${s.ticket.summary} ${s.ticket.symptoms.join(' ')} Recent change: ${s.ticket.recentChanges.join(' ')} ${step.prompt}` : step.prompt,
      options: step.options.map((o, j) => ({
        id: `${step.id}-opt-${j + 1}`,
        text: o.text,
        isCorrect: o.correct,
        feedback: o.feedback,
        nextStepId: o.correct ? nextId : step.id,
      })),
    };
  });
  steps.note = {
    id: 'note',
    competencyArea: 'documentation',
    text: `Resolved: ${s.resolution} Which ticket note should you write?`,
    options: [
      { id: 'note-opt-1', text: s.ticketNote, isCorrect: true, feedback: 'Good note: cause, evidence, the exact change and how it was verified.' },
      { id: 'note-opt-2', text: 'Fixed the network issue, user happy.', isCorrect: false, feedback: 'This gives the next technician nothing: no cause, no change, no verification.', nextStepId: 'note' },
    ],
  };
  return {
    id: `${m.id}-ticket`,
    moduleId: m.id,
    title: s.title,
    description: `${s.ticket.client}: ${s.ticket.summary}`,
    firstStepId: s.steps[0].id,
    steps,
  };
}

function knowledgeCheck(m: NetModule): Scenario {
  const steps: Record<string, ScenarioStep> = {};
  m.quiz.forEach((q, i) => {
    const nextId = m.quiz[i + 1]?.id;
    steps[q.id] = {
      id: q.id,
      competencyArea: 'knowledge',
      text: q.question,
      options: q.options.map((text, j) => ({
        id: `${q.id}-opt-${j + 1}`,
        text,
        isCorrect: j === q.answerIndex,
        feedback: j === q.answerIndex ? q.explanation : `Not quite. ${q.explanation}`,
        nextStepId: j === q.answerIndex ? nextId : q.id,
      })),
    };
  });
  return {
    id: `${m.id}-knowledge-check`,
    moduleId: m.id,
    title: `Knowledge check: ${m.shortTitle}`,
    description: `${m.quiz.length} quick questions on ${m.title.toLowerCase()}.`,
    firstStepId: m.quiz[0].id,
    steps,
  };
}

function toCards(m: NetModule): Flashcard[] {
  return m.flashcards.map((f) => ({ id: f.id, moduleId: m.id, question: f.front, answer: f.back }));
}

export const networkingProducts = networkingCurriculum.map((m) => ({
  module: toModule(m),
  scenarios: [ticketScenario(m), knowledgeCheck(m)],
  cards: toCards(m),
}));
