// =========================================================
// designs/patterns.js — QR Dot / Module Patterns
// Each pattern has a unique ID and a draw(ctx, x, y, size, color) function
// =========================================================

const PATTERNS = [

  // ── Basic ─────────────────────────────────────────────

  {
    id: 'pat-square',
    label: 'Square',
    group: 'Basic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }
  },

  {
    id: 'pat-rounded',
    label: 'Rounded',
    group: 'Basic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const r = s * 0.35;
      ctx.beginPath();
      rrect(ctx, x + 0.5, y + 0.5, s - 1, s - 1, r);
      ctx.fill();
    }
  },

  {
    id: 'pat-circle',
    label: 'Circle',
    group: 'Basic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.42, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  {
    id: 'pat-dot-sm',
    label: 'Small Dot',
    group: 'Basic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.30, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // ── Geometric ─────────────────────────────────────────

  {
    id: 'pat-diamond',
    label: 'Diamond',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      drawDiamond(ctx, x + s / 2, y + s / 2, s * 0.46);
      ctx.fill();
    }
  },

  {
    id: 'pat-star',
    label: 'Star',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      drawStar(ctx, x + s / 2, y + s / 2, 5, s * 0.44, s * 0.20);
      ctx.fill();
    }
  },

  {
    id: 'pat-hexagon',
    label: 'Hexagon',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.44;
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

  {
    id: 'pat-triangle',
    label: 'Triangle',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const cx = x + s / 2, r = s * 0.46;
      ctx.beginPath();
      ctx.moveTo(cx, y + s * 0.10);
      ctx.lineTo(x + s * 0.92, y + s * 0.88);
      ctx.lineTo(x + s * 0.08, y + s * 0.88);
      ctx.closePath();
      ctx.fill();
    }
  },

  {
    id: 'pat-cross',
    label: 'Cross',
    group: 'Geometric',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const t = s * 0.28, m = s * 0.36;
      ctx.beginPath();
      ctx.rect(x + m, y + t * 0.5, t, s - t);
      ctx.rect(x + t * 0.5, y + m, s - t, t);
      ctx.fill();
    }
  },

  // ── Modern ────────────────────────────────────────────

  {
    id: 'pat-squircle',
    label: 'Squircle',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const r = s * 0.48;
      ctx.beginPath();
      rrect(ctx, x + 0.5, y + 0.5, s - 1, s - 1, r * 0.6);
      ctx.fill();
    }
  },

  {
    id: 'pat-leaf',
    label: 'Leaf',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const p = s * 0.1;
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

  {
    id: 'pat-sharp-corner',
    label: 'Sharp Corner',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const c = s * 0.3;
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
    id: 'pat-pill',
    label: 'Pill',
    group: 'Modern',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      rrect(ctx, x + s * 0.05, y + s * 0.15, s * 0.9, s * 0.7, s * 0.35);
      ctx.fill();
    }
  },

  // ── Artistic ──────────────────────────────────────────

  {
    id: 'pat-ring',
    label: 'Ring',
    group: 'Artistic',
    draw(ctx, x, y, s, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = s * 0.22;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.28, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  {
    id: 'pat-plus',
    label: 'Plus',
    group: 'Artistic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const t = s * 0.32;
      ctx.fillRect(x + (s - t) / 2, y + s * 0.08, t, s * 0.84);
      ctx.fillRect(x + s * 0.08, y + (s - t) / 2, s * 0.84, t);
    }
  },

  {
    id: 'pat-heart',
    label: 'Heart',
    group: 'Artistic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      const cx = x + s / 2, cy = y + s * 0.55, r = s * 0.24;
      ctx.beginPath();
      ctx.arc(cx - r, cy - r * 0.5, r, Math.PI, 0);
      ctx.arc(cx + r, cy - r * 0.5, r, Math.PI, 0);
      ctx.lineTo(cx, cy + r * 1.6);
      ctx.closePath();
      ctx.fill();
    }
  },

  {
    id: 'pat-wave-dot',
    label: 'Wave Dot',
    group: 'Artistic',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s * 0.3, y + s * 0.35, s * 0.27, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + s * 0.7, y + s * 0.65, s * 0.20, 0, Math.PI * 2);
      ctx.fill();
    }
  },

];

// Helper: get pattern by ID
function getPattern(id) {
  return PATTERNS.find(p => p.id === id) || PATTERNS[0];
}
