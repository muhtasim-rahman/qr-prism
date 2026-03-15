// =========================================================
// FIREBASE.JS — QR Prism v2.8
// Firebase Auth + Realtime DB + ImgBB Image Upload
// Author: Muhtasim Rahman (Turzo) · https://mdturzo.odoo.com
//
// NOTE: Firebase Storage is NOT used (free plan limitation).
//       All images are uploaded to ImgBB and only the URLs
//       are stored in Firebase Realtime Database.
// =========================================================

// ── Firebase Configuration ────────────────────────────────
const firebaseConfig = {
  apiKey:            "AIzaSyDlAQWN_qCuCazfMx41Y-h4F2TINXYZXmw",
  authDomain:        "qr-prism.firebaseapp.com",
  databaseURL:       "https://qr-prism-default-rtdb.firebaseio.com",
  projectId:         "qr-prism",
  storageBucket:     "qr-prism.firebasestorage.app",
  messagingSenderId: "169303204628",
  appId:             "1:169303204628:web:53e2a57d295aa76ae85801",
  measurementId:     "G-SQB6MWB584"
};

// ── ImgBB Configuration ───────────────────────────────────
const IMGBB_API_KEY    = "9f4d048815c417191aa77456a820651d";
const IMGBB_ENDPOINT   = "https://api.imgbb.com/1/upload";

// ── Firebase Init ─────────────────────────────────────────
firebase.initializeApp(firebaseConfig);
const fbAuth = firebase.auth();
const fbDB   = firebase.database();

// ── Google Auth Provider ──────────────────────────────────
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ── Current User Cache (localStorage for fast load) ───────
let FB_USER = null; // active firebase user object

