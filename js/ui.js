// =========================================================
// UI.JS — QR Prism v2.7
// Type tabs, pattern/frame grids, logo grid, accordion,
// color tabs, sync functions, template rendering
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ── Brand logo map: type key → logo id ───────────────────────
const TYPE_LOGO_MAP = {
  whatsapp:  'whatsapp',
  telegram:  'telegram',
  instagram: 'instagram',
  facebook:  'facebook',
  youtube:   'youtube',
  twitter:   'twitter',
  bitcoin:   'bitcoin',
};

// ── Render QR Type Tabs ───────────────────────────────────────
function renderTypeTabs() {
  const wrap = document.getElementById('type-tabs');
  if (!wrap) return;

  // Find all logos for auto-logo display
  const allLogos = (typeof LOGOS !== 'undefined') ? LOGOS : [];

  wrap.innerHTML = QR_TYPES.map(t => {
    const autoLogo = t.autoLogo;
    let iconHtml;
    if (autoLogo) {
      const logo = allLogos.find(l => l.id === autoLogo);
      if (logo && logo.svg) {
        iconHtml = `<span class="type-tab-icon">${logo.svg.replace('<svg ', '<svg style="width:16px;height:16px;" ')}</span>`;
      } else {
        iconHtml = `<i class="fa-solid ${t.icon}"></i>`;
      }
    } else {
      iconHtml = `<i class="${t.icon}"></i>`;
    }
    return `<button class="type-tab${t.key === S.activeType ? ' active' : ''}" data-type="${t.key}"
      onclick="switchType('${t.key}',this)">${iconHtml}<span>${t.label}</span></button>`;
  }).join('');
}

function switchType(key, el) {
  const prev = S.activeType;
  S.activeType = key;

  // Update tab active states
  document.querySelectorAll('.type-tab').forEach(b => b.classList.remove('active'));
  if (el) el.classList.add('active');

  // Re-render form fields
  renderTypeTab(key);

  // Auto-apply brand logo for social types (only if no custom logo set)
  const logoKey = TYPE_LOGO_MAP[key];
  if (logoKey && !S.logoSrc) {
    setLogoByKey(logoKey);
  } else if (!logoKey && TYPE_LOGO_MAP[prev] && S.logoKey === TYPE_LOGO_MAP[prev]) {
    // Remove auto-logo when switching away from a brand type
    clearLogo();
  }

  schedRender();
}

function renderTypeTab(key) {
  const fields = document.getElementById('form-fields');
  const title  = document.getElementById('form-title');
  if (!fields) return;
  const type = QR_TYPES.find(t => t.key === key);
  if (title && type) title.textContent = type.title || type.label;
  fields.innerHTML = FORMS[key] || `<p style="color:var(--text3);font-size:.82rem;">No form for type: ${key}</p>`;
}

// ── Accordion (one open at a time; form-card is independent) ──
function toggleAccordion(headerBtn) {
  const card = headerBtn.closest('.accordion-card');
  if (!card) return;
  const body   = headerBtn.nextElementSibling;
  if (!body) return;
  const isOpen = !body.classList.contains('collapsed');

  if (isOpen) {
    body.classList.add('collapsed');
    headerBtn.classList.remove('open');
  } else {
    // Close all accordion cards except form-card (input)
    document.querySelectorAll('.accordion-card').forEach(ac => {
      if (ac === card || ac.id === 'form-card') return;
      const h = ac.querySelector('.card-header');
      const b = ac.querySelector('.card-body');
      if (h && b && !b.classList.contains('collapsed')) {
        b.classList.add('collapsed');
        h.classList.remove('open');
      }
    });
    body.classList.remove('collapsed');
    headerBtn.classList.add('open');
  }
}

// ── Color Tabs ────────────────────────────────────────────────
function switchCTab(idx, el) {
  document.querySelectorAll('.ctab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.csub').forEach(s => s.classList.remove('active'));
  if (el) el.classList.add('active');
  const sub = document.getElementById('ctab-' + idx);
  if (sub) sub.classList.add('active');
}

// ── Sub-tabs ──────────────────────────────────────────────────
function switchStab(ns, idx, el) {
  const parent = el.closest('.card-body') || el.parentElement?.parentElement;
  if (!parent) return;
  parent.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
  parent.querySelectorAll('.spanel').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById(ns + '-' + idx);
  if (panel) panel.classList.add('active');
}

