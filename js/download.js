// =========================================================
// js/download.js — QR Code download functions
// =========================================================

async function downloadQR(format) {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') { showToast('Generate a QR code first', 'warning'); return; }

  const name = 'qr-code';

  if (format === 'svg') {
    // Build an SVG from the canvas
    const dataURL = canvas.toDataURL('image/png');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
  <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}"/>
</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    triggerDownload(URL.createObjectURL(blob), name + '.svg');
    return;
  }

  let outCanvas = canvas;

  if (format === 'png2x' || format === 'png4x') {
    const scale = format === 'png4x' ? 4 : 2;
    outCanvas = document.createElement('canvas');
    outCanvas.width  = canvas.width  * scale;
    outCanvas.height = canvas.height * scale;
    const ctx = outCanvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(canvas, 0, 0, outCanvas.width, outCanvas.height);
    format = 'png';
  }

  const mimeMap = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' };
  const ext     = format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
  const mime    = mimeMap[format] || 'image/png';
  const quality = format === 'jpg' ? 0.95 : undefined;

  outCanvas.toBlob(blob => {
    triggerDownload(URL.createObjectURL(blob), name + '.' + ext);
    showToast('Downloaded ' + ext.toUpperCase(), 'success');
  }, mime, quality);
}

function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.href = href; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(href), 5000);
}
