// =========================================================
// js/qr-engine.js — Canvas QR rendering engine V2.0
// Handles all pattern types, eye frame/inner shapes, frames
// =========================================================

let renderTimer = null;

// ── Debounce render ─────────────────────────────────────
function schedRender() {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(() => {
    pushUndo();
    renderQR();
  }, 350);
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
  syncAllUI(); renderQR();
}
function redo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(S));
  Object.assign(S, JSON.parse(redoStack.pop()));
  syncAllUI(); renderQR();
}

// ── Get QR module matrix ────────────────────────────────
function getMatrix(data, ec) {
  try {
    const div = document.createElement('div');
    div.style.cssText = 'position:absolute;visibility:hidden;left:-9999px;top:-9999px;';
    document.body.appendChild(div);
    const qr = new QRCode(div, {
      text: data || ' ', width: 100, height: 100,
      correctLevel: QRCode.CorrectLevel[ec] || QRCode.CorrectLevel.H,
    });
    const modules = qr._oQRCode ? qr._oQRCode.modules : null;
    document.body.removeChild(div);
    return modules;
  } catch (e) { return null; }
}

// ── Finder pattern area check ───────────────────────────
function isInFinder(row, col, count) {
  if (row <= 6 && col <= 6)         return true; // top-left
  if (row <= 6 && col >= count - 7) return true; // top-right
  if (row >= count - 7 && col <= 6) return true; // bottom-left
  return false;
}

// ── Draw module shape (pattern) ─────────────────────────
function drawModule(ctx, x, y, size, patId) {
  const r = size / 2;
  const cx = x + r, cy = y + r;

  switch (patId) {
    case 'pat-dots':
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.fill(); break;

    case 'pat-rounded':
      ctx.beginPath(); rrect(ctx, x, y, size, size, size * 0.25); ctx.fill(); break;

    case 'pat-extra-rounded':
      ctx.beginPath(); rrect(ctx, x, y, size, size, r); ctx.fill(); break;

    case 'pat-classy':
      ctx.beginPath();
      ctx.moveTo(x + size * 0.4, y);
      ctx.lineTo(x + size, y);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x, y + size);
      ctx.lineTo(x, y + size * 0.4);
      ctx.arcTo(x, y, x + size * 0.4, y, size * 0.4);
      ctx.closePath(); ctx.fill(); break;

    case 'pat-diamond':
      ctx.beginPath();
      ctx.moveTo(cx, y); ctx.lineTo(x + size, cy);
      ctx.lineTo(cx, y + size); ctx.lineTo(x, cy);
      ctx.closePath(); ctx.fill(); break;

    case 'pat-star': {
      ctx.beginPath();
      const spikes = 5, ro = r * 0.9, ri = r * 0.4;
      let rot = (-Math.PI / 2);
      for (let i = 0; i < spikes * 2; i++) {
        const rr = i % 2 === 0 ? ro : ri;
        ctx.lineTo(cx + Math.cos(rot) * rr, cy + Math.sin(rot) * rr);
        rot += Math.PI / spikes;
      }
      ctx.closePath(); ctx.fill(); break;
    }

    case 'pat-heart': {
      ctx.beginPath();
      ctx.moveTo(cx, y + size * 0.3);
      ctx.bezierCurveTo(cx, y, x, y, x, y + size * 0.3);
      ctx.bezierCurveTo(x, y + size * 0.65, cx - size * 0.1, y + size * 0.75, cx, y + size);
      ctx.bezierCurveTo(cx + size * 0.1, y + size * 0.75, x + size, y + size * 0.65, x + size, y + size * 0.3);
      ctx.bezierCurveTo(x + size, y, cx, y, cx, y + size * 0.3);
      ctx.fill(); break;
    }

    case 'pat-plus':
      ctx.fillRect(x + size * 0.3, y, size * 0.4, size);
      ctx.fillRect(x, y + size * 0.3, size, size * 0.4); break;

    case 'pat-cross':
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
      ctx.fillRect(-size * 0.15, -r * 0.95, size * 0.3, size * 1.9);
      ctx.fillRect(-r * 0.95, -size * 0.15, size * 1.9, size * 0.3);
      ctx.restore(); break;

    case 'pat-h-lines':
      ctx.fillRect(x, y + size * 0.3, size, size * 0.4); break;

    case 'pat-v-lines':
      ctx.fillRect(x + size * 0.3, y, size * 0.4, size); break;

    case 'pat-tiny-dots':
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.fill(); break;

    case 'pat-bars':
      ctx.beginPath(); rrect(ctx, x + size * 0.15, y, size * 0.7, size, size * 0.35); ctx.fill(); break;

    case 'pat-wave': {
      ctx.beginPath();
      ctx.moveTo(x, y + size * 0.35);
      ctx.bezierCurveTo(x + size * 0.25, y, x + size * 0.75, y, x + size, y + size * 0.35);
      ctx.bezierCurveTo(x + size * 0.75, y + size, x + size * 0.25, y + size, x, y + size * 0.65);
      ctx.closePath(); ctx.fill(); break;
    }

    case 'pat-leaf':
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.bezierCurveTo(x, y, x + size, y, x + size, cy);
      ctx.bezierCurveTo(x + size, y + size, x, y + size, x, cy);
      ctx.fill(); break;

    case 'pat-ring':
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); break;

    default: // pat-square
      ctx.fillRect(x, y, size, size); break;
  }
}

