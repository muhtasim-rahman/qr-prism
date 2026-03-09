// =========================================================
// app.js — QR Prism v2.5
// Main initialization, keyboard shortcuts, PWA banner
// =========================================================

// ── Keyboard Shortcuts ─────────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === 'd') { e.preventDefault(); downloadQR('png'); }
  if (ctrl && e.key === 's') { e.preventDefault(); openSaveTemplateModal(); }
  if (ctrl && e.key === 'c') { e.preventDefault(); copyToClipboard(); }
  if (ctrl && e.key === 'z') { e.preventDefault(); undo(); }
  if (ctrl && e.key === 'y') { e.preventDefault(); redo(); }
  if (e.key === 'd' && !ctrl) toggleDark();
  if (e.key === '?') openModal('kb-modal');
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
    closeBottomSheet();
  }
});

// ── Theme ──────────────────────────────────────────────────
function toggleDark() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  SETTINGS.theme = next;
  saveSettingsData();
  updateThemeIcons(next);
  // Re-render pattern grids for theme-aware previews
  renderPatternGrids();
  renderFrameGrids();
}

function updateThemeIcons(theme) {
  const isDark = theme === 'dark';
  document.querySelectorAll('#sidebar-dark-icon, #topnav-dark-icon, #mobile-dark-icon, #bs-dark-icon')
    .forEach(el => { el.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'; });
}

// ── Bottom Sheet ───────────────────────────────────────────
function openBottomSheet() {
  document.getElementById('bs-overlay').classList.add('open');
  document.getElementById('bottom-sheet').classList.add('open');
}
function closeBottomSheet() {
  document.getElementById('bs-overlay')?.classList.remove('open');
  document.getElementById('bottom-sheet')?.classList.remove('open');
}

// ── Mode Switching ─────────────────────────────────────────
function switchMode(mode) {
  // Scroll all views to top
  document.querySelectorAll('.mode-view').forEach(v => {
    v.classList.remove('active');
    v.scrollTop = 0;
  });
  const target = document.getElementById('mode-' + mode);
  if (target) { target.classList.add('active'); target.scrollTop = 0; }

  // Also scroll main content to top
  const mc = document.getElementById('main-content');
  if (mc) mc.scrollTop = 0;

  // Update nav active states
  document.querySelectorAll('[data-mode]').forEach(el => {
    el.classList.toggle('active', el.dataset.mode === mode);
  });

  // Hide tooltips
  document.querySelectorAll('.tooltip-pop').forEach(t => {
    t.style.opacity = ''; t.style.visibility = '';
  });

  // Page-specific init
  if (mode === 'scan')   { setTimeout(() => { if (typeof startScanner === 'function') startScanner(); }, 300); }
  else                   { if (typeof stopScanner === 'function') stopScanner(); }
  if (mode === 'projects')        { renderProjects(); updateProjectCounts(); }
  if (mode === 'settings')        { renderSettings(); }
  if (mode === 'templates-manage') { renderTemplatesManage(); }
  if (mode === 'profile')         { renderProfile(); }
  if (mode === 'batch')           { renderBatchTemplateList(); }
}

// ── Modals ─────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  setTimeout(() => { const inp = m.querySelector('input:not([type=file]), textarea'); if (inp) inp.focus(); }, 80);
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bg')) e.target.classList.remove('open');
  if (!e.target.closest('.dl-wrap')) document.getElementById('dl-dropdown')?.classList.remove('open');
});

