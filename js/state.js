// =========================================================
// STATE.JS — Global application state, QR types & forms
// QR Prism v2.4
// =========================================================

// ── Global QR Settings State ──────────────────────────────
const S = {
  activeType: 'url',
  inputData: '',
  size: 600,
  ec: 'H',
  qz: 4,
  scanOpt: false,
  fgColor: '#000000',
  bgColor: '#ffffff',
  transparent: false,
  gradient: false,
  gType: 'linear',
  gc1: '#818CF8',
  gc2: '#C084FC',
  gAngle: 45,
  customMarker: false,
  mbColor: '#000000',
  mcColor: '#000000',
  customEF: false,
  efColor: '#000000',
  customEI: false,
  eiColor: '#000000',
  pattern: 'pat-square',
  eyeFrame: 'ef-square',
  eyeInner: 'ei-square',
  logoSrc: null,
  logoKey: null,
  logoRemoveBG: true,
  logoSize: 25,
  logoBR: 0,
  logoPad: 4,
  logoPadColor: '#ffffff',
  frame: 'frm-none',
  frameLabel: 'Scan Me',
  frameFont: 'Poppins',
  frameTSize: 100,
  frameLabelColor: '#ffffff',
  frameColor: '#818CF8',
  rotation: 0,
  flipH: false,
  flipV: false,
  filter: 'none',
  invert: false,
  shadow: false,
  shadowColor: '#000000',
  shadowBlur: 10,
};

// ── App Settings State ──────────────────────────────────
const SETTINGS = {
  theme: 'dark',
  autoSaveProjects: true,
  confirmDelete: true,
  defaultFormat: 'png',
  defaultSize: 600,
  defaultEC: 'H',
  showAnalytics: true,
  highDPI: true,
  animateUI: true,
  // Profile
  profileName: '',
  profileEmail: '',
  profileBio: '',
  profileWeb: '',
  profileAvatarUrl: '',
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('qrp_settings');
    if (saved) Object.assign(SETTINGS, JSON.parse(saved));
  } catch(e) {}
  applyTheme(SETTINGS.theme);
}

function saveSettingsData() {
  try { localStorage.setItem('qrp_settings', JSON.stringify(SETTINGS)); } catch(e) {}
}

