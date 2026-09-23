/**
 * ============================================================
 * CELEBRATION PHOTO ALBUM CONTROLLER (album.js)
 * Dynamic Google Drive Feed, Natural Masonry, Lightbox & Sharing
 * ============================================================
 */

(() => {
  'use strict';

  // Configuration — Strictly Google Drive Folder (1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU)
  const CONFIG = {
    folderId: '1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU',
    get driveFeedUrl() {
      if (window.GOOGLE_SHEETS_SCRIPT_URL) {
        return window.GOOGLE_SHEETS_SCRIPT_URL.includes('?') 
          ? `${window.GOOGLE_SHEETS_SCRIPT_URL}&action=album`
          : `${window.GOOGLE_SHEETS_SCRIPT_URL}?action=album`;
      }
      return '';
    },
    // Photos strictly sourced from user's Google Drive folder: 1jchGI4-6ybS0-vmh8HYU9cSWWV3BpJvU
    fallbackImages: [
      {
        id: '1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem',
        name: 'Linto & Femi — Together in Love',
        thumb: 'https://lh3.googleusercontent.com/d/1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem=w800',
        full: 'https://lh3.googleusercontent.com/d/1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem=w1600',
        download: 'https://drive.google.com/uc?export=download&id=1Axi4HfMKQ3P_pN807TGyQMqtwxuhNGem',
        fallback: 'Images/Hero.jpeg',
        scriptBadge: 'Bound Together ♡'
      },
      {
        id: '1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1',
        name: 'Femi — The Radiant Bride',
        thumb: 'https://lh3.googleusercontent.com/d/1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1=w800',
        full: 'https://lh3.googleusercontent.com/d/1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1=w1600',
        download: 'https://drive.google.com/uc?export=download&id=1OM2DAd-ZMhC9m3PPkasQJavYdSHoykJ1',
        fallback: 'Images/Bride.jpeg',
        scriptBadge: 'The Bride ♡'
      },
      {
        id: '1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE',
        name: 'Linto — The Joyful Groom',
        thumb: 'https://lh3.googleusercontent.com/d/1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE=w800',
        full: 'https://lh3.googleusercontent.com/d/1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE=w1600',
        download: 'https://drive.google.com/uc?export=download&id=1a_FjmQM-5R_i3R_-0iLb9_PO452Sk2IE',
        fallback: 'Images/Groom.jpeg',
        scriptBadge: 'The Groom ♡'
      },
      {
        id: '1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW',
        name: 'Linto — The Blessed Groom',
        thumb: 'https://lh3.googleusercontent.com/d/1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW=w800',
        full: 'https://lh3.googleusercontent.com/d/1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW=w1600',
        download: 'https://drive.google.com/uc?export=download&id=1I-ZftraYW6cIUy4hc6Pym1Q1zRrLeXlW',
        fallback: 'Images/Groom.jpeg'
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
    ]
  };

  // State
  let galleryImages = [];
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // DOM Elements
  const galleryEl    = document.getElementById('album-gallery');
  const skeletonEl   = document.getElementById('gallery-skeleton');
  const emptyEl      = document.getElementById('gallery-empty');
  const errorEl      = document.getElementById('gallery-error');
  const countEl      = document.getElementById('memories-count');
  const retryBtn     = document.getElementById('btn-retry-gallery');
  const downloadAllBtn = document.getElementById('btn-download-all');
  const shareBtn     = document.getElementById('btn-share-album');
  const toastEl      = document.getElementById('album-toast');
  const viewGridBtn  = document.getElementById('view-grid-btn');
  const viewDenseBtn = document.getElementById('view-dense-btn');

  // Lightbox Elements
  const lightboxEl   = document.getElementById('album-lightbox');
  const lbImg        = document.getElementById('lightbox-active-img');
  const lbCounter    = document.getElementById('lightbox-counter');
  const lbCaption    = document.getElementById('lightbox-caption-text');
  const lbCloseBtn   = document.getElementById('lightbox-close-btn');
  const lbPrevBtn    = document.getElementById('lightbox-prev-btn');
  const lbNextBtn    = document.getElementById('lightbox-next-btn');
  const lbDownloadBtn= document.getElementById('lightbox-download-btn');
  const lbOverlay    = document.getElementById('lightbox-overlay');

  /**
   * Fetch photos from Google Drive Feed or Fallback
   */
  async function loadPhotographs() {
    skeletonEl.style.display = 'block';
    emptyEl.style.display    = 'none';
    errorEl.style.display    = 'none';
    galleryEl.innerHTML      = '';

    try {
      const feedUrl = CONFIG.driveFeedUrl;
      if (feedUrl) {
        const res = await fetch(feedUrl);
        if (!res.ok) throw new Error('Drive feed response error');
        const data = await res.json();
        if (data && Array.isArray(data.images) && data.images.length > 0) {
          galleryImages = data.images.map((item, idx) => ({
            id: item.id || `drive-${idx}`,
            name: item.name ? item.name.replace(/\.[^/.]+$/, "") : `Linto & Femi — Memory ${idx + 1}`,
            thumb: item.thumbnailUrl || `https://lh3.googleusercontent.com/d/${item.id}=w800`,
            full: item.fullUrl || item.downloadUrl || `https://lh3.googleusercontent.com/d/${item.id}=w1600`,
            scriptBadge: idx === 0 ? 'Better Together ♡' : null
          }));
        } else {
          galleryImages = [...CONFIG.fallbackImages];
        }
      } else {
        // Use realistic high-fidelity wedding photo dataset
        galleryImages = [...CONFIG.fallbackImages];
      }

      skeletonEl.style.display = 'none';

      if (galleryImages.length === 0) {
        emptyEl.style.display = 'block';
        if (countEl) countEl.textContent = '0 Memories';
        return;
      }

      // Update dynamic memory count
      if (countEl) {
        countEl.textContent = `${galleryImages.length} Memories`;
      }

      renderGallery(galleryImages);

    } catch (err) {
      console.warn('Error loading Google Drive feed, using wedding photo dataset:', err);
      skeletonEl.style.display = 'none';
      galleryImages = [...CONFIG.fallbackImages];
      if (countEl) countEl.textContent = `${galleryImages.length} Memories`;
      renderGallery(galleryImages);
    }
  }

  /**
   * Render Masonry Cards
   */
  function renderGallery(images) {
    galleryEl.innerHTML = '';
    const fragment = document.createDocumentFragment();

    images.forEach((imgData, index) => {
      const card = document.createElement('article');
      card.className = 'photo-card';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `View photograph: ${imgData.name}`);

      const sanitizeName = (imgData.name || 'Linto_and_Femi_Photo').replace(/[^a-z0-9_-]/gi, '_');

      card.innerHTML = `
        <div class="photo-card__img-wrap">
          <img src="${imgData.thumb}" alt="${imgData.name}" class="photo-card__img" loading="lazy" ${imgData.fallback ? `onerror="if(this.src!=='${imgData.fallback}'){this.src='${imgData.fallback}';}"` : ''} />
          ${imgData.scriptBadge ? `<span class="photo-card__script-badge" aria-hidden="true">${imgData.scriptBadge}</span>` : ''}
          <div class="photo-card__overlay">
            <span class="photo-card__label" style="color:#ffffff; font-size:0.75rem; letter-spacing:0.05em;">Linto &amp; Femi</span>
            <div class="photo-card__actions">
              <button class="photo-card__btn btn-card-download" data-url="${imgData.full}" data-name="${sanitizeName}" title="Download high resolution photograph without quality loss" aria-label="Download ${imgData.name}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
              </button>
              <button class="photo-card__btn btn-card-fullscreen" title="View in fullscreen" aria-label="Fullscreen view">
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
      // Fallback if CORS or direct URL download required
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

    const tempImg = new Image();
    tempImg.onload = () => {
      lbImg.src = item.full;
      lbImg.style.opacity = '1';
    };
    tempImg.src = item.full;
  }

  function nextPhoto() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    updateLightbox();
  }

  function prevPhoto() {
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
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeDistance = touchEndX - touchStartX;
    if (Math.abs(swipeDistance) > 45) {
      if (swipeDistance < 0) {
        nextPhoto(); // swiped left
      } else {
        prevPhoto(); // swiped right
      }
    }
  }

  /**
   * Toolbar Actions
   */
  // Download All
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener('click', () => {
      // Direct access to the configured source of truth
      const driveFolderUrl = `https://drive.google.com/drive/folders/${CONFIG.folderId}?usp=sharing`;
      window.open(driveFolderUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Share Album
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const shareData = {
        title: 'Linto & Femi — Holy Matrimony Celebration Album',
        text: 'Explore the photographs from the wedding celebration of Linto & Femi.',
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
    retryBtn.addEventListener('click', loadPhotographs);
  }

  // Initial Load
  document.addEventListener('DOMContentLoaded', loadPhotographs);

})();
