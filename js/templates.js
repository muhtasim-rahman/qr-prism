// =========================================================
// templates.js — QR Prism v2.5
// User & preset templates, save modal, apply, manage page
// =========================================================

const TEMPLATES_KEY = 'qrs_templates';

// ── Load / Save ────────────────────────────────────────────
function loadUserTemplates() {
  try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY)) || []; } catch { return []; }
}
function saveUserTemplateData(templates) {
  try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates)); } catch {}
}

// ── Save Template Modal ────────────────────────────────────
function openSaveTemplateModal() {
  const inp = document.getElementById('save-name');
  if (inp) inp.value = '';
  openModal('save-modal');
}

// ── Save Current State as Template ────────────────────────
function saveTemplate() {
  const name = document.getElementById('save-name')?.value.trim();
  if (!name) { showToast('টেমপ্লেটের নাম দিন', 'warning'); return; }

  const design = {
    pattern: S.pattern, eyeFrame: S.eyeFrame, eyeInner: S.eyeInner,
    fgColor: S.fgColor, bgColor: S.bgColor, transparent: S.transparent,
    gradient: S.gradient, gType: S.gType, gc1: S.gc1, gc2: S.gc2, gAngle: S.gAngle,
    customMarker: S.customMarker, mbColor: S.mbColor, mcColor: S.mcColor,
    customEF: S.customEF, efColor: S.efColor,
    customEI: S.customEI, eiColor: S.eiColor,
    frame: S.frame, frameLabel: S.frameLabel, frameFont: S.frameFont,
    frameTSize: S.frameTSize, frameLabelColor: S.frameLabelColor, frameColor: S.frameColor,
    logoKey: S.logoKey, logoSrc: S.logoKey ? S.logoSrc : null,
    logoSize: S.logoSize, logoBR: S.logoBR, logoPad: S.logoPad,
    logoPadColor: S.logoPadColor, logoRemoveBG: S.logoRemoveBG,
    ec: S.ec, qz: S.qz, size: S.size,
  };

  const templates = loadUserTemplates();
  templates.unshift({ id: 'utmpl_' + Date.now(), name, date: new Date().toISOString(), design });
  saveUserTemplateData(templates);
  closeModal('save-modal');
  showToast(`"${name}" সেভ হয়েছে!`, 'success');
  renderUserTemplates();
}

// ── Apply Template ─────────────────────────────────────────
function applyTemplate(design) {
  pushUndo();
  Object.assign(S, design);
  // Restore preset logo if logoKey is set
  if (design.logoKey && !design.logoSrc) {
    const logo = PRESET_LOGOS.find(l => l.key === design.logoKey);
    if (logo) {
      const blob = new Blob([logo.svg], { type: 'image/svg+xml' });
      S.logoSrc = URL.createObjectURL(blob);
    }
  }
  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  schedRender();
  showToast('টেমপ্লেট প্রয়োগ হয়েছে', 'success');
}

// ── Render Preset Template Grid (inside generator card) ───
function renderPresetTemplates() {
  const grid = document.getElementById('preset-tgrid');
  if (!grid) return;
  grid.innerHTML = PRESET_TEMPLATES.map(tmpl => `
    <div class="template-card" onclick="applyTemplate(${JSON.stringify(tmpl.state).replace(/"/g,'&quot;')})"
         title="${tmpl.name}">
      <div class="tmpl-thumb" id="ptthumb-${tmpl.id}">
        <canvas width="80" height="80"></canvas>
      </div>
      <div class="tmpl-name">${tmpl.name}</div>
      ${tmpl.category ? `<div class="tmpl-cat">${tmpl.category}</div>` : ''}
    </div>`).join('');

  // Draw preset template previews
  setTimeout(() => {
    PRESET_TEMPLATES.forEach(tmpl => {
      const cv = document.querySelector(`#ptthumb-${tmpl.id} canvas`);
      if (!cv) return;
      drawTemplateThumbnail(cv, tmpl.state);
    });
  }, 100);
}

// ── Render User Templates (inside generator accordion) ────
function renderUserTemplates() {
  const list = document.getElementById('saved-tlist');
  if (!list) return;
  const templates = loadUserTemplates();

  if (!templates.length) {
    list.innerHTML = `<div class="empty-msg"><i class="fa-solid fa-bookmark" style="color:var(--muted);"></i> সেভ করা টেমপ্লেট নেই।</div>`;
    return;
  }

  list.innerHTML = templates.map(t => `
    <div class="saved-template-row" id="strow-${t.id}">
      <div class="st-info" onclick="applyTemplate(${JSON.stringify(t.design).replace(/"/g,'&quot;')})">
        <div class="st-color-dot" style="background:${t.design.fgColor||'#000'};"></div>
        <div>
          <div class="st-name">${escHtmlT(t.name)}</div>
          <div class="st-date">${formatDateT(t.date)}</div>
        </div>
      </div>
      <button class="icon-btn danger" title="Delete" onclick="deleteUserTemplate('${t.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>`).join('');
}

