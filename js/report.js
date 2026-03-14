// =========================================================
// REPORT.JS — QR Prism v2.7
// Bug report form with images, localStorage save
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _reportType   = 'bug';
let _reportImages = []; // base64 data URLs

function selectReportType(btn, type) {
  _reportType = type;
  document.querySelectorAll('.rtype-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function handleReportImages(input) {
  const files = Array.from(input.files || []);
  const remaining = 8 - _reportImages.length;
  files.slice(0, remaining).forEach(file => {
    if (file.size > 5*1024*1024) { showToast(`${file.name} too large (max 5 MB)`, 'error'); return; }
    const reader = new FileReader();
    reader.onload = e => {
      _reportImages.push(e.target.result);
      renderReportImages();
    };
    reader.readAsDataURL(file);
  });
  input.value = '';
}

function renderReportImages() {
  const grid = document.getElementById('report-img-grid');
  if (!grid) return;
  grid.innerHTML = '';

  _reportImages.forEach((src, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'ri-wrap';
    wrap.innerHTML = `
      <img src="${src}" class="report-img-thumb" alt="screenshot ${i+1}">
      <div class="ri-remove" onclick="removeReportImage(${i})">✕</div>`;
    grid.appendChild(wrap);
  });

  if (_reportImages.length < 8) {
    const addBtn = document.createElement('div');
    addBtn.className = 'report-img-add';
    addBtn.innerHTML = '<i class="fa-solid fa-plus"></i><span>Add image</span>';
    addBtn.onclick = () => document.getElementById('report-img-input')?.click();
    grid.appendChild(addBtn);
  }
}

function removeReportImage(idx) {
  _reportImages.splice(idx, 1);
  renderReportImages();
}

function submitReport() {
  const name = document.getElementById('report-name')?.value.trim();
  const desc = document.getElementById('report-desc')?.value.trim();
  if (!desc) { showToast('Please describe the issue', 'error'); return; }

  const report = {
    id:         Date.now(),
    type:       _reportType,
    name:       name || 'Anonymous',
    email:      document.getElementById('report-email')?.value.trim() || '',
    desc,
    imageCount: _reportImages.length,
    date:       new Date().toISOString(),
    appVersion: 'v2.7',
    ua:         navigator.userAgent,
  };

  try {
    const prev = JSON.parse(localStorage.getItem('qrp_reports') || '[]');
    prev.push(report);
    localStorage.setItem('qrp_reports', JSON.stringify(prev));
  } catch(e) {}

  showToast('Report submitted! Thank you 🙏', 'success', 3500);

  // Clear form
  ['report-name','report-email','report-desc'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  _reportImages = [];
  renderReportImages();
  _reportType = 'bug';
  document.querySelectorAll('.rtype-btn').forEach((b,i) => b.classList.toggle('active', i===0));
}

function clearReportForm() {
  showConfirm({
    title: 'Clear Form',
    msg: 'Clear all report fields?',
    okLabel: 'Clear', okClass: 'btn-danger',
    onConfirm: () => {
      ['report-name','report-email','report-desc'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });
      _reportImages = [];
      renderReportImages();
      _reportType = 'bug';
      document.querySelectorAll('.rtype-btn').forEach((b,i) => b.classList.toggle('active', i===0));
    }
  });
}
