// =========================================================
// QR-ENGINE.JS — QR Prism v2.8
// Canvas-based QR rendering: patterns, gradients, eye colors,
// transparency, logo, frames, shadow, undo/redo, autosave
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

let _renderTimer    = null;
let _autoSaveTimer  = null;
let _isRendering    = false;
let _lastData       = null;

// ══════════════════════════════════════════════════════════
// DEBOUNCED RENDER TRIGGER
// ══════════════════════════════════════════════════════════
function schedRender(immediate = false) {
  // Push current state to undo stack before change
  if (!immediate && _lastData !== null) {
    pushUndo();
  }
  clearTimeout(_renderTimer);
  _renderTimer = setTimeout(renderQR, immediate ? 0 : 300);
}

// ══════════════════════════════════════════════════════════
// DESIGN LOOKUP HELPERS
// ══════════════════════════════════════════════════════════
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

// ══════════════════════════════════════════════════════════
// QR MATRIX EXTRACTION
// Uses qrcodejs internally, extracts the modules boolean matrix
// ══════════════════════════════════════════════════════════
function getMatrix(data, ec) {
  try {
    const tmp = document.createElement('div');
    tmp.style.cssText = 'position:fixed;left:-99999px;top:-99999px;visibility:hidden;';
    document.body.appendChild(tmp);

    const qrInst = new QRCode(tmp, {
      text:         data || ' ',
      width:        256,
      height:       256,
      correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
    });

    let modules = null;

    // qrcodejs stores the oQRCode on the instance
    if (qrInst._oQRCode) {
      modules = qrInst._oQRCode.modules;
    }

    // Fallback: read from canvas pixel data
    if (!modules) {
      const canvas = tmp.querySelector('canvas');
      if (canvas) modules = extractModulesFromCanvas(canvas);
    }

    document.body.removeChild(tmp);
    return modules;
  } catch (e) {
    console.error('[QR] Matrix extraction failed:', e);
    return null;
  }
}

/** Fallback: derive module matrix from a rendered QR canvas */
function extractModulesFromCanvas(canvas) {
  const size = canvas.width;
  const ctx  = canvas.getContext('2d');
  const data = ctx.getImageData(0, 0, size, size).data;

  // Estimate module count by finding transitions
  // Scan first row to count dark/light runs
  let runs = 0; let prev = -1;
  for (let x = 0; x < size; x++) {
    const i = x * 4;
    const dark = data[i] < 128 ? 1 : 0;
    if (dark !== prev) { runs++; prev = dark; }
  }
  const count = Math.round((runs - 1) / 2);
  if (count < 21 || count > 177) return null;

  const cs = size / count;
  const modules = [];
  for (let r = 0; r < count; r++) {
    modules[r] = [];
    for (let c = 0; c < count; c++) {
      const px = Math.round(c * cs + cs / 2);
      const py = Math.round(r * cs + cs / 2);
      const i  = (py * size + px) * 4;
      modules[r][c] = data[i] < 128;
    }
  }
  return modules;
}

// ══════════════════════════════════════════════════════════
// FINDER PATTERN DETECTION
// Rows/cols that belong to the 3 corner "eye" squares
// ══════════════════════════════════════════════════════════
function isInFinder(row, col, count) {
  return (row < 7 && col < 7) ||
         (row < 7 && col >= count - 7) ||
         (row >= count - 7 && col < 7);
}

// ══════════════════════════════════════════════════════════
// CANVAS DRAWING HELPERS
// ══════════════════════════════════════════════════════════

/** Rounded-rectangle path */
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(Math.abs(r), w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y,     x + r, y, r);
  ctx.closePath();
}

/**
 * Build a gradient fill for the QR body (foreground gradient).
 * Returns a CanvasGradient or null (if solid).
 */
