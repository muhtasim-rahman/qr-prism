// =========================================================
// BATCH.JS — QR Prism v2.8
// Batch QR generation, ZIP download, per-item actions,
// multi-select, transparent BG support
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _batchResults     = [];  // [{ data, dataURL, filename, selected }]
let _batchSelAll      = false;

// ══════════════════════════════════════════════════════════
// GENERATE ALL
// ══════════════════════════════════════════════════════════
async function startBatch() {
  const ta    = document.getElementById('batch-input');
  const lines = (ta?.value || '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 200);

  if (!lines.length) { showToast('Enter at least one item', 'error'); return; }

  // Get design settings from selected template
  const templateSettings = (typeof getSelectedBatchSettings === 'function')
    ? getSelectedBatchSettings()
    : null;

  // Options
  const sizePx      = parseInt(document.getElementById('batch-size')?.value || '600');
  const format      = document.getElementById('batch-format')?.value || 'png';
  const transparent = document.getElementById('batch-transparent')?.checked || false;

  // UI
  const progCard  = document.getElementById('batch-progress-card');
  const progFill  = document.getElementById('batch-prog-fill');
  const progTxt   = document.getElementById('batch-prog-txt');
  const progNum   = document.getElementById('batch-prog-num');
  const dlBtn     = document.getElementById('batch-dl-btn');
  const clrBtn    = document.getElementById('batch-clear-btn');
  const selAllBtn = document.getElementById('batch-select-all-btn');
  const preview   = document.getElementById('batch-preview');
  const multiBar  = document.getElementById('batch-multi-bar');

  if (progCard) progCard.style.display = 'block';
  if (dlBtn)    dlBtn.style.display    = 'none';
  if (clrBtn)   clrBtn.style.display   = 'none';
  if (selAllBtn) selAllBtn.style.display = 'none';
  if (preview)  preview.innerHTML      = '';
  if (multiBar) multiBar.style.display = 'none';

  _batchResults = [];
  _batchSelAll  = false;

  let successCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const data = lines[i];
    const pct  = Math.round(((i + 1) / lines.length) * 100);
    if (progFill) progFill.style.width = pct + '%';
    if (progTxt)  progTxt.textContent  = `Generating… (${i + 1}/${lines.length})`;
    if (progNum)  progNum.textContent  = `${i + 1} / ${lines.length}`;

    try {
      const dataURL = await _generateOneBatch(data, templateSettings, sizePx, transparent, format);
      const filename = `qr_${String(i + 1).padStart(3, '0')}_${_sanitizeFilename(data)}.${format === 'svg' ? 'svg' : format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png'}`;
      _batchResults.push({ data, dataURL, filename, selected: false });
      successCount++;

      // Add thumbnail card to preview
      if (preview) {
        preview.appendChild(_buildBatchCard(i, data, dataURL));
      }
    } catch (err) {
      _batchResults.push({ data, dataURL: null, filename: null, selected: false, error: err.message });
      if (preview) preview.appendChild(_buildBatchErrorCard(i, data));
    }

    // Yield to UI every 10 items
    if (i % 10 === 0) await new Promise(r => setTimeout(r, 0));
  }

  if (progTxt)  progTxt.textContent  = `Done! ${successCount} QR code${successCount !== 1 ? 's' : ''} generated.`;
  if (dlBtn)    dlBtn.style.display    = successCount > 0 ? 'inline-flex' : 'none';
  if (clrBtn)   clrBtn.style.display   = 'inline-flex';
  if (selAllBtn) selAllBtn.style.display = successCount > 0 ? 'inline-flex' : 'none';

  showToast(`${successCount} QR code${successCount !== 1 ? 's' : ''} ready!`, 'success');
}