function applyTheme(t) {
  if (t === 'system') {
    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', t);

  // Update SVG logos based on theme
  const logoSvgDark = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="60" height="60" rx="12" stroke="#F8FAFC" stroke-width="10"/><rect x="38" y="38" width="24" height="24" rx="4" fill="#F8FAFC"/><path d="M 70 70 L 88 88" stroke="#818CF8" stroke-width="12" stroke-linecap="round"/></svg>`;
  const logoSvgLight = `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="20" width="60" height="60" rx="12" stroke="#1E1B4B" stroke-width="10"/><rect x="38" y="38" width="24" height="24" rx="4" fill="#1E1B4B"/><path d="M 70 70 L 88 88" stroke="#818CF8" stroke-width="12" stroke-linecap="round"/></svg>`;
  const logoSvg = (t === 'light') ? logoSvgLight : logoSvgDark;

  document.querySelectorAll('.sidebar-logo-icon, .topnav-logo-icon, .mobile-header-logo-icon').forEach(el => {
    el.innerHTML = logoSvg;
  });

  // Update moon/sun icons
  const darkBtns = document.querySelectorAll('#dark-btn i, #mobile-dark-icon, #bs-dark-icon');
  darkBtns.forEach(i => {
    if (i) {
      i.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  });
}

function toggleDark() {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? 'light' : 'dark';
  SETTINGS.theme = next;
  saveSettingsData();
  applyTheme(next);
}

// ── Undo / Redo ──────────────────────────────────────────
const HISTORY = [];
let HIST_IDX = -1;
const MAX_HIST = 50;

function pushHistory() {
  const snap = JSON.stringify(S);
  if (HIST_IDX < HISTORY.length - 1) HISTORY.splice(HIST_IDX + 1);
  HISTORY.push(snap);
  if (HISTORY.length > MAX_HIST) HISTORY.shift();
  HIST_IDX = HISTORY.length - 1;
}

function undo() {
  if (HIST_IDX > 0) {
    HIST_IDX--;
    Object.assign(S, JSON.parse(HISTORY[HIST_IDX]));
    syncUIFromState();
    schedRender();
    showToast('Undo', 'info');
  }
}

function redo() {
  if (HIST_IDX < HISTORY.length - 1) {
    HIST_IDX++;
    Object.assign(S, JSON.parse(HISTORY[HIST_IDX]));
    syncUIFromState();
    schedRender();
    showToast('Redo', 'info');
  }
}

function syncUIFromState() {
  // Sync form inputs with S values (basic fields)
  const setVal = (id, val) => { const el = document.getElementById(id); if(el) el.value = val; };
  const setChk = (id, v) => { const el = document.getElementById(id); if(el) el.checked = v; };
  setVal('qr-size', S.size);
  setVal('ec-level', S.ec);
  setVal('qz-slider', S.qz);
  setChk('scan-opt', S.scanOpt);
  // Colors
  ['fg','bg','gc1','gc2','mb','mc','ef','ei','lpc','flc','fc','fc2','sc'].forEach(k => {
    const val = S[k+'Color'] || S[k];
    if (!val) return;
    const sw = document.getElementById(k+'-sw');
    const inp = document.getElementById(k+'-color');
    const hex = document.getElementById(k+'-hex');
    if (sw) sw.style.background = val;
    if (inp) inp.value = val;
    if (hex) hex.value = val;
  });
}

// ── QR Types ─────────────────────────────────────────────
const QR_TYPES = [
  { key:'url',       label:'URL',       title:'Website URL',         icon:'fa-link' },
  { key:'text',      label:'Text',      title:'Plain Text',          icon:'fa-font' },
  { key:'email',     label:'Email',     title:'Email Address',       icon:'fa-envelope' },
  { key:'phone',     label:'Phone',     title:'Phone Number',        icon:'fa-phone' },
  { key:'sms',       label:'SMS',       title:'Send SMS',            icon:'fa-message' },
  { key:'wifi',      label:'WiFi',      title:'WiFi Network',        icon:'fa-wifi' },
  { key:'vcard',     label:'vCard',     title:'Contact Card',        icon:'fa-address-card' },
  { key:'whatsapp',  label:'WhatsApp',  title:'WhatsApp Chat',       icon:'fa-brands fa-whatsapp' },
  { key:'telegram',  label:'Telegram',  title:'Telegram',            icon:'fa-brands fa-telegram' },
  { key:'instagram', label:'Instagram', title:'Instagram Profile',   icon:'fa-brands fa-instagram' },
  { key:'facebook',  label:'Facebook',  title:'Facebook Profile',    icon:'fa-brands fa-facebook' },
  { key:'youtube',   label:'YouTube',   title:'YouTube Channel',     icon:'fa-brands fa-youtube' },
  { key:'twitter',   label:'X/Twitter', title:'X / Twitter Profile', icon:'fa-brands fa-x-twitter' },
  { key:'linkedin',  label:'LinkedIn',  title:'LinkedIn Profile',    icon:'fa-brands fa-linkedin' },
  { key:'location',  label:'Location',  title:'GPS Location',        icon:'fa-location-dot' },
  { key:'bitcoin',   label:'Bitcoin',   title:'Bitcoin Address',     icon:'fa-brands fa-bitcoin' },
  { key:'calendar',  label:'Event',     title:'Calendar Event',      icon:'fa-calendar-plus' },
];

// ── Type brand logos map ──────────────────────────────────
const TYPE_LOGO_MAP = {
  whatsapp:  'logo-whatsapp',
  telegram:  'logo-telegram',
  instagram: 'logo-instagram',
  facebook:  'logo-facebook',
  youtube:   'logo-youtube',
  twitter:   'logo-twitter',
  linkedin:  'logo-linkedin',
  wifi:      'logo-wifi',
  bitcoin:   'logo-bitcoin',
};

// ── Type icons for project badges ────────────────────────
const TYPE_ICONS = {
  url: 'fa-link', text: 'fa-font', email: 'fa-envelope', phone: 'fa-phone',
  sms: 'fa-message', wifi: 'fa-wifi', vcard: 'fa-address-card',
  whatsapp: 'fa-brands fa-whatsapp', telegram: 'fa-brands fa-telegram',
  instagram: 'fa-brands fa-instagram', facebook: 'fa-brands fa-facebook',
  youtube: 'fa-brands fa-youtube', twitter: 'fa-brands fa-x-twitter',
  linkedin: 'fa-brands fa-linkedin', location: 'fa-location-dot',
  bitcoin: 'fa-brands fa-bitcoin', calendar: 'fa-calendar-plus',
};

// ── Forms ─────────────────────────────────────────────────
const FORMS = {
  url: `
    <div class="field-label">Website URL</div>
    <input class="input" id="f-url" type="url" placeholder="https://example.com"
           oninput="S.inputData=this.value; autoSaveToProjects(this.value); schedRender()">`,

  text: `
    <div class="field-label">Text Content</div>
    <textarea class="input" id="f-text" rows="4" placeholder="Enter your text here…"
              oninput="S.inputData=this.value; autoSaveToProjects(this.value); schedRender()"></textarea>`,

  email: `
    <div class="field-label">Email Address</div>
    <input class="input" id="f-email" type="email" placeholder="user@example.com"
           oninput="buildEmail()">
    <div class="field-label" style="margin-top:8px;">Subject (optional)</div>
    <input class="input" id="f-esubj" placeholder="Subject"
           oninput="buildEmail()">
    <div class="field-label" style="margin-top:8px;">Body (optional)</div>
    <textarea class="input" id="f-ebody" rows="3" placeholder="Message body…"
              oninput="buildEmail()"></textarea>`,

  phone: `
    <div class="field-label">Phone Number</div>
    <input class="input" id="f-phone" type="tel" placeholder="+8801XXXXXXXXX"
           oninput="S.inputData='tel:'+this.value; autoSaveToProjects(S.inputData); schedRender()">`,

  sms: `
    <div class="field-label">Phone Number</div>
    <input class="input" id="f-sms" type="tel" placeholder="+8801XXXXXXXXX" oninput="buildSMS()">
    <div class="field-label" style="margin-top:8px;">Message (optional)</div>
    <textarea class="input" id="f-smsmsg" rows="3" placeholder="Your message…" oninput="buildSMS()"></textarea>`,

  wifi: `
    <div class="field-label">Network Name (SSID)</div>
    <input class="input" id="f-wifi-ssid" placeholder="MyWiFi" oninput="buildWiFi()">
    <div class="field-label" style="margin-top:8px;">Password</div>
    <input class="input" id="f-wifi-pass" type="password" placeholder="••••••••" oninput="buildWiFi()">
    <div class="field-label" style="margin-top:8px;">Security</div>
    <select class="select" id="f-wifi-enc" onchange="buildWiFi()">
      <option value="WPA">WPA/WPA2</option>
      <option value="WEP">WEP</option>
      <option value="">None</option>
    </select>
    <div class="toggle-row" style="margin-top:10px;">
      <label>Hidden Network</label>
      <label class="toggle"><input type="checkbox" id="f-wifi-hidden" onchange="buildWiFi()"><span class="toggle-slider"></span></label>
    </div>`,

  vcard: `
    <div class="two-col">
      <div><div class="field-label">First Name</div><input class="input" id="f-fn" placeholder="Muhtasim" oninput="buildVCard()"></div>
      <div><div class="field-label">Last Name</div><input class="input" id="f-ln" placeholder="Rahman" oninput="buildVCard()"></div>
    </div>
    <div class="field-label" style="margin-top:8px;">Organization</div>
    <input class="input" id="f-org" placeholder="Company Name" oninput="buildVCard()">
    <div class="field-label" style="margin-top:8px;">Phone</div>
    <input class="input" id="f-vphone" type="tel" placeholder="+880…" oninput="buildVCard()">
    <div class="field-label" style="margin-top:8px;">Email</div>
    <input class="input" id="f-vemail" type="email" placeholder="user@example.com" oninput="buildVCard()">
    <div class="field-label" style="margin-top:8px;">Website</div>
    <input class="input" id="f-vweb" type="url" placeholder="https://…" oninput="buildVCard()">`,

  whatsapp: `
    <div class="field-label">Phone Number</div>
    <input class="input" id="f-wa" type="tel" placeholder="+8801XXXXXXXXX" oninput="buildWhatsApp()">
    <div class="field-label" style="margin-top:8px;">Pre-filled Message</div>
    <textarea class="input" id="f-wamsg" rows="3" placeholder="Hello!" oninput="buildWhatsApp()"></textarea>`,

  telegram: `
    <div class="field-label">Username (without @)</div>
    <input class="input" id="f-tg" placeholder="username"
           oninput="S.inputData='https://t.me/'+this.value; autoSaveToProjects(S.inputData); schedRender()">`,

  instagram: `
    <div class="field-label">Instagram Username</div>
    <input class="input" id="f-ig" placeholder="username"
           oninput="S.inputData='https://instagram.com/'+this.value; autoSaveToProjects(S.inputData); schedRender()">`,

  facebook: `
    <div class="field-label">Facebook Profile URL or Username</div>
    <input class="input" id="f-fb" placeholder="username or full URL"
           oninput="S.inputData=this.value.startsWith('http')?this.value:'https://facebook.com/'+this.value; autoSaveToProjects(S.inputData); schedRender()">`,

  youtube: `
    <div class="field-label">YouTube Channel URL</div>
    <input class="input" id="f-yt" type="url" placeholder="https://youtube.com/@channel"
           oninput="S.inputData=this.value; autoSaveToProjects(this.value); schedRender()">`,

  twitter: `
    <div class="field-label">X/Twitter Username</div>
    <input class="input" id="f-tw" placeholder="username"
           oninput="S.inputData='https://x.com/'+this.value; autoSaveToProjects(S.inputData); schedRender()">`,

  linkedin: `
    <div class="field-label">LinkedIn Profile URL</div>
    <input class="input" id="f-li" type="url" placeholder="https://linkedin.com/in/username"
           oninput="S.inputData=this.value; autoSaveToProjects(this.value); schedRender()">`,

  location: `
    <div class="field-label">Latitude</div>
    <input class="input" id="f-lat" type="number" step="any" placeholder="23.8103" oninput="buildLocation()">
    <div class="field-label" style="margin-top:8px;">Longitude</div>
    <input class="input" id="f-lng" type="number" step="any" placeholder="90.4125" oninput="buildLocation()">
    <button class="btn btn-ghost btn-sm" style="margin-top:10px;" onclick="useCurrentLocation()">
      <i class="fa-solid fa-location-crosshairs"></i> Use My Location
    </button>`,

  bitcoin: `
    <div class="field-label">Bitcoin Address</div>
    <input class="input" id="f-btc" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7Divf" oninput="buildBitcoin()">
    <div class="field-label" style="margin-top:8px;">Amount (BTC, optional)</div>
    <input class="input" id="f-btcamt" type="number" step="any" min="0" placeholder="0.001" oninput="buildBitcoin()">`,

  calendar: `
    <div class="field-label">Event Title</div>
    <input class="input" id="f-evt" placeholder="Meeting title" oninput="buildCalendar()">
    <div class="two-col" style="margin-top:8px;">
      <div><div class="field-label">Start Date & Time</div><input class="input" id="f-evtstart" type="datetime-local" oninput="buildCalendar()"></div>
      <div><div class="field-label">End Date & Time</div><input class="input" id="f-evtend" type="datetime-local" oninput="buildCalendar()"></div>
    </div>
    <div class="field-label" style="margin-top:8px;">Location</div>
    <input class="input" id="f-evtloc" placeholder="Office, Zoom link, etc." oninput="buildCalendar()">
    <div class="field-label" style="margin-top:8px;">Description</div>
    <textarea class="input" id="f-evtdesc" rows="2" placeholder="Optional notes…" oninput="buildCalendar()"></textarea>`,
};

// ── Builder functions ─────────────────────────────────────
function buildEmail() {
  const e = v('f-email'), s = v('f-esubj'), b = v('f-ebody');
  let data = 'mailto:' + e;
  const params = [];
  if (s) params.push('subject=' + encodeURIComponent(s));
  if (b) params.push('body=' + encodeURIComponent(b));
  if (params.length) data += '?' + params.join('&');
  S.inputData = data;
  autoSaveToProjects(data);
  schedRender();
}
function buildSMS() {
  const p = v('f-sms'), m = v('f-smsmsg');
  S.inputData = 'sms:' + p + (m ? '?body=' + encodeURIComponent(m) : '');
  autoSaveToProjects(S.inputData);
  schedRender();
}
function buildWiFi() {
  const ssid = v('f-wifi-ssid'), pass = v('f-wifi-pass'),
        enc  = v('f-wifi-enc'),
        hid  = document.getElementById('f-wifi-hidden')?.checked ? 'true' : 'false';
  S.inputData = `WIFI:T:${enc};S:${ssid};P:${pass};H:${hid};;`;
  autoSaveToProjects(S.inputData);
  schedRender();
}
function buildVCard() {
  const fn = v('f-fn'), ln = v('f-ln'), org = v('f-org'),
        ph = v('f-vphone'), em = v('f-vemail'), web = v('f-vweb');
  S.inputData = `BEGIN:VCARD\nVERSION:3.0\nFN:${fn} ${ln}\nN:${ln};${fn};;;\nORG:${org}\nTEL:${ph}\nEMAIL:${em}\nURL:${web}\nEND:VCARD`;
  autoSaveToProjects(S.inputData);
  schedRender();
}
function buildWhatsApp() {
  const p = v('f-wa').replace(/\D/g,''), m = v('f-wamsg');
  S.inputData = 'https://wa.me/' + p + (m ? '?text=' + encodeURIComponent(m) : '');
  autoSaveToProjects(S.inputData);
  schedRender();
}
function buildLocation() {
  const lat = v('f-lat'), lng = v('f-lng');
  if (lat && lng) {
    S.inputData = `geo:${lat},${lng}`;
    autoSaveToProjects(S.inputData);
    schedRender();
  }
}
function buildBitcoin() {
  const addr = v('f-btc'), amt = v('f-btcamt');
  S.inputData = `bitcoin:${addr}` + (amt ? `?amount=${amt}` : '');
  autoSaveToProjects(S.inputData);
  schedRender();
}
function buildCalendar() {
  const t = v('f-evt'),
        s = (v('f-evtstart') || '').replace(/[-:T]/g,''),
        e = (v('f-evtend')   || '').replace(/[-:T]/g,''),
        l = v('f-evtloc'), d = v('f-evtdesc');
  S.inputData = `BEGIN:VEVENT\nSUMMARY:${t}\nDTSTART:${s}\nDTEND:${e}\nLOCATION:${l}\nDESCRIPTION:${d}\nEND:VEVENT`;
  autoSaveToProjects(S.inputData);
  schedRender();
}
function useCurrentLocation() {
  if (!navigator.geolocation) return showToast('Geolocation not supported', 'error');
  navigator.geolocation.getCurrentPosition(pos => {
    const lat = pos.coords.latitude.toFixed(6);
    const lng = pos.coords.longitude.toFixed(6);
    const latEl = document.getElementById('f-lat');
    const lngEl = document.getElementById('f-lng');
    if (latEl) latEl.value = lat;
    if (lngEl) lngEl.value = lng;
    buildLocation();
    showToast('Location acquired', 'success');
  }, () => showToast('Could not get location', 'error'));
}

function v(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

// ── Design snapshot ───────────────────────────────────────
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
    gType:    S.gType,
    gAngle:   S.gAngle,
    frame:    S.frame,
    frameLabel: S.frameLabel,
    frameColor: S.frameColor,
    frameLabelColor: S.frameLabelColor,
    logoKey:  S.logoKey,
    logoSrc:  S.logoSrc ? '[image]' : null,
    size:     S.size,
    ec:       S.ec,
  };
}

// ── Helpers ────────────────────────────────────────────────
function escHtml(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function truncate(s, n) {
  s = String(s||'');
  return s.length > n ? s.slice(0, n) + '…' : s;
}
function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  } catch(e) { return iso; }
}
