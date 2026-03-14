// =========================================================
// BATCH.JS — QR Prism v2.7
// Batch QR generation + ZIP download
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _batchResults    = [];
let _selectedBatchTpl = null;

function renderBatchTemplateList() {
  const list = document.getElementById('batch-template-list');
  if (!list) return;
  const templates = loadUserTemplates();
  _selectedBatchTpl = null;

  if (!templates.length) {
    list.innerHTML = `<div class="empty-state" style="padding:16px 0;">
      <i class="fa-solid fa-bookmark"></i>
      <p>No saved templates yet.<br>Save a template from the Generator first.</p>
      <button class="btn btn-outline btn-sm" onclick="switchMode('gen')">Go to Generator</button>
    </div>`;
    return;
  }

  list.innerHTML = templates.map((t, i) => `
    <div class="batch-tmpl-item${_selectedBatchTpl === i ? ' active' : ''}"
      id="btpl-${i}" onclick="selectBatchTemplate(${i})">
      <canvas width="36" height="36" id="btv-${i}" style="border-radius:5px;"></canvas>
      <div>
        <div class="batch-tmpl-name">${escHtml(t.name)}</div>
        <div class="batch-tmpl-date">${formatDate(t.createdAt)}</div>
      </div>
    </div>`).join('');

  requestAnimationFrame(() => {
    templates.forEach((t, i) => {
      const cv = document.getElementById('btv-' + i);
      if (cv && typeof drawTemplateThumbnail === 'function') drawTemplateThumbnail(cv, t.design || {});
    });
  });
}

function selectBatchTemplate(idx) {
  _selectedBatchTpl = _selectedBatchTpl === idx ? null : idx;
  document.querySelectorAll('.batch-tmpl-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx && _selectedBatchTpl === idx);
  });
}

function updateBatchCountHint() {
  const ta   = document.getElementById('batch-input');
  const hint = document.getElementById('batch-count-hint');
  if (!ta || !hint) return;
  const n = ta.value.split('\n').filter(l => l.trim()).length;
  hint.textContent = n + ' item' + (n !== 1 ? 's' : '') + (n > 200 ? ' (max 200)' : '');
  hint.style.color = n > 200 ? 'var(--danger)' : '';
}

async function startBatch() {
  const ta    = document.getElementById('batch-input');
  const lines = (ta?.value || '').split('\n').map(l => l.trim()).filter(Boolean).slice(0, 200);

  if (!lines.length) { showToast('Enter at least one item', 'error'); return; }

  // Get design to apply
  let batchDesign = null;
  if (_selectedBatchTpl !== null) {
    const templates = loadUserTemplates();
    batchDesign = templates[_selectedBatchTpl]?.design || null;
  }

  // Show progress
  const progCard = document.getElementById('batch-progress-card');
  const progFill = document.getElementById('batch-prog-fill');
  const progTxt  = document.getElementById('batch-prog-txt');
  const progNum  = document.getElementById('batch-prog-num');
  const dlBtn    = document.getElementById('batch-dl-btn');
  const clrBtn   = document.getElementById('batch-clear-btn');
  const preview  = document.getElementById('batch-preview');

  if (progCard) progCard.style.display = 'block';
  if (dlBtn)    dlBtn.style.display    = 'none';
  if (clrBtn)   clrBtn.style.display   = 'none';
  if (preview)  preview.innerHTML      = '';

  _batchResults = [];

  for (let i = 0; i < lines.length; i++) {
    const data = lines[i];
    const pct  = Math.round(((i + 1) / lines.length) * 100);
    if (progFill) progFill.style.width = pct + '%';
    if (progTxt)  progTxt.textContent  = 'Generating…';
    if (progNum)  progNum.textContent  = `${i + 1} / ${lines.length}`;

    try {
      const dataURL = await generateBatchQR(data, batchDesign);
      _batchResults.push({ data, dataURL });
      // Add thumbnail to preview
      if (preview) {
        const item = document.createElement('div');
        item.className = 'bp-item';
        item.innerHTML = `<img src="${dataURL}" alt="${escHtml(data.slice(0,20))}">
          <p>${escHtml(data.slice(0,20))}</p>`;
        preview.appendChild(item);
      }
    } catch(e) {
      _batchResults.push({ data, dataURL: null, error: e.message });
    }

    // Yield to UI every 5 items
    if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
  }

  if (progTxt) progTxt.textContent = `Done! ${_batchResults.length} QR codes generated.`;
  if (dlBtn)   dlBtn.style.display = 'inline-flex';
  if (clrBtn)  clrBtn.style.display = 'inline-flex';
  showToast(`${_batchResults.length} QR codes ready!`, 'success');
}

function generateBatchQR(data, design) {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const size   = (design?.size) || SETTINGS.defaultSize || 512;
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');

      const bg = design?.bgColor || '#ffffff';
      const fg = design?.fgColor || '#000000';
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, size, size);

      const tmp = document.createElement('div');
      tmp.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
      document.body.appendChild(tmp);

      new QRCode(tmp, {
        text: data,
        width: size, height: size,
        correctLevel: QRCode.CorrectLevel[design?.ec || SETTINGS.defaultEC || 'H'],
      });

      // Get modules
      const qrObj = tmp.querySelector('canvas');
      if (qrObj) {
        const tmpCtx = document.createElement('canvas');
        tmpCtx.width = size; tmpCtx.height = size;
        const tctx = tmpCtx.getContext('2d');
        tctx.fillStyle = bg;
        tctx.fillRect(0, 0, size, size);
        tctx.drawImage(qrObj, 0, 0, size, size);
        document.body.removeChild(tmp);
        resolve(tmpCtx.toDataURL('image/png'));
      } else {
        document.body.removeChild(tmp);
        reject(new Error('QR render failed'));
      }
    } catch(e) {
      reject(e);
    }
  });
}

async function downloadBatch() {
  if (!_batchResults.length) return;
  if (typeof JSZip === 'undefined') {
    showToast('JSZip not loaded', 'error'); return;
  }
  showToast('Creating ZIP…', 'info');
  const zip = new JSZip();
  _batchResults.forEach((r, i) => {
    if (!r.dataURL) return;
    const base64 = r.dataURL.split(',')[1];
    const name   = 'qr_' + String(i + 1).padStart(3,'0') + '_' + r.data.slice(0,20).replace(/[^a-z0-9]/gi,'_') + '.png';
    zip.file(name, base64, { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const url  = URL.createObjectURL(blob);
  triggerDownload(url, buildExportFilename('batch', _batchResults.length).replace('.json','.zip'));
  setTimeout(() => URL.revokeObjectURL(url), 3000);
  showToast('ZIP downloaded!', 'success');
}

function clearBatch() {
  _batchResults = [];
  _selectedBatchTpl = null;
  const ta = document.getElementById('batch-input');
  if (ta) ta.value = '';
  const preview  = document.getElementById('batch-preview');
  const progCard = document.getElementById('batch-progress-card');
  const dlBtn    = document.getElementById('batch-dl-btn');
  const clrBtn   = document.getElementById('batch-clear-btn');
  if (preview)  preview.innerHTML = '';
  if (progCard) progCard.style.display = 'none';
  if (dlBtn)    dlBtn.style.display    = 'none';
  if (clrBtn)   clrBtn.style.display   = 'none';
  updateBatchCountHint();
  renderBatchTemplateList();
}