// ══════════════════════════════════════════════════════════
// GENERATE ONE QR (canvas-based, applies template settings)
// ══════════════════════════════════════════════════════════
function _generateOneBatch(data, settings, sizePx, transparent, format) {
  return new Promise((resolve, reject) => {
    try {
      const sz = Math.max(100, Math.min(2000, sizePx || 600));
      const ec = settings?.ec || SETTINGS.defaultEC || 'H';

      // Get QR matrix via qrcodejs
      const tmp = document.createElement('div');
      tmp.style.cssText = 'position:fixed;left:-99999px;visibility:hidden;';
      document.body.appendChild(tmp);

      const qrInst = new QRCode(tmp, {
        text:         data || ' ',
        width:        sz,
        height:       sz,
        correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
      });

      let modules = qrInst._oQRCode?.modules;

      // Fallback: read from rendered canvas
      if (!modules) {
        const qrCv = tmp.querySelector('canvas');
        if (qrCv) {
          modules = _extractModulesFromCanvas(qrCv);
        }
      }

      document.body.removeChild(tmp);

      if (!modules) { reject(new Error('Matrix extraction failed')); return; }

      // Draw to output canvas
      const cv  = document.createElement('canvas');
      cv.width  = sz;
      cv.height = sz;
      const ctx = cv.getContext('2d', { alpha: true });
      ctx.clearRect(0, 0, sz, sz);

      const bgMode   = settings?.bgMode  || 'solid';
      const bgColor  = settings?.bgColor || '#ffffff';
      const fgColor  = settings?.fgColor || '#000000';
      const isTransparent = transparent || bgMode === 'transparent';

      // Background
      if (!isTransparent) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, sz, sz);
      }

      // Modules
      const count = modules.length;
      const qz    = settings?.qz ?? 4;
      const total = count + qz * 2;
      const cs    = sz / total;
      const qzPx  = qz * cs;

      ctx.fillStyle = fgColor;
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (modules[r][c]) {
            ctx.fillRect(qzPx + c * cs, qzPx + r * cs, cs, cs);
          }
        }
      }

      // Export
      let dataURL;
      if (format === 'jpg') {
        // JPEG: flatten with white bg first
        const flat = document.createElement('canvas');
        flat.width = sz; flat.height = sz;
        const fc = flat.getContext('2d');
        fc.fillStyle = '#ffffff';
        fc.fillRect(0, 0, sz, sz);
        fc.drawImage(cv, 0, 0);
        dataURL = flat.toDataURL('image/jpeg', 0.92);
      } else if (format === 'webp') {
        dataURL = cv.toDataURL('image/webp', 0.92);
      } else {
        dataURL = cv.toDataURL('image/png');
      }

      resolve(dataURL);
    } catch (e) {
      reject(e);
    }
  });
}

// ══════════════════════════════════════════════════════════
// MODULE EXTRACTION FALLBACK
// ══════════════════════════════════════════════════════════
function _extractModulesFromCanvas(canvas) {
  const size = canvas.width;
  const ctx  = canvas.getContext('2d');
  const px   = ctx.getImageData(0, 0, size, size).data;

  // Estimate count from transitions
  let runs = 0, prev = -1;
  for (let x = 0; x < size; x++) {
    const dark = px[x * 4] < 128 ? 1 : 0;
    if (dark !== prev) { runs++; prev = dark; }
  }
  const count = Math.round((runs - 1) / 2);
  if (count < 21 || count > 177) return null;

  const cs = size / count;
  const mods = [];
  for (let r = 0; r < count; r++) {
    mods[r] = [];
    for (let c = 0; c < count; c++) {
      const x = Math.round(c * cs + cs / 2);
      const y = Math.round(r * cs + cs / 2);
      mods[r][c] = px[(y * size + x) * 4] < 128;
    }
  }
  return mods;
}