// Load cached user info so UI renders instantly before auth resolves
function loadCachedUser() {
  try {
    const raw = localStorage.getItem('qrp_user_cache');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveCachedUser(data) {
  try {
    localStorage.setItem('qrp_user_cache', JSON.stringify(data));
  } catch {}
}

function clearCachedUser() {
  localStorage.removeItem('qrp_user_cache');
}

// ══════════════════════════════════════════════════════════
// AUTH STATE LISTENER
// Runs whenever login/logout happens. Updates UI globally.
// ══════════════════════════════════════════════════════════
fbAuth.onAuthStateChanged(async (user) => {
  FB_USER = user;

  if (user) {
    // ── User is signed in ──────────────────────────────
    const cached = loadCachedUser() || {};

    // Immediately update UI with what we have cached
    if (cached.uid === user.uid) {
      updateAuthUI(cached);
    }

    // Fetch fresh profile from DB (may have richer data)
    try {
      const profile = await getUserProfile(user.uid);
      const merged = {
        uid:         user.uid,
        email:       user.email,
        displayName: profile?.name  || user.displayName || 'User',
        photoURL:    profile?.photo || user.photoURL    || null,
        bio:         profile?.bio   || '',
        website:     profile?.website || '',
        banner:      profile?.banner  || null,
      };
      saveCachedUser(merged);
      updateAuthUI(merged);

      // If this is first Google login and no profile data yet → seed it
      if (!profile?.name && user.displayName) {
        await saveUserProfile(user.uid, {
          name:    user.displayName,
          email:   user.email,
          photo:   user.photoURL || null,
          bio:     '',
          website: '',
          banner:  null,
        });
      }
    } catch (err) {
      console.warn('[Firebase] Profile fetch failed, using cached data:', err);
    }

    // Sync cloud data → local (projects, templates, settings)
    syncFromCloud(user.uid);

  } else {
    // ── User is signed out ─────────────────────────────
    clearCachedUser();
    updateAuthUI(null);
  }
});

// ══════════════════════════════════════════════════════════
// UI UPDATE AFTER AUTH CHANGE
// ══════════════════════════════════════════════════════════
function updateAuthUI(userData) {
  const loggedIn = !!userData;

  // Sidebar
  const spAvatar = document.getElementById('sp-avatar');
  const spName   = document.getElementById('sp-name');
  const spSub    = document.getElementById('sp-sub');
  const sidebarAuth = document.getElementById('sidebar-auth-area');

  // Topnav
  const topSignIn  = document.getElementById('topnav-signin-btn');
  const topAvatar  = document.getElementById('topnav-avatar-btn');
  const topAvatarDiv = document.getElementById('topnav-avatar');

  // Mobile
  const mobileSignIn = document.getElementById('mobile-signin-btn');
  const mobileAvatarBtn = document.getElementById('mobile-avatar-btn');
  const mobileAvatarDiv = document.getElementById('mobile-avatar-mini');

  // Bottom sheet
  const bsAuthBtn   = document.getElementById('bs-auth-btn');
  const bsAuthIcon  = document.getElementById('bs-auth-icon');
  const bsAuthLabel = document.getElementById('bs-auth-label');

  if (loggedIn) {
    // ── Build avatar content (photo or initials) ───────
    const initial = (userData.displayName || userData.email || '?')[0].toUpperCase();
    const avatarHTML = userData.photoURL
      ? `<img src="${userData.photoURL}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
      : initial;

    // Sidebar profile
    if (spAvatar)  spAvatar.innerHTML  = avatarHTML;
    if (spName)    spName.textContent  = userData.displayName || 'User';
    if (spSub)     spSub.textContent   = userData.email || '';
    if (sidebarAuth) sidebarAuth.style.display = 'none';

    // Topnav
    if (topSignIn)  topSignIn.style.display  = 'none';
    if (topAvatar)  topAvatar.style.display  = '';
    if (topAvatarDiv) topAvatarDiv.innerHTML = avatarHTML;

    // Mobile
    if (mobileSignIn)   mobileSignIn.style.display   = 'none';
    if (mobileAvatarBtn) mobileAvatarBtn.style.display = '';
    if (mobileAvatarDiv) mobileAvatarDiv.innerHTML    = avatarHTML;

    // Bottom sheet → Sign Out
    if (bsAuthBtn)   bsAuthBtn.onclick   = () => { closeBottomSheet(); signOut(); };
    if (bsAuthIcon)  bsAuthIcon.className = 'fa-solid fa-right-from-bracket';
    if (bsAuthLabel) bsAuthLabel.textContent = 'Sign Out';

  } else {
    // ── Logged out state ───────────────────────────────
    if (spAvatar)  spAvatar.innerHTML  = '<i class="fa-solid fa-user"></i>';
    if (spName)    spName.textContent  = 'Guest User';
    if (spSub)     spSub.textContent   = 'Sign in to save your work';
    if (sidebarAuth) sidebarAuth.style.display = '';

    if (topSignIn)  topSignIn.style.display  = '';
    if (topAvatar)  topAvatar.style.display  = 'none';

    if (mobileSignIn)    mobileSignIn.style.display    = '';
    if (mobileAvatarBtn) mobileAvatarBtn.style.display = 'none';

    if (bsAuthBtn)   bsAuthBtn.onclick   = () => { closeBottomSheet(); openModal('login-modal'); };
    if (bsAuthIcon)  bsAuthIcon.className = 'fa-solid fa-right-to-bracket';
    if (bsAuthLabel) bsAuthLabel.textContent = 'Sign In';
  }

  // Notify app.js that auth state changed (for profile page re-render etc.)
  document.dispatchEvent(new CustomEvent('qrp-auth-changed', { detail: userData }));
}

// ══════════════════════════════════════════════════════════
// AUTH FUNCTIONS
// ══════════════════════════════════════════════════════════

// ── Sign up with Email & Password ─────────────────────────
async function signUpWithEmail() {
  const nameEl = document.getElementById('signup-name');
  const emailEl = document.getElementById('signup-email');
  const passEl  = document.getElementById('signup-password');
  const errEl   = document.getElementById('signup-error');
  const btn     = document.getElementById('signup-submit-btn');

  const name  = nameEl?.value.trim() || '';
  const email = emailEl?.value.trim() || '';
  const pass  = passEl?.value || '';

  // Validation
  if (!email || !pass) { showAuthError('signup', 'Email and password are required.'); return; }
  if (pass.length < 6) { showAuthError('signup', 'Password must be at least 6 characters.'); return; }

  setAuthLoading(btn, true);
  hideAuthError('signup');

  try {
    const cred = await fbAuth.createUserWithEmailAndPassword(email, pass);

    // Update display name in Firebase Auth
    if (name) await cred.user.updateProfile({ displayName: name });

    // Seed user profile in DB
    await saveUserProfile(cred.user.uid, {
      name:    name || email.split('@')[0],
      email:   email,
      photo:   null,
      bio:     '',
      website: '',
      banner:  null,
    });

    closeModal('signup-modal');
    showToast('Account created! Welcome to QR Prism.', 'success');

    // Redirect to profile setup
    setTimeout(() => switchMode('profile'), 300);

  } catch (err) {
    showAuthError('signup', friendlyAuthError(err.code));
  } finally {
    setAuthLoading(btn, false);
  }
}

// ── Login with Email & Password ───────────────────────────
async function loginWithEmail() {
  const emailEl = document.getElementById('login-email');
  const passEl  = document.getElementById('login-password');
  const btn     = document.getElementById('login-submit-btn');

  const email = emailEl?.value.trim() || '';
  const pass  = passEl?.value || '';

  if (!email || !pass) { showAuthError('login', 'Please enter your email and password.'); return; }

  setAuthLoading(btn, true);
  hideAuthError('login');

  try {
    await fbAuth.signInWithEmailAndPassword(email, pass);
    closeModal('login-modal');
    showToast('Welcome back!', 'success');
  } catch (err) {
    showAuthError('login', friendlyAuthError(err.code));
  } finally {
    setAuthLoading(btn, false);
  }
}

// ── Sign In with Google ───────────────────────────────────
async function signInWithGoogle() {
  try {
    await fbAuth.signInWithPopup(googleProvider);
    closeModal('login-modal');
    closeModal('signup-modal');
    showToast('Signed in with Google!', 'success');
  } catch (err) {
    if (err.code !== 'auth/popup-closed-by-user') {
      showToast(friendlyAuthError(err.code), 'error');
    }
  }
}

// ── Sign Out ──────────────────────────────────────────────
async function signOut() {
  try {
    // Push local data to cloud before logout
    if (FB_USER) await syncToCloud(FB_USER.uid);
    await fbAuth.signOut();
    showToast('You have been signed out.', 'info');
    switchMode('gen');
  } catch (err) {
    console.error('[Firebase] Sign out error:', err);
    showToast('Sign out failed.', 'error');
  }
}

// ── Forgot Password ───────────────────────────────────────
async function forgotPassword() {
  const emailEl = document.getElementById('login-email');
  const email   = emailEl?.value.trim() || '';

  if (!email) {
    showAuthError('login', 'Enter your email address first.');
    return;
  }

  try {
    await fbAuth.sendPasswordResetEmail(email);
    showToast('Password reset email sent!', 'success');
  } catch (err) {
    showAuthError('login', friendlyAuthError(err.code));
  }
}

// ── Switch between login / signup modals ──────────────────
function switchAuthModal(to) {
  if (to === 'signup') {
    closeModal('login-modal');
    openModal('signup-modal');
  } else {
    closeModal('signup-modal');
    openModal('login-modal');
  }
}

// ── Handle profile icon click ─────────────────────────────
function handleProfileClick() {
  if (FB_USER) {
    switchMode('profile');
  } else {
    openModal('login-modal');
  }
}

// ── Auth error helpers ────────────────────────────────────
function showAuthError(form, msg) {
  const el = document.getElementById(`${form}-error`);
  if (el) { el.textContent = msg; el.style.display = ''; }
}
function hideAuthError(form) {
  const el = document.getElementById(`${form}-error`);
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}
function setAuthLoading(btn, loading) {
  if (!btn) return;
  btn.disabled = loading;
  btn.style.opacity = loading ? '.6' : '1';
}
function friendlyAuthError(code) {
  const map = {
    'auth/email-already-in-use':    'This email is already registered. Try signing in.',
    'auth/invalid-email':           'Invalid email address.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password. Please try again.',
    'auth/too-many-requests':       'Too many attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.',
    'auth/popup-blocked':           'Popup blocked. Allow popups for this site.',
    'auth/user-disabled':           'This account has been disabled.',
  };
  return map[code] || 'Something went wrong. Please try again.';
}

// ══════════════════════════════════════════════════════════
// FIREBASE REALTIME DATABASE HELPERS
// ══════════════════════════════════════════════════════════

// ── Save user profile ─────────────────────────────────────
async function saveUserProfile(uid, data) {
  if (!uid) return;
  await fbDB.ref(`users/${uid}/profile`).update(data);
}

// ── Get user profile ──────────────────────────────────────
async function getUserProfile(uid) {
  if (!uid) return null;
  const snap = await fbDB.ref(`users/${uid}/profile`).once('value');
  return snap.val();
}

// ── Generic save to user path ─────────────────────────────
async function saveUserData(uid, path, data) {
  if (!uid || !path) return;
  await fbDB.ref(`users/${uid}/${path}`).set(data);
}

// ── Generic read from user path ───────────────────────────
async function getUserData(uid, path) {
  if (!uid || !path) return null;
  const snap = await fbDB.ref(`users/${uid}/${path}`).once('value');
  return snap.val();
}

// ── Save report to central reports + user reports ─────────
async function saveReportToDB(uid, reportData) {
  if (!uid) return null;

  const reportId = fbDB.ref('reports').push().key;
  const timestamp = Date.now();

  const fullReport = {
    ...reportData,
    userId:    uid,
    createdAt: timestamp,
    status:    'pending',
    reportId:  reportId,
  };

  const updates = {};
  // Central reports collection (admin readable)
  updates[`reports/${reportId}`] = fullReport;
  // User's personal reports copy
  updates[`users/${uid}/reports/${reportId}`] = fullReport;

  await fbDB.ref().update(updates);
  return reportId;
}

// ── Get user reports ──────────────────────────────────────
async function getUserReports(uid) {
  if (!uid) return [];
  const snap = await fbDB.ref(`users/${uid}/reports`).once('value');
  const val = snap.val();
  if (!val) return [];
  return Object.values(val).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

// ══════════════════════════════════════════════════════════
// IMAGE COMPRESSION (Client-side, canvas-based)
// No external library needed — pure Canvas API
// ══════════════════════════════════════════════════════════

/**
 * Compress an image File/Blob to target size.
 * @param {File|Blob} file - Input image
 * @param {number}    maxWidth - Max output width in px (default 1600)
 * @param {number}    targetKB - Target size range: min (default 300KB)
 * @param {number}    maxKB    - Max size (default 800KB)
 * @returns {Promise<Blob>} Compressed WebP/JPEG blob
 */
async function compressImage(file, maxWidth = 1600, targetKB = 300, maxKB = 800) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Calculate dimensions keeping aspect ratio
      let { width, height } = img;
      if (width > maxWidth) {
        height = Math.round(height * maxWidth / width);
        width  = maxWidth;
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Determine starting quality based on original file size
      const origKB = file.size / 1024;
      let quality  = origKB > 2000 ? 0.70 : origKB > 1000 ? 0.80 : 0.88;

      // Try WebP first, fall back to JPEG
      const format = 'image/webp';

      function tryCompress(q) {
        canvas.toBlob((blob) => {
          if (!blob) { reject(new Error('Compression failed')); return; }

          const kbSize = blob.size / 1024;

          if (kbSize > maxKB && q > 0.30) {
            // Still too big, reduce quality
            tryCompress(q - 0.08);
          } else {
            resolve(blob);
          }
        }, format, q);
      }

      tryCompress(quality);
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

// ══════════════════════════════════════════════════════════
// IMGBB UPLOAD
// ══════════════════════════════════════════════════════════

/**
 * Upload a Blob to ImgBB.
 * @param {Blob}   blob       - Compressed image blob
 * @param {string} fileName   - File name (without extension)
 * @returns {Promise<string>} - Returns the display_url of uploaded image
 */
async function uploadToImgBB(blob, fileName = 'image') {
  const formData = new FormData();

  // ImgBB requires base64 or multipart
  const base64 = await blobToBase64(blob);
  formData.append('key',    IMGBB_API_KEY);
  formData.append('image',  base64.split(',')[1]); // strip data:... prefix
  formData.append('name',   fileName);

  const resp = await fetch(`${IMGBB_ENDPOINT}?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body:   formData,
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`ImgBB upload failed (${resp.status}): ${err}`);
  }

  const json = await resp.json();

  if (!json.success) {
    throw new Error('ImgBB upload returned failure: ' + JSON.stringify(json));
  }

  // Return the direct display URL
  return json.data.display_url;
}

/** Convert Blob → base64 data URL */
function blobToBase64(blob) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload  = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(blob);
  });
}

