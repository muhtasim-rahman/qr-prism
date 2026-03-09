// =========================================================
// BATCH.JS — Bulk QR code generation + ZIP download
// =========================================================

let _batchResults = []; // { canvas, name }[]

// ── Start batch generation ───────────────────────────────
async function startBatch() {
  const txt = (document.getElementById('batch-input').value || '').trim();
  if (!txt) { showToast('Enter at least one URL or text!', 'warning'); return; }

  const lines = txt.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length > 200) { showToast('Max 200 items per batch!', 'warning'); return; }

  const size = parseInt(document.getElementById('batch-size').value) || 512;
  _batchResults = [];

  // Show progress
  document.getElementById('batch-progress-card').style.display = 'block';
  document.getElementById('batch-dl-btn').style.display = 'none';
  document.getElementById('batch-preview').innerHTML = '';

  for (let i = 0; i < lines.length; i++) {
    const data = lines[i];
    const pct  = Math.round((i + 1) / lines.length * 100);

    document.getElementById('batch-prog-fill').style.width  = pct + '%';
    document.getElementById('batch-prog-num').textContent   = `${i + 1} / ${lines.length}`;
    document.getElementById('batch-prog-txt').textContent   = `Generating #${i + 1}…`;

    // Yield to browser to keep UI responsive
    await new Promise(r => setTimeout(r, 8));

    try {
      const canvas = _renderSingleQR(data, size);
      if (!canvas) continue;

      const safeName = data.substring(0, 40).replace(/[^a-z0-9]/gi, '_') || ('qr_' + i);
      _batchResults.push({ canvas, name: safeName });

      // Add preview tile
      const div = document.createElement('div');
      div.className = 'b-item';
      const pc = document.createElement('canvas');
      pc.width = 80; pc.height = 80;
      pc.getContext('2d').drawImage(canvas, 0, 0, 80, 80);
      const lbl = document.createElement('span');
      lbl.textContent = data.length > 20 ? data.substring(0, 20) + '…' : data;
      div.appendChild(pc);
      div.appendChild(lbl);
      document.getElementById('batch-preview').appendChild(div);
    } catch (e) {
      console.warn('Batch item error:', e);
    }
  }

  document.getElementById('batch-prog-txt').textContent = `✅ Done! ${_batchResults.length} QR codes ready.`;
  if (_batchResults.length > 0) {
    document.getElementById('batch-dl-btn').style.display = 'inline-flex';
    showToast(`Generated ${_batchResults.length} QR codes!`, 'success');
  } else {
    showToast('No QR codes generated', 'warning');
  }
}

// ── Render a single QR canvas synchronously ──────────────
function _renderSingleQR(data, size) {
  const modules = getMatrix(data, 'H');
  if (!modules) return null;

  const count  = modules.length;
  const qz     = 4;
  const total  = count + qz * 2;
  const cs     = size / total;
  const qzPx   = qz * cs;

  const canvas = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx     = canvas.getContext('2d');

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);

  // Body modules
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (isInFinder(row, col, count)) continue;
      if (!modules[row][col]) continue;
      drawModule(ctx, qzPx + col * cs, qzPx + row * cs, cs, 'square', '#000000');
    }
  }

  // Eyes
  [{ r:0, c:0 }, { r:0, c:count-7 }, { r:count-7, c:0 }].forEach(ep => {
    drawEye(ctx, qzPx + ep.c * cs, qzPx + ep.r * cs, cs, 'square', 'square', '#000000', '#000000', '#ffffff');
  });

  return canvas;
}

// ── Download batch as ZIP (or individual files if no JSZip) ──
async function downloadBatch() {
  if (!_batchResults.length) { showToast('Nothing to download', 'warning'); return; }

  const fmt = document.getElementById('batch-fmt').value || 'png';
  const mimeType = fmt === 'jpg' ? 'image/jpeg' : 'image/png';
  const ext      = fmt === 'jpg' ? 'jpg' : 'png';

  // Try JSZip first (loaded from CDN if available)
  if (typeof JSZip !== 'undefined') {
    showToast('Creating ZIP file…', 'info');
    const zip    = new JSZip();
    const folder = zip.folder('qr-codes');

    _batchResults.forEach(b => {
      const dataUrl = b.canvas.toDataURL(mimeType, 0.92);
      const base64  = dataUrl.split(',')[1];
      folder.file(`${b.name}.${ext}`, base64, { base64: true });
    });

    try {
      const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
      const link = document.createElement('a');
      link.download = `qr-batch-${Date.now()}.zip`;
      link.href = URL.createObjectURL(blob);
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 2000);
      showToast('ZIP downloaded!', 'success');
    } catch (e) {
      showToast('ZIP failed: ' + e.message, 'error');
    }

  } else {
    // Fallback: download each file individually with a delay
    showToast(`Downloading ${_batchResults.length} files…`, 'info');
    for (let i = 0; i < _batchResults.length; i++) {
      await new Promise(r => setTimeout(r, 250));
      const b    = _batchResults[i];
      const link = document.createElement('a');
      link.download = `${b.name}.${ext}`;
      link.href     = b.canvas.toDataURL(mimeType, 0.92);
      link.click();
    }
    showToast('All files downloaded!', 'success');
  }
}
