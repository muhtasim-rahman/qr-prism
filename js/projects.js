// =========================================================
// js/projects.js — QR Project System (replaces History)
// Saves unique QR codes as projects, not per-character
// =========================================================

const PROJECTS_KEY = 'qrs_projects_v2';
let   currentProjectId = null; // currently active project

// ── Load / Save ──────────────────────────────────────────
function getAllProjects() {
  try { return JSON.parse(localStorage.getItem(PROJECTS_KEY) || '[]'); } catch { return []; }
}
function saveAllProjects(projects) {
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); } catch (e) {
    showToast('Storage full — delete some projects', 'error');
  }
}

// ── Auto-save logic: only saves when data actually changes ─
let _lastAutoData = null;
function autoSaveProject(data) {
  if (!data || data === _lastAutoData) return; // no change
  _lastAutoData = data;

  if (!currentProjectId) {
    // New project
    currentProjectId = 'proj_' + Date.now();
    const projects = getAllProjects();
    projects.unshift({
      id: currentProjectId,
      data,
      name: '',
      tags: [],
      type: S.activeType,
      settings: JSON.parse(JSON.stringify(S)),
      thumb: getThumb(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    saveAllProjects(projects);
  } else {
    // Update existing project
    const projects = getAllProjects();
    const idx = projects.findIndex(p => p.id === currentProjectId);
    if (idx === -1) { currentProjectId = null; autoSaveProject(data); return; }
    projects[idx].data      = data;
    projects[idx].type      = S.activeType;
    projects[idx].settings  = JSON.parse(JSON.stringify(S));
    projects[idx].thumb     = getThumb();
    projects[idx].updatedAt = Date.now();
    saveAllProjects(projects);
  }

  // Update project badge count
  updateProjectsBadge();
}

function getThumb() {
  try {
    const canvas = document.getElementById('qr-canvas');
    if (!canvas || canvas.style.display === 'none') return '';
    const tmp = document.createElement('canvas'); tmp.width = 80; tmp.height = 80;
    tmp.getContext('2d').drawImage(canvas, 0, 0, 80, 80);
    return tmp.toDataURL();
  } catch { return ''; }
}

// ── Create a brand new project (from scratch) ─────────────
function newProject() {
  currentProjectId = null;
  _lastAutoData    = null;
  // Reset to defaults but keep design preferences
  S.inputData  = '';
  S.activeType = 'url';
  // Clear all inputs
  document.querySelectorAll('.qr-input').forEach(el => {
    if (el.type === 'checkbox') el.checked = false;
    else if (el.tagName === 'SELECT') el.selectedIndex = 0;
    else el.value = '';
  });
  switchQRType('url');
  renderQR();
  showToast('New project started', 'info');
}

// ── Render the projects page ──────────────────────────────
function renderProjectsView(search = '') {
  const container = document.getElementById('projects-list');
  if (!container) return;

  let projects = getAllProjects();

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase();
    projects = projects.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.data || '').toLowerCase().includes(q) ||
      (p.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  if (!projects.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>${search ? 'No projects match your search' : 'No QR codes saved yet.<br>Generate a QR code to get started!'}</p>
      </div>`;
    return;
  }

  container.innerHTML = projects.map(p => `
    <div class="project-card${currentProjectId === p.id ? ' active' : ''}" data-id="${p.id}">
      <div class="project-thumb-wrap">
        ${p.thumb
          ? `<img src="${p.thumb}" alt="QR" class="project-thumb">`
          : `<div class="project-thumb-empty"><i class="fa-solid fa-qrcode"></i></div>`}
      </div>
      <div class="project-info">
        <div class="project-name" onclick="editProjectName('${p.id}', this)">
          ${escHtml(p.name || p.data?.substring(0, 30) || 'Untitled')}
        </div>
        <div class="project-meta">
          <span class="project-type-badge">${p.type || 'url'}</span>
          <span class="project-date">${formatDate(p.updatedAt)}</span>
        </div>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="project-tag" onclick="removeTag('${p.id}','${escHtml(t)}')">${escHtml(t)} ×</span>`).join('')}
          <button class="tag-add-btn" onclick="addTag('${p.id}')"><i class="fa-solid fa-plus"></i> tag</button>
        </div>
      </div>
      <div class="project-actions">
        <button class="btn btn-primary btn-xs" onclick="loadProject('${p.id}')" title="Open"><i class="fa-solid fa-folder-open"></i></button>
        <button class="btn btn-outline btn-xs" onclick="downloadProjectQR('${p.id}')" title="Download"><i class="fa-solid fa-download"></i></button>
        <button class="btn btn-danger btn-xs" onclick="deleteProject('${p.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>
  `).join('');
}

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-BD', { day:'numeric', month:'short', year:'numeric' });
}

// ── Load a project ────────────────────────────────────────
function loadProject(id) {
  const projects = getAllProjects();
  const p = projects.find(p => p.id === id);
  if (!p) return;
  currentProjectId = id;
  _lastAutoData    = p.data;
  Object.assign(S, p.settings);
  switchQRType(p.type || 'url', false);
  syncAllUI();
  renderQR();
  switchView('gen');
  showToast('Project loaded: ' + (p.name || 'Untitled'), 'success');
}

// ── Delete project ────────────────────────────────────────
function deleteProject(id) {
  if (!confirm('Delete this QR code project?')) return;
  const projects = getAllProjects().filter(p => p.id !== id);
  saveAllProjects(projects);
  if (currentProjectId === id) { currentProjectId = null; _lastAutoData = null; }
  renderProjectsView(document.getElementById('projects-search')?.value || '');
  updateProjectsBadge();
  showToast('Project deleted', 'info');
}

// ── Edit project name ─────────────────────────────────────
function editProjectName(id, el) {
  const current = el.textContent.trim();
  const input = document.createElement('input');
  input.type = 'text'; input.value = current === 'Untitled' ? '' : current;
  input.className = 'inline-edit-input';
  el.replaceWith(input); input.focus();
  const save = () => {
    const name = input.value.trim();
    const projects = getAllProjects();
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) { projects[idx].name = name; saveAllProjects(projects); }
    const span = document.createElement('div');
    span.className = 'project-name'; span.onclick = () => editProjectName(id, span);
    span.textContent = name || 'Untitled';
    input.replaceWith(span);
  };
  input.addEventListener('blur', save);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') input.blur(); if (e.key === 'Escape') { input.value = current; input.blur(); } });
}

// ── Tags ──────────────────────────────────────────────────
function addTag(id) {
  const tag = prompt('Add tag:');
  if (!tag || !tag.trim()) return;
  const projects = getAllProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  if (!projects[idx].tags) projects[idx].tags = [];
  if (!projects[idx].tags.includes(tag.trim())) projects[idx].tags.push(tag.trim());
  saveAllProjects(projects);
  renderProjectsView(document.getElementById('projects-search')?.value || '');
}

function removeTag(id, tag) {
  const projects = getAllProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  projects[idx].tags = (projects[idx].tags || []).filter(t => t !== tag);
  saveAllProjects(projects);
  renderProjectsView(document.getElementById('projects-search')?.value || '');
}

// ── Clear all projects ────────────────────────────────────
function clearAllProjects() {
  if (!confirm('Delete ALL QR code projects? This cannot be undone.')) return;
  saveAllProjects([]);
  currentProjectId = null; _lastAutoData = null;
  renderProjectsView();
  updateProjectsBadge();
  showToast('All projects cleared', 'info');
}

// ── Download project QR ───────────────────────────────────
function downloadProjectQR(id) {
  const projects = getAllProjects();
  const p = projects.find(p => p.id === id);
  if (!p?.thumb) { showToast('No preview available', 'warning'); return; }
  const a = document.createElement('a');
  a.href = p.thumb; a.download = (p.name || 'qr-code') + '.png'; a.click();
}

// ── Badge count ───────────────────────────────────────────
function updateProjectsBadge() {
  const count = getAllProjects().length;
  const badge = document.getElementById('projects-badge');
  if (badge) { badge.textContent = count; badge.style.display = count > 0 ? '' : 'none'; }
}
