// =========================================================
// EYE-INNERS.JS — QR Prism v2.8
// 14 Eye Inner (Center Finder Dot) Designs
// draw(ctx, x, y, s, color)
//   x, y, s = the 3×3 module area (s ≈ 3 modules wide)
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

/* ── Shared helper ──────────────────────────────────────── */
function _eiRR(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);       ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);   ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);       ctx.arcTo(x,     y + h, x,     y + h - r, r);
  ctx.lineTo(x, y + r);           ctx.arcTo(x,     y,     x + r, y,         r);
  ctx.closePath();
}

const EYE_INNERS = [

  /* ── 1. Square ──────────────────────────────────────────── */
  {
    id: 'ei-square', name: 'Square',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }
  },

  /* ── 2. Rounded ─────────────────────────────────────────── */
  {
    id: 'ei-round', name: 'Rounded',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _eiRR(ctx, x, y, s, s, s * 0.28);
      ctx.fill();
    }
  },

  /* ── 3. Circle ──────────────────────────────────────────── */
  {
    id: 'ei-circle', name: 'Circle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.48, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  /* ── 4. Squircle ────────────────────────────────────────── */
  {
    id: 'ei-squircle', name: 'Squircle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _eiRR(ctx, x + s * 0.04, y + s * 0.04, s * 0.92, s * 0.92, s * 0.22);
      ctx.fill();
    }
  },

  /* ── 5. Diamond ─────────────────────────────────────────── */
  {
    id: 'ei-diamond', name: 'Diamond',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.49;
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

  /* ── 6. Crystal (4-point star) ──────────────────────────── */
  {
    id: 'ei-crystal', name: 'Crystal',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const r1 = s * 0.48, r2 = s * 0.16;
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

  /* ── 7. Star (5-point) ──────────────────────────────────── */
  {
    id: 'ei-star', name: 'Star',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const r1 = s * 0.47, r2 = s * 0.20;
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

  /* ── 8. Cross (filled +) ────────────────────────────────── */
  {
    id: 'ei-cross', name: 'Cross',
    draw(ctx, x, y, s, color) {
      const t = s * 0.34, g = (s - t) / 2;
      ctx.fillStyle = color;
      _eiRR(ctx, x, y + g, s, t, t * 0.4);
      ctx.fill();
      _eiRR(ctx, x + g, y, t, s, t * 0.4);
      ctx.fill();
    }
  },

  /* ── 9. Heart ───────────────────────────────────────────── */
  {
    id: 'ei-heart', name: 'Heart',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const w = s * 0.88, h = s * 0.82;
      const lx = cx - w / 2, ty = cy - h * 0.34;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, ty + h * 0.74);
      ctx.bezierCurveTo(cx, ty + h * 0.74, lx, ty + h * 0.44, lx, ty + h * 0.26);
      ctx.bezierCurveTo(lx, ty - h * 0.04, lx + w * 0.20, ty - h * 0.14, cx, ty + h * 0.20);
      ctx.bezierCurveTo(cx, ty + h * 0.20, lx + w * 0.80, ty - h * 0.14, lx + w, ty + h * 0.26);
      ctx.bezierCurveTo(lx + w, ty + h * 0.44, cx, ty + h * 0.74, cx, ty + h * 0.74);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 10. Clover ─────────────────────────────────────────── */
  {
    id: 'ei-clover', name: 'Clover',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.26;
      ctx.fillStyle = color;
      [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([dx,dy]) => {
        ctx.beginPath();
        ctx.arc(cx + dx * r * 0.90, cy + dy * r * 0.90, r, 0, Math.PI * 2);
        ctx.fill();
      });
      _eiRR(ctx, cx - r * 0.58, cy - r * 0.58, r * 1.16, r * 1.16, r * 0.3);
      ctx.fill();
    }
  },

  /* ── 11. Hexagon ────────────────────────────────────────── */
  {
    id: 'ei-hexagon', name: 'Hexagon',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.47;
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

  /* ── 12. Triangle ───────────────────────────────────────── */
  {
    id: 'ei-triangle', name: 'Triangle',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx,            cy - h);
      ctx.lineTo(cx + h * 1.10, cy + h * 0.70);
      ctx.lineTo(cx - h * 1.10, cy + h * 0.70);
      ctx.closePath();
      ctx.fill();
    }
  },

  /* ── 13. Ring (donut) ───────────────────────────────────── */
  {
    id: 'ei-ring', name: 'Ring',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, s * 0.46, 0, Math.PI * 2);
      ctx.arc(cx, cy, s * 0.20, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    }
  },

  /* ── 14. Pill / Soft Diamond ────────────────────────────── */
  {
    id: 'ei-pill', name: 'Pill',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      _eiRR(ctx, x + s * 0.06, y + s * 0.06, s * 0.88, s * 0.88, s * 0.44);
      ctx.fill();
    }
  },

];
