// =========================================================
// SETTINGS.JS — QR Prism v2.8
// Full settings page: appearance, QR defaults, behavior,
// data/storage, about, PWA, Firebase account section
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ══════════════════════════════════════════════════════════
// setSetting  — update one SETTINGS key, persist, apply
// ══════════════════════════════════════════════════════════
function setSetting(key, value) {
  SETTINGS[key] = value;
  saveSettingsData();

  // Live-apply certain settings immediately
  switch (key) {
    case 'theme':
      applyTheme(value);
      updateThemeIcons(document.documentElement.getAttribute('data-theme'));
      renderPatternGrids();
      renderFrameGrids();
      break;
    case 'accentColor':
      applyAccent(value);
      break;
    case 'defaultSize':
      S.size = value;
      const sizeEl = document.getElementById('qr-size');
      if (sizeEl) sizeEl.value = value;
      break;
    case 'defaultEC':
      S.ec = value;
      document.querySelectorAll('.ec-btn').forEach(b =>
        b.classList.toggle('active', b.dataset.ec === value));
      break;
    case 'animateUI':
      document.documentElement.style.setProperty(
        '--dur-normal', value ? '240ms' : '0ms');
      document.documentElement.style.setProperty(
        '--dur-slow',   value ? '360ms' : '0ms');
      break;
  }
}

