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
  const wedding  = new Date(`${weddingConfig.weddingDate}T10:30:00+05:30`);
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

  // Render gallery using exclusively photos from the project's Images/Moments/ folder
  renderGallery();

  // Dynamic automatic discovery of any additional photos in Images/Moments/:
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

  const starModal = $('#light-star-modal') || $('#greetings-modal');
  const openStarBtn = $('#btn-open-sky-form');
  const openGreetBtn = $('#btn-open-greetings-modal');
  const closeStarBtn= $('#close-star-modal') || $('#close-greetings-modal');

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

  // Light Star / Blessing Modal Open
  if (openStarBtn && starModal) {
    openStarBtn.addEventListener('click', () => openModal(starModal));
  }
  if (openGreetBtn && starModal) {
    openGreetBtn.addEventListener('click', () => openModal(starModal));
  }
  if (closeStarBtn && starModal) {
    closeStarBtn.addEventListener('click', () => closeModal(starModal));
  }
  if (starModal) {
    starModal.addEventListener('click', e => {
      if (e.target === starModal) closeModal(starModal);
    });
  }

  // View in Sky button from success state
  const viewSkyBtn = $('#btn-view-star-sky') || $('#btn-view-on-wall');
  if (viewSkyBtn && starModal) {
    viewSkyBtn.addEventListener('click', () => {
      closeModal(starModal);
      const skySec = $('#sky-of-blessings');
      if (skySec) skySec.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Global Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeModal(invModal);
      closeModal(starModal);
      if (typeof closeSkyStarPopover === 'function') closeSkyStarPopover();
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

/* ── 11. SKY OF BLESSINGS (CELESTIAL STARLIT GUESTBOOK) ─────── */

let allBlessings = [];
let activeStarPopover = null;

function initSkyOfBlessings() {
  const skyViewport = $('#sky-viewport');
  if (!skyViewport) return;

  initSkyAmbientCanvas();
  loadSkyBlessingsData();
  setupSkyForm();
  setupSkyPopover();
  initSkyCounterObserver();
}

/**
 * Ambient background starlight canvas (decorative non-blessing stars)
 */
function initSkyAmbientCanvas() {
  const canvas = $('#sky-ambient-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;

  function resize() {
    canvas.width = canvas.parentElement.clientWidth || 1000;
    canvas.height = canvas.parentElement.clientHeight || 600;
  }

  resize();
  window.addEventListener('resize', resize);

  const ambientStars = [];
  const starCount = 45;

  for (let i = 0; i < starCount; i++) {
    ambientStars.push({
      x: Math.random(),
      y: Math.random() * 0.68,
      radius: Math.random() * 1.2 + 0.5,
      alpha: Math.random() * 0.7 + 0.2,
      speed: Math.random() * 0.02 + 0.008,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.4 ? '#ffd875' : '#ffffff'
    });
  }

  function render(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = time * 0.001;

    for (let i = 0; i < ambientStars.length; i++) {
      const s = ambientStars[i];
      const pulseAlpha = Math.max(0.1, Math.min(1, s.alpha + Math.sin(t * s.speed * 60 + s.phase) * 0.35));

      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.color;
      ctx.globalAlpha = pulseAlpha;
      ctx.fill();

      // Subtle glow on brighter stars
      if (s.radius > 1.2) {
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(202, 163, 89, 0.15)';
        ctx.globalAlpha = pulseAlpha * 0.4;
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    animationId = requestAnimationFrame(render);
  }

  animationId = requestAnimationFrame(render);
}

/**
 * Load blessings strictly from Google Sheet Web App / CSV (Zero Hardcoded Seeds, 1:1 Google Sheet Sync)
 */
function loadSkyBlessingsData() {
  const scriptUrl = window.GOOGLE_SHEETS_SCRIPT_URL || '';
  const csvEndpoint = 'https://docs.google.com/spreadsheets/d/19TFYKdVRnqmQjT_R7n5rOukO1MdpIDj3mjsM3Plu0O0/export?format=csv&gid=0';

  if (scriptUrl) {
    fetch(`${scriptUrl}?action=wishes`)
      .then(res => res.json())
      .then(data => {
        if (data && data.wishes && Array.isArray(data.wishes)) {
          combineAndRenderSkyBlessings(data.wishes);
        } else {
          loadFromCsvAndCombine(csvEndpoint);
        }
      })
      .catch(() => {
        loadFromCsvAndCombine(csvEndpoint);
      });
  } else {
    loadFromCsvAndCombine(csvEndpoint);
  }
}

function loadFromCsvAndCombine(endpoint) {
  if (!endpoint) {
    combineAndRenderSkyBlessings([]);
    return;
  }
  fetch(endpoint)
    .then(res => res.text())
    .then(csv => {
      const remoteWishes = parseGoogleSheetSkyCSV(csv);
      combineAndRenderSkyBlessings(remoteWishes);
    })
    .catch(() => {
      combineAndRenderSkyBlessings([]);
    });
}

function parseGoogleSheetSkyCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return [];
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return [];

  const wishes = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length >= 2) {
      const name = parts[0].trim();
      const message = parts[1].trim();
      const category = parts[2] ? parts[2].trim() : 'Blessing';
      const showName = parts[3] ? parts[3].trim() !== 'No' : true;
      const timestamp = parts[4] ? parts[4].trim() : 'Blessing Star';

      if (name && message) {
        wishes.push({
          id: 'sheet-' + i,
          name: name,
          message: message,
          category: category,
          showName: showName,
          date: timestamp
        });
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

function combineAndRenderSkyBlessings(remote) {
  const combined = [];
  const seen = new Set();

  function addWish(w) {
    if (!w || !w.name || !w.message) return;
    const key = `${w.name.trim()}___${w.message.trim()}`.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combined.push(w);
    }
  }

  // Remote Google Sheet records in descending order (latest records first)
  (remote || []).slice().reverse().forEach(addWish);

  // Clear stale local storage to guarantee 1:1 fidelity with Google Sheet
  try {
    localStorage.removeItem('wedding_blessings_sky');
    localStorage.removeItem('wedding_wishes');
  } catch (_) {}

  allBlessings = combined;
  renderSkyStars(allBlessings);
  updateSkyCounter();
}

/**
 * Deterministic Organic Coordinate Generator
 * Ensures the SAME blessing ALWAYS appears in the EXACT same position across all page loads.
 * Positions stars strictly in the celestial night sky (Y: 6% to 35%), keeping couple area completely clear.
 */
function getDeterministicSkyPosition(seedStr, index, totalCount) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Golden ratio pseudorandom dispersion
  const phi = 0.618033988749895;
  const randX = ((absHash % 1000) / 1000 + (index + 1) * phi) % 1;
  const randY = (((absHash >> 3) % 1000) / 1000 + (index + 1) * phi * 1.618) % 1;

  // Spread horizontally across panoramic canvas (8% to 92%)
  let posX = 8 + randX * 84;
  
  // Height strictly in upper night sky:
  // Left side (above the couple): Y strictly 6% to 28% (never reaches couple's heads/bodies)
  // Right side (above hills & church): Y strictly 8% to 35%
  let posY = 0;
  if (posX < 46) {
    posY = 6 + (randY * 22);
  } else {
    posY = 8 + (randY * 27);
  }

  // Final bounds clamp - strictly in the celestial dome
  posX = Number(Math.max(7, Math.min(93, posX)).toFixed(1));
  posY = Number(Math.max(6, Math.min(35, posY)).toFixed(1));

  return { x: posX, y: posY };
}

/**
 * Render all blessing stars in the sky in descending order (latest first)
 */
function renderSkyStars(blessings) {
  const layer = $('#sky-stars-layer');
  const emptyPrompt = $('#sky-empty-prompt');
  if (!layer) return;

  layer.innerHTML = '';

  if (blessings.length === 0) {
    if (emptyPrompt) emptyPrompt.style.display = 'block';
    return;
  } else {
    if (emptyPrompt) emptyPrompt.style.display = 'none';
  }

  blessings.forEach((wish, idx) => {
    const starEl = createSkyStarElement(wish, idx, blessings.length);
    layer.appendChild(starEl);
  });
}

function createSkyStarElement(wish, index, total) {
  const seedKey = `${wish.id || index}_${wish.name}_${wish.message}`;
  const pos = getDeterministicSkyPosition(seedKey, index, total);

  const starBtn = document.createElement('button');
  const isLatest = index === 0;
  starBtn.className = `sky-star ${isLatest ? 'sky-star--latest' : ''}`;
  starBtn.style.left = `${pos.x}%`;
  starBtn.style.top = `${pos.y}%`;
  starBtn.setAttribute('type', 'button');
  
  const displayName = wish.showName !== false && wish.showName !== 'No' ? wish.name : 'A Well-Wisher';
  starBtn.setAttribute('aria-label', `Star blessing from ${displayName}${isLatest ? ' (Latest Wish)' : ''}`);

  // Scale / star shape variance based on index
  const sizeVariance = isLatest ? 22 : (14 + (index % 4) * 2);
  const animDelay = ((index * 0.35) % 3).toFixed(2);

  starBtn.innerHTML = `
    <div class="star-glow-aura" style="animation-delay: ${animDelay}s;"></div>
    <svg class="star-svg-shape" viewBox="0 0 24 24" style="width: ${sizeVariance}px; height: ${sizeVariance}px; animation-delay: ${animDelay}s;">
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z"/>
    </svg>
    <div class="star-core-dot"></div>
  `;

  starBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openSkyStarPopover(wish, starBtn, pos);
  });

  return starBtn;
}

/**
 * Open Floating Popover Card for a selected star
 */
function openSkyStarPopover(wish, starEl, pos) {
  const popover = $('#sky-star-popover');
  const viewport = $('#sky-viewport');
  const starsLayer = $('#sky-stars-layer');
  if (!popover || !viewport) return;

  // Dim surrounding stars
  if (starsLayer) starsLayer.classList.add('sky-stars-dimmed');
  $$('.sky-star').forEach(s => s.classList.remove('active'));
  starEl.classList.add('active');

  const displayName = wish.showName !== false && wish.showName !== 'No' ? wish.name : 'A Well-Wisher';
  const nameEl = $('#sky-popover-name');
  const msgEl = $('#sky-popover-msg');
  const dateEl = $('#sky-popover-date');

  if (nameEl) nameEl.textContent = displayName;
  if (msgEl) msgEl.textContent = `“${wish.message}”`;
  if (dateEl) dateEl.textContent = wish.date || 'Blessing in Sky';

  popover.style.display = 'block';
  popover.setAttribute('aria-hidden', 'false');

  // Calculate popover positioning
  const vWidth = viewport.clientWidth;
  const vHeight = viewport.clientHeight;
  const popoverWidth = Math.min(340, vWidth - 32);

  let leftPx = (pos.x / 100) * vWidth;
  let topPx = (pos.y / 100) * vHeight;

  // On desktop/tablet: anchor above or below the star
  if (vWidth > 600) {
    if (pos.y > 55) {
      topPx = topPx - 180;
    } else {
      topPx = topPx + 30;
    }
    leftPx = Math.max(popoverWidth / 2 + 16, Math.min(vWidth - popoverWidth / 2 - 16, leftPx));
    popover.style.left = `${leftPx}px`;
    popover.style.top = `${topPx}px`;
    popover.style.transform = 'translateX(-50%)';
  } else {
    // On mobile: center inside viewport
    popover.style.left = '50%';
    popover.style.top = 'auto';
    popover.style.bottom = '20px';
    popover.style.transform = 'translateX(-50%)';
  }

  activeStarPopover = starEl;
}

function closeSkyStarPopover() {
  const popover = $('#sky-star-popover');
  const starsLayer = $('#sky-stars-layer');
  if (popover) {
    popover.style.display = 'none';
    popover.setAttribute('aria-hidden', 'true');
  }
  if (starsLayer) {
    starsLayer.classList.remove('sky-stars-dimmed');
  }
  $$('.sky-star').forEach(s => s.classList.remove('active'));
  activeStarPopover = null;
}

function setupSkyPopover() {
  const closeBtn = $('#sky-popover-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeSkyStarPopover);
  }

  // Click outside to close popover
  document.addEventListener('click', (e) => {
    const popover = $('#sky-star-popover');
    if (popover && popover.style.display !== 'none') {
      if (!popover.contains(e.target) && !e.target.closest('.sky-star')) {
        closeSkyStarPopover();
      }
    }
  });
}

/**
 * Fast Animated Count-Up for Sky Blessings Pill
 */
function animateSkyBlessingCounter(targetNum) {
  const countNum = $('#sky-blessings-num');
  const countLabel = $('#sky-counter-badge .sky-stat-label');
  if (!countNum) return;
  const target = Math.max(0, parseInt(targetNum, 10) || 0);

  if (countLabel) {
    countLabel.textContent = target === 1 ? 'Blessing' : 'Blessings';
  }

  let current = 0;
  const duration = 1200; // fast 1.2s
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const easeOut = 1 - (1 - progress) * (1 - progress);
    current = Math.round(target * easeOut);
    countNum.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      countNum.textContent = target;
      const pill = $('#sky-counter-badge');
      if (pill) {
        pill.classList.add('pulse-highlight');
        setTimeout(() => pill.classList.remove('pulse-highlight'), 700);
      }
    }
  }

  requestAnimationFrame(step);
}

function updateSkyCounter() {
  const targetCount = allBlessings.length;
  animateSkyBlessingCounter(targetCount);
}

function initSkyCounterObserver() {
  const skySection = $('#sky-of-blessings');
  if (!skySection) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateSkyCounter();
        }
      });
    }, { threshold: 0.15 });
    observer.observe(skySection);
  }
}

