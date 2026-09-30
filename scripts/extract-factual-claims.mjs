import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { allProducts } from '../src/data/products/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getHash(text) {
  return crypto.createHash('sha256').update(text || '').digest('hex');
}

export function extractClaims() {
  const pendingLedger = [];
  const seenIds = new Set();
  
  let duplicateCount = 0;

  function addClaim(id, text, module, file) {
    if (!text || typeof text !== 'string' || text.trim() === '') return;
    
    // Validate uniqueness
    if (seenIds.has(id)) {
      console.error(`DUPLICATE CLAIM ID DETECTED: ${id}`);
      duplicateCount++;
    }
    seenIds.add(id);
    
    pendingLedger.push({
      claimId: id,
      sourceFile: file,
      claimText: text.trim(),
      hash: getHash(text.trim()),
      verdict: "UNREVIEWED",
      sourceUrl: "",
      sourceTitle: "",
      supportingSection: "",
      evidenceSummary: "",
      reviewedBy: "",
      checkedDate: ""
    });
  }

  for (const productExport of allProducts) {
    const m = productExport.module;
    if (!m) continue;
    
    const file = `src/data/products/${m.id}.ts`;
    const prefix = `${m.id}/module`;
    
    addClaim(`${prefix}/description`, m.description, m.id, file);
    addClaim(`${prefix}/problemSolved`, m.problemSolved, m.id, file);
    if (m.mentalModel) addClaim(`${prefix}/mentalModel`, m.mentalModel, m.id, file);
    
    m.keyTerminology?.forEach((t, i) => {
      addClaim(`${prefix}/keyTerminology/${i}/term`, t.term, m.id, file);
      addClaim(`${prefix}/keyTerminology/${i}/definition`, t.definition, m.id, file);
    });
    
    m.actualUseCases?.forEach((t, i) => addClaim(`${prefix}/actualUseCases/${i}`, t, m.id, file));
    m.commonWorkflows?.forEach((t, i) => addClaim(`${prefix}/commonWorkflows/${i}`, t, m.id, file));
    m.whenNotToUse?.forEach((t, i) => addClaim(`${prefix}/whenNotToUse/${i}`, t, m.id, file));
    m.commonConfusions?.forEach((t, i) => addClaim(`${prefix}/commonConfusions/${i}`, t, m.id, file));
    
    // Some are on module, some are exported separately
    const ticketCases = productExport.ticketCases || m.ticketCases || [];
    ticketCases.forEach((t, i) => {
      const tcId = t.id || `tc-${i}`;
      addClaim(`${m.id}/ticketCases/${tcId}/title`, t.title, m.id, file);
      addClaim(`${m.id}/ticketCases/${tcId}/client`, t.client, m.id, file);
      addClaim(`${m.id}/ticketCases/${tcId}/symptom`, t.symptom, m.id, file);
      addClaim(`${m.id}/ticketCases/${tcId}/investigation`, t.investigation, m.id, file);
      addClaim(`${m.id}/ticketCases/${tcId}/resolution`, t.resolution, m.id, file);
      addClaim(`${m.id}/ticketCases/${tcId}/lessonsLearned`, t.lessonsLearned, m.id, file);
      addClaim(`${m.id}/ticketCases/${tcId}/fasterNextTime`, t.fasterNextTime, m.id, file);
    });
    
    const realTickets = productExport.realTickets || m.realTickets || [];
    realTickets.forEach((t, i) => {
      const rtId = t.id || `rt-${i}`;
      addClaim(`${m.id}/realTickets/${rtId}/title`, t.title, m.id, file);
      addClaim(`${m.id}/realTickets/${rtId}/issue`, t.issue, m.id, file);
      addClaim(`${m.id}/realTickets/${rtId}/initialThought`, t.initialThought, m.id, file);
      addClaim(`${m.id}/realTickets/${rtId}/resolution`, t.resolution, m.id, file);
      addClaim(`${m.id}/realTickets/${rtId}/lessonsLearned`, t.lessonsLearned, m.id, file);
      addClaim(`${m.id}/realTickets/${rtId}/fasterNextTime`, t.fasterNextTime, m.id, file);
    });

    const scenarios = productExport.scenarios || [];
    for (const sc of scenarios) {
      const scPrefix = `${m.id}/scenarios/${sc.id}`;
      
      addClaim(`${scPrefix}/title`, sc.title, m.id, file);
      addClaim(`${scPrefix}/description`, sc.description, m.id, file);
      
      for (const stepKey in sc.steps) {
        const step = sc.steps[stepKey];
        addClaim(`${scPrefix}/steps/${step.id}/text`, step.text, m.id, file);
        
        step.options.forEach((opt, idx) => {
          // Use opt.id instead of just idx if available
          const oId = opt.id || `opt-${idx}`;
          addClaim(`${scPrefix}/steps/${step.id}/options/${oId}/text`, opt.text, m.id, file);
          addClaim(`${scPrefix}/steps/${step.id}/options/${oId}/feedback`, opt.feedback, m.id, file);
        });
      }
    }

    const cards = productExport.cards || [];
    for (const fc of cards) {
      const fcPrefix = `${m.id}/cards/${fc.id}`;
      addClaim(`${fcPrefix}/question`, fc.question, m.id, file);
      addClaim(`${fcPrefix}/answer`, fc.answer, m.id, file);
    }
  }
  
  if (duplicateCount > 0) {
    throw new Error(`Found ${duplicateCount} duplicate claim IDs. Extraction aborted.`);
  }

  return pendingLedger;
}

export function extractAndSave() {
  const pendingLedger = extractClaims();
  const ledgerPath = path.resolve(__dirname, '../docs/factual-claims.pending.json');
  fs.mkdirSync(path.dirname(ledgerPath), { recursive: true });
  fs.writeFileSync(ledgerPath, JSON.stringify(pendingLedger, null, 2));
  console.log(`Extracted ${pendingLedger.length} unique factual surfaces.`);
  return pendingLedger;
}
