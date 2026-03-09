// =========================================================
// patterns.js — QR Dot Pattern Library
// QR Prism v2.5 — Premium Patterns
// =========================================================

const PATTERNS = [
  {
    id: 'pat-square',
    name: 'Square',
    draw(ctx, x, y, size, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, size, size);
    }
  },
  {
    id: 'pat-round',
    name: 'Rounded',
    draw(ctx, x, y, size, color) {
      const r = size * 0.32;
      const g = size * 0.04; // gap for seamless join
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + g, y + g, size - g*2, size - g*2, r);
      ctx.fill();
    }
  },
  {
    id: 'pat-circle',
    name: 'Circle',
    draw(ctx, x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.44, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    id: 'pat-dot',
    name: 'Dot',
    draw(ctx, x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    id: 'pat-diamond',
    name: 'Diamond',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      const h = size * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - h);
      ctx.lineTo(cx + h, cy);
      ctx.lineTo(cx, cy + h);
      ctx.lineTo(cx - h, cy);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-star',
    name: 'Star',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      const or = size * 0.44, ir = size * 0.19;
      const spikes = 5;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? or : ir;
        const angle = (i * Math.PI / spikes) - Math.PI / 2;
        i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-hexagon',
    name: 'Hexagon',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      const r = size * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI / 3) - Math.PI / 6;
        i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-leaf',
    name: 'Leaf',
    draw(ctx, x, y, size, color) {
      const g = size * 0.06;
      const s = size - g * 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + g, y + g + s * 0.5);
      ctx.quadraticCurveTo(x + g, y + g, x + g + s * 0.5, y + g);
      ctx.quadraticCurveTo(x + g + s, y + g, x + g + s, y + g + s * 0.5);
      ctx.quadraticCurveTo(x + g + s, y + g + s, x + g + s * 0.5, y + g + s);
      ctx.quadraticCurveTo(x + g, y + g + s, x + g, y + g + s * 0.5);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-squircle',
    name: 'Squircle',
    draw(ctx, x, y, size, color) {
      const r = size * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9, size * 0.24);
      ctx.fill();
    }
  },
  {
    id: 'pat-cross',
    name: 'Plus',
    draw(ctx, x, y, size, color) {
      const t = size * 0.3;
      const o = (size - t) / 2;
      ctx.fillStyle = color;
      ctx.fillRect(x + o, y, t, size);
      ctx.fillRect(x, y + o, size, t);
    }
  },
  {
    id: 'pat-ring',
    name: 'Ring',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.44, 0, Math.PI * 2);
      ctx.arc(cx, cy, size * 0.22, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'pat-bar-h',
    name: 'Bar H',
    draw(ctx, x, y, size, color) {
      const h = size * 0.38;
      const oy = (size - h) / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.04, y + oy, size * 0.92, h, h * 0.45);
      ctx.fill();
    }
  },
  {
    id: 'pat-bar-v',
    name: 'Bar V',
    draw(ctx, x, y, size, color) {
      const w = size * 0.38;
      const ox = (size - w) / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + ox, y + size * 0.04, w, size * 0.92, w * 0.45);
      ctx.fill();
    }
  },
  {
    id: 'pat-triangle',
    name: 'Triangle',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2;
      const m = size * 0.08;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, y + m);
      ctx.lineTo(x + size - m, y + size - m);
      ctx.lineTo(x + m, y + size - m);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-rounded-cross',
    name: 'Rounded+',
    draw(ctx, x, y, size, color) {
      const t = size * 0.3;
      const o = (size - t) / 2;
      const r = t / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + o, y + size * 0.04, t, size * 0.92, r);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + size * 0.04, y + o, size * 0.92, t, r);
      ctx.fill();
    }
  },
  {
    id: 'pat-octagon',
    name: 'Octagon',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      const r = size * 0.44;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI / 4) - Math.PI / 8;
        i === 0 ? ctx.moveTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle))
                : ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-kite',
    name: 'Kite',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, y + size * 0.08);
      ctx.lineTo(x + size * 0.88, cy + size * 0.1);
      ctx.lineTo(cx, y + size * 0.92);
      ctx.lineTo(x + size * 0.18, cy);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-shield',
    name: 'Shield',
    draw(ctx, x, y, size, color) {
      const g = size * 0.08;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + g, y + g);
      ctx.lineTo(x + size - g, y + g);
      ctx.lineTo(x + size - g, y + size * 0.55);
      ctx.quadraticCurveTo(x + size - g, y + size - g, x + size / 2, y + size - g);
      ctx.quadraticCurveTo(x + g, y + size - g, x + g, y + size * 0.55);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-arrow',
    name: 'Arrow',
    draw(ctx, x, y, size, color) {
      const m = size * 0.1;
      const mid = size * 0.45;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + m, y + mid);
      ctx.lineTo(x + size * 0.55, y + m);
      ctx.lineTo(x + size * 0.55, y + size * 0.28);
      ctx.lineTo(x + size - m, y + size / 2);
      ctx.lineTo(x + size * 0.55, y + size - size * 0.28);
      ctx.lineTo(x + size * 0.55, y + size - m);
      ctx.lineTo(x + m, y + size - mid);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-flower',
    name: 'Flower',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      const r1 = size * 0.25, r2 = size * 0.14;
      ctx.fillStyle = color;
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2;
        ctx.beginPath();
        ctx.arc(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a), r2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(cx, cy, r2 * 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
];
