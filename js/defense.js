// defense.js — Навигация презентации «Защита педагогической идеи»
// Без таймера. Без автопереключения. Только ручное управление.

(function () {
  const TOTAL = 7;
  let current = 0;

  const track    = document.getElementById('defTrack');
  const dots     = document.querySelectorAll('.def-dot');
  const stepLbl  = document.getElementById('stepLabel');
  const bottomLbl= document.getElementById('bottomLabel');
  const btnPrev  = document.getElementById('btnPrev');
  const btnNext  = document.getElementById('btnNext');

  const STEP_LABELS = [
    'Экран 1 из 7',
    'Экран 2 из 7',
    'Экран 3 из 7',
    'Экран 4 из 7',
    'Экран 5 из 7',
    'Экран 6 из 7',
    'Экран 7 из 7'
  ];

  const BOTTOM_LABELS = [
    'Экран 1 — Вступление',
    'Экран 2 — Актуальность',
    'Экран 3 — Модель ЧТД',
    'Экран 4 — Платформа',
    'Экран 5 — Работы детей',
    'Экран 6 — Результаты',
    'Экран 7 — Заключение'
  ];

  function goTo(n) {
    if (n < 0 || n >= TOTAL) return;
    current = n;

    // Move track
    if (track) track.style.transform = `translateX(${-100 * current}%)`;

    // Dots
    dots.forEach((d, i) => d.classList.toggle('active', i === current));

    // Labels
    if (stepLbl)   stepLbl.textContent   = STEP_LABELS[current]  || '';
    if (bottomLbl) bottomLbl.textContent = BOTTOM_LABELS[current] || '';

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
    }
  });

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

  // Init
  goTo(0);
})();
