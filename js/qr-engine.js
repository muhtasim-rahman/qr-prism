// =========================================================
// QR-ENGINE.JS — QR Prism v2.7
// Canvas QR rendering: patterns, eyes, gradient, logo, frame
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _renderTimer = null;
let _autoSaveTimer = null;

// ── Debounced render trigger ──────────────────────────────────
function schedRender(immediate = false) {
  clearTimeout(_renderTimer);
  const delay = immediate ? 0 : 320;
  _renderTimer = setTimeout(() => {
    renderQR();
  }, delay);
}

// ── Lookup helpers (reference design arrays) ─────────────────
function getPattern(id) {
  return (typeof PATTERNS !== 'undefined') ? PATTERNS.find(p => p.id === id) : null;
}
function getEyeFrame(id) {
  return (typeof EYE_FRAMES !== 'undefined') ? EYE_FRAMES.find(f => f.id === id) : null;
}
function getEyeInner(id) {
  return (typeof EYE_INNERS !== 'undefined') ? EYE_INNERS.find(i => i.id === id) : null;
}
function getFrame(id) {
  return (typeof FRAMES !== 'undefined') ? FRAMES.find(f => f.id === id) : null;
}

// ── Get QR modules matrix ─────────────────────────────────────
function getMatrix(data, ec) {
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:-9999px;width:10px;height:10px;';
    document.body.appendChild(div);
    new QRCode(div, {
      text: data || ' ',
      width: 100, height: 100,
      correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
    });
    // Access the internal _oQRCode object via the element's children
    const canvas = div.querySelector('canvas');
    const img    = div.querySelector('img');
    // Get modules via internal QRCode object
    let modules = null;
    // Try to access via the QRCode instance stored on element
    const qrObj = div.__qrcode || div._qrcode;
    if (qrObj && qrObj._oQRCode) {
      modules = qrObj._oQRCode.modules;
    }
    if (!modules) {
      // Alternative: create and access directly
      const qr2 = new QRCode(document.createElement('div'), {
        text: data || ' ',
        width: 100, height: 100,
        correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
      });
      // The QRCode lib stores modules on the internal object
      // We need to get it via the canvas pixel data approach as fallback
    }
    document.body.removeChild(div);
    // Rebuild using direct instantiation approach
    return getMatrixDirect(data, ec);
  } catch(e) {
    return getMatrixDirect(data, ec);
  }
}

function getMatrixDirect(data, ec) {
  try {
    const tmp = document.createElement('div');
    tmp.style.cssText = 'position:fixed;left:-9999px;top:-9999px;';
    document.body.appendChild(tmp);
    const qrInst = new QRCode(tmp, {
      text: data,
      width: 100, height: 100,
      correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
    });
    let modules = null;
    // Access via _oQRCode
    if (qrInst._oQRCode) {
      modules = qrInst._oQRCode.modules;
    }
    document.body.removeChild(tmp);
    return modules;
  } catch(e) {
    return null;
  }
}

// ── Finder pattern detection ──────────────────────────────────
function isInFinder(row, col, count) {
  return (row < 7 && col < 7) ||             // top-left
         (row < 7 && col >= count - 7) ||    // top-right
         (row >= count - 7 && col < 7);      // bottom-left
}