// ── Pattern Grids ─────────────────────────────────────────────
function renderPatternGrids() {
  renderPatternGrid('design-grid',   PATTERNS,   S.pattern,  'pattern');
  renderPatternGrid('eyeframe-grid', EYE_FRAMES, S.eyeFrame, 'eyeFrame');
  renderPatternGrid('eyeinner-grid', EYE_INNERS, S.eyeInner, 'eyeInner');
}

function renderPatternGrid(containerId, items, selectedId, stateKey) {
  const container = document.getElementById(containerId);
  if (!container || !items) return;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bgColor = isDark ? '#1E1E35' : '#F0F0FF';
  const fgColor = isDark ? '#E0E0FF' : '#1A1A2E';

  container.innerHTML = items.map(item => `
    <div class="pat-item${item.id === selectedId ? ' active' : ''}"
      data-id="${item.id}"
      onclick="selectDesignItem('${stateKey}','${item.id}','${containerId}',this)">
      <canvas width="44" height="44" id="pv-${item.id}"></canvas>
      <div class="pat-name">${item.name}</div>
    </div>`).join('');

  // Draw previews
  requestAnimationFrame(() => {
    items.forEach(item => {
      const cv = document.getElementById('pv-' + item.id);
      if (!cv) return;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 44, 44);
      if (!item.draw) return;
      try {
        if (stateKey === 'pattern') {
          // Draw 3×3 dot grid
          const cs = 12;
          for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
              item.draw(ctx, 2 + c * 14, 2 + r * 14, cs, fgColor);
            }
          }
        } else if (stateKey === 'eyeFrame') {
          // Draw eye frame (large, centered) — NO fill inside
          item.draw(ctx, 4, 4, 36, fgColor);
        } else if (stateKey === 'eyeInner') {
          // Draw inner centered
          item.draw(ctx, 10, 10, 24, fgColor);
        }
      } catch(e) {}
    });
  });
}

function selectDesignItem(stateKey, id, containerId, el) {
  pushUndo();
  S[stateKey] = id;
  document.querySelectorAll(`#${containerId} .pat-item`).forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  schedRender();
}

// ── Frame Grids ───────────────────────────────────────────────
function renderFrameGrids() {
  if (typeof FRAMES === 'undefined') return;
  renderFrameGrid('frame-label-grid',   FRAMES.filter(f => f.hasText));
  renderFrameGrid('frame-nolabel-grid', FRAMES.filter(f => !f.hasText));
}

function renderFrameGrid(containerId, frames) {
  const container = document.getElementById(containerId);
  if (!container || !frames) return;
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const bg = isDark ? '#1E1E35' : '#F0F0FF';

  container.innerHTML = frames.map(f => `
    <div class="frm-item${f.id === S.frame ? ' active' : ''}"
      onclick="selectFrame('${f.id}','${containerId}',this)">
      <canvas width="60" height="60" id="fv-${f.id}"></canvas>
      <div class="pat-name">${f.name}</div>
    </div>`).join('');

  requestAnimationFrame(() => {
    frames.forEach(f => {
      const cv = document.getElementById('fv-' + f.id);
      if (!cv) return;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 60, 60);
      // Draw tiny QR placeholder
      ctx.strokeStyle = isDark ? 'rgba(129,140,248,.3)' : 'rgba(99,102,241,.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 4, 40, 40);
      // Draw frame if not 'none'
      if (f.id !== 'frm-none' && f.draw) {
        try {
          f.draw(ctx, 10, 4, 40, {
            color: '#818CF8',
            label: f.hasText ? 'SCAN' : '',
            font: 'Poppins',
            textSize: 80,
            labelColor: '#FFFFFF',
          });
        } catch(e) {}
      }
    });
  });
}

function selectFrame(id, containerId, el) {
  pushUndo();
  S.frame = id;
  document.querySelectorAll(`#${containerId} .frm-item`).forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  schedRender();
}

