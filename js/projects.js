// =========================================================
// projects.js — QR Projects (saved + auto-saved + pinned)
// QR Prism v2.4
// =========================================================

const PROJECTS_KEY = 'qrp_projects_v4';
let _projectTab = 'saved';
let _selectMode = false;
let _selectedIds = new Set();

// ── Load / Save ───────────────────────────────────────────
function loadProjects() {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []; } catch { return []; }
}
function saveProjectsData(projects) {
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); } catch {}
}

// ── Auto-save (debounced) ─────────────────────────────────
let _autoSaveTimer = null;
let _pendingAutoData = null;

function autoSaveToProjects(data) {
  if (!SETTINGS.autoSaveProjects) return;
  if (!data?.trim()) return;
  _pendingAutoData = data;
  clearTimeout(_autoSaveTimer);
  _autoSaveTimer = setTimeout(() => {
    if (_pendingAutoData) _doAutoSave(_pendingAutoData);
    _pendingAutoData = null;
  }, 1500);
}

function _doAutoSave(data) {
  const projects = loadProjects();
  if (projects.find(p => p.data === data)) return; // skip duplicate
  const entry = {
    id: 'auto_' + Date.now(),
    data,
    type: S.activeType,
    name: '',
    tags: [],
    date: new Date().toISOString(),
    design: captureDesignSnapshot(),
    pinned: false,
    autoSaved: true,
  };
  projects.unshift(entry);
  if (projects.filter(p => p.autoSaved).length > 100) {
    // Remove oldest auto-saved entries beyond 100
    let autoCount = 0;
    const trimmed = projects.filter(p => {
      if (p.autoSaved) { autoCount++; return autoCount <= 100; }
      return true;
    });
    saveProjectsData(trimmed);
  } else {
    saveProjectsData(projects);
  }
  updateProjectCountBadge();
  showAutosaveIndicator();

  if (_currentMode === 'projects') renderProjects();
}

// ── Named save ────────────────────────────────────────────
function saveNamedProject(name) {
  if (!S.inputData?.trim()) return showToast('No QR data to save', 'warning');
  const projects = loadProjects();
  const entry = {
    id: 'proj_' + Date.now(),
    data: S.inputData,
    type: S.activeType,
    name: name || 'My Project',
    tags: [],
    date: new Date().toISOString(),
    design: captureDesignSnapshot(),
    pinned: false,
    autoSaved: false,
  };
  projects.unshift(entry);
  saveProjectsData(projects);
  updateProjectCountBadge();
  showToast(`Saved: "${entry.name}"`, 'success');
  if (_currentMode === 'projects') renderProjects();
}

// ── Autosave indicator ────────────────────────────────────
let _autosaveHideTimer = null;
function showAutosaveIndicator() {
  const bar = document.getElementById('autosave-bar');
  const txt = document.getElementById('autosave-txt');
  if (!bar) return;
  if (txt) txt.textContent = 'Auto-saved';
  bar.style.display = 'flex';
  clearTimeout(_autosaveHideTimer);
  _autosaveHideTimer = setTimeout(() => { bar.style.display = 'none'; }, 2500);
}

// ── Switch project tab ────────────────────────────────────
function switchProjectTab(tab, el) {
  _projectTab = tab;
  document.querySelectorAll('.projects-tab').forEach(b => b.classList.remove('active'));
  el?.classList.add('active');
  renderProjects(document.getElementById('project-search')?.value || '');
}

