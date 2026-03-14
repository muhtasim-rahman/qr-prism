// =========================================================
// SETTINGS.JS — QR Prism v2.7
// Settings page rendering + full persistence
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const pAll  = JSON.parse(localStorage.getItem('qrp_projects') || '[]').length;
  const tAll  = JSON.parse(localStorage.getItem('qrp_templates') || '[]').length;
  const rAll  = JSON.parse(localStorage.getItem('qrp_reports') || '[]').length;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

  container.innerHTML = '';

  // PWA Banner (first)
  if (typeof renderPWABanner === 'function') {
    container.appendChild(renderPWABanner());
  }

  container.innerHTML += `

  <!-- Appearance -->
  <div class="settings-section">
    <div class="settings-section-title"><i class="fa-solid fa-palette"></i> Appearance</div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Theme</div><div class="stg-sub">Light, dark, or follow system</div></div>
      <div class="seg-ctrl" style="display:flex;gap:4px;background:var(--surface2);padding:3px;border-radius:9px;">
        ${['dark','light','system'].map(t => `<button class="btn btn-sm${SETTINGS.theme === t ? ' btn-primary' : ' btn-ghost'}" style="padding:5px 10px;font-size:.74rem;"
          onclick="setSetting('theme','${t}');renderSettings();">${t.charAt(0).toUpperCase()+t.slice(1)}</button>`).join('')}
      </div>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Accent Color</div><div class="stg-sub">Primary color used throughout the app</div></div>
      <div class="pickr-wrap" id="accent-pickr-wrap"></div>
    </div>
  </div>

  <!-- QR Defaults -->
  <div class="settings-section">
    <div class="settings-section-title"><i class="fa-solid fa-qrcode"></i> QR Defaults</div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Default Size</div><div class="stg-sub">Applied to new QR codes</div></div>
      <select class="select" style="width:100px;" onchange="setSetting('defaultSize',parseInt(this.value));
        S.size=parseInt(this.value); document.getElementById('qr-size') && (document.getElementById('qr-size').value=this.value);">
        ${[300,400,512,600,800,1000,1200].map(v => `<option value="${v}"${SETTINGS.defaultSize===v?' selected':''}>${v}px</option>`).join('')}
      </select>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Error Correction</div><div class="stg-sub">Higher = more damage resistant</div></div>
      <select class="select" style="width:100px;" onchange="setSetting('defaultEC',this.value);
        S.ec=this.value; document.getElementById('ec-level') && (document.getElementById('ec-level').value=this.value);">
        ${['L','M','Q','H'].map(v => `<option value="${v}"${SETTINGS.defaultEC===v?' selected':''}>${v}</option>`).join('')}
      </select>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Default Format</div><div class="stg-sub">Download format when clicking main button</div></div>
      <select class="select" style="width:100px;" onchange="setSetting('defaultFormat',this.value);">
        ${['png','jpg','svg','webp'].map(v => `<option value="${v}"${SETTINGS.defaultFormat===v?' selected':''}>${v.toUpperCase()}</option>`).join('')}
      </select>
    </div>
  </div>

  <!-- Behavior -->
  <div class="settings-section">
    <div class="settings-section-title"><i class="fa-solid fa-sliders"></i> Behavior</div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Auto-save Projects</div><div class="stg-sub">Automatically save QR codes as you design</div></div>
      <label class="toggle"><input type="checkbox" ${SETTINGS.autoSaveProjects?'checked':''}
        onchange="setSetting('autoSaveProjects',this.checked)"><span class="toggle-slider"></span></label>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Confirm Before Delete</div><div class="stg-sub">Ask for confirmation when deleting</div></div>
      <label class="toggle"><input type="checkbox" ${SETTINGS.confirmDelete?'checked':''}
        onchange="setSetting('confirmDelete',this.checked)"><span class="toggle-slider"></span></label>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">UI Animations</div><div class="stg-sub">Smooth transitions throughout the app</div></div>
      <label class="toggle"><input type="checkbox" ${SETTINGS.animateUI?'checked':''}
        onchange="setSetting('animateUI',this.checked)"><span class="toggle-slider"></span></label>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">High DPI Export</div><div class="stg-sub">Use device pixel ratio for sharper output</div></div>
      <label class="toggle"><input type="checkbox" ${SETTINGS.highDPI?'checked':''}
        onchange="setSetting('highDPI',this.checked)"><span class="toggle-slider"></span></label>
    </div>
  </div>

  <!-- Data & Storage -->
  <div class="settings-section">
    <div class="settings-section-title"><i class="fa-solid fa-database"></i>
      Data &amp; Storage
      <span class="stg-count-chip">Projects: ${pAll} · Templates: ${tAll}</span>
    </div>

    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Export Projects <span class="stg-count-chip">${pAll}</span></div></div>
      <button class="btn btn-outline btn-sm" onclick="exportProjects()">
        <i class="fa-solid fa-file-export"></i> Export
      </button>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Export Templates <span class="stg-count-chip">${tAll}</span></div></div>
      <button class="btn btn-outline btn-sm" onclick="exportTemplates()">
        <i class="fa-solid fa-file-export"></i> Export
      </button>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Export All Data</div><div class="stg-sub">Projects, templates, and settings in one file</div></div>
      <button class="btn btn-outline btn-sm" onclick="exportAllData()">
        <i class="fa-solid fa-box-archive"></i> Export All
      </button>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">Import Data</div><div class="stg-sub">Import projects or templates from JSON</div></div>
      <button class="btn btn-ghost btn-sm" onclick="openModal('import-modal')">
        <i class="fa-solid fa-file-import"></i> Import
      </button>
    </div>

    <div class="divider"></div>

    <div class="stg-row">
      <div class="stg-info"><div class="stg-label" style="color:var(--danger);">Clear Projects <span class="stg-count-chip">${pAll}</span></div></div>
      <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:var(--danger);" onclick="clearDataConfirm('projects')">
        <i class="fa-solid fa-trash"></i> Clear
      </button>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label" style="color:var(--danger);">Clear Templates <span class="stg-count-chip">${tAll}</span></div></div>
      <button class="btn btn-ghost btn-sm" style="color:var(--danger);border-color:var(--danger);" onclick="clearDataConfirm('templates')">
        <i class="fa-solid fa-trash"></i> Clear
      </button>
    </div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label" style="color:var(--danger);">Clear All Data</div><div class="stg-sub">Projects, templates, reports, settings</div></div>
      <button class="btn btn-danger btn-sm" onclick="clearDataConfirm('all')">
        <i class="fa-solid fa-triangle-exclamation"></i> Clear All
      </button>
    </div>
  </div>

  <!-- About -->
  <div class="settings-section">
    <div class="settings-section-title"><i class="fa-solid fa-circle-info"></i> About QR Prism</div>
    <div class="card" style="margin-bottom:0;">
      <div class="card-body">
        <div style="display:flex;align-items:center;gap:14px;margin-bottom:14px;">
          <div style="width:48px;height:48px;background:linear-gradient(135deg,var(--primary-dark),var(--accent));border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <svg viewBox="0 0 100 100" fill="none" width="28" height="28">
              <rect x="8" y="8" width="35" height="35" rx="7" stroke="#fff" stroke-width="9"/>
              <rect x="17" y="17" width="17" height="17" rx="3" fill="#fff"/>
              <rect x="57" y="8" width="35" height="35" rx="7" stroke="#fff" stroke-width="9"/>
              <rect x="66" y="17" width="17" height="17" rx="3" fill="#fff"/>
              <rect x="8" y="57" width="35" height="35" rx="7" stroke="#fff" stroke-width="9"/>
              <rect x="17" y="66" width="17" height="17" rx="3" fill="#fff"/>
              <rect x="57" y="57" width="9" height="9" rx="2" fill="#fff"/>
              <rect x="72" y="57" width="9" height="9" rx="2" fill="rgba(255,255,255,.7)"/>
              <rect x="83" y="83" width="9" height="9" rx="2" fill="#fff"/>
            </svg>
          </div>
          <div>
            <div style="font-family:'Outfit',sans-serif;font-size:1.1rem;font-weight:800;">
              <span style="color:var(--text1);">QR</span><span style="color:var(--primary);">Prism</span>
            </div>
            <div style="font-size:.74rem;color:var(--text3);">v2.7 · MIT License</div>
          </div>
          <div style="margin-left:auto;">
            <a href="https://github.com/muhtasim-rahman/qr-prism" target="_blank" rel="noopener" class="btn btn-ghost btn-sm">
              <i class="fa-brands fa-github"></i> GitHub
            </a>
          </div>
        </div>
        <p style="font-size:.8rem;color:var(--text2);line-height:1.6;margin-bottom:12px;">
          Advanced QR code generator with 16 types, 18+ patterns, gradients, logos, frames & templates.
          100% client-side — your data never leaves your device.
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;">
          ${['HTML','CSS','JavaScript','qrcode.js','jsQR','JSZip','Pickr'].map(t =>
            `<span class="stack-pill">${t}</span>`).join('')}
        </div>
        <div style="font-size:.78rem;color:var(--text3);">
          Made with <i class="fa-solid fa-heart" style="color:#ef4444;"></i> by
          <a href="https://mdturzo.odoo.com" target="_blank" rel="noopener" style="color:var(--primary);font-weight:600;">Muhtasim Rahman (Turzo)</a>
        </div>
      </div>
    </div>
  </div>

  <!-- Documentation -->
  <div class="settings-section">
    <div class="settings-section-title"><i class="fa-brands fa-github"></i> Documentation</div>
    <div class="stg-row">
      <div class="stg-info"><div class="stg-label">README.md</div><div class="stg-sub">Complete usage guide and API reference</div></div>
      <button class="btn btn-outline btn-sm" onclick="openDocumentation()">
        <i class="fa-solid fa-book-open"></i> Open Docs
      </button>
    </div>
  </div>`;

  // Init accent Pickr
  setTimeout(() => {
    const accentWrap = document.getElementById('accent-pickr-wrap');
    if (accentWrap && typeof Pickr !== 'undefined') {
      try {
        const inst = Pickr.create({
          el: accentWrap, theme: 'nano',
          default: SETTINGS.accentColor || '#818CF8',
          components: { preview: true, opacity: false, hue: true,
            interaction: { hex: true, input: true, save: true, cancel: true }},
          i18n: { 'btn:save': 'Apply', 'btn:cancel': 'Cancel' }
        });
        inst.on('save', color => {
          if (!color) return;
          setSetting('accentColor', color.toHEXA().toString());
          inst.hide();
          renderSettings();
        });
      } catch(e) {
        accentWrap.innerHTML = `<input type="color" value="${SETTINGS.accentColor||'#818CF8'}"
          style="width:34px;height:34px;border:2px solid var(--border);border-radius:9px;cursor:pointer;"
          oninput="setSetting('accentColor',this.value)">`;
      }
    }
  }, 80);
}

