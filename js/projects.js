// =========================================================
// projects.js — QR Projects Page (replaces History)
// Saves unique QR codes, prevents per-character duplicates
// Data stored as JSON in localStorage
// =========================================================

const PROJECTS_KEY = 'qrs_projects_v2';

// ── Load / Save ──────────────────────────────────────────
function loadProjects() {
  try {
    return JSON.parse(localStorage.getItem(PROJECTS_KEY)) || [];
  } catch (e) { return []; }
}

function saveProjectsData(projects) {
  try { localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects)); } catch (e) {}
}

// ── Auto-save debounce (prevents per-character saves) ────
let autoSaveTimer = null;
let pendingAutoData = null;

function autoSaveToProjects(data) {
  if (!SETTINGS.autoSaveProjects) return;
  if (!data || !data.trim()) return;
  pendingAutoData = data;
  clearTimeout(autoSaveTimer);
  // Only save after user stops typing for 1.5s
  autoSaveTimer = setTimeout(() => {
    if (pendingAutoData) _doAutoSave(pendingAutoData);
    pendingAutoData = null;
  }, 1500);
}

function _doAutoSave(data) {
  const projects = loadProjects();
  // Check if this exact data already exists
  const exists = projects.find(p => p.data === data);
  if (exists) return; // No duplicate

  const entry = {
    id:      'proj_' + Date.now(),
    data:    data,
    type:    S.activeType,
    name:    '', // user can name it later
    tags:    [],
    date:    new Date().toISOString(),
    design:  captureDesignSnapshot(),
  };
  projects.unshift(entry);
  // Keep max 200
  if (projects.length > 200) projects.pop();
  saveProjectsData(projects);
  // Refresh if on projects page
  if (document.getElementById('mode-projects')?.style.display !== 'none') {
    renderProjects();
  }
}

// ── Capture current design state for a project entry ─────
function captureDesignSnapshot() {
  return {
    pattern:  S.pattern,
    eyeFrame: S.eyeFrame,
    eyeInner: S.eyeInner,
    fgColor:  S.fgColor,
    bgColor:  S.bgColor,
    gradient: S.gradient,
    gc1:      S.gc1,
    gc2:      S.gc2,
    frame:    S.frame,
    logoKey:  S.logoKey,
  };
}

