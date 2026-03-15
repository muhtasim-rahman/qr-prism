// =========================================================
// APP.JS — QR Prism v2.8
// Boot sequence, mode switching, modals, toasts,
// keyboard shortcuts, theme toggle, confirm dialog
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ══════════════════════════════════════════════════════════
// KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  const ctrl = e.ctrlKey || e.metaKey;

  if (ctrl) {
    switch (e.key) {
      case 'd': e.preventDefault(); downloadQR('png');           return;
      case 's': e.preventDefault(); openSaveTemplateModal();     return;
      case 'c': e.preventDefault(); copyToClipboard();           return;
      case 'z': e.preventDefault(); undoQR();                    return;
      case 'y': e.preventDefault(); redoQR();                    return;
    }
  } else {
    switch (e.key) {
      case 'd': toggleDark();          return;
      case '?': openModal('kb-modal'); return;
      case '1': switchMode('gen');       return;
      case '2': switchMode('projects');  return;
      case '3': switchMode('scan');      return;
      case '4': switchMode('batch');     return;
      case '5': switchMode('settings');  return;
      case 'Escape':
        // Close topmost open modal first
        const modals = [...document.querySelectorAll('.modal-bg.open')];
        if (modals.length) { closeModal(modals[modals.length - 1].id); return; }
        closeBottomSheet();
        closeAllDropdowns();
        return;
    }
  }
});

// ══════════════════════════════════════════════════════════
// THEME TOGGLE
// ══════════════════════════════════════════════════════════
function toggleDark() {
  const cur = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  SETTINGS.theme = next;
  applyTheme(next);
  saveSettingsData();
  updateThemeIcons(next);
  // Re-render pattern/frame grids with new color scheme
  renderPatternGrids();
  renderFrameGrids();
}

function updateThemeIcons(theme) {
  const iconClass = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  const labelText = theme === 'light' ? 'Light Mode' : 'Dark Mode';
  ['sidebar-dark-icon','topnav-dark-icon','mobile-dark-icon','bs-dark-icon']
    .forEach(id => { const el = document.getElementById(id); if (el) el.className = iconClass; });
  const bsLabel = document.getElementById('bs-theme-label');
  if (bsLabel) bsLabel.textContent = labelText;
}

// ══════════════════════════════════════════════════════════
// BOTTOM SHEET
// ══════════════════════════════════════════════════════════
function openBottomSheet() {
  document.getElementById('bs-overlay')?.classList.add('open');
  document.getElementById('bottom-sheet')?.classList.add('open');
  document.body.classList.add('modal-open');
}

function closeBottomSheet() {
  document.getElementById('bs-overlay')?.classList.remove('open');
  document.getElementById('bottom-sheet')?.classList.remove('open');
  document.body.classList.remove('modal-open');
}

// ══════════════════════════════════════════════════════════
// MODE SWITCHING
// ══════════════════════════════════════════════════════════
let _currentMode = 'gen';

function switchMode(mode) {
  // Stop scanner if leaving scan mode
  if (_currentMode === 'scan' && mode !== 'scan') {
    if (typeof stopScanner === 'function') stopScanner();
  }
  _currentMode = mode;

  // Hide all mode views, show target
  document.querySelectorAll('.mode-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('mode-' + mode);
  if (target) target.classList.add('active');

  // Scroll to top
  document.getElementById('main-content')?.scrollTo(0, 0);
  window.scrollTo(0, 0);

  // Update all nav indicators
  document.querySelectorAll('[data-mode]').forEach(el => {
    el.classList.toggle('active', el.dataset.mode === mode);
  });

  // Close overlays
  closeBottomSheet();
  closeAllDropdowns();

  // Mode-specific init
  switch (mode) {
    case 'gen':              schedRender(true);                          break;
    case 'scan':             setTimeout(() => { if (typeof initScannerPage === 'function') initScannerPage(); }, 200); break;
    case 'projects':         renderProjects(); updateProjectCounts();    break;
    case 'settings':         renderSettings();                           break;
    case 'templates-manage': renderTemplatesManage();                    break;
    case 'profile':          renderProfile();                            break;
    case 'batch':            renderBatchTemplateList();                  break;
    case 'report':           initReportForm();                           break;
  }
}

// ══════════════════════════════════════════════════════════
// MODALS
// ══════════════════════════════════════════════════════════
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  document.body.classList.add('modal-open');
  // Auto-focus first input
  setTimeout(() => {
    const inp = m.querySelector('input:not([type=file]):not([type=checkbox]),textarea');
    if (inp) inp.focus();
  }, 80);
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.remove('open');
  // Remove body lock only if no other modals are open
  if (!document.querySelector('.modal-bg.open')) {
    document.body.classList.remove('modal-open');
  }
}

// Close modal on background click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bg')) {
    closeModal(e.target.id);
  }
});

