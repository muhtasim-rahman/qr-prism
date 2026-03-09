// =========================================================
// batch.js — Batch QR Generator (template-based)
// QR Prism v2.4
// =========================================================

let _batchTemplate = null;
let _batchResults = [];

function renderBatchTemplateList() {
  const list = document.getElementById('batch-template-list');
  if (!list) return;
  const templates = loadUserTemplates();
  if (!templates.length) {
    list.innerHTML = `
      <div class="empty-state" style="padding:16px;">
        <i class="fa-solid fa-bookmark"></i>
        <p>No saved templates yet.<br>
          <button class="btn btn-primary btn-sm" style="margin-top:8px;" onclick="switchMode('gen')">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Go to Generator
          </button>
        </p>
      </div>`;
    return;
  }
  list.innerHTML = templates.map((t, i) => `
    <div class="batch-tmpl-option ${_batchTemplate === i ? 'active' : ''}"
         onclick="selectBatchTemplate(${i}, this)">
      <canvas width="40" height="40" id="btprev-${i}"></canvas>
      <span>${escHtml(t.name)}</span>
    </div>`).join('');
  templates.forEach((t, i) => drawTemplatePreview('btprev-' + i, t));
}

function selectBatchTemplate(idx, el) {
  _batchTemplate = idx;
  document.querySelectorAll('.batch-tmpl-option').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

async function startBatch() {
  const input = document.getElementById('batch-input')?.value?.trim();
  if (!input) return showToast('Enter some data first', 'warning');

  const lines = input.split('\n').map(l => l.trim()).filter(Boolean);
  if (!lines.length) return showToast('No valid lines found', 'warning');
  if (lines.length > 100) return showToast('Max 100 QR codes per batch', 'warning');

  const settings = _batchTemplate !== null ? (loadUserTemplates()[_batchTemplate]?.settings || {}) : {};

  const progressCard = document.getElementById('batch-progress-card');
  const progFill = document.getElementById('batch-prog-fill');
  const progTxt  = document.getElementById('batch-prog-txt');
  const progNum  = document.getElementById('batch-prog-num');
  const preview  = document.getElementById('batch-preview');

  if (progressCard) progressCard.style.display = '';
  if (preview) preview.innerHTML = '';
  _batchResults = [];

  for (let i = 0; i < lines.length; i++) {
    const pct = Math.round(((i + 1) / lines.length) * 100);
    if (progFill) progFill.style.width = pct + '%';
    if (progTxt) progTxt.textContent = `Generating… ${pct}%`;
    if (progNum) progNum.textContent = `${i+1} / ${lines.length}`;

    const dataUrl = await generateBatchQR(lines[i], settings);
    _batchResults.push({ data: lines[i], dataUrl });
    appendBatchResult(lines[i], dataUrl, i);
    await new Promise(r => setTimeout(r, 10));
  }

  if (progressCard) progressCard.style.display = 'none';
  if (progTxt) progTxt.textContent = 'Generating…';
  const dlBtn = document.getElementById('batch-dl-btn');
  if (dlBtn) dlBtn.style.display = '';
  showToast(`Generated ${lines.length} QR codes!`, 'success');
}

async function generateBatchQR(data, settings) {
  return new Promise(resolve => {
    const div = document.createElement('div');
    div.style.cssText = 'position:fixed;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    try {
      new QRCode(div, {
        text: data || ' ', width: 400, height: 400,
        colorDark: settings.fgColor || '#000000',
        colorLight: settings.bgColor || '#ffffff',
        correctLevel: QRCode.CorrectLevel[settings.errorLevel] || QRCode.CorrectLevel.M
      });
      setTimeout(() => {
        const img = div.querySelector('img') || div.querySelector('canvas');
        const src = img?.src || img?.toDataURL?.() || '';
        div.remove(); resolve(src);
      }, 80);
    } catch(e) { div.remove(); resolve(''); }
  });
}

function appendBatchResult(data, dataUrl, idx) {
  const wrap = document.getElementById('batch-preview');
  if (!wrap) return;
  const item = document.createElement('div');
  item.className = 'batch-result-item';
  item.innerHTML = `
    ${dataUrl ? `<img src="${dataUrl}" alt="QR" class="batch-result-img">` : '<div class="batch-result-img" style="background:var(--card2);border-radius:8px;"></div>'}
    <div class="batch-result-data">${escHtml(truncate(data, 40))}</div>
    <button class="btn btn-ghost btn-sm" onclick="downloadBatchItem(${idx})">
      <i class="fa-solid fa-download"></i>
    </button>`;
  wrap.appendChild(item);
}

function downloadBatchItem(idx) {
  const item = _batchResults[idx];
  if (!item?.dataUrl) return;
  const a = document.createElement('a');
  a.href = item.dataUrl;
  a.download = `qr-prism-batch-${idx + 1}.png`;
  a.click();
}

function downloadBatch() {
  if (!_batchResults.length) return showToast('No batch results', 'warning');
  // Individual download loop (ZIP would require JSZip integration)
  let i = 0;
  const dl = () => {
    if (i >= _batchResults.length) return;
    downloadBatchItem(i++);
    setTimeout(dl, 120);
  };
  showToast(`Downloading ${_batchResults.length} QR codes…`, 'info');
  dl();
}
