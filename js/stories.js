// stories.js
let currentCategory = 'all';

const UI = {
  kz: {
    pageTitle:'Мәтіндер жинағы', pageDesc:'Ертегі, притча және өсиеттер — оқушыға арналған',
    catAll:'Барлығы', catStory:'Ертегі / Әңгіме', catParable:'Притча', catWisdom:'Өсиет',
    author:'Автор', grade:'Сынып', read:'Оқу →',
    notFound:'Мәтін табылмады.', searchP:'Іздеу...',
    footer:'«Кітаптан мультфильмге дейін: Отбасылық стартап» © 2025'
  },
  ru: {
    pageTitle:'Сборник текстов', pageDesc:'Сказки, притчи и назидания — для учеников',
    catAll:'Все', catStory:'Сказки / Рассказы', catParable:'Притчи', catWisdom:'Назидания',
    author:'Автор', grade:'Класс', read:'Читать →',
    notFound:'Тексты не найдены.', searchP:'Поиск...',
    footer:'«От книги до мультфильма: Семейный стартап» © 2025'
  }
};

const CAT_KEYS = { all:'catAll', story:'catStory', parable:'catParable', wisdom:'catWisdom' };
const BADGE_CLASS = { story:'', parable:'badge-parable', wisdom:'badge-wisdom' };

function unique(arr) {
  const seen = new Set();
  return arr.filter(i => seen.has(i.id) ? false : seen.add(i.id));
}

function applyFilters() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang] || UI.kz;
  const q = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  let data = unique(window.STORIES || []);

  if (currentCategory !== 'all') data = data.filter(i => i.category === currentCategory);
  if (q) data = data.filter(i => {
    const t = (i.title?.[lang] || i.title?.ru || '').toLowerCase();
    const th = (i.theme?.[lang] || i.theme?.ru || '').toLowerCase();
    return t.includes(q) || th.includes(q);
  });

  const grid = document.getElementById('storiesGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!data.length) {
    grid.innerHTML = `<div class="empty-state"><p>${L.notFound}</p></div>`;
    return;
  }

  data.forEach(item => {
    const title  = item.title?.[lang]  || item.title?.ru  || '';
    const type   = item.type?.[lang]   || item.type?.ru   || '';
    const theme  = item.theme?.[lang]  || item.theme?.ru  || '';
    const bclass = BADGE_CLASS[item.category] || '';

    const card = document.createElement('article');
    card.className = 'story-card';
    card.innerHTML = `
      <span class="story-badge ${bclass}">${type}</span>
      <h3>${title}</h3>
      <div class="meta">
        <span>${L.author}: <strong>${item.author||''}</strong></span>
        <span>${L.grade}: <strong>${item.grade||''}</strong></span>
      </div>
      <p class="theme">${theme}</p>
      <a class="btn btn-ghost btn-sm" href="story.html?id=${encodeURIComponent(item.id)}">${L.read}</a>`;
    grid.appendChild(card);
  });
}

function updateStaticText() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang] || UI.kz;
  const set = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set('pageTitle', L.pageTitle);
  set('pageDesc',  L.pageDesc);
  set('footerText', L.footer);

  const si = document.getElementById('searchInput');
  if (si) si.placeholder = L.searchP;

  document.querySelectorAll('[data-category]').forEach(btn => {
    const key = CAT_KEYS[btn.dataset.category];
    if (key && L[key]) btn.textContent = L[key];
    btn.classList.toggle('active', btn.dataset.category === currentCategory);
  });
}

// Category filter clicks
document.getElementById('catFilters')?.addEventListener('click', e => {
  const btn = e.target.closest('[data-category]');
  if (!btn) return;
  currentCategory = btn.dataset.category;
  updateStaticText();
  applyFilters();
});

// Search
document.getElementById('searchInput')?.addEventListener('input', applyFilters);

// Language hook
window.onLangChange = function(lang) {
  updateStaticText();
  applyFilters();
};

// Init
updateStaticText();
applyFilters();
