// =========================================================
// UI.JS — QR Prism v2.8
// Type tabs, accordion, pattern/eye/frame grids, logo grid,
// color pickers (Pickr), sync, profile page render
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ══════════════════════════════════════════════════════════
// QR TYPE TABS
// ══════════════════════════════════════════════════════════
function renderTypeTabs() {
  const wrap = document.getElementById('type-tabs');
  if (!wrap) return;
  wrap.innerHTML = QR_TYPES.map(t => `
    <button class="type-tab${t.key === S.activeType ? ' active' : ''}" data-type="${t.key}"
            onclick="switchType('${t.key}',this)">
      <i class="${t.icon}"></i>
      <span>${t.label}</span>
    </button>`).join('');
}

function switchType(key, el) {
  const prev = S.activeType;
  S.activeType = key;

  document.querySelectorAll('.type-tab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  renderTypeForm(key);

  // Auto-apply brand logo for social types
  const logoMap = { whatsapp:'whatsapp', telegram:'telegram', instagram:'instagram',
                    facebook:'facebook', youtube:'youtube', twitter:'twitter', bitcoin:'bitcoin' };
  const logoKey = logoMap[key];
  if (logoKey && !S.logoSrc) {
    setLogoByKey(logoKey);
  } else if (!logoKey && logoMap[prev] && S.logoKey === logoMap[prev]) {
    clearLogo();
  }

  schedRender(true);
}

function renderTypeForm(key) {
  const fields = document.getElementById('form-fields');
  const title  = document.getElementById('form-title');
  if (!fields) return;
  const type = QR_TYPES.find(t => t.key === key);
  if (title && type) title.textContent = type.title || type.label;
  fields.innerHTML = FORMS[key] || `<p style="color:var(--text3);font-size:.82rem;">No form for "${key}"</p>`;
}

// ══════════════════════════════════════════════════════════
// ACCORDION
// form-card is independent (never auto-closed by others)
// ══════════════════════════════════════════════════════════
function toggleAccordion(headerBtn) {
  const card = headerBtn.closest('.accordion-card');
  if (!card) return;
  const body   = headerBtn.nextElementSibling;
  if (!body) return;
  const isOpen = !body.classList.contains('collapsed');

  if (isOpen) {
    body.classList.add('collapsed');
    headerBtn.classList.remove('open');
  } else {
    // Close every accordion card EXCEPT form-card
    document.querySelectorAll('.accordion-card').forEach(ac => {
      if (ac === card || ac.id === 'form-card') return;
      const h = ac.querySelector('.card-header');
      const b = ac.querySelector('.card-body');
      if (h && b && !b.classList.contains('collapsed')) {
        b.classList.add('collapsed');
        h.classList.remove('open');
      }
    });
    body.classList.remove('collapsed');
    headerBtn.classList.add('open');
  }
}

// form-card has its own toggle (always visible, never participates in group)
function toggleFormCard(headerBtn) {
  const body = headerBtn.nextElementSibling;
  if (!body) return;
  const open = body.classList.toggle('collapsed');
  headerBtn.classList.toggle('open', !open);
}

// ══════════════════════════════════════════════════════════
// COLOR TABS
// ══════════════════════════════════════════════════════════
function switchCTab(idx, el) {
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.csub').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  const sub = document.getElementById('ctab-' + idx);
  if (sub) sub.classList.add('active');
}

// ══════════════════════════════════════════════════════════
// SUB-TABS (inside accordion sections)
// ══════════════════════════════════════════════════════════
function switchStab(ns, idx, el) {
  const parent = el.closest('.card-body') || el.parentElement?.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.spanel').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(ns + '-' + idx);
  if (panel) panel.classList.add('active');
}

// ══════════════════════════════════════════════════════════
// PATTERN / EYE GRIDS
// ══════════════════════════════════════════════════════════
function renderPatternGrids() {
  renderDesignGrid('design-grid',   PATTERNS,   S.pattern,  'pattern');
  renderDesignGrid('eyeframe-grid', EYE_FRAMES, S.eyeFrame, 'eyeFrame');
  renderDesignGrid('eyeinner-grid', EYE_INNERS, S.eyeInner, 'eyeInner');
}

function renderDesignGrid(containerId, items, selectedId, stateKey) {
  const container = document.getElementById(containerId);
  if (!container || !items) return;

  container.innerHTML = items.map(item => `
    <div class="pattern-item${item.id === selectedId ? ' active' : ''}"
         data-id="${item.id}" title="${escHtml(item.name)}"
         onclick="selectDesignItem('${stateKey}','${item.id}','${containerId}',this)">
      <canvas width="56" height="56" id="pvc-${item.id}" style="display:block;"></canvas>
      <div class="pattern-item-label">${escHtml(item.name)}</div>
    </div>`).join('');

  // Draw SVG previews asynchronously
  requestAnimationFrame(() => drawDesignPreviews(items, stateKey, selectedId));

  // Scroll-fade init
  initScrollFade(container.closest('.pattern-grid-scroll'));
}

function drawDesignPreviews(items, stateKey, selectedId) {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bg     = isDark ? '#1C1A35' : '#F0EEFF';
  const fg     = isDark ? '#C0BDFF' : '#3A3670';

  items.forEach(item => {
    const cv = document.getElementById('pvc-' + item.id);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const s   = cv.width;
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, s, s);

    if (stateKey === 'pattern') {
      // Draw a 4×4 sample grid
      const cell = s / 5;
      const pad  = cell * 0.5;
      ctx.fillStyle = fg;
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if ((r + c) % 2 === 0) {
            try {
              if (item.draw) item.draw(ctx, pad + c * cell, pad + r * cell, cell * 0.90, fg);
            } catch {}
          }
        }
      }
    } else if (stateKey === 'eyeFrame') {
      // Draw the outer eye shape at ~80% canvas size
      const sz  = s * 0.80;
      const off = (s - sz) / 2;
      try {
        if (item.draw) item.draw(ctx, off, off, sz, fg);
      } catch {}
      // Clear inner 5/7 area
      const inner = sz * (5/7);
      const iOff  = off + sz * (1/7);
      ctx.clearRect(iOff, iOff, inner, inner);
      ctx.fillStyle = bg;
      ctx.fillRect(iOff, iOff, inner, inner);
    } else if (stateKey === 'eyeInner') {
      // Draw the inner dot at ~45% canvas size
      const sz  = s * 0.45;
      const off = (s - sz) / 2;
      try {
        if (item.draw) item.draw(ctx, off, off, sz, fg);
      } catch {}
    }
  });
}

