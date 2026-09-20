/* ============================================================
   LINTO & FEMI — WEDDING INVITATION
   main.js — All interactivity
   ============================================================ */

'use strict';

/* ── Configuration ─────────────────────────────────────────── */
const weddingConfig = {
  groom:              "Linto George",
  bride:              "Femi Roy",
  weddingDate:        "2026-11-07",           // ISO date
  weddingDateDisplay: "Saturday, 7 November 2026",
  weddingVenue:       "St. Mary's Church, Chittissery P O, Thrissur",
  receptionVenue:     "Jubilee Memorial Parish Hall, Chittissery, Thrissur",
  phone1:             "8593850720",
  phone2:             "9895558575",
  musicFile:          "Music/Sunlight_on_the_Aisle.mp3",
  musicVolume:        0.5,                    // 0.0 – 1.0
  // Times for calendar events (IST)
  ceremonyTime:       "10:30",
  ceremonyEndTime:    "12:30",
  receptionTime:      "12:30",
  receptionEndTime:   "15:30",
  // Photos in Images/Moments/ folder
  moments: [
    { src: "Images/Moments/Image 1.jpeg", alt: "Linto & Femi — Beautiful Moments" },
    { src: "Images/Moments/Image 2.jpeg", alt: "Linto & Femi — Cherished Memories" },
    { src: "Images/Moments/Image 3.jpeg", alt: "Linto & Femi — Joyful Smiles" },
    { src: "Images/Moments/Image 5.jpeg", alt: "Linto & Femi — Together Forever" }
  ]
};

