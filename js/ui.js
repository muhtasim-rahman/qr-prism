// =========================================================
// UI.JS — All UI helpers: tabs, grids, color sync, modals
// =========================================================

const PATTERNS = [
  { key: 'square',        name: 'Square'      },
  { key: 'dots',          name: 'Dots'        },
  { key: 'rounded',       name: 'Rounded'     },
  { key: 'extra-rounded', name: 'Soft Round'  },
  { key: 'classy',        name: 'Classy'      },
  { key: 'diamond',       name: 'Diamond'     },
  { key: 'star',          name: 'Star'        },
  { key: 'heart',         name: 'Heart'       },
  { key: 'plus',          name: 'Plus'        },
  { key: 'cross',         name: 'Cross'       },
  { key: 'h-lines',       name: 'H-Lines'     },
  { key: 'v-lines',       name: 'V-Lines'     },
];

const EYE_FRAMES = [
  { key: 'square',        name: 'Square'      },
  { key: 'rounded',       name: 'Rounded'     },
  { key: 'extra-rounded', name: 'Soft Round'  },
  { key: 'circle',        name: 'Circle'      },
  { key: 'diamond',       name: 'Diamond'     },
  { key: 'dots',          name: 'Dotted'      },
];

const EYE_INNERS = [
  { key: 'square',        name: 'Square'      },
  { key: 'circle',        name: 'Circle'      },
  { key: 'rounded',       name: 'Rounded'     },
  { key: 'extra-rounded', name: 'Soft Round'  },
  { key: 'diamond',       name: 'Diamond'     },
  { key: 'star',          name: 'Star'        },
];

const LOGO_PRESETS = [
  { key:'none',      icon:'fa-xmark',               label:'None',      color:'#e74c3c' },
  { key:'facebook',  icon:'fa-brands fa-facebook',  label:'Facebook',  color:'#1877f2' },
  { key:'instagram', icon:'fa-brands fa-instagram', label:'Instagram', color:'#e1306c' },
  { key:'youtube',   icon:'fa-brands fa-youtube',   label:'YouTube',   color:'#ff0000' },
  { key:'tiktok',    icon:'fa-brands fa-tiktok',    label:'TikTok',    color:'#010101' },
  { key:'twitter',   icon:'fa-brands fa-x-twitter', label:'X / Twitter',color:'#000000'},
  { key:'linkedin',  icon:'fa-brands fa-linkedin',  label:'LinkedIn',  color:'#0077b5' },
  { key:'whatsapp',  icon:'fa-brands fa-whatsapp',  label:'WhatsApp',  color:'#25d366' },
  { key:'telegram',  icon:'fa-brands fa-telegram',  label:'Telegram',  color:'#0088cc' },
  { key:'snapchat',  icon:'fa-brands fa-snapchat',  label:'Snapchat',  color:'#f7c400' },
  { key:'pinterest', icon:'fa-brands fa-pinterest', label:'Pinterest', color:'#e60023' },
  { key:'reddit',    icon:'fa-brands fa-reddit',    label:'Reddit',    color:'#ff4500' },
  { key:'discord',   icon:'fa-brands fa-discord',   label:'Discord',   color:'#5865f2' },
  { key:'github',    icon:'fa-brands fa-github',    label:'GitHub',    color:'#24292e' },
  { key:'spotify',   icon:'fa-brands fa-spotify',   label:'Spotify',   color:'#1db954' },
  { key:'netflix',   icon:'fa-brands fa-netflix',   label:'Netflix',   color:'#e50914' },
  { key:'paypal',    icon:'fa-brands fa-paypal',    label:'PayPal',    color:'#003087' },
  { key:'amazon',    icon:'fa-brands fa-amazon',    label:'Amazon',    color:'#ff9900' },
  { key:'apple',     icon:'fa-brands fa-apple',     label:'Apple',     color:'#555555' },
  { key:'android',   icon:'fa-brands fa-android',   label:'Android',   color:'#3ddc84' },
  { key:'chrome',    icon:'fa-brands fa-chrome',    label:'Chrome',    color:'#4285f4' },
  { key:'bitcoin',   icon:'fa-brands fa-bitcoin',   label:'Bitcoin',   color:'#f7931a' },
  { key:'ethereum',  icon:'fa-brands fa-ethereum',  label:'Ethereum',  color:'#627eea' },
  { key:'twitch',    icon:'fa-brands fa-twitch',    label:'Twitch',    color:'#9146ff' },
  { key:'slack',     icon:'fa-brands fa-slack',     label:'Slack',     color:'#4a154b' },
  { key:'zoom',      icon:'fa-solid fa-video',      label:'Zoom',      color:'#2d8cff' },
  { key:'google',    icon:'fa-brands fa-google',    label:'Google',    color:'#4285f4' },
  { key:'dropbox',   icon:'fa-brands fa-dropbox',   label:'Dropbox',   color:'#0061ff' },
  { key:'medium',    icon:'fa-brands fa-medium',    label:'Medium',    color:'#02b875' },
  { key:'wordpress', icon:'fa-brands fa-wordpress', label:'WordPress', color:'#21759b' },
];

