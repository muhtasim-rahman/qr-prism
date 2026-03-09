// =========================================================
// settings.js — QR Prism v2.5
// Settings, PWA banner, export/import, profile, data ops
// =========================================================

// ── Render Settings Page ───────────────────────────────────
function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;

  const installed = isPWAInstalled();
  const projects  = JSON.parse(localStorage.getItem('qrs_projects')  || '[]');
  const templates = JSON.parse(localStorage.getItem('qrs_templates') || '[]');
  const savedCount  = projects.filter(p => p.type === 'saved').length;
  const autoCount   = projects.filter(p => p.type === 'auto').length;
  const tmplCount   = templates.length;

  container.innerHTML = `
    <!-- ══ PWA Install Banner ══ -->
    ${installed ? `
    <div class="pwa-banner pwa-installed-banner">
      <div class="pwa-banner-icon"><i class="fa-solid fa-check-circle"></i></div>
      <div class="pwa-banner-content">
        <div class="pwa-banner-title">অ্যাপ সক্রিয় আছে</div>
        <div class="pwa-banner-sub">আপনি QR Prism অ্যাপ ভার্সন ব্যবহার করছেন।</div>
      </div>
      <span style="font-size:1.6rem;">✅</span>
    </div>` : `
    <div class="pwa-banner pwa-install-banner">
      <div class="pwa-banner-icon"><i class="fa-solid fa-download"></i></div>
      <div class="pwa-banner-content">
        <div class="pwa-banner-title">অ্যাপ ইনস্টল করুন</div>
        <div class="pwa-banner-sub">অফলাইনে ব্যবহারের জন্য ইনস্টল করুন।</div>
      </div>
      <div class="pwa-banner-btn">
        <button class="btn btn-primary btn-sm" onclick="installPWA()">
          <i class="fa-solid fa-download"></i> ইনস্টল
        </button>
      </div>
    </div>`}

    <!-- ══ Appearance ══ -->
    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-palette"></i> চেহারা</div>
      <div class="setting-row">
        <div class="setting-label"><span>থিম</span><span class="setting-desc">আপনার পছন্দের কালার স্কিম</span></div>
        <div class="theme-selector">
          <button class="theme-btn ${SETTINGS.theme==='light'?'active':''}" onclick="setSetting('theme','light');renderSettings()">
            <i class="fa-solid fa-sun"></i> Light</button>
          <button class="theme-btn ${SETTINGS.theme==='dark'?'active':''}" onclick="setSetting('theme','dark');renderSettings()">
            <i class="fa-solid fa-moon"></i> Dark</button>
          <button class="theme-btn ${SETTINGS.theme==='system'?'active':''}" onclick="setSetting('theme','system');renderSettings()">
            <i class="fa-solid fa-circle-half-stroke"></i> System</button>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>অ্যানিমেশন</span><span class="setting-desc">UI ট্রানজিশন ও অ্যানিমেশন</span></div>
        <label class="toggle"><input type="checkbox" ${SETTINGS.animateUI!==false?'checked':''} onchange="setSetting('animateUI',this.checked)"><span class="toggle-slider"></span></label>
      </div>
    </div>

    <!-- ══ QR Defaults ══ -->
    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-qrcode"></i> QR ডিফল্ট</div>
      <div class="setting-row">
        <div class="setting-label"><span>ডিফল্ট সাইজ</span><span class="setting-desc">আউটপুটের ডিফল্ট সাইজ (পিক্সেল)</span></div>
        <select class="select" onchange="setSetting('defaultSize',parseInt(this.value))">
          ${[256,512,600,800,1024,2048].map(v=>`<option value="${v}" ${SETTINGS.defaultSize===v?'selected':''}>${v}px</option>`).join('')}
        </select>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>ডিফল্ট ফরম্যাট</span><span class="setting-desc">ডিফল্ট ডাউনলোড ফরম্যাট</span></div>
        <select class="select" onchange="setSetting('defaultFormat',this.value)">
          ${['png','jpg','svg','webp'].map(v=>`<option value="${v}" ${SETTINGS.defaultFormat===v?'selected':''}>${v.toUpperCase()}</option>`).join('')}
        </select>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>ডিফল্ট EC লেভেল</span><span class="setting-desc">ত্রুটি সংশোধনের মাত্রা</span></div>
        <select class="select" onchange="setSetting('defaultEC',this.value)">
          ${[['L','Low (7%)'],['M','Medium (15%)'],['Q','Quartile (25%)'],['H','High (30%)']].map(([v,l])=>`<option value="${v}" ${SETTINGS.defaultEC===v?'selected':''}>${v} – ${l}</option>`).join('')}
        </select>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>High DPI রেন্ডারিং</span><span class="setting-desc">রেটিনা ডিসপ্লেতে ক্রিস্প আউটপুট</span></div>
        <label class="toggle"><input type="checkbox" ${SETTINGS.highDPI!==false?'checked':''} onchange="setSetting('highDPI',this.checked)"><span class="toggle-slider"></span></label>
      </div>
    </div>

    <!-- ══ Projects & Data ══ -->
    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-database"></i> প্রজেক্ট ও ডেটা</div>
      <div class="setting-row">
        <div class="setting-label"><span>অটো-সেভ প্রজেক্ট</span><span class="setting-desc">তৈরি QR কোড স্বয়ংক্রিয়ভাবে সেভ করুন</span></div>
        <label class="toggle"><input type="checkbox" ${SETTINGS.autoSaveProjects?'checked':''} onchange="setSetting('autoSaveProjects',this.checked)"><span class="toggle-slider"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>ডিলিট নিশ্চিতকরণ</span><span class="setting-desc">ডিলিটের আগে নিশ্চিতকরণ চাওয়া হবে</span></div>
        <label class="toggle"><input type="checkbox" ${SETTINGS.confirmDelete!==false?'checked':''} onchange="setSetting('confirmDelete',this.checked)"><span class="toggle-slider"></span></label>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>Analytics দেখান</span><span class="setting-desc">QR ইনফো ব্যাজ এবং অ্যানালিটিক্স প্যানেল</span></div>
        <label class="toggle"><input type="checkbox" ${SETTINGS.showAnalytics!==false?'checked':''} onchange="setSetting('showAnalytics',this.checked)"><span class="toggle-slider"></span></label>
      </div>
    </div>

    <!-- ══ Export / Import ══ -->
    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-file-arrow-down"></i> এক্সপোর্ট / ইমপোর্ট</div>
      <div class="setting-row">
        <div class="setting-label"><span>প্রজেক্ট এক্সপোর্ট</span><span class="setting-desc">${savedCount} saved · ${autoCount} auto · মোট ${projects.length}টি</span></div>
        <button class="btn btn-primary btn-sm" onclick="exportProjects()" ${projects.length===0?'disabled':''}>
          <i class="fa-solid fa-file-arrow-down"></i> Export JSON</button>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>প্রজেক্ট ইমপোর্ট</span><span class="setting-desc">JSON ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span></div>
        <label class="btn btn-outline btn-sm" style="cursor:pointer;">
          <i class="fa-solid fa-file-arrow-up"></i> Import JSON
          <input type="file" accept=".json" style="display:none" onchange="importProjects(this)">
        </label>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>টেমপ্লেট এক্সপোর্ট</span><span class="setting-desc">${tmplCount}টি কাস্টম টেমপ্লেট</span></div>
        <button class="btn btn-primary btn-sm" onclick="exportTemplates()" ${tmplCount===0?'disabled':''}>
          <i class="fa-solid fa-file-arrow-down"></i> Export JSON</button>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>টেমপ্লেট ইমপোর্ট</span><span class="setting-desc">JSON ব্যাকআপ থেকে টেমপ্লেট রিস্টোর</span></div>
        <label class="btn btn-outline btn-sm" style="cursor:pointer;">
          <i class="fa-solid fa-file-arrow-up"></i> Import JSON
          <input type="file" accept=".json" style="display:none" onchange="importTemplates(this)">
        </label>
      </div>
    </div>

    <!-- ══ Danger Zone ══ -->
    <div class="settings-section">
      <div class="settings-section-title" style="color:var(--danger);"><i class="fa-solid fa-triangle-exclamation"></i> ডেটা মুছে ফেলুন</div>
      <div class="setting-row">
        <div class="setting-label"><span>সব প্রজেক্ট মুছুন</span><span class="setting-desc">${projects.length}টি প্রজেক্ট মুছে ফেলা হবে</span></div>
        <button class="btn btn-danger btn-sm" onclick="clearAllProjectsConfirm()" ${projects.length===0?'disabled':''}><i class="fa-solid fa-trash"></i> মুছুন</button>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>সব টেমপ্লেট মুছুন</span><span class="setting-desc">${tmplCount}টি টেমপ্লেট মুছে ফেলা হবে</span></div>
        <button class="btn btn-danger btn-sm" onclick="clearAllTemplatesConfirm()" ${tmplCount===0?'disabled':''}><i class="fa-solid fa-trash"></i> মুছুন</button>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>সব ডেটা রিসেট</span><span class="setting-desc">সব সেটিংস, প্রজেক্ট ও টেমপ্লেট মুছবে</span></div>
        <button class="btn btn-danger btn-sm" onclick="resetEverythingConfirm()"><i class="fa-solid fa-rotate-left"></i> রিসেট</button>
      </div>
    </div>

    <!-- ══ About ══ -->
    <div class="settings-section">
      <div class="settings-section-title"><i class="fa-solid fa-circle-info"></i> সম্পর্কে</div>
      <div class="about-block">
        <div class="about-logo-wrap">
          <img src="icons/logo-64.png" alt="QR Prism" width="48" height="48"
               onerror="this.style.display='none'">
        </div>
        <div class="about-info">
          <div class="about-name">QR Prism</div>
          <div class="about-version">Version 2.5</div>
          <div class="about-desc">Advanced QR Code Generator &amp; Designer</div>
          <div class="about-author">by <a href="https://mdturzo.odoo.com" target="_blank" rel="noopener">Muhtasim Rahman</a></div>
        </div>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>ডকুমেন্টেশন</span><span class="setting-desc">README ও সম্পূর্ণ ডকুমেন্টেশন দেখুন</span></div>
        <button class="btn btn-primary btn-sm" onclick="openDocumentation()"><i class="fa-brands fa-github"></i> দেখুন</button>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>অ্যাপ শেয়ার</span><span class="setting-desc">বন্ধুদের সাথে QR Prism শেয়ার করুন</span></div>
        <button class="btn btn-outline btn-sm" onclick="shareApp()"><i class="fa-solid fa-share-nodes"></i> শেয়ার</button>
      </div>
      <div class="setting-row">
        <div class="setting-label"><span>GitHub</span><span class="setting-desc">সোর্স কোড ও ইস্যু রিপোর্ট</span></div>
        <a class="btn btn-outline btn-sm" href="https://github.com/muhtasim-rahman/qr-prism" target="_blank" rel="noopener">
          <i class="fa-brands fa-github"></i> GitHub</a>
      </div>
    </div>
  `;
}

