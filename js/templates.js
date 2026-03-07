// =========================================================
// TEMPLATES.JS — Save, load, delete user templates
// =========================================================

function saveTemplate() {
  const nameEl = document.getElementById('save-name');
  const name   = nameEl ? nameEl.value.trim() : '';
  if (!name) { showToast('Enter a template name!', 'warning'); return; }

  // Capture thumbnail from current canvas
  const canvas = document.getElementById('qr-canvas');
  let thumb = '';
  if (canvas && canvas.style.display !== 'none') {
    try {
      const tmp = document.createElement('canvas');
      tmp.width = 80; tmp.height = 80;
      tmp.getContext('2d').drawImage(canvas, 0, 0, 80, 80);
      thumb = tmp.toDataURL();
    } catch (e) {}
  }

  const templates = getSavedTemplates();
  templates.unshift({
    id:       Date.now().toString(),
    name,
    thumb,
    settings: JSON.parse(JSON.stringify(S)),
    date:     new Date().toLocaleDateString(),
  });

  try { localStorage.setItem('qr_templates', JSON.stringify(templates)); } catch (e) {
    showToast('Storage full — delete some templates', 'error');
    return;
  }

  closeModal('save-modal');
  if (nameEl) nameEl.value = '';
  renderSavedTemplates();
  showToast('Template saved: ' + name, 'success');
}

function getSavedTemplates() {
  try { return JSON.parse(localStorage.getItem('qr_templates') || '[]'); } catch (e) { return []; }
}

function loadSavedTemplate(id) {
  const t = getSavedTemplates().find(t => t.id === id);
  if (!t) { showToast('Template not found', 'error'); return; }
  Object.assign(S, t.settings);
  syncAllUI();
  renderQR();
  showToast('Loaded: ' + t.name, 'success');
}

function deleteSavedTemplate(id) {
  if (!confirm('Delete this template?')) return;
  const templates = getSavedTemplates().filter(t => t.id !== id);
  try { localStorage.setItem('qr_templates', JSON.stringify(templates)); } catch (e) {}
  renderSavedTemplates();
  showToast('Template deleted', 'info');
}

function renderSavedTemplates() {
  const container = document.getElementById('saved-tlist');
  if (!container) return;
  const templates = getSavedTemplates();

  if (!templates.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-regular fa-bookmark"></i>
        No saved templates yet
      </div>`;
    return;
  }

  container.innerHTML = templates.map(t => `
    <div class="saved-item">
      <canvas class="saved-thumb" id="stc-${t.id}" width="50" height="50"></canvas>
      <div class="saved-info">
        <div class="saved-name">${escHtml(t.name)}</div>
        <div class="saved-meta">${t.date || ''}</div>
      </div>
      <div class="saved-acts">
        <button class="btn btn-primary btn-sm" onclick="loadSavedTemplate('${t.id}')" title="Apply">
          <i class="fa-solid fa-play"></i>
        </button>
        <button class="btn btn-danger btn-sm" onclick="deleteSavedTemplate('${t.id}')" title="Delete">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    </div>`).join('');

  // Draw thumbnails
  templates.forEach(t => {
    if (!t.thumb) return;
    const c = document.getElementById('stc-' + t.id);
    if (!c) return;
    const img = new Image();
    img.onload = () => c.getContext('2d').drawImage(img, 0, 0, 50, 50);
    img.src = t.thumb;
  });
}
