// =========================================================
// settings.js — Settings page rendering & management
// QR Prism v2.4
// =========================================================

const SETTINGS_KEY = 'qrp_settings_v4';

const SETTINGS_DEFAULTS = {
  theme: 'dark',
  autoSaveProjects: true,
  showGrid: false,
  transparentBg: false,
  defaultSize: 600,
  defaultFormat: 'png',
  errorLevel: 'M',
  margin: 4,
  profileName: '',
  profileEmail: '',
  profileBio: '',
  profileWeb: '',
  profileAvatarUrl: '',
  animationsEnabled: true,
  pwaInstalled: false,
};

let SETTINGS = { ...SETTINGS_DEFAULTS };

function loadSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(SETTINGS_KEY));
    if (saved) Object.assign(SETTINGS, saved);
  } catch {}
}

function saveSettingsData() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS)); } catch {}
}

// ── PWA Install prompt ────────────────────────────────────
let _pwaPrompt = null;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  _pwaPrompt = e;
  document.dispatchEvent(new Event('pwa-installable'));
});
window.addEventListener('appinstalled', () => {
  SETTINGS.pwaInstalled = true;
  saveSettingsData();
  _pwaPrompt = null;
  document.dispatchEvent(new Event('pwa-installed'));
});

async function installPWA() {
  if (!_pwaPrompt) return;
  _pwaPrompt.prompt();
  const result = await _pwaPrompt.userChoice;
  if (result.outcome === 'accepted') {
    SETTINGS.pwaInstalled = true;
    saveSettingsData();
    _pwaPrompt = null;
    renderSettings();
    showToast('QR Prism installed! 🎉', 'success');
  }
}

function toggleSetting(key, el) {
  SETTINGS[key] = !SETTINGS[key];
  el.classList.toggle('on', SETTINGS[key]);
  saveSettingsData();
  if (key === 'animationsEnabled') {
    document.body.classList.toggle('no-animate', !SETTINGS[key]);
  }
}

function setSetting(key, value) {
  SETTINGS[key] = value;
  saveSettingsData();
  if (key === 'defaultSize') { S.size = value; schedRender?.(); }
  if (key === 'errorLevel') { S.errorLevel = value; schedRender?.(); }
  if (key === 'margin') { S.margin = parseInt(value); schedRender?.(); }
}

function toggleDark() {
  SETTINGS.theme = SETTINGS.theme === 'dark' ? 'light' : 'dark';
  saveSettingsData();
  applyTheme(SETTINGS.theme);
}

function exportSettings() {
  const now = new Date();
  const stamp = `${now.getDate().toString().padStart(2,'0')}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getFullYear()}`;
  const payload = {
    _copyright: '© QR Prism by Muhtasim Rahman (Turzo) — https://mdturzo.odoo.com',
    _type: 'qr-prism-settings',
    _version: '2.4',
    _exported: now.toISOString(),
    settings: SETTINGS,
  };
  downloadJSON(payload, `qr-prism_settings_${stamp}.json`);
  showToast('Settings exported', 'success');
}

function resetSettings() {
  showConfirm({
    title: 'Reset Settings',
    msg: "Reset all settings to defaults? Your projects and templates won't be affected.",
    list: ['Theme & appearance', 'Download defaults', 'Auto-save preferences'],
    okLabel: 'Reset',
    onConfirm: () => {
      const keep = { profileName: SETTINGS.profileName, profileEmail: SETTINGS.profileEmail,
        profileBio: SETTINGS.profileBio, profileWeb: SETTINGS.profileWeb,
        profileAvatarUrl: SETTINGS.profileAvatarUrl };
      Object.assign(SETTINGS, SETTINGS_DEFAULTS, keep);
      saveSettingsData();
      applyTheme(SETTINGS.theme);
      renderSettings();
      showToast('Settings reset to defaults', 'info');
    }
  });
}

function clearAllData() {
  const projCount = loadProjects().length;
  const tmplCount = loadUserTemplates().length;
  showConfirm({
    title: 'Clear All App Data',
    msg: 'This will permanently delete everything stored by QR Prism.',
    list: [
      `Projects [${projCount}]`,
      `Templates [${tmplCount}]`,
      'Settings & preferences',
      'Profile information',
    ],
    okLabel: 'Delete Everything',
    onConfirm: () => {
      [PROJECTS_KEY, TEMPLATES_KEY, SETTINGS_KEY].forEach(k => localStorage.removeItem(k));
      Object.assign(SETTINGS, SETTINGS_DEFAULTS);
      applyTheme(SETTINGS.theme);
      renderSettings();
      updateProjectCountBadge();
      showToast('All data cleared', 'info');
    }
  });
}