// ── Apply Setting ──────────────────────────────────────────
function setSetting(key, value) {
  SETTINGS[key] = value;
  saveSettingsData();
  if (key === 'theme') { applyTheme(value); updateThemeIcons(value); renderPatternGrids(); renderFrameGrids(); }
  if (key === 'animateUI') document.documentElement.classList.toggle('no-animate', !value);
}

// ── Export Projects ────────────────────────────────────────
function exportProjects() {
  try {
    const data = JSON.parse(localStorage.getItem('qrs_projects') || '[]');
    const count = data.length;
    const now = new Date();
    const p = n => String(n).padStart(2,'0');
    const fn = `qr-prism_projects_${count}_${p(now.getDate())}-${p(now.getMonth()+1)}-${now.getFullYear()}_${p(now.getHours())}-${p(now.getMinutes())}.json`;
    const blob = new Blob([JSON.stringify({version:'2.5',type:'projects',count,exported:now.toISOString(),data},null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:fn});
    a.click(); URL.revokeObjectURL(a.href);
    showToast(`${count}টি প্রজেক্ট এক্সপোর্ট হয়েছে`,'success');
  } catch { showToast('Export ব্যর্থ হয়েছে','error'); }
}

// ── Import Projects ────────────────────────────────────────
function importProjects(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const incoming = parsed.data || parsed;
      if (!Array.isArray(incoming)) throw 0;
      const existing = JSON.parse(localStorage.getItem('qrs_projects')||'[]');
      const existingIds = new Set(existing.map(p=>p.id));
      const newItems = incoming.filter(p=>p.id && !existingIds.has(p.id));
      localStorage.setItem('qrs_projects', JSON.stringify([...existing,...newItems]));
      showToast(`${newItems.length}টি নতুন প্রজেক্ট ইমপোর্ট হয়েছে`,'success');
      renderSettings(); updateProjectCounts();
    } catch { showToast('Invalid JSON file','error'); }
  };
  reader.readAsText(file); input.value='';
}