// ── Logo Grid ─────────────────────────────────────────────────
function renderLogoGrid() {
  const grid = document.getElementById('logo-grid');
  if (!grid) return;
  const allLogos = (typeof LOGOS !== 'undefined') ? LOGOS : [];
  if (!allLogos.length) {
    grid.innerHTML = `<p style="font-size:.78rem;color:var(--text3);grid-column:1/-1;">No logos found in assets/logos/</p>`;
    return;
  }
  grid.innerHTML = allLogos.map(l => `
    <div class="logo-item${l.id === S.logoKey ? ' active' : ''}"
      onclick="setLogoByKey('${escHtml(l.id)}',this)"
      title="${escHtml(l.name)}">
      ${l.svg
        ? l.svg.replace('<svg ', '<svg style="width:28px;height:28px;" ')
        : `<img src="${escHtml(l.src || '')}" alt="${escHtml(l.name)}" style="width:28px;height:28px;object-fit:contain;">`
      }
      <span style="font-size:.62rem;color:var(--text3);margin-top:2px;">${escHtml(l.name)}</span>
    </div>`).join('');
}

function filterLogos(query) {
  const q = query.toLowerCase();
  document.querySelectorAll('#logo-grid .logo-item').forEach(item => {
    const name = item.querySelector('span')?.textContent.toLowerCase() || '';
    item.style.display = name.includes(q) || !q ? '' : 'none';
  });
}

function setLogoByKey(id, el) {
  const allLogos = (typeof LOGOS !== 'undefined') ? LOGOS : [];
  const logo = allLogos.find(l => l.id === id);
  if (!logo) return;

  // Toggle off if same
  if (S.logoKey === id) {
    clearLogo();
    return;
  }

  // Build data URL
  if (logo.svg) {
    const blob = new Blob([logo.svg], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    S.logoSrc  = url;
    S.logoKey  = id;
  } else if (logo.src) {
    S.logoSrc = logo.src;
    S.logoKey = id;
  }

  // Update grid active state
  document.querySelectorAll('#logo-grid .logo-item').forEach(i => i.classList.remove('active'));
  if (el) el.classList.add('active');
  else {
    const found = document.querySelector(`#logo-grid .logo-item[onclick*="'${id}'"]`);
    if (found) found.classList.add('active');
  }

  updateLogoPreview();
  schedRender();
}

function handleLogoFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('File too large (max 5MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    S.logoSrc = e.target.result;
    S.logoKey = null;
    document.querySelectorAll('#logo-grid .logo-item').forEach(i => i.classList.remove('active'));
    updateLogoPreview();
    schedRender();
  };
  reader.readAsDataURL(file);
  input.value = ''; // reset input
}

function handleLogoDrop(e) {
  e.preventDefault();
  const file = e.dataTransfer?.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = ev => {
      S.logoSrc = ev.target.result;
      S.logoKey = null;
      document.querySelectorAll('#logo-grid .logo-item').forEach(i => i.classList.remove('active'));
      updateLogoPreview();
      schedRender();
    };
    reader.readAsDataURL(file);
  }
  document.getElementById('logo-upload')?.classList.remove('drag-over');
}

function clearLogo() {
  S.logoSrc = null;
  S.logoKey = null;
  document.querySelectorAll('#logo-grid .logo-item').forEach(i => i.classList.remove('active'));
  updateLogoPreview();
  schedRender();
}

function updateLogoPreview() {
  const area = document.getElementById('logo-prev-area');
  if (!area) return;
  if (S.logoSrc) {
    area.innerHTML = `
      <div class="logo-preview-area">
        <img src="${S.logoSrc}" alt="logo" style="width:36px;height:36px;object-fit:contain;border-radius:6px;">
        <div class="logo-preview-info">
          <div class="logo-preview-name">${S.logoKey || 'Custom Logo'}</div>
          <div class="logo-preview-remove" onclick="clearLogo()">
            <i class="fa-solid fa-xmark"></i> Remove logo
          </div>
        </div>
      </div>`;
  } else {
    area.innerHTML = '';
  }
}

// ── Preset Templates ──────────────────────────────────────────
function renderPresetTemplates() {
  const grid = document.getElementById('preset-tgrid');
  if (!grid || typeof PRESET_TEMPLATES === 'undefined') return;

  grid.innerHTML = PRESET_TEMPLATES.map((t, i) => `
    <div class="tmpl-card" onclick="applyPresetTemplate(${i})" title="${escHtml(t.name)}">
      <canvas width="52" height="52" id="ptv-${i}"></canvas>
      <div class="tmpl-name">${escHtml(t.name)}</div>
    </div>`).join('');

  // Draw thumbnails
  requestAnimationFrame(() => {
    PRESET_TEMPLATES.forEach((t, i) => {
      const cv = document.getElementById('ptv-' + i);
      if (!cv) return;
      drawTemplateThumbnail(cv, t.settings);
    });
  });
}

