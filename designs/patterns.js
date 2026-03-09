// =========================================================
// designs/patterns.js — QR Module Pattern Definitions
// Each pattern has a unique ID, name, and SVG preview
// These IDs are stored in state.S.pattern
// =========================================================

const PATTERN_DESIGNS = [

  {
    id: 'pat-square',
    name: 'Square',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="1"  width="9" height="9"/><rect x="12" y="1"  width="9" height="9"/>
      <rect x="23" y="1"  width="9" height="9"/><rect x="34" y="1"  width="9" height="9"/>
      <rect x="1"  y="12" width="9" height="9"/><rect x="12" y="12" width="9" height="9"/>
      <rect x="23" y="12" width="9" height="9"/><rect x="34" y="12" width="9" height="9"/>
      <rect x="1"  y="23" width="9" height="9"/><rect x="12" y="23" width="9" height="9"/>
      <rect x="23" y="23" width="9" height="9"/><rect x="34" y="23" width="9" height="9"/>
      <rect x="1"  y="34" width="9" height="9"/><rect x="12" y="34" width="9" height="9"/>
      <rect x="23" y="34" width="9" height="9"/><rect x="34" y="34" width="9" height="9"/>
    </svg>`
  },

  {
    id: 'pat-dots',
    name: 'Dots',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5"  cy="5.5"  r="4.5"/><circle cx="16.5" cy="5.5"  r="4.5"/>
      <circle cx="27.5" cy="5.5"  r="4.5"/><circle cx="38.5" cy="5.5"  r="4.5"/>
      <circle cx="5.5"  cy="16.5" r="4.5"/><circle cx="16.5" cy="16.5" r="4.5"/>
      <circle cx="27.5" cy="16.5" r="4.5"/><circle cx="38.5" cy="16.5" r="4.5"/>
      <circle cx="5.5"  cy="27.5" r="4.5"/><circle cx="16.5" cy="27.5" r="4.5"/>
      <circle cx="27.5" cy="27.5" r="4.5"/><circle cx="38.5" cy="27.5" r="4.5"/>
      <circle cx="5.5"  cy="38.5" r="4.5"/><circle cx="16.5" cy="38.5" r="4.5"/>
      <circle cx="27.5" cy="38.5" r="4.5"/><circle cx="38.5" cy="38.5" r="4.5"/>
    </svg>`
  },

  {
    id: 'pat-rounded',
    name: 'Rounded',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="1"  width="9" height="9" rx="2.5"/><rect x="12" y="1"  width="9" height="9" rx="2.5"/>
      <rect x="23" y="1"  width="9" height="9" rx="2.5"/><rect x="34" y="1"  width="9" height="9" rx="2.5"/>
      <rect x="1"  y="12" width="9" height="9" rx="2.5"/><rect x="12" y="12" width="9" height="9" rx="2.5"/>
      <rect x="23" y="12" width="9" height="9" rx="2.5"/><rect x="34" y="12" width="9" height="9" rx="2.5"/>
      <rect x="1"  y="23" width="9" height="9" rx="2.5"/><rect x="12" y="23" width="9" height="9" rx="2.5"/>
      <rect x="23" y="23" width="9" height="9" rx="2.5"/><rect x="34" y="23" width="9" height="9" rx="2.5"/>
      <rect x="1"  y="34" width="9" height="9" rx="2.5"/><rect x="12" y="34" width="9" height="9" rx="2.5"/>
      <rect x="23" y="34" width="9" height="9" rx="2.5"/><rect x="34" y="34" width="9" height="9" rx="2.5"/>
    </svg>`
  },

  {
    id: 'pat-extra-rounded',
    name: 'Soft Round',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="1"  y="1"  width="9" height="9" rx="4.5"/><rect x="12" y="1"  width="9" height="9" rx="4.5"/>
      <rect x="23" y="1"  width="9" height="9" rx="4.5"/><rect x="34" y="1"  width="9" height="9" rx="4.5"/>
      <rect x="1"  y="12" width="9" height="9" rx="4.5"/><rect x="12" y="12" width="9" height="9" rx="4.5"/>
      <rect x="23" y="12" width="9" height="9" rx="4.5"/><rect x="34" y="12" width="9" height="9" rx="4.5"/>
      <rect x="1"  y="23" width="9" height="9" rx="4.5"/><rect x="12" y="23" width="9" height="9" rx="4.5"/>
      <rect x="23" y="23" width="9" height="9" rx="4.5"/><rect x="34" y="23" width="9" height="9" rx="4.5"/>
      <rect x="1"  y="34" width="9" height="9" rx="4.5"/><rect x="12" y="34" width="9" height="9" rx="4.5"/>
      <rect x="23" y="34" width="9" height="9" rx="4.5"/><rect x="34" y="34" width="9" height="9" rx="4.5"/>
    </svg>`
  },

  {
    id: 'pat-classy',
    name: 'Classy',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5.5A4.5 4.5 0 0 1 5.5 1H10v9H1z"/><path d="M12 5.5A4.5 4.5 0 0 1 16.5 1H21v9h-9z"/>
      <path d="M23 5.5A4.5 4.5 0 0 1 27.5 1H32v9h-9z"/><path d="M34 5.5A4.5 4.5 0 0 1 38.5 1H43v9h-9z"/>
      <path d="M1 16.5A4.5 4.5 0 0 1 5.5 12H10v9H1z"/><path d="M12 16.5A4.5 4.5 0 0 1 16.5 12H21v9h-9z"/>
      <path d="M23 16.5A4.5 4.5 0 0 1 27.5 12H32v9h-9z"/><path d="M34 16.5A4.5 4.5 0 0 1 38.5 12H43v9h-9z"/>
      <path d="M1 27.5A4.5 4.5 0 0 1 5.5 23H10v9H1z"/><path d="M12 27.5A4.5 4.5 0 0 1 16.5 23H21v9h-9z"/>
      <path d="M23 27.5A4.5 4.5 0 0 1 27.5 23H32v9h-9z"/><path d="M34 27.5A4.5 4.5 0 0 1 38.5 23H43v9h-9z"/>
      <path d="M1 38.5A4.5 4.5 0 0 1 5.5 34H10v9H1z"/><path d="M12 38.5A4.5 4.5 0 0 1 16.5 34H21v9h-9z"/>
      <path d="M23 38.5A4.5 4.5 0 0 1 27.5 34H32v9h-9z"/><path d="M34 38.5A4.5 4.5 0 0 1 38.5 34H43v9h-9z"/>
    </svg>`
  },

  {
    id: 'pat-diamond',
    name: 'Diamond',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 1L10 5.5 5.5 10 1 5.5z"/><path d="M16.5 1L21 5.5 16.5 10 12 5.5z"/>
      <path d="M27.5 1L32 5.5 27.5 10 23 5.5z"/><path d="M38.5 1L43 5.5 38.5 10 34 5.5z"/>
      <path d="M5.5 12L10 16.5 5.5 21 1 16.5z"/><path d="M16.5 12L21 16.5 16.5 21 12 16.5z"/>
      <path d="M27.5 12L32 16.5 27.5 21 23 16.5z"/><path d="M38.5 12L43 16.5 38.5 21 34 16.5z"/>
      <path d="M5.5 23L10 27.5 5.5 32 1 27.5z"/><path d="M16.5 23L21 27.5 16.5 32 12 27.5z"/>
      <path d="M27.5 23L32 27.5 27.5 32 23 27.5z"/><path d="M38.5 23L43 27.5 38.5 32 34 27.5z"/>
      <path d="M5.5 34L10 38.5 5.5 43 1 38.5z"/><path d="M16.5 34L21 38.5 16.5 43 12 38.5z"/>
      <path d="M27.5 34L32 38.5 27.5 43 23 38.5z"/><path d="M38.5 34L43 38.5 38.5 43 34 38.5z"/>
    </svg>`
  },

  {
    id: 'pat-star',
    name: 'Star',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <polygon points="5.5,1 6.6,4.1 10,4.1 7.2,6.1 8.3,9.2 5.5,7.2 2.7,9.2 3.8,6.1 1,4.1 4.4,4.1"/>
      <polygon points="16.5,1 17.6,4.1 21,4.1 18.2,6.1 19.3,9.2 16.5,7.2 13.7,9.2 14.8,6.1 12,4.1 15.4,4.1"/>
      <polygon points="27.5,1 28.6,4.1 32,4.1 29.2,6.1 30.3,9.2 27.5,7.2 24.7,9.2 25.8,6.1 23,4.1 26.4,4.1"/>
      <polygon points="38.5,1 39.6,4.1 43,4.1 40.2,6.1 41.3,9.2 38.5,7.2 35.7,9.2 36.8,6.1 34,4.1 37.4,4.1"/>
      <polygon points="5.5,12 6.6,15.1 10,15.1 7.2,17.1 8.3,20.2 5.5,18.2 2.7,20.2 3.8,17.1 1,15.1 4.4,15.1"/>
      <polygon points="16.5,12 17.6,15.1 21,15.1 18.2,17.1 19.3,20.2 16.5,18.2 13.7,20.2 14.8,17.1 12,15.1 15.4,15.1"/>
      <polygon points="27.5,12 28.6,15.1 32,15.1 29.2,17.1 30.3,20.2 27.5,18.2 24.7,20.2 25.8,17.1 23,15.1 26.4,15.1"/>
      <polygon points="38.5,12 39.6,15.1 43,15.1 40.2,17.1 41.3,20.2 38.5,18.2 35.7,20.2 36.8,17.1 34,15.1 37.4,15.1"/>
      <polygon points="5.5,23 6.6,26.1 10,26.1 7.2,28.1 8.3,31.2 5.5,29.2 2.7,31.2 3.8,28.1 1,26.1 4.4,26.1"/>
      <polygon points="16.5,23 17.6,26.1 21,26.1 18.2,28.1 19.3,31.2 16.5,29.2 13.7,31.2 14.8,28.1 12,26.1 15.4,26.1"/>
      <polygon points="27.5,23 28.6,26.1 32,26.1 29.2,28.1 30.3,31.2 27.5,29.2 24.7,31.2 25.8,28.1 23,26.1 26.4,26.1"/>
      <polygon points="38.5,23 39.6,26.1 43,26.1 40.2,28.1 41.3,31.2 38.5,29.2 35.7,31.2 36.8,28.1 34,26.1 37.4,26.1"/>
      <polygon points="5.5,34 6.6,37.1 10,37.1 7.2,39.1 8.3,42.2 5.5,40.2 2.7,42.2 3.8,39.1 1,37.1 4.4,37.1"/>
      <polygon points="16.5,34 17.6,37.1 21,37.1 18.2,39.1 19.3,42.2 16.5,40.2 13.7,42.2 14.8,39.1 12,37.1 15.4,37.1"/>
      <polygon points="27.5,34 28.6,37.1 32,37.1 29.2,39.1 30.3,42.2 27.5,40.2 24.7,42.2 25.8,39.1 23,37.1 26.4,37.1"/>
      <polygon points="38.5,34 39.6,37.1 43,37.1 40.2,39.1 41.3,42.2 38.5,40.2 35.7,42.2 36.8,39.1 34,37.1 37.4,37.1"/>
    </svg>`
  },

  {
    id: 'pat-heart',
    name: 'Heart',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 2.5C4.5 1.2 2.5 1 1.2 2.3 0 3.5 0 5.5 1.5 7L5.5 11 9.5 7C11 5.5 11 3.5 9.8 2.3 8.5 1 6.5 1.2 5.5 2.5z"/>
      <path d="M16.5 2.5C15.5 1.2 13.5 1 12.2 2.3 11 3.5 11 5.5 12.5 7L16.5 11 20.5 7C22 5.5 22 3.5 20.8 2.3 19.5 1 17.5 1.2 16.5 2.5z"/>
      <path d="M27.5 2.5C26.5 1.2 24.5 1 23.2 2.3 22 3.5 22 5.5 23.5 7L27.5 11 31.5 7C33 5.5 33 3.5 31.8 2.3 30.5 1 28.5 1.2 27.5 2.5z"/>
      <path d="M38.5 2.5C37.5 1.2 35.5 1 34.2 2.3 33 3.5 33 5.5 34.5 7L38.5 11 42.5 7C44 5.5 44 3.5 42.8 2.3 41.5 1 39.5 1.2 38.5 2.5z"/>
      <path d="M5.5 13.5C4.5 12.2 2.5 12 1.2 13.3 0 14.5 0 16.5 1.5 18L5.5 22 9.5 18C11 16.5 11 14.5 9.8 13.3 8.5 12 6.5 12.2 5.5 13.5z"/>
      <path d="M16.5 13.5C15.5 12.2 13.5 12 12.2 13.3 11 14.5 11 16.5 12.5 18L16.5 22 20.5 18C22 16.5 22 14.5 20.8 13.3 19.5 12 17.5 12.2 16.5 13.5z"/>
      <path d="M27.5 13.5C26.5 12.2 24.5 12 23.2 13.3 22 14.5 22 16.5 23.5 18L27.5 22 31.5 18C33 16.5 33 14.5 31.8 13.3 30.5 12 28.5 12.2 27.5 13.5z"/>
      <path d="M38.5 13.5C37.5 12.2 35.5 12 34.2 13.3 33 14.5 33 16.5 34.5 18L38.5 22 42.5 18C44 16.5 44 14.5 42.8 13.3 41.5 12 39.5 12.2 38.5 13.5z"/>
      <path d="M5.5 24.5C4.5 23.2 2.5 23 1.2 24.3 0 25.5 0 27.5 1.5 29L5.5 33 9.5 29C11 27.5 11 25.5 9.8 24.3 8.5 23 6.5 23.2 5.5 24.5z"/>
      <path d="M16.5 24.5C15.5 23.2 13.5 23 12.2 24.3 11 25.5 11 27.5 12.5 29L16.5 33 20.5 29C22 27.5 22 25.5 20.8 24.3 19.5 23 17.5 23.2 16.5 24.5z"/>
      <path d="M27.5 24.5C26.5 23.2 24.5 23 23.2 24.3 22 25.5 22 27.5 23.5 29L27.5 33 31.5 29C33 27.5 33 25.5 31.8 24.3 30.5 23 28.5 23.2 27.5 24.5z"/>
      <path d="M38.5 24.5C37.5 23.2 35.5 23 34.2 24.3 33 25.5 33 27.5 34.5 29L38.5 33 42.5 29C44 27.5 44 25.5 42.8 24.3 41.5 23 39.5 23.2 38.5 24.5z"/>
      <path d="M5.5 35.5C4.5 34.2 2.5 34 1.2 35.3 0 36.5 0 38.5 1.5 40L5.5 44 9.5 40C11 38.5 11 36.5 9.8 35.3 8.5 34 6.5 34.2 5.5 35.5z"/>
      <path d="M16.5 35.5C15.5 34.2 13.5 34 12.2 35.3 11 36.5 11 38.5 12.5 40L16.5 44 20.5 40C22 38.5 22 36.5 20.8 35.3 19.5 34 17.5 34.2 16.5 35.5z"/>
      <path d="M27.5 35.5C26.5 34.2 24.5 34 23.2 35.3 22 36.5 22 38.5 23.5 40L27.5 44 31.5 40C33 38.5 33 36.5 31.8 35.3 30.5 34 28.5 34.2 27.5 35.5z"/>
      <path d="M38.5 35.5C37.5 34.2 35.5 34 34.2 35.3 33 36.5 33 38.5 34.5 40L38.5 44 42.5 40C44 38.5 44 36.5 42.8 35.3 41.5 34 39.5 34.2 38.5 35.5z"/>
    </svg>`
  },

  {
    id: 'pat-plus',
    name: 'Plus',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h3v3H3z M4 1h1v7H4z"/><path d="M14 3h3v3h-3z M15 1h1v7h-1z"/>
      <path d="M25 3h3v3h-3z M26 1h1v7h-1z"/><path d="M36 3h3v3h-3z M37 1h1v7h-1z"/>
      <path d="M3 14h3v3H3z M4 12h1v7H4z"/><path d="M14 14h3v3h-3z M15 12h1v7h-1z"/>
      <path d="M25 14h3v3h-3z M26 12h1v7h-1z"/><path d="M36 14h3v3h-3z M37 12h1v7h-1z"/>
      <path d="M3 25h3v3H3z M4 23h1v7H4z"/><path d="M14 25h3v3h-3z M15 23h1v7h-1z"/>
      <path d="M25 25h3v3h-3z M26 23h1v7h-1z"/><path d="M36 25h3v3h-3z M37 23h1v7h-1z"/>
      <path d="M3 36h3v3H3z M4 34h1v7H4z"/><path d="M14 36h3v3h-3z M15 34h1v7h-1z"/>
      <path d="M25 36h3v3h-3z M26 34h1v7h-1z"/><path d="M36 36h3v3h-3z M37 34h1v7h-1z"/>
    </svg>`
  },

  {
    id: 'pat-cross',
    name: 'Cross',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(2.5,2.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(13.5,2.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(24.5,2.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(35.5,2.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(2.5,13.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(13.5,13.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(24.5,13.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(35.5,13.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(2.5,24.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(13.5,24.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(24.5,24.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(35.5,24.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(2.5,35.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(13.5,35.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(24.5,35.5)"/>
      <path d="M1 1l2.5 2.5L5.5 1 7 2.5 4.5 5 7 7.5 5.5 9 3 6.5 .5 9 -1 7.5 1.5 5 -1 2.5z" transform="translate(35.5,35.5)"/>
    </svg>`
  },

  {
    id: 'pat-h-lines',
    name: 'H-Lines',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="4" width="9" height="3"/><rect x="12" y="4" width="9" height="3"/>
      <rect x="23" y="4" width="9" height="3"/><rect x="34" y="4" width="9" height="3"/>
      <rect x="1" y="15" width="9" height="3"/><rect x="12" y="15" width="9" height="3"/>
      <rect x="23" y="15" width="9" height="3"/><rect x="34" y="15" width="9" height="3"/>
      <rect x="1" y="26" width="9" height="3"/><rect x="12" y="26" width="9" height="3"/>
      <rect x="23" y="26" width="9" height="3"/><rect x="34" y="26" width="9" height="3"/>
      <rect x="1" y="37" width="9" height="3"/><rect x="12" y="37" width="9" height="3"/>
      <rect x="23" y="37" width="9" height="3"/><rect x="34" y="37" width="9" height="3"/>
    </svg>`
  },

  {
    id: 'pat-v-lines',
    name: 'V-Lines',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="1" width="3" height="9"/><rect x="15" y="1" width="3" height="9"/>
      <rect x="26" y="1" width="3" height="9"/><rect x="37" y="1" width="3" height="9"/>
      <rect x="4" y="12" width="3" height="9"/><rect x="15" y="12" width="3" height="9"/>
      <rect x="26" y="12" width="3" height="9"/><rect x="37" y="12" width="3" height="9"/>
      <rect x="4" y="23" width="3" height="9"/><rect x="15" y="23" width="3" height="9"/>
      <rect x="26" y="23" width="3" height="9"/><rect x="37" y="23" width="3" height="9"/>
      <rect x="4" y="34" width="3" height="9"/><rect x="15" y="34" width="3" height="9"/>
      <rect x="26" y="34" width="3" height="9"/><rect x="37" y="34" width="3" height="9"/>
    </svg>`
  },

  {
    id: 'pat-tiny-dots',
    name: 'Tiny Dots',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="5.5"  cy="5.5"  r="2.5"/><circle cx="16.5" cy="5.5"  r="2.5"/>
      <circle cx="27.5" cy="5.5"  r="2.5"/><circle cx="38.5" cy="5.5"  r="2.5"/>
      <circle cx="5.5"  cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>
      <circle cx="27.5" cy="16.5" r="2.5"/><circle cx="38.5" cy="16.5" r="2.5"/>
      <circle cx="5.5"  cy="27.5" r="2.5"/><circle cx="16.5" cy="27.5" r="2.5"/>
      <circle cx="27.5" cy="27.5" r="2.5"/><circle cx="38.5" cy="27.5" r="2.5"/>
      <circle cx="5.5"  cy="38.5" r="2.5"/><circle cx="16.5" cy="38.5" r="2.5"/>
      <circle cx="27.5" cy="38.5" r="2.5"/><circle cx="38.5" cy="38.5" r="2.5"/>
    </svg>`
  },

  {
    id: 'pat-leaf',
    name: 'Leaf',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 5.5C1 3 3 1 5.5 1S10 3 10 5.5 1 10 1 10 1 8 1 5.5z"/>
      <path d="M12 5.5C12 3 14 1 16.5 1S21 3 21 5.5 12 10 12 10 12 8 12 5.5z"/>
      <path d="M23 5.5C23 3 25 1 27.5 1S32 3 32 5.5 23 10 23 10 23 8 23 5.5z"/>
      <path d="M34 5.5C34 3 36 1 38.5 1S43 3 43 5.5 34 10 34 10 34 8 34 5.5z"/>
      <path d="M1 16.5C1 14 3 12 5.5 12S10 14 10 16.5 1 21 1 21 1 19 1 16.5z"/>
      <path d="M12 16.5C12 14 14 12 16.5 12S21 14 21 16.5 12 21 12 21 12 19 12 16.5z"/>
      <path d="M23 16.5C23 14 25 12 27.5 12S32 14 32 16.5 23 21 23 21 23 19 23 16.5z"/>
      <path d="M34 16.5C34 14 36 12 38.5 12S43 14 43 16.5 34 21 34 21 34 19 34 16.5z"/>
      <path d="M1 27.5C1 25 3 23 5.5 23S10 25 10 27.5 1 32 1 32 1 30 1 27.5z"/>
      <path d="M12 27.5C12 25 14 23 16.5 23S21 25 21 27.5 12 32 12 32 12 30 12 27.5z"/>
      <path d="M23 27.5C23 25 25 23 27.5 23S32 25 32 27.5 23 32 23 32 23 30 23 27.5z"/>
      <path d="M34 27.5C34 25 36 23 38.5 23S43 25 43 27.5 34 32 34 32 34 30 34 27.5z"/>
      <path d="M1 38.5C1 36 3 34 5.5 34S10 36 10 38.5 1 43 1 43 1 41 1 38.5z"/>
      <path d="M12 38.5C12 36 14 34 16.5 34S21 36 21 38.5 12 43 12 43 12 41 12 38.5z"/>
      <path d="M23 38.5C23 36 25 34 27.5 34S32 36 32 38.5 23 43 23 43 23 41 23 38.5z"/>
      <path d="M34 38.5C34 36 36 34 38.5 34S43 36 43 38.5 34 43 34 43 34 41 34 38.5z"/>
    </svg>`
  },

  {
    id: 'pat-ring',
    name: 'Ring',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.5 1A4.5 4.5 0 1 0 5.5 10A4.5 4.5 0 0 0 5.5 1zm0 1.5A3 3 0 1 1 5.5 8.5A3 3 0 0 1 5.5 2.5z"/>
      <path d="M16.5 1A4.5 4.5 0 1 0 16.5 10A4.5 4.5 0 0 0 16.5 1zm0 1.5A3 3 0 1 1 16.5 8.5A3 3 0 0 1 16.5 2.5z"/>
      <path d="M27.5 1A4.5 4.5 0 1 0 27.5 10A4.5 4.5 0 0 0 27.5 1zm0 1.5A3 3 0 1 1 27.5 8.5A3 3 0 0 1 27.5 2.5z"/>
      <path d="M38.5 1A4.5 4.5 0 1 0 38.5 10A4.5 4.5 0 0 0 38.5 1zm0 1.5A3 3 0 1 1 38.5 8.5A3 3 0 0 1 38.5 2.5z"/>
      <path d="M5.5 12A4.5 4.5 0 1 0 5.5 21A4.5 4.5 0 0 0 5.5 12zm0 1.5A3 3 0 1 1 5.5 19.5A3 3 0 0 1 5.5 13.5z"/>
      <path d="M16.5 12A4.5 4.5 0 1 0 16.5 21A4.5 4.5 0 0 0 16.5 12zm0 1.5A3 3 0 1 1 16.5 19.5A3 3 0 0 1 16.5 13.5z"/>
      <path d="M27.5 12A4.5 4.5 0 1 0 27.5 21A4.5 4.5 0 0 0 27.5 12zm0 1.5A3 3 0 1 1 27.5 19.5A3 3 0 0 1 27.5 13.5z"/>
      <path d="M38.5 12A4.5 4.5 0 1 0 38.5 21A4.5 4.5 0 0 0 38.5 12zm0 1.5A3 3 0 1 1 38.5 19.5A3 3 0 0 1 38.5 13.5z"/>
      <path d="M5.5 23A4.5 4.5 0 1 0 5.5 32A4.5 4.5 0 0 0 5.5 23zm0 1.5A3 3 0 1 1 5.5 30.5A3 3 0 0 1 5.5 24.5z"/>
      <path d="M16.5 23A4.5 4.5 0 1 0 16.5 32A4.5 4.5 0 0 0 16.5 23zm0 1.5A3 3 0 1 1 16.5 30.5A3 3 0 0 1 16.5 24.5z"/>
      <path d="M27.5 23A4.5 4.5 0 1 0 27.5 32A4.5 4.5 0 0 0 27.5 23zm0 1.5A3 3 0 1 1 27.5 30.5A3 3 0 0 1 27.5 24.5z"/>
      <path d="M38.5 23A4.5 4.5 0 1 0 38.5 32A4.5 4.5 0 0 0 38.5 23zm0 1.5A3 3 0 1 1 38.5 30.5A3 3 0 0 1 38.5 24.5z"/>
      <path d="M5.5 34A4.5 4.5 0 1 0 5.5 43A4.5 4.5 0 0 0 5.5 34zm0 1.5A3 3 0 1 1 5.5 41.5A3 3 0 0 1 5.5 35.5z"/>
      <path d="M16.5 34A4.5 4.5 0 1 0 16.5 43A4.5 4.5 0 0 0 16.5 34zm0 1.5A3 3 0 1 1 16.5 41.5A3 3 0 0 1 16.5 35.5z"/>
      <path d="M27.5 34A4.5 4.5 0 1 0 27.5 43A4.5 4.5 0 0 0 27.5 34zm0 1.5A3 3 0 1 1 27.5 41.5A3 3 0 0 1 27.5 35.5z"/>
      <path d="M38.5 34A4.5 4.5 0 1 0 38.5 43A4.5 4.5 0 0 0 38.5 34zm0 1.5A3 3 0 1 1 38.5 41.5A3 3 0 0 1 38.5 35.5z"/>
    </svg>`
  },

  {
    id: 'pat-bars',
    name: 'Bars',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="1" width="5" height="9" rx="2.5"/><rect x="13" y="1" width="5" height="9" rx="2.5"/>
      <rect x="24" y="1" width="5" height="9" rx="2.5"/><rect x="35" y="1" width="5" height="9" rx="2.5"/>
      <rect x="2" y="12" width="5" height="9" rx="2.5"/><rect x="13" y="12" width="5" height="9" rx="2.5"/>
      <rect x="24" y="12" width="5" height="9" rx="2.5"/><rect x="35" y="12" width="5" height="9" rx="2.5"/>
      <rect x="2" y="23" width="5" height="9" rx="2.5"/><rect x="13" y="23" width="5" height="9" rx="2.5"/>
      <rect x="24" y="23" width="5" height="9" rx="2.5"/><rect x="35" y="23" width="5" height="9" rx="2.5"/>
      <rect x="2" y="34" width="5" height="9" rx="2.5"/><rect x="13" y="34" width="5" height="9" rx="2.5"/>
      <rect x="24" y="34" width="5" height="9" rx="2.5"/><rect x="35" y="34" width="5" height="9" rx="2.5"/>
    </svg>`
  },

  {
    id: 'pat-wave',
    name: 'Wave',
    svg: `<svg viewBox="0 0 44 44" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 3 Q3 1 5.5 1 T10 3 V7 Q8 9 5.5 9 T1 7z"/>
      <path d="M12 3 Q14 1 16.5 1 T21 3 V7 Q19 9 16.5 9 T12 7z"/>
      <path d="M23 3 Q25 1 27.5 1 T32 3 V7 Q30 9 27.5 9 T23 7z"/>
      <path d="M34 3 Q36 1 38.5 1 T43 3 V7 Q41 9 38.5 9 T34 7z"/>
      <path d="M1 14 Q3 12 5.5 12 T10 14 V18 Q8 20 5.5 20 T1 18z"/>
      <path d="M12 14 Q14 12 16.5 12 T21 14 V18 Q19 20 16.5 20 T12 18z"/>
      <path d="M23 14 Q25 12 27.5 12 T32 14 V18 Q30 20 27.5 20 T23 18z"/>
      <path d="M34 14 Q36 12 38.5 12 T43 14 V18 Q41 20 38.5 20 T34 18z"/>
      <path d="M1 25 Q3 23 5.5 23 T10 25 V29 Q8 31 5.5 31 T1 29z"/>
      <path d="M12 25 Q14 23 16.5 23 T21 25 V29 Q19 31 16.5 31 T12 29z"/>
      <path d="M23 25 Q25 23 27.5 23 T32 25 V29 Q30 31 27.5 31 T23 29z"/>
      <path d="M34 25 Q36 23 38.5 23 T43 25 V29 Q41 31 38.5 31 T34 29z"/>
      <path d="M1 36 Q3 34 5.5 34 T10 36 V40 Q8 42 5.5 42 T1 40z"/>
      <path d="M12 36 Q14 34 16.5 34 T21 36 V40 Q19 42 16.5 42 T12 40z"/>
      <path d="M23 36 Q25 34 27.5 34 T32 36 V40 Q30 42 27.5 42 T23 40z"/>
      <path d="M34 36 Q36 34 38.5 34 T43 36 V40 Q41 42 38.5 42 T34 40z"/>
    </svg>`
  },

];