// ══════════════════════════════════════════════════════════
// RENDER SETTINGS PAGE
// ══════════════════════════════════════════════════════════
function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const projCount = JSON.parse(localStorage.getItem('qrp_projects') || '[]').length;
  const tmplCount = JSON.parse(localStorage.getItem('qrp_templates') || '[]').length;
  const theme     = document.documentElement.getAttribute('data-theme') || 'dark';
  const user      = (typeof FB_USER !== 'undefined') ? FB_USER : null;
  const cached    = (typeof getCachedUserProfile === 'function') ? getCachedUserProfile() : null;

  container.innerHTML = '';

  // ── PWA Install Banner ──
  container.appendChild(buildPWABanner());

  // ── Account Section ──
  container.appendChild(buildSection({
    icon: 'fa-solid fa-user-circle',
    title: 'Account',
    rows: user ? `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">${escHtml(cached?.displayName || user.displayName || 'Signed In')}</div>
          <div class="settings-row-sub">${escHtml(user.email || '')}</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-ghost btn-sm" onclick="switchMode('profile')">
            <i class="fa-solid fa-user"></i> Profile
          </button>
          <button class="btn btn-ghost btn-sm" style="color:var(--danger);" onclick="signOut()">
            <i class="fa-solid fa-right-from-bracket"></i> Sign Out
          </button>
        </div>
      </div>`
    : `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Not signed in</div>
          <div class="settings-row-sub">Sign in to sync your projects & templates</div>
        </div>
        <div style="display:flex;gap:6px;">
          <button class="btn btn-primary btn-sm" onclick="openModal('login-modal')">
            <i class="fa-solid fa-right-to-bracket"></i> Sign In
          </button>
          <button class="btn btn-outline btn-sm" onclick="switchAuthModal('signup')">
            <i class="fa-solid fa-user-plus"></i> Register
          </button>
        </div>
      </div>`,
  }));

  // ── Appearance ──
  container.appendChild(buildSection({
    icon: 'fa-solid fa-palette',
    title: 'Appearance',
    rows: `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Theme</div>
          <div class="settings-row-sub">Light, dark, or follow system</div>
        </div>
        <div style="display:flex;gap:4px;background:var(--surface2);padding:3px;border-radius:10px;">
          ${['dark','light','system'].map(t => `
            <button class="btn btn-sm${SETTINGS.theme === t ? ' btn-primary' : ' btn-ghost'}"
                    style="padding:5px 11px;font-size:.74rem;border-radius:7px;"
                    onclick="setSetting('theme','${t}');renderSettings();">
              ${t === 'dark' ? '<i class="fa-solid fa-moon"></i>' : t === 'light' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-circle-half-stroke"></i>'}
              ${t.charAt(0).toUpperCase() + t.slice(1)}
            </button>`).join('')}
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Accent Color</div>
          <div class="settings-row-sub">Primary color used throughout the app</div>
        </div>
        <div class="accent-dots">
          ${ACCENT_OPTIONS.map(a => `
            <div class="accent-dot${SETTINGS.accentColor === a.color ? ' active' : ''}"
                 style="background:${a.color};"
                 title="${a.label}"
                 onclick="setSetting('accentColor','${a.color}');renderSettings();">
            </div>`).join('')}
        </div>
      </div>`,
  }));

  // ── QR Defaults ──
  container.appendChild(buildSection({
    icon: 'fa-solid fa-qrcode',
    title: 'QR Defaults',
    rows: `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Default Size</div>
          <div class="settings-row-sub">Applied when starting a new QR</div>
        </div>
        <select class="select" style="width:110px;"
                onchange="setSetting('defaultSize',parseInt(this.value))">
          ${[300,400,512,600,800,1000,1200].map(v =>
            `<option value="${v}"${SETTINGS.defaultSize === v ? ' selected' : ''}>${v}px</option>`
          ).join('')}
        </select>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Error Correction</div>
          <div class="settings-row-sub">Higher = better scan reliability</div>
        </div>
        <div style="display:flex;gap:4px;">
          ${['L','M','Q','H'].map(ec => `
            <button class="ec-btn${SETTINGS.defaultEC === ec ? ' active' : ''}"
                    style="padding:5px 10px;font-size:.78rem;"
                    onclick="setSetting('defaultEC','${ec}');renderSettings();">${ec}</button>`
          ).join('')}
        </div>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Default Download Format</div>
          <div class="settings-row-sub">Format used when clicking Download</div>
        </div>
        <select class="select" style="width:110px;"
                onchange="setSetting('defaultFormat',this.value)">
          ${['png','jpg','svg','webp','pdf'].map(f =>
            `<option value="${f}"${SETTINGS.defaultFormat === f ? ' selected' : ''}>${f.toUpperCase()}</option>`
          ).join('')}
        </select>
      </div>`,
  }));

  // ── Behavior ──
  container.appendChild(buildSection({
    icon: 'fa-solid fa-sliders',
    title: 'Behavior',
    rows: [
      ['Auto-save Projects', 'Automatically save QR codes as you design', 'autoSaveProjects'],
      ['Confirm Before Delete', 'Show confirmation dialog when deleting', 'confirmDelete'],
      ['UI Animations', 'Smooth transitions and micro-interactions', 'animateUI'],
      ['High-DPI Export', 'Use device pixel ratio for sharper canvas output', 'highDPI'],
      ['Show Analytics', 'Display QR version, module count, scanability score', 'showAnalytics'],
    ].map(([label, sub, key]) => `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">${label}</div>
          <div class="settings-row-sub">${sub}</div>
        </div>
        <label class="toggle">
          <input type="checkbox" ${SETTINGS[key] ? 'checked' : ''}
                 onchange="setSetting('${key}',this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>`).join(''),
  }));

  // ── Data & Storage ──
  container.appendChild(buildSection({
    icon: 'fa-solid fa-database',
    title: 'Data & Storage',
    rows: `
      <div class="settings-row">
        <div class="storage-stats">
          <span class="stat-pill"><i class="fa-solid fa-folder"></i> Projects: ${projCount}</span>
          <span class="stat-pill"><i class="fa-solid fa-bookmark"></i> Templates: ${tmplCount}</span>
        </div>
      </div>
      <div class="settings-row">
        <div><div class="settings-row-label">Export Projects</div></div>
        <button class="btn btn-outline btn-sm" onclick="exportProjects()">
          <i class="fa-solid fa-file-export"></i> Export
        </button>
      </div>
      <div class="settings-row">
        <div><div class="settings-row-label">Export Templates</div></div>
        <button class="btn btn-outline btn-sm" onclick="exportTemplates()">
          <i class="fa-solid fa-file-export"></i> Export
        </button>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Export All Data</div>
          <div class="settings-row-sub">Projects, templates &amp; settings</div>
        </div>
        <button class="btn btn-outline btn-sm" onclick="exportAllData()">
          <i class="fa-solid fa-box-archive"></i> Export All
        </button>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Import Data</div>
          <div class="settings-row-sub">Import from QR Prism JSON file</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="openModal('import-modal')">
          <i class="fa-solid fa-file-import"></i> Import
        </button>
      </div>
      ${user ? `
      <div class="settings-row">
        <div>
          <div class="settings-row-label">Sync with Cloud</div>
          <div class="settings-row-sub">Push local data to your Firebase account</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="manualSyncToCloud()">
          <i class="fa-solid fa-cloud-arrow-up"></i> Sync Now
        </button>
      </div>` : ''}
      <div class="divider"></div>
      <div class="settings-row">
        <div><div class="settings-row-label" style="color:var(--danger);">Clear Projects</div></div>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:rgba(248,113,113,.35);"
                onclick="clearDataConfirm('projects')">
          <i class="fa-solid fa-trash"></i> Clear
        </button>
      </div>
      <div class="settings-row">
        <div><div class="settings-row-label" style="color:var(--danger);">Clear Templates</div></div>
        <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:rgba(248,113,113,.35);"
                onclick="clearDataConfirm('templates')">
          <i class="fa-solid fa-trash"></i> Clear
        </button>
      </div>
      <div class="settings-row">
        <div>
          <div class="settings-row-label" style="color:var(--danger);">Clear All Data</div>
          <div class="settings-row-sub">Cannot be undone</div>
        </div>
        <button class="btn btn-danger btn-sm" onclick="clearDataConfirm('all')">
          <i class="fa-solid fa-triangle-exclamation"></i> Clear All
        </button>
      </div>`,
  }));

  // ── About ──
  container.appendChild(buildAboutSection());
}

