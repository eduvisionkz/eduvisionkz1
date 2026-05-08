// teacher.js
const UI = {
  kz: { title:'Мұғалім кабинеті', desc:'Оқушылардың жіберген жұмыстары', clear:'Тазалау', count:(n)=>`${n} жұмыс`, empty:'Әлі жұмыс жоқ. Оқушылар жауап жібергенде осы жерде көрінеді.', noName:'Аты жоқ', story:'Мәтін' },
  ru: { title:'Кабинет учителя', desc:'Отправленные работы учеников', clear:'Очистить', count:(n)=>`${n} работ`, empty:'Пока нет работ. Когда ученики отправят ответы — они появятся здесь.', noName:'Без имени', story:'Текст' }
};

function updateUI() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang];
  document.getElementById('teacherTitle').textContent = L.title;
  document.getElementById('teacherDesc').textContent  = L.desc;
  document.getElementById('clearBtn').textContent     = L.clear;
  loadWorks(lang);
}

async function loadWorks(lang) {
  const L = UI[lang || 'kz'];
  let works = [];

  // Try Firestore first
  if (typeof firebase !== 'undefined' && firebase.firestore) {
    try {
      const snap = await firebase.firestore()
        .collection('submissions').orderBy('date','desc').limit(200).get();
      works = snap.docs.map(d => d.data());
    } catch(e) {
      works = JSON.parse(localStorage.getItem('works') || '[]');
    }
  } else {
    works = JSON.parse(localStorage.getItem('works') || '[]');
  }

  const countEl = document.getElementById('worksCount');
  countEl.textContent = L.count(works.length);

  const grid = document.getElementById('worksGrid');
  grid.innerHTML = '';

  if (!works.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><p>${L.empty}</p></div>`;
    return;
  }

  works.forEach(w => {
    const date = w.date
      ? new Date(w.date.seconds ? w.date.seconds*1000 : w.date).toLocaleDateString('ru-RU')
      : '—';

    const card = document.createElement('div');
    card.className = 'teacher-card';
    card.innerHTML = `
      <div class="teacher-card-header">
        <span class="teacher-card-name">${w.name || L.noName}</span>
        <span class="teacher-card-date">${date}</span>
      </div>
      ${w.storyTitle ? `<div class="teacher-card-story">${L.story}: ${w.storyTitle}</div>` : ''}
      ${w.answer    ? `<div class="teacher-card-answer">${w.answer}</div>` : ''}
      ${w.fileUrl   ? (w.fileUrl.match(/\.(mp4|webm|mov)$/i)
          ? `<video src="${w.fileUrl}" controls></video>`
          : `<img src="${w.fileUrl}" alt="Жұмыс" loading="lazy">`) : ''}
    `;
    grid.appendChild(card);
  });
}

function clearWorks() {
  if (!confirm('Барлық жұмысты жою керек пе?')) return;
  localStorage.removeItem('works');
  updateUI();
}

window.onLangChange = updateUI;
updateUI();