function buildFGGradient(ctx, qrX, qrY, qrSize) {
  if (!S.fgGradient) return null;
  if (S.gType === 'radial') {
    return ctx.createRadialGradient(
      qrX + qrSize / 2, qrY + qrSize / 2, 0,
      qrX + qrSize / 2, qrY + qrSize / 2, qrSize * 0.72
    );
  }
  const rad = (S.gAngle || 45) * Math.PI / 180;
  const dx  = Math.cos(rad) * qrSize / 2;
  const dy  = Math.sin(rad) * qrSize / 2;
  const cx  = qrX + qrSize / 2;
  const cy  = qrY + qrSize / 2;
  return ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
}

/** Build a background gradient */
function buildBGGradient(ctx, w, h) {
  if (S.bgMode !== 'gradient') return null;
  if (S.bgGType === 'radial') {
    return ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.72);
  }
  const rad = (S.bgGAngle || 135) * Math.PI / 180;
  const dx  = Math.cos(rad) * w / 2;
  const dy  = Math.sin(rad) * h / 2;
  return ctx.createLinearGradient(w/2 - dx, h/2 - dy, w/2 + dx, h/2 + dy);
}

/**
 * Draw a single data module.
 * gap: 0.0–0.20 fraction to shrink module inward
 */
function drawModule(ctx, x, y, cs, patternId, color, gap = 0) {
  ctx.fillStyle = color;
  const g = cs * gap / 2;
  const mx = x + g, my = y + g, mw = cs - g * 2;

  const pat = getPattern(patternId);
  if (pat && pat.draw) {
    try {
      pat.draw(ctx, mx, my, mw, color);
      return;
    } catch {}
  }
  // Fallback: square
  ctx.fillRect(mx, my, mw, mw);
}

/**
 * Draw one finder-eye at (ex, ey).
 *
 * Key design rule (V2.8):
 *  - Eye frame outer ring is drawn
 *  - Space between outer ring and inner dot is TRANSPARENT
 *    (cleared back to nothing when customEyeColors is active,
 *     or filled with bgColor when not using custom colors)
 *  - Inner dot is drawn
 */
function drawEye(ctx, ex, ey, cs, frameId, innerId, frameColor, innerColor, bgColor, transparent, scale = 1) {
  const base = cs * 7;
  const s    = base * scale;
  // Center the scaled eye at the same position
  const offX = (base - s) / 2;
  const offY = (base - s) / 2;
  const x    = ex + offX;
  const y    = ey + offY;

  const s5 = s * (5/7);
  const s3 = s * (3/7);
  const o1 = s * (1/7);
  const o2 = s * (2/7);

  // ── Step 1: Clear the full 7×7 block ────────────────────
  ctx.clearRect(ex, ey, base, base);

  // ── Step 2: Refill with background (unless transparent) ──
  if (!transparent) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(ex, ey, base, base);
  }

  // ── Step 3: Draw outer frame ──────────────────────────────
  const efDesign = getEyeFrame(frameId);
  if (efDesign && efDesign.draw) {
    try { efDesign.draw(ctx, x, y, s, frameColor); } catch {}
  } else {
    // Default square frame
    ctx.fillStyle = frameColor;
    ctx.fillRect(x, y, s, s);
    ctx.clearRect(x + o1, y + o1, s5, s5);
    if (!transparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(x + o1, y + o1, s5, s5);
    }
  }

  // ── Step 4: Clear the inner 5×5 area (transparent gap) ───
  ctx.clearRect(x + o1, y + o1, s5, s5);
  if (!transparent) {
    ctx.fillStyle = bgColor;
    ctx.fillRect(x + o1, y + o1, s5, s5);
  }

  // ── Step 5: Draw inner dot (3×3 equivalent) ───────────────
  const eiDesign = getEyeInner(innerId);
  if (eiDesign && eiDesign.draw) {
    try { eiDesign.draw(ctx, x + o2, y + o2, s3, innerColor); } catch {}
  } else {
    ctx.fillStyle = innerColor;
    ctx.fillRect(x + o2, y + o2, s3, s3);
  }
}