// ══════════════════════════════════════════════════════════
// CARD BUILDERS
// ══════════════════════════════════════════════════════════
function _buildBatchCard(idx, data, dataURL) {
  const el = document.createElement('div');
  el.className = 'batch-item';
  el.dataset.idx = idx;
  el.innerHTML = `
    <div class="batch-thumb" onclick="toggleBatchSelect(${idx})">
      <img src="${dataURL}" alt="${escHtml(data.slice(0, 20))}">
    </div>
    <div class="batch-meta" title="${escHtml(data)}">${escHtml(data.slice(0, 24))}${data.length > 24 ? '…' : ''}</div>
    <div class="batch-item-actions">
      <button class="batch-item-btn tooltip-wrap" onclick="downloadBatchItem(${idx})" title="Download">
        <i class="fa-solid fa-download"></i>
        <span class="tooltip-pop">Download</span>
      </button>
      <button class="batch-item-btn tooltip-wrap" onclick="loadBatchItemInGen(${idx})" title="Edit in Generator">
        <i class="fa-solid fa-wand-magic-sparkles"></i>
        <span class="tooltip-pop">Edit</span>
      </button>
      <button class="batch-item-btn tooltip-wrap" onclick="copyBatchItem(${idx})" title="Copy to Clipboard">
        <i class="fa-regular fa-copy"></i>
        <span class="tooltip-pop">Copy</span>
      </button>
    </div>`;
  return el;
}

function _buildBatchErrorCard(idx, data) {
  const el = document.createElement('div');
  el.className = 'batch-item';
  el.style.opacity = '.5';
  el.innerHTML = `
    <div class="batch-thumb" style="background:var(--surface2);">
      <i class="fa-solid fa-triangle-exclamation" style="color:var(--danger);font-size:1.2rem;"></i>
    </div>
    <div class="batch-meta" style="color:var(--danger);">Error</div>
    <div class="batch-meta" title="${escHtml(data)}">${escHtml(data.slice(0, 20))}</div>`;
  return el;
}

// ══════════════════════════════════════════════════════════
// PER-ITEM ACTIONS
// ══════════════════════════════════════════════════════════
function downloadBatchItem(idx) {
  const r = _batchResults[idx];
  if (!r?.dataURL) { showToast('No data for this item', 'error'); return; }
  triggerDownload(r.dataURL, r.filename || `qr_${idx + 1}.png`);
  showToast('Downloading…', 'success');
}

function loadBatchItemInGen(idx) {
  const r = _batchResults[idx];
  if (!r) return;
  switchMode('gen');
  setTimeout(() => {
    const urlEl = document.getElementById('f-url');
    const txtEl = document.getElementById('f-text');
    if (r.data.startsWith('http') && urlEl) {
      urlEl.value = r.data;
    } else if (txtEl) {
      switchType('text', document.querySelector('[data-type="text"]'));
      setTimeout(() => {
        const el = document.getElementById('f-text');
        if (el) el.value = r.data;
        schedRender(true);
      }, 150);
      return;
    }
    schedRender(true);
  }, 200);
}

async function copyBatchItem(idx) {
  const r = _batchResults[idx];
  if (!r?.dataURL) { showToast('No data for this item', 'error'); return; }
  try {
    const res = await fetch(r.dataURL);
    const blob = await res.blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    showToast('Copied to clipboard!', 'success');
  } catch {
    showToast('Copy failed', 'error');
  }
}

// ══════════════════════════════════════════════════════════
// MULTI-SELECT
// ══════════════════════════════════════════════════════════
function toggleBatchSelect(idx) {
  const r = _batchResults[idx];
  if (!r) return;
  r.selected = !r.selected;
  const el = document.querySelector(`.batch-item[data-idx="${idx}"]`);
  if (el) el.classList.toggle('selected', r.selected);
  _updateBatchMultiBar();
}

function selectAllBatch() {
  _batchSelAll = !_batchSelAll;
  _batchResults.forEach((r, i) => {
    if (!r.dataURL) return;
    r.selected = _batchSelAll;
    const el = document.querySelector(`.batch-item[data-idx="${i}"]`);
    if (el) el.classList.toggle('selected', r.selected);
  });
  const btn = document.getElementById('batch-select-all-btn');
  if (btn) btn.innerHTML = _batchSelAll
    ? '<i class="fa-solid fa-square-check"></i> Deselect All'
    : '<i class="fa-solid fa-check-square"></i> Select All';
  _updateBatchMultiBar();
}

