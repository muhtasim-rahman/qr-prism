// =========================================================
// ui.js — UI rendering, pattern grids, logo grid, etc.
// =========================================================

// ── Stock Logos (preset logos with colored SVGs) ─────────
// Each logo has: key, name, brandColor, and a data URL or inline SVG
const PRESET_LOGOS = [
  { key: 'logo-whatsapp',  name: 'WhatsApp',  color: '#25D366', svg: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>` },
  { key: 'logo-telegram',  name: 'Telegram',  color: '#0088CC', svg: `<svg viewBox="0 0 24 24" fill="#0088CC"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>` },
  { key: 'logo-instagram', name: 'Instagram', color: '#E1306C', svg: `<svg viewBox="0 0 24 24"><defs><radialGradient id="ig" cx="30%" cy="107%"><stop offset="0" stop-color="#fdf497"/><stop offset=".05" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#ig)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>` },
  { key: 'logo-facebook',  name: 'Facebook',  color: '#1877F2', svg: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
  { key: 'logo-youtube',   name: 'YouTube',   color: '#FF0000', svg: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>` },
  { key: 'logo-twitter',   name: 'X / Twitter', color: '#000', svg: `<svg viewBox="0 0 24 24" fill="#000000"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  { key: 'logo-linkedin',  name: 'LinkedIn',  color: '#0A66C2', svg: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
  { key: 'logo-github',    name: 'GitHub',    color: '#181717', svg: `<svg viewBox="0 0 24 24" fill="#181717"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>` },
  { key: 'logo-tiktok',    name: 'TikTok',    color: '#000', svg: `<svg viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" fill="#000000"/></svg>` },
  { key: 'logo-spotify',   name: 'Spotify',   color: '#1DB954', svg: `<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>` },
  { key: 'logo-wifi',      name: 'WiFi',      color: '#0056E0', svg: `<svg viewBox="0 0 24 24" fill="#0056E0"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>` },
  { key: 'logo-bitcoin',   name: 'Bitcoin',   color: '#F7931A', svg: `<svg viewBox="0 0 24 24" fill="#F7931A"><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/></svg>` },
];

// ── QR Type brand logo map ────────────────────────────────
const TYPE_LOGO_MAP = {
  whatsapp:  'logo-whatsapp',
  telegram:  'logo-telegram',
  instagram: 'logo-instagram',
  facebook:  'logo-facebook',
  youtube:   'logo-youtube',
  twitter:   'logo-twitter',
  linkedin:  'logo-linkedin',
  wifi:      'logo-wifi',
  bitcoin:   'logo-bitcoin',
};

// ── Switch mode/page ──────────────────────────────────────
function switchMode(mode, callerEl) {
  // Hide all mode views
  document.querySelectorAll('.mode-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('mode-' + mode);
  if (target) target.classList.add('active');

  // Sidebar nav
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  const sideBtn = document.querySelector(`.nav-item[data-mode="${mode}"]`);
  if (sideBtn) sideBtn.classList.add('active');

  // Topnav tab
  document.querySelectorAll('.topnav-tab').forEach(b => b.classList.remove('active'));
  const topBtn = document.querySelector(`.topnav-tab[data-mode="${mode}"]`);
  if (topBtn) topBtn.classList.add('active');

  // Bottom nav
  document.querySelectorAll('.bottomnav-item').forEach(b => b.classList.remove('active'));
  const botBtn = document.querySelector(`.bottomnav-item[data-mode="${mode}"]`);
  if (botBtn) botBtn.classList.add('active');

  // Render page-specific content
  if (mode === 'projects') renderProjects();
  if (mode === 'settings') renderSettings();
  if (mode === 'batch') {/* batch is static */}
}

// ── Render QR Type Tabs ───────────────────────────────────
function renderTypeTabs() {
  const wrap = document.getElementById('type-tabs');
  if (!wrap) return;
  wrap.innerHTML = QR_TYPES.map(t => {
    const logoKey = TYPE_LOGO_MAP[t.key];
    const logo = logoKey ? PRESET_LOGOS.find(l => l.key === logoKey) : null;
    const iconHtml = logo
      ? `<span style="display:inline-block;width:14px;height:14px;vertical-align:middle;">${logo.svg.replace('<svg ', '<svg style="width:14px;height:14px;" ')}</span>`
      : `<i class="fa-solid ${t.icon}"></i>`;
    return `<button class="type-tab ${t.key === S.activeType ? 'active' : ''}"
      data-type="${t.key}" onclick="switchType('${t.key}', this)">
      ${iconHtml}<span>${t.label}</span>
    </button>`;
  }).join('');
}

function switchType(key, el) {
  S.activeType = key;
  document.querySelectorAll('.type-tab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');
  renderTypeTab(key);
  schedRender();

  // Auto-apply brand logo for this type
  const logoKey = TYPE_LOGO_MAP[key];
  if (logoKey && !S.logoKey) {
    // Optionally auto-suggest brand logo
  }
}

function renderTypeTab(key) {
  const fields = document.getElementById('form-fields');
  const title  = document.getElementById('form-title');
  if (!fields) return;
  const type = QR_TYPES.find(t => t.key === key);
  if (title && type) title.textContent = type.title || type.label;
  fields.innerHTML = FORMS[key] || '';
}

// ── Render Pattern Grids ──────────────────────────────────
function renderPatternGrids() {
  renderPatternGrid('design-grid',    PATTERNS,    S.pattern,   'pattern');
  renderPatternGrid('eyeframe-grid',  EYE_FRAMES,  S.eyeFrame,  'eyeFrame');
  renderPatternGrid('eyeinner-grid',  EYE_INNERS,  S.eyeInner,  'eyeInner');
}

function renderPatternGrid(containerId, items, selectedId, stateKey) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Group by group
  const groups = {};
  items.forEach(item => {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  });

  let html = '';
  for (const [groupName, groupItems] of Object.entries(groups)) {
    html += `<div class="pattern-group-label">${groupName}</div>`;
    groupItems.forEach(item => {
      html += `<div class="pattern-item ${item.id === selectedId ? 'selected' : ''}"
        data-id="${item.id}" data-key="${stateKey}"
        onclick="selectPatternItem('${stateKey}','${item.id}',this, '${containerId}')">
        <canvas width="40" height="40" id="pv-${item.id}"></canvas>
        <div class="p-label">${item.label}</div>
      </div>`;
    });
  }
  container.innerHTML = html;

  // Draw previews
  items.forEach(item => {
    const cv = document.getElementById('pv-' + item.id);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const theme = document.documentElement.getAttribute('data-theme');
    const bg = theme === 'light' ? '#FFFFFF' : '#1E1E2A';
    const fg = theme === 'light' ? '#000000' : '#FFFFFF';
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 40, 40);
    if (item.draw) {
      // It's a pattern — draw 9 modules in 3x3
      if (item.draw.toString().includes('s, color')) {
        // dot pattern: draw 3x3
        const cs = 12;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            item.draw(ctx, 2 + c*13, 2 + r*13, cs, fg);
          }
        }
      } else {
        // Frame/inner: draw at full size
        item.draw(ctx, 2, 2, 36, fg);
      }
    }
  });
}

function selectPatternItem(stateKey, id, el, containerId) {
  S[stateKey] = id;
  document.querySelectorAll(`#${containerId} .pattern-item`).forEach(i => i.classList.remove('selected'));
  el.classList.add('selected');
  schedRender();
}

// ── Render Frame Grids ────────────────────────────────────
function renderFrameGrids() {
  renderFrameGrid('frame-label-grid',   FRAMES.filter(f => f.hasText && f.id !== 'frm-none'));
  renderFrameGrid('frame-nolabel-grid', FRAMES.filter(f => !f.hasText));
}

function renderFrameGrid(containerId, frames) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = frames.map(f => `
    <div class="frame-item ${f.id === S.frame ? 'selected' : ''}"
      onclick="selectFrame('${f.id}', this, '${containerId}')">
      <canvas width="64" height="64" id="fv-${f.id}"></canvas>
      <div class="f-label">${f.label}</div>
    </div>
  `).join('');
  frames.forEach(f => {
    const cv = document.getElementById('fv-' + f.id);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const theme = document.documentElement.getAttribute('data-theme');
    ctx.fillStyle = theme === 'light' ? '#f5f5f5' : '#1E1E2A';
    ctx.fillRect(0, 0, 64, 64);
    const previewQrSize = 40;
    const previewQrX = 12, previewQrY = 4;
    // Draw QR placeholder
    ctx.strokeStyle = '#ccc';
    ctx.strokeRect(previewQrX, previewQrY, previewQrSize, previewQrSize);
    if (f.draw && f.id !== 'frm-none') {
      try {
        f.draw(ctx, previewQrX, previewQrY, previewQrSize, {
          color: '#6C63FF',
          label: 'Scan',
          font: 'Poppins',
          textSize: 80,
          labelColor: '#FFFFFF',
        });
      } catch(e) {}
    }
  });
}

