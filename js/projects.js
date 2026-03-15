// =========================================================
// PROJECTS.JS — QR Prism v2.8
// Auto-save, manual save, render, tags, export/import,
// multi-select, Firebase cloud sync
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const PROJ_KEY = 'qrp_projects';

let _projCategory     = 'saved';
let _selectMode       = false;
let _selectedIds      = new Set();
let _lastAutoSaveData = null;

// ══════════════════════════════════════════════════════════
// LOAD / SAVE  (localStorage + optional Firebase)
// ══════════════════════════════════════════════════════════
function loadProjects() {
  try { return JSON.parse(localStorage.getItem(PROJ_KEY) || '[]'); } catch { return []; }
}

function saveProjectsData(projects) {
  try {
    localStorage.setItem(PROJ_KEY, JSON.stringify(projects));
    // Push to Firebase if logged in
    if (typeof FB_USER !== 'undefined' && FB_USER && typeof fbDB !== 'undefined') {
      fbDB.ref(`users/${FB_USER.uid}/projects`).set(projects).catch(() => {});
    }
  } catch {
    showToast('Storage error — data may not be saved', 'error');
  }
}

// ══════════════════════════════════════════════════════════
// CURRENT DESIGN SNAPSHOT  (all S properties worth saving)
// ══════════════════════════════════════════════════════════
function getCurrentDesign() {
  // Capture every design property from S (skip logoSrc blob)
  const keys = [
    'pattern','eyeFrame','eyeInner','moduleGap','eyeScale',
    'bgMode','bgColor','bgGType','bgGAngle','bgGc1','bgGc2',
    'fgColor','fgGradient','gType','gc1','gc2','gAngle',
    'customEyeColors','efColor','efGradient','efc1','efc2',
    'eiColor','eiGradient','eic1','eic2',
    'logoKey','logoSize','logoBR','logoPad','logoPadColor','logoRemoveBG',
    'frame','frameLabel','frameFont','frameTSize','frameLabelColor','frameColor','framePad','framePad2',
    'rotation','flipH','flipV','filter','invert',
    'shadow','shadowColor','shadowBlur','shadowX','shadowY',
    'size','ec','qz','scanOpt',
  ];
  const snap = {};
  keys.forEach(k => { snap[k] = S[k]; });
  return snap;
}

function captureQRDataURL() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') return null;
  try { return canvas.toDataURL('image/png', 0.72); } catch { return null; }
}

// ══════════════════════════════════════════════════════════
// AUTO-SAVE  (called by qr-engine.js after 1s debounce)
// ══════════════════════════════════════════════════════════
function autoSaveToProjects(data) {
  if (!data || !data.trim()) { setAutosaveStatus('waiting'); return; }
  if (!SETTINGS.autoSaveProjects) { setAutosaveStatus('waiting'); return; }

  const projects = loadProjects();
  const qrDataURL = captureQRDataURL();

  // Dedup: update existing auto-save with same type + data
  const existing = projects.find(p =>
    !p.savedByUser && p.type === S.activeType && p.data === data
  );

  if (existing) {
    existing.updatedAt      = Date.now();
    existing.designSnapshot = JSON.stringify(getCurrentDesign());
    if (qrDataURL) existing.qrDataURL = qrDataURL;
    saveProjectsData(projects);
    setAutosaveStatus('saved');
    updateProjectCounts();
    _lastAutoSaveData = data;
    return;
  }

  // New auto-save entry
  const proj = {
    id:             'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
    type:           S.activeType,
    title:          'Auto: ' + (QR_TYPES.find(t => t.key === S.activeType)?.title || S.activeType),
    data,
    tags:           [],
    qrDataURL,
    designSnapshot: JSON.stringify(getCurrentDesign()),
    savedByUser:    false,
    pinned:         false,
    createdAt:      Date.now(),
    updatedAt:      Date.now(),
  };

  projects.unshift(proj);

  // Trim auto-saves to max 50
  const autos = projects.filter(p => !p.savedByUser);
  if (autos.length > 50) {
    const toRemove = autos.slice(50);
    toRemove.forEach(old => {
      const idx = projects.findIndex(p => p.id === old.id);
      if (idx >= 0) projects.splice(idx, 1);
    });
  }

  saveProjectsData(projects);
  setAutosaveStatus('saved');
  updateProjectCounts();
  _lastAutoSaveData = data;
}

