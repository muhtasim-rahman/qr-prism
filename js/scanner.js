// =========================================================
// SCANNER.JS — Camera scanner + image file scan (jsQR)
// =========================================================

let _scanning    = false;
let _scanStream  = null;
let _scanRAF     = null;

// ── Start camera scanner ─────────────────────────────────
async function startScanner() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('Camera not supported in this browser', 'error');
    return;
  }
  try {
    _scanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 640 } }
    });
    const video = document.getElementById('scanner-video');
    video.srcObject = _scanStream;
    document.getElementById('video-wrap').style.display  = 'block';
    document.getElementById('start-scan-btn').style.display = 'none';
    document.getElementById('stop-scan-btn').style.display  = 'inline-flex';
    _scanning = true;
    _scanLoop();
  } catch (e) {
    showToast('Camera error: ' + e.message, 'error');
  }
}

// ── Stop camera scanner ──────────────────────────────────
function stopScanner() {
  _scanning = false;
  if (_scanRAF) { cancelAnimationFrame(_scanRAF); _scanRAF = null; }
  if (_scanStream) { _scanStream.getTracks().forEach(t => t.stop()); _scanStream = null; }
  document.getElementById('video-wrap').style.display  = 'none';
  document.getElementById('start-scan-btn').style.display = 'inline-flex';
  document.getElementById('stop-scan-btn').style.display  = 'none';
}

// ── Continuous scan loop via requestAnimationFrame ───────
function _scanLoop() {
  if (!_scanning) return;
  const video = document.getElementById('scanner-video');
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const tmp = document.createElement('canvas');
    tmp.width  = video.videoWidth;
    tmp.height = video.videoHeight;
    tmp.getContext('2d').drawImage(video, 0, 0);
    const imageData = tmp.getContext('2d').getImageData(0, 0, tmp.width, tmp.height);
    if (typeof jsQR !== 'undefined') {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      if (code && code.data) {
        stopScanner();
        _showScanResult(code.data);
        showToast('QR Code scanned!', 'success');
        return;
      }
    }
  }
  _scanRAF = requestAnimationFrame(_scanLoop);
}

// ── Scan from uploaded image file ────────────────────────
function scanFromFile(input) {
  const file = input.files[0];
  if (!file) return;
  input.value = '';

  const img = new Image();
  img.onload = () => {
    const tmp = document.createElement('canvas');
    tmp.width  = img.width;
    tmp.height = img.height;
    tmp.getContext('2d').drawImage(img, 0, 0);
    const imageData = tmp.getContext('2d').getImageData(0, 0, tmp.width, tmp.height);

    if (typeof jsQR === 'undefined') {
      showToast('jsQR library not loaded', 'error');
      return;
    }
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });
    if (code && code.data) {
      _showScanResult(code.data);
      showToast('QR Code found!', 'success');
    } else {
      showToast('No QR Code found in image', 'warning');
    }
  };
  img.onerror = () => showToast('Could not load image', 'error');
  img.src = URL.createObjectURL(file);
}

// ── Show scan result ─────────────────────────────────────
function _showScanResult(data) {
  const card    = document.getElementById('scan-result');
  const display = document.getElementById('scan-data');
  const openBtn = document.getElementById('scan-open-btn');
  if (card)    card.style.display    = 'block';
  if (display) display.textContent   = data;
  if (openBtn) openBtn.style.display = data.startsWith('http') ? 'inline-flex' : 'none';
}

// ── Action buttons for scan result ──────────────────────
function openScannedURL() {
  const data = document.getElementById('scan-data').textContent;
  if (data && data.startsWith('http')) window.open(data, '_blank');
}

function copyScanned() {
  const data = document.getElementById('scan-data').textContent;
  if (!data) return;
  navigator.clipboard.writeText(data)
    .then(() => showToast('Copied!', 'success'))
    .catch(() => showToast('Copy failed', 'error'));
}

function loadScannedInGen() {
  const data = document.getElementById('scan-data').textContent;
  if (!data) return;
  switchMode('gen');
  setTimeout(() => {
    // Try to set data in URL field
    const inp = document.getElementById('f-url');
    if (inp) { inp.value = data; schedRender(); }
  }, 120);
}
