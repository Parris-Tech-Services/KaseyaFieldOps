import { describe, it, expect } from 'vitest';
import { aggregatedModules as modules, aggregatedScenarios as scenarios, aggregatedCards as flashcards } from './products';


describe('Content Quality Audit', () => {
  it('every module has sources defined', () => {
    modules.forEach(mod => {
      expect(mod.sources).toBeDefined();
      expect(mod.sources?.length).toBeGreaterThan(0);
    });
  });

  it('source URLs use approved official domains', () => {
    const approvedDomains = ['datto.com', 'kaseya.com', 'help.bullphishid.kaseya.com', 'help.one.kaseya.com', 'inky.com'];
    modules.filter(mod => mod.category !== 'networking').forEach(mod => {
      mod.sources?.forEach(src => {
        try {
          const url = new URL(src.url);
          const domain = url.hostname.replace(/^www\./, '');
          expect(approvedDomains.includes(domain) || domain.endsWith('.kaseya.com') || domain.endsWith('.datto.com')).toBe(true);
        } catch (e) {
          throw new Error(`Invalid URL found in module ${mod.id}: ${src.url}`);
        }
      });
    });
  });

  it('networking modules cite primary standards or vendor documentation', () => {
    // Networking fundamentals aren't Kaseya products, so they cite the
    // standards bodies and platform vendors that define them instead.
    const approved = ['rfc-editor.org', 'iana.org', 'ieee802.org', 'learn.microsoft.com', 'wi-fi.org', 'wireguard.com', 'wireshark.org'];
    const networking = modules.filter(mod => mod.category === 'networking');
    expect(networking).toHaveLength(10);
    networking.forEach(mod => {
      mod.sources?.forEach(src => {
        const domain = new URL(src.url).hostname.replace(/^www\./, '');
        expect(approved, `${mod.id}: ${src.url}`).toContain(domain);
      });
    });
  });

  it('networking modules have lessons, and every scenario step has exactly one correct option', () => {
    modules.filter(mod => mod.category === 'networking').forEach(mod => {
      expect(mod.lessonSections?.length).toBeGreaterThanOrEqual(4);
      const own = scenarios.filter(s => s.moduleId === mod.id);
      expect(own.map(s => s.id)).toEqual([`${mod.id}-ticket`, `${mod.id}-knowledge-check`]);
      own.forEach(s => {
        expect(s.steps[s.firstStepId]).toBeDefined();
        Object.values(s.steps).forEach(step => {
          expect(step.options.filter(o => o.isCorrect), `${s.id}/${step.id}`).toHaveLength(1);
          step.options.forEach(o => { if (o.nextStepId) expect(s.steps[o.nextStepId], `${s.id}/${o.id}`).toBeDefined(); });
        });
      });
    });
  });

  it('every module has at least one scenario', () => {
    modules.forEach(mod => {
      const moduleScenarios = scenarios.filter(s => s.moduleId === mod.id);
      expect(moduleScenarios.length).toBeGreaterThan(0);
    });
  });

  it('every module has at least one flashcard', () => {
    modules.forEach(mod => {
      const moduleCards = flashcards.filter(c => c.moduleId === mod.id);
      expect(moduleCards.length).toBeGreaterThan(0);
    });
  });

  it('scenario IDs are unique', () => {
    const ids = scenarios.map(s => s.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('flashcard IDs are unique', () => {
    const ids = flashcards.map(c => c.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });

  it('every scenario references a valid module', () => {
    const moduleIds = new Set(modules.map(m => m.id));
    scenarios.forEach(s => {
      expect(moduleIds.has(s.moduleId)).toBe(true);
    });
  });

  it('every flashcard references a valid module', () => {
    const moduleIds = new Set(modules.map(m => m.id));
    flashcards.forEach(c => {
      expect(moduleIds.has(c.moduleId)).toBe(true);
    });
  });

  it('no placeholder content is present', () => {
    const placeholderStrings = ['Content pending', 'placeholder', 'Lorem ipsum', 'TODO'];
    
    // Check modules
    modules.forEach(mod => {
      const stringified = JSON.stringify(mod).toLowerCase();
      placeholderStrings.forEach(ph => {
        expect(stringified.includes(ph.toLowerCase())).toBe(false);
      });
    });

    // Check scenarios
    scenarios.forEach(s => {
      const stringified = JSON.stringify(s).toLowerCase();
      placeholderStrings.forEach(ph => {
        expect(stringified.includes(ph.toLowerCase())).toBe(false);
      });
    });
    
    // Check flashcards
    flashcards.forEach(c => {
      const stringified = JSON.stringify(c).toLowerCase();
      placeholderStrings.forEach(ph => {
        expect(stringified.includes(ph.toLowerCase())).toBe(false);
      });
    });
  });
});
