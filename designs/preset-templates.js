// =========================================================
// PRESET-TEMPLATES.JS — QR Prism v2.8
// 20 Premium Curated Preset Templates
// Uses V2.8 state structure (bgMode, fgGradient, customEyeColors…)
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
// =========================================================

const PRESET_TEMPLATES = [

  {
    name: 'Classic',
    settings: {
      bgMode:'solid', bgColor:'#FFFFFF',
      fgColor:'#000000', fgGradient:false,
      pattern:'pat-square', eyeFrame:'ef-square', eyeInner:'ei-square',
    }
  },

  {
    name: 'Prism Dark',
    settings: {
      bgMode:'solid', bgColor:'#0D0B21',
      fgColor:'#818CF8', fgGradient:false,
      pattern:'pat-round', eyeFrame:'ef-round-sm', eyeInner:'ei-squircle',
      frame:'frm-none',
    }
  },

  {
    name: 'Ocean',
    settings: {
      bgMode:'solid', bgColor:'#EFF6FF',
      fgColor:'#0EA5E9', fgGradient:true,
      gc1:'#0EA5E9', gc2:'#6366F1', gType:'linear', gAngle:135,
      pattern:'pat-circle', eyeFrame:'ef-round-lg', eyeInner:'ei-circle',
    }
  },

  {
    name: 'Sunset',
    settings: {
      bgMode:'solid', bgColor:'#FFF7ED',
      fgColor:'#F97316', fgGradient:true,
      gc1:'#F97316', gc2:'#EC4899', gType:'linear', gAngle:45,
      pattern:'pat-squircle', eyeFrame:'ef-squircle', eyeInner:'ei-round',
      frame:'frm-bottom-bar', frameColor:'#F97316', frameLabelColor:'#FFFFFF', frameLabel:'Scan Me',
    }
  },

  {
    name: 'Forest',
    settings: {
      bgMode:'solid', bgColor:'#F0FDF4',
      fgColor:'#15803D', fgGradient:false,
      pattern:'pat-raindrop', eyeFrame:'ef-leaf-tr', eyeInner:'ei-circle',
    }
  },

  {
    name: 'Midnight',
    settings: {
      bgMode:'solid', bgColor:'#0F172A',
      fgColor:'#CBD5E1', fgGradient:false,
      pattern:'pat-dot', eyeFrame:'ef-round-sm', eyeInner:'ei-circle',
    }
  },

  {
    name: 'Rose Gold',
    settings: {
      bgMode:'solid', bgColor:'#FFF1F2',
      fgColor:'#BE185D', fgGradient:true,
      gc1:'#BE185D', gc2:'#F97316', gType:'linear', gAngle:135,
      pattern:'pat-diamond', eyeFrame:'ef-diamond', eyeInner:'ei-diamond',
      customEyeColors:true, efColor:'#9F1239', eiColor:'#9F1239',
    }
  },

  {
    name: 'Neon Cyber',
    settings: {
      bgMode:'solid', bgColor:'#0A0A0F',
      fgColor:'#4ADE80', fgGradient:false,
      pattern:'pat-circle', eyeFrame:'ef-chamfer', eyeInner:'ei-circle',
      customEyeColors:true, efColor:'#4ADE80', eiColor:'#4ADE80',
      frame:'frm-brackets', frameColor:'#4ADE80',
    }
  },

  {
    name: 'Purple Haze',
    settings: {
      bgMode:'solid', bgColor:'#1A0E2E',
      fgColor:'#A855F7', fgGradient:true,
      gc1:'#A855F7', gc2:'#6366F1', gType:'radial', gAngle:45,
      pattern:'pat-round', eyeFrame:'ef-round-lg', eyeInner:'ei-squircle',
    }
  },

  {
    name: 'Arctic Blue',
    settings: {
      bgMode:'solid', bgColor:'#E0F2FE',
      fgColor:'#0369A1', fgGradient:false,
      pattern:'pat-hexagon', eyeFrame:'ef-hexagon', eyeInner:'ei-hexagon',
      customEyeColors:true, efColor:'#0369A1', eiColor:'#0369A1',
    }
  },

  {
    name: 'Clean Minimal',
    settings: {
      bgMode:'solid', bgColor:'#FAFAFA',
      fgColor:'#18181B', fgGradient:false,
      pattern:'pat-squircle', eyeFrame:'ef-round-sm', eyeInner:'ei-squircle',
      frame:'frm-border-thin', frameColor:'#D4D4D8',
    }
  },

  {
    name: 'Coral',
    settings: {
      bgMode:'solid', bgColor:'#F43F5E',
      fgColor:'#FFFFFF', fgGradient:false,
      pattern:'pat-round', eyeFrame:'ef-round-lg', eyeInner:'ei-circle',
      frame:'frm-bottom-bar', frameColor:'#9F1239', frameLabelColor:'#FFFFFF',
    }
  },

  {
    name: 'Golden Hour',
    settings: {
      bgMode:'solid', bgColor:'#FFFBEB',
      fgColor:'#B45309', fgGradient:true,
      gc1:'#D97706', gc2:'#DC2626', gType:'linear', gAngle:45,
      pattern:'pat-diamond', eyeFrame:'ef-notch', eyeInner:'ei-diamond',
    }
  },

  {
    name: 'Lava',
    settings: {
      bgMode:'solid', bgColor:'#1C0A00',
      fgColor:'#EF4444', fgGradient:true,
      gc1:'#EF4444', gc2:'#F97316', gType:'linear', gAngle:90,
      pattern:'pat-circle', eyeFrame:'ef-circle', eyeInner:'ei-ring',
    }
  },

  {
    name: 'Emerald Night',
    settings: {
      bgMode:'solid', bgColor:'#064E3B',
      fgColor:'#FFFFFF', fgGradient:false,
      pattern:'pat-squircle', eyeFrame:'ef-squircle', eyeInner:'ei-squircle',
      frame:'frm-rounded-label', frameColor:'#059669', frameLabelColor:'#FFFFFF', frameLabel:'Scan Me',
    }
  },

  {
    name: 'Prism Glow',
    settings: {
      bgMode:'solid', bgColor:'#1E1B4B',
      fgColor:'#818CF8', fgGradient:true,
      gc1:'#818CF8', gc2:'#EC4899', gType:'linear', gAngle:135,
      pattern:'pat-crystal', eyeFrame:'ef-mixed', eyeInner:'ei-crystal',
      frame:'frm-bottom-bar', frameColor:'#6366F1', frameLabelColor:'#FFFFFF',
    }
  },

  {
    name: 'Crystal Blue',
    settings: {
      bgMode:'solid', bgColor:'#0F172A',
      fgColor:'#22D3EE', fgGradient:true,
      gc1:'#22D3EE', gc2:'#818CF8', gType:'linear', gAngle:45,
      pattern:'pat-crystal', eyeFrame:'ef-diamond', eyeInner:'ei-crystal',
      customEyeColors:true, efColor:'#22D3EE', eiColor:'#818CF8',
    }
  },

  {
    name: 'Warm Polaroid',
    settings: {
      bgMode:'solid', bgColor:'#FFFBF0',
      fgColor:'#78350F', fgGradient:false,
      pattern:'pat-square', eyeFrame:'ef-square', eyeInner:'ei-square',
      frame:'frm-polaroid', frameColor:'#FEF9EE', frameLabelColor:'#78350F', frameLabel:'Scan Me',
    }
  },

  {
    name: 'Dark Badge',
    settings: {
      bgMode:'solid', bgColor:'#0F0F1A',
      fgColor:'#C084FC', fgGradient:true,
      gc1:'#818CF8', gc2:'#C084FC', gType:'linear', gAngle:135,
      pattern:'pat-round', eyeFrame:'ef-pill', eyeInner:'ei-pill',
      frame:'frm-badge', frameColor:'#4F46E5', frameLabelColor:'#FFFFFF', frameLabel:'QR Prism',
    }
  },

  {
    name: 'Transparent Glass',
    settings: {
      bgMode:'transparent',
      fgColor:'#1E1B4B', fgGradient:false,
      pattern:'pat-round', eyeFrame:'ef-round-sm', eyeInner:'ei-circle',
    }
  },

];