/**
 * Setup "Light Your Star" Modal & Rising Particle Shooting Animation
 */
function setupSkyForm() {
  const form = $('#star-blessing-form');
  const nameInput = $('#star-input-name');
  const msgInput = $('#star-input-message');
  const charCounter = $('#star-char-counter');
  const showNameCheck = $('#star-input-show-name');
  const errorBox = $('#star-form-error');
  const modal = $('#light-star-modal') || $('#greetings-modal');

  // Character counter
  if (msgInput && charCounter) {
    msgInput.addEventListener('input', () => {
      const len = msgInput.value.length;
      charCounter.textContent = `${len} / 300`;
      if (len >= 300) {
        charCounter.style.color = '#ffd875';
      } else {
        charCounter.style.color = '#9cbda3';
      }
    });
  }

  // Modal Open Buttons
  const openSkyBtn = $('#btn-open-sky-form');
  const openGreetBtn = $('#btn-open-greetings-modal');
  const openBlessingBtn = $('#btn-open-blessing-form');
  const closeStarBtn = $('#close-star-modal') || $('#close-greetings-modal');

  function openModal() {
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (errorBox) errorBox.style.display = 'none';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openSkyBtn) openSkyBtn.addEventListener('click', openModal);
  if (openGreetBtn) openGreetBtn.addEventListener('click', openModal);
  if (openBlessingBtn) openBlessingBtn.addEventListener('click', openModal);
  if (closeStarBtn) closeStarBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  // Form Submit Handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const rawName = nameInput ? nameInput.value.trim() : '';
      const rawMsg = msgInput ? msgInput.value.trim() : '';
      const showName = showNameCheck ? showNameCheck.checked : true;

      // Validation
      if (!rawName || !rawMsg) {
        if (errorBox) {
          errorBox.textContent = 'Please fill in both your name and blessing.';
          errorBox.style.display = 'block';
        }
        return;
      }

      if (rawMsg.length > 300) {
        if (errorBox) {
          errorBox.textContent = 'Your blessing must be 300 characters or less.';
          errorBox.style.display = 'block';
        }
        return;
      }

      const newWish = {
        id: 'wish-' + Date.now(),
        name: rawName,
        message: rawMsg,
        showName: showName,
        date: 'Just now',
        isNew: true
      };

      // 1. Close form modal immediately
      closeModal();
      form.reset();
      if (charCounter) charCounter.textContent = '0 / 300';

      // 2. Smoothly scroll into view of the Sky of Blessings
      const skySection = $('#sky-of-blessings');
      if (skySection) {
        const rect = skySection.getBoundingClientRect();
        if (rect.top < -50 || rect.bottom > window.innerHeight + 100) {
          skySection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }

      // 3. Save locally in localStorage
      try {
        const localSaved = JSON.parse(localStorage.getItem('wedding_blessings_sky') || '[]');
        localSaved.unshift(newWish);
        localStorage.setItem('wedding_blessings_sky', JSON.stringify(localSaved));
      } catch (_) {}

      // 4. Calculate target deterministic position for the new star
      const seedKey = `${newWish.id}_${newWish.name}_${newWish.message}`;
      const targetPos = getDeterministicSkyPosition(seedKey, allBlessings.length, allBlessings.length + 1);

      // 5. Trigger Shooting Particle Ascent Animation
      launchRisingStarParticle(targetPos, () => {
        // Star bloom & add to sky permanently
        allBlessings.unshift(newWish);
        renderSkyStars(allBlessings);
        updateSkyCounter();

        // Show Starlight Toast Banner
        showSkyToast(`Thank you ${showName ? rawName : 'dear friend'}! Your blessing now permanently shines in their sky. ✨`);

        // Confetti celebration
        launchConfetti();
      });

      // 6. Asynchronously sync to Google Sheet via Google Apps Script
      syncWishToGoogleSheet(newWish);
    });
  }
}