// ── Rounded rect path helper ──────────────────────────────────
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(Math.abs(r), w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ── Draw a single module ──────────────────────────────────────
function drawModule(ctx, x, y, cs, patternId, color) {
  ctx.fillStyle = color;
  const pat = getPattern(patternId);
  if (pat && pat.draw) {
    try { pat.draw(ctx, x, y, cs, color); }
    catch(e) { ctx.fillRect(x, y, cs, cs); }
  } else {
    ctx.fillRect(x, y, cs, cs);
  }
}

// ── Draw a finder eye ─────────────────────────────────────────
function drawEye(ctx, ex, ey, cs, frameId, innerId, frameColor, innerColor, bgColor) {
  const s7 = cs * 7;
  const s5 = cs * 5;
  const s3 = cs * 3;
  const off1 = cs;
  const off2 = cs * 2;

  // Step 1: Fill full 7×7 block with background (prevents contamination)
  ctx.fillStyle = bgColor;
  ctx.fillRect(ex, ey, s7, s7);

  // Step 2: Draw outer frame (7×7)
  const efDesign = getEyeFrame(frameId);
  if (efDesign && efDesign.draw) {
    try { efDesign.draw(ctx, ex, ey, s7, frameColor); }
    catch(e) {}
  }

  // Step 3: Fill 5×5 inner area with background (clear inside frame)
  ctx.fillStyle = bgColor;
  ctx.fillRect(ex + off1, ey + off1, s5, s5);

  // Step 4: Draw inner dot (3×3)
  const eiDesign = getEyeInner(innerId);
  if (eiDesign && eiDesign.draw) {
    try { eiDesign.draw(ctx, ex + off2, ey + off2, s3, innerColor); }
    catch(e) {}
  }
}

// ── Draw logo ─────────────────────────────────────────────────
function drawLogoOnCanvas(ctx, canvasW, qrTop, qrH) {
  return new Promise(resolve => {
    if (!S.logoSrc) { resolve(); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const lSize = qrH * (S.logoSize / 100);
      const lx    = (canvasW - lSize) / 2;
      const ly    = qrTop + (qrH - lSize) / 2;
      const pad   = S.logoPad;
      const br    = lSize * (S.logoBR / 100);

      // Padding background
      if (S.logoRemoveBG) {
        ctx.fillStyle = S.logoPadColor;
        ctx.beginPath();
        rrect(ctx, lx - pad, ly - pad, lSize + pad * 2, lSize + pad * 2, br + pad);
        ctx.fill();
      }

      // Clip & draw image
      ctx.save();
      ctx.beginPath();
      rrect(ctx, lx, ly, lSize, lSize, br);
      ctx.clip();
      ctx.drawImage(img, lx, ly, lSize, lSize);
      ctx.restore();
      resolve();
    };
    img.onerror = () => resolve();
    img.src = S.logoSrc;
  });
}

// ── Frame padding calculation ─────────────────────────────────
function getFramePadding() {
  const frm = getFrame(S.frame);
  if (!frm || frm.id === 'frm-none') return { top: 0, bottom: 0, left: 0, right: 0 };
  const p   = frm.padding  || 16;
  const bh  = frm.bannerH  || (frm.hasText ? 50 : 0);
  const top = frm.topBanner ? bh + p : p;
  const bot = (!frm.topBanner && frm.hasText) ? bh + p + 10 : p;
  return { top, bottom: bot, left: p, right: p };
}

// ── MAIN RENDER ───────────────────────────────────────────────
async function renderQR() {
  const data   = buildQRData();
  S.inputData  = data;

  const canvas   = document.getElementById('qr-canvas');
  const empty    = document.getElementById('qr-empty');
  const loading  = document.getElementById('qr-loading');
  const actBtns  = document.getElementById('action-btns');
  const infoRow  = document.getElementById('qr-info-row');
  const analytics = document.getElementById('adv-analytics');

  if (!canvas) return;

  if (!data || !data.trim()) {
    canvas.style.display = 'none';
    if (empty)    empty.style.display = 'flex';
    if (actBtns)  actBtns.style.display = 'none';
    if (infoRow)  infoRow.style.display = 'none';
    if (analytics) analytics.style.display = 'none';
    resetAnalytics();
    setAutosaveStatus('waiting');
    return;
  }

  // Show loading
  if (loading)  loading.style.display = 'flex';
  if (canvas)   canvas.style.display  = 'none';
  if (empty)    empty.style.display   = 'none';
  await new Promise(r => requestAnimationFrame(r));

  try {
    const modules = getMatrixDirect(data, S.ec);
    if (!modules || !modules.length) throw new Error('QR generation failed');

    const count  = modules.length;
    const qzMods = Math.max(0, S.qz);
    const fp     = getFramePadding();

    const qrSize  = S.size || 600;
    const totalM  = count + qzMods * 2;
    const cs      = qrSize / totalM;
    const qzPx    = qzMods * cs;

    const canvasW = qrSize + fp.left + fp.right;
    const canvasH = qrSize + fp.top  + fp.bottom;
    const qrX     = fp.left;
    const qrY     = fp.top;

    const realBG  = S.invert ? S.fgColor : S.bgColor;
    const realFG  = S.invert ? S.bgColor : S.fgColor;

    // High DPI
    const dpr = SETTINGS.highDPI ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width  = canvasW;
    canvas.height = canvasH;
    canvas.style.width  = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Shadow
    if (S.shadow) {
      ctx.shadowColor   = S.shadowColor;
      ctx.shadowBlur    = S.shadowBlur;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
    }

    // Background
    if (!S.transparent) {
      ctx.fillStyle = realBG;
      ctx.fillRect(0, 0, canvasW, canvasH);
    }
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

    // Eye colors
    const markerBorder = S.customMarker ? S.mbColor : realFG;
    const markerCenter = S.customMarker ? S.mcColor : realFG;
    const eyeFrameC    = S.customEF ? S.efColor : markerBorder;
    const eyeInnerC    = S.customEI ? S.eiColor : markerCenter;

    // ── Draw body modules ──────────────────────────────────
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (isInFinder(row, col, count)) continue;
        if (!modules[row][col]) continue;
        const x = qrX + qzPx + col * cs;
        const y = qrY + qzPx + row * cs;
        drawModule(ctx, x, y, cs, S.pattern, realFG);
      }
    }

    // ── Gradient overlay on body ───────────────────────────
    if (S.gradient) {
      const rad = (S.gAngle || 45) * Math.PI / 180;
      const dx  = Math.cos(rad);
      const dy  = Math.sin(rad);
      let grad;
      if (S.gType === 'radial') {
        grad = ctx.createRadialGradient(
          qrX + qrSize / 2, qrY + qrSize / 2, 0,
          qrX + qrSize / 2, qrY + qrSize / 2, qrSize * 0.7
        );
      } else {
        grad = ctx.createLinearGradient(
          qrX + qrSize / 2 - dx * qrSize / 2, qrY + qrSize / 2 - dy * qrSize / 2,
          qrX + qrSize / 2 + dx * qrSize / 2, qrY + qrSize / 2 + dy * qrSize / 2
        );
      }
      grad.addColorStop(0, S.gc1 || realFG);
      grad.addColorStop(1, S.gc2 || realFG);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = grad;
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.globalCompositeOperation = 'source-over';
    }

    // ── Corner eyes ────────────────────────────────────────
    const eyePositions = [
      { r: 0, c: 0 },
      { r: 0, c: count - 7 },
      { r: count - 7, c: 0 },
    ];
    for (const ep of eyePositions) {
      const ex = qrX + qzPx + ep.c * cs;
      const ey = qrY + qzPx + ep.r * cs;
      drawEye(ctx, ex, ey, cs, S.eyeFrame, S.eyeInner, eyeFrameC, eyeInnerC, realBG);
    }

    // ── Logo ───────────────────────────────────────────────
    if (S.logoSrc) {
      await drawLogoOnCanvas(ctx, canvasW, qrY, qrSize);
    }

    // ── Frame ──────────────────────────────────────────────
    const frm = getFrame(S.frame);
    if (frm && frm.id !== 'frm-none' && frm.draw) {
      try {
        frm.draw(ctx, qrX, qrY, qrSize, {
          color:      S.frameColor,
          label:      S.frameLabel,
          font:       S.frameFont,
          textSize:   S.frameTSize,
          labelColor: S.frameLabelColor,
        });
      } catch(e) {}
    }

    // ── Rotation / Flip ─────────────────────────────────────
    if (S.rotation !== 0 || S.flipH || S.flipV) {
      applyCanvasTransform(canvas, canvasW, canvasH);
    }

    // ── CSS Filter ──────────────────────────────────────────
    canvas.style.filter = (S.filter && S.filter !== 'none') ? S.filter : '';

    // Show canvas
    canvas.style.display = 'block';
    if (empty)   empty.style.display   = 'none';
    if (actBtns) actBtns.style.display = 'flex';
    if (infoRow) infoRow.style.display = 'flex';
    if (analytics) analytics.style.display = 'grid';

    updateAnalytics(count, data);
    scheduleAutoSave(data);
    updateUndoRedoBtns();

  } catch(e) {
    showToast('QR error: ' + e.message, 'error');
    if (empty) empty.style.display = 'flex';
    canvas.style.display = 'none';
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

// ── Apply canvas transforms ───────────────────────────────────
function applyCanvasTransform(canvas, w, h) {
  const tmp  = document.createElement('canvas');
  tmp.width  = w; tmp.height = h;
  const tctx = tmp.getContext('2d');
  tctx.save();
  tctx.translate(w / 2, h / 2);
  if (S.rotation) tctx.rotate(S.rotation * Math.PI / 180);
  if (S.flipH)    tctx.scale(-1, 1);
  if (S.flipV)    tctx.scale(1, -1);
  tctx.drawImage(canvas, -w / 2, -h / 2);
  tctx.restore();
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tmp, 0, 0);
}