// ── Confirm helper ─────────────────────────────────────────
function showConfirm({ title, msg, okLabel, okClass, items, onConfirm }) {
  const t = document.getElementById('confirm-title');
  const m = document.getElementById('confirm-msg');
  const l = document.getElementById('confirm-list');
  const ok = document.getElementById('confirm-ok-btn');
  if (t) t.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i> ${title || 'Confirm'}`;
  if (m) m.textContent = msg || '';
  if (l) { l.style.display = items?.length ? 'block' : 'none'; if (items?.length) l.innerHTML = items.map(i => `<div>• ${i}</div>`).join(''); }
  if (ok) { ok.textContent = okLabel || 'Confirm'; ok.className = 'btn ' + (okClass || 'btn-danger'); ok.onclick = () => { closeModal('confirm-modal'); onConfirm?.(); }; }
  openModal('confirm-modal');
}

// ── Toast notifications ────────────────────────────────────
function showToast(msg, type = 'info', duration = 2800) {
  const container = document.getElementById('toasts');
  if (!container) return;
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-info-circle'}"></i><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 200); }, duration);
}

// ── PWA Banner ─────────────────────────────────────────────
function renderPWABanner() {
  const container = document.querySelector('#settings-content');
  if (!container) return;

  const installed = isPWAInstalled();
  const banner = document.createElement('div');
  banner.className = 'pwa-banner' + (installed ? ' pwa-installed-banner' : '');
  banner.id = 'pwa-banner';

  if (installed) {
    banner.innerHTML = `
      <div class="pwa-banner-icon"><i class="fa-solid fa-check-circle"></i></div>
      <div class="pwa-banner-content">
        <div class="pwa-banner-title">অ্যাপ সক্রিয় আছে</div>
        <div class="pwa-banner-sub">আপনি অ্যাপ ভার্সন ব্যবহার করছেন।</div>
      </div>
      <div style="font-size:1.5rem;">✅</div>`;
  } else {
    banner.innerHTML = `
      <div class="pwa-banner-icon"><i class="fa-solid fa-download"></i></div>
      <div class="pwa-banner-content">
        <div class="pwa-banner-title">অ্যাপ ইনস্টল করুন</div>
        <div class="pwa-banner-sub">দ্রুত এবং অফলাইনে ব্যবহারের জন্য অ্যাপটি ইনস্টল করুন।</div>
      </div>
      <div class="pwa-banner-btn">
        <button class="btn btn-primary btn-sm" onclick="installPWA()">ইনস্টল</button>
      </div>`;
  }
  return banner;
}

// ── Documentation ──────────────────────────────────────────
async function openDocumentation() {
  openModal('docs-modal');
  const contentEl = document.getElementById('docs-content');
  const tocListEl = document.getElementById('docs-toc-list');
  const tocMobile = document.getElementById('docs-toc-mobile-list');

  if (contentEl && contentEl.dataset.loaded) return; // already loaded

  if (contentEl) contentEl.innerHTML = '<div class="docs-loading"><div class="spin-ring"></div></div>';

  try {
    const res = await fetch('./README.md');
    if (!res.ok) throw new Error('Not found');
    const md = await res.text();

    // Parse with marked
    if (typeof marked !== 'undefined') {
      const html = marked.parse(md);
      if (contentEl) { contentEl.innerHTML = html; contentEl.dataset.loaded = '1'; }
    } else {
      // Fallback: basic markdown render
      if (contentEl) { contentEl.innerHTML = `<pre>${md}</pre>`; contentEl.dataset.loaded = '1'; }
    }

    // Build TOC
    const headers = contentEl ? contentEl.querySelectorAll('h1, h2, h3') : [];
    let tocHtml = '';
    headers.forEach((h, i) => {
      if (!h.id) h.id = 'doc-h-' + i;
      const level = h.tagName.toLowerCase();
      const indent = level === 'h2' ? 'h2' : level === 'h3' ? 'h3' : '';
      tocHtml += `<a class="docs-toc-item ${indent}" onclick="scrollDocTo('${h.id}'); toggleDocsTOC(false)">${h.textContent}</a>`;
    });
    if (tocListEl) tocListEl.innerHTML = tocHtml;
    if (tocMobile) tocMobile.innerHTML = tocHtml;

  } catch (err) {
    if (contentEl) contentEl.innerHTML = `
      <div class="empty-state">
        <i class="fa-brands fa-github"></i>
        <p>Documentation could not be loaded.<br>Visit <a href="https://github.com/muhtasim-rahman/qr-prism" target="_blank">GitHub</a> for full docs.</p>
      </div>`;
  }
}

function scrollDocTo(id) {
  const el = document.getElementById(id);
  const content = document.getElementById('docs-content');
  if (el && content) content.scrollTo({ top: el.offsetTop - 20, behavior: 'smooth' });
}

let docsTOCOpen = false;
function toggleDocsTOC(forceState) {
  const overlay = document.getElementById('docs-toc-overlay');
  if (!overlay) return;
  docsTOCOpen = forceState !== undefined ? forceState : !docsTOCOpen;
  overlay.classList.toggle('open', docsTOCOpen);
}

// ── Share App ──────────────────────────────────────────────
async function shareApp() {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'QR Prism – Advanced QR Code Generator',
        text: 'Free, offline QR code generator with custom patterns, logos and templates.',
        url: 'https://muhtasim-rahman.github.io/qr-prism/'
      });
    } catch {}
  } else {
    try {
      await navigator.clipboard.writeText('https://muhtasim-rahman.github.io/qr-prism/');
      showToast('Link copied!', 'success');
    } catch { showToast('Share not supported', 'info'); }
  }
}

// ── QR Size helpers ────────────────────────────────────────
function adjSize(delta) {
  S.size = Math.max(100, Math.min(2000, (S.size || 600) + delta));
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

// ── Copy to clipboard ──────────────────────────────────────
function copyToClipboard() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') { showToast('Generate a QR code first', 'info'); return; }
  canvas.toBlob(blob => {
    try {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Copy not supported in this browser', 'info'));
    } catch { showToast('Copy not supported', 'info'); }
  });
}

// ── Share QR ───────────────────────────────────────────────
async function shareQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') { showToast('Generate a QR code first', 'info'); return; }
  canvas.toBlob(async blob => {
    const file = new File([blob], 'qrprism.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'QR Code – QR Prism' }); }
      catch {}
    } else {
      downloadQR('png');
    }
  });
}

// ── Autosave status bar ────────────────────────────────────
function setAutosaveStatus(status, text) {
  const bar  = document.getElementById('autosave-bar');
  const txt  = document.getElementById('autosave-txt');
  const dot  = document.getElementById('autosave-dot');
  if (!bar) return;
  bar.className = 'autosave-bar ' + status;
  if (txt) txt.textContent = text;
}

// ── Profile (sidebar avatar sync) ─────────────────────────
function syncProfileUI() {
  try {
    const profile = JSON.parse(localStorage.getItem('qrs_profile') || '{}');
    const name = profile.name || 'Guest User';
    const sub  = profile.web || profile.email || 'Click to set up profile';
    const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';

    const spName = document.getElementById('sp-name');
    const spSub  = document.getElementById('sp-sub');
    const spAv   = document.getElementById('sp-avatar');
    const mAv    = document.getElementById('mobile-avatar-mini');

    if (spName) spName.textContent = name;
    if (spSub)  spSub.textContent  = sub;

    const avatarContent = profile.avatar
      ? `<img src="${profile.avatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
      : initials;

    if (spAv)  spAv.innerHTML  = avatarContent;
    if (mAv)   mAv.innerHTML   = avatarContent;
  } catch (e) {}
}

