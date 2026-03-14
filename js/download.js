// =========================================================
// DOWNLOAD.JS — QR Prism v2.7
// PNG, JPG, SVG, WebP, 2x, 4x, PDF export
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

function downloadQR(format) {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') {
    showToast('Generate a QR code first', 'info');
    return;
  }

  const filename = 'qr-prism_' + (S.activeType || 'qr') + '_' + Date.now();

  switch (format) {
    case 'png':
      downloadCanvasAs(canvas, filename + '.png', 'image/png', 1);
      break;

    case 'jpg':
      downloadCanvasWithBG(canvas, filename + '.jpg', 'image/jpeg', 0.92);
      break;

    case 'webp':
      downloadCanvasAs(canvas, filename + '.webp', 'image/webp', 0.92);
      break;

    case 'png2x':
      downloadScaled(canvas, filename + '_2x.png', 2);
      break;

    case 'png4x':
      downloadScaled(canvas, filename + '_4x.png', 4);
      break;

    case 'svg':
      downloadAsSVG(canvas, filename + '.svg');
      break;

    case 'pdf':
      downloadAsPDF(canvas, filename + '.pdf');
      break;

    default:
      downloadCanvasAs(canvas, filename + '.png', 'image/png', 1);
  }
  // Close dropdown
  document.getElementById('dl-dropdown')?.classList.remove('open');
}

function downloadCanvasAs(canvas, name, mime, quality) {
  const url = canvas.toDataURL(mime, quality);
  triggerDownload(url, name);
  showToast('Downloading ' + name.split('.').pop().toUpperCase(), 'success');
}

function downloadCanvasWithBG(canvas, name, mime, quality) {
  // JPEG doesn't support transparency — fill white background
  const tmp = document.createElement('canvas');
  tmp.width  = canvas.width;
  tmp.height = canvas.height;
  const ctx  = tmp.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tmp.width, tmp.height);
  ctx.drawImage(canvas, 0, 0);
  const url = tmp.toDataURL(mime, quality);
  triggerDownload(url, name);
  showToast('Downloading JPG', 'success');
}

function downloadScaled(canvas, name, scale) {
  const tmp  = document.createElement('canvas');
  tmp.width  = canvas.width  * scale;
  tmp.height = canvas.height * scale;
  const ctx  = tmp.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(canvas, 0, 0, tmp.width, tmp.height);
  const url = tmp.toDataURL('image/png');
  triggerDownload(url, name);
  showToast('Downloading ' + scale + '× PNG', 'success');
}

function downloadAsSVG(canvas, name) {
  const w   = canvas.width;
  const h   = canvas.height;
  const url = canvas.toDataURL('image/png');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <image width="${w}" height="${h}" xlink:href="${url}"/>
</svg>`;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const objUrl = URL.createObjectURL(blob);
  triggerDownload(objUrl, name);
  setTimeout(() => URL.revokeObjectURL(objUrl), 1000);
  showToast('Downloading SVG', 'success');
}

function downloadAsPDF(canvas, name) {
  // Simple PDF using canvas data URL embedded in a PDF-compatible page
  const w   = canvas.width;
  const h   = canvas.height;
  const url = canvas.toDataURL('image/png');

  // Build minimal valid PDF with the image
  // We use a printable HTML approach as fallback since jsPDF isn't included
  const html = `<!DOCTYPE html><html><head>
    <style>
      * { margin:0; padding:0; }
      body { display:flex; align-items:center; justify-content:center; min-height:100vh; background:#fff; }
      img { max-width:100%; max-height:100vh; }
    </style>
  </head><body>
    <img src="${url}" alt="QR Code" style="width:${Math.min(w,595)}px;height:auto;">
    <script>window.onload=()=>{ window.print(); }</script>
  </body></html>`;

  const blob   = new Blob([html], { type: 'text/html' });
  const objUrl = URL.createObjectURL(blob);
  const win    = window.open(objUrl, '_blank');
  if (!win) {
    // Fallback: download PNG
    downloadCanvasAs(canvas, name.replace('.pdf', '.png'), 'image/png', 1);
    showToast('PDF blocked — downloading PNG instead', 'warning');
  } else {
    showToast('PDF print dialog opened', 'info');
  }
  setTimeout(() => URL.revokeObjectURL(objUrl), 5000);
}

function triggerDownload(url, name) {
  const a = document.createElement('a');
  a.href  = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
