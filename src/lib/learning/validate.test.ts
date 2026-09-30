import { describe, it, expect } from 'vitest';
import { aggregatedModules, aggregatedScenarios, aggregatedCards } from '../../data/products/index';

describe('Content Structural Integrity & Graph Verification', () => {
  it('should have unique IDs across all scenarios and flashcards', () => {
    const ids = new Set<string>();
    for (const sc of aggregatedScenarios) {
      expect(ids.has(sc.id)).toBe(false);
      ids.add(sc.id);
    }
    for (const fc of aggregatedCards) {
      expect(ids.has(fc.id)).toBe(false);
      ids.add(fc.id);
    }
  });

  it('should have matching module IDs', () => {
    const moduleIds = new Set(aggregatedModules.map(m => m.id));
    for (const sc of aggregatedScenarios) {
      expect(moduleIds.has(sc.moduleId)).toBe(true);
    }
    for (const fc of aggregatedCards) {
      expect(moduleIds.has(fc.moduleId)).toBe(true);
    }
  });

  it('Full graph integrity: all targets exist, all reachable, no orphans', () => {
    for (const sc of aggregatedScenarios) {
      const stepIds = new Set(Object.keys(sc.steps));
      expect(stepIds.size).toBeGreaterThan(0);
      expect(stepIds.has(sc.firstStepId)).toBe(true);

      const reachable = new Set<string>();
      const queue = [sc.firstStepId];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (!reachable.has(curr)) {
          reachable.add(curr);
          const step = (sc.steps as any)[curr];
          expect(step).toBeDefined();

          for (const opt of step.options) {
            if (opt.nextStepId) {
              expect(stepIds.has(opt.nextStepId)).toBe(true);
              queue.push(opt.nextStepId);
            }
          }
        }
      }

      for (const stepId of stepIds) {
        if (!reachable.has(stepId)) {
          throw new Error(`Orphan node detected: Scenario ${sc.id} has unreachable step ${stepId}`);
        }
      }
    }
  });

  it('Correct-path integrity: all correct options eventually terminate without cycles or dead ends', () => {
    for (const sc of aggregatedScenarios) {
      const pathsToVisit = [[sc.firstStepId]];
      let atLeastOneCorrectTerminalPath = false;
      const allPathsValid = true;

      while (pathsToVisit.length > 0) {
        const currentPath = pathsToVisit.shift()!;
        const currId = currentPath[currentPath.length - 1];

        // Cycle detection for this specific path
        if (currentPath.indexOf(currId) !== currentPath.length - 1) {
          throw new Error(`Cycle detected in correct path for scenario ${sc.id} at step ${currId}`);
        }

        const step = (sc.steps as any)[currId];
        const correctOptions = step.options.filter((o: any) => o.isCorrect);

        if (correctOptions.length === 0) {
           throw new Error(`Dead end: No correct option at step ${currId} in scenario ${sc.id}`);
        }

        for (const correctOpt of correctOptions) {
          if (correctOpt.nextStepId) {
            pathsToVisit.push([...currentPath, correctOpt.nextStepId]);
          } else {
            atLeastOneCorrectTerminalPath = true;
          }
        }
      }

      expect(atLeastOneCorrectTerminalPath).toBe(true);
      expect(allPathsValid).toBe(true);
    }
  });
});