function selectDesignItem(stateKey, id, gridId, el) {
  // Update state
  S[stateKey] = id;
  // Update active class
  const grid = document.getElementById(gridId);
  if (grid) grid.querySelectorAll('.pattern-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  schedRender();
}

// ══════════════════════════════════════════════════════════
// FRAME GRIDS
// ══════════════════════════════════════════════════════════
function renderFrameGrids() {
  // Split into with-label and without-label
  const withLabel    = FRAMES.filter(f => f.hasText  && f.id !== 'frm-none');
  const withoutLabel = FRAMES.filter(f => !f.hasText || f.id === 'frm-none');

  renderFrameGrid('frame-label-grid',   withLabel,    S.frame, true);
  renderFrameGrid('frame-nolabel-grid', withoutLabel, S.frame, false);
}

function renderFrameGrid(containerId, items, selectedId, hasLabel) {
  const container = document.getElementById(containerId);
  if (!container || !items) return;

  container.innerHTML = items.map(item => `
    <div class="frame-item${item.id === selectedId ? ' active' : ''}"
         data-id="${item.id}" title="${escHtml(item.name)}"
         onclick="selectFrame('${item.id}',this)">
      <canvas width="72" height="${hasLabel ? 86 : 72}" id="frc-${item.id}" style="display:block;"></canvas>
      <div class="pattern-item-label">${escHtml(item.name)}</div>
    </div>`).join('');

  requestAnimationFrame(() => drawFramePreviews(items, hasLabel));
  initScrollFade(container.closest('.frame-grid') || container);
}

function drawFramePreviews(items, hasLabel) {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bg     = isDark ? '#1C1A35' : '#F0EEFF';
  const fg     = isDark ? '#818CF8' : '#6366F1';
  const dotFg  = isDark ? '#C0BDFF' : '#3A3670';

  items.forEach(item => {
    const cv = document.getElementById('frc-' + item.id);
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = cv.width, H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    if (item.id === 'frm-none') {
      // Show "X" for none
      ctx.strokeStyle = fg;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(W*0.28, H*0.28); ctx.lineTo(W*0.72, H*0.72); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W*0.72, H*0.28); ctx.lineTo(W*0.28, H*0.72); ctx.stroke();
      return;
    }

    // Draw a tiny QR placeholder + frame
    const qrPad = 6;
    const qrSz  = Math.min(W, H) - qrPad * 2 - (hasLabel ? 14 : 0);
    const qrX   = (W - qrSz) / 2;
    const qrY   = hasLabel ? qrPad : (H - qrSz) / 2;

    // Mini QR dots
    const grid = 6;
    const cell = qrSz / grid;
    ctx.fillStyle = dotFg;
    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        if ((r + c + r * c) % 3 !== 0) {
          const x = qrX + c * cell + cell * 0.1;
          const y = qrY + r * cell + cell * 0.1;
          ctx.fillRect(x, y, cell * 0.80, cell * 0.80);
        }
      }
    }

    // Draw frame around it
    try {
      if (item.draw) {
        const pad = { top: qrY, bottom: H - qrY - qrSz, left: qrX, right: W - qrX - qrSz };
        item.draw(ctx, qrX, qrY, qrSz, {
          color: fg, label: 'SCAN', font: 'Outfit',
          textSize: 85, labelColor: '#fff', pad
        });
      }
    } catch {}
  });
}

function selectFrame(id, el) {
  S.frame = id;
  document.querySelectorAll('.frame-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  schedRender();
}

// ══════════════════════════════════════════════════════════
// PRESET TEMPLATES GRID
// ══════════════════════════════════════════════════════════
function renderPresetTemplates() {
  const grid = document.getElementById('preset-tgrid');
  if (!grid || typeof PRESET_TEMPLATES === 'undefined') return;

  grid.innerHTML = PRESET_TEMPLATES.map((t, i) => `
    <div class="template-item" title="${escHtml(t.name)}"
         onclick="applyPresetTemplate(${i})">
      <div class="tmpl-thumb" id="ptthumb-${i}">
        <canvas width="64" height="64" id="ptcv-${i}"></canvas>
      </div>
      <div class="tmpl-label">${escHtml(t.name)}</div>
    </div>`).join('');

  requestAnimationFrame(() => renderTemplateThumbnails(PRESET_TEMPLATES, 'ptcv-'));
  initScrollFade(grid.closest('.template-scroll-area'));
}

function applyPresetTemplate(idx) {
  const t = PRESET_TEMPLATES[idx];
  if (!t) return;
  pushUndo();
  Object.assign(S, t.settings);
  syncAllUI();
  updatePickrColors();
  schedRender(true);
  showToast(`Template "${t.name}" applied`, 'success');
}

// ══════════════════════════════════════════════════════════
// USER TEMPLATES (saved-tlist in generator, tmpl-manage-list)
// ══════════════════════════════════════════════════════════
function renderUserTemplates() {
  const list = document.getElementById('saved-tlist');
  if (!list) return;

  const templates = loadTemplates();
  const badge = document.getElementById('tmpl-badge');

  if (!templates.length) {
    if (badge) badge.style.display = 'none';
    list.innerHTML = '<p style="font-size:.76rem;color:var(--text3);padding:8px 0;">No saved templates yet.</p>';
    return;
  }

  if (badge) { badge.textContent = templates.length; badge.style.display = ''; }

  list.innerHTML = '';
  const grid = document.createElement('div');
  grid.className = 'template-grid';

  templates.forEach((t, i) => {
    const item = document.createElement('div');
    item.className = 'template-item';
    item.title = t.name;
    item.innerHTML = `
      <div class="tmpl-thumb"><canvas width="64" height="64" id="utcv-${i}"></canvas></div>
      <div class="tmpl-label">${escHtml(t.name)}</div>`;
    item.onclick = () => applyUserTemplate(i);
    grid.appendChild(item);
  });

  list.appendChild(grid);
  requestAnimationFrame(() => renderTemplateThumbnails(templates, 'utcv-'));
  initScrollFade(list.closest('.template-scroll-area'));
}

function loadTemplates() {
  try { return JSON.parse(localStorage.getItem('qrp_templates') || '[]'); } catch { return []; }
}

function applyUserTemplate(idx) {
  const templates = loadTemplates();
  const t = templates[idx];
  if (!t) return;
  pushUndo();
  Object.assign(S, t.settings);
  syncAllUI();
  updatePickrColors();
  schedRender(true);
  showToast(`Template "${t.name}" applied`, 'success');
}

// Render QR thumbnails for templates
function renderTemplateThumbnails(templates, idPrefix) {
  templates.forEach((t, i) => {
    const cv = document.getElementById(idPrefix + i);
    if (!cv) return;

    const tmpState = Object.assign({}, S, t.settings || {});
    const data = 'https://qrprism.app';
    try {
      const tmp = document.createElement('div');
      tmp.style.cssText = 'position:fixed;left:-99999px;visibility:hidden;';
      document.body.appendChild(tmp);
      const qr = new QRCode(tmp, { text: data, width: 64, height: 64,
        correctLevel: QRCode.CorrectLevel.M });
      let mods = qr._oQRCode?.modules;
      document.body.removeChild(tmp);

      if (!mods) { drawFallbackThumb(cv); return; }

      const ctx = cv.getContext('2d');
      const sz  = cv.width;
      ctx.clearRect(0, 0, sz, sz);

      // BG
      const bgColor = tmpState.bgMode === 'transparent' ? 'transparent'
        : (tmpState.bgColor || '#fff');
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, sz, sz);
      }

      // Modules
      const count  = mods.length;
      const cell   = sz / count;
      const fgCol  = tmpState.fgColor || '#000';
      ctx.fillStyle = fgCol;
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (mods[r][c]) ctx.fillRect(c * cell, r * cell, cell, cell);
        }
      }
    } catch { drawFallbackThumb(cv); }
  });
}

