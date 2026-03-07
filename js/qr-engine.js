// =========================================================
// QR-ENGINE.JS — Canvas drawing, patterns, eyes, frame
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
  if (undoStack.length > 25) undoStack.shift();
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
      width: 100,
      height: 100,
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

// ── Check if a cell is part of a finder (eye) pattern ───
function isInFinder(row, col, count) {
  if (row <= 6 && col <= 6)            return true; // top-left
  if (row <= 6 && col >= count - 7)    return true; // top-right
  if (row >= count - 7 && col <= 6)    return true; // bottom-left
  return false;
}

// ── Rounded rect helper ──────────────────────────────────
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,   x + w, y + r,   r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x, y + h - r, r);
  ctx.lineTo(x,    y + r);
  ctx.arcTo(x,     y,     x + r, y,      r);
  ctx.closePath();
}

// ── Draw a 5-point star ──────────────────────────────────
function drawStar(ctx, cx, cy, spikes, ro, ri) {
  let rot = (Math.PI / 2) * 3, step = Math.PI / spikes;
  ctx.moveTo(cx, cy - ro);
  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * ro, cy + Math.sin(rot) * ro); rot += step;
    ctx.lineTo(cx + Math.cos(rot) * ri, cy + Math.sin(rot) * ri); rot += step;
  }
  ctx.closePath();
}

// ── Draw a diamond ───────────────────────────────────────
function drawDiamond(ctx, cx, cy, r) {
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r, cy);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r, cy);
  ctx.closePath();
}

// ── Draw a heart ─────────────────────────────────────────
function drawHeart(ctx, cx, cy, r) {
  ctx.moveTo(cx, cy + r * 0.6);
  ctx.bezierCurveTo(cx - r * 1.5, cy - r * 0.8, cx - r * 1.8, cy - r * 1.5, cx, cy - r * 0.7);
  ctx.bezierCurveTo(cx + r * 1.8, cy - r * 1.5, cx + r * 1.5, cy - r * 0.8, cx, cy + r * 0.6);
  ctx.closePath();
}

// ── Draw one QR module cell with a pattern shape ─────────
function drawModule(ctx, x, y, cs, pattern, color) {
  const gap = cs * 0.12;
  const mx = x + gap, my = y + gap, mw = cs - gap * 2, mh = cs - gap * 2;
  const cx2 = x + cs / 2, cy2 = y + cs / 2, r = mw / 2;

  ctx.beginPath();
  switch (pattern) {
    case 'square':
      ctx.rect(mx, my, mw, mh);
      break;
    case 'dots':
      ctx.arc(cx2, cy2, r, 0, Math.PI * 2);
      break;
    case 'rounded':
      rrect(ctx, mx, my, mw, mh, r * 0.4);
      break;
    case 'extra-rounded':
      rrect(ctx, mx, my, mw, mh, r * 0.72);
      break;
    case 'classy':
      ctx.moveTo(mx + r * 0.5, my);
      ctx.lineTo(mx + mw, my);
      ctx.lineTo(mx + mw, my + mh);
      ctx.lineTo(mx, my + mh);
      ctx.arcTo(mx, my, mx + r * 0.5, my, r * 0.5);
      ctx.closePath();
      break;
    case 'diamond':
      drawDiamond(ctx, cx2, cy2, r);
      break;
    case 'star':
      drawStar(ctx, cx2, cy2, 5, r, r * 0.46);
      break;
    case 'heart':
      drawHeart(ctx, cx2, cy2, r * 0.65);
      break;
    case 'plus':
      ctx.rect(mx + mw * 0.3, my, mw * 0.4, mh);
      ctx.rect(mx, my + mh * 0.3, mw, mh * 0.4);
      break;
    case 'cross':
      ctx.save();
      ctx.translate(cx2, cy2);
      ctx.rotate(Math.PI / 4);
      ctx.rect(-mw * 0.15, -mh / 2, mw * 0.3, mh);
      ctx.rect(-mw / 2,   -mh * 0.15, mw, mh * 0.3);
      ctx.restore();
      break;
    case 'h-lines':
      for (let i = 0; i < 3; i++) {
        const yy = my + (mh / 4) * (i + 0.5);
        ctx.rect(mx, yy, mw, mh * 0.15);
      }
      break;
    case 'v-lines':
      for (let i = 0; i < 3; i++) {
        const xx = mx + (mw / 4) * (i + 0.5);
        ctx.rect(xx, my, mw * 0.15, mh);
      }
      break;
    default:
      ctx.rect(mx, my, mw, mh);
  }

  ctx.fillStyle = color;
  ctx.fill();
}