function applyPresetTemplate(idx) {
  const t = PRESET_TEMPLATES[idx];
  if (!t) return;
  pushUndo();
  Object.assign(S, t.settings);
  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  schedRender();
  showToast(`Template "${t.name}" applied`, 'success');
}

// ── User Templates ────────────────────────────────────────────
function renderUserTemplates() {
  const list = document.getElementById('saved-tlist');
  const badge = document.getElementById('tmpl-badge');
  if (!list) return;

  const templates = loadUserTemplates();
  if (badge) badge.textContent = PRESET_TEMPLATES.length + templates.length;

  if (!templates.length) {
    list.innerHTML = `<div class="empty-state" style="padding:16px 0;">
      <i class="fa-solid fa-bookmark"></i>
      <p>No saved templates yet.<br>Customize and save your styles.</p>
    </div>`;
    return;
  }

  list.innerHTML = templates.map((t, i) => `
    <div class="stpl-row">
      <canvas class="stpl-thumb" width="34" height="34" id="utv-${i}"></canvas>
      <div class="stpl-info">
        <div class="stpl-name">${escHtml(t.name)}</div>
        <div class="stpl-date">${formatDate(t.createdAt)}</div>
      </div>
      <div class="stpl-actions">
        <button class="icon-btn tooltip-wrap" onclick="applyUserTemplate(${i})" title="Apply">
          <i class="fa-solid fa-wand-magic-sparkles"></i>
          <span class="tooltip-pop">Apply template</span>
        </button>
        <button class="icon-btn tooltip-wrap" onclick="deleteUserTemplate(${i})" title="Delete" style="color:var(--danger);">
          <i class="fa-solid fa-trash"></i>
          <span class="tooltip-pop">Delete template</span>
        </button>
      </div>
    </div>`).join('');

  requestAnimationFrame(() => {
    templates.forEach((t, i) => {
      const cv = document.getElementById('utv-' + i);
      if (cv && t.design) drawTemplateThumbnail(cv, t.design);
    });
  });
}

function drawTemplateThumbnail(canvas, settings) {
  const ctx  = canvas.getContext('2d');
  const w    = canvas.width;
  const h    = canvas.height;
  const bg   = settings.bgColor || '#ffffff';
  const fg   = settings.fgColor || '#000000';

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Draw a mini 5×5 QR-like grid as color swatch
  const grid = [
    [1,1,1,0,1],[1,0,1,0,1],[1,1,1,1,0],[0,0,1,0,1],[1,0,1,1,1]
  ];
  const cs = (w - 4) / 5;
  grid.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) return;
      let color = fg;
      if (settings.gradient && c > 2) {
        color = settings.gc2 || fg;
      }
      if (r < 3 && c < 3 && !(r === 1 && c === 1)) {
        // Marker area
        color = settings.mbColor || fg;
      }
      ctx.fillStyle = color;
      ctx.fillRect(2 + c * cs, 2 + r * cs, cs - 1, cs - 1);
    });
  });

  // Round corners if rounded pattern
  if (settings.pattern && settings.pattern.includes('round')) {
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 5);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
}

// ── Templates Manage Page ─────────────────────────────────────
function renderTemplatesManage() {
  const list = document.getElementById('tmpl-manage-list');
  if (!list) return;
  const templates = loadUserTemplates();

  if (!templates.length) {
    list.innerHTML = `<div class="empty-state">
      <i class="fa-solid fa-bookmark"></i>
      <p>No saved templates yet.</p>
      <button class="btn btn-outline btn-sm" onclick="switchMode('gen')">
        <i class="fa-solid fa-wand-magic-sparkles"></i> Go to Generator
      </button>
    </div>`;
    return;
  }

  list.innerHTML = `<div style="display:flex;flex-direction:column;gap:8px;">` +
    templates.map((t, i) => `
      <div class="stpl-row">
        <canvas class="stpl-thumb" width="40" height="40" id="tm-${i}"></canvas>
        <div class="stpl-info">
          <div class="stpl-name">${escHtml(t.name)}</div>
          <div class="stpl-date">${formatDateTime(t.createdAt)}</div>
        </div>
        <div class="stpl-actions">
          <button class="btn btn-outline btn-sm" onclick="applyUserTemplate(${i});switchMode('gen');">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Apply
          </button>
          <button class="icon-btn tooltip-wrap" onclick="deleteUserTemplate(${i})" style="color:var(--danger);">
            <i class="fa-solid fa-trash"></i>
            <span class="tooltip-pop">Delete</span>
          </button>
        </div>
      </div>`).join('') + `</div>`;

  requestAnimationFrame(() => {
    templates.forEach((t, i) => {
      const cv = document.getElementById('tm-' + i);
      if (cv && t.design) drawTemplateThumbnail(cv, t.design);
    });
  });
}

