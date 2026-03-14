// =========================================================
// APP.JS — QR Prism v2.7
// Boot, mode switching, keyboard shortcuts, modals, toasts
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

// ── Keyboard Shortcuts ─────────────────────────────────────
document.addEventListener('keydown', e => {
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
  const ctrl = e.ctrlKey || e.metaKey;
  if (ctrl) {
    if (e.key==='d'){e.preventDefault();downloadQR('png');return;}
    if (e.key==='s'){e.preventDefault();openSaveTemplateModal();return;}
    if (e.key==='c'){e.preventDefault();copyToClipboard();return;}
    if (e.key==='z'){e.preventDefault();undoQR();return;}
    if (e.key==='y'){e.preventDefault();redoQR();return;}
  } else {
    if (e.key==='d'){toggleDark();return;}
    if (e.key==='?'){openModal('kb-modal');return;}
    if (e.key==='1'){switchMode('gen');return;}
    if (e.key==='2'){switchMode('projects');return;}
    if (e.key==='3'){switchMode('scan');return;}
    if (e.key==='4'){switchMode('batch');return;}
    if (e.key==='5'){switchMode('settings');return;}
    if (e.key==='Escape'){
      document.querySelectorAll('.modal-bg.open').forEach(m=>m.classList.remove('open'));
      closeBottomSheet(); closeAllDropdowns();
    }
  }
});

// ── Theme ──────────────────────────────────────────────────
function toggleDark() {
  const cur = SETTINGS.theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : SETTINGS.theme;
  const next = cur === 'dark' ? 'light' : 'dark';
  SETTINGS.theme = next;
  applyTheme(next);
  saveSettingsData();
  updateThemeIcons(next);
  renderPatternGrids();
  renderFrameGrids();
}
function updateThemeIcons(theme) {
  const cls = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  document.querySelectorAll('#sidebar-dark-icon,#topnav-dark-icon,#mobile-dark-icon,#bs-dark-icon')
    .forEach(el => { el.className = cls; });
}

// ── Bottom Sheet ───────────────────────────────────────────
function openBottomSheet() {
  document.getElementById('bs-overlay')?.classList.add('open');
  document.getElementById('bottom-sheet')?.classList.add('open');
}
function closeBottomSheet() {
  document.getElementById('bs-overlay')?.classList.remove('open');
  document.getElementById('bottom-sheet')?.classList.remove('open');
}

// ── Mode Switching ─────────────────────────────────────────
function switchMode(mode) {
  if (mode !== 'scan' && typeof stopScanner === 'function') stopScanner();
  document.querySelectorAll('.mode-view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('mode-' + mode);
  if (target) target.classList.add('active');
  document.getElementById('main-content')?.scrollTo(0,0);
  window.scrollTo(0,0);
  document.querySelectorAll('[data-mode]').forEach(el => {
    el.classList.toggle('active', el.dataset.mode === mode);
  });
  closeBottomSheet(); closeAllTooltips(); closeAllDropdowns();
  if (mode==='scan')             setTimeout(()=>{ if(typeof startScanner==='function') startScanner(); },300);
  if (mode==='projects')         { renderProjects(); updateProjectCounts(); }
  if (mode==='settings')         renderSettings();
  if (mode==='templates-manage') renderTemplatesManage();
  if (mode==='profile')          renderProfile();
  if (mode==='batch')            renderBatchTemplateList();
  if (mode==='report')           initReportForm();
}

// ── Dropdowns ──────────────────────────────────────────────
function closeAllDropdowns() {
  document.getElementById('dl-dropdown')?.classList.remove('open');
  document.querySelectorAll('.dot-menu-dropdown.open').forEach(d=>d.classList.remove('open'));
}
function toggleDLDropdown() {
  document.getElementById('dl-dropdown')?.classList.toggle('open');
}

// ── Modals ─────────────────────────────────────────────────
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('open');
  setTimeout(()=>{ const inp=m.querySelector('input:not([type=file]):not([type=checkbox]),textarea'); if(inp) inp.focus(); },80);
}
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-bg')) e.target.classList.remove('open');
  if (!e.target.closest('.dl-wrap')) document.getElementById('dl-dropdown')?.classList.remove('open');
  if (!e.target.closest('.dot-menu-wrap'))
    document.querySelectorAll('.dot-menu-dropdown.open').forEach(d=>d.classList.remove('open'));
});

