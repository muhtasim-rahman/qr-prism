// =========================================================
// assets/logos.js — Brand Logo Definitions
// Each logo has a key, label, color, and SVG data
// SVG logos are rendered as actual colored images on the QR code
// =========================================================

const LOGO_PRESETS = [

  { key: 'none',       label: 'None',       color: '#e74c3c',
    svg: null },

  { key: 'facebook',   label: 'Facebook',   color: '#1877f2',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1877f2"/><path d="M62 50h-8v28H43V50h-6V38h6v-7c0-10 6-15 15-15 4 0 8 .3 8 .3V27h-5c-4 0-5 2-5 5v6h10l-2 12z" fill="white"/></svg>` },

  { key: 'instagram',  label: 'Instagram',  color: '#e1306c',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><radialGradient id="ig" cx="30%" cy="107%" r="140%"><stop offset="0%" stop-color="#fdf497"/><stop offset="5%" stop-color="#fdf497"/><stop offset="45%" stop-color="#fd5949"/><stop offset="60%" stop-color="#d6249f"/><stop offset="90%" stop-color="#285AEB"/></radialGradient></defs><rect width="100" height="100" rx="22" fill="url(#ig)"/><rect x="18" y="18" width="64" height="64" rx="16" fill="none" stroke="white" stroke-width="5"/><circle cx="50" cy="50" r="15" fill="none" stroke="white" stroke-width="5"/><circle cx="74" cy="26" r="5" fill="white"/></svg>` },

  { key: 'youtube',    label: 'YouTube',    color: '#ff0000',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#ff0000"/><path d="M78 35s-1-7-4-10c-4-4-8-4-10-4C56 20 50 20 50 20s-6 0-14 1c-2 0-6 0-10 4-3 3-4 10-4 10S21 43 21 51v7s1 8 4 11c4 4 9 4 11 4 8 1 34 1 34 1s6 0 10-4c3-3 4-11 4-11s1-8 1-16v-7s0-8-1-16zm-28 26V39l17 11-17 11z" fill="white"/></svg>` },

  { key: 'tiktok',     label: 'TikTok',     color: '#010101',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#010101"/><path d="M55 10v54c0 6-5 11-11 11s-11-5-11-11 5-11 11-11c1 0 2 0 3 .3V41c-1 0-2-.1-3-.1-17 0-31 14-31 31s14 31 31 31 31-14 31-31V34c5 4 12 6 19 6V23c-11 0-19-8-19-13V10H55z" fill="white"/><path d="M55 10v54c0 6-5 11-11 11s-11-5-11-11 5-11 11-11c1 0 2 0 3 .3V41c-1 0-2-.1-3-.1-17 0-31 14-31 31s14 31 31 31 31-14 31-31V34c5 4 12 6 19 6V23c-11 0-19-8-19-13V10H55z" fill="#69c9d0" opacity="0.5"/></svg>` },

  { key: 'twitter',    label: 'X / Twitter', color: '#000000',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#000"/><path d="M11 12h25l16 22 18-22h12L58 41l27 47H60L43 64 23 88H11l26-30L11 12zm11 7l40 62h10L32 19H22zm49 0L48 41l3 4 24-26h-13z" fill="white"/></svg>` },

  { key: 'linkedin',   label: 'LinkedIn',   color: '#0077b5',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#0077b5"/><rect x="12" y="35" width="18" height="55" fill="white"/><circle cx="21" cy="19" r="11" fill="white"/><path d="M44 35h16v8s5-10 18-10c15 0 22 10 22 27v30H84V63c0-9-3-15-11-15s-13 6-13 16v26H44V35z" fill="white"/></svg>` },

  { key: 'whatsapp',   label: 'WhatsApp',   color: '#25d366',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#25d366"/><path d="M50 15C31 15 15 31 15 50c0 7 2 13 6 18L15 85l18-6c5 3 11 4 17 4 19 0 35-16 35-35S69 15 50 15zm19 47c-1 2-5 4-7 4-2 0-4-1-14-5-12-5-19-17-20-17s-4-5-4-10c0-4 2-7 3-8 1-2 3-2 4-2h3c1 0 2 0 3 3s3 8 4 9c1 1 1 2 0 3s-1 2-2 3c-1 1-2 2-1 4 4 6 8 10 14 12 2 1 3 1 4-1s3-5 4-6c1-1 2-1 3 0l9 4c1 1 1 3 0 5z" fill="white"/></svg>` },

  { key: 'telegram',   label: 'Telegram',   color: '#0088cc',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#0088cc"/><path d="M16 49l12 5 4 14 4-6 17 13 13-44L16 49zm22 13l-2-10 28-18-26 22z" fill="white"/></svg>` },

  { key: 'snapchat',   label: 'Snapchat',   color: '#f7c400',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#f7c400"/><path d="M50 15c-10 0-18 8-18 18v4l-6 2 4 8c-5 1-10 2-10 5s8 5 12 7c0 2-1 4-4 5 4 5 11 8 22 8s18-3 22-8c-3-1-4-3-4-5 4-2 12-4 12-7s-5-4-10-5l4-8-6-2v-4C68 23 60 15 50 15z" fill="#1a1a1a"/></svg>` },

  { key: 'discord',    label: 'Discord',    color: '#5865f2',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#5865f2"/><path d="M67 27s-8-2-16-2-17 2-17 2S22 34 18 51c0 0 8 12 24 12l4-5s-8-2-12-7c4 2 9 4 16 4s12-2 16-4c-4 5-12 7-12 7l4 5c16 0 24-12 24-12C78 34 67 27 67 27zM40 49c-3 0-5-3-5-6s2-6 5-6 5 3 5 6-2 6-5 6zm21 0c-3 0-5-3-5-6s2-6 5-6 5 3 5 6-2 6-5 6z" fill="white"/></svg>` },

  { key: 'github',     label: 'GitHub',     color: '#24292e',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#24292e"/><path d="M50 15C31 15 15 31 15 50c0 15 10 28 24 33 2 0 3-1 3-3v-5c-9 2-11-4-11-4-2-4-4-5-4-5-3-2 0-2 0-2 3 0 5 3 5 3 3 5 8 4 10 3 0-2 1-4 2-5-7-1-15-4-15-16 0-4 1-7 3-9-1-2-1-6 0-9 0 0 3-1 9 3 2-1 5-1 8-1s6 0 8 1c6-4 9-3 9-3 1 3 1 7 0 9 2 2 3 5 3 9 0 12-8 15-15 16 1 1 2 4 2 7v10c0 2 1 3 3 3 14-5 24-18 24-33C85 31 69 15 50 15z" fill="white"/></svg>` },

  { key: 'spotify',    label: 'Spotify',    color: '#1db954',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1db954"/><path d="M72 63c-14-8-32-9-53-5-2 0-3 2-2 4s2 3 4 2c19-4 35-3 48 4 1 1 3 0 4-1 1-2 0-4-1-4zm6-15c-16-10-41-13-60-7-2 1-3 3-2 5s3 3 5 2c17-5 40-3 55 6 2 1 4 0 5-2s0-4-3-4zm1-16C56 20 27 22 12 28c-3 1-4 4-3 6s4 4 6 3c14-5 41-7 61 5 2 1 5 1 6-2 1-2 0-5-3-6z" fill="white"/></svg>` },

  { key: 'netflix',    label: 'Netflix',    color: '#e50914',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#000"/><path d="M20 10h18v32l24-32h18v80H62V58L38 90H20z" fill="#e50914"/></svg>` },

  { key: 'paypal',     label: 'PayPal',     color: '#003087',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#003087"/><path d="M30 15h28c12 0 20 6 18 18-2 14-12 20-25 20H42l-4 20H25L30 15zm11 8l-3 16h9c6 0 11-3 12-9s-3-7-8-7h-10zm15 7h26c12 0 18 6 16 16-2 12-11 18-23 18H62l-3 15H47l6-49zm10 8l-3 14h8c5 0 10-2 11-8s-2-6-7-6h-9z" fill="white"/></svg>` },

  { key: 'bitcoin',    label: 'Bitcoin',    color: '#f7931a',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#f7931a"/><path d="M68 44c2-8-5-12-14-14l3-11-7-2-2 11-6-2 2-11-7-2-2 11-14-4-2 7 5 1c3 1 3 2 2 5L21 67c-1 3-2 3-5 3l-1 7 14 4-3 11 7 2 3-11 6 2-3 11 7 2 3-11c11 3 19 1 22-9 2-8-1-13-7-16 4-2 7-6 5-11zm-10 21c-2 7-13 4-17 3l4-16c4 1 15 2 13 13zm2-21c-1 7-11 4-14 3l3-14c4 1 13 2 11 11z" fill="white"/></svg>` },

  { key: 'ethereum',   label: 'Ethereum',   color: '#627eea',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#627eea"/><path d="M50 15l-24 36 24 14 24-14L50 15zm0 57L26 57l24 28 24-28L50 72z" fill="white" opacity="0.9"/><path d="M26 51l24-36v35L26 51zm48 0L50 50V15l24 36z" fill="white" opacity="0.6"/></svg>` },

  { key: 'twitch',     label: 'Twitch',     color: '#9146ff',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="#9146ff"/><path d="M20 10L12 28v58h20V98h14l12-12h18L95 68V10H20zm68 55l-14 14H54l-12 12V79H22V16h66v49zM80 30H68v24h12V30zm-22 0H46v24h12V30z" fill="white"/></svg>` },

  { key: 'slack',      label: 'Slack',      color: '#4a154b',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="15" fill="white"/><path d="M29 63c0 4-3 7-7 7s-7-3-7-7 3-7 7-7h7v7zm4 0c0-4 3-7 7-7s7 3 7 7v18c0 4-3 7-7 7s-7-3-7-7V63zm7-34c-4 0-7-3-7-7s3-7 7-7 7 3 7 7v7H40zm0 4c4 0 7 3 7 7s-3 7-7 7H22c-4 0-7-3-7-7s3-7 7-7h18zm34 7c0-4 3-7 7-7s7 3 7 7-3 7-7 7h-7v-7zm-4 0c0 4-3 7-7 7s-7-3-7-7V22c0-4 3-7 7-7s7 3 7 7v18zm-7 34c4 0 7 3 7 7s-3 7-7 7-7-3-7-7v-7h7zm0-4c-4 0-7-3-7-7s3-7 7-7h18c4 0 7 3 7 7s-3 7-7 7H63z" fill="#4a154b"/></svg>` },

  { key: 'google',     label: 'Google',     color: '#4285f4',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="white"/><path d="M85 50c0-2 0-4-1-6H50v12h20c-1 5-4 9-8 12v10h13c8-7 13-18 13-28z" fill="#4285f4"/><path d="M50 90c13 0 24-4 32-11L69 69c-5 4-12 6-19 6-15 0-27-10-31-24H7v10c8 16 24 29 43 29z" fill="#34a853"/><path d="M19 51c-1-3-2-7-2-11s1-8 2-11V19H7c-4 8-6 16-6 25s2 17 6 25l12-18z" fill="#fbbc05"/><path d="M50 24c7 0 13 3 18 8l13-13C73 10 62 6 50 6 31 6 15 18 7 34l12 18c4-14 16-28 31-28z" fill="#ea4335"/></svg>` },

  { key: 'wifi',       label: 'WiFi',       color: '#2196f3',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#2196f3"/><path d="M50 70a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-24c-10 0-19 5-25 12l8 8c4-5 10-8 17-8s13 3 17 8l8-8c-6-7-15-12-25-12zm0-18c-18 0-34 9-44 23l8 8C22 73 35 64 50 64s28 9 36 15l8-8C84 57 68 28 50 28z" fill="white"/></svg>` },

  { key: 'qr',         label: 'QR Code',    color: '#333333',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="12" fill="#333"/><rect x="15" y="15" width="25" height="25" rx="3" fill="white"/><rect x="60" y="15" width="25" height="25" rx="3" fill="white"/><rect x="15" y="60" width="25" height="25" rx="3" fill="white"/><rect x="20" y="20" width="15" height="15" fill="#333"/><rect x="65" y="20" width="15" height="15" fill="#333"/><rect x="20" y="65" width="15" height="15" fill="#333"/><rect x="60" y="60" width="5" height="5" fill="white"/><rect x="70" y="60" width="5" height="5" fill="white"/><rect x="80" y="60" width="5" height="5" fill="white"/><rect x="60" y="70" width="5" height="5" fill="white"/><rect x="80" y="70" width="5" height="5" fill="white"/><rect x="60" y="80" width="5" height="5" fill="white"/><rect x="70" y="80" width="5" height="5" fill="white"/><rect x="80" y="80" width="5" height="5" fill="white"/></svg>` },
];

// Map QR types to auto logo keys
const QR_TYPE_AUTO_LOGOS = {
  url:       null,
  text:      null,
  email:     null,
  phone:     null,
  sms:       null,
  wifi:      'wifi',
  vcard:     null,
  whatsapp:  'whatsapp',
  telegram:  'telegram',
  location:  null,
  instagram: 'instagram',
  facebook:  'facebook',
  youtube:   'youtube',
  twitter:   'twitter',
  tiktok:    'tiktok',
  linkedin:  'linkedin',
  snapchat:  'snapchat',
  bitcoin:   'bitcoin',
  ethereum:  'ethereum',
  event:     null,
};

// Convert SVG string to data URL
function svgToDataURL(svgStr) {
  if (!svgStr) return null;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgStr)));
}

// Get logo data URL by key
function getLogoDataURL(key) {
  const preset = LOGO_PRESETS.find(p => p.key === key);
  if (!preset || !preset.svg) return null;
  return svgToDataURL(preset.svg);
}
