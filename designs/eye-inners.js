// =========================================================
// EYE-INNERS.JS — QR Prism v2.7
// 12 Eye Inner (center dot) Designs
// Each: { id, name, draw(ctx, x, y, size3, color) }
// x,y = top-left of the 3×3 inner area, size3 = 3 module widths
// =========================================================

const EYE_INNERS = [
  {
    id: 'ei-square',
    name: 'Square',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, s, s);
    }
  },
  {
    id: 'ei-round',
    name: 'Rounded',
    draw(ctx, x, y, s, color) {
      const r = s * 0.22;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x, y, s, s, r);
      ctx.fill();
    }
  },
  {
    id: 'ei-circle',
    name: 'Circle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s/2, y + s/2, s * 0.5, 0, Math.PI*2);
      ctx.fill();
    }
  },
  {
    id: 'ei-dot',
    name: 'Dot',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x + s/2, y + s/2, s * 0.35, 0, Math.PI*2);
      ctx.fill();
    }
  },
  {
    id: 'ei-diamond',
    name: 'Diamond',
    draw(ctx, x, y, s, color) {
      const cx = x + s/2, cy = y + s/2, h = s * 0.5;
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
    id: 'ei-star',
    name: 'Star',
    draw(ctx, x, y, s, color) {
      const cx = x + s/2, cy = y + s/2;
      const r1 = s * 0.48, r2 = s * 0.24;
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const aOuter = (i * Math.PI/3) - Math.PI/2;
        const aInner = aOuter + Math.PI/6;
        if (i===0) ctx.moveTo(cx + r1*Math.cos(aOuter), cy + r1*Math.sin(aOuter));
        else ctx.lineTo(cx + r1*Math.cos(aOuter), cy + r1*Math.sin(aOuter));
        ctx.lineTo(cx + r2*Math.cos(aInner), cy + r2*Math.sin(aInner));
      }
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'ei-cross',
    name: 'Cross',
    draw(ctx, x, y, s, color) {
      const t = s * 0.28;
      ctx.fillStyle = color;
      // Horizontal
      ctx.fillRect(x, y + (s-t)/2, s, t);
      // Vertical
      ctx.fillRect(x + (s-t)/2, y, t, s);
    }
  },
  {
    id: 'ei-ring',
    name: 'Ring',
    draw(ctx, x, y, s, color) {
      const cx = x+s/2, cy = y+s/2;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(cx, cy, s*0.48, 0, Math.PI*2);
      ctx.arc(cx, cy, s*0.24, 0, Math.PI*2, true);
      ctx.fill('evenodd');
    }
  },
  {
    id: 'ei-squircle',
    name: 'Squircle',
    draw(ctx, x, y, s, color) {
      const r = s * 0.36;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(x + s*0.04, y + s*0.04, s*0.92, s*0.92, r);
      ctx.fill();
    }
  },
  {
    id: 'ei-leaf',
    name: 'Leaf',
    draw(ctx, x, y, s, color) {
      const cx = x+s/2, cy = y+s/2, h = s*0.48;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx, cy - h);
      ctx.quadraticCurveTo(cx + h, cy - h, cx + h, cy);
      ctx.quadraticCurveTo(cx + h, cy + h, cx, cy + h);
      ctx.quadraticCurveTo(cx - h, cy + h, cx - h, cy);
      ctx.quadraticCurveTo(cx - h, cy - h, cx, cy - h);
      ctx.closePath();
      ctx.fill();
    }
  },
  {
    id: 'ei-sharp',
    name: 'Sharp',
    draw(ctx, x, y, s, color) {
      const g = s * 0.1;
      ctx.fillStyle = color;
      ctx.fillRect(x + g, y + g, s - g*2, s - g*2);
    }
  },
  {
    id: 'ei-triangle',
    name: 'Triangle',
    draw(ctx, x, y, s, color) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x + s/2, y + s*0.05);
      ctx.lineTo(x + s*0.95, y + s*0.95);
      ctx.lineTo(x + s*0.05, y + s*0.95);
      ctx.closePath();
      ctx.fill();
    }
  },
];
