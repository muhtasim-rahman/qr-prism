// =========================================================
// SCANNER.JS — QR Prism v2.8
// Camera QR scanner + image file scanning
// Mobile: full-screen viewport; Tablet/PC: card layout
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _scanStream    = null;
let _scanAnimFrame = null;
let _scanActive    = false;
let _flashTrack    = null;
let _flashOn       = false;
let _scanPaused    = false;

// ══════════════════════════════════════════════════════════
// INIT  (called when scan mode becomes active)
// ══════════════════════════════════════════════════════════
function initScannerPage() {
  // Reset result panel
  const result = document.getElementById('scan-result');
  if (result) result.style.display = 'none';
  // Reset button state
  _updateScanBtn(false);
}

// ══════════════════════════════════════════════════════════
// TOGGLE  (Start / Stop)
// ══════════════════════════════════════════════════════════
function toggleScanner() {
  if (_scanActive) stopScanner();
  else             startScanner();
}

// ══════════════════════════════════════════════════════════
// START SCANNER
// ══════════════════════════════════════════════════════════
async function startScanner() {
  const emptyState = document.getElementById('scan-empty-state');
  const video      = document.getElementById('scanner-video');
  const overlay    = document.getElementById('scan-overlay');
  const result     = document.getElementById('scan-result');

  if (result) result.style.display = 'none';
  if (emptyState) emptyState.style.display = 'none';

  try {
    // Request camera — prefer rear camera, high resolution
    _scanStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width:  { ideal: 1920 },
        height: { ideal: 1080 },
      }
    });

    if (!video) return;
    video.srcObject = _scanStream;
    await video.play();

    _scanActive = true;
    _scanPaused = false;

    if (overlay) overlay.style.display = '';
    _updateScanBtn(true);

    // Store track for flashlight
    _flashTrack = _scanStream.getVideoTracks()?.[0] || null;

    // Start scan loop
    _scanAnimFrame = requestAnimationFrame(_scanLoop);

    // On mobile: make viewport taller (css handles it, just ensure video aspect)
    _adjustViewportForMobile(true);

  } catch (err) {
    _handleCameraError(err);
  }
}

// ══════════════════════════════════════════════════════════
// STOP SCANNER
// ══════════════════════════════════════════════════════════
function stopScanner() {
  _scanActive = false;
  _scanPaused = false;

  if (_scanAnimFrame) {
    cancelAnimationFrame(_scanAnimFrame);
    _scanAnimFrame = null;
  }

  // Turn off flashlight
  if (_flashOn && _flashTrack) {
    try { _flashTrack.applyConstraints({ advanced: [{ torch: false }] }); } catch {}
    _flashOn = false;
  }
  _flashTrack = null;

  // Release camera
  if (_scanStream) {
    _scanStream.getTracks().forEach(t => t.stop());
    _scanStream = null;
  }

  const video      = document.getElementById('scanner-video');
  const overlay    = document.getElementById('scan-overlay');
  const emptyState = document.getElementById('scan-empty-state');
  const flashBtn   = document.getElementById('flashlight-btn');

  if (video)      { video.srcObject = null; video.load(); }
  if (overlay)    overlay.style.display = 'none';
  if (emptyState) emptyState.style.display = 'flex';
  if (flashBtn)   flashBtn.classList.remove('active');

  _updateScanBtn(false);
  _adjustViewportForMobile(false);
}

// ══════════════════════════════════════════════════════════
// SCAN LOOP  (rAF-based, reads every frame)
// ══════════════════════════════════════════════════════════
function _scanLoop() {
  if (!_scanActive || _scanPaused) return;

  const video = document.getElementById('scanner-video');
  if (!video || video.readyState !== HTMLMediaElement.HAVE_ENOUGH_DATA) {
    _scanAnimFrame = requestAnimationFrame(_scanLoop);
    return;
  }

  // Draw video frame to offscreen canvas
  const W = video.videoWidth  || 640;
  const H = video.videoHeight || 480;

  // Reuse offscreen canvas for performance
  if (!_scanLoop._cv) {
    _scanLoop._cv  = document.createElement('canvas');
    _scanLoop._ctx = _scanLoop._cv.getContext('2d', { willReadFrequently: true });
  }
  const cv  = _scanLoop._cv;
  const ctx = _scanLoop._ctx;

  if (cv.width !== W || cv.height !== H) {
    cv.width  = W;
    cv.height = H;
  }

  ctx.drawImage(video, 0, 0, W, H);
  const imageData = ctx.getImageData(0, 0, W, H);

  // Try jsQR
  if (typeof jsQR !== 'undefined') {
    const code = jsQR(imageData.data, W, H, { inversionAttempts: 'dontInvert' });
    if (code && code.data) {
      _handleScanResult(code.data);
      return; // stop loop — result found
    }
  }

  // Try BarcodeDetector (native, where available)
  if (typeof BarcodeDetector !== 'undefined' && !_scanLoop._bcd) {
    _scanLoop._bcd = new BarcodeDetector({ formats: ['qr_code'] });
  }
  if (_scanLoop._bcd) {
    _scanLoop._bcd.detect(cv).then(codes => {
      if (codes.length && codes[0].rawValue) {
        _handleScanResult(codes[0].rawValue);
      }
    }).catch(() => {});
  }

  _scanAnimFrame = requestAnimationFrame(_scanLoop);
}