function drawFallbackThumb(cv) {
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#1C1A35';
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = '#818CF8';
  ctx.font = '10px Outfit';
  ctx.textAlign = 'center';
  ctx.fillText('QR', cv.width / 2, cv.height / 2 + 4);
}

// ══════════════════════════════════════════════════════════
// LOGO GRID
// ══════════════════════════════════════════════════════════
function renderLogoGrid() {
  const grid = document.getElementById('logo-grid');
  if (!grid || typeof LOGOS === 'undefined') return;

  grid.innerHTML = LOGOS.map(logo => `
    <div class="logo-item${S.logoKey === logo.id ? ' active' : ''}"
         title="${escHtml(logo.name)}"
         onclick="setLogoByKey('${logo.id}')">
      ${logo.svg
        ? logo.svg.replace('<svg ', '<svg style="width:32px;height:32px;" ')
        : `<img src="${escHtml(logo.src)}" alt="${escHtml(logo.name)}" loading="lazy">`}
    </div>`).join('');
}

function filterLogos(query) {
  const q = query.toLowerCase().trim();
  const grid = document.getElementById('logo-grid');
  if (!grid) return;
  grid.querySelectorAll('.logo-item').forEach(el => {
    const name = el.title?.toLowerCase() || '';
    el.style.display = (q === '' || name.includes(q)) ? '' : 'none';
  });
}

function setLogoByKey(key) {
  const logo = (typeof LOGOS !== 'undefined') ? LOGOS.find(l => l.id === key) : null;
  if (!logo) return;

  if (logo.svg) {
    // Convert SVG to data URL
    const blob = new Blob([logo.svg], { type: 'image/svg+xml' });
    S.logoSrc = URL.createObjectURL(blob);
  } else if (logo.src) {
    S.logoSrc = logo.src;
  }
  S.logoKey = key;

  updateLogoPreview();
  renderLogoGrid();
  schedRender();
}

function handleLogoFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Max 5MB for logo', 'error'); return; }
  const url = URL.createObjectURL(file);
  S.logoSrc = url;
  S.logoKey = null;
  updateLogoPreview();
  schedRender();
  input.value = '';
}

function handleLogoDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    S.logoSrc = URL.createObjectURL(file);
    S.logoKey = null;
    updateLogoPreview();
    schedRender();
  }
}

function updateLogoPreview() {
  const area = document.getElementById('logo-prev-area');
  if (!area) return;

  if (!S.logoSrc) {
    area.innerHTML = '';
    return;
  }
  area.innerHTML = `
    <div style="position:relative;display:inline-block;">
      <img src="${escHtml(S.logoSrc)}" alt="Logo preview"
           style="width:48px;height:48px;object-fit:contain;border-radius:9px;border:2px solid var(--border);background:#fff;padding:4px;">
      <button onclick="clearLogo()" title="Remove logo"
              style="position:absolute;top:-6px;right:-6px;width:18px;height:18px;border-radius:50%;
                     background:var(--danger);color:#fff;font-size:.60rem;border:none;cursor:pointer;
                     display:flex;align-items:center;justify-content:center;">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <span style="font-size:.76rem;color:var(--text2);margin-left:8px;">Logo active</span>`;
}

function clearLogo() {
  S.logoSrc = null;
  S.logoKey = null;
  renderLogoGrid();
  updateLogoPreview();
  schedRender();
}

// ══════════════════════════════════════════════════════════
// PICKR COLOR PICKERS
// ══════════════════════════════════════════════════════════
const _pickrInstances = {};

