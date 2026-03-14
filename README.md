<div align="center">

# QR Prism

**Advanced QR Code Generator — Beautiful, Free & Fully Offline**

[![License: MIT](https://img.shields.io/badge/License-MIT-818CF8.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-Offline%20Ready-34D399.svg)](#)
[![No Framework](https://img.shields.io/badge/Stack-Vanilla%20JS-F7931A.svg)](#)
[![Version](https://img.shields.io/badge/Version-2.7-C084FC.svg)](#)

[🌐 Live Demo](https://muhtasim-rahman.github.io/qr-prism/) · [🐛 Report Bug](https://github.com/muhtasim-rahman/qr-prism/issues) · [✨ Request Feature](https://github.com/muhtasim-rahman/qr-prism/issues)

</div>

---

## About

QR Prism is a fully featured, client-side QR code generator built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no tracking, 100% free. Everything runs directly in your browser and works completely offline as a Progressive Web App (PWA).

It was designed by Muhtasim Rahman (Turzo) as an open-source project for anyone who wants beautiful, customizable QR codes without limitations.

---

## Features

### 16 QR Types
URL, Text, Email, Phone, SMS, WiFi, vCard, WhatsApp, Telegram, Location, Instagram, Facebook, YouTube, Twitter/X, Crypto, Calendar Event

### Design System
- **20+ Dot Patterns** — Square, Rounded, Circle, Dot, Diamond, Squircle, Hexagon, Star, Cross, Leaf, Bars, Arrow, Heart, Clover, Sharp, Ring, Crystal, and more
- **12 Eye Frame Shapes** — Square, Round, Circle, Dot Border, Thick, Double, Cut Corner, Leaf, Sharp-In, Bracket, Hex, Diamond
- **12 Eye Inner Shapes** — Square, Rounded, Circle, Dot, Diamond, Star, Cross, Ring, Squircle, Leaf, Sharp, Triangle
- **10 QR Frames** — Bottom Bar, Top Bar, Polaroid, Badge, Ribbon, Square Border, Round Border, Corner Marks, Double Border, None

### Color & Style
- Full foreground/background color control
- Linear and radial gradients with angle control
- Independent marker, eye frame, and eye inner colors
- Transparent background support

### Logo Embedding
- Upload your own logo (JPG, PNG, SVG)
- 20+ preset brand logos (WhatsApp, Telegram, Instagram, GitHub, Bitcoin, etc.)
- Logo size, border radius, padding, and background control
- Auto-selects brand logo when switching QR types

### Templates
- 20 curated preset templates
- Save unlimited custom templates (stored locally)
- Export/import templates as JSON

### Projects
- Auto-save every QR you generate
- Manual save with custom names
- Tags, search, pin, multi-select
- Two categories: Saved and Auto-saved

### Export
PNG, JPG, SVG (vector), WebP, 2× and 4× high-res, PDF

### Scanner
- Live camera scanning with jsQR
- Scan from image file
- Flashlight support
- Auto-detects QR type

### Batch Generator
- Generate up to 200 QR codes at once
- Apply any saved template
- Download all as ZIP

### Settings
- Light / Dark / System theme
- Custom accent color
- Default size, format, error correction
- Full data import/export
- PWA install banner

### PWA
- Install as a native app on any device
- Works 100% offline after first load
- Indexed in app stores

---

## Getting Started

No installation needed. Just clone and open.

```bash
git clone https://github.com/muhtasim-rahman/qr-prism.git
cd qr-prism
open index.html
```

Or deploy to GitHub Pages: **Settings → Pages → Deploy from main branch root.**

---

## Project Structure

```
qr-prism/
├── index.html                  ← Single-page app shell
├── manifest.json               ← PWA manifest
├── sw.js                       ← Service worker (offline cache)
├── README.md                   ← This file
│
├── css/
│   └── style.css               ← All styling, dark/light, responsive
│
├── js/
│   ├── state.js                ← Global state S{}, SETTINGS{}, QR types & URI builders
│   ├── app.js                  ← Boot, mode switching, keyboard shortcuts, toasts
│   ├── ui.js                   ← Rendering: grids, tabs, accordion, profile
│   ├── qr-engine.js            ← Canvas QR renderer (patterns, eyes, logo, frame)
│   ├── download.js             ← PNG/JPG/SVG/WebP/2x/4x/PDF export
│   ├── templates.js            ← Save/load/export/import user templates
│   ├── projects.js             ← Auto-save + manual projects, cards, tags
│   ├── settings.js             ← Settings page with full persistence
│   ├── scanner.js              ← Camera scanner + image scan
│   ├── batch.js                ← Batch generation + ZIP download
│   ├── logos.js                ← Brand logo definitions
│   └── report.js               ← Bug report form
│
├── designs/
│   ├── patterns.js             ← 20+ dot pattern draw functions
│   ├── eye-frames.js           ← 12 eye frame draw functions
│   ├── eye-inners.js           ← 12 eye inner draw functions
│   ├── frames.js               ← 10 QR frame draw functions
│   └── preset-templates.js     ← 20 preset template styles
│
├── assets/
│   ├── logos/                  ← Drop brand SVG/PNG files here (filename = logo ID)
│   └── preview.jpg             ← OG image for SEO (replace with your own)
│
└── icons/
    ├── icon-192.png            ← PWA icon
    ├── icon-512.png            ← PWA icon
    └── maskable-512.png        ← PWA maskable icon
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+D` | Download PNG |
| `Ctrl+S` | Save Template |
| `Ctrl+C` | Copy QR to Clipboard |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo |
| `D` | Toggle Dark / Light Mode |
| `1` | Switch to Generate |
| `2` | Switch to Projects |
| `3` | Switch to Scan |
| `4` | Switch to Batch |
| `5` | Switch to Settings |
| `?` | Show Shortcuts |
| `Esc` | Close Modal |

---

## QR Types

| Type | Format | Example |
|------|--------|---------|
| URL | Direct URL | `https://example.com` |
| Text | Plain text | `Hello World` |
| Email | `mailto:` | `mailto:you@email.com` |
| Phone | `tel:` | `tel:+8801234567890` |
| SMS | `SMSTO:` | `SMSTO:+880...:message` |
| WiFi | `WIFI:` | `WIFI:T:WPA;S:name;P:pass;H:false;;` |
| vCard | `BEGIN:VCARD` | Full contact card |
| WhatsApp | `wa.me` link | `https://wa.me/880...` |
| Telegram | `t.me` link | `https://t.me/username` |
| Location | `geo:` | `geo:23.81,90.41` |
| Instagram | Direct URL | `https://instagram.com/user` |
| Facebook | Direct URL | `https://facebook.com/page` |
| YouTube | Direct URL | `https://youtube.com/@channel` |
| Twitter/X | Direct URL | `https://x.com/user` |
| Crypto | Coin URI | `bitcoin:address?amount=0.01` |
| Calendar | `BEGIN:VEVENT` | Full event data |

---

## Tech Stack

Pure web platform — no build step, no npm, no frameworks.

| Library | Purpose |
|---------|---------|
| [qrcode.js](https://github.com/davidshimjs/qrcodejs) | QR code generation |
| [jsQR](https://github.com/cozmo/jsQR) | QR code scanning |
| [JSZip](https://github.com/Stuk/jszip) | ZIP download for batch |
| [Pickr](https://github.com/Simonwep/pickr) | Color picker |
| [Marked](https://github.com/markedjs/marked) | Markdown rendering |
| [Font Awesome 6](https://fontawesome.com) | Icons |
| [Poppins + Fira Code](https://fonts.google.com) | Typography |

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

1. Fork the repo
2. Create your branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "feat: your feature"`
4. Push and open a Pull Request

---

## License

MIT License © 2025 [Muhtasim Rahman (Turzo)](https://mdturzo.odoo.com)

---

<div align="center">

Free, open source, forever. If it helped you, drop a ⭐ star!

[GitHub](https://github.com/muhtasim-rahman) · [Portfolio](https://mdturzo.odoo.com)

</div>