// ══════════════════════════════════════════════════════════
// FRAME PADDING CALCULATION
// ══════════════════════════════════════════════════════════
function getFramePadding() {
  const frm = getFrame(S.frame);
  if (!frm || frm.id === 'frm-none') return { top: 0, bottom: 0, left: 0, right: 0 };

  const hasLabel = frm.hasText !== false;
  const basePad  = hasLabel ? (S.framePad || 16) : (S.framePad2 || 16);
  const bannerH  = frm.bannerH || (hasLabel ? 52 : 0);

  if (frm.topBanner) {
    return { top: bannerH + basePad, bottom: basePad, left: basePad, right: basePad };
  }
  return { top: basePad, bottom: hasLabel ? bannerH + basePad : basePad, left: basePad, right: basePad };
}

// ══════════════════════════════════════════════════════════
// LOGO OVERLAY
// ══════════════════════════════════════════════════════════
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

      if (S.logoRemoveBG || pad > 0) {
        ctx.fillStyle = S.logoPadColor || '#ffffff';
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

// ══════════════════════════════════════════════════════════
// CANVAS TRANSFORM (rotation / flip)
// ══════════════════════════════════════════════════════════
function applyCanvasTransform(canvas, w, h) {
  const tmp    = document.createElement('canvas');
  tmp.width    = w; tmp.height = h;
  const tctx   = tmp.getContext('2d');
  tctx.save();
  tctx.translate(w / 2, h / 2);
  if (S.rotation) tctx.rotate(S.rotation * Math.PI / 180);
  if (S.flipH)    tctx.scale(-1,  1);
  if (S.flipV)    tctx.scale( 1, -1);
  tctx.drawImage(canvas, -w / 2, -h / 2);
  tctx.restore();
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tmp, 0, 0);
}