// ══════════════════════════════════════════════════════════
// SECTION BUILDER HELPERS
// ══════════════════════════════════════════════════════════
function buildSection({ icon, title, rows }) {
  const el = document.createElement('div');
  el.className = 'settings-section';
  el.innerHTML = `
    <div class="settings-section-header">
      <i class="${icon}"></i>
      <div class="settings-section-title">${escHtml(title)}</div>
    </div>
    <div class="settings-body">${rows}</div>`;
  return el;
}

function buildAboutSection() {
  const el = document.createElement('div');
  el.className = 'settings-section';
  el.innerHTML = `
    <div class="settings-section-header">
      <i class="fa-solid fa-circle-info"></i>
      <div class="settings-section-title">About QR Prism</div>
    </div>
    <div class="settings-body">
      <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
        <div style="flex-shrink:0;">
          <img class="brand-logo-icon brand-logo-dark-bg"  src="./assets/logo-light.svg" alt="QR Prism" style="width:52px;height:52px;">
          <img class="brand-logo-icon brand-logo-light-bg" src="./assets/logo-dark.svg"  alt="QR Prism" style="width:52px;height:52px;">
        </div>
        <div style="flex:1;">
          <div style="margin-bottom:4px;">
            <img class="brand-logo brand-logo-dark-bg"  src="./assets/logo&name-light.svg" alt="QR Prism" style="height:22px;">
            <img class="brand-logo brand-logo-light-bg" src="./assets/logo&name-dark.svg"  alt="QR Prism" style="height:22px;">
          </div>
          <div style="font-size:.72rem;color:var(--text3);font-family:'Fira Code',monospace;">
            v2.8 &nbsp;·&nbsp; MIT License
          </div>
        </div>
        <a href="https://github.com/muhtasim-rahman/qr-prism" target="_blank" rel="noopener"
           class="btn btn-ghost btn-sm">
          <i class="fa-brands fa-github"></i> GitHub
        </a>
      </div>
      <p style="font-size:.80rem;color:var(--text2);line-height:1.6;margin-bottom:12px;">
        Professional free QR code generator — 16 types, 22 dot patterns, gradients,
        logos, frames, Firebase sync. 100% client-side.
      </p>
      <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;">
        ${['HTML5','CSS3','Vanilla JS','Firebase','qrcode.js','jsQR','JSZip','Pickr','ImgBB']
          .map(t => `<span class="stack-pill">${t}</span>`).join('')}
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button class="btn btn-ghost btn-sm" onclick="openModal('about-modal')">
          <i class="fa-solid fa-circle-info"></i> About
        </button>
        <button class="btn btn-ghost btn-sm" onclick="openDocumentation()">
          <i class="fa-solid fa-book-open"></i> Documentation
        </button>
        <button class="btn btn-ghost btn-sm" onclick="openModal('kb-modal')">
          <i class="fa-solid fa-keyboard"></i> Shortcuts
        </button>
      </div>
      <p style="font-size:.76rem;color:var(--text3);margin-top:14px;">
        Made with <i class="fa-solid fa-heart" style="color:#ef4444;"></i> by
        <a href="https://mdturzo.odoo.com" target="_blank" rel="noopener"
           style="color:var(--primary);font-weight:600;">Muhtasim Rahman (Turzo)</a>
      </p>
    </div>`;
  return el;
}