// ── Rounded rect helper ──────────────────────────────────
function rrect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
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

// ── Draw eye frame (outer 7x7 ring) ─────────────────────
function drawEyeFrame(ctx, ex, ey, mod, color, efId) {
  const s = mod * 7;
  const cx = ex + s / 2, cy = ey + s / 2;
  ctx.fillStyle = color;

  switch (efId) {
    case 'ef-rounded': {
      ctx.beginPath(); rrect(ctx, ex, ey, s, s, mod * 1.2); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); rrect(ctx, ex + mod, ey + mod, s - mod * 2, s - mod * 2, mod * 0.8); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-extra-rounded': {
      ctx.beginPath(); rrect(ctx, ex, ey, s, s, mod * 2.5); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); rrect(ctx, ex + mod, ey + mod, s - mod * 2, s - mod * 2, mod * 1.8); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-circle': {
      ctx.beginPath(); ctx.arc(cx, cy, s / 2, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx, cy, s / 2 - mod, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-diamond': {
      ctx.beginPath();
      ctx.moveTo(cx, ey); ctx.lineTo(ex + s, cy); ctx.lineTo(cx, ey + s); ctx.lineTo(ex, cy);
      ctx.closePath(); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      const m = mod * 1.2;
      ctx.moveTo(cx, ey + m); ctx.lineTo(ex + s - m, cy); ctx.lineTo(cx, ey + s - m); ctx.lineTo(ex + m, cy);
      ctx.closePath(); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-dots': {
      const count = 12;
      const rad = s / 2, dotR = mod * 0.5;
      for (let i = 0; i < count; i++) {
        const a = (Math.PI * 2 * i) / count - Math.PI / 2;
        ctx.beginPath(); ctx.arc(cx + Math.cos(a) * (rad - dotR), cy + Math.sin(a) * (rad - dotR), dotR, 0, Math.PI * 2); ctx.fill();
      }
      break;
    }
    case 'ef-thick': {
      ctx.beginPath(); rrect(ctx, ex - mod * 0.5, ey - mod * 0.5, s + mod, s + mod, 0); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); rrect(ctx, ex + mod * 1.5, ey + mod * 1.5, s - mod * 3, s - mod * 3, 0); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-double': {
      ctx.strokeStyle = color; ctx.lineWidth = mod * 0.5;
      ctx.strokeRect(ex + mod * 0.25, ey + mod * 0.25, s - mod * 0.5, s - mod * 0.5);
      ctx.strokeRect(ex + mod * 1.25, ey + mod * 1.25, s - mod * 2.5, s - mod * 2.5);
      // Draw the border
      ctx.fillRect(ex, ey, s, mod); ctx.fillRect(ex, ey + s - mod, s, mod);
      ctx.fillRect(ex, ey + mod, mod, s - mod * 2); ctx.fillRect(ex + s - mod, ey + mod, mod, s - mod * 2);
      break;
    }
    case 'ef-bracket': {
      const bk = mod * 2;
      ctx.strokeStyle = color; ctx.lineWidth = mod; ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(ex + bk, ey); ctx.lineTo(ex, ey); ctx.lineTo(ex, ey + bk);
      ctx.moveTo(ex + s - bk, ey); ctx.lineTo(ex + s, ey); ctx.lineTo(ex + s, ey + bk);
      ctx.moveTo(ex, ey + s - bk); ctx.lineTo(ex, ey + s); ctx.lineTo(ex + bk, ey + s);
      ctx.moveTo(ex + s, ey + s - bk); ctx.lineTo(ex + s, ey + s); ctx.lineTo(ex + s - bk, ey + s);
      ctx.stroke(); break;
    }
    case 'ef-shield': {
      ctx.beginPath();
      ctx.moveTo(cx, ey); ctx.lineTo(ex + s, ey + mod * 1.5);
      ctx.lineTo(ex + s, ey + s * 0.6); ctx.bezierCurveTo(ex + s, ey + s * 0.9, cx, ey + s, cx, ey + s);
      ctx.bezierCurveTo(ex, ey + s, ex, ey + s * 0.9, ex, ey + s * 0.6); ctx.lineTo(ex, ey + mod * 1.5);
      ctx.closePath(); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      const i2 = mod;
      ctx.beginPath();
      ctx.moveTo(cx, ey + i2 * 1.5); ctx.lineTo(ex + s - i2, ey + i2 * 2.5);
      ctx.lineTo(ex + s - i2, ey + s * 0.55); ctx.bezierCurveTo(ex + s - i2, ey + s * 0.82, cx, ey + s - i2, cx, ey + s - i2);
      ctx.bezierCurveTo(ex + i2, ey + s * 0.82, ex + i2, ey + s * 0.55, ex + i2, ey + s * 0.55); ctx.lineTo(ex + i2, ey + i2 * 2.5);
      ctx.closePath(); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-hexagon': {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x2 = cx + (s / 2) * Math.cos(a), y2 = cy + (s / 2) * Math.sin(a);
        i === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }
      ctx.closePath(); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      const ri2 = s / 2 - mod;
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x2 = cx + ri2 * Math.cos(a), y2 = cy + ri2 * Math.sin(a);
        i === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }
      ctx.closePath(); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-cut-corner': {
      const cc = mod * 1.5;
      ctx.beginPath();
      ctx.moveTo(ex + cc, ey); ctx.lineTo(ex + s - cc, ey); ctx.lineTo(ex + s, ey + cc);
      ctx.lineTo(ex + s, ey + s - cc); ctx.lineTo(ex + s - cc, ey + s); ctx.lineTo(ex + cc, ey + s);
      ctx.lineTo(ex, ey + s - cc); ctx.lineTo(ex, ey + cc); ctx.closePath(); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      const cc2 = cc * 0.7, in3 = mod;
      ctx.beginPath();
      ctx.moveTo(ex + in3 + cc2, ey + in3); ctx.lineTo(ex + s - in3 - cc2, ey + in3);
      ctx.lineTo(ex + s - in3, ey + in3 + cc2); ctx.lineTo(ex + s - in3, ey + s - in3 - cc2);
      ctx.lineTo(ex + s - in3 - cc2, ey + s - in3); ctx.lineTo(ex + in3 + cc2, ey + s - in3);
      ctx.lineTo(ex + in3, ey + s - in3 - cc2); ctx.lineTo(ex + in3, ey + in3 + cc2);
      ctx.closePath(); ctx.fill();
      ctx.restore(); break;
    }
    case 'ef-leaf': {
      ctx.beginPath();
      ctx.moveTo(cx, ey); ctx.bezierCurveTo(ex + s, ey, ex + s, ey + s, cx, ey + s);
      ctx.bezierCurveTo(ex, ey + s, ex, ey, cx, ey); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.moveTo(cx, ey + mod); ctx.bezierCurveTo(ex + s - mod, ey + mod, ex + s - mod, ey + s - mod, cx, ey + s - mod);
      ctx.bezierCurveTo(ex + mod, ey + s - mod, ex + mod, ey + mod, cx, ey + mod);
      ctx.fill(); ctx.restore(); break;
    }
    case 'ef-wavy': {
      ctx.strokeStyle = color; ctx.lineWidth = mod;
      ctx.beginPath();
      const wAmp = mod * 0.5, wStep = s / 6;
      for (let side = 0; side < 4; side++) {
        for (let i = 0; i <= 6; i++) {
          const t2 = i / 6;
          const wave = Math.sin(t2 * Math.PI * 2) * wAmp;
          let x2, y2;
          if (side === 0) { x2 = ex + t2 * s; y2 = ey + wave; }
          else if (side === 1) { x2 = ex + s - wave; y2 = ey + t2 * s; }
          else if (side === 2) { x2 = ex + s - t2 * s; y2 = ey + s - wave; }
          else { x2 = ex + wave; y2 = ey + s - t2 * s; }
          if (i === 0 && side === 0) ctx.moveTo(x2, y2); else ctx.lineTo(x2, y2);
        }
      }
      ctx.closePath(); ctx.stroke(); break;
    }
    case 'ef-arrow': {
      const ak = mod * 1.5;
      ctx.strokeStyle = color; ctx.lineWidth = mod; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ex + ak, ey); ctx.lineTo(ex, ey + ak);
      ctx.moveTo(ex + s - ak, ey); ctx.lineTo(ex + s, ey + ak);
      ctx.moveTo(ex, ey + s - ak); ctx.lineTo(ex + ak, ey + s);
      ctx.moveTo(ex + s, ey + s - ak); ctx.lineTo(ex + s - ak, ey + s);
      ctx.moveTo(ex, ey + ak); ctx.lineTo(ex, ey + s - ak);
      ctx.moveTo(ex + s, ey + ak); ctx.lineTo(ex + s, ey + s - ak);
      ctx.moveTo(ex + ak, ey); ctx.lineTo(ex + s - ak, ey);
      ctx.moveTo(ex + ak, ey + s); ctx.lineTo(ex + s - ak, ey + s);
      ctx.stroke(); break;
    }
    default: { // ef-square
      ctx.fillRect(ex, ey, s, mod);
      ctx.fillRect(ex, ey + s - mod, s, mod);
      ctx.fillRect(ex, ey + mod, mod, s - mod * 2);
      ctx.fillRect(ex + s - mod, ey + mod, mod, s - mod * 2);
      break;
    }
  }
}

