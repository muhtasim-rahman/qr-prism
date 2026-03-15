// =========================================================
// PATTERNS.JS — QR Prism v2.8
// 22 Premium QR Dot Module Patterns
// Each: { id, name, draw(ctx, x, y, s, color) }
//   x, y = top-left of module cell (gap already applied)
//   s    = cell size after gap reduction
// No sharp corners unless intentional (premium look)
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

/* ── Shared helpers ─────────────────────────────────────── */
function _rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);       ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);   ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);       ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);           ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

const PATTERNS = [

  /* ── 1. Square ─────────────────────────────────────────── */
  {
    id: 'pat-square', name: 'Square',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }
  },

  /* ── 2. Rounded ─────────────────────────────────────────── */
  {
    id: 'pat-round', name: 'Rounded',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _rr(ctx, x + 0.5, y + 0.5, s - 1, s - 1, s * 0.32);
      ctx.fill();
    }
  },

  /* ── 3. Circle ──────────────────────────────────────────── */
  {
    id: 'pat-circle', name: 'Circle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.46, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  /* ── 4. Dot (small circle) ──────────────────────────────── */
  {
    id: 'pat-dot', name: 'Dot',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  /* ── 5. Diamond ─────────────────────────────────────────── */
  {
    id: 'pat-diamond', name: 'Diamond',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.48;
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

  /* ── 6. Crystal (4-pointed star, smooth) ───────────────── */
  {
    id: 'pat-crystal', name: 'Crystal',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const r1 = s * 0.47, r2 = s * 0.16;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4 - Math.PI / 4;
        const r = i % 2 === 0 ? r1 : r2;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        else         ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 7. Star (5-pointed) ────────────────────────────────── */
  {
    id: 'pat-star', name: 'Star',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const r1 = s * 0.46, r2 = s * 0.19;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        const r = i % 2 === 0 ? r1 : r2;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
        else         ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 8. Cross ───────────────────────────────────────────── */
  {
    id: 'pat-cross', name: 'Cross',
    draw(ctx, x, y, s, color) {
      const t = s * 0.30, g = (s - t) / 2;
      ctx.fillStyle = color;
      // Horizontal bar
      _rr(ctx, x, y + g, s, t, t * 0.45);
      ctx.fill();
      // Vertical bar
      _rr(ctx, x + g, y, t, s, t * 0.45);
      ctx.fill();
    }
  },

  /* ── 9. Plus (thin cross) ───────────────────────────────── */
  {
    id: 'pat-plus', name: 'Plus',
    draw(ctx, x, y, s, color) {
      const t = s * 0.22, g = (s - t) / 2;
      ctx.fillStyle = color;
      _rr(ctx, x, y + g, s, t, t * 0.5);
      ctx.fill();
      _rr(ctx, x + g, y, t, s, t * 0.5);
      ctx.fill();
    }
  },

  /* ── 10. Heart ──────────────────────────────────────────── */
  {
    id: 'pat-heart', name: 'Heart',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const w = s * 0.82, h = s * 0.78;
      const lx = cx - w / 2, ty = cy - h * 0.35;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, ty + h * 0.72);
      ctx.bezierCurveTo(cx, ty + h * 0.72, lx - w * 0.02, ty + h * 0.45, lx - w * 0.02, ty + h * 0.28);
      ctx.bezierCurveTo(lx - w * 0.02, ty - h * 0.02, lx + w * 0.18, ty - h * 0.12, cx, ty + h * 0.22);
      ctx.bezierCurveTo(cx, ty + h * 0.22, lx + w * 0.82, ty - h * 0.12, lx + w * 1.02, ty + h * 0.28);
      ctx.bezierCurveTo(lx + w * 1.02, ty + h * 0.45, cx, ty + h * 0.72, cx, ty + h * 0.72);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 11. Clover (4-leaf) ────────────────────────────────── */
  {
    id: 'pat-clover', name: 'Clover',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.24;
      ctx.fillStyle = color;
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx,dy]) => {
        ctx.beginPath();
        ctx.arc(cx + dx * r * 0.95, cy + dy * r * 0.95, r, 0, Math.PI * 2);
        ctx.fill();
      });
      // Center bridge
      _rr(ctx, cx - r * 0.55, cy - r * 0.55, r * 1.1, r * 1.1, r * 0.3);
      ctx.fill();
    }
  },

  /* ── 12. Leaf (teardrop) ────────────────────────────────── */
  {
    id: 'pat-leaf', name: 'Leaf',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const r = s * 0.44;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      // Cut top-left corner to make "leaf" / teardrop feel
      ctx.fillStyle = 'rgba(0,0,0,0)'; // we just do full circle
      // Actually let's do squircle-ish
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  /* ── 13. Squircle ───────────────────────────────────────── */
  {
    id: 'pat-squircle', name: 'Squircle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _rr(ctx, x + s * 0.05, y + s * 0.05, s * 0.90, s * 0.90, s * 0.22);
      ctx.fill();
    }
  },

  /* ── 14. Hexagon ────────────────────────────────────────── */
  {
    id: 'pat-hexagon', name: 'Hexagon',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.46;
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

  /* ── 15. Triangle ───────────────────────────────────────── */
  {
    id: 'pat-triangle', name: 'Triangle',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx,         cy - h);
      ctx.lineTo(cx + h * 1.12, cy + h * 0.72);
      ctx.lineTo(cx - h * 1.12, cy + h * 0.72);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 16. Ring (donut) ───────────────────────────────────── */
  {
    id: 'pat-ring', name: 'Ring',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.44, 0, Math.PI * 2);
      ctx.arc(cx, cy, s * 0.22, 0, Math.PI * 2, true); // hole (clockwise = clockwise, true = CCW = hole)
      ctx.fill('evenodd');
    }
  },

  /* ── 17. Vertical Bars ──────────────────────────────────── */
  {
    id: 'pat-bars-v', name: 'Bars V',
    draw(ctx, x, y, s, color) {
      const w = s * 0.36, g = (s - w) / 2;
      ctx.fillStyle = color;
      _rr(ctx, x + g, y + s * 0.04, w, s * 0.92, w * 0.5);
      ctx.fill();
    }
  },

  /* ── 18. Horizontal Bars ────────────────────────────────── */
  {
    id: 'pat-bars-h', name: 'Bars H',
    draw(ctx, x, y, s, color) {
      const h = s * 0.36, g = (s - h) / 2;
      ctx.fillStyle = color;
      _rr(ctx, x + s * 0.04, y + g, s * 0.92, h, h * 0.5);
      ctx.fill();
    }
  },

  /* ── 19. Corner-cut (beveled square) ────────────────────── */
  {
    id: 'pat-bevel', name: 'Bevel',
    draw(ctx, x, y, s, color) {
      const c = s * 0.22, p = s * 0.04;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + p + c,    y + p);
      ctx.lineTo(x + s - p - c, y + p);
      ctx.lineTo(x + s - p,    y + p + c);
      ctx.lineTo(x + s - p,    y + s - p - c);
      ctx.lineTo(x + s - p - c, y + s - p);
      ctx.lineTo(x + p + c,    y + s - p);
      ctx.lineTo(x + p,        y + s - p - c);
      ctx.lineTo(x + p,        y + p + c);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 20. Raindrop ───────────────────────────────────────── */
  {
    id: 'pat-raindrop', name: 'Raindrop',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, by = y + s * 0.88, r = s * 0.34;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, by - r, r, 0, Math.PI);
      ctx.bezierCurveTo(cx - r, by - r, cx, y + s * 0.08, cx, y + s * 0.08);
      ctx.bezierCurveTo(cx, y + s * 0.08, cx + r, by - r, cx + r, by - r);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 21. Rounded Diamond ────────────────────────────────── */
  {
    id: 'pat-rdiamond', name: 'Soft Diamond',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx,     cy - h);
      ctx.bezierCurveTo(cx + h * 0.5, cy - h * 0.5, cx + h, cy - h * 0.5, cx + h, cy);
      ctx.bezierCurveTo(cx + h, cy + h * 0.5, cx + h * 0.5, cy + h * 0.5, cx, cy + h);
      ctx.bezierCurveTo(cx - h * 0.5, cy + h * 0.5, cx - h, cy + h * 0.5, cx - h, cy);
      ctx.bezierCurveTo(cx - h, cy - h * 0.5, cx - h * 0.5, cy - h * 0.5, cx, cy - h);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 22. Pixel (small centered square) ─────────────────── */
  {
    id: 'pat-pixel', name: 'Pixel',
    draw(ctx, x, y, s, color) {
      const p = s * 0.12;
      ctx.fillStyle = color;
      ctx.fillRect(x + p, y + p, s - p * 2, s - p * 2);
    }
  },

];
