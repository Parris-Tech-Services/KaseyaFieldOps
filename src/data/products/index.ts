// src/data/products/index.ts
import * as dattoRmm from './datto-rmm';
import * as dattoEdr from './datto-edr';
import * as dattoBackup from './datto-backup';
import * as dattoAzureBackup from './datto-azure-backup';
import * as dattoFileProtection from './datto-file-protection';
import * as dattoSaasProtection from './datto-saas-protection';
import * as darkwebId from './darkweb-id';
import * as bullphishId from './bullphish-id';
import * as kaseya365 from './kaseya-365';
import * as inky from './inky';

import type { AppModule, Scenario, Flashcard, RealTicketCase } from '../types';

interface ProductExport {
  module: AppModule;
  scenarios?: Scenario[];
  cards?: Flashcard[];
  ticketCases?: RealTicketCase[];
}

export const allProducts: ProductExport[] = [
  dattoRmm,
  dattoEdr,
  dattoBackup,
  dattoAzureBackup,
  dattoFileProtection,
  dattoSaasProtection,
  darkwebId,
  bullphishId,
  kaseya365,
  inky,
];

export const aggregatedModules: AppModule[] = allProducts.map(p => p.module);
export const aggregatedScenarios: Scenario[] = allProducts.flatMap(p => p.scenarios || []);
export const aggregatedCards: Flashcard[] = allProducts.flatMap(p => p.cards || []);
export const aggregatedTicketCases: RealTicketCase[] = allProducts.flatMap(p => p.ticketCases || []);
