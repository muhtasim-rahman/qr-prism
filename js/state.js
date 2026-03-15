// =========================================================
// STATE.JS — QR Prism v2.8
// Global state, QR types, form templates, URI builders
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ══════════════════════════════════════════════════════════
// DESIGN STATE  (S)
// Every property here is saved/restored with projects & templates
// ══════════════════════════════════════════════════════════
const S = {
  // ── Input ─────────────────────────────────────────────
  activeType: 'url',
  inputData:  '',

  // ── Options ───────────────────────────────────────────
  size:    600,
  ec:      'H',
  qz:      4,
  scanOpt: false,

  // ── Background ────────────────────────────────────────
  // bgMode: 'solid' | 'gradient' | 'transparent'
  bgMode:   'solid',
  bgColor:  '#ffffff',
  bgGType:  'linear',   // for gradient bg
  bgGAngle: 135,
  bgGc1:    '#ffffff',
  bgGc2:    '#f0f0ff',

  // ── Foreground ────────────────────────────────────────
  fgColor:    '#000000',
  fgGradient: false,
  gType:      'linear',
  gc1:        '#818CF8',
  gc2:        '#C084FC',
  gAngle:     45,

  // ── Eye / Marker Colors ───────────────────────────────
  // When customEyeColors is false → eyes use fgColor
  // When true → use the per-eye colors below
  // Area between eye frame and eye inner is ALWAYS transparent
  // (never filled with background color) when customEyeColors is true
  customEyeColors: false,
  efColor:    '#000000',   // eye frame (outer) solid color
  efGradient: false,
  efc1:       '#818CF8',
  efc2:       '#C084FC',
  eiColor:    '#000000',   // eye inner (center dot) solid color
  eiGradient: false,
  eic1:       '#818CF8',
  eic2:       '#C084FC',

  // ── Patterns ──────────────────────────────────────────
  pattern:  'pat-square',
  eyeFrame: 'ef-square',
  eyeInner: 'ei-square',

  // Module gap (0 = no gap, 0.20 = 20% gap between modules)
  moduleGap:  0,
  // Eye position-detection square scale (0.7–1.3)
  eyeScale:   1,

  // ── Logo ──────────────────────────────────────────────
  logoSrc:      null,
  logoKey:      null,
  logoRemoveBG: true,
  logoSize:     25,
  logoBR:       0,
  logoPad:      4,
  logoPadColor: '#ffffff',

  // ── Frame ─────────────────────────────────────────────
  frame:          'frm-none',
  frameLabel:     'Scan Me',
  frameFont:      'Outfit',
  frameTSize:     100,
  frameLabelColor:'#ffffff',
  frameColor:     '#818CF8',
  framePad:       16,   // frame with label
  framePad2:      16,   // frame without label

  // ── Advanced ──────────────────────────────────────────
  rotation: 0,
  flipH:    false,
  flipV:    false,
  filter:   'none',
  invert:   false,

  shadow:      false,
  shadowColor: 'rgba(0,0,0,0.35)',
  shadowBlur:  10,
  shadowX:     0,
  shadowY:     4,

  // ── Download option ───────────────────────────────────
  dlTransparent: false,
};

// ══════════════════════════════════════════════════════════
// APP SETTINGS  (SETTINGS)
// User preferences stored in localStorage + Firebase
// ══════════════════════════════════════════════════════════
const SETTINGS = {
  theme:              'dark',
  accentColor:        '#818CF8',  // one of 3 brand accents
  autoSaveProjects:   true,
  confirmDelete:      true,
  defaultFormat:      'png',
  defaultSize:        600,
  defaultEC:          'H',
  showAnalytics:      true,
  highDPI:            false,      // disabled by default for performance
  animateUI:          true,
  closeDropdownOnNav: true,
};

// Brand accent options (from SVG logo palette)
const ACCENT_OPTIONS = [
  { label: 'Violet',  color: '#818CF8' },
  { label: 'Indigo',  color: '#6366F1' },
  { label: 'Purple',  color: '#C084FC' },
];

// ── Undo / Redo stacks ────────────────────────────────────
const _undoStack = [];
const _redoStack = [];
const MAX_UNDO   = 40;

