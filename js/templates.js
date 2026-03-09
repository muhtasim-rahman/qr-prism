// =========================================================
// templates.js — User template save/load
// QR Prism v2.4
// =========================================================

const TEMPLATES_KEY = 'qrp_templates_v4';

function loadUserTemplates() {
  try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY)) || []; } catch { return []; }
}
function saveUserTemplates(templates) {
  try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates)); } catch {}
}

function saveTemplate() {
  const name = document.getElementById('save-tmpl-name')?.value?.trim();
  if (!name) return showToast('Enter a template name', 'warning');
  const templates = loadUserTemplates();
  templates.unshift({
    id: 'tmpl_' + Date.now(),
    name,
    date: new Date().toISOString(),
    settings: captureDesignSnapshot(),
  });
  saveUserTemplates(templates);
  closeModal('save-template-modal');
  renderUserTemplates();
  showToast(`Template "${name}" saved`, 'success');
}

function applyUserTemplate(idx) {
  const t = loadUserTemplates()[idx];
  if (!t) return;
  Object.assign(S, t.settings || {});
  syncUIFromState();
  schedRender();
  showToast(`Applied: ${t.name}`, 'success');
}

function deleteUserTemplate(idx) {
  const templates = loadUserTemplates();
  const t = templates[idx];
  showConfirm({
    title: 'Delete Template',
    msg: `Delete "${t?.name || 'template'}"?`,
    okLabel: 'Delete',
    onConfirm: () => {
      templates.splice(idx, 1);
      saveUserTemplates(templates);
      renderUserTemplates();
      renderTemplatesManage();
      showToast('Template deleted', 'info');
    }
  });
}

function clearAllTemplates() {
  const count = loadUserTemplates().length;
  showConfirm({
    title: 'Clear All Templates',
    msg: `Delete all ${count} saved templates?`,
    list: ['All user-created templates'],
    okLabel: 'Delete All',
    onConfirm: () => {
      localStorage.removeItem(TEMPLATES_KEY);
      renderUserTemplates();
      renderTemplatesManage();
      showToast('Templates cleared', 'info');
    }
  });
}
