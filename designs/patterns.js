// =========================================================
// PATTERNS.JS — QR Prism v2.7
// 20 Premium QR Dot Patterns
// Each: { id, name, draw(ctx, x, y, size, color) }
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const PATTERNS = [
  {
    id: 'pat-square',
    name: 'Square',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }
  },
  {
    id: 'pat-round',
    name: 'Rounded',
    draw(ctx, x, y, s, color) {
      const r = s * 0.35;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + 0.5, y + 0.5, s - 1, s - 1, r);
      ctx.fill();
    }
  },
  {
    id: 'pat-circle',
    name: 'Circle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.45, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    id: 'pat-dot',
    name: 'Dot',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s / 2, y + s / 2, s * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  {
    id: 'pat-diamond',
    name: 'Diamond',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.48;
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
    id: 'pat-squircle',
    name: 'Squircle',
    draw(ctx, x, y, s, color) {
      const r = s * 0.48;
      const cx = x + s / 2, cy = y + s / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + 1, y + 1, s - 2, s - 2, r * 0.55);
      ctx.fill();
    }
  },
  {
    id: 'pat-hexagon',
    name: 'Hexagon',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.46;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-star',
    name: 'Star',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const ro = s * 0.46, ri = s * 0.22;
      const spikes = 5;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const r = i % 2 === 0 ? ro : ri;
        const a = (i * Math.PI) / spikes - Math.PI / 2;
        if (i === 0) ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        else ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-cross',
    name: 'Cross',
    draw(ctx, x, y, s, color) {
      const t = s * 0.28;
      const c = s * 0.36;
      ctx.fillStyle = color;
      ctx.fillRect(x + c, y, t, s);
      ctx.fillRect(x, y + c, s, t);
    }
  },
  {
    id: 'pat-leaf',
    name: 'Leaf',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, y + 1);
      ctx.quadraticCurveTo(x + s - 1, y + 1, x + s - 1, cy);
      ctx.quadraticCurveTo(x + s - 1, y + s - 1, cx, y + s - 1);
      ctx.quadraticCurveTo(x + 1, y + s - 1, x + 1, cy);
      ctx.quadraticCurveTo(x + 1, y + 1, cx, y + 1);
      ctx.fill();
    }
  },
  {
    id: 'pat-bars-h',
    name: 'H. Bars',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x + 1, y + s * 0.1, s - 2, s * 0.32);
      ctx.fillRect(x + 1, y + s * 0.58, s - 2, s * 0.32);
    }
  },
  {
    id: 'pat-bars-v',
    name: 'V. Bars',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x + s * 0.1, y + 1, s * 0.32, s - 2);
      ctx.fillRect(x + s * 0.58, y + 1, s * 0.32, s - 2);
    }
  },
  {
    id: 'pat-ring',
    name: 'Ring',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      const ro = s * 0.44, ri = s * 0.22;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, ro, 0, Math.PI * 2);
      ctx.arc(cx, cy, ri, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'pat-sharp',
    name: 'Sharp',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
      // Cut corners
      const cut = s * 0.3;
      ctx.clearRect(x, y, cut, cut);
      ctx.clearRect(x + s - cut, y, cut, cut);
      ctx.clearRect(x, y + s - cut, cut, cut);
      ctx.clearRect(x + s - cut, y + s - cut, cut, cut);
    }
  },
  {
    id: 'pat-crystal',
    name: 'Crystal',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, h = s * 0.44;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - h);
      ctx.lineTo(cx + h * 0.65, cy);
      ctx.lineTo(cx + h * 0.4, cy + h);
      ctx.lineTo(cx - h * 0.4, cy + h);
      ctx.lineTo(cx - h * 0.65, cy);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-arrow',
    name: 'Arrow',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + s * 0.8, cy);
      ctx.lineTo(cx, y + s * 0.15);
      ctx.lineTo(cx, y + s * 0.4);
      ctx.lineTo(x + s * 0.2, y + s * 0.4);
      ctx.lineTo(x + s * 0.2, y + s * 0.6);
      ctx.lineTo(cx, y + s * 0.6);
      ctx.lineTo(cx, y + s * 0.85);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-heart',
    name: 'Heart',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, t = y + s * 0.2;
      const bx = s * 0.25;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, y + s * 0.85);
      ctx.bezierCurveTo(x + s * 0.08, y + s * 0.65, x, y + s * 0.45, cx - bx, t);
      ctx.arc(cx - bx * 0.5, t, bx * 0.5, Math.PI, 0);
      ctx.arc(cx + bx * 0.5, t, bx * 0.5, Math.PI, 0);
      ctx.bezierCurveTo(x + s, y + s * 0.45, x + s * 0.92, y + s * 0.65, cx, y + s * 0.85);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-clover',
    name: 'Clover',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2, cy = y + s / 2, r = s * 0.26;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx,     cy - r, r, 0, Math.PI * 2);
      ctx.arc(cx + r, cy,     r, 0, Math.PI * 2);
      ctx.arc(cx,     cy + r, r, 0, Math.PI * 2);
      ctx.arc(cx - r, cy,     r, 0, Math.PI * 2);
      ctx.fill();
      // Center square
      ctx.fillRect(cx - r * 0.7, cy - r * 0.7, r * 1.4, r * 1.4);
    }
  },
  {
    id: 'pat-triangle',
    name: 'Triangle',
    draw(ctx, x, y, s, color) {
      const cx = x + s / 2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, y + 1);
      ctx.lineTo(x + s - 1, y + s - 1);
      ctx.lineTo(x + 1, y + s - 1);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'pat-plus-r',
    name: 'Plus Round',
    draw(ctx, x, y, s, color) {
      const r = s * 0.25;
      const t = s * 0.3;
      ctx.fillStyle = color;
      // Horizontal bar
      ctx.beginPath();
      ctx.roundRect(x + 1, y + t, s - 2, s - t * 2, r * 0.6);
      ctx.fill();
      // Vertical bar
      ctx.beginPath();
      ctx.roundRect(x + t, y + 1, s - t * 2, s - 2, r * 0.6);
      ctx.fill();
    }
  },
];
