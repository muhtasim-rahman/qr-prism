// =========================================================
// qr-engine.js — Canvas rendering engine for QR Studio Pro v2.3
// Uses design IDs from designs/patterns.js, eye-frames.js,
// eye-inners.js, and designs/frames.js
// =========================================================

let renderTimer = null;

// ── Schedule / Debounce render ──────────────────────────
function schedRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    pushUndo();
    renderQR();
  }, 280);
}

// ── Undo / Redo ─────────────────────────────────────────
function pushUndo() {
  undoStack.push(JSON.stringify(S));
  if (undoStack.length > 30) undoStack.shift();
  redoStack.length = 0;
}
function undo() {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(S));
  Object.assign(S, JSON.parse(undoStack.pop()));
  syncAllUI();
  renderQR();
}
function redo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(S));
  Object.assign(S, JSON.parse(redoStack.pop()));
  syncAllUI();
  renderQR();
}

// ── Get QR module matrix ────────────────────────────────
function getMatrix(data, ec) {
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    const qr = new QRCode(div, {
      text: data || ' ',
      width: 100, height: 100,
      correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
    });
    const modules = qr._oQRCode ? qr._oQRCode.modules : null;
    document.body.removeChild(div);
    return modules;
  } catch (e) {
    console.warn('getMatrix error:', e);
    return null;
  }
}

// ── Check if a cell is in a finder pattern ──────────────
function isInFinder(row, col, count) {
  if (row <= 6 && col <= 6)         return true; // top-left
  if (row <= 6 && col >= count - 7) return true; // top-right
  if (row >= count - 7 && col <= 6) return true; // bottom-left
  return false;
}

// ── Rounded rect helper (used by design files too) ──────
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r,     r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x, y + h - r,     r);
  ctx.lineTo(x,    y + r);
  ctx.arcTo(x,     y,     x + r, y,          r);
  ctx.closePath();
}

// ── Star helper ─────────────────────────────────────────
function drawStar(ctx, cx, cy, spikes, ro, ri) {
  let rot = (Math.PI / 2) * 3, step = Math.PI / spikes;
  ctx.moveTo(cx, cy - ro);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * ro, cy + Math.sin(rot) * ro); rot += step;
    ctx.lineTo(cx + Math.cos(rot) * ri, cy + Math.sin(rot) * ri); rot += step;
  }
  ctx.closePath();
}

// ── Diamond helper ───────────────────────────────────────
function drawDiamond(ctx, cx, cy, r) {
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
}

// ── Draw one QR module using pattern design system ──────
function drawModule(ctx, x, y, cs, patternId, color) {
  const pat = getPattern(patternId);
  if (pat) {
    pat.draw(ctx, x, y, cs, color);
  } else {
    // fallback square
    ctx.fillStyle = color;
    ctx.fillRect(x, y, cs, cs);
  }
}

// ── Draw one corner eye using design system ─────────────
function drawEye(ctx, ex, ey, cs, frameId, innerId, frameColor, innerColor, bgColor) {
  const s7 = cs * 7;
  const s5 = cs * 5;
  const s3 = cs * 3;
  const off1 = cs, off2 = cs * 2;

  const efDesign = getEyeFrame(frameId);
  const eiDesign = getEyeInner(innerId);

  // 1. Fill 7×7 block with bgColor first (clean slate)
  ctx.fillStyle = bgColor;
  ctx.fillRect(ex, ey, s7, s7);

  // 2. Draw eye frame (outer 7×7 ring)
  if (efDesign) {
    efDesign.draw(ctx, ex, ey, s7, frameColor);
  }

  // 3. Fill 5×5 with bg (clear inside of frame)
  ctx.fillStyle = bgColor;
  ctx.fillRect(ex + off1, ey + off1, s5, s5);

  // 4. Draw inner (3×3 block, centered)
  if (eiDesign) {
    eiDesign.draw(ctx, ex + off2, ey + off2, s3, innerColor);
  }
}

// ── Draw logo onto canvas ────────────────────────────────
async function drawLogoOnCanvas(ctx, cW, qrTop, qrH) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const lSize = qrH * (S.logoSize / 100);
      const lx    = (cW - lSize) / 2;
      const ly    = qrTop + (qrH - lSize) / 2;
      const pad   = S.logoPad;
      const br    = lSize * (S.logoBR / 100);

      if (S.logoRemoveBG) {
        ctx.fillStyle = S.logoPadColor;
        ctx.beginPath();
        rrect(ctx, lx - pad, ly - pad, lSize + pad * 2, lSize + pad * 2, br + pad);
        ctx.fill();
      }
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

