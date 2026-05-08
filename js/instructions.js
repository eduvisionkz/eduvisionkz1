// instructions.js
const TOOLS = {
  image: [
    {
      name: "Canva Magic Media",
      link: "https://www.canva.com/help/using-magic-media/",
      badge: "Фото / иллюстрация",
      steps: [
        "Canva аш.",
        "Magic Media немесе Text to Image бөлімін таңда.",
        "Мәтін бойынша промпт жаз.",
        "Generate батырмасын бас.",
        "Дайын суретті жүктеп ал."
      ],
      promptKz: "Балаларға арналған ертегі бойынша түрлі-түсті, жылы, мультфильм стиліндегі иллюстрация жаса.",
      promptEn: "Create a colorful warm cartoon-style illustration based on a children's story scene."
    },
    {
      name: "Gemini",
      link: "https://gemini.google.com/",
      badge: "Идея / промпт",
      steps: [
        "Gemini аш.",
        "Әңгіме мәтінін немесе қысқаша мазмұнын енгіз.",
        "Суретке арналған идея сұра.",
        "Жауапты Canva немесе басқа генераторда қолдан."
      ],
      promptKz: "Осы мәтін бойынша 5 иллюстрация идеяларын ұсын. Әр идеяға қысқа сурет промптын жаз.",
      promptEn: "Create 5 illustration ideas based on this story. Write a short image prompt for each idea."
    },
    {
      name: "Microsoft Copilot",
      link: "https://copilot.microsoft.com/",
      badge: "Тегін сурет генерация",
      steps: [
        "Copilot аш.",
        "Create an image деп жаз.",
        "Ағылшынша промпт енгіз.",
        "Ұнаған суретті сақта."
      ],
      promptKz: "Кітап оқып отырған бала, жылы жарық, ертегі атмосферасы, балаларға арналған мультфильм стилі.",
      promptEn: "A child reading a book, warm light, fairy-tale atmosphere, children's cartoon style."
    },
    {
      name: "Шедеврум",
      link: "https://shedevrum.ai/",
      badge: "Телефон арқылы сурет",
      steps: [
        "Қосымшаны телефонға орнат.",
        "Промпт енгіз.",
        "Сурет генерация жаса.",
        "Нәтижені телефонға сақта."
      ],
      promptKz: "Ертегі кейіпкері кітап әлемінде, ашық түстер, балаларға арналған стиль.",
      promptEn: "A fairy-tale character inside a book world, bright colors, children's illustration style."
    }
  ],

  animate: [
    {
      name: "Grok Imagine",
      link: "https://grok.com/imagine",
      badge: "Фото → видео",
      steps: [
        "Grok Imagine аш.",
        "Дайын суретті жүкте.",
        "Қозғалысты нақты сипатта.",
        "Нәтижені видео ретінде сақта."
      ],
      promptKz: "Кейіпкер кітапқа қарап күлімсіресін, фондағы жарық жұмсақ қозғалсын, қозғалыс баяу және табиғи болсын.",
      promptEn: "Make the character look at the book and smile, with soft moving light in the background. Slow and natural motion."
    },
    {
      name: "Pika",
      link: "https://pika.art/",
      badge: "Image to video",
      steps: [
        "Pika сайтына кір.",
        "Image to Video таңда.",
        "Суретті жүкте.",
        "Қозғалыс промптын жаз.",
        "Видео жүктеп ал."
      ],
      promptKz: "Суреттегі кейіпкер жай қозғалып, ертегі әлемі тірілгендей әсер берсін.",
      promptEn: "Animate the character gently and make the fairy-tale world feel alive."
    },
    {
      name: "Runway",
      link: "https://runwayml.com/",
      badge: "AI video",
      steps: [
        "Runway аш.",
        "Image to Video немесе Text to Video таңда.",
        "Сурет немесе мәтін енгіз.",
        "Generate бас.",
        "Қысқа видео сақта."
      ],
      promptKz: "Балалар ертегісі бойынша кинематографиялық қысқа көрініс жаса.",
      promptEn: "Create a short cinematic scene based on a children's story."
    }
  ],

  video: [
    {
      name: "CapCut",
      link: "https://www.capcut.com/",
      badge: "Монтаж",
      steps: [
        "CapCut аш.",
        "New Project таңда.",
        "Сурет пен видеоларды қос.",
        "Музыка, мәтін, дауыс қос.",
        "Export басып, MP4 ретінде сақта."
      ],
      promptKz: "4–5 кадрдан тұратын қысқа мультфильм құрастыр: кіріспе, оқиға, шешім, қорытынды.",
      promptEn: "Create a short cartoon from 4–5 scenes: introduction, event, solution, conclusion."
    },
    {
      name: "Canva Video",
      link: "https://www.canva.com/",
      badge: "Слайд-видео",
      steps: [
        "Canva аш.",
        "Video немесе Presentation таңда.",
        "Әр слайдқа бір көрініс қой.",
        "Музыка және мәтін қос.",
        "MP4 ретінде жүктеп ал."
      ],
      promptKz: "Әр слайдты бір көрініс ретінде құрастыр.",
      promptEn: "Turn each slide into one story scene."
    }
  ],

  arvr: [
    {
      name: "MyWebAR",
      link: "https://mywebar.com/",
      badge: "AR жасау",
      steps: [
        "MyWebAR сайтына кір.",
        "Create project таңда.",
        "Image marker немесе QR experience таңда.",
        "Сурет, видео немесе 3D объект қос.",
        "Publish жасап, QR код ал."
      ],
      promptKz: "Әңгімедегі кейіпкерді AR арқылы көрсет.",
      promptEn: "Create an AR experience based on a story character."
    },
    {
      name: "ThingLink",
      link: "https://www.thinglink.com/",
      badge: "Виртуалды тур",
      steps: [
        "ThingLink аш.",
        "360 image немесе image project таңда.",
        "Белгі, мәтін, видео, сілтеме қос.",
        "Виртуалды музей ретінде жарияла."
      ],
      promptKz: "Әңгіме кейіпкерлеріне арналған виртуалды музей жаса.",
      promptEn: "Create a virtual museum for the story characters."
    },
    {
      name: "CoSpaces Edu",
      link: "https://cospaces.io/edu/",
      badge: "VR сахна",
      steps: [
        "CoSpaces Edu аш.",
        "Жаңа жоба жаса.",
        "Кейіпкерлер мен объектілерді қос.",
        "Оқиға сахнасын құрастыр.",
        "VR режимінде қара."
      ],
      promptKz: "Әңгіме бойынша виртуалды сахна жаса.",
      promptEn: "Create a virtual scene based on the story."
    }
  ],

  storybook: [
    {
      name: "Gemini Storybook",
      link: "https://gemini.google.com/",
      badge: "Мәтін → Storybook",
      steps: [
        "Gemini аш.",
        "Мәтінді енгіз.",
        "Оны 5–6 көрініске бөлуді сұра.",
        "Әр көрініске сурет идеясы мен диалог ал.",
        "Нәтижені Canva слайдтарына орналастыр."
      ],
      promptKz: "Осы әңгімені балаларға арналған storybook форматына бөл. Әр бетке тақырып, қысқа мәтін, диалог және сурет идеясы жаз.",
      promptEn: "Turn this story into a children's storybook. For each page, write a title, short text, dialogue, and image idea."
    },
    {
      name: "ChatGPT",
      link: "https://chat.openai.com/",
      badge: "Сценарий / диалог",
      steps: [
        "ChatGPT аш.",
        "Мәтінді енгіз.",
        "Диалог, сахна, мультфильм жоспарын сұра.",
        "Алынған мәтінді театр немесе видеоға қолдан."
      ],
      promptKz: "Осы мәтін бойынша бастауыш сынып оқушыларына арналған қысқа театр сценарийін жаса.",
      promptEn: "Create a short theater script for primary school students based on this story."
    }
  ]
};

