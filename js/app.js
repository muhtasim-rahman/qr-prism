// =========================================================
// app.js — Init, mode switching, accordion, UI helpers
// QR Prism v2.4
// =========================================================

// ── Mode switching (scroll to top on switch) ──────────────
let _currentMode = 'gen';

function switchMode(mode) {
  _currentMode = mode;

  // Hide all views, show target
  document.querySelectorAll('.mode-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('mode-' + mode);
  if (target) {
    target.classList.add('active');
    const mc = document.getElementById('main-content');
    if (mc) mc.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Sidebar
  document.querySelectorAll('.nav-item[data-mode]').forEach(b => b.classList.remove('active'));
  document.querySelector(`.nav-item[data-mode="${mode}"]`)?.classList.add('active');

  // Topnav
  document.querySelectorAll('.topnav-tab').forEach(b => b.classList.remove('active'));
  document.querySelector(`.topnav-tab[data-mode="${mode}"]`)?.classList.add('active');

  // Bottomnav
  document.querySelectorAll('.bottomnav-item[data-mode]').forEach(b => b.classList.remove('active'));
  document.querySelector(`.bottomnav-item[data-mode="${mode}"]`)?.classList.add('active');

  // Bottom sheet items
  document.querySelectorAll('.bs-item[data-mode]').forEach(b => b.classList.remove('active'));
  document.querySelector(`.bs-item[data-mode="${mode}"]`)?.classList.add('active');

  // Page-specific init
  if (mode === 'projects') renderProjects();
  if (mode === 'settings') renderSettings();
  if (mode === 'batch') renderBatchTemplateList();
  if (mode === 'templates-manage') renderTemplatesManage();
  if (mode === 'profile') renderProfile();
  if (mode === 'scan') initScannerView();

  updateProjectCountBadge();

  // Close open dropdowns
  document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  document.getElementById('dl-dropdown')?.classList.remove('open');
}

function updateProjectCountBadge() {
  const badge = document.getElementById('sidebar-project-count');
  if (!badge) return;
  const count = loadProjects().length;
  badge.textContent = count;
  badge.style.display = count > 0 ? '' : 'none';
}

// ── Card Accordion ────────────────────────────────────────
function toggleCard(headerEl) {
  const body = headerEl.nextElementSibling;
  if (!body) return;
  const isOpen = headerEl.classList.contains('open');

  // Close all cards in same panel (accordion behavior)
  const panel = headerEl.closest('.settings-panel');
  if (panel && !isOpen) {
    panel.querySelectorAll('.card-header.open').forEach(h => {
      if (h !== headerEl) {
        h.classList.remove('open');
        h.nextElementSibling?.classList.add('hidden');
      }
    });
  }

  headerEl.classList.toggle('open', !isOpen);
  body.classList.toggle('hidden', isOpen);
}

// ── Color tab switching ───────────────────────────────────
function switchCTab(idx, el) {
  document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
  el?.classList.add('active');
  document.querySelectorAll('.csub').forEach(s => s.classList.remove('active'));
  document.getElementById('ctab-' + idx)?.classList.add('active');
}

// ── Sub-tabs (Patterns, Frame) ────────────────────────────
function switchStab(group, idx, el) {
  const container = el.closest('.card-body') || el.closest('.batch-area');
  if (!container) return;
  container.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
  el?.classList.add('active');
  container.querySelectorAll('.spanel').forEach((p, i) => p.classList.toggle('active', i === idx));
}

// ── Download dropdown ─────────────────────────────────────
function toggleDLDropdown() {
  document.getElementById('dl-dropdown')?.classList.toggle('open');
}

// ── Bottom Sheet ──────────────────────────────────────────
function openBottomSheet() {
  document.getElementById('bs-overlay')?.classList.add('open');
  document.getElementById('bottom-sheet')?.classList.add('open');
}
function closeBottomSheet() {
  document.getElementById('bs-overlay')?.classList.remove('open');
  document.getElementById('bottom-sheet')?.classList.remove('open');
}

// ── Modals ────────────────────────────────────────────────
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

// Close modal on backdrop click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bg')) e.target.classList.remove('open');
  if (!e.target.closest('.dl-wrap')) document.getElementById('dl-dropdown')?.classList.remove('open');
  if (!e.target.closest('.project-3dot')) {
    document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  }
});

