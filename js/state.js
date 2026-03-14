// =========================================================
// STATE.JS — QR Prism v2.7
// Global state, QR types, form templates, URI builders
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ── Design State (S) ──────────────────────────────────────
const S = {
  // Input
  activeType: 'url',
  inputData: '',

  // Options
  size: 600,
  ec: 'H',
  qz: 4,
  scanOpt: false,

  // Colors
  fgColor: '#000000',
  bgColor: '#ffffff',
  transparent: false,

  // Gradient
  gradient: false,
  gType: 'linear',
  gc1: '#818CF8',
  gc2: '#C084FC',
  gAngle: 45,

  // Marker / Eye colors
  customMarker: false,
  mbColor: '#000000',
  mcColor: '#000000',
  customEF: false,
  efColor: '#000000',
  customEI: false,
  eiColor: '#000000',

  // Patterns
  pattern:  'pat-square',
  eyeFrame: 'ef-square',
  eyeInner: 'ei-square',

  // Logo
  logoSrc: null,
  logoKey: null,
  logoRemoveBG: true,
  logoSize: 25,
  logoBR: 0,
  logoPad: 4,
  logoPadColor: '#ffffff',

  // Frame
  frame: 'frm-none',
  frameLabel: 'Scan Me',
  frameFont: 'Poppins',
  frameTSize: 100,
  frameLabelColor: '#ffffff',
  frameColor: '#818CF8',

  // Advanced
  rotation: 0,
  flipH: false,
  flipV: false,
  filter: 'none',
  invert: false,
  shadow: false,
  shadowColor: '#000000',
  shadowBlur: 10,
};

// ── App Settings (SETTINGS) ───────────────────────────────
const SETTINGS = {
  theme: 'dark',
  accentColor: '#818CF8',
  autoSaveProjects: true,
  confirmDelete: true,
  defaultFormat: 'png',
  defaultSize: 600,
  defaultEC: 'H',
  showAnalytics: true,
  highDPI: true,
  animateUI: true,
};

// ── Undo / Redo ───────────────────────────────────────────
const undoStack = [];
const redoStack = [];
const MAX_UNDO = 30;

// ── Settings Persistence ──────────────────────────────────
function loadSettings() {
  try {
    const raw = localStorage.getItem('qrp_settings');
    if (raw) Object.assign(SETTINGS, JSON.parse(raw));
  } catch(e) {}
  applyTheme(SETTINGS.theme);
  applyAccent(SETTINGS.accentColor);
}

function saveSettingsData() {
  try { localStorage.setItem('qrp_settings', JSON.stringify(SETTINGS)); } catch(e) {}
}

// Alias for backward compat
function saveStg() { saveSettingsData(); }

function applyTheme(t) {
  const resolved = t === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : t;
  document.documentElement.setAttribute('data-theme', resolved);
}

function applyAccent(color) {
  if (!color) return;
  // Update CSS variable
  const r = parseInt(color.slice(1,3),16);
  const g = parseInt(color.slice(3,5),16);
  const b = parseInt(color.slice(5,7),16);
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-glow', `rgba(${r},${g},${b},.22)`);
}