// ── Draw one corner eye ──────────────────────────────────
function drawEye(ctx, ex, ey, cs, frameShape, innerShape, frameColor, innerColor, bgColor) {
  const s7 = cs * 7, s5 = cs * 5, s3 = cs * 3;
  const off1 = cs, off2 = cs * 2;
  const mid = ex + s7 / 2, mid2 = ey + s7 / 2;

  // ─ Draw outer frame (7×7 filled) ─
  ctx.fillStyle = frameColor;
  ctx.beginPath();
  switch (frameShape) {
    case 'rounded':
      rrect(ctx, ex, ey, s7, s7, cs * 0.9);
      break;
    case 'extra-rounded':
      rrect(ctx, ex, ey, s7, s7, cs * 1.5);
      break;
    case 'circle':
      ctx.arc(mid, mid2, s7 / 2, 0, Math.PI * 2);
      break;
    case 'diamond':
      drawDiamond(ctx, mid, mid2, s7 / 2);
      break;
    case 'dots':
      ctx.setLineDash([cs * 0.6, cs * 0.4]);
      ctx.strokeStyle = frameColor;
      ctx.lineWidth = cs * 0.9;
      ctx.strokeRect(ex + cs * 0.45, ey + cs * 0.45, s7 - cs * 0.9, s7 - cs * 0.9);
      ctx.setLineDash([]);
      // fill inner area manually later
      ctx.fillRect(ex + off1, ey + off1, s5, s5);
      break;
    default: // square
      ctx.rect(ex, ey, s7, s7);
  }
  ctx.fill();

  // ─ Clear 5×5 inner gap (bg color) ─
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  switch (frameShape) {
    case 'rounded':
      rrect(ctx, ex + off1, ey + off1, s5, s5, cs * 0.6);
      break;
    case 'extra-rounded':
      rrect(ctx, ex + off1, ey + off1, s5, s5, cs * 1.0);
      break;
    case 'circle':
      ctx.arc(mid, mid2, s5 / 2, 0, Math.PI * 2);
      break;
    case 'diamond':
      drawDiamond(ctx, mid, mid2, s5 / 2);
      break;
    default:
      ctx.rect(ex + off1, ey + off1, s5, s5);
  }
  ctx.fill();

  // ─ Draw 3×3 inner center ─
  ctx.fillStyle = innerColor;
  const icx = mid, icy = mid2, ir = s3 / 2;
  ctx.beginPath();
  switch (innerShape) {
    case 'circle':
      ctx.arc(icx, icy, ir, 0, Math.PI * 2);
      break;
    case 'rounded':
      rrect(ctx, ex + off2, ey + off2, s3, s3, cs * 0.4);
      break;
    case 'extra-rounded':
      rrect(ctx, ex + off2, ey + off2, s3, s3, cs * 0.85);
      break;
    case 'diamond':
      drawDiamond(ctx, icx, icy, ir);
      break;
    case 'star':
      drawStar(ctx, icx, icy, 5, ir, ir * 0.45);
      break;
    default: // square
      ctx.rect(ex + off2, ey + off2, s3, s3);
  }
  ctx.fill();
}

// ── Draw logo onto canvas ────────────────────────────────
async function drawLogoOnCanvas(ctx, cW, qrTop, qrH) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const lSize  = qrH * (S.logoSize / 100);
      const lx     = (cW - lSize) / 2;
      const ly     = qrTop + (qrH - lSize) / 2;
      const pad    = S.logoPad;
      const br     = lSize * (S.logoBR / 100);

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

