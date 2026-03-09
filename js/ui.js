// =========================================================
// ui.js — UI rendering: type tabs, grids, logo, templates
// QR Prism v2.4
// =========================================================

// ── Preset Brand Logos (letter placeholder — user will add real SVGs) ──
const PRESET_LOGOS = [
  { key: 'logo-whatsapp',  name: 'WhatsApp',    letter: 'W', color: '#25D366',
    svg: `<svg viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>` },
  { key: 'logo-telegram',  name: 'Telegram',    letter: 'T', color: '#0088CC',
    svg: `<svg viewBox="0 0 24 24" fill="#0088CC"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>` },
  { key: 'logo-instagram', name: 'Instagram',   letter: 'I', color: '#E1306C',
    svg: `<svg viewBox="0 0 24 24"><defs><radialGradient id="igg" cx="30%" cy="107%"><stop offset="0" stop-color="#fdf497"/><stop offset=".45" stop-color="#fd5949"/><stop offset=".6" stop-color="#d6249f"/><stop offset=".9" stop-color="#285AEB"/></radialGradient></defs><path fill="url(#igg)" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>` },
  { key: 'logo-facebook',  name: 'Facebook',    letter: 'f', color: '#1877F2',
    svg: `<svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>` },
  { key: 'logo-youtube',   name: 'YouTube',     letter: 'Y', color: '#FF0000',
    svg: `<svg viewBox="0 0 24 24" fill="#FF0000"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>` },
  { key: 'logo-twitter',   name: 'X / Twitter', letter: 'X', color: '#000',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>` },
  { key: 'logo-linkedin',  name: 'LinkedIn',    letter: 'in', color: '#0A66C2',
    svg: `<svg viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
  { key: 'logo-github',    name: 'GitHub',      letter: 'G', color: '#181717',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>` },
  { key: 'logo-tiktok',    name: 'TikTok',      letter: 'T', color: '#010101',
    svg: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>` },
  { key: 'logo-spotify',   name: 'Spotify',     letter: 'S', color: '#1DB954',
    svg: `<svg viewBox="0 0 24 24" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>` },
  { key: 'logo-wifi',      name: 'WiFi',        letter: 'W', color: '#0056E0',
    svg: `<svg viewBox="0 0 24 24" fill="#0056E0"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>` },
  { key: 'logo-bitcoin',   name: 'Bitcoin',     letter: '₿', color: '#F7931A',
    svg: `<svg viewBox="0 0 24 24" fill="#F7931A"><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/></svg>` },
];

// ── Type brand logo map ────────────────────────────────────
const TYPE_LOGO_MAP = {
  whatsapp: 'logo-whatsapp', telegram: 'logo-telegram',
  instagram: 'logo-instagram', facebook: 'logo-facebook',
  youtube: 'logo-youtube', twitter: 'logo-twitter',
  linkedin: 'logo-linkedin', wifi: 'logo-wifi', bitcoin: 'logo-bitcoin',
};

// ── Render Type Tabs ──────────────────────────────────────
function renderTypeTabs() {
  const wrap = document.getElementById('type-tabs');
  if (!wrap) return;
  wrap.innerHTML = QR_TYPES.map(t => {
    const logoKey = TYPE_LOGO_MAP[t.key];
    const logo = logoKey ? PRESET_LOGOS.find(l => l.key === logoKey) : null;
    const iconHtml = logo
      ? `<span style="display:inline-flex;width:13px;height:13px;align-items:center;justify-content:center;vertical-align:middle;">${logo.svg.replace('<svg ', '<svg style="width:13px;height:13px;" ')}</span>`
      : `<i class="${t.icon}" style="font-size:0.75rem;"></i>`;
    return `<button class="type-tab ${t.key === S.activeType ? 'active' : ''}"
      data-type="${t.key}" onclick="switchType('${t.key}', this)">
      ${iconHtml}<span>${t.label}</span>
    </button>`;
  }).join('');
}

function switchType(key, el) {
  S.activeType = key;
  document.querySelectorAll('.type-tab').forEach(b => b.classList.remove('active'));
  el?.classList.add('active');
  renderTypeTab(key);
  schedRender();
}

function renderTypeTab(key) {
  const fields = document.getElementById('form-fields');
  const title  = document.getElementById('form-title');
  if (!fields) return;
  const type = QR_TYPES.find(t => t.key === key);
  if (title && type) title.textContent = type.title || type.label;
  fields.innerHTML = FORMS[key] || `<div class="field-label">Enter content</div><input class="input" id="f-generic" oninput="S.inputData=this.value; schedRender();" placeholder="Content…">`;
}

// ── Render Pattern Grids ──────────────────────────────────
function renderPatternGrids() {
  const designGrid    = document.getElementById('design-grid');
  const eyeframeGrid  = document.getElementById('eyeframe-grid');
  const eyeinnerGrid  = document.getElementById('eyeinner-grid');

  if (designGrid && typeof PATTERNS !== 'undefined') {
    designGrid.innerHTML = PATTERNS.map(p => `
      <div class="pat-item ${S.pattern === p.id ? 'active' : ''}"
           title="${p.name}" onclick="selectPattern('pat', '${p.id}', this)">
        <canvas width="48" height="48" id="pat-prev-${p.id}"></canvas>
      </div>`).join('');
    PATTERNS.forEach(p => drawPatternPreview('pat-prev-' + p.id, p));
  }

  if (eyeframeGrid && typeof EYE_FRAMES !== 'undefined') {
    eyeframeGrid.innerHTML = EYE_FRAMES.map(p => `
      <div class="pat-item ${S.eyeFrame === p.id ? 'active' : ''}"
           title="${p.name}" onclick="selectPattern('ef', '${p.id}', this)">
        <canvas width="48" height="48" id="ef-prev-${p.id}"></canvas>
      </div>`).join('');
    EYE_FRAMES.forEach(p => drawEyePreview('ef-prev-' + p.id, p, 'frame'));
  }

  if (eyeinnerGrid && typeof EYE_INNERS !== 'undefined') {
    eyeinnerGrid.innerHTML = EYE_INNERS.map(p => `
      <div class="pat-item ${S.eyeInner === p.id ? 'active' : ''}"
           title="${p.name}" onclick="selectPattern('ei', '${p.id}', this)">
        <canvas width="48" height="48" id="ei-prev-${p.id}"></canvas>
      </div>`).join('');
    EYE_INNERS.forEach(p => drawEyePreview('ei-prev-' + p.id, p, 'inner'));
  }
}

function selectPattern(type, id, el) {
  if (type === 'pat') { S.pattern = id; document.querySelectorAll('#design-grid .pat-item').forEach(i => i.classList.remove('active')); }
  if (type === 'ef')  { S.eyeFrame = id; document.querySelectorAll('#eyeframe-grid .pat-item').forEach(i => i.classList.remove('active')); }
  if (type === 'ei')  { S.eyeInner = id; document.querySelectorAll('#eyeinner-grid .pat-item').forEach(i => i.classList.remove('active')); }
  el.classList.add('active');
  schedRender();
}

function drawPatternPreview(canvasId, pattern) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !pattern?.draw) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 48, 48);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 48, 48);
  try {
    // Draw a 5x5 sample of the pattern
    const cellSize = 8;
    const offset = 4;
    ctx.fillStyle = '#1E1B4B';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        // Simple checkerboard-like preview based on pattern type
        const isOn = (r + c) % 2 === 0 || pattern.id === 'pat-square';
        if (isOn) pattern.draw(ctx, offset + c * cellSize, offset + r * cellSize, cellSize, '#1E1B4B', false);
      }
    }
  } catch(e) {
    ctx.fillStyle = '#818CF8';
    ctx.fillRect(4, 4, 40, 40);
  }
}