// ══════════════════════════════════════════════════════════
// PROFILE PHOTO UPLOAD WORKFLOW
// compress → crop (Cropper.js UI) → ImgBB → Firebase DB
// ══════════════════════════════════════════════════════════

// Cropper.js instance
let _cropper = null;
let _cropSourceBlob = null;

/**
 * Called when user picks a profile photo file.
 * Opens the crop modal with Cropper.js initialized.
 */
function handleProfilePhotoUpload(input) {
  const file = input.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file.', 'error');
    input.value = '';
    return;
  }

  const url = URL.createObjectURL(file);
  const cropImg = document.getElementById('crop-image');

  // Destroy previous instance if any
  if (_cropper) {
    _cropper.destroy();
    _cropper = null;
  }

  cropImg.src = url;

  // Wait for image to load, then init Cropper
  cropImg.onload = () => {
    _cropper = new Cropper(cropImg, {
      aspectRatio:    1,           // 1:1 square for profile photo
      viewMode:       1,           // crop box cannot exceed canvas
      autoCropArea:   0.85,        // crop area = 85% of canvas
      responsive:     true,
      restore:        false,
      movable:        true,
      zoomable:       true,
      rotatable:      true,
      scalable:       true,
      guides:         true,
      center:         true,
      highlight:      true,
      background:     false,
      cropBoxResizable: false,     // locked to square
      cropBoxMovable:  true,
      toggleDragModeOnDblclick: false,
      // Sync zoom range slider
      zoom(e) {
        const rangeEl = document.getElementById('crop-zoom-range');
        if (rangeEl) rangeEl.value = e.detail.ratio;
      },
    });
  };

  openModal('crop-modal');

  // Reset progress UI
  const progressWrap = document.getElementById('crop-upload-progress');
  if (progressWrap) progressWrap.style.display = 'none';

  // Reset input so same file can be picked again
  input.value = '';
}