// ══════════════════════════════════════════════════════════
// PWA INSTALL BANNER
// ══════════════════════════════════════════════════════════
function buildPWABanner() {
  const el = document.createElement('div');
  const installed = typeof isPWAInstalled === 'function' && isPWAInstalled();

  if (installed) {
    el.className = 'install-banner install-banner-installed';
    el.innerHTML = `
      <div class="install-banner-icon"><i class="fa-solid fa-circle-check" style="color:var(--success);"></i></div>
      <div class="install-banner-info">
        <div class="install-banner-title" style="color:var(--success);">QR Prism is installed</div>
        <div class="install-banner-sub">Running as a native app on this device</div>
      </div>`;
  } else {
    el.className = 'install-banner';
    el.innerHTML = `
      <div class="install-banner-icon"><i class="fa-solid fa-mobile-screen"></i></div>
      <div class="install-banner-info">
        <div class="install-banner-title">Install QR Prism</div>
        <div class="install-banner-sub">Add to home screen for offline use &amp; faster launch</div>
      </div>
      <button class="btn btn-sm" id="pwa-install-btn" onclick="installPWA()">
        <i class="fa-solid fa-download"></i> Install
      </button>`;

    // Hide install button if prompt not available
    if (typeof deferredInstallPrompt === 'undefined' || !deferredInstallPrompt) {
      el.style.display = 'none';
    }
  }

  return el;
}

// Show/hide PWA banner when prompt becomes available
document.addEventListener('pwa-installable', () => renderSettings());
document.addEventListener('pwa-installed',   () => renderSettings());

// ══════════════════════════════════════════════════════════
// syncProfileUI  (called from firebase.js / app.js)
// ══════════════════════════════════════════════════════════
function syncProfileUI() {
  // Update sidebar + topnav + mobile avatar via firebase.js updateAuthUI
  const cached = (typeof getCachedUserProfile === 'function') ? getCachedUserProfile() : null;
  if (typeof updateAuthUI === 'function') updateAuthUI(cached);
}

// ══════════════════════════════════════════════════════════
// MANUAL CLOUD SYNC BUTTON
// ══════════════════════════════════════════════════════════
async function manualSyncToCloud() {
  if (typeof FB_USER === 'undefined' || !FB_USER) {
    showToast('Sign in to sync', 'info'); return;
  }
  try {
    await syncToCloud(FB_USER.uid);
    showToast('Synced to cloud!', 'success');
  } catch {
    showToast('Sync failed', 'error');
  }
}

// ══════════════════════════════════════════════════════════
// CLEAR DATA
// ══════════════════════════════════════════════════════════
function clearDataConfirm(type) {
  const cfg = {
    projects:  { title:'Clear Projects',  keys:['qrp_projects'],  msg:'All saved and auto-saved projects' },
    templates: { title:'Clear Templates', keys:['qrp_templates'], msg:'All saved templates' },
    all:       { title:'Clear All Data',  keys:['qrp_projects','qrp_templates','qrp_settings'], msg:'All projects, templates and settings' },
  };
  const c = cfg[type];
  if (!c) return;

  showConfirm({
    title:   c.title,
    msg:     `This will permanently delete: ${c.msg}. This cannot be undone.`,
    okLabel: 'Delete Forever',
    okClass: 'btn-danger',
    onConfirm: () => {
      c.keys.forEach(k => localStorage.removeItem(k));
      if (type === 'all') {
        Object.assign(SETTINGS, {
          theme:'dark', accentColor:'#818CF8', autoSaveProjects:true,
          confirmDelete:true, defaultFormat:'png', defaultSize:600,
          defaultEC:'H', showAnalytics:true, highDPI:false, animateUI:true,
        });
        applyTheme('dark');
        applyAccent('#818CF8');
      }
      updateProjectCounts();
      renderSettings();
      showToast(`${c.title} complete`, 'info');
    }
  });
}