// ── Draw decorative frame (from designs/frames.js) ───────
function drawFrameDesign(ctx, qx, qy, qs, opts) {
  const frm = getFrame(S.frame);
  if (!frm || frm.id === 'frm-none') return;
  frm.draw(ctx, qx, qy, qs, opts);
}

// ── Calculate extra space needed for frame ───────────────
function getFramePadding() {
  const frm = getFrame(S.frame);
  if (!frm || frm.id === 'frm-none') return { top: 0, bottom: 0, left: 0, right: 0 };

  const p = frm.padding || 20;
  const bh = frm.bannerH || (frm.hasText ? 52 : 0);
  const isTopBanner = frm.topBanner || false;

  return {
    top:    p + (isTopBanner ? bh : 0),
    bottom: p + (!isTopBanner && frm.hasText ? bh + 10 : 0),
    left:   p,
    right:  p,
  };
}

// ── MAIN RENDER ──────────────────────────────────────────
async function renderQR() {
  const data   = buildQRData();
  S.inputData  = data;
  const canvas = document.getElementById('qr-canvas');
  const empty  = document.getElementById('qr-empty');
  const actBtns = document.getElementById('action-btns');
  const infoRow = document.getElementById('qr-info-row');

  if (!data || !data.trim()) {
    canvas.style.display  = 'none';
    empty.style.display   = 'flex';
    if (actBtns) actBtns.style.display = 'none';
    if (infoRow) infoRow.style.display = 'none';
    resetAnalytics();
    return;
  }

  const loading = document.getElementById('qr-loading');
  if (loading) loading.style.display = 'flex';
  canvas.style.display = 'none';
  await new Promise(r => requestAnimationFrame(r));

  try {
    const modules = getMatrix(data, S.ec);
    if (!modules) throw new Error('Failed to parse QR matrix');

    const count  = modules.length;
    const qzMods = S.qz;
    const fp     = getFramePadding();

    // Total canvas: base size + quiet zone + frame padding
    const qrSize = S.size;
    const cW     = qrSize + fp.left + fp.right;
    const cH     = qrSize + fp.top  + fp.bottom;

    // Cell size based on QR area only
    const totalM = count + qzMods * 2;
    const cs     = qrSize / totalM;
    const qzPx   = qzMods * cs;

    const realBG = S.invert ? S.fgColor : S.bgColor;
    const realFG = S.invert ? S.bgColor : S.fgColor;

    canvas.width  = cW;
    canvas.height = cH;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, cW, cH);

    // ─ Shadow ─
    if (S.shadow) {
      ctx.shadowColor   = S.shadowColor;
      ctx.shadowBlur    = S.shadowBlur;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    }

    // ─ Background ─
    if (!S.transparent) {
      ctx.fillStyle = realBG;
      ctx.fillRect(0, 0, cW, cH);
    }
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

    // QR area top-left in canvas
    const qrX = fp.left;
    const qrY = fp.top;

    // Eye colors
    const markerBorder = S.customMarker ? S.mbColor : realFG;
    const markerCenter = S.customMarker ? S.mcColor : realFG;
    const eyeFrameC    = S.customEF ? S.efColor : markerBorder;
    const eyeInnerC    = S.customEI ? S.eiColor : markerCenter;

    // ─ Draw body modules ─
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (isInFinder(row, col, count)) continue;
        if (!modules[row][col]) continue;
        const x = qrX + qzPx + col * cs;
        const y = qrY + qzPx + row * cs;
        drawModule(ctx, x, y, cs, S.pattern, realFG);
      }
    }

    // ─ Gradient overlay ─
    if (S.gradient) {
      const rad = S.gAngle * Math.PI / 180;
      const dx  = Math.cos(rad), dy = Math.sin(rad);
      let grad;
      if (S.gType === 'linear') {
        grad = ctx.createLinearGradient(
          qrX + qrSize / 2 - dx * qrSize / 2, qrY + qrSize / 2 - dy * qrSize / 2,
          qrX + qrSize / 2 + dx * qrSize / 2, qrY + qrSize / 2 + dy * qrSize / 2
        );
      } else {
        grad = ctx.createRadialGradient(
          qrX + qrSize / 2, qrY + qrSize / 2, 0,
          qrX + qrSize / 2, qrY + qrSize / 2, qrSize / 2
        );
      }
      grad.addColorStop(0, S.gc1);
      grad.addColorStop(1, S.gc2);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = grad;
      ctx.fillRect(qrX, qrY, qrSize, qrSize);
      ctx.globalCompositeOperation = 'source-over';
    }

    // ─ Corner eyes ─
    const eyeOffsets = [
      { r: 0,         c: 0          }, // top-left
      { r: 0,         c: count - 7  }, // top-right
      { r: count - 7, c: 0          }, // bottom-left
    ];
    for (const ep of eyeOffsets) {
      const ex = qrX + qzPx + ep.c * cs;
      const ey = qrY + qzPx + ep.r * cs;
      drawEye(ctx, ex, ey, cs, S.eyeFrame, S.eyeInner, eyeFrameC, eyeInnerC, realBG);
    }

    // ─ Logo ─
    if (S.logoSrc) {
      await drawLogoOnCanvas(ctx, cW, qrY, qrSize);
    }

    // ─ Frame ─
    const frm = getFrame(S.frame);
    if (frm && frm.id !== 'frm-none') {
      drawFrameDesign(ctx, qrX, qrY, qrSize, {
        color:      S.frameColor,
        label:      S.frameLabel,
        font:       S.frameFont,
        textSize:   S.frameTSize,
        labelColor: S.frameLabelColor,
      });
    }

    // ─ Rotation / Flip ─
    if (S.rotation !== 0 || S.flipH || S.flipV) {
      applyCanvasTransform(canvas, cW, cH);
    }

    // ─ Show canvas ─
    canvas.style.display = 'block';
    empty.style.display  = 'none';
    if (actBtns) actBtns.style.display = 'flex';
    if (infoRow) infoRow.style.display = 'flex';
    canvas.style.filter = S.filter !== 'none' ? S.filter : '';

    updateAnalytics(count, data);

    // Auto-save to projects (debounced via project save logic)
    if (typeof autoSaveToProjects === 'function') {
      autoSaveToProjects(data);
    }

  } catch (e) {
    console.error('renderQR error:', e);
    showToast('QR generation error: ' + e.message, 'error');
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

// ── Apply canvas transform ───────────────────────────────
function applyCanvasTransform(canvas, cW, cH) {
  const tmp = document.createElement('canvas');
  tmp.width  = cW;
  tmp.height = cH;
  const tctx = tmp.getContext('2d');
  tctx.translate(cW / 2, cH / 2);
  if (S.rotation) tctx.rotate(S.rotation * Math.PI / 180);
  if (S.flipH) tctx.scale(-1, 1);
  if (S.flipV) tctx.scale(1, -1);
  tctx.drawImage(canvas, -cW / 2, -cH / 2);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, cW, cH);
  ctx.drawImage(tmp, 0, 0);
}

