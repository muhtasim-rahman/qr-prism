// =========================================================
// TEMPLATES.JS — QR Prism v2.7
// Save / load / export / import user templates
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const TMPL_KEY = 'qrp_templates';

function loadUserTemplates() {
  try { return JSON.parse(localStorage.getItem(TMPL_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveUserTemplatesData(templates) {
  try { localStorage.setItem(TMPL_KEY, JSON.stringify(templates)); }
  catch(e) { showToast('Storage error', 'error'); }
}

function saveTemplate() {
  const name = document.getElementById('save-tmpl-name')?.value.trim();
  if (!name) { showToast('Please enter a template name', 'error'); return; }

  const design = {
    pattern: S.pattern, eyeFrame: S.eyeFrame, eyeInner: S.eyeInner,
    fgColor: S.fgColor, bgColor: S.bgColor, transparent: S.transparent,
    gradient: S.gradient, gType: S.gType, gc1: S.gc1, gc2: S.gc2, gAngle: S.gAngle,
    customMarker: S.customMarker, mbColor: S.mbColor, mcColor: S.mcColor,
    customEF: S.customEF, efColor: S.efColor, customEI: S.customEI, eiColor: S.eiColor,
    logoKey: S.logoKey, logoSize: S.logoSize, logoBR: S.logoBR,
    logoPad: S.logoPad, logoPadColor: S.logoPadColor, logoRemoveBG: S.logoRemoveBG,
    frame: S.frame, frameLabel: S.frameLabel, frameFont: S.frameFont,
    frameTSize: S.frameTSize, frameLabelColor: S.frameLabelColor, frameColor: S.frameColor,
  };

  const templates = loadUserTemplates();
  templates.unshift({ id: 'tpl_' + Date.now(), name, design, createdAt: Date.now() });
  saveUserTemplatesData(templates);

  closeModal('save-template-modal');
  renderUserTemplates();
  showToast(`Template "${name}" saved!`, 'success');
}

function applyUserTemplate(idx) {
  const templates = loadUserTemplates();
  const t = templates[idx];
  if (!t) return;
  pushUndo();
  Object.assign(S, t.design);
  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  schedRender();
  showToast(`Template "${t.name}" applied`, 'success');
}

function deleteUserTemplate(idx) {
  const templates = loadUserTemplates();
  const t = templates[idx];
  if (!t) return;
  showConfirm({
    title: 'Delete Template',
    msg: `Delete "${t.name}"?`,
    okLabel: 'Delete', okClass: 'btn-danger',
    onConfirm: () => {
      templates.splice(idx, 1);
      saveUserTemplatesData(templates);
      renderUserTemplates();
      renderTemplatesManage();
      showToast('Template deleted', 'info');
    }
  });
}

function exportTemplates() {
  const templates = loadUserTemplates();
  const data = {
    _type: 'qrp_templates', _ver: '2.7',
    _date: new Date().toISOString(),
    _copy: '© QR Prism by Muhtasim Rahman (Turzo)',
    templates,
  };
  exportJSON(data, buildExportFilename('templates', templates.length));
  showToast(`Exported ${templates.length} template(s)`, 'success');
}

// ── Modal openers ────────────────────────────────────────
function openSaveTemplateModal() {
  const nameEl = document.getElementById('save-tmpl-name');
  if (nameEl) nameEl.value = '';
  openModal('save-template-modal');
}

function openSaveProjectModal() {
  const nameEl = document.getElementById('save-proj-name');
  if (nameEl) nameEl.value = '';
  openModal('save-project-modal');
}

// ── Export helpers ───────────────────────────────────────
function buildExportFilename(type, count) {
  const now = new Date();
  const d = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;
  const t = `${String(now.getHours()).padStart(2,'0')}-${String(now.getMinutes()).padStart(2,'0')}`;
  return `qr-prism_${type}_${count}_${d}_${t}.json`;
}

function exportJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Import ───────────────────────────────────────────────
function handleImportFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data._type === 'qrp_templates' || data.templates) {
        const tmpl = data.templates || [];
        const existing = loadUserTemplates();
        const ids = new Set(existing.map(t => t.id));
        let added = 0;
        tmpl.forEach(t => { if (!ids.has(t.id)) { existing.push(t); added++; } });
        saveUserTemplatesData(existing);
        renderUserTemplates();
        renderTemplatesManage();
        showToast(`Imported ${added} template(s)`, 'success');
      } else if (data._type === 'qrp_projects' || data.projects) {
        const proj = data.projects || [];
        const existing = JSON.parse(localStorage.getItem('qrp_projects') || '[]');
        const ids = new Set(existing.map(p => p.id));
        let added = 0;
        proj.forEach(p => { if (!ids.has(p.id)) { existing.push(p); added++; } });
        localStorage.setItem('qrp_projects', JSON.stringify(existing));
        renderProjects(); updateProjectCounts();
        showToast(`Imported ${added} project(s)`, 'success');
      } else if (data._type === 'qrp_all') {
        if (data.projects)  { localStorage.setItem('qrp_projects', JSON.stringify(data.projects)); }
        if (data.templates) { localStorage.setItem('qrp_templates', JSON.stringify(data.templates)); }
        if (data.profile)   { localStorage.setItem('qrp_profile', JSON.stringify(data.profile)); syncProfileUI(); }
        if (data.settings)  { Object.assign(SETTINGS, data.settings); saveSettingsData(); applyTheme(SETTINGS.theme); }
        showToast('All data imported!', 'success');
      } else {
        showToast('Unknown file format', 'error');
      }
    } catch(err) {
      showToast('Invalid JSON file', 'error');
    }
    input.value = '';
    closeModal('import-modal');
  };
  reader.readAsText(file);
}