// ── Render Projects ───────────────────────────────────────
function renderProjects(query = '') {
  const list = document.getElementById('project-list');
  if (!list) return;

  let projects = loadProjects();
  const q = query.toLowerCase().trim();

  // Filter by tab
  if (_projectTab === 'saved')  projects = projects.filter(p => !p.autoSaved);
  if (_projectTab === 'auto')   projects = projects.filter(p => p.autoSaved);
  if (_projectTab === 'pinned') projects = projects.filter(p => p.pinned);

  // Search filter
  if (q) projects = projects.filter(p =>
    (p.name  && p.name.toLowerCase().includes(q)) ||
    (p.data  && p.data.toLowerCase().includes(q)) ||
    (p.tags  && p.tags.some(t => t.toLowerCase().includes(q))) ||
    (p.type  && p.type.toLowerCase().includes(q))
  );

  // Update counts
  const all = loadProjects();
  document.getElementById('saved-count').textContent  = all.filter(p => !p.autoSaved).length;
  document.getElementById('auto-count').textContent   = all.filter(p => p.autoSaved).length;
  document.getElementById('pinned-count').textContent = all.filter(p => p.pinned).length;

  if (!projects.length) {
    list.innerHTML = `<div class="empty-state"><i class="fa-solid fa-folder-open"></i>
      <p>${q ? 'No matching projects.' : _projectTab === 'pinned' ? 'No pinned projects.' : _projectTab === 'auto' ? 'No auto-saved projects yet.' : 'No saved projects yet.<br>Generate a QR and save it!'}</p></div>`;
    return;
  }

  // Sort: pinned first, then by date
  projects.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  const isSelecting = _selectMode;
  list.innerHTML = projects.map(p => {
    const typeIcon = TYPE_ICONS[p.type] || 'fa-qrcode';
    const typeName = QR_TYPES.find(t => t.key === p.type)?.label || p.type || 'QR';
    const isSelected = _selectedIds.has(p.id);
    return `
    <div class="project-card ${p.pinned ? 'pinned' : ''} ${p.autoSaved ? 'auto-saved' : ''} ${isSelected ? 'selected' : ''} ${isSelecting ? 'selecting' : ''}"
         id="pc-${p.id}">
      <div class="project-select-chk ${isSelected ? 'checked' : ''}" onclick="toggleProjectSelect_item('${p.id}', this)"></div>
      <div class="project-qr-thumb" onclick="loadProjectInGen('${p.id}')">
        <canvas width="64" height="64" id="thumb-${p.id}"></canvas>
      </div>
      <div class="project-body">
        <div class="project-top-row">
          <span class="project-name ${!p.name ? 'unnamed' : ''}" onclick="editProjectName('${p.id}')">
            ${p.name ? escHtml(p.name) : '<em style="color:var(--text3);font-weight:400;">Untitled</em>'}
          </span>
          <div class="project-3dot">
            <button class="icon-btn" onclick="toggleProjectMenu('${p.id}')" style="width:28px;height:28px;font-size:.8rem;">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="dropdown-menu" id="pm-${p.id}">
              <button class="dropdown-item" onclick="loadProjectInGen('${p.id}')">
                <i class="fa-solid fa-wand-magic-sparkles"></i> Load in Generator
              </button>
              <button class="dropdown-item" onclick="downloadProjectPNG('${p.id}')">
                <i class="fa-solid fa-download"></i> Download PNG
              </button>
              <button class="dropdown-item" onclick="editProjectName('${p.id}')">
                <i class="fa-solid fa-pencil"></i> Rename
              </button>
              <button class="dropdown-item" onclick="toggleProjectPin('${p.id}')">
                <i class="fa-solid fa-thumbtack"></i> ${p.pinned ? 'Unpin' : 'Pin'}
              </button>
              <div class="dropdown-sep"></div>
              <button class="dropdown-item danger" onclick="deleteProject('${p.id}')">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
        <div class="project-meta-row">
          <span class="project-type-badge"><i class="fa-solid ${typeIcon}"></i> ${typeName}</span>
          ${p.autoSaved ? '<span class="project-auto-badge">Auto</span>' : ''}
          <span class="project-date">${formatDate(p.date)}</span>
        </div>
        <div class="project-data">${escHtml(truncate(p.data, 80))}</div>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag-chip" onclick="removeTag('${p.id}','${escHtml(t)}')">${escHtml(t)} ×</span>`).join('')}
          <button class="tag-add-btn" onclick="addTag('${p.id}')">+ tag</button>
        </div>
      </div>
    </div>`;
  }).join('');

  // Render thumbnails
  projects.forEach(p => renderProjectThumb(p));

  // Show/hide multi-select bar
  const bar = document.getElementById('multi-select-bar');
  if (bar) bar.classList.toggle('show', _selectMode && _selectedIds.size > 0);
  const countEl = document.getElementById('select-count');
  if (countEl) countEl.textContent = `${_selectedIds.size} selected`;
}

// ── Thumbnail rendering ───────────────────────────────────
function renderProjectThumb(p) {
  const canvas = document.getElementById('thumb-' + p.id);
  if (!canvas) return;
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    new QRCode(div, { text: p.data || ' ', width: 64, height: 64, correctLevel: QRCode.CorrectLevel.M });
    setTimeout(() => {
      const img = div.querySelector('img') || div.querySelector('canvas');
      if (img) {
        const ctx = canvas.getContext('2d');
        const tmp = new Image();
        tmp.onload = () => ctx.drawImage(tmp, 0, 0, 64, 64);
        tmp.src = img.src || img.toDataURL?.();
      }
      div.remove();
    }, 60);
  } catch(e) {}
}

// ── 3-dot Menu ────────────────────────────────────────────
function toggleProjectMenu(id) {
  const menu = document.getElementById('pm-' + id);
  if (!menu) return;
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.dropdown-menu.open').forEach(d => d.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
}

// ── Select mode ───────────────────────────────────────────
function toggleProjectSelect() {
  _selectMode = !_selectMode;
  if (!_selectMode) { _selectedIds.clear(); }
  renderProjects(document.getElementById('project-search')?.value || '');
}

function cancelProjectSelect() {
  _selectMode = false;
  _selectedIds.clear();
  renderProjects(document.getElementById('project-search')?.value || '');
}

function toggleProjectSelect_item(id, el) {
  if (!_selectMode) return;
  if (_selectedIds.has(id)) {
    _selectedIds.delete(id);
    el.classList.remove('checked');
    document.getElementById('pc-' + id)?.classList.remove('selected');
  } else {
    _selectedIds.add(id);
    el.classList.add('checked');
    document.getElementById('pc-' + id)?.classList.add('selected');
  }
  const bar = document.getElementById('multi-select-bar');
  bar?.classList.toggle('show', _selectedIds.size > 0);
  const countEl = document.getElementById('select-count');
  if (countEl) countEl.textContent = `${_selectedIds.size} selected`;
}

function deleteSelectedProjects() {
  if (!_selectedIds.size) return;
  showConfirm({
    title: 'Delete Selected',
    msg: `Delete ${_selectedIds.size} selected project(s)? This cannot be undone.`,
    okLabel: 'Delete',
    onConfirm: () => {
      let projects = loadProjects().filter(p => !_selectedIds.has(p.id));
      saveProjectsData(projects);
      _selectedIds.clear();
      _selectMode = false;
      updateProjectCountBadge();
      renderProjects();
      showToast('Projects deleted', 'success');
    }
  });
}

function downloadSelectedProjects() {
  const projects = loadProjects().filter(p => _selectedIds.has(p.id));
  if (!projects.length) return;
  // Simple download all as JSON for now
  downloadJSON({ projects }, `qr-prism_selected_${projects.length}.json`);
  showToast(`Downloaded ${projects.length} projects`, 'success');
}

// ── Project actions ───────────────────────────────────────
function editProjectName(id) {
  const projects = loadProjects();
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  const newName = prompt('Rename project:', p.name || '');
  if (newName === null) return;
  p.name = newName.trim();
  p.autoSaved = false; // promoted to saved
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
  showToast('Project renamed', 'success');
}

function toggleProjectPin(id) {
  const projects = loadProjects();
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  p.pinned = !p.pinned;
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
  showToast(p.pinned ? 'Project pinned 📌' : 'Project unpinned', 'info');
}

function deleteProject(id) {
  const projects = loadProjects();
  const p = projects.find(pr => pr.id === id);
  showConfirm({
    title: 'Delete Project',
    msg: `Delete "${p?.name || 'Untitled'}"? This cannot be undone.`,
    okLabel: 'Delete',
    onConfirm: () => {
      saveProjectsData(projects.filter(pr => pr.id !== id));
      updateProjectCountBadge();
      renderProjects(document.getElementById('project-search')?.value || '');
      showToast('Project deleted', 'info');
    }
  });
}

function loadProjectInGen(id) {
  const p = loadProjects().find(pr => pr.id === id);
  if (!p) return;
  S.inputData = p.data;
  S.activeType = p.type || 'url';
  if (p.design) Object.assign(S, p.design);

  switchMode('gen');
  renderTypeTabs();
  renderTypeTab(S.activeType);
  syncUIFromState();
  schedRender();
  showToast('Project loaded', 'success');
}

function downloadProjectPNG(id) {
  const p = loadProjects().find(pr => pr.id === id);
  if (!p) return;
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    new QRCode(div, { text: p.data || ' ', width: 512, height: 512, correctLevel: QRCode.CorrectLevel.H });
    setTimeout(() => {
      const img = div.querySelector('img');
      if (img) {
        const a = document.createElement('a');
        a.href = img.src;
        a.download = `qr-prism-${(p.name || 'project').replace(/\s+/g,'-')}.png`;
        a.click();
      }
      div.remove();
    }, 100);
  } catch(e) { showToast('Download failed', 'error'); }
}

// ── Tags ──────────────────────────────────────────────────
function addTag(id) {
  const tag = prompt('Add a tag:');
  if (!tag?.trim()) return;
  const projects = loadProjects();
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  if (!p.tags) p.tags = [];
  if (!p.tags.includes(tag.trim())) p.tags.push(tag.trim());
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
}

function removeTag(id, tag) {
  const projects = loadProjects();
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  p.tags = (p.tags || []).filter(t => t !== tag);
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
}

// ── Clear all projects ────────────────────────────────────
function clearAllProjects() {
  const count = loadProjects().length;
  showConfirm({
    title: 'Clear All Projects',
    msg: `This will permanently delete all ${count} saved projects.`,
    list: ['All saved projects', 'All auto-saved history'],
    okLabel: 'Delete All',
    onConfirm: () => {
      localStorage.removeItem(PROJECTS_KEY);
      updateProjectCountBadge();
      renderProjects();
      showToast('All projects cleared', 'info');
    }
  });
}
