// comments.js — универсальный виджет комментариев
// Использование: <div id="comments-widget" data-page="index"></div>
// Затем подключить этот файл как type="module"

import { db } from './firebase-config.js';
import { collection, addDoc, query, orderBy, limit,
         getDocs, serverTimestamp, where }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const UI = {
  kz:{
    title:'Пікірлер',
    namePH:'Сіздің атыңыз (оқушы, ата-ана, мұғалім...)',
    rolePH:'Рөліңіз',
    roles:['Оқушы','Ата-ана','Мұғалім','Қонақ'],
    textPH:'Пікіріңізді жазыңыз...',
    send:'Жіберу',
    sending:'Жіберілуде...',
    success:'✓ Пікіріңіз жіберілді!',
    errName:'Атыңызды жазыңыз',
    errText:'Пікір жазыңыз',
    noComments:'Пікір жоқ. Бірінші болыңыз!',
    loadMore:'Тағы жүктеу',
    ago:{ s:'сек', m:'мин', h:'сағ', d:'күн бұрын' }
  },
  ru:{
    title:'Комментарии',
    namePH:'Ваше имя (ученик, родитель, учитель...)',
    rolePH:'Ваша роль',
    roles:['Ученик','Родитель','Учитель','Гость'],
    textPH:'Напишите ваш комментарий...',
    send:'Отправить',
    sending:'Отправка...',
    success:'✓ Комментарий отправлен!',
    errName:'Введите ваше имя',
    errText:'Напишите комментарий',
    noComments:'Комментариев пока нет. Будьте первым!',
    loadMore:'Загрузить ещё',
    ago:{ s:'сек', m:'мин', h:'ч', d:'дн. назад' }
  }
};

const ROLE_COLORS = {
  'Оқушы':'#dbeafe','Ученик':'#dbeafe',
  'Ата-ана':'#dcfce7','Родитель':'#dcfce7',
  'Мұғалім':'#fef3c7','Учитель':'#fef3c7',
  'Қонақ':'#f1f5f9','Гость':'#f1f5f9'
};
const ROLE_TEXT = {
  'Оқушы':'#1d4ed8','Ученик':'#1d4ed8',
  'Ата-ана':'#065f46','Родитель':'#065f46',
  'Мұғалім':'#92400e','Учитель':'#92400e',
  'Қонақ':'#475569','Гость':'#475569'
};

function timeAgo(date, lang) {
  if (!date) return '';
  const L = UI[lang]||UI.kz;
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)   return `${diff} ${L.ago.s}`;
  if (diff < 3600) return `${Math.floor(diff/60)} ${L.ago.m}`;
  if (diff < 86400)return `${Math.floor(diff/3600)} ${L.ago.h}`;
  return `${Math.floor(diff/86400)} ${L.ago.d}`;
}

function getPageId() {
  const w = document.getElementById('comments-widget');
  return w?.dataset?.page || location.pathname.split('/').pop().replace('.html','') || 'index';
}

function renderWidget() {
  const lang = window.currentLang || 'kz';
  const L = UI[lang] || UI.kz;
  const pageId = getPageId();

  const w = document.getElementById('comments-widget');
  if (!w) return;

  w.innerHTML = `
    <div style="border-top:1px solid var(--border);margin-top:40px;padding-top:32px;">
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:20px;" id="cmt-title">${L.title}</h2>

      <!-- Form -->
      <div style="background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:22px;margin-bottom:24px;box-shadow:var(--shadow-sm);">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
          <input id="cmt-name" class="form-input" type="text" placeholder="${L.namePH}" maxlength="60">
          <select id="cmt-role" class="form-input">
            ${L.roles.map(r=>`<option>${r}</option>`).join('')}
          </select>
        </div>
        <textarea id="cmt-text" class="form-textarea" rows="3"
          placeholder="${L.textPH}" maxlength="1000" style="margin-bottom:12px;"></textarea>
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
          <span style="font-size:12px;color:var(--text-muted);">Макс. 1000 символ</span>
          <button id="cmt-send" class="btn btn-primary btn-sm" onclick="window._sendComment('${pageId}')">${L.send}</button>
        </div>
        <p id="cmt-status" style="margin-top:8px;font-size:13px;font-weight:600;min-height:18px;"></p>
      </div>

      <!-- Comments list -->
      <div id="cmt-list"></div>
      <div style="text-align:center;margin-top:16px;">
        <button id="cmt-more" class="btn btn-outline btn-sm" onclick="window._loadMore('${pageId}')" style="display:none;">${L.loadMore}</button>
      </div>
    </div>`;

  loadComments(pageId, false);
}