// ══════════════════════════════════════════════════════════
// HANDLE RESULT
// ══════════════════════════════════════════════════════════
function _handleScanResult(data) {
  // Pause scan to avoid duplicate results
  _scanPaused = true;
  stopScanner();

  const result   = document.getElementById('scan-result');
  const dataEl   = document.getElementById('scan-data');
  const typeEl   = document.getElementById('scan-type-badge');
  const openBtn  = document.getElementById('scan-open-btn');

  if (dataEl)  dataEl.textContent  = data;
  if (typeEl)  typeEl.textContent  = _detectScanType(data);
  if (openBtn) openBtn.style.display = /^https?:\/\//i.test(data) ? 'inline-flex' : 'none';
  if (result)  result.style.display = 'block';

  // Vibration feedback (mobile)
  if (navigator.vibrate) navigator.vibrate([60, 30, 60]);

  showToast('QR code scanned!', 'success');
}

// ══════════════════════════════════════════════════════════
// DETECT TYPE
// ══════════════════════════════════════════════════════════
function _detectScanType(data) {
  if (/^https?:\/\//i.test(data))    return 'URL';
  if (/^mailto:/i.test(data))         return 'Email';
  if (/^tel:/i.test(data))            return 'Phone';
  if (/^sms:|^smsto:/i.test(data))    return 'SMS';
  if (/^WIFI:/i.test(data))           return 'WiFi';
  if (/^BEGIN:VCARD/i.test(data))     return 'vCard Contact';
  if (/^geo:/i.test(data))            return 'Location';
  if (/^BEGIN:VEVENT/i.test(data))    return 'Calendar Event';
  if (/^bitcoin:|^ethereum:/i.test(data)) return 'Crypto Wallet';
  return 'Text';
}

// ══════════════════════════════════════════════════════════
// SCAN FROM IMAGE FILE
// ══════════════════════════════════════════════════════════
function scanFromFile(input) {
  const file = input.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const cv  = document.createElement('canvas');
      cv.width  = img.width;
      cv.height = img.height;
      const ctx = cv.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, cv.width, cv.height);

      let found = false;

      if (typeof jsQR !== 'undefined') {
        const code = jsQR(imageData.data, cv.width, cv.height);
        if (code?.data) { _handleScanResult(code.data); found = true; }
      }

      if (!found && typeof BarcodeDetector !== 'undefined') {
        new BarcodeDetector({ formats: ['qr_code'] })
          .detect(cv)
          .then(codes => {
            if (codes.length && codes[0].rawValue) {
              _handleScanResult(codes[0].rawValue);
            } else {
              showToast('No QR code found in image', 'error');
            }
          })
          .catch(() => showToast('No QR code found in image', 'error'));
        return;
      }

      if (!found) showToast('No QR code found in image', 'error');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
  input.value = '';
}

// ══════════════════════════════════════════════════════════
// FLASHLIGHT
// ══════════════════════════════════════════════════════════
async function toggleFlashlight() {
  if (!_flashTrack) {
    showToast('Start scanner first', 'info'); return;
  }
  try {
    _flashOn = !_flashOn;
    await _flashTrack.applyConstraints({ advanced: [{ torch: _flashOn }] });
    const btn = document.getElementById('flashlight-btn');
    if (btn) {
      btn.classList.toggle('active', _flashOn);
      btn.title = _flashOn ? 'Flashlight ON' : 'Flashlight OFF';
    }
  } catch {
    showToast('Flashlight not supported on this device', 'info');
    _flashOn = false;
  }
}

// ══════════════════════════════════════════════════════════
// UI HELPERS
// ══════════════════════════════════════════════════════════
function _updateScanBtn(active) {
  const icon  = document.getElementById('scan-main-icon');
  const label = document.getElementById('scan-btn-label');
  if (icon)  icon.className   = active ? 'fa-solid fa-stop' : 'fa-solid fa-camera';
  if (label) label.textContent = active ? 'Stop Scanner'   : 'Start Scanner';
}

function _handleCameraError(err) {
  const viewport = document.getElementById('scanner-viewport');
  const emptyState = document.getElementById('scan-empty-state');

  let msg = 'Camera error';
  if (err.name === 'NotAllowedError')  msg = 'Camera permission denied. Please allow camera access.';
  else if (err.name === 'NotFoundError') msg = 'No camera found on this device.';
  else if (err.name === 'NotReadableError') msg = 'Camera is already in use by another app.';
  else msg = 'Camera error: ' + (err.message || err.name);

  if (emptyState) {
    emptyState.style.display = 'flex';
    const p = emptyState.querySelector('p');
    if (p) p.textContent = msg;
  }
  showToast(msg, 'error');
}

// On mobile, scanner viewport becomes taller when active
function _adjustViewportForMobile(active) {
  const isMobile = window.innerWidth < 768;
  const vp = document.getElementById('scanner-viewport');
  if (!vp || !isMobile) return;
  vp.style.aspectRatio = active ? '9/16' : '4/3';
}
