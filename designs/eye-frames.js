// =========================================================
// EYE-FRAMES.JS — QR Prism v2.7
// 12 Eye Frame Designs
// CRITICAL: NEVER fill inner area with color (bgColor step
//           in qr-engine.js handles that separately)
// Each: { id, name, draw(ctx, x, y, size7, color) }
// =========================================================

const EYE_FRAMES = [
  {
    id: 'ef-square',
    name: 'Square',
    draw(ctx, x, y, s, color) {
      const t = s / 7; // border thickness ≈ 1 module
      ctx.fillStyle = color;
      // Top
      ctx.fillRect(x, y, s, t);
      // Bottom
      ctx.fillRect(x, y + s - t, s, t);
      // Left
      ctx.fillRect(x, y + t, t, s - t * 2);
      // Right
      ctx.fillRect(x + s - t, y + t, t, s - t * 2);
    }
  },
  {
    id: 'ef-round',
    name: 'Rounded',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const r = s * 0.22;
      ctx.fillStyle = color;
      // Outer rounded rect
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
      // Inner cutout
      ctx.roundRect(x + t, y + t, s - t * 2, s - t * 2, r * 0.55);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-circle',
    name: 'Circle',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const cx = x + s / 2, cy = y + s / 2;
      const ro = s / 2 - 1;
      const ri = s / 2 - t - 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, ro, 0, Math.PI * 2);
      ctx.arc(cx, cy, ri, 0, Math.PI * 2, true);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-thick',
    name: 'Thick',
    draw(ctx, x, y, s, color) {
      const t = s / 5; // thicker border
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, t);
      ctx.fillRect(x, y + s - t, s, t);
      ctx.fillRect(x, y + t, t, s - t * 2);
      ctx.fillRect(x + s - t, y + t, t, s - t * 2);
    }
  },
  {
    id: 'ef-double',
    name: 'Double',
    draw(ctx, x, y, s, color) {
      const t1 = s / 14; // thin outer
      const t2 = s / 14; // thin inner
      const gap = s / 14;
      ctx.fillStyle = color;
      // Outer ring
      const drawRing = (ox, oy, os, th) => {
        ctx.fillRect(ox, oy, os, th);
        ctx.fillRect(ox, oy + os - th, os, th);
        ctx.fillRect(ox, oy + th, th, os - th * 2);
        ctx.fillRect(ox + os - th, oy + th, th, os - th * 2);
      };
      drawRing(x, y, s, t1);
      drawRing(x + t1 + gap, y + t1 + gap, s - (t1 + gap) * 2, t2);
    }
  },
  {
    id: 'ef-cut-corner',
    name: 'Cut Corner',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const cut = s * 0.22;
      ctx.fillStyle = color;
      ctx.beginPath();
      // Outer polygon with cut corners
      ctx.moveTo(x + cut, y);
      ctx.lineTo(x + s - cut, y);
      ctx.lineTo(x + s, y + cut);
      ctx.lineTo(x + s, y + s - cut);
      ctx.lineTo(x + s - cut, y + s);
      ctx.lineTo(x + cut, y + s);
      ctx.lineTo(x, y + s - cut);
      ctx.lineTo(x, y + cut);
      ctx.closePath();
      // Inner cutout
      const ix = x + t, iy = y + t, is = s - t * 2, icut = cut * 0.7;
      ctx.moveTo(ix + icut, iy);
      ctx.lineTo(ix + is - icut, iy);
      ctx.lineTo(ix + is, iy + icut);
      ctx.lineTo(ix + is, iy + is - icut);
      ctx.lineTo(ix + is - icut, iy + is);
      ctx.lineTo(ix + icut, iy + is);
      ctx.lineTo(ix, iy + is - icut);
      ctx.lineTo(ix, iy + icut);
      ctx.closePath();
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-leaf',
    name: 'Leaf',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const r = s * 0.4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + s / 2, y);
      ctx.quadraticCurveTo(x + s, y, x + s, y + s / 2);
      ctx.quadraticCurveTo(x + s, y + s, x + s / 2, y + s);
      ctx.quadraticCurveTo(x, y + s, x, y + s / 2);
      ctx.quadraticCurveTo(x, y, x + s / 2, y);
      // Inner cutout
      ctx.moveTo(x + s / 2, y + t);
      ctx.quadraticCurveTo(x + s - t, y + t, x + s - t, y + s / 2);
      ctx.quadraticCurveTo(x + s - t, y + s - t, x + s / 2, y + s - t);
      ctx.quadraticCurveTo(x + t, y + s - t, x + t, y + s / 2);
      ctx.quadraticCurveTo(x + t, y + t, x + s / 2, y + t);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-bracket',
    name: 'Bracket',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const arm = s * 0.38; // arm length
      ctx.fillStyle = color;
      // 4 L-shaped corners
      const corners = [
        [x, y], [x + s - arm, y], [x, y + s - arm], [x + s - arm, y + s - arm]
      ];
      const dirs = [
        [1, 1], [-1, 1], [1, -1], [-1, -1]
      ];
      corners.forEach(([cx, cy], i) => {
        const [dx, dy] = dirs[i];
        ctx.fillRect(cx, cy, arm * dx || t, t * dy || arm);
        // Fix signs
      });
      // Simpler approach: 4 L shapes
      ctx.clearRect(0, 0, 0, 0); // reset
      ctx.fillStyle = color;
      // Top-left
      ctx.fillRect(x, y, arm, t);
      ctx.fillRect(x, y, t, arm);
      // Top-right
      ctx.fillRect(x + s - arm, y, arm, t);
      ctx.fillRect(x + s - t, y, t, arm);
      // Bottom-left
      ctx.fillRect(x, y + s - t, arm, t);
      ctx.fillRect(x, y + s - arm, t, arm);
      // Bottom-right
      ctx.fillRect(x + s - arm, y + s - t, arm, t);
      ctx.fillRect(x + s - t, y + s - arm, t, arm);
    }
  },
  {
    id: 'ef-sharp-in',
    name: 'Sharp In',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const cut = s * 0.18;
      ctx.fillStyle = color;
      // Star-like outer with inward points at corners
      ctx.beginPath();
      ctx.moveTo(x + s / 2, y);
      ctx.lineTo(x + s - cut, y + cut);
      ctx.lineTo(x + s, y + s / 2);
      ctx.lineTo(x + s - cut, y + s - cut);
      ctx.lineTo(x + s / 2, y + s);
      ctx.lineTo(x + cut, y + s - cut);
      ctx.lineTo(x, y + s / 2);
      ctx.lineTo(x + cut, y + cut);
      ctx.closePath();
      // Inner
      const ix = x + t, iy = y + t, is = s - t * 2, icut = cut * 0.6;
      ctx.moveTo(ix + is / 2, iy);
      ctx.lineTo(ix + is - icut, iy + icut);
      ctx.lineTo(ix + is, iy + is / 2);
      ctx.lineTo(ix + is - icut, iy + is - icut);
      ctx.lineTo(ix + is / 2, iy + is);
      ctx.lineTo(ix + icut, iy + is - icut);
      ctx.lineTo(ix, iy + is / 2);
      ctx.lineTo(ix + icut, iy + icut);
      ctx.closePath();
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-hexborder',
    name: 'Hexagon',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const cx = x + s / 2, cy = y + s / 2;
      const ro = s / 2 - 1, ri = ro - t;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + ro * Math.cos(a), cy + ro * Math.sin(a));
        else ctx.lineTo(cx + ro * Math.cos(a), cy + ro * Math.sin(a));
      }
      ctx.closePath();
      ctx.moveTo(cx + ri, cy);
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        if (i === 0) ctx.moveTo(cx + ri * Math.cos(a), cy + ri * Math.sin(a));
        else ctx.lineTo(cx + ri * Math.cos(a), cy + ri * Math.sin(a));
      }
      ctx.closePath();
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-diamond-frame',
    name: 'Diamond',
    draw(ctx, x, y, s, color) {
      const t = s / 7;
      const cx = x + s / 2, cy = y + s / 2;
      const ro = s / 2 - 1, ri = ro - t;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - ro);
      ctx.lineTo(cx + ro, cy);
      ctx.lineTo(cx, cy + ro);
      ctx.lineTo(cx - ro, cy);
      ctx.closePath();
      ctx.moveTo(cx, cy - ri);
      ctx.lineTo(cx + ri, cy);
      ctx.lineTo(cx, cy + ri);
      ctx.lineTo(cx - ri, cy);
      ctx.closePath();
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ef-round-thick',
    name: 'Round Thick',
    draw(ctx, x, y, s, color) {
      const t = s / 5;
      const r = s * 0.28;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
      ctx.roundRect(x + t, y + t, s - t * 2, s - t * 2, r * 0.45);
      ctx.fill('evenodd');
    }
  },
];
