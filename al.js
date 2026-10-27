/* Тестовое задание в Альфа-Банк: «Дизайн-процесс в Альфа-Бизнес».
   Вся страница: тексты (как в макете «альфа.fig», без правок — только типографика), картинки и живые блоки. */
(() => {
const ROOT = document.getElementById('al');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

// пропорции картинок (ширина к высоте) — чтобы место под картинку было до загрузки
const R = {"ai1":1.3813,"ai2":1.6156,"d-console":1.7778,"d-ind":1,"d-key":1,"d-knob":1,"d-mini":1,"e-1":1.7778,"e-2":1.7778,"e-3":1.7778,"p1-angles":0.884,"p1-mask":1.7712,"p1-render":1.7712,"p1-sand":1.768,"p1-wire":1.7778,"r-black":1.7712,"r-dunes":1.7778,"r-glass":1.7778,"r-mask":1.7712,"s-forms":1.7778,"s-gears":1.7778,"s-layers":1.7778,"s-layers2":1.7778,"s-mech":1.7778,"s-pult":1.7778,"s-ring":1.7778,"s-steps":1.7778,"s-trassa":1.7778,"s-windows":1.7778,"t-nba":0.8,"t-old":2.533,"t-pantone":1.9433,"t-update":0.8,"v1-cover":1.7778,"v1-schema":1.7778,"v1-sq":1,"v2-cover":1.7778,"v2-schema":1.7778,"v2-sq":1,"w-1":1.7712,"w-2":1.7712,"w-3":1.5648,"w-4":1.7778};

/* ---------- типограф (как на kupdasha.ru): тире, «ёлочки», неразрывные пробелы ---------- */
const SHORT = 'без|для|изо|над|под|про|при|что|как|или|его|уже|все|это|чем|где|кто|еще|ещё|так|нет|чтобы|если|когда|либо|хотя|ведь|пока|через|перед|после|между|около|среди|кроме|вроде';
function ty(input, tail = true) {
  const NB = ' ';
  let s = String(input);
  s = s.replace(/(^|[\s (\[—-])"/g, '$1«').replace(/"/g, '»');
  s = s.replace(/(\d)\s*[хx]\s*(\d)/g, '$1×$2');                       // 1920×1080
  s = s.replace(/[ \t]+[-–—][ \t]+/g, NB + '— ');                       // тире держится за слово слева
  const short = new RegExp(`(?<=^|[\\s\\u00a0(«„])([а-яёa-z]{1,2}|${SHORT})\\s`, 'gi');
  s = s.replace(short, '$1' + NB).replace(short, '$1' + NB);           // предлоги и союзы — к следующему слову
  s = s.replace(/\s(?=(же|ли|бы|б)(?=$|[\s.,!?:;)»]))/gi, NB);
  s = s.replace(/(\d)\s(?=[а-яёa-z%])/gi, '$1' + NB);
  s = s.replace(/(?<=(?:^|[\s «(])[A-Z][A-Za-z0-9&.]*)[ \t]+(?=[A-Z])/g, NB);   // названия не рвутся
  // последнее слово абзаца не остается на строке одно
  if (tail) s = s.split('\n').map(l => l.trim().split(/[ \t]+/).length < 4 ? l : l.replace(/[ \t]+(?=[^\s ]{1,12}\s*$)/, NB)).join('\n');
  return s;
}
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// текст → HTML: слова через дефис не рвутся, висячая кавычка в начале
const T = (s, tail) => esc(ty(s, tail)).replace(/\n/g, '<br>')
  .replace(/([A-Za-zА-Яа-яЁё0-9]+(?:-[A-Za-zА-Яа-яЁё0-9]+)+)/g, '<span class="nobr">$1</span>')
  .replace(/^«/, '<span class="hang">«</span>');
const P = (s, cls = 'al-p') => `<p class="${cls}">${T(s)}</p>`;

/* ---------- картинка: легкая копия для телефона, полная — для компьютера и крупного просмотра ---------- */
function pic(name, { alt = '', cls = '', eager = false, zoom = true, ratio } = {}) {
  const r = ratio || R[name] || 1.7778;
  return `<figure class="al-ph ${cls}${zoom ? ' zoom' : ''}" style="--r:${r}" data-full="img/${name}.webp">
    <img src="img/${name}-s.webp" srcset="img/${name}-s.webp 900w, img/${name}.webp 1920w" sizes="(max-width: 900px) 100vw, 60vw"
      alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></figure>`;
}
const head = (h, id, sub = '') => `<header class="al-head rv"${id ? ` id="${id}"` : ''}>${sub ? `<span class="al-eyebrow">${sub}</span>` : ''}<h2 class="al-h2">${T(h)}</h2></header>`;

/* ---------- значки программ для инфографики пайплайна (рисованные, одним цветом) ---------- */
const ICONS = {
  claude: '<svg viewBox="0 0 48 48"><g stroke="currentColor" stroke-width="4.2" stroke-linecap="round">' +
    Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6, l = i % 2 ? 15 : 20; return `<line x1="${24 + Math.cos(a) * 5}" y1="${24 + Math.sin(a) * 5}" x2="${(24 + Math.cos(a) * l).toFixed(1)}" y2="${(24 + Math.sin(a) * l).toFixed(1)}"/>`; }).join('') + '</g></svg>',
  blender: '<svg viewBox="0 0 48 48"><path d="M8 20 L22 10 M6 28 L24 15" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" fill="none"/><circle cx="28" cy="27" r="13" fill="currentColor"/><circle cx="28" cy="27" r="7" fill="#fff"/><circle cx="28" cy="27" r="3.4" fill="currentColor"/></svg>',
  higgsfield: '<svg viewBox="0 0 48 48"><path d="M8 34 C14 14, 20 14, 24 24 S34 34, 40 14" stroke="currentColor" stroke-width="4.2" stroke-linecap="round" fill="none"/><circle cx="40" cy="14" r="4" fill="currentColor"/><circle cx="8" cy="34" r="4" fill="currentColor"/></svg>',
  figma: '<svg viewBox="0 0 48 48" fill="currentColor"><path d="M17 4h7v12h-7a6 6 0 0 1 0-12z"/><path d="M24 4h7a6 6 0 0 1 0 12h-7z" opacity=".75"/><path d="M17 16h7v12h-7a6 6 0 0 1 0-12z" opacity=".55"/><circle cx="31" cy="22" r="6" opacity=".9"/><path d="M17 28h7v6a6 6 0 1 1-7-6z" opacity=".7"/></svg>',
};

/* ---------- логотип ADC и блоки схемы — геометрия из макета ---------- */
const LOGO = `<svg class="al-morph-svg" viewBox="0 0 905 253" aria-hidden="true">
  <circle class="c" cx="126.4" cy="126.4" r="126.4"/>
  <g transform="translate(174.8 52.1) scale(-1 1)"><g class="alfa"><path d="M0 127h98v21.8H0z"/><path d="M67.7 15.5C64.8 6.9 61.5 0 49.9 0 38.4 0 34.8 6.8 31.7 15.5L0 105.2h21l7.3-21.3h40.5l6.8 21.3H98zM34.5 65.9l14.4-42.5h.5l13.6 42.5z"/></g></g>
  <rect class="pill" x="252.9" y="0" width="652.9" height="252.9" rx="126.4"/>
  <g class="letters" transform="translate(319 49.6)">
    <path class="l1" fill-rule="evenodd" d="M178.8 148.2H0L89.4 0zM44.4 108.4 31.2 130.2h116.4l-13.2-21.8zm11.1-18.3h67.8L89.4 34z"/>
    <path class="l2" fill-rule="evenodd" d="M300.3 4.7c25.1 0 45.5 19.4 45.5 43.1v57.3c0 23.8-20.4 43.1-45.5 43.1H197.6V4.7zm-83.2 125h83.2c14.3 0 25.9-11 25.9-24.6V47.8c0-13.6-11.6-24.6-25.9-24.6h-83.2z"/>
    <path class="l3" d="M444.1 0c32.9 0 62.2 20.7 72.9 51.6l2 5.7h-20.2C490.9 35 469.4 18.9 444 18.9c-32.1 0-58.1 25.8-58.1 57.5s26 57.5 58.1 57.5c26.3 0 48.5-17.3 55.7-41h20.1l-2.4 7.4c-10.5 31.5-39.9 52.6-73.3 52.6-42.6 0-77.2-34.3-77.2-76.5S401.5 0 444.1 0z"/>
  </g>
  <g class="shapes" transform="translate(252.9 0)">
    <path class="s1" d="M155.4 50.3l90.2 148.5H65.9z"/>
    <path class="s2" d="M264.2 54.5h103.4c24.6 0 44.6 20 44.6 44.6v55.4c0 24.6-20 44.6-44.6 44.6H264.2z"/>
    <path class="s3" d="M510.4 48.6c36.6 0 67.4 25.4 75.6 59.5h-65.4v36.3H586c-8.2 34.2-39 59.6-75.6 59.6-42.9 0-77.7-34.8-77.7-77.7s34.8-77.7 77.7-77.7z"/>
  </g>
</svg>`;

/* ---------- маскот в такси, вид сбоку: едет вправо ---------- */
const TAXI = `<svg class="al-taxi" viewBox="0 0 520 300" aria-hidden="true">
  <g class="car">
    <g class="bear">
      <circle cx="232" cy="62" r="24" fill="#E8432F" stroke="#3BFFA9" stroke-width="8"/><circle cx="232" cy="62" r="10" fill="#C2301F"/>
      <circle cx="338" cy="62" r="24" fill="#E8432F" stroke="#3BFFA9" stroke-width="8"/><circle cx="338" cy="62" r="10" fill="#C2301F"/>
      <ellipse cx="285" cy="126" rx="76" ry="68" fill="#E8432F" stroke="#3BFFA9" stroke-width="9"/>
      <ellipse cx="300" cy="118" rx="17" ry="14" fill="#fff"/><ellipse cx="338" cy="118" rx="15" ry="13" fill="#fff"/>
      <g class="eye"><circle cx="306" cy="122" r="7" fill="#121314"/><circle cx="343" cy="122" r="6.5" fill="#121314"/></g>
      <path d="M284 110 316 104M326 106 354 104" stroke="#121314" stroke-width="7" stroke-linecap="round"/>
      <path d="M302 152q20 12 42-6" stroke="#121314" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M326 154q6 14 16 2z" fill="#F79AB1"/>
    </g>
    <path d="M384 172 404 116h10l-16 56z" fill="#2A2B2E"/>
    <path d="M370 172 392 118h12l-20 54z" fill="#CFEFFF" opacity=".55"/>
    <rect x="58" y="168" width="414" height="84" rx="10" fill="#FFD21F"/>
    <rect x="58" y="230" width="414" height="22" fill="#F2B90F"/>
    <rect x="58" y="166" width="414" height="10" rx="5" fill="#FFE77A"/>
    <g fill="#121314">${Array.from({ length: 14 }, (_, i) => `<rect x="${92 + i * 16}" y="${190 + (i % 2) * 14}" width="16" height="14"/>`).join('')}</g>
    <rect x="456" y="186" width="20" height="16" rx="3" fill="#fff"/>
    <rect x="52" y="186" width="14" height="16" rx="3" fill="#C8291B"/>
    <rect x="452" y="232" width="26" height="10" rx="4" fill="#2A2B2E"/><rect x="50" y="232" width="22" height="10" rx="4" fill="#2A2B2E"/>
    <g class="wheel" style="transform-origin:140px 266px"><circle cx="140" cy="266" r="34" fill="#121314"/><circle cx="140" cy="266" r="14" fill="#5A5C63"/><rect x="136" y="236" width="8" height="60" fill="#2A2B2E"/></g>
    <g class="wheel" style="transform-origin:392px 266px"><circle cx="392" cy="266" r="34" fill="#121314"/><circle cx="392" cy="266" r="14" fill="#5A5C63"/><rect x="388" y="236" width="8" height="60" fill="#2A2B2E"/></g>
  </g>
</svg>`;

/* ---------- содержимое ---------- */
const TASK = {
  intro: 'Внутри дизайн-команды мы часто получаем задачи на упаковку презентаций, где нужно простым языком говорить о сложных вещах. Это относится и к проектированию схем с изображениями.\nЗадача — разработать визуальное оформление для презентации, посвященной теме "Дизайн-процесс в Альфа-Бизнес", которая будет представлена на внутреннем митапе команды.',
  items: [
    'Спроектировать обложку для презентации, опираясь на референсы из текущего брендбука. Формат 1920х1080. Сделать ресайз обложки в формате 1080х1080 для поста с анонсом.',
    'Графически перерисовать схему дизайн-процесса, не потеряв данные и его этапы.',
  ],
  analysis: [
    'Чистое 3D без нейросетей. Английский текст набран капсом, в вертикальных и квадратных ресайзах стоит вертикальный логотип. Знак Альфа-Банка встроен в 3D-модель, а не поставлен поверх макета. Скорее всего, потому что он уже есть на аватарке в анонсе: так удаётся избежать повтора.',
    'Тёмный фон — для чёрного пластика, светлый — для стекла с неоном и частицами. Основные цвета — чёрный, зелёный и фиолетовый, красный появляется только в акцентах. Где стоит логотип банка, красного больше.',
  ],
};
const EN_NOTE = 'В референсах заголовки на английском, а мелкие подписи на русском, поэтому я сделала и такой вариант.';
const FAQ = [
  ['Зачем столько эскизов? Сделай один раз нормально',
   'Лучший вариант не найти без поиска. Я пробую разные ходы, комбинирую их, отсекаю те, что не работают, и понимаю почему. В одном эскизе процесс выглядел замкнутым циклом, в другом — графиком, который падает.'],
  ['Почему сайт, да ещё на таком домене?',
   'Чтобы тестовое можно было открыть с телефона: в метро, на прогулке с собакой или за обедом, когда ноутбука под рукой нет. Этот сервис открывается из любой страны, с VPN и без, поэтому я выбрала его. Поисковики страницу не индексируют, так что тестовое увидим только мы с вами.'],
];

// обложка и квадрат с переключателем языка; у светлых версий английской нет
function covers(v, { note = '', caption = '', light = false } = {}) {
  const sfx = light ? '-light' : '';
  const lang = light ? '' : `<div class="al-lang rv"><button class="al-switch" role="switch" aria-checked="false" aria-label="английская версия">
      <span class="o">рус</span><span class="track"><i></i></span><span class="o">eng</span></button>${note ? `<p class="al-note">${T(note)}</p>` : ''}</div>`;
  const f = (n) => `<figure class="al-ph zoom al-flip" style="--r:${R[`${v}-${n}`]}" data-full="img/${v}-${n}${sfx}.webp" data-name="${v}-${n}${sfx}">
      <img src="img/${v}-${n}${sfx}-s.webp" srcset="img/${v}-${n}${sfx}-s.webp 900w, img/${v}-${n}${sfx}.webp 1920w" sizes="(max-width: 900px) 100vw, 64vw" alt="" ${v === 'v1' && !light ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">
      ${light ? '' : `<img class="en" alt="" loading="lazy" decoding="async" data-src="img/${v}-${n}-en-s.webp" data-srcset="img/${v}-${n}-en-s.webp 900w, img/${v}-${n}-en.webp 1920w" sizes="(max-width: 900px) 100vw, 64vw">`}</figure>`;
  return `<div class="al-covers${light ? '' : ' lang'}">${lang}<div class="al-pair rv">${f('cover')}${f('sq')}</div>${caption ? `<p class="al-cap rv">${T(caption)}</p>` : ''}</div>`;
}
const row = (names, cls = '') => `<div class="al-row ${cls} rv">${names.map(n => pic(n)).join('')}</div>`;

const html = `
<div class="al-top"><div class="al-wrap">
  <a href="#top" class="home">Даша Купцова</a>
  <nav><a href="#v1">первый<span> вариант</span></a><a href="#v2">второй<span> вариант</span></a><a href="#faq">вопросы</a></nav>
</div></div>

<section class="al-hero al-wrap" id="top">
  <p class="al-eyebrow rv">Даша Купцова</p>
  <h1 class="al-h1 rv">${T('Тестовое задание в Альфа-Банк на ведущего дизайнера внутренних коммуникаций', false)}</h1>
  <div class="al-task rv" id="task">
    <button class="al-task-row" aria-expanded="false" aria-controls="task-body">
      <span>${T('Задание и анализ')}</span><b>Дизайн-процесс в&nbsp;Альфа-Бизнес</b><i class="pm" aria-hidden="true"></i>
    </button>
    <div class="al-task-body" id="task-body"><div class="in">
      <div class="al-two">
        <div>${TASK.intro.split('\n').map(t => P(t, 'al-lead')).join('')}
          <ul class="al-items">${TASK.items.map(t => `<li>${T(t)}</li>`).join('')}</ul></div>
        <div class="al-brief">${pic('t-update')}${pic('t-nba')}${pic('t-old', { cls: 'wide' })}</div>
      </div>
      <div class="al-two al-analysis">
        <div><h3 class="al-h3">анализ</h3>${TASK.analysis.map(t => P(t)).join('')}</div>
        <div>${pic('t-pantone')}</div>
      </div>
    </div></div>
  </div>
  <div class="al-hero-vis rv">
    <a href="#v1">${pic('v1-cover', { eager: true, zoom: false })}<b>первый вариант</b></a>
    <a href="#v2">${pic('v2-cover', { eager: true, zoom: false })}<b>второй вариант</b></a>
  </div>
</section>

<!-- ============ первый вариант ============ -->
<section class="al-sec al-wrap" id="v1">
  ${head('первый вариант', '', 'обложка, ресайз, схема')}
  <div class="al-tx rv">${P('Сложная 3D-конструкция лучше смотрится на тёмном фоне. Светлому подходит один крупный элемент, но связать его со схемой будет трудно. Поэтому стекло, возможно, стоит не брать сюда, а приберечь для более минималистичных задач.', 'al-lead')}</div>
  ${covers('v1', { note: EN_NOTE })}
  <div class="al-tx al-tx-r rv">${P('С главной шестерёнки на обложке я беру три основных переключателя, о которых шла речь, увеличиваю их и ставлю под каждый блок схемы.', 'al-lead')}</div>
  <div class="al-wide rv"><div class="sc">${pic('v1-schema')}</div></div>
  ${covers('v1', { light: true })}

  <div class="al-sub" id="v1-process">
    ${head('процесс')}
    <div class="al-pipe rv" aria-label="Claude, Blender, Higgsfield, Figma">
      ${['claude', 'blender', 'higgsfield', 'figma'].map((k, i) => `<div class="st" style="--i:${i}"><span class="ic">${ICONS[k]}</span><b>${{ claude: 'Claude', blender: 'Blender', higgsfield: 'Higgsfield', figma: 'Figma' }[k]}</b></div>`).join('<span class="ln"><i></i></span>')}
    </div>
    <div class="al-tx rv">${P('Собрала иллюстрацию в 3D и попробовала разные ракурсы. Потом улучшила материалы с помощью нейросети, отрендерила маску и по ней вырезала элементы в 4K с высокой детализацией. Фон просчитала отдельно, чтобы проще было делать ресайзы.', 'al-lead')}
      ${P('Почему именно так? Так быстрее. В мелких деталях нет ИИ-артефактов, а на обычном ноутбуке не приходится тратить время на перерендеры.')}</div>
    <div class="al-video rv"><video muted loop playsinline preload="none" poster="img/scene.webp" data-src="img/scene.mp4" data-src-s="img/scene-s.mp4"></video></div>
    <div class="al-mos rv">
      ${pic('p1-wire', { cls: 'a' })}${pic('p1-angles', { cls: 'b' })}
      <div class="c"><div class="al-ai">${pic('ai1')}${pic('ai2')}</div><p class="al-cap">${T('ИИ-артефакты в мелких деталях')}</p></div>
    </div>
    ${row(['p1-render', 'p1-mask', 'p1-sand'], 'r3')}
    ${row(['r-black', 'r-mask', 'r-glass', 'r-dunes'], 'r4')}
  </div>

  <div class="al-sub">
    ${head('HUD kit')}
    <div class="al-tx rv">${P('Сгенерировала на основе макетов библиотеку векторных элементов', 'al-lead')}</div>
  </div>
</section>
<div class="al-hud rv" aria-hidden="true"><div class="track"></div></div>

<section class="al-sec al-wrap al-search">
  ${head('поиски')}
  <div class="al-tx rv">${P('Эскизы с Claude, я пробовала показать дизайн-процесс тремя способами: как поездку на такси (отсылка к собеседованию); бой на мечах или на ринге.', 'al-lead')}</div>
  ${row(['s-trassa', 's-mech', 's-forms', 's-ring'], 'r4')}
  <h3 class="al-h3 rv">${T('Как последовательный по этапам механизм')}</h3>
  ${row(['s-gears', 's-steps', 's-pult'], 'r3')}
  <h3 class="al-h3 rv">${T('Стеклянный материал показывает, что процессы прозрачны')}</h3>
  ${row(['s-windows', 's-layers', 's-layers2'], 'r3')}
</section>

<!-- ============ второй вариант ============ -->
<section class="al-sec al-wrap" id="v2">
  ${head('второй вариант', '', 'обложка, ресайз, схема')}
  <div class="al-morph rv">
    <div class="vis">${LOGO}</div>
    <div class="txt">${P('В схеме три главных блока, как и в логотипе. Поэтому я связала каждый элемент логотипа с блоком схемы.', 'al-lead')}
      <div class="al-steps" role="tablist"><button class="on" data-s="0">логотип<i></i></button><button data-s="1">схема<i></i></button></div></div>
  </div>
  ${covers('v2', { note: EN_NOTE, caption: 'Логотип я поставила в правый угол, хотя в референсах он стоит в левом. Слева не складывалась композиция, и я решила, что такое отступление допустимо.' })}
  <div class="al-tx al-tx-r rv">${P('В схеме я взяла те же три блока, что и на основном лендинге. Только трубки разложила горизонтально, а не зигзагом, так схему легче читать.', 'al-lead')}
    ${P('В слове "приёмка" я убрала букву Ё: сейчас её обычно не ставят. Но это зависит от редполитики компании.')}</div>
  <div class="al-wide rv"><div class="sc">${pic('v2-schema')}</div></div>
  <div class="al-tx rv">${P('Сложная 3D-конструкция лучше смотрится на тёмном фоне. Светлому фону больше подходит один крупный элемент, но такой элемент будет трудно связать со схемой. Поэтому стекло, возможно, лучше не брать для этой задачи и приберечь для более минималистичных.', 'al-lead')}</div>
  ${covers('v2', { light: true })}

  <div class="al-sub">
    ${head('процесс')}
    <div class="al-tx rv"><div><h3 class="al-h3 first">эскизы</h3>${P('Ещё я хотела сделать фигуры в стиле детских кубиков или сравнить процесс с азбукой: всё просто, как ABC. Но поняла, что такая логика уведёт далеко от технологичного чёрного бигтеха.', 'al-lead')}</div></div>
    ${row(['e-1', 'e-2', 'e-3'], 'r3')}
    <div class="al-tx rv"><div><h3 class="al-h3 first">как я работала</h3>
      <ul class="al-items plain">${['Собрала 3D-модель.', 'Сделала маску, в том числе учитывая прозрачное стекло.', 'На постпродакшене поправила свет и цвет и добавила фон.'].map(t => `<li>${T(t)}</li>`).join('')}</ul></div></div>
    ${row(['w-1', 'w-2', 'w-3', 'w-4'], 'r4')}
    <div class="al-det rv">${pic('d-console', { cls: 'big' })}${['d-knob', 'd-mini', 'd-key', 'd-ind'].map(n => pic(n)).join('')}</div>
  </div>
</section>

<!-- ============ вопросы и финал ============ -->
<section class="al-sec al-wrap" id="faq">
  ${head('вопросы')}
  <div class="al-faq rv">${FAQ.map(([q, a], i) => `<div class="qa"><button aria-expanded="false" aria-controls="qa${i}"><span>${T(q)}</span><i class="pm" aria-hidden="true"></i></button>
    <div class="ans" id="qa${i}"><div class="in">${P(a, 'al-lead')}</div></div></div>`).join('')}</div>
</section>

<section class="al-end" aria-label="${T('Спасибо за просмотр, едем в офис?')}">
  <div class="al-wrap"><h2 class="al-h1 rv">${T('Спасибо за просмотр, едем в офис?', false)}</h2></div>
  <div class="road"><div class="scene">${TAXI}</div><div class="asphalt"><i></i></div></div>
</section>
<button class="al-up" aria-label="наверх"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<div class="al-box" hidden><img alt=""><button aria-label="закрыть"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;

ROOT.innerHTML = html;
ROOT.querySelectorAll('.al-h2').forEach(h => h.lang = 'ru');

/* ---------- картинки: плавно проявляются после загрузки ---------- */
ROOT.querySelectorAll('.al-ph img:not(.en)').forEach(img => {
  const ok = () => img.closest('.al-ph').classList.add('ok');
  if (img.complete && img.naturalWidth) ok(); else img.addEventListener('load', ok, { once: true });
});

// скелет уходит, когда первая картинка готова (или через 1,5 с)
const skel = document.getElementById('al-skel');
const hero = ROOT.querySelector('.al-hero-vis img');
let gone = false;
const off = () => { if (gone) return; gone = true; skel && skel.classList.add('off'); document.documentElement.classList.add('al-ready'); setTimeout(() => skel && skel.remove(), 700); };
(document.fonts ? document.fonts.ready : Promise.resolve()).then(() => { if (hero.complete) off(); else hero.addEventListener('load', off, { once: true }); });
setTimeout(off, 1500);

/* ---------- появление при прокрутке ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { rootMargin: '0px 0px -8% 0px' });
ROOT.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---------- раскрывающиеся блоки: задание и вопросы ---------- */
function fold(btn, body) {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    body.classList.toggle('open', open);
    if (open) body.querySelectorAll('.al-ph img[loading="lazy"]').forEach(i => i.loading = 'eager');
  });
}
fold(ROOT.querySelector('.al-task-row'), ROOT.querySelector('.al-task-body'));
ROOT.querySelectorAll('.al-faq .qa').forEach(q => fold(q.querySelector('button'), q.querySelector('.ans')));

/* ---------- переключатель «рус / eng»: английская версия грузится только по нажатию ---------- */
ROOT.querySelectorAll('.al-covers.lang').forEach(box => {
  const sw = box.querySelector('.al-switch');
  sw.addEventListener('click', () => {
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', on);
    box.querySelectorAll('.al-flip').forEach(f => {
      const en = f.querySelector('.en');
      if (en.dataset.src) { en.srcset = en.dataset.srcset; en.src = en.dataset.src; delete en.dataset.src; }
      const go = () => f.classList.toggle('is-en', on);
      if (on && !en.complete) en.addEventListener('load', go, { once: true }); else go();
      f.dataset.full = `img/${f.dataset.name.replace(/(cover|sq)$/, on ? '$1-en' : '$1')}.webp`;
    });
  });
});

/* ---------- ролик: грузится, когда близко, играет только на экране ---------- */
const vid = ROOT.querySelector('.al-video video');
new IntersectionObserver(([e]) => {
  if (e.isIntersecting) {
    if (vid.dataset.src) { vid.src = innerWidth < 900 ? vid.dataset.srcS : vid.dataset.src; delete vid.dataset.src; }
    vid.play().catch(() => {});
  } else vid.pause();
}, { rootMargin: '200px 0px' }).observe(vid);

/* ---------- HUD kit: элементы библиотеки едут лентой по кругу ---------- */
const hud = ROOT.querySelector('.al-hud');
new IntersectionObserver(([e], o) => {
  if (!e.isIntersecting) return; o.disconnect();
  fetch('img/hud.json').then(r => r.json()).then(list => {
    const items = list.map((s, i) => `<span class="it" style="--d:${(i % 7) * .37}s">${s}</span>`).join('');
    hud.querySelector('.track').innerHTML = `<div class="set">${items}</div><div class="set">${items}</div>`;
    hud.classList.add('go');
  });
}, { rootMargin: '400px 0px' }).observe(hud);

/* ---------- логотип ⇄ схема: смена сама по кругу, нажатие — к нужной ---------- */
const morph = ROOT.querySelector('.al-morph');
const steps = [...morph.querySelectorAll('.al-steps button')];
let mi = 0, mt;
function mset(i, auto) {
  mi = i; morph.classList.toggle('scheme', i === 1);
  steps.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.remove('run'); });
  clearTimeout(mt);
  if (auto && !RM) { void steps[i].offsetWidth; steps[i].classList.add('run'); mt = setTimeout(() => mset(1 - mi, true), 3200); }
}
steps.forEach((b, k) => b.addEventListener('click', () => mset(k, false)));
new IntersectionObserver(([e]) => { if (e.isIntersecting) mset(mi, true); else clearTimeout(mt); }, { threshold: .4 }).observe(morph);

/* ---------- финал: такси выезжает слева и едет вправо, дорога бежит под ним ---------- */
const end = ROOT.querySelector('.al-end');
new IntersectionObserver(([e]) => end.classList.toggle('drive', e.isIntersecting), { threshold: .25 }).observe(end);

/* ---------- крупный просмотр ---------- */
const box = ROOT.querySelector('.al-box'), bimg = box.querySelector('img');
ROOT.addEventListener('click', e => {
  const f = e.target.closest('.al-ph.zoom');
  if (!f) return;
  bimg.src = f.dataset.full; box.hidden = false; requestAnimationFrame(() => box.classList.add('on'));
  document.documentElement.style.overflow = 'hidden';
});
const close = () => { box.classList.remove('on'); document.documentElement.style.overflow = ''; setTimeout(() => { box.hidden = true; bimg.removeAttribute('src'); }, 300); };
box.addEventListener('click', close);
addEventListener('keydown', e => { if (e.key === 'Escape' && !box.hidden) close(); });

/* ---------- шапка: подсветка раздела; кнопка «наверх» ---------- */
const up = ROOT.querySelector('.al-up');
up.addEventListener('click', () => scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }));
const links = [...ROOT.querySelectorAll('.al-top nav a')];
const secs = links.map(a => ROOT.querySelector(a.getAttribute('href')));
let tick = false;
addEventListener('scroll', () => {
  if (tick) return; tick = true;
  requestAnimationFrame(() => {
    tick = false;
    up.classList.toggle('on', scrollY > innerHeight * 1.2);
    let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  });
}, { passive: true });
})();
