// =========================================================
// settings.js — App Settings Tab + Documentation
// =========================================================

// ── Render Settings Page ──────────────────────────────────
function renderSettings() {
  const container = document.getElementById('settings-content');
  if (!container) return;

  container.innerHTML = `
    <!-- ── Theme & Appearance ── -->
    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-palette"></i> Appearance
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Theme</span>
          <span class="setting-desc">Choose your preferred color scheme</span>
        </div>
        <div class="theme-selector">
          <button class="theme-btn ${SETTINGS.theme === 'light' ? 'active' : ''}"
                  onclick="setSetting('theme','light')">
            <i class="fa-solid fa-sun"></i> Light
          </button>
          <button class="theme-btn ${SETTINGS.theme === 'dark' ? 'active' : ''}"
                  onclick="setSetting('theme','dark')">
            <i class="fa-solid fa-moon"></i> Dark
          </button>
          <button class="theme-btn ${SETTINGS.theme === 'system' ? 'active' : ''}"
                  onclick="setSetting('theme','system')">
            <i class="fa-solid fa-circle-half-stroke"></i> System
          </button>
        </div>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Animations</span>
          <span class="setting-desc">UI transitions and animations</span>
        </div>
        <label class="toggle">
          <input type="checkbox" ${SETTINGS.animateUI ? 'checked' : ''}
                 onchange="setSetting('animateUI', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- ── QR Defaults ── -->
    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-qrcode"></i> QR Defaults
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Default Size</span>
          <span class="setting-desc">Default output size in pixels</span>
        </div>
        <select class="select" onchange="setSetting('defaultSize', parseInt(this.value))">
          ${[256,512,600,800,1024,2048].map(v =>
            `<option value="${v}" ${SETTINGS.defaultSize === v ? 'selected' : ''}>${v}px</option>`
          ).join('')}
        </select>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Default Format</span>
          <span class="setting-desc">Default download format</span>
        </div>
        <select class="select" onchange="setSetting('defaultFormat', this.value)">
          ${['png','jpg','svg','webp'].map(v =>
            `<option value="${v}" ${SETTINGS.defaultFormat === v ? 'selected' : ''}>${v.toUpperCase()}</option>`
          ).join('')}
        </select>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Default EC Level</span>
          <span class="setting-desc">Error correction level</span>
        </div>
        <select class="select" onchange="setSetting('defaultEC', this.value)">
          ${[['L','Low (7%)'],['M','Medium (15%)'],['Q','Quartile (25%)'],['H','High (30%)']].map(([v,l]) =>
            `<option value="${v}" ${SETTINGS.defaultEC === v ? 'selected' : ''}>${v} – ${l}</option>`
          ).join('')}
        </select>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>High DPI Rendering</span>
          <span class="setting-desc">Crisp output on retina displays</span>
        </div>
        <label class="toggle">
          <input type="checkbox" ${SETTINGS.highDPI ? 'checked' : ''}
                 onchange="setSetting('highDPI', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>
    </div>

    <!-- ── Projects & Data ── -->
    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-folder"></i> Projects & Data
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Auto-save to Projects</span>
          <span class="setting-desc">Automatically save generated QR codes</span>
        </div>
        <label class="toggle">
          <input type="checkbox" ${SETTINGS.autoSaveProjects ? 'checked' : ''}
                 onchange="setSetting('autoSaveProjects', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Confirm on Delete</span>
          <span class="setting-desc">Ask before deleting projects or templates</span>
        </div>
        <label class="toggle">
          <input type="checkbox" ${SETTINGS.confirmDelete ? 'checked' : ''}
                 onchange="setSetting('confirmDelete', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Show Analytics</span>
          <span class="setting-desc">Show QR info badges and analytics panel</span>
        </div>
        <label class="toggle">
          <input type="checkbox" ${SETTINGS.showAnalytics ? 'checked' : ''}
                 onchange="setSetting('showAnalytics', this.checked)">
          <span class="toggle-slider"></span>
        </label>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Clear All Projects</span>
          <span class="setting-desc">Delete all saved QR codes from local storage</span>
        </div>
        <button class="btn btn-danger btn-sm" onclick="clearAllProjects()">
          <i class="fa-solid fa-trash"></i> Clear Projects
        </button>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Clear All Templates</span>
          <span class="setting-desc">Delete all saved custom templates</span>
        </div>
        <button class="btn btn-danger btn-sm" onclick="clearAllTemplates()">
          <i class="fa-solid fa-trash"></i> Clear Templates
        </button>
      </div>

      <div class="setting-row">
        <div class="setting-label">
          <span>Reset All Settings</span>
          <span class="setting-desc">Restore factory defaults</span>
        </div>
        <button class="btn btn-outline btn-sm" onclick="resetAllSettings()">
          <i class="fa-solid fa-rotate-left"></i> Reset
        </button>
      </div>
    </div>

    <!-- ── About ── -->
    <div class="settings-section">
      <div class="settings-section-title">
        <i class="fa-solid fa-circle-info"></i> About
      </div>
      <div class="about-block">
        <div class="about-logo">
          <i class="fa-solid fa-qrcode" style="font-size:2.5rem; color:var(--primary);"></i>
        </div>
        <div class="about-info">
          <div class="about-name">QR Studio Pro</div>
          <div class="about-version">Version 2.3</div>
          <div class="about-desc">Advanced QR Code Generator & Designer</div>
        </div>
      </div>
      <div class="setting-row" style="margin-top:8px;">
        <div class="setting-label">
          <span>Documentation</span>
          <span class="setting-desc">View README and full documentation</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="openDocumentation()">
          <i class="fa-brands fa-github"></i> View Docs
        </button>
      </div>
    </div>
  `;
}