// ── Export Templates ───────────────────────────────────────
function exportTemplates() {
  try {
    const data = JSON.parse(localStorage.getItem('qrs_templates')||'[]');
    const count = data.length;
    const now = new Date();
    const p = n => String(n).padStart(2,'0');
    const fn = `qr-prism_templates_${count}_${p(now.getDate())}-${p(now.getMonth()+1)}-${now.getFullYear()}_${p(now.getHours())}-${p(now.getMinutes())}.json`;
    const blob = new Blob([JSON.stringify({version:'2.5',type:'templates',count,exported:now.toISOString(),data},null,2)],{type:'application/json'});
    const a = Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:fn});
    a.click(); URL.revokeObjectURL(a.href);
    showToast(`${count}টি টেমপ্লেট এক্সপোর্ট হয়েছে`,'success');
  } catch { showToast('Export ব্যর্থ হয়েছে','error'); }
}

// ── Import Templates ───────────────────────────────────────
function importTemplates(input) {
  const file = input.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const parsed = JSON.parse(e.target.result);
      const incoming = parsed.data || parsed;
      if (!Array.isArray(incoming)) throw 0;
      const existing = JSON.parse(localStorage.getItem('qrs_templates')||'[]');
      const existingIds = new Set(existing.map(t=>t.id));
      const newItems = incoming.filter(t=>t.id && !existingIds.has(t.id));
      localStorage.setItem('qrs_templates',JSON.stringify([...existing,...newItems]));
      showToast(`${newItems.length}টি নতুন টেমপ্লেট ইমপোর্ট হয়েছে`,'success');
      renderSettings(); renderUserTemplates();
    } catch { showToast('Invalid JSON file','error'); }
  };
  reader.readAsText(file); input.value='';
}