// ── Settings persistence ──────────────────────────────────
function loadSettings() {
  try {
    const raw = localStorage.getItem('qrp_settings');
    if (raw) Object.assign(SETTINGS, JSON.parse(raw));
  } catch {}
  applyTheme(SETTINGS.theme);
  applyAccent(SETTINGS.accentColor);
}

function saveSettingsData() {
  try { localStorage.setItem('qrp_settings', JSON.stringify(SETTINGS)); } catch {}
  // Sync to cloud if logged in
  if (typeof FB_USER !== 'undefined' && FB_USER && typeof fbDB !== 'undefined') {
    fbDB.ref(`users/${FB_USER.uid}/settings`).set(SETTINGS).catch(() => {});
  }
}

// Alias
function saveStg() { saveSettingsData(); }

function applyTheme(t) {
  const resolved = t === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : t;
  document.documentElement.setAttribute('data-theme', resolved);
  SETTINGS.theme = t;
}

function applyAccent(color) {
  if (!color) return;
  SETTINGS.accentColor = color;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  document.documentElement.style.setProperty('--primary', color);
  document.documentElement.style.setProperty('--primary-glow', `rgba(${r},${g},${b},.22)`);
  // Update darker variant (multiply by 0.85)
  const dr = Math.round(r * 0.82), dg = Math.round(g * 0.82), db = Math.round(b * 0.82);
  document.documentElement.style.setProperty('--primary-dark',
    `#${dr.toString(16).padStart(2,'0')}${dg.toString(16).padStart(2,'0')}${db.toString(16).padStart(2,'0')}`);
}

// ══════════════════════════════════════════════════════════
// QR TYPE DEFINITIONS
// ══════════════════════════════════════════════════════════
const QR_TYPES = [
  { key: 'url',       label: 'URL',        icon: 'fa-link',                title: 'Website URL',    autoLogo: null        },
  { key: 'text',      label: 'Text',       icon: 'fa-font',                title: 'Plain Text',     autoLogo: null        },
  { key: 'email',     label: 'Email',      icon: 'fa-envelope',            title: 'Email',          autoLogo: null        },
  { key: 'phone',     label: 'Phone',      icon: 'fa-phone',               title: 'Phone Number',   autoLogo: null        },
  { key: 'sms',       label: 'SMS',        icon: 'fa-comment-sms',         title: 'SMS Message',    autoLogo: null        },
  { key: 'wifi',      label: 'WiFi',       icon: 'fa-wifi',                title: 'WiFi Network',   autoLogo: null        },
  { key: 'vcard',     label: 'vCard',      icon: 'fa-address-card',        title: 'Contact Card',   autoLogo: null        },
  { key: 'whatsapp',  label: 'WhatsApp',   icon: 'fa-brands fa-whatsapp',  title: 'WhatsApp',       autoLogo: 'whatsapp'  },
  { key: 'telegram',  label: 'Telegram',   icon: 'fa-brands fa-telegram',  title: 'Telegram',       autoLogo: 'telegram'  },
  { key: 'location',  label: 'Location',   icon: 'fa-location-dot',        title: 'GPS Location',   autoLogo: null        },
  { key: 'instagram', label: 'Instagram',  icon: 'fa-brands fa-instagram', title: 'Instagram',      autoLogo: 'instagram' },
  { key: 'facebook',  label: 'Facebook',   icon: 'fa-brands fa-facebook',  title: 'Facebook',       autoLogo: 'facebook'  },
  { key: 'youtube',   label: 'YouTube',    icon: 'fa-brands fa-youtube',   title: 'YouTube',        autoLogo: 'youtube'   },
  { key: 'twitter',   label: 'X / Twitter',icon: 'fa-brands fa-x-twitter', title: 'Twitter / X',    autoLogo: 'twitter'   },
  { key: 'bitcoin',   label: 'Crypto',     icon: 'fa-brands fa-bitcoin',   title: 'Crypto Wallet',  autoLogo: 'bitcoin'   },
  { key: 'event',     label: 'Event',      icon: 'fa-calendar-days',       title: 'Calendar Event', autoLogo: null        },
];

