// =========================================================
// app.js — Initialization, keyboard shortcuts
// =========================================================

// ── Keyboard Shortcuts ────────────────────────────────────
document.addEventListener('keydown', e => {
  // Ignore if typing in input
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl && e.key === 'd') { e.preventDefault(); downloadQR('png'); }
  if (ctrl && e.key === 's') { e.preventDefault(); openSaveModal(); }
  if (ctrl && e.key === 'c') { e.preventDefault(); copyToClipboard(); }
  if (ctrl && e.key === 'z') { e.preventDefault(); undo(); }
  if (ctrl && e.key === 'y') { e.preventDefault(); redo(); }
  if (e.key === 'd' && !ctrl) toggleDark();
  if (e.key === '?') openModal('kb-modal');
});

// ── Init ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Load settings and apply theme
  loadSettings();

  // Render type tabs
  renderTypeTabs();

  // Render default type form
  renderTypeTab(S.activeType);

  // Render pattern grids
  renderPatternGrids();

  // Render frame grids
  renderFrameGrids();

  // Render logo grid
  renderLogoGrid();

  // Render templates
  renderPresetTemplates();
  renderUserTemplates();

  // Set generator as active mode
  switchMode('gen');

  // Init tooltips
  document.querySelectorAll('[data-tip]').forEach(el => {
    el.title = el.dataset.tip;
  });

  // Lazy render card bodies (all collapsed except first 2)
  const cards = document.querySelectorAll('.card-header');
  cards.forEach((h, i) => {
    if (i >= 3) {
      h.classList.remove('open');
      h.nextElementSibling?.classList.add('hidden');
    }
  });
});
