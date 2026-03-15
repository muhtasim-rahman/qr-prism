// =========================================================
// FRAMES.JS — QR Prism v2.8
// 12 Premium QR Outer Frame Designs
//
// draw(ctx, qrX, qrY, qrSize, opts)
//   qrX, qrY  = top-left of QR code area inside canvas
//   qrSize    = width & height of QR code area
//   opts = { color, label, font, textSize, labelColor, pad }
//   pad = { top, bottom, left, right } — already factored into canvas size
//   canvasW = qrSize + pad.left + pad.right
//   canvasH = qrSize + pad.top  + pad.bottom
//
// hasText:  true  → appears in "With Label" tab
//           false → appears in "Without Label" tab
// bannerH:  height (px) of the text area used by getFramePadding()
// topBanner:true  → label is on top; false → label is on bottom
// padding:  uniform base padding value
//
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

/* ── Shared helpers ─────────────────────────────────────── */
function _fmRR(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);       ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);   ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);       ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);           ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

function _fmText(ctx, text, font, textSize, color, cx, cy, maxW, baseFontSize) {
  const fSize = Math.round(baseFontSize * (textSize / 100));
  ctx.fillStyle = color;
  ctx.font = `700 ${fSize}px '${font || 'Outfit'}', 'Poppins', sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  // Truncate with ellipsis if too long
  let str = text || 'Scan Me';
  while (ctx.measureText(str).width > maxW && str.length > 1) {
    str = str.slice(0, -1);
  }
  if (str !== text) str = str.slice(0, -1) + '…';
  ctx.fillText(str, cx, cy);
}

// ── Stroke helper for outline frames ─────────────────────
function _fmStroke(ctx, color, lineW) {
  ctx.strokeStyle = color;
  ctx.lineWidth   = lineW;
}

const FRAMES = [

  /* ══════════════════════════════════════════════════════
     WITHOUT LABEL  (hasText: false)
  ══════════════════════════════════════════════════════ */

  /* ── 1. None ────────────────────────────────────────────── */
  {
    id:          'frm-none',
    name:        'None',
    hasText:     false,
    bannerH:     0,
    padding:     0,
    topBanner:   false,
    draw() {}
  },

  /* ── 2. Thin Border ─────────────────────────────────────── */
  {
    id:          'frm-border-thin',
    name:        'Thin Border',
    hasText:     false,
    bannerH:     0,
    padding:     14,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, pad } = opts;
      const cW = qrSize + pad.left + pad.right;
      const cH = qrSize + pad.top  + pad.bottom;
      const lw = Math.max(2, qrSize * 0.010);
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      ctx.strokeRect(lw / 2, lw / 2, cW - lw, cH - lw);
    }
  },

  /* ── 3. Rounded Border ──────────────────────────────────── */
  {
    id:          'frm-border-round',
    name:        'Rounded Border',
    hasText:     false,
    bannerH:     0,
    padding:     18,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, pad } = opts;
      const cW = qrSize + pad.left + pad.right;
      const cH = qrSize + pad.top  + pad.bottom;
      const lw = Math.max(2, qrSize * 0.012);
      const r  = Math.min(cW, cH) * 0.12;
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      _fmRR(ctx, lw / 2, lw / 2, cW - lw, cH - lw, r);
      ctx.stroke();
    }
  },

  /* ── 4. Corner Brackets ─────────────────────────────────── */
  {
    id:          'frm-brackets',
    name:        'Brackets',
    hasText:     false,
    bannerH:     0,
    padding:     20,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, pad } = opts;
      const cW = qrSize + pad.left + pad.right;
      const cH = qrSize + pad.top  + pad.bottom;
      const lw = Math.max(3, qrSize * 0.018);
      const al = Math.min(cW, cH) * 0.18; // arm length
      const m  = lw / 2;
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';

      // Top-left
      ctx.beginPath(); ctx.moveTo(m, m + al); ctx.lineTo(m, m); ctx.lineTo(m + al, m); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(cW - m - al, m); ctx.lineTo(cW - m, m); ctx.lineTo(cW - m, m + al); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(m, cH - m - al); ctx.lineTo(m, cH - m); ctx.lineTo(m + al, cH - m); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(cW - m - al, cH - m); ctx.lineTo(cW - m, cH - m); ctx.lineTo(cW - m, cH - m - al); ctx.stroke();
    }
  },

  /* ── 5. Rounded Filled Box ──────────────────────────────── */
  {
    id:          'frm-box-filled',
    name:        'Filled Box',
    hasText:     false,
    bannerH:     0,
    padding:     20,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, pad } = opts;
      const cW = qrSize + pad.left + pad.right;
      const cH = qrSize + pad.top  + pad.bottom;
      const r  = Math.min(cW, cH) * 0.10;
      // Outer filled rect
      ctx.fillStyle = color;
      _fmRR(ctx, 0, 0, cW, cH, r);
      ctx.fill();
      // Punch out QR area (make transparent)
      ctx.clearRect(qrX, qrY, qrSize, qrSize);
    }
  },

  /* ── 6. Circle Frame ────────────────────────────────────── */
  {
    id:          'frm-circle',
    name:        'Circle',
    hasText:     false,
    bannerH:     0,
    padding:     22,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, pad } = opts;
      const cW = qrSize + pad.left + pad.right;
      const cH = qrSize + pad.top  + pad.bottom;
      const cx = cW / 2, cy = cH / 2;
      const r  = Math.min(cx, cy) - 1;
      const lw = Math.max(3, qrSize * 0.016);
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      ctx.beginPath();
      ctx.arc(cx, cy, r - lw / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  /* ── 7. Hexagon Frame ───────────────────────────────────── */
  {
    id:          'frm-hexagon',
    name:        'Hexagon',
    hasText:     false,
    bannerH:     0,
    padding:     28,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, pad } = opts;
      const cW  = qrSize + pad.left + pad.right;
      const cH  = qrSize + pad.top  + pad.bottom;
      const cx  = cW / 2, cy = cH / 2;
      const r   = Math.min(cx, cy) - 2;
      const lw  = Math.max(3, qrSize * 0.018);
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      ctx.lineJoin    = 'round';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 + Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        else         ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.stroke();
    }
  },

  /* ══════════════════════════════════════════════════════
     WITH LABEL  (hasText: true)
  ══════════════════════════════════════════════════════ */

  /* ── 8. Bottom Bar ──────────────────────────────────────── */
  {
    id:          'frm-bottom-bar',
    name:        'Bottom Bar',
    hasText:     true,
    bannerH:     52,
    padding:     14,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, label, font, textSize, labelColor, pad } = opts;
      const cW    = qrSize + pad.left + pad.right;
      const barH  = pad.bottom;
      const barY  = qrY + qrSize;

      ctx.fillStyle = color;
      ctx.fillRect(0, barY, cW, barH);

      _fmText(ctx, label, font, textSize, labelColor,
        cW / 2, barY + barH / 2, cW * 0.82, barH * 0.50);
    }
  },

  /* ── 9. Top Bar ─────────────────────────────────────────── */
  {
    id:          'frm-top-bar',
    name:        'Top Bar',
    hasText:     true,
    bannerH:     52,
    padding:     14,
    topBanner:   true,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, label, font, textSize, labelColor, pad } = opts;
      const cW   = qrSize + pad.left + pad.right;
      const barH = pad.top;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, cW, barH);

      _fmText(ctx, label, font, textSize, labelColor,
        cW / 2, barH / 2, cW * 0.82, barH * 0.50);
    }
  },

  /* ── 10. Rounded Full Box + Bottom Label ────────────────── */
  {
    id:          'frm-rounded-label',
    name:        'Rounded Box',
    hasText:     true,
    bannerH:     56,
    padding:     18,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, label, font, textSize, labelColor, pad } = opts;
      const cW  = qrSize + pad.left + pad.right;
      const cH  = qrSize + pad.top  + pad.bottom;
      const r   = Math.min(cW, cH) * 0.10;
      const lw  = Math.max(3, qrSize * 0.014);

      // Outer stroke
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      _fmRR(ctx, lw / 2, lw / 2, cW - lw, cH - lw, r);
      ctx.stroke();

      // Divider line above label area
      const divY = qrY + qrSize + lw / 2;
      ctx.beginPath();
      ctx.moveTo(lw, divY);
      ctx.lineTo(cW - lw, divY);
      ctx.stroke();

      // Label area fill
      const labelH = pad.bottom - lw;
      ctx.fillStyle = color;
      _fmRR(ctx, lw, divY, cW - lw * 2, labelH, { tl: 0, tr: 0, br: r, bl: r });
      ctx.fill();

      _fmText(ctx, label, font, textSize, labelColor,
        cW / 2, divY + labelH / 2, (cW - lw * 2) * 0.82, labelH * 0.52);
    }
  },

  /* ── 11. Badge / Ticket ─────────────────────────────────── */
  {
    id:          'frm-badge',
    name:        'Badge',
    hasText:     true,
    bannerH:     56,
    padding:     16,
    topBanner:   true,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, label, font, textSize, labelColor, pad } = opts;
      const cW    = qrSize + pad.left + pad.right;
      const cH    = qrSize + pad.top  + pad.bottom;
      const r     = cW * 0.12;
      const lw    = Math.max(3, qrSize * 0.014);
      const topH  = pad.top;

      // Outer rounded box
      ctx.strokeStyle = color;
      ctx.lineWidth   = lw;
      _fmRR(ctx, lw / 2, lw / 2, cW - lw, cH - lw, r);
      ctx.stroke();

      // Top header fill
      ctx.fillStyle = color;
      ctx.beginPath();
      // Rounded top, flat bottom
      ctx.moveTo(lw, topH);
      ctx.lineTo(lw, lw + r);
      ctx.arcTo(lw, lw, lw + r, lw, r);
      ctx.lineTo(cW - lw - r, lw);
      ctx.arcTo(cW - lw, lw, cW - lw, lw + r, r);
      ctx.lineTo(cW - lw, topH);
      ctx.closePath();
      ctx.fill();

      // Divider
      ctx.beginPath();
      ctx.moveTo(lw, topH);
      ctx.lineTo(cW - lw, topH);
      ctx.stroke();

      _fmText(ctx, label, font, textSize, labelColor,
        cW / 2, topH / 2, (cW - lw * 2) * 0.82, topH * 0.52);
    }
  },

  /* ── 12. Polaroid (top gap + bottom label) ──────────────── */
  {
    id:          'frm-polaroid',
    name:        'Polaroid',
    hasText:     true,
    bannerH:     64,
    padding:     16,
    topBanner:   false,
    draw(ctx, qrX, qrY, qrSize, opts) {
      const { color, label, font, textSize, labelColor, pad } = opts;
      const cW  = qrSize + pad.left + pad.right;
      const cH  = qrSize + pad.top  + pad.bottom;
      const r   = cW * 0.06;

      // Filled background card
      ctx.fillStyle = color;
      _fmRR(ctx, 0, 0, cW, cH, r);
      ctx.fill();

      // Punch QR area back out (white-ish = drawn by engine)
      ctx.clearRect(qrX, qrY, qrSize, qrSize);

      // Label text at bottom
      const labelY = qrY + qrSize;
      const labelH = pad.bottom;
      _fmText(ctx, label, font, textSize, labelColor,
        cW / 2, labelY + labelH / 2, cW * 0.82, labelH * 0.50);
    }
  },

];
