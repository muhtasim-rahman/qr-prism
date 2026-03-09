// =========================================================
// js/batch.js — Batch QR code generation
// =========================================================

let batchResults = [];

async function startBatch() {
  const input = document.getElementById('batch-input')?.value?.trim();
  if (!input) { showToast('Enter at least one URL or text', 'warning'); return; }
  const lines = [...new Set(input.split('\n').map(l => l.trim()).filter(Boolean))];
  if (!lines.length) return;

  const size  = parseInt(document.getElementById('batch-size')?.value) || 512;
  const fmt   = document.getElementById('batch-fmt')?.value || 'png';

  const progCard = document.getElementById('batch-progress-card');
  const progFill = document.getElementById('batch-prog-fill');
  const progTxt  = document.getElementById('batch-prog-txt');
  const progNum  = document.getElementById('batch-prog-num');
  const preview  = document.getElementById('batch-preview');
  const dlBtn    = document.getElementById('batch-dl-btn');

  if (progCard) progCard.style.display = '';
  if (preview)  preview.innerHTML = '';
  if (dlBtn)    dlBtn.style.display = 'none';
  batchResults = [];

  for (let i = 0; i < lines.length; i++) {
    const pct = Math.round(((i) / lines.length) * 100);
    if (progFill) progFill.style.width = pct + '%';
    if (progTxt)  progTxt.textContent  = 'Generating...';
    if (progNum)  progNum.textContent  = i + ' / ' + lines.length;

    const canvas = await generateBatchQR(lines[i], size);
    batchResults.push({ data: lines[i], canvas });

    const wrap = document.createElement('div'); wrap.className = 'batch-item';
    const label = document.createElement('div'); label.className = 'batch-label';
    label.textContent = lines[i].length > 40 ? lines[i].substring(0, 40) + '…' : lines[i];
    wrap.appendChild(canvas); wrap.appendChild(label);
    if (preview) preview.appendChild(wrap);
    await new Promise(r => setTimeout(r, 0));
  }

  if (progFill) progFill.style.width = '100%';
  if (progTxt)  progTxt.textContent  = 'Done!';
  if (progNum)  progNum.textContent  = lines.length + ' / ' + lines.length;
  if (dlBtn)    dlBtn.style.display  = '';
  showToast(lines.length + ' QR codes generated!', 'success');
}

function generateBatchQR(data, size) {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const modules = getMatrix(data, 'H');
    if (!modules) { resolve(canvas); return; }
    const ctx   = canvas.getContext('2d');
    const count = modules.length;
    const qz    = 4;
    const total = count + qz * 2;
    const mod   = size / total;
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (modules[r][c]) ctx.fillRect((qz + c) * mod, (qz + r) * mod, mod, mod);
      }
    }
    resolve(canvas);
  });
}

async function downloadBatch() {
  if (!batchResults.length) return;
  // Use JSZip if available, else download first
  if (typeof JSZip !== 'undefined') {
    const zip = new JSZip();
    batchResults.forEach((item, i) => {
      const name = 'qr-' + (i + 1) + '-' + item.data.replace(/[^a-z0-9]/gi, '_').substring(0, 20) + '.png';
      const dataURL = item.canvas.toDataURL('image/png');
      zip.file(name, dataURL.split(',')[1], { base64: true });
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(URL.createObjectURL(blob), 'qr-batch.zip');
  } else {
    // Fallback: download first one
    batchResults.forEach((item, i) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = item.canvas.toDataURL('image/png');
        a.download = 'qr-' + (i+1) + '.png';
        a.click();
      }, i * 200);
    });
  }
  showToast('Downloading batch ZIP...', 'success');
}