// Rotate in crop modal
function cropRotate(deg) { _cropper?.rotate(deg); }

// Flip horizontal
function cropFlipX() {
  if (!_cropper) return;
  const data = _cropper.getData();
  _cropper.scale(-_cropper.getData().scaleX || -1, 1);
}

// Reset crop
function cropReset() {
  _cropper?.reset();
  const rangeEl = document.getElementById('crop-zoom-range');
  if (rangeEl) rangeEl.value = 0;
}

// Zoom via slider
function cropZoomTo(ratio) { _cropper?.zoomTo(ratio); }

// Close crop modal and clean up
function closeCropModal() {
  if (_cropper) { _cropper.destroy(); _cropper = null; }
  const cropImg = document.getElementById('crop-image');
  if (cropImg && cropImg.src) { URL.revokeObjectURL(cropImg.src); cropImg.src = ''; }
  closeModal('crop-modal');
}

/**
 * Called when user confirms crop.
 * Gets cropped canvas → compress → upload to ImgBB → save URL to Firebase.
 */
async function applyCrop() {
  if (!_cropper) { showToast('No image to crop.', 'error'); return; }
  if (!FB_USER)  { showToast('Sign in to upload a profile photo.', 'error'); return; }

  const btn = document.getElementById('crop-apply-btn');
  const progressWrap = document.getElementById('crop-upload-progress');
  const progressFill = document.getElementById('crop-progress-fill');
  const progressTxt  = document.getElementById('crop-progress-txt');

  setAuthLoading(btn, true);
  if (progressWrap) progressWrap.style.display = '';

  const updateProgress = (pct, txt) => {
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressTxt)  progressTxt.textContent  = txt;
  };

  try {
    updateProgress(10, 'Preparing image…');

    // Get cropped canvas (512×512 output — good for profile photos)
    const croppedCanvas = _cropper.getCroppedCanvas({ width: 512, height: 512 });

    // Canvas → Blob
    const croppedBlob = await new Promise((res) => {
      croppedCanvas.toBlob(res, 'image/webp', 0.88);
    });

    updateProgress(30, 'Compressing…');

    // Compress (it's already small from getCroppedCanvas, but just in case)
    const compressed = croppedBlob.size > 300 * 1024
      ? await compressImage(croppedBlob, 512, 100, 300)
      : croppedBlob;

    updateProgress(55, 'Uploading to server…');

    // Upload to ImgBB
    const fileName = `profile_${FB_USER.uid}_avatar`;
    const url = await uploadToImgBB(compressed, fileName);

    updateProgress(85, 'Saving to your account…');

    // Save URL to Firebase DB
    await fbDB.ref(`users/${FB_USER.uid}/profile/photo`).set(url);

    // Also update Auth profile photo (best-effort)
    try { await FB_USER.updateProfile({ photoURL: url }); } catch {}

    updateProgress(100, 'Done!');

    // Update cached user
    const cached = loadCachedUser() || {};
    cached.photoURL = url;
    saveCachedUser(cached);

    // Update UI avatars immediately
    updateAuthUI({ ...cached, photoURL: url });

    // Update profile edit modal preview if open
    const peAvatar = document.getElementById('pe-avatar');
    if (peAvatar) {
      peAvatar.innerHTML = `<img src="${url}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
    }

    showToast('Profile photo updated!', 'success');

    setTimeout(() => closeCropModal(), 600);

  } catch (err) {
    console.error('[ImgBB] Profile photo upload failed:', err);
    updateProgress(0, '');
    if (progressWrap) progressWrap.style.display = 'none';
    showToast('Upload failed: ' + (err.message || 'Unknown error'), 'error');
  } finally {
    setAuthLoading(btn, false);
  }
}

// ══════════════════════════════════════════════════════════
// REPORT IMAGES UPLOAD WORKFLOW
// compress each → upload to ImgBB → save all URLs + report data to Firebase
// ══════════════════════════════════════════════════════════

/**
 * Submit a full bug report with images.
 * @param {object}     reportData - { type, name, email, title, description }
 * @param {File[]}     imageFiles - Array of image File objects (max 10)
 * @returns {Promise<string>}     - reportId
 */
async function submitFullReport(reportData, imageFiles) {
  const uid    = FB_USER?.uid || 'anonymous';
  const reportId = `report_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Device info (collected automatically)
  const deviceInfo = {
    userAgent:   navigator.userAgent,
    language:    navigator.language,
    platform:    navigator.platform,
    screen:      `${screen.width}×${screen.height}`,
    viewport:    `${window.innerWidth}×${window.innerHeight}`,
    timestamp:   new Date().toISOString(),
  };

  let imageURLs = [];

  // Upload images if any
  if (imageFiles && imageFiles.length > 0) {
    const MAX_IMAGES = 5;
    const files = Array.from(imageFiles).slice(0, MAX_IMAGES);

    for (let i = 0; i < files.length; i++) {
      try {
        // Compress
        const compressed = await compressImage(files[i], 1600, 300, 800);

        // Upload to ImgBB
        const fileName = `report_${reportData.type || "bug"}_${uid}_${reportId}_${i + 1}`;
        const url = await uploadToImgBB(compressed, fileName);
        imageURLs.push(url);

      } catch (err) {
        console.warn(`[ImgBB] Report image ${i+1} upload failed:`, err);
        // Continue with remaining images even if one fails
      }
    }
  }

  // Build full report object
  const fullReport = {
    reportId,
    userId:      uid,
    name:        reportData.name   || '',
    email:       reportData.email  || '',
    type:        reportData.type   || 'bug',
    title:       reportData.title  || '',
    description: reportData.description || '',
    images:      imageURLs,
    deviceInfo,
    createdAt:   Date.now(),
    status:      'pending',
  };

  if (FB_USER) {
    // Authenticated: save to Firebase DB
    const updates = {};
    updates[`reports/${reportId}`]                      = fullReport;
    updates[`users/${uid}/reports/${reportId}`]         = fullReport;
    await fbDB.ref().update(updates);
  } else {
    // Guest: only save to central reports (no user path)
    await fbDB.ref(`reports/${reportId}`).set(fullReport);
  }

  return reportId;
}

// ══════════════════════════════════════════════════════════
// PROFILE EDIT SAVE (without photo — photo is handled by Cropper)
// ══════════════════════════════════════════════════════════
async function saveProfileEdit() {
  if (!FB_USER) { showToast('Sign in to edit your profile.', 'error'); return; }

  const btn  = document.getElementById('pe-save-btn');
  const name = document.getElementById('pe-name')?.value.trim() || '';
  const bio  = document.getElementById('pe-bio')?.value.trim()  || '';
  const site = document.getElementById('pe-website')?.value.trim() || '';

  setAuthLoading(btn, true);

  try {
    const updates = { name, bio, website: site };

    // Update Firebase DB
    await saveUserProfile(FB_USER.uid, updates);

    // Update Firebase Auth display name
    try { await FB_USER.updateProfile({ displayName: name }); } catch {}

    // Update cache
    const cached = loadCachedUser() || {};
    Object.assign(cached, { displayName: name, bio, website: site });
    saveCachedUser(cached);

    updateAuthUI(cached);
    closeModal('profile-edit-modal');
    showToast('Profile saved!', 'success');

    // Trigger profile page re-render
    document.dispatchEvent(new CustomEvent('qrp-profile-updated', { detail: cached }));

  } catch (err) {
    console.error('[Firebase] saveProfileEdit error:', err);
    showToast('Failed to save profile.', 'error');
  } finally {
    setAuthLoading(btn, false);
  }
}

// Open profile edit modal and populate fields
function openProfileEditModal() {
  const cached = loadCachedUser();
  if (!cached) { openModal('login-modal'); return; }

  // Populate avatar preview
  const peAvatar = document.getElementById('pe-avatar');
  if (peAvatar) {
    peAvatar.innerHTML = cached.photoURL
      ? `<img src="${cached.photoURL}" alt="avatar" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
      : `<i class="fa-solid fa-user"></i>`;
  }

  // Populate fields
  const peNameEl = document.getElementById('pe-name');
  const peBioEl  = document.getElementById('pe-bio');
  const peSiteEl = document.getElementById('pe-website');
  if (peNameEl) peNameEl.value = cached.displayName || '';
  if (peBioEl)  peBioEl.value  = cached.bio || '';
  if (peSiteEl) peSiteEl.value = cached.website || '';

  // Wire photo input → Cropper
  const photoInput = document.getElementById('profile-photo-input');
  if (photoInput) {
    photoInput.onchange = function() { handleProfilePhotoUpload(this); };
  }

  // Bio char counter
  const bioCountEl = document.getElementById('pe-bio-count');
  if (peBioEl && bioCountEl) {
    peBioEl.oninput = () => { bioCountEl.textContent = `${peBioEl.value.length}/160`; };
    bioCountEl.textContent = `${peBioEl.value.length}/160`;
  }

  openModal('profile-edit-modal');
}

// ══════════════════════════════════════════════════════════
// CLOUD SYNC
// Sync projects, templates, settings between localStorage ↔ Firebase
// ══════════════════════════════════════════════════════════

/**
 * Download cloud data → merge into localStorage.
 * Cloud data takes priority for keys that differ.
 */
async function syncFromCloud(uid) {
  if (!uid || !navigator.onLine) return;

  try {
    const [cloudProjects, cloudTemplates, cloudSettings] = await Promise.all([
      getUserData(uid, 'projects'),
      getUserData(uid, 'templates'),
      getUserData(uid, 'settings'),
    ]);

    // Projects
    if (cloudProjects) {
      const localRaw = localStorage.getItem('qrp_projects');
      const local = localRaw ? JSON.parse(localRaw) : {};
      const merged = Object.assign({}, local, cloudProjects);
      localStorage.setItem('qrp_projects', JSON.stringify(merged));
    }

    // Templates
    if (cloudTemplates) {
      const localRaw = localStorage.getItem('qrp_templates');
      const local = localRaw ? JSON.parse(localRaw) : {};
      const merged = Object.assign({}, local, cloudTemplates);
      localStorage.setItem('qrp_templates', JSON.stringify(merged));
    }

    // Settings
    if (cloudSettings) {
      const localRaw = localStorage.getItem('qrp_settings');
      const local = localRaw ? JSON.parse(localRaw) : {};
      const merged = Object.assign({}, local, cloudSettings);
      localStorage.setItem('qrp_settings', JSON.stringify(merged));

      // Re-apply settings after merge
      if (typeof loadSettings === 'function') loadSettings();
    }

    // Notify app that sync completed
    document.dispatchEvent(new CustomEvent('qrp-sync-complete'));

  } catch (err) {
    console.warn('[Firebase] syncFromCloud failed:', err);
  }
}

/**
 * Upload localStorage data → Firebase.
 * Called before sign-out and periodically when online.
 */
async function syncToCloud(uid) {
  if (!uid || !navigator.onLine) return;

  try {
    const projects  = JSON.parse(localStorage.getItem('qrp_projects')  || '{}');
    const templates = JSON.parse(localStorage.getItem('qrp_templates') || '{}');
    const settings  = JSON.parse(localStorage.getItem('qrp_settings')  || '{}');

    const updates = {};
    if (Object.keys(projects).length)  updates[`users/${uid}/projects`]  = projects;
    if (Object.keys(templates).length) updates[`users/${uid}/templates`] = templates;
    if (Object.keys(settings).length)  updates[`users/${uid}/settings`]  = settings;

    if (Object.keys(updates).length) {
      await fbDB.ref().update(updates);
    }
  } catch (err) {
    console.warn('[Firebase] syncToCloud failed:', err);
  }
}

// Auto-sync to cloud every 5 minutes when logged in and online
setInterval(() => {
  if (FB_USER && navigator.onLine) syncToCloud(FB_USER.uid);
}, 5 * 60 * 1000);

// Sync when page becomes visible again (tab switch back)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && FB_USER && navigator.onLine) {
    syncToCloud(FB_USER.uid);
  }
});

// ══════════════════════════════════════════════════════════
// REPORT FORM HELPERS (used by report.js)
// ══════════════════════════════════════════════════════════

// Update the description character counter hint
function updateReportDescHint(textarea) {
  const hint = document.getElementById('report-desc-hint');
  if (!hint) return;
  const len = textarea.value.length;
  if (len < 30) {
    hint.textContent   = `(${30 - len} more chars needed)`;
    hint.style.color   = 'var(--danger)';
  } else {
    hint.textContent   = `✓ ${len} characters`;
    hint.style.color   = 'var(--success)';
  }
}

// ══════════════════════════════════════════════════════════
// UTILITY — getCurrentUser (used by other modules)
// ══════════════════════════════════════════════════════════

/** Returns the current Firebase user, or null if not logged in. */
function getCurrentUser() { return FB_USER; }

/** Returns cached user profile data from localStorage. */
function getCachedUserProfile() { return loadCachedUser(); }
