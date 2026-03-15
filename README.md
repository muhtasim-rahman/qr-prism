# QR Prism v2.8

**Professional, free QR code generator** — 16 types, 22 dot patterns, gradients, logos, frames, Firebase sync, PWA.

[![Live Demo](https://img.shields.io/badge/Live-Demo-818CF8?style=flat-square&logo=github)](https://muhtasim-rahman.github.io/qr-prism/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-2.8-blue?style=flat-square)](#)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-success?style=flat-square)](#)

---

## ✨ Features

- **16 QR types** — URL, WiFi, vCard, WhatsApp, Telegram, Instagram, Facebook, YouTube, X/Twitter, Email, Phone, SMS, Location, Bitcoin/Crypto, Event
- **22 dot patterns** — Square, Circle, Diamond, Star, Heart, Crystal, Hexagon, Raindrop and more
- **14 eye frame shapes** — Square, Rounded, Circle, Hexagon, Leaf, Chamfered, Pill and more
- **14 eye inner shapes** — matching the eye frames with same variety
- **Full color control** — solid, linear/radial gradient, transparent background; per-eye color overrides with gradients
- **Module gap & eye scale** sliders for fine-tuned spacing
- **20 brand logos** — WhatsApp, Instagram, GitHub, Bitcoin, Discord, Google, Apple and more
- **12 frame styles** — Bottom/Top Bar, Rounded Box, Badge, Polaroid, Brackets, Circle, Hexagon
- **20 curated preset templates**
- **Batch generator** — up to 200 QR codes at once, download as ZIP
- **QR Scanner** — camera + image file, with jsQR and native BarcodeDetector
- **Download formats** — PNG, PNG 2×/4×, SVG, WebP, JPG, PDF; transparent background toggle
- **Firebase Auth + Realtime DB** — email/password + Google OAuth, cloud sync for projects, templates, settings
- **ImgBB image hosting** — for bug report screenshots and profile photos
- **Profile page** — banner, avatar (with Cropper.js 1:1 crop), bio, website, project/template/issue history
- **Bug report system** — with Firebase DB storage, up to 5 images per report
- **Auto-save** — 1 second debounce, saves to localStorage + Firebase
- **Undo/Redo** — 40-step history
- **Scanability Score** — 0–100 score with 5 levels and actionable feedback
- **PWA** — Service Worker, offline-capable, installable
- **Keyboard shortcuts** — Ctrl+D, Ctrl+Z, D, 1–5 and more
- **Custom scrollbar, Google Fonts, light/dark mode**
- **Responsive** — mobile (bottom nav), tablet (top nav), desktop (collapsible sidebar)

---

## 🗂️ Project Structure

```
qr-prism/
├── index.html              # Main app shell
├── docs.html               # Standalone documentation page
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker (cache-first)
│
├── assets/                 # Brand assets (SVG + PNG)
│   ├── logo-light.svg      # Logo icon for dark backgrounds
│   ├── logo-dark.svg       # Logo icon for light backgrounds
│   ├── logo&name-light.svg # Full logo for dark backgrounds
│   ├── logo&name-dark.svg  # Full logo for light backgrounds
│   ├── banner.svg          # App banner
│   └── ...
│
├── icons/                  # PWA icons (72–512px)
│   └── icon.svg
│
├── css/
│   └── style.css           # All styles (2800 lines)
│
├── designs/                # Design data arrays
│   ├── patterns.js         # 22 dot module patterns
│   ├── eye-frames.js       # 14 eye frame shapes
│   ├── eye-inners.js       # 14 eye inner shapes
│   ├── frames.js           # 12 outer frame designs
│   └── preset-templates.js # 20 curated presets
│
└── js/                     # App modules
    ├── firebase.js         # Firebase config, Auth, ImgBB upload, cloud sync
    ├── logos.js            # 20 brand logo SVGs
    ├── state.js            # Global S state, SETTINGS, QR types, forms, URI builders
    ├── qr-engine.js        # Canvas QR rendering, patterns, gradients, frames
    ├── ui.js               # UI rendering: grids, Pickr, syncAllUI, profile page
    ├── app.js              # Boot, mode switching, modals, toasts, keyboard shortcuts
    ├── projects.js         # Auto-save, manual save, project CRUD, export/import
    ├── templates.js        # Template save/load/delete, batch template list
    ├── settings.js         # Settings page render, PWA banner, clear data
    ├── scanner.js          # Camera scanner, image file scan, BarcodeDetector
    ├── batch.js            # Batch QR generation, per-item actions, ZIP download
    ├── download.js         # PNG/JPG/SVG/WebP/2×/4×/PDF export, transparent BG
    └── report.js           # (see ui.js — report form handled there)
```

---

## 🚀 Quick Start

1. Clone or download the repository
2. Open `index.html` in any modern browser
3. No build step, no dependencies to install

```bash
git clone https://github.com/muhtasim-rahman/qr-prism.git
cd qr-prism
# Open index.html in browser, or serve with any static server:
npx serve .
```

---

## 🔥 Firebase Setup

To enable cloud sync and bug reports:

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Email/Password** and **Google** in Authentication
3. Enable **Realtime Database**
4. Update `js/firebase.js` with your project config
5. Set Realtime Database rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "reports": {
      ".read": false,
      "$reportId": {
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 📦 CDN Dependencies

All loaded from CDN — no local installation needed:

| Library | Version | Purpose |
|---------|---------|---------|
| [qrcode.js](https://github.com/davidshimjs/qrcodejs) | 1.0.0 | QR matrix generation |
| [jsQR](https://github.com/cozmo/jsQR) | 1.4.0 | QR camera scanning |
| [JSZip](https://stuk.github.io/jszip/) | 3.10.1 | Batch ZIP download |
| [Pickr](https://github.com/Simonwep/pickr) | latest | Color picker |
| [Cropper.js](https://fengyuanchen.github.io/cropperjs/) | 1.6.2 | Profile photo crop |
| [Font Awesome](https://fontawesome.com) | 6.5.0 | Icons |
| [Firebase](https://firebase.google.com) | 9.23.0 | Auth + Realtime DB |
| Google Fonts | — | Outfit, Poppins, DM Sans, Space Grotesk, Fira Code |

---

## 🖼️ Asset Naming Convention

> ⚠️ **Important:** File name suffixes are intentionally "reversed" from what you might expect:
> - Files ending in `-dark` → use on **light backgrounds** (the design itself is dark-colored)
> - Files ending in `-light` → use on **dark backgrounds** (the design itself is light-colored)

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+D` | Download PNG |
| `Ctrl+S` | Save as Template |
| `Ctrl+C` | Copy QR to clipboard |
| `Ctrl+Z` / `Ctrl+Y` | Undo / Redo |
| `D` | Toggle dark/light mode |
| `1`–`5` | Switch mode tabs |
| `?` | Show shortcuts |
| `Esc` | Close modal |

---

## 📄 License

MIT License — © 2025 [Muhtasim Rahman (Turzo)](https://mdturzo.odoo.com)

---

## 📬 Contact

- Email: [qrprism@gmail.com](mailto:qrprism@gmail.com)
- Website: [mdturzo.odoo.com](https://mdturzo.odoo.com)
- GitHub: [@muhtasim-rahman](https://github.com/muhtasim-rahman)
