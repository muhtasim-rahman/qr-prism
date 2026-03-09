// =========================================================
// scanner.js — QR Scanner with camera, flashlight, gallery
// QR Prism v2.4
// =========================================================

let _scannerActive = false;
let _scanStream = null;
let _flashlightOn = false;
let _scanInterval = null;
let _scanPaused = false;
let _lastScannedValue = null;

// ── Init scanner view (called on tab switch) ──────────────
function initScannerView() {
  const emptyScreen = document.getElementById('scan-empty-screen');
  const video = document.getElementById('scanner-video');
  if (!_scannerActive) {
    if (emptyScreen) emptyScreen.style.display = '';
    if (video) video.style.display = 'none';
    const overlay = document.getElementById('scan-overlay');
    if (overlay) overlay.style.display = 'none';
    hideFlashlightBtn();
  }
}

// ── Toggle scanner ────────────────────────────────────────
async function toggleScanner() {
  if (_scannerActive) stopScanner();
  else await startScanner();
}

async function startScanner() {
  const video = document.getElementById('scanner-video');
  const emptyScreen = document.getElementById('scan-empty-screen');
  const overlay = document.getElementById('scan-overlay');
  try {
    const constraints = { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } };
    _scanStream = await navigator.mediaDevices.getUserMedia(constraints);
    if (video) { video.srcObject = _scanStream; video.style.display = ''; await video.play(); }
    if (emptyScreen) emptyScreen.style.display = 'none';
    if (overlay) overlay.style.display = '';
    _scannerActive = true; _flashlightOn = false; _scanPaused = false;
    updateScanMainBtn(true);
    document.getElementById('flashlight-btn').style.display = '';
    hideScanResult();
    startScanLoop();
    showToast('Camera started', 'info', 1500);
  } catch(e) {
    console.error(e);
    if (e.name === 'NotAllowedError') showToast('Camera permission denied', 'error');
    else if (e.name === 'NotFoundError') showToast('No camera found', 'error');
    else showToast('Could not start camera', 'error');
  }
}

function stopScanner() {
  if (_scanStream) { _scanStream.getTracks().forEach(t => t.stop()); _scanStream = null; }
  clearInterval(_scanInterval); _scanInterval = null;
  _scannerActive = false; _flashlightOn = false; _scanPaused = false;
  const video = document.getElementById('scanner-video');
  if (video) { video.srcObject = null; video.style.display = 'none'; }
  const overlay = document.getElementById('scan-overlay');
  if (overlay) overlay.style.display = 'none';
  document.getElementById('scan-empty-screen').style.display = '';
  updateScanMainBtn(false);
  hideFlashlightBtn();
  hideScanResult();
}

function startScanLoop() {
  clearInterval(_scanInterval);
  _scanInterval = setInterval(() => {
    if (!_scannerActive || _scanPaused) return;
    const video = document.getElementById('scanner-video');
    if (!video || video.readyState < 2) return;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      if ('BarcodeDetector' in window) {
        new BarcodeDetector({ formats: ['qr_code'] }).detect(canvas).then(codes => {
          if (codes.length) handleScanResult(codes[0].rawValue);
        });
      } else if (typeof jsQR !== 'undefined') {
        const ctx = canvas.getContext('2d');
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imgData.data, imgData.width, imgData.height);
        if (code) handleScanResult(code.data);
      }
    } catch(e) {}
  }, 300);
}

function handleScanResult(value) {
  if (!value || value === _lastScannedValue) return;
  _lastScannedValue = value;
  _scanPaused = true;
  navigator.vibrate?.(80);
  showScanResult(value);
}

function showScanResult(value) {
  const panel = document.getElementById('scan-result');
  const text  = document.getElementById('scan-data');
  const openBtn = document.getElementById('scan-open-btn');
  if (!panel) return;
  if (text) text.textContent = value;
  const isUrl = /^https?:\/\//i.test(value) || /^www\./i.test(value);
  if (openBtn) openBtn.style.display = isUrl ? '' : 'none';
  panel.style.display = '';
}