function deselectAllBatch() {
  _batchSelAll = false;
  _batchResults.forEach((r, i) => {
    r.selected = false;
    const el = document.querySelector(`.batch-item[data-idx="${i}"]`);
    if (el) el.classList.remove('selected');
  });
  _updateBatchMultiBar();
}

function _updateBatchMultiBar() {
  const cnt    = _batchResults.filter(r => r.selected).length;
  const bar    = document.getElementById('batch-multi-bar');
  const cntEl  = document.getElementById('batch-selected-count');
  if (!bar) return;
  if (cnt > 0) {
    bar.style.display = 'flex';
    if (cntEl) cntEl.textContent = `${cnt} selected`;
  } else {
    bar.style.display = 'none';
  }
}

async function downloadSelectedBatch() {
  const selected = _batchResults.filter(r => r.selected && r.dataURL);
  if (!selected.length) { showToast('Select items first', 'info'); return; }

  if (selected.length === 1) {
    downloadBatchItem(_batchResults.indexOf(selected[0]));
    return;
  }

  // Multiple: ZIP
  if (typeof JSZip === 'undefined') {
    showToast('JSZip not loaded', 'error'); return;
  }
  showToast(`Creating ZIP for ${selected.length} items…`, 'info');
  const zip = new JSZip();
  selected.forEach(r => {
    const b64 = r.dataURL.split(',')[1];
    zip.file(r.filename || 'qr.png', b64, { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url  = URL.createObjectURL(blob);
  triggerDownload(url, `qr-prism-batch-selected-${selected.length}.zip`);
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('ZIP downloaded!', 'success');
  deselectAllBatch();
}

// ══════════════════════════════════════════════════════════
// DOWNLOAD ALL  (ZIP)
// ══════════════════════════════════════════════════════════
async function downloadBatch() {
  const valid = _batchResults.filter(r => r.dataURL);
  if (!valid.length) { showToast('No QR codes to download', 'info'); return; }

  if (typeof JSZip === 'undefined') {
    showToast('JSZip library not loaded', 'error'); return;
  }

  showToast(`Creating ZIP of ${valid.length} QR codes…`, 'info');

  const zip = new JSZip();
  valid.forEach(r => {
    const b64 = r.dataURL.split(',')[1];
    zip.file(r.filename || 'qr.png', b64, { base64: true });
  });

  try {
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } });
    const url  = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    triggerDownload(url, `qr-prism-batch-${valid.length}_${date}.zip`);
    setTimeout(() => URL.revokeObjectURL(url), 3000);
    showToast(`ZIP with ${valid.length} QR codes downloaded!`, 'success');
  } catch (err) {
    showToast('ZIP creation failed: ' + err.message, 'error');
  }
}

// ══════════════════════════════════════════════════════════
// CLEAR
// ══════════════════════════════════════════════════════════
function clearBatch() {
  _batchResults = [];
  _batchSelAll  = false;

  const ids = ['batch-input','batch-preview','batch-progress-card','batch-dl-btn',
               'batch-clear-btn','batch-select-all-btn','batch-multi-bar'];
  const el  = id => document.getElementById(id);

  if (el('batch-input'))    { el('batch-input').value = ''; updateBatchCount(); }
  if (el('batch-preview'))  el('batch-preview').innerHTML = '';
  if (el('batch-progress-card'))   el('batch-progress-card').style.display   = 'none';
  if (el('batch-dl-btn'))          el('batch-dl-btn').style.display           = 'none';
  if (el('batch-clear-btn'))       el('batch-clear-btn').style.display        = 'none';
  if (el('batch-select-all-btn'))  el('batch-select-all-btn').style.display   = 'none';
  if (el('batch-multi-bar'))       el('batch-multi-bar').style.display        = 'none';

  // Re-render template list to clear selection
  if (typeof renderBatchTemplateList === 'function') renderBatchTemplateList();
}

// ══════════════════════════════════════════════════════════
// HELPER
// ══════════════════════════════════════════════════════════
function _sanitizeFilename(s) {
  return (s || 'qr').slice(0, 30).replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}
