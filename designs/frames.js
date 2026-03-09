// =========================================================
// designs/frames.js — QR Border Frame Definitions
// Premium frames with text support and custom styling
// =========================================================

const FRAME_DESIGNS_WITH_LABEL = [
  {
    id: 'frame-none',
    name: 'No Frame',
    icon: '✕'
  },
  {
    id: 'frame-bottom-bar',
    name: 'Bottom Bar',
    icon: `<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" rx="4" fill="white" stroke="#ddd" stroke-width="1.5"/>
      <rect x="2" y="54" width="56" height="14" rx="4" fill="var(--frame-color,#7c3aed)"/>
      <text x="30" y="64" text-anchor="middle" font-size="7" fill="white" font-family="Inter,sans-serif">SCAN ME</text>
    </svg>`
  },
  {
    id: 'frame-top-bar',
    name: 'Top Bar',
    icon: `<svg viewBox="0 0 60 70" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="14" width="56" height="54" rx="4" fill="white" stroke="#ddd" stroke-width="1.5"/>
      <rect x="2" y="2" width="56" height="14" rx="4" fill="var(--frame-color,#7c3aed)"/>
      <text x="30" y="12.5" text-anchor="middle" font-size="7" fill="white" font-family="Inter,sans-serif">SCAN ME</text>
    </svg>`
  },
  {
    id: 'frame-badge',
    name: 'Badge',
    icon: `<svg viewBox="0 0 60 75" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" rx="4" fill="white" stroke="#ddd" stroke-width="1.5"/>
      <ellipse cx="30" cy="67" rx="22" ry="7" fill="var(--frame-color,#7c3aed)"/>
      <text x="30" y="70" text-anchor="middle" font-size="7" fill="white" font-family="Inter,sans-serif">SCAN ME</text>
    </svg>`
  },
  {
    id: 'frame-speech-bubble',
    name: 'Speech',
    icon: `<svg viewBox="0 0 60 75" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" rx="8" fill="var(--frame-color,#7c3aed)"/>
      <polygon points="20,56 30,72 40,56" fill="var(--frame-color,#7c3aed)"/>
      <rect x="6" y="6" width="48" height="48" rx="5" fill="white"/>
      <text x="30" y="65" text-anchor="middle" font-size="7" fill="var(--frame-color,#7c3aed)" font-family="Inter,sans-serif" font-weight="bold">SCAN ME</text>
    </svg>`
  },
  {
    id: 'frame-smartphone',
    name: 'Phone',
    icon: `<svg viewBox="0 0 60 85" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="1" width="48" height="83" rx="8" fill="var(--frame-color,#7c3aed)"/>
      <rect x="9" y="12" width="42" height="56" fill="white"/>
      <circle cx="30" cy="7" r="2" fill="rgba(255,255,255,0.4)"/>
      <circle cx="30" cy="78" r="4" fill="rgba(255,255,255,0.5)"/>
      <text x="30" y="76" text-anchor="middle" font-size="6" fill="white" font-family="Inter,sans-serif">SCAN</text>
    </svg>`
  },
  {
    id: 'frame-rounded-border',
    name: 'Rounded Box',
    icon: `<svg viewBox="0 0 60 75" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="71" rx="12" fill="var(--frame-color,#7c3aed)"/>
      <rect x="6" y="6" width="48" height="55" rx="8" fill="white"/>
      <text x="30" y="69" text-anchor="middle" font-size="7" fill="white" font-family="Inter,sans-serif" font-weight="bold">SCAN ME</text>
    </svg>`
  },
  {
    id: 'frame-polaroid',
    name: 'Polaroid',
    icon: `<svg viewBox="0 0 64 80" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="60" height="76" rx="3" fill="white" stroke="#ddd" stroke-width="2"/>
      <rect x="7" y="7" width="50" height="50" fill="#f0f0f0"/>
      <text x="32" y="70" text-anchor="middle" font-size="7" fill="#555" font-family="'Dancing Script',cursive">Scan me!</text>
    </svg>`
  },
  {
    id: 'frame-gradient-bar',
    name: 'Gradient Bar',
    icon: `<svg viewBox="0 0 60 75" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gbg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs>
      <rect x="2" y="2" width="56" height="56" rx="4" fill="white" stroke="#ddd" stroke-width="1.5"/>
      <rect x="2" y="54" width="56" height="14" rx="4" fill="url(#gbg)"/>
      <text x="30" y="64" text-anchor="middle" font-size="7" fill="white" font-family="Inter,sans-serif" font-weight="bold">SCAN ME</text>
    </svg>`
  },
];

