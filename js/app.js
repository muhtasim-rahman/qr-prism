// =========================================================
// APP.JS — Initialization, keyboard shortcuts, boot
// =========================================================

// ── Boot on DOM ready ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initApp();
  initKeyboardShortcuts();
  loadJSZip();
});

// ── Restore saved theme ──────────────────────────────────
function initTheme() {
  try {
    const saved = localStorage.getItem('qr_theme');
    if (saved) {
      document.documentElement.dataset.theme = saved;
      const icon = document.getElementById('dark-icon');
      if (icon) icon.className = saved === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  } catch (e) {}
}

// ── Main app initialization ──────────────────────────────
function initApp() {
  // Render all static UI components
  renderTypeTabs();
  renderForm(S.activeType);
  renderDesignGrid();
  renderEyeFrameGrid();
  renderEyeInnerGrid();
  renderFrameGrids();
  renderLogoGrid();
  renderPresetTemplates();
  renderSavedTemplates();

  // Set initial mode display
  document.getElementById('mode-gen').style.display   = 'flex';
  document.getElementById('mode-scan').style.display  = 'none';
  document.getElementById('mode-batch').style.display = 'none';
  document.getElementById('mode-hist').style.display  = 'none';

  // Trigger first render with empty state (shows empty state graphic)
  renderQR();

  console.log('%c QR Studio Pro loaded ✓ ', 'background:#2D9CDB;color:#fff;font-weight:bold;border-radius:4px;padding:2px 8px;');
}

// ── Lazy-load JSZip for batch downloads ──────────────────
function loadJSZip() {
  if (typeof JSZip !== 'undefined') return;
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  script.async = true;
  document.head.appendChild(script);
}

// ── Keyboard Shortcuts ───────────────────────────────────
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Skip if user is typing in an input/textarea
    const tag = e.target.tagName;
    const isEditable = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;

    // Ctrl / Cmd combos — always active
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'd':
          e.preventDefault();
          downloadQR('png');
          break;
        case 's':
          e.preventDefault();
          openSaveModal();
          break;
        case 'z':
          e.preventDefault();
          undo();
          break;
        case 'y':
          e.preventDefault();
          redo();
          break;
        case 'c':
          // Only intercept when not in an input field
          if (!isEditable) {
            e.preventDefault();
            copyToClipboard();
          }
          break;
      }
      return;
    }

    // Single-key shortcuts — only when NOT in an input
    if (isEditable) return;

    switch (e.key) {
      case 'd':
      case 'D':
        toggleDark();
        break;
      case '?':
        openModal('kb-modal');
        break;
      case 'Escape':
        // Close any open modal
        document.querySelectorAll('.modal-bg.open').forEach(m => m.classList.remove('open'));
        closeDLDropdown();
        break;
      case '1':
        switchMode('gen',   document.querySelector('.nav-tab[data-mode="gen"]'));
        break;
      case '2':
        switchMode('scan',  document.querySelector('.nav-tab[data-mode="scan"]'));
        break;
      case '3':
        switchMode('batch', document.querySelector('.nav-tab[data-mode="batch"]'));
        break;
      case '4':
        switchMode('hist',  document.querySelector('.nav-tab[data-mode="hist"]'));
        break;
    }
  });
}

// ── Enter key submits Save Template modal ────────────────
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const modal = document.getElementById('save-modal');
    if (modal && modal.classList.contains('open')) {
      e.preventDefault();
      saveTemplate();
    }
  }
});