// ══════════════════════════════════════════════════════════
// DROPDOWNS
// ══════════════════════════════════════════════════════════
function closeAllDropdowns() {
  document.getElementById('dl-dropdown')?.classList.remove('open');
  document.querySelectorAll('.dot-menu-dropdown').forEach(d => d.classList.remove('open'));
}

function closeAllTooltips() {
  // Tooltips auto-hide on hover-out — nothing to close here
}

// ══════════════════════════════════════════════════════════
// TOAST NOTIFICATIONS  (max 3 at a time)
// ══════════════════════════════════════════════════════════
const TOAST_ICONS = {
  success: 'fa-solid fa-circle-check',
  error:   'fa-solid fa-circle-xmark',
  warning: 'fa-solid fa-triangle-exclamation',
  info:    'fa-solid fa-circle-info',
};
const MAX_TOASTS = 3;
let _toastQueue = [];

function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toasts');
  if (!container) return;

  // If at max, remove oldest
  const existing = container.querySelectorAll('.toast');
  if (existing.length >= MAX_TOASTS) {
    const oldest = existing[0];
    oldest.classList.add('hiding');
    setTimeout(() => oldest.remove(), 250);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('data-type', type);
  toast.innerHTML = `
    <i class="${TOAST_ICONS[type] || TOAST_ICONS.info} toast-icon"></i>
    <span class="toast-msg">${escHtml(msg)}</span>`;

  container.appendChild(toast);

  // Auto-dismiss
  const timer = setTimeout(() => dismissToast(toast), duration);
  toast.addEventListener('click', () => { clearTimeout(timer); dismissToast(toast); });
}

function dismissToast(toast) {
  if (!toast.isConnected) return;
  toast.classList.add('hiding');
  setTimeout(() => { if (toast.isConnected) toast.remove(); }, 280);
}

