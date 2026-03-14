// =========================================================
// PROJECTS.JS — QR Prism v2.7
// Auto-save, manual save, project cards, tags, search
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const PROJ_KEY = 'qrp_projects';
let _projCategory  = 'saved';
let _selectMode    = false;
let _selectedIds   = new Set();
let _lastAutoSaveData = null;

// ── Load / Save ───────────────────────────────────────────────
function loadProjects() {
  try { return JSON.parse(localStorage.getItem(PROJ_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveProjectsData(projects) {
  try { localStorage.setItem(PROJ_KEY, JSON.stringify(projects)); }
  catch(e) { showToast('Storage full or error', 'error'); }
}

// ── Auto-save (debounced, no duplicates) ──────────────────────
function autoSaveToProjects(data) {
  if (!data || !data.trim()) { setAutosaveStatus('waiting'); return; }

  // Dedup: if same type + same data, just update existing
  const projects = loadProjects();
  const existing = projects.find(p =>
    !p.savedByUser && p.type === S.activeType && p.data === data
  );

  if (existing) {
    existing.updatedAt = Date.now();
    existing.designSnapshot = JSON.stringify(getCurrentDesign());
    const canvas = document.getElementById('qr-canvas');
    if (canvas && canvas.style.display !== 'none') {
      try { existing.qrDataURL = canvas.toDataURL('image/png', 0.7); } catch(e) {}
    }
    saveProjectsData(projects);
    setAutosaveStatus('saved');
    updateProjectCounts();
    _lastAutoSaveData = data;
    return;
  }

  // New auto-save entry
  const canvas = document.getElementById('qr-canvas');
  let qrDataURL = null;
  if (canvas && canvas.style.display !== 'none') {
    try { qrDataURL = canvas.toDataURL('image/png', 0.7); } catch(e) {}
  }

  const proj = {
    id:             'proj_' + Date.now(),
    type:           S.activeType,
    title:          'Untitled',
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
  // Keep max 100 auto-saves
  const autoOnly = projects.filter(p => !p.savedByUser);
  if (autoOnly.length > 100) {
    const oldest = autoOnly[autoOnly.length - 1];
    const idx = projects.findIndex(p => p.id === oldest.id);
    if (idx >= 0) projects.splice(idx, 1);
  }

  saveProjectsData(projects);
  setAutosaveStatus('saved');
  updateProjectCounts();
  _lastAutoSaveData = data;
}

function getCurrentDesign() {
  return {
    pattern: S.pattern, eyeFrame: S.eyeFrame, eyeInner: S.eyeInner,
    fgColor: S.fgColor, bgColor: S.bgColor, transparent: S.transparent,
    gradient: S.gradient, gType: S.gType, gc1: S.gc1, gc2: S.gc2, gAngle: S.gAngle,
    customMarker: S.customMarker, mbColor: S.mbColor, mcColor: S.mcColor,
    customEF: S.customEF, efColor: S.efColor, customEI: S.customEI, eiColor: S.eiColor,
    logoKey: S.logoKey, logoSize: S.logoSize, logoBR: S.logoBR, logoPad: S.logoPad,
    logoPadColor: S.logoPadColor, logoRemoveBG: S.logoRemoveBG,
    frame: S.frame, frameLabel: S.frameLabel, frameFont: S.frameFont,
    frameTSize: S.frameTSize, frameLabelColor: S.frameLabelColor, frameColor: S.frameColor,
    rotation: S.rotation, flipH: S.flipH, flipV: S.flipV, filter: S.filter,
    invert: S.invert, shadow: S.shadow, shadowColor: S.shadowColor, shadowBlur: S.shadowBlur,
    size: S.size, ec: S.ec, qz: S.qz,
  };
}

// ── Manual Save (user clicks "Save Project") ──────────────────
function saveProjectWithName() {
  const nameInput = document.getElementById('save-proj-name');
  const name = nameInput?.value.trim();
  if (!name) { showToast('Please enter a project name', 'error'); return; }

  const data = S.inputData || buildQRData();
  if (!data) { showToast('Generate a QR code first', 'error'); return; }

  const canvas = document.getElementById('qr-canvas');
  let qrDataURL = null;
  if (canvas && canvas.style.display !== 'none') {
    try { qrDataURL = canvas.toDataURL('image/png', 0.75); } catch(e) {}
  }

  const proj = {
    id:             'proj_' + Date.now(),
    type:           S.activeType,
    title:          name,
    data,
    tags:           [],
    qrDataURL,
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

// ── Render Projects ───────────────────────────────────────────
function renderProjects(query = '') {
  const list = document.getElementById('project-list');
  if (!list) return;

  let projects = loadProjects();
  query = (document.getElementById('project-search')?.value || query || '').toLowerCase().trim();

  // Filter by category
  if (_projCategory === 'saved')  projects = projects.filter(p => p.savedByUser);
  if (_projCategory === 'auto')   projects = projects.filter(p => !p.savedByUser);
  if (_projCategory === 'pinned') projects = projects.filter(p => p.pinned);

  // Search filter
  if (query) {
    projects = projects.filter(p =>
      (p.title || '').toLowerCase().includes(query) ||
      (p.data  || '').toLowerCase().includes(query) ||
      (p.tags  || []).some(t => t.toLowerCase().includes(query))
    );
  }

  // Sort: pinned first, then by updatedAt desc
  projects.sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

  updateProjectCounts();

  if (!projects.length) {
    list.innerHTML = `<div class="empty-state">
      <i class="fa-solid fa-folder-open"></i>
      <p>${query ? 'No projects match your search.' : 'No projects here yet.'}</p>
      ${!query && _projCategory === 'saved' ? '<button class="btn btn-outline btn-sm" onclick="switchMode(\'gen\')"><i class="fa-solid fa-wand-magic-sparkles"></i> Generate & Save</button>' : ''}
    </div>`;
    return;
  }

  list.innerHTML = projects.map(p => buildProjectCard(p)).join('');
}

function buildProjectCard(p) {
  const typeInfo = QR_TYPES.find(t => t.key === p.type) || { icon: 'fa-qrcode', title: p.type };
  const date     = formatDate(p.updatedAt || p.createdAt);
  const dataPreview = (p.data || '').slice(0, 80) + (p.data?.length > 80 ? '…' : '');
  const tags     = (p.tags || []).map(t => `<span class="pc-tag" onclick="searchByTag('${escHtml(t)}')">${escHtml(t)}</span>`).join('');
  const isUser   = p.savedByUser ? ' user-saved' : ' autosaved';
  const pinIcon  = p.pinned ? '<i class="fa-solid fa-thumbtack pc-pin-icon"></i>' : '';
  const selectCk = _selectMode ? `<input type="checkbox" class="pc-checkbox" ${_selectedIds.has(p.id) ? 'checked' : ''} onchange="toggleSelectProject('${p.id}',this)">` : '';
  const thumb    = p.qrDataURL
    ? `<img src="${p.qrDataURL}" alt="QR">`
    : `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:var(--text3);font-size:1.5rem;"><i class="fa-solid fa-qrcode"></i></div>`;

  return `<div class="pc-card${isUser}" data-id="${p.id}">
    ${selectCk}
    <div class="pc-thumb" onclick="loadProjectInGen('${p.id}')">${thumb}</div>
    <div class="pc-body">
      <div class="pc-head">
        ${pinIcon}
        <div class="pc-title">${escHtml(p.title || 'Untitled')}</div>
        <span class="pc-type-badge"><i class="${typeInfo.icon}"></i>${escHtml(typeInfo.title || p.type)}</span>
      </div>
      <div class="pc-meta">${date}</div>
      <div class="pc-data">${escHtml(dataPreview)}</div>
      ${tags ? `<div class="pc-tags">${tags}</div>` : ''}
    </div>
    <div class="pc-dot-menu">
      <div class="dot-menu-wrap">
        <button class="icon-btn" onclick="toggleDotMenu('dm-${p.id}',event)">
          <i class="fa-solid fa-ellipsis-vertical"></i>
        </button>
        <div class="dot-menu-dropdown" id="dm-${p.id}">
          <div class="dm-item" onclick="loadProjectInGen('${p.id}');closeDotMenu('dm-${p.id}')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Load in Editor
          </div>
          <div class="dm-item" onclick="downloadProject('${p.id}');closeDotMenu('dm-${p.id}')">
            <i class="fa-solid fa-download"></i> Download PNG
          </div>
          <div class="dm-item" onclick="openRenameModal('${p.id}','${escHtml(p.title || 'Untitled')}');closeDotMenu('dm-${p.id}')">
            <i class="fa-solid fa-pencil"></i> Rename
          </div>
          <div class="dm-item" onclick="openAddTagModal('${p.id}');closeDotMenu('dm-${p.id}')">
            <i class="fa-solid fa-tag"></i> Add Tag
          </div>
          <div class="dm-item" onclick="togglePinProject('${p.id}');closeDotMenu('dm-${p.id}')">
            <i class="fa-solid fa-thumbtack"></i> ${p.pinned ? 'Unpin' : 'Pin'}
          </div>
          <div class="dm-item danger" onclick="deleteProject('${p.id}');closeDotMenu('dm-${p.id}')">
            <i class="fa-solid fa-trash"></i> Delete
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function toggleDotMenu(id, e) {
  e.stopPropagation();
  const menu = document.getElementById(id);
  const isOpen = menu?.classList.contains('open');
  document.querySelectorAll('.dot-menu-dropdown.open').forEach(d => d.classList.remove('open'));
  if (!isOpen && menu) menu.classList.add('open');
}

function closeDotMenu(id) {
  document.getElementById(id)?.classList.remove('open');
}

// ── Project Actions ───────────────────────────────────────────
function loadProjectInGen(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  switchMode('gen');
  setTimeout(() => {
    S.activeType = p.type || 'url';
    document.querySelectorAll('.type-tab').forEach(b =>
      b.classList.toggle('active', b.dataset.type === S.activeType)
    );
    renderTypeTab(S.activeType);
    // Apply design snapshot
    if (p.designSnapshot) {
      try {
        const d = JSON.parse(p.designSnapshot);
        Object.assign(S, d);
        syncAllUI();
        if (typeof updatePickrColors === 'function') updatePickrColors();
      } catch(e) {}
    }
    // Fill data
    setTimeout(() => {
      const el = document.getElementById('f-' + S.activeType) ||
                 document.querySelector('.qr-input');
      if (el) { el.value = p.data || ''; }
      schedRender(true);
    }, 100);
  }, 200);
}

function downloadProject(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p || !p.qrDataURL) { showToast('No preview — load & regenerate', 'info'); return; }
  triggerDownload(p.qrDataURL, 'qr-prism_' + (p.title || 'untitled').replace(/\s+/g,'-') + '.png');
  showToast('Downloading…', 'success');
}

function togglePinProject(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.pinned = !p.pinned;
  saveProjectsData(projects);
  renderProjects();
  showToast(p.pinned ? 'Pinned' : 'Unpinned', 'success');
}

function deleteProject(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  if (SETTINGS.confirmDelete) {
    showConfirm({
      title: 'Delete Project',
      msg: `Delete "${p.title || 'Untitled'}"? This cannot be undone.`,
      okLabel: 'Delete',
      okClass: 'btn-danger',
      onConfirm: () => {
        const updated = loadProjects().filter(x => x.id !== id);
        saveProjectsData(updated);
        renderProjects();
        updateProjectCounts();
        showToast('Project deleted', 'info');
      }
    });
  } else {
    const updated = loadProjects().filter(x => x.id !== id);
    saveProjectsData(updated);
    renderProjects();
    updateProjectCounts();
  }
}

function searchByTag(tag) {
  const searchEl = document.getElementById('project-search');
  if (searchEl) {
    searchEl.value = tag;
    renderProjects(tag);
  }
}

// ── Multi-select ──────────────────────────────────────────────
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
  if (checkbox.checked) _selectedIds.add(id);
  else _selectedIds.delete(id);
  const cnt = document.getElementById('select-count');
  if (cnt) cnt.textContent = _selectedIds.size + ' selected';
}

function deleteSelectedProjects() {
  if (!_selectedIds.size) return;
  showConfirm({
    title: 'Delete Selected',
    msg: `Delete ${_selectedIds.size} project(s)? This cannot be undone.`,
    okLabel: 'Delete All',
    okClass: 'btn-danger',
    onConfirm: () => {
      const projects = loadProjects().filter(p => !_selectedIds.has(p.id));
      saveProjectsData(projects);
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
  projects.forEach(p => {
    if (p.qrDataURL) triggerDownload(p.qrDataURL, 'qr-prism_' + (p.title||'qr').replace(/\s+/g,'-') + '.png');
  });
  showToast(`Downloading ${projects.length} QR code(s)`, 'success');
}

// ── Export / Import ───────────────────────────────────────────
function exportProjects() {
  const projects = loadProjects();
  const data = {
    _type:   'qrp_projects',
    _ver:    '2.7',
    _date:   new Date().toISOString(),
    _copy:   '© QR Prism by Muhtasim Rahman (Turzo)',
    projects,
  };
  exportJSON(data, buildExportFilename('projects', projects.length));
  showToast(`Exported ${projects.length} project(s)`, 'success');
}

function handleImportFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const json = JSON.parse(e.target.result);
      // Auto-detect type
      if (json._type === 'qrp_projects' && json.projects) {
        importProjectsData(json.projects);
      } else if (json._type === 'qrp_templates' && json.templates) {
        importTemplatesData(json.templates);
      } else if (json._type === 'qrp_all') {
        if (json.projects)  importProjectsData(json.projects);
        if (json.templates) importTemplatesData(json.templates);
      } else {
        showToast('Unknown file format', 'error');
      }
    } catch(err) {
      showToast('Invalid JSON file', 'error');
    }
  };
  reader.readAsText(file);
  input.value = '';
  closeModal('import-modal');
}

function importProjectsData(incoming) {
  const existing = loadProjects();
  const existIds = new Set(existing.map(p => p.id));
  let added = 0;
  incoming.forEach(p => {
    if (!existIds.has(p.id)) { existing.push(p); added++; }
  });
  saveProjectsData(existing);
  renderProjects();
  updateProjectCounts();
  showToast(`Imported ${added} project(s)`, 'success');
}

function importTemplatesData(incoming) {
  const existing = loadUserTemplates();
  const existIds = new Set(existing.map(t => t.id));
  let added = 0;
  incoming.forEach(t => {
    if (!existIds.has(t.id)) { existing.push(t); added++; }
  });
  saveUserTemplatesData(existing);
  renderUserTemplates();
  showToast(`Imported ${added} template(s)`, 'success');
}

// ── Tab Switching ────────────────────────────────────────
let _currentProjTab = 'saved';
function switchProjectTab(tab, btn) {
  _currentProjTab = tab;
  document.querySelectorAll('.projects-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProjects(document.getElementById('project-search')?.value || '');
}

// ── Rename Project ───────────────────────────────────────
let _renamingId = null;
function openRenameModal(id) {
  _renamingId = id;
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  const inp = document.getElementById('rename-proj-input');
  if (inp) inp.value = p?.title || '';
  openModal('rename-project-modal');
}
function confirmRenameProject() {
  const name = document.getElementById('rename-proj-input')?.value.trim();
  if (!name || !_renamingId) return;
  const projects = loadProjects();
  const idx = projects.findIndex(x => x.id === _renamingId);
  if (idx !== -1) { projects[idx].title = name; saveProjectsData(projects); }
  closeModal('rename-project-modal');
  renderProjects();
  _renamingId = null;
}
