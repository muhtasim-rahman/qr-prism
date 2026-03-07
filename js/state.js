// =========================================================
// STATE.JS — Global application state, QR types & forms
// =========================================================

// ── Global Settings State ──────────────────────────────
const S = {
  // Input
  activeType: 'url',
  inputData: '',

  // Options
  size: 600,
  ec: 'H',
  qz: 4,
  scanOpt: false,

  // Colors – foreground / background
  fgColor: '#000000',
  bgColor: '#ffffff',
  transparent: false,

  // Gradient
  gradient: false,
  gType: 'linear',
  gc1: '#2D9CDB',
  gc2: '#27AE60',
  gAngle: 45,

  // Marker / Eye colors
  customMarker: false,
  mbColor: '#000000',  // marker border
  mcColor: '#000000',  // marker center
  customEF: false,
  efColor: '#000000',  // eye frame
  customEI: false,
  eiColor: '#000000',  // eye inner

  // Patterns
  pattern: 'square',
  eyeFrame: 'square',
  eyeInner: 'square',

  // Logo
  logoSrc: null,
  logoKey: null,
  logoRemoveBG: true,
  logoSize: 25,
  logoBR: 0,
  logoPad: 4,
  logoPadColor: '#ffffff',

  // Frame
  frame: 'none',
  frameLabel: 'Scan Me',
  frameFont: 'Poppins',
  frameTSize: 100,
  frameLabelColor: '#ffffff',
  frameColor: '#2D9CDB',

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

// Undo / Redo stacks
const undoStack = [];
const redoStack = [];

// ── QR Input Types ──────────────────────────────────────
const QR_TYPES = [
  { key: 'url',       label: 'URL',       icon: 'fa-link',              title: 'Website URL' },
  { key: 'text',      label: 'Text',      icon: 'fa-font',              title: 'Plain Text' },
  { key: 'email',     label: 'Email',     icon: 'fa-envelope',          title: 'Email' },
  { key: 'phone',     label: 'Phone',     icon: 'fa-phone',             title: 'Phone Number' },
  { key: 'sms',       label: 'SMS',       icon: 'fa-comment-sms',       title: 'SMS Message' },
  { key: 'wifi',      label: 'WiFi',      icon: 'fa-wifi',              title: 'WiFi Network' },
  { key: 'vcard',     label: 'vCard',     icon: 'fa-address-card',      title: 'Contact Card' },
  { key: 'whatsapp',  label: 'WhatsApp',  icon: 'fa-brands fa-whatsapp',title: 'WhatsApp' },
  { key: 'telegram',  label: 'Telegram',  icon: 'fa-brands fa-telegram',title: 'Telegram' },
  { key: 'location',  label: 'Location',  icon: 'fa-location-dot',      title: 'GPS Location' },
  { key: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram',title: 'Instagram' },
  { key: 'facebook',  label: 'Facebook',  icon: 'fa-brands fa-facebook', title: 'Facebook' },
  { key: 'youtube',   label: 'YouTube',   icon: 'fa-brands fa-youtube',  title: 'YouTube' },
  { key: 'twitter',   label: 'Twitter/X', icon: 'fa-brands fa-x-twitter',title: 'Twitter / X' },
  { key: 'bitcoin',   label: 'Crypto',    icon: 'fa-brands fa-bitcoin',  title: 'Crypto Wallet' },
  { key: 'event',     label: 'Event',     icon: 'fa-calendar-days',      title: 'Calendar Event' },
];

// ── Form HTML Templates ─────────────────────────────────
const FORMS = {
  url: `
    <div class="fg">
      <label class="field-label">Website URL</label>
      <input class="input qr-input" id="f-url" placeholder="https://example.com" oninput="schedRender()">
    </div>`,

  text: `
    <div class="fg">
      <label class="field-label">Text Content</label>
      <textarea class="input qr-input" id="f-text" placeholder="Enter your text here..." oninput="schedRender()"></textarea>
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
      <label class="field-label">Phone Number</label>
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
        <div class="input-with-btn">
          <input class="input qr-input" id="f-wifi-pass" type="password" placeholder="Password" oninput="schedRender()">
          <button class="btn btn-ghost btn-sm" onclick="togglePw('f-wifi-pass')" style="flex-shrink:0;">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="fg">
        <label class="field-label">Encryption</label>
        <select class="select qr-input" id="f-wifi-enc" onchange="schedRender()">
          <option value="WPA">WPA / WPA2</option>
          <option value="WEP">WEP</option>
          <option value="nopass">None</option>
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
        <input class="input qr-input" id="f-vc-ph" type="tel" placeholder="+880..." oninput="schedRender()">
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
      <input class="input qr-input" id="f-yt" placeholder="https://youtube.com/..." oninput="schedRender()">
    </div>`,

  twitter: `
    <div class="fg">
      <label class="field-label">Twitter / X Profile URL</label>
      <input class="input qr-input" id="f-tw" placeholder="https://x.com/username" oninput="schedRender()">
    </div>`,

  bitcoin: `
    <div class="fg">
      <label class="field-label">Cryptocurrency</label>
      <select class="select qr-input" id="f-coin" onchange="schedRender()">
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

// ── QR Data Builders ────────────────────────────────────
function buildQRData() {
  const t = S.activeType;
  const g  = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
  const gc = (id) => { const el = document.getElementById(id); return el ? el.checked : false; };

  try {
    switch (t) {

      case 'url': {
        let u = g('f-url');
        if (u && !u.match(/^https?:\/\//i)) u = 'https://' + u;
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
        return p ? 'tel:' + p : '';
      }

      case 'sms': {
        const n = g('f-sms-num'), m = g('f-sms-msg');
        if (!n) return '';
        return `sms:${n}${m ? '?body=' + encodeURIComponent(m) : ''}`;
      }

      case 'wifi': {
        const s = g('f-wifi-ssid'), p = g('f-wifi-pass'), e = g('f-wifi-enc');
        const h = gc('f-wifi-hidden');
        if (!s) return '';
        const pass = e !== 'nopass' ? `P:${p};` : '';
        const hid  = h ? 'H:true;' : '';
        return `WIFI:T:${e};S:${s};${pass}${hid};`;
      }

      case 'vcard': {
        const fn = g('f-vc-fn'), ln = g('f-vc-ln'), ph = g('f-vc-ph');
        const em = g('f-vc-em'), org = g('f-vc-org'), tt = g('f-vc-title');
        const web = g('f-vc-web'), addr = g('f-vc-addr');
        if (!fn && !ln) return '';
        const lines = [
          'BEGIN:VCARD', 'VERSION:3.0',
          `N:${ln};${fn};;;`, `FN:${fn} ${ln}`.trim(),
          ph    ? `TEL:${ph}` : '',
          em    ? `EMAIL:${em}` : '',
          org   ? `ORG:${org}` : '',
          tt    ? `TITLE:${tt}` : '',
          web   ? `URL:${web}` : '',
          addr  ? `ADR:;;${addr};;;;` : '',
          'END:VCARD'
        ].filter(Boolean);
        return lines.join('\n');
      }

      case 'whatsapp': {
        const n = g('f-wa-num').replace(/\D/g, ''), m = g('f-wa-msg');
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
        const lat = g('f-lat'), lng = g('f-lng');
        if (!lat || !lng) return '';
        return `geo:${lat},${lng}`;
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
        const fmt = (d) => d ? d.replace(/[-:]/g, '').replace('T', 'T') : '';
        const start = g('f-ev-start'), end = g('f-ev-end');
        const loc   = g('f-ev-loc'),  desc = g('f-ev-desc');
        const lines = [
          'BEGIN:VEVENT',
          `SUMMARY:${name}`,
          start ? `DTSTART:${fmt(start)}` : '',
          end   ? `DTEND:${fmt(end)}`     : '',
          loc   ? `LOCATION:${loc}`       : '',
          desc  ? `DESCRIPTION:${desc}`   : '',
          'END:VEVENT'
        ].filter(Boolean);
        return lines.join('\n');
      }

      default: return '';
    }
  } catch (e) {
    console.warn('buildQRData error:', e);
    return '';
  }
}