const FRAME_DESIGNS_NO_LABEL = [
  {
    id: 'frame-none',
    name: 'No Frame',
    icon: '✕'
  },
  {
    id: 'frame-square-thin',
    name: 'Sq. Thin',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="2.5"/>
    </svg>`
  },
  {
    id: 'frame-square-thick',
    name: 'Sq. Thick',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="6"/>
    </svg>`
  },
  {
    id: 'frame-rounded',
    name: 'Rounded',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" rx="12" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'frame-circle-border',
    name: 'Circle',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="27" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'frame-dashed',
    name: 'Dashed',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="3" stroke-dasharray="8,4"/>
    </svg>`
  },
  {
    id: 'frame-dots-border',
    name: 'Dotted',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="4" stroke-dasharray="2,5"/>
    </svg>`
  },
  {
    id: 'frame-bracket',
    name: 'Bracket',
    icon: `<svg viewBox="0 0 60 60" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="4" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H2V20"/><path d="M40 2H58V20"/><path d="M2 40V58H20"/><path d="M58 40V58H40"/>
    </svg>`
  },
  {
    id: 'frame-double',
    name: 'Double',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="56" height="56" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="2.5"/>
      <rect x="7" y="7" width="46" height="46" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="2.5"/>
    </svg>`
  },
  {
    id: 'frame-shadow',
    name: 'Shadow',
    icon: `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <rect x="7" y="7" width="56" height="56" fill="rgba(124,58,237,0.25)" rx="4"/>
      <rect x="2" y="2" width="56" height="56" rx="4" fill="white" stroke="var(--frame-color,#7c3aed)" stroke-width="2.5"/>
    </svg>`
  },
  {
    id: 'frame-hexagon',
    name: 'Hexagon',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 3 L54 16.5 L54 43.5 L30 57 L6 43.5 L6 16.5 Z" fill="none" stroke="var(--frame-color,#7c3aed)" stroke-width="4"/>
    </svg>`
  },
  {
    id: 'frame-gradient-border',
    name: 'Gradient',
    icon: `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs><linearGradient id="gfr" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7c3aed"/><stop offset="100%" stop-color="#ec4899"/></linearGradient></defs>
      <rect x="2" y="2" width="56" height="56" rx="8" fill="none" stroke="url(#gfr)" stroke-width="5"/>
    </svg>`
  },
];