// ══════════════════════════════════════════════════════════
// CONFIRM DIALOG (reusable)
// ══════════════════════════════════════════════════════════
function showConfirm({ title, msg, okLabel = 'Confirm', okClass = 'btn-danger', onConfirm, items = [] }) {
  const titleEl   = document.getElementById('confirm-title');
  const msgEl     = document.getElementById('confirm-msg');
  const listEl    = document.getElementById('confirm-list');
  const okBtn     = document.getElementById('confirm-ok-btn');

  if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i> ${escHtml(title)}`;
  if (msgEl)   msgEl.textContent = msg || '';

  if (listEl) {
    if (items.length) {
      listEl.innerHTML = items.map(i => `<div style="padding:2px 0;">${escHtml(i)}</div>`).join('');
      listEl.style.display = 'block';
    } else {
      listEl.style.display = 'none';
    }
  }

  if (okBtn) {
    okBtn.className = `btn ${okClass}`;
    okBtn.innerHTML = `<i class="fa-solid fa-check"></i> ${escHtml(okLabel)}`;
    okBtn.onclick   = () => { closeModal('confirm-modal'); onConfirm?.(); };
  }

  openModal('confirm-modal');
}

// ══════════════════════════════════════════════════════════
// UPDATE PROJECT COUNTS (badges in nav)
// ══════════════════════════════════════════════════════════
function updateProjectCounts() {
  let total = 0;
  try {
    total = JSON.parse(localStorage.getItem('qrp_projects') || '[]').length;
  } catch {}

  const badge = document.getElementById('sidebar-project-count');
  const bnBadge = document.getElementById('bn-project-badge');

  if (badge) {
    badge.textContent = total;
    badge.style.display = total > 0 ? '' : 'none';
  }
  if (bnBadge) {
    bnBadge.textContent = total;
    bnBadge.style.display = total > 0 ? '' : 'none';
  }
}

// ══════════════════════════════════════════════════════════
// BATCH COUNT UPDATE
// ══════════════════════════════════════════════════════════
function updateBatchCount() {
  const input = document.getElementById('batch-input');
  const hint  = document.getElementById('batch-count-hint');
  if (!input || !hint) return;
  const lines = input.value.split('\n').filter(l => l.trim()).length;
  hint.textContent = `${lines} item${lines !== 1 ? 's' : ''}`;
}

function clearBatchInput() {
  const input = document.getElementById('batch-input');
  if (input) { input.value = ''; updateBatchCount(); }
}

function adjBatchSize(delta) {
  const el = document.getElementById('batch-size');
  if (!el) return;
  el.value = Math.max(100, Math.min(2000, parseInt(el.value || 600) + delta));
}

// ══════════════════════════════════════════════════════════
// SCAN PAGE HELPERS
// ══════════════════════════════════════════════════════════
function openScannedURL() {
  const data = document.getElementById('scan-data')?.textContent?.trim();
  if (!data) return;
  if (data.startsWith('http')) window.open(data, '_blank', 'noopener');
  else showToast('Not a URL', 'info');
}

function copyScanned() {
  const data = document.getElementById('scan-data')?.textContent?.trim();
  if (!data) return;
  navigator.clipboard.writeText(data)
    .then(() => showToast('Copied!', 'success'))
    .catch(() => showToast('Copy failed', 'error'));
}

function loadScannedInGen() {
  const data = document.getElementById('scan-data')?.textContent?.trim();
  if (!data) return;
  switchMode('gen');
  setTimeout(() => {
    // Try to auto-detect type
    if (data.startsWith('http')) {
      switchType('url', document.querySelector('[data-type="url"]'));
      const el = document.getElementById('f-url');
      if (el) { el.value = data; }
    } else if (data.startsWith('mailto:')) {
      switchType('email', document.querySelector('[data-type="email"]'));
    } else if (data.startsWith('tel:')) {
      switchType('phone', document.querySelector('[data-type="phone"]'));
    } else if (data.startsWith('WIFI:')) {
      switchType('wifi', document.querySelector('[data-type="wifi"]'));
    } else {
      switchType('text', document.querySelector('[data-type="text"]'));
      const el = document.getElementById('f-text');
      if (el) { el.value = data; }
    }
    schedRender(true);
  }, 200);
}

function resetScanner() {
  document.getElementById('scan-result').style.display = 'none';
  if (typeof stopScanner === 'function') stopScanner();
}

// ══════════════════════════════════════════════════════════
// BATCH CSV IMPORT
// ══════════════════════════════════════════════════════════
function importBatchCSV(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const lines = e.target.result.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 200);
    const batchInput = document.getElementById('batch-input');
    if (batchInput) { batchInput.value = lines.join('\n'); updateBatchCount(); }
    showToast(`Imported ${lines.length} items`, 'success');
  };
  reader.readAsText(file);
  input.value = '';
}

// ══════════════════════════════════════════════════════════
// BOOT SEQUENCE
// ══════════════════════════════════════════════════════════
window.addEventListener('DOMContentLoaded', () => {

  // 1. Apply settings (theme, accent)
  loadSettings();
  updateThemeIcons(document.documentElement.getAttribute('data-theme') || 'dark');

  // 2. Apply defaults from SETTINGS to S
  S.size = SETTINGS.defaultSize || 600;
  S.ec   = SETTINGS.defaultEC   || 'H';

  // 3. Render static UI elements
  renderTypeTabs();
  renderTypeForm(S.activeType);
  renderPatternGrids();
  renderFrameGrids();
  renderLogoGrid();
  renderPresetTemplates();
  renderUserTemplates();

  // 4. Sync inputs from S
  const sizeEl = document.getElementById('qr-size');
  if (sizeEl) sizeEl.value = S.size;

  // Sync EC chips
  document.querySelectorAll('.ec-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.ec === S.ec);
  });
  const ecHintEl = document.getElementById('ec-hint');
  const ecHints  = { L:'Low (7% recovery)', M:'Medium (15% recovery)', Q:'Quartile (25% recovery)', H:'High (30% recovery)' };
  if (ecHintEl) ecHintEl.textContent = ecHints[S.ec] || '';

  // 5. Init Pickr color pickers
  if (typeof Pickr !== 'undefined') {
    initPickrPickers();
  } else {
    console.warn('[QR Prism] Pickr not loaded — using native color inputs');
  }

  // 6. Init resize handle (desktop)
  initResizeHandle();

  // 7. Init sticky QR bar (mobile)
  initStickyQRBar();

  // 8. Start in generator mode
  switchMode('gen');
  updateProjectCounts();
  updateUndoRedoBtns();

  // 9. PWA install events
  document.addEventListener('pwa-installable', () => {
    renderSettings(); // refresh to show install banner
  });
  document.addEventListener('pwa-installed', () => {
    showToast('QR Prism installed!', 'success');
    renderSettings();
  });

  // 10. Firebase auth change → update profile UI
  document.addEventListener('qrp-auth-changed', (e) => {
    const user = e.detail;
    if (_currentMode === 'profile') renderProfile();
    updateProjectCounts();
    // Show/hide sidebar sign-in button
    const sidebarAuth = document.getElementById('sidebar-auth-area');
    if (sidebarAuth) sidebarAuth.style.display = user ? 'none' : '';
  });

  // 11. Cloud sync complete → refresh grids
  document.addEventListener('qrp-sync-complete', () => {
    renderUserTemplates();
    renderProjects?.();
    updateProjectCounts();
  });

  // 12. Profile updated → re-render if on profile page
  document.addEventListener('qrp-profile-updated', () => {
    if (_currentMode === 'profile') renderProfile();
  });

  // 13. System theme watcher
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (SETTINGS.theme === 'system') {
      applyTheme('system');
      updateThemeIcons(e.matches ? 'dark' : 'light');
      renderPatternGrids();
      renderFrameGrids();
    }
  });

  // 14. Batch input counter
  document.getElementById('batch-input')?.addEventListener('input', updateBatchCount);

  console.log('%cQR Prism v2.8 ready', 'color:#818CF8;font-weight:700;font-size:14px;');
});
