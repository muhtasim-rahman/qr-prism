// =========================================================
// js/app.js — Application bootstrap V2.0
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Theme init ─────────────────────────────────────────
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  const icon = document.getElementById('dark-icon');
  if (icon) icon.className = savedTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

  // ── Sidebar state ───────────────────────────────────────
  const savedCollapsed = localStorage.getItem('sidebar_collapsed') === '1';
  if (savedCollapsed) {
    document.getElementById('app-sidebar')?.classList.add('collapsed');
    document.getElementById('main-content')?.classList.add('sidebar-collapsed');
    _sidebarCollapsed = savedCollapsed;
  }

  // ── Build all UI ────────────────────────────────────────
  buildTypeChips();
  switchQRType('url', false);
  buildDesignGrids();
  buildLogoGrid();
  renderPremiumTemplates();
  renderUserTemplates();
  updateProjectsBadge();

  // ── Keyboard shortcuts ──────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,select')) return;
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'd': e.preventDefault(); downloadQR('png'); break;
        case 's': e.preventDefault(); openSaveTemplateModal(); break;
        case 'c': e.preventDefault(); copyToClipboard(); break;
        case 'z': e.preventDefault(); undo(); break;
        case 'y': e.preventDefault(); redo(); break;
      }
    } else {
      switch (e.key) {
        case 'd': toggleDark(); break;
        case '?': openModal('kb-modal'); break;
      }
    }
  });

  // ── Sidebar overlay click ───────────────────────────────
  document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

  // ── Close modals on background click ───────────────────
  document.querySelectorAll('.modal-bg').forEach(bg => {
    bg.addEventListener('click', e => { if (e.target === bg) bg.classList.remove('active'); });
  });

  // ── Auto-render QR on first load if URL param exists ───
  const urlParam = new URLSearchParams(window.location.search).get('url');
  if (urlParam) {
    const f = document.getElementById('f-url');
    if (f) { f.value = urlParam; schedRender(); }
  }

  console.log('QR Studio Pro V2.0 initialized ✓');
});