// ── Confirm Helper ─────────────────────────────────────────
function showConfirm({ title, msg, okLabel='Confirm', okClass='btn-danger', items=[], onConfirm }) {
  const set = (id,html,txt) => { const el=document.getElementById(id); if(el) txt?el.textContent=html:el.innerHTML=html; };
  set('confirm-title', `<i class="fa-solid fa-triangle-exclamation" style="color:var(--danger)"></i> ${title}`);
  set('confirm-msg', msg||'', true);
  const lEl = document.getElementById('confirm-list');
  if (lEl) {
    lEl.style.display = items.length ? 'block' : 'none';
    if (items.length) lEl.innerHTML = items.map(i=>`<div style="padding:2px 0;">• ${i}</div>`).join('');
  }
  const okEl = document.getElementById('confirm-ok-btn');
  if (okEl) {
    okEl.textContent = okLabel;
    okEl.className = 'btn ' + okClass;
    okEl.onclick = () => { closeModal('confirm-modal'); if(onConfirm) onConfirm(); };
  }
  openModal('confirm-modal');
}

// ── Toasts ─────────────────────────────────────────────────
function showToast(msg, type='info', duration=2800) {
  const container = document.getElementById('toasts');
  if (!container) return;
  const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle', info:'fa-info-circle' };
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `<i class="fa-solid ${icons[type]||'fa-info-circle'}"></i><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(()=>{ el.classList.add('out'); setTimeout(()=>el.remove(),220); }, duration);
}

// ── Tooltips ───────────────────────────────────────────────
function closeAllTooltips() {
  document.querySelectorAll('.tooltip-wrap.tip-open').forEach(w=>w.classList.remove('tip-open'));
}
document.addEventListener('click', e => {
  if (window.innerWidth > 767) return;
  const wrap = e.target.closest('.tooltip-wrap');
  document.querySelectorAll('.tooltip-wrap.tip-open').forEach(w=>{ if(w!==wrap) w.classList.remove('tip-open'); });
  if (wrap && !wrap.closest('.modal-bg')) {
    wrap.classList.toggle('tip-open');
    fixTooltipPos(wrap);
  }
}, true);
document.addEventListener('touchstart', e => { if(!e.target.closest('.tooltip-wrap')) closeAllTooltips(); }, {passive:true});
document.addEventListener('scroll', ()=>closeAllTooltips(), {passive:true});

function fixTooltipPos(wrap) {
  if (!wrap) return;
  wrap.classList.remove('tip-right','tip-left');
  const tip = wrap.querySelector('.tooltip-pop');
  if (!tip) return;
  requestAnimationFrame(()=>{
    const rect = tip.getBoundingClientRect();
    if (rect.right > window.innerWidth-8) wrap.classList.add('tip-right');
    else if (rect.left < 8) wrap.classList.add('tip-left');
  });
}

// ── Profile ────────────────────────────────────────────────
function syncProfileUI() {
  try {
    const p = JSON.parse(localStorage.getItem('qrp_profile')||'{}');
    const name = p.name || 'Guest User';
    const sub  = p.website || p.email || 'Click to set up profile';
    const initials = name.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)||'?';
    const avatarHtml = p.avatar
      ? `<img src="${p.avatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
      : initials;
    const setTxt = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
    setTxt('sp-name',name); setTxt('sp-sub',sub);
    ['sp-avatar','mobile-avatar-mini'].forEach(id => {
      const el = document.getElementById(id); if(el) el.innerHTML=avatarHtml;
    });
  } catch(e) {}
}

// ── Report Form Init ───────────────────────────────────────
function initReportForm() {
  try {
    const p = JSON.parse(localStorage.getItem('qrp_profile')||'{}');
    const nEl = document.getElementById('report-name');
    const eEl = document.getElementById('report-email');
    if (nEl && !nEl.value && p.name)  nEl.value = p.name;
    if (eEl && !eEl.value && p.email) eEl.value = p.email;
  } catch(e) {}
}