// Frame render functions (used by qr-engine to draw frames on canvas)
// labelText, font, textSize, textColor, frameColor are passed in
function renderFrame(ctx, frameId, canvasSize, qrOffset, qrSize, label, font, textSizePct, textColor, frameColor) {
  const fs = canvasSize;
  const pad = qrOffset;
  const qs  = qrSize;

  ctx.fillStyle = frameColor;
  ctx.strokeStyle = frameColor;

  switch (frameId) {

    case 'frame-bottom-bar': {
      const barH = Math.round(fs * 0.12);
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      roundedRectPath(ctx, 0, fs - barH, fs, barH, [0, 0, 8, 8]);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(barH * 0.55 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, fs - barH / 2);
      break;
    }

    case 'frame-top-bar': {
      const barH = Math.round(fs * 0.12);
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      roundedRectPath(ctx, 0, 0, fs, barH, [8, 8, 0, 0]);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(barH * 0.55 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, barH / 2);
      break;
    }

    case 'frame-badge': {
      const barH = Math.round(fs * 0.1);
      const badgeW = fs * 0.65;
      const badgeY = fs - barH * 0.7;
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.ellipse(fs / 2, badgeY, badgeW / 2, barH / 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(barH * 0.7 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, badgeY);
      break;
    }

    case 'frame-speech-bubble': {
      // Outer colored border + bottom triangle + label inside
      const br = 16;
      const barH = Math.round(fs * 0.14);
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      roundedRectPath(ctx, 0, 0, fs, fs - barH, [br, br, 0, 0]);
      ctx.fill();
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.moveTo(fs * 0.35, fs - barH);
      ctx.lineTo(fs / 2, fs);
      ctx.lineTo(fs * 0.65, fs - barH);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(barH * 0.55 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(label, fs / 2, fs - barH * 0.1);
      break;
    }

    case 'frame-polaroid': {
      const barH = Math.round(fs * 0.15);
      const pad2 = Math.round(fs * 0.04);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      roundedRectPath(ctx, 0, 0, fs, fs, [8, 8, 8, 8]);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = textColor !== '#ffffff' ? textColor : '#555555';
      const fontSize = Math.round(barH * 0.45 * (textSizePct / 100));
      ctx.font = `${fontSize}px 'Dancing Script', cursive, ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, fs - barH / 2);
      break;
    }

    case 'frame-rounded-border': {
      const br2 = 20;
      const barH = Math.round(fs * 0.12);
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      roundedRectPath(ctx, 0, 0, fs, fs, [br2, br2, br2, br2]);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(barH * 0.55 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, fs - barH / 2);
      break;
    }

    case 'frame-gradient-bar': {
      const barH = Math.round(fs * 0.12);
      const grad = ctx.createLinearGradient(0, 0, fs, 0);
      grad.addColorStop(0, frameColor);
      grad.addColorStop(1, '#ec4899');
      ctx.fillStyle = grad;
      ctx.beginPath();
      roundedRectPath(ctx, 0, fs - barH, fs, barH, [0, 0, 8, 8]);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(barH * 0.55 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, fs - barH / 2);
      break;
    }

    case 'frame-smartphone': {
      const phPad = Math.round(fs * 0.08);
      ctx.fillStyle = frameColor;
      ctx.beginPath();
      roundedRectPath(ctx, 0, 0, fs, fs, [20, 20, 20, 20]);
      ctx.fill();
      // Camera dot
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(fs / 2, phPad * 0.6, phPad * 0.18, 0, Math.PI * 2);
      ctx.fill();
      // Home button
      ctx.beginPath();
      ctx.arc(fs / 2, fs - phPad * 0.6, phPad * 0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = textColor;
      const fontSize = Math.round(phPad * 0.5 * (textSizePct / 100));
      ctx.font = `bold ${fontSize}px ${font}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, fs / 2, fs - phPad * 0.6);
      break;
    }

    // ─── No-label frames ──────────────────────────────────
    case 'frame-square-thin': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.025);
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth);
      break;
    }

    case 'frame-square-thick': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.07);
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth);
      break;
    }

    case 'frame-rounded': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.04);
      const r3 = Math.round(fs * 0.1);
      ctx.beginPath();
      roundedRectPath(ctx, ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth, [r3, r3, r3, r3]);
      ctx.stroke();
      break;
    }

    case 'frame-circle-border': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.04);
      ctx.beginPath();
      ctx.arc(fs / 2, fs / 2, fs / 2 - ctx.lineWidth / 2, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }

    case 'frame-dashed': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.03);
      ctx.setLineDash([fs * 0.06, fs * 0.03]);
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth);
      ctx.setLineDash([]);
      break;
    }

    case 'frame-dots-border': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.04);
      ctx.setLineDash([1, fs * 0.05]);
      ctx.lineCap = 'round';
      ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth);
      ctx.setLineDash([]);
      break;
    }

    case 'frame-bracket': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.04);
      ctx.lineCap = 'round';
      const bk = fs * 0.25;
      const lw = ctx.lineWidth / 2;
      ctx.beginPath();
      ctx.moveTo(lw + bk, lw); ctx.lineTo(lw, lw); ctx.lineTo(lw, lw + bk);
      ctx.moveTo(fs - lw - bk, lw); ctx.lineTo(fs - lw, lw); ctx.lineTo(fs - lw, lw + bk);
      ctx.moveTo(lw, fs - lw - bk); ctx.lineTo(lw, fs - lw); ctx.lineTo(lw + bk, fs - lw);
      ctx.moveTo(fs - lw, fs - lw - bk); ctx.lineTo(fs - lw, fs - lw); ctx.lineTo(fs - lw - bk, fs - lw);
      ctx.stroke();
      break;
    }

    case 'frame-double': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.025);
      const lw2 = ctx.lineWidth / 2;
      ctx.strokeRect(lw2, lw2, fs - ctx.lineWidth, fs - ctx.lineWidth);
      const in2 = fs * 0.06;
      ctx.strokeRect(in2, in2, fs - in2 * 2, fs - in2 * 2);
      break;
    }

    case 'frame-shadow': {
      ctx.shadowColor = frameColor + '66';
      ctx.shadowBlur = fs * 0.08;
      ctx.shadowOffsetX = fs * 0.02;
      ctx.shadowOffsetY = fs * 0.02;
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.03);
      ctx.beginPath();
      roundedRectPath(ctx, ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth, [8, 8, 8, 8]);
      ctx.stroke();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      break;
    }

    case 'frame-hexagon': {
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = Math.round(fs * 0.04);
      const hc = fs / 2, hr = fs / 2 - ctx.lineWidth;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x = hc + hr * Math.cos(a), y = hc + hr * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }

    case 'frame-gradient-border': {
      ctx.lineWidth = Math.round(fs * 0.05);
      const grd = ctx.createLinearGradient(0, 0, fs, fs);
      grd.addColorStop(0, frameColor);
      grd.addColorStop(1, '#ec4899');
      ctx.strokeStyle = grd;
      const r4 = Math.round(fs * 0.08);
      ctx.beginPath();
      roundedRectPath(ctx, ctx.lineWidth / 2, ctx.lineWidth / 2, fs - ctx.lineWidth, fs - ctx.lineWidth, [r4, r4, r4, r4]);
      ctx.stroke();
      break;
    }
  }
}

// Helper: rounded rect path with per-corner radii [tl, tr, br, bl]
function roundedRectPath(ctx, x, y, w, h, radii) {
  const [tl, tr, br, bl] = radii.map(r => Math.min(r, w / 2, h / 2));
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + w - tr, y);
  ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br);
  ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h);
  ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl);
  ctx.arcTo(x, y, x + tl, y, tl);
  ctx.closePath();
}
