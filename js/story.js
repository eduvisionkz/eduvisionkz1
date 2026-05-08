// story.js — type="module" для Firebase v10
import { db, storage } from './firebase-config.js';
import { collection, addDoc, serverTimestamp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { ref, uploadBytesResumable, getDownloadURL }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js';

const params  = new URLSearchParams(location.search);
const storyId = params.get('id');

const UI = {
  kz: {
    back:'Артқа', author:'Автор', grade:'Сынып',
    tasks:'Тапсырмалар', formTitle:'Жауап жіберу',
    nameLabel:'Аты-жөні', nameP:'Аты-жөніңізді жазыңыз',
    classLabel:'Сынып', classP:'3А',
    answerLabel:'Жауап', answerP:'Тапсырмаға жауабыңызды жазыңыз...',
    fileLabel:'Файл (фото / видео)',
    submitBtn:'Жіберу', sending:'Жіберілуде...',
    success:'✓ Жұмыс сәтті жіберілді!',
    errName:'Аты-жөніңізді жазыңыз',
    errAnswer:'Жауап немесе файл қосыңыз',
    notFound:'Мәтін табылмады.',
    footer:'«Кітаптан мультфильмге дейін: Отбасылық стартап» © 2025'
  },
  ru: {
    back:'Назад', author:'Автор', grade:'Класс',
    tasks:'Задания', formTitle:'Отправить ответ',
    nameLabel:'Имя и фамилия', nameP:'Введите ваше имя',
    classLabel:'Класс', classP:'3А',
    answerLabel:'Ответ', answerP:'Напишите ответ на задание...',
    fileLabel:'Файл (фото / видео)',
    submitBtn:'Отправить', sending:'Отправка...',
    success:'✓ Работа успешно отправлена!',
    errName:'Введите ваше имя',
    errAnswer:'Добавьте ответ или файл',
    notFound:'Текст не найден.',
    footer:'«От книги до мультфильма: Семейный стартап» © 2025'
  }
};

function unique(arr) {
  const seen = new Set();
  return arr.filter(i => seen.has(i.id) ? false : seen.add(i.id));
}

function renderStory(lang) {
  const L = UI[lang] || UI.kz;
  const story = unique(window.STORIES || []).find(s => s.id === storyId);

  // Update labels
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setPH = (id, val) => { const el = document.getElementById(id); if (el) el.placeholder = val; };
  set('backLabel', L.back);
  set('tasksTitle', L.tasks);
  set('formTitle', L.formTitle);
  set('nameLabel', L.nameLabel);
  set('classLabel', L.classLabel);
  set('answerLabel', L.answerLabel);
  set('fileLabel', L.fileLabel);
  set('submitBtnText', L.submitBtn);
  set('footerText', L.footer);
  setPH('studentName', L.nameP);
  setPH('studentClass', L.classP);
  setPH('studentAnswer', L.answerP);

  if (!story) {
    set('storyTitle', L.notFound);
    return;
  }

  document.title = (story.title?.[lang] || story.title?.ru || '') + ' | Кітаптан мультфильмге дейін';
  document.documentElement.lang = lang === 'kz' ? 'kk' : 'ru';

  // Meta chips
  const meta = document.getElementById('storyMeta');
  if (meta) {
    meta.innerHTML = [
      story.type?.[lang] || story.type?.ru ? `<span class="story-chip">${story.type?.[lang] || story.type?.ru}</span>` : '',
      story.author ? `<span class="story-chip">${L.author}: ${story.author}</span>` : '',
      story.grade  ? `<span class="story-chip">${L.grade}: ${story.grade}</span>` : ''
    ].join('');
  }

  set('storyTitle', story.title?.[lang] || story.title?.ru || '');

  // Text
  const raw = (story.text?.[lang] || story.text?.ru || '').trim();
  const textEl = document.getElementById('storyText');
  if (textEl) {
    textEl.innerHTML = raw.split(/\n+/).map(p => p.trim()).filter(Boolean).map(p => `<p>${p}</p>`).join('');
  }

  // Tasks
  const tasks = story.tasks?.[lang] || story.tasks?.ru || [];
  const list = document.getElementById('storyTasks');
  if (list) {
    list.innerHTML = '';
    tasks.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      list.appendChild(li);
    });
  }
}

window.onLangChange = renderStory;
renderStory(window.currentLang || 'kz');

// ===== SUBMIT =====
window.submitWork = async function() {
  const lang    = window.currentLang || 'kz';
  const L       = UI[lang] || UI.kz;
  const name    = document.getElementById('studentName').value.trim();
  const cls     = document.getElementById('studentClass').value.trim();
  const answer  = document.getElementById('studentAnswer').value.trim();
  const file    = document.getElementById('studentFile').files[0];
  const btnText = document.getElementById('submitBtnText');
  const btn     = document.getElementById('submitBtn');
  const status  = document.getElementById('submitStatus');

  status.className = 'submit-status';
  status.textContent = '';

  if (!name)           { alert(L.errName);   return; }
  if (!answer && !file){ alert(L.errAnswer); return; }

  btn.disabled = true;
  btnText.textContent = L.sending;

  const story = unique(window.STORIES || []).find(s => s.id === storyId);

  try {
    let fileUrl = '', fileName = '', fileType = '';

    if (file) {
      const safeName = cls || 'unknown';
      const safeUser = name.replace(/\s+/g,'_').replace(/[^\w_]/g,'');
      const path = `student-work/${safeName}/${safeUser}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      await new Promise((resolve, reject) => {
        task.on('state_changed',
          snap => { btnText.textContent = `${Math.round(snap.bytesTransferred/snap.totalBytes*100)}%`; },
          reject,
          async () => { fileUrl = await getDownloadURL(task.snapshot.ref); resolve(); }
        );
      });
      fileName = file.name;
      fileType = file.type;
    }

    await addDoc(collection(db, 'submissions'), {
      studentName:  name,
      studentClass: cls,
      storyId:      storyId || '',
      storyTitleRu: story?.title?.ru  || '',
      storyTitleKz: story?.title?.kz  || '',
      category:     story?.category   || '',
      answer,
      fileUrl,
      fileName,
      fileType,
      lang,
      approved:     false,
      createdAt:    serverTimestamp()
    });

    status.className = 'submit-status success';
    status.textContent = L.success;
    document.getElementById('studentName').value   = '';
    document.getElementById('studentClass').value  = '';
    document.getElementById('studentAnswer').value = '';
    document.getElementById('studentFile').value   = '';
    setTimeout(() => { status.className = 'submit-status'; }, 5000);
  } catch(e) {
    status.className = 'submit-status error';
    status.textContent = 'Қате: ' + e.message;
  }

  btn.disabled = false;
  btnText.textContent = L.submitBtn;
};