// ── Confirmation Modal ────────────────────────────────────
function showConfirm({ title, msg, list, okLabel = 'Confirm', okClass = 'btn-danger', onConfirm }) {
  document.getElementById('confirm-title').innerHTML =
    `<i class="fa-solid fa-triangle-exclamation" style="color:var(--warning)"></i> ${title}`;
  document.getElementById('confirm-msg').textContent = msg;
  const listEl = document.getElementById('confirm-list');
  if (list?.length) {
    listEl.style.display = '';
    listEl.innerHTML = list.map(l => `• ${escHtml(l)}`).join('<br>');
  } else {
    listEl.style.display = 'none';
  }
  const okBtn = document.getElementById('confirm-ok-btn');
  okBtn.textContent = okLabel;
  okBtn.className = 'btn ' + okClass;
  okBtn.onclick = () => { closeModal('confirm-modal'); onConfirm?.(); };
  openModal('confirm-modal');
}

// ── Toast notifications ───────────────────────────────────
function showToast(msg, type = 'info', duration = 3000) {
  const icons = {
    success: 'fa-check-circle', error: 'fa-times-circle',
    warning: 'fa-exclamation-triangle', info: 'fa-circle-info'
  };
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${escHtml(msg)}</span>`;
  document.getElementById('toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 280); }, duration);
}

// ── Save Template / Project modals ────────────────────────
function openSaveTemplateModal() {
  const inp = document.getElementById('save-tmpl-name');
  if (inp) inp.value = '';
  openModal('save-template-modal');
  setTimeout(() => inp?.focus(), 100);
}

function openSaveProjectModal() {
  if (!S.inputData?.trim()) return showToast('Generate a QR first', 'warning');
  const inp = document.getElementById('save-proj-name');
  if (inp) inp.value = '';
  openModal('save-project-modal');
  setTimeout(() => inp?.focus(), 100);
}

function saveProjectWithName() {
  const name = document.getElementById('save-proj-name')?.value?.trim() || 'My Project';
  saveNamedProject(name);
  closeModal('save-project-modal');
}

// ── Size helpers ──────────────────────────────────────────
function adjSize(delta) {
  const inp = document.getElementById('qr-size');
  S.size = Math.min(2000, Math.max(100, (parseInt(inp?.value) || 600) + delta));
  if (inp) inp.value = S.size;
  schedRender();
}
function setSize(val) {
  S.size = val;
  const inp = document.getElementById('qr-size');
  if (inp) inp.value = val;
  schedRender();
}

// ── Color sync ────────────────────────────────────────────
const COLOR_KEY_MAP = {
  fg: 'fgColor', bg: 'bgColor', gc1: 'gc1', gc2: 'gc2',
  mb: 'mbColor', mc: 'mcColor', ef: 'efColor', ei: 'eiColor',
  lpc: 'logoPadColor', flc: 'frameLabelColor', fc: 'frameColor',
  fc2: 'frameColor', sc: 'shadowColor',
};

function syncColor(key, value) {
  S[COLOR_KEY_MAP[key] || key] = value;
  const sw = document.getElementById(key + '-sw');
  const hex = document.getElementById(key + '-hex');
  if (sw) sw.style.background = value;
  if (hex) hex.value = value;
  schedRender();
}

function syncHex(key, value) {
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
    const inp = document.getElementById(key + '-color');
    if (inp) inp.value = value;
    syncColor(key, value);
  }
}

// ── Logo upload ───────────────────────────────────────────
function handleLogoFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) return showToast('File too large (max 5MB)', 'error');
  const reader = new FileReader();
  reader.onload = e => {
    S.logoSrc = e.target.result;
    S.logoKey = null;
    updateLogoPreview(S.logoSrc);
    document.querySelectorAll('.logo-item').forEach(el => el.classList.remove('active'));
    schedRender();
  };
  reader.readAsDataURL(file);
}

function handleLogoDrop(e) {
  e.preventDefault();
  document.getElementById('logo-upload').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file) {
    const dt = new DataTransfer();
    dt.items.add(file);
    const input = document.getElementById('logo-file');
    if (input) { input.files = dt.files; handleLogoFile(input); }
  }
}

function updateLogoPreview(src) {
  const area = document.getElementById('logo-prev-area');
  if (!area) return;
  if (!src) { area.innerHTML = ''; return; }
  area.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
      <img src="${src}" class="logo-preview-img" alt="Logo">
      <button class="btn btn-ghost btn-sm" onclick="clearLogo()">
        <i class="fa-solid fa-xmark"></i> Remove
      </button>
    </div>`;
}

