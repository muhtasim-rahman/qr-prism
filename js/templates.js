// =========================================================
// js/templates.js — Template System V2.0
// 15 premium built-in templates + user saved templates
// =========================================================

const TEMPLATES_KEY = 'qrs_templates_v2';

const PREMIUM_TEMPLATES = [
  {
    id: 'tpl-classic', name: 'Classic',
    settings: { pattern:'pat-square', eyeFrame:'ef-square', eyeInner:'ei-square', fgColor:'#000000', bgColor:'#ffffff', gradient:false, customEF:false, customEI:false, customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-ocean', name: 'Ocean',
    settings: { pattern:'pat-dots', eyeFrame:'ef-circle', eyeInner:'ei-circle', fgColor:'#1a5276', bgColor:'#d6eaf8', gradient:true, gc1:'#1a5276', gc2:'#2980b9', gType:'linear', gAngle:45, customEF:true, efColor:'#154360', customEI:true, eiColor:'#21618c', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-forest', name: 'Forest',
    settings: { pattern:'pat-rounded', eyeFrame:'ef-rounded', eyeInner:'ei-rounded', fgColor:'#1e8449', bgColor:'#eafaf1', gradient:true, gc1:'#1e8449', gc2:'#27ae60', gType:'linear', gAngle:135, customEF:true, efColor:'#196f3d', customEI:true, eiColor:'#239b56', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-sunset', name: 'Sunset Blaze',
    settings: { pattern:'pat-extra-rounded', eyeFrame:'ef-extra-rounded', eyeInner:'ei-circle', fgColor:'#784212', bgColor:'#fef9e7', gradient:true, gc1:'#e67e22', gc2:'#e74c3c', gType:'linear', gAngle:45, customEF:true, efColor:'#d35400', customEI:true, eiColor:'#c0392b', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-darkspace', name: 'Dark Space',
    settings: { pattern:'pat-dots', eyeFrame:'ef-circle', eyeInner:'ei-ring', fgColor:'#aed6f1', bgColor:'#1a252f', gradient:true, gc1:'#aed6f1', gc2:'#85c1e9', gType:'linear', gAngle:45, customEF:true, efColor:'#7fb3d3', customEI:true, eiColor:'#aed6f1', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-galaxy', name: 'Galaxy',
    settings: { pattern:'pat-star', eyeFrame:'ef-hexagon', eyeInner:'ei-star', fgColor:'#6c3483', bgColor:'#f4ecf7', gradient:true, gc1:'#6c3483', gc2:'#1a1a2e', gType:'radial', gAngle:45, customEF:true, efColor:'#512e7f', customEI:true, eiColor:'#9b59b6', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-gold', name: 'Gold Premium',
    settings: { pattern:'pat-classy', eyeFrame:'ef-diamond', eyeInner:'ei-diamond', fgColor:'#7d6608', bgColor:'#fef9e7', gradient:true, gc1:'#b7950b', gc2:'#f1c40f', gType:'linear', gAngle:45, customEF:true, efColor:'#9a7d0a', customEI:true, eiColor:'#d4ac0d', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-neon', name: 'Neon Cyber',
    settings: { pattern:'pat-dots', eyeFrame:'ef-extra-rounded', eyeInner:'ei-circle', fgColor:'#00ff88', bgColor:'#0d0d0d', gradient:true, gc1:'#00ff88', gc2:'#00ccff', gType:'linear', gAngle:90, customEF:true, efColor:'#00cc66', customEI:true, eiColor:'#00ffff', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-pastel', name: 'Pastel Dream',
    settings: { pattern:'pat-rounded', eyeFrame:'ef-rounded', eyeInner:'ei-circle', fgColor:'#a569bd', bgColor:'#fdf2f8', gradient:true, gc1:'#c39bd3', gc2:'#85c1e9', gType:'linear', gAngle:45, customEF:true, efColor:'#8e44ad', customEI:true, eiColor:'#9b59b6', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-tech', name: 'Tech Blue',
    settings: { pattern:'pat-extra-rounded', eyeFrame:'ef-cut-corner', eyeInner:'ei-square', fgColor:'#1565c0', bgColor:'#e3f2fd', gradient:true, gc1:'#1565c0', gc2:'#42a5f5', gType:'linear', gAngle:135, customEF:true, efColor:'#0d47a1', customEI:true, eiColor:'#1976d2', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-retro', name: 'Retro',
    settings: { pattern:'pat-square', eyeFrame:'ef-square', eyeInner:'ei-square', fgColor:'#1a1a1a', bgColor:'#f5f5dc', gradient:false, customEF:true, efColor:'#8b4513', customEI:true, eiColor:'#8b4513', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-rose', name: 'Rose Gold',
    settings: { pattern:'pat-heart', eyeFrame:'ef-rounded', eyeInner:'ei-heart', fgColor:'#c0392b', bgColor:'#fdf2f8', gradient:true, gc1:'#e91e63', gc2:'#ff5722', gType:'linear', gAngle:45, customEF:true, efColor:'#ad1457', customEI:true, eiColor:'#c2185b', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-shadow', name: 'Shadow Frame',
    settings: { pattern:'pat-square', eyeFrame:'ef-square', eyeInner:'ei-square', fgColor:'#2c3e50', bgColor:'#ffffff', gradient:false, customEF:false, customEI:false, customMarker:false, frame:'frame-shadow', frameColor:'#2c3e50', frameHasLabel:false, logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-scanme', name: 'Scan Me Badge',
    settings: { pattern:'pat-rounded', eyeFrame:'ef-rounded', eyeInner:'ei-rounded', fgColor:'#ffffff', bgColor:'#7c3aed', gradient:false, customEF:true, efColor:'#ffffff', customEI:true, eiColor:'#ede9fe', customMarker:false, frame:'frame-bottom-bar', frameHasLabel:true, frameLabel:'SCAN ME', frameFont:'Inter', frameColor:'#4c1d95', frameLabelColor:'#ffffff', logoKey:'none', logoSrc:null }
  },
  {
    id: 'tpl-minimal', name: 'Minimal Dot',
    settings: { pattern:'pat-tiny-dots', eyeFrame:'ef-circle', eyeInner:'ei-dot', fgColor:'#333333', bgColor:'#ffffff', gradient:false, customEF:true, efColor:'#555555', customEI:true, eiColor:'#222222', customMarker:false, frame:'frame-none', logoKey:'none', logoSrc:null }
  },
];

// ── Apply template ────────────────────────────────────────
function applyTemplate(tplId) {
  const tpl = PREMIUM_TEMPLATES.find(t => t.id === tplId)
           || getUserTemplates().find(t => t.id === tplId);
  if (!tpl) return;
  const prev = JSON.parse(JSON.stringify(S));
  Object.assign(S, tpl.settings);
  // Keep current data/type
  S.activeType = prev.activeType;
  S.inputData  = prev.inputData;
  S.size       = prev.size;
  S.ec         = prev.ec;
  S.qz         = prev.qz;
  syncAllUI();
  renderQR();
  showToast('Template applied: ' + tpl.name, 'success');
}

// ── User templates ────────────────────────────────────────
function getUserTemplates() {
  try { return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]'); } catch { return []; }
}

function openSaveTemplateModal() {
  document.getElementById('save-tpl-name').value = '';
  openModal('save-tpl-modal');
}

function saveUserTemplate() {
  const nameEl = document.getElementById('save-tpl-name');
  const name = nameEl?.value.trim();
  if (!name) { showToast('Enter a template name', 'warning'); return; }

  const canvas = document.getElementById('qr-canvas');
  let thumb = '';
  try {
    if (canvas && canvas.style.display !== 'none') {
      const tmp = document.createElement('canvas'); tmp.width = 80; tmp.height = 80;
      tmp.getContext('2d').drawImage(canvas, 0, 0, 80, 80);
      thumb = tmp.toDataURL();
    }
  } catch {}

  const templates = getUserTemplates();
  templates.unshift({
    id: 'utpl_' + Date.now(), name, thumb,
    settings: JSON.parse(JSON.stringify(S)),
    date: new Date().toLocaleDateString(),
  });
  try { localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates)); } catch {
    showToast('Storage full — delete some templates', 'error'); return;
  }
  closeModal('save-tpl-modal');
  renderUserTemplates();
  showToast('Template saved: ' + name, 'success');
}

function deleteUserTemplate(id) {
  if (!confirm('Delete this template?')) return;
  const templates = getUserTemplates().filter(t => t.id !== id);
  localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  renderUserTemplates();
  showToast('Template deleted', 'info');
}

// ── Render grids ──────────────────────────────────────────
function renderPremiumTemplates() {
  const container = document.getElementById('preset-tgrid');
  if (!container) return;
  container.innerHTML = PREMIUM_TEMPLATES.map(t => `
    <div class="tpl-card" onclick="applyTemplate('${t.id}')" title="${t.name}">
      <div class="tpl-preview" id="tpl-prev-${t.id}">
        <div class="tpl-loading"><i class="fa-solid fa-qrcode"></i></div>
      </div>
      <div class="tpl-name">${t.name}</div>
    </div>`).join('');

  // Render previews asynchronously
  PREMIUM_TEMPLATES.forEach((t, i) => {
    setTimeout(() => renderTemplateThumbnail(t), i * 80);
  });
}

function renderTemplateThumbnail(tpl) {
  const container = document.getElementById('tpl-prev-' + tpl.id);
  if (!container) return;
  const canvas = document.createElement('canvas');
  canvas.width = 80; canvas.height = 80;
  container.innerHTML = '';
  container.appendChild(canvas);

  // Simple preview render
  const prevS = Object.assign({}, S);
  Object.assign(S, tpl.settings, { size: 80, qz: 2 });
  const modules = getMatrix('https://qrstudio.app', 'H');
  if (modules) {
    const ctx = canvas.getContext('2d');
    const count = modules.length;
    const sz = 80;
    const totalMods = count + 2 * 2;
    const modSize = sz / totalMods;
    const qrLeft = modSize * 2;
    const qrTop  = modSize * 2;

    ctx.fillStyle = S.bgColor || '#fff';
    ctx.fillRect(0, 0, sz, sz);
    ctx.fillStyle = S.gradient ? S.gc1 : (S.fgColor || '#000');

    for (let row = 0; row < count; row++) {
      for (let col = 0; col < count; col++) {
        if (!modules[row][col]) continue;
        if (isInFinder(row, col, count)) continue;
        ctx.fillRect(qrLeft + col * modSize, qrTop + row * modSize, modSize * 0.9, modSize * 0.9);
      }
    }
    // Draw simplified eyes
    [[0,0],[0,count-7],[count-7,0]].forEach(([r,c]) => {
      const ex = qrLeft + c * modSize, ey = qrTop + r * modSize;
      const s = modSize * 7;
      ctx.fillStyle = S.customEF ? S.efColor : (S.fgColor || '#000');
      ctx.fillRect(ex, ey, s, modSize); ctx.fillRect(ex, ey+s-modSize, s, modSize);
      ctx.fillRect(ex, ey+modSize, modSize, s-modSize*2); ctx.fillRect(ex+s-modSize, ey+modSize, modSize, s-modSize*2);
      ctx.fillStyle = S.customEI ? S.eiColor : (S.fgColor || '#000');
      ctx.fillRect(ex+modSize*2, ey+modSize*2, modSize*3, modSize*3);
    });
  }
  Object.assign(S, prevS);
}

function renderUserTemplates() {
  const container = document.getElementById('user-tgrid');
  if (!container) return;
  const templates = getUserTemplates();
  if (!templates.length) {
    container.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><i class="fa-regular fa-bookmark"></i><p>No saved templates yet</p></div>`;
    return;
  }
  container.innerHTML = templates.map(t => `
    <div class="tpl-card">
      <div class="tpl-preview" style="cursor:pointer" onclick="applyTemplate('${t.id}')">
        ${t.thumb ? `<img src="${t.thumb}" style="width:100%;height:100%;object-fit:contain;">` : '<i class="fa-solid fa-qrcode" style="font-size:24px;color:#888"></i>'}
      </div>
      <div class="tpl-name">${escHtml(t.name)}</div>
      <button class="tpl-del-btn" onclick="deleteUserTemplate('${t.id}')" title="Delete"><i class="fa-solid fa-trash"></i></button>
    </div>`).join('');
}
