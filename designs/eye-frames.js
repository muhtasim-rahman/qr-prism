// =========================================================
// designs/eye-frames.js — QR Eye Frame Definitions
// Each eye frame has a unique ID, name, and SVG preview
// The preview shows the outer 7x7 ring of a finder pattern
// These IDs are stored in state.S.eyeFrame
// =========================================================

const EYE_FRAME_DESIGNS = [

  {
    id: 'ef-square',
    name: 'Square',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="40" height="40" rx="0" fill="none" stroke="currentColor" stroke-width="7"/>
      <rect x="15" y="15" width="14" height="14"/>
    </svg>`
  },

  {
    id: 'ef-rounded',
    name: 'Rounded',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="40" height="40" rx="6" fill="none" stroke="currentColor" stroke-width="7"/>
      <rect x="15" y="15" width="14" height="14" rx="3"/>
    </svg>`
  },

  {
    id: 'ef-extra-rounded',
    name: 'Soft Round',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="40" height="40" rx="12" fill="none" stroke="currentColor" stroke-width="7"/>
      <rect x="15" y="15" width="14" height="14" rx="6"/>
    </svg>`
  },

  {
    id: 'ef-circle',
    name: 'Circle',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="19" fill="none" stroke="currentColor" stroke-width="7"/>
      <circle cx="22" cy="22" r="6"/>
    </svg>`
  },

  {
    id: 'ef-diamond',
    name: 'Diamond',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2 L42 22 L22 42 L2 22z" fill="none" stroke="currentColor" stroke-width="7"/>
      <path d="M22 16 L28 22 L22 28 L16 22z"/>
    </svg>`
  },

  {
    id: 'ef-dots',
    name: 'Dotted',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="4"  r="3.5"/><circle cx="32" cy="6.5" r="3.5"/>
      <circle cx="39.5" cy="12" r="3.5"/><circle cx="40" cy="22"  r="3.5"/>
      <circle cx="39.5" cy="32" r="3.5"/><circle cx="32" cy="37.5" r="3.5"/>
      <circle cx="22" cy="40"  r="3.5"/><circle cx="12" cy="37.5" r="3.5"/>
      <circle cx="4.5"  cy="32" r="3.5"/><circle cx="4"  cy="22"  r="3.5"/>
      <circle cx="4.5"  cy="12" r="3.5"/><circle cx="12" cy="6.5" r="3.5"/>
      <rect x="15" y="15" width="14" height="14" rx="2"/>
    </svg>`
  },

  {
    id: 'ef-thick',
    name: 'Thick',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="42" height="42" rx="0" fill="none" stroke="currentColor" stroke-width="10"/>
      <rect x="15" y="15" width="14" height="14"/>
    </svg>`
  },

  {
    id: 'ef-double',
    name: 'Double',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="40" height="40" rx="0" fill="none" stroke="currentColor" stroke-width="3"/>
      <rect x="7" y="7" width="30" height="30" rx="0" fill="none" stroke="currentColor" stroke-width="3"/>
      <rect x="15" y="15" width="14" height="14"/>
    </svg>`
  },

  {
    id: 'ef-bracket',
    name: 'Bracket',
    svg: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="5" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 2 H2 V15"/><path d="M29 2 H42 V15"/>
      <path d="M2 29 V42 H15"/><path d="M42 29 V42 H29"/>
      <rect x="15" y="15" width="14" height="14" fill="currentColor" stroke="none"/>
    </svg>`
  },

  {
    id: 'ef-shield',
    name: 'Shield',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2 L40 8 L40 26 C40 34 32 40 22 42 C12 40 4 34 4 26 L4 8 Z" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="15" y="15" width="14" height="14" rx="2"/>
    </svg>`
  },

  {
    id: 'ef-hexagon',
    name: 'Hexagon',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2 L40 11 L40 33 L22 42 L4 33 L4 11 Z" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="15" y="15" width="14" height="14" rx="2"/>
    </svg>`
  },

  {
    id: 'ef-cut-corner',
    name: 'Cut Corner',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 2 L34 2 L42 10 L42 34 L34 42 L10 42 L2 34 L2 10 Z" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="15" y="15" width="14" height="14" rx="1"/>
    </svg>`
  },

  {
    id: 'ef-leaf',
    name: 'Leaf',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2 Q42 2 42 22 Q42 42 22 42 Q2 42 2 22 Q2 2 22 2" fill="none" stroke="currentColor" stroke-width="6"/>
      <rect x="15" y="15" width="14" height="14" rx="7"/>
    </svg>`
  },

  {
    id: 'ef-wavy',
    name: 'Wavy',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 4 Q11 2 16 4 Q21 6 26 4 Q31 2 36 4 Q41 6 41 11 Q43 16 41 21 Q39 26 41 31 Q43 36 41 38 Q36 43 31 41 Q26 39 21 41 Q16 43 11 41 Q6 39 5 34 Q3 29 5 24 Q7 19 5 14 Q3 9 6 4Z" fill="none" stroke="currentColor" stroke-width="5"/>
      <rect x="15" y="15" width="14" height="14" rx="3"/>
    </svg>`
  },

  {
    id: 'ef-arrow',
    name: 'Arrow Corner',
    svg: `<svg viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="5" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 14 L2 2 L14 2"/><path d="M30 2 L42 2 L42 14"/>
      <path d="M42 30 L42 42 L30 42"/><path d="M14 42 L2 42 L2 30"/>
      <rect x="15" y="15" width="14" height="14" fill="currentColor" stroke="none" rx="2"/>
    </svg>`
  },

];