function selectFrame(id, el, containerId) {
  S.frame = id;
  document.querySelectorAll(`#${containerId} .frame-item`).forEach(i => i.classList.remove('selected'));
  if (el) el.classList.add('selected');
  schedRender();
}

// ── Render Logo Grid ──────────────────────────────────────
function renderLogoGrid() {
  const grid = document.getElementById('logo-grid');
  if (!grid) return;
  grid.innerHTML = PRESET_LOGOS.map(l => `
    <div class="logo-item ${l.key === S.logoKey ? 'selected' : ''}"
      onclick="selectLogo('${l.key}', this)">
      <div style="width:28px;height:28px;display:flex;align-items:center;justify-content:center;">
        ${l.svg.replace('<svg ', '<svg style="width:28px;height:28px;" ')}
      </div>
      <div class="l-name">${l.name}</div>
    </div>
  `).join('');
}

function selectLogo(key, el) {
  if (S.logoKey === key) {
    // Deselect
    S.logoKey = null;
    S.logoSrc = null;
    document.querySelectorAll('.logo-item').forEach(i => i.classList.remove('selected'));
    updateLogoPreview();
    schedRender();
    return;
  }
  const logo = PRESET_LOGOS.find(l => l.key === key);
  if (!logo) return;
  S.logoKey = key;
  // Convert SVG to data URL
  const blob = new Blob([logo.svg], { type: 'image/svg+xml' });
  const url  = URL.createObjectURL(blob);
  S.logoSrc  = url;
  document.querySelectorAll('.logo-item').forEach(i => i.classList.remove('selected'));
  if (el) el.classList.add('selected');
  updateLogoPreview();
  schedRender();
}