// ── Analytics ─────────────────────────────────────────────────
function updateAnalytics(count, data) {
  const chars   = data.length;
  const version = getQRVersion(count);
  const scan    = getScanScore(data);

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('bi-size',  S.size + 'px');
  set('bi-ver',   version);
  set('bi-mod',   count + '×' + count);
  set('bi-chars', chars);
  set('a-chars',   chars);
  set('a-version', 'v' + version);
  set('a-modules', count + '×' + count);

  const sv = document.getElementById('a-scan');
  if (sv) { sv.textContent = scan.label; sv.style.color = scan.color; }

  // Warnings
  const warns = [];
  if (S.size < 200)    warns.push('Size < 200px may cause scan issues');
  if (S.logoSize > 30) warns.push('Logo > 30% may reduce scanability');
  if (chars > 300)     warns.push('High data — consider higher EC level');

  ['warn-bar','warn-bar-prev'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (warns.length) { el.style.display = 'block'; el.innerHTML = '⚠️ ' + warns[0]; }
    else el.style.display = 'none';
  });
}

function resetAnalytics() {
  const ids = ['a-chars','a-version','a-modules','a-scan','bi-size','bi-ver','bi-mod','bi-chars'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '—'; });
  ['warn-bar','warn-bar-prev'].forEach(id => {
    const el = document.getElementById(id); if (el) el.style.display = 'none';
  });
}