// ══════════════════════════════════════════════════════════
// MAIN RENDER FUNCTION
// ══════════════════════════════════════════════════════════
async function renderQR() {
  if (_isRendering) return;   // prevent concurrent renders
  _isRendering = true;

  const data = buildQRData();
  S.inputData = data;

  const canvas    = document.getElementById('qr-canvas');
  const empty     = document.getElementById('qr-empty');
  const loading   = document.getElementById('qr-loading');
  const actBtns   = document.getElementById('action-btns');
  const infoRow   = document.getElementById('qr-info-row');
  const analytics = document.getElementById('adv-analytics');
  const advHdr    = document.getElementById('adv-analytics-header');

  if (!canvas) { _isRendering = false; return; }

  // ── Empty state ────────────────────────────────────────
  if (!data || !data.trim()) {
    canvas.style.display = 'none';
    if (empty)    empty.style.display    = 'flex';
    if (actBtns)  actBtns.style.display  = 'none';
    if (infoRow)  infoRow.style.display  = 'none';
    if (analytics) analytics.style.display = 'none';
    if (advHdr)    advHdr.style.display    = 'none';
    resetAnalytics();
    setAutosaveStatus('waiting');
    _lastData   = null;
    _isRendering = false;
    return;
  }

  // ── Show loading spinner ───────────────────────────────
  if (loading) loading.style.display = 'flex';
  canvas.style.display = 'none';
  if (empty) empty.style.display = 'none';
  await new Promise(r => requestAnimationFrame(r));

  try {
    const modules = getMatrix(data, S.ec);
    if (!modules || !modules.length) throw new Error('QR generation failed — check input data');

    const count  = modules.length;
    const qzMods = Math.max(0, S.qz || 0);
    const fp     = getFramePadding();

    const qrSize  = Math.max(100, Math.min(4000, S.size || 600));
    const totalM  = count + qzMods * 2;
    const cs      = qrSize / totalM;
    const qzPx    = qzMods * cs;
    const gap     = Math.max(0, Math.min(0.20, S.moduleGap || 0));
    const eyeScale = Math.max(0.70, Math.min(1.30, S.eyeScale || 1));

    const canvasW = qrSize + fp.left + fp.right;
    const canvasH = qrSize + fp.top  + fp.bottom;
    const qrX     = fp.left;
    const qrY     = fp.top;

    // Invert: swap FG/BG roles
    const realBG = S.invert ? S.fgColor : S.bgColor;
    const realFG = S.invert ? S.bgColor : S.fgColor;

    // Transparent mode
    const isTransparent = (S.bgMode === 'transparent');

    // ── Setup canvas ─────────────────────────────────────
    canvas.width  = canvasW;
    canvas.height = canvasH;
    canvas.style.width  = canvasW + 'px';
    canvas.style.height = canvasH + 'px';

    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.clearRect(0, 0, canvasW, canvasH);

    // ── Shadow ────────────────────────────────────────────
    if (S.shadow) {
      ctx.shadowColor   = S.shadowColor   || 'rgba(0,0,0,0.35)';
      ctx.shadowBlur    = S.shadowBlur    || 10;
      ctx.shadowOffsetX = S.shadowX       || 0;
      ctx.shadowOffsetY = S.shadowY       || 4;
    }

    // ── Background fill ───────────────────────────────────
    if (!isTransparent) {
      if (S.bgMode === 'gradient') {
        const bgGrad = buildBGGradient(ctx, canvasW, canvasH);
        bgGrad.addColorStop(0, S.bgGc1 || '#ffffff');
        bgGrad.addColorStop(1, S.bgGc2 || '#f0f0ff');
        ctx.fillStyle = bgGrad;
      } else {
        ctx.fillStyle = realBG;
      }
      ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // Reset shadow after background (so modules don't get extra shadow)
    ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;

    // ── Determine eye colors ───────────────────────────────
    let efColor, eiColor;
    if (S.customEyeColors) {
      efColor = S.efColor || realFG;
      eiColor = S.eiColor || realFG;
    } else {
      efColor = realFG;
      eiColor = realFG;
    }

    // ── Build FG gradient (if enabled) ────────────────────
    // We draw body on an offscreen canvas, apply gradient via composite
    let fgGrad = null;
    if (S.fgGradient) {
      fgGrad = buildFGGradient(ctx, qrX + qzPx, qrY + qzPx, count * cs);
      if (fgGrad) {
        fgGrad.addColorStop(0, S.gc1 || realFG);
        fgGrad.addColorStop(1, S.gc2 || realFG);
      }
    }

    // ── Draw body modules ──────────────────────────────────
    // Use offscreen canvas if gradient, so we can composite properly
    const bodyCanvas = fgGrad ? document.createElement('canvas') : canvas;
    if (fgGrad) {
      bodyCanvas.width  = canvasW;
      bodyCanvas.height = canvasH;
    }
    const bodyCtx = fgGrad ? bodyCanvas.getContext('2d', { alpha: true }) : ctx;
    if (fgGrad) bodyCtx.clearRect(0, 0, canvasW, canvasH);

    const bodyColor = fgGrad ? '#000000' : realFG; // temp black for gradient mask

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (isInFinder(row, col, count)) continue;
        if (!modules[row][col]) continue;
        const x = qrX + qzPx + col * cs;
        const y = qrY + qzPx + row * cs;
        drawModule(bodyCtx, x, y, cs, S.pattern, bodyColor, gap);
      }
    }

    // Apply gradient via composite if needed
    if (fgGrad) {
      bodyCtx.globalCompositeOperation = 'source-in';
      bodyCtx.fillStyle = fgGrad;
      bodyCtx.fillRect(0, 0, canvasW, canvasH);
      bodyCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(bodyCanvas, 0, 0);
    }

    // ── Draw the 3 corner eyes ─────────────────────────────
    const eyePositions = [
      { r: 0,         c: 0         },
      { r: 0,         c: count - 7 },
      { r: count - 7, c: 0         },
    ];

    // If custom eye colors have gradients, build them per-eye on offscreen canvas
    for (const ep of eyePositions) {
      const ex = qrX + qzPx + ep.c * cs;
      const ey = qrY + qzPx + ep.r * cs;

      if (S.customEyeColors && (S.efGradient || S.eiGradient)) {
        drawEyeWithGradient(ctx, ex, ey, cs, eyeScale, realBG, isTransparent);
      } else {
        drawEye(ctx, ex, ey, cs, S.eyeFrame, S.eyeInner,
          efColor, eiColor, realBG, isTransparent, eyeScale);
      }
    }

    // ── Logo ───────────────────────────────────────────────
    if (S.logoSrc) {
      await drawLogoOnCanvas(ctx, canvasW, qrY + qzPx, count * cs);
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
          pad:        fp,
        });
      } catch {}
    }

    // ── Transforms (rotation / flip) ──────────────────────
    if (S.rotation !== 0 || S.flipH || S.flipV) {
      applyCanvasTransform(canvas, canvasW, canvasH);
    }

    // ── CSS filter ────────────────────────────────────────
    canvas.style.filter = (S.filter && S.filter !== 'none') ? S.filter : '';

    // ── Show canvas, hide empty state ─────────────────────
    canvas.style.display = 'block';
    if (empty)    empty.style.display    = 'none';
    if (actBtns)  actBtns.style.display  = 'flex';
    if (infoRow)  infoRow.style.display  = 'flex';
    if (analytics) analytics.style.display = 'grid';
    if (advHdr)    advHdr.style.display    = 'flex';

    // ── Update info / analytics ────────────────────────────
    updateAnalytics(count, data, canvasW, canvasH);

    // ── Update sticky mini bar ─────────────────────────────
    updateStickyMiniQR(canvas);

    // ── Schedule autosave ──────────────────────────────────
    _lastData = data;
    scheduleAutoSave(data);
    updateUndoRedoBtns();

  } catch (e) {
    console.error('[QR Render]', e);
    if (empty) { empty.style.display = 'flex'; empty.querySelector('p').textContent = 'Render error: ' + e.message; }
    canvas.style.display = 'none';
  } finally {
    if (loading) loading.style.display = 'none';
    _isRendering = false;
  }
}