// ── Draw frame around / below QR ─────────────────────────
function drawFrame(ctx, cW, cH, fTopH, fBotH, cs) {
  const fc = S.frameColor;

  if (S.frame === 'bottom-bar' || S.frame === 'top-bar') {
    const isTop = S.frame === 'top-bar';
    const barY  = isTop ? 0 : cH - fBotH;
    const barH  = isTop ? fTopH : fBotH;
    ctx.fillStyle = fc;
    ctx.beginPath();
    rrect(ctx, 0, barY, cW, barH, 10);
    ctx.fill();
    const fontSize = Math.max(12, cs * 1.2 * (S.frameTSize / 100));
    ctx.font = `bold ${fontSize}px ${S.frameFont}, sans-serif`;
    ctx.fillStyle = S.frameLabelColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(S.frameLabel, cW / 2, barY + barH / 2);

  } else if (S.frame === 'polaroid') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cW, fTopH);
    ctx.fillRect(0, cH - fBotH, cW, fBotH);
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, cW - 2, cH - 2);
    const fontSize = Math.max(12, cs * 1.3 * (S.frameTSize / 100));
    ctx.font = `bold ${fontSize}px ${S.frameFont}, sans-serif`;
    ctx.fillStyle = '#444444';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(S.frameLabel, cW / 2, cH - fBotH / 2);

  } else if (S.frame === 'square-thin') {
    ctx.strokeStyle = fc; ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, cW - 8, cH - 8);

  } else if (S.frame === 'square-thick') {
    ctx.strokeStyle = fc; ctx.lineWidth = 9;
    ctx.strokeRect(6, 6, cW - 12, cH - 12);

  } else if (S.frame === 'rounded-border') {
    ctx.strokeStyle = fc; ctx.lineWidth = 5;
    ctx.beginPath();
    rrect(ctx, 5, 5, cW - 10, cH - 10, cs);
    ctx.stroke();

  } else if (S.frame === 'circle-border') {
    ctx.strokeStyle = fc; ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(cW / 2, cH / 2, Math.min(cW, cH) / 2 - 8, 0, Math.PI * 2);
    ctx.stroke();

  } else if (S.frame === 'dashed-border') {
    ctx.strokeStyle = fc; ctx.lineWidth = 3;
    ctx.setLineDash([cs * 0.9, cs * 0.5]);
    ctx.strokeRect(6, 6, cW - 12, cH - 12);
    ctx.setLineDash([]);

  } else if (S.frame === 'bracket') {
    ctx.strokeStyle = fc; ctx.lineWidth = 4;
    const s = cs * 1.8;
    [[0, 0, 1, 1], [cW, 0, -1, 1], [0, cH, 1, -1], [cW, cH, -1, -1]].forEach(([bx, by, dx, dy]) => {
      ctx.beginPath();
      ctx.moveTo(bx + dx * s, by);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx, by + dy * s);
      ctx.stroke();
    });
  }
}

// ── MAIN RENDER ──────────────────────────────────────────
async function renderQR() {
  const data    = buildQRData();
  S.inputData   = data;
  const canvas  = document.getElementById('qr-canvas');
  const empty   = document.getElementById('qr-empty');
  const actBtns = document.getElementById('action-btns');
  const infoRow = document.getElementById('qr-info-row');

  if (!data || !data.trim()) {
    canvas.style.display = 'none';
    empty.style.display  = 'flex';
    actBtns.style.display = 'none';
    infoRow.style.display = 'none';
    resetAnalytics();
    return;
  }

  document.getElementById('qr-loading').style.display = 'flex';
  canvas.style.display = 'none';
  await new Promise(r => requestAnimationFrame(r));

  try {
    const modules = getMatrix(data, S.ec);
    if (!modules) throw new Error('Failed to parse QR matrix');

    const count  = modules.length;
    const qzMods = S.qz;             // quiet zone in modules
    const totalM = count + qzMods * 2;
    const cs     = S.size / totalM;  // cell size in px
    const qzPx   = qzMods * cs;      // quiet zone in px
    const realBG = S.invert ? S.fgColor : S.bgColor;
    const realFG = S.invert ? S.bgColor : S.fgColor;

    // Frame space
    let fTopH = 0, fBotH = 0;
    if (S.frame === 'bottom-bar') fBotH = cs * 3.8;
    else if (S.frame === 'top-bar') fTopH = cs * 3.8;
    else if (S.frame === 'polaroid') { fTopH = cs * 0.6; fBotH = cs * 5; }

    const cW = S.size;
    const cH = S.size + fTopH + fBotH;
    canvas.width  = cW;
    canvas.height = cH;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, cW, cH);

    // ─ Background ─
    if (S.shadow) {
      ctx.shadowColor   = S.shadowColor;
      ctx.shadowBlur    = S.shadowBlur;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;
    }
    if (!S.transparent) {
      ctx.fillStyle = realBG;
      ctx.fillRect(0, 0, cW, cH);
    }
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

    const qrY = fTopH; // top offset of the QR area

    // ─ Marker / Eye colors ─
    const markerBorder = S.customMarker ? S.mbColor : realFG;
    const markerCenter = S.customMarker ? S.mcColor : realFG;
    const eyeFrameC    = S.customEF ? S.efColor : markerBorder;
    const eyeInnerC    = S.customEI ? S.eiColor : markerCenter;

    // ─ Draw QR body modules ─
    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (isInFinder(row, col, count)) continue;
        if (!modules[row][col]) continue;
        const x = qzPx + col * cs;
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
          cW / 2 - dx * cW / 2, qrY + S.size / 2 - dy * S.size / 2,
          cW / 2 + dx * cW / 2, qrY + S.size / 2 + dy * S.size / 2
        );
      } else {
        grad = ctx.createRadialGradient(cW / 2, qrY + S.size / 2, 0, cW / 2, qrY + S.size / 2, S.size / 2);
      }
      grad.addColorStop(0, S.gc1);
      grad.addColorStop(1, S.gc2);
      ctx.globalCompositeOperation = 'source-atop';
      ctx.fillStyle = grad;
      ctx.fillRect(0, qrY, cW, S.size);
      ctx.globalCompositeOperation = 'source-over';
    }

    // ─ Draw corner eyes ─
    const eyeOffsets = [
      { r: 0,         c: 0 },         // top-left
      { r: 0,         c: count - 7 }, // top-right
      { r: count - 7, c: 0 },         // bottom-left
    ];
    for (const ep of eyeOffsets) {
      const ex = qzPx + ep.c * cs;
      const ey = qrY  + qzPx + ep.r * cs;
      drawEye(ctx, ex, ey, cs, S.eyeFrame, S.eyeInner, eyeFrameC, eyeInnerC, realBG);
    }

    // ─ Logo overlay ─
    if (S.logoSrc) {
      await drawLogoOnCanvas(ctx, cW, qrY, S.size);
    }

    // ─ Frame ─
    if (S.frame !== 'none') {
      drawFrame(ctx, cW, cH, fTopH, fBotH, cs);
    }

    // ─ Transforms: rotation + flip ─
    if (S.rotation !== 0 || S.flipH || S.flipV) {
      applyCanvasTransform(canvas, cW, cH);
    }

    // ─ Show result ─
    canvas.style.display = 'block';
    empty.style.display  = 'none';
    actBtns.style.display = 'flex';
    infoRow.style.display = 'flex';
    canvas.style.filter   = S.filter !== 'none' ? S.filter : '';

    updateAnalytics(count, data);
    saveHistory(data);

  } catch (e) {
    console.error('renderQR error:', e);
    showToast('QR generation error: ' + e.message, 'error');
  } finally {
    document.getElementById('qr-loading').style.display = 'none';
  }
}

