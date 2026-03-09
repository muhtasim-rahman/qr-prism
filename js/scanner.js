// =========================================================
// js/scanner.js — QR Code camera/file scanner
// =========================================================

let scanStream = null;
let scanAnimFrame = null;

async function startScanner() {
  const videoWrap = document.getElementById('video-wrap');
  const video     = document.getElementById('scanner-video');
  const startBtn  = document.getElementById('start-scan-btn');
  const stopBtn   = document.getElementById('stop-scan-btn');

  try {
    scanStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = scanStream;
    await video.play();
    if (videoWrap) videoWrap.style.display = '';
    if (startBtn)  startBtn.style.display  = 'none';
    if (stopBtn)   stopBtn.style.display   = '';
    scanFrame();
  } catch (e) {
    showToast('Camera access denied or not available', 'error');
  }
}

function stopScanner() {
  if (scanStream) { scanStream.getTracks().forEach(t => t.stop()); scanStream = null; }
  if (scanAnimFrame) { cancelAnimationFrame(scanAnimFrame); scanAnimFrame = null; }
  const videoWrap = document.getElementById('video-wrap');
  const startBtn  = document.getElementById('start-scan-btn');
  const stopBtn   = document.getElementById('stop-scan-btn');
  if (videoWrap) videoWrap.style.display = 'none';
  if (startBtn)  startBtn.style.display  = '';
  if (stopBtn)   stopBtn.style.display   = 'none';
}

function scanFrame() {
  const video = document.getElementById('scanner-video');
  if (!video || !scanStream) return;
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    const tmp = document.createElement('canvas');
    tmp.width = video.videoWidth; tmp.height = video.videoHeight;
    tmp.getContext('2d').drawImage(video, 0, 0);
    const imageData = tmp.getContext('2d').getImageData(0, 0, tmp.width, tmp.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: 'dontInvert' });
    if (result) { stopScanner(); showScanResult(result.data); return; }
  }
  scanAnimFrame = requestAnimationFrame(scanFrame);
}

function scanFromFile(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width; canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      const imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const result = jsQR(imageData.data, imageData.width, imageData.height);
      if (result) showScanResult(result.data);
      else showToast('No QR code found in image', 'warning');
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function showScanResult(data) {
  const card = document.getElementById('scan-result');
  const dataEl = document.getElementById('scan-data');
  const openBtn = document.getElementById('scan-open-btn');
  if (!card || !dataEl) return;
  dataEl.textContent = data;
  card.style.display = '';
  const isURL = /^https?:\/\//i.test(data);
  if (openBtn) openBtn.style.display = isURL ? '' : 'none';
  showToast('QR code scanned!', 'success');
}

function openScannedURL() {
  const data = document.getElementById('scan-data')?.textContent;
  if (data) window.open(data, '_blank');
}

function copyScanned() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  navigator.clipboard.writeText(data).then(() => showToast('Copied!', 'success')).catch(() => showToast('Copy failed', 'error'));
}

function loadScannedInGen() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  switchView('gen');
  const urlField = document.getElementById('f-url');
  if (urlField) { urlField.value = data; switchQRType('url'); }
  schedRender();
}