function drawEyePreview(canvasId, pattern, type) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 48, 48);
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, 48, 48);
  try {
    if (pattern?.draw) pattern.draw(ctx, 4, 4, 40, '#1E1B4B');
  } catch(e) {
    ctx.fillStyle = '#818CF8';
    ctx.fillRect(6, 6, 36, 36);
  }
}

// ── Render Logo Grid ──────────────────────────────────────
function renderLogoGrid() {
  const grid = document.getElementById('logo-grid');
  if (!grid) return;
  grid.innerHTML = PRESET_LOGOS.map(l => `
    <div class="logo-item ${S.logoKey === l.key ? 'active' : ''}"
         data-key="${l.key}" data-name="${l.name}"
         title="${l.name}" onclick="selectPresetLogo('${l.key}', this)">
      ${l.svg.replace('<svg ', `<svg style="width:22px;height:22px;" `)}
    </div>`).join('');
}

function selectPresetLogo(key, el) {
  const logo = PRESET_LOGOS.find(l => l.key === key);
  if (!logo) return;
  S.logoKey = key;
  const svgData = 'data:image/svg+xml;base64,' + btoa(logo.svg);
  S.logoSrc = svgData;
  updateLogoPreview(svgData);
  document.querySelectorAll('.logo-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  schedRender();
}

// ── Render Frame Grids ────────────────────────────────────
function renderFrameGrids() {
  const labelGrid   = document.getElementById('frame-label-grid');
  const nolabelGrid = document.getElementById('frame-nolabel-grid');
  if (!labelGrid || typeof FRAMES === 'undefined') return;

  const withLabel    = FRAMES.filter(f => f.hasLabel !== false);
  const withoutLabel = FRAMES.filter(f => f.hasLabel === false || f.id === 'frm-none');

  if (labelGrid) {
    labelGrid.innerHTML = withLabel.map(f => `
      <div class="frame-item ${S.frame === f.id ? 'active' : ''}"
           title="${f.name}" onclick="selectFrame('${f.id}', this, 'label')">
        <canvas width="60" height="60" id="frm-prev-${f.id}"></canvas>
      </div>`).join('');
    withLabel.forEach(f => drawFramePreview('frm-prev-' + f.id, f));
  }

  if (nolabelGrid) {
    nolabelGrid.innerHTML = withoutLabel.map(f => `
      <div class="frame-item ${S.frame === f.id ? 'active' : ''}"
           title="${f.name}" onclick="selectFrame('${f.id}', this, 'nolabel')">
        <canvas width="60" height="60" id="frm2-prev-${f.id}"></canvas>
      </div>`).join('');
    withoutLabel.forEach(f => drawFramePreview('frm2-prev-' + f.id, f));
  }
}

function selectFrame(id, el, group) {
  S.frame = id;
  const parentGrid = el.closest('.frame-grid');
  if (parentGrid) parentGrid.querySelectorAll('.frame-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  schedRender();
}

function drawFramePreview(canvasId, frame) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, 60, 60);
  ctx.fillStyle = '#1a1830';
  ctx.fillRect(0, 0, 60, 60);
  try {
    if (frame?.drawPreview) {
      frame.drawPreview(ctx, 0, 0, 60, '#818CF8', 'Scan Me', '#fff', 'Poppins', 100);
    } else if (frame?.id === 'frm-none') {
      ctx.fillStyle = '#2E2B4A';
      ctx.fillRect(4, 4, 52, 52);
      ctx.fillStyle = '#818CF8';
      ctx.font = '9px Poppins';
      ctx.textAlign = 'center';
      ctx.fillText('None', 30, 33);
    } else {
      ctx.fillStyle = '#818CF8';
      ctx.fillRect(0, 0, 60, 8);
      ctx.fillRect(0, 52, 60, 8);
      ctx.fillRect(0, 8, 6, 44);
      ctx.fillRect(54, 8, 6, 44);
      ctx.fillStyle = '#2E2B4A';
      ctx.fillRect(6, 8, 48, 44);
    }
  } catch(e) {}
}