/**
 * Step 2 to Step 7 of New Star Animation:
 * Particle rises upwards from bottom of sky to assigned position, expands with bloom pulse, and settles into twinkle.
 */
function launchRisingStarParticle(targetPos, onComplete) {
  const particleLayer = $('#sky-particle-layer');
  const viewport = $('#sky-viewport');
  if (!particleLayer || !viewport) {
    if (onComplete) onComplete();
    return;
  }

  const vWidth = viewport.clientWidth;
  const vHeight = viewport.clientHeight;

  const startX = vWidth * 0.5;
  const startY = vHeight - 30;
  const targetX = (targetPos.x / 100) * vWidth;
  const targetY = (targetPos.y / 100) * vHeight;

  const particle = document.createElement('div');
  particle.className = 'rising-star-particle';
  particle.innerHTML = '<div class="rising-star-trail"></div>';
  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;
  particleLayer.appendChild(particle);

  const duration = 1600; // 1.6 seconds smooth upward travel
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(1, elapsed / duration);

    // Ease-out cubic curve
    const ease = 1 - Math.pow(1 - progress, 3);

    const currentX = startX + (targetX - startX) * ease;
    const currentY = startY + (targetY - startY) * ease;

    particle.style.left = `${currentX}px`;
    particle.style.top = `${currentY}px`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Arrived at destination: remove particle and trigger bloom
      particle.remove();

      const burst = document.createElement('div');
      burst.className = 'star-bloom-burst';
      burst.style.left = `${targetX}px`;
      burst.style.top = `${targetY}px`;
      particleLayer.appendChild(burst);

      setTimeout(() => {
        burst.remove();
        if (onComplete) onComplete();
      }, 600);
    }
  }

  requestAnimationFrame(animate);
}