function renderSettings() {
  const el = document.getElementById('settings-content');
  if (!el) return;

  const projCount = loadProjects().length;
  const tmplCount = loadUserTemplates().length;
  const pwaInstalled = SETTINGS.pwaInstalled;
  const pwaAvailable = !!_pwaPrompt;

  const toggle = (key, label, desc = '') => {
    const on = SETTINGS[key];
    return `
    <div class="setting-row">
      <div>
        <div class="setting-label">${label}</div>
        ${desc ? `<div class="setting-desc">${desc}</div>` : ''}
      </div>
      <div class="toggle ${on ? 'on' : ''}" onclick="toggleSetting('${key}', this)"></div>
    </div>`;
  };

  el.innerHTML = `
    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-palette"></i> Appearance</div>
      <div class="setting-row">
        <div class="setting-label">Theme</div>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-sm ${SETTINGS.theme==='dark'?'btn-primary':'btn-ghost'}" onclick="setSetting('theme','dark'); applyTheme('dark'); renderSettings();">
            <i class="fa-solid fa-moon"></i> Dark
          </button>
          <button class="btn btn-sm ${SETTINGS.theme==='light'?'btn-primary':'btn-ghost'}" onclick="setSetting('theme','light'); applyTheme('light'); renderSettings();">
            <i class="fa-solid fa-sun"></i> Light
          </button>
        </div>
      </div>
      ${toggle('animationsEnabled', 'Animations & Transitions', 'Smooth animations throughout the app')}
      ${toggle('showGrid', 'Grid in Preview', 'Subtle grid behind QR preview')}
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-qrcode"></i> QR Defaults</div>
      <div class="setting-row">
        <div class="setting-label">Default Size (px)</div>
        <select class="input input-sm" onchange="setSetting('defaultSize', parseInt(this.value))">
          ${[400,600,800,1000,1200,1600,2000].map(s =>
            `<option value="${s}" ${SETTINGS.defaultSize===s?'selected':''}>${s}×${s}</option>`
          ).join('')}
        </select>
      </div>
      <div class="setting-row">
        <div class="setting-label">Error Correction</div>
        <select class="input input-sm" onchange="setSetting('errorLevel', this.value); S.errorLevel=this.value; schedRender?.();">
          ${[['L','L — 7%'],['M','M — 15% (Recommended)'],['Q','Q — 25%'],['H','H — 30% (Best)']].map(([v,l]) =>
            `<option value="${v}" ${SETTINGS.errorLevel===v?'selected':''}>${l}</option>`
          ).join('')}
        </select>
      </div>
      <div class="setting-row">
        <div class="setting-label">Quiet Zone Margin</div>
        <select class="input input-sm" onchange="setSetting('margin', parseInt(this.value)); S.margin=parseInt(this.value); schedRender?.();">
          ${[0,1,2,4,6,8].map(v =>
            `<option value="${v}" ${SETTINGS.margin===v?'selected':''}>${v} modules</option>`
          ).join('')}
        </select>
      </div>
      <div class="setting-row">
        <div class="setting-label">Default Download Format</div>
        <select class="input input-sm" onchange="setSetting('defaultFormat', this.value)">
          ${['png','svg','jpg','webp'].map(f =>
            `<option value="${f}" ${SETTINGS.defaultFormat===f?'selected':''}>${f.toUpperCase()}</option>`
          ).join('')}
        </select>
      </div>
      ${toggle('transparentBg', 'Transparent Background', 'PNG background transparent by default')}
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-folder-open"></i> Projects</div>
      ${toggle('autoSaveProjects', 'Auto-Save Projects', 'Automatically track each unique QR in history')}
      <div class="setting-row">
        <div>
          <div class="setting-label">Projects <span class="settings-count-badge">[${projCount}]</span></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="exportProjects()"><i class="fa-solid fa-file-export"></i> Export</button>
          <button class="btn btn-ghost btn-sm" onclick="openModal('import-modal')"><i class="fa-solid fa-file-import"></i> Import</button>
          ${projCount ? `<button class="btn btn-danger btn-sm" onclick="clearAllProjects()"><i class="fa-solid fa-trash"></i> Delete [${projCount}]</button>` : ''}
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-bookmark"></i> Templates</div>
      <div class="setting-row">
        <div>
          <div class="setting-label">Templates <span class="settings-count-badge">[${tmplCount}]</span></div>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" onclick="exportTemplates()"><i class="fa-solid fa-file-export"></i> Export</button>
          <button class="btn btn-ghost btn-sm" onclick="openModal('import-modal')"><i class="fa-solid fa-file-import"></i> Import</button>
          ${tmplCount ? `<button class="btn btn-danger btn-sm" onclick="clearAllTemplates()"><i class="fa-solid fa-trash"></i> Delete [${tmplCount}]</button>` : ''}
        </div>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-mobile-screen"></i> Install App (PWA)</div>
      ${pwaInstalled
        ? `<div class="pwa-banner installed">
            <div class="pwa-banner-icon"><i class="fa-solid fa-circle-check"></i></div>
            <div><div class="pwa-banner-title">QR Prism is Installed ✓</div>
            <div class="pwa-banner-sub">Enjoy the full app experience offline</div></div>
          </div>`
        : pwaAvailable
        ? `<div class="pwa-banner installable">
            <div class="pwa-banner-icon"><i class="fa-solid fa-download"></i></div>
            <div style="flex:1;"><div class="pwa-banner-title">Install QR Prism</div>
            <div class="pwa-banner-sub">Add to home screen · Works offline · Faster access</div></div>
            <button class="btn btn-primary btn-sm" onclick="installPWA()">Install</button>
          </div>`
        : `<div class="setting-row">
            <div><div class="setting-label">Install as App</div>
            <div class="setting-desc">Use "Add to Home Screen" in your browser menu</div></div>
          </div>`
      }
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-database"></i> Data Management</div>
      <div class="setting-row">
        <div><div class="setting-label">Export Settings</div><div class="setting-desc">Backup preferences to JSON</div></div>
        <button class="btn btn-ghost btn-sm" onclick="exportSettings()"><i class="fa-solid fa-file-export"></i> Export</button>
      </div>
      <div class="setting-row">
        <div><div class="setting-label">Reset Settings</div><div class="setting-desc">Restore all preferences to defaults</div></div>
        <button class="btn btn-ghost btn-sm" onclick="resetSettings()"><i class="fa-solid fa-rotate-left"></i> Reset</button>
      </div>
      <div class="setting-row">
        <div><div class="setting-label" style="color:var(--danger);">Clear All Data</div>
        <div class="setting-desc">Delete all projects, templates & settings <span class="settings-count-badge">[${projCount + tmplCount} items]</span></div></div>
        <button class="btn btn-danger btn-sm" onclick="clearAllData()"><i class="fa-solid fa-skull"></i> Clear All</button>
      </div>
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-circle-info"></i> About QR Prism</div>
      <div class="about-block">
        <div class="about-logo-row">
          <div class="about-logo-box">
            <svg viewBox="0 0 40 40" width="40" height="40">
              <defs>
                <linearGradient id="abl" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stop-color="#818CF8"/>
                  <stop offset="100%" stop-color="#6366F1"/>
                </linearGradient>
              </defs>
              <rect width="40" height="40" rx="10" fill="url(#abl)"/>
              <text x="20" y="28" text-anchor="middle" font-size="22" fill="#fff" font-weight="700" font-family="Poppins,sans-serif">Q</text>
            </svg>
          </div>
          <div>
            <div class="about-app-name">QR Prism</div>
            <div class="about-version">v2.4 · 2026</div>
          </div>
        </div>
        <p class="about-desc">
          Free, open-source advanced QR code generator with beautiful customization,
          batch generation, project management, and a built-in scanner. Works fully offline as a PWA.
        </p>
        <div class="about-info-grid">
          <div class="about-info-item"><span>Author</span>
            <a href="https://mdturzo.odoo.com" target="_blank" rel="noopener"><strong>Muhtasim Rahman (Turzo)</strong></a>
          </div>
          <div class="about-info-item"><span>GitHub</span>
            <a href="https://github.com/muhtasim-rahman/qr-prism" target="_blank" rel="noopener">muhtasim-rahman/qr-prism</a>
          </div>
          <div class="about-info-item"><span>License</span><strong>MIT Open Source</strong></div>
          <div class="about-info-item"><span>Stack</span><strong>HTML · CSS · JS</strong></div>
        </div>
        <div class="about-btns">
          <a href="https://github.com/muhtasim-rahman/qr-prism" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
            <i class="fa-brands fa-github"></i> GitHub
          </a>
          <button class="btn btn-ghost btn-sm" onclick="openDocumentation()">
            <i class="fa-solid fa-book"></i> Docs
          </button>
          <button class="btn btn-ghost btn-sm" onclick="shareApp()">
            <i class="fa-solid fa-share-nodes"></i> Share
          </button>
          <button class="btn btn-ghost btn-sm" onclick="switchMode('report')">
            <i class="fa-solid fa-bug"></i> Bug Report
          </button>
        </div>
      </div>
    </div>`;
}