// ── Set / apply a setting ─────────────────────────────────
function setSetting(key, value) {
  SETTINGS[key] = value;
  saveSettingsData();

  if (key === 'theme') {
    applyTheme(value);
    // Refresh theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.textContent.trim().toLowerCase().startsWith(value.charAt(0).toLowerCase()));
    });
  }
  if (key === 'animateUI') {
    document.documentElement.classList.toggle('no-animate', !value);
  }
}

// ── Clear all templates ───────────────────────────────────
function clearAllTemplates() {
  if (!confirm('Delete all saved templates?')) return;
  localStorage.removeItem('qrs_templates');
  showToast('Templates cleared', 'info');
}

// ── Reset all settings ────────────────────────────────────
function resetAllSettings() {
  if (!confirm('Reset all settings to defaults?')) return;
  localStorage.removeItem('qrs_settings');
  location.reload();
}

// ── Open Documentation (load README.md) ──────────────────
async function openDocumentation() {
  const modal = document.getElementById('docs-modal');
  const content = document.getElementById('docs-content');
  if (!modal || !content) return;

  content.innerHTML = '<div class="docs-loading"><div class="spinner"></div><span>Loading documentation...</span></div>';
  openModal('docs-modal');

  try {
    const res = await fetch('./README.md');
    if (!res.ok) throw new Error('Not found');
    const text = await res.text();
    content.innerHTML = renderMarkdown(text);
  } catch (e) {
    // Fallback: show GitHub README button
    content.innerHTML = `
      <div class="docs-fallback">
        <i class="fa-brands fa-github" style="font-size:3rem; color:var(--muted);"></i>
        <p>Could not load local README.md</p>
        <a class="btn btn-primary" href="https://github.com/muhtasim-rahman/UFMT-SSC26" target="_blank" rel="noopener">
          <i class="fa-brands fa-github"></i> View on GitHub
        </a>
      </div>`;
  }
}

// ── Minimal Markdown → HTML renderer (GitHub style) ──────
function renderMarkdown(md) {
  // Escape HTML first
  let html = md
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="md-code"><code>$1</code></pre>');
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="md-inline">$1</code>');
  // Headers
  html = html.replace(/^#{6}\s(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#{5}\s(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^#{4}\s(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^#{3}\s(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^#{2}\s(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#{1}\s(.+)$/gm, '<h1>$1</h1>');
  // Bold / italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;">');
  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr>');
  // Unordered lists
  html = html.replace(/((?:^[-*+]\s.+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^[-*+]\s/, '')}</li>`).join('');
    return `<ul>${items}</ul>`;
  });
  // Ordered lists
  html = html.replace(/((?:^\d+\.\s.+\n?)+)/gm, (match) => {
    const items = match.trim().split('\n').map(l => `<li>${l.replace(/^\d+\.\s/, '')}</li>`).join('');
    return `<ol>${items}</ol>`;
  });
  // Blockquotes
  html = html.replace(/^&gt;\s(.+)$/gm, '<blockquote>$1</blockquote>');
  // Paragraphs
  html = html.replace(/\n\n+/g, '</p><p>');
  html = '<p>' + html + '</p>';
  // Clean up empty tags
  html = html.replace(/<p><\/p>/g, '').replace(/<p>(<h[1-6]>)/g, '$1').replace(/(<\/h[1-6]>)<\/p>/g, '$1');

  return `<div class="md-body">${html}</div>`;
}