const FRAMES_WITH_LABEL = [
  { key:'none',       name:'No Frame',  icon:'✕' },
  { key:'bottom-bar', name:'Bottom Bar',icon:'⬛' },
  { key:'top-bar',    name:'Top Bar',   icon:'🔲' },
  { key:'polaroid',   name:'Polaroid',  icon:'📷' },
];
const FRAMES_NO_LABEL = [
  { key:'none',           name:'No Frame', icon:'✕' },
  { key:'square-thin',    name:'Sq. Thin', icon:'□' },
  { key:'square-thick',   name:'Sq. Thick',icon:'■' },
  { key:'rounded-border', name:'Rounded',  icon:'▢' },
  { key:'circle-border',  name:'Circle',   icon:'○' },
  { key:'dashed-border',  name:'Dashed',   icon:'⬚' },
  { key:'bracket',        name:'Bracket',  icon:'⌐' },
];

const PRESETS = [
  { name:'Classic',    fgColor:'#000000', bgColor:'#ffffff', pattern:'square',        eyeFrame:'square',        eyeInner:'square'  },
  { name:'Ocean',      fgColor:'#1a5276', bgColor:'#d6eaf8', pattern:'dots',          eyeFrame:'circle',        eyeInner:'circle',  gradient:true, gc1:'#1a5276', gc2:'#2980b9', gType:'linear', gAngle:45  },
  { name:'Forest',     fgColor:'#1e8449', bgColor:'#eafaf1', pattern:'rounded',       eyeFrame:'rounded',       eyeInner:'rounded', gradient:true, gc1:'#1e8449', gc2:'#27ae60', gType:'linear', gAngle:135 },
  { name:'Sunset',     fgColor:'#784212', bgColor:'#fef9e7', pattern:'extra-rounded', eyeFrame:'extra-rounded', eyeInner:'circle',  gradient:true, gc1:'#e67e22', gc2:'#e74c3c', gType:'linear', gAngle:45  },
  { name:'Dark Night', fgColor:'#aed6f1', bgColor:'#1a252f', pattern:'dots',          eyeFrame:'circle',        eyeInner:'circle',  gradient:true, gc1:'#aed6f1', gc2:'#85c1e9', gType:'linear', gAngle:45  },
  { name:'Minimal',    fgColor:'#333333', bgColor:'#ffffff', pattern:'square',        eyeFrame:'square',        eyeInner:'square'  },
  { name:'Galaxy',     fgColor:'#6c3483', bgColor:'#f4ecf7', pattern:'star',          eyeFrame:'diamond',       eyeInner:'star',    gradient:true, gc1:'#6c3483', gc2:'#1a1a2e', gType:'radial' },
  { name:'Gold',       fgColor:'#7d6608', bgColor:'#fef9e7', pattern:'classy',        eyeFrame:'diamond',       eyeInner:'diamond', gradient:true, gc1:'#b7950b', gc2:'#f1c40f', gType:'linear', gAngle:45  },
  { name:'Neon Cyber', fgColor:'#00ff88', bgColor:'#0d0d0d', pattern:'dots',          eyeFrame:'extra-rounded', eyeInner:'circle',  gradient:true, gc1:'#00ff88', gc2:'#00ccff', gType:'linear', gAngle:90  },
  { name:'Pastel',     fgColor:'#a569bd', bgColor:'#fdf2f8', pattern:'rounded',       eyeFrame:'rounded',       eyeInner:'circle',  gradient:true, gc1:'#c39bd3', gc2:'#85c1e9', gType:'linear', gAngle:45  },
  { name:'Retro',      fgColor:'#1a1a1a', bgColor:'#f5f5dc', pattern:'square',        eyeFrame:'square',        eyeInner:'square'  },
  { name:'Tech Blue',  fgColor:'#1565c0', bgColor:'#e3f2fd', pattern:'extra-rounded', eyeFrame:'rounded',       eyeInner:'rounded', gradient:true, gc1:'#1565c0', gc2:'#42a5f5', gType:'linear', gAngle:135 },
];