// ── Analytics ────────────────────────────────────────────
function updateAnalytics(count, data) {
  const chars    = data.length;
  const version  = getQRVersion(count);
  const scanScore = getScanScore(data);
  const safe = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  safe('bi-size',  S.size + 'px');
  safe('bi-ver',   version);
  safe('bi-mod',   count + '×' + count);
  safe('bi-chars', chars);
  safe('a-chars',   chars);
  safe('a-version', version);
  safe('a-modules', count + '×' + count);
  const sv = document.getElementById('a-scan');
  if (sv) { sv.textContent = scanScore.label; sv.style.color = scanScore.color; }

  const warnings = [];
  if (S.size < 200)    warnings.push('QR too small for reliable scanning (min 200px)');
  if (S.logoSize > 30) warnings.push('Large logo (>30%) may reduce scanability');
  if (chars > 300)     warnings.push('High data complexity — use higher EC level');
  ['warn-bar', 'warn-bar-prev'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (warnings.length) { el.style.display = 'flex'; el.textContent = '⚠️ ' + warnings[0]; }
    else el.style.display = 'none';
  });
}

function resetAnalytics() {
  ['a-chars','a-version','a-modules','a-scan','bi-size','bi-ver','bi-mod','bi-chars']
    .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '—'; });
  ['warn-bar','warn-bar-prev'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

function getQRVersion(count) {
  const sizes = [21,25,29,33,37,41,45,49,53,57,61,65,69,73,77,81,85,89,93,97,
                 101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177];
  const i = sizes.indexOf(count);
  return i >= 0 ? String(i + 1) : '?';
}

function getScanScore(data) {
  const len = data.length;
  if (len > 400 || S.logoSize > 35 || S.size < 150) return { label: 'Low',       color: '#e74c3c' };
  if (len > 200 || S.logoSize > 25 || S.size < 250) return { label: 'Medium',    color: '#f39c12' };
  if (len > 100)                                     return { label: 'Good',      color: '#2D9CDB' };
  return { label: 'Excellent', color: '#27AE60' };
}
