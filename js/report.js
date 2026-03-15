// =========================================================
// REPORT.JS — QR Prism v2.8
// Bug report form orchestration
// Core logic: submitReport(), handleReportImages(), clearReportForm()
//   → lives in ui.js (report form UI) and firebase.js (submitFullReport)
// This file provides a clean entry-point + any extra helpers
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// Report type state (shared with ui.js via global)
// _reportType and _reportFiles are defined in ui.js

// ── Report page pre-fill from URL params ──────────────────────
// e.g. index.html?mode=report&type=feature  → auto-selects type
(function _checkReportURLParam() {
  try {
    const params = new URLSearchParams(window.location.search);
    const mode   = params.get('mode');
    const type   = params.get('type'); // bug | ui | feature | performance
    if (mode === 'report' && type) {
      // Defer until DOMContentLoaded so buttons are rendered
      window.addEventListener('DOMContentLoaded', () => {
        const btn = document.querySelector(`.rtype-btn[data-rtype="${type}"]`);
        if (btn && typeof selectReportType === 'function') {
          selectReportType(btn, type);
        }
      });
    }
  } catch {}
})();

// ── Report status labels (used by profile page issues list) ──
const REPORT_STATUS = {
  pending:   { label: 'Pending',   color: 'var(--warning)', icon: 'fa-solid fa-clock' },
  reviewing: { label: 'Reviewing', color: 'var(--info)',    icon: 'fa-solid fa-magnifying-glass' },
  resolved:  { label: 'Resolved',  color: 'var(--success)', icon: 'fa-solid fa-circle-check' },
  rejected:  { label: 'Rejected',  color: 'var(--danger)',  icon: 'fa-solid fa-circle-xmark' },
};

function getReportStatusInfo(status) {
  return REPORT_STATUS[status] || REPORT_STATUS.pending;
}

// ── Open report page and link back to report list ─────────────
function goToReportList() {
  switchMode('profile');
  // After render, scroll to issues section
  setTimeout(() => {
    document.getElementById('profile-issues-list')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 400);
}
