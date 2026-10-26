/**
 * ============================================================
 * CELEBRATION PHOTO ALBUM CONTROLLER (album.js)
 * Multi-Function Dynamic Albums & Google Drive Integration
 * ============================================================
 */

(() => {
  'use strict';

  // 1. Google Drive Function Folders & Album Metadata Registry
  const ALBUMS = {
    'all': {
      id: 'all',
      folderId: '1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU', // Parent Images folder
      name: 'All Celebrations',
      title: 'Celebration Photo Album',
      eyebrow: 'OUR CELEBRATION ALBUM',
      date: 'NOVEMBER 2026',
      venue: 'CHITTISSERY, THRISSUR',
      tagline: '“Two hearts, one journey, a lifetime of love.”',
      quote: 'Two Hearts One Journey',
      accentImg: 'Images/Church.jpg',
      emptyNote: 'Celebration photographs from all wedding functions will be displayed here as they are uploaded.',
      driveUrl: 'https://drive.google.com/drive/folders/1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU?usp=sharing'
    },
    'journey_before': {
      id: 'journey_before',
      folderId: '13ziMMYWdSc2l0HWxbnFHi8BLvnLsi6cg', // Subfolder: Journey Before
      name: 'Journey Before',
      title: 'Journey Before',
      eyebrow: 'HOW IT ALL BEGAN',
      date: 'MEMORIES LEADING TO FOREVER',
      venue: 'CHERISHED MOMENTS & TRAVEL',
      tagline: '“Every step brought us closer to each other.”',
      quote: 'Every Step Guided By Love',
      accentImg: 'Images/Moments/Image 2.jpeg',
      emptyNote: 'Pre-wedding memories, candid travel captures, and our beginnings will appear here as soon as they are added to our celebration folder.',
      driveUrl: 'https://drive.google.com/drive/folders/13ziMMYWdSc2l0HWxbnFHi8BLvnLsi6cg?usp=sharing'
    },
    'save_the_date': {
      id: 'save_the_date',
      folderId: '1mKY8tjwwi21QWsKi_I5Oef0RyVxJiFpq', // Subfolder: Save the Date
      name: 'Save the Date',
      title: 'Save the Date',
      eyebrow: 'THE OFFICIAL ANNOUNCEMENT',
      date: 'SATURDAY, 7 NOVEMBER 2026',
      venue: 'SPECIAL ANNOUNCEMENT',
      tagline: '“Two souls, one date marked by grace and love.”',
      quote: 'Counting Down The Days',
      accentImg: 'Images/Moments/Image 3.jpeg',
      emptyNote: 'Save the Date portraits, announcement teasers, and countdown captures will be uploaded here.',
      driveUrl: 'https://drive.google.com/drive/folders/1mKY8tjwwi21QWsKi_I5Oef0RyVxJiFpq?usp=sharing'
    },
    'betrothal': {
      id: 'betrothal',
      folderId: '1OHIJhWuivdXyHieO6rAPzlOeQDA1vC3d', // Subfolder: Betrothal
      name: 'The Betrothal',
      title: 'The Betrothal',
      eyebrow: 'SACRED PROMISE & FAMILY BLESSINGS',
      date: 'SACRED PROMISE',
      venue: 'FAMILY GATHERING & BLESSINGS',
      tagline: '“Promises made before God and family.”',
      quote: 'Bound In Holy Promise',
      accentImg: 'Images/Hero.jpg',
      emptyNote: 'Photographs from our traditional Betrothal and family blessings will be uploaded here soon.',
      driveUrl: 'https://drive.google.com/drive/folders/1OHIJhWuivdXyHieO6rAPzlOeQDA1vC3d?usp=sharing'
    },
    'engagement': {
      id: 'engagement',
      folderId: '19kTGahQbbYUhgXjpgMC8Aqi24Qp508or', // Subfolder: Engagement
      name: 'Engagement Ceremony',
      title: 'Engagement Ceremony',
      eyebrow: 'THE RING EXCHANGE',
      date: 'ENGAGEMENT CELEBRATION',
      venue: 'PARISH & FAMILY CELEBRATION',
      tagline: '“With this ring, a promise of a lifetime begins.”',
      quote: 'United In Faith & Love',
      accentImg: 'Images/Moments/Image 5.jpeg',
      emptyNote: 'Memories from our Engagement ceremony and ring exchange will appear here once uploaded.',
      driveUrl: 'https://drive.google.com/drive/folders/19kTGahQbbYUhgXjpgMC8Aqi24Qp508or?usp=sharing'
    },
    'wedding': {
      id: 'wedding',
      folderId: '1yoMxW2mhMZ3DRVMPbzwR1wG_FloOF_ml', // Subfolder: Wedding
      name: 'Holy Matrimony',
      title: 'Holy Matrimony',
      eyebrow: 'THE SACRED CEREMONY & RECEPTION',
      date: 'SATURDAY, 7 NOVEMBER 2026',
      venue: 'ST. MARY\'S CHURCH & JUBILEE MEMORIAL HALL',
      tagline: '“Sacred moments, cherished forever.”',
      quote: 'Before God We Say I Do',
      accentImg: 'Images/Church.jpg',
      emptyNote: 'Wedding day ceremony, blessing of the rings, and reception celebration photographs will be uploaded here.',
      driveUrl: 'https://drive.google.com/drive/folders/1yoMxW2mhMZ3DRVMPbzwR1wG_FloOF_ml?usp=sharing'
    }
  };

  // High-fidelity fallback dataset for root/all celebrations
  const ROOT_FALLBACK_IMAGES = [
    {
      id: '1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem',
      name: 'Linto & Femi — Together in Love',
      thumb: 'https://lh3.googleusercontent.com/d/1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem=w800',
      full: 'https://lh3.googleusercontent.com/d/1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem',
      fallback: 'Images/Hero.jpg',
      scriptBadge: 'Bound Together ♡'
    },
    {
      id: '1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1',
      name: 'Femi — The Radiant Bride',
      thumb: 'https://lh3.googleusercontent.com/d/1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1=w800',
      full: 'https://lh3.googleusercontent.com/d/1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1',
      fallback: 'Images/Bride.jpg',
      scriptBadge: 'The Bride ♡'
    },
    {
      id: '1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE',
      name: 'Linto — The Joyful Groom',
      thumb: 'https://lh3.googleusercontent.com/d/1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE=w800',
      full: 'https://lh3.googleusercontent.com/d/1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE',
      fallback: 'Images/Groom.jpg',
      scriptBadge: 'The Groom ♡'
    },
    {
      id: '1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW',
      name: 'Linto — The Blessed Groom',
      thumb: 'https://lh3.googleusercontent.com/d/1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW=w800',
      full: 'https://lh3.googleusercontent.com/d/1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW',
      fallback: 'Images/Groom.jpg'
    },
    {
      id: '1ws2vrQeg3SV9z1BieaVEimCUPQpFBdF_',
      name: 'Linto & Femi — Sacred Moments',
      thumb: 'https://lh3.googleusercontent.com/d/1ws2vrQeg3SV9z1BieaVEimCUPQpFBdF_=w800',
      full: 'https://lh3.googleusercontent.com/d/1ws2vrQeg3SV9z1BieaVEimCUPQpFBdF_=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1ws2vrQeg3SV9z1BieaVEimCUPQpFBdF_',
      fallback: 'Images/Moments/Image 1.jpeg'
    },
    {
      id: '12S15NQN1QMcqf7qxnmPOqw5prFcZD5vy',
      name: 'Linto & Femi — Smiles & Warmth',
      thumb: 'https://lh3.googleusercontent.com/d/12S15NQN1QMcqf7qxnmPOqw5prFcZD5vy=w800',
      full: 'https://lh3.googleusercontent.com/d/12S15NQN1QMcqf7qxnmPOqw5prFcZD5vy=w1600',
      download: 'https://drive.google.com/uc?export=download&id=12S15NQN1QMcqf7qxnmPOqw5prFcZD5vy',
      fallback: 'Images/Moments/Image 2.jpeg'
    },
    {
      id: '1KgDn9CwmOqfldfoFaj1rRHrTyKh8ueyR',
      name: 'Linto & Femi — Romantic Journey',
      thumb: 'https://lh3.googleusercontent.com/d/1KgDn9CwmOqfldfoFaj1rRHrTyKh8ueyR=w800',
      full: 'https://lh3.googleusercontent.com/d/1KgDn9CwmOqfldfoFaj1rRHrTyKh8ueyR=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1KgDn9CwmOqfldfoFaj1rRHrTyKh8ueyR',
      fallback: 'Images/Moments/Image 3.jpeg'
    },
    {
      id: '1tWb6bhiW7um9HYQg4M1TTNHFKH1rpb9J',
      name: 'Linto & Femi — Cherished Joy',
      thumb: 'https://lh3.googleusercontent.com/d/1tWb6bhiW7um9HYQg4M1TTNHFKH1rpb9J=w800',
      full: 'https://lh3.googleusercontent.com/d/1tWb6bhiW7um9HYQg4M1TTNHFKH1rpb9J=w1600',
      download: 'https://drive.google.com/uc?export=download&id=1tWb6bhiW7um9HYQg4M1TTNHFKH1rpb9J',
      fallback: 'Images/Moments/Image 5.jpeg'
    }
  ];

  // State
  let currentAlbumKey = 'all';
  let galleryImages = [];
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  const albumCache = {}; // Cache fetched photos by folderId/albumKey

  // DOM Elements
  const galleryEl      = document.getElementById('album-gallery');
  const skeletonEl     = document.getElementById('gallery-skeleton');
  const emptyEl        = document.getElementById('gallery-empty');
  const emptyTitleEl   = document.getElementById('empty-title');
  const emptyDescEl    = document.getElementById('empty-desc');
  const emptyDriveBtn  = document.getElementById('empty-drive-btn');
  const emptyBrowseAll = document.getElementById('empty-browse-all');
  const errorEl        = document.getElementById('gallery-error');
  const countEl        = document.getElementById('memories-count');
  const retryBtn       = document.getElementById('btn-retry-gallery');
  const downloadAllBtn = document.getElementById('btn-download-all');
  const driveFolderBtn = document.getElementById('btn-drive-folder');
  const shareBtn       = document.getElementById('btn-share-album');
  const toastEl        = document.getElementById('album-toast');
  const viewGridBtn    = document.getElementById('view-grid-btn');
  const viewDenseBtn   = document.getElementById('view-dense-btn');

  // Header Elements
  const headerEyebrow  = document.getElementById('album-eyebrow');
  const headerTitle    = document.getElementById('album-title');
  const headerDate     = document.getElementById('album-date');
  const headerVenue    = document.getElementById('album-venue');
  const headerTagline  = document.getElementById('album-tagline');
  const headerQuoteLeft= document.getElementById('album-quote-left');
  const headerAccentImg= document.getElementById('church-accent-img');
  const toolbarVenue   = document.getElementById('toolbar-venue');
  const toolbarDate    = document.getElementById('toolbar-date');
  const tabButtons     = document.querySelectorAll('.album-tab-btn');

  // Lightbox Elements
  const lightboxEl     = document.getElementById('album-lightbox');
  const lbImg          = document.getElementById('lightbox-active-img');
  const lbCounter      = document.getElementById('lightbox-counter');
  const lbCaption      = document.getElementById('lightbox-caption-text');
  const lbCloseBtn     = document.getElementById('lightbox-close-btn');
  const lbPrevBtn      = document.getElementById('lightbox-prev-btn');
  const lbNextBtn      = document.getElementById('lightbox-next-btn');
  const lbDownloadBtn  = document.getElementById('lightbox-download-btn');
  const lbOverlay      = document.getElementById('lightbox-overlay');

  /**
   * Determine album from URL query parameters (?album=... or ?folderId=...)
   */
  function getRequestedAlbumKey() {
    const params = new URLSearchParams(window.location.search);
    const albumParam = params.get('album');
    const folderParam = params.get('folderId');

    if (albumParam && ALBUMS[albumParam]) {
      return albumParam;
    }

    if (folderParam) {
      for (const [key, alb] of Object.entries(ALBUMS)) {
        if (alb.folderId === folderParam) return key;
      }
    }

    return 'all';
  }

  /**
   * Update Document Title and Header details according to active album
   */
  function updateHeaderDetails(album) {
    document.title = `${album.name} | Celebration Photo Album — Linto & Femi`;

    if (headerEyebrow)   headerEyebrow.textContent = album.eyebrow;
    if (headerTitle)     headerTitle.textContent = album.name;
    if (headerDate)      headerDate.textContent = album.date;
    if (headerVenue)     headerVenue.textContent = album.venue;
    if (headerTagline)   headerTagline.textContent = album.tagline;

    if (headerQuoteLeft) {
      headerQuoteLeft.innerHTML = `<span>${album.quote}</span> <span class="script-heart">♡</span>`;
    }

    if (toolbarVenue)    toolbarVenue.textContent = album.name;
    if (toolbarDate)     toolbarDate.textContent = album.date.split('|')[0].trim();

    if (driveFolderBtn) {
      driveFolderBtn.href = album.driveUrl;
      driveFolderBtn.setAttribute('title', `Open ${album.name} folder in Google Drive`);
    }

    if (emptyTitleEl) {
      emptyTitleEl.textContent = `Memories from our ${album.name}`;
    }

    if (emptyDescEl) {
      emptyDescEl.textContent = album.emptyNote;
    }

    if (emptyDriveBtn) {
      emptyDriveBtn.href = album.driveUrl;
    }

    if (headerAccentImg && album.accentImg) {
      headerAccentImg.src = album.accentImg;
    }

    // Update active tab button UI
    tabButtons.forEach(btn => {
      const isCurrent = btn.getAttribute('data-album') === album.id;
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });
  }

  /**
   * Select and display an album
   */
  function switchAlbum(albumKey, updateHistory = true) {
    if (!ALBUMS[albumKey]) albumKey = 'all';
    currentAlbumKey = albumKey;
    const album = ALBUMS[albumKey];

    // Update URL query parameter seamlessly
    if (updateHistory) {
      const newUrl = albumKey === 'all' 
        ? window.location.pathname 
        : `${window.location.pathname}?album=${encodeURIComponent(albumKey)}`;
      window.history.replaceState({ album: albumKey }, '', newUrl);
    }

    updateHeaderDetails(album);
    loadPhotographsForAlbum(album);
  }

  /**
   * Fetch photos for the selected album
   */
  async function loadPhotographsForAlbum(album) {
    skeletonEl.style.display = 'block';
    emptyEl.style.display    = 'none';
    errorEl.style.display    = 'none';
    galleryEl.innerHTML      = '';
    if (countEl) countEl.textContent = 'Loading...';

    // 1. Check in-memory cache
    if (albumCache[album.id]) {
      skeletonEl.style.display = 'none';
      renderLoadedImages(albumCache[album.id], album);
      return;
    }

    const scriptUrl = window.GOOGLE_SHEETS_SCRIPT_URL;

    try {
      if (scriptUrl) {
        const feedUrl = `${scriptUrl}?action=album&folderId=${encodeURIComponent(album.folderId)}&album=${encodeURIComponent(album.id)}`;
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error(`Drive API status ${res.status}`);
        const data = await res.json();

        if (data && data.status === 'success' && Array.isArray(data.images)) {
          // Verify if backend returned photos from the requested folder
          const isMatchingFolder = !data.folderId || data.folderId === album.folderId;

          // If the backend returned items:
          if (data.images.length > 0) {
            // Check if older Apps Script returned root images for a subfolder
            if (album.id !== 'all' && data.folderId && data.folderId !== album.folderId) {
              // Deployed script has not yet been updated with folderId parameterization;
              // Treat empty subfolder correctly so mixed photos aren't shown.
              albumCache[album.id] = [];
            } else {
              albumCache[album.id] = data.images.map((item, idx) => {
                const rawName = item.name ? item.name.replace(/\.[^/.]+$/, "") : `${album.name} — Memory ${idx + 1}`;
                return {
                  id: item.id || `drive-${idx}`,
                  name: rawName,
                  thumb: item.thumbnailUrl || `https://lh3.googleusercontent.com/d/${item.id}=w800`,
                  full: item.fullUrl || item.downloadUrl || `https://lh3.googleusercontent.com/d/${item.id}=w1600`,
                  fallback: 'Images/Hero.jpg',
                  scriptBadge: idx === 0 ? 'Cherished Moment ♡' : null
                };
              });
            }
          } else {
            albumCache[album.id] = [];
          }
        } else {
          // If all celebrations and API failed, use root fallback dataset
          albumCache[album.id] = album.id === 'all' ? [...ROOT_FALLBACK_IMAGES] : [];
        }
      } else {
        albumCache[album.id] = album.id === 'all' ? [...ROOT_FALLBACK_IMAGES] : [];
      }

      skeletonEl.style.display = 'none';
      renderLoadedImages(albumCache[album.id], album);

    } catch (err) {
      console.warn(`Error loading album [${album.name}]:`, err);
      skeletonEl.style.display = 'none';

      if (album.id === 'all') {
        albumCache[album.id] = [...ROOT_FALLBACK_IMAGES];
        renderLoadedImages(albumCache[album.id], album);
      } else {
        albumCache[album.id] = [];
        renderLoadedImages([], album);
      }
    }
  }

  /**
   * Render images or show empty state
   */
  function renderLoadedImages(images, album) {
    galleryImages = images || [];

    if (galleryImages.length === 0) {
      emptyEl.style.display = 'block';
      if (countEl) countEl.textContent = '0 Memories';
      return;
    }

    if (countEl) {
      countEl.textContent = `${galleryImages.length} ${galleryImages.length === 1 ? 'Memory' : 'Memories'}`;
    }

    renderGallery(galleryImages, album);
  }

  /**
   * Render Masonry Cards
   */
  function renderGallery(images, album) {
    galleryEl.innerHTML = '';
    const fragment = document.createDocumentFragment();

    images.forEach((imgData, index) => {
      const card = document.createElement('article');
      card.className = 'photo-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View photograph: ${imgData.name}`);

      const sanitizeName = (imgData.name || 'Linto_and_Femi_Photo').replace(/[^a-z0-9_-]/gi, '_');

      const escapeHTML = str => (str || '').replace(/[&<>'"]/g, tag => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
      }[tag] || tag));

      const fallbackAttr = imgData.fallback ? `onerror="this.onerror=null;this.src='${imgData.fallback}';"` : '';

      card.innerHTML = `
        <div class="photo-card__img-wrap">
          <img src="${imgData.thumb}" alt="${escapeHTML(imgData.name)}" class="photo-card__img" loading="lazy" referrerpolicy="no-referrer" ${fallbackAttr} />
          ${imgData.scriptBadge ? `<span class="photo-card__script-badge" aria-hidden="true">${imgData.scriptBadge}</span>` : ''}
          <div class="photo-card__overlay">
            <span class="photo-card__label" style="color:#ffffff; font-size:0.75rem; letter-spacing:0.05em;">${escapeHTML(album.name)}</span>
            <div class="photo-card__actions">
              <button class="photo-card__btn btn-card-download" data-url="${imgData.full}" data-name="${sanitizeName}" title="Download original high resolution photograph" aria-label="Download ${imgData.name}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="photo-card__btn btn-card-fullscreen" title="View fullscreen" aria-label="Fullscreen view">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      // Download button click handler
      const dlBtn = card.querySelector('.btn-card-download');
      if (dlBtn) {
        dlBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          downloadImageLossless(imgData.full, `${sanitizeName}.jpg`);
        });
      }

      card.addEventListener('click', () => openLightbox(index));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index);
        }
      });

      fragment.appendChild(card);
    });

    galleryEl.appendChild(fragment);
  }

  /**
   * Lossless High-Resolution Download Handler
   */
  async function downloadImageLossless(url, fileName) {
    showToast('Starting original quality download...');
    try {
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Fetch status not ok');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = blobUrl;
      a.download = fileName || 'Linto_and_Femi_Wedding_Photo.jpg';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      }, 1000);
      showToast('Download complete!');
    } catch (err) {
      // Direct URL download fallback
      const directUrl = url.includes('drive.google.com') ? url.replace('export=view', 'export=download') : url;
      const a = document.createElement('a');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.href = directUrl;
      a.download = fileName || 'Linto_and_Femi_Wedding_Photo.jpg';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => document.body.removeChild(a), 500);
    }
  }

  /**
   * Lightbox Functions
   */
  function openLightbox(index) {
    if (!galleryImages[index]) return;
    currentIndex = index;
    updateLightbox();
    if (typeof lightboxEl.showModal === 'function') {
      lightboxEl.showModal();
    } else {
      lightboxEl.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (typeof lightboxEl.close === 'function') {
      lightboxEl.close();
    } else {
      lightboxEl.removeAttribute('open');
    }
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = galleryImages[currentIndex];
    if (!item) return;

    const sanitizeName = (item.name || 'Linto_and_Femi_Photo').replace(/[^a-z0-9_-]/gi, '_');

    lbImg.style.opacity = '0';
    lbCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
    lbCaption.textContent = item.name;

    if (lbDownloadBtn) {
      lbDownloadBtn.onclick = (e) => {
        e.preventDefault();
        downloadImageLossless(item.full, `${sanitizeName}.jpg`);
      };
    }

    const fallbackSrc = item.fallback || 'Images/Hero.jpg';
    const tempImg = new Image();
    tempImg.referrerPolicy = 'no-referrer';
    tempImg.onload = () => {
      lbImg.src = tempImg.src;
      lbImg.style.opacity = '1';
    };
    tempImg.onerror = () => {
      lbImg.src = fallbackSrc;
      lbImg.style.opacity = '1';
    };
    tempImg.src = item.full;
  }

  function nextPhoto() {
    if (galleryImages.length <= 1) return;
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function prevPhoto() {
    if (galleryImages.length <= 1) return;
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightbox();
  }

  // Lightbox event listeners
  if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);
  if (lbOverlay) lbOverlay.addEventListener('click', closeLightbox);
  if (lbNextBtn) lbNextBtn.addEventListener('click', nextPhoto);
  if (lbPrevBtn) lbPrevBtn.addEventListener('click', prevPhoto);

  document.addEventListener('keydown', e => {
    if (!lightboxEl.open) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // Mobile Touch Swipe support in Lightbox
  lightboxEl.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightboxEl.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
  }, { passive: true });

  /**
   * Toolbar Actions
   */
  // Download All button
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', () => {
      const album = ALBUMS[currentAlbumKey] || ALBUMS.all;
      window.open(album.driveUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Share Album button
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const album = ALBUMS[currentAlbumKey] || ALBUMS.all;
      const shareData = {
        title: `Linto & Femi — ${album.name} Celebration Album`,
        text: `Explore celebration photographs from ${album.name} for Linto & Femi.`,
        url: window.location.href
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (_) {}
      }

      // Fallback: Copy to clipboard and show toast
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Album link copied to clipboard');
      } catch (_) {
        showToast('Album URL: ' + window.location.href);
      }
    });
  }

  function showToast(msg) {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 2800);
  }

  // View Mode Toggles
  if (viewGridBtn && viewDenseBtn) {
    viewGridBtn.addEventListener('click', () => {
      galleryEl.classList.remove('dense');
      viewGridBtn.classList.add('active');
      viewDenseBtn.classList.remove('active');
    });
    viewDenseBtn.addEventListener('click', () => {
      galleryEl.classList.add('dense');
      viewDenseBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
    });
  }

  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      delete albumCache[currentAlbumKey];
      switchAlbum(currentAlbumKey, false);
    });
  }

  // Empty state buttons
  if (emptyBrowseAll) {
    emptyBrowseAll.addEventListener('click', () => {
      switchAlbum('all');
    });
  }

  // Tab buttons click listeners
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetAlbum = btn.getAttribute('data-album');
      if (targetAlbum && targetAlbum !== currentAlbumKey) {
        switchAlbum(targetAlbum);
      }
    });
  });

  // Browser back/forward navigation support
  window.addEventListener('popstate', () => {
    const key = getRequestedAlbumKey();
    if (key !== currentAlbumKey) {
      switchAlbum(key, false);
    }
  });

  // Initial Load
  document.addEventListener('DOMContentLoaded', () => {
    const initialKey = getRequestedAlbumKey();
    switchAlbum(initialKey, false);
  });

})();