function clearLogo() {
  S.logoSrc = null;
  S.logoKey = null;
  updateLogoPreview(null);
  document.querySelectorAll('.logo-item').forEach(el => el.classList.remove('active'));
  const fi = document.getElementById('logo-file');
  if (fi) fi.value = '';
  schedRender();
}

function filterLogos(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('.logo-item').forEach(el => {
    el.style.display = (!q || (el.dataset.name || '').toLowerCase().includes(q)) ? '' : 'none';
  });
}

// ── Share / Copy ──────────────────────────────────────────
async function shareQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') return showToast('No QR to share', 'warning');
  canvas.toBlob(async blob => {
    const file = new File([blob], 'qr-prism.png', { type: 'image/png' });
    if (navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ title: 'QR Code', files: [file] }); }
      catch(e) {}
    } else {
      copyToClipboard();
    }
  });
}

async function copyToClipboard() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') return showToast('No QR to copy', 'warning');
  try {
    const blob = await new Promise(r => canvas.toBlob(r));
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showToast('Copied to clipboard!', 'success');
  } catch(e) {
    showToast('Copy not supported in this browser', 'error');
  }
}

function shareApp() {
  const url = window.location.href;
  if (navigator.share) {
    navigator.share({ title: 'QR Prism', text: 'Free advanced QR code generator!', url });
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('App URL copied!', 'success'));
  }
}

// ── Tooltip handling for mobile (tap to show, tap outside to hide) ──
document.addEventListener('click', e => {
  const infoBtn = e.target.closest('.tooltip-wrap');
  const isMobile = window.innerWidth < 768;

  if (isMobile) {
    if (infoBtn) {
      // Close all others
      document.querySelectorAll('.tooltip-wrap.show-tip').forEach(el => {
        if (el !== infoBtn) el.classList.remove('show-tip');
      });
      infoBtn.classList.toggle('show-tip');
      e.stopPropagation();
    } else {
      document.querySelectorAll('.tooltip-wrap.show-tip').forEach(el => el.classList.remove('show-tip'));
    }
  }
});

// Fix tooltip overflow — reposition if going off-screen
function repositionTooltips() {
  document.querySelectorAll('.tooltip-pop').forEach(tip => {
    tip.classList.remove('tip-left', 'tip-right');
    const rect = tip.getBoundingClientRect();
    if (rect.left < 0) tip.classList.add('tip-left');
    else if (rect.right > window.innerWidth) tip.classList.add('tip-right');
  });
}
document.addEventListener('mouseover', e => {
  if (e.target.closest('.tooltip-wrap')) repositionTooltips();
});

// ── Bug Report ────────────────────────────────────────────
let _reportType = 'bug';
let _reportImages = [];

