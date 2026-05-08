// teacher.js — читает submissions с base64 файлами, без Storage
const UI = {
  kz: {
    title:'Мұғалім кабинеті', desc:'Оқушылардың жіберген жұмыстары',
    clear:'Тазалау', count: n => `${n} жұмыс`,
    empty:'Жұмыс жоқ. Оқушылар жауап жібергенде осы жерде көрінеді.',
    noName:'Аты жоқ', story:'Мәтін', size:'KB',
    pending:'Күтуде', approved:'Жарияланған',
    publish:'Галереяға жариялау', delete:'Жою',
    confirmDelete:'Жұмысты жою керек пе?',
    filterAll:'Барлығы', filterPending:'Күтуде', filterApproved:'Жарияланған',
    uploading:'Жүктелуде...', uploadBtn:'Галереяға жариялау',
    uploadDone:'✓ Галереяға жарияланды!', uploadErr:'Қате: '
  },
  ru: {
    title:'Кабинет учителя', desc:'Отправленные работы учеников',
    clear:'Очистить', count: n => `${n} работ`,
    empty:'Нет работ. Когда ученики отправят ответы — появятся здесь.',
    noName:'Без имени', story:'Текст', size:'KB',
    pending:'На рассмотрении', approved:'Опубликовано',
    publish:'Опубликовать в галерею', delete:'Удалить',
    confirmDelete:'Удалить эту работу?',
    filterAll:'Все', filterPending:'На рассмотрении', filterApproved:'Опубликовано',
    uploading:'Загрузка...', uploadBtn:'Опубликовать в галерею',
    uploadDone:'✓ Опубликовано в галерею!', uploadErr:'Ошибка: '
  }
};

window.onLangChange = updateUI;

function updateUI() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang];
  const set = (id, v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  set('t-title', L.title);
  set('clearBtn', L.clear);
  const sel = document.getElementById('filterApproved');
  if (sel) {
    sel.options[0].text = L.filterAll;
    sel.options[1].text = L.filterPending;
    sel.options[2].text = L.filterApproved;
  }
}

updateUI();