function initPickrPickers() {
  const pickers = [
    // Background
    { id: 'bg-pickr-wrap',   key: 'bgColor',         def: '#ffffff' },
    { id: 'bgc1-pickr-wrap', key: 'bgGc1',            def: '#ffffff' },
    { id: 'bgc2-pickr-wrap', key: 'bgGc2',            def: '#f0f0ff' },
    // Foreground
    { id: 'fg-pickr-wrap',   key: 'fgColor',          def: '#000000' },
    { id: 'gc1-pickr-wrap',  key: 'gc1',              def: '#818CF8' },
    { id: 'gc2-pickr-wrap',  key: 'gc2',              def: '#C084FC' },
    // Eye Frame
    { id: 'ef-pickr-wrap',   key: 'efColor',          def: '#000000' },
    { id: 'efc1-pickr-wrap', key: 'efc1',             def: '#818CF8' },
    { id: 'efc2-pickr-wrap', key: 'efc2',             def: '#C084FC' },
    // Eye Inner
    { id: 'ei-pickr-wrap',   key: 'eiColor',          def: '#000000' },
    { id: 'eic1-pickr-wrap', key: 'eic1',             def: '#818CF8' },
    { id: 'eic2-pickr-wrap', key: 'eic2',             def: '#C084FC' },
    // Frame
    { id: 'flc-pickr-wrap',  key: 'frameLabelColor',  def: '#ffffff' },
    { id: 'fc-pickr-wrap',   key: 'frameColor',       def: '#818CF8' },
    { id: 'fc2-pickr-wrap',  key: 'frameColor',       def: '#818CF8' },
    // Logo + Shadow
    { id: 'lpc-pickr-wrap',  key: 'logoPadColor',     def: '#ffffff' },
    { id: 'sc-pickr-wrap',   key: 'shadowColor',      def: 'rgba(0,0,0,0.35)' },
  ];

  pickers.forEach(({ id, key, def }) => {
    const el = document.getElementById(id);
    if (!el || _pickrInstances[id]) return;

    try {
      const inst = Pickr.create({
        el, theme: 'nano',
        default: S[key] || def,
        components: {
          preview: true, opacity: true, hue: true,
          interaction: { hex: true, rgba: false, input: true, save: true, cancel: true }
        },
        i18n: { 'btn:save': 'Apply', 'btn:cancel': 'Cancel' }
      });

      inst.on('save', color => {
        if (!color) { inst.hide(); return; }
        const hex = color.toHEXA().toString();
        S[key] = hex;
        schedRender();
        inst.hide();
      });

      inst.on('cancel', () => inst.hide());

      _pickrInstances[id] = inst;
    } catch {
      // Fallback: native color input
      el.innerHTML = `<input type="color" value="${S[key] || def}"
        style="width:32px;height:32px;border:2px solid var(--border);border-radius:9px;cursor:pointer;padding:2px;background:var(--surface2);"
        oninput="S['${key}']=this.value; schedRender()">`;
    }
  });
}

function updatePickrColors() {
  Object.entries(_pickrInstances).forEach(([id, inst]) => {
    // Derive key from the original picker map
    const el  = document.getElementById(id);
    if (!el) return;
    // We stored key via closure, but need to re-derive. Use data attribute pattern.
    // Simplest: iterate the same pickers array above. Since we can't access closure, skip silently.
    try { inst.setColor(S[inst._qrKey] || '#000000', true); } catch {}
  });
}

// More reliable: sync by key map
function syncPickrByKey(key, value) {
  // Find all Pickr instances bound to this key
  Object.values(_pickrInstances).forEach(inst => {
    try {
      if (inst._qrKey === key) inst.setColor(value, true);
    } catch {}
  });
}

