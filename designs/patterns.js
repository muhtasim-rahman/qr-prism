// =========================================================
// patterns.js — QR Dot Pattern Library
// QR Prism v2.4
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
      const r = size * 0.3;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, r);
      ctx.fill();
    }
  },
  {
    id: 'pat-circle',
    name: 'Circle',
    draw(ctx, x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size * 0.42, 0, Math.PI * 2);
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
      const cx = x + size / 2, cy = y + size / 2, h = size * 0.45;
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
      const outer = size * 0.42, inner = size * 0.2;
      const spikes = 5;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? outer : inner;
        const angle = (Math.PI / spikes) * i - Math.PI / 2;
        i === 0 ? ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r)
                : ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-cross',
    name: 'Cross',
    draw(ctx, x, y, size, color) {
      const t = size * 0.28, p = size * 0.12;
      ctx.fillStyle = color;
      ctx.fillRect(x + p, y + (size - t) / 2, size - p * 2, t);
      ctx.fillRect(x + (size - t) / 2, y + p, t, size - p * 2);
    }
  },
  {
    id: 'pat-triangle',
    name: 'Triangle',
    draw(ctx, x, y, size, color) {
      const pad = size * 0.1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y + pad);
      ctx.lineTo(x + size - pad, y + size - pad);
      ctx.lineTo(x + pad, y + size - pad);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-hexagon',
    name: 'Hexagon',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2, r = size * 0.42;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
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
      const pad = size * 0.05;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + pad, y + size - pad);
      ctx.quadraticCurveTo(x + pad, y + pad, x + size - pad, y + pad);
      ctx.quadraticCurveTo(x + size - pad, y + size - pad, x + pad, y + size - pad);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-squircle',
    name: 'Squircle',
    draw(ctx, x, y, size, color) {
      const r = size * 0.45;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.05, y + size * 0.05, size * 0.9, size * 0.9, r * 0.55);
      ctx.fill();
    }
  },
  {
    id: 'pat-vertical',
    name: 'Vertical Bar',
    draw(ctx, x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.25, y + size * 0.05, size * 0.5, size * 0.9, size * 0.15);
      ctx.fill();
    }
  },
  {
    id: 'pat-horizontal',
    name: 'Horizontal Bar',
    draw(ctx, x, y, size, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + size * 0.05, y + size * 0.25, size * 0.9, size * 0.5, size * 0.15);
      ctx.fill();
    }
  },
  {
    id: 'pat-plus',
    name: 'Plus Round',
    draw(ctx, x, y, size, color) {
      const t = size * 0.35, p = size * 0.1, r = size * 0.12;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + p, y + (size - t) / 2, size - p * 2, t, r);
      ctx.fill();
      ctx.beginPath();
      ctx.roundRect(x + (size - t) / 2, y + p, t, size - p * 2, r);
      ctx.fill();
    }
  },
  {
    id: 'pat-ring',
    name: 'Ring',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      const outer = size * 0.42, inner = size * 0.2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, outer, 0, Math.PI * 2);
      ctx.arc(cx, cy, inner, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'pat-arrow',
    name: 'Arrow',
    draw(ctx, x, y, size, color) {
      const cx = x + size / 2, cy = y + size / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx - size * 0.35, cy - size * 0.15);
      ctx.lineTo(cx + size * 0.05, cy - size * 0.15);
      ctx.lineTo(cx + size * 0.05, cy - size * 0.35);
      ctx.lineTo(cx + size * 0.4, cy);
      ctx.lineTo(cx + size * 0.05, cy + size * 0.35);
      ctx.lineTo(cx + size * 0.05, cy + size * 0.15);
      ctx.lineTo(cx - size * 0.35, cy + size * 0.15);
      ctx.closePath();
      ctx.fill();
    }
  }
];