// ══════════════════════════════════════════════════════════
// INPUT FORMS  (HTML snippets, JS-rendered)
// Social platforms pre-fill base URL, user only types username
// ══════════════════════════════════════════════════════════
const FORMS = {

  url: `
    <div class="fg">
      <label class="field-label">Website URL</label>
      <input class="input qr-input" id="f-url" placeholder="https://example.com"
             value="https://" oninput="schedRender()">
    </div>`,

  text: `
    <div class="fg">
      <label class="field-label">Text Content</label>
      <textarea class="input qr-input" id="f-text" placeholder="Enter your text here…"
                oninput="schedRender()" rows="4"></textarea>
    </div>`,

  email: `
    <div class="fg">
      <label class="field-label">To (Email Address)</label>
      <input class="input qr-input" id="f-email-to" type="email"
             placeholder="name@example.com" oninput="schedRender()">
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Subject</label>
        <input class="input qr-input" id="f-email-sub" placeholder="Subject" oninput="schedRender()">
      </div>
      <div class="fg">
        <label class="field-label">Body <span class="field-optional">(optional)</span></label>
        <input class="input qr-input" id="f-email-body" placeholder="Message…" oninput="schedRender()">
      </div>
    </div>`,

  phone: `
    <div class="fg">
      <label class="field-label">Phone Number <span class="field-hint" style="font-weight:400;">(with country code)</span></label>
      <input class="input qr-input" id="f-phone" type="tel"
             placeholder="+8801234567890" oninput="schedRender()">
    </div>`,

  sms: `
    <div class="fg">
      <label class="field-label">Phone Number</label>
      <input class="input qr-input" id="f-sms-num" type="tel"
             placeholder="+8801234567890" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Message <span class="field-optional">(optional)</span></label>
      <textarea class="input qr-input" id="f-sms-msg" placeholder="Your message…"
                rows="3" oninput="schedRender()"></textarea>
    </div>`,

  wifi: `
    <div class="fg">
      <label class="field-label">Network Name (SSID)</label>
      <input class="input qr-input" id="f-wifi-ssid" placeholder="MyWiFiNetwork" oninput="schedRender()">
    </div>
    <div class="two-col">
      <div class="fg">
        <label class="field-label">Password</label>
        <div class="input-pw-wrap">
          <input class="input qr-input" id="f-wifi-pass" type="password"
                 placeholder="Password" oninput="schedRender()" style="flex:1;">
          <button class="btn btn-ghost btn-sm" type="button"
                  onclick="togglePw('f-wifi-pass',this)" tabindex="-1">
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
      <label class="field-label">Phone Number <span class="field-hint" style="font-weight:400;">(with country code)</span></label>
      <input class="input qr-input" id="f-wa-num" type="tel"
             placeholder="+8801234567890" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Pre-filled Message <span class="field-optional">(optional)</span></label>
      <textarea class="input qr-input" id="f-wa-msg" placeholder="Hello! 👋"
                rows="3" oninput="schedRender()"></textarea>
    </div>`,

  telegram: `
    <div class="fg">
      <label class="field-label">Username</label>
      <div class="input-prefix-wrap" style="position:relative;">
        <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:.82rem;pointer-events:none;">@</span>
        <input class="input qr-input" id="f-tg" placeholder="username"
               oninput="schedRender()" style="padding-left:26px;">
      </div>
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
    <div class="fg">
      <label class="field-label">Label <span class="field-optional">(optional)</span></label>
      <input class="input qr-input" id="f-loc-label" placeholder="My Location" oninput="schedRender()">
    </div>
    <button class="btn btn-outline btn-sm" style="margin-top:4px;" onclick="useMyLocation()">
      <i class="fa-solid fa-location-crosshairs"></i> Use My Location
    </button>`,

  instagram: `
    <div class="fg">
      <label class="field-label">Username</label>
      <div style="position:relative;">
        <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:.82rem;pointer-events:none;">instagram.com/</span>
        <input class="input qr-input" id="f-ig" placeholder="username"
               oninput="schedRender()" style="padding-left:122px;">
      </div>
    </div>`,

  facebook: `
    <div class="fg">
      <label class="field-label">Username or Page URL</label>
      <div style="position:relative;">
        <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:.82rem;pointer-events:none;">facebook.com/</span>
        <input class="input qr-input" id="f-fb" placeholder="username"
               oninput="schedRender()" style="padding-left:110px;">
      </div>
    </div>`,

  youtube: `
    <div class="fg">
      <label class="field-label">Channel or Video URL</label>
      <input class="input qr-input" id="f-yt"
             placeholder="https://youtube.com/@channel" oninput="schedRender()">
    </div>`,

  twitter: `
    <div class="fg">
      <label class="field-label">Username</label>
      <div style="position:relative;">
        <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:.82rem;pointer-events:none;">x.com/</span>
        <input class="input qr-input" id="f-tw" placeholder="username"
               oninput="schedRender()" style="padding-left:62px;">
      </div>
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
      <input class="input qr-input" id="f-wallet" placeholder="Your wallet address…" oninput="schedRender()">
    </div>
    <div class="fg">
      <label class="field-label">Amount <span class="field-optional">(optional)</span></label>
      <input class="input qr-input" id="f-amount" placeholder="0.001"
             type="number" step="any" oninput="schedRender()">
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
      <label class="field-label">Description <span class="field-optional">(optional)</span></label>
      <textarea class="input qr-input" id="f-ev-desc" placeholder="Event details…"
                rows="2" oninput="schedRender()"></textarea>
    </div>`,
};