function getQRVersion(count) {
  const map = {21:1,25:2,29:3,33:4,37:5,41:6,45:7,49:8,53:9,57:10,
               61:11,65:12,69:13,73:14,77:15,81:16,85:17,89:18,93:19,97:20,
               101:21,105:22,109:23,113:24,117:25,121:26,125:27,129:28,133:29,137:30,
               141:31,145:32,149:33,153:34,157:35,161:36,165:37,169:38,173:39,177:40};
  return map[count] || '?';
}

function getScanScore(data) {
  const len = data.length;
  if (len > 400 || S.logoSize > 35 || S.size < 150)
    return { label: 'Low ⚠',     color: '#F87171' };
  if (len > 200 || S.logoSize > 25 || S.size < 250)
    return { label: 'Fair',      color: '#FBBF24' };
  if (len > 100)
    return { label: 'Good',      color: '#60A5FA' };
  return   { label: 'Excellent', color: '#34D399' };
}

// ── Autosave Status ───────────────────────────────────────────
function setAutosaveStatus(state) {
  const dot = document.getElementById('autosave-dot');
  const txt = document.getElementById('autosave-txt');
  const states = {
    waiting: { cls: '',        text: 'Waiting…' },
    saving:  { cls: 'saving',  text: 'Saving…'  },
    saved:   { cls: 'saved',   text: 'Auto-saved' },
    error:   { cls: 'error',   text: 'Save failed' },
  };
  const s = states[state] || states.waiting;
  if (dot) dot.className = 'autosave-dot ' + s.cls;
  if (txt) txt.textContent = s.text;
}

function scheduleAutoSave(data) {
  if (!SETTINGS.autoSaveProjects) return;
  clearTimeout(_autoSaveTimer);
  setAutosaveStatus('saving');
  _autoSaveTimer = setTimeout(() => {
    if (typeof autoSaveToProjects === 'function') {
      autoSaveToProjects(data);
    }
  }, 1500);
}

// ── Undo/Redo (aliases for HTML onclick) ─────────────────────
function undoQR() {
  if (!_undoStack.length) { showToast('Nothing to undo', 'info'); return; }
  _redoStack.push(_undoStack[_undoStack.length - 1]);
  const prev = JSON.parse(_undoStack.pop());
  Object.keys(prev).forEach(k => { if (k !== 'logoSrc') S[k] = prev[k]; });
  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  renderQR();
  updateUndoRedoBtns();
}

function redoQR() {
  if (!_redoStack.length) { showToast('Nothing to redo', 'info'); return; }
  _undoStack.push(_redoStack[_redoStack.length - 1]);
  const next = JSON.parse(_redoStack.pop());
  Object.keys(next).forEach(k => { if (k !== 'logoSrc') S[k] = next[k]; });
  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  renderQR();
  updateUndoRedoBtns();
}

// ── Share QR ──────────────────────────────────────────────────
function shareQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas) return;
  canvas.toBlob(blob => {
    if (!blob) { showToast('Cannot share — no QR yet', 'error'); return; }
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob],'qr.png',{type:'image/png'})] })) {
      navigator.share({
        title: 'QR Code from QR Prism',
        files: [new File([blob], 'qrcode.png', { type: 'image/png' })]
      }).catch(() => {});
    } else {
      // Fallback: copy
      try {
        navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
          .then(() => showToast('QR copied to clipboard', 'success'))
          .catch(() => showToast('Share not supported on this browser', 'info'));
      } catch(e) { showToast('Share not supported', 'info'); }
    }
  }, 'image/png');
}

// ── Copy QR to clipboard ──────────────────────────────────────
function copyToClipboard() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') { showToast('Generate a QR first', 'info'); return; }
  canvas.toBlob(blob => {
    if (!blob) { showToast('Copy failed', 'error'); return; }
    try {
      navigator.clipboard.write([new ClipboardItem({'image/png': blob})])
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Copy failed', 'error'));
    } catch(e) { showToast('Copy not supported', 'error'); }
  }, 'image/png');
}