// ── Danger Zone ────────────────────────────────────────────
function clearAllProjectsConfirm() {
  const projects = JSON.parse(localStorage.getItem('qrs_projects')||'[]');
  if (!projects.length) return;
  showConfirm({
    title:'সব প্রজেক্ট মুছুন',
    msg:`${projects.length}টি প্রজেক্ট স্থায়ীভাবে মুছে ফেলা হবে।`,
    items: projects.slice(0,5).map(p=>p.name||p.data?.slice(0,40)||'Unnamed'),
    okLabel:'হ্যাঁ, সব মুছুন', okClass:'btn-danger',
    onConfirm:()=>{ localStorage.removeItem('qrs_projects'); showToast('সব প্রজেক্ট মুছে ফেলা হয়েছে','info'); renderSettings(); updateProjectCounts(); }
  });
}

function clearAllTemplatesConfirm() {
  const templates = JSON.parse(localStorage.getItem('qrs_templates')||'[]');
  if (!templates.length) return;
  showConfirm({
    title:'সব টেমপ্লেট মুছুন',
    msg:`${templates.length}টি কাস্টম টেমপ্লেট মুছে ফেলা হবে।`,
    items: templates.slice(0,5).map(t=>t.name||'Unnamed'),
    okLabel:'হ্যাঁ, সব মুছুন', okClass:'btn-danger',
    onConfirm:()=>{ localStorage.removeItem('qrs_templates'); showToast('সব টেমপ্লেট মুছে ফেলা হয়েছে','info'); renderSettings(); renderUserTemplates(); }
  });
}

function resetEverythingConfirm() {
  const pc = JSON.parse(localStorage.getItem('qrs_projects')||'[]').length;
  const tc = JSON.parse(localStorage.getItem('qrs_templates')||'[]').length;
  showConfirm({
    title:'সব ডেটা রিসেট',
    msg:'সব সেটিংস, প্রজেক্ট ও টেমপ্লেট মুছে যাবে।',
    items:[`${pc} প্রজেক্ট মুছবে`,`${tc} টেমপ্লেট মুছবে`,'সব সেটিংস ডিফল্টে ফিরবে'],
    okLabel:'হ্যাঁ, সব রিসেট', okClass:'btn-danger',
    onConfirm:()=>{ localStorage.clear(); location.reload(); }
  });
}