// ══════════════════════════════════════════════════════════
// SYNC ALL UI  (restore UI controls from S after template/undo)
// ══════════════════════════════════════════════════════════
function syncAllUI() {
  // Size
  const sizeEl = document.getElementById('qr-size');
  if (sizeEl) sizeEl.value = S.size;

  // Size chips
  const sizeChips = { 300:'300', 512:'512', 600:'600', 1024:'1K', 2048:'2K' };
  document.querySelectorAll('.size-chips .chip').forEach(c => {
    const v = Object.entries(sizeChips).find(([,label]) => c.textContent === label)?.[0];
    c.classList.toggle('active', v && parseInt(v) === S.size);
  });

  // EC buttons
  document.querySelectorAll('.ec-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.ec === S.ec);
  });
  const ecHint = document.getElementById('ec-hint');
  const ecHints = { L:'Low (7% recovery)', M:'Medium (15% recovery)', Q:'Quartile (25% recovery)', H:'High (30% recovery)' };
  if (ecHint) ecHint.textContent = ecHints[S.ec] || '';

  // QZ slider
  const qzEl = document.getElementById('qz-slider');
  if (qzEl) { qzEl.value = S.qz; }
  const qzVal = document.getElementById('qz-val');
  if (qzVal) qzVal.textContent = (S.qz || 0) + ' mod';

  // Scan opt
  const scanEl = document.getElementById('scan-opt');
  if (scanEl) scanEl.checked = S.scanOpt;

  // Module gap
  const mgEl = document.getElementById('module-gap');
  if (mgEl) { mgEl.value = Math.round((S.moduleGap || 0) * 100); }
  const mgVal = document.getElementById('mg-val');
  if (mgVal) mgVal.textContent = Math.round((S.moduleGap || 0) * 100) + '%';

  // Eye scale
  const esEl = document.getElementById('eye-scale');
  if (esEl) { esEl.value = Math.round((S.eyeScale || 1) * 100); }
  const esVal = document.getElementById('es-val');
  if (esVal) esVal.textContent = Math.round((S.eyeScale || 1) * 100) + '%';

  // BG mode buttons
  document.querySelectorAll('.bg-mode-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.bgmode === (S.bgMode || 'solid')));
  const bgSolid = document.getElementById('bg-solid-opts');
  const bgGrad  = document.getElementById('bg-gradient-opts');
  const bgTrans = document.getElementById('bg-transparent-opts');
  if (bgSolid) bgSolid.style.display       = S.bgMode === 'solid'       ? 'block' : 'none';
  if (bgGrad)  bgGrad.style.display        = S.bgMode === 'gradient'    ? 'block' : 'none';
  if (bgTrans) bgTrans.style.display       = S.bgMode === 'transparent' ? 'block' : 'none';

  // FG gradient
  const fgGradEl = document.getElementById('fg-use-grad');
  if (fgGradEl) fgGradEl.checked = !!S.fgGradient;
  const fgGradOpts = document.getElementById('fg-grad-opts');
  if (fgGradOpts) fgGradOpts.style.display = S.fgGradient ? 'block' : 'none';

  // Gradient type/angle
  const gradTypeEl  = document.getElementById('grad-type');
  const gradAngleEl = document.getElementById('grad-angle');
  const gaVal       = document.getElementById('ga-val');
  if (gradTypeEl)  gradTypeEl.value  = S.gType  || 'linear';
  if (gradAngleEl) gradAngleEl.value = S.gAngle || 45;
  if (gaVal)       gaVal.textContent = (S.gAngle || 45) + '°';

  // BG gradient
  const bgGTypeEl  = document.getElementById('bg-grad-type');
  const bgGAngEl   = document.getElementById('bg-grad-angle');
  const bgaVal     = document.getElementById('bga-val');
  if (bgGTypeEl)  bgGTypeEl.value   = S.bgGType  || 'linear';
  if (bgGAngEl)   bgGAngEl.value    = S.bgGAngle || 135;
  if (bgaVal)     bgaVal.textContent = (S.bgGAngle || 135) + '°';

  // Custom eye colors
  const eyeColEl  = document.getElementById('custom-eye-colors');
  if (eyeColEl) eyeColEl.checked = !!S.customEyeColors;
  const eyeOpts = document.getElementById('eye-color-opts');
  if (eyeOpts) eyeOpts.style.display = S.customEyeColors ? 'block' : 'none';

  // Eye frame gradient
  const efGradEl = document.getElementById('ef-use-grad');
  if (efGradEl) efGradEl.checked = !!S.efGradient;
  const efGradOpts = document.getElementById('ef-grad-opts');
  if (efGradOpts) efGradOpts.style.display = S.efGradient ? 'block' : 'none';

  // Eye inner gradient
  const eiGradEl = document.getElementById('ei-use-grad');
  if (eiGradEl) eiGradEl.checked = !!S.eiGradient;
  const eiGradOpts = document.getElementById('ei-grad-opts');
  if (eiGradOpts) eiGradOpts.style.display = S.eiGradient ? 'block' : 'none';

  // Logo
  const logoSzEl = document.getElementById('logo-size');
  const lsVal    = document.getElementById('ls-val');
  if (logoSzEl) logoSzEl.value = S.logoSize;
  if (lsVal)    lsVal.textContent = S.logoSize + '%';

  const logoBrEl = document.getElementById('logo-br');
  const lbrVal   = document.getElementById('lbr-val');
  if (logoBrEl) logoBrEl.value = S.logoBR;
  if (lbrVal)   lbrVal.textContent = S.logoBR + '%';

  const logoPadEl = document.getElementById('logo-pad');
  const lpVal     = document.getElementById('lp-val');
  if (logoPadEl) logoPadEl.value = S.logoPad;
  if (lpVal)     lpVal.textContent = S.logoPad + 'px';

  const logoRmEl = document.getElementById('logo-rmbg');
  if (logoRmEl) logoRmEl.checked = S.logoRemoveBG;

  // Frame label
  const frameLabelEl = document.getElementById('frame-label');
  if (frameLabelEl) frameLabelEl.value = S.frameLabel || 'Scan Me';

  const frameFontEl = document.getElementById('frame-font');
  if (frameFontEl) frameFontEl.value = S.frameFont || 'Outfit';

  const frameTsEl = document.getElementById('frame-ts');
  const ftsV      = document.getElementById('fts-v');
  if (frameTsEl) frameTsEl.value = S.frameTSize || 100;
  if (ftsV)      ftsV.textContent = (S.frameTSize || 100) + '%';

  const framePadEl = document.getElementById('frame-pad');
  const fpV        = document.getElementById('fp-v');
  if (framePadEl) framePadEl.value = S.framePad || 16;
  if (fpV)        fpV.textContent  = (S.framePad || 16) + 'px';

  const framePad2El = document.getElementById('frame-pad2');
  const fp2V        = document.getElementById('fp2-v');
  if (framePad2El) framePad2El.value = S.framePad2 || 16;
  if (fp2V)        fp2V.textContent  = (S.framePad2 || 16) + 'px';

  // Advanced
  const rotEl = document.getElementById('qr-rotation');
  if (rotEl) rotEl.value = S.rotation || 0;

  const filtEl = document.getElementById('qr-filter');
  if (filtEl) filtEl.value = S.filter || 'none';

  const flipHEl = document.getElementById('flip-h');
  const flipVEl = document.getElementById('flip-v');
  const invertEl = document.getElementById('invert-c');
  if (flipHEl)  flipHEl.checked  = !!S.flipH;
  if (flipVEl)  flipVEl.checked  = !!S.flipV;
  if (invertEl) invertEl.checked = !!S.invert;

  const shadowEl   = document.getElementById('use-shadow');
  const shadowOpts = document.getElementById('shadow-opts');
  if (shadowEl)   shadowEl.checked = !!S.shadow;
  if (shadowOpts) shadowOpts.style.display = S.shadow ? 'block' : 'none';

  const sbEl = document.getElementById('shadow-blur');
  const sbV  = document.getElementById('sb-v');
  if (sbEl) sbEl.value    = S.shadowBlur || 10;
  if (sbV)  sbV.textContent = (S.shadowBlur || 10) + 'px';

  const sxEl = document.getElementById('shadow-x');
  const sxV  = document.getElementById('sx-v');
  if (sxEl) sxEl.value    = S.shadowX || 0;
  if (sxV)  sxV.textContent = (S.shadowX || 0) + 'px';

  const syEl = document.getElementById('shadow-y');
  const syV  = document.getElementById('sy-v');
  if (syEl) syEl.value    = S.shadowY || 4;
  if (syV)  syV.textContent = (S.shadowY || 4) + 'px';

  // Re-render grids to reflect new selections
  renderPatternGrids();
  renderFrameGrids();
  updateLogoPreview();
}