// ── Size / EC helpers ─────────────────────────────────────────
function adjSize(delta) {
  S.size = Math.max(100, Math.min(2000, (S.size || 600) + delta));
  const el = document.getElementById('qr-size');
  if (el) el.value = S.size;
  schedRender();
}

function setSize(v) {
  S.size = v;
  const el = document.getElementById('qr-size');
  if (el) el.value = v;
  schedRender();
}

// ── Sync all UI controls from S (for undo/redo/template apply) ─
function syncAllUI() {
  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
  const ck   = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
  const show = (id, val) => { const el = document.getElementById(id); if (el) el.style.display = val ? 'block' : 'none'; };

  safe('qr-size',     S.size);
  safe('ec-level',    S.ec);
  safe('qz-slider',   S.qz);
  safe('grad-type',   S.gType);
  safe('grad-angle',  S.gAngle);
  safe('logo-size',   S.logoSize);
  safe('logo-br',     S.logoBR);
  safe('logo-pad',    S.logoPad);
  safe('frame-label', S.frameLabel);
  safe('frame-font',  S.frameFont);
  safe('frame-ts',    S.frameTSize);
  safe('shadow-blur', S.shadowBlur);
  safe('qr-rotation', S.rotation);
  safe('qr-filter',   S.filter);

  ck('transparent',    S.transparent);
  ck('use-grad',       S.gradient);
  ck('custom-marker',  S.customMarker);
  ck('custom-ef',      S.customEF);
  ck('custom-ei',      S.customEI);
  ck('logo-rmbg',      S.logoRemoveBG);
  ck('flip-h',         S.flipH);
  ck('flip-v',         S.flipV);
  ck('invert-c',       S.invert);
  ck('use-shadow',     S.shadow);
  ck('scan-opt',       S.scanOpt);

  show('grad-opts',    S.gradient);
  show('marker-opts',  S.customMarker);
  show('ef-opts',      S.customEF);
  show('ei-opts',      S.customEI);
  show('shadow-opts',  S.shadow);

  // Update slider display values
  const qzVal = document.getElementById('qz-val'); if (qzVal) qzVal.textContent = S.qz + ' mod';
  const gaVal = document.getElementById('ga-val'); if (gaVal) gaVal.textContent = S.gAngle + '°';
  const lsVal = document.getElementById('ls-val'); if (lsVal) lsVal.textContent = S.logoSize + '%';
  const lbrVal = document.getElementById('lbr-val'); if (lbrVal) lbrVal.textContent = S.logoBR + '%';
  const lpVal = document.getElementById('lp-val'); if (lpVal) lpVal.textContent = S.logoPad + 'px';
  const ftsV = document.getElementById('fts-v'); if (ftsV) ftsV.textContent = S.frameTSize + '%';
  const sbV  = document.getElementById('sb-v');  if (sbV)  sbV.textContent  = S.shadowBlur + 'px';

  // Re-render grids to reflect new selections
  renderPatternGrids();
  updateLogoPreview();
}

