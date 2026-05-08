// gallery.js — исправленная версия
// Проблема была: media-data.js объявляет `const MEDIA` (не window.MEDIA)
// Решение: gallery.js обращается к MEDIA напрямую (в одном скоупе браузера это работает)

let currentCat = 'all';

const CAT_LABELS = {
  kz: { all:'Барлығы', reading:'Оқу', creative:'Шығармашылық', technology:'Технология', results:'Нәтиже' },
  ru: { all:'Все',     reading:'Чтение', creative:'Творчество',  technology:'Технологии',  results:'Результаты' }
};

const UI_TEXT = {
  kz: { title:'Галерея', desc:'Оқушылардың жұмыстары, видео және фото материалдар', empty:'Бұл бөлімде материал жоқ.', noMedia:'Медиа файлдары жүктелмеді.' },
  ru: { title:'Галерея', desc:'Работы учеников, видео и фото материалы',           empty:'В этом разделе нет материалов.', noMedia:'Медиафайлы не загружены.' }
};

function renderGallery() {
  const lang = window.currentLang || 'kz';
  const galleryEl = document.getElementById('gallery');
  if (!galleryEl) return;

  galleryEl.innerHTML = '';

  // MEDIA может быть как window.MEDIA так и просто MEDIA (const в том же скоупе)
  const mediaSource = (typeof MEDIA !== 'undefined' && MEDIA)
    || (typeof window.MEDIA !== 'undefined' && window.MEDIA)
    || [];

  const L = UI_TEXT[lang] || UI_TEXT.kz;
  const CL = CAT_LABELS[lang] || CAT_LABELS.kz;

  if (!mediaSource.length) {
    galleryEl.innerHTML = `<div class="empty-state"><p>${L.noMedia}</p></div>`;
    return;
  }

  // Combine static MEDIA + approved Firestore submissions
  const items = currentCat === 'all'
    ? mediaSource
    : mediaSource.filter(m => m.category === currentCat);

  if (!items.length) {
    galleryEl.innerHTML = `<div class="empty-state"><p>${L.empty}</p></div>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'media-card';
    const label = CL[item.category] || item.category || '';

    if (item.type === 'image') {
      card.innerHTML = `
        <img src="${item.src}" alt="${label}" loading="lazy"
             onerror="this.closest('.media-card').style.display='none'"
             onclick="openModal('${item.src}','image')">
        <div class="media-info"><span class="media-cat">${label}</span></div>`;
    } else {
      card.innerHTML = `
        <video controls preload="metadata"
               onerror="this.closest('.media-card').style.display='none'">
          <source src="${item.src}" type="video/mp4">
        </video>
        <div class="media-info"><span class="media-cat">${label}</span></div>`;
    }
    galleryEl.appendChild(card);
  });
}

function updateFilterButtons() {
  const lang = window.currentLang || 'kz';
  const CL = CAT_LABELS[lang] || CAT_LABELS.kz;
  document.querySelectorAll('[data-cat]').forEach(btn => {
    const key = btn.dataset.cat;
    if (CL[key]) btn.textContent = CL[key];
    btn.classList.toggle('active', key === currentCat);
  });
}

function updatePageText() {
  const lang = window.currentLang || 'kz';
  const L = UI_TEXT[lang] || UI_TEXT.kz;
  const t = document.getElementById('galleryTitle');
  const d = document.getElementById('galleryDesc');
  if (t) t.textContent = L.title;
  if (d) d.textContent = L.desc;
}

// Load approved submissions from Firestore and merge with static MEDIA
async function loadApprovedSubmissions() {
  try {
    const { db } = await import('./firebase-config.js');
    const { collection, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');
    const q = query(collection(db, 'submissions'), where('approved', '==', true));
    const snap = await getDocs(q);
    snap.forEach(doc => {
      const d = doc.data();
      if (d.fileUrl && d.fileType) {
        const isVideo = d.fileType.startsWith('video');
        const existing = typeof MEDIA !== 'undefined' ? MEDIA : [];
        existing.push({ type: isVideo ? 'video' : 'image', category: d.category || 'results', src: d.fileUrl });
      }
    });
    renderGallery();
  } catch (e) {
    // Firebase not available — just show static media
    renderGallery();
  }
}

// Filter clicks
document.addEventListener('DOMContentLoaded', () => {
  const filtersEl = document.getElementById('galleryFilters');
  if (filtersEl) {
    filtersEl.addEventListener('click', e => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      currentCat = btn.dataset.cat;
      updateFilterButtons();
      renderGallery();
    });
  }

  updatePageText();
  updateFilterButtons();
  renderGallery();
  loadApprovedSubmissions();
});

function openModal(src, type) {
  let modal = document.getElementById('modal');
  if (!modal) return;
  modal.querySelectorAll('img,video').forEach(el => el.remove());
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src; img.alt = 'Фото';
    modal.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = src; vid.controls = true; vid.autoplay = true;
    modal.appendChild(vid);
  }
  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.querySelectorAll('img,video').forEach(el => el.remove());
}

window.openModal = openModal;
window.closeModal = closeModal;

window.onLangChange = function(lang) {
  updatePageText();
  updateFilterButtons();
  renderGallery();
};
