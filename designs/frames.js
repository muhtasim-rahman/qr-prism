// =========================================================
// designs/frames.js — QR Border Frames (outer decorative frames)
// Each frame has: id, label, group, hasText, draw(ctx, qrX, qrY, qrSize, opts)
// opts: { color, label, font, textSize, labelColor }
// =========================================================

const FRAMES = [

  // ── No Label ──────────────────────────────────────────

  {
    id: 'frm-none',
    label: 'None',
    group: 'No Frame',
    hasText: false,
    padding: 0,
    draw(ctx, qx, qy, qs, opts) { /* no frame */ }
  },

  {
    id: 'frm-simple-border',
    label: 'Simple Border',
    group: 'No Label',
    hasText: false,
    padding: 18,
    draw(ctx, qx, qy, qs, opts) {
      const p = 9;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 4;
      ctx.strokeRect(qx - p, qy - p, qs + p * 2, qs + p * 2);
    }
  },

  {
    id: 'frm-rounded-border',
    label: 'Rounded Border',
    group: 'No Label',
    hasText: false,
    padding: 20,
    draw(ctx, qx, qy, qs, opts) {
      const p = 10;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      rrect(ctx, qx - p, qy - p, qs + p * 2, qs + p * 2, 18);
      ctx.stroke();
    }
  },

  {
    id: 'frm-double-border',
    label: 'Double Border',
    group: 'No Label',
    hasText: false,
    padding: 26,
    draw(ctx, qx, qy, qs, opts) {
      ctx.strokeStyle = opts.color;
      [8, 16].forEach(p => {
        ctx.lineWidth = 2.5;
        ctx.strokeRect(qx - p, qy - p, qs + p * 2, qs + p * 2);
      });
    }
  },

  {
    id: 'frm-corner-marks',
    label: 'Corner Marks',
    group: 'No Label',
    hasText: false,
    padding: 24,
    draw(ctx, qx, qy, qs, opts) {
      const p = 12, arm = 28;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'square';
      const corners = [
        [qx - p, qy - p + arm, qx - p, qy - p, qx - p + arm, qy - p],
        [qx + qs + p - arm, qy - p, qx + qs + p, qy - p, qx + qs + p, qy - p + arm],
        [qx - p, qy + qs + p - arm, qx - p, qy + qs + p, qx - p + arm, qy + qs + p],
        [qx + qs + p - arm, qy + qs + p, qx + qs + p, qy + qs + p, qx + qs + p, qy + qs + p - arm],
      ];
      corners.forEach(([x1, y1, x2, y2, x3, y3]) => {
        ctx.beginPath();
        ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3);
        ctx.stroke();
      });
    }
  },

  {
    id: 'frm-shadow-box',
    label: 'Shadow Box',
    group: 'No Label',
    hasText: false,
    padding: 22,
    draw(ctx, qx, qy, qs, opts) {
      const p = 11;
      ctx.shadowColor = opts.color + '55';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(qx - p, qy - p, qs + p * 2, qs + p * 2);
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
  },

  // ── With Label ────────────────────────────────────────

  {
    id: 'frm-banner-bottom',
    label: 'Banner Bottom',
    group: 'With Label',
    hasText: true,
    padding: 16,
    bannerH: 52,
    draw(ctx, qx, qy, qs, opts) {
      const p = 8, bh = 52;
      const fx = qx - p, fy = qy - p;
      const fw = qs + p * 2, fh = qs + p * 2 + bh;
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      rrect(ctx, fx, fy, fw, fh, 14);
      ctx.fill();
      // clear QR area
      ctx.clearRect(qx, qy, qs, qs);
      // text
      const fs = Math.round(22 * (opts.textSize / 100));
      ctx.font = `600 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', fx + fw / 2, fy + fh - bh / 2);
    }
  },

  {
    id: 'frm-banner-top',
    label: 'Banner Top',
    group: 'With Label',
    hasText: true,
    padding: 16,
    bannerH: 52,
    topBanner: true,
    draw(ctx, qx, qy, qs, opts) {
      const p = 8, bh = 52;
      const fx = qx - p, fy = qy - p - bh;
      const fw = qs + p * 2, fh = qs + p * 2 + bh;
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      rrect(ctx, fx, fy, fw, fh, 14);
      ctx.fill();
      ctx.clearRect(qx, qy, qs, qs);
      const fs = Math.round(22 * (opts.textSize / 100));
      ctx.font = `600 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', fx + fw / 2, fy + bh / 2);
    }
  },

  {
    id: 'frm-badge',
    label: 'Badge',
    group: 'With Label',
    hasText: true,
    padding: 20,
    draw(ctx, qx, qy, qs, opts) {
      const p = 10, bh = 48;
      const fw = qs + p * 2, cx = qx - p, cy = qy - p;
      // outer badge
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 4;
      ctx.beginPath();
      rrect(ctx, cx, cy, fw, qs + p * 2 + bh + 8, 16);
      ctx.stroke();
      // bottom pill
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      rrect(ctx, cx + 10, qy + qs + p - 2, fw - 20, bh, bh / 2);
      ctx.fill();
      const fs = Math.round(20 * (opts.textSize / 100));
      ctx.font = `700 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', cx + fw / 2, qy + qs + p + bh / 2 + 2);
    }
  },

  {
    id: 'frm-ribbon',
    label: 'Ribbon',
    group: 'With Label',
    hasText: true,
    padding: 20,
    draw(ctx, qx, qy, qs, opts) {
      const p = 10, rh = 46;
      const cx = qx - p, cy = qy - p, fw = qs + p * 2;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, cy, fw, qs + p * 2);
      // ribbon
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      ctx.moveTo(cx, qy + qs + p - rh);
      ctx.lineTo(cx + fw, qy + qs + p - rh);
      ctx.lineTo(cx + fw, qy + qs + p + 6);
      ctx.lineTo(cx + fw / 2 + 10, qy + qs + p + 6);
      ctx.lineTo(cx + fw / 2, qy + qs + p + 20);
      ctx.lineTo(cx + fw / 2 - 10, qy + qs + p + 6);
      ctx.lineTo(cx, qy + qs + p + 6);
      ctx.closePath();
      ctx.fill();
      const fs = Math.round(18 * (opts.textSize / 100));
      ctx.font = `600 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', cx + fw / 2, qy + qs + p - rh / 2 + 4);
    }
  },

  {
    id: 'frm-fancy-border-label',
    label: 'Fancy + Label',
    group: 'With Label',
    hasText: true,
    padding: 24,
    draw(ctx, qx, qy, qs, opts) {
      const p = 12, bh = 54;
      const cx = qx - p, cy = qy - p;
      const fw = qs + p * 2, fh = qs + p * 2 + bh;
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      rrect(ctx, cx, cy, fw, fh, 20);
      ctx.fill();
      ctx.clearRect(qx, qy, qs, qs);
      // decorative dots top corners
      ['#fff2', '#fff4'].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(cx + 20, cy + 20, 10 - i * 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + fw - 20, cy + 20, 10 - i * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      const fs = Math.round(22 * (opts.textSize / 100));
      ctx.font = `700 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', cx + fw / 2, cy + fh - bh / 2);
    }
  },

  {
    id: 'frm-pill-label',
    label: 'Pill Label',
    group: 'With Label',
    hasText: true,
    padding: 18,
    draw(ctx, qx, qy, qs, opts) {
      const p = 9, bh = 44;
      const cx = qx - p, cy = qy - p;
      const fw = qs + p * 2;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, cy, fw, qs + p * 2);
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      rrect(ctx, cx + fw * 0.1, qy + qs + p + 6, fw * 0.8, bh, bh / 2);
      ctx.fill();
      const fs = Math.round(18 * (opts.textSize / 100));
      ctx.font = `600 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', cx + fw / 2, qy + qs + p + 6 + bh / 2);
    }
  },

  {
    id: 'frm-arrow-label',
    label: 'Arrow Label',
    group: 'With Label',
    hasText: true,
    padding: 18,
    draw(ctx, qx, qy, qs, opts) {
      const p = 9, bh = 46;
      const cx = qx - p;
      const fw = qs + p * 2;
      ctx.strokeStyle = opts.color;
      ctx.lineWidth = 3;
      ctx.strokeRect(cx, qy - p, fw, qs + p * 2);
      // arrow shape
      ctx.fillStyle = opts.color;
      ctx.beginPath();
      ctx.moveTo(cx, qy + qs + p + 2);
      ctx.lineTo(cx + fw - 24, qy + qs + p + 2);
      ctx.lineTo(cx + fw, qy + qs + p + bh / 2 + 2);
      ctx.lineTo(cx + fw - 24, qy + qs + p + bh + 2);
      ctx.lineTo(cx, qy + qs + p + bh + 2);
      ctx.closePath();
      ctx.fill();
      const fs = Math.round(18 * (opts.textSize / 100));
      ctx.font = `600 ${fs}px '${opts.font}', sans-serif`;
      ctx.fillStyle = opts.labelColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(opts.label || 'Scan Me', cx + (fw - 12) / 2, qy + qs + p + bh / 2 + 4);
    }
  },

];

function getFrame(id) {
  return FRAMES.find(f => f.id === id) || FRAMES[0];
}
