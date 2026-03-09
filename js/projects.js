// =========================================================
// projects.js — QR Prism v2.5
// Projects page: saved & auto-saved QR codes
// Pinning, multi-select, tags, search, categories
// =========================================================

const PROJECTS_KEY = 'qrs_projects';

// ── Load / Save ────────────────────────────────────────────
function loadProjects() {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || []; } catch { return []; }
}
function saveProjectsData(projects) {
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); } catch {}
}

// ── Auto-save (debounced, dedup) ───────────────────────────
let _autoTimer = null;
let _pendingData = null;

function autoSaveToProjects(data) {
  if (!SETTINGS.autoSaveProjects) return;
  if (!data || !data.trim()) return;
  _pendingData = data;
  clearTimeout(_autoTimer);
  _autoTimer = setTimeout(() => {
    if (_pendingData) _doAutoSave(_pendingData);
    _pendingData = null;
  }, 1500);
}

function _doAutoSave(data) {
  const projects = loadProjects();
  // No duplicate: check data + type
  if (projects.find(p => p.data === data && p.type === S.activeType)) return;
  const entry = {
    id:     'proj_' + Date.now(),
    data,
    type:   S.activeType || 'url',
    projType: 'auto',   // 'saved' or 'auto'
    name:   '',
    tags:   [],
    pinned: false,
    date:   new Date().toISOString(),
    design: captureDesignSnapshot(),
  };
  projects.unshift(entry);
  if (projects.length > 200) projects.pop();
  saveProjectsData(projects);
  updateProjectCounts();
  // Update bar
  setAutosaveStatus('saved', 'Auto-saved');
  setTimeout(() => setAutosaveStatus('', ''), 2000);
}

function captureDesignSnapshot() {
  return {
    pattern: S.pattern, eyeFrame: S.eyeFrame, eyeInner: S.eyeInner,
    fgColor: S.fgColor, bgColor: S.bgColor,
    gradient: S.gradient, gc1: S.gc1, gc2: S.gc2, gType: S.gType,
    frame: S.frame, frameLabel: S.frameLabel, frameColor: S.frameColor,
    logoKey: S.logoKey, logoSize: S.logoSize,
    size: S.size, ec: S.ec,
  };
}

// ── State ──────────────────────────────────────────────────
let _projCategory = 'all';   // 'all' | 'saved' | 'auto' | 'pinned'
let _projSearch   = '';
let _projSelected = new Set();
let _projMultiSelect = false;