// ══════════════════════════════════════════════════════════
// PROFILE PAGE RENDER  (full redesign)
// ══════════════════════════════════════════════════════════
function renderProfile() {
  const root = document.getElementById('profile-page-root');
  if (!root) return;

  if (!FB_USER) {
    root.innerHTML = `
      <div class="page-area">
        <div class="profile-login-prompt">
          <i class="fa-solid fa-user-lock"></i>
          <h3>Sign in to view your profile</h3>
          <p>Your projects, templates, and settings sync to your account.</p>
          <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="openModal('login-modal')">
              <i class="fa-solid fa-right-to-bracket"></i> Sign In
            </button>
            <button class="btn btn-outline" onclick="switchAuthModal('signup')">
              <i class="fa-solid fa-user-plus"></i> Create Account
            </button>
          </div>
        </div>
      </div>`;
    return;
  }

  const cached = getCachedUserProfile() || {};
  const name   = cached.displayName || FB_USER.displayName || 'User';
  const email  = cached.email       || FB_USER.email || '';
  const bio    = cached.bio         || '';
  const site   = cached.website     || '';
  const photo  = cached.photoURL    || FB_USER.photoURL || null;
  const banner = cached.banner      || null;

  const initial = name[0]?.toUpperCase() || '?';
  const avatarHtml = photo
    ? `<img src="${escHtml(photo)}" alt="avatar" style="width:100%;height:100%;object-fit:cover;">`
    : initial;

  const bannerStyle = banner
    ? `background-image:url('${escHtml(banner)}');background-size:cover;background-position:center;`
    : `background:linear-gradient(135deg,var(--primary-dark),var(--accent));`;

  // Pull projects (last 10)
  let projects = [];
  try { projects = JSON.parse(localStorage.getItem('qrp_projects') || '[]').slice(0, 10); } catch {}

  // Pull templates
  let templates = [];
  try { templates = loadTemplates().slice(0, 10); } catch {}

  // Check PWA install
  const showInstall = !isPWAInstalled();

  root.innerHTML = `
    <div class="page-area profile-page">

      ${showInstall ? `
      <div class="install-banner mb-10">
        <div class="install-banner-icon"><i class="fa-solid fa-mobile-screen"></i></div>
        <div class="install-banner-info">
          <div class="install-banner-title">Install QR Prism App</div>
          <div class="install-banner-sub">Works offline, faster launch</div>
        </div>
        <button class="btn btn-sm" onclick="installPWA()">
          <i class="fa-solid fa-download"></i> Install
        </button>
      </div>` : ''}

      <!-- Banner + Profile Card -->
      <div class="card" style="overflow:hidden;margin-bottom:16px;">
        <div class="profile-banner" style="${bannerStyle}" onclick="openBannerPicker()">
          <div class="profile-banner-overlay">
            <i class="fa-solid fa-camera"></i> Change Banner
          </div>
        </div>
        <div class="profile-card-top">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div class="profile-avatar-area">
              <div class="profile-avatar" onclick="document.getElementById('profile-photo-input').click()">
                ${avatarHtml}
              </div>
            </div>
            <div class="profile-top-actions">
              <button class="icon-btn tooltip-wrap" onclick="openProfileEditModal()">
                <i class="fa-solid fa-pen-to-square"></i>
                <span class="tooltip-pop">Edit Profile</span>
              </button>
              <button class="icon-btn tooltip-wrap" onclick="switchMode('settings')">
                <i class="fa-solid fa-gear"></i>
                <span class="tooltip-pop">Settings</span>
              </button>
            </div>
          </div>
          <div class="profile-name">${escHtml(name)}</div>
          ${email ? `<div class="profile-email"><i class="fa-solid fa-envelope" style="font-size:.70rem;"></i> ${escHtml(email)}</div>` : ''}
          ${bio   ? `<div class="profile-bio">${escHtml(bio)}</div>` : ''}
          ${site  ? `<div class="profile-website"><i class="fa-solid fa-link"></i> <a href="${escHtml(site)}" target="_blank" rel="noopener">${escHtml(site)}</a></div>` : ''}
        </div>
      </div>

      <!-- Projects Section -->
      <div class="card profile-section" style="padding:16px;margin-bottom:14px;">
        <div class="profile-section-header">
          <div class="profile-section-title">
            <i class="fa-solid fa-folder-open" style="color:var(--primary);margin-right:7px;"></i> Projects
          </div>
          <button class="btn btn-ghost btn-xs" onclick="switchMode('projects')">View All →</button>
        </div>
        ${projects.length === 0
          ? '<p style="font-size:.78rem;color:var(--text3);">No saved projects yet.</p>'
          : `<div class="profile-projects-row" id="profile-proj-row">
              ${projects.map((p, i) => `
                <div class="profile-project-card" onclick="loadProjectFromProfile('${escHtml(p.id)}')">
                  <div class="profile-proj-thumb">
                    <canvas width="80" height="80" id="ppthumb-${i}"></canvas>
                  </div>
                  <div class="profile-proj-name">${escHtml(p.title || 'Untitled')}</div>
                </div>`).join('')}
              ${projects.length >= 10 ? `
                <div class="profile-project-card" onclick="switchMode('projects')"
                     style="display:flex;align-items:center;justify-content:center;min-width:80px;">
                  <div style="text-align:center;font-size:.72rem;color:var(--primary);padding:8px;">
                    <i class="fa-solid fa-grid-2"></i><br>View All
                  </div>
                </div>` : ''}
            </div>`}
      </div>

      <!-- Templates Section -->
      <div class="card profile-section" style="padding:16px;margin-bottom:14px;">
        <div class="profile-section-header">
          <div class="profile-section-title">
            <i class="fa-solid fa-bookmark" style="color:var(--primary);margin-right:7px;"></i> My Templates
          </div>
          <button class="btn btn-ghost btn-xs" onclick="switchMode('templates-manage')">View All →</button>
        </div>
        ${templates.length === 0
          ? '<p style="font-size:.78rem;color:var(--text3);">No saved templates yet.</p>'
          : `<div class="profile-projects-row">
              ${templates.map((t, i) => `
                <div class="profile-project-card" onclick="applyUserTemplate(${i})">
                  <div class="profile-proj-thumb">
                    <canvas width="80" height="80" id="ptpthumb-${i}"></canvas>
                  </div>
                  <div class="profile-proj-name">${escHtml(t.name)}</div>
                </div>`).join('')}
            </div>`}
      </div>

      <!-- Reported Issues Section -->
      <div class="card profile-section" style="padding:16px;margin-bottom:14px;">
        <div class="profile-section-header">
          <div class="profile-section-title">
            <i class="fa-solid fa-bug" style="color:var(--primary);margin-right:7px;"></i> Reported Issues
          </div>
          <button class="btn btn-ghost btn-xs" onclick="switchMode('report')">+ New Report</button>
        </div>
        <div id="profile-issues-list">Loading…</div>
      </div>

      <!-- Sign Out -->
      <div style="text-align:center;padding:8px 0 16px;">
        <button class="btn btn-ghost btn-sm" onclick="signOut()" style="color:var(--danger);">
          <i class="fa-solid fa-right-from-bracket"></i> Sign Out
        </button>
      </div>

    </div>`;

  // Lazy render project thumbnails
  requestAnimationFrame(() => {
    renderTemplateThumbnails(projects.map(p => ({ name: p.title, settings: p.settings || {} })), 'ppthumb-');
    renderTemplateThumbnails(templates, 'ptpthumb-');
  });

  // Load user reports
  loadProfileIssues();
}