/* ── DOM References ────────────────────────────────────────── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ── 1. FLOATING NAV — show after scrolling past hero ───────── */
function initFloatingNav() {
  const nav  = $('#floating-nav');
  const hero = $('#hero');
  if (!nav || !hero) return;

  const obs = new IntersectionObserver(
    ([entry]) => {
      nav.classList.toggle('show', !entry.isIntersecting);
    },
    { threshold: 0.15 }
  );
  obs.observe(hero);

  // Smooth-scroll links
  $$('a[data-scroll]', nav).forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = $(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ── 2. COUNTDOWN ───────────────────────────────────────────── */
function initCountdown() {
  const wedding  = new Date(weddingConfig.weddingDate + 'T00:00:00');
  const slots = {
    days:    $('#cd-days-slot'),
    hours:   $('#cd-hours-slot'),
    minutes: $('#cd-mins-slot'),
    seconds: $('#cd-secs-slot'),
  };
  const numEls   = {
    days:    $('#cd-days'),
    hours:   $('#cd-hours'),
    minutes: $('#cd-mins'),
    seconds: $('#cd-secs'),
  };
  const container = $('#countdown-grid');
  const complete  = $('#countdown-complete');

  if (!numEls.days && !slots.days) return;

  function pad(n) { return String(n).padStart(2, '0'); }

  const lastValues = {
    days: null,
    hours: null,
    minutes: null,
    seconds: null
  };

  function updateDigit(key, newVal, idName) {
    const formattedVal = String(newVal);
    if (lastValues[key] === formattedVal) return;
    const isInitial = lastValues[key] === null;
    lastValues[key] = formattedVal;

    const slot = slots[key];
    if (!slot) {
      if (numEls[key]) numEls[key].textContent = formattedVal;
      return;
    }

    if (isInitial) {
      const current = slot.querySelector('.hero__cd-val');
      if (current) {
        current.textContent = formattedVal;
        current.id = idName;
      } else {
        const span = document.createElement('span');
        span.className = 'hero__cd-val';
        span.id = idName;
        span.textContent = formattedVal;
        slot.appendChild(span);
      }
      return;
    }

    // Animate out previous spans (dropping down)
    const oldSpans = slot.querySelectorAll('.hero__cd-val');
    oldSpans.forEach(span => {
      span.removeAttribute('id');
      span.classList.remove('hero__cd-val--in');
      span.classList.add('hero__cd-val--out');
      setTimeout(() => {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 450);
    });

    // Create incoming span (dropping in from above)
    const newSpan = document.createElement('span');
    newSpan.className = 'hero__cd-val hero__cd-val--in';
    newSpan.id = idName;
    newSpan.textContent = formattedVal;
    slot.appendChild(newSpan);
  }

  function tick() {
    const now  = new Date();
    const diff = wedding - now;

    if (diff <= 0) {
      if (container)  container.style.display = 'none';
      if (complete)   complete.style.display  = 'block';
      return;
    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    updateDigit('days', days, 'cd-days');
    updateDigit('hours', pad(hours), 'cd-hours');
    updateDigit('minutes', pad(minutes), 'cd-mins');
    updateDigit('seconds', pad(seconds), 'cd-secs');
  }

  tick();
  setInterval(tick, 1000);
}

/* ── 3. MUSIC PLAYER ────────────────────────────────────────── */
let audio         = null;
let musicButtons  = [];

function initMusic() {
  const globalBtn   = $('#music-btn');
  const mobileBtn   = $('#mobile-music-btn');
  const desktopBtn  = $('#desktop-music-btn');

  musicButtons = [globalBtn, mobileBtn, desktopBtn].filter(Boolean);

  audio = new Audio(weddingConfig.musicFile);
  audio.loop   = true;
  audio.volume = weddingConfig.musicVolume;

  musicButtons.forEach(btn => {
    btn.addEventListener('click', toggleMusic);
  });

  // Keyboard shortcut: 'm' key
  document.addEventListener('keydown', e => {
    if (e.key === 'm' || e.key === 'M') {
      if (audio) toggleMusic();
    }
  });
}

function updateMusicUI(isPlaying) {
  const hero = $('#hero');
  musicButtons.forEach(btn => {
    btn.classList.toggle('playing', isPlaying);
    btn.setAttribute('aria-label', isPlaying ? 'Pause music' : 'Play music');
  });

  if (hero) {
    hero.classList.toggle('desktop-music-playing', isPlaying);
  }
}

function toggleMusic() {
  if (!audio) return;
  if (audio.paused) {
    audio.play().then(() => {
      updateMusicUI(true);
    }).catch(() => {});
  } else {
    audio.pause();
    updateMusicUI(false);
  }
}

function startMusicAfterInteraction() {
  if (!audio) return;
  audio.play().then(() => {
    updateMusicUI(true);
  }).catch(() => {
    updateMusicUI(false);
  });
}

/* ── 4. OPEN INVITATION & SCROLL ───────────────────────────── */
function initOpenInvitation() {
  const btn       = $('#btn-open-invitation');
  const scrollBtn = $('#hero-scroll-btn');
  const content   = $('#invitation-content');
  if (!content) return;

  function revealAndScroll(e) {
    if (e) e.preventDefault();

    // Reveal content
    content.classList.add('revealed');

    // Start music if not started
    startMusicAfterInteraction();

    // Scroll smoothly to invitation intro
    setTimeout(() => {
      const intro = $('#invitation-intro');
      if (intro) intro.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);

    // Trigger reveal animations in content
    setTimeout(() => {
      $$('.invitation-reveal', content).forEach((el, i) => {
        setTimeout(() => el.classList.add('shown'), i * 120);
      });
    }, 500);

    // Launch celebratory gold and emerald confetti
    if (typeof launchConfetti === 'function') {
      launchConfetti();
    }
  }

  if (btn) btn.addEventListener('click', revealAndScroll);
  if (scrollBtn) scrollBtn.addEventListener('click', revealAndScroll);
}

/* ── 4B. HERO CONTROLS & MOBILE DRAWER ─────────────────────── */
function initHeroControls() {
  const menuBtn     = $('#hero-menu-btn');
  const drawer      = $('#hero-mobile-drawer');
  const closeBtn    = $('#hero-drawer-close');
  const backdrop    = $('#hero-drawer-backdrop');
  const drawerLinks = $$('[data-drawer-link]');
  const desktopLinks= $$('.hero__desktop-nav a[data-scroll]');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (menuBtn)  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      closeDrawer();
      const content = $('#invitation-content');
      if (content) content.classList.add('revealed');
      const target = $(link.getAttribute('href'));
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    });
  });

  desktopLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const content = $('#invitation-content');
      if (content) content.classList.add('revealed');
      const target = $(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ── 5. SCROLL REVEAL (Intersection Observer) ───────────────── */
function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => obs.observe(el));
}

/* ── 6. DYNAMIC GALLERY & LIGHTBOX ──────────────────────────── */
function initGallery() {
  const grid     = $('#gallery__grid');
  const lightbox = $('#lightbox');
  if (!grid || !lightbox) return;

  // Active moments list from config
  let momentsList = (weddingConfig.moments || []).slice();

  const lb_img    = $('#lb-img');
  const lb_prev   = $('#lb-prev');
  const lb_next   = $('#lb-next');
  const lb_close  = $('#lb-close');
  const lb_count  = $('#lb-count');

  let current = 0;

  function openLightbox(index) {
    if (!momentsList.length) return;
    current = index;
    showImage(current);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lb_close && lb_close.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    const items = $$('.gallery__item', grid);
    if (items[current]) items[current].focus();
  }

  function showImage(index) {
    if (!momentsList[index]) return;
    lb_img.src = encodeURI(momentsList[index].src);
    lb_img.alt = momentsList[index].alt || 'Linto & Femi';
    if (lb_count) lb_count.textContent = `${index + 1} / ${momentsList.length}`;
  }

  function next() {
    if (!momentsList.length) return;
    current = (current + 1) % momentsList.length;
    showImage(current);
  }

  function prev() {
    if (!momentsList.length) return;
    current = (current - 1 + momentsList.length) % momentsList.length;
    showImage(current);
  }

  function updateGridCountClass(count) {
    grid.className = grid.className.replace(/\bgallery__grid--count-\d+\b/g, '').trim();
    grid.classList.add(`gallery__grid--count-${count}`);
    grid.dataset.count = count;
  }

  function renderGallery() {
    grid.innerHTML = '';
    updateGridCountClass(momentsList.length);
    momentsList.forEach((item, i) => {
      const card = document.createElement('article');
      card.className = 'gallery__item reveal visible';
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', item.alt || `View photo ${i + 1}`);

      const img = document.createElement('img');
      img.src = encodeURI(item.src);
      img.alt = item.alt || `Linto & Femi — Moment ${i + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';

      const overlay = document.createElement('div');
      overlay.className = 'gallery__item-overlay';
      overlay.setAttribute('aria-hidden', 'true');
      overlay.innerHTML = `
        <span class="gallery__item-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          View Moment
        </span>
      `;

      card.appendChild(img);
      card.appendChild(overlay);

      card.addEventListener('click', () => openLightbox(i));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(i);
        }
      });

      grid.appendChild(card);
    });
  }

  // Initial render with configured moments
  renderGallery();

  // Dynamic automatic discovery of any newly added photos in Images/Moments/:
  const candidateNames = [];
  for (let n = 1; n <= 30; n++) {
    candidateNames.push(`Image ${n}.jpeg`, `Image ${n}.jpg`, `Image ${n}.png`);
  }

  candidateNames.forEach(name => {
    const testSrc = `Images/Moments/${name}`;
    if (momentsList.some(m => m.src === testSrc)) return;

    const probe = new Image();
    probe.onload = () => {
      if (!momentsList.some(m => m.src === testSrc)) {
        momentsList.push({
          src: testSrc,
          alt: `Linto & Femi — Moment ${momentsList.length + 1}`
        });
        renderGallery();
      }
    };
    probe.src = encodeURI(testSrc);
  });

  // Lightbox controls
  lb_prev  && lb_prev.addEventListener('click', prev);
  lb_next  && lb_next.addEventListener('click', next);
  lb_close && lb_close.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  next();
    if (e.key === 'ArrowLeft')   prev();
  });

  // Touch/swipe
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  }, { passive: true });
}

/* ── 7. GOOGLE CALENDAR INTEGRATION (All signed-in Gmail accounts) ── */
function buildGoogleCalendarUrl(title, dateStr, startTime, endTime, location, description) {
  let startStr, endStr;

  if (startTime) {
    const [sh, sm] = startTime.split(':').map(Number);
    // Construct local Date in IST (UTC+05:30) and convert to UTC for Google Calendar
    const sDate = new Date(`${dateStr}T${String(sh).padStart(2, '0')}:${String(sm).padStart(2, '0')}:00+05:30`);
    startStr = sDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    if (endTime) {
      const [eh, em] = endTime.split(':').map(Number);
      const eDate = new Date(`${dateStr}T${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}:00+05:30`);
      endStr = eDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    } else {
      const eDate = new Date(sDate.getTime() + 2 * 3600000);
      endStr = eDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    }
  } else {
    const cleanDate = dateStr.replace(/-/g, '');
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    const nextDate = d.toISOString().slice(0, 10).replace(/-/g, '');
    startStr = cleanDate;
    endStr = nextDate;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    details: description,
    location: location
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function initCalendarButtons() {
  const btnCeremony  = $('#btn-cal-ceremony');
  const btnReception = $('#btn-cal-reception');

  const ceremonyUrl = buildGoogleCalendarUrl(
    `Holy Matrimony — ${weddingConfig.groom} & ${weddingConfig.bride}`,
    weddingConfig.weddingDate,
    weddingConfig.ceremonyTime,
    weddingConfig.ceremonyEndTime,
    weddingConfig.weddingVenue,
    `Wedding Ceremony of ${weddingConfig.groom} & ${weddingConfig.bride}.\n\nDate: ${weddingConfig.weddingDateDisplay}\nTime: 10:30 AM IST\nVenue: ${weddingConfig.weddingVenue}\nLocation map: https://maps.google.com/?q=St+Mary's+Church+Chittissery+Thrissur\n\nReception to follow at Jubilee Memorial Parish Hall, Chittissery.`
  );

  const receptionUrl = buildGoogleCalendarUrl(
    `Wedding Reception — ${weddingConfig.groom} & ${weddingConfig.bride}`,
    weddingConfig.weddingDate,
    weddingConfig.receptionTime,
    weddingConfig.receptionEndTime,
    weddingConfig.receptionVenue,
    `Wedding Reception (Lunch & Celebration) of ${weddingConfig.groom} & ${weddingConfig.bride}.\n\nDate: ${weddingConfig.weddingDateDisplay}\nTime: 12:30 PM IST onwards\nVenue: ${weddingConfig.receptionVenue}\nLocation map: https://maps.google.com/?q=Jubilee+Memorial+Parish+Hall+Chittissery+Thrissur`
  );

  if (btnCeremony) {
    btnCeremony.href = ceremonyUrl;
    btnCeremony.target = '_blank';
    btnCeremony.rel = 'noopener noreferrer';
  }

  if (btnReception) {
    btnReception.href = receptionUrl;
    btnReception.target = '_blank';
    btnReception.rel = 'noopener noreferrer';
  }
}

/* ── 8. FLOATING PARTICLES (subtle, in footer) ───────────────── */
function initParticles() {
  const wrap = $('#particles');
  if (!wrap) return;

  const count = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 12;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size     = Math.random() * 3 + 1.5;
    const left     = Math.random() * 100;
    const delay    = Math.random() * 8;
    const duration = Math.random() * 8 + 6;
    const bottom   = Math.random() * 60;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: ${bottom}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: 0;
    `;

    wrap.appendChild(p);
  }
}

/* ── 9. LAZY IMAGES ─────────────────────────────────────────── */
function initLazyImages() {
  const imgs = $$('img[loading="lazy"]');
  if (!imgs.length) return;

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          obs.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => obs.observe(img));
  }
}

/* ── 10. CELEBRATION MODALS (Physical Cards & Greetings) ─────── */
function initModals() {
  const invModal   = $('#invitation-modal');
  const openInvBtn = $('#btn-open-card-modal');
  const closeInvBtn= $('#close-card-modal');

  const greetModal = $('#greetings-modal');
  const openGreetBtn = $('#btn-open-greetings-modal');
  const closeGreetBtn= $('#close-greetings-modal');
  const treePlantBtn = $('#btn-tree-plant-wish');

  const leafModal    = $('#blessing-view-modal');
  const closeLeafBtn = $('#close-leaf-modal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Invitation Modal
  if (openInvBtn && invModal) {
    openInvBtn.addEventListener('click', () => {
      openModal(invModal);
      scanFormalInvitationCards();
    });
  }
  if (closeInvBtn && invModal) {
    closeInvBtn.addEventListener('click', () => closeModal(invModal));
  }
  if (invModal) {
    invModal.addEventListener('click', e => {
      if (e.target === invModal) closeModal(invModal);
    });
  }

  // Initial card scan
  scanFormalInvitationCards();

  // Tabs inside Invitation Modal
  const modalTabs = $$('.modal-tab', invModal);
  modalTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      modalTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      $$('.modal-tab-pane', invModal).forEach(pane => {
        pane.classList.toggle('active', pane.id === targetId);
      });
    });
  });

  // Greetings Form Modal Open
  if (openGreetBtn && greetModal) {
    openGreetBtn.addEventListener('click', () => openModal(greetModal));
  }
  if (treePlantBtn && greetModal) {
    treePlantBtn.addEventListener('click', () => openModal(greetModal));
  }
  if (closeGreetBtn && greetModal) {
    closeGreetBtn.addEventListener('click', () => closeModal(greetModal));
  }
  if (greetModal) {
    greetModal.addEventListener('click', e => {
      if (e.target === greetModal) closeModal(greetModal);
    });
  }

  // Leaf Viewer Modal Close
  if (closeLeafBtn && leafModal) {
    closeLeafBtn.addEventListener('click', () => closeModal(leafModal));
  }
  if (leafModal) {
    leafModal.addEventListener('click', e => {
      if (e.target === leafModal) closeModal(leafModal);
    });
  }

  // View on tree button from success state
  const viewOnTreeBtn = $('#btn-view-on-tree');
  if (viewOnTreeBtn && greetModal) {
    viewOnTreeBtn.addEventListener('click', () => {
      closeModal(greetModal);
      const treeSec = $('#tree-of-blessings');
      if (treeSec) treeSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Global Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(invModal);
      closeModal(greetModal);
      closeModal(leafModal);
    }
  });
}

/* ── 10.5 DYNAMIC FORMAL INVITATION CARDS SCANNER ──────────────── */
async function scanFormalInvitationCards() {
  const weddingUploadedContainer = document.getElementById('uploaded-card-wedding');
  const weddingDigitalCard = document.getElementById('digital-card-wedding');
  const weddingHint = document.getElementById('hint-card-wedding');

  const engagementUploadedContainer = document.getElementById('uploaded-card-engagement');
  const engagementDigitalCard = document.getElementById('digital-card-engagement');
  const engagementHint = document.getElementById('hint-card-engagement');

  if (!weddingUploadedContainer || !engagementUploadedContainer) return;

  const folders = ['Images/Formal Invitation Cards/', 'Formal Invitation Cards/'];
  let scannedImages = [];

  // 1. Try directory listing via fetch
  for (const folder of folders) {
    try {
      const res = await fetch(folder);
      if (res.ok) {
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        for (const a of links) {
          const href = a.getAttribute('href');
          if (href && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(href)) {
            const cleanName = href.split('/').pop();
            const fullPath = folder + cleanName;
            if (!scannedImages.includes(fullPath)) {
              scannedImages.push(fullPath);
            }
          }
        }
      }
    } catch (e) {
      // Fallback to file candidates
    }
  }

  // 2. Candidate filenames if directory listing is not available
  if (scannedImages.length === 0) {
    const candidateFiles = [
      'wedding.jpg', 'wedding.jpeg', 'wedding.png', 'wedding.webp',
      'engagement.jpg', 'engagement.jpeg', 'engagement.png', 'engagement.webp',
      'card1.jpg', 'card1.jpeg', 'card1.png', 'card1.webp',
      'card2.jpg', 'card2.jpeg', 'card2.png', 'card2.webp',
      'card.jpg', 'card.jpeg', 'card.png', 'card.webp',
      'invitation.jpg', 'invitation.jpeg', 'invitation.png',
      'Image 1.jpeg', 'Image 1.jpg', 'Image 1.png',
      'Image 2.jpeg', 'Image 2.jpg', 'Image 2.png',
      '1.jpg', '1.jpeg', '1.png', '2.jpg', '2.jpeg', '2.png'
    ];

    const probeImage = (url) => new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => resolve(null);
      img.src = url;
    });

    const probePromises = [];
    for (const folder of folders) {
      for (const file of candidateFiles) {
        probePromises.push(probeImage(folder + file));
      }
    }
    const results = await Promise.all(probePromises);
    scannedImages = [...new Set(results.filter(Boolean))];
  }

  // Determine images for Wedding & Engagement
  let weddingImg = null;
  let engagementImg = null;

  if (scannedImages.length > 0) {
    for (const imgUrl of scannedImages) {
      const lower = imgUrl.toLowerCase();
      if ((lower.includes('wedding') || lower.includes('marriage') || lower.includes('card1') || lower.includes('1.')) && !weddingImg) {
        weddingImg = imgUrl;
      } else if ((lower.includes('engagement') || lower.includes('betrothal') || lower.includes('card2') || lower.includes('2.')) && !engagementImg) {
        engagementImg = imgUrl;
      }
    }
    if (!weddingImg && scannedImages[0]) weddingImg = scannedImages[0];
    if (!engagementImg && scannedImages[1]) engagementImg = scannedImages[1];
  }

  // Render Wedding Tab
  if (weddingImg) {
    weddingUploadedContainer.innerHTML = `<img src="${weddingImg}" alt="Physical Wedding Invitation Card" class="uploaded-card-img" />`;
    weddingUploadedContainer.style.display = 'flex';
    if (weddingDigitalCard) weddingDigitalCard.style.display = 'none';
    if (weddingHint) weddingHint.textContent = 'Physical wedding invitation card from uploaded folder.';
  } else {
    weddingUploadedContainer.style.display = 'none';
    if (weddingDigitalCard) weddingDigitalCard.style.display = 'block';
    if (weddingHint) weddingHint.textContent = 'Physical printed card keepsake preview.';
  }

  // Render Engagement Tab
  if (engagementImg) {
    engagementUploadedContainer.innerHTML = `<img src="${engagementImg}" alt="Physical Engagement Invitation Card" class="uploaded-card-img" />`;
    engagementUploadedContainer.style.display = 'flex';
    if (engagementDigitalCard) engagementDigitalCard.style.display = 'none';
    if (engagementHint) engagementHint.textContent = 'Physical engagement invitation card from uploaded folder.';
  } else {
    engagementUploadedContainer.style.display = 'none';
    if (engagementDigitalCard) engagementDigitalCard.style.display = 'block';
    if (engagementHint) engagementHint.textContent = 'Physical printed card keepsake preview.';
  }
}

/* ── 11. ENCRYPTED GOOGLE SHEET & TREE OF BLESSINGS ──────────── */
// Secret key and obfuscated Google Sheets endpoint
const _TREE_CIPHER_KEY = 'TreeBlessings2026';
const _TREE_ENC_ENDPOINT = 'PAYRFTFWSlwXBg0UXVVfXVE4F0sGLQFKAAMbCwYXQVhXUyABSgFtXVwnNTAlAyVgXkNbBRgxOhBbC0YBJhsMPAN9VkYdNg9WLwYWPkA5AhJDfQAdUywCChc2UwMcAQQPE05RQ0QQMxsBWHI=';

function decryptEndpoint(encB64, keyStr) {
  try {
    const raw = atob(encB64);
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ keyStr.charCodeAt(i % keyStr.length));
    }
    return out;
  } catch (err) {
    return '';
  }
}

// Tree organic branch coordinate slots (percentage top, left, rotation angle, leaf type)
const TREE_BRANCH_SLOTS = [
  { top: 21, left: 47, rot: -3, type: 'heart' },
  { top: 27, left: 33, rot: -10, type: 'leaf' },
  { top: 25, left: 63, rot: 8, type: 'leaf' },
  { top: 38, left: 24, rot: -14, type: 'gold' },
  { top: 36, left: 74, rot: 12, type: 'heart' },
  { top: 48, left: 20, rot: -8, type: 'leaf' },
  { top: 46, left: 78, rot: 10, type: 'leaf' },
  { top: 17, left: 37, rot: -6, type: 'gold' },
  { top: 16, left: 57, rot: 6, type: 'heart' },
  { top: 34, left: 42, rot: -5, type: 'leaf' },
  { top: 33, left: 55, rot: 5, type: 'leaf' },
  { top: 44, left: 32, rot: -12, type: 'gold' },
  { top: 43, left: 66, rot: 14, type: 'heart' },
  { top: 14, left: 47, rot: 0, type: 'gold' },
  { top: 23, left: 21, rot: -16, type: 'leaf' },
  { top: 22, left: 76, rot: 16, type: 'leaf' },
  { top: 51, left: 28, rot: -6, type: 'tag' },
  { top: 50, left: 69, rot: 8, type: 'tag' },
  { top: 30, left: 49, rot: 2, type: 'heart' },
  { top: 19, left: 29, rot: -11, type: 'leaf' },
  { top: 18, left: 68, rot: 9, type: 'leaf' }
];

// Initial seed blessings to provide warm living atmosphere (from reference image)
const DEFAULT_SEED_BLESSINGS = [
  { name: 'Kevin', message: 'So happy for you both!', showName: true },
  { name: 'Anna', message: 'God bless your journey with boundless love.', showName: true },
  { name: 'Maria', message: 'May your home always be filled with love and laughter.', showName: true },
  { name: 'Rinu', message: 'A lifetime of love & joy for Linto & Femi.', showName: true },
  { name: 'Jithin', message: 'Two hearts, one beautiful sacred journey.', showName: true },
  { name: 'Neha', message: 'Wishing you endless happiness and divine peace.', showName: true }
];

let allTreeWishes = [];

function initTreeOfBlessings() {
  const container = $('#tree-leaves-container');
  if (!container) return;

  loadTreeBlessings();

  // Wire up Form Submission
  const greetForm   = $('#greetings-form');
  const greetSucc   = $('#greetings-success');
  const anotherBtn  = $('#btn-send-another');

  if (greetForm) {
    greetForm.addEventListener('submit', e => {
      e.preventDefault();
      const nameInput     = $('#greet-name');
      const msgInput      = $('#greet-message');
      const showNameCheck = $('#greet-show-name');

      const rawName  = nameInput ? nameInput.value.trim() : '';
      const rawMsg   = msgInput ? msgInput.value.trim() : '';
      const showName = showNameCheck ? showNameCheck.checked : true;

      if (!rawName || !rawMsg) return;

      const newWish = {
        name: rawName,
        message: rawMsg,
        showName: showName,
        date: new Date().toISOString()
      };

      // 1. Save locally
      try {
        const localSaved = JSON.parse(localStorage.getItem('wedding_blessings_tree') || '[]');
        localSaved.unshift(newWish);
        localStorage.setItem('wedding_blessings_tree', JSON.stringify(localSaved));
      } catch (_) {}

      // 2. Add to active tree with growth animation
      allTreeWishes.unshift(newWish);
      plantNewLeafOnTree(newWish, true);

      // 3. Update counter & state
      updateTreeCounters();

      // 4. Show success UI
      greetForm.style.display = 'none';
      if (greetSucc) {
        greetSucc.style.display = 'block';
        const msgEl = $('#success-guest-msg');
        if (msgEl) {
          msgEl.textContent = `Thank you ${showName ? rawName : 'dear friend'}! Your leaf is now blooming on our Tree of Blessings.`;
        }
      }

      // 5. Confetti celebration
      launchConfetti();

      // 6. Asynchronously send to Google Sheets
      syncWishToGoogleSheet(newWish);
    });
  }

  if (anotherBtn && greetForm && greetSucc) {
    anotherBtn.addEventListener('click', () => {
      greetForm.reset();
      greetSucc.style.display = 'none';
      greetForm.style.display = 'block';
    });
  }
}

// Load blessings from Google Sheets CSV + LocalStorage + Seeds
function loadTreeBlessings() {
  const endpoint = decryptEndpoint(_TREE_ENC_ENDPOINT, _TREE_CIPHER_KEY);
  let localBlessings = [];

  try {
    localBlessings = JSON.parse(localStorage.getItem('wedding_blessings_tree') || '[]');
  } catch (_) {}

  // Fetch Google Sheets in background
  if (endpoint) {
    fetch(endpoint)
      .then(res => res.text())
      .then(csv => {
        const remoteWishes = parseGoogleSheetCSV(csv);
        // Combine remote + local + seed without duplicate names & messages
        combineAndRenderWishes(remoteWishes, localBlessings);
      })
      .catch(() => {
        // Fallback gracefully to local + seed
        combineAndRenderWishes([], localBlessings);
      });
  } else {
    combineAndRenderWishes([], localBlessings);
  }
}

function parseGoogleSheetCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return []; // Only header

  const wishes = [];
  // Skip header: "Your Name,Your Blessings & Message"
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser handling quotes
    const parts = parseCSVLine(line);
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const message = parts[1].trim();
      if (name && message) {
        wishes.push({ name, message, showName: true });
      }
    }
  }
  return wishes;
}

function parseCSVLine(text) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      result.push(cur);
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur);
  return result;
}

function combineAndRenderWishes(remote, local) {
  const combined = [];
  const seen = new Set();

  function addWish(w) {
    if (!w || !w.name || !w.message) return;
    const key = `${w.name}___${w.message}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(w);
    }
  }

  // Priority: User's locally submitted wishes first, then Google Sheet rows
  local.forEach(addWish);
  remote.forEach(addWish);

  // If no wishes exist yet from Google Sheet or local, show default seed blessings
  if (combined.length === 0) {
    DEFAULT_SEED_BLESSINGS.forEach(addWish);
  }

  allTreeWishes = combined;
  renderAllLeaves(allTreeWishes);
  updateTreeCounters();
}

function renderAllLeaves(wishes) {
  const container = $('#tree-leaves-container');
  if (!container) return;
  container.innerHTML = '';

  const maxRender = Math.min(wishes.length, TREE_BRANCH_SLOTS.length);
  for (let i = 0; i < maxRender; i++) {
    const wish = wishes[i];
    const slot = TREE_BRANCH_SLOTS[i];
    const leaf = createLeafElement(wish, slot, false, i * 70);
    container.appendChild(leaf);
  }
}

function plantNewLeafOnTree(wish, isNew = false) {
  const container = $('#tree-leaves-container');
  if (!container) return;

  const slotIndex = (allTreeWishes.length - 1) % TREE_BRANCH_SLOTS.length;
  const slot = TREE_BRANCH_SLOTS[slotIndex];
  
  const leaf = createLeafElement(wish, slot, isNew, 0);
  container.appendChild(leaf);

  if (isNew) {
    const treeSec = $('#tree-of-blessings');
    if (treeSec) {
      setTimeout(() => {
        treeSec.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }
}

function createLeafElement(wish, slot, isGrowing = false, delayMs = 0) {
  const leaf = document.createElement('div');
  const typeClass = slot.type ? `tree-leaf--${slot.type}` : 'tree-leaf--heart';
  leaf.className = `tree-leaf ${typeClass} ${isGrowing ? 'tree-leaf--growing tree-leaf--highlighted' : ''}`;

  const stringLen = 18 + Math.floor(Math.random() * 16);
  const swayDur   = (3.6 + Math.random() * 1.8).toFixed(1);
  const swayDel   = (-Math.random() * 3).toFixed(1);
  const rotStart  = (-2.5 - Math.random() * 2).toFixed(1);
  const rotEnd    = (2.5 + Math.random() * 2).toFixed(1);

  leaf.style.top  = `${slot.top}%`;
  leaf.style.left = `${slot.left}%`;
  leaf.style.setProperty('--string-len', `${stringLen}px`);
  leaf.style.setProperty('--sway-dur', `${swayDur}s`);
  leaf.style.setProperty('--sway-del', `${swayDel}s`);
  leaf.style.setProperty('--rot-start', `${rotStart}deg`);
  leaf.style.setProperty('--rot-end', `${rotEnd}deg`);

  leaf.setAttribute('tabindex', '0');
  leaf.setAttribute('role', 'button');
  leaf.setAttribute('aria-label', `Read blessing from ${wish.showName !== false ? wish.name : 'A Well-Wisher'}`);

  if (!isGrowing && delayMs > 0) {
    leaf.style.opacity = '0';
    leaf.style.animation = `leafFadeIn 0.8s ease ${delayMs}ms forwards`;
  }

  const displayName = wish.showName !== false ? wish.name : 'A Well-Wisher';
  const leafId = 'leaf-grad-' + Math.random().toString(36).substring(2, 8);

  // Autumn maple leaf colour palette — 4 variants inspired by the golden amber reference tree
  const paletteMap = {
    heart: { c0: '#ffe566', c1: '#f5a623', c2: '#c0392b', c3: '#8b1a1a', stroke: '#7b1212', vein: 'rgba(255,240,150,0.85)' },
    leaf:  { c0: '#fff9a0', c1: '#ffb300', c2: '#e65100', c3: '#bf360c', stroke: '#a03000', vein: 'rgba(255,248,180,0.80)' },
    gold:  { c0: '#fffde7', c1: '#ffd740', c2: '#ff8f00', c3: '#e65100', stroke: '#c67c00', vein: 'rgba(255,253,200,0.90)' },
    tag:   { c0: '#f9fbe7', c1: '#c5e067', c2: '#7cb342', c3: '#33691e', stroke: '#4a7c20', vein: 'rgba(230,255,180,0.75)' }
  };
  const pal = paletteMap[slot.type] || paletteMap.heart;

  leaf.innerHTML = `
    <div class="tree-charm__ring" aria-hidden="true"></div>
    <div class="tree-charm__string" aria-hidden="true"></div>
    <div class="tree-leaf__body" title="${escapeHTML(displayName)}'s Wish">
      <svg class="tree-leaf__svg" viewBox="0 0 48 54" fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="${leafId}" cx="44%" cy="36%" r="65%" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stop-color="${pal.c0}" />
            <stop offset="28%"  stop-color="${pal.c1}" />
            <stop offset="65%"  stop-color="${pal.c2}" />
            <stop offset="100%" stop-color="${pal.c3}" />
          </radialGradient>
        </defs>
        <!-- 5-LOBED AUTUMN MAPLE LEAF -->
        <path d="
          M 24 51 L 22 42
          Q 16 44, 10 42 Q 8 38, 12 35
          Q 2 33, 1 27 Q 6 23, 13 26
          Q 7 17, 9 11 Q 15 11, 18 19
          Q 20 7, 24 3
          Q 28 7, 30 19 Q 33 11, 39 11
          Q 41 17, 35 26 Q 42 23, 47 27
          Q 46 33, 36 35 Q 40 38, 38 42
          Q 32 44, 26 42 Z
        " fill="url(#${leafId})" stroke="${pal.stroke}" stroke-width="0.7" stroke-linejoin="round"/>
        <!-- Central mid-rib -->
        <line x1="24" y1="51" x2="24" y2="5" stroke="${pal.vein}" stroke-width="1.1" stroke-linecap="round" opacity="0.9"/>
        <!-- Upper lobe veins -->
        <path d="M 24 20 Q 16 15, 10 12" stroke="${pal.vein}" stroke-width="0.75" stroke-linecap="round" opacity="0.8"/>
        <path d="M 24 20 Q 32 15, 38 12" stroke="${pal.vein}" stroke-width="0.75" stroke-linecap="round" opacity="0.8"/>
        <!-- Side lobe veins -->
        <path d="M 22 30 Q 13 28, 4 26" stroke="${pal.vein}" stroke-width="0.7" stroke-linecap="round" opacity="0.7"/>
        <path d="M 26 30 Q 35 28, 44 26" stroke="${pal.vein}" stroke-width="0.7" stroke-linecap="round" opacity="0.7"/>
        <!-- Lower sub-veins -->
        <path d="M 22 37 Q 16 38, 11 40" stroke="${pal.vein}" stroke-width="0.55" stroke-linecap="round" opacity="0.6"/>
        <path d="M 26 37 Q 32 38, 37 40" stroke="${pal.vein}" stroke-width="0.55" stroke-linecap="round" opacity="0.6"/>
        <!-- Fine secondary veins -->
        <path d="M 18 24 Q 14 21, 11 19" stroke="${pal.vein}" stroke-width="0.45" stroke-linecap="round" opacity="0.5"/>
        <path d="M 30 24 Q 34 21, 37 19" stroke="${pal.vein}" stroke-width="0.45" stroke-linecap="round" opacity="0.5"/>
        <!-- Sunlit highlight -->
        <ellipse cx="20" cy="18" rx="4" ry="3" fill="${pal.c0}" opacity="0.28" transform="rotate(-20,20,18)"/>
      </svg>
      <span class="tree-leaf__name-preview">${escapeHTML(displayName.slice(0, 9))}</span>
    </div>
    <span class="tree-leaf__tooltip">${escapeHTML(displayName)} 🍁</span>
    ${isGrowing ? `<div class="tree-leaf__highlight-tag">Your Wish is Blooming on the Tree! 🍁</div>` : ''}
  `;

  // Click to open detail modal
  leaf.addEventListener('click', () => openBlessingModal(wish));
  leaf.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openBlessingModal(wish);
    }
  });

  return leaf;
}


function openBlessingModal(wish) {
  const leafModal = $('#blessing-view-modal');
  const msgEl     = $('#leaf-view-message');
  const authorEl  = $('#leaf-view-author');

  if (!leafModal) return;

  if (msgEl) msgEl.textContent = wish.message;
  if (authorEl) {
    const authorName = wish.showName !== false ? wish.name : 'A Well-Wisher';
    authorEl.textContent = `— ${authorName}`;
  }

  leafModal.classList.add('open');
  leafModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function updateTreeCounters() {
  const countNum   = $('#tree-counter-num');
  const emptyState = $('#tree-empty-state');
  const badgeWrap  = $('#tree-counter-badge');

  const count = allTreeWishes.length;

  if (countNum) countNum.textContent = count;

  if (count === 0) {
    if (emptyState) emptyState.style.display = 'block';
    if (badgeWrap)  badgeWrap.style.display  = 'none';
  } else {
    if (emptyState) emptyState.style.display = 'none';
    if (badgeWrap)  badgeWrap.style.display  = 'block';
  }
}

// Global Google Sheets Web App Endpoint
const _GOOGLE_SHEETS_SCRIPT_URL = window.GOOGLE_SHEETS_SCRIPT_URL || '';

function syncWishToGoogleSheet(wish) {
  if (!wish || !wish.name || !wish.message) return;

  const scriptUrl = window.GOOGLE_SHEETS_SCRIPT_URL || _GOOGLE_SHEETS_SCRIPT_URL;

  if (!scriptUrl) {
    console.log('📌 Blessing saved locally & blooming on tree. Set GOOGLE_SHEETS_SCRIPT_URL to post to Google Sheets.');
    return;
  }

  const payload = {
    name: wish.name,
    message: wish.message,
    showName: wish.showName !== false ? 'Yes' : 'No',
    timestamp: wish.date || new Date().toLocaleString()
  };

  try {
    if (scriptUrl.includes('script.google.com')) {
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(() => {
        console.log('✅ Blessing successfully synced to Google Sheet!');
      }).catch(err => {
        const queryParams = new URLSearchParams(payload).toString();
        fetch(`${scriptUrl}?${queryParams}`, { mode: 'no-cors' }).catch(() => {});
      });
    } else {
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    }
  } catch (err) {
    console.error('Error syncing to Google Sheet:', err);
  }
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── 12. CELEBRATION PHOTO ALBUMS CONTROLLER ────────────────── */
function initPhotoAlbumsCarousel() {
  const container = $('#albums-marquee-container');
  const prevBtn   = $('#albums-prev-btn');
  const nextBtn   = $('#albums-next-btn');
  if (!container) return;

  const scrollStep = 320;

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }
}

/* ── 13. CELEBRATORY CONFETTI ENGINE ────────────────────────── */
function launchConfetti() {
  const canvas = $('#confetti-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#b9975b', '#e2cb98', '#173f2b', '#244d37', '#fdf8ef', '#d4af37'];
  const pieces = [];
  const count  = 80;

  for (let i = 0; i < count; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 260,
      y: canvas.height * 0.45 + (Math.random() - 0.5) * 120,
      w: Math.random() * 9 + 4,
      h: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12,
      gravity: 0.35,
      drag: 0.96,
      opacity: 1,
    });
  }

  let animationFrame;
  const startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const elapsed = Date.now() - startTime;

    let alive = 0;
    pieces.forEach(p => {
      p.vx *= p.drag;
      p.vy += p.gravity;
      p.x  += p.vx;
      p.y  += p.vy;
      p.rot += p.vrot;

      if (elapsed > 2000) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < canvas.height + 50) {
        alive++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (alive > 0 && elapsed < 4000) {
      animationFrame = requestAnimationFrame(render);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  render();
}

/* ── 14. INTERACTIVE 3D PERSPECTIVE TILT ─────────────────────── */
function initInteractive3DTilt() {
  const tiltCards = document.querySelectorAll('.couple__arch-frame, .hub-card, .event-card, .album-carousel-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (centerY - y) / 30;
      const rotateY = (x - centerX) / 30;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── INIT ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFloatingNav();
  initCountdown();
  initMusic();
  initOpenInvitation();
  initHeroControls();
  initScrollReveal();
  initGallery();
  initCalendarButtons();
  initParticles();
  initLazyImages();
  initModals();
  initPhotoAlbumsCarousel();
  initTreeOfBlessings();
  initInteractive3DTilt();
});

