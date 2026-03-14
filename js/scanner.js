// =========================================================
// SCANNER.JS — QR Prism v2.7
// Camera QR scanner + image file scanning
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _scanStream    = null;
let _scanAnimFrame = null;
let _scanActive    = false;
let _flashTrack    = null;
let _flashOn       = false;

// ── Toggle scanner (start / stop) ────────────────────────────
function toggleScanner() {
  if (_scanActive) stopScanner();
  else startScanner();
}

async function startScanner() {
  const btn       = document.getElementById('scan-main-btn');
  const btnIcon   = document.getElementById('scan-main-icon');
  const btnLabel  = document.getElementById('scan-btn-label');
  const emptyState = document.getElementById('scan-empty-state');
  const video     = document.getElementById('scanner-video');
  const overlay   = document.getElementById('scan-overlay');
  const result    = document.getElementById('scan-result');

  if (result) result.style.display = 'none';

  try {
    _scanStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } }
    });
    video.srcObject = _scanStream;
    await video.play();

    _scanActive = true;
    if (emptyState) emptyState.style.display = 'none';
    if (overlay)    overlay.classList.add('active');
    if (btnIcon)    btnIcon.className = 'fa-solid fa-stop';
    if (btnLabel)   btnLabel.textContent = 'Stop Scanner';

    // Store track for flashlight
    _flashTrack = _scanStream.getVideoTracks()[0] || null;

    // Start scan loop
    requestAnimationFrame(scanLoop);
  } catch(err) {
    if (err.name === 'NotAllowedError') {
      showToast('Camera permission denied', 'error');
    } else if (err.name === 'NotFoundError') {
      showToast('No camera found on this device', 'error');
    } else {
      showToast('Camera error: ' + err.message, 'error');
    }
  }
}

function stopScanner() {
  _scanActive = false;
  if (_scanAnimFrame) cancelAnimationFrame(_scanAnimFrame);
  _flashOn = false;
  if (_flashTrack) {
    try { _flashTrack.applyConstraints({ advanced: [{ torch: false }] }); } catch(e) {}
    _flashTrack = null;
  }
  if (_scanStream) {
    _scanStream.getTracks().forEach(t => t.stop());
    _scanStream = null;
  }
  const video     = document.getElementById('scanner-video');
  const overlay   = document.getElementById('scan-overlay');
  const emptyState = document.getElementById('scan-empty-state');
  const btnIcon   = document.getElementById('scan-main-icon');
  const btnLabel  = document.getElementById('scan-btn-label');
  const flashBtn  = document.getElementById('flashlight-btn');

  if (video)      { video.srcObject = null; }
  if (overlay)    overlay.classList.remove('active');
  if (emptyState) emptyState.style.display = 'flex';
  if (btnIcon)    btnIcon.className = 'fa-solid fa-camera';
  if (btnLabel)   btnLabel.textContent = 'Start Scanner';
  if (flashBtn)   flashBtn.classList.remove('active');
}

function scanLoop() {
  if (!_scanActive) return;
  const video = document.getElementById('scanner-video');
  if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
    _scanAnimFrame = requestAnimationFrame(scanLoop);
    return;
  }
  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width  = video.videoWidth;
  tmpCanvas.height = video.videoHeight;
  const ctx = tmpCanvas.getContext('2d');
  ctx.drawImage(video, 0, 0, tmpCanvas.width, tmpCanvas.height);
  const imageData = ctx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height);

  if (typeof jsQR !== 'undefined') {
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    if (code && code.data) {
      handleScanResult(code.data);
      return; // Stop loop after result
    }
  }
  _scanAnimFrame = requestAnimationFrame(scanLoop);
}

function handleScanResult(data) {
  stopScanner();
  const result    = document.getElementById('scan-result');
  const dataEl    = document.getElementById('scan-data');
  const typeEl    = document.getElementById('scan-type-badge');
  const openBtn   = document.getElementById('scan-open-btn');

  if (dataEl)  dataEl.textContent  = data;
  if (typeEl)  typeEl.textContent  = detectScanType(data);
  if (openBtn) openBtn.style.display = /^https?:\/\//i.test(data) ? 'inline-flex' : 'none';
  if (result)  result.style.display = 'block';
}

function detectScanType(data) {
  if (/^https?:\/\//i.test(data))  return '🔗 URL';
  if (/^mailto:/i.test(data))       return '✉️ Email';
  if (/^tel:/i.test(data))          return '📞 Phone';
  if (/^sms:/i.test(data))          return '💬 SMS';
  if (/^WIFI:/i.test(data))         return '📶 WiFi';
  if (/^BEGIN:VCARD/i.test(data))   return '👤 vCard';
  if (/^geo:/i.test(data))          return '📍 Location';
  if (/^BEGIN:VEVENT/i.test(data))  return '📅 Event';
  if (/^bitcoin:/i.test(data))      return '₿ Bitcoin';
  return '📄 Text';
}

function resetScanner() {
  const result = document.getElementById('scan-result');
  if (result) result.style.display = 'none';
  startScanner();
}

// ── Scan from image file ──────────────────────────────────────
function scanFromFile(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleScanResult(code.data);
          showToast('QR code found in image!', 'success');
        } else {
          showToast('No QR code found in image', 'error');
        }
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ── Flashlight ────────────────────────────────────────────────
async function toggleFlashlight() {
  if (!_flashTrack) return;
  try {
    _flashOn = !_flashOn;
    await _flashTrack.applyConstraints({ advanced: [{ torch: _flashOn }] });
    document.getElementById('flashlight-btn')?.classList.toggle('active', _flashOn);
  } catch(e) {
    showToast('Flashlight not supported', 'info');
    _flashOn = false;
  }
}