// ── Render Projects Page ───────────────────────────────────
function renderProjects(query) {
  if (query !== undefined) _projSearch = query;
  const list = document.getElementById('project-list');
  if (!list) return;

  let projects = loadProjects();

  // Filter by category
  if (_projCategory === 'saved')  projects = projects.filter(p => p.projType === 'saved');
  if (_projCategory === 'auto')   projects = projects.filter(p => p.projType === 'auto' || !p.projType);
  if (_projCategory === 'pinned') projects = projects.filter(p => p.pinned);

  // Sort: pinned first, then by date
  projects.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  // Filter by search
  const q = _projSearch.toLowerCase().trim();
  if (q) {
    projects = projects.filter(p =>
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.data && p.data.toLowerCase().includes(q)) ||
      (p.type && p.type.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  // Update category tab counts
  _updateCategoryTabs();

  if (!projects.length) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>${q ? 'কোনো ফলাফল পাওয়া যায়নি।' : 'এখনো কোনো QR সেভ হয়নি।<br>Generator থেকে QR তৈরি করুন।'}</p>
      </div>`;
    return;
  }

  list.innerHTML = projects.map(p => _renderProjectCard(p)).join('');

  // Generate thumbnails asynchronously
  projects.forEach(p => renderProjectThumb(p));
}

function _renderProjectCard(p) {
  const isSelected = _projSelected.has(p.id);
  const typeLabel = p.type ? p.type.toUpperCase().slice(0, 6) : 'URL';
  const savedLabel = p.projType === 'saved' ? 'saved' : 'auto';
  return `
    <div class="project-card ${isSelected ? 'selected' : ''} ${p.pinned ? 'pinned' : ''}" id="pc-${p.id}"
         ${_projMultiSelect ? `onclick="toggleProjectSelect('${p.id}')"` : ''}>
      ${_projMultiSelect ? `
        <div class="proj-select-check ${isSelected ? 'checked' : ''}" onclick="toggleProjectSelect('${p.id}')">
          <i class="fa-solid fa-check"></i>
        </div>` : ''}
      <div class="project-thumb" onclick="${_projMultiSelect ? '' : `loadProjectInGen('${p.id}')`}">
        <canvas id="thumb-${p.id}" width="80" height="80"></canvas>
      </div>
      <div class="project-info">
        <div class="project-name-row">
          <span class="project-name ${!p.name ? 'unnamed' : ''}"
                onclick="${_projMultiSelect ? `toggleProjectSelect('${p.id}')` : `openRenameProject('${p.id}')`}"
                title="Click to rename">
            ${p.name ? escHtmlP(p.name) : '<em style="color:var(--muted)">Unnamed</em>'}
          </span>
          <span class="proj-type-badge">${typeLabel}</span>
          <span class="proj-save-badge proj-save-${savedLabel}">${savedLabel}</span>
          ${p.pinned ? '<i class="fa-solid fa-thumbtack proj-pin-icon"></i>' : ''}
        </div>
        <div class="project-data" title="${escHtmlP(p.data)}">${escHtmlP(truncateP(p.data, 52))}</div>
        <div class="project-tags">
          ${(p.tags||[]).map(t =>
            `<span class="tag-chip">${escHtmlP(t)} <span onclick="removeProjectTag('${p.id}','${escHtmlP(t)}')">×</span></span>`
          ).join('')}
          <button class="tag-add-btn" onclick="addProjectTag('${p.id}')">+ tag</button>
        </div>
        <div class="project-meta">${formatDateP(p.date)}</div>
      </div>
      <div class="project-actions">
        <button class="icon-btn" title="Generator এ লোড করুন" onclick="loadProjectInGen('${p.id}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </button>
        <button class="icon-btn" title="${p.pinned ? 'Unpin' : 'Pin করুন'}" onclick="togglePinProject('${p.id}')">
          <i class="fa-solid fa-thumbtack" style="${p.pinned?'color:var(--primary)':''}"></i>
        </button>
        <button class="icon-btn" title="Download" onclick="downloadProjectPNG('${p.id}')">
          <i class="fa-solid fa-download"></i>
        </button>
        <button class="icon-btn danger" title="Delete" onclick="deleteProjectItem('${p.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>`;
}

// ── Category Tabs ──────────────────────────────────────────
function switchProjCategory(cat, el) {
  _projCategory = cat;
  document.querySelectorAll('.proj-cat-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProjects();
}

function _updateCategoryTabs() {
  const all = loadProjects();
  const counts = {
    all:    all.length,
    saved:  all.filter(p => p.projType === 'saved').length,
    auto:   all.filter(p => p.projType === 'auto' || !p.projType).length,
    pinned: all.filter(p => p.pinned).length,
  };
  Object.entries(counts).forEach(([cat, count]) => {
    const badge = document.getElementById(`pcat-count-${cat}`);
    if (badge) badge.textContent = count;
  });
}

// ── Multi-select ───────────────────────────────────────────
function toggleMultiSelect() {
  _projMultiSelect = !_projMultiSelect;
  _projSelected.clear();
  const btn = document.getElementById('proj-multiselect-btn');
  if (btn) {
    btn.innerHTML = _projMultiSelect
      ? '<i class="fa-solid fa-xmark"></i> বাতিল'
      : '<i class="fa-regular fa-square-check"></i> Select';
    btn.classList.toggle('active', _projMultiSelect);
  }
  const bar = document.getElementById('proj-bulk-bar');
  if (bar) bar.style.display = _projMultiSelect ? 'flex' : 'none';
  renderProjects();
}

function toggleProjectSelect(id) {
  if (_projSelected.has(id)) _projSelected.delete(id);
  else _projSelected.add(id);
  const card = document.getElementById('pc-' + id);
  const check = card?.querySelector('.proj-select-check');
  if (card) card.classList.toggle('selected', _projSelected.has(id));
  if (check) check.classList.toggle('checked', _projSelected.has(id));
  const cnt = document.getElementById('proj-selected-count');
  if (cnt) cnt.textContent = _projSelected.size + ' টি সিলেক্ট করা হয়েছে';
}

function selectAllProjects() {
  const projects = loadProjects();
  projects.forEach(p => _projSelected.add(p.id));
  renderProjects();
}

function deleteSelectedProjects() {
  if (!_projSelected.size) return;
  const count = _projSelected.size;
  showConfirm({
    title: 'সিলেক্ট করা প্রজেক্ট মুছুন',
    msg: `${count}টি প্রজেক্ট স্থায়ীভাবে মুছে ফেলা হবে।`,
    okLabel: 'হ্যাঁ, মুছুন', okClass: 'btn-danger',
    onConfirm: () => {
      const projects = loadProjects().filter(p => !_projSelected.has(p.id));
      saveProjectsData(projects);
      _projSelected.clear();
      _projMultiSelect = false;
      document.getElementById('proj-bulk-bar').style.display = 'none';
      renderProjects();
      updateProjectCounts();
      showToast(`${count}টি প্রজেক্ট মুছে ফেলা হয়েছে`, 'info');
    }
  });
}

// ── Save Project manually ──────────────────────────────────
function openSaveProjectModal() {
  const modal = document.getElementById('save-project-modal');
  const nameInput = document.getElementById('proj-name-input');
  if (nameInput) nameInput.value = '';
  if (modal) openModal('save-project-modal');
}

function confirmSaveProject() {
  const name = document.getElementById('proj-name-input')?.value.trim() || '';
  const qrData = getQRData();
  if (!qrData) { showToast('QR ডেটা নেই', 'error'); return; }

  const entry = {
    id: 'proj_' + Date.now(),
    data: qrData,
    type: S.activeType || 'url',
    projType: 'saved',
    name,
    tags: [],
    pinned: false,
    date: new Date().toISOString(),
    design: captureDesignSnapshot(),
  };
  const projects = loadProjects();
  projects.unshift(entry);
  saveProjectsData(projects);
  closeModal('save-project-modal');
  updateProjectCounts();
  showToast('প্রজেক্ট সেভ হয়েছে!', 'success');
}

// ── Rename Project ─────────────────────────────────────────
function openRenameProject(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const nameInp = document.getElementById('proj-name-input');
  if (nameInp) nameInp.value = p.name || '';
  const modal = document.getElementById('save-project-modal');
  if (modal) {
    const title = modal.querySelector('.modal-title');
    if (title) title.textContent = 'প্রজেক্ট রিনেম';
    modal.dataset.renameId = id;
    openModal('save-project-modal');
  }
}

// Override confirm to handle rename too
function confirmSaveProjectOrRename() {
  const modal = document.getElementById('save-project-modal');
  const renameId = modal?.dataset.renameId;
  if (renameId) {
    const name = document.getElementById('proj-name-input')?.value.trim() || '';
    const projects = loadProjects();
    const p = projects.find(x => x.id === renameId);
    if (p) { p.name = name; saveProjectsData(projects); renderProjects(); showToast('নাম আপডেট হয়েছে', 'success'); }
    delete modal.dataset.renameId;
    closeModal('save-project-modal');
    return;
  }
  confirmSaveProject();
}

// ── Thumbnail ──────────────────────────────────────────────
function renderProjectThumb(p) {
  const canvas = document.getElementById('thumb-' + p.id);
  if (!canvas) return;
  try {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 80, 80);
    const div = document.createElement('div');
    div.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    new QRCode(div, { text: p.data || ' ', width: 80, height: 80, correctLevel: QRCode.CorrectLevel.M });
    const img = div.querySelector('img') || div.querySelector('canvas');
    if (img) {
      if (img.tagName === 'CANVAS') {
        ctx.drawImage(img, 0, 0, 80, 80);
      } else {
        img.onload = () => ctx.drawImage(img, 0, 0, 80, 80);
        if (img.complete) ctx.drawImage(img, 0, 0, 80, 80);
      }
    }
    setTimeout(() => { try { document.body.removeChild(div); } catch {} }, 500);
  } catch {}
}

// ── Pin ────────────────────────────────────────────────────
function togglePinProject(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.pinned = !p.pinned;
  saveProjectsData(projects);
  renderProjects();
  showToast(p.pinned ? 'Pinned!' : 'Unpinned', 'info');
}

// ── Tags ───────────────────────────────────────────────────
function addProjectTag(id) {
  openModal('tag-modal');
  document.getElementById('tag-input').value = '';
  document.getElementById('tag-modal').dataset.targetId = id;
}

function confirmAddTag() {
  const id  = document.getElementById('tag-modal').dataset.targetId;
  const tag = document.getElementById('tag-input')?.value.trim();
  if (!tag) return;
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.tags = p.tags || [];
  if (!p.tags.includes(tag)) { p.tags.push(tag); saveProjectsData(projects); }
  closeModal('tag-modal');
  renderProjects();
}

function removeProjectTag(id, tag) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.tags = (p.tags || []).filter(t => t !== tag);
  saveProjectsData(projects);
  renderProjects();
}

// ── Load in Generator ──────────────────────────────────────
function loadProjectInGen(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  switchMode('gen');
  if (p.type) { S.activeType = p.type; renderTypeTabs(); renderTypeTab(p.type); }
  if (p.design) { Object.assign(S, p.design); syncAllUI(); }
  setTimeout(() => { setInputData(p.type, p.data); schedRender(); }, 150);
  showToast('Generator এ লোড হয়েছে', 'success');
}

function setInputData(type, data) {
  const firstInput = document.querySelector('#form-fields input, #form-fields textarea');
  if (firstInput) firstInput.value = data;
}

// ── Download ───────────────────────────────────────────────
function downloadProjectPNG(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const canvas = document.getElementById('thumb-' + id);
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = (p.name || 'qr-prism') + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('Downloaded!', 'success');
}

// ── Delete ─────────────────────────────────────────────────
function deleteProjectItem(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  const doDelete = () => {
    saveProjectsData(projects.filter(x => x.id !== id));
    document.getElementById('pc-' + id)?.remove();
    updateProjectCounts();
    showToast('মুছে ফেলা হয়েছে', 'info');
  };
  if (SETTINGS.confirmDelete !== false) {
    showConfirm({
      title: 'প্রজেক্ট মুছুন',
      msg: `"${p?.name || p?.data?.slice(0,40) || 'এই প্রজেক্ট'}" মুছে ফেলা হবে।`,
      okLabel: 'হ্যাঁ, মুছুন', okClass: 'btn-danger',
      onConfirm: doDelete,
    });
  } else { doDelete(); }
}

// ── Helpers ────────────────────────────────────────────────
function escHtmlP(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function truncateP(s, n) { s=String(s||''); return s.length>n?s.slice(0,n)+'…':s; }
function formatDateP(iso) {
  try { return new Date(iso).toLocaleDateString('bn-BD',{year:'numeric',month:'short',day:'numeric'}); }
  catch { return iso||''; }
}