async function loadProfileIssues() {
  const container = document.getElementById('profile-issues-list');
  if (!container || !FB_USER) {
    if (container) container.innerHTML = '<p style="font-size:.78rem;color:var(--text3);">Sign in to see your reports.</p>';
    return;
  }
  try {
    const reports = await getUserReports(FB_USER.uid);
    const recent  = reports.slice(0, 3);
    if (!recent.length) {
      container.innerHTML = '<p style="font-size:.78rem;color:var(--text3);">No reports submitted yet.</p>';
      return;
    }
    container.innerHTML = recent.map(r => `
      <div class="profile-issue-card">
        <div class="issue-title">${escHtml(r.title || r.description?.slice(0,60) || 'Untitled')}</div>
        <div class="issue-meta">
          <span>${formatDate(r.createdAt)}</span>
          <span class="issue-status ${r.status || 'pending'}">
            <i class="fa-solid fa-circle" style="font-size:.5rem;"></i>
            ${capitalize(r.status || 'pending')}
          </span>
        </div>
      </div>`).join('');
  } catch {
    container.innerHTML = '<p style="font-size:.78rem;color:var(--text3);">Could not load reports.</p>';
  }
}

function openBannerPicker() {
  const grid = document.getElementById('banner-grid');
  if (grid) {
    // Banners: simple gradient backgrounds (no external files needed)
    const banners = [
      { id: 'banner-violet',  style: 'background:linear-gradient(135deg,#1E1B4B,#4F46E5);' },
      { id: 'banner-sunset',  style: 'background:linear-gradient(135deg,#F97316,#EC4899);' },
      { id: 'banner-ocean',   style: 'background:linear-gradient(135deg,#0EA5E9,#6366F1);' },
      { id: 'banner-forest',  style: 'background:linear-gradient(135deg,#064E3B,#15803D);' },
      { id: 'banner-night',   style: 'background:linear-gradient(135deg,#0F172A,#1E293B);' },
      { id: 'banner-rose',    style: 'background:linear-gradient(135deg,#BE185D,#9F1239);' },
      { id: 'banner-gold',    style: 'background:linear-gradient(135deg,#D97706,#92400E);' },
      { id: 'banner-cyber',   style: 'background:linear-gradient(135deg,#0A0A0F,#4ADE80 200%);' },
    ];
    grid.innerHTML = banners.map(b => `
      <div class="banner-item${(getCachedUserProfile()?.banner === b.id) ? ' active' : ''}"
           style="${b.style}" onclick="selectBanner('${b.id}')"></div>`).join('');
  }
  openModal('banner-picker-modal');
}

async function selectBanner(bannerId) {
  if (!FB_USER) return;
  await fbDB.ref(`users/${FB_USER.uid}/profile/banner`).set(bannerId);
  const cached = loadCachedUser() || {};
  cached.banner = bannerId;
  saveCachedUser(cached);
  closeModal('banner-picker-modal');
  renderProfile();
}

function loadProjectFromProfile(id) {
  if (typeof loadProject === 'function') loadProject(id);
  switchMode('gen');
}

// ══════════════════════════════════════════════════════════
// SCROLL FADE HELPER (pattern/frame grid bottom fade)
// ══════════════════════════════════════════════════════════
function initScrollFade(el) {
  if (!el) return;
  const update = () => {
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 4;
    el.classList.toggle('at-bottom', atBottom);
  };
  el.addEventListener('scroll', update, { passive: true });
  update();
}

// ══════════════════════════════════════════════════════════
// SMALL UTILITY FUNCTIONS
// ══════════════════════════════════════════════════════════
function escHtml(s) {
  return !s ? '' : String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
}

function formatDateTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB',{ day:'2-digit',month:'short',year:'numeric' })
    + ' ' + d.toLocaleTimeString('en-GB',{ hour:'2-digit',minute:'2-digit' });
}

function capitalize(s) {
  return s ? s[0].toUpperCase() + s.slice(1) : '';
}

// ══════════════════════════════════════════════════════════
// SIDEBAR COLLAPSE
// ══════════════════════════════════════════════════════════
function toggleSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;
  const collapsed = sb.getAttribute('data-collapsed') === 'true';
  sb.setAttribute('data-collapsed', collapsed ? 'false' : 'true');
  const icon = document.getElementById('sidebar-collapse-icon');
  if (icon) icon.className = collapsed ? 'fa-solid fa-chevron-left' : 'fa-solid fa-chevron-right';
}

