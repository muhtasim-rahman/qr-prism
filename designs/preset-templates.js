// =========================================================
// designs/preset-templates.js — 15 Premium Preset Templates
// Each uses existing part IDs from patterns.js, eye-frames.js,
// eye-inners.js, frames.js for full compatibility
// =========================================================

const PRESET_TEMPLATES = [

  {
    id: 'tmpl-midnight-pro',
    name: 'Midnight Pro',
    thumbnail: null, // generated at runtime
    state: {
      fgColor: '#FFFFFF', bgColor: '#0A0A0F', transparent: false,
      gradient: true, gType: 'radial', gc1: '#6C63FF', gc2: '#0A0A0F', gAngle: 0,
      pattern: 'pat-rounded', eyeFrame: 'ef-circle', eyeInner: 'ei-circle',
      customMarker: false, customEF: true, efColor: '#6C63FF',
      customEI: true, eiColor: '#FFFFFF',
      frame: 'frm-none', logoKey: null,
      ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-ocean-breeze',
    name: 'Ocean Breeze',
    state: {
      fgColor: '#0077B6', bgColor: '#E0F4FF', transparent: false,
      gradient: false,
      pattern: 'pat-circle', eyeFrame: 'ef-rounded-outer', eyeInner: 'ei-circle',
      customMarker: true, mbColor: '#0077B6', mcColor: '#00B4D8',
      customEF: false, customEI: false,
      frame: 'frm-banner-bottom', frameLabel: 'Scan Me', frameFont: 'Poppins',
      frameTSize: 100, frameLabelColor: '#FFFFFF', frameColor: '#0077B6',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-neon-pulse',
    name: 'Neon Pulse',
    state: {
      fgColor: '#39FF14', bgColor: '#000000', transparent: false,
      gradient: false,
      pattern: 'pat-square', eyeFrame: 'ef-square', eyeInner: 'ei-square',
      customMarker: true, mbColor: '#FF00FF', mcColor: '#39FF14',
      customEF: true, efColor: '#FF00FF',
      customEI: true, eiColor: '#00FFFF',
      frame: 'frm-none', logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-rose-gold',
    name: 'Rose Gold',
    state: {
      fgColor: '#7D3C60', bgColor: '#FFF0F4', transparent: false,
      gradient: true, gType: 'linear', gc1: '#C0526B', gc2: '#7D3C60', gAngle: 135,
      pattern: 'pat-rounded', eyeFrame: 'ef-rounded-outer', eyeInner: 'ei-squircle',
      customMarker: false, customEF: true, efColor: '#C0526B',
      customEI: true, eiColor: '#C0526B',
      frame: 'frm-pill-label', frameLabel: 'Scan Me', frameFont: 'Raleway',
      frameTSize: 100, frameLabelColor: '#FFFFFF', frameColor: '#C0526B',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-forest-calm',
    name: 'Forest Calm',
    state: {
      fgColor: '#2D6A4F', bgColor: '#F0FFF4', transparent: false,
      gradient: false,
      pattern: 'pat-leaf', eyeFrame: 'ef-leaf-corner', eyeInner: 'ei-leaf',
      customMarker: true, mbColor: '#2D6A4F', mcColor: '#52B788',
      customEF: true, efColor: '#1B4332',
      customEI: true, eiColor: '#52B788',
      frame: 'frm-banner-bottom', frameLabel: 'Scan Here', frameFont: 'Montserrat',
      frameTSize: 95, frameLabelColor: '#FFFFFF', frameColor: '#2D6A4F',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-sunset-gradient',
    name: 'Sunset Gradient',
    state: {
      fgColor: '#FF6B35', bgColor: '#FFF8F0', transparent: false,
      gradient: true, gType: 'linear', gc1: '#FF6B35', gc2: '#F7C59F', gAngle: 45,
      pattern: 'pat-squircle', eyeFrame: 'ef-rounded-outer', eyeInner: 'ei-rounded',
      customMarker: false, customEF: true, efColor: '#FF6B35',
      customEI: true, eiColor: '#D4380D',
      frame: 'frm-fancy-border-label', frameLabel: 'Scan Me', frameFont: 'Oswald',
      frameTSize: 105, frameLabelColor: '#FFFFFF', frameColor: '#FF6B35',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-minimal-dark',
    name: 'Minimal Dark',
    state: {
      fgColor: '#222222', bgColor: '#FFFFFF', transparent: false,
      gradient: false,
      pattern: 'pat-rounded', eyeFrame: 'ef-bracket', eyeInner: 'ei-dot',
      customMarker: false, customEF: false, customEI: false,
      frame: 'frm-corner-marks', frameColor: '#222222',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-corporate-blue',
    name: 'Corporate Blue',
    state: {
      fgColor: '#003087', bgColor: '#FFFFFF', transparent: false,
      gradient: false,
      pattern: 'pat-square', eyeFrame: 'ef-square', eyeInner: 'ei-square',
      customMarker: true, mbColor: '#003087', mcColor: '#0057A8',
      customEF: true, efColor: '#003087',
      customEI: true, eiColor: '#0057A8',
      frame: 'frm-badge', frameLabel: 'SCAN TO CONNECT', frameFont: 'Roboto',
      frameTSize: 90, frameLabelColor: '#FFFFFF', frameColor: '#003087',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-pastel-dream',
    name: 'Pastel Dream',
    state: {
      fgColor: '#9B72CF', bgColor: '#FEF9FF', transparent: false,
      gradient: true, gType: 'linear', gc1: '#9B72CF', gc2: '#CF72A8', gAngle: 90,
      pattern: 'pat-dot-sm', eyeFrame: 'ef-circle', eyeInner: 'ei-flower',
      customMarker: false, customEF: true, efColor: '#9B72CF',
      customEI: true, eiColor: '#CF72A8',
      frame: 'frm-none', logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-geometric-bold',
    name: 'Geometric Bold',
    state: {
      fgColor: '#1A1A2E', bgColor: '#FFFFFF', transparent: false,
      gradient: false,
      pattern: 'pat-diamond', eyeFrame: 'ef-diamond-frame', eyeInner: 'ei-diamond',
      customMarker: true, mbColor: '#E94560', mcColor: '#1A1A2E',
      customEF: true, efColor: '#E94560',
      customEI: true, eiColor: '#E94560',
      frame: 'frm-ribbon', frameLabel: 'SCAN ME', frameFont: 'Oswald',
      frameTSize: 110, frameLabelColor: '#FFFFFF', frameColor: '#E94560',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-galaxy',
    name: 'Galaxy',
    state: {
      fgColor: '#E0C3FC', bgColor: '#0D0221', transparent: false,
      gradient: true, gType: 'radial', gc1: '#8E2DE2', gc2: '#4A00E0', gAngle: 0,
      pattern: 'pat-star', eyeFrame: 'ef-circle', eyeInner: 'ei-star',
      customMarker: false, customEF: true, efColor: '#E0C3FC',
      customEI: true, eiColor: '#FFD700',
      frame: 'frm-none', logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-fire',
    name: 'Fire',
    state: {
      fgColor: '#FF4E00', bgColor: '#1A0000', transparent: false,
      gradient: true, gType: 'linear', gc1: '#FF4E00', gc2: '#FF9A00', gAngle: 180,
      pattern: 'pat-triangle', eyeFrame: 'ef-sharp-round', eyeInner: 'ei-sharp-corner',
      customMarker: false, customEF: true, efColor: '#FF9A00',
      customEI: true, eiColor: '#FFD700',
      frame: 'frm-banner-bottom', frameLabel: 'HOT LINK', frameFont: 'Oswald',
      frameTSize: 115, frameLabelColor: '#FFD700', frameColor: '#FF4E00',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-ice',
    name: 'Ice',
    state: {
      fgColor: '#00B4D8', bgColor: '#F0FBFF', transparent: false,
      gradient: true, gType: 'linear', gc1: '#00B4D8', gc2: '#90E0EF', gAngle: 45,
      pattern: 'pat-hexagon', eyeFrame: 'ef-double-line', eyeInner: 'ei-hexagon',
      customMarker: false, customEF: true, efColor: '#0077B6',
      customEI: true, eiColor: '#0077B6',
      frame: 'frm-double-border', frameColor: '#0077B6',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-golden-premium',
    name: 'Golden Premium',
    state: {
      fgColor: '#7B4F00', bgColor: '#FFFBF0', transparent: false,
      gradient: true, gType: 'linear', gc1: '#D4A017', gc2: '#FFD700', gAngle: 135,
      pattern: 'pat-squircle', eyeFrame: 'ef-shield', eyeInner: 'ei-target',
      customMarker: false, customEF: true, efColor: '#D4A017',
      customEI: true, eiColor: '#7B4F00',
      frame: 'frm-fancy-border-label', frameLabel: '✦ PREMIUM ✦', frameFont: 'Raleway',
      frameTSize: 95, frameLabelColor: '#7B4F00', frameColor: '#D4A017',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

  {
    id: 'tmpl-tech-minimal',
    name: 'Tech Minimal',
    state: {
      fgColor: '#00FF87', bgColor: '#0A1628', transparent: false,
      gradient: false,
      pattern: 'pat-plus', eyeFrame: 'ef-bracket', eyeInner: 'ei-cross',
      customMarker: true, mbColor: '#00FF87', mcColor: '#00D4FF',
      customEF: true, efColor: '#00FF87',
      customEI: true, eiColor: '#00D4FF',
      frame: 'frm-corner-marks', frameColor: '#00FF87',
      logoKey: null, ec: 'H', qz: 4,
    }
  },

];