// ── Render Projects Page ──────────────────────────────────
function renderProjects(query = '') {
  const list = document.getElementById('project-list');
  if (!list) return;
  let projects = loadProjects();
  const q = query.toLowerCase().trim();

  if (q) {
    projects = projects.filter(p =>
      (p.name  && p.name.toLowerCase().includes(q)) ||
      (p.data  && p.data.toLowerCase().includes(q)) ||
      (p.tags  && p.tags.some(t => t.toLowerCase().includes(q))) ||
      (p.type  && p.type.toLowerCase().includes(q))
    );
  }

  if (!projects.length) {
    list.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-folder-open"></i>
        <p>${q ? 'No results found.' : 'No saved QR codes yet.<br>Generate a QR and it will appear here.'}</p>
      </div>`;
    return;
  }

  list.innerHTML = projects.map(p => `
    <div class="project-card" id="pc-${p.id}">
      <div class="project-thumb">
        <canvas id="thumb-${p.id}" width="80" height="80"></canvas>
      </div>
      <div class="project-info">
        <div class="project-name-row">
          <span class="project-name ${!p.name ? 'unnamed' : ''}"
                onclick="editProjectName('${p.id}')"
                title="Click to rename">
            ${p.name || '<em>Unnamed</em>'}
          </span>
          <span class="project-type-badge">${p.type || 'url'}</span>
        </div>
        <div class="project-data" title="${escHtml(p.data)}">${escHtml(truncate(p.data, 48))}</div>
        <div class="project-tags">
          ${(p.tags || []).map(t => `<span class="tag-chip" onclick="removeTag('${p.id}','${escHtml(t)}')">${escHtml(t)} ×</span>`).join('')}
          <button class="tag-add-btn" onclick="addTag('${p.id}')">+ tag</button>
        </div>
        <div class="project-date">${formatDate(p.date)}</div>
      </div>
      <div class="project-actions">
        <button class="icon-btn" title="Load in Generator" onclick="loadProjectInGen('${p.id}')">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
        </button>
        <button class="icon-btn" title="Download PNG" onclick="downloadProjectPNG('${p.id}')">
          <i class="fa-solid fa-download"></i>
        </button>
        <button class="icon-btn danger" title="Delete" onclick="deleteProject('${p.id}')">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>
  `).join('');

  // Generate thumbnails asynchronously
  projects.forEach(p => renderProjectThumb(p));
}

// ── Render a small thumbnail QR for a project ────────────
function renderProjectThumb(p) {
  const canvas = document.getElementById('thumb-' + p.id);
  if (!canvas) return;
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;';
    document.body.appendChild(div);
    new QRCode(div, { text: p.data || ' ', width: 80, height: 80, correctLevel: QRCode.CorrectLevel.M });
    const img = div.querySelector('img') || div.querySelector('canvas');
    if (img) {
      const ctx = canvas.getContext('2d');
      if (img.tagName === 'CANVAS') {
        ctx.drawImage(img, 0, 0, 80, 80);
      } else {
        const i = new Image();
        i.onload = () => ctx.drawImage(i, 0, 0, 80, 80);
        i.src = img.src;
      }
    }
    document.body.removeChild(div);
  } catch (e) {}
}

// ── Edit project name ─────────────────────────────────────
function editProjectName(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const name = prompt('Project name:', p.name || '');
  if (name === null) return;
  p.name = name.trim();
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
}

// ── Add tag ───────────────────────────────────────────────
function addTag(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const tag = prompt('Add tag:');
  if (!tag || !tag.trim()) return;
  p.tags = p.tags || [];
  if (!p.tags.includes(tag.trim())) p.tags.push(tag.trim());
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
}

// ── Remove tag ────────────────────────────────────────────
function removeTag(id, tag) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  p.tags = (p.tags || []).filter(t => t !== tag);
  saveProjectsData(projects);
  renderProjects(document.getElementById('project-search')?.value || '');
}

// ── Load project into generator ───────────────────────────
function loadProjectInGen(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  // Switch to generator
  switchMode('gen');
  // Set type
  if (p.type) {
    S.activeType = p.type;
    renderTypeTab(p.type);
  }
  // Restore design if available
  if (p.design) {
    Object.assign(S, p.design);
  }
  // Set input data
  setTimeout(() => {
    setInputData(p.type, p.data);
    schedRender();
  }, 100);
  showToast('Loaded in Generator', 'success');
}

// ── Set raw input data back into form ────────────────────
function setInputData(type, data) {
  // Simple approach: set URL input if URL type
  if (type === 'url') {
    const el = document.getElementById('f-url');
    if (el) { el.value = data; return; }
  }
  if (type === 'text') {
    const el = document.getElementById('f-text');
    if (el) { el.value = data; return; }
  }
  // For other types just set URL as fallback
  const el = document.getElementById('f-url');
  if (el) el.value = data;
}

// ── Download project as PNG ───────────────────────────────
function downloadProjectPNG(id) {
  const projects = loadProjects();
  const p = projects.find(x => x.id === id);
  if (!p) return;
  const canvas = document.getElementById('thumb-' + id);
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = (p.name || 'qr-code') + '.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
  showToast('Downloaded!', 'success');
}

// ── Delete project ────────────────────────────────────────
function deleteProject(id) {
  if (SETTINGS.confirmDelete && !confirm('Delete this QR code?')) return;
  const projects = loadProjects().filter(p => p.id !== id);
  saveProjectsData(projects);
  const card = document.getElementById('pc-' + id);
  if (card) card.remove();
  renderProjects(document.getElementById('project-search')?.value || '');
  showToast('Deleted', 'info');
}

// ── Clear all projects ────────────────────────────────────
function clearAllProjects() {
  if (!confirm('Delete ALL saved QR codes? This cannot be undone.')) return;
  saveProjectsData([]);
  renderProjects();
  showToast('All projects cleared', 'info');
}

// ── Helpers ───────────────────────────────────────────────
function escHtml(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function truncate(s, n) {
  s = String(s || '');
  return s.length > n ? s.slice(0, n) + '…' : s;
}
function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year:'numeric', month:'short', day:'numeric' });
  } catch { return iso; }
}