// ── Project Counts ─────────────────────────────────────────
function updateProjectCounts() {
  try {
    const all    = JSON.parse(localStorage.getItem('qrp_projects')||'[]');
    const saved  = all.filter(p=>p.savedByUser).length;
    const auto   = all.filter(p=>!p.savedByUser).length;
    const pinned = all.filter(p=>p.pinned).length;
    const total  = all.length;
    const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
    set('saved-count',saved); set('auto-count',auto); set('pinned-count',pinned);
    set('sidebar-project-count',total);
    const badge = document.getElementById('bn-project-badge');
    if (badge) { badge.textContent=total; badge.style.display=total>0?'flex':'none'; }
  } catch(e) {}
}

// ── PWA Banner ─────────────────────────────────────────────
function renderPWABanner() {
  const installed = isPWAInstalled();
  const banner = document.createElement('div');
  banner.id = 'pwa-banner';
  if (installed) {
    banner.className = 'pwa-banner pwa-banner-installed';
    banner.innerHTML = `
      <div class="pwa-banner-icon" style="font-size:2rem;color:var(--success);"><i class="fa-solid fa-check-circle"></i></div>
      <div class="pwa-banner-info">
        <div class="pwa-banner-title">App Installed ✓</div>
        <div class="pwa-banner-sub">You're using QR Prism as an installed PWA. Offline-ready.</div>
      </div>`;
  } else {
    banner.className = 'pwa-banner';
    banner.innerHTML = `
      <div class="pwa-banner-icon" style="font-size:2rem;color:var(--primary);"><i class="fa-solid fa-mobile-screen-button"></i></div>
      <div class="pwa-banner-info">
        <div class="pwa-banner-title">Install QR Prism</div>
        <div class="pwa-banner-sub">Add to home screen for the best offline experience.</div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="installPWA()" id="pwa-install-btn" style="flex-shrink:0;">
        <i class="fa-solid fa-download"></i> Install
      </button>
      <div class="pwa-banner-bg"></div>`;
  }
  return banner;
}

// ── Documentation ──────────────────────────────────────────
async function openDocumentation() {
  openModal('docs-modal');
  const contentEl   = document.getElementById('docs-content');
  const tocListEl   = document.getElementById('docs-toc-list');
  const tocMobileEl = document.getElementById('docs-toc-mobile-list');
  if (!contentEl || contentEl.dataset.loaded==='1') return;
  contentEl.innerHTML = '<div class="docs-loading"><div class="spin-ring"></div></div>';
  try {
    const res = await fetch('./README.md');
    if (!res.ok) throw new Error('HTTP '+res.status);
    const md = await res.text();
    if (typeof marked !== 'undefined') {
      marked.setOptions({ gfm:true, breaks:false });
      contentEl.innerHTML = marked.parse(md);
    } else {
      contentEl.innerHTML = `<pre style="white-space:pre-wrap;">${md.replace(/</g,'&lt;')}</pre>`;
    }
    contentEl.dataset.loaded = '1';
    const headers = contentEl.querySelectorAll('h1,h2,h3');
    let tocHtml = '';
    headers.forEach((h,i) => {
      if (!h.id) h.id = 'doc-h-'+i;
      const level = h.tagName.toLowerCase();
      const cls = level==='h2'?'h2':level==='h3'?'h3':'';
      tocHtml += `<a class="docs-toc-item ${cls}" href="#${h.id}"
        onclick="scrollDocTo('${h.id}');toggleDocsTOC(false);return false;">${h.textContent.trim()}</a>`;
    });
    if (tocListEl)   tocListEl.innerHTML   = tocHtml;
    if (tocMobileEl) tocMobileEl.innerHTML = tocHtml;
  } catch(err) {
    contentEl.innerHTML = `
      <div class="docs-fallback">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p>Could not load README.md.</p>
        <p style="font-size:.76rem;color:var(--text3);">Make sure README.md exists in the project root.</p>
        <a href="https://github.com/muhtasim-rahman/qr-prism#readme" target="_blank" rel="noopener" class="btn btn-outline btn-sm">
          <i class="fa-brands fa-github"></i> Read on GitHub
        </a>
      </div>`;
    contentEl.dataset.loaded = 'err';
  }
}

