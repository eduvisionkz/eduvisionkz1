// defense.js — Навигация презентации «Защита педагогической идеи»
// Без таймера. Без автопереключения. Только ручное управление.

(function () {
  const TOTAL = 7;
  let current = 0;

  const slides    = document.querySelector('.def-slides');
  const dots      = document.querySelectorAll('.def-dot');
  const counter   = document.getElementById('def-counter');
  const labelEl   = document.getElementById('def-slide-label');
  const btnPrev   = document.getElementById('def-btn-prev');
  const btnNext   = document.getElementById('def-btn-next');

  const LABELS = [
    'Экран 1 — Крючок · 45 сек',
    'Экран 2 — Актуальность · 1 мин',
    'Экран 3 — Идея + ЧТД · 1.5 мин',
    'Экран 4 — Платформа · 1 мин',
    'Экран 5 — Работы детей · 1 мин',
    'Экран 6 — Результаты + Достижения · 1 мин',
    'Экран 7 — Заключение · 45 сек'
  ];

  function goTo(n) {
    if (n < 0 || n >= TOTAL) return;
    current = n;

    // Move slides
    slides.style.transform = `translateX(${-100 / TOTAL * current}%)`;

    // Dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Counter
    if (counter) counter.textContent = `${current + 1} / ${TOTAL}`;

    // Label
    if (labelEl) labelEl.textContent = LABELS[current] || '';

    // Buttons
    if (btnPrev) btnPrev.disabled = current === 0;
    if (btnNext) btnNext.disabled = current === TOTAL - 1;
  }

  // Button handlers
  if (btnPrev) btnPrev.addEventListener('click', () => goTo(current - 1));
  if (btnNext) btnNext.addEventListener('click', () => goTo(current + 1));

  // Dot navigation
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));

  // Keyboard navigation
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      goTo(current + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goTo(current - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      goTo(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      goTo(TOTAL - 1);
    } else if (e.key === 'Escape') {
      exitFullscreen();
    }
  });

  // Fullscreen
  const btnFs = document.getElementById('def-btn-fs');

  function enterFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
    if (btnFs) btnFs.textContent = '⤡ Выйти';
  }

  function exitFullscreen() {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    }
    if (btnFs) btnFs.textContent = '⛶ На весь экран';
  }

  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement && btnFs) {
      btnFs.textContent = '⛶ На весь экран';
    }
  });

  if (btnFs) {
    btnFs.addEventListener('click', () => {
      if (document.fullscreenElement) exitFullscreen();
      else enterFullscreen();
    });
  }

  // Swipe / touch support
  let touchStartX = 0;
  document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) goTo(current + 1);
      else goTo(current - 1);
    }
  }, { passive: true });

  // Init on first slide
  goTo(0);
})();