// ── Render Preset Templates ───────────────────────────────
function renderPresetTemplates() {
  const grid = document.getElementById('preset-tgrid');
  if (!grid || typeof PRESET_TEMPLATES === 'undefined') return;

  grid.innerHTML = PRESET_TEMPLATES.map((t, i) => `
    <div class="tmpl-item" title="${t.name}" onclick="applyPresetTemplate(${i})">
      <div class="tmpl-preview">
        <canvas width="64" height="64" id="tprev-${i}"></canvas>
      </div>
      <div class="tmpl-label">${t.name}</div>
    </div>`).join('');

  // Draw previews
  PRESET_TEMPLATES.forEach((t, i) => {
    setTimeout(() => drawTemplatePreview('tprev-' + i, t), i * 20);
  });
}

function applyPresetTemplate(idx) {
  const t = PRESET_TEMPLATES[idx];
  if (!t) return;
  Object.assign(S, t.settings || {});
  syncUIFromState();
  schedRender();
  showToast(`Applied: ${t.name}`, 'success');
}

function drawTemplatePreview(canvasId, template) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  // Use QR engine to render small preview
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    const settings = template.settings || {};
    new QRCode(div, {
      text: 'QRPrism',
      width: 64, height: 64,
      colorDark: settings.fgColor || '#000',
      colorLight: settings.bgColor || '#fff',
      correctLevel: QRCode.CorrectLevel.M
    });
    setTimeout(() => {
      const img = div.querySelector('img') || div.querySelector('canvas');
      if (img) {
        const ctx = canvas.getContext('2d');
        const tmpImg = new Image();
        tmpImg.onload = () => { ctx.drawImage(tmpImg, 0, 0, 64, 64); };
        tmpImg.src = img.src || img.toDataURL?.();
      }
      div.remove();
    }, 50);
  } catch(e) {
    // Fallback: colored block preview
    const ctx = canvas.getContext('2d');
    const t = template.settings || {};
    ctx.fillStyle = t.bgColor || '#fff';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = t.fgColor || '#000';
    // Simple grid mock
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      if ((r+c)%2===0) ctx.fillRect(4+c*9, 4+r*9, 8, 8);
    }
  }
}