// ── QR Type Definitions ───────────────────────────────────
const QR_TYPES = [
  { key: 'url',       label: 'URL',       icon: 'fa-link',               title: 'Website URL',     autoLogo: null       },
  { key: 'text',      label: 'Text',      icon: 'fa-font',               title: 'Plain Text',       autoLogo: null       },
  { key: 'email',     label: 'Email',     icon: 'fa-envelope',           title: 'Email',            autoLogo: null       },
  { key: 'phone',     label: 'Phone',     icon: 'fa-phone',              title: 'Phone Number',     autoLogo: null       },
  { key: 'sms',       label: 'SMS',       icon: 'fa-comment-sms',        title: 'SMS Message',      autoLogo: null       },
  { key: 'wifi',      label: 'WiFi',      icon: 'fa-wifi',               title: 'WiFi Network',     autoLogo: null       },
  { key: 'vcard',     label: 'vCard',     icon: 'fa-address-card',       title: 'Contact Card',     autoLogo: null       },
  { key: 'whatsapp',  label: 'WhatsApp',  icon: 'fa-brands fa-whatsapp', title: 'WhatsApp',         autoLogo: 'whatsapp' },
  { key: 'telegram',  label: 'Telegram',  icon: 'fa-brands fa-telegram', title: 'Telegram',         autoLogo: 'telegram' },
  { key: 'location',  label: 'Location',  icon: 'fa-location-dot',       title: 'GPS Location',     autoLogo: null       },
  { key: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram',title: 'Instagram',        autoLogo: 'instagram'},
  { key: 'facebook',  label: 'Facebook',  icon: 'fa-brands fa-facebook', title: 'Facebook',         autoLogo: 'facebook' },
  { key: 'youtube',   label: 'YouTube',   icon: 'fa-brands fa-youtube',  title: 'YouTube',          autoLogo: 'youtube'  },
  { key: 'twitter',   label: 'Twitter/X', icon: 'fa-brands fa-x-twitter',title: 'Twitter / X',      autoLogo: 'twitter'  },
  { key: 'bitcoin',   label: 'Crypto',    icon: 'fa-brands fa-bitcoin',  title: 'Crypto Wallet',    autoLogo: 'bitcoin'  },
  { key: 'event',     label: 'Event',     icon: 'fa-calendar-days',      title: 'Calendar Event',   autoLogo: null       },
];

// ── Form HTML ─────────────────────────────────────────────
const FORMS = {
  url: `
    <div class="fg">
      <label class="field-label">Website URL</label>
      <input class="input qr-input" id="f-url" placeholder="https://example.com" value="https://" oninput="schedRender()">
    </div>`,

  text: `
    <div class="fg">
      <label class="field-label">Text Content</label>
      <textarea class="input qr-input" id="f-text" placeholder="Enter your text here..." oninput="schedRender()" rows="4"></textarea>
    </div>`,

  email: `
    <div class="fg">
      <label class="field-label">To (Email Address)</label>
      <input class="input qr-input" id="f-email-to" type="email" placeholder="name@example.com" oninput="schedRender()">
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Subject</label>
        <input class="input qr-input" id="f-email-sub" placeholder="Subject" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">Body (optional)</label>
        <input class="input qr-input" id="f-email-body" placeholder="Message..." oninput="schedRender()">
      </div>
    </div>`,

  phone: `
    <div class="fg">
      <label class="field-label">Phone Number (with country code)</label>
      <input class="input qr-input" id="f-phone" type="tel" placeholder="+8801234567890" oninput="schedRender()">
    </div>`,

  sms: `
    <div class="fg">
      <label class="field-label">Phone Number</label>
      <input class="input qr-input" id="f-sms-num" type="tel" placeholder="+8801234567890" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Message</label>
      <textarea class="input qr-input" id="f-sms-msg" placeholder="Your message..." rows="3" oninput="schedRender()"></textarea>
    </div>`,

  wifi: `
    <div class="fg">
      <label class="field-label">Network Name (SSID)</label>
      <input class="input qr-input" id="f-wifi-ssid" placeholder="MyWiFiNetwork" oninput="schedRender()">
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Password</label>
        <div class="input-pw-wrap" style="display:flex;gap:6px;">
          <input class="input qr-input" id="f-wifi-pass" type="password" placeholder="Password" oninput="schedRender()" style="flex:1;">
          <button class="btn btn-ghost btn-sm" type="button" onclick="togglePw('f-wifi-pass',this)" tabindex="-1" style="padding:6px 10px;flex-shrink:0;">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="fg">
        <label class="field-label">Encryption</label>
        <select class="select qr-input" id="f-wifi-enc" onchange="schedRender()">
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None (Open)</option>
        </select>
      </div>
    </div>
    <div class="toggle-row">
      <label>Hidden Network</label>
      <label class="toggle">
        <input type="checkbox" id="f-wifi-hidden" class="qr-input" onchange="schedRender()">
        <span class="toggle-slider"></span>
      </label>
    </div>`,

  vcard: `
    <div class="two-col">
      <div class="fg">
        <label class="field-label">First Name</label>
        <input class="input qr-input" id="f-vc-fn" placeholder="John" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">Last Name</label>
        <input class="input qr-input" id="f-vc-ln" placeholder="Doe" oninput="schedRender()">
      </div>
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Phone</label>
        <input class="input qr-input" id="f-vc-ph" type="tel" placeholder="+8801234567890" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">Email</label>
        <input class="input qr-input" id="f-vc-em" type="email" placeholder="john@example.com" oninput="schedRender()">
      </div>
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Company</label>
        <input class="input qr-input" id="f-vc-org" placeholder="Company Name" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">Job Title</label>
        <input class="input qr-input" id="f-vc-title" placeholder="Developer" oninput="schedRender()">
      </div>
    </div>
    <div class="fg">
      <label class="field-label">Website</label>
      <input class="input qr-input" id="f-vc-web" placeholder="https://example.com" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Address</label>
      <input class="input qr-input" id="f-vc-addr" placeholder="Dhaka, Bangladesh" oninput="schedRender()">
    </div>`,

  whatsapp: `
    <div class="fg">
      <label class="field-label">Phone Number (with country code)</label>
      <input class="input qr-input" id="f-wa-num" type="tel" placeholder="+8801234567890" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Pre-filled Message (optional)</label>
      <textarea class="input qr-input" id="f-wa-msg" placeholder="Hello! 👋" rows="3" oninput="schedRender()"></textarea>
    </div>`,

  telegram: `
    <div class="fg">
      <label class="field-label">Username or t.me link</label>
      <input class="input qr-input" id="f-tg" placeholder="@username or https://t.me/username" oninput="schedRender()">
    </div>`,

  location: `
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Latitude</label>
        <input class="input qr-input" id="f-lat" placeholder="23.8103" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">Longitude</label>
        <input class="input qr-input" id="f-lng" placeholder="90.4125" oninput="schedRender()">
      </div>
    </div>
    <div class="fg" style="margin-top:8px;">
      <label class="field-label">Label (optional)</label>
      <input class="input qr-input" id="f-loc-label" placeholder="My Location" oninput="schedRender()">
    </div>
    <button class="btn btn-outline btn-sm" style="margin-top:8px;" onclick="useMyLocation()">
      <i class="fa-solid fa-location-crosshairs"></i> Use My Location
    </button>`,

  instagram: `
    <div class="fg">
      <label class="field-label">Instagram Profile URL</label>
      <input class="input qr-input" id="f-ig" placeholder="https://instagram.com/username" oninput="schedRender()">
    </div>`,

  facebook: `
    <div class="fg">
      <label class="field-label">Facebook Profile / Page URL</label>
      <input class="input qr-input" id="f-fb" placeholder="https://facebook.com/username" oninput="schedRender()">
    </div>`,

  youtube: `
    <div class="fg">
      <label class="field-label">YouTube Channel / Video URL</label>
      <input class="input qr-input" id="f-yt" placeholder="https://youtube.com/@channel" oninput="schedRender()">
    </div>`,

  twitter: `
    <div class="fg">
      <label class="field-label">Twitter / X Profile URL</label>
      <input class="input qr-input" id="f-tw" placeholder="https://x.com/username" oninput="schedRender()">
    </div>`,

  bitcoin: `
    <div class="fg">
      <label class="field-label">Cryptocurrency</label>
      <select class="select qr-input" id="f-coin" onchange="updateCryptoLogo(); schedRender()">
        <option value="bitcoin">Bitcoin (BTC)</option>
        <option value="ethereum">Ethereum (ETH)</option>
        <option value="litecoin">Litecoin (LTC)</option>
        <option value="dogecoin">Dogecoin (DOGE)</option>
        <option value="solana">Solana (SOL)</option>
      </select>
    </div>
    <div class="fg">
      <label class="field-label">Wallet Address</label>
      <input class="input qr-input" id="f-wallet" placeholder="Your wallet address..." oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Amount (optional)</label>
      <input class="input qr-input" id="f-amount" placeholder="0.001" type="number" step="any" oninput="schedRender()">
    </div>`,

  event: `
    <div class="fg">
      <label class="field-label">Event Name</label>
      <input class="input qr-input" id="f-ev-name" placeholder="My Event" oninput="schedRender()">
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Start Date &amp; Time</label>
        <input class="input qr-input" type="datetime-local" id="f-ev-start" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">End Date &amp; Time</label>
        <input class="input qr-input" type="datetime-local" id="f-ev-end" oninput="schedRender()">
      </div>
    </div>
    <div class="fg">
      <label class="field-label">Location</label>
      <input class="input qr-input" id="f-ev-loc" placeholder="Event location" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Description (optional)</label>
      <textarea class="input qr-input" id="f-ev-desc" placeholder="Event details..." rows="2" oninput="schedRender()"></textarea>
    </div>`,
};

// ── URI Builders ──────────────────────────────────────────
function buildQRData() {
  const t = S.activeType;
  const g  = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const gc = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

  try {
    switch (t) {
      case 'url': {
        let u = g('f-url');
        if (u && !u.match(/^https?:\/\//i) && !u.match(/^[a-z]+:\/\//i)) u = 'https://' + u;
        return u;
      }
      case 'text': return g('f-text');
      case 'email': {
        const to = g('f-email-to'), sub = g('f-email-sub'), body = g('f-email-body');
        if (!to) return '';
        const params = [];
        if (sub) params.push('subject=' + encodeURIComponent(sub));
        if (body) params.push('body=' + encodeURIComponent(body));
        return `mailto:${to}${params.length ? '?' + params.join('&') : ''}`;
      }
      case 'phone': {
        const p = g('f-phone');
        return p ? 'tel:' + p.replace(/\s/g,'') : '';
      }
      case 'sms': {
        const n = g('f-sms-num'), m = g('f-sms-msg');
        if (!n) return '';
        // Use SMSTO format for better compatibility
        return m ? `SMSTO:${n}:${m}` : `sms:${n}`;
      }
      case 'wifi': {
        const s = g('f-wifi-ssid'), p = g('f-wifi-pass'), e = g('f-wifi-enc');
        const h = gc('f-wifi-hidden');
        if (!s) return '';
        // Escape special characters in SSID and password
        const escapeWifi = (str) => str.replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/:/g,'\\:');
        const ssidEsc = escapeWifi(s);
        const passEsc = e !== 'nopass' ? escapeWifi(p) : '';
        return `WIFI:T:${e};S:${ssidEsc};P:${passEsc};H:${h ? 'true' : 'false'};;`;
      }
      case 'vcard': {
        const fn = g('f-vc-fn'), ln = g('f-vc-ln');
        if (!fn && !ln) return '';
        const lines = [
          'BEGIN:VCARD', 'VERSION:3.0',
          `N:${ln};${fn};;;`,
          `FN:${[fn,ln].filter(Boolean).join(' ')}`,
          g('f-vc-ph')    ? `TEL:${g('f-vc-ph')}`     : '',
          g('f-vc-em')    ? `EMAIL:${g('f-vc-em')}`    : '',
          g('f-vc-org')   ? `ORG:${g('f-vc-org')}`     : '',
          g('f-vc-title') ? `TITLE:${g('f-vc-title')}` : '',
          g('f-vc-web')   ? `URL:${g('f-vc-web')}`     : '',
          g('f-vc-addr')  ? `ADR:;;${g('f-vc-addr')};;;;` : '',
          'END:VCARD'
        ].filter(Boolean);
        return lines.join('\r\n');
      }
      case 'whatsapp': {
        const n = g('f-wa-num').replace(/\D/g,''), m = g('f-wa-msg');
        if (!n) return '';
        return `https://wa.me/${n}${m ? '?text=' + encodeURIComponent(m) : ''}`;
      }
      case 'telegram': {
        let u = g('f-tg');
        if (!u) return '';
        if (!u.startsWith('http')) u = 'https://t.me/' + u.replace(/^@/, '');
        return u;
      }
      case 'location': {
        const lat = g('f-lat'), lng = g('f-lng'), lbl = g('f-loc-label');
        if (!lat || !lng) return '';
        return `geo:${lat},${lng}${lbl ? '?q=' + lat + ',' + lng + '(' + encodeURIComponent(lbl) + ')' : ''}`;
      }
      case 'instagram': return g('f-ig') || '';
      case 'facebook':  return g('f-fb') || '';
      case 'youtube':   return g('f-yt') || '';
      case 'twitter':   return g('f-tw') || '';
      case 'bitcoin': {
        const coin = g('f-coin'), addr = g('f-wallet'), amt = g('f-amount');
        if (!addr) return '';
        return `${coin}:${addr}${amt ? '?amount=' + amt : ''}`;
      }
      case 'event': {
        const name = g('f-ev-name');
        if (!name) return '';
        const fmtDT = (d) => d ? d.replace(/[-:]/g,'').replace('T','T') + '00' : '';
        const lines = [
          'BEGIN:VEVENT',
          `SUMMARY:${name}`,
          g('f-ev-start') ? `DTSTART:${fmtDT(g('f-ev-start'))}` : '',
          g('f-ev-end')   ? `DTEND:${fmtDT(g('f-ev-end'))}`     : '',
          g('f-ev-loc')   ? `LOCATION:${g('f-ev-loc')}`         : '',
          g('f-ev-desc')  ? `DESCRIPTION:${g('f-ev-desc')}`     : '',
          'END:VEVENT'
        ].filter(Boolean);
        return lines.join('\r\n');
      }
      default: return '';
    }
  } catch(e) {
    return '';
  }
}

// ── Password visibility toggle ────────────────────────────
function togglePw(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  if (el.type === 'password') {
    el.type = 'text';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  } else {
    el.type = 'password';
    if (btn) btn.innerHTML = '<i class="fa-solid fa-eye"></i>';
  }
}

// ── Crypto logo auto-update ───────────────────────────────
function updateCryptoLogo() {
  const coin = document.getElementById('f-coin');
  if (!coin) return;
  const val = coin.value;
  // Map coin to logo key
  const map = { bitcoin: 'bitcoin', ethereum: 'ethereum', litecoin: 'litecoin', dogecoin: 'dogecoin', solana: 'solana' };
  const key = map[val];
  if (key && typeof setLogoByKey === 'function') setLogoByKey(key);
}

// ── Use My Location ───────────────────────────────────────
function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latEl = document.getElementById('f-lat');
      const lngEl = document.getElementById('f-lng');
      if (latEl) latEl.value = pos.coords.latitude.toFixed(6);
      if (lngEl) lngEl.value = pos.coords.longitude.toFixed(6);
      schedRender();
      showToast('Location detected', 'success');
    },
    () => showToast('Could not get location', 'error')
  );
}
