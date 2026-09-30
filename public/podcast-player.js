(() => {
  // English-language episodes verified against their live Spotify episode pages on 16 Sep 2026.
  const episodes = [
    { id: '7vhbck9c1xMES9C5EOwkir', title: 'IT Support vs Help Desk: Choosing the Right One for Your Business', show: 'Protek IT Insights' },
    { id: '2Ph4l9QuJJpQ4WaI5BjXsS', title: 'Building a Secure Microsoft-First MSP: Intune, Defender & Entra ID at Scale', show: 'M365.FM' },
    { id: '7M2qm2siWBeoUr84gc3979', title: 'IT Helpdesk Best Practices That Actually Work', show: 'Crescent Tek Connections' },
    { id: '2Gc2yYimaZFe0gLuTp4XwC', title: 'Microsoft Intune — Simply Explained', show: 'M365.FM' },
    { id: '3AL1oz0YHZy56ICxuSH41T', title: 'SCCM vs Intune — Simply Explained', show: 'M365.FM' },
    { id: '6mPARqBJXEX6DpIJQsaeUc', title: 'Intune Security Misconfigurations: Why Your Intune Deployment Is a Security Risk', show: 'M365.FM' },
    { id: '4sI1gTDgc6r49pcciZTEnc', title: 'DHCP — Someone Get Me an Address!', show: 'N Is For Networking' },
    { id: '32eyxQu1f7XMoEGzBrBAQK', title: 'Microsoft 365 Architecture: Why Integration Beats Tools in Modern Work', show: 'M365.FM' },
    { id: '70kBvj9fUPSBNMuXAtP5p5', title: 'Windows 365 Updates for Admins', show: 'The PortalFuse Microsoft Intune and Security Report' },
    { id: '1l1TOs2sXfgP5CiOOh0196', title: 'Microsoft Entra and Microsoft Intune (Version 2026)', show: "Yeow's Podcasts" },
    { id: '2eWjwo3WX0aVAoVl9gjBrs', title: 'Why Entra Admins Need Microsoft Purview Now', show: 'Entra.Chat' },
    { id: '5reebDipBWxMatpsHf9lQ1', title: 'Microsoft Entra Permissions Management — Simply Explained', show: 'M365.FM' },
    { id: '18qBNbbo13W7yiqp9E6bOF', title: 'Global Secure Access, Entra Private Access & Intune', show: 'Workplace Ninja Summit' },
    { id: '6fDu9hTI6TwHYCXZnu9A2J', title: 'AI Automation Shifts MSPs from Per-Seat Pricing to Variable, Metered Cost Models', show: 'Business of Tech' },
    { id: '7kpfa8aFmVNfVDZxTobjnW', title: 'How to Handle IT Support Tickets Without Letting Problems Disappear Into the Queue', show: 'Turn Key Solutions' },
    { id: '6Qr0tiwVDAGXqwIX0hubRT', title: 'Why Helpdesk Could Be Killing Your Career', show: 'The I.T. Career Podcast' }
  ];

  let isOpen = false;
  let currentIndex = null;

  function pickDifferent(previous) {
    if (episodes.length <= 1) return 0;
    let next = Math.floor(Math.random() * episodes.length);
    while (next === previous) next = Math.floor(Math.random() * episodes.length);
    return next;
  }

  const style = document.createElement('style');
  style.textContent = `
    #kfo-podcast-root{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;position:relative;z-index:2147483000}
    #kfo-podcast-button{position:fixed;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;border:1px solid rgba(255,255,255,.25);border-radius:999px;background:#101827;color:#fff;padding:13px 20px;font:700 14px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;box-shadow:0 12px 34px rgba(0,0,0,.35);cursor:pointer;touch-action:manipulation;pointer-events:auto;white-space:nowrap}
    #kfo-podcast-panel{position:fixed;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:2147483000;width:min(620px,calc(100vw - 16px));box-sizing:border-box;border:1px solid #334155;border-radius:18px;background:#0f172a;color:#fff;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.55);pointer-events:auto}
    .kfo-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:10px}
    .kfo-kicker{font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#93c5fd}
    .kfo-title{font-size:16px;line-height:1.3;margin:4px 0 0;color:#fff}
    .kfo-show{font-size:12px;color:#cbd5e1;margin:5px 0 0}
    .kfo-note{font-size:11px;color:#94a3b8;margin:8px 0 0}
    .kfo-close{width:40px;height:40px;flex:0 0 40px;border:1px solid #475569;border-radius:50%;background:#1e293b;color:#fff;font-size:22px;cursor:pointer;touch-action:manipulation}
    .kfo-frame{display:block;width:100%;height:152px;border:0;border-radius:12px;background:#020617}
    .kfo-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:10px}
    .kfo-action{border:1px solid #475569;border-radius:10px;background:#1e293b;color:#fff;padding:9px 12px;font:700 13px/1.2 system-ui,-apple-system,Segoe UI,sans-serif;text-decoration:none;cursor:pointer;touch-action:manipulation}
    @media(max-width:640px){#kfo-podcast-panel{width:calc(100vw - 10px);padding:11px}.kfo-actions>*{flex:1;text-align:center;justify-content:center}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.id = 'kfo-podcast-root';
  document.body.appendChild(root);

  function render() {
    if (!isOpen) {
      root.innerHTML = '<button id="kfo-podcast-button" type="button" aria-label="Open verified English MSP and IT podcasts">🎧 Podcasts</button>';
      root.querySelector('#kfo-podcast-button').addEventListener('click', () => {
        if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= episodes.length) {
          currentIndex = pickDifferent(null);
        }
        isOpen = true;
        render();
      });
      return;
    }

    const current = episodes[currentIndex];
    const spotifyUrl = `https://open.spotify.com/episode/${encodeURIComponent(current.id)}`;
    const embedUrl = `https://open.spotify.com/embed/episode/${encodeURIComponent(current.id)}?theme=0`;

    root.innerHTML = `
      <aside id="kfo-podcast-panel" aria-label="Kaseya Field Ops English podcast player">
        <div class="kfo-head">
          <div>
            <div class="kfo-kicker">Kaseya Field Ops · English MSP / IT</div>
            <h2 class="kfo-title"></h2>
            <p class="kfo-show"></p>
          </div>
          <button type="button" class="kfo-close" aria-label="Close podcast player">×</button>
        </div>
        <iframe class="kfo-frame" title="Spotify podcast episode" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>
        <div class="kfo-actions">
          <button type="button" class="kfo-action kfo-different">🎲 Different podcast</button>
          <a class="kfo-action kfo-spotify" target="_blank" rel="noopener noreferrer">Open in Spotify ↗</a>
        </div>
        <p class="kfo-note">English-only bank: each Spotify episode ID was checked against its live episode page.</p>
      </aside>`;

    root.querySelector('.kfo-title').textContent = current.title;
    root.querySelector('.kfo-show').textContent = current.show;
    const frame = root.querySelector('.kfo-frame');
    frame.src = embedUrl;
    frame.title = `Spotify episode: ${current.title}`;
    root.querySelector('.kfo-spotify').href = spotifyUrl;
    root.querySelector('.kfo-close').addEventListener('click', () => { isOpen = false; render(); });
    root.querySelector('.kfo-different').addEventListener('click', () => {
      currentIndex = pickDifferent(currentIndex);
      render();
    });
  }

  render();
})();