// ── Profile Page ──────────────────────────────────────────────
function renderProfile() {
  const container = document.getElementById('profile-content');
  if (!container) return;
  const profile = JSON.parse(localStorage.getItem('qrp_profile') || '{}');
  const name     = profile.name  || '';
  const bio      = profile.bio   || '';
  const website  = profile.website || '';
  const email    = profile.email || '';
  const initials = name.trim().split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0,2) || '?';
  const avatarHtml = profile.avatar
    ? `<img src="${escHtml(profile.avatar)}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
    : initials;

  container.innerHTML = `
    <div class="card">
      <div class="card-body">
        <div class="profile-card">
          <div class="profile-avatar-big" onclick="document.getElementById('profile-avatar-input').click()">
            ${avatarHtml}
          </div>
          <input type="file" id="profile-avatar-input" accept="image/*" style="display:none;" onchange="handleProfileAvatar(this)">
          <div style="font-size:.76rem;color:var(--text3);">Click avatar to change</div>
        </div>
        <div style="display:flex;flex-direction:column;gap:12px;">
          <div class="fg">
            <label class="field-label">Display Name</label>
            <input class="input" id="profile-name" value="${escHtml(name)}" placeholder="Your Name">
          </div>
          <div class="fg">
            <label class="field-label">Bio</label>
            <textarea class="input" id="profile-bio" rows="2" placeholder="Short bio...">${escHtml(bio)}</textarea>
          </div>
          <div class="two-col">
            <div class="fg">
              <label class="field-label">Website</label>
              <input class="input" id="profile-website" value="${escHtml(website)}" placeholder="https://...">
            </div>
            <div class="fg">
              <label class="field-label">Email</label>
              <input class="input" id="profile-email" type="email" value="${escHtml(email)}" placeholder="you@example.com">
            </div>
          </div>
          <div class="btn-group">
            <button class="btn btn-primary" onclick="saveProfile()">
              <i class="fa-solid fa-floppy-disk"></i> Save Profile
            </button>
            <button class="btn btn-ghost" onclick="clearProfile()">
              <i class="fa-solid fa-rotate-left"></i> Clear
            </button>
          </div>
        </div>
      </div>
    </div>`;
}

function handleProfileAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Max 2MB for avatar', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const profile = JSON.parse(localStorage.getItem('qrp_profile') || '{}');
    profile.avatar = e.target.result;
    localStorage.setItem('qrp_profile', JSON.stringify(profile));
    syncProfileUI();
    renderProfile();
    showToast('Avatar updated', 'success');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function saveProfile() {
  const profile = JSON.parse(localStorage.getItem('qrp_profile') || '{}');
  profile.name    = document.getElementById('profile-name')?.value.trim()    || '';
  profile.bio     = document.getElementById('profile-bio')?.value.trim()     || '';
  profile.website = document.getElementById('profile-website')?.value.trim() || '';
  profile.email   = document.getElementById('profile-email')?.value.trim()   || '';
  localStorage.setItem('qrp_profile', JSON.stringify(profile));
  syncProfileUI();
  showToast('Profile saved!', 'success');
}

function clearProfile() {
  showConfirm({
    title: 'Clear Profile',
    msg: 'Are you sure you want to clear your profile data?',
    okLabel: 'Clear',
    okClass: 'btn-danger',
    onConfirm: () => {
      localStorage.removeItem('qrp_profile');
      syncProfileUI();
      renderProfile();
      showToast('Profile cleared', 'info');
    }
  });
}

// ── Open Save Project Modal ───────────────────────────────────
function openSaveProjectModal() {
  const nameInput = document.getElementById('save-proj-name');
  if (nameInput) nameInput.value = '';
  openModal('save-project-modal');
}

// ── Open Save Template Modal ──────────────────────────────────
function openSaveTemplateModal() {
  const nameInput = document.getElementById('save-tmpl-name');
  if (nameInput) nameInput.value = '';
  openModal('save-template-modal');
}

// ── Project Tab ───────────────────────────────────────────────
let _projCategory = 'saved';

function switchProjectTab(cat, el) {
  _projCategory = cat;
  document.querySelectorAll('.projects-tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  renderProjects();
}

// ── Tag Add Modal (from project card) ─────────────────────────
function openAddTagModal(projectId) {
  const input = document.getElementById('add-tag-input');
  if (input) input.value = '';
  document.getElementById('add-tag-modal').dataset.projectId = projectId;
  openModal('add-tag-modal');
}

function confirmAddTag() {
  const modal = document.getElementById('add-tag-modal');
  const projectId = modal?.dataset.projectId;
  const tagVal = document.getElementById('add-tag-input')?.value.trim();
  if (!tagVal || !projectId) { closeModal('add-tag-modal'); return; }

  try {
    const projects = JSON.parse(localStorage.getItem('qrp_projects') || '[]');
    const p = projects.find(x => x.id === projectId);
    if (p) {
      if (!p.tags) p.tags = [];
      if (!p.tags.includes(tagVal)) p.tags.push(tagVal);
      localStorage.setItem('qrp_projects', JSON.stringify(projects));
      renderProjects();
      showToast('Tag added', 'success');
    }
  } catch(e) {}
  closeModal('add-tag-modal');
}

// ── Rename Project ────────────────────────────────────────────
let _renameProjectId = null;

function openRenameModal(id, currentName) {
  _renameProjectId = id;
  const input = document.getElementById('rename-proj-input');
  if (input) input.value = currentName || '';
  openModal('rename-project-modal');
}

function confirmRenameProject() {
  if (!_renameProjectId) return;
  const newName = document.getElementById('rename-proj-input')?.value.trim();
  if (!newName) { showToast('Name cannot be empty', 'error'); return; }
  try {
    const projects = JSON.parse(localStorage.getItem('qrp_projects') || '[]');
    const p = projects.find(x => x.id === _renameProjectId);
    if (p) {
      p.title = newName;
      localStorage.setItem('qrp_projects', JSON.stringify(projects));
      renderProjects();
      showToast('Renamed', 'success');
    }
  } catch(e) {}
  closeModal('rename-project-modal');
  _renameProjectId = null;
}

// ── Report Type Selection ─────────────────────────────────────
let _reportType = 'bug';
let _reportImages = [];

function selectReportType(btn, type) {
  _reportType = type;
  document.querySelectorAll('.rtype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function handleReportImages(input) {
  const files = Array.from(input.files);
  const remaining = 8 - _reportImages.length;
  files.slice(0, remaining).forEach(file => {
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} too large (max 5MB)`, 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      _reportImages.push({ name: file.name, data: e.target.result });
      renderReportImages();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderReportImages() {
  const grid = document.getElementById('report-img-grid');
  if (!grid) return;
  let html = _reportImages.map((img, i) => `
    <div class="ri-wrap">
      <img src="${img.data}" class="report-img-thumb" alt="${escHtml(img.name)}">
      <div class="ri-remove" onclick="removeReportImage(${i})"><i class="fa-solid fa-xmark"></i></div>
    </div>`).join('');
  if (_reportImages.length < 8) {
    html += `<div class="report-img-add" onclick="document.getElementById('report-img-input').click()">
      <i class="fa-solid fa-plus"></i><span>Add image</span>
    </div>`;
  }
  grid.innerHTML = html;
}

