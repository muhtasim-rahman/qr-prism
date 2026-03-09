// =========================================================
// designs/eye-inners.js — QR Eye Inner (Pupil) Designs
// draw(ctx, x, y, size, color) — fills the 3x3 inner block
// =========================================================

const EYE_INNERS = [

  // ── Classic ───────────────────────────────────────────

  {
    id: 'ei-square',
    label: 'Square',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }
  },

  {
    id: 'ei-rounded',
    label: 'Rounded',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      rrect(ctx, x, y, s, s, s * 0.25);
      ctx.fill();
    }
  },

  {
    id: 'ei-circle',
    label: 'Circle',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.50, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  {
    id: 'ei-dot',
    label: 'Small Dot',
    group: 'Classic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.32, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // ── Geometric ─────────────────────────────────────────

  {
    id: 'ei-diamond',
    label: 'Diamond',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      drawDiamond(ctx, x + s / 2, y + s / 2, s * 0.48);
      ctx.fill();
    }
  },

  {
    id: 'ei-star',
    label: 'Star',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      drawStar(ctx, x + s / 2, y + s / 2, 5, s * 0.48, s * 0.22);
      ctx.fill();
    }
  },

  {
    id: 'ei-cross',
    label: 'Cross',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const t = s * 0.32;
      ctx.fillRect(x + (s - t) / 2, y + s * 0.05, t, s * 0.9);
      ctx.fillRect(x + s * 0.05, y + (s - t) / 2, s * 0.9, t);
    }
  },

  {
    id: 'ei-hexagon',
    label: 'Hexagon',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.48;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        i === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
                : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    }
  },

  // ── Modern ────────────────────────────────────────────

  {
    id: 'ei-squircle',
    label: 'Squircle',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      rrect(ctx, x + s * 0.04, y + s * 0.04, s * 0.92, s * 0.92, s * 0.28);
      ctx.fill();
    }
  },

  {
    id: 'ei-sharp-corner',
    label: 'Sharp Corner',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const c = s * 0.28;
      ctx.beginPath();
      ctx.moveTo(x + c, y);
      ctx.lineTo(x + s, y);
      ctx.lineTo(x + s, y + s - c);
      ctx.lineTo(x + s - c, y + s);
      ctx.lineTo(x, y + s);
      ctx.lineTo(x, y + c);
      ctx.closePath();
      ctx.fill();
    }
  },

  {
    id: 'ei-leaf',
    label: 'Leaf',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const p = s * 0.05;
      ctx.beginPath();
      ctx.moveTo(x + p, y + s / 2);
      ctx.quadraticCurveTo(x + p, y + p, x + s / 2, y + p);
      ctx.quadraticCurveTo(x + s - p, y + p, x + s - p, y + s / 2);
      ctx.quadraticCurveTo(x + s - p, y + s - p, x + s / 2, y + s - p);
      ctx.quadraticCurveTo(x + p, y + s - p, x + p, y + s / 2);
      ctx.closePath();
      ctx.fill();
    }
  },

  // ── Premium ───────────────────────────────────────────

  {
    id: 'ei-ring',
    label: 'Ring',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = s * 0.22;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.30, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  {
    id: 'ei-double-circle',
    label: 'Double Circle',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.48, 0, Math.PI * 2);
      ctx.arc(x + s / 2, y + s / 2, s * 0.28, 0, Math.PI * 2);
      ctx.fill('evenodd');
    }
  },

  {
    id: 'ei-target',
    label: 'Target',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.48, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.26, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  {
    id: 'ei-flower',
    label: 'Flower',
    group: 'Premium',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.22;
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }
  },

];

function getEyeInner(id) {
  return EYE_INNERS.find(e => e.id === id) || EYE_INNERS[0];
}
