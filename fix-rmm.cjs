const fs = require('fs');
let c = fs.readFileSync('src/data/products/datto-rmm.ts', 'utf8');

c = c.replace(/Yes, removing the lower-level override allows the Global policy to apply correctly/g, 'Yes, managing targets via explicit filters and groups is best practice');
c = c.replace(/It is much more likely an override exists/g, 'It is much more likely a conflicting policy exists');
c = c.replace(/A Device-level override was placed on all servers at Client A/g, 'A specific policy was assigned directly targeting all servers at Client A');
c = c.replace(/If it's not at the Site level, individual Device-level overrides are the next place to look/g, "If it's not a site-wide policy, individual explicit device targeting is the next place to look");
c = c.replace(/Site-level patch override conflict/g, 'Site-level patch policy conflict');
c = c.replace(/a site-level override contradicts it/g, 'a site-level policy contradicts it');
c = c.replace(/Correct\. Site-level policies override Global policies\./g, 'Correct. For Patch Management, Datto explicitly documents a Site-level override mechanism for Global Patch Management policies.');
c = c.replace(/that overrides the global default/g, 'that overrides the global default via the documented Patch Management override');
c = c.replace(/Tracing the policy hierarchy \(Global < Site < Device\) is critical/g, 'Tracing specific Patch Management override behaviour is critical');
c = c.replace(/Global level is overridden by Site level, which is overridden by Device level/g, 'Policies are generally applied by scope (Global or Site) using filters and groups, rather than a strict global/site/device generic hierarchy');
c = c.replace(/Site-level patch policies always override Global-level patch policies/g, 'Datto explicitly documents a Site-level override mechanism for Global Patch Management policies');

fs.writeFileSync('src/data/products/datto-rmm.ts', c);