function selectReportType(btn, type) {
  _reportType = type;
  document.querySelectorAll('.rtype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function handleReportImages(input) {
  const files = Array.from(input.files);
  files.slice(0, 8 - _reportImages.length).forEach(file => {
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} too large`, 'warning'); return; }
    const reader = new FileReader();
    reader.onload = e => { _reportImages.push(e.target.result); renderReportImages(); };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderReportImages() {
  const grid = document.getElementById('report-img-grid');
  if (!grid) return;
  const items = _reportImages.map((src, i) => `
    <div class="report-img-item">
      <img src="${src}" alt="">
      <button class="report-img-remove" onclick="removeReportImage(${i})">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>`).join('');
  const addBtn = _reportImages.length < 8 ? `
    <div class="report-img-add" onclick="document.getElementById('report-img-input').click()">
      <i class="fa-solid fa-plus"></i><span>Add</span>
    </div>` : '';
  grid.innerHTML = items + addBtn;
}

function removeReportImage(idx) {
  _reportImages.splice(idx, 1);
  renderReportImages();
}

function submitReport() {
  const name = document.getElementById('report-name')?.value?.trim();
  const desc = document.getElementById('report-desc')?.value?.trim();
  if (!desc) return showToast('Please describe the issue', 'warning');
  showToast('Thank you for your report! 🙏', 'success', 4000);
  clearReportForm();
}

function clearReportForm() {
  showConfirm({
    title: 'Clear Form',
    msg: 'Clear all report form data?',
    okLabel: 'Clear',
    okClass: 'btn-danger',
    onConfirm: () => {
      _reportImages = [];
      ['report-name','report-email','report-desc'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      renderReportImages();
      showToast('Form cleared', 'info');
    }
  });
}

// ── Documentation ─────────────────────────────────────────
async function openDocumentation() {
  const content = document.getElementById('docs-content');
  if (!content) return;
  content.innerHTML = '<div class="docs-loading"><div class="spinner"></div><span>Loading docs…</span></div>';
  openModal('docs-modal');

  try {
    const res = await fetch('./README.md');
    if (!res.ok) throw new Error('Not found');
    const text = await res.text();
    const html = renderMarkdown(text);
    content.innerHTML = html;
    buildDocsTOC(content);
  } catch(e) {
    // Try GitHub
    try {
      const res2 = await fetch('https://raw.githubusercontent.com/muhtasim-rahman/qr-prism/main/README.md');
      if (!res2.ok) throw new Error();
      const text2 = await res2.text();
      content.innerHTML = renderMarkdown(text2);
      buildDocsTOC(content);
    } catch {
      content.innerHTML = `
        <div class="docs-loading" style="flex-direction:column; gap:12px;">
          <i class="fa-brands fa-github" style="font-size:3rem; color:var(--muted);"></i>
          <p style="color:var(--text2);">Could not load documentation.</p>
          <a class="btn btn-primary" href="https://github.com/muhtasim-rahman/qr-prism" target="_blank" rel="noopener">
            <i class="fa-brands fa-github"></i> View on GitHub
          </a>
        </div>`;
    }
  }
}

function buildDocsTOC(contentEl) {
  const headings = contentEl.querySelectorAll('h1,h2,h3');
  const tocList = document.getElementById('docs-toc-list');
  const tocMobileList = document.getElementById('docs-toc-mobile-list');
  if (!tocList) return;

  let html = '';
  headings.forEach((h, i) => {
    const id = 'docs-h-' + i;
    h.id = id;
    const level = h.tagName.toLowerCase();
    html += `<a class="docs-toc-item ${level}" href="#${id}" 
               onclick="scrollToDocsHeading('${id}'); return false;">${h.textContent}</a>`;
  });
  tocList.innerHTML = html;
  if (tocMobileList) tocMobileList.innerHTML = html;
}

function scrollToDocsHeading(id) {
  const el = document.getElementById(id);
  const contentArea = document.querySelector('.docs-content-area');
  if (el && contentArea) {
    contentArea.scrollTo({ top: el.offsetTop - 16, behavior: 'smooth' });
  }
  // Close mobile TOC
  document.getElementById('docs-toc-mobile')?.classList.remove('open');
}

function toggleDocsTOC() {
  const isMobile = window.innerWidth < 600;
  if (isMobile) {
    document.getElementById('docs-toc-mobile')?.classList.toggle('open');
  } else {
    const toc = document.getElementById('docs-toc');
    if (toc) toc.style.display = toc.style.display === 'none' ? '' : 'none';
  }
}

// ── GitHub-style Markdown renderer ────────────────────────
function renderMarkdown(md) {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Fenced code blocks
  html = html.replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
    `<pre class="md-code"><code class="lang-${lang}">${code.trimEnd()}</code></pre>`);
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>');
  // Headers (must come before bold/italic)
  html = html.replace(/^######\s(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s(.+)$/gm,  '<h5>$1</h5>');
  html = html.replace(/^####\s(.+)$/gm,   '<h4>$1</h4>');
  html = html.replace(/^###\s(.+)$/gm,    '<h3>$1</h3>');
  html = html.replace(/^##\s(.+)$/gm,     '<h2>$1</h2>');
  html = html.replace(/^#\s(.+)$/gm,      '<h1>$1</h1>');
  // Bold/italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g,   '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g,       '<em>$1</em>');
  // Links & images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // HR
  html = html.replace(/^---+$/gm, '<hr>');
  // Tables (basic)
  html = html.replace(/((?:^\|.+\|\n?)+)/gm, match => {
    const rows = match.trim().split('\n');
    if (rows.length < 2) return match;
    const header = rows[0].split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
    const body = rows.slice(2).map(r =>
      '<tr>' + r.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
    ).join('');
    return `<table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table>`;
  });
  // Blockquotes
  html = html.replace(/^&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>');
  // Lists
  html = html.replace(/((?:^[-*+]\s.+\n?)+)/gm, match => {
    const items = match.trim().split('\n')
      .map(l => `<li>${l.replace(/^[-*+]\s/, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });
  html = html.replace(/((?:^\d+\.\s.+\n?)+)/gm, match => {
    const items = match.trim().split('\n')
      .map(l => `<li>${l.replace(/^\d+\.\s/, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });
  // Paragraphs
  html = html.replace(/\n{2,}/g, '</p><p>');
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>(<(?:h[1-6]|ul|ol|pre|blockquote|table|hr))/g, '$1');
  html = html.replace(/(<\/(?:h[1-6]|ul|ol|pre|blockquote|table|hr)>)<\/p>/g, '$1');
  html = html.replace(/<p>\s*<\/p>/g, '');

  return `<div class="md-body">${html}</div>`;
}

// ── Import / Export JSON ──────────────────────────────────
function exportProjects() {
  const projects = loadProjects();
  const count = projects.length;
  const now = new Date();
  const stamp = `${now.getDate().toString().padStart(2,'0')}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getFullYear()}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}`;
  const filename = `qr-prism_projects_${count}_${stamp}.json`;
  const payload = {
    _copyright: '© QR Prism by Muhtasim Rahman (Turzo) — https://mdturzo.odoo.com',
    _type: 'qr-prism-projects',
    _version: '2.4',
    _exported: now.toISOString(),
    count,
    projects
  };
  downloadJSON(payload, filename);
  showToast(`Exported ${count} projects`, 'success');
}

function exportTemplates() {
  const templates = loadUserTemplates();
  const count = templates.length;
  const now = new Date();
  const stamp = `${now.getDate().toString().padStart(2,'0')}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getFullYear()}_${now.getHours().toString().padStart(2,'0')}-${now.getMinutes().toString().padStart(2,'0')}`;
  const filename = `qr-prism_templates_${count}_${stamp}.json`;
  const payload = {
    _copyright: '© QR Prism by Muhtasim Rahman (Turzo) — https://mdturzo.odoo.com',
    _type: 'qr-prism-templates',
    _version: '2.4',
    _exported: now.toISOString(),
    count,
    templates
  };
  downloadJSON(payload, filename);
  showToast(`Exported ${count} templates`, 'success');
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function handleImportFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data._type === 'qr-prism-projects' && Array.isArray(data.projects)) {
        const existing = loadProjects();
        const merged = [...data.projects, ...existing];
        saveProjectsData(merged);
        showToast(`Imported ${data.projects.length} projects`, 'success');
        if (_currentMode === 'projects') renderProjects();
      } else if (data._type === 'qr-prism-templates' && Array.isArray(data.templates)) {
        const existing = loadUserTemplates();
        const merged = [...data.templates, ...existing];
        saveUserTemplates(merged);
        showToast(`Imported ${data.templates.length} templates`, 'success');
        renderUserTemplates();
      } else {
        showToast('Unknown file format', 'error');
      }
    } catch {
      showToast('Invalid JSON file', 'error');
    }
    closeModal('import-modal');
    input.value = '';
  };
  reader.readAsText(file);
}

// ── Keyboard shortcuts ────────────────────────────────────
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

// ── Profile rendering ─────────────────────────────────────
function renderProfile() {
  const el = document.getElementById('profile-content');
  if (!el) return;
  const { profileName, profileEmail, profileBio, profileWeb, profileAvatarUrl } = SETTINGS;
  const initials = profileName ? profileName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?';

  el.innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar-large" id="profile-avatar-lg">
        ${profileAvatarUrl
          ? `<img src="${profileAvatarUrl}" alt="Avatar" onload="this.style.opacity=1" style="opacity:0;transition:opacity 0.3s;">`
          : `<span>${initials}</span>`}
        <div class="profile-avatar-edit" onclick="document.getElementById('profile-avatar-file').click()">
          <i class="fa-solid fa-camera" style="color:#fff;"></i>
        </div>
      </div>
      <input type="file" id="profile-avatar-file" accept="image/*" style="display:none;" onchange="handleProfileAvatar(this)">
      <div class="profile-name">${escHtml(profileName || 'Guest User')}</div>
      ${profileBio ? `<div class="profile-bio">${escHtml(profileBio)}</div>` : ''}
    </div>

    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-user"></i> Profile Info</div>
      <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:6px;">
        <div class="field-label">Display Name</div>
        <input class="input" id="pf-name" value="${escHtml(profileName)}" placeholder="Your Name">
      </div>
      <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:6px;">
        <div class="field-label">Email</div>
        <input class="input" id="pf-email" type="email" value="${escHtml(profileEmail)}" placeholder="you@email.com">
      </div>
      <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:6px;">
        <div class="field-label">Bio</div>
        <input class="input" id="pf-bio" value="${escHtml(profileBio)}" placeholder="Short bio…">
      </div>
      <div class="setting-row" style="flex-direction:column; align-items:flex-start; gap:6px;">
        <div class="field-label">Website</div>
        <input class="input" id="pf-web" type="url" value="${escHtml(profileWeb)}" placeholder="https://…">
      </div>
      <div class="setting-row">
        <span></span>
        <button class="btn btn-primary btn-sm" onclick="saveProfile()">
          <i class="fa-solid fa-floppy-disk"></i> Save Profile
        </button>
      </div>
    </div>`;

  // Auto-load avatar after DOM ready
  if (profileAvatarUrl) {
    setTimeout(() => {
      const img = document.querySelector('#profile-avatar-lg img');
      if (img) img.style.opacity = '1';
    }, 100);
  }
}

function saveProfile() {
  SETTINGS.profileName  = document.getElementById('pf-name')?.value?.trim() || '';
  SETTINGS.profileEmail = document.getElementById('pf-email')?.value?.trim() || '';
  SETTINGS.profileBio   = document.getElementById('pf-bio')?.value?.trim() || '';
  SETTINGS.profileWeb   = document.getElementById('pf-web')?.value?.trim() || '';
  saveSettingsData();
  updateSidebarProfile();
  renderProfile();
  showToast('Profile saved', 'success');
}

function handleProfileAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) return showToast('Max 2MB for avatar', 'warning');
  const reader = new FileReader();
  reader.onload = e => {
    SETTINGS.profileAvatarUrl = e.target.result;
    saveSettingsData();
    renderProfile();
    updateSidebarProfile();
    showToast('Avatar updated', 'success');
  };
  reader.readAsDataURL(file);
}

