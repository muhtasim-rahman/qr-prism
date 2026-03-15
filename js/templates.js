// =========================================================
// TEMPLATES.JS — QR Prism v2.8
// Save / load / delete / export / manage user templates
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const TMPL_KEY = 'qrp_templates';

// ══════════════════════════════════════════════════════════
// LOAD / SAVE  (localStorage + Firebase)
// ══════════════════════════════════════════════════════════
function loadUserTemplates() {
  try { return JSON.parse(localStorage.getItem(TMPL_KEY) || '[]'); } catch { return []; }
}

function saveUserTemplatesData(templates) {
  try {
    localStorage.setItem(TMPL_KEY, JSON.stringify(templates));
    if (typeof FB_USER !== 'undefined' && FB_USER && typeof fbDB !== 'undefined') {
      fbDB.ref(`users/${FB_USER.uid}/templates`).set(templates).catch(() => {});
    }
  } catch {
    showToast('Storage error — template not saved', 'error');
  }
}

// ══════════════════════════════════════════════════════════
// SAVE TEMPLATE  (from modal)
// ══════════════════════════════════════════════════════════
function saveTemplate() {
  const nameEl = document.getElementById('save-tmpl-name');
  const name   = nameEl?.value.trim();
  if (!name) { showToast('Please enter a template name', 'error'); return; }

  // Capture all design settings (same keys as getCurrentDesign in projects.js)
  const settings = typeof getCurrentDesign === 'function'
    ? getCurrentDesign()
    : { pattern: S.pattern, eyeFrame: S.eyeFrame, eyeInner: S.eyeInner,
        fgColor: S.fgColor, bgMode: S.bgMode, bgColor: S.bgColor };

  // Capture QR thumbnail
  let thumbnail = null;
  const canvas = document.getElementById('qr-canvas');
  if (canvas && canvas.style.display !== 'none') {
    try { thumbnail = canvas.toDataURL('image/png', 0.70); } catch {}
  }

  const tpl = {
    id:        'tpl_' + Date.now(),
    name,
    settings,
    thumbnail,
    createdAt: Date.now(),
  };

  const templates = loadUserTemplates();
  templates.unshift(tpl);
  saveUserTemplatesData(templates);

  closeModal('save-template-modal');
  renderUserTemplates();
  showToast(`Template "${name}" saved!`, 'success');

  // Update badge
  const badge = document.getElementById('tmpl-badge');
  if (badge) { badge.textContent = templates.length; badge.style.display = ''; }
}

// ══════════════════════════════════════════════════════════
// DELETE TEMPLATE
// ══════════════════════════════════════════════════════════
function deleteUserTemplate(idOrIdx) {
  const templates = loadUserTemplates();
  // Accept either index (number) or id (string)
  const idx = typeof idOrIdx === 'number'
    ? idOrIdx
    : templates.findIndex(t => t.id === idOrIdx);
  const t = templates[idx];
  if (!t) return;

  showConfirm({
    title:   'Delete Template',
    msg:     `Delete "${t.name}"? This cannot be undone.`,
    okLabel: 'Delete',
    okClass: 'btn-danger',
    onConfirm: () => {
      templates.splice(idx, 1);
      saveUserTemplatesData(templates);
      renderUserTemplates();
      renderTemplatesManage();
      showToast('Template deleted', 'info');
    }
  });
}

