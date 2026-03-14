// =========================================================
// FRAMES.JS — QR Prism v2.7
// 10 QR Outer Frame Designs
// draw(ctx, canvasSize, label, font, tSize, labelColor, frameColor)
// hasText: true = appears in "With Label" tab
//          false = appears in "Without Label" tab
// =========================================================

const FRAMES = [
  {
    id: 'frm-none',
    name: 'None',
    hasText: false,
    draw() {} // No frame
  },

  {
    id: 'frm-bottom-bar',
    name: 'Bottom Bar',
    hasText: true,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const barH = Math.round(size * 0.12);
      const y = size;
      // Extend canvas conceptually (in qr-engine, canvas is already sized)
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, size - barH, size, barH);
      // Label
      const fontSize = Math.round((size * 0.055) * (tSize / 100));
      ctx.fillStyle = labelColor;
      ctx.font = `700 ${fontSize}px ${font || 'Poppins'}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label || 'Scan Me', size/2, size - barH/2);
    }
  },

  {
    id: 'frm-top-bar',
    name: 'Top Bar',
    hasText: true,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const barH = Math.round(size * 0.12);
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, size, barH);
      const fontSize = Math.round((size * 0.055) * (tSize / 100));
      ctx.fillStyle = labelColor;
      ctx.font = `700 ${fontSize}px ${font || 'Poppins'}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label || 'Scan Me', size/2, barH/2);
    }
  },

  {
    id: 'frm-polaroid',
    name: 'Polaroid',
    hasText: true,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const barH = Math.round(size * 0.14);
      const topH  = Math.round(size * 0.04);
      // Top thin bar
      ctx.fillStyle = frameColor;
      ctx.fillRect(0, 0, size, topH);
      // Bottom white area with label
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, size - barH, size, barH);
      const fontSize = Math.round((size * 0.05) * (tSize / 100));
      ctx.fillStyle = frameColor;
      ctx.font = `600 ${fontSize}px ${font || 'Poppins'}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label || 'Scan Me', size/2, size - barH/2);
    }
  },

  {
    id: 'frm-badge',
    name: 'Badge',
    hasText: true,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const barH = Math.round(size * 0.1);
      const pad  = Math.round(size * 0.04);
      const badgeY = size - barH;
      const rX  = size * 0.15;
      const rW  = size * 0.7;
      const r   = barH / 2;

      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.roundRect(rX, badgeY, rW, barH, r);
      ctx.fill();

      const fontSize = Math.round((size * 0.048) * (tSize / 100));
      ctx.fillStyle = labelColor;
      ctx.font = `700 ${fontSize}px ${font || 'Poppins'}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label || 'Scan Me', size/2, badgeY + barH/2);
    }
  },

  {
    id: 'frm-ribbon',
    name: 'Ribbon',
    hasText: true,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const barH = Math.round(size * 0.1);
      const barY = size - barH;
      const notch = barH * 0.4;

      ctx.fillStyle = frameColor;
      ctx.beginPath();
      ctx.moveTo(0, barY);
      ctx.lineTo(size, barY);
      ctx.lineTo(size, barY + barH - notch);
      ctx.lineTo(size/2, barY + barH);
      ctx.lineTo(0, barY + barH - notch);
      ctx.closePath();
      ctx.fill();

      const fontSize = Math.round((size * 0.048) * (tSize / 100));
      ctx.fillStyle = labelColor;
      ctx.font = `700 ${fontSize}px ${font || 'Poppins'}, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label || 'Scan Me', size/2, barY + barH * 0.42);
    }
  },

  {
    id: 'frm-border-sq',
    name: 'Square Border',
    hasText: false,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const t = Math.round(size * 0.025);
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = t;
      ctx.strokeRect(t/2, t/2, size - t, size - t);
    }
  },

  {
    id: 'frm-border-rd',
    name: 'Round Border',
    hasText: false,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const t = Math.round(size * 0.025);
      const r = size * 0.06;
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = t;
      ctx.beginPath();
      ctx.roundRect(t/2, t/2, size-t, size-t, r);
      ctx.stroke();
    }
  },

  {
    id: 'frm-corner-mark',
    name: 'Corner Marks',
    hasText: false,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const len = size * 0.12;
      const t   = Math.round(size * 0.025);
      const off = t / 2;
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = t;
      ctx.lineCap = 'square';

      // Top-left
      ctx.beginPath(); ctx.moveTo(off, off+len); ctx.lineTo(off, off); ctx.lineTo(off+len, off); ctx.stroke();
      // Top-right
      ctx.beginPath(); ctx.moveTo(size-off-len, off); ctx.lineTo(size-off, off); ctx.lineTo(size-off, off+len); ctx.stroke();
      // Bottom-left
      ctx.beginPath(); ctx.moveTo(off, size-off-len); ctx.lineTo(off, size-off); ctx.lineTo(off+len, size-off); ctx.stroke();
      // Bottom-right
      ctx.beginPath(); ctx.moveTo(size-off-len, size-off); ctx.lineTo(size-off, size-off); ctx.lineTo(size-off, size-off-len); ctx.stroke();
    }
  },

  {
    id: 'frm-double-border',
    name: 'Double Border',
    hasText: false,
    draw(ctx, size, label, font, tSize, labelColor, frameColor) {
      const t1 = Math.round(size * 0.018);
      const gap = t1 * 2;
      ctx.strokeStyle = frameColor;
      // Outer
      ctx.lineWidth = t1;
      ctx.strokeRect(t1/2, t1/2, size-t1, size-t1);
      // Inner
      ctx.strokeRect(t1+gap, t1+gap, size-2*(t1+gap), size-2*(t1+gap));
    }
  },
];