let lastDoc = null;
const PAGE_SIZE = 10;

async function loadComments(pageId, append = false) {
  const lang = window.currentLang || 'kz';
  const L = UI[lang] || UI.kz;
  const listEl = document.getElementById('cmt-list');
  const moreBtn = document.getElementById('cmt-more');
  if (!listEl) return;

  if (!append) {
    lastDoc = null;
    listEl.innerHTML = '<p style="color:var(--text-muted);font-size:13px;padding:12px 0;">Жүктелуде...</p>';
  }

  try {
    let q = query(
      collection(db,'comments'),
      where('pageId','==',pageId),
      orderBy('createdAt','desc'),
      limit(PAGE_SIZE)
    );

    const snap = await getDocs(q);

    if (!append) listEl.innerHTML = '';

    if (snap.empty && !append) {
      listEl.innerHTML = `<p style="color:var(--text-muted);font-size:14px;text-align:center;padding:24px 0;">${L.noComments}</p>`;
      if (moreBtn) moreBtn.style.display = 'none';
      return;
    }

    lastDoc = snap.docs[snap.docs.length - 1];

    snap.forEach(docSnap => {
      const c = docSnap.data();
      const date = c.createdAt?.toDate?.();
      const ago  = timeAgo(date, lang);
      const bgColor  = ROLE_COLORS[c.role] || '#f1f5f9';
      const txtColor = ROLE_TEXT[c.role]   || '#475569';

      const card = document.createElement('div');
      card.style.cssText = 'background:var(--surface);border:1px solid var(--border);border-radius:var(--radius-lg);padding:18px 20px;margin-bottom:12px;box-shadow:var(--shadow-sm);';
      card.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--brand-light);display:grid;place-items:center;font-weight:700;font-size:15px;color:var(--brand);flex-shrink:0;">
            ${(c.name||'?')[0].toUpperCase()}
          </div>
          <div>
            <div style="font-weight:700;font-size:14px;">${c.name||'—'}</div>
            <div style="display:flex;align-items:center;gap:8px;">
              ${c.role ? `<span style="font-size:11px;font-weight:700;background:${bgColor};color:${txtColor};padding:2px 9px;border-radius:999px;">${c.role}</span>` : ''}
              <span style="font-size:11px;color:var(--text-muted);">${ago}</span>
            </div>
          </div>
        </div>
        <p style="font-size:14px;line-height:1.65;color:var(--text-secondary);white-space:pre-wrap;">${c.text||''}</p>`;

      listEl.appendChild(card);
    });

    if (moreBtn) moreBtn.style.display = snap.size === PAGE_SIZE ? '' : 'none';

  } catch(e) {
    if (!append) listEl.innerHTML = `<p style="color:var(--danger);font-size:13px;">Қате: ${e.message}</p>`;
    console.error(e);
  }
}

// Send comment
window._sendComment = async (pageId) => {
  const lang   = window.currentLang || 'kz';
  const L      = UI[lang] || UI.kz;
  const name   = document.getElementById('cmt-name')?.value.trim();
  const role   = document.getElementById('cmt-role')?.value;
  const text   = document.getElementById('cmt-text')?.value.trim();
  const btn    = document.getElementById('cmt-send');
  const status = document.getElementById('cmt-status');

  if (status) { status.textContent=''; status.style.color=''; }
  if (!name) { if(status){status.style.color='var(--danger)';status.textContent=L.errName;} return; }
  if (!text) { if(status){status.style.color='var(--danger)';status.textContent=L.errText;} return; }

  if (btn) { btn.disabled=true; btn.textContent=L.sending; }

  try {
    await addDoc(collection(db,'comments'), {
      pageId, name, role, text,
      lang, createdAt: serverTimestamp()
    });

    if (status) { status.style.color='var(--success)'; status.textContent=L.success; }
    if (document.getElementById('cmt-name')) document.getElementById('cmt-name').value='';
    if (document.getElementById('cmt-text')) document.getElementById('cmt-text').value='';

    await loadComments(pageId, false);
    setTimeout(()=>{ if(status) status.textContent=''; }, 4000);

  } catch(e) {
    if (status) { status.style.color='var(--danger)'; status.textContent='Қате: '+e.message; }
  }
  if (btn) { btn.disabled=false; btn.textContent=L.send; }
};

// Load more
window._loadMore = async (pageId) => {
  await loadComments(pageId, true);
};

// Init + lang change
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('comments-widget')) renderWidget();
});

// Re-render on language change
const origLangChange = window.onLangChange;
window.onLangChange = (lang) => {
  if (origLangChange) origLangChange(lang);
  if (document.getElementById('comments-widget')) renderWidget();
};