// ── Apply canvas transform (rotation / flip) ─────────────
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

// ── Analytics update ─────────────────────────────────────
function updateAnalytics(count, data) {
  const chars    = data.length;
  const version  = getQRVersion(count);
  const scanScore = getScanScore(data);

  // Info badges
  const safe = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  safe('bi-size',  S.size + 'px');
  safe('bi-ver',   version);
  safe('bi-mod',   count + '×' + count);
  safe('bi-chars', chars);

  // Analytics panel
  safe('a-chars',   chars);
  safe('a-version', version);
  safe('a-modules', count + '×' + count);
  const sv = document.getElementById('a-scan');
  if (sv) { sv.textContent = scanScore.label; sv.style.color = scanScore.color; }

  // Warnings
  const warnings = [];
  if (S.size < 200)     warnings.push('QR size is too small for reliable scanning');
  if (S.logoSize > 30)  warnings.push('Logo > 30% may affect scanning');
  if (chars > 300)      warnings.push('Large data increases QR complexity');
  if (S.fgColor === S.bgColor) warnings.push('Foreground and background are the same color');

  const wbP = document.getElementById('warn-bar-prev');
  const wbA = document.getElementById('warn-bar');
  const show = warnings.length > 0;
  const txt  = show ? ('⚠️ ' + warnings[0]) : '';
  if (wbP) { wbP.style.display = show ? 'flex' : 'none'; wbP.textContent = txt; }
  if (wbA) { wbA.style.display = show ? 'flex' : 'none'; wbA.textContent = txt; }
}

function resetAnalytics() {
  ['a-chars','a-version','a-modules','a-scan','bi-size','bi-ver','bi-mod','bi-chars']
    .forEach(id => { const el = document.getElementById(id); if (el) el.textContent = '—'; });
  const wbP = document.getElementById('warn-bar-prev');
  const wbA = document.getElementById('warn-bar');
  if (wbP) wbP.style.display = 'none';
  if (wbA) wbA.style.display = 'none';
}

function getQRVersion(count) {
  const sizes = [21,25,29,33,37,41,45,49,53,57,61,65,69,73,77,81,85,89,93,97,
                 101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177];
  const i = sizes.indexOf(count);
  return i >= 0 ? String(i + 1) : '?';
}

function getScanScore(data) {
  const len = data.length;
  if (len > 400 || S.logoSize > 35 || S.size < 150)
    return { label: 'Low',       color: '#e74c3c' };
  if (len > 200 || S.logoSize > 25 || S.size < 250)
    return { label: 'Medium',    color: '#f39c12' };
  if (len > 100)
    return { label: 'Good',      color: '#2D9CDB' };
  return { label: 'Excellent',   color: '#27AE60' };
}
