// =========================================================
// designs/eye-inners.js — QR Eye Inner Definitions
// Each eye inner has a unique ID, name, and SVG preview
// The preview shows the center 3x3 block of a finder pattern
// These IDs are stored in state.S.eyeInner
// =========================================================

const EYE_INNER_DESIGNS = [

  {
    id: 'ei-square',
    name: 'Square',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="36" height="36"/>
    </svg>`
  },

  {
    id: 'ei-circle',
    name: 'Circle',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="18"/>
    </svg>`
  },

  {
    id: 'ei-rounded',
    name: 'Rounded',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="36" height="36" rx="8"/>
    </svg>`
  },

  {
    id: 'ei-extra-rounded',
    name: 'Soft Round',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="36" height="36" rx="16"/>
    </svg>`
  },

  {
    id: 'ei-diamond',
    name: 'Diamond',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4 L40 22 L22 40 L4 22 Z"/>
    </svg>`
  },

  {
    id: 'ei-star',
    name: 'Star',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <polygon points="22,4 26.9,16.5 40,16.5 29.6,24.7 33.5,37.2 22,29.3 10.5,37.2 14.4,24.7 4,16.5 17.1,16.5"/>
    </svg>`
  },

  {
    id: 'ei-cross',
    name: 'Cross',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="15" y="4" width="14" height="36"/>
      <rect x="4" y="15" width="36" height="14"/>
    </svg>`
  },

  {
    id: 'ei-heart',
    name: 'Heart',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 38 C22 38 4 26 4 15 C4 9 8.5 5 13.5 5 C17.5 5 21 7.5 22 10 C23 7.5 26.5 5 30.5 5 C35.5 5 40 9 40 15 C40 26 22 38 22 38z"/>
    </svg>`
  },

  {
    id: 'ei-leaf',
    name: 'Leaf',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4 Q40 4 40 22 Q40 40 22 40 Q4 40 4 22 Q4 4 22 4"/>
    </svg>`
  },

  {
    id: 'ei-dot',
    name: 'Small Dot',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="10"/>
    </svg>`
  },

  {
    id: 'ei-ring',
    name: 'Ring',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" stroke-width="7"/>
    </svg>`
  },

  {
    id: 'ei-hexagon',
    name: 'Hexagon',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4 L38 13 L38 31 L22 40 L6 31 L6 13 Z"/>
    </svg>`
  },

  {
    id: 'ei-shield',
    name: 'Shield',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 4 L38 10 L38 24 C38 32 30 38 22 40 C14 38 6 32 6 24 L6 10 Z"/>
    </svg>`
  },

  {
    id: 'ei-arrow',
    name: 'Arrow',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 22 L22 6 L36 22 L28 22 L28 38 L16 38 L16 22 Z"/>
    </svg>`
  },

];