// ── Draw eye inner (center 3x3 block) ───────────────────
function drawEyeInner(ctx, ex, ey, mod, color, eiId) {
  const s = mod * 3;
  const cx = ex + s / 2, cy = ey + s / 2;
  const r = s / 2;
  ctx.fillStyle = color;

  switch (eiId) {
    case 'ei-circle':
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.fill(); break;
    case 'ei-rounded':
      ctx.beginPath(); rrect(ctx, ex, ey, s, s, s * 0.2); ctx.fill(); break;
    case 'ei-extra-rounded':
      ctx.beginPath(); rrect(ctx, ex, ey, s, s, r * 0.8); ctx.fill(); break;
    case 'ei-diamond':
      ctx.beginPath();
      ctx.moveTo(cx, ey); ctx.lineTo(ex + s, cy); ctx.lineTo(cx, ey + s); ctx.lineTo(ex, cy);
      ctx.closePath(); ctx.fill(); break;
    case 'ei-star': {
      ctx.beginPath();
      const spikes = 5, ro = r * 0.9, ri = r * 0.38;
      let rot = -Math.PI / 2;
      for (let i = 0; i < spikes * 2; i++) {
        const rr = i % 2 === 0 ? ro : ri;
        ctx.lineTo(cx + Math.cos(rot) * rr, cy + Math.sin(rot) * rr);
        rot += Math.PI / spikes;
      }
      ctx.closePath(); ctx.fill(); break;
    }
    case 'ei-cross':
      ctx.fillRect(ex + s * 0.3, ey, s * 0.4, s);
      ctx.fillRect(ex, ey + s * 0.3, s, s * 0.4); break;
    case 'ei-heart': {
      ctx.beginPath();
      ctx.moveTo(cx, ey + s * 0.3);
      ctx.bezierCurveTo(cx, ey, ex, ey, ex, ey + s * 0.3);
      ctx.bezierCurveTo(ex, ey + s * 0.7, cx - s * 0.05, ey + s * 0.8, cx, ey + s);
      ctx.bezierCurveTo(cx + s * 0.05, ey + s * 0.8, ex + s, ey + s * 0.7, ex + s, ey + s * 0.3);
      ctx.bezierCurveTo(ex + s, ey, cx, ey, cx, ey + s * 0.3);
      ctx.fill(); break;
    }
    case 'ei-leaf':
      ctx.beginPath();
      ctx.moveTo(cx, ey); ctx.bezierCurveTo(ex + s, ey, ex + s, ey + s, cx, ey + s);
      ctx.bezierCurveTo(ex, ey + s, ex, ey, cx, ey); ctx.fill(); break;
    case 'ei-dot':
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 2); ctx.fill(); break;
    case 'ei-ring':
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, Math.PI * 2); ctx.fill();
      ctx.save(); ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath(); ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2); ctx.fill();
      ctx.restore(); break;
    case 'ei-hexagon': {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x2 = cx + r * 0.9 * Math.cos(a), y2 = cy + r * 0.9 * Math.sin(a);
        i === 0 ? ctx.moveTo(x2, y2) : ctx.lineTo(x2, y2);
      }
      ctx.closePath(); ctx.fill(); break;
    }
    case 'ei-shield': {
      ctx.beginPath();
      ctx.moveTo(cx, ey); ctx.lineTo(ex + s, ey + s * 0.2);
      ctx.lineTo(ex + s, ey + s * 0.55); ctx.bezierCurveTo(ex + s, ey + s * 0.85, cx, ey + s, cx, ey + s);
      ctx.bezierCurveTo(ex, ey + s, ex, ey + s * 0.85, ex, ey + s * 0.55); ctx.lineTo(ex, ey + s * 0.2);
      ctx.closePath(); ctx.fill(); break;
    }
    case 'ei-arrow': {
      ctx.beginPath();
      ctx.moveTo(ex + s * 0.15, ey + s * 0.55); ctx.lineTo(cx, ey + s * 0.1);
      ctx.lineTo(ex + s * 0.85, ey + s * 0.55); ctx.lineTo(ex + s * 0.65, ey + s * 0.55);
      ctx.lineTo(ex + s * 0.65, ey + s * 0.9); ctx.lineTo(ex + s * 0.35, ey + s * 0.9);
      ctx.lineTo(ex + s * 0.35, ey + s * 0.55); ctx.closePath(); ctx.fill(); break;
    }
    default: // ei-square
      ctx.fillRect(ex, ey, s, s); break;
  }
}

