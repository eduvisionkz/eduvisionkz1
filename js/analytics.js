// analytics.js — трекинг посещений и чтения
// Подключается на всех страницах ПОСЛЕ nav.js

(function() {
  // Генерируем анонимный ID сессии если нет
  let sessionId = sessionStorage.getItem('sid');
  if (!sessionId) {
    sessionId = 'u_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    sessionStorage.setItem('sid', sessionId);
  }
  window._sessionId = sessionId;

  // Определяем текущую страницу
  const page = location.pathname.split('/').pop().replace('.html','') || 'index';

  // Логируем событие в Firestore
  async function logEvent(type, extra = {}) {
    try {
      const { db } = await import('./firebase-config.js');
      const { collection, addDoc, serverTimestamp }
        = await import('https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js');

      await addDoc(collection(db, 'analytics'), {
        type,           // 'pageview' | 'story_open' | 'story_submit'
        page,
        sessionId,
        lang: window.currentLang || localStorage.getItem('lang') || 'kz',
        ts: serverTimestamp(),
        ...extra
      });
    } catch(e) {
      // Тихо игнорируем — аналитика не должна ломать сайт
    }
  }

  // 1. Трекаем посещение страницы
  logEvent('pageview');

  // 2. Если страница story.html — трекаем открытие сказки
  if (page === 'story') {
    const storyId = new URLSearchParams(location.search).get('id') || '';
    // Ждём загрузки данных чтобы получить название
    setTimeout(() => {
      const story = (window.STORIES || []).find(s => s.id === storyId);
      logEvent('story_open', {
        storyId,
        storyTitleRu: story?.title?.ru || storyId,
        storyTitleKz: story?.title?.kz || storyId,
        category:     story?.category  || ''
      });
    }, 800);
  }

  // Экспортируем для использования в story.js
  window._logEvent = logEvent;
})();