// ── Profile ────────────────────────────────────────────────
function renderProfile() {
  const container = document.getElementById('profile-content');
  if (!container) return;
  let profile = {};
  try { profile = JSON.parse(localStorage.getItem('qrs_profile')||'{}'); } catch {}
  const initials = (profile.name||'?').split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2);
  container.innerHTML = `
    <div class="profile-avatar-wrap">
      <div class="profile-avatar" id="pf-avatar-preview">
        ${profile.avatar
          ? `<img src="${profile.avatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
          : `<span style="font-size:2rem;font-weight:700;color:var(--primary);">${initials}</span>`}
      </div>
      <div class="profile-avatar-actions">
        <label class="btn btn-outline btn-sm" style="cursor:pointer;">
          <i class="fa-solid fa-camera"></i> ছবি পরিবর্তন
          <input type="file" accept="image/*" style="display:none" onchange="handleAvatarUpload(this)">
        </label>
        ${profile.avatar?`<button class="btn btn-ghost btn-sm" onclick="removeAvatar()"><i class="fa-solid fa-xmark"></i> সরান</button>`:''}
      </div>
    </div>
    <div class="profile-form">
      <div class="form-group">
        <label class="label">নাম</label>
        <input type="text" class="input" id="pf-name" value="${escHtml(profile.name||'')}" placeholder="আপনার নাম লিখুন" oninput="autoSaveProfile()">
      </div>
      <div class="form-group">
        <label class="label">বায়ো</label>
        <textarea class="input" id="pf-bio" rows="2" placeholder="ছোট পরিচিতি লিখুন" oninput="autoSaveProfile()">${escHtml(profile.bio||'')}</textarea>
      </div>
      <div class="form-group">
        <label class="label">ওয়েবসাইট</label>
        <input type="url" class="input" id="pf-web" value="${escHtml(profile.web||'')}" placeholder="https://yourwebsite.com" oninput="autoSaveProfile()">
      </div>
      <div class="form-group">
        <label class="label">ইমেইল</label>
        <input type="email" class="input" id="pf-email" value="${escHtml(profile.email||'')}" placeholder="your@email.com" oninput="autoSaveProfile()">
      </div>
    </div>
    <div class="profile-save-row">
      <span class="profile-save-status" id="pf-status"></span>
      <button class="btn btn-primary" onclick="saveProfile()"><i class="fa-solid fa-floppy-disk"></i> প্রোফাইল সেভ করুন</button>
    </div>`;
}

let _pfTimer;
function autoSaveProfile() {
  clearTimeout(_pfTimer);
  const s = document.getElementById('pf-status');
  if (s) s.innerHTML = '<i class="fa-solid fa-circle" style="color:var(--warning);font-size:.45rem;vertical-align:middle;margin-right:4px;"></i>সেভ হয়নি';
  _pfTimer = setTimeout(saveProfile, 1500);
}

function saveProfile() {
  const profile = {
    name:   document.getElementById('pf-name')?.value.trim()||'',
    bio:    document.getElementById('pf-bio')?.value.trim()||'',
    web:    document.getElementById('pf-web')?.value.trim()||'',
    email:  document.getElementById('pf-email')?.value.trim()||'',
    avatar: _pfAvatar !== undefined ? _pfAvatar : (JSON.parse(localStorage.getItem('qrs_profile')||'{}').avatar||null),
  };
  localStorage.setItem('qrs_profile', JSON.stringify(profile));
  const s = document.getElementById('pf-status');
  if (s) s.innerHTML = '<i class="fa-solid fa-check" style="color:var(--success);margin-right:4px;"></i>সেভ হয়েছে';
  syncProfileUI();
  showToast('প্রোফাইল আপডেট হয়েছে','success');
}

let _pfAvatar;
function handleAvatarUpload(input) {
  const file = input.files[0]; if (!file) return;
  if (file.size > 2*1024*1024) { showToast('ছবি ২MB এর বেশি হবে না','error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    _pfAvatar = e.target.result;
    const preview = document.getElementById('pf-avatar-preview');
    if (preview) preview.innerHTML = `<img src="${_pfAvatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    autoSaveProfile();
  };
  reader.readAsDataURL(file); input.value='';
}

function removeAvatar() {
  _pfAvatar = null;
  try { const p = JSON.parse(localStorage.getItem('qrs_profile')||'{}'); p.avatar=null; localStorage.setItem('qrs_profile',JSON.stringify(p)); } catch {}
  syncProfileUI(); renderProfile();
  showToast('প্রোফাইল ছবি সরানো হয়েছে','info');
}

// ── Helpers ────────────────────────────────────────────────
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderMarkdown(md) {
  let h = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  h = h.replace(/```[\w]*\n?([\s\S]*?)```/g,'<pre class="md-code"><code>$1</code></pre>');
  h = h.replace(/`([^`]+)`/g,'<code class="md-inline">$1</code>');
  for (let i=6;i>=1;i--) h = h.replace(new RegExp(`^#{${i}}\\s(.+)$`,'gm'),`<h${i}>$1</h${i}>`);
  h = h.replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>');
  h = h.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
  h = h.replace(/\*(.+?)\*/g,'<em>$1</em>');
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  h = h.replace(/^---+$/gm,'<hr>');
  h = h.replace(/^[-*+]\s(.+)$/gm,'<li>$1</li>').replace(/(<li>.*<\/li>)/gs,'<ul>$1</ul>');
  h = h.replace(/\n\n/g,'</p><p>');
  return `<div class="md-body"><p>${h}</p></div>`;
}
