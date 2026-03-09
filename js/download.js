// =========================================================
// DOWNLOAD.JS — Download, clipboard, share
// =========================================================

function downloadQR(fmt) {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') {
    showToast('Generate a QR code first!', 'warning');
    return;
  }
  // Close dropdown if open
  const dd = document.getElementById('dl-dropdown');
  if (dd) dd.classList.remove('open');
  try {
    if (fmt === 'png') {
      _dlURL(canvas.toDataURL('image/png'), 'qr.png');
    } else if (fmt === 'webp') {
      _dlURL(canvas.toDataURL('image/webp', 0.95), 'qr.webp');
    } else if (fmt === 'jpg') {
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width; tmp.height = canvas.height;
      const ctx = tmp.getContext('2d');
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, tmp.width, tmp.height);
      ctx.drawImage(canvas, 0, 0);
      _dlURL(tmp.toDataURL('image/jpeg', 0.92), 'qr.jpg');
    } else if (fmt === 'png2x' || fmt === 'png4x') {
      const scale = fmt === 'png2x' ? 2 : 4;
      const tmp = document.createElement('canvas');
      tmp.width = canvas.width * scale; tmp.height = canvas.height * scale;
      const ctx = tmp.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.scale(scale, scale);
      ctx.drawImage(canvas, 0, 0);
      _dlURL(tmp.toDataURL('image/png'), `qr-${scale}x.png`);
    } else if (fmt === 'svg') {
      const dataUrl = canvas.toDataURL('image/png');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image href="${dataUrl}" width="${canvas.width}" height="${canvas.height}"/></svg>`;
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      _dlURL(url, 'qr.svg');
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast('Downloaded!', 'success');
      return;
    }
    showToast('Downloaded!', 'success');
  } catch (e) {
    showToast('Download failed: ' + e.message, 'error');
  }
}

function _dlURL(url, filename) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = url;
  a.click();
}

async function copyToClipboard() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') return;
  canvas.toBlob(async (blob) => {
    try {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      showToast('Copied to clipboard!', 'success');
    } catch (e) {
      showToast('Copy not supported — use Download', 'warning');
    }
  }, 'image/png');
}

async function shareQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') return;
  canvas.toBlob(async (blob) => {
    const file = new File([blob], 'qr-code.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ title: 'QR Code', files: [file] }); return; } catch (e) {}
    }
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 3000);
  });
}
