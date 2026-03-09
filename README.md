# QR Prism v2.4

**Advanced QR Code Generator** — Free, beautiful, privacy-first.

> Made with ♥ by [Muhtasim Rahman (Turzo)](https://mdturzo.odoo.com)
> GitHub: [github.com/muhtasim-rahman/qr-prism](https://github.com/muhtasim-rahman/qr-prism)

---

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Generator](#generator)
- [QR Types](#qr-types)
- [Design Customization](#design-customization)
- [Templates](#templates)
- [Projects](#projects)
- [Scanner](#scanner)
- [Batch Generator](#batch-generator)
- [Settings](#settings)
- [PWA Installation](#pwa-installation)
- [Import / Export](#import--export)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Privacy](#privacy)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **17 QR Types** — URL, Text, Email, Phone, SMS, WiFi, vCard, WhatsApp, Telegram, Instagram, Facebook, YouTube, X/Twitter, LinkedIn, Location, Bitcoin, Calendar
- **16 Dot Patterns** — Square, Rounded, Circle, Dot, Diamond, Star, Cross, Triangle, Hexagon, Leaf, Squircle, Bars, Ring, Arrow, and more
- **Eye Frames & Inners** — Multiple styles for the three finder patterns
- **QR Frames** — Decorative borders with custom label text
- **Logo Embedding** — Upload any logo or choose from 12 preset brand logos
- **Gradient Colors** — Linear gradients for foreground with two-tone stops
- **18 Preset Templates** — One-click beautiful style presets
- **User Templates** — Save and reuse your own designs
- **Projects** — Auto-save history + named saves with pin, tags, and search
- **QR Scanner** — Camera scanner with flashlight toggle and gallery scan
- **Batch Generator** — Generate up to 100 QR codes at once
- **PWA** — Install as a native app, works offline
- **Download** — PNG, SVG, JPG, WebP, PDF, SVG+Text formats
- **Dark / Light / System Theme**
- **100% Private** — Everything runs locally in your browser

---

## Getting Started

### Online
Open `index.html` in any modern browser. No installation required.

### Local
```bash
git clone https://github.com/muhtasim-rahman/qr-prism.git
cd qr-prism
# Open index.html directly, or use a local server:
npx serve .
```

### Install as App
Open in Chrome/Edge on desktop or Safari on iOS, then install via browser menu or the **Install** button in Settings.

---

## Generator

The main tab for creating QR codes.

1. **Select QR Type** — Choose from the scrollable type tab row at the top
2. **Enter your data** — Fill in the form fields for your selected type
3. **Customize design** — Expand the settings cards below the preview
4. **Download** — Use the Download button or Ctrl+D

The QR preview updates in real time as you type or change settings.

---

## QR Types

| Type | Description |
|------|-------------|
| URL | Any web address |
| Text | Plain text message |
| Email | Opens email client with pre-filled fields |
| Phone | Initiates a phone call |
| SMS | Sends a pre-filled text message |
| WiFi | Auto-connects to a WiFi network |
| vCard | Contact card with name, phone, email |
| WhatsApp | Opens chat with a pre-filled message |
| Telegram | Opens Telegram profile/channel |
| Instagram | Instagram profile link |
| Facebook | Facebook profile or page |
| YouTube | YouTube channel or video |
| X/Twitter | X (formerly Twitter) profile |
| LinkedIn | LinkedIn profile |
| Location | GPS coordinates (Google Maps compatible) |
| Bitcoin | Bitcoin payment request |
| Calendar | Calendar event with date/time |

---

## Design Customization

### Dot Patterns
Choose from 16 styles including Square, Circle, Diamond, Star, Hexagon, Leaf, Ring, and more. Each pattern is rendered as a canvas preview.

### Colors
- **Foreground** — Main QR dot color
- **Background** — Canvas background color
- **Gradient** — Enable linear gradient with two color stops
- **Eye Frame** — Color for the three finder pattern borders
- **Eye Inner** — Color for the inner eye dots
- **Frame** — Border frame color and label color

### Eye Styles
Customize the shape of the finder patterns (the three corner squares):
- Eye Frame styles: Square, Rounded, Circle, Leaf, Diamond
- Eye Inner styles: Square, Dot, Rounded, Diamond, Star

### Frames
Add a decorative frame around the QR code with a label such as "Scan Me" or your website URL. Multiple frame styles available with and without labels.

### Logo
- Upload any image (PNG, JPG, SVG — max 5MB)
- Or choose from preset brand logos: WhatsApp, Telegram, Instagram, Facebook, YouTube, X, LinkedIn, GitHub, TikTok, Spotify, WiFi, Bitcoin
- Adjust logo size and padding
- Optional logo background padding color

### Size & Quality
- Set canvas size from 100px to 2000px
- Error correction levels: L (7%), M (15%), Q (25%), H (30%)
- Higher error correction allows more logo overlap

---

## Templates

### Preset Templates (18 styles)
Click any preset to instantly apply it:
Classic, Indigo Prism, Ocean Wave, Sunset, Forest, Midnight, Rose Gold, Neon Green, Purple Haze, Sky Blue, Minimal Dark, Coral, Golden Hour, Arctic, Monochrome, Lava, Emerald, Prism Glow.

### User Templates
1. Design a QR style you like
2. Click **Save Template** (Ctrl+S) and give it a name
3. Access saved templates from the Templates card or the Templates tab
4. Templates store all design settings (pattern, colors, eye styles, frame, logo settings)

---

## Projects

QR Prism auto-saves every generated QR code to your project history.

### Tabs
- **Saved** — Your manually named projects
- **Auto-saved** — Automatic history (up to 100 entries)
- **Pinned** — Projects you've pinned for quick access

### Project Card Info
- QR thumbnail on the left
- Project name (tap to rename), type badge, category, date
- Data preview (first 80 characters)
- Tag chips (tap × to remove, tap + to add)
- 3-dot menu: Load, Download, Rename, Pin/Unpin, Delete

### Multi-select
1. Tap the **Select** button in the header
2. Tap project cards to select them
3. Use the bottom bar to delete or export selected projects

### Searching
Use the search bar to filter by name, data content, type, or tags.

---

## Scanner

Switch to the **Scan** tab to open the camera scanner.

- Camera opens automatically when the tab is selected
- A scan frame overlay shows the scanning area
- **Flashlight** button (torch icon) — toggle camera flash/torch
- **Gallery** button (image icon) — scan a QR code from a saved image
- Results show the decoded data, detected type, and context actions (Open URL, Call, Email, Connect WiFi, etc.)
- Tap **Scan Again** to reset and scan another code
- Decoded QR data can be loaded directly into the Generator with **Edit**

---

## Batch Generator

Generate up to 100 QR codes at once using a saved template style.

1. Switch to the **Batch** tab
2. Select a template style from your saved templates
3. Enter one data item per line in the text area
4. Tap **Generate** — progress bar shows real-time completion
5. Download individual QR codes or all at once

---

## Settings

| Setting | Description |
|---------|-------------|
| Theme | Light / Dark / System |
| Reduce Motion | Disable all animations |
| Default Size | Initial QR canvas size |
| Error Correction | Default error correction level |
| Default Format | Default download format |
| Auto-save Projects | Toggle automatic project history |
| Export Projects | Save all projects as JSON |
| Export Templates | Save all templates as JSON |
| Import | Import projects/templates/settings JSON |
| Export Settings | Backup settings as JSON |
| Reset Settings | Restore all settings to default |

---

## PWA Installation

QR Prism is a Progressive Web App (PWA) that can be installed on any device.

**Desktop (Chrome/Edge):**
1. Open the site
2. Look for the install icon in the address bar, or go to Settings → Install

**Android:**
1. Open in Chrome
2. Tap the 3-dot menu → Add to Home Screen

**iOS (Safari):**
1. Open in Safari
2. Tap Share → Add to Home Screen

Once installed, QR Prism works fully offline including all generators, templates, and saved projects.

---

## Import / Export

All data is exported as structured JSON files with this naming pattern:
```
qr-prism_projects_12_15-12-2026_19-32.json
qr-prism_templates_5_15-12-2026_19-32.json
qr-prism_settings_15-12-2026_19-32.json
```

**Import:** Go to Settings → Import Data → select any QR Prism JSON file. The app auto-detects whether it's projects, templates, or settings and merges it with existing data.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+D | Download QR |
| Ctrl+S | Save Template |
| Ctrl+C | Copy QR to clipboard |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| D | Toggle dark/light theme |
| ? | Show keyboard shortcuts |
| Escape | Close modal / bottom sheet |

---

## Privacy

QR Prism is 100% client-side. No data is ever sent to a server.

- All QR generation happens in your browser
- Projects and templates are stored in your browser's `localStorage`
- Camera access is only used for the scanner and is never recorded
- No analytics, no tracking, no ads

---

## Contributing

Pull requests welcome! Please:
1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push and open a PR

**Bug reports:** Use the in-app **Report Bug** form (Menu → Report Bug) or open a GitHub issue.

---

## License

MIT License — free to use, modify, and distribute.

---

*QR Prism v2.4 — © 2024 Muhtasim Rahman (Turzo)*
*[https://mdturzo.odoo.com](https://mdturzo.odoo.com) · [GitHub](https://github.com/muhtasim-rahman/qr-prism)*
