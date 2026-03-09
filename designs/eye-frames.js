// =========================================================
// designs/eye-frames.js — QR Eye Frame (Outer Border) Designs
// draw(ctx, x, y, size, color) — x,y = top-left corner, size = 7-module block size
// =========================================================

const EYE_FRAMES = [

  // ── Square Family ─────────────────────────────────────

  {
    id: 'ef-square',
    label: 'Square',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      ctx.fillStyle = color;
      // Draw outer ring as 4 rects
      ctx.fillRect(x, y, s, bw);                         // top
      ctx.fillRect(x, y + s - bw, s, bw);                // bottom
      ctx.fillRect(x, y + bw, bw, s - bw * 2);           // left
      ctx.fillRect(x + s - bw, y + bw, bw, s - bw * 2);  // right
    }
  },

  {
    id: 'ef-rounded-outer',
    label: 'Rounded',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      ctx.strokeStyle = color;
      ctx.lineWidth = bw;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      const r = bw * 1.8;
      const inset = bw / 2;
      rrect(ctx, x + inset, y + inset, s - inset * 2, s - inset * 2, r);
      ctx.stroke();
    }
  },

  {
    id: 'ef-circle',
    label: 'Circle',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      ctx.strokeStyle = color;
      ctx.lineWidth = bw;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s / 2 - bw / 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  // ── Corner Styles ─────────────────────────────────────

  {
    id: 'ef-corner-dot',
    label: 'Corner Dot',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      const r = bw * 1.2;
      ctx.fillStyle = color;
      // 4 L-shaped corners
      const drawCorner = (cx, cy, fx, fy) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(Math.min(cx, cx + fx * bw * 2), cy - bw / 2, bw * 2.2, bw);
        ctx.fillRect(cx - bw / 2, Math.min(cy, cy + fy * bw * 2), bw, bw * 2.2);
      };
      drawCorner(x + bw / 2, y + bw / 2, 1, 1);
      drawCorner(x + s - bw / 2, y + bw / 2, -1, 1);
      drawCorner(x + bw / 2, y + s - bw / 2, 1, -1);
      drawCorner(x + s - bw / 2, y + s - bw / 2, -1, -1);
    }
  },

  {
    id: 'ef-bracket',
    label: 'Bracket',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      const arm = s * 0.35;
      ctx.strokeStyle = color;
      ctx.lineWidth = bw;
      ctx.lineCap = 'square';
      const corners = [
        [x + bw / 2, y + arm, x + bw / 2, y + bw / 2, x + arm, y + bw / 2],
        [x + s - arm, y + bw / 2, x + s - bw / 2, y + bw / 2, x + s - bw / 2, y + arm],
        [x + bw / 2, y + s - arm, x + bw / 2, y + s - bw / 2, x + arm, y + s - bw / 2],
        [x + s - arm, y + s - bw / 2, x + s - bw / 2, y + s - bw / 2, x + s - bw / 2, y + s - arm],
      ];
      corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.stroke();
      });
    }
  },

  {
    id: 'ef-diamond-frame',
    label: 'Diamond Frame',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      const cx = x + s / 2, cy = y + s / 2;
      const or = s * 0.50, ir = s * 0.36;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - or); ctx.lineTo(cx + or, cy);
      ctx.lineTo(cx, cy + or); ctx.lineTo(cx - or, cy);
      ctx.closePath();
      ctx.moveTo(cx, cy - ir); ctx.lineTo(cx + ir, cy);
      ctx.lineTo(cx, cy + ir); ctx.lineTo(cx - ir, cy);
      ctx.closePath();
      ctx.fill('evenodd');
    }
  },

  // ── Premium ────────────────────────────────────────────

  {
    id: 'ef-double-line',
    label: 'Double Line',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      const bw = s / 9;
      ctx.strokeStyle = color;
      ctx.lineWidth = bw * 0.7;
      const d = [0.5, bw * 1.6];
      d.forEach(offset => {
        ctx.beginPath();
        ctx.strokeRect(x + bw * 0.5 + offset, y + bw * 0.5 + offset,
                       s - bw - offset * 2, s - bw - offset * 2);
      });
    }
  },

  {
    id: 'ef-shield',
    label: 'Shield',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      ctx.fillStyle = color;
      const px = x + bw / 2, py = y + bw / 2, pw = s - bw, ph = s - bw;
      ctx.beginPath();
      ctx.moveTo(px + pw / 2, py);
      ctx.lineTo(px + pw, py + ph * 0.35);
      ctx.quadraticCurveTo(px + pw, py + ph * 0.75, px + pw / 2, py + ph);
      ctx.quadraticCurveTo(px, py + ph * 0.75, px, py + ph * 0.35);
      ctx.closePath();
      ctx.stroke();

      const ix = x + bw * 1.8, iy = y + bw * 1.8, iw = s - bw * 3.6, ih = s - bw * 3.6;
      ctx.beginPath();
      ctx.moveTo(ix + iw / 2, iy);
      ctx.lineTo(ix + iw, iy + ih * 0.35);
      ctx.quadraticCurveTo(ix + iw, iy + ih * 0.75, ix + iw / 2, iy + ih);
      ctx.quadraticCurveTo(ix, iy + ih * 0.75, ix, iy + ih * 0.35);
      ctx.closePath();
      // just outer stroke
      ctx.lineWidth = bw;
      ctx.stroke();
    }
  },

  {
    id: 'ef-leaf-corner',
    label: 'Leaf Corner',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      ctx.strokeStyle = color;
      ctx.lineWidth = bw;
      ctx.lineCap = 'round';
      ctx.beginPath();
      const r = s * 0.38;
      // top-right curved
      ctx.moveTo(x + bw / 2, y + bw / 2);
      ctx.lineTo(x + s - r, y + bw / 2);
      ctx.arcTo(x + s - bw / 2, y + bw / 2, x + s - bw / 2, y + r, r * 0.8);
      ctx.lineTo(x + s - bw / 2, y + s - bw / 2);
      ctx.lineTo(x + bw / 2, y + s - bw / 2);
      ctx.lineTo(x + bw / 2, y + bw / 2);
      ctx.stroke();
    }
  },

  {
    id: 'ef-sharp-round',
    label: 'Sharp Round',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      const bw = s / 7;
      ctx.strokeStyle = color;
      ctx.lineWidth = bw;
      ctx.beginPath();
      const r = s * 0.30;
      ctx.moveTo(x + bw / 2 + r, y + bw / 2);
      ctx.lineTo(x + s - bw / 2, y + bw / 2);
      ctx.lineTo(x + s - bw / 2, y + s - bw / 2 - r);
      ctx.arcTo(x + s - bw / 2, y + s - bw / 2, x + s - bw / 2 - r, y + s - bw / 2, r);
      ctx.lineTo(x + bw / 2, y + s - bw / 2);
      ctx.lineTo(x + bw / 2, y + bw / 2 + r);
      ctx.arcTo(x + bw / 2, y + bw / 2, x + bw / 2 + r, y + bw / 2, r);
      ctx.stroke();
    }
  },

];

function getEyeFrame(id) {
  return EYE_FRAMES.find(e => e.id === id) || EYE_FRAMES[0];
}
