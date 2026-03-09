// =========================================================
// js/ui.js — UI helpers, grids, mode switching, nav
// V2.0 — Responsive sidebar (PC), top nav (tablet), bottom nav (mobile)
// =========================================================

// ── Escape HTML ──────────────────────────────────────────
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── View / Mode switching ────────────────────────────────
function switchView(mode) {
  document.querySelectorAll('.view-panel').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const panel = document.getElementById('view-' + mode);
  if (panel) panel.classList.add('active');
  document.querySelectorAll(`[data-view="${mode}"]`).forEach(el => el.classList.add('active'));

  if (mode === 'projects') renderProjectsView();
  if (mode === 'templates-page') { renderPremiumTemplates(); renderUserTemplates(); }
  if (mode === 'settings') renderSettingsPage();
  if (mode === 'batch') renderBatchView();
  if (mode === 'scan') stopScanner();

  // Close sidebar on mobile after navigation
  if (window.innerWidth < 768) closeSidebar();
}

// ── Sidebar (PC) ─────────────────────────────────────────
let _sidebarCollapsed = false;
function toggleSidebar() {
  _sidebarCollapsed = !_sidebarCollapsed;
  document.getElementById('app-sidebar')?.classList.toggle('collapsed', _sidebarCollapsed);
  document.getElementById('main-content')?.classList.toggle('sidebar-collapsed', _sidebarCollapsed);
  localStorage.setItem('sidebar_collapsed', _sidebarCollapsed ? '1' : '0');
}
function closeSidebar() {
  document.getElementById('app-sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
}
function openSidebar() {
  document.getElementById('app-sidebar')?.classList.add('open');
  document.getElementById('sidebar-overlay')?.classList.add('active');
}

// ── QR Type switching ─────────────────────────────────────
function switchQRType(key, doRender = true) {
  S.activeType = key;
  document.querySelectorAll('.type-chip').forEach(c => c.classList.toggle('active', c.dataset.type === key));
  const t = QR_TYPES.find(t => t.key === key);
  const formTitle = document.getElementById('form-title');
  if (formTitle) formTitle.textContent = t ? t.title : key;
  const ff = document.getElementById('form-fields');
  if (ff) ff.innerHTML = FORMS[key] || '<p style="color:var(--muted);padding:8px;">No form for this type.</p>';

  // Auto-apply logo if type has one and user hasn't set a custom logo
  const autoLogo = QR_TYPE_AUTO_LOGOS[key];
  if (autoLogo && !S.logoSrc) {
    S.logoKey = autoLogo;
    updateLogoGrid();
  }

  if (doRender) schedRender();
}

// ── Build type chips ──────────────────────────────────────
function buildTypeChips() {
  const wrap = document.getElementById('type-tabs');
  if (!wrap) return;
  wrap.innerHTML = QR_TYPES.map(t => `
    <button class="type-chip${S.activeType === t.key ? ' active' : ''}" data-type="${t.key}" onclick="switchQRType('${t.key}')" title="${t.title}">
      <i class="fa-solid ${t.icon}"></i>
      <span>${t.label}</span>
    </button>`).join('');
}

// ── Card accordion ────────────────────────────────────────
function toggleCard(header) {
  const card = header.closest('.card');
  const body = card.querySelector('.card-body');
  const arrow = header.querySelector('.arrow');
  const isOpen = header.classList.contains('open');
  header.classList.toggle('open', !isOpen);
  if (body) body.classList.toggle('hidden', isOpen);
  if (arrow) arrow.style.transform = isOpen ? '' : 'rotate(180deg)';
}

// ── Sub-tabs ──────────────────────────────────────────────
function switchStab(group, idx, el) {
  el.closest('.sub-tabs').querySelectorAll('.stab').forEach((s, i) => s.classList.toggle('active', i === idx));
  document.querySelectorAll(`[id^="${group}-"]`).forEach((p, i) => p.classList.toggle('active', i === idx));
}

// ── Color Tab ─────────────────────────────────────────────
function switchCTab(idx, el) {
  el.closest('.color-tabs').querySelectorAll('.ctab').forEach((c, i) => c.classList.toggle('active', i === idx));
  document.querySelectorAll('.csub').forEach((c, i) => c.classList.toggle('active', i === idx));
}

// ── Color sync ────────────────────────────────────────────
function syncColor(key, val) {
  const map = {
    fg: ['fgColor', 'fg-hex'], bg: ['bgColor', 'bg-hex'],
    gc1: ['gc1', 'gc1-hex'], gc2: ['gc2', 'gc2-hex'],
    mb: ['mbColor', 'mb-hex'], mc: ['mcColor', 'mc-hex'],
    ef: ['efColor', 'ef-hex'], ei: ['eiColor', 'ei-hex'],
    fc: ['frameColor', 'fc-hex'], fc2: ['frameColor', 'fc2-hex'],
    flc: ['frameLabelColor', 'flc-hex'],
    lpc: ['logoPadColor', 'lpc-hex'], sc: ['shadowColor', 'sc-hex'],
  };
  if (!map[key]) return;
  S[map[key][0]] = val;
  const hex = document.getElementById(map[key][1]);
  if (hex) hex.value = val;
  const sw  = document.getElementById(key + '-sw');
  if (sw)  sw.style.background = val;
  if (key === 'fc' || key === 'fc2') S.frameColor = val;
  schedRender();
}

function syncHex(key, val) {
  if (!/^#[0-9a-fA-F]{6}$/.test(val)) return;
  const colorIn = document.getElementById(key + '-color') || document.getElementById(key + 'c-color');
  if (colorIn) { colorIn.value = val; syncColor(key, val); }
}

// ── Design Grids ─────────────────────────────────────────
function buildDesignGrids() {
  // Pattern grid
  const pg = document.getElementById('design-grid');
  if (pg) pg.innerHTML = PATTERN_DESIGNS.map(p => designCard(p.id, p.name, p.svg, S.pattern, 'selectPattern')).join('');

  // Eye frame grid
  const efg = document.getElementById('eyeframe-grid');
  if (efg) efg.innerHTML = EYE_FRAME_DESIGNS.map(p => designCard(p.id, p.name, p.svg, S.eyeFrame, 'selectEyeFrame')).join('');

  // Eye inner grid
  const eig = document.getElementById('eyeinner-grid');
  if (eig) eig.innerHTML = EYE_INNER_DESIGNS.map(p => designCard(p.id, p.name, p.svg, S.eyeInner, 'selectEyeInner')).join('');

  // Frame grids
  const flg = document.getElementById('frame-label-grid');
  if (flg) flg.innerHTML = FRAME_DESIGNS_WITH_LABEL.map(f => frameCard(f, S.frame, true)).join('');
  const fng = document.getElementById('frame-nolabel-grid');
  if (fng) fng.innerHTML = FRAME_DESIGNS_NO_LABEL.map(f => frameCard(f, S.frame, false)).join('');
}

function designCard(id, name, svg, selected, fn) {
  return `<div class="design-card${selected === id ? ' active' : ''}" id="dc-${id}" onclick="${fn}('${id}')" title="${name}">
    <div class="design-preview">${svg || ''}</div>
    <div class="design-label">${name}</div>
  </div>`;
}

function frameCard(f, selected, hasLabel) {
  if (f.id === 'frame-none') {
    return `<div class="design-card${selected === f.id ? ' active' : ''}" id="dc-${f.id}-${hasLabel?'l':'n'}" onclick="selectFrame('${f.id}',${hasLabel})" title="${f.name}">
      <div class="design-preview" style="font-size:20px;display:flex;align-items:center;justify-content:center;">${f.icon}</div>
      <div class="design-label">${f.name}</div>
    </div>`;
  }
  return `<div class="design-card${selected === f.id ? ' active' : ''}" id="dc-${f.id}-${hasLabel?'l':'n'}" onclick="selectFrame('${f.id}',${hasLabel})" title="${f.name}">
    <div class="design-preview frame-svg">${typeof f.icon === 'string' && f.icon.startsWith('<svg') ? f.icon : f.icon}</div>
    <div class="design-label">${f.name}</div>
  </div>`;
}

function selectPattern(id) {
  S.pattern = id;
  document.querySelectorAll('#design-grid .design-card').forEach(c => c.classList.toggle('active', c.id === 'dc-' + id));
  schedRender();
}
function selectEyeFrame(id) {
  S.eyeFrame = id;
  document.querySelectorAll('#eyeframe-grid .design-card').forEach(c => c.classList.toggle('active', c.id === 'dc-' + id));
  schedRender();
}
function selectEyeInner(id) {
  S.eyeInner = id;
  document.querySelectorAll('#eyeinner-grid .design-card').forEach(c => c.classList.toggle('active', c.id === 'dc-' + id));
  schedRender();
}
function selectFrame(id, hasLabel) {
  S.frame = id; S.frameHasLabel = hasLabel;
  document.querySelectorAll('.frame-grid .design-card').forEach(c => c.classList.remove('active'));
  const card = document.getElementById('dc-' + id + '-' + (hasLabel ? 'l' : 'n'));
  if (card) card.classList.add('active');
  schedRender();
}

// ── Logo Grid ─────────────────────────────────────────────
function buildLogoGrid(filter = '') {
  const grid = document.getElementById('logo-grid');
  if (!grid) return;
  const filtered = LOGO_PRESETS.filter(l => l.label.toLowerCase().includes(filter.toLowerCase()));
  grid.innerHTML = filtered.map(l => `
    <div class="logo-card${S.logoKey === l.key ? ' active' : ''}" onclick="selectLogoPreset('${l.key}')" title="${l.label}">
      ${l.svg
        ? `<div class="logo-svg-wrap">${l.svg}</div>`
        : `<div class="logo-svg-wrap" style="color:${l.color};font-size:24px;"><i class="fa-solid fa-xmark"></i></div>`}
      <div class="logo-label">${l.label}</div>
    </div>`).join('');
}

function updateLogoGrid() { buildLogoGrid(); }

function selectLogoPreset(key) {
  S.logoKey = key;
  S.logoSrc = key === 'none' ? null : S.logoSrc; // keep custom if not none
  if (key !== 'none') S.logoSrc = null; // use preset, clear custom
  document.querySelectorAll('.logo-card').forEach(c => c.classList.remove('active'));
  const found = [...document.querySelectorAll('.logo-card')].find(c => c.onclick?.toString().includes(`'${key}'`));
  if (found) found.classList.add('active');
  updateLogoPreview();
  schedRender();
}

function filterLogos(val) { buildLogoGrid(val); }

function updateLogoPreview() {
  const area = document.getElementById('logo-prev-area');
  if (!area) return;
  if (S.logoSrc || (S.logoKey && S.logoKey !== 'none')) {
    const src = S.logoSrc || getLogoDataURL(S.logoKey);
    area.innerHTML = src
      ? `<div class="logo-preview-wrap"><img src="${src}" class="logo-preview-img"><button class="logo-remove-btn" onclick="removeLogo()"><i class="fa-solid fa-xmark"></i></button></div>`
      : '';
  } else {
    area.innerHTML = '';
  }
}

function handleLogoFile(input) {
  const file = input.files[0]; if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('Logo too large (max 5 MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    S.logoSrc = e.target.result; S.logoKey = 'custom';
    updateLogoPreview(); schedRender();
  };
  reader.readAsDataURL(file);
}

function handleLogoDrop(e) {
  e.preventDefault();
  document.getElementById('logo-upload').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) { const fi = document.getElementById('logo-file'); fi.files = e.dataTransfer.files; handleLogoFile(fi); }
}

function removeLogo() {
  S.logoSrc = null; S.logoKey = 'none';
  document.getElementById('logo-file').value = '';
  updateLogoPreview(); buildLogoGrid(); schedRender();
}

// ── Crypto logo auto-update ───────────────────────────────
function updateCryptoLogo() {
  const coin = document.getElementById('f-coin')?.value;
  if (coin === 'bitcoin' || coin === 'ethereum') {
    S.logoKey = coin; S.logoSrc = null;
    updateLogoPreview(); buildLogoGrid();
  }
}

// ── Sync all UI from state ────────────────────────────────
function syncAllUI() {
  const set = (id, val) => { const e = document.getElementById(id); if (e) { if (e.type === 'checkbox') e.checked = !!val; else e.value = val; } };
  const sw  = (id, col) => { const e = document.getElementById(id); if (e) e.style.background = col; };

  set('qr-size', S.size); set('ec-level', S.ec); set('qz-slider', S.qz);
  document.getElementById('qz-val') && (document.getElementById('qz-val').textContent = S.qz + ' mod');
  set('scan-opt', S.scanOpt);

  set('fg-color', S.fgColor); set('fg-hex', S.fgColor); sw('fg-sw', S.fgColor);
  set('bg-color', S.bgColor); set('bg-hex', S.bgColor); sw('bg-sw', S.bgColor);
  set('transparent', S.transparent);
  set('use-grad', S.gradient);
  document.getElementById('grad-opts') && (document.getElementById('grad-opts').style.display = S.gradient ? 'block' : 'none');
  set('gc1', S.gc1); set('gc1-hex', S.gc1); sw('gc1-sw', S.gc1);
  set('gc2', S.gc2); set('gc2-hex', S.gc2); sw('gc2-sw', S.gc2);
  set('grad-type', S.gType); set('grad-angle', S.gAngle);
  document.getElementById('ga-val') && (document.getElementById('ga-val').textContent = S.gAngle + '°');

  set('custom-marker', S.customMarker);
  document.getElementById('marker-opts') && (document.getElementById('marker-opts').style.display = S.customMarker ? 'block' : 'none');
  set('mb-color', S.mbColor); set('mb-hex', S.mbColor); sw('mb-sw', S.mbColor);
  set('mc-color', S.mcColor); set('mc-hex', S.mcColor); sw('mc-sw', S.mcColor);
  set('custom-ef', S.customEF);
  document.getElementById('ef-opts') && (document.getElementById('ef-opts').style.display = S.customEF ? 'block' : 'none');
  set('ef-color', S.efColor); set('ef-hex', S.efColor); sw('ef-sw', S.efColor);
  set('custom-ei', S.customEI);
  document.getElementById('ei-opts') && (document.getElementById('ei-opts').style.display = S.customEI ? 'block' : 'none');
  set('ei-color', S.eiColor); set('ei-hex', S.eiColor); sw('ei-sw', S.eiColor);

  set('logo-rmbg', S.logoRemoveBG); set('logo-size', S.logoSize);
  document.getElementById('ls-val') && (document.getElementById('ls-val').textContent = S.logoSize + '%');
  set('logo-br', S.logoBR);
  document.getElementById('lbr-val') && (document.getElementById('lbr-val').textContent = S.logoBR + '%');
  set('logo-pad', S.logoPad);
  document.getElementById('lp-val') && (document.getElementById('lp-val').textContent = S.logoPad + 'px');
  set('lpc-color', S.logoPadColor); set('lpc-hex', S.logoPadColor); sw('lpc-sw', S.logoPadColor);

  set('frame-label', S.frameLabel); set('frame-font', S.frameFont); set('frame-ts', S.frameTSize);
  document.getElementById('fts-v') && (document.getElementById('fts-v').textContent = S.frameTSize + '%');
  set('flc-color', S.frameLabelColor); set('flc-hex', S.frameLabelColor); sw('flc-sw', S.frameLabelColor);
  set('fc-color', S.frameColor); set('fc-hex', S.frameColor); sw('fc-sw', S.frameColor);
  set('fc2-color', S.frameColor); set('fc2-hex', S.frameColor); sw('fc2-sw', S.frameColor);

  set('qr-rotation', S.rotation); set('qr-filter', S.filter);
  set('flip-h', S.flipH); set('flip-v', S.flipV); set('invert-c', S.invert);
  set('use-shadow', S.shadow);
  document.getElementById('shadow-opts') && (document.getElementById('shadow-opts').style.display = S.shadow ? 'block' : 'none');
  set('sc-color', S.shadowColor); set('sc-hex', S.shadowColor); sw('sc-sw', S.shadowColor);
  set('shadow-blur', S.shadowBlur);
  document.getElementById('sb-v') && (document.getElementById('sb-v').textContent = S.shadowBlur + 'px');

  buildTypeChips();
  buildDesignGrids();
  buildLogoGrid();
  updateLogoPreview();
}

// ── Size helpers ──────────────────────────────────────────
function adjSize(delta) {
  S.size = Math.max(100, Math.min(2000, (S.size || 600) + delta));
  const el = document.getElementById('qr-size'); if (el) el.value = S.size;
  schedRender();
}
function setSize(s) {
  S.size = s; const el = document.getElementById('qr-size'); if (el) el.value = s;
  schedRender();
}

// ── Modals ────────────────────────────────────────────────
function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('active'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('active'); }

// ── Toggle password visibility ────────────────────────────
function togglePw(id) {
  const el = document.getElementById(id); if (!el) return;
  el.type = el.type === 'password' ? 'text' : 'password';
  el.nextElementSibling?.querySelector('i')?.classList.toggle('fa-eye');
  el.nextElementSibling?.querySelector('i')?.classList.toggle('fa-eye-slash');
}

// ── Toast notifications ────────────────────────────────────
function showToast(msg, type = 'info') {
  const container = document.getElementById('toasts'); if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icons = { success: 'fa-check-circle', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${escHtml(msg)}</span>`;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 3000);
}

// ── Dark mode ─────────────────────────────────────────────
function toggleDark() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
  const icon = document.getElementById('dark-icon');
  if (icon) { icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'; }
}

// ── Clipboard ─────────────────────────────────────────────
async function copyToClipboard() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') { showToast('Generate a QR code first', 'warning'); return; }
  try {
    canvas.toBlob(async blob => {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('QR copied to clipboard!', 'success');
    });
  } catch { showToast('Copy not supported in this browser', 'error'); }
}

// ── Share ─────────────────────────────────────────────────
async function shareQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') { showToast('Generate a QR code first', 'warning'); return; }
  if (!navigator.share) { showToast('Share not supported in this browser', 'warning'); return; }
  canvas.toBlob(async blob => {
    const file = new File([blob], 'qr-code.png', { type: 'image/png' });
    try { await navigator.share({ title: 'QR Code', files: [file] }); } catch {}
  });
}

// ── Location helper ───────────────────────────────────────
function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  showToast('Getting location...', 'info');
  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = document.getElementById('f-lat'), lng = document.getElementById('f-lng');
      if (lat) lat.value = pos.coords.latitude.toFixed(6);
      if (lng) lng.value = pos.coords.longitude.toFixed(6);
      schedRender(); showToast('Location set!', 'success');
    },
    () => showToast('Could not get location', 'error')
  );
}

// ── Download dropdown ─────────────────────────────────────
function toggleDLDropdown() {
  const dd = document.getElementById('dl-dropdown');
  if (dd) dd.classList.toggle('open');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.dl-wrap')) {
    document.getElementById('dl-dropdown')?.classList.remove('open');
  }
});

// ── Settings page render ──────────────────────────────────
function renderSettingsPage() {
  const container = document.getElementById('settings-content');
  if (!container) return;
  container.innerHTML = `
    <div class="settings-section">
      <h3 class="settings-h">Appearance</h3>
      <div class="settings-row">
        <div class="settings-row-info"><span>Dark Mode</span><p>Switch between light and dark theme</p></div>
        <label class="toggle"><input type="checkbox" id="st-dark" onchange="toggleDark()" ${document.documentElement.getAttribute('data-theme')==='dark'?'checked':''}><span class="toggle-slider"></span></label>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><span>Default Size</span><p>Default QR output size in pixels</p></div>
        <select class="select" style="width:120px" onchange="S.size=parseInt(this.value)">
          <option value="512" ${S.size===512?'selected':''}>512px</option>
          <option value="600" ${S.size===600?'selected':''}>600px</option>
          <option value="1024" ${S.size===1024?'selected':''}>1024px</option>
          <option value="2048" ${S.size===2048?'selected':''}>2048px</option>
        </select>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><span>Default Error Correction</span><p>Higher = more scannable with logos</p></div>
        <select class="select" style="width:140px" onchange="S.ec=this.value">
          <option value="L" ${S.ec==='L'?'selected':''}>L – Low</option>
          <option value="M" ${S.ec==='M'?'selected':''}>M – Medium</option>
          <option value="Q" ${S.ec==='Q'?'selected':''}>Q – Quartile</option>
          <option value="H" ${S.ec==='H'?'selected':''}>H – Best</option>
        </select>
      </div>
    </div>
    <div class="settings-section">
      <h3 class="settings-h">Data & Storage</h3>
      <div class="settings-row">
        <div class="settings-row-info"><span>Projects</span><p>${getAllProjects().length} QR projects saved</p></div>
        <button class="btn btn-danger btn-sm" onclick="clearAllProjects()"><i class="fa-solid fa-trash"></i> Clear All</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><span>Templates</span><p>${getUserTemplates().length} user templates saved</p></div>
        <button class="btn btn-danger btn-sm" onclick="clearUserTemplates()"><i class="fa-solid fa-trash"></i> Clear All</button>
      </div>
      <div class="settings-row">
        <div class="settings-row-info"><span>Export Settings</span><p>Download your preferences as JSON</p></div>
        <button class="btn btn-outline btn-sm" onclick="exportSettings()"><i class="fa-solid fa-file-export"></i> Export</button>
      </div>
    </div>
    <div class="settings-section">
      <h3 class="settings-h">About QR Studio Pro</h3>
      <div class="about-grid">
        <div class="about-item"><span class="about-label">Version</span><span class="about-val">2.0.0</span></div>
        <div class="about-item"><span class="about-label">Build</span><span class="about-val">2025</span></div>
        <div class="about-item"><span class="about-label">Author</span><span class="about-val">Muhtasim Rahman</span></div>
        <div class="about-item"><span class="about-label">License</span><span class="about-val">MIT</span></div>
      </div>
      <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-outline btn-sm" onclick="openDocsModal()"><i class="fa-solid fa-book"></i> Documentation</button>
        <a class="btn btn-ghost btn-sm" href="https://github.com/muhtasim-rahman" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>
      </div>
    </div>`;
}

function clearUserTemplates() {
  if (!confirm('Delete all your saved templates?')) return;
  localStorage.removeItem(TEMPLATES_KEY);
  renderSettingsPage(); showToast('Templates cleared', 'info');
}

function exportSettings() {
  const data = JSON.stringify({ state: S, templates: getUserTemplates() }, null, 2);
  const a = document.createElement('a'); a.href = 'data:application/json,' + encodeURIComponent(data);
  a.download = 'qrstudio-settings.json'; a.click();
}

// ── Documentation modal ───────────────────────────────────
async function openDocsModal() {
  openModal('docs-modal');
  const content = document.getElementById('docs-content');
  if (!content) return;
  content.innerHTML = '<div class="docs-loading"><div class="spinner"></div> Loading documentation...</div>';
  try {
    const res = await fetch('README.md');
    if (!res.ok) throw new Error('not found');
    const md  = await res.text();
    content.innerHTML = markdownToHtml(md);
  } catch {
    content.innerHTML = `<div class="docs-error">
      <p>Could not load README.md from local files.</p>
      <a href="https://github.com/muhtasim-rahman/UFMT-SSC26" target="_blank" class="btn btn-outline">
        <i class="fa-brands fa-github"></i> View on GitHub
      </a>
    </div>`;
  }
}

// ── Minimal Markdown → HTML ────────────────────────────────
function markdownToHtml(md) {
  return md
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/^#{6}\s(.+)$/gm,'<h6>$1</h6>')
    .replace(/^#{5}\s(.+)$/gm,'<h5>$1</h5>')
    .replace(/^#{4}\s(.+)$/gm,'<h4>$1</h4>')
    .replace(/^###\s(.+)$/gm,'<h3>$1</h3>')
    .replace(/^##\s(.+)$/gm,'<h2>$1</h2>')
    .replace(/^#\s(.+)$/gm,'<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/```[\s\S]*?```/g, m => `<pre><code>${m.slice(3,-3)}</code></pre>`)
    .replace(/^\-\s(.+)$/gm,'<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs,'<ul>$1</ul>')
    .replace(/^\d+\.\s(.+)$/gm,'<li>$1</li>')
    .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank">$1</a>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/^(?!<[hupola])/gm, '<p>')
    .replace(/(?<![>])$/gm, '</p>');
}

// ── Batch view placeholder ────────────────────────────────
function renderBatchView() { /* handled by batch.js */ }

// ── Tip tooltips ──────────────────────────────────────────
document.addEventListener('mouseover', e => {
  const tip = e.target.closest('[data-tip]');
  if (!tip) return;
  let tooltip = document.getElementById('active-tooltip');
  if (!tooltip) { tooltip = document.createElement('div'); tooltip.id = 'active-tooltip'; tooltip.className = 'tooltip-popup'; document.body.appendChild(tooltip); }
  tooltip.textContent = tip.dataset.tip;
  tooltip.style.display = 'block';
  const r = tip.getBoundingClientRect();
  tooltip.style.left = r.left + 'px';
  tooltip.style.top  = (r.top - tooltip.offsetHeight - 6 + window.scrollY) + 'px';
});
document.addEventListener('mouseout', e => {
  if (!e.target.closest('[data-tip]')) { const t = document.getElementById('active-tooltip'); if (t) t.style.display = 'none'; }
});