function scrollDocTo(id) {
  const el = document.getElementById(id);
  const cEl = document.getElementById('docs-content');
  if (el && cEl) cEl.scrollTo({ top:el.offsetTop-16, behavior:'smooth' });
}
function toggleDocsTOC(forceState) {
  const overlay = document.getElementById('docs-toc-overlay');
  const sidebar = document.getElementById('docs-toc');
  if (!overlay) return;
  if (window.innerWidth < 860) {
    const open = forceState !== undefined ? forceState : !overlay.classList.contains('open');
    overlay.classList.toggle('open', open);
  } else {
    if (sidebar) sidebar.style.display = sidebar.style.display === 'none' ? '' : 'none';
  }
}

// ── App Share ──────────────────────────────────────────────
function shareApp() {
  if (navigator.share) {
    navigator.share({ title:'QR Prism', text:'Advanced free QR code generator — offline, no ads.', url:'https://muhtasim-rahman.github.io/qr-prism/' }).catch(()=>{});
  } else {
    navigator.clipboard?.writeText('https://muhtasim-rahman.github.io/qr-prism/').then(()=>showToast('Link copied!','success')).catch(()=>showToast('Share not supported','info'));
  }
}

// ── Scan helpers ───────────────────────────────────────────
function openScannedURL() {
  const data = document.getElementById('scan-data')?.textContent;
  if (data?.startsWith('http')) window.open(data,'_blank','noopener');
  else showToast('Not a URL','info');
}
function copyScanned() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  navigator.clipboard.writeText(data).then(()=>showToast('Copied!','success')).catch(()=>showToast('Copy failed','error'));
}
function loadScannedInGen() {
  const data = document.getElementById('scan-data')?.textContent;
  if (!data) return;
  switchMode('gen');
  setTimeout(()=>{
    const urlEl = document.getElementById('f-url');
    const txtEl = document.getElementById('f-text');
    if (urlEl && data.startsWith('http')) urlEl.value = data;
    else if (txtEl) txtEl.value = data;
    schedRender();
  }, 200);
}
function resetScanner() {
  document.getElementById('scan-result').style.display = 'none';
  if (typeof stopScanner==='function') stopScanner();
}

// ── Undo / Redo ────────────────────────────────────────────
const _undoStack = [];
const _redoStack = [];

function pushUndo() {
  _undoStack.push(JSON.stringify(S));
  if (_undoStack.length > MAX_UNDO) _undoStack.shift();
  _redoStack.length = 0;
  updateUndoRedoBtns();
}
function undoQR() {
  if (!_undoStack.length) { showToast('Nothing to undo','info'); return; }
  _redoStack.push(JSON.stringify(S));
  Object.assign(S, JSON.parse(_undoStack.pop()));
  syncAllUI(); updatePickrColors(); renderQR(); updateUndoRedoBtns();
}
function redoQR() {
  if (!_redoStack.length) { showToast('Nothing to redo','info'); return; }
  _undoStack.push(JSON.stringify(S));
  Object.assign(S, JSON.parse(_redoStack.pop()));
  syncAllUI(); updatePickrColors(); renderQR(); updateUndoRedoBtns();
}
function updateUndoRedoBtns() {
  const uBtn = document.getElementById('undo-btn');
  const rBtn = document.getElementById('redo-btn');
  if (uBtn) uBtn.disabled = _undoStack.length===0;
  if (rBtn) rBtn.disabled = _redoStack.length===0;
}