// ══════════════════════════════════════════════════════════
// URI BUILDERS  (convert form fields → QR payload string)
// ══════════════════════════════════════════════════════════
function buildQRData() {
  const t  = S.activeType;
  const g  = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const gc = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

  try {
    switch (t) {

      case 'url': {
        let u = g('f-url');
        if (u && u !== 'https://' && !u.match(/^[a-z][a-z0-9+\-.]*:\/\//i)) u = 'https://' + u;
        return u === 'https://' ? '' : u;
      }

      case 'text': return g('f-text');

      case 'email': {
        const to = g('f-email-to'), sub = g('f-email-sub'), body = g('f-email-body');
        if (!to) return '';
        const params = [];
        if (sub)  params.push('subject=' + encodeURIComponent(sub));
        if (body) params.push('body='    + encodeURIComponent(body));
        return `mailto:${to}${params.length ? '?' + params.join('&') : ''}`;
      }

      case 'phone': {
        const p = g('f-phone');
        return p ? 'tel:' + p.replace(/\s/g, '') : '';
      }

      case 'sms': {
        const n = g('f-sms-num'), m = g('f-sms-msg');
        if (!n) return '';
        return m ? `SMSTO:${n}:${m}` : `sms:${n}`;
      }

      case 'wifi': {
        const s = g('f-wifi-ssid'), p = g('f-wifi-pass'), e = g('f-wifi-enc');
        const h = gc('f-wifi-hidden');
        if (!s) return '';
        const esc = (str) => str.replace(/\\/g,'\\\\').replace(/"/g,'\\"')
                                .replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/:/g,'\\:');
        return `WIFI:T:${e};S:${esc(s)};P:${e !== 'nopass' ? esc(p) : ''};H:${h ? 'true':'false'};;`;
      }

      case 'vcard': {
        const fn = g('f-vc-fn'), ln = g('f-vc-ln');
        if (!fn && !ln) return '';
        const lines = [
          'BEGIN:VCARD', 'VERSION:3.0',
          `N:${ln};${fn};;;`,
          `FN:${[fn,ln].filter(Boolean).join(' ')}`,
          g('f-vc-ph')    ? `TEL:${g('f-vc-ph')}`           : '',
          g('f-vc-em')    ? `EMAIL:${g('f-vc-em')}`         : '',
          g('f-vc-org')   ? `ORG:${g('f-vc-org')}`          : '',
          g('f-vc-title') ? `TITLE:${g('f-vc-title')}`      : '',
          g('f-vc-web')   ? `URL:${g('f-vc-web')}`          : '',
          g('f-vc-addr')  ? `ADR:;;${g('f-vc-addr')};;;;`   : '',
          'END:VCARD'
        ].filter(Boolean);
        return lines.join('\r\n');
      }

      case 'whatsapp': {
        const n = g('f-wa-num').replace(/\D/g, ''), m = g('f-wa-msg');
        if (!n) return '';
        return `https://wa.me/${n}${m ? '?text=' + encodeURIComponent(m) : ''}`;
      }

      case 'telegram': {
        let u = g('f-tg').replace(/^@/, '');
        return u ? `https://t.me/${u}` : '';
      }

      case 'location': {
        const lat = g('f-lat'), lng = g('f-lng'), lbl = g('f-loc-label');
        if (!lat || !lng) return '';
        return lbl
          ? `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(lbl)})`
          : `geo:${lat},${lng}`;
      }

      case 'instagram': {
        const u = g('f-ig').replace(/^@/, '');
        return u ? `https://instagram.com/${u}` : '';
      }

      case 'facebook': {
        const u = g('f-fb');
        if (!u) return '';
        return u.startsWith('http') ? u : `https://facebook.com/${u.replace(/^\//, '')}`;
      }

      case 'youtube': return g('f-yt') || '';

      case 'twitter': {
        const u = g('f-tw').replace(/^@/, '');
        return u ? `https://x.com/${u}` : '';
      }

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
  } catch {
    return '';
  }
}

// ══════════════════════════════════════════════════════════
// UI HELPERS  (small utilities used across modules)
// ══════════════════════════════════════════════════════════

// Password field visibility toggle
function togglePw(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const isPass = el.type === 'password';
  el.type = isPass ? 'text' : 'password';
  if (btn) btn.innerHTML = isPass
    ? '<i class="fa-solid fa-eye-slash"></i>'
    : '<i class="fa-solid fa-eye"></i>';
}

// Crypto logo auto-update when coin changes
function updateCryptoLogo() {
  const coin = document.getElementById('f-coin');
  if (!coin || typeof setLogoByKey !== 'function') return;
  const map = {
    bitcoin: 'bitcoin', ethereum: 'ethereum', litecoin: 'litecoin',
    dogecoin: 'dogecoin', solana: 'solana'
  };
  const key = map[coin.value];
  if (key) setLogoByKey(key);
}

// Use GPS location
function useMyLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'error'); return; }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latEl = document.getElementById('f-lat');
      const lngEl = document.getElementById('f-lng');
      if (latEl) latEl.value = pos.coords.latitude.toFixed(6);
      if (lngEl) lngEl.value = pos.coords.longitude.toFixed(6);
      schedRender();
      showToast('Location detected!', 'success');
    },
    () => showToast('Could not get location', 'error')
  );
}