// ══════════════════════════════════════════════════════════
// EYE WITH GRADIENT (advanced)
// ══════════════════════════════════════════════════════════
function drawEyeWithGradient(ctx, ex, ey, cs, scale, bgColor, isTransparent) {
  // Draw on temp canvas then composite
  const base = cs * 7;
  const tmp  = document.createElement('canvas');
  tmp.width  = base; tmp.height = base;
  const tc   = tmp.getContext('2d', { alpha: true });

  // Frame gradient
  let efFill = S.efColor || '#000000';
  if (S.efGradient) {
    const g = tc.createLinearGradient(0, 0, base, base);
    g.addColorStop(0, S.efc1 || S.efColor || '#818CF8');
    g.addColorStop(1, S.efc2 || S.efColor || '#C084FC');
    efFill = g;
  }
  // Inner gradient
  let eiFill = S.eiColor || '#000000';
  if (S.eiGradient) {
    const g = tc.createLinearGradient(0, 0, base, base);
    g.addColorStop(0, S.eic1 || S.eiColor || '#818CF8');
    g.addColorStop(1, S.eic2 || S.eiColor || '#C084FC');
    eiFill = g;
  }

  drawEye(tc, 0, 0, cs, S.eyeFrame, S.eyeInner,
    efFill, eiFill, bgColor, isTransparent, scale);

  ctx.drawImage(tmp, ex, ey);
}

// ══════════════════════════════════════════════════════════
// STICKY MINI QR (mobile bar)
// ══════════════════════════════════════════════════════════
function updateStickyMiniQR(sourceCanvas) {
  const mini = document.getElementById('sqb-canvas');
  if (!mini) return;
  mini.width  = 44;
  mini.height = 44;
  const ctx = mini.getContext('2d');
  ctx.clearRect(0, 0, 44, 44);
  ctx.drawImage(sourceCanvas, 0, 0, 44, 44);

  const typeEl  = document.getElementById('sqb-type');
  const charsEl = document.getElementById('sqb-chars');
  const typDef  = QR_TYPES.find(t => t.key === S.activeType);
  if (typeEl)  typeEl.textContent  = typDef?.title || S.activeType;
  if (charsEl) charsEl.textContent = (S.inputData?.length || 0) + ' chars';
}