// ── Main QR render function ──────────────────────────────
async function renderQR() {
  const canvas = document.getElementById('qr-canvas');
  const empty  = document.getElementById('qr-empty');
  const loader = document.getElementById('qr-loading');
  const infoRow = document.getElementById('qr-info-row');
  const actBtns = document.getElementById('action-btns');
  const warnBar = document.getElementById('warn-bar-prev');
  if (!canvas) return;

  const data = buildQRData();
  if (!data) {
    canvas.style.display = 'none';
    if (empty) empty.style.display = '';
    if (infoRow) infoRow.style.display = 'none';
    if (actBtns) actBtns.style.display = 'none';
    updateAnalytics(null, null);
    return;
  }

  if (loader) loader.style.display = '';
  if (empty)  empty.style.display  = 'none';

  await new Promise(r => setTimeout(r, 10));

  const modules = getMatrix(data, S.ec);
  if (!modules) {
    if (loader) loader.style.display = 'none';
    if (warnBar) { warnBar.style.display = ''; warnBar.textContent = '⚠ Could not generate QR code. Try reducing the data or increasing error correction.'; }
    return;
  }
  if (warnBar) warnBar.style.display = 'none';

  const count  = modules.length;
  const sz     = S.size;

  // Frame adjustments
  const frameId = S.frame || 'frame-none';
  const hasLabel = S.frameHasLabel && frameId !== 'frame-none';
  const needsTopBar = ['frame-top-bar', 'frame-speech-bubble', 'frame-smartphone'].includes(frameId) && hasLabel;
  const needsBottomBar = ['frame-bottom-bar', 'frame-badge', 'frame-rounded-border', 'frame-polaroid', 'frame-gradient-bar'].includes(frameId) && hasLabel;
  const hasOuterFrame = !['frame-none'].includes(frameId);

  // Calculate canvas dimensions
  const topPad = needsTopBar ? Math.round(sz * 0.14) : (hasOuterFrame ? Math.round(sz * 0.04) : 0);
  const botPad = needsBottomBar ? Math.round(sz * 0.14) : (hasOuterFrame ? Math.round(sz * 0.04) : 0);
  const sidePad = hasOuterFrame ? Math.round(sz * 0.03) : 0;

  const canvasW = sz + sidePad * 2;
  const canvasH = sz + topPad + botPad;

  canvas.width  = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvasW, canvasH);

  // Background
  if (!S.transparent) {
    ctx.fillStyle = S.bgColor;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  // Module / quiet zone calculations
  const qzMod = S.qz;
  const totalMods = count + qzMod * 2;
  const modSize = sz / totalMods;
  const qrLeft = sidePad + modSize * qzMod;
  const qrTop  = topPad + modSize * qzMod;

  // Foreground color / gradient
  let fgFill;
  if (S.gradient) {
    let grad;
    const gAngleRad = (S.gAngle * Math.PI) / 180;
    if (S.gType === 'radial') {
      grad = ctx.createRadialGradient(sidePad + sz / 2, topPad + sz / 2, 0, sidePad + sz / 2, topPad + sz / 2, sz / 2);
    } else {
      const dx = Math.cos(gAngleRad) * sz / 2, dy = Math.sin(gAngleRad) * sz / 2;
      const cx2 = sidePad + sz / 2, cy2 = topPad + sz / 2;
      grad = ctx.createLinearGradient(cx2 - dx, cy2 - dy, cx2 + dx, cy2 + dy);
    }
    grad.addColorStop(0, S.gc1);
    grad.addColorStop(1, S.gc2);
    fgFill = grad;
  } else {
    fgFill = S.fgColor;
  }

  // Draw data modules
  ctx.fillStyle = fgFill;
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (!modules[row][col]) continue;
      if (isInFinder(row, col, count)) continue;
      const x = qrLeft + col * modSize;
      const y = qrTop  + row * modSize;
      drawModule(ctx, x, y, modSize, S.pattern);
    }
  }

  // Draw finder patterns (eyes)
  const eyePositions = [
    { row: 0, col: 0 }, // top-left
    { row: 0, col: count - 7 }, // top-right
    { row: count - 7, col: 0 }, // bottom-left
  ];

  eyePositions.forEach(({ row, col }) => {
    const ex = qrLeft + col * modSize;
    const ey = qrTop  + row * modSize;

    // Eye frame color
    const efColor = S.customEF ? S.efColor : (S.customMarker ? S.mbColor : S.fgColor);
    const efFill  = (efColor === S.fgColor && S.gradient) ? fgFill : efColor;

    // Eye inner color
    const eiColor = S.customEI ? S.eiColor : (S.customMarker ? S.mcColor : S.fgColor);
    const eiFill  = (eiColor === S.fgColor && S.gradient) ? fgFill : eiColor;

    // Draw outer frame
    ctx.fillStyle = efFill;
    ctx.strokeStyle = efFill;
    drawEyeFrame(ctx, ex, ey, modSize, efFill, S.eyeFrame);

    // Draw inner center (at row+2, col+2 = 3x3)
    const ix = ex + modSize * 2;
    const iy = ey + modSize * 2;
    ctx.fillStyle = eiFill;
    drawEyeInner(ctx, ix, iy, modSize, eiFill, S.eyeInner);
  });

  // Draw logo
  const logoSrc = S.logoKey && S.logoKey !== 'none'
    ? getLogoDataURL(S.logoKey)
    : S.logoSrc;

  if (logoSrc) {
    await new Promise(res => {
      const img = new Image();
      img.onload = () => {
        const logoW = (sz * S.logoSize) / 100;
        const logoH = logoW;
        const logoX = sidePad + (sz - logoW) / 2;
        const logoY = topPad  + (sz - logoH) / 2;

        if (S.logoRemoveBG) {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          const clearW = logoW + S.logoPad * 2;
          const clearH = logoH + S.logoPad * 2;
          const clearX = logoX - S.logoPad;
          const clearY = logoY - S.logoPad;
          ctx.beginPath();
          rrect(ctx, clearX, clearY, clearW, clearH, S.logoBR * clearW / 100 + S.logoPad);
          ctx.fill();
          ctx.restore();
        }

        // Padding background
        if (S.logoPad > 0) {
          ctx.fillStyle = S.logoPadColor;
          ctx.beginPath();
          rrect(ctx, logoX - S.logoPad, logoY - S.logoPad,
                logoW + S.logoPad * 2, logoH + S.logoPad * 2,
                S.logoBR * (logoW + S.logoPad * 2) / 100 + S.logoPad);
          ctx.fill();
        }

        // Logo image
        ctx.save();
        ctx.beginPath();
        rrect(ctx, logoX, logoY, logoW, logoH, S.logoBR * logoW / 100);
        ctx.clip();
        ctx.drawImage(img, logoX, logoY, logoW, logoH);
        ctx.restore();
        res();
      };
      img.onerror = () => res();
      img.src = logoSrc;
    });
  }

  // Apply shadow
  if (S.shadow) {
    const shadow = ctx.getImageData(0, 0, canvasW, canvasH);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width  = canvasW;
    shadowCanvas.height = canvasH;
    const sCtx = shadowCanvas.getContext('2d');
    sCtx.shadowColor   = S.shadowColor + '88';
    sCtx.shadowBlur    = S.shadowBlur;
    sCtx.shadowOffsetX = S.shadowBlur * 0.5;
    sCtx.shadowOffsetY = S.shadowBlur * 0.5;
    sCtx.drawImage(canvas, 0, 0);
    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.drawImage(shadowCanvas, 0, 0);
  }

  // Draw frame
  if (frameId !== 'frame-none') {
    renderFrame(
      ctx, frameId, canvasW > canvasH ? canvasH : canvasW,
      sidePad, sz,
      hasLabel ? (S.frameLabel || 'Scan Me') : '',
      S.frameFont, S.frameTSize,
      S.frameLabelColor, S.frameColor
    );
  }

  // Apply filter / transform
  if (S.rotation || S.flipH || S.flipV || S.invert || S.filter !== 'none') {
    const tmp = document.createElement('canvas');
    tmp.width  = canvasW;
    tmp.height = canvasH;
    const tCtx = tmp.getContext('2d');
    tCtx.save();
    tCtx.translate(canvasW / 2, canvasH / 2);
    tCtx.rotate((S.rotation * Math.PI) / 180);
    tCtx.scale(S.flipH ? -1 : 1, S.flipV ? -1 : 1);
    tCtx.drawImage(canvas, -canvasW / 2, -canvasH / 2);
    tCtx.restore();

    if (S.invert) {
      const id = tCtx.getImageData(0, 0, canvasW, canvasH);
      for (let i = 0; i < id.data.length; i += 4) {
        if (id.data[i + 3] > 0) { id.data[i] = 255 - id.data[i]; id.data[i+1] = 255 - id.data[i+1]; id.data[i+2] = 255 - id.data[i+2]; }
      }
      tCtx.putImageData(id, 0, 0);
    }

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.filter = S.filter !== 'none' ? S.filter : 'none';
    ctx.drawImage(tmp, 0, 0);
    ctx.filter = 'none';
  }

  // Show canvas, update UI
  canvas.style.display = '';
  if (loader) loader.style.display = 'none';
  if (infoRow) infoRow.style.display = '';
  if (actBtns) actBtns.style.display = '';

  updateAnalytics(count, data);

  // Auto-save to project (debounced)
  schedProjectAutoSave(data);
}

// ── Analytics ────────────────────────────────────────────
function updateAnalytics(count, data) {
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const canvas = document.getElementById('qr-canvas');
  if (!count || !data) {
    set('a-chars', '—'); set('a-version', '—'); set('a-modules', '—'); set('a-scan', '—');
    set('bi-size', '—'); set('bi-ver', '—'); set('bi-mod', '—'); set('bi-chars', '—');
    return;
  }
  const ver = Math.round((count - 17) / 4);
  const chars = data.length;
  const scanQ = chars > 200 ? 'Moderate' : 'High';
  set('a-chars', chars); set('a-version', ver); set('a-modules', count + '×' + count); set('a-scan', scanQ);
  set('bi-size', (canvas ? canvas.width : S.size) + 'px');
  set('bi-ver', ver); set('bi-mod', count + '×' + count); set('bi-chars', chars);
}

// Project auto-save debouncer
let projectSaveTimer = null;
function schedProjectAutoSave(data) {
  clearTimeout(projectSaveTimer);
  projectSaveTimer = setTimeout(() => autoSaveProject(data), 1000);
}