/**
 * Toast notification for Sky of Blessings
 */
function showSkyToast(msg) {
  const toast = $('#sky-toast');
  const titleEl = $('#sky-toast-title');
  if (!toast) return;

  if (titleEl) titleEl.textContent = msg || 'Your blessing is now a light in their sky. ✨';
  toast.style.display = 'flex';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 5000);
}

function syncWishToGoogleSheet(wish) {
  if (!wish || !wish.name || !wish.message) return;

  const scriptUrl = window.GOOGLE_SHEETS_SCRIPT_URL || '';
  if (!scriptUrl) {
    console.log('📌 Blessing saved locally. Set window.GOOGLE_SHEETS_SCRIPT_URL to post to Google Sheets.');
    return;
  }

  const payload = {
    name: wish.name,
    message: wish.message,
    category: wish.category || 'prayer',
    showName: wish.showName !== false ? 'Yes' : 'No',
    timestamp: wish.date || new Date().toLocaleString()
  };

  try {
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
  const section   = $('#photo-albums');
  const viewport  = $('#photo-albums-viewport');
  const track     = $('#photo-albums-track');
  const prevBtn   = $('#album-nav-prev');
  const nextBtn   = $('#album-nav-next');
  if (!section || !viewport || !track) return;

  // 1. Scroll Entrance Intersection Observer (Timeline 0.0s to 1.5s)
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('in-view');
          observer.unobserve(section);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    observer.observe(section);
  } else {
    section.classList.add('in-view');
  }

  // 2. Carousel Sliding State & 5-Second Auto-Scroll
  let currentIndex = 0;
  let totalCards = track.querySelectorAll('.album-card').length;
  let autoScrollTimer = null;

  function getCardsPerView() {
    const w = window.innerWidth;
    if (w > 980) return 3;
    if (w > 640) return 2;
    return 1;
  }

  function updateCarousel() {
    const cards = track.querySelectorAll('.album-card');
    totalCards = cards.length;
    if (totalCards === 0) return;

    const perView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - perView);
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

    const card = cards[0];
    if (!card) return;
    const cardWidth = card.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    const offset = currentIndex * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    if (prevBtn) prevBtn.style.opacity = '1';
    if (nextBtn) nextBtn.style.opacity = '1';
  }

  function nextSlide() {
    const perView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - perView);
    if (maxIndex <= 0) return;
    if (currentIndex >= maxIndex) {
      currentIndex = 0; // Seamless wrap back to start
    } else {
      currentIndex++;
    }
    updateCarousel();
  }

  function prevSlide() {
    const perView = getCardsPerView();
    const maxIndex = Math.max(0, totalCards - perView);
    if (maxIndex <= 0) return;
    if (currentIndex <= 0) {
      currentIndex = maxIndex; // Wrap to end
    } else {
      currentIndex--;
    }
    updateCarousel();
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollTimer = setInterval(nextSlide, 5000);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  // Start auto-scrolling
  startAutoScroll();

  // Pause on hover, resume on leave
  if (viewport) {
    viewport.addEventListener('mouseenter', stopAutoScroll);
    viewport.addEventListener('mouseleave', startAutoScroll);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoScroll(); // reset timer
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoScroll(); // reset timer
    });
  }

  window.addEventListener('resize', updateCarousel);

  // 3. Touch Swipe Handling for Mobile
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      startX = e.touches[0].clientX;
      isSwiping = true;
      stopAutoScroll();
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isSwiping || e.touches.length !== 1) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!isSwiping) return;
    isSwiping = false;
    const diff = startX - currentX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    startAutoScroll();
  });

  // 4. Fetch additional photos dynamically from Google Drive if available
  const scriptUrl = window.GOOGLE_SHEETS_SCRIPT_URL || '';
  if (scriptUrl) {
    fetch(`${scriptUrl}?action=album`)
      .then(res => res.json())
      .then(data => {
        if (data && Array.isArray(data.images) && data.images.length > 0) {
          renderCarouselCards(data.images);
        }
      })
      .catch(() => {});
  }

  function renderCarouselCards(images) {
    track.innerHTML = '';

    images.forEach((item, idx) => {
      const a = document.createElement('a');
      a.href = 'album.html';
      a.className = `album-card album-card--${idx + 1}`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      const title = item.name ? item.name.replace(/\.[^/.]+$/, "") : `Moment ${idx + 1}`;
      const thumb = item.thumbnailUrl || `https://lh3.googleusercontent.com/d/${item.id}=w800`;

      a.innerHTML = `
        <div class="album-card__img-box">
          <img src="${thumb}" alt="${escapeHTML(title)}" loading="lazy" class="album-card__photo" />
        </div>
      `;
      track.appendChild(a);
    });

    totalCards = images.length;
    currentIndex = 0;
    updateCarousel();
    startAutoScroll();
  }

  // Initial calculation
  setTimeout(updateCarousel, 100);
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
  initSkyOfBlessings();
  initInteractive3DTilt();
});