// ══════════════════════════════════════════════════════════
// RESIZE HANDLE (drag to resize preview/editor panels)
// ══════════════════════════════════════════════════════════
function initResizeHandle() {
  const handle  = document.getElementById('resize-handle');
  const preview = document.getElementById('preview-panel');
  const editor  = document.getElementById('editor-panel');
  const layout  = document.getElementById('gen-layout');
  if (!handle || !preview || !editor) return;

  const MIN_PREVIEW = 260;
  const MIN_EDITOR  = 280;

  let startX = 0, startW = 0;

  handle.addEventListener('pointerdown', e => {
    startX = e.clientX;
    startW = preview.offsetWidth;
    handle.classList.add('dragging');
    handle.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  handle.addEventListener('pointermove', e => {
    if (!handle.classList.contains('dragging')) return;
    const delta  = e.clientX - startX;
    const total  = layout.offsetWidth;
    const newW   = Math.max(MIN_PREVIEW, Math.min(total - MIN_EDITOR - 12, startW + delta));
    preview.style.width    = newW + 'px';
    preview.style.minWidth = newW + 'px';
    preview.style.maxWidth = newW + 'px';
  });

  handle.addEventListener('pointerup', () => handle.classList.remove('dragging'));
  handle.addEventListener('pointercancel', () => handle.classList.remove('dragging'));
}

// ══════════════════════════════════════════════════════════
// REPORT FORM UI HELPERS
// ══════════════════════════════════════════════════════════
let _reportType   = 'bug';
let _reportFiles  = [];  // File[] objects (not base64 — firebase.js handles compression)

function selectReportType(btn, type) {
  _reportType = type;
  document.querySelectorAll('.rtype-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

function initReportForm() {
  _reportFiles = [];
  renderReportImgGrid();
}

function handleReportImages(input) {
  const files = Array.from(input.files || []);
  const remaining = 5 - _reportFiles.length;
  const toAdd = files.slice(0, remaining);

  if (files.length > remaining) {
    showToast(`Max 5 images allowed`, 'warning');
  }

  toAdd.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    _reportFiles.push(file);
  });
  input.value = '';
  renderReportImgGrid();
}

function renderReportImgGrid() {
  const grid = document.getElementById('report-img-grid');
  if (!grid) return;

  let html = _reportFiles.map((file, i) => {
    const url = URL.createObjectURL(file);
    return `
      <div class="report-img-item">
        <img src="${url}" alt="Screenshot ${i+1}" onload="URL.revokeObjectURL(this.src)">
        <div class="report-img-remove" onclick="removeReportImg(${i})">
          <i class="fa-solid fa-xmark"></i>
        </div>
      </div>`;
  }).join('');

  if (_reportFiles.length < 5) {
    html += `
      <div class="report-img-add" onclick="document.getElementById('report-img-input').click()">
        <i class="fa-solid fa-plus"></i><span>Add image</span>
      </div>`;
  }
  grid.innerHTML = html;
}

function removeReportImg(idx) {
  _reportFiles.splice(idx, 1);
  renderReportImgGrid();
}

async function submitReport() {
  const btn   = document.getElementById('report-submit-btn');
  const name  = document.getElementById('report-name')?.value.trim() || '';
  const email = document.getElementById('report-email')?.value.trim() || '';
  const title = document.getElementById('report-title')?.value.trim() || '';
  const desc  = document.getElementById('report-desc')?.value.trim() || '';

  if (!name)  { showToast('Name is required', 'error'); return; }
  if (!email) { showToast('Email is required', 'error'); return; }
  if (!title) { showToast('Title is required', 'error'); return; }
  if (desc.length < 30) { showToast(`Description too short (${desc.length}/30 chars)`, 'error'); return; }

  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting…'; }

  try {
    const reportId = await submitFullReport(
      { type: _reportType, name, email, title, description: desc },
      _reportFiles
    );
    showToast('Report submitted! Thank you.', 'success', 4000);
    clearReportForm();
  } catch (err) {
    showToast('Submission failed: ' + (err.message || 'Unknown error'), 'error');
  } finally {
    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Report'; }
  }
}

function clearReportForm() {
  ['report-name','report-email','report-title','report-desc'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  _reportFiles = [];
  renderReportImgGrid();
  _reportType = 'bug';
  document.querySelectorAll('.rtype-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
  const hintEl = document.getElementById('report-desc-hint');
  if (hintEl) { hintEl.textContent = '(min 30 characters)'; hintEl.style.color = ''; }
}

// ══════════════════════════════════════════════════════════
// OPEN MODAL HELPERS
// ══════════════════════════════════════════════════════════
function openSaveProjectModal() {
  const el = document.getElementById('save-proj-name');
  if (el) el.value = '';
  openModal('save-project-modal');
}

function openSaveTemplateModal() {
  const el = document.getElementById('save-tmpl-name');
  if (el) el.value = '';
  openModal('save-template-modal');
}

// Project tab state
let _projCategory = 'saved';
function switchProjectTab(cat, el) {
  _projCategory = cat;
  document.querySelectorAll('.projects-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProjects();
}

// Add tag modal
function openAddTagModal(projectId) {
  const input = document.getElementById('add-tag-input');
  if (input) input.value = '';
  const modal = document.getElementById('add-tag-modal');
  if (modal) modal.dataset.projectId = projectId;
  openModal('add-tag-modal');
}

function confirmAddTag() {
  const modal     = document.getElementById('add-tag-modal');
  const projectId = modal?.dataset.projectId;
  const tagVal    = document.getElementById('add-tag-input')?.value.trim();
  if (!tagVal || !projectId) { closeModal('add-tag-modal'); return; }
  try {
    const projects = JSON.parse(localStorage.getItem('qrp_projects') || '[]');
    const p = projects.find(x => x.id === projectId);
    if (p) {
      if (!p.tags) p.tags = [];
      if (!p.tags.includes(tagVal)) p.tags.push(tagVal);
      localStorage.setItem('qrp_projects', JSON.stringify(projects));
      renderProjects();
      showToast('Tag added', 'success');
    }
  } catch {}
  closeModal('add-tag-modal');
}

// Rename project modal
let _renameProjectId = null;
function openRenameModal(id, currentName) {
  _renameProjectId = id;
  const input = document.getElementById('rename-proj-input');
  if (input) input.value = currentName || '';
  openModal('rename-project-modal');
}
function confirmRenameProject() {
  if (!_renameProjectId) return;
  const newName = document.getElementById('rename-proj-input')?.value.trim();
  if (!newName) { showToast('Name cannot be empty', 'error'); return; }
  try {
    const projects = JSON.parse(localStorage.getItem('qrp_projects') || '[]');
    const p = projects.find(x => x.id === _renameProjectId);
    if (p) {
      p.title = newName; p.updatedAt = Date.now();
      localStorage.setItem('qrp_projects', JSON.stringify(projects));
      renderProjects();
      showToast('Renamed!', 'success');
    }
  } catch {}
  closeModal('rename-project-modal');
  _renameProjectId = null;
}