function showGroup(group, btn) {
  document.querySelectorAll('#toolTabs .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const area = document.getElementById('toolsArea');
  area.innerHTML = '';

  TOOLS[group].forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    card.innerHTML = `
      <div class="tool-top">
        <span class="tool-badge">${tool.badge}</span>
        <a href="${tool.link}" target="_blank" rel="noopener">Ашу →</a>
      </div>
      <h3>${tool.name}</h3>
      <ol>${tool.steps.map(s => `<li>${s}</li>`).join('')}</ol>
      <div class="prompt-box">
        <strong>KZ промпт</strong>
        <p>${tool.promptKz}</p>
        <button onclick="copyText(\`${tool.promptKz}\`,this)">Көшіру</button>
      </div>
      <div class="prompt-box">
        <strong>EN prompt</strong>
        <p>${tool.promptEn}</p>
        <button onclick="copyText(\`${tool.promptEn}\`,this)">Copy</button>
      </div>
    `;
    area.appendChild(card);
  });
}

function copyText(text, btn) {
  navigator.clipboard.writeText(text).catch(() => {});
  const orig = btn.textContent;
  btn.textContent = '✓ Көшірілді';
  setTimeout(() => btn.textContent = orig, 1500);
}

// Init
showGroup('image', document.querySelector('#toolTabs .filter-btn'));