function updateSidebarProfile() {
  const { profileName, profileEmail, profileAvatarUrl } = SETTINGS;
  const initials = profileName ? profileName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : '?';
  const avatar = document.getElementById('sp-avatar');
  const nameEl = document.getElementById('sp-name');
  const subEl  = document.getElementById('sp-sub');

  if (avatar) {
    if (profileAvatarUrl) {
      avatar.innerHTML = `<img src="${profileAvatarUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
      avatar.textContent = initials;
    }
  }
  if (nameEl) nameEl.textContent = profileName || 'Guest User';
  if (subEl)  subEl.textContent  = profileEmail || 'Click to set up profile';
}

// ── Init ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  applyTheme(SETTINGS.theme);
  renderTypeTabs();
  renderTypeTab(S.activeType);
  renderPatternGrids();
  renderFrameGrids();
  renderLogoGrid();
  renderPresetTemplates();
  renderUserTemplates();
  updateSidebarProfile();
  switchMode('gen');
  renderReportImages();
  updateProjectCountBadge();

  // PWA events
  document.addEventListener('pwa-installable', () => {
    if (_currentMode === 'settings') renderSettings();
  });
  document.addEventListener('pwa-installed', () => {
    if (_currentMode === 'settings') renderSettings();
  });

  // Init first cards open, rest collapsed
  const cards = document.querySelectorAll('.settings-panel .card-header');
  cards.forEach((h, i) => {
    if (i >= 2) {
      h.classList.remove('open');
      h.nextElementSibling?.classList.add('hidden');
    }
  });
});