// Show/hide sticky bar based on scroll (mobile)
function initStickyQRBar() {
  const qrWrap = document.getElementById('qr-wrap');
  const bar    = document.getElementById('sticky-qr-bar');
  if (!qrWrap || !bar) return;

  const obs = new IntersectionObserver((entries) => {
    const hidden = entries[0].intersectionRatio < 0.1;
    const hasDat = S.inputData && S.inputData.trim().length > 0;
    if (bar) bar.style.display = (hidden && hasDat) ? 'flex' : 'none';
  }, { threshold: 0.1 });

  obs.observe(qrWrap);
}

function scrollToPreview() {
  document.getElementById('qr-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ══════════════════════════════════════════════════════════
// ANALYTICS
// ══════════════════════════════════════════════════════════
function updateAnalytics(count, data, canvasW, canvasH) {
  const chars   = data.length;
  const version = getQRVersion(count);
  const scan    = getScanabilityScore(data);

  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  set('bi-size',   canvasW + '×' + canvasH + 'px');
  set('bi-ver',    version);
  set('bi-mod',    count + '×' + count);
  set('bi-chars',  chars);
  set('a-chars',   chars);
  set('a-version', 'v' + version);
  set('a-modules', count + '×' + count);

  const sv = document.getElementById('a-scan');
  if (sv) { sv.textContent = scan.label; sv.style.color = scan.color; }

  // Warnings
  const warns = [];
  if (S.size < 150)    warns.push('Size under 150px — may not print clearly');
  if (S.logoSize > 30 && S.ec !== 'H') warns.push('Logo > 30% — use Error Correction H');
  if (chars > 300)     warns.push('Large payload — QR may be dense, use H or Q correction');
  if (S.bgMode === 'transparent' && (S.fgColor === '#ffffff' || S.fgColor === 'white'))
    warns.push('White modules on transparent background won\'t be visible');

  ['warn-bar', 'warn-bar-prev'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (warns.length) {
      el.style.display = 'block';
      el.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> ' + warns[0];
    } else {
      el.style.display = 'none';
    }
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

/**
 * Scanability score — 5 levels: Excellent / Good / Fair / Low / Poor
 * Considers: data length, logo size, EC level, QR size, contrast
 */
function getScanabilityScore(data) {
  const len = data?.length || 0;
  let score = 100;

  // Penalty: long data
  if (len > 500)      score -= 40;
  else if (len > 300) score -= 25;
  else if (len > 150) score -= 12;

  // Penalty: logo too large
  if (S.logoSrc) {
    if (S.logoSize > 35) score -= 30;
    else if (S.logoSize > 28) score -= 15;
    else score -= 5;
  }

  // Penalty: small output size
  if (S.size < 150)  score -= 30;
  else if (S.size < 250) score -= 10;

  // Penalty: low EC with logo
  if (S.logoSrc && S.ec === 'L') score -= 25;
  else if (S.logoSrc && S.ec === 'M') score -= 10;

  // Penalty: transparent bg (scanners may struggle)
  if (S.bgMode === 'transparent') score -= 10;

  // Penalty: heavy CSS filter
  if (S.filter && S.filter !== 'none') score -= 8;

  score = Math.max(0, Math.min(100, score));

  if (score >= 85) return { label: 'Excellent', color: '#34D399', score, level: 4 };
  if (score >= 65) return { label: 'Good',      color: '#60A5FA', score, level: 3 };
  if (score >= 45) return { label: 'Fair',      color: '#FBBF24', score, level: 2 };
  if (score >= 25) return { label: 'Low',       color: '#FB923C', score, level: 1 };
  return              { label: 'Poor',      color: '#F87171', score, level: 0 };
}

// ── Scanability modal content ─────────────────────────────
function openScanabilityModal() {
  const scan = getScanabilityScore(S.inputData || '');
  const container = document.getElementById('scanability-content');
  if (!container) { openModal('scanability-modal'); return; }

  const levels = [
    { level: 4, label: 'Excellent', color: '#34D399', desc: 'Great contrast, short data, no logo issues. Will scan from far away.' },
    { level: 3, label: 'Good',      color: '#60A5FA', desc: 'Scans reliably in most conditions. Minor density or logo concern.' },
    { level: 2, label: 'Fair',      color: '#FBBF24', desc: 'May struggle in poor lighting or at small sizes. Review warnings.' },
    { level: 1, label: 'Low',       color: '#FB923C', desc: 'Likely scan failures. Reduce data, increase EC level, or remove logo.' },
    { level: 0, label: 'Poor',      color: '#F87171', desc: 'Will likely fail to scan. Major changes needed.' },
  ];

  container.innerHTML = `
    <div class="scanability-score-big">
      <div class="scan-score-num" style="color:${scan.color};">${scan.score}</div>
      <div class="scan-score-label" style="color:${scan.color}; font-weight:700;">${scan.label}</div>
      <div style="font-size:.72rem;color:var(--text3);margin-top:4px;">out of 100</div>
    </div>
    <div class="scanability-levels">
      ${levels.map(l => `
        <div class="scan-level ${l.level === scan.level ? 'current' : ''}">
          <div class="scan-level-dot" style="background:${l.color};"></div>
          <div class="scan-level-info">
            <div class="scan-level-name" style="color:${l.level === scan.level ? l.color : ''}">${l.label}</div>
            <div class="scan-level-desc">${l.desc}</div>
          </div>
          ${l.level === scan.level ? `<i class="fa-solid fa-chevron-left" style="color:${l.color};font-size:.8rem;"></i>` : ''}
        </div>
      `).join('')}
    </div>`;

  openModal('scanability-modal');
}

// ══════════════════════════════════════════════════════════
// AUTOSAVE STATUS
// ══════════════════════════════════════════════════════════
function setAutosaveStatus(state) {
  const dot = document.getElementById('autosave-dot');
  const txt = document.getElementById('autosave-txt');
  const map = {
    waiting: { cls: '',       text: 'Ready'       },
    saving:  { cls: 'saving', text: 'Saving…'     },
    saved:   { cls: 'saved',  text: 'Auto-saved'  },
    error:   { cls: 'error',  text: 'Save failed' },
  };
  const s = map[state] || map.waiting;
  if (dot) dot.className = 'autosave-dot ' + s.cls;
  if (txt) txt.textContent = s.text;
}

function scheduleAutoSave(data) {
  if (!SETTINGS.autoSaveProjects) return;
  clearTimeout(_autoSaveTimer);
  setAutosaveStatus('saving');
  _autoSaveTimer = setTimeout(() => {
    if (typeof autoSaveToProjects === 'function') {
      try {
        autoSaveToProjects(data);
        setAutosaveStatus('saved');
      } catch {
        setAutosaveStatus('error');
      }
    } else {
      setAutosaveStatus('saved');
    }
  }, 1000);
}

// ══════════════════════════════════════════════════════════
// UNDO / REDO
// ══════════════════════════════════════════════════════════
function pushUndo() {
  // Snapshot current S (skip logoSrc blob to keep size manageable)
  const snap = {};
  Object.keys(S).forEach(k => { if (k !== 'logoSrc') snap[k] = S[k]; });
  _undoStack.push(JSON.stringify(snap));
  if (_undoStack.length > MAX_UNDO) _undoStack.shift();
  _redoStack.length = 0;   // clear redo on new action
  updateUndoRedoBtns();
}

function undoQR() {
  if (!_undoStack.length) { showToast('Nothing to undo', 'info'); return; }
  const cur = {};
  Object.keys(S).forEach(k => { if (k !== 'logoSrc') cur[k] = S[k]; });
  _redoStack.push(JSON.stringify(cur));

  const prev = JSON.parse(_undoStack.pop());
  Object.assign(S, prev);

  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  renderQR();
  updateUndoRedoBtns();
}

function redoQR() {
  if (!_redoStack.length) { showToast('Nothing to redo', 'info'); return; }
  const cur = {};
  Object.keys(S).forEach(k => { if (k !== 'logoSrc') cur[k] = S[k]; });
  _undoStack.push(JSON.stringify(cur));

  const next = JSON.parse(_redoStack.pop());
  Object.assign(S, next);

  syncAllUI();
  if (typeof updatePickrColors === 'function') updatePickrColors();
  renderQR();
  updateUndoRedoBtns();
}

function updateUndoRedoBtns() {
  const uBtn = document.getElementById('undo-btn');
  const rBtn = document.getElementById('redo-btn');
  if (uBtn) uBtn.disabled = _undoStack.length === 0;
  if (rBtn) rBtn.disabled = _redoStack.length === 0;
}

// ══════════════════════════════════════════════════════════
// SHARE / COPY / PRINT
// ══════════════════════════════════════════════════════════
function shareQR() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') {
    showToast('Generate a QR code first', 'info'); return;
  }
  canvas.toBlob(blob => {
    if (!blob) { showToast('Cannot share', 'error'); return; }
    const file = new File([blob], 'qrprism.png', { type: 'image/png' });
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      navigator.share({ title: 'QR Code from QR Prism', files: [file] }).catch(() => {});
    } else {
      // Fallback: copy to clipboard
      try {
        navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
          .then(() => showToast('Copied to clipboard!', 'success'))
          .catch(() => showToast('Share not supported on this browser', 'info'));
      } catch {
        showToast('Share not supported', 'info');
      }
    }
  }, 'image/png');
}

function copyToClipboard() {
  const canvas = document.getElementById('qr-canvas');
  if (!canvas || canvas.style.display === 'none') {
    showToast('Generate a QR code first', 'info'); return;
  }
  canvas.toBlob(blob => {
    if (!blob) { showToast('Copy failed', 'error'); return; }
    try {
      navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        .then(() => showToast('Copied to clipboard!', 'success'))
        .catch(() => showToast('Clipboard access denied', 'error'));
    } catch {
      showToast('Copy not supported on this browser', 'error');
    }
  }, 'image/png');
}

/** Print ONLY the QR code (index.html has print styles that hide everything else) */
function printQR() {
  const src = document.getElementById('qr-canvas');
  if (!src || src.style.display === 'none') {
    showToast('Generate a QR code first', 'info'); return;
  }
  const printArea   = document.getElementById('qr-print-area');
  const printCanvas = document.getElementById('qr-print-canvas');
  if (!printArea || !printCanvas) { window.print(); return; }

  // Copy rendered canvas into print canvas
  const w = src.width, h = src.height;
  printCanvas.width  = w;
  printCanvas.height = h;
  printCanvas.getContext('2d').drawImage(src, 0, 0);
  printCanvas.style.maxWidth  = Math.min(w, 600) + 'px';
  printCanvas.style.maxHeight = Math.min(h, 600) + 'px';
  printArea.style.display = 'flex';

  window.print();
  printArea.style.display = 'none';
}

// ══════════════════════════════════════════════════════════
// SHARE APP
// ══════════════════════════════════════════════════════════
function shareApp() {
  const url  = 'https://muhtasim-rahman.github.io/qr-prism/';
  const text = 'Check out QR Prism — a free, powerful QR code generator!';
  if (navigator.share) {
    navigator.share({ title: 'QR Prism', text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url)
      .then(() => showToast('App link copied!', 'success'))
      .catch(() => showToast('Share not supported', 'info'));
  }
}

// ══════════════════════════════════════════════════════════
// DOWNLOAD DROPDOWN TOGGLE
// ══════════════════════════════════════════════════════════
function toggleDLDropdown() {
  const dd = document.getElementById('dl-dropdown');
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  dd.classList.toggle('open', !isOpen);

  if (!isOpen) {
    // Close on outside click
    const close = (e) => {
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        document.removeEventListener('click', close);
      }
    };
    setTimeout(() => document.addEventListener('click', close), 50);
  }
}
