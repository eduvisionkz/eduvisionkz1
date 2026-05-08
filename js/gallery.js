// gallery.js — показывает статические медиа + одобренные работы из Firestore (base64)
let currentCat = 'all';

const CAT_LABELS = {
  kz: { all:'Барлығы', reading:'Оқу', creative:'Шығармашылық', technology:'Технология', results:'Нәтиже' },
  ru: { all:'Все',     reading:'Чтение', creative:'Творчество',  technology:'Технологии',  results:'Результаты' }
};
const UI_TEXT = {
  kz: { title:'Галерея', desc:'Оқушылардың жұмыстары, видео және фото материалдар', empty:'Бұл бөлімде материал жоқ.', noMedia:'Медиа файлдары жүктелмеді.' },
  ru: { title:'Галерея', desc:'Работы учеников, видео и фото материалы',           empty:'В этом разделе нет материалов.', noMedia:'Медиафайлы не загружены.' }
};

// Все медиа: статические + из Firestore
let allMedia = [];

function renderGallery() {
  const lang = window.currentLang || 'kz';
  const L    = UI_TEXT[lang] || UI_TEXT.kz;
  const CL   = CAT_LABELS[lang] || CAT_LABELS.kz;
  const el   = document.getElementById('gallery');
  if (!el) return;

  el.innerHTML = '';

  const items = currentCat === 'all'
    ? allMedia
    : allMedia.filter(m => m.category === currentCat);

  if (!items.length) {
    el.innerHTML = `<div class="empty-state"><p>${allMedia.length ? L.empty : L.noMedia}</p></div>`;
    return;
  }

  items.forEach(item => {
    const card  = document.createElement('div');
    card.className = 'media-card';
    const label = CL[item.category] || item.category || '';
    const src   = item.src;

    if (item.type === 'image') {
      card.innerHTML = `
        <img src="${src}" alt="${label}" loading="lazy"
             onerror="this.closest('.media-card').style.display='none'"
             onclick="openModal('${src}','image')">
        <div class="media-info"><span class="media-cat">${label}</span></div>`;
    } else {
      card.innerHTML = `
        <video controls preload="metadata"
               onerror="this.closest('.media-card').style.display='none'">
          <source src="${src}" type="video/mp4">
        </video>
        <div class="media-info"><span class="media-cat">${label}</span></div>`;
    }
    el.appendChild(card);
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

// Грузит одобренные работы из Firestore (base64)
async function loadFirestoreMedia() {
  try {
    const { db } = await import('./firebase-config.js');
    const { collection, query, where, getDocs, orderBy }
      = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

    // Одобренные submissions
    const subQ  = query(collection(db,'submissions'), where('approved','==',true));
    const subSnap = await getDocs(subQ);
    subSnap.forEach(d => {
      const data = d.data();
      if (data.fileData) {
        allMedia.push({
          type:     data.fileType?.startsWith('video') ? 'video' : 'image',
          category: data.category || 'results',
          src:      data.fileData   // base64 data URL
        });
      }
    });

    // Медиа загруженные учителем
    const galSnap = await getDocs(collection(db,'gallery'));
    galSnap.forEach(d => {
      const data = d.data();
      if (data.src) {
        allMedia.push({
          type:     data.type || 'image',
          category: data.category || 'results',
          src:      data.src
        });
      }
    });

    renderGallery();
  } catch(e) {
    console.warn('Firestore недоступен, показываем статику:', e.message);
    renderGallery();
  }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Статические медиа из media-data.js
  if (typeof window.MEDIA !== 'undefined' && window.MEDIA.length) {
    allMedia = [...window.MEDIA];
  }

  document.getElementById('galleryFilters')?.addEventListener('click', e => {
    const btn = e.target.closest('[data-cat]');
    if (!btn) return;
    currentCat = btn.dataset.cat;
    updateFilterButtons();
    renderGallery();
  });

  updatePageText();
  updateFilterButtons();
  renderGallery();          // сначала показываем статику
  loadFirestoreMedia();     // потом добавляем из Firebase
});

window.openModal = (src, type) => {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.querySelectorAll('img,video').forEach(el => el.remove());
  if (type === 'image') {
    const img = document.createElement('img');
    img.src = src;
    modal.appendChild(img);
  } else {
    const vid = document.createElement('video');
    vid.src = src; vid.controls = true; vid.autoplay = true;
    modal.appendChild(vid);
  }
  modal.classList.add('active');
};

window.closeModal = () => {
  const modal = document.getElementById('modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.querySelectorAll('img,video').forEach(el => el.remove());
};

window.onLangChange = () => {
  updatePageText();
  updateFilterButtons();
  renderGallery();
};