// ══════════════════════════════════════════════════════════
// MANUAL SAVE  (user clicks "Save Project")
// ══════════════════════════════════════════════════════════
function saveProjectWithName() {
  const nameEl = document.getElementById('save-proj-name');
  const name   = nameEl?.value.trim();
  if (!name) { showToast('Please enter a project name', 'error'); return; }

  const data = S.inputData || buildQRData();
  if (!data || !data.trim()) { showToast('Generate a QR code first', 'error'); return; }

  const proj = {
    id:             'proj_' + Date.now(),
    type:           S.activeType,
    title:          name,
    data,
    tags:           [],
    qrDataURL:      captureQRDataURL(),
    designSnapshot: JSON.stringify(getCurrentDesign()),
    savedByUser:    true,
    pinned:         false,
    createdAt:      Date.now(),
    updatedAt:      Date.now(),
  };

  const projects = loadProjects();
  projects.unshift(proj);
  saveProjectsData(projects);
  closeModal('save-project-modal');
  showToast(`"${name}" saved!`, 'success');
  updateProjectCounts();
}

// ══════════════════════════════════════════════════════════
// RENDER  (project list)
// ══════════════════════════════════════════════════════════
function renderProjects(query = '') {
  const list = document.getElementById('project-list');
  if (!list) return;

  let projects = loadProjects();
  const q = (document.getElementById('project-search')?.value || query || '').toLowerCase().trim();

  // Filter by category tab
  if (_projCategory === 'saved')  projects = projects.filter(p => p.savedByUser);
  if (_projCategory === 'auto')   projects = projects.filter(p => !p.savedByUser);
  if (_projCategory === 'pinned') projects = projects.filter(p => p.pinned);

  // Search
  if (q) {
    projects = projects.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.data  || '').toLowerCase().includes(q) ||
      (p.tags  || []).some(t => t.toLowerCase().includes(q))
    );
  }

  // Sort: pinned first → newest
  projects.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

  updateProjectCounts();

  if (!projects.length) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>${q ? 'No projects match your search.' : 'No projects here yet.'}</p>
        ${!q && _projCategory === 'saved' ? `
          <button class="btn btn-outline btn-sm" onclick="switchMode('gen')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Generate &amp; Save
          </button>` : ''}
      </div>`;
    return;
  }

  list.innerHTML = projects.map(p => buildProjectCard(p)).join('');
}

function buildProjectCard(p) {
  const typeInfo = QR_TYPES.find(t => t.key === p.type) || { icon: 'fa-solid fa-qrcode', title: p.type };
  const date     = formatDate(p.updatedAt || p.createdAt);
  const preview  = (p.data || '').slice(0, 72) + (p.data?.length > 72 ? '…' : '');
  const tags     = (p.tags || []).map(t =>
    `<span class="proj-tag" onclick="searchByTag('${escHtml(t)}')" title="Filter by tag">${escHtml(t)}</span>`
  ).join('');

  const thumb = p.qrDataURL
    ? `<img src="${p.qrDataURL}" alt="QR preview">`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--text3);font-size:1.4rem;">
         <i class="fa-solid fa-qrcode"></i>
       </div>`;

  const selectCheck = _selectMode
    ? `<input type="checkbox" class="proj-select-cb"
         ${_selectedIds.has(p.id) ? 'checked' : ''}
         onclick="event.stopPropagation();toggleSelectProject('${p.id}',this)">`
    : '';

  return `
    <div class="project-card${_selectMode && _selectedIds.has(p.id) ? ' selected' : ''}"
         data-id="${p.id}">
      ${selectCheck}
      <div class="proj-thumb" onclick="${_selectMode ? `toggleSelectProject('${p.id}')` : `loadProjectInGen('${p.id}')`}">
        ${thumb}
      </div>
      <div class="proj-info" onclick="${_selectMode ? '' : `loadProjectInGen('${p.id}')`}">
        <div class="proj-name">
          ${p.pinned ? '<i class="fa-solid fa-thumbtack" style="color:var(--primary);font-size:.72rem;"></i> ' : ''}
          ${escHtml(p.title || 'Untitled')}
        </div>
        <div class="proj-meta">
          <span><i class="${typeInfo.icon}" style="font-size:.70rem;"></i> ${escHtml(typeInfo.title || p.type)}</span>
          <span>${date}</span>
        </div>
        <div class="proj-meta" style="margin-top:2px;font-size:.68rem;opacity:.7;">${escHtml(preview)}</div>
        ${tags ? `<div class="proj-tags">${tags}</div>` : ''}
      </div>
      <div class="proj-actions">
        <button class="proj-action-btn tooltip-wrap" onclick="loadProjectInGen('${p.id}')" title="Load">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span class="tooltip-pop">Load in Editor</span>
        </button>
        <button class="proj-action-btn tooltip-wrap" onclick="togglePinProject('${p.id}')" title="${p.pinned ? 'Unpin' : 'Pin'}">
          <i class="fa-solid fa-thumbtack${p.pinned ? '' : ''}" style="${p.pinned ? 'color:var(--primary)' : ''}"></i>
          <span class="tooltip-pop">${p.pinned ? 'Unpin' : 'Pin'}</span>
        </button>
        <button class="proj-action-btn tooltip-wrap" onclick="openRenameModal('${p.id}','${escHtml(p.title || 'Untitled')}')" title="Rename">
          <i class="fa-solid fa-pencil"></i>
          <span class="tooltip-pop">Rename</span>
        </button>
        <button class="proj-action-btn tooltip-wrap" onclick="downloadProject('${p.id}')" title="Download">
          <i class="fa-solid fa-download"></i>
          <span class="tooltip-pop">Download PNG</span>
        </button>
        <button class="proj-action-btn danger tooltip-wrap" onclick="deleteProject('${p.id}')" title="Delete">
          <i class="fa-solid fa-trash"></i>
          <span class="tooltip-pop">Delete</span>
        </button>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════════════════
// PROJECT ACTIONS
// ══════════════════════════════════════════════════════════
function loadProjectInGen(id) {
  const p = loadProjects().find(x => x.id === id);
  if (!p) return;

  switchMode('gen');
  setTimeout(() => {
    // Set type
    S.activeType = p.type || 'url';
    document.querySelectorAll('.type-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.type === S.activeType));
    renderTypeForm(S.activeType);

    // Restore design snapshot
    if (p.designSnapshot) {
      try { Object.assign(S, JSON.parse(p.designSnapshot)); } catch {}
    }
    syncAllUI();
    if (typeof updatePickrColors === 'function') updatePickrColors();

    // Fill data field after form rendered
    setTimeout(() => {
      // Try the primary field for this type first, then any qr-input
      const primaryId = {
        url:'f-url', text:'f-text', email:'f-email-to', phone:'f-phone',
        sms:'f-sms-num', wifi:'f-wifi-ssid', vcard:'f-vc-fn',
        whatsapp:'f-wa-num', telegram:'f-tg', location:'f-lat',
        instagram:'f-ig', facebook:'f-fb', youtube:'f-yt',
        twitter:'f-tw', bitcoin:'f-wallet', event:'f-ev-name'
      }[S.activeType] || null;

      const el = (primaryId ? document.getElementById(primaryId) : null)
              || document.querySelector('.qr-input');
      if (el) el.value = p.data || '';
      schedRender(true);
    }, 120);
  }, 200);
}

// Alias used by profile page
function loadProject(id) { loadProjectInGen(id); }

function downloadProject(id) {
  const p = loadProjects().find(x => x.id === id);
  if (!p || !p.qrDataURL) {
    showToast('No preview available — load & regenerate first', 'info'); return;
  }
  triggerDownload(p.qrDataURL, 'qrprism_' + (p.title || 'qr').replace(/\s+/g, '-') + '.png');
}

function togglePinProject(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.pinned = !p.pinned;
  saveProjectsData(projects);
  renderProjects();
  showToast(p.pinned ? 'Project pinned' : 'Unpinned', 'success');
}

function deleteProject(id) {
  const p = loadProjects().find(x => x.id === id);
  if (!p) return;

  const doDelete = () => {
    const updated = loadProjects().filter(x => x.id !== id);
    saveProjectsData(updated);
    renderProjects();
    updateProjectCounts();
    showToast('Project deleted', 'info');
  };

  if (SETTINGS.confirmDelete) {
    showConfirm({
      title: 'Delete Project',
      msg: `Delete "${p.title || 'Untitled'}"? This cannot be undone.`,
      okLabel: 'Delete', okClass: 'btn-danger',
      onConfirm: doDelete,
    });
  } else {
    doDelete();
  }
}

function searchByTag(tag) {
  const el = document.getElementById('project-search');
  if (el) { el.value = tag; renderProjects(tag); }
}

// ══════════════════════════════════════════════════════════
// MULTI-SELECT
// ══════════════════════════════════════════════════════════
function toggleProjectSelect() {
  _selectMode = !_selectMode;
  _selectedIds.clear();
  const bar = document.getElementById('multi-select-bar');
  const btn = document.getElementById('select-btn');
  if (bar) bar.style.display = _selectMode ? 'flex' : 'none';
  if (btn) btn.innerHTML = _selectMode
    ? '<i class="fa-solid fa-xmark"></i> Cancel'
    : '<i class="fa-solid fa-check-square"></i> Select';
  renderProjects();
}

function cancelProjectSelect() {
  _selectMode = false;
  _selectedIds.clear();
  const bar = document.getElementById('multi-select-bar');
  const btn = document.getElementById('select-btn');
  if (bar) bar.style.display = 'none';
  if (btn) btn.innerHTML = '<i class="fa-solid fa-check-square"></i> Select';
  renderProjects();
}

function toggleSelectProject(id, checkbox) {
  if (checkbox?.checked !== undefined) {
    if (checkbox.checked) _selectedIds.add(id);
    else _selectedIds.delete(id);
  } else {
    if (_selectedIds.has(id)) _selectedIds.delete(id);
    else _selectedIds.add(id);
  }
  const cnt = document.getElementById('select-count');
  if (cnt) cnt.textContent = _selectedIds.size + ' selected';
  // Update card highlight
  const card = document.querySelector(`.project-card[data-id="${id}"]`);
  if (card) card.classList.toggle('selected', _selectedIds.has(id));
}

function deleteSelectedProjects() {
  if (!_selectedIds.size) return;
  showConfirm({
    title: 'Delete Selected',
    msg: `Delete ${_selectedIds.size} project(s)? This cannot be undone.`,
    okLabel: 'Delete All', okClass: 'btn-danger',
    onConfirm: () => {
      const updated = loadProjects().filter(p => !_selectedIds.has(p.id));
      saveProjectsData(updated);
      _selectedIds.clear();
      cancelProjectSelect();
      updateProjectCounts();
      showToast('Projects deleted', 'info');
    }
  });
}

function downloadSelectedProjects() {
  if (!_selectedIds.size) return;
  const projects = loadProjects().filter(p => _selectedIds.has(p.id));
  let downloaded = 0;
  projects.forEach(p => {
    if (p.qrDataURL) {
      triggerDownload(p.qrDataURL, 'qrprism_' + (p.title || 'qr').replace(/\s+/g, '-') + '.png');
      downloaded++;
    }
  });
  showToast(`Downloaded ${downloaded} QR code(s)`, 'success');
}

// ══════════════════════════════════════════════════════════
// UPDATE COUNTS (nav badges)
// ══════════════════════════════════════════════════════════
function updateProjectCounts() {
  const projects  = loadProjects();
  const savedCnt  = projects.filter(p => p.savedByUser).length;
  const autoCnt   = projects.filter(p => !p.savedByUser).length;
  const pinnedCnt = projects.filter(p => p.pinned).length;
  const total     = savedCnt;

  // Tab counts
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('saved-count',  savedCnt);
  set('auto-count',   autoCnt);
  set('pinned-count', pinnedCnt);

  // Sidebar / bottom nav badges
  const badge   = document.getElementById('sidebar-project-count');
  const bnBadge = document.getElementById('bn-project-badge');
  if (badge)   { badge.textContent = total; badge.style.display = total > 0 ? '' : 'none'; }
  if (bnBadge) { bnBadge.textContent = total; bnBadge.style.display = total > 0 ? '' : 'none'; }
}

// ══════════════════════════════════════════════════════════
// EXPORT / IMPORT
// ══════════════════════════════════════════════════════════
function exportProjects() {
  const projects = loadProjects();
  if (!projects.length) { showToast('No projects to export', 'info'); return; }
  exportJSON({
    _type: 'qrp_projects', _ver: '2.8',
    _date: new Date().toISOString(),
    _app:  'QR Prism by Muhtasim Rahman (Turzo)',
    projects,
  }, buildExportFilename('projects', projects.length));
  showToast(`Exported ${projects.length} project(s)`, 'success');
}

function handleImportFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      if (json._type === 'qrp_projects' && json.projects) {
        importProjectsData(json.projects);
      } else if (json._type === 'qrp_templates' && json.templates) {
        importTemplatesData(json.templates);
      } else if (json._type === 'qrp_all') {
        if (json.projects)  importProjectsData(json.projects);
        if (json.templates) importTemplatesData(json.templates);
        if (json.settings)  { Object.assign(SETTINGS, json.settings); saveSettingsData(); applyTheme(SETTINGS.theme); }
      } else {
        showToast('Unknown file format', 'error');
      }
    } catch {
      showToast('Invalid JSON file', 'error');
    }
    input.value = '';
    closeModal('import-modal');
  };
  reader.readAsText(file);
}

function importProjectsData(incoming) {
  const existing = loadProjects();
  const ids = new Set(existing.map(p => p.id));
  let added = 0;
  incoming.forEach(p => { if (!ids.has(p.id)) { existing.push(p); added++; } });
  saveProjectsData(existing);
  renderProjects();
  updateProjectCounts();
  showToast(`Imported ${added} project(s)`, 'success');
}

// Helper used by templates.js
function importTemplatesData(incoming) {
  const existing = loadUserTemplates();
  const ids = new Set(existing.map(t => t.id));
  let added = 0;
  incoming.forEach(t => { if (!ids.has(t.id)) { existing.push(t); added++; } });
  saveUserTemplatesData(existing);
  renderUserTemplates();
  if (typeof renderTemplatesManage === 'function') renderTemplatesManage();
  showToast(`Imported ${added} template(s)`, 'success');
}

// ══════════════════════════════════════════════════════════
// DOWNLOAD HELPER
// ══════════════════════════════════════════════════════════
function triggerDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => document.body.removeChild(a), 100);
}

function buildExportFilename(type, count) {
  const d = new Date();
  const ds = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
  return `qr-prism_${type}_${count}_${ds}.json`;
}

function exportJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function exportAllData() {
  const data = {
    _type:     'qrp_all', _ver: '2.8',
    _date:     new Date().toISOString(),
    _app:      'QR Prism by Muhtasim Rahman (Turzo)',
    settings:  SETTINGS,
    projects:  loadProjects(),
    templates: loadUserTemplates(),
  };
  exportJSON(data, buildExportFilename('all-data',
    data.projects.length + data.templates.length));
  showToast('All data exported', 'success');
}