// Size helpers (called from HTML)
function setSize(v) {
  S.size = v;
  const el = document.getElementById('qr-size');
  if (el) el.value = v;
  // Update chip active state
  document.querySelectorAll('.size-chips .chip').forEach(c => {
    c.classList.toggle('active', parseInt(c.textContent) === v ||
      (c.textContent === '1K' && v === 1024) ||
      (c.textContent === '2K' && v === 2048));
  });
  schedRender();
}
function adjSize(delta) {
  const el = document.getElementById('qr-size');
  S.size = Math.max(100, Math.min(4000, (S.size || 600) + delta));
  if (el) el.value = S.size;
  schedRender();
}

// EC button helper
function setEC(level, btn) {
  S.ec = level;
  document.querySelectorAll('.ec-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const hints = { L:'Low (7% recovery)', M:'Medium (15% recovery)', Q:'Quartile (25% recovery)', H:'High (30% recovery)' };
  const hintEl = document.getElementById('ec-hint');
  if (hintEl) hintEl.textContent = hints[level] || '';
  schedRender();
}

// Background mode toggle
function setBGMode(mode, btn) {
  S.bgMode = mode;
  document.querySelectorAll('.bg-mode-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('bg-solid-opts').style.display       = mode === 'solid'       ? 'block' : 'none';
  document.getElementById('bg-gradient-opts').style.display    = mode === 'gradient'    ? 'block' : 'none';
  document.getElementById('bg-transparent-opts').style.display = mode === 'transparent' ? 'block' : 'none';
  schedRender();
}

// Transparent download toggle
function toggleTransparentDownload() {
  S.dlTransparent = !S.dlTransparent;
  const icon  = document.getElementById('dl-transparent-icon');
  const badge = document.getElementById('dl-transparent-badge');
  if (icon)  icon.className  = S.dlTransparent ? 'fa-solid fa-square-check' : 'fa-regular fa-square';
  if (badge) badge.style.display = S.dlTransparent ? '' : 'none';
  showToast(S.dlTransparent ? 'Transparent BG: ON' : 'Transparent BG: OFF', 'info');
}