// ── Pickr ──────────────────────────────────────────────────
const _pickrInstances = {};
function initPickrPickers() {
  const pickers = [
    {id:'fg-pickr-wrap', key:'fgColor', def:'#000000'},
    {id:'bg-pickr-wrap', key:'bgColor', def:'#ffffff'},
    {id:'gc1-pickr-wrap',key:'gc1',     def:'#818CF8'},
    {id:'gc2-pickr-wrap',key:'gc2',     def:'#C084FC'},
    {id:'mb-pickr-wrap', key:'mbColor', def:'#000000'},
    {id:'mc-pickr-wrap', key:'mcColor', def:'#000000'},
    {id:'ef-pickr-wrap', key:'efColor', def:'#000000'},
    {id:'ei-pickr-wrap', key:'eiColor', def:'#000000'},
    {id:'flc-pickr-wrap',key:'frameLabelColor',def:'#ffffff'},
    {id:'fc-pickr-wrap', key:'frameColor',     def:'#818CF8'},
    {id:'fc2-pickr-wrap',key:'frameColor',     def:'#818CF8'},
    {id:'lpc-pickr-wrap',key:'logoPadColor',   def:'#ffffff'},
    {id:'sc-pickr-wrap', key:'shadowColor',    def:'#000000'},
  ];
  pickers.forEach(({id,key,def})=>{
    const el = document.getElementById(id);
    if (!el) return;
    try {
      const inst = Pickr.create({
        el, theme:'nano', default: S[key]||def,
        components:{ preview:true, opacity:false, hue:true,
          interaction:{ hex:true, rgba:false, input:true, save:true, cancel:true }},
        i18n:{'btn:save':'Apply','btn:cancel':'Cancel'}
      });
      inst.on('save', color=>{
        if (!color) return;
        const hex = color.toHEXA().toString();
        S[key] = hex;
        schedRender();
        inst.hide();
      });
      _pickrInstances[key] = inst;
    } catch(e) {
      el.innerHTML = `<input type="color" value="${S[key]||def}"
        style="width:32px;height:32px;border:2px solid var(--border);border-radius:9px;cursor:pointer;padding:2px;"
        oninput="S['${key}']=this.value;schedRender()">`;
    }
  });
}
function updatePickrColors() {
  Object.entries(_pickrInstances).forEach(([key,inst])=>{
    try { inst.setColor(S[key]||'#000000', true); } catch(e){}
  });
}

// ── Main Boot ──────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', ()=>{
  // Apply settings first (theme, accent, etc.)
  loadSettings();
  updateThemeIcons(document.documentElement.getAttribute('data-theme'));

  // Restore defaults from SETTINGS
  S.size = SETTINGS.defaultSize || 600;
  S.ec   = SETTINGS.defaultEC   || 'H';

  // Render
  renderTypeTabs();
  renderTypeTab(S.activeType);
  renderPatternGrids();
  renderFrameGrids();
  renderLogoGrid();
  renderPresetTemplates();
  renderUserTemplates();

  // Sync size/ec inputs
  const sizeEl = document.getElementById('qr-size');
  const ecEl   = document.getElementById('ec-level');
  if (sizeEl) sizeEl.value = S.size;
  if (ecEl)   ecEl.value   = S.ec;

  // Init Pickr
  if (typeof Pickr !== 'undefined') initPickrPickers();

  // Sync profile
  syncProfileUI();

  // Active mode
  switchMode('gen');
  updateProjectCounts();
  updateUndoRedoBtns();

  // Batch counter
  const batchInput = document.getElementById('batch-input');
  if (batchInput) {
    batchInput.addEventListener('input', ()=>{
      const lines = batchInput.value.split('\n').filter(l=>l.trim()).length;
      const hint = document.getElementById('batch-count-hint');
      if (hint) hint.textContent = lines+' item'+(lines!==1?'s':'');
    });
  }

  // PWA events
  document.addEventListener('pwa-installable', ()=>{
    const banner = document.getElementById('pwa-banner');
    if (banner) banner.replaceWith(renderPWABanner());
  });
  document.addEventListener('pwa-installed', ()=>{
    showToast('QR Prism installed! 🎉','success');
    const banner = document.getElementById('pwa-banner');
    if (banner) banner.replaceWith(renderPWABanner());
  });

  // System theme watcher
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e=>{
    if (SETTINGS.theme==='system') {
      applyTheme('system');
      updateThemeIcons(e.matches?'dark':'light');
    }
  });

  console.log('QR Prism v2.7 ready');
});
