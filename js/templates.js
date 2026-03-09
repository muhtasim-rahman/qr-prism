// =========================================================
// templates.js — User Templates + Preset Templates
// User templates saved as JSON (part IDs + colors)
// =========================================================

const TEMPLATES_KEY = 'qrs_templates';

// ── Load / Save User Templates ───────────────────────────
function loadUserTemplates() {
  try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY)) || []; }
  catch (e) { return []; }
}

function saveUserTemplateData(templates) {
  try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates)); } catch (e) {}
}

// ── Open Save Modal ───────────────────────────────────────
function openSaveModal() {
  document.getElementById('save-name').value = '';
  openModal('save-modal');
}

// ── Save Current State as Template ───────────────────────
function saveTemplate() {
  const name = document.getElementById('save-name').value.trim();
  if (!name) { showToast('Please enter a template name', 'warning'); return; }

  const templates = loadUserTemplates();
  const tmpl = {
    id:      'utmpl_' + Date.now(),
    name:    name,
    date:    new Date().toISOString(),
    // Save full design state as JSON (with part IDs, not raw drawing code)
    design: {
      pattern:      S.pattern,
      eyeFrame:     S.eyeFrame,
      eyeInner:     S.eyeInner,
      fgColor:      S.fgColor,
      bgColor:      S.bgColor,
      transparent:  S.transparent,
      gradient:     S.gradient,
      gType:        S.gType,
      gc1:          S.gc1,
      gc2:          S.gc2,
      gAngle:       S.gAngle,
      customMarker: S.customMarker,
      mbColor:      S.mbColor,
      mcColor:      S.mcColor,
      customEF:     S.customEF,
      efColor:      S.efColor,
      customEI:     S.customEI,
      eiColor:      S.eiColor,
      frame:        S.frame,
      frameLabel:   S.frameLabel,
      frameFont:    S.frameFont,
      frameTSize:   S.frameTSize,
      frameLabelColor: S.frameLabelColor,
      frameColor:   S.frameColor,
      logoKey:      S.logoKey,
      logoSrc:      S.logoKey ? S.logoSrc : null, // only save if preset logo
      logoSize:     S.logoSize,
      logoBR:       S.logoBR,
      logoPad:      S.logoPad,
      logoPadColor: S.logoPadColor,
      logoRemoveBG: S.logoRemoveBG,
      ec:           S.ec,
      qz:           S.qz,
    }
  };

  templates.unshift(tmpl);
  saveUserTemplateData(templates);
  closeModal('save-modal');
  showToast('Template saved!', 'success');
  renderUserTemplates();
}

// ── Apply Template to State ───────────────────────────────
function applyTemplate(design) {
  Object.assign(S, design);
  syncAllUI();
  schedRender();
}

// ── Render Preset Templates ───────────────────────────────
function renderPresetTemplates() {
  const grid = document.getElementById('preset-tgrid');
  if (!grid) return;
  grid.innerHTML = PRESET_TEMPLATES.map(tmpl => `
    <div class="template-card" onclick="applyTemplate(${JSON.stringify(tmpl.state)})" title="${tmpl.name}">
      <div class="tmpl-thumb" id="ptthumb-${tmpl.id}">
        <canvas width="80" height="80"></canvas>
      </div>
      <div class="tmpl-name">${tmpl.name}</div>
    </div>
  `).join('');
}

// ── Render User Templates ─────────────────────────────────
function renderUserTemplates() {
  const list = document.getElementById('saved-tlist');
  if (!list) return;
  const templates = loadUserTemplates();

  if (!templates.length) {
    list.innerHTML = '<p class="empty-msg">No saved templates yet.</p>';
    return;
  }

  list.innerHTML = templates.map(t => `
    <div class="saved-template-row">
      <div class="st-info" onclick="applyTemplate(${JSON.stringify(t.design)})">
        <i class="fa-solid fa-bookmark" style="color:var(--primary);"></i>
        <span class="st-name">${escHtml(t.name)}</span>
        <span class="st-date">${formatDate(t.date)}</span>
      </div>
      <button class="icon-btn danger" title="Delete" onclick="deleteUserTemplate('${t.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `).join('');
}

// ── Delete User Template ──────────────────────────────────
function deleteUserTemplate(id) {
  if (SETTINGS.confirmDelete && !confirm('Delete this template?')) return;
  const templates = loadUserTemplates().filter(t => t.id !== id);
  saveUserTemplateData(templates);
  renderUserTemplates();
  showToast('Template deleted', 'info');
}

// ── Helpers ───────────────────────────────────────────────
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'});
  } catch { return iso; }
}