// ── Render User Templates (in generator) ─────────────────
function renderUserTemplates() {
  const list = document.getElementById('saved-tlist');
  if (!list) return;
  const templates = loadUserTemplates();
  if (!templates.length) {
    list.innerHTML = '<div class="empty-state" style="padding:20px;"><i class="fa-solid fa-bookmark"></i><p>No saved templates yet.<br>Save a style to reuse it.</p></div>';
    return;
  }
  list.innerHTML = templates.map((t, i) => `
    <div class="saved-tmpl">
      <div class="saved-tmpl-thumb">
        <canvas width="44" height="44" id="stprev-${i}"></canvas>
      </div>
      <div class="saved-tmpl-info">
        <div class="saved-tmpl-name">${escHtml(t.name)}</div>
        <div class="saved-tmpl-date">${formatDate(t.date)}</div>
      </div>
      <div class="saved-tmpl-actions">
        <button class="icon-btn" title="Apply" onclick="applyUserTemplate(${i})">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </button>
        <button class="icon-btn danger" title="Delete" onclick="deleteUserTemplate(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>`).join('');

  templates.forEach((t, i) => drawTemplatePreview('stprev-' + i, t));
}

// ── Render Templates Manage Page ─────────────────────────
function renderTemplatesManage() {
  const list = document.getElementById('tmpl-manage-list');
  if (!list) return;
  const templates = loadUserTemplates();
  if (!templates.length) {
    list.innerHTML = '<div class="empty-state"><i class="fa-solid fa-bookmark"></i><p>No templates saved yet.<br>Go to Generator and save a style.</p></div>';
    return;
  }
  list.innerHTML = templates.map((t, i) => `
    <div class="project-card">
      <div class="project-qr-thumb">
        <canvas width="64" height="64" id="tm-prev-${i}"></canvas>
      </div>
      <div class="project-body">
        <div class="project-top-row">
          <span class="project-name">${escHtml(t.name)}</span>
        </div>
        <div class="project-date">${formatDate(t.date)}</div>
      </div>
      <div style="display:flex;gap:4px;">
        <button class="icon-btn" title="Apply in Generator" onclick="applyUserTemplate(${i}); switchMode('gen');">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </button>
        <button class="icon-btn danger" title="Delete" onclick="deleteUserTemplate(${i})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>`).join('');

  templates.forEach((t, i) => drawTemplatePreview('tm-prev-' + i, t));
}

// ── Scanner view init ──────────────────────────────────────
function initScannerView() {
  // Just ensure the UI shows the empty state if no scanner active
  const video = document.getElementById('scanner-video');
  const overlay = document.getElementById('scan-overlay');
  const emptyScreen = document.getElementById('scan-empty-screen');
  if (!_scannerActive) {
    if (video) video.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
    if (emptyScreen) emptyScreen.style.display = '';
  }
}