function removeReportImage(idx) {
  _reportImages.splice(idx, 1);
  renderReportImages();
}

function submitReport() {
  const name = document.getElementById('report-name')?.value.trim();
  const desc = document.getElementById('report-desc')?.value.trim();
  if (!desc) { showToast('Please describe the issue', 'error'); return; }
  const report = {
    id:         Date.now(),
    type:       _reportType,
    name:       name || 'Anonymous',
    email:      document.getElementById('report-email')?.value.trim() || '',
    desc,
    imageCount: _reportImages.length,
    date:       new Date().toISOString(),
    version:    'v2.7',
    ua:         navigator.userAgent,
  };
  try {
    const prev = JSON.parse(localStorage.getItem('qrp_reports') || '[]');
    prev.push(report);
    localStorage.setItem('qrp_reports', JSON.stringify(prev));
  } catch(e) {}
  showToast('Report submitted! Thank you.', 'success', 3500);
  ['report-name','report-email','report-desc'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  _reportImages = [];
  renderReportImages();
  _reportType = 'bug';
  document.querySelectorAll('.rtype-btn').forEach((b,i) => b.classList.toggle('active', i===0));
}

function clearReportForm() {
  showConfirm({
    title: 'Clear Form',
    msg: 'Clear all report fields?',
    okLabel: 'Clear',
    okClass: 'btn-danger',
    onConfirm: () => {
      ['report-name','report-email','report-desc'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      _reportImages = [];
      renderReportImages();
    }
  });
}

// ── escHtml (local if not in app.js yet) ─────────────────────
if (typeof escHtml === 'undefined') {
  function escHtml(s) {
    return !s ? '' : String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
}
if (typeof formatDate === 'undefined') {
  function formatDate(ts) {
    if (!ts) return '';
    return new Date(ts).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });
  }
}
if (typeof formatDateTime === 'undefined') {
  function formatDateTime(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleDateString('en-GB',{ day:'2-digit',month:'short',year:'numeric'}) +
      ' ' + d.toLocaleTimeString('en-GB',{ hour:'2-digit',minute:'2-digit'});
  }
}