// ── Render Templates Manage Page ───────────────────────────
function renderTemplatesManage() {
  const container = document.getElementById('templates-manage-content');
  if (!container) return;
  const templates = loadUserTemplates();
  if (!templates.length) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fa-solid fa-bookmark"></i>
        <p>কোনো কাস্টম টেমপ্লেট নেই।<br>Generator থেকে একটি ডিজাইন সেভ করুন।</p>
      </div>`;
    return;
  }
  container.innerHTML = `
    <div class="tmpl-manage-header">
      <span>${templates.length}টি টেমপ্লেট</span>
      <button class="btn btn-danger btn-sm" onclick="clearAllTemplatesConfirm()">
        <i class="fa-solid fa-trash"></i> সব মুছুন</button>
    </div>
    ${templates.map(t => `
      <div class="tmpl-manage-row" id="tmrow-${t.id}">
        <div class="tmpl-manage-thumb">
          <canvas id="tmthumb-${t.id}" width="56" height="56"></canvas>
        </div>
        <div class="tmpl-manage-info">
          <div class="tmpl-manage-name">${escHtmlT(t.name)}</div>
          <div class="tmpl-manage-date">${formatDateT(t.date)}</div>
        </div>
        <div class="tmpl-manage-actions">
          <button class="btn btn-primary btn-sm" onclick="applyTemplateAndSwitch(${JSON.stringify(t.design).replace(/"/g,'&quot;')})">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Apply</button>
          <button class="icon-btn danger" onclick="deleteUserTemplate('${t.id}')">
            <i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`).join('')}`;

  setTimeout(() => {
    templates.forEach(t => {
      const cv = document.getElementById('tmthumb-' + t.id);
      if (cv) drawTemplateThumbnail(cv, t.design);
    });
  }, 100);
}

function applyTemplateAndSwitch(design) {
  applyTemplate(design);
  switchMode('gen');
}

// ── Thumbnail Preview ──────────────────────────────────────
function drawTemplateThumbnail(canvas, design) {
  if (!canvas) return;
  const size = canvas.width || 80;
  const ctx = canvas.getContext('2d');
  // Draw a minimal QR-style preview based on the design colors
  const fg = design.fgColor || '#000000';
  const bg = design.bgColor || '#ffffff';
  const g1 = design.gc1 || fg;
  const g2 = design.gc2 || fg;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  if (design.gradient) {
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, g1);
    grad.addColorStop(1, g2);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = fg;
  }

  // Draw a tiny QR-like grid pattern
  const cell = size / 8;
  const qrPattern = [
    [1,1,1,1,1,1,1,0],
    [1,0,0,0,0,0,1,0],
    [1,0,1,1,1,0,1,0],
    [1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0],
    [1,0,0,0,0,0,1,0],
    [1,1,1,1,1,1,1,0],
    [0,0,0,1,0,1,0,1],
  ];
  qrPattern.forEach((row, r) => row.forEach((cell_v, c) => {
    if (cell_v) ctx.fillRect(c * cell, r * cell, cell - 0.5, cell - 0.5);
  }));

  // Round corners if the pattern supports it
  if (design.pattern && design.pattern.includes('round')) {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.12);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

// ── Delete User Template ───────────────────────────────────
function deleteUserTemplate(id) {
  const doDelete = () => {
    saveUserTemplateData(loadUserTemplates().filter(t => t.id !== id));
    renderUserTemplates();
    renderTemplatesManage();
    showToast('টেমপ্লেট মুছে ফেলা হয়েছে', 'info');
  };
  if (SETTINGS.confirmDelete !== false) {
    showConfirm({
      title: 'টেমপ্লেট মুছুন',
      msg: 'এই টেমপ্লেট স্থায়ীভাবে মুছে ফেলা হবে।',
      okLabel: 'হ্যাঁ, মুছুন', okClass: 'btn-danger',
      onConfirm: doDelete,
    });
  } else { doDelete(); }
}

// ── Helpers ────────────────────────────────────────────────
function escHtmlT(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDateT(iso) {
  try { return new Date(iso).toLocaleDateString('bn-BD', {month:'short',day:'numeric',year:'numeric'}); }
  catch { return iso||''; }
}