// ══════════════════════════════════════════════════════════
// TEMPLATES MANAGE PAGE
// ══════════════════════════════════════════════════════════
function renderTemplatesManage() {
  const container = document.getElementById('tmpl-manage-list');
  if (!container) return;

  const templates = loadUserTemplates();

  if (!templates.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-bookmark"></i>
        <p>No saved templates yet.</p>
        <button class="btn btn-outline btn-sm" onclick="switchMode('gen')">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Design &amp; Save a Template
        </button>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div class="template-grid" id="tmpl-manage-grid">
      ${templates.map((t, i) => `
        <div class="template-item" style="position:relative;">
          <div class="tmpl-thumb" onclick="applyUserTemplate(${i})" title="Apply template">
            ${t.thumbnail
              ? `<img src="${t.thumbnail}" alt="${escHtml(t.name)}">`
              : `<canvas width="64" height="64" id="tmm-cv-${i}"></canvas>`}
          </div>
          <div class="tmpl-label">${escHtml(t.name)}</div>
          <div style="display:flex;gap:4px;padding:4px 6px;background:var(--surface2);border-top:1px solid var(--border2);">
            <button class="batch-item-btn" onclick="applyUserTemplate(${i})" title="Apply">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Apply
            </button>
            <button class="batch-item-btn" style="color:var(--danger);" onclick="deleteUserTemplate(${i})" title="Delete">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>`).join('')}
    </div>`;

  // Draw thumbnails for those without a saved one
  requestAnimationFrame(() => {
    templates.forEach((t, i) => {
      if (t.thumbnail) return;
      const cv = document.getElementById(`tmm-cv-${i}`);
      if (cv && typeof drawFallbackThumb === 'function') drawFallbackThumb(cv);
    });
  });
}

// ══════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════
function exportTemplates() {
  const templates = loadUserTemplates();
  if (!templates.length) { showToast('No templates to export', 'info'); return; }
  exportJSON({
    _type:     'qrp_templates', _ver: '2.8',
    _date:     new Date().toISOString(),
    _app:      'QR Prism by Muhtasim Rahman (Turzo)',
    templates,
  }, buildExportFilename('templates', templates.length));
  showToast(`Exported ${templates.length} template(s)`, 'success');
}

// ══════════════════════════════════════════════════════════
// BATCH TEMPLATE LIST  (in Batch Generator page)
// ══════════════════════════════════════════════════════════
let _batchSelectedTemplate = null;  // { settings }

function renderBatchTemplateList() {
  // App preset templates
  const appGrid = document.getElementById('batch-app-template-list');
  if (appGrid && typeof PRESET_TEMPLATES !== 'undefined') {
    appGrid.innerHTML = PRESET_TEMPLATES.map((t, i) => `
      <div class="template-item${_batchSelectedTemplate?.source === 'preset' && _batchSelectedTemplate?.idx === i ? ' active' : ''}"
           onclick="selectBatchTemplate('preset', ${i})" title="${escHtml(t.name)}">
        <div class="tmpl-thumb">
          <canvas width="64" height="64" id="bapt-${i}"></canvas>
        </div>
        <div class="tmpl-label">${escHtml(t.name)}</div>
      </div>`).join('');
    requestAnimationFrame(() => renderTemplateThumbnails(PRESET_TEMPLATES, 'bapt-'));
  }

  // User templates
  const userList = document.getElementById('batch-template-list');
  if (!userList) return;

  const templates = loadUserTemplates();
  if (!templates.length) {
    userList.innerHTML = '<p style="font-size:.76rem;color:var(--text3);">No saved templates yet.</p>';
    return;
  }

  userList.innerHTML = `
    <div class="template-grid">
      ${templates.map((t, i) => `
        <div class="template-item${_batchSelectedTemplate?.source === 'user' && _batchSelectedTemplate?.idx === i ? ' active' : ''}"
             onclick="selectBatchTemplate('user', ${i})" title="${escHtml(t.name)}">
          <div class="tmpl-thumb">
            ${t.thumbnail
              ? `<img src="${t.thumbnail}" alt="${escHtml(t.name)}">`
              : `<canvas width="64" height="64" id="but-${i}"></canvas>`}
          </div>
          <div class="tmpl-label">${escHtml(t.name)}</div>
        </div>`).join('')}
    </div>`;

  requestAnimationFrame(() => {
    templates.forEach((t, i) => {
      if (!t.thumbnail) {
        const cv = document.getElementById(`but-${i}`);
        if (cv && typeof drawFallbackThumb === 'function') drawFallbackThumb(cv);
      }
    });
  });
}

function selectBatchTemplate(source, idx) {
  _batchSelectedTemplate = { source, idx };
  // Update active state
  document.querySelectorAll('#batch-app-template-list .template-item, #batch-template-list .template-item')
    .forEach(el => el.classList.remove('active'));

  const gridId = source === 'preset' ? 'batch-app-template-list' : 'batch-template-list';
  const grid   = document.getElementById(gridId);
  if (grid) {
    const items = grid.querySelectorAll('.template-item');
    if (items[idx]) items[idx].classList.add('active');
  }
  showToast('Template selected for batch', 'success');
}

function getSelectedBatchSettings() {
  if (!_batchSelectedTemplate) return null;
  if (_batchSelectedTemplate.source === 'preset') {
    return PRESET_TEMPLATES[_batchSelectedTemplate.idx]?.settings || null;
  }
  return loadUserTemplates()[_batchSelectedTemplate.idx]?.settings || null;
}
