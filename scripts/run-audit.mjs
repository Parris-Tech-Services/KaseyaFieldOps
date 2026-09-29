import { allProducts } from '../src/data/products/index.ts';
import { extractAndSave } from './extract-factual-claims.mjs';
import { validateLedger } from './validate-factual-ledger.mjs';

async function run() {
  try {
    extractAndSave();
    const result = await validateLedger();
    console.log(result);
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}

run();