// ── Report form helpers ────────────────────────────────────
let _reportType = 'bug';
function selectReportType(btn, type) {
  _reportType = type;
  document.querySelectorAll('.rtype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

const _reportImages = [];
function handleReportImages(input) {
  const files = Array.from(input.files);
  const remaining = 8 - _reportImages.length;
  files.slice(0, remaining).forEach(file => {
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} too large (max 5MB)`, 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      _reportImages.push(e.target.result);
      renderReportImages();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderReportImages() {
  const grid = document.getElementById('report-img-grid');
  if (!grid) return;
  let html = _reportImages.map((src, i) => `
    <div class="report-img-thumb">
      <img src="${src}" alt="screenshot">
      <div class="remove-img" onclick="removeReportImage(${i})"><i class="fa-solid fa-xmark"></i></div>
    </div>`).join('');
  if (_reportImages.length < 8) {
    html += `<div class="report-img-add" onclick="document.getElementById('report-img-input').click()">
      <i class="fa-solid fa-plus"></i><span>Add image</span></div>`;
  }
  grid.innerHTML = html;
}

function removeReportImage(idx) {
  _reportImages.splice(idx, 1);
  renderReportImages();
}

function submitReport() {
  const name = document.getElementById('report-name')?.value.trim();
  const email = document.getElementById('report-email')?.value.trim();
  const desc = document.getElementById('report-desc')?.value.trim();
  if (!desc) { showToast('Please describe the issue', 'error'); return; }

  // Simulate submit (no backend) — save to localStorage for reference
  const report = {
    id: Date.now(),
    type: _reportType,
    name, email, desc,
    images: _reportImages.length,
    date: new Date().toISOString(),
    appVersion: 'v2.5',
    ua: navigator.userAgent
  };
  try {
    const prev = JSON.parse(localStorage.getItem('qrs_reports') || '[]');
    prev.push(report);
    localStorage.setItem('qrs_reports', JSON.stringify(prev));
  } catch {}

  showToast('Report submitted! Thank you.', 'success');
  clearReportForm();
}

function clearReportForm() {
  showConfirm({
    title: 'Clear Form',
    msg: 'Are you sure you want to clear all report fields?',
    okLabel: 'Clear',
    okClass: 'btn-danger',
    onConfirm: () => {
      const fields = ['report-name', 'report-email', 'report-desc'];
      fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
      _reportImages.length = 0;
      renderReportImages();
      _reportType = 'bug';
      document.querySelectorAll('.rtype-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    }
  });
}

// ── Project counts & badge ─────────────────────────────────
function updateProjectCounts() {
  try {
    const all = JSON.parse(localStorage.getItem('qrs_projects') || '[]');
    const saved  = all.filter(p => p.type === 'saved').length;
    const auto   = all.filter(p => p.type === 'auto').length;
    const pinned = all.filter(p => p.pinned).length;
    const total  = all.length;

    const setEl = (id, v) => { const e = document.getElementById(id); if (e) e.textContent = v; };
    setEl('saved-count', saved);
    setEl('auto-count', auto);
    setEl('pinned-count', pinned);
    setEl('sidebar-project-count', total);

    const badge = document.getElementById('bn-project-badge');
    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
  } catch {}
}

// ── Scan helpers (used in scanner.js) ─────────────────────
function openScannedURL() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  if (data.startsWith('http')) { window.open(data, '_blank', 'noopener'); }
  else { showToast('Not a URL', 'info'); }
}

function copyScanned() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  navigator.clipboard.writeText(data).then(() => showToast('Copied!', 'success')).catch(() => showToast('Copy failed', 'error'));
}

function loadScannedInGen() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  switchMode('gen');
  setTimeout(() => {
    const urlInput = document.getElementById('f-url');
    const textInput = document.getElementById('f-text');
    if (urlInput && data.startsWith('http')) { urlInput.value = data; }
    else if (textInput) { textInput.value = data; }
    schedRender();
  }, 200);
}

// ── Mobile tooltip handling ────────────────────────────────
document.addEventListener('click', e => {
  // Close mobile tooltips on tap outside
  if (window.innerWidth <= 768) {
    const wrap = e.target.closest('.tooltip-wrap');
    document.querySelectorAll('.tooltip-pop').forEach(tip => {
      const parent = tip.closest('.tooltip-wrap');
      if (parent !== wrap) {
        tip.style.opacity = '0';
        tip.style.visibility = 'hidden';
      }
    });
    if (wrap) {
      const tip = wrap.querySelector('.tooltip-pop');
      if (tip) {
        const isVisible = tip.style.opacity === '1';
        tip.style.opacity = isVisible ? '0' : '1';
        tip.style.visibility = isVisible ? 'hidden' : 'visible';
      }
    }
  }
}, true);

// Prevent tooltips from overflowing on small screens
function fixTooltipPositions() {
  document.querySelectorAll('.tooltip-pop').forEach(tip => {
    const rect = tip.getBoundingClientRect();
    if (rect.right > window.innerWidth - 8) {
      tip.style.left = 'auto';
      tip.style.right = '0';
      tip.style.transform = 'none';
    }
    if (rect.left < 8) {
      tip.style.left = '0';
      tip.style.transform = 'none';
    }
  });
}

// ── Main Initialization ────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Apply theme
  loadSettings();
  updateThemeIcons(document.documentElement.getAttribute('data-theme'));

  // Render UI
  renderTypeTabs();
  renderTypeTab(S.activeType);
  renderPatternGrids();
  renderFrameGrids();
  renderLogoGrid();
  renderPresetTemplates();
  renderUserTemplates();

  // Sync profile UI
  syncProfileUI();

  // Set active mode
  switchMode('gen');

  // Update project counts
  updateProjectCounts();

  // Initialize Pickr color pickers if available
  if (typeof Pickr !== 'undefined') {
    initPickrPickers();
  }

  // PWA events
  document.addEventListener('pwa-installable', () => {
    // Re-render settings if open
    if (document.getElementById('mode-settings')?.classList.contains('active')) {
      renderSettings();
    }
  });
  document.addEventListener('pwa-installed', () => {
    showToast('QR Prism installed successfully!', 'success');
    if (document.getElementById('mode-settings')?.classList.contains('active')) {
      renderSettings();
    }
  });

  // Batch input counter
  const batchInput = document.getElementById('batch-input');
  if (batchInput) {
    batchInput.addEventListener('input', () => {
      const lines = batchInput.value.split('\n').filter(l => l.trim()).length;
      const hint = document.getElementById('batch-count-hint');
      if (hint) hint.textContent = lines + ' item' + (lines !== 1 ? 's' : '');
    });
  }

  console.log('🎉 QR Prism v2.5 initialized');
});

// ── Pickr Integration ──────────────────────────────────────
const _pickrInstances = {};

function initPickrPickers() {
  const pickers = [
    { id: 'fg-pickr-wrap',  stateKey: 'fgColor',         default: '#000000' },
    { id: 'bg-pickr-wrap',  stateKey: 'bgColor',         default: '#ffffff' },
    { id: 'gc1-pickr-wrap', stateKey: 'gc1',             default: '#818CF8' },
    { id: 'gc2-pickr-wrap', stateKey: 'gc2',             default: '#C084FC' },
    { id: 'mb-pickr-wrap',  stateKey: 'mbColor',         default: '#000000' },
    { id: 'mc-pickr-wrap',  stateKey: 'mcColor',         default: '#000000' },
    { id: 'ef-pickr-wrap',  stateKey: 'efColor',         default: '#000000' },
    { id: 'ei-pickr-wrap',  stateKey: 'eiColor',         default: '#000000' },
    { id: 'flc-pickr-wrap', stateKey: 'frameLabelColor', default: '#ffffff' },
    { id: 'fc-pickr-wrap',  stateKey: 'frameColor',      default: '#818CF8' },
    { id: 'fc2-pickr-wrap', stateKey: 'frameColor',      default: '#818CF8' },
    { id: 'lpc-pickr-wrap', stateKey: 'logoPadColor',    default: '#ffffff' },
    { id: 'sc-pickr-wrap',  stateKey: 'shadowColor',     default: '#000000' },
  ];

  pickers.forEach(({ id, stateKey, default: def }) => {
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const instance = Pickr.create({
        el,
        theme: 'nano',
        default: S[stateKey] || def,
        components: {
          preview: true, opacity: false, hue: true,
          interaction: { hex: true, rgba: false, input: true, save: true, cancel: true }
        },
        i18n: { 'btn:save': 'Apply', 'btn:cancel': 'Cancel' }
      });
      instance.on('save', color => {
        if (!color) return;
        const hex = color.toHEXA().toString();
        S[stateKey] = hex;
        schedRender();
        instance.hide();
      });
      _pickrInstances[stateKey] = instance;
    } catch (e) {
      // Fallback to simple color input
      el.innerHTML = `<input type="color" value="${S[stateKey] || def}"
        style="width:36px;height:36px;border:2px solid var(--border);border-radius:9px;cursor:pointer;"
        oninput="S['${stateKey}']=this.value; schedRender()">`;
    }
  });
}

// Update pickr when state changes externally (e.g. template apply)
function updatePickrColors() {
  Object.entries(_pickrInstances).forEach(([key, inst]) => {
    try { inst.setColor(S[key] || '#000000'); } catch {}
  });
}

// ── Undo / Redo ────────────────────────────────────────────
const _undoStack = [];
const _redoStack = [];
const MAX_UNDO = 30;

function pushUndo() {
  _undoStack.push(JSON.stringify(S));
  if (_undoStack.length > MAX_UNDO) _undoStack.shift();
  _redoStack.length = 0;
}

function undo() {
  if (!_undoStack.length) { showToast('Nothing to undo', 'info'); return; }
  _redoStack.push(JSON.stringify(S));
  const prev = JSON.parse(_undoStack.pop());
  Object.assign(S, prev);
  syncAllUI();
  updatePickrColors();
  renderQR();
}

function redo() {
  if (!_redoStack.length) { showToast('Nothing to redo', 'info'); return; }
  _undoStack.push(JSON.stringify(S));
  const next = JSON.parse(_redoStack.pop());
  Object.assign(S, next);
  syncAllUI();
  updatePickrColors();
  renderQR();
}