// =========================================================
// TYPE TABS + FORMS
// =========================================================

function renderTypeTabs() {
  const wrap = document.getElementById('type-tabs');
  if (!wrap) return;
  wrap.innerHTML = QR_TYPES.map(t => `
    <button class="type-tab ${t.key === S.activeType ? 'active' : ''}"
            onclick="selectType('${t.key}', this)">
      <i class="fa-solid ${t.icon}"></i>${t.label}
    </button>`).join('');
}

function selectType(key, btn) {
  S.activeType = key;
  document.querySelectorAll('.type-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderForm(key);
  schedRender();
}

function renderForm(key) {
  const type  = QR_TYPES.find(t => t.key === key);
  const title = document.getElementById('form-title');
  const body  = document.getElementById('form-fields');
  if (title) title.textContent = type ? type.title : key;
  if (body)  body.innerHTML = FORMS[key] || '';
}

// =========================================================
// PATTERN / EYE GRIDS
// =========================================================

function renderDesignGrid() {
  _renderPatternGrid('design-grid', PATTERNS, 'pattern', (key) => { S.pattern = key; });
}
function renderEyeFrameGrid() {
  _renderEyeGrid('eyeframe-grid', EYE_FRAMES, 'eyeFrame', (key) => { S.eyeFrame = key; }, false);
}
function renderEyeInnerGrid() {
  _renderEyeGrid('eyeinner-grid', EYE_INNERS, 'eyeInner', (key) => { S.eyeInner = key; }, true);
}

function _renderPatternGrid(containerId, items, stateKey, onSelect) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach(p => {
    const item = document.createElement('div');
    item.className = 'p-item' + (p.key === S[stateKey] ? ' active' : '');
    item.title = p.name;

    const c = document.createElement('canvas');
    c.width = 60; c.height = 60;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 60, 60);
    [[5,5],[24,5],[43,5],[5,24],[24,24],[43,24],[5,43],[24,43],[43,43]]
      .forEach(([x,y]) => drawModule(ctx, x, y, 17, p.key, '#222'));

    const lbl = document.createElement('div');
    lbl.className = 'p-name';
    lbl.textContent = p.name;

    item.appendChild(c);
    item.appendChild(lbl);
    item.onclick = () => {
      onSelect(p.key);
      grid.querySelectorAll('.p-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      schedRender();
    };
    grid.appendChild(item);
  });
}

