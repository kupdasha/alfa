/* Тестовое задание в Альфа-Банк: «Дизайн-процесс в Альфа-Бизнес».
   Вся страница: тексты (как в макете «альфа.fig», без правок — только типографика), картинки и живые блоки. */
(() => {
const ROOT = document.getElementById('al');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

// пропорции картинок (ширина к высоте) — чтобы место под картинку было до загрузки
const R = {"ai1":1.3813,"ai2":1.6156,"d-console":1.7778,"d-ind":1,"d-key":1,"d-knob":1,"d-mini":1,"e-1":1.7778,"e-2":1.7778,"e-3":1.7778,"p1-angles":0.884,"p1-mask":1.7712,"p1-render":1.7712,"p1-sand":1.768,"p1-wire":1.7778,"r-black":1.7712,"r-dunes":1.7778,"r-glass":1.7778,"r-mask":1.7712,"s-forms":1.7778,"s-gears":1.7778,"s-layers":1.7778,"s-layers2":1.7778,"s-mech":1.7778,"s-pult":1.7778,"s-ring":1.7778,"s-steps":1.7778,"s-trassa":1.7778,"s-windows":1.7778,"t-nba":0.8,"t-old":2.533,"t-pantone":1.9433,"t-update":0.8,"v1-cover":1.7778,"v1-schema":1.7778,"v1-sq":1,"v2-cover":1.7778,"v2-schema":1.7778,"v2-sq":1,"w-1":1.7712,"w-2":1.7712,"w-3":1.5648,"w-4":1.7778};

/* ---------- типограф (как на kupdasha.ru): тире, «ёлочки», неразрывные пробелы; ё → е (кроме фразы про «приёмку») ---------- */
const SHORT = 'без|для|изо|над|под|про|при|что|как|или|его|уже|все|это|чем|где|кто|еще|так|нет|чтобы|если|когда|либо|хотя|ведь|пока|через|перед|после|между|около|среди|кроме|вроде';
function ty(input, tail = true) {
  const NB = ' ';
  let s = String(input);
  if (!/приёмк/.test(s)) s = s.replace(/ё/g, 'е').replace(/Ё/g, 'Е');
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
const head = (h, id) => `<header class="al-head rv"${id ? ` id="${id}"` : ''}><h2 class="al-h2">${T(h)}</h2></header>`;
// раскрывающийся блок в одну строку — как задача
const fold = (label, inner, cls = '') => `<div class="al-fold rv ${cls}">
  <button class="al-fold-row" aria-expanded="false"><span>${T(label)}</span><i class="pm" aria-hidden="true"></i></button>
  <div class="al-fold-body"><div class="in">${inner}</div></div></div>`;
// ряд картинок одной высоты: ширина каждой — по ее пропорциям
const row = (names) => `<div class="al-jr">${names.map(n => `<div style="--r:${R[n]}">${pic(n)}</div>`).join('')}</div>`;

/* ---------- логотипы программ для пайплайна ---------- */
const LOGOS = {
  claude: `<span class="ic" style="background:#D97757"><svg viewBox="0 0 24 24" fill="#fff"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg></span>`,
  blender: `<span class="ic" style="background:#fff;box-shadow:inset 0 0 0 1px #E4E5E8"><svg viewBox="0 0 24 24" fill="#E87D0D"><path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626"/></svg></span>`,
  higgsfield: `<span class="ic"><img src="img/logo/higgsfield.webp" alt=""></span>`,
  figma: `<span class="ic" style="background:#1E1E1E"><svg viewBox="0 0 38 57"><path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z"/><path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z"/><path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z"/><path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z"/><path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z"/></svg></span>`,
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

/* ---------- маскот в такси, вид сбоку: едет вправо, смотрит на курсор ---------- */
const EYE = (cx, id) => `<clipPath id="${id}"><ellipse cx="${cx}" cy="124" rx="19" ry="17"/></clipPath>
  <ellipse cx="${cx}" cy="124" rx="19" ry="17" fill="#fff"/>
  <g clip-path="url(#${id})"><g class="pupil"><circle cx="${cx}" cy="127" r="8.5" fill="#121314"/><circle cx="${cx + 3}" cy="124" r="2.6" fill="#fff"/></g>
    <rect class="lid" x="${cx - 22}" y="100" width="44" height="17" fill="#E8432F"/></g>
  <path d="M${cx - 19} 117h38" stroke="#121314" stroke-width="5" stroke-linecap="round"/>`;
const TAXI = `<svg class="al-taxi" viewBox="0 0 520 300" aria-hidden="true">
  <g class="car">
    <g class="bear"><g transform="translate(0 -26)">
      <circle cx="226" cy="64" r="24" fill="#E8432F" stroke="#3BFFA9" stroke-width="8"/><circle cx="226" cy="64" r="10" fill="#C2301F"/>
      <circle cx="344" cy="64" r="24" fill="#E8432F" stroke="#3BFFA9" stroke-width="8"/><circle cx="344" cy="64" r="10" fill="#C2301F"/>
      <ellipse cx="285" cy="128" rx="78" ry="70" fill="#E8432F" stroke="#3BFFA9" stroke-width="9"/>
      ${EYE(260, 'al-e1')}${EYE(310, 'al-e2')}
      <path d="M244 99l30 4M296 103l30-5" stroke="#121314" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="285" cy="150" rx="9" ry="6" fill="#8E1B12"/>
      <path d="M266 164q22 12 42-4" stroke="#121314" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M294 165q4 14 14 4l-4-8z" fill="#F79AB1"/>
    </g></g>
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
      <img src="img/${v}-${n}${sfx}-s.webp" srcset="img/${v}-${n}${sfx}-s.webp 900w, img/${v}-${n}${sfx}.webp 1920w" sizes="(max-width: 900px) 100vw, 64vw" alt="" loading="lazy" decoding="async">
      ${light ? '' : `<img class="en" alt="" loading="lazy" decoding="async" data-src="img/${v}-${n}-en-s.webp" data-srcset="img/${v}-${n}-en-s.webp 900w, img/${v}-${n}-en.webp 1920w" sizes="(max-width: 900px) 100vw, 64vw">`}</figure>`;
  return `<div class="al-covers${light ? '' : ' lang'}">${lang}<div class="al-pair rv">${f('cover')}${f('sq')}</div>${caption ? `<p class="al-cap rv">${T(caption)}</p>` : ''}</div>`;
}

const PROCESS1 = `
  <div class="al-pipe">
    ${['claude', 'blender', 'higgsfield', 'figma'].map((k, i) => `<div class="st" style="--i:${i}">${LOGOS[k]}<b>${{ claude: 'Claude', blender: 'Blender', higgsfield: 'Higgsfield', figma: 'Figma' }[k]}</b></div>`).join('<span class="ln"><i></i></span>')}
  </div>
  <div class="al-split">
    <div>${P('Собрала иллюстрацию в 3D и попробовала разные ракурсы. Потом улучшила материалы с помощью нейросети, отрендерила маску и по ней вырезала элементы в 4K с высокой детализацией. Фон просчитала отдельно, чтобы проще было делать ресайзы.', 'al-lead')}
      ${P('Почему именно так? Так быстрее. В мелких деталях нет ИИ-артефактов, а на обычном ноутбуке не приходится тратить время на перерендеры.')}</div>
    <div class="al-video"><video muted loop playsinline preload="none" poster="img/scene.webp" data-src="img/scene.mp4"></video></div>
  </div>
  <div class="al-jr"><div style="--r:1.7778">${pic('p1-wire')}</div><div style="--r:.884">${pic('p1-angles')}</div>
    <div class="ai" style="--r:1.15">${pic('ai1')}${pic('ai2')}<p class="al-cap">${T('ИИ-артефакты в мелких деталях')}</p></div></div>
  ${row(['p1-render', 'p1-mask', 'p1-sand'])}
  ${row(['r-black', 'r-mask', 'r-glass', 'r-dunes'])}

  <h3 class="al-h3">HUD kit</h3>
  <div class="al-tx">${P('Сгенерировала на основе макетов библиотеку векторных элементов', 'al-lead')}</div>
  <div class="al-hud" aria-hidden="true"></div>

  <h3 class="al-h3">поиски</h3>
  <div class="al-tx">${P('Эскизы с Claude, я пробовала показать дизайн-процесс тремя способами: как поездку на такси (отсылка к собеседованию); бой на мечах или на ринге.', 'al-lead')}</div>
  ${row(['s-trassa', 's-mech', 's-forms', 's-ring'])}
  <h4 class="al-h4">${T('Как последовательный по этапам механизм')}</h4>
  ${row(['s-gears', 's-steps', 's-pult'])}
  <h4 class="al-h4">${T('Стеклянный материал показывает, что процессы прозрачны')}</h4>
  ${row(['s-windows', 's-layers', 's-layers2'])}`;

const PROCESS2 = `
  <div class="al-tx"><div><h3 class="al-h3 first">эскизы</h3>${P('Ещё я хотела сделать фигуры в стиле детских кубиков или сравнить процесс с азбукой: всё просто, как ABC. Но поняла, что такая логика уведёт далеко от технологичного чёрного бигтеха.', 'al-lead')}</div></div>
  ${row(['e-1', 'e-2', 'e-3'])}
  <div class="al-tx"><div><h3 class="al-h3 first">как я работала</h3>
    <ul class="al-items plain">${['Собрала 3D-модель.', 'Сделала маску, в том числе учитывая прозрачное стекло.', 'На постпродакшене поправила свет и цвет и добавила фон.'].map(t => `<li>${T(t)}</li>`).join('')}</ul></div></div>
  ${row(['w-1', 'w-2', 'w-4'])}
  <div class="al-jr"><div style="--r:${R['w-3']}">${pic('w-3')}</div><div style="--r:${R['d-console']}">${pic('d-console')}</div></div>
  ${row(['d-knob', 'd-mini', 'd-key', 'd-ind'])}`;

const html = `
<div class="al-top"><div class="al-wrap">
  <a href="#top" class="home">Даша Купцова</a>
  <nav><a href="#v1">первый<span> вариант</span></a><a href="#v2">второй<span> вариант</span></a><a href="#faq">вопросы</a></nav>
</div></div>

<section class="al-hero al-wrap" id="top">
  <h1 class="al-title rv"><span class="big">Даша Купцова<br>Тестовое задание</span>
    <span class="sub">${T('в Альфа-Банк на ведущего дизайнера внутренних коммуникаций', false)}</span></h1>
  <div class="al-fold al-task rv">
    <button class="al-fold-row" aria-expanded="false"><span>задача</span><i class="pm" aria-hidden="true"></i></button>
    <div class="al-fold-body"><div class="in">
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
  <div class="al-cards rv">
    <a href="#v1" class="al-card dark"><span class="g" aria-hidden="true"><i></i><i></i><i></i><i></i></span><b>первый вариант</b></a>
    <a href="#v2" class="al-card light"><span class="g" aria-hidden="true"><i></i><i></i><i></i><i></i></span><b>второй вариант</b></a>
  </div>
</section>

<!-- ============ первый вариант ============ -->
<section class="al-sec al-wrap" id="v1">
  ${head('первый вариант')}
  <div class="al-tx rv">${P('Сложная 3D-конструкция лучше смотрится на тёмном фоне. Светлому подходит один крупный элемент, но связать его со схемой будет трудно. Поэтому стекло, возможно, стоит не брать сюда, а приберечь для более минималистичных задач.', 'al-lead')}</div>
  ${covers('v1', { note: EN_NOTE })}
  <div class="al-tx al-tx-r rv">${P('С главной шестерёнки на обложке я беру три основных переключателя, о которых шла речь, увеличиваю их и ставлю под каждый блок схемы.', 'al-lead')}</div>
  <div class="al-wide rv">${pic('v1-schema')}</div>
  ${covers('v1', { light: true })}
  ${fold('процесс', PROCESS1)}
</section>

<!-- ============ второй вариант ============ -->
<section class="al-sec al-wrap" id="v2">
  ${head('второй вариант')}
  <div class="al-morph rv">
    <div class="vis">${LOGO}</div>
    ${P('В схеме три главных блока, как и в логотипе. Поэтому я связала каждый элемент логотипа с блоком схемы.', 'al-lead')}
  </div>
  ${covers('v2', { note: EN_NOTE, caption: 'Логотип я поставила в правый угол, хотя в референсах он стоит в левом. Слева не складывалась композиция, и я решила, что такое отступление допустимо.' })}
  <div class="al-tx al-tx-r rv">${P('В схеме я взяла те же три блока, что и на основном лендинге. Только трубки разложила горизонтально, а не зигзагом, так схему легче читать.', 'al-lead')}
    ${P('В слове "приёмка" я убрала букву Ё: сейчас её обычно не ставят. Но это зависит от редполитики компании.')}</div>
  <div class="al-wide rv">${pic('v2-schema')}</div>
  <div class="al-tx rv">${P('Сложная 3D-конструкция лучше смотрится на тёмном фоне. Светлому фону больше подходит один крупный элемент, но такой элемент будет трудно связать со схемой. Поэтому стекло, возможно, лучше не брать для этой задачи и приберечь для более минималистичных.', 'al-lead')}</div>
  ${covers('v2', { light: true })}
  ${fold('процесс', PROCESS2)}
</section>

<!-- ============ вопросы и финал ============ -->
<section class="al-sec al-wrap" id="faq">
  <div class="al-faq rv">${FAQ.map(([q, a]) => `<div class="qa"><button aria-expanded="false"><span>${T(q)}</span><i class="pm" aria-hidden="true"></i></button>
    <div class="ans"><div class="in">${P(a, 'al-lead')}</div></div></div>`).join('')}</div>
</section>

<section class="al-end">
  <div class="al-wrap"><h2 class="al-h1 rv">${T('Спасибо за просмотр,', false)}<br>${T('едем в офис?', false)}</h2></div>
  <div class="road"><div class="scene">${TAXI}</div><div class="asphalt"><i></i></div></div>
</section>
<button class="al-up" aria-label="наверх"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<div class="al-box" hidden><img alt=""><button aria-label="закрыть"><svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>`;

ROOT.innerHTML = html;

/* ---------- картинки: плавно проявляются после загрузки ---------- */
ROOT.querySelectorAll('.al-ph img:not(.en)').forEach(img => {
  const ok = () => img.closest('.al-ph').classList.add('ok');
  if (img.complete && img.naturalWidth) ok(); else img.addEventListener('load', ok, { once: true });
});

// скелет уходит, когда загрузились шрифты (или через 1,2 с)
const skel = document.getElementById('al-skel');
let gone = false;
const off = () => { if (gone) return; gone = true; skel && skel.classList.add('off'); document.documentElement.classList.add('al-ready'); setTimeout(() => skel && skel.remove(), 700); };
(document.fonts ? document.fonts.ready : Promise.resolve()).then(off);
setTimeout(off, 1200);

/* ---------- появление при прокрутке ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add('in'); io.unobserve(e.target);
}), { rootMargin: '0px 0px -8% 0px' });
ROOT.querySelectorAll('.rv').forEach(el => io.observe(el));

/* ---------- ролик: грузится при раскрытии процесса, играет только на экране ---------- */
const vio = new IntersectionObserver(es => es.forEach(e => {
  const v = e.target;
  if (e.isIntersecting) { if (v.dataset.src) { v.src = v.dataset.src; delete v.dataset.src; } v.play().catch(() => {}); }
  else v.pause();
}), { rootMargin: '100px 0px' });

/* ---------- HUD kit: элементы библиотеки все сразу, каждый анимирован на месте ---------- */
let hudDone = false;
function loadHud() {
  if (hudDone) return; hudDone = true;
  fetch('img/hud.json').then(r => r.json()).then(list => {
    ROOT.querySelector('.al-hud').innerHTML = list.map((s, i) => {
      // размер элемента в макете: высокие уменьшаются, ширина решает, сколько ячеек сетки он займет
      const [, w, h] = s.match(/width="([\d.]+)" height="([\d.]+)"/) || [0, 40, 40];
      const z = Math.min(1.35, 150 / h);
      return `<span class="it a${i % 4}" style="--d:${(i * .23 % 3).toFixed(2)}s;--z:${z.toFixed(2)};--s:${Math.min(5, Math.max(1, Math.ceil(w * z / 130)))}">${s}</span>`;
    }).join('');
  });
}

/* ---------- раскрывающиеся блоки: задача, процесс, вопросы ---------- */
function toggle(btn, body) {
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    body.classList.toggle('open', open);
    if (open) {
      body.querySelectorAll('img[loading="lazy"]:not(.en)').forEach(i => i.loading = 'eager');
      if (body.querySelector('.al-hud')) loadHud();
    }
    body.querySelectorAll('video').forEach(v => { if (open) vio.observe(v); else { vio.unobserve(v); v.pause(); } });
  });
}
ROOT.querySelectorAll('.al-fold').forEach(f => toggle(f.querySelector('.al-fold-row'), f.querySelector('.al-fold-body')));
ROOT.querySelectorAll('.al-faq .qa').forEach(q => toggle(q.querySelector('button'), q.querySelector('.ans')));

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

/* ---------- логотип ⇄ схема: смена сама по кругу ---------- */
const morph = ROOT.querySelector('.al-morph');
let mt;
const loop = () => { morph.classList.toggle('scheme'); mt = setTimeout(loop, 1700); };
new IntersectionObserver(([e]) => { clearTimeout(mt); if (e.isIntersecting && !RM) mt = setTimeout(loop, 900); }, { threshold: .3 }).observe(morph);

/* ---------- финал: такси выезжает и едет вправо; маскот смотрит на курсор ---------- */
const end = ROOT.querySelector('.al-end');
new IntersectionObserver(([e]) => end.classList.toggle('drive', e.isIntersecting), { threshold: .25 }).observe(end);
const pupils = [...end.querySelectorAll('.pupil')];
const svg = end.querySelector('.al-taxi');
addEventListener('pointermove', e => {
  if (!end.classList.contains('drive')) return;
  const r = svg.getBoundingClientRect(), s = r.width / 520;
  pupils.forEach((p, i) => {
    const cx = r.left + (i ? 310 : 260) * s, cy = r.top + 101 * s;
    const a = Math.atan2(e.clientY - cy, e.clientX - cx), d = Math.min(1, Math.hypot(e.clientX - cx, e.clientY - cy) / 200);
    p.style.transform = `translate(${(Math.cos(a) * 8 * d).toFixed(2)}px,${(Math.sin(a) * 6 * d).toFixed(2)}px)`;
  });
}, { passive: true });

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
    up.classList.toggle('on', scrollY > innerHeight * .8);
    let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .4) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
  });
}, { passive: true });
})();
