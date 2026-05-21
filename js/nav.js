// nav.js — единая навигация для всех страниц
// Новое название: «Кітаптан мультфильмге дейін»

(function () {
  const NAV_LABELS = {
    kz: { home:'Басты бет', stories:'Мәтіндер', instructions:'Нұсқаулық', gallery:'Галерея', materials:'Материалдар', stats:'Статистика', teacher:'Мұғалім' },
    ru: { home:'Главная',   stories:'Тексты',    instructions:'Инструкция', gallery:'Галерея', materials:'Материалы',   stats:'Статистика', teacher:'Учитель' }
  };

  function buildNav() {
    const lang = window.currentLang || localStorage.getItem('lang') || 'kz';
    const L = NAV_LABELS[lang];
    return `
    <nav class="nav">
      <a class="nav-brand" href="index.html">
        <div class="nav-brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span class="nav-brand-name">Кітаптан мультфильмге дейін</span>
      </a>
      <div class="nav-links">
        <a href="index.html"        data-nav="index">${L.home}</a>
        <a href="stories.html"      data-nav="stories">${L.stories}</a>
        <a href="instructions.html" data-nav="instructions">${L.instructions}</a>
        <a href="gallery.html"      data-nav="gallery">${L.gallery}</a>
        <a href="materials.html"    data-nav="materials">${L.materials}</a>
        <a href="stats.html"        data-nav="stats">${L.stats}</a>
        <a href="teacher.html"      data-nav="teacher">${L.teacher}</a>
      </div>
      <div class="nav-right">
        <div class="lang-toggle">
          <button class="lang-btn${lang==='kz'?' active':''}" data-lang="kz">ҚАЗ</button>
          <button class="lang-btn${lang==='ru'?' active':''}" data-lang="ru">РУС</button>
        </div>
      </div>
    </nav>`;
  }

  function injectNav() {
    const ph = document.getElementById('nav-placeholder');
    if (ph) ph.outerHTML = buildNav();
    else document.body.insertAdjacentHTML('afterbegin', buildNav());

    // Mark active link
    const page = location.pathname.split('/').pop().replace('.html','') || 'index';
    document.querySelectorAll('[data-nav]').forEach(a => {
      a.classList.toggle('active', a.dataset.nav === page);
    });
  }

  function applyLang(lang) {
    window.currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update button states
    document.querySelectorAll('.lang-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang));

    // Update nav link texts
    const L = NAV_LABELS[lang];
    const map = { index:'home', stories:'stories', instructions:'instructions', gallery:'gallery', materials:'materials', stats:'stats', teacher:'teacher' };
    document.querySelectorAll('[data-nav]').forEach(a => {
      const key = map[a.dataset.nav];
      if (key) a.textContent = L[key];
    });

    // Call page-level handler
    if (typeof window.onLangChange === 'function') window.onLangChange(lang);
  }

  // Init
  window.currentLang = localStorage.getItem('lang') || 'kz';
  injectNav();

  // Lang button clicks (delegated)
  document.addEventListener('click', e => {
    const btn = e.target.closest('.lang-btn');
    if (btn && btn.dataset.lang) applyLang(btn.dataset.lang);
  });

  // After page scripts load — fire initial lang
  // Use setTimeout(0) so inline scripts on the page run first
  setTimeout(() => {
    if (typeof window.onLangChange === 'function') {
      window.onLangChange(window.currentLang);
    }
  }, 0);
})();