function _renderEyeGrid(containerId, items, stateKey, onSelect, innerMode) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach(ef => {
    const item = document.createElement('div');
    item.className = 'p-item' + (ef.key === S[stateKey] ? ' active' : '');
    item.title = ef.name;

    const c = document.createElement('canvas');
    c.width = 60; c.height = 60;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#f5f5f5'; ctx.fillRect(0, 0, 60, 60);
    const cs = (60 - 8) / 7;
    if (innerMode) {
      drawEye(ctx, 4, 4, cs, 'square', ef.key, '#222', '#222', '#f5f5f5');
    } else {
      drawEye(ctx, 4, 4, cs, ef.key, 'square', '#222', '#222', '#f5f5f5');
    }

    const lbl = document.createElement('div');
    lbl.className = 'p-name';
    lbl.textContent = ef.name;

    item.appendChild(c);
    item.appendChild(lbl);
    item.onclick = () => {
      onSelect(ef.key);
      grid.querySelectorAll('.p-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      schedRender();
    };
    grid.appendChild(item);
  });
}

// =========================================================
// LOGO
// =========================================================

function renderLogoGrid(filter = '') {
  const grid = document.getElementById('logo-grid');
  if (!grid) return;
  const list = filter
    ? LOGO_PRESETS.filter(l => l.label.toLowerCase().includes(filter.toLowerCase()))
    : LOGO_PRESETS;

  grid.innerHTML = list.map(l => `
    <div class="l-item ${S.logoKey === l.key ? 'active' : ''}"
         onclick="selectLogoPreset('${l.key}')"
         title="${l.label}"
         style="color:${l.color};">
      <i class="${l.icon}"></i>
    </div>`).join('');
}

function filterLogos(val) { renderLogoGrid(val); }

function selectLogoPreset(key) {
  if (key === 'none') {
    S.logoKey = null; S.logoSrc = null;
    document.getElementById('logo-prev-area').innerHTML = '';
  } else {
    const preset = LOGO_PRESETS.find(l => l.key === key);
    S.logoKey = key;
    if (preset) S.logoSrc = _genIconLogo(preset);
  }
  renderLogoGrid();
  schedRender();
}

function _genIconLogo(preset) {
  const c = document.createElement('canvas');
  c.width = 100; c.height = 100;
  const ctx = c.getContext('2d');
  ctx.fillStyle = preset.color;
  try { ctx.roundRect(0, 0, 100, 100, 18); } catch(e) { ctx.rect(0, 0, 100, 100); }
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(preset.label[0].toUpperCase(), 50, 53);
  return c.toDataURL();
}

function handleLogoFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { showToast('File too large (max 5 MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = (e) => {
    S.logoSrc = e.target.result;
    S.logoKey = 'custom';
    document.getElementById('logo-prev-area').innerHTML = `
      <div class="logo-prev">
        <img src="${e.target.result}" alt="Logo">
        <span class="lp-name">${escHtml(file.name)}</span>
        <button class="lp-rm" onclick="removeLogo()">
          <i class="fa-solid fa-xmark"></i> Remove
        </button>
      </div>`;
    renderLogoGrid();
    schedRender();
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function handleLogoDrop(e) {
  e.preventDefault();
  document.getElementById('logo-upload').classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (!file) return;
  const dt = new DataTransfer();
  dt.items.add(file);
  const inp = document.getElementById('logo-file');
  inp.files = dt.files;
  handleLogoFile(inp);
}

function removeLogo() {
  S.logoSrc = null; S.logoKey = null;
  document.getElementById('logo-prev-area').innerHTML = '';
  renderLogoGrid();
  schedRender();
}

// =========================================================
// FRAME GRIDS
// =========================================================

function renderFrameGrids() {
  _buildFrameGrid('frame-label-grid',   FRAMES_WITH_LABEL);
  _buildFrameGrid('frame-nolabel-grid', FRAMES_NO_LABEL);
}

function _buildFrameGrid(id, list) {
  const grid = document.getElementById(id);
  if (!grid) return;
  grid.innerHTML = list.map(f => `
    <div class="f-item ${S.frame === f.key ? 'active' : ''}"
         onclick="selectFrame('${f.key}')">
      <div class="f-icon">${f.icon}</div>
      <div class="f-name">${f.name}</div>
    </div>`).join('');
}

function selectFrame(key) {
  S.frame = key;
  renderFrameGrids();
  schedRender();
}

// =========================================================
// TEMPLATES
// =========================================================

function renderPresetTemplates() {
  const grid = document.getElementById('preset-tgrid');
  if (!grid) return;
  grid.innerHTML = PRESETS.map((p, i) => `
    <div class="t-card" onclick="applyPreset(${i})">
      <div class="t-prev" style="background:${p.bgColor || '#fff'};">
        <div style="
          width:46px; height:46px;
          background:${p.fgColor || '#000'};
          border-radius:${p.pattern === 'dots' ? '50%' : p.pattern === 'rounded' ? '30%' : '5px'};
          opacity:.9;
        "></div>
      </div>
      <div class="t-name">${p.name}</div>
    </div>`).join('');
}

function applyPreset(index) {
  const p = PRESETS[index];
  if (!p) return;
  ['fgColor','bgColor','pattern','eyeFrame','eyeInner','frameColor',
   'gradient','gc1','gc2','gType','gAngle'].forEach(f => {
    if (p[f] !== undefined) S[f] = p[f];
  });
  syncAllUI();
  schedRender();
  showToast('Applied: ' + p.name, 'success');
}

// =========================================================
// COLOR SYNC
// =========================================================

const COLOR_MAP = {
  fg:'fgColor', bg:'bgColor',
  gc1:'gc1',    gc2:'gc2',
  mb:'mbColor', mc:'mcColor',
  ef:'efColor', ei:'eiColor',
  lpc:'logoPadColor',
  flc:'frameLabelColor',
  fc:'frameColor', fc2:'frameColor',
  sc:'shadowColor',
};

function syncColor(key, val) {
  if (!val.match(/^#[0-9A-Fa-f]{6}$/)) return;
  const sk = COLOR_MAP[key];
  if (sk) S[sk] = val;
  const sw  = document.getElementById(key + '-sw');
  const hex = document.getElementById(key + '-hex');
  if (sw)  sw.style.background = val;
  if (hex) hex.value = val;
  schedRender();
}

function syncHex(key, val) {
  if (!val.match(/^#[0-9A-Fa-f]{6}$/)) return;
  syncColor(key, val);
  const ci = document.getElementById(key + '-color');
  if (ci) ci.value = val;
}

function syncAllUI() {
  // Sync color swatches + hex fields + pickers
  Object.entries(COLOR_MAP).forEach(([key, sk]) => {
    const val = S[sk];
    if (!val) return;
    const sw  = document.getElementById(key + '-sw');
    const hex = document.getElementById(key + '-hex');
    const ci  = document.getElementById(key + '-color');
    if (sw)  sw.style.background = val;
    if (hex) hex.value = val;
    if (ci)  ci.value  = val;
  });
  // Size / EC
  const sz = document.getElementById('qr-size');   if (sz) sz.value = S.size;
  const ec = document.getElementById('ec-level');  if (ec) ec.value = S.ec;
  // Quiet zone
  const qz = document.getElementById('qz-slider');
  if (qz) { qz.value = S.qz; }
  const qzv = document.getElementById('qz-val');
  if (qzv) qzv.textContent = S.qz + ' mod';
  // Checkboxes
  const setBool = (id, v) => { const el = document.getElementById(id); if (el) el.checked = v; };
  setBool('scan-opt', S.scanOpt); setBool('transparent', S.transparent);
  setBool('use-grad', S.gradient); setBool('custom-marker', S.customMarker);
  setBool('custom-ef', S.customEF); setBool('custom-ei', S.customEI);
  setBool('logo-rmbg', S.logoRemoveBG); setBool('flip-h', S.flipH);
  setBool('flip-v', S.flipV); setBool('invert-c', S.invert);
  setBool('use-shadow', S.shadow);
  // Sub-panels
  const show = (id, cond) => { const el = document.getElementById(id); if (el) el.style.display = cond ? 'block' : 'none'; };
  show('grad-opts', S.gradient); show('marker-opts', S.customMarker);
  show('ef-opts', S.customEF);   show('ei-opts', S.customEI);
  show('shadow-opts', S.shadow);
  // Sliders
  const setSlider = (id, vid, val, sfx) => {
    const el = document.getElementById(id); if (el) el.value = val;
    const vl = document.getElementById(vid); if (vl) vl.textContent = val + sfx;
  };
  setSlider('logo-size',   'ls-val',  S.logoSize,   '%');
  setSlider('logo-br',     'lbr-val', S.logoBR,     '%');
  setSlider('logo-pad',    'lp-val',  S.logoPad,    'px');
  setSlider('frame-ts',    'fts-v',   S.frameTSize, '%');
  setSlider('shadow-blur', 'sb-v',    S.shadowBlur, 'px');
  setSlider('grad-angle',  'ga-val',  S.gAngle,     '°');
  // Selects
  const setSel = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  setSel('grad-type', S.gType); setSel('qr-rotation', S.rotation); setSel('qr-filter', S.filter);
  // Text inputs
  const setVal = (id, v) => { const el = document.getElementById(id); if (el) el.value = v; };
  setVal('frame-label', S.frameLabel); setVal('frame-font', S.frameFont);
  // Re-render visual grids
  renderDesignGrid();
  renderEyeFrameGrid();
  renderEyeInnerGrid();
  renderFrameGrids();
  renderLogoGrid();
}

// =========================================================
// MODE / CARD / TAB SWITCHING
// =========================================================

function switchMode(mode, btn) {
  document.querySelectorAll('.nav-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const ids = { gen:'mode-gen', scan:'mode-scan', batch:'mode-batch', hist:'mode-hist' };
  Object.entries(ids).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = key === mode ? 'flex' : 'none';
  });
  if (mode === 'hist') renderHistory();
}

function toggleCard(header) {
  header.classList.toggle('open');
  const body = header.nextElementSibling;
  if (body) body.classList.toggle('hidden');
}

function switchCTab(i, btn) {
  document.querySelectorAll('.ctab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.csub').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const panel = document.getElementById('ctab-' + i);
  if (panel) panel.classList.add('active');
}

function switchStab(group, i, btn) {
  btn.parentElement.querySelectorAll('.stab').forEach(s => s.classList.remove('active'));
  btn.classList.add('active');
  for (let j = 0; j < 5; j++) {
    const p = document.getElementById(group + '-' + j);
    if (p) p.classList.remove('active');
  }
  const target = document.getElementById(group + '-' + i);
  if (target) target.classList.add('active');
}

// =========================================================
// MODALS + DROPDOWN
// =========================================================

function openModal(id)  { const el = document.getElementById(id); if (el) el.classList.add('open'); }
function closeModal(id) { const el = document.getElementById(id); if (el) el.classList.remove('open'); }
function openSaveModal() { openModal('save-modal'); setTimeout(() => { const inp = document.getElementById('save-name'); if (inp) inp.focus(); }, 180); }

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-bg')) e.target.classList.remove('open');
  if (!e.target.closest('.dl-wrap')) closeDLDropdown();
});

function toggleDLDropdown() { document.getElementById('dl-dropdown').classList.toggle('open'); }
function closeDLDropdown()  { const dd = document.getElementById('dl-dropdown'); if (dd) dd.classList.remove('open'); }

// =========================================================
// DARK MODE
// =========================================================

function toggleDark() {
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  const icon = document.getElementById('dark-icon');
  if (icon) icon.className = isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
  try { localStorage.setItem('qr_theme', html.dataset.theme); } catch (e) {}
}

// =========================================================
// MISC HELPERS
// =========================================================

function adjSize(delta) {
  const inp = document.getElementById('qr-size');
  S.size = Math.min(2000, Math.max(100, (parseInt(inp.value) || 600) + delta));
  inp.value = S.size;
  schedRender();
}
function setSize(v) {
  S.size = v;
  const inp = document.getElementById('qr-size');
  if (inp) inp.value = v;
  schedRender();
}
function togglePw(id) {
  const el = document.getElementById(id);
  if (el) el.type = el.type === 'password' ? 'text' : 'password';
}
function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = document.getElementById('f-lat');
      const lng = document.getElementById('f-lng');
      if (lat) lat.value = pos.coords.latitude.toFixed(6);
      if (lng) lng.value = pos.coords.longitude.toFixed(6);
      schedRender();
      showToast('Location detected!', 'success');
    },
    (err) => showToast('Location error: ' + err.message, 'error')
  );
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// =========================================================
// TOASTS
// =========================================================

function showToast(msg, type = 'info', dur = 3000) {
  const icons = { success:'fa-circle-check', error:'fa-circle-xmark', warning:'fa-triangle-exclamation', info:'fa-circle-info' };
  const t = document.createElement('div');
  t.className = `toast t-${type}`;
  t.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i>${escHtml(msg)}`;
  document.getElementById('toasts').appendChild(t);
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 350); }, dur);
}

// =========================================================
// HISTORY
// =========================================================

function saveHistory(data) {
  if (!data) return;
  const canvas = document.getElementById('qr-canvas');
  let thumb = '';
  if (canvas && canvas.style.display !== 'none') {
    try {
      const tmp = document.createElement('canvas');
      tmp.width = 64; tmp.height = 64;
      tmp.getContext('2d').drawImage(canvas, 0, 0, 64, 64);
      thumb = tmp.toDataURL();
    } catch (e) {}
  }
  let hist = getHistory();
  if (hist.length && hist[0].data === data) return;
  hist.unshift({ id: Date.now().toString(), data, type: S.activeType, thumb, date: new Date().toLocaleString() });
  hist = hist.slice(0, 50);
  try { localStorage.setItem('qr_history', JSON.stringify(hist)); } catch (e) {}
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem('qr_history') || '[]'); } catch (e) { return []; }
}

function clearHistory() {
  if (!confirm('Clear all QR history?')) return;
  try { localStorage.removeItem('qr_history'); } catch (e) {}
  renderHistory();
  showToast('History cleared', 'info');
}

function renderHistory(filter = '') {
  const container = document.getElementById('hist-list');
  if (!container) return;
  let hist = getHistory();
  if (filter) hist = hist.filter(h => h.data.toLowerCase().includes(filter.toLowerCase()));
  if (!hist.length) {
    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-clock-rotate-left"></i>No history yet</div>`;
    return;
  }
  container.innerHTML = hist.map(h => `
    <div class="h-item">
      <canvas class="h-thumb" id="hc-${h.id}" width="56" height="56"></canvas>
      <div class="h-info">
        <div class="h-data">${escHtml(h.data)}</div>
        <div class="h-meta"><span class="badge badge-blue">${escHtml(h.type)}</span> &nbsp;${escHtml(h.date)}</div>
      </div>
      <div class="h-acts">
        <button class="btn btn-primary btn-sm" onclick="reopenHistory('${h.id}')" title="Edit">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="btn btn-ghost btn-sm" onclick="dlHistoryItem('${h.id}')" title="Download">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>
    </div>`).join('');
  hist.forEach(h => {
    if (!h.thumb) return;
    const c = document.getElementById('hc-' + h.id);
    if (!c) return;
    const img = new Image();
    img.onload = () => c.getContext('2d').drawImage(img, 0, 0, 56, 56);
    img.src = h.thumb;
  });
}

function reopenHistory(id) {
  const h = getHistory().find(h => h.id === id);
  if (!h) return;
  switchMode('gen', document.querySelector('.nav-tab[data-mode="gen"]'));
  S.activeType = h.type;
  renderTypeTabs();
  renderForm(h.type);
  setTimeout(() => {
    const first = document.querySelector('.qr-input:not([type="checkbox"]):not(select)');
    if (first) first.value = h.data;
    schedRender();
  }, 100);
}

function dlHistoryItem(id) {
  const h = getHistory().find(h => h.id === id);
  if (!h || !h.thumb) return;
  const link = document.createElement('a');
  link.download = `qr-${id}.png`;
  link.href = h.thumb;
  link.click();
}
