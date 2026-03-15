// =========================================================
// EYE-FRAMES.JS — QR Prism v2.8
// 14 Eye Frame (Outer Finder Pattern) Designs
// draw(ctx, x, y, s, color)
//   s = full 7×7 eye size
// IMPORTANT: Only draw the OUTER ring shape.
//   qr-engine.js will clearRect the inner 5×5 after this.
//   Use a SINGLE color only — no layering.
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

/* ── Shared helpers ─────────────────────────────────────── */
function _efRR(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);       ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);   ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);       ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);           ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

const EYE_FRAMES = [

  /* ── 1. Square ──────────────────────────────────────────── */
  {
    id: 'ef-square', name: 'Square',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
      // Engine clears inner; we fill all for correct rendering
    }
  },

  /* ── 2. Rounded Small ───────────────────────────────────── */
  {
    id: 'ef-round-sm', name: 'Rounded',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _efRR(ctx, x, y, s, s, s * 0.18);
      ctx.fill();
    }
  },

  /* ── 3. Rounded Large ───────────────────────────────────── */
  {
    id: 'ef-round-lg', name: 'Rounded+',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _efRR(ctx, x, y, s, s, s * 0.38);
      ctx.fill();
    }
  },

  /* ── 4. Circle ──────────────────────────────────────────── */
  {
    id: 'ef-circle', name: 'Circle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.50, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  /* ── 5. Squircle ────────────────────────────────────────── */
  {
    id: 'ef-squircle', name: 'Squircle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _efRR(ctx, x, y, s, s, s * 0.28);
      ctx.fill();
    }
  },

  /* ── 6. Hexagon ─────────────────────────────────────────── */
  {
    id: 'ef-hexagon', name: 'Hexagon',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.50;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 + Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        else         ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 7. Diamond (rotated square) ───────────────────────── */
  {
    id: 'ef-diamond', name: 'Diamond',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.50;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx,     cy - h);
      ctx.lineTo(cx + h, cy);
      ctx.lineTo(cx,     cy + h);
      ctx.lineTo(cx - h, cy);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 8. Leaf (top-right rounded, bottom-left sharp) ─────── */
  {
    id: 'ef-leaf-tr', name: 'Leaf TR',
    draw(ctx, x, y, s, color) {
      const r = s * 0.45;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + s - r, y);
      ctx.arcTo(x + s, y,     x + s, y + r,     r);
      ctx.lineTo(x + s, y + s - r);
      ctx.arcTo(x + s, y + s, x + s - r, y + s, r * 0.5);
      ctx.lineTo(x, y + s);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 9. Leaf (top-left rounded) ─────────────────────────── */
  {
    id: 'ef-leaf-tl', name: 'Leaf TL',
    draw(ctx, x, y, s, color) {
      const r = s * 0.45;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x + s, y + s);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 10. Notched (cut 2 corners) ────────────────────────── */
  {
    id: 'ef-notch', name: 'Notched',
    draw(ctx, x, y, s, color) {
      const c = s * 0.20;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + c,     y);
      ctx.lineTo(x + s,     y);
      ctx.lineTo(x + s,     y + s - c);
      ctx.lineTo(x + s - c, y + s);
      ctx.lineTo(x,         y + s);
      ctx.lineTo(x,         y + c);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 11. Rounded Top-Left only ───────────────────────────── */
  {
    id: 'ef-round-one', name: 'Corner R',
    draw(ctx, x, y, s, color) {
      const r = s * 0.44;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x + s, y + s);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.lineTo(x + r, y);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 12. Chamfered (all 4 corners clipped) ───────────────── */
  {
    id: 'ef-chamfer', name: 'Chamfered',
    draw(ctx, x, y, s, color) {
      const c = s * 0.16;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + c,     y);
      ctx.lineTo(x + s - c, y);
      ctx.lineTo(x + s,     y + c);
      ctx.lineTo(x + s,     y + s - c);
      ctx.lineTo(x + s - c, y + s);
      ctx.lineTo(x + c,     y + s);
      ctx.lineTo(x,         y + s - c);
      ctx.lineTo(x,         y + c);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 13. Pill (extra wide radius) ────────────────────────── */
  {
    id: 'ef-pill', name: 'Pill',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _efRR(ctx, x, y, s, s, s * 0.50);
      ctx.fill();
    }
  },

  /* ── 14. Tilted Rounded ──────────────────────────────────── */
  {
    id: 'ef-mixed', name: 'Mixed',
    draw(ctx, x, y, s, color) {
      // Top-right & bottom-left = large radius; others = small
      const rSmall = s * 0.10, rLarge = s * 0.40;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + rSmall, y);
      ctx.lineTo(x + s - rLarge, y);
      ctx.arcTo(x + s, y,     x + s, y + rLarge,     rLarge);
      ctx.lineTo(x + s, y + s - rSmall);
      ctx.arcTo(x + s, y + s, x + s - rSmall, y + s, rSmall);
      ctx.lineTo(x + rLarge, y + s);
      ctx.arcTo(x, y + s, x, y + s - rLarge, rLarge);
      ctx.lineTo(x, y + rSmall);
      ctx.arcTo(x, y, x + rSmall, y, rSmall);
      ctx.closePath();
      ctx.fill();
    }
  },

];