// ── Clear data with confirmation ──────────────────────────────
function clearDataConfirm(type) {
  const labels = {
    projects:  { title: 'Clear Projects',  key: 'qrp_projects',  label: 'All saved and auto-saved projects' },
    templates: { title: 'Clear Templates', key: 'qrp_templates', label: 'All saved templates' },
    all:       { title: 'Clear All Data',  key: null,            label: 'All projects, templates, reports, and settings' },
  };
  const info = labels[type];
  if (!info) return;

  showConfirm({
    title:   info.title,
    msg:     `This will permanently delete: ${info.label}. This cannot be undone.`,
    okLabel: 'Delete Forever',
    okClass: 'btn-danger',
    onConfirm: () => {
      if (type === 'all') {
        ['qrp_projects','qrp_templates','qrp_reports','qrp_settings','qrp_profile'].forEach(k =>
          localStorage.removeItem(k)
        );
        // Reset SETTINGS to defaults
        Object.assign(SETTINGS, {
          theme: 'dark', accentColor: '#818CF8', autoSaveProjects: true,
          confirmDelete: true, defaultFormat: 'png', defaultSize: 600,
          defaultEC: 'H', showAnalytics: true, highDPI: true, animateUI: true,
        });
        applyTheme('dark');
      } else {
        localStorage.removeItem(info.key);
      }
      updateProjectCounts();
      renderSettings();
      showToast(info.title + ' complete', 'info');
    }
  });
}

// ── Export all data ───────────────────────────────────────────
function exportAllData() {
  const projects  = JSON.parse(localStorage.getItem('qrp_projects')  || '[]');
  const templates = JSON.parse(localStorage.getItem('qrp_templates') || '[]');
  const profile   = JSON.parse(localStorage.getItem('qrp_profile')   || '{}');
  const data = {
    _type:     'qrp_all',
    _ver:      '2.7',
    _date:     new Date().toISOString(),
    _copy:     '© QR Prism by Muhtasim Rahman (Turzo) — https://mdturzo.odoo.com',
    settings:  SETTINGS,
    profile,
    projects,
    templates,
  };
  exportJSON(data, buildExportFilename('all-data', projects.length + templates.length));
  showToast('All data exported', 'success');
}