function hideScanResult() {
  const panel = document.getElementById('scan-result');
  if (panel) panel.style.display = 'none';
  _lastScannedValue = null;
  _scanPaused = false;
}

function openScannedURL() {
  const val = document.getElementById('scan-data')?.textContent;
  if (!val) return;
  const url = /^https?:\/\//i.test(val) ? val : 'https://' + val;
  window.open(url, '_blank', 'noopener');
}

function copyScanned() {
  const val = document.getElementById('scan-data')?.textContent;
  if (!val) return;
  navigator.clipboard.writeText(val)
    .then(() => showToast('Copied!', 'success'))
    .catch(() => showToast('Copy failed', 'error'));
}

function loadScannedInGen() {
  const val = document.getElementById('scan-data')?.textContent;
  if (!val) return;
  S.inputData = val;
  S.activeType = detectQRType(val);
  stopScanner();
  switchMode('gen');
  renderTypeTabs();
  renderTypeTab(S.activeType);
  syncUIFromState();
  schedRender();
  showToast('Loaded in Generator', 'success');
}

function detectQRType(val) {
  if (/^https?:\/\//i.test(val)) return 'url';
  if (/^WIFI:/i.test(val)) return 'wifi';
  if (/^mailto:/i.test(val)) return 'email';
  if (/^tel:/i.test(val)) return 'phone';
  if (/^smsto:|^sms:/i.test(val)) return 'sms';
  if (/^BEGIN:VCARD/i.test(val)) return 'vcard';
  if (/^bitcoin:/i.test(val)) return 'bitcoin';
  if (/^geo:/i.test(val)) return 'location';
  if (/^BEGIN:VEVENT/i.test(val)) return 'calendar';
  return 'text';
}

async function toggleFlashlight() {
  if (!_scanStream) return;
  const track = _scanStream.getVideoTracks()[0];
  try {
    _flashlightOn = !_flashlightOn;
    await track.applyConstraints({ advanced: [{ torch: _flashlightOn }] });
    const btn = document.getElementById('flashlight-btn');
    if (btn) {
      btn.classList.toggle('active', _flashlightOn);
      const icon = btn.querySelector('i');
      if (icon) { icon.className = _flashlightOn ? 'fa-solid fa-bolt-lightning' : 'fa-solid fa-bolt'; }
    }
  } catch(e) {
    showToast('Flashlight not available on this device', 'warning');
    _flashlightOn = false;
  }
}

function hideFlashlightBtn() {
  const btn = document.getElementById('flashlight-btn');
  if (btn) btn.style.display = 'none';
}

function scanFromFile(input) {
  const file = input.files[0];
  if (!file) return;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width; canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0);
    if ('BarcodeDetector' in window) {
      new BarcodeDetector({ formats: ['qr_code'] }).detect(canvas).then(codes => {
        if (codes.length) { showScanResult(codes[0].rawValue); showToast('QR found!', 'success'); }
        else showToast('No QR code found in image', 'warning');
      });
    } else if (typeof jsQR !== 'undefined') {
      const imgData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imgData.data, imgData.width, imgData.height);
      if (code) { showScanResult(code.data); showToast('QR found!', 'success'); }
      else showToast('No QR code found in image', 'warning');
    } else {
      showToast('QR detection not supported in this browser', 'warning');
    }
  };
  img.src = URL.createObjectURL(file);
  input.value = '';
}

function updateScanMainBtn(active) {
  const btn = document.getElementById('scan-main-btn');
  const icon = document.getElementById('scan-main-icon');
  if (!btn) return;
  if (active) {
    btn.classList.add('scanning');
    if (icon) icon.className = 'fa-solid fa-stop';
  } else {
    btn.classList.remove('scanning');
    if (icon) icon.className = 'fa-solid fa-camera';
  }
}