function filterLogos(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.logo-item').forEach(item => {
    const name = item.querySelector('.l-name')?.textContent.toLowerCase() || '';
    item.style.display = name.includes(q) ? '' : 'none';
  });
}

function handleLogoFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('File too large (max 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    S.logoSrc  = e.target.result;
    S.logoKey  = null;
    document.querySelectorAll('.logo-item').forEach(i => i.classList.remove('selected'));
    updateLogoPreview();
    schedRender();
  };
  reader.readAsDataURL(file);
}

function handleLogoDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      S.logoSrc = ev.target.result;
      S.logoKey = null;
      updateLogoPreview();
      schedRender();
    };
    reader.readAsDataURL(file);
  }
  document.getElementById('logo-upload').classList.remove('drag-over');
}

function updateLogoPreview() {
  const area = document.getElementById('logo-prev-area');
  if (!area) return;
  if (S.logoSrc) {
    area.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
        <img src="${S.logoSrc}" class="logo-preview-img" alt="logo">
        <div>
          <div style="font-size:0.82rem;font-weight:600;color:var(--text);">Logo selected</div>
          <button class="btn btn-ghost btn-sm" onclick="clearLogo()" style="margin-top:4px;">
            <i class="fa-solid fa-xmark"></i> Remove
          </button>
        </div>
      </div>`;
  } else {
    area.innerHTML = '';
  }
}

function clearLogo() {
  S.logoSrc = null;
  S.logoKey = null;
  document.querySelectorAll('.logo-item').forEach(i => i.classList.remove('selected'));
  updateLogoPreview();
  schedRender();
}

// ── Color sync functions ──────────────────────────────────
function syncColor(key, val) {
  const keyMap = {
    fg:'fgColor', bg:'bgColor', gc1:'gc1', gc2:'gc2',
    mb:'mbColor', mc:'mcColor', ef:'efColor', ei:'eiColor',
    fc:'frameColor', fc2:'frameColor', flc:'frameLabelColor',
    lpc:'logoPadColor', sc:'shadowColor',
  };
  const sKey = keyMap[key] || key;
  S[sKey] = val;
  const sw = document.getElementById(key + '-sw');
  const hx = document.getElementById(key + '-hex');
  if (sw) sw.style.background = val;
  if (hx) hx.value = val;
  schedRender();
}

function syncHex(key, val) {
  if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
    const cp = document.getElementById(key + '-color');
    if (cp) cp.value = val;
    syncColor(key, val);
  }
}

// ── Misc UI helpers ───────────────────────────────────────
function toggleCard(header) {
  header.classList.toggle('open');
  const body = header.nextElementSibling;
  if (body) body.classList.toggle('hidden');
}

function switchCTab(idx, el) {
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.csub').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const sub = document.getElementById('ctab-' + idx);
  if (sub) sub.classList.add('active');
}

function switchStab(ns, idx, el) {
  const parent = el.closest('.card-body') || el.parentElement.parentElement;
  parent.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.spanel').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(ns + '-' + idx);
  if (panel) panel.classList.add('active');
}

function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

function toggleDark() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  setSetting('theme', next);
}

function adjSize(delta) {
  S.size = Math.max(100, Math.min(2048, (S.size || 600) + delta));
  const el = document.getElementById('qr-size');
  if (el) el.value = S.size;
  schedRender();
}

function setSize(v) {
  S.size = v;
  const el = document.getElementById('qr-size');
  if (el) el.value = v;
  schedRender();
}

function togglePw(id) {
  const el = document.getElementById(id);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}

function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = document.getElementById('f-lat');
    const lng = document.getElementById('f-lng');
    if (lat) lat.value = pos.coords.latitude.toFixed(6);
    if (lng) lng.value = pos.coords.longitude.toFixed(6);
    schedRender();
  }, () => showToast('Could not get location', 'error'));
}

function toggleDLDropdown() {
  document.getElementById('dl-dropdown')?.classList.toggle('open');
}

document.addEventListener('click', e => {
  const dd = document.getElementById('dl-dropdown');
  if (dd && !e.target.closest('.dl-wrap')) dd.classList.remove('open');
  const modals = document.querySelectorAll('.modal-bg.open');
  modals.forEach(m => { if (e.target === m) closeModal(m.id); });
});

// ── Show toast ────────────────────────────────────────────
function showToast(msg, type = 'info', duration = 2800) {
  const container = document.getElementById('toasts');
  if (!container) return;
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  const icons = { success: 'fa-check', error: 'fa-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  el.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-circle-info'}"></i> ${msg}`;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ── Sync all UI controls from state (for undo/redo/templates) ──
function syncAllUI() {
  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const safeCk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  const safeColor = (key, val) => {
    const sw = document.getElementById(key + '-sw');
    const hx = document.getElementById(key + '-hex');
    const cp = document.getElementById(key + '-color');
    if (sw) sw.style.background = val;
    if (hx) hx.value = val;
    if (cp) cp.value = val;
  };
  safe('qr-size', S.size);
  safe('ec-level', S.ec);
  safe('qz-slider', S.qz);
  safeColor('fg', S.fgColor);
  safeColor('bg', S.bgColor);
  safeCk('transparent', S.transparent);
  safeCk('use-grad', S.gradient);
  safeColor('gc1', S.gc1);
  safeColor('gc2', S.gc2);
  safe('grad-type', S.gType);
  safe('grad-angle', S.gAngle);
  safeCk('custom-marker', S.customMarker);
  safeColor('mb', S.mbColor);
  safeColor('mc', S.mcColor);
  safeCk('custom-ef', S.customEF);
  safeColor('ef', S.efColor);
  safeCk('custom-ei', S.customEI);
  safeColor('ei', S.eiColor);
  safe('logo-size', S.logoSize);
  safe('logo-br', S.logoBR);
  safe('logo-pad', S.logoPad);
  safe('frame-label', S.frameLabel);
  safe('frame-font', S.frameFont);
  safe('qr-rotation', S.rotation);
  safeCk('flip-h', S.flipH);
  safeCk('flip-v', S.flipV);
  safe('qr-filter', S.filter);
  safeCk('invert-c', S.invert);
  safeCk('use-shadow', S.shadow);
  safeColor('sc', S.shadowColor);

  // Re-render grids to show selections
  renderPatternGrids();
  updateLogoPreview();
}

// ── Render type tab helper for projects ──────────────────
function renderTypeTab(key) {
  const fields = document.getElementById('form-fields');
  const title  = document.getElementById('form-title');
  if (!fields) return;
  const type = QR_TYPES.find(t => t.key === key);
  if (title && type) title.textContent = type.title || type.label;
  fields.innerHTML = FORMS[key] || '';
}
