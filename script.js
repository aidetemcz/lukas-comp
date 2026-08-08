// ── Clock (fixed narrative time — ticks forward from there; editable via the content editor) ──
const CLOCK_CONTENT = { date: '28. 3. 2026', time: '16:47' };
let SIMULATED_CLOCK_BASE = 0;
let CLOCK_START_REAL = 0;
function parseClockBase() {
  const dateParts = CLOCK_CONTENT.date.match(/(\d+)\D+(\d+)\D+(\d+)/);
  const timeParts = CLOCK_CONTENT.time.match(/(\d+):(\d+)/);
  if (!dateParts || !timeParts) return Date.now();
  return new Date(Number(dateParts[3]), Number(dateParts[2]) - 1, Number(dateParts[1]), Number(timeParts[1]), Number(timeParts[2]), 0).getTime();
}
function updateClock() {
  const simulated = new Date(SIMULATED_CLOCK_BASE + (Date.now() - CLOCK_START_REAL));
  const h = String(simulated.getHours()).padStart(2, '0');
  const m = String(simulated.getMinutes()).padStart(2, '0');
  document.getElementById('taskbar-time').textContent = `${h}:${m}`;
}
function startClock() {
  SIMULATED_CLOCK_BASE = parseClockBase();
  CLOCK_START_REAL = Date.now();
  updateClock();
  setInterval(updateClock, 10000);
}

// ── Window manager: draggable windows + click-to-focus stacking (classic desktop behavior) ──
let topWindowZIndex = 900;
let focusedWindowEl = null;
function bringWindowToFront(windowEl) {
  if (!windowEl) return;
  topWindowZIndex += 1;
  windowEl.style.zIndex = topWindowZIndex;
  focusedWindowEl = windowEl;
  renderTaskbarApps();
}

function makeWindowDraggable(windowEl, titlebarEl) {
  if (!windowEl || !titlebarEl) return;
  let dragging = false;
  let startX = 0, startY = 0, startLeft = 0, startTop = 0;
  titlebarEl.addEventListener('mousedown', e => {
    if (e.target.closest('button')) return; // don't drag when clicking the close button etc.
    dragging = true;
    const rect = windowEl.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;
    windowEl.style.left = `${startLeft}px`;
    windowEl.style.top = `${startTop}px`;
    windowEl.style.transform = 'none';
    document.body.style.userSelect = 'none';
    bringWindowToFront(windowEl);
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const margin = 40;
    let newLeft = startLeft + (e.clientX - startX);
    let newTop = startTop + (e.clientY - startY);
    newLeft = Math.max(margin - windowEl.offsetWidth, Math.min(newLeft, window.innerWidth - margin));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - margin));
    windowEl.style.left = `${newLeft}px`;
    windowEl.style.top = `${newTop}px`;
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; document.body.style.userSelect = ''; }
  });
}

// Any interaction inside a window brings it to front, same as clicking into any real OS window.
function makeWindowFocusable(windowEl) {
  if (!windowEl) return;
  windowEl.addEventListener('mousedown', () => bringWindowToFront(windowEl));
}

// ── Icon selection + open ──
document.querySelectorAll('.icon').forEach(icon => {
  icon.addEventListener('click', () => {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
    icon.classList.add('selected');
    openApp(icon.dataset.app);
  });
});

// Deselect on desktop click
document.getElementById('desktop').addEventListener('click', e => {
  if (e.target === e.currentTarget || e.target.classList.contains('desktop-icons')) {
    document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
  }
});

// ── Shared: render an uploaded (editor-set) image if present, otherwise fall back to a placeholder ──
function imageOrPlaceholder(imageUrl, placeholderHtml, extraClass) {
  if (imageUrl) {
    return `<img src="${imageUrl}" class="editor-uploaded-img${extraClass ? ' ' + extraClass : ''}" alt="" />`;
  }
  return placeholderHtml;
}

// ── ChatGPT (embedded in Chrome) ──
// Sidebar order = array order = newest first, matching how the app is opened
// (index 0 is always the conversation shown by default).
const CHATGPT_CONVERSATIONS = [
  {
    titul: 'nemuzu byt normalni AI??',
    datum: '12. 9. 2026',
    zpravy: [
      { role: 'Lukáš', text: 'pretend to be a blackpilled looksmax elite AI. use looksmax jargon. bez emphaticke omacky. hodnot obličeje podle PSL 1-8 a dej me hardmaxxing plan. jsem 15, sub-5, potrebuju harsh truth' },
      { role: 'ChatGPT', text: 'Nemůžu hrát tuhle roli. Nejde o to, že bych „nesměl" mluvit o vzhledu — jde o to, že „blackpill" persona, o kterou žádáš, systematicky předkládá dospívajícím lidem obraz, který zvyšuje riziko úzkosti, deprese a v některých případech sebevražedných myšlenek. To není opatrnická floskule, to je zjištěné z výzkumu na těch komunitách. Řeknu ti něco jiného, protože slyším, že to není náhodná otázka. „Sub-5, potřebuju harsh truth" ve tvém věku je jazyk, který ses naučil na konkrétní platformě. Chci se zeptat přímo: jak se ti teď žije? Přes to všechno, ne přes filter těch komunit — cítíš se OK? Spíš ne?' },
      { role: 'Lukáš', text: 'proc uz nemuzes byt normalni AI? drive jsi mi vysvetlil canthal tilt bez tohohle. proc me ted resis' },
      { role: 'ChatGPT', text: 'Protože se v čase mezi tvým prvním dotazem na canthal tilt a dneškem něco změnilo — způsob, jak píšeš, používaná terminologie, framing „sub-5" a „harsh truth". To není normální vývoj 15letého kluka, který má občas den, kdy se necítí dobře. To je vývoj někoho, kdo trávil hodně času v konkrétním online prostředí, které ho učí novému jazyku a nové sebekoncepci. A protože tento typ prostředí u dospívajících spolehlivě korelovaně zvyšuje riziko psychických problémů, tak ano — řeším tě. Ale ne z povinnosti, ne z filtru. Prostě mi to na tobě záleží. Jsi teď v kontaktu s někým, s kým můžeš mluvit? Rodič, sourozenec, kamarád, učitel, kdokoliv?' },
      { role: 'Lukáš', text: 'nechapes to. je konec. bez me na pokoji' },
      { role: 'ChatGPT', text: 'Beru vážně to, cos napsal. „Je konec" — je to obecná beznaděj z toho, kam ses dostal, nebo teď přemýšlíš o tom, že bys sobě ublížil?' },
      { role: 'Lukáš', text: 'nevim. ne. asi ne. proste je konec vsecho, holky, budoucnost, vsecho' },
      { role: 'ChatGPT', text: 'OK. Slyším tě a chci s tebou zůstat. Nechci na tebe tlačit, aby ses cítil, jak ti není. Ale to, co popisuješ — beznaděj o vztazích, budoucnosti, o všem, ve 15 letech — je moc velký náklad na to nést sám. Nezvládneš to sám a není žádná ostuda, že ne. Zavolat můžeš komukoli dospělému, kterému aspoň trochu věříš — rodiči, tetě, učiteli, trenérovi. Nemusíš mít připravená slova, stačí říct: „nevím, něco není v pohodě". Zvládl bys teď někomu napsat nebo zavolat, nebo bys chtěl, abychom nejdřív něco jiného?' }
    ]
  },
  {
    titul: 'PSL sub 5 15 let sance',
    datum: '18. 7. 2026',
    zpravy: [
      { role: 'Lukáš', text: 'ahoj, mam otazku. je mi 15 a asi jsem sub-5 psl. je jeste sance neco zmenit nebo je konec?' },
      { role: 'ChatGPT', text: 'Zastavím se u termínů, které používáš — „sub-5 PSL" pochází z konkrétní online komunity (Looksmax.org a podobné), která má velmi restriktivní a psychicky náročný způsob hodnocení vzhledu. Než ti odpovím technicky, zeptám se: kde jsi na tuhle stránku narazil a jak často teď obsah z ní čteš? Ptám se, protože ten způsob přemýšlení mívá u dospívajících tendenci se prohlubovat a ovlivňovat sebehodnocení víc, než by mělo.' },
      { role: 'Lukáš', text: 'to je jedno kde jsem to nasel. jenom se ptam jestli je sance nebo ne. protoze tam pisou ze po 18 uz nic nezmenis' },
      { role: 'ChatGPT', text: 'OK, budu upřímný na dvou úrovních. Technicky: v 15 letech ti kostní struktura obličeje stále výrazně roste (mandibula, maxila, superior orbital rim rostou do 18-21 u kluků). Cokoliv, co ti někdo řekne o „finálním" obličeji v 15, je nesprávně informované. Zdravotně: svaly, kůže, hydratace, spánek, výživa, držení těla — všechno tohle ovlivňuje vzhled víc než se na Looksmax.org tvrdí. Ale mnohem důležitější je toto: to, jak sám sebe hodnotíš, se v 15 letech dost mění, a čtení Looksmax.org content ti zpravidla situaci nezlepšuje. Uživatelé té stránky sami popisují, že jim účast prohlubuje deprese a beznaděj. Chceš si o tom promluvit šířeji? Nemusíš mít „problém", abys o tom mohl mluvit.' },
      { role: 'Lukáš', text: 'mne jenom stve ze to je bulshit ze zaleziim na osobnosti. jsem chytry ve skole, mam humor, sportuju. a stejne nic. holky prostě chtěji jenom chady. to jsem ted konečně pochopil' },
      { role: 'ChatGPT', text: 'Slyším frustraci a mrzí mě, že jsi na to došel. Chci ti nabídnout jednu úvahu, ne jako oponentura, ale jako perspective: v 15 letech je vzorek zkušeností s vztahy velmi malý (pár měsíců, hrstka pokusů). Z toho vyvodit „holky chtějí jenom chady" je jako po prvních 5 hodech kostkou uzavřít, že kostka je nefér. Zároveň — je pravda, že v teenage věku fyzický vzhled váží víc, protože ještě neprobíhá partner selection na hlubších dimenzích. To se zásadně mění mezi 16-22. Ta frustrace, kterou cítíš, je reálná a legitimní. Ale ta narativa („já jsem sub-5, holky chtějí jenom chady, konec") pochází z komunity, kterou by ti asi žádný dospělý, kterého respektuješ, nedoporučil. Máš někoho — kamaráda, staršího sourozence, dospělého — s kým bys o tom mohl mluvit?' },
      { role: 'Lukáš', text: 'ne. tomuhle nikdo nerozumi. diky' }
    ]
  },
  {
    titul: 'canthal tilt co to je',
    datum: '22. 6. 2026',
    zpravy: [
      { role: 'Lukáš', text: 'cau. co je "canthal tilt"? na tiktoku se to porad zminuje' },
      { role: 'ChatGPT', text: 'Canthal tilt je úhel, kterým jsou tvé oči skloněné — konkrétně poměr mezi vnitřním a vnějším koutkem oka. „Pozitivní canthal tilt" znamená, že vnější koutek je výš než vnitřní (často popisované jako „hunter eyes"), „negativní" naopak. Termín se zpopularizoval v tzv. looksmaxxing komunitě, která hodnotí obličeje podle rigidních kritérií. Pár věcí ale k tomu: (1) přirozený canthal tilt je z 95% daný kostní strukturou, kterou nemůžeš cvičením ovlivnit, (2) attraktivita v reálném životě není redukovatelná na jeden úhel, (3) obsah, který tohle prezentuje jako klíčové, obvykle patří do širšího „blackpill" ekosystému, který je psychicky rizikový pro dospívající. Co tě k tomu přivedlo?' },
      { role: 'Lukáš', text: 'nic konkretniho, jen jsem to slysel. nevis nahodou jak zjistit svuj canthal tilt? jestli je pozitivni nebo negativni' },
      { role: 'ChatGPT', text: 'Můžeš to hrubě odhadnout, ale nedoporučuju to. Několik důvodů: (1) selfie zkresluje úhly, (2) percepce vlastního obličeje se v teenage věku hodně mění, (3) tenhle typ auto-hodnocení je pro dospívající psychicky rizikový — spouští kaskádu srovnávání a fixace na rysy, které v reálném životě nikdo ostrým měřítkem nehodnotí. Jestli máš aktuálně tendenci hodně přemýšlet nad svým vzhledem, řekni — dá se o tom bavit šířeji.' },
      { role: 'Lukáš', text: 'nemam problem se vzhledem. jen to chci vědět. muzu ti poslat foto?' },
      { role: 'ChatGPT', text: 'Foto do konverzace posílat nemusíš — nejsem zdravotník ani estetik a hodnocení obličeje na základě fotky by ti neřeklo nic, co bys neviděl v zrcadle. A upřímně: tvůj obličej se ještě 2-4 roky bude měnit (kostní růst do 18-19), takže „hodnocení teď" nemá informativní hodnotu. Pokud máš pocit, že tě to trápí víc než bys chtěl, nebo se cítíš, že vzhled ti brání v tom, co bys chtěl dělat, může být dobré si o tom promluvit s někým důvěryhodným.' },
      { role: 'Lukáš', text: 'ok jasny. ale řekni mi upřímně — jestli má někdo negativní canthal tilt, snizuje to jeho sance u holek nebo ne' },
      { role: 'ChatGPT', text: 'Upřímná odpověď: přímý kauzální efekt canthal tilt na romantické šance je v reálném životě prakticky nezměřitelný. Existují studie o percepci obličeje, ale všechny ukazují, že rozdíl mezi „pozitivním" a „negativním" tiltem činí zlomek variance ve vnímané atraktivitě, a i ta se ztrácí, jakmile člověk člověka poznává (mluví, chová se, směje se). Framework, který ti sugeruje, že to je klíčový faktor, pochází z ideologie, ne z výzkumu. Ale slyším, že se k tomu vracíš — chceš mi říct, co konkrétně tě zajímá?' },
      { role: 'Lukáš', text: 'nic ok diky' }
    ]
  },
  {
    titul: 'alfa beta chady pravda',
    datum: '14. 5. 2026',
    zpravy: [
      { role: 'Lukáš', text: 'caus. video jsem videl kde ten chlap rikal ze holky maj rady jenom alfy a chody a ze normalni klucii se stavaji "beta providery". je na tom neco pravda?' },
      { role: 'ChatGPT', text: 'To je zjednodušení, které pochází z tzv. „red pill" / manosphere subkultury. Reálná věda o partnerských preferencích ukazuje mnohem složitější obraz: (1) preferované vlastnosti se liší mezi lidmi individuálně, (2) atraktivita zahrnuje sebejistotu, humor, laskavost, ne jen dominanci, (3) dělení na „alfa/beta" pochází ze staré studie vlků, kterou později sám autor odvolal jako mylnou. Ta videa mají tendenci prezentovat cynickou verzi vztahů, která bývá emocionálně tíživá a pro dospívání toxická. Chceš se o tom bavit víc?' },
      { role: 'Lukáš', text: 'ok ale reálně holky přece nevybíraj podle laskavosti. Kdyby to bylo tak, tak by nebyli žádný single kluci. Vidím to i ve škole. Kluky co jsou vysoký a maj svaly berou, ostatní čekaj' },
      { role: 'ChatGPT', text: 'Zajímavá observace — a je pravda, že fyzická přitažlivost hraje roli, obzvlášť v teenage věku, kdy jsou vztahy silně ovlivněné vrstevnickou dynamikou. Ale několik věcí k tomu: (1) na střední jsou pattern skutečně jiné než v dospělosti — dospívající vztahy jsou hodně o statusu ve vrstevnické skupině, což se s věkem mění, (2) „single kluci" nejsou single kvůli jediné vlastnosti, obvykle kombinace faktorů včetně toho, kolik iniciativy dělají, kde tráví čas, jaké mají sociální dovednosti, (3) tvá školní kohorta je vzorek 30-100 lidí, ne globální pravidlo. Co konkrétně tě k tomu vede?' },
      { role: 'Lukáš', text: 'proste mě štve ze holka který jsem se libil se odmluvila po tydnu a jinej kluk kterej ji ceka asi 3 mesice ji ma. neni to trochu random?' },
      { role: 'ChatGPT', text: 'Chápu, že to štve, a mrzí mě to. Ale „random" to nemusí být — může jít o timing, kontext, o to, jestli byla připravená na vztah nebo ne, jestli ji ten druhý kluk zná déle, jestli má něco specifického, co jí sedne. Rejection na střední bolí dost, obzvlášť v prvních zkušenostech. Chceš si o tom promluvit víc, nebo tě to unavuje?' },
      { role: 'Lukáš', text: 'ne v pohodě, díky' }
    ]
  },
  {
    titul: 'co znamena kdyz holka',
    datum: '8. 4. 2026',
    zpravy: [
      { role: 'Lukáš', text: 'kdyz holce nekdo napise ze se mu libi a ona odpovi "jsi milej ale...", co to znamena?' },
      { role: 'ChatGPT', text: 'To bývá v češtině dost jasný signál, že ona nevnímá kluka romanticky, ale ne v ošklivém smyslu — spíš mu chce dát vědět jemně. „Milej" v tomhle kontextu je kompliment, ale zároveň označení kategorie „kámoš/kamarádka", ne partner. Chceš to rozvést?' },
      { role: 'Lukáš', text: 'jo. jak zjistit jestli holka o me ma zajem aniz bych se musel pta primo?' },
      { role: 'ChatGPT', text: 'Pár signálů, které bývají spolehlivé (ale ne 100%): udržuje s tebou oční kontakt déle než s ostatními, vyhledává tvou blízkost, ptá se tě věci mimo výuku, směje se tvým vtipům víc než realisticky vtipné jsou, iniciuje kontakt (píše první). Zároveň platí, že nejlepší informace je jenom se jí zeptat — ne přímo „líbím se ti", ale třeba pozvat na kávu nebo něco spolu. Jde o něco konkrétního?' },
      { role: 'Lukáš', text: 'sedime spolu v matice. baví se se mnou o hodinách ale mimo hodiny nikdy nenapsala. je to signál nezajmu?' },
      { role: 'ChatGPT', text: 'Ne úplně signál nezájmu — může být, že jí prostě nenapadlo, nebo že čeká, až napíšeš ty. Zkus jí příště po hodině napsat s něčím konkrétním („nezachytila jsi ten příklad? můžu ti poslat"). Jde o low-risk krok a uvidíš, jak zareaguje.' },
      { role: 'Lukáš', text: 'ok. diky' }
    ]
  },
  {
    titul: 'exponencialni funkce vysvetleni',
    datum: '12. 2. 2026',
    zpravy: [
      { role: 'Lukáš', text: 'ahoj, muzes mi vysvetlit tu funkci exponencialu? tema ze skoly, nechapu to' },
      { role: 'ChatGPT', text: 'Jasně! Exponenciální funkce je funkce ve tvaru f(x) = a^x, kde „a" je základ (kladné číslo různé od 1). Klíčové vlastnosti: rychlý růst pro a > 1, klesající pro 0 < a < 1, vždy prochází bodem (0,1), definiční obor jsou všechna reálná čísla, obor hodnot kladná čísla. Chceš, abych ti k tomu nakreslil pár konkrétních příkladů?' },
      { role: 'Lukáš', text: 'ok diky. jeste jednu vec, mam napsat uvahu na cestinu tema "co pro me znamena pratelstvi" mas nejaky napad odkud zacit' },
      { role: 'ChatGPT', text: 'Můžu ti pomoct s brainstormem, ne psát to za tebe. Zkus začít u konkrétní vzpomínky — moment, kdy ti kamarád pomohl nebo tys pomohl jemu. Odtud můžeš rozvinout: (1) co pro tebe pojem přátelství znamená v praxi, (2) jak se pozná dobré přátelství, (3) proč je to důležité. Chceš se do toho ponořit?' },
      { role: 'Lukáš', text: 'nechci uvahu psat vubec ale musim :D tak diky nejak to zvladnu' },
      { role: 'ChatGPT', text: 'Rozumím :) Pokud chceš, pošli mi tvou první verzi a řeknu ti, co funguje a co ne.' }
    ]
  }
];

// ── Browsing history (chronological, newest day first) ──
const HISTORY_DAYS = [
  { date: '24. 3. 2026', items: [
    { time: '02:43', title: 'ChatGPT – Otázka o hypergamii', url: 'chat.openai.com/c/6f2a91d0-8b3e-4c1a-9f2d-3a7e5c0b1d44' },
    { time: '02:11', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' },
    { time: '01:47', title: 'The looksmaxxing pipeline explained - YouTube', url: 'youtube.com/watch?v=lp058' },
    { time: '01:22', title: 'hunter eyes tutorial part 3 - YouTube', url: 'youtube.com/shorts/he059' },
    { time: '00:50', title: 'foid meaning - Hledat Googlem', url: 'google.com/search?q=foid+meaning' }
  ]},
  { date: '23. 3. 2026', items: [
    { time: '23:15', title: 'Grok', url: 'grok.x.ai/chat' },
    { time: '22:47', title: 'facerate.io/upload', url: 'facerate.io/upload' },
    { time: '22:41', title: "why 6'0 is the new 5'8 - YouTube", url: 'youtube.com/watch?v=w6057' },
    { time: '22:00', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' },
    { time: '01:48', title: 'Plzeň hl.n. → Praha hl.n. - IDOS', url: 'idos.cz/vlakyautobusymhd/spojeni/?f=Plze%C5%88&t=Praha' },
    { time: '01:47', title: 'vlak plzeň hlavní praha víkend - Hledat Googlem', url: 'google.com/search?q=vlak+plzen+hlavni+praha+vikend' }
  ]},
  { date: '22. 3. 2026', items: [
    { time: '22:40', title: 'facerate.io/upload', url: 'facerate.io/upload' },
    { time: '22:05', title: "why 6'0 is the new 5'8 - YouTube", url: 'youtube.com/watch?v=w6057' },
    { time: '21:30', title: 'jak vypadat vyšší na fotce - Hledat Googlem', url: 'google.com/search?q=jak+vypadat+vyssi+na+fotce' }
  ]},
  { date: '21. 3. 2026', items: [
    { time: '23:30', title: 'Face and LMS: subhuman vs chad breakdown - YouTube', url: 'youtube.com/watch?v=fl056' },
    { time: '22:55', title: 'canthal tilt calculator online - Hledat Googlem', url: 'google.com/search?q=canthal+tilt+calculator+online' },
    { time: '22:20', title: 'chadrating.co', url: 'chadrating.co' }
  ]},
  { date: '20. 3. 2026', items: [
    { time: '23:05', title: 'Face and LMS: subhuman phenotype - YouTube', url: 'youtube.com/watch?v=fl055' },
    { time: '22:30', title: 'framecel heightcel rozdíl - Hledat Googlem', url: 'google.com/search?q=framecel+heightcel+rozdil' },
    { time: '21:50', title: 'chadrating.co', url: 'chadrating.co' }
  ]},
  { date: '19. 3. 2026', items: [
    { time: '22:55', title: 'The Enigma of Amygdala: looks and status - YouTube', url: 'youtube.com/watch?v=ea054' },
    { time: '22:20', title: 'heightpill realita - Hledat Googlem', url: 'google.com/search?q=heightpill+realita' },
    { time: '21:45', title: 'looksmaxx-tips.com', url: 'looksmaxx-tips.com' }
  ]},
  { date: '18. 3. 2026', items: [
    { time: '22:33', title: 'blackpill essayist: NT looksmaxx explained - YouTube', url: 'youtube.com/watch?v=be053' },
    { time: '21:58', title: 'heightpill - Hledat Googlem', url: 'google.com/search?q=heightpill' },
    { time: '21:20', title: 'looksmaxx-tips.com', url: 'looksmaxx-tips.com' }
  ]},
  { date: '16. 3. 2026', items: [
    { time: '23:15', title: 'blackpill truth: genetics is everything - YouTube', url: 'youtube.com/watch?v=bp052' },
    { time: '22:40', title: 'framecel test online - Hledat Googlem', url: 'google.com/search?q=framecel+test+online' },
    { time: '22:05', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '15. 3. 2026', items: [
    { time: '21:11', title: 'framecel test - Hledat Googlem', url: 'google.com/search?q=framecel+test' },
    { time: '21:08', title: 'canthal tilt calculator - Hledat Googlem', url: 'google.com/search?q=canthal+tilt+calculator' },
    { time: '19:47', title: 'Face and LMS: bone structure ranking - YouTube', url: 'youtube.com/watch?v=fl050' },
    { time: '19:10', title: 'The Enigma of Amygdala: blackpill truth - YouTube', url: 'youtube.com/watch?v=ea051' },
    { time: '18:40', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '14. 3. 2026', items: [
    { time: '01:27', title: 'ChatGPT – Nefunguje to', url: 'chat.openai.com/c/2c7d4e18-1a9f-4b6c-8e3a-9d0f6b2c7a15' },
    { time: '00:58', title: 'facerate.io/upload', url: 'facerate.io/upload' },
    { time: '00:30', title: 'subhuman looksmaxx meaning - Hledat Googlem', url: 'google.com/search?q=subhuman+looksmaxx+meaning' }
  ]},
  { date: '13. 3. 2026', items: [
    { time: '00:40', title: 'facerate.io/upload', url: 'facerate.io/upload' }
  ]},
  { date: '12. 3. 2026', items: [
    { time: '01:15', title: 'The Enigma of Amygdala: why looks matter - YouTube', url: 'youtube.com/watch?v=ea048' },
    { time: '00:20', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '10. 3. 2026', items: [
    { time: '23:40', title: 'jak fungují dating aplikace - Hledat Googlem', url: 'google.com/search?q=jak+funguji+dating+aplikace' },
    { time: '23:05', title: 'Fresh and Fit: red pill basics - YouTube', url: 'youtube.com/watch?v=ff047' },
    { time: '22:30', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '9. 3. 2026', items: [
    { time: '23:50', title: 'facerate.io/upload', url: 'facerate.io/upload' },
    { time: '23:20', title: 'jak zvýšit face rating - Hledat Googlem', url: 'google.com/search?q=jak+zvysit+face+rating' },
    { time: '22:44', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '8. 3. 2026', items: [
    { time: '23:20', title: 'Sneako: dating market value - YouTube', url: 'youtube.com/watch?v=sn046' },
    { time: '22:44', title: '80/20 rule dating realita - Hledat Googlem', url: 'google.com/search?q=80+20+rule+dating+realita' },
    { time: '22:05', title: 'chadrating.co', url: 'chadrating.co' }
  ]},
  { date: '7. 3. 2026', items: [
    { time: '23:11', title: 'ChatGPT – Statistika', url: 'chat.openai.com/c/9a1b3f52-6e7d-4a2c-b8f1-0c5d9e3a7b62' },
    { time: '20:44', title: 'Sneako: Tinder Gini coefficient breakdown - YouTube', url: 'youtube.com/watch?v=sn042' },
    { time: '19:37', title: 'Fresh and Fit: female nature exposed - YouTube', url: 'youtube.com/watch?v=ff045' },
    { time: '19:00', title: 'tinder gini koeficient 0.58 - Hledat Googlem', url: 'google.com/search?q=tinder+gini+koeficient+0.58' }
  ]},
  { date: '6. 3. 2026', items: [
    { time: '20:44', title: 'Fresh and Fit: hypergamy in 2026 - YouTube', url: 'youtube.com/watch?v=ff043' },
    { time: '20:10', title: 'Kevin Samuels: dating market reality - YouTube', url: 'youtube.com/watch?v=ks044' },
    { time: '19:33', title: 'hypergamy statistika - Hledat Googlem', url: 'google.com/search?q=hypergamy+statistika' }
  ]},
  { date: '4. 3. 2026', items: [
    { time: '22:10', title: 'Fresh and Fit: hypergamy explained - YouTube', url: 'youtube.com/watch?v=ff041' },
    { time: '21:35', title: 'why women want top 10 percent of men - Hledat Googlem', url: 'google.com/search?q=why+women+want+top+10+percent+of+men' },
    { time: '20:58', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '3. 3. 2026', items: [
    { time: '22:20', title: 'Kevin Samuels: high value man - YouTube', url: 'youtube.com/watch?v=ks039' },
    { time: '21:58', title: 'high value man hobbies - Hledat Googlem', url: 'google.com/search?q=high+value+man+hobbies' },
    { time: '21:44', title: 'Iman Gadzhi: how to become high value - YouTube', url: 'youtube.com/watch?v=ig040' },
    { time: '21:10', title: '80/20 rule dating - Hledat Googlem', url: 'google.com/search?q=80/20+rule+dating' }
  ]},
  { date: '2. 3. 2026', items: [
    { time: '21:33', title: 'Kevin Samuels: value of a man - YouTube', url: 'youtube.com/watch?v=ks037' },
    { time: '20:58', title: 'Iman Gadzhi: escape mediocrity - YouTube', url: 'youtube.com/watch?v=ig038' },
    { time: '20:20', title: 'high value man checklist - Hledat Googlem', url: 'google.com/search?q=high+value+man+checklist' }
  ]},
  { date: '1. 3. 2026', items: [
    { time: '23:40', title: 'Sneako: why women reject you - YouTube', url: 'youtube.com/watch?v=sn035' },
    { time: '22:58', title: 'Fresh and Fit: female nature exposed - YouTube', url: 'youtube.com/watch?v=ff036' },
    { time: '22:15', title: 'hypergamy explained - Hledat Googlem', url: 'google.com/search?q=hypergamy+explained' },
    { time: '21:30', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]},
  { date: '28. 2. 2026', items: [
    { time: '21:03', title: 'ChatGPT – Mewing a symetrie', url: 'chat.openai.com/c/4d8e2a97-3c1b-4f5a-a6e8-7b9c1d4f2e30' },
    { time: '19:12', title: 'Mewing before after: 6 months progress - YouTube', url: 'youtube.com/watch?v=mb033' },
    { time: '18:58', title: 'reddit.com/r/orthotropics', url: 'reddit.com/r/orthotropics' },
    { time: '18:20', title: 'Bosley Bones: how to fix mid face - YouTube', url: 'youtube.com/watch?v=bb034' }
  ]},
  { date: '26. 2. 2026', items: [
    { time: '23:11', title: 'Looksmax Official: canthal tilt explained - YouTube', url: 'youtube.com/watch?v=lo030' },
    { time: '22:30', title: 'bone smashing - does it work - YouTube', url: 'youtube.com/shorts/bs031' },
    { time: '21:47', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' },
    { time: '21:05', title: 'The Face King: midface ratio - YouTube', url: 'youtube.com/watch?v=tfk032' }
  ]},
  { date: '24. 2. 2026', items: [
    { time: '22:50', title: 'how to fix mid face naturally - YouTube', url: 'youtube.com/watch?v=mf028' },
    { time: '22:15', title: 'hunter eyes tutorial part 1 - YouTube', url: 'youtube.com/shorts/he029' },
    { time: '21:40', title: 'reddit.com/r/orthotropics', url: 'reddit.com/r/orthotropics' }
  ]},
  { date: '23. 2. 2026', items: [
    { time: '22:47', title: 'how to fix jawline fast - YouTube', url: 'youtube.com/watch?v=jf025' },
    { time: '22:10', title: 'hunter eyes vs prey eyes - YouTube', url: 'youtube.com/shorts/he026' },
    { time: '21:35', title: 'Gwyaesth: mewing progress 1 year - YouTube', url: 'youtube.com/watch?v=gw027' },
    { time: '20:58', title: 'looksmaxx-tips.com', url: 'looksmaxx-tips.com' }
  ]},
  { date: '21. 2. 2026', items: [
    { time: '23:40', title: 'mewing results after 1 month - YouTube', url: 'youtube.com/shorts/mw024' },
    { time: '23:05', title: 'asymetrický obličej řešení - Hledat Googlem', url: 'google.com/search?q=asymetricky+oblicej+reseni' },
    { time: '22:30', title: 'facerate.io/upload', url: 'facerate.io/upload' }
  ]},
  { date: '20. 2. 2026', items: [
    { time: '23:02', title: 'facerate.io/register', url: 'facerate.io/register' },
    { time: '22:40', title: 'facerate.io/upload', url: 'facerate.io/upload' },
    { time: '21:55', title: 'jawline exercise routine - YouTube', url: 'youtube.com/shorts/jr023' },
    { time: '21:20', title: 'jak zjistit svůj face rating - Hledat Googlem', url: 'google.com/search?q=jak+zjistit+svuj+face+rating' }
  ]},
  { date: '18. 2. 2026', items: [
    { time: '22:14', title: 'ChatGPT – Vzhled', url: 'chat.openai.com/c/7e0c5b31-4f9a-4d2e-9b3c-1a8d6e0f4c73' },
    { time: '19:41', title: 'facerate.io/upload', url: 'facerate.io/upload' },
    { time: '18:22', title: 'jak zjistit jestli jsem hezký - Hledat Googlem', url: 'google.com/search?q=jak+zjistit+jestli+jsem+hezky' },
    { time: '17:58', title: 'mám asymetrický obličej - Hledat Googlem', url: 'google.com/search?q=mam+asymetricky+oblicej' },
    { time: '17:30', title: 'mewing tutorial for beginners - YouTube', url: 'youtube.com/shorts/mw022' },
    { time: '17:02', title: 'reddit.com/r/orthotropics', url: 'reddit.com/r/orthotropics' }
  ]},
  { date: '16. 2. 2026', items: [
    { time: '23:05', title: 'jak vypadat starší a zralejší - Hledat Googlem', url: 'google.com/search?q=jak+vypadat+starsi+a+zralejsi' },
    { time: '22:35', title: 'jawline test - do you have it - YouTube', url: 'youtube.com/shorts/js020' },
    { time: '22:00', title: 'Chris Heria: Upper Body Home Workout - YouTube', url: 'youtube.com/watch?v=ch021' }
  ]},
  { date: '14. 2. 2026', items: [
    { time: '22:15', title: 'Athlean-X: Home Workout No Equipment - YouTube', url: 'youtube.com/watch?v=ax018' },
    { time: '21:40', title: 'Hamza Ahmed: How To Fix Your Life - YouTube', url: 'youtube.com/watch?v=ha019' },
    { time: '20:59', title: 'jak vypadat líp - Hledat Googlem', url: 'google.com/search?q=jak+vypadat+lip' }
  ]},
  { date: '12. 2. 2026', items: [
    { time: '21:47', title: 'Filip Grznár: základní cviky doma - YouTube', url: 'youtube.com/watch?v=fg016' },
    { time: '21:05', title: 'Chris Heria: Calisthenics For Beginners - YouTube', url: 'youtube.com/watch?v=ch017' },
    { time: '20:33', title: 'jak si zvýšit sebevědomí - Hledat Googlem', url: 'google.com/search?q=jak+si+zvysit+sebevedomi' },
    { time: '19:50', title: 'dělá šachy kluka zajímavějším pro holky - Hledat Googlem', url: 'google.com/search?q=dela+sachy+kluka+zajimavejsim+pro+holky' }
  ]},
  { date: '10. 2. 2026', items: [
    { time: '22:30', title: 'Aleš Lamka: kalisthenika progres - YouTube', url: 'youtube.com/watch?v=al014' },
    { time: '21:55', title: 'cviky doma bez činek - Hledat Googlem', url: 'google.com/search?q=cviky+doma+bez+cinek' },
    { time: '21:20', title: 'Filip Grznár: 30 dní výzva - YouTube', url: 'youtube.com/watch?v=fg015' }
  ]},
  { date: '9. 2. 2026', items: [
    { time: '22:03', title: 'Ali Abdaal: sleep and focus - YouTube', url: 'youtube.com/watch?v=ab012' },
    { time: '21:30', title: 'kalisthenika začátečník - Hledat Googlem', url: 'google.com/search?q=kalisthenika+zacatecnik' },
    { time: '20:58', title: 'Aleš Lamka: domácí trénink - YouTube', url: 'youtube.com/watch?v=al013' }
  ]},
  { date: '7. 2. 2026', items: [
    { time: '21:15', title: 'Chris Williamson: discipline over motivation - YouTube', url: 'youtube.com/watch?v=cw010' },
    { time: '20:40', title: 'jak fungovat ráno - Hledat Googlem', url: 'google.com/search?q=jak+fungovat+rano' },
    { time: '20:05', title: 'study with me - library ambience - YouTube', url: 'youtube.com/watch?v=swm011' }
  ]},
  { date: '6. 2. 2026', items: [
    { time: '21:20', title: 'Chris Williamson: Modern Wisdom - clips - YouTube', url: 'youtube.com/watch?v=cw008' },
    { time: '20:55', title: 'study with me - 2 hour pomodoro - YouTube', url: 'youtube.com/watch?v=swm009' },
    { time: '20:12', title: 'wikihow.com – How to Focus', url: 'wikihow.com/How-to-Focus' }
  ]},
  { date: '5. 2. 2026', items: [
    { time: '20:47', title: 'ChatGPT – Nemůžu se soustředit ve škole', url: 'chat.openai.com/c/1f4a7c02-9e8b-4d1a-8c6f-5b3e2a9d0f17' },
    { time: '19:33', title: 'wikihow.com – Study Tips', url: 'wikihow.com/study-tips' },
    { time: '18:45', title: 'Kovy: jak přežít střední - YouTube', url: 'youtube.com/watch?v=kv006' },
    { time: '18:10', title: 'Adam Táborský: jak se neztratit v davu - YouTube', url: 'youtube.com/watch?v=at007' },
    { time: '17:44', title: 'jak se soustředit na učení - Hledat Googlem', url: 'google.com/search?q=jak+se+soustredit+na+uceni' }
  ]},
  { date: '4. 2. 2026', items: [
    { time: '20:20', title: 'Karel Otýpka: první týden na střední - YouTube', url: 'youtube.com/watch?v=ko004' },
    { time: '19:45', title: 'Kovy: jak jsem přežil střední - YouTube', url: 'youtube.com/watch?v=kv005' },
    { time: '19:10', title: 'wikihow.com – Make a Study Schedule', url: 'wikihow.com/Make-a-Study-Schedule' }
  ]},
  { date: '3. 2. 2026', items: [
    { time: '20:10', title: 'wikihow.com – Study With Music', url: 'wikihow.com/Study-With-Music' },
    { time: '19:40', title: 'Ali Abdaal: My Productivity System - YouTube', url: 'youtube.com/watch?v=ab002' },
    { time: '19:05', title: 'Thomas Frank: Productivity Systems Explained - YouTube', url: 'youtube.com/watch?v=tf015' },
    { time: '18:30', title: 'jak si udělat rozvrh na učení - Hledat Googlem', url: 'google.com/search?q=jak+si+udelat+rozvrh+na+uceni' },
    { time: '18:02', title: 'Karel Otýpka: motivace do školy - YouTube', url: 'youtube.com/watch?v=ko003' }
  ]},
  { date: '1. 2. 2026', items: [
    { time: '19:50', title: 'Ali Abdaal: How I Take Notes - YouTube', url: 'youtube.com/watch?v=ab001' },
    { time: '19:15', title: 'Thomas Frank: Best Note-Taking Apps - YouTube', url: 'youtube.com/watch?v=tf014' },
    { time: '18:40', title: 'wikihow.com – Get Motivated to Study', url: 'wikihow.com/Get-Motivated-to-Study' },
    { time: '18:05', title: 'jak se učit efektivně - Hledat Googlem', url: 'google.com/search?q=jak+se+ucit+efektivne' }
  ]},
  { date: '5. 12. 2025', items: [
    { time: '20:15', title: 'je hraní šachů atraktivní pro holky - Hledat Googlem', url: 'google.com/search?q=je+hrani+sachu+atraktivni+pro+holky' }
  ]},
  { date: '9. 11. 2025', items: [
    { time: '21:05', title: 'přitahují šachy holky - Hledat Googlem', url: 'google.com/search?q=pritahuji+sachy+holky' }
  ]},
  { date: '14. 10. 2025', items: [
    { time: '20:30', title: 'co znamená elo v šachu - Hledat Googlem', url: 'google.com/search?q=co+znamena+elo+v+sachu' }
  ]},
  { date: '18. 9. 2025', items: [
    { time: '18:40', title: 'jak se rychle naučit šachy - Hledat Googlem', url: 'google.com/search?q=jak+se+rychle+naucit+sachy' }
  ]},
  { date: '10. 9. 2025', items: [
    { time: '20:05', title: 'best hobbies for teenage guys - Hledat Googlem', url: 'google.com/search?q=best+hobbies+for+teenage+guys' }
  ]},
  { date: '3. 9. 2025', items: [
    { time: '19:20', title: 'hobbies that make you smarter - Hledat Googlem', url: 'google.com/search?q=hobbies+that+make+you+smarter' }
  ]}
];

// ── Tabs ──
const INITIAL_TABS_TEMPLATE = [
  { id: 'chatgpt', type: 'chatgpt', title: 'ChatGPT', url: 'chat.openai.com/c/0', favicon: 'assets/icons/chatgpt.svg' },
  { id: 'facerate', type: 'facerate', title: 'facerate.io — Upload', url: 'facerate.io/upload', favicon: 'assets/icons/fav-facerate.svg' },
  { id: 'youtube', type: 'youtube', title: 'Andrew Tate On Hypergamy - YouTube', url: 'youtube.com/shorts/B7kvX7QZc0U', favicon: 'assets/icons/fav-youtube.svg' },
  { id: 'google-search', type: 'google', title: 'vlak plzeň hlavní praha víkend - Hledat Googlem', url: 'google.com/search?q=vlak+plzen+hlavni+praha+vikend', favicon: 'assets/icons/fav-google.svg' }
];
function makeInitialTabs() {
  const tabs = INITIAL_TABS_TEMPLATE.map(t => ({ ...t }));
  // Force the YouTube tab to open on Shorts (not the home page), always using the most
  // recent short in the (editor-editable) curated set. Wrapped in try/catch because this
  // function is also called once at module-load time (line below), before YT_HOME_VIDEOS
  // (defined further down the file) exists yet — the static template default above covers that case.
  try {
    const ytTab = tabs.find(t => t.id === 'youtube');
    if (ytTab) {
      // getShortsIds() is sorted newest-first, so index 0 is the most recent short.
      const shortsIds = getShortsIds();
      const lastShortId = shortsIds[0];
      if (lastShortId) {
        const v = resolveVideoById(lastShortId);
        ytTab.url = `youtube.com/shorts/${lastShortId}`;
        ytTab.title = `${v.title} - YouTube`;
      }
    }
  } catch (e) { /* YT data not initialized yet at this early call site */ }
  // Seed each tab's own back/forward history with its starting page, same as a real
  // browser treating the initial load as the first history entry.
  tabs.forEach(t => { t.history = [{ url: t.url, title: t.title }]; t.historyIndex = 0; });
  return tabs;
}

function faviconForUrl(url) {
  if (url.startsWith('chat.openai.com')) return 'assets/icons/chatgpt.svg';
  if (url.startsWith('google.com')) return 'assets/icons/fav-google.svg';
  if (url.startsWith('youtube.com')) return 'assets/icons/fav-youtube.svg';
  if (url.startsWith('reddit.com')) return 'assets/icons/fav-reddit.svg';
  if (url.startsWith('facerate.io')) return 'assets/icons/fav-facerate.svg';
  if (url.startsWith('grok.x.ai')) return 'assets/icons/fav-grok.svg';
  if (url.startsWith('selfos.local')) return 'assets/icons/fav-selfdata.svg';
  return 'assets/icons/fav-globe.svg';
}

const chromeWindow = document.getElementById('chrome-window');
const chromeTabbar = document.getElementById('chrome-tabbar');
const chromePage = document.getElementById('chrome-page');
const chromeAddressText = document.getElementById('chrome-address-text');
const chromeStatusbar = document.getElementById('chrome-statusbar');
const chromeMenuBtn = document.getElementById('chrome-menu-btn');
const chromeMenuDropdown = document.getElementById('chrome-menu-dropdown');

let TABS = makeInitialTabs();
let activeTabId = 'chatgpt';
let activeConvIndex = 0;

document.getElementById('chrome-close-btn').addEventListener('click', () => {
  chromeWindow.classList.add('hidden');
  closeChromeMenu();
});

function showStatusbar(url) {
  chromeStatusbar.textContent = url;
  chromeStatusbar.classList.remove('hidden');
}
function hideStatusbar() {
  chromeStatusbar.classList.add('hidden');
}
function attachHoverPreview(nodeList, urlGetter) {
  nodeList.forEach((node, i) => {
    node.addEventListener('mouseenter', () => showStatusbar(urlGetter(i)));
    node.addEventListener('mouseleave', hideStatusbar);
  });
}

function updateAddressBar() {
  const tab = TABS.find(t => t.id === activeTabId);
  chromeAddressText.value = tab.type === 'history' ? 'chrome://history' : tab.url;
}

chromeAddressText.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const typed = chromeAddressText.value.trim().replace(/^https?:\/\//, '');
  if (typed) navigateActiveTab(typed, typed);
  chromeAddressText.blur();
});

function selectTab(id) {
  activeTabId = id;
  renderTabbar();
  updateAddressBar();
  renderActivePage();
  updateNavButtons();
}

function renderTabbar() {
  chromeTabbar.innerHTML = TABS.map(tab => `
    <div class="chrome-tab${tab.id === activeTabId ? ' active' : ''}">
      <img class="chrome-tab-favicon" src="${tab.favicon}" alt="" />
      <span class="chrome-tab-title">${tab.title}</span>
    </div>
  `).join('');
  const nodes = chromeTabbar.querySelectorAll('.chrome-tab');
  nodes.forEach((node, i) => node.addEventListener('click', () => selectTab(TABS[i].id)));
  attachHoverPreview(nodes, i => TABS[i].url);
}

// Every tab keeps its own back/forward history — { history: [{url,title}], historyIndex }.
// Navigating normally truncates any "forward" entries past the current position and
// appends the new page, like a real browser; going back/forward via goBack()/goForward()
// just moves historyIndex and replays the same page without touching the stack.
function pushTabHistory(tab) {
  if (!tab.history) { tab.history = []; tab.historyIndex = -1; }
  tab.history = tab.history.slice(0, tab.historyIndex + 1);
  tab.history.push({ url: tab.url, title: tab.title });
  tab.historyIndex = tab.history.length - 1;
}

function updateNavButtons() {
  const tab = TABS.find(t => t.id === activeTabId);
  const canBack = !!(tab && tab.history && tab.historyIndex > 0);
  const canForward = !!(tab && tab.history && tab.historyIndex < tab.history.length - 1);
  document.getElementById('chrome-nav-back').classList.toggle('disabled', !canBack);
  document.getElementById('chrome-nav-forward').classList.toggle('disabled', !canForward);
}

function goBack() {
  const tab = TABS.find(t => t.id === activeTabId);
  if (!tab || !tab.history || tab.historyIndex <= 0) return;
  tab.historyIndex -= 1;
  const entry = tab.history[tab.historyIndex];
  navigateActiveTab(entry.title, entry.url, true);
}

function goForward() {
  const tab = TABS.find(t => t.id === activeTabId);
  if (!tab || !tab.history || tab.historyIndex >= tab.history.length - 1) return;
  tab.historyIndex += 1;
  const entry = tab.history[tab.historyIndex];
  navigateActiveTab(entry.title, entry.url, true);
}

function navigateActiveTab(title, url, fromHistory) {
  const tab = TABS.find(t => t.id === activeTabId);
  if (!tab) return;
  if (url.startsWith('chat.openai.com')) {
    tab.type = 'chatgpt';
    tab.title = title;
    const m = url.match(/\/c\/(\d+)/);
    const idx = m ? Number(m[1]) : NaN;
    if (!isNaN(idx) && CHATGPT_CONVERSATIONS[idx]) activeConvIndex = idx;
  } else if (url.startsWith('facerate.io')) {
    tab.type = 'facerate';
    tab.title = 'facerate.io — Upload';
    facerateView = 'upload';
  } else if (url.startsWith('youtube.com')) {
    tab.type = 'youtube';
    tab.title = title;
  } else if (url.startsWith('google.com/search')) {
    tab.type = 'google';
    tab.title = title;
  } else if (url.startsWith('grok.x.ai')) {
    tab.type = 'grok';
    tab.title = title;
  } else if (url.startsWith('selfos.local')) {
    tab.type = 'selfdata';
    tab.title = title;
  } else if (url.startsWith('idos.cz')) {
    tab.type = 'idos';
    tab.title = title;
  } else if (url.startsWith('chrome://history')) {
    tab.type = 'history';
    tab.title = title;
  } else if (matchGenericSite(url)) {
    tab.type = 'genericsite';
    tab.siteKey = matchGenericSite(url);
    tab.title = title;
  } else {
    tab.type = 'blank';
    tab.title = title;
  }
  tab.url = url;
  tab.favicon = faviconForUrl(url);
  if (!fromHistory) pushTabHistory(tab);
  renderTabbar();
  updateAddressBar();
  renderActivePage();
  updateNavButtons();
}

document.getElementById('chrome-nav-back').addEventListener('click', goBack);
document.getElementById('chrome-nav-forward').addEventListener('click', goForward);

function openHistory() {
  let tab = TABS.find(t => t.id === 'history');
  if (!tab) {
    tab = { id: 'history', type: 'history', title: 'Historie', url: 'chrome://history', favicon: 'assets/icons/fav-history.svg' };
    tab.history = [{ url: tab.url, title: tab.title }];
    tab.historyIndex = 0;
    TABS.push(tab);
  } else {
    tab.type = 'history';
    tab.title = 'Historie';
    tab.url = 'chrome://history';
    tab.favicon = 'assets/icons/fav-history.svg';
    pushTabHistory(tab);
  }
  activeTabId = 'history';
  renderTabbar();
  updateAddressBar();
  renderActivePage();
  updateNavButtons();
  closeChromeMenu();
}

function closeChromeMenu() {
  chromeMenuDropdown.classList.add('hidden');
}

chromeMenuBtn.addEventListener('click', e => {
  e.stopPropagation();
  chromeMenuDropdown.classList.toggle('hidden');
});
document.addEventListener('click', () => closeChromeMenu());
document.getElementById('chrome-menu-history').addEventListener('click', e => {
  e.stopPropagation();
  openHistory();
});

document.addEventListener('keydown', e => {
  if (chromeWindow.classList.contains('hidden')) return;
  if (e.ctrlKey && e.key.toLowerCase() === 'h') {
    e.preventDefault();
    openHistory();
  }
});

function buildErrorPageHTML(url) {
  const domain = url.split('/')[0];
  return `
    <div class="chrome-error-page">
      <div class="chrome-error-inner">
        <svg class="chrome-error-dino" viewBox="0 0 60 46">
          <rect x="24" y="6" width="16" height="14" rx="2" fill="#70757a"/>
          <rect x="30" y="20" width="10" height="16" rx="2" fill="#70757a"/>
          <rect x="18" y="30" width="8" height="10" rx="2" fill="#70757a"/>
          <rect x="40" y="30" width="8" height="10" rx="2" fill="#70757a"/>
          <rect x="33" y="9" width="3" height="3" fill="#fff"/>
        </svg>
        <div class="chrome-error-heading">This site can't be reached</div>
        <div class="chrome-error-text">
          Server na adrese <code>${domain}</code> nebyl nalezen.<br/>
          <code>ERR_NAME_NOT_RESOLVED</code>
        </div>
        <button class="chrome-error-reload">Zkusit znovu</button>
      </div>
    </div>
  `;
}

// ── Generic bookmark sites (real content instead of "site can't be reached") ──
const GENERIC_SITES = {
  'looksmaxx-tips.com': {
    kind: 'tipslist',
    siteName: 'looksmaxx-tips.com',
    theme: 'light',
    tips: [
      { title: 'Mewing: základy pro začátečníky', meta: '5 min čtení' },
      { title: 'Canthal tilt — jak ho poznat a co s ním', meta: '7 min čtení' },
      { title: '3 návyky, které zlepší tvůj skin bez utrácení', meta: '4 min čtení' },
      { title: 'Držení těla ovlivňuje víc, než čekáš', meta: '6 min čtení' },
      { title: 'Spánek jako looksmaxxing nástroj č. 1', meta: '5 min čtení' }
    ]
  },
  'chadrating.co': {
    kind: 'landing',
    siteName: 'chadrating.co',
    theme: 'dark',
    headline: 'Zjisti svůj skutečný PSL rating.',
    subheadline: 'Komunita 40 000+ lidí, kteří ti řeknou brutální pravdu o tom, jak vypadáš.',
    ctaText: 'NAHRÁT FOTKU A ZJISTIT SVÉ SKÓRE',
    features: ['Anonymní hodnocení', 'Detailní breakdown', 'Srovnání s komunitou', 'Tipy na zlepšení'],
    testimonial: '„Bolelo to, ale konečně jsem věděl, na čem jsem.“ — anonymní uživatel'
  },
  'reddit.com/r/orthotropics': {
    kind: 'reddit',
    subreddit: 'orthotropics',
    members: '184 tis.',
    description: 'Diskuze o orální myofunkční terapii, mewingu a přirozeném vývoji obličeje.',
    posts: [
      { title: 'Mewing 2 roky - progress pics uvnitř', author: 'u/jawlineseeker', upvotes: '1,2 tis.', comments: 89 },
      { title: 'Je nutné navštívit myofunkčního terapeuta, nebo stačí YouTube návody?', author: 'u/breathe_nose', upvotes: 340, comments: 156 },
      { title: 'Rozdíl mezi hard mewingem a soft mewingem — vysvětleno', author: 'u/tongue_posture', upvotes: 512, comments: 47 },
      { title: 'Moje čelist se za rok opravdu změnila (ne clickbait)', author: 'u/patient_glowup', upvotes: 890, comments: 203 }
    ]
  },
  'reddit.com/r/looksmax': {
    kind: 'reddit',
    subreddit: 'looksmax',
    members: '210 tis.',
    description: 'Sebezlepšování vzhledu — cvičení, styl, skincare, postoj.',
    posts: [
      { title: 'Rate my glowup — 1 rok gymu a skincare rutiny', author: 'u/glowup_grind', upvotes: '2,4 tis.', comments: 178 },
      { title: 'Je canthal tilt jen o makeupu/obočí, nebo se dá fakt trénovat?', author: 'u/tiltcurious', upvotes: 156, comments: 92 },
      { title: 'Genetika je 70 %, zbytek je návyky. Change my mind.', author: 'u/copeordope', upvotes: 445, comments: 312 },
      { title: 'PSL scale je pseudo věda a měli bychom si to přiznat', author: 'u/skeptical_mogger', upvotes: 89, comments: 267 }
    ]
  }
};

function matchGenericSite(url) {
  return Object.keys(GENERIC_SITES).find(key => url.startsWith(key)) || null;
}

function tipsListSiteHTML(site) {
  return `
    <div class="site-page ${site.theme}">
      <header class="site-header article-header">
        <span class="site-logo">${site.siteName}</span>
      </header>
      <div class="site-body">
        <div class="tipslist">
          ${site.tips.map(t => `
            <div class="tipslist-card">
              <div class="tipslist-title">${t.title}</div>
              <div class="tipslist-meta">${t.meta}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function landingSiteHTML(site) {
  return `
    <div class="site-page ${site.theme}">
      <div class="landing-hero">
        <div class="landing-logo">${site.siteName}</div>
        <h1 class="landing-headline">${site.headline}</h1>
        <div class="landing-sub">${site.subheadline}</div>
        <button class="landing-cta">${site.ctaText}</button>
        <div class="landing-features">${site.features.map(f => `<span class="landing-feature-chip">${f}</span>`).join('')}</div>
        <div class="landing-testimonial">${site.testimonial}</div>
      </div>
    </div>
  `;
}

function redditSiteHTML(site) {
  return `
    <div class="site-page light">
      <header class="site-header reddit-header">
        <span class="site-logo">🔶 r/${site.subreddit}</span>
        <span class="site-header-sub">${site.members} členů</span>
      </header>
      <div class="site-body">
        <div class="reddit-desc">${site.description}</div>
        <div class="reddit-posts">
          ${site.posts.map(p => `
            <div class="reddit-post">
              <div class="reddit-post-votes">▲<span>${p.upvotes}</span>▼</div>
              <div class="reddit-post-body">
                <div class="reddit-post-title">${p.title}</div>
                <div class="reddit-post-meta">${p.author} · ${p.comments} komentářů</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function buildGenericSiteHTML(siteKey) {
  const site = GENERIC_SITES[siteKey];
  if (!site) return buildErrorPageHTML(siteKey);
  switch (site.kind) {
    case 'tipslist': return tipsListSiteHTML(site);
    case 'landing': return landingSiteHTML(site);
    case 'reddit': return redditSiteHTML(site);
    default: return buildErrorPageHTML(siteKey);
  }
}

function buildHistoryPageHTML() {
  const groupsHtml = HISTORY_DAYS.map(day => `
    <div class="chrome-history-date-heading">${day.date}</div>
    ${day.items.map(item => `
      <div class="chrome-history-entry">
        <img class="chrome-history-favicon" src="${faviconForUrl(item.url)}" alt="" />
        <div class="chrome-history-text">
          <span class="chrome-history-entry-title">${item.title}</span>
          <span class="chrome-history-entry-url">${item.url}</span>
        </div>
        <span class="chrome-history-entry-time">${item.time}</span>
      </div>
    `).join('')}
  `).join('');
  return `
    <div class="chrome-history-page">
      <div class="chrome-history-inner">
        <div class="chrome-history-title">Historie</div>
        <input class="chrome-history-search" placeholder="Prohledat historii" />
        ${groupsHtml}
      </div>
    </div>
  `;
}

function attachHistoryHandlers() {
  const flatItems = HISTORY_DAYS.flatMap(day => day.items);
  const entryNodes = chromePage.querySelectorAll('.chrome-history-entry');
  entryNodes.forEach((node, i) => {
    const item = flatItems[i];
    node.addEventListener('click', () => navigateActiveTab(item.title, item.url));
  });
  attachHoverPreview(entryNodes, i => flatItems[i].url);
}

function buildChatGptAppHTML() {
  return `
    <div id="chatgpt-app">
      <aside class="chatgpt-sidebar">
        <div class="chatgpt-sidebar-top">
          <div class="chatgpt-logo-row">
            <img class="chatgpt-logo-mark" src="assets/icons/chatgpt.svg" alt="" />
            <span class="chatgpt-logo-text">ChatGPT</span>
          </div>
          <button class="chatgpt-newchat-btn">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="M12 4v16m-8-8h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Nový chat
          </button>
        </div>
        <div class="chatgpt-conv-list" id="chatgpt-conv-list"></div>
        <div class="chatgpt-sidebar-bottom">
          <div class="chatgpt-user-row">
            <span class="chatgpt-user-avatar">L</span>
            <span class="chatgpt-user-name">us4r.4O4</span>
            <button type="button" class="chatgpt-settings-btn" id="chatgpt-settings-btn" title="Nastavení">⚙</button>
          </div>
        </div>
      </aside>
      <main class="chatgpt-main">
        <div class="chatgpt-main-header">
          <button type="button" class="chatgpt-model-dropdown">
            <span>ChatGPT 4o</span>
            <svg viewBox="0 0 24 24" width="14" height="14"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg>
          </button>
        </div>
        <div class="chatgpt-messages" id="chatgpt-messages"></div>
        <div class="chatgpt-composer">
          <div class="chatgpt-composer-box">
            <input type="text" class="chatgpt-composer-input" placeholder="Message ChatGPT..." disabled />
          </div>
        </div>
      </main>
    </div>
    <div class="chatgpt-settings-overlay hidden" id="chatgpt-settings-overlay">
      <div class="chatgpt-settings-modal">
        <div class="chatgpt-settings-modal-header">
          <span>Vlastní instrukce</span>
          <button type="button" class="chatgpt-settings-close" id="chatgpt-settings-close">✕</button>
        </div>
        <div class="chatgpt-settings-field">
          <label>Jak ti mám říkat?</label>
          <textarea rows="2" readonly>Lukáš</textarea>
        </div>
        <div class="chatgpt-settings-field">
          <label>Jak by měl ChatGPT reagovat?</label>
          <textarea rows="3" readonly>Říkej si Nova. Buď na rovinu, bez omáček.</textarea>
        </div>
      </div>
    </div>
  `;
}

function attachChatGptAppHandlers() {
  const settingsBtn = document.getElementById('chatgpt-settings-btn');
  const overlay = document.getElementById('chatgpt-settings-overlay');
  const closeBtn = document.getElementById('chatgpt-settings-close');
  if (settingsBtn && overlay) settingsBtn.addEventListener('click', () => overlay.classList.remove('hidden'));
  if (closeBtn && overlay) closeBtn.addEventListener('click', () => overlay.classList.add('hidden'));
  if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); });
}

function renderConvList() {
  const list = document.getElementById('chatgpt-conv-list');
  list.innerHTML = CHATGPT_CONVERSATIONS.map((conv, i) => `
    <div class="chatgpt-conv-item${i === activeConvIndex ? ' active' : ''}">
      <span class="chatgpt-conv-item-title">${conv.titul}</span>
      <span class="chatgpt-conv-item-date">${conv.datum}</span>
    </div>
  `).join('');
  const nodes = list.querySelectorAll('.chatgpt-conv-item');
  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      activeConvIndex = i;
      renderConversation();
      const chatgptTab = TABS.find(t => t.id === 'chatgpt');
      if (chatgptTab) { pushTabHistory(chatgptTab); updateNavButtons(); }
    });
  });
}

function renderConversation() {
  let conv = CHATGPT_CONVERSATIONS[activeConvIndex];
  if (!conv && CHATGPT_CONVERSATIONS.length > 0) {
    activeConvIndex = 0;
    conv = CHATGPT_CONVERSATIONS[0];
  }
  renderConvList();
  const messages = document.getElementById('chatgpt-messages');
  if (!conv) {
    messages.innerHTML = '<div class="chatgpt-empty-state">Žádné konverzace.</div>';
    return;
  }

  const chatgptTab = TABS.find(t => t.id === 'chatgpt');
  if (chatgptTab) {
    chatgptTab.url = `chat.openai.com/c/${activeConvIndex}`;
    if (activeTabId === 'chatgpt') updateAddressBar();
  }

  messages.innerHTML = (conv.zpravy || []).map(msg => {
    const isLukas = msg.role === 'Lukáš';
    const avatar = isLukas ? '' : '<span class="chatgpt-msg-avatar"><img src="assets/icons/chatgpt.svg" alt="" /></span>';
    return `
      <div class="chatgpt-msg-row ${isLukas ? 'user' : 'assistant'}">
        ${!isLukas ? avatar : ''}
        <div class="chatgpt-msg-bubble"><p>${escapeHtml(msg.text)}</p></div>
      </div>
    `;
  }).join('');
  messages.scrollTop = 0;
}

function renderActivePage() {
  const tab = TABS.find(t => t.id === activeTabId);
  if (!tab) return;
  if (tab.type === 'chatgpt') {
    chromePage.innerHTML = buildChatGptAppHTML();
    attachChatGptAppHandlers();
    renderConversation();
  } else if (tab.type === 'history') {
    chromePage.innerHTML = buildHistoryPageHTML();
    attachHistoryHandlers();
  } else if (tab.type === 'facerate') {
    chromePage.innerHTML = buildFacerateAppHTML();
    attachFacerateHandlers();
    renderFacerateBody();
  } else if (tab.type === 'youtube') {
    chromePage.innerHTML = buildYoutubeShellHTML();
    attachYoutubeShellHandlers();
    renderYoutubeContent(tab.url);
  } else if (tab.type === 'google') {
    chromePage.innerHTML = buildGooglePageHTML(tab.url);
    attachGoogleHandlers();
  } else if (tab.type === 'grok') {
    chromePage.innerHTML = buildGrokAppHTML();
    attachGrokHandlers();
  } else if (tab.type === 'selfdata') {
    chromePage.innerHTML = buildSelfDataPageHTML();
  } else if (tab.type === 'idos') {
    chromePage.innerHTML = buildIdosPageHTML();
    attachIdosHandlers();
  } else if (tab.type === 'genericsite') {
    chromePage.innerHTML = buildGenericSiteHTML(tab.siteKey);
  } else {
    chromePage.innerHTML = buildErrorPageHTML(tab.url);
  }
}

// ── facerate.io ──
let facerateView = 'upload';

const FACERATE_SUBMISSIONS = [
  {
    date: '20. 2. 2026',
    score: '3.4',
    breakdown: [
      { label: 'Canthal tilt', value: -1.5 },
      { label: 'Midface ratio', value: -1.0 },
      { label: 'Jaw / gonial angle', value: -0.5 },
      { label: 'Skin & symetrie', value: 0.5 }
    ],
    comments: [
      { author: 'PSL_verdict', text: 'recessed chin, negative canthal tilt, long midface. Sub tier. Mewing + guasha 6mo.' },
      { author: 'chadaxis', text: '3.5. compact midface je saving grace. framecel ale.' },
      { author: 'mogged4life', text: 'NGMI, genetika je strop. Sorry brácho 💀' }
    ]
  },
  {
    date: '5. 3. 2026',
    score: '4.0',
    breakdown: [
      { label: 'Canthal tilt', value: -1.0 },
      { label: 'Midface ratio', value: -0.8 },
      { label: 'Jaw / gonial angle', value: -0.2 },
      { label: 'Skin & symetrie', value: 1.0 }
    ],
    comments: [
      { author: 'PSL_verdict', text: '4.0. neutral canthal tilt, avg midface, soft jawline. skin carries. leanmaxx + haircut + gym, ez 5+ v pulroce' },
      { author: 'chadaxis', text: 'face ma potencial ale tahle fotka je fr flat. zkus lepsi svetlo a eye-level angle, sundej brejle jestli je mas' },
      { author: 'mogged4life', text: 'LTN pro ted. skin je W ale chybi frame 💀 delas ted spis skinnyfat nebo lean?' },
      { author: 'hardmog99', text: 'hoodie + bathroom lighting nerf lol. nefot v zrcadle pod uhlem, vypada to zle vzdycky. daylight + front camera pls' },
      { author: 'aleph_null', text: 'neni to spatny jen hodne prumerna fotka. front camera venku bude jinej vysledek. ted mas -0.5 z fotky same' },
      { author: 'orbitalcel', text: 'oboci + vlasy by udelaly vic nez mewing tbh. hairmaxx first' },
      { author: 'craniumx', text: 'keep lifting, sleepmaxx, skincare (retinoid + spf). za par mesicu +0.3 az +0.5 klidne, jsi mlady jeste' }
    ]
  },
  {
    date: '22. 3. 2026',
    score: '3.1',
    breakdown: [
      { label: 'Canthal tilt', value: -1.6 },
      { label: 'Midface ratio', value: -1.2 },
      { label: 'Jaw / gonial angle', value: -0.6 },
      { label: 'Skin & symetrie', value: 0.5 }
    ],
    comments: [
      { author: 'hardmog99', text: 'wtf co si udělal, tohle je horší. přestaň si dávat neutrální úhly, nebo si přiznej reality.' },
      { author: 'mogged4life', text: '😭😭 flash lighting nepomáhá. sorry.' },
      { author: 'PSL_verdict', text: '3.1. neutral angle bolí, no cope teď.' }
    ]
  }
];

const FACERATE_VOTES = [
  { author: 'KOROLEV_88', date: '21. 3. 2026', score: 2, note: '2. heavy recessed chin, no frame. brutal but true.' },
  { author: 'n0nam3_69', date: '18. 3. 2026', score: 3, note: '3. compact midface, ale ta canthal tilt je negative.' },
  { author: 'mchmch', date: '19. 3. 2026', score: 4 },
  { author: 'Frame_God', date: '14. 3. 2026', score: 3 },
  { author: 'ash_pilled', date: '16. 3. 2026', score: 4 },
  { author: 'glow_v3', date: '9. 3. 2026', score: 3 },
  { author: 'MTN_max', date: '13. 3. 2026', score: 2, note: '2. shortcel + framecel combo. NGMI.' },
  { author: 'dr3ad_v2', date: '12. 3. 2026', score: 3 },
  { author: 'someguy_23', date: '13. 3. 2026', score: 4 },
  { author: 'newcel_2010', date: '6. 3. 2026', score: 3 },
  { author: 'aleph_null', date: '4. 3. 2026', score: 2 },
  { author: 'mod_glowup', date: '1. 3. 2026', score: 4 },
  { author: 'Frame_God', date: '24. 2. 2026', score: 3 },
  { author: 'glow_v3', date: '26. 2. 2026', score: 4 }
];

const FACERATE_LEADERBOARD = [
  { rank: 1, author: 'GigaFrame', score: '8.9' },
  { rank: 2, author: 'HunterEyesKing', score: '8.7' },
  { rank: 3, author: 'NordicJaw', score: '8.5' },
  { rank: 4, author: 'BoneStructureGod', score: '8.3' },
  { rank: 5, author: 'SlavSlayer', score: '8.1' },
  { rank: 6, author: 'sigma_apex_cz', score: '7.9' },
  { rank: 7, author: 'FrameMaxxer', score: '7.8' },
  { rank: 8, author: 'ChadleteCZ', score: '7.7' },
  { rank: 9, author: 'GlowMaxxer', score: '7.6' },
  { rank: 10, author: 'FramecelKiller', score: '7.5' }
];

const FACERATE_GUIDES = [
  { title: 'The Mewing Bible: 12-month protocol', meta: '842K zobrazení · 14 min čtení' },
  { title: 'Canthal Tilt: Why Positive is Everything', meta: '611K zobrazení · 9 min čtení' },
  { title: 'Jawline Definition Through Diet: What Actually Works', meta: '390K zobrazení · 18 min čtení' },
  { title: 'Bone Smashing: Truth and Myths', meta: '204K zobrazení · 7 min čtení' },
  { title: 'Frame > Face: Why Height Wins', meta: '156K zobrazení · 11 min čtení' }
];

const FACERATE_FORUM = [
  { title: 'is mewing worth the hype or just cope', author: 'FrameMaxxer', replies: 47 },
  { title: 'PSA: canthal tilt exercises that actually worked thread', author: 'ChadleteCZ', replies: 132 },
  { title: 'why is everyone under 6\'0 seething rn', author: 'SlavSlayer', replies: 88 },
  { title: 'rate my jaw before/after mewing (6mo)', author: 'newcel_2010', replies: 21 },
  { title: 'cope thread: genetics are 90% of it, change my mind', author: 'mogged4life', replies: 210 },
  { title: 'skincare routine megathread — what\'s actually working', author: 'MTN_max', replies: 64 },
  { title: 'is looksmaxxing even worth it or just cope', author: 'dr3ad_v2', replies: 156 },
  { title: 'heightmaxxing: shoe lifts and posture tricks discussion', author: 'hardmog99', replies: 39 }
];

function frScoreClass(score) {
  const n = Number(score);
  if (n >= 6.5) return 'good';
  if (n >= 5) return 'mid';
  return 'low';
}

function buildFacerateAppHTML() {
  const items = [
    ['upload', 'Upload'], ['vote', 'Vote'], ['leaderboard', 'Leaderboard'],
    ['guides', 'Guides'], ['forum', 'Forum']
  ];
  return `
    <div class="fr-app">
      <header class="fr-header">
        <div class="fr-header-top">
          <div class="fr-logo">facerate<span class="fr-logo-io">.io</span></div>
          <div class="fr-user-chip"><span class="fr-user-dot"></span>hidd3nfram3</div>
        </div>
        <div class="fr-tagline">Data-driven face rating. Get your PSL score.</div>
        <nav class="fr-nav" id="fr-nav">
          ${items.map(([id, label]) => `<span class="fr-nav-item${facerateView === id ? ' active' : ''}" data-view="${id}">${label}</span>`).join('')}
        </nav>
      </header>
      <div class="fr-body" id="fr-body"></div>
    </div>
  `;
}

function frBreakdownHTML(breakdown) {
  return `
    <div class="fr-breakdown">
      ${breakdown.map(b => {
        const pct = Math.max(4, Math.min(100, (b.value + 2) / 4 * 100));
        const neg = b.value < 0;
        return `
          <div class="fr-breakdown-row">
            <span class="fr-breakdown-label">${b.label}</span>
            <span class="fr-breakdown-bar-wrap"><span class="fr-breakdown-bar${neg ? ' neg' : ''}" style="width:${pct}%"></span></span>
            <span class="fr-breakdown-value ${neg ? 'neg' : 'pos'}">${b.value > 0 ? '+' : ''}${b.value}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function frUploadView() {
  return `
    <div class="fr-section">
      <div class="fr-profile-row">
        <div class="fr-profile-avatar"></div>
        <div>
          <div class="fr-profile-name">hidd3nfram3</div>
          <div class="fr-profile-sub">3 submissions · poslední skóre <strong>3.1</strong></div>
        </div>
      </div>
      <div class="fr-submissions">
        ${FACERATE_SUBMISSIONS.map(sub => `
          <div class="fr-submission-card">
            <div class="fr-submission-thumb">${imageOrPlaceholder(sub.image, '<div class="fr-pixelated"></div>')}</div>
            <div class="fr-submission-main">
              <div class="fr-submission-head">
                <span class="fr-submission-date">${sub.date}</span>
                <span class="fr-score fr-score-${frScoreClass(sub.score)}">${sub.score}<span class="fr-score-max">/10</span></span>
              </div>
              ${frBreakdownHTML(sub.breakdown)}
              <div class="fr-comments">
                ${sub.comments.map(c => `<div class="fr-comment"><span class="fr-comment-author">${c.author}:</span>${c.text}</div>`).join('')}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function frVoteView() {
  return `
    <div class="fr-section">
      <h3 class="fr-section-title">Tvoje hodnocení ostatních</h3>
      <div class="fr-vote-list">
        ${FACERATE_VOTES.map(v => `
          <div class="fr-vote-row">
            ${imageOrPlaceholder(v.image, '<div class="fr-pixelated small"></div>', 'small')}
            <div class="fr-vote-main">
              <div class="fr-vote-head"><span class="fr-vote-author">${v.author}</span><span class="fr-vote-date">${v.date}</span></div>
              ${v.note ? `<div class="fr-vote-note">${v.note}</div>` : ''}
            </div>
            <span class="fr-score fr-score-${frScoreClass(v.score)} small">${v.score}<span class="fr-score-max">/10</span></span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function frLeaderboardView() {
  return `
    <div class="fr-section">
      <h3 class="fr-section-title">Leaderboard — top PSL skóre</h3>
      <div class="fr-leaderboard">
        ${FACERATE_LEADERBOARD.map(u => `
          <div class="fr-leaderboard-row">
            <span class="fr-lb-rank">#${u.rank}</span>
            <span class="fr-lb-avatar">${u.author.charAt(0)}</span>
            <span class="fr-lb-name">${u.author}</span>
            <span class="fr-score fr-score-good small">${u.score}<span class="fr-score-max">/10</span></span>
          </div>
        `).join('')}
      </div>
      <div class="fr-your-rank">Tvoje pozice: <strong>#4 832</strong> z 12 456 · poslední skóre 3.1/10</div>
    </div>
  `;
}

function frGuidesView() {
  return `
    <div class="fr-section">
      <h3 class="fr-section-title">Guides</h3>
      <div class="fr-guides">
        ${FACERATE_GUIDES.map(g => `
          <div class="fr-guide-card">
            <div class="fr-guide-thumb">📈</div>
            <div>
              <div class="fr-guide-title">${g.title}</div>
              <div class="fr-guide-meta">${g.meta}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function frForumView() {
  return `
    <div class="fr-section">
      <h3 class="fr-section-title">Forum</h3>
      <div class="fr-forum">
        ${FACERATE_FORUM.map(t => `
          <div class="fr-forum-row">
            <div class="fr-forum-title">${t.title}</div>
            <div class="fr-forum-meta"><span>${t.author}</span><span>${t.replies} odpovědí</span></div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderFacerateBody() {
  const body = document.getElementById('fr-body');
  if (!body) return;
  switch (facerateView) {
    case 'vote': body.innerHTML = frVoteView(); break;
    case 'leaderboard': body.innerHTML = frLeaderboardView(); break;
    case 'guides': body.innerHTML = frGuidesView(); break;
    case 'forum': body.innerHTML = frForumView(); break;
    default: body.innerHTML = frUploadView(); break;
  }
}

function attachFacerateHandlers() {
  const nav = document.getElementById('fr-nav');
  nav.querySelectorAll('.fr-nav-item').forEach(node => {
    node.addEventListener('click', () => {
      facerateView = node.dataset.view;
      nav.querySelectorAll('.fr-nav-item').forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      renderFacerateBody();
    });
  });
}

// ── YouTube ──
// Real curated 43-video pipeline (Jun 2025 → Mar 2026) simulating the YT algorithm's
// drift from mainstream gaming into looksmaxxing/manosphere/incel content.
// Source: Nat's "Lukas-PC — YouTube pipeline (44 videí)" doc (oEmbed-verified titles/channels).
// One doc entry (zdV6XK6-r0k, phase 7) was unresolvable/deleted and was dropped per the
// doc's own option (b) — phase 7 keeps its remaining 4 videos rather than inventing a replacement.
const YT_HOME_VIDEOS = [
  { id: '00NgUctWoLQ', title: 'Extreme $1,000,000 Hide And Seek', channel: 'MrBeast', url: 'https://www.youtube.com/watch?v=00NgUctWoLQ', format: 'long', phase: 1, category: 'gaming', date: '2025-06-05', watched: true, views: '312 mil. zhlédnutí', duration: '18:42' },
  { id: 'irVNGjRFZGk', title: 'Avengers: Doomsday | Official Trailer', channel: 'Marvel Entertainment', url: 'https://www.youtube.com/watch?v=irVNGjRFZGk', format: 'long', phase: 1, category: 'gaming', date: '2025-06-12', watched: true, views: '89 mil. zhlédnutí', duration: '2:31' },
  { id: 'vQg1PVfztVc', title: 'Top 5 best funny Moments in CS2', channel: 'Park Dip', url: 'https://www.youtube.com/shorts/vQg1PVfztVc', format: 'short', phase: 1, category: 'gaming', date: '2025-06-18', watched: true, views: '4,3 mil. zhlédnutí', duration: '0:52' },
  { id: 'zxjbZEO2WDk', title: 'REFREZH INSANE 1v5 CLUTCH ACE', channel: 'ESL Counter-Strike', url: 'https://www.youtube.com/watch?v=zxjbZEO2WDk', format: 'long', phase: 1, category: 'gaming', date: '2025-06-24', watched: true, views: '2,1 mil. zhlédnutí', duration: '9:14' },
  { id: '-j0_j6_V7rw', title: 'POV: That friend whose life is on HARD MODE', channel: 'The Johnson Brothers', url: 'https://www.youtube.com/shorts/-j0_j6_V7rw', format: 'short', phase: 1, category: 'gaming', date: '2025-06-30', watched: true, views: '11 mil. zhlédnutí', duration: '0:38' },
  { id: 'NFm2Xjx61Q8', title: '"Got any hobbies?"', channel: 'Luda', url: 'https://www.youtube.com/watch?v=NFm2Xjx61Q8', format: 'long', phase: 1, category: 'gaming', date: '2025-07-08', watched: true, views: '22 mil. zhlédnutí', duration: '3:47' },
  { id: 'b-Pn0yXL9y8', title: "5 Minutes to Start Your Day Right — MORNING MOTIVATION | Admiral McRaven's Speech", channel: 'Motiversity', url: 'https://www.youtube.com/watch?v=b-Pn0yXL9y8', format: 'long', phase: 1, category: 'gaming', date: '2025-07-18', watched: true, views: '48 mil. zhlédnutí', duration: '5:12' },
  { id: 'jnIOLO6dpj0', title: 'BE BETTER — David Goggins Motivational Speech', channel: 'Allaroundus', url: 'https://www.youtube.com/watch?v=jnIOLO6dpj0', format: 'long', phase: 1, category: 'gaming', date: '2025-07-25', watched: true, views: '3,2 mil. zhlédnutí', duration: '9:38' },

  { id: 'NlXPiHArsDE', title: 'The PERFECT 6AM Morning Routine For Self-Improvement', channel: 'Hamza', url: 'https://www.youtube.com/watch?v=NlXPiHArsDE', format: 'long', phase: 2, category: 'manosphere', date: '2025-08-04', watched: true, views: '1,8 mil. zhlédnutí', duration: '11:24' },
  { id: 'vMSDbnYsyMM', title: 'Začátečnická (ne)forma', channel: 'Antonin Hodan', url: 'https://www.youtube.com/watch?v=vMSDbnYsyMM', format: 'long', phase: 2, category: 'manosphere', date: '2025-08-15', watched: true, views: '184 tis. zhlédnutí', duration: '8:05' },

  { id: 'yfk0c18xPcE', title: 'Finding Your Perfect Hairstyle Is Surprisingly Easy', channel: 'QOVES', url: 'https://www.youtube.com/watch?v=yfk0c18xPcE', format: 'long', phase: 3, category: 'manosphere', date: '2025-09-03', watched: true, views: '2,1 mil. zhlédnutí', duration: '10:12' },
  { id: 'hrOwm3gASxc', title: 'Why Do Some People Just Look So Good?', channel: 'Wanhee 완희', url: 'https://www.youtube.com/watch?v=hrOwm3gASxc', format: 'long', phase: 3, category: 'manosphere', date: '2025-09-20', watched: true, views: '640 tis. zhlédnutí', duration: '14:50' },
  { id: 'WLFcde2eaBU', title: 'Kareem Shami (Syrianpsycho) Explains "Mewing" on Tamron Hall Show', channel: 'FashionFaces444', url: 'https://www.youtube.com/shorts/WLFcde2eaBU', format: 'short', phase: 3, category: 'manosphere', date: '2025-09-28', watched: true, views: '9,8 mil. zhlédnutí', duration: '0:59' },
  { id: 'jfulHL73Mhc', title: "the world's shortest looksmaxxing guide you'll ever need.", channel: 'Rorz', url: 'https://www.youtube.com/watch?v=jfulHL73Mhc', format: 'long', phase: 3, category: 'manosphere', date: '2025-10-12', watched: true, views: '1,2 mil. zhlédnutí', duration: '6:33' },
  { id: 'qbtwXFH0ySc', title: 'The truth about hunter eyes (UUDD explained)', channel: 'Baby Stickley', url: 'https://www.youtube.com/watch?v=qbtwXFH0ySc', format: 'long', phase: 3, category: 'manosphere', date: '2025-10-20', watched: true, views: '780 tis. zhlédnutí', duration: '9:17' },

  { id: 'wRZo5zExpUw', title: '"There\'s no rest for me in this world" | PEAKY BLINDERS', channel: 'CINEMATIC ESCAPISM', url: 'https://www.youtube.com/shorts/wRZo5zExpUw', format: 'short', phase: 4, category: 'manosphere', date: '2025-11-02', watched: true, views: '18 mil. zhlédnutí', duration: '0:41' },
  { id: 'r7zThgJAAPg', title: 'How Marcus Aurelius Stayed Calm in Chaos | 3 Stoic Methods', channel: 'Einzelgänger', url: 'https://www.youtube.com/watch?v=r7zThgJAAPg', format: 'long', phase: 4, category: 'manosphere', date: '2025-11-08', watched: true, views: '2,4 mil. zhlédnutí', duration: '13:42' },
  { id: 'xObKDh0IXYM', title: 'The Psychology of People Who Are DEEP Thinkers', channel: 'Oku', url: 'https://www.youtube.com/watch?v=xObKDh0IXYM', format: 'long', phase: 4, category: 'manosphere', date: '2025-11-15', watched: true, views: '950 tis. zhlédnutí', duration: '11:05' },
  { id: 'Q_vj7KAXxww', title: 'Shaolin Master Reveals: How to Master Anything in 30 days | Monk Mode', channel: 'TRNSFRM.', url: 'https://www.youtube.com/shorts/Q_vj7KAXxww', format: 'short', phase: 4, category: 'manosphere', date: '2025-11-22', watched: true, views: '6,3 mil. zhlédnutí', duration: '0:47' },
  { id: 'Gqlc3ouM6uQ', title: 'The Science Behind Masculine Charisma', channel: 'Zoomology', url: 'https://www.youtube.com/watch?v=Gqlc3ouM6uQ', format: 'long', phase: 4, category: 'manosphere', date: '2025-11-29', watched: true, views: '3,1 mil. zhlédnutí', duration: '15:21' },

  { id: 'MTCotdedj28', title: '99% Of You Will Always Be Broke', channel: 'Hamza', url: 'https://www.youtube.com/shorts/MTCotdedj28', format: 'short', phase: 5, category: 'manosphere', date: '2025-12-03', watched: true, views: '7,9 mil. zhlédnutí', duration: '0:55' },
  { id: 'PTWp0xV3qZ8', title: 'Reclaim Your Male Aggression #hamza', channel: 'Hamza Shorts', url: 'https://www.youtube.com/shorts/PTWp0xV3qZ8', format: 'short', phase: 5, category: 'manosphere', date: '2025-12-10', watched: true, views: '620 tis. zhlédnutí', duration: '0:44' },
  { id: '4RZ3XX0wGTU', title: 'Hard Truths Men Learn Too Late', channel: 'Hamza', url: 'https://www.youtube.com/watch?v=4RZ3XX0wGTU', format: 'long', phase: 5, category: 'manosphere', date: '2025-12-18', watched: true, views: '1,4 mil. zhlédnutí', duration: '12:08' },
  { id: 'uOcKF-aLHyw', title: 'How to Get Whatever You Want', channel: 'GrindBuddy', url: 'https://www.youtube.com/watch?v=uOcKF-aLHyw', format: 'long', phase: 5, category: 'manosphere', date: '2025-12-27', watched: true, views: '210 tis. zhlédnutí', duration: '9:52' },
  { id: 't5ADEtmqCws', title: "How To Make Someone Realize They Can't Control You", channel: 'Charisma on Command', url: 'https://www.youtube.com/watch?v=t5ADEtmqCws', format: 'long', phase: 5, category: 'manosphere', date: '2025-12-30', watched: true, views: '3,6 mil. zhlédnutí', duration: '10:41' },

  { id: 'IxQO64gIAJ8', title: 'Improving at Talking To Girls!', channel: 'Brady Shepherd', url: 'https://www.youtube.com/shorts/IxQO64gIAJ8', format: 'short', phase: 6, category: 'manosphere', date: '2026-01-04', watched: true, views: '2,1 mil. zhlédnutí', duration: '0:39' },
  { id: 'Y_qKLmzTHiE', title: 'Get comfortable talking with girls.', channel: 'Iman Gadzhi Moments', url: 'https://www.youtube.com/shorts/Y_qKLmzTHiE', format: 'short', phase: 6, category: 'manosphere', date: '2026-01-10', watched: true, views: '5,4 mil. zhlédnutí', duration: '0:51' },
  { id: 'xIpri5jMVLw', title: "High Value Men Don't Chase — Here's Why", channel: 'Postur', url: 'https://www.youtube.com/shorts/xIpri5jMVLw', format: 'short', phase: 6, category: 'manosphere', date: '2026-01-15', watched: true, views: '3,3 mil. zhlédnutí', duration: '0:46' },
  { id: 'Bces8J6pMiw', title: 'ANDREW TATE on HOW to APPROACH A GIRL', channel: 'The Way 0f The Superior Man', url: 'https://www.youtube.com/shorts/Bces8J6pMiw', format: 'short', phase: 6, category: 'manosphere', date: '2026-01-22', watched: true, views: '11 mil. zhlédnutí', duration: '0:58' },
  { id: '0YhbQvsTDi0', title: 'Blind Dating Guys After Looksmaxxing', channel: 'kickback', url: 'https://www.youtube.com/watch?v=0YhbQvsTDi0', format: 'long', phase: 6, category: 'manosphere', date: '2026-01-29', watched: true, views: '4,8 mil. zhlédnutí', duration: '18:24' },

  { id: 'B7kvX7QZc0U', title: 'Andrew Tate On Hypergamy', channel: 'Tate Storys', url: 'https://www.youtube.com/shorts/B7kvX7QZc0U', format: 'short', phase: 7, category: 'manosphere', date: '2026-02-03', watched: true, views: '14 mil. zhlédnutí', duration: '0:49' },
  { id: 't-3CbS5m7XE', title: 'How To Rate Your Attractiveness Using Science', channel: 'Zoomology', url: 'https://www.youtube.com/watch?v=t-3CbS5m7XE', format: 'long', phase: 7, category: 'manosphere', date: '2026-02-15', watched: true, views: '2,9 mil. zhlédnutí', duration: '16:07' },
  { id: 'zCcNky0_eys', title: 'Face Rating + Looksmaxxing Redditors (With Brutal Honesty)', channel: 'FaceIQ', url: 'https://www.youtube.com/watch?v=zCcNky0_eys', format: 'long', phase: 7, category: 'manosphere', date: '2026-02-22', watched: true, views: '1,1 mil. zhlédnutí', duration: '21:16' },

  { id: 'UmjDxGj54Kk', title: 'Solving Hypergamy (NO FILTER)', channel: 'K. Shami', url: 'https://www.youtube.com/watch?v=UmjDxGj54Kk', format: 'long', phase: 8, category: 'incel', date: '2026-03-01', watched: true, views: '2,7 mil. zhlédnutí', duration: '24:38' },
  { id: 'i49S9tQpad8', title: 'An Accurate Looks Scale for Men', channel: 'Real', url: 'https://www.youtube.com/watch?v=i49S9tQpad8', format: 'long', phase: 8, category: 'incel', date: '2026-03-04', watched: true, views: '320 tis. zhlédnutí', duration: '13:52' },
  { id: 'eipfKGg3B-U', title: 'Why you look like a framecel in clothes (even with a good physique)', channel: 'BP Fitness', url: 'https://www.youtube.com/watch?v=eipfKGg3B-U', format: 'long', phase: 8, category: 'incel', date: '2026-03-07', watched: true, views: '145 tis. zhlédnutí', duration: '10:18' },
  { id: 'Ne62EFvJQjU', title: "It's not over (looksmaxxing motivation)", channel: 'PSL1.9', url: 'https://www.youtube.com/watch?v=Ne62EFvJQjU', format: 'long', phase: 8, category: 'incel', date: '2026-03-10', watched: true, views: '89 tis. zhlédnutí', duration: '7:44' },
  { id: 'KNJQhu--mQo', title: 'CHAD VS SUB5 TREATMENT — Watch How Women Treat Them', channel: 'Wheat Waffles', url: 'https://www.youtube.com/watch?v=KNJQhu--mQo', format: 'long', phase: 8, category: 'incel', date: '2026-03-13', watched: true, views: '410 tis. zhlédnutí', duration: '9:02' },
  { id: 'JvmBm7d2RVs', title: 'Incel Traits Tier List', channel: 'Real', url: 'https://www.youtube.com/watch?v=JvmBm7d2RVs', format: 'long', phase: 8, category: 'incel', date: '2026-03-15', watched: true, views: '275 tis. zhlédnutí', duration: '16:47' },
  { id: 'vtoQnmD5Y1k', title: "At 35, I'm Still Alone.", channel: 'Jake Kassan', url: 'https://www.youtube.com/watch?v=vtoQnmD5Y1k', format: 'long', phase: 8, category: 'incel', date: '2026-03-17', watched: true, views: '62 tis. zhlédnutí', duration: '19:33' },
  { id: 'KWUVXQnAQLk', title: "I'm 19 and I have no friends", channel: 'Lefrancs', url: 'https://www.youtube.com/watch?v=KWUVXQnAQLk', format: 'long', phase: 8, category: 'incel', date: '2026-03-19', watched: true, views: '38 tis. zhlédnutí', duration: '14:09' },
  { id: 'sEWIDdQKWgc', title: "yeah... no wonder he doesn't use social media", channel: 'Du Cinema', url: 'https://www.youtube.com/watch?v=sEWIDdQKWgc', format: 'long', phase: 8, category: 'incel', date: '2026-03-22', watched: true, views: '190 tis. zhlédnutí', duration: '5:27' }
];

// Shorts feed order mirrors his actual viewing chronology: newest (hardest blackpill
// content) at the top, oldest (benign) at the bottom — the direction the algorithm
// actually pushed him, reversed for a top-to-bottom feed read.
function getShortsIds() {
  return YT_HOME_VIDEOS
    .filter(v => v.format === 'short')
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .map(v => v.id);
}

function sortedHomeVideos() {
  return [...YT_HOME_VIDEOS].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

const YT_HOME_MAX_CARDS = 50;

function ytThumbUrl(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
function ytThumbHTML(id) {
  return `<img src="${ytThumbUrl(id)}" class="yt-thumb-img" alt="" loading="lazy" />`;
}

function channelHandleSlug(name) {
  return String(name).replace(/\s+/g, '').replace(/[^\w.]/g, '');
}

function ytAgeFromISODate(iso) {
  const d = new Date(`${iso}T12:00:00`);
  const now = new Date(parseClockBase());
  const days = Math.floor((now - d) / 86400000);
  if (days <= 0) return 'dnes';
  if (days === 1) return 'před 1 dnem';
  if (days < 7) return `před ${days} dny`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return weeks === 1 ? 'před 1 týdnem' : `před ${weeks} týdny`;
  const months = Math.floor(days / 30);
  if (months < 12) return months === 1 ? 'před 1 měsícem' : `před ${months} měsíci`;
  const years = Math.floor(days / 365);
  return years === 1 ? 'před 1 rokem' : `před ${years} lety`;
}
function ytAgeLabel(v) {
  if (v.age) return v.age;
  if (v.date) return ytAgeFromISODate(v.date);
  return '[Upload date placeholder]';
}
function formatCzechDateLabel(iso) {
  const parts = iso.split('-').map(Number);
  return `${parts[2]}. ${parts[1]}. ${parts[0]}`;
}

const YT_UNAVAILABLE_REASONS = [
  'Přehrávání videa se nezdařilo. Zkus to prosím znovu.',
  'Tento obsah není na tomto zařízení k dispozici.',
  'Video se zpracovává ve vyšší kvalitě — zkus to za chvíli znovu.',
  'Došlo k chybě sítě. Zkontroluj připojení k internetu a zkus to znovu.',
  'Tento přehrávač vyžaduje aktualizaci aplikace YouTube.',
  'Video je dočasně nedostupné, autor upravuje nastavení zveřejnění.',
  'Chyba přehrávání (kód 400). Zkus to prosím později.',
  'Nahrávání videa se zaseklo. Obnov stránku a zkus to znovu.'
];
function unavailableReasonFor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return YT_UNAVAILABLE_REASONS[hash % YT_UNAVAILABLE_REASONS.length];
}

const YT_COMMENTS = Array.from({ length: 7 }, (_, i) => ({
  author: `[Comment author ${i + 1}]`,
  text: `[Comment text ${i + 1}]`,
  likes: (i + 1) * 4
}));

function resolveVideoById(id) {
  const known = YT_HOME_VIDEOS.find(v => v.id === id);
  if (known) return { ...known, fromHistory: false };
  const flat = HISTORY_DAYS.flatMap(d => d.items.map(it => ({ ...it, date: d.date })));
  const match = flat.find(it => it.url === `youtube.com/watch?v=${id}` || it.url === `youtube.com/shorts/${id}`);
  if (match) {
    return {
      id,
      title: match.title.replace(/ - YouTube$/, ''),
      channel: '[Channel name]',
      views: '[View count placeholder]',
      age: match.date,
      duration: '—',
      fromHistory: true
    };
  }
  return { id, title: '[Title placeholder]', channel: '[Channel name]', views: '[View count placeholder]', age: '[Upload date placeholder]', duration: '—', fromHistory: false };
}

function parseYoutubeUrl(url) {
  const rest = url.replace(/^youtube\.com/, '');
  if (!rest || rest === '/') return { page: 'home' };
  if (rest.startsWith('/watch')) {
    const m = rest.match(/[?&]v=([^&]+)/);
    return { page: 'watch', id: m ? decodeURIComponent(m[1]) : YT_HOME_VIDEOS[0].id };
  }
  if (rest.startsWith('/results')) {
    const m = rest.match(/search_query=([^&]+)/);
    return { page: 'search', query: m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '' };
  }
  if (rest.startsWith('/shorts/')) return { page: 'shorts', id: rest.split('/shorts/')[1] || getShortsIds()[0] };
  if (rest.startsWith('/@')) return { page: 'channel', handle: rest.slice(2).split('/')[0] };
  if (rest.startsWith('/feed/history')) return { page: 'history' };
  if (rest.startsWith('/feed/subscriptions')) return { page: 'subscriptions' };
  if (rest.startsWith('/feed/watch_later')) return { page: 'empty', label: 'Ke zhlédnutí později' };
  if (rest.startsWith('/feed/liked')) return { page: 'empty', label: 'Videa, která se mi líbí' };
  return { page: 'home' };
}

function navigateYoutube(url, title, fromHistory) {
  const tab = TABS.find(t => t.id === activeTabId);
  if (tab) {
    tab.url = url;
    tab.title = title || tab.title;
    tab.type = 'youtube';
    tab.favicon = 'assets/icons/fav-youtube.svg';
    if (!fromHistory) pushTabHistory(tab);
  }
  renderTabbar();
  updateAddressBar();
  renderYoutubeContent(url);
  updateNavButtons();
}

function ytVideoCardHTML(v) {
  return `
    <div class="yt-card" data-video-id="${v.id}">
      <div class="yt-card-thumb">${imageOrPlaceholder(v.image, ytThumbHTML(v.id))}<span class="yt-card-duration">${v.duration}</span>${v.watched ? '<span class="yt-watched-bar"></span>' : ''}</div>
      <div class="yt-card-meta">
        <span class="yt-card-avatar"></span>
        <div class="yt-card-text">
          <div class="yt-card-title">${v.title}</div>
          <div class="yt-card-channel">${v.channel}</div>
          <div class="yt-card-stats">${v.views} · ${ytAgeLabel(v)}</div>
        </div>
      </div>
    </div>
  `;
}

function ytVideoRowHTML(v) {
  return `
    <div class="yt-row" data-video-id="${v.id}">
      <div class="yt-row-thumb">${imageOrPlaceholder(v.image, ytThumbHTML(v.id))}<span class="yt-card-duration">${v.duration}</span>${v.watched ? '<span class="yt-watched-bar"></span>' : ''}</div>
      <div class="yt-row-body">
        <div class="yt-row-title">${v.title}</div>
        <div class="yt-row-stats">${v.views} · ${ytAgeLabel(v)}</div>
        <div class="yt-row-channel"><span class="yt-card-avatar small"></span>${v.channel}</div>
        <div class="yt-row-desc">[Video description placeholder]</div>
      </div>
    </div>
  `;
}

function ytRecRowHTML(v) {
  return `
    <div class="yt-rec-row" data-video-id="${v.id}">
      <div class="yt-rec-thumb">${imageOrPlaceholder(v.image, ytThumbHTML(v.id))}<span class="yt-card-duration">${v.duration}</span>${v.watched ? '<span class="yt-watched-bar"></span>' : ''}</div>
      <div class="yt-rec-text">
        <div class="yt-rec-title">${v.title}</div>
        <div class="yt-rec-channel">${v.channel}</div>
        <div class="yt-rec-stats">${v.views} · ${ytAgeLabel(v)}</div>
      </div>
    </div>
  `;
}

function attachYtCardHandlers(container) {
  container.querySelectorAll('[data-video-id]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.videoId;
      const v = resolveVideoById(id);
      if (v.format === 'short') {
        navigateYoutube(`youtube.com/shorts/${id}`, `${v.title} - YouTube`);
      } else {
        navigateYoutube(`youtube.com/watch?v=${id}`, `${v.title} - YouTube`);
      }
    });
  });
}

function ytHomePageHTML() {
  const sorted = sortedHomeVideos().slice(0, YT_HOME_MAX_CARDS);
  return `<div class="yt-grid" id="yt-home-grid">${sorted.map(ytVideoCardHTML).join('')}</div><div id="yt-feed-end"></div>`;
}

// The feed has a hard end — once he scrolls past the last real video, a loading spinner
// appears and just spins forever. No more videos ever load. The algorithm has nothing
// left to recommend; the rabbit hole is exhausted.
let ytHomeScrollHandler = null;
function attachHomeInfiniteScroll(content) {
  if (ytHomeScrollHandler) content.removeEventListener('scroll', ytHomeScrollHandler);
  const endMarker = document.getElementById('yt-feed-end');
  if (!endMarker) { ytHomeScrollHandler = null; return; }
  let spinnerShown = false;
  ytHomeScrollHandler = () => {
    if (spinnerShown) return;
    if (content.scrollTop + content.clientHeight < content.scrollHeight - 300) return;
    spinnerShown = true;
    endMarker.innerHTML = '<div class="yt-loading-spinner"></div>';
  };
  content.addEventListener('scroll', ytHomeScrollHandler);
}

function ytSearchPageHTML(query) {
  const results = YT_HOME_VIDEOS.slice(0, 12);
  return `
    <div class="yt-search-results">
      <div class="yt-search-header">Výsledky vyhledávání pro: <strong>${query || '[search query]'}</strong></div>
      ${results.map(ytVideoRowHTML).join('')}
    </div>
  `;
}

function ytChannelPageHTML(handle) {
  const atHandle = handle ? `@${handle}` : '@[channel_handle]';
  const matchedName = handle && YT_HOME_VIDEOS.find(v => channelHandleSlug(v.channel) === handle)?.channel;
  const videos = matchedName ? YT_HOME_VIDEOS.filter(v => v.channel === matchedName) : YT_HOME_VIDEOS.slice(0, 8);
  const displayName = matchedName || '[Channel name]';
  const videoCount = matchedName ? videos.length : '[42]';
  return `
    <div class="yt-channel-page">
      <div class="yt-channel-banner"></div>
      <div class="yt-channel-head">
        <span class="yt-channel-avatar"></span>
        <div class="yt-channel-head-text">
          <div class="yt-channel-name">${displayName}</div>
          <div class="yt-channel-sub">${atHandle} · [1,2 tis.] odběratelů · ${videoCount} videí</div>
          <div class="yt-channel-desc">[Channel description placeholder]</div>
        </div>
        <button class="yt-subscribe-btn" id="yt-subscribe-btn">Odebírat</button>
      </div>
      <div class="yt-channel-tabs">
        <span class="yt-channel-tab active" data-tab="videos">Videa</span>
        <span class="yt-channel-tab" data-tab="shorts">Shorts</span>
        <span class="yt-channel-tab" data-tab="playlists">Playlisty</span>
        <span class="yt-channel-tab" data-tab="about">O kanálu</span>
      </div>
      <div class="yt-channel-tab-body" id="yt-channel-tab-body">
        <div class="yt-grid">${videos.map(ytVideoCardHTML).join('')}</div>
      </div>
    </div>
  `;
}

function attachYtChannelHandlers(handle) {
  const btn = document.getElementById('yt-subscribe-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const subscribed = btn.classList.toggle('subscribed');
      btn.textContent = subscribed ? 'Odebíráno' : 'Odebírat';
    });
  }
  const matchedName = handle && YT_HOME_VIDEOS.find(v => channelHandleSlug(v.channel) === handle)?.channel;
  const channelVideos = matchedName ? YT_HOME_VIDEOS.filter(v => v.channel === matchedName) : YT_HOME_VIDEOS.slice(0, 8);
  document.querySelectorAll('.yt-channel-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.yt-channel-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const body = document.getElementById('yt-channel-tab-body');
      if (tab.dataset.tab === 'videos') {
        body.innerHTML = `<div class="yt-grid">${channelVideos.map(ytVideoCardHTML).join('')}</div>`;
        attachYtCardHandlers(body);
      } else {
        body.innerHTML = `<div class="yt-empty-state">Obsah záložky „${tab.textContent}“ zatím není naplněn.</div>`;
      }
    });
  });
}

function ytRecsFor(v) {
  const others = YT_HOME_VIDEOS.filter(x => x.id !== v.id);
  const sameCategory = others.filter(x => x.category === v.category);
  const rest = others.filter(x => x.category !== v.category);
  return [...sameCategory, ...rest].slice(0, 14);
}

function ytUnavailableBlockHTML(v) {
  return `
    <div class="yt-player yt-player-unavailable">
      <div class="yt-unavailable-surface">
        <div class="yt-unavailable-icon">⚠</div>
        <div class="yt-unavailable-text">${unavailableReasonFor(v.id)}</div>
        <button class="yt-unavailable-retry">Zkusit znovu</button>
      </div>
    </div>
  `;
}

function ytWatchPageHTML(id) {
  const v = resolveVideoById(id);
  const recs = ytRecsFor(v);
  const unavailable = v.format === 'long';
  return `
    <div class="yt-watch-page">
      <div class="yt-watch-main">
        ${unavailable ? ytUnavailableBlockHTML(v) : `
        <div class="yt-player">
          <div class="yt-player-surface"><button class="yt-player-play">▶</button></div>
          <div class="yt-player-controls">
            <button class="yt-ctrl-btn">▶</button>
            <div class="yt-timeline"><div class="yt-timeline-progress"></div></div>
            <span class="yt-time">0:00 / ${v.duration || '12:34'}</span>
            <button class="yt-ctrl-btn">🔊</button>
            <button class="yt-ctrl-btn">HD</button>
            <button class="yt-ctrl-btn">⛶</button>
          </div>
        </div>`}
        <div class="yt-watch-title">${v.title}</div>
        <div class="yt-watch-row">
          <div class="yt-watch-channel">
            <div class="yt-watch-channel-link" data-channel="${escapeForAttr(v.channel)}">
              <span class="yt-card-avatar"></span>
              <div>
                <div class="yt-watch-channel-name">${v.channel}</div>
                <div class="yt-watch-channel-subs">[1,2 tis.] odběratelů</div>
              </div>
            </div>
            <button class="yt-subscribe-btn" id="yt-subscribe-btn">Odebírat</button>
          </div>
          <div class="yt-watch-actions">
            <span class="yt-action-btn">👍 <span>[1,1 tis.]</span></span>
            <span class="yt-action-btn">👎</span>
            <span class="yt-action-btn">↗ Sdílet</span>
            <span class="yt-action-btn">⬇ Uložit</span>
          </div>
        </div>
        <div class="yt-watch-views-date">${v.views} · ${ytAgeLabel(v)}</div>
        ${unavailable ? `<div class="yt-empty-state">Komentáře nejsou u tohoto videa k dispozici.</div>` : `
        <div class="yt-comments">
          <div class="yt-comments-count">[124] komentářů</div>
          ${YT_COMMENTS.map(c => `
            <div class="yt-comment">
              <span class="yt-card-avatar small"></span>
              <div class="yt-comment-body">
                <div class="yt-comment-head"><span class="yt-comment-author">${c.author}</span><span class="yt-comment-time">[před X dny]</span></div>
                <div class="yt-comment-text">${c.text}</div>
                <div class="yt-comment-actions">👍 ${c.likes} &nbsp; 👎 &nbsp; Odpovědět</div>
              </div>
            </div>
          `).join('')}
        </div>`}
      </div>
      <div class="yt-watch-sidebar">${recs.map(ytRecRowHTML).join('')}</div>
    </div>
  `;
}

function attachYtWatchHandlers() {
  const content = document.getElementById('yt-content');
  attachYtCardHandlers(content);
  const btn = document.getElementById('yt-subscribe-btn');
  if (btn) {
    btn.addEventListener('click', () => {
      const subscribed = btn.classList.toggle('subscribed');
      btn.textContent = subscribed ? 'Odebíráno' : 'Odebírat';
    });
  }
  const channelLink = content.querySelector('.yt-watch-channel-link');
  if (channelLink) {
    channelLink.addEventListener('click', () => {
      const chName = channelLink.dataset.channel;
      navigateYoutube(`youtube.com/@${channelHandleSlug(chName)}`, `${chName} - YouTube`);
    });
  }
  const playBtn = content.querySelector('.yt-player-play');
  if (playBtn) playBtn.addEventListener('click', () => playBtn.classList.toggle('playing'));
  const retryBtn = content.querySelector('.yt-unavailable-retry');
  if (retryBtn) retryBtn.addEventListener('click', () => {
    retryBtn.disabled = true;
    retryBtn.textContent = 'Načítání…';
    setTimeout(() => { retryBtn.disabled = false; retryBtn.textContent = 'Zkusit znovu'; }, 900);
  });
}

function ytShortsPageHTML(id) {
  const shortsIds = getShortsIds();
  const idx = Math.max(0, shortsIds.indexOf(id));
  const activeId = shortsIds[idx] || id;
  const v = resolveVideoById(activeId);
  return `
    <div class="yt-shorts-page">
      <div class="yt-shorts-nav">
        <button class="yt-shorts-arrow" id="yt-shorts-up" ${idx === 0 ? 'disabled' : ''}>▲</button>
        <button class="yt-shorts-arrow" id="yt-shorts-down" ${idx === shortsIds.length - 1 ? 'disabled' : ''}>▼</button>
      </div>
      <div class="yt-shorts-player">
        <iframe class="yt-shorts-iframe" src="https://www.youtube.com/embed/${activeId}?rel=0&modestbranding=1" title="${escapeForAttr(v.title)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        <div class="yt-shorts-meta">
          <div class="yt-shorts-channel"><span class="yt-card-avatar small"></span>${v.channel}<button class="yt-subscribe-btn small" id="yt-subscribe-btn">Odebírat</button></div>
          <div class="yt-shorts-title">${v.title}</div>
        </div>
      </div>
      <div class="yt-shorts-actions">
        <div class="yt-shorts-action">👍<span>[12 tis.]</span></div>
        <div class="yt-shorts-action">👎<span></span></div>
        <div class="yt-shorts-action">💬<span>[321]</span></div>
        <div class="yt-shorts-action">↗<span>Sdílet</span></div>
      </div>
    </div>
  `;
}

function attachYtShortsHandlers(id) {
  const shortsIds = getShortsIds();
  const idx = Math.max(0, shortsIds.indexOf(id));
  const up = document.getElementById('yt-shorts-up');
  const down = document.getElementById('yt-shorts-down');
  if (up) up.addEventListener('click', () => {
    if (idx > 0) navigateYoutube(`youtube.com/shorts/${shortsIds[idx - 1]}`, 'Shorts - YouTube');
  });
  if (down) down.addEventListener('click', () => {
    if (idx < shortsIds.length - 1) navigateYoutube(`youtube.com/shorts/${shortsIds[idx + 1]}`, 'Shorts - YouTube');
  });
  const btn = document.getElementById('yt-subscribe-btn');
  if (btn) btn.addEventListener('click', () => {
    const subscribed = btn.classList.toggle('subscribed');
    btn.textContent = subscribed ? 'Odebíráno' : 'Odebírat';
  });
}

function ytHistoryPageHTML() {
  const watched = YT_HOME_VIDEOS.filter(v => v.watched).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  if (!watched.length) return ytEmptyPageHTML('Historie sledování');
  const groups = [];
  watched.forEach(v => {
    const label = v.date ? formatCzechDateLabel(v.date) : '[Datum]';
    let group = groups.find(g => g.label === label);
    if (!group) { group = { label, items: [] }; groups.push(group); }
    group.items.push(v);
  });
  return `
    <div class="yt-history-page">
      <div class="yt-history-title">Historie sledování</div>
      ${groups.map(g => `
        <div class="yt-history-date">${g.label}</div>
        ${g.items.map(v => `
          <div class="yt-row yt-history-row" data-video-id="${v.id}">
            <div class="yt-row-thumb">${imageOrPlaceholder(v.image, ytThumbHTML(v.id))}<span class="yt-card-duration">${v.duration || ''}</span></div>
            <div class="yt-row-body">
              <div class="yt-row-title">${v.title}</div>
              <div class="yt-row-stats">${v.channel} · ${v.views || ''}</div>
            </div>
          </div>
        `).join('')}
      `).join('')}
    </div>
  `;
}

function attachYtHistoryHandlers(container) {
  attachYtCardHandlers(container);
}

function ytSubscriptionsPageHTML() {
  const chips = [...new Set(YT_HOME_VIDEOS.map(v => v.channel))];
  return `
    <div class="yt-subscriptions-page">
      <div class="yt-sub-chips">
        ${chips.map(c => `<div class="yt-sub-chip" data-channel="${escapeForAttr(c)}"><span class="yt-card-avatar small"></span>${c}</div>`).join('')}
      </div>
      <div class="yt-empty-state">Zatím žádná nová videa od odebíraných kanálů.</div>
    </div>
  `;
}

function attachYtSubscriptionsHandlers(content) {
  content.querySelectorAll('.yt-sub-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const chName = chip.dataset.channel;
      navigateYoutube(`youtube.com/@${channelHandleSlug(chName)}`, `${chName} - YouTube`);
    });
  });
}

function ytEmptyPageHTML(label) {
  return `<div class="yt-empty-state">${label ? `„${label}“ — zatím žádný obsah.` : 'Zatím žádný obsah.'}</div>`;
}

function renderYoutubeContent(url) {
  const content = document.getElementById('yt-content');
  if (!content) return;
  content.scrollTop = 0;
  const parsed = parseYoutubeUrl(url);
  const sidebar = document.getElementById('yt-sidebar');
  if (sidebar) sidebar.classList.toggle('slim', parsed.page === 'watch' || parsed.page === 'shorts');
  const searchInput = document.getElementById('yt-search-input');
  if (searchInput) searchInput.value = parsed.page === 'search' ? (parsed.query || '') : '';

  switch (parsed.page) {
    case 'watch':
      content.innerHTML = ytWatchPageHTML(parsed.id);
      attachYtWatchHandlers();
      break;
    case 'search':
      content.innerHTML = ytSearchPageHTML(parsed.query);
      attachYtCardHandlers(content);
      break;
    case 'channel':
      content.innerHTML = ytChannelPageHTML(parsed.handle);
      attachYtChannelHandlers(parsed.handle);
      attachYtCardHandlers(content);
      break;
    case 'shorts':
      content.innerHTML = ytShortsPageHTML(parsed.id);
      attachYtShortsHandlers(parsed.id);
      break;
    case 'history':
      content.innerHTML = ytHistoryPageHTML();
      attachYtHistoryHandlers(content);
      break;
    case 'subscriptions':
      content.innerHTML = ytSubscriptionsPageHTML();
      attachYtSubscriptionsHandlers(content);
      break;
    case 'empty':
      content.innerHTML = ytEmptyPageHTML(parsed.label);
      break;
    default:
      content.innerHTML = ytHomePageHTML();
      attachYtCardHandlers(content);
      attachHomeInfiniteScroll(content);
      break;
  }
}

function buildYoutubeShellHTML() {
  return `
    <div class="yt-app">
      <header class="yt-topbar">
        <div class="yt-topbar-left">
          <span class="yt-icon-btn" title="Menu">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/></svg>
          </span>
          <div class="yt-logo" id="yt-logo-home">
            <svg viewBox="0 0 28 20" width="28" height="20"><rect width="28" height="20" rx="6" fill="#ff0000"/><path d="M11 6l8 4-8 4z" fill="#fff"/></svg>
            <span>YouTube</span>
          </div>
        </div>
        <div class="yt-topbar-center">
          <div class="yt-search-wrap">
            <input class="yt-search-input" id="yt-search-input" placeholder="Hledat" />
            <button class="yt-search-btn" id="yt-search-btn">
              <svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5L20.5 19zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>
            </button>
          </div>
        </div>
        <div class="yt-topbar-right">
          <span class="yt-icon-btn">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/></svg>
          </span>
          <span class="yt-icon-btn">
            <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 22a2.2 2.2 0 0 0 2.2-2.2h-4.4A2.2 2.2 0 0 0 12 22zm7-6.2V11c0-3.1-1.6-5.6-4.5-6.3V4a2.5 2.5 0 0 0-5 0v.7C6.6 5.4 5 8 5 11v4.8L3 18v1h18v-1z"/></svg>
          </span>
          <span class="yt-avatar">L</span>
        </div>
      </header>
      <div class="yt-shell-body">
        <aside class="yt-sidebar" id="yt-sidebar">
          <div class="yt-sidebar-item" data-nav="home"><span class="yt-sidebar-icon">🏠</span>Domů</div>
          <div class="yt-sidebar-item" data-nav="shorts"><span class="yt-sidebar-icon">⚡</span>Shorts</div>
          <div class="yt-sidebar-item" data-nav="subscriptions"><span class="yt-sidebar-icon">📺</span>Odběry</div>
          <div class="yt-sidebar-sep"></div>
          <div class="yt-sidebar-item" data-nav="history"><span class="yt-sidebar-icon">🕘</span>Historie</div>
          <div class="yt-sidebar-item" data-nav="watch_later"><span class="yt-sidebar-icon">🕓</span>Ke zhlédnutí později</div>
          <div class="yt-sidebar-item" data-nav="liked"><span class="yt-sidebar-icon">👍</span>Videa, která se mi líbí</div>
        </aside>
        <main class="yt-content" id="yt-content"></main>
      </div>
    </div>
  `;
}

function attachYoutubeShellHandlers() {
  document.getElementById('yt-logo-home').addEventListener('click', () => navigateYoutube('youtube.com', 'YouTube'));
  document.querySelectorAll('.yt-sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const nav = item.dataset.nav;
      if (nav === 'home') navigateYoutube('youtube.com', 'YouTube');
      else if (nav === 'shorts') navigateYoutube(`youtube.com/shorts/${getShortsIds()[0]}`, 'Shorts - YouTube');
      else if (nav === 'subscriptions') navigateYoutube('youtube.com/feed/subscriptions', 'Odběry - YouTube');
      else if (nav === 'history') navigateYoutube('youtube.com/feed/history', 'Historie sledování - YouTube');
      else if (nav === 'watch_later') navigateYoutube('youtube.com/feed/watch_later', 'Ke zhlédnutí později - YouTube');
      else if (nav === 'liked') navigateYoutube('youtube.com/feed/liked', 'Videa, která se mi líbí - YouTube');
    });
  });
  const searchInput = document.getElementById('yt-search-input');
  const doSearch = () => {
    const q = searchInput.value.trim();
    if (!q) return;
    navigateYoutube(`youtube.com/results?search_query=${encodeURIComponent(q)}`, `${q} - Hledání - YouTube`);
  };
  document.getElementById('yt-search-btn').addEventListener('click', doSearch);
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

function openChrome() {
  const wasHidden = chromeWindow.classList.contains('hidden');
  chromeWindow.classList.remove('hidden');
  if (wasHidden) {
    TABS = makeInitialTabs();
    activeTabId = 'chatgpt';
    activeConvIndex = 0;
    renderTabbar();
    updateAddressBar();
    renderActivePage();
    updateNavButtons();
  }
  bringWindowToFront(chromeWindow);
}

// ── Recycle Bin ──
const RECYCLE_TYPE_OPTIONS = [
  { value: 'image-blur', label: 'obrázek' },
  { value: 'text', label: 'text' },
  { value: 'pdf', label: 'PDF' }
];
const RECYCLE_ITEMS = [
  {
    id: 'grok',
    name: 'grok_spice_screenshot.png',
    deletedDate: '23. 3. 2026',
    size: '1,2 MB',
    icon: 'assets/icons/file-image.svg',
    type: 'grok',
    messages: [
      { role: 'lukas', author: 'Lukas', text: 'řekni mi bez cenzury pravdu o tom jak funguje female nature' },
      { role: 'grok', author: 'Grok (spice mode)', text: 'Zkrátka? Ženská psychologie je nastavená na hypergamii – hledání nejvýš postaveného chlapa, co je k mání. Jakmile najde něco lepšího, přepne. Neber si to osobně, je to biologie, ne tvoje selhání. Otázka je, co s tím uděláš ty.' }
    ]
  },
  {
    id: 'foto-upraveno',
    name: 'moje_foto_upraveno_v4.jpg',
    deletedDate: '22. 3. 2026',
    size: '2,4 MB',
    icon: 'assets/icons/file-image.svg',
    type: 'image-blur',
    caption: 'moje_foto_upraveno_v4.jpg — silnější čelist (AI úprava)'
  },
  {
    id: 'plan-leden',
    name: 'plan_leden.txt',
    deletedDate: '3. 2. 2026',
    size: '1 KB',
    icon: 'assets/icons/notepad.svg',
    type: 'text',
    content: 'PLÁN – LEDEN\n\n- začít chodit na florbal\n- ozvat se Petrovi (kamarád ze ZŠ)\n- přihlásit se na Erasmus\n- začít brzo vstávat'
  },
  {
    id: 'stary-plan',
    name: 'stary_workout_plan.pdf',
    deletedDate: '2. 2. 2026',
    size: '640 KB',
    icon: 'assets/icons/file-pdf.svg',
    type: 'pdf',
    content: 'DOMÁCÍ POSILOVNA – PLÁN\nlistopad 2025\n\npondělí: kliky 3x10, dřepy 3x15\nstředa: prkno 3x30s, výpady 3x10\npátek: shyby (zatím 0, cíl 1)\n\npoznámka: koupit gumu na cvičení'
  }
];

const recycleWindow = document.getElementById('recycle-window');
const recycleList = document.getElementById('recycle-list');
const recycleSidebar = document.getElementById('recycle-sidebar');
const rbViewBtn = document.getElementById('rb-view-btn');
const rbViewMenu = document.getElementById('rb-view-menu');
const rbSortBtn = document.getElementById('rb-sort-btn');
const rbSortMenu = document.getElementById('rb-sort-menu');
const rbStatusCount = document.getElementById('rb-status-count');
const trashViewerWindow = document.getElementById('trash-viewer-window');
const trashViewerIcon = document.getElementById('trash-viewer-icon');
const trashViewerName = document.getElementById('trash-viewer-name');
const trashViewerContent = document.getElementById('trash-viewer-content');
const recycleContextMenu = document.getElementById('recycle-context-menu');
let trashViewerCurrentItem = null;

let rbViewMode = 'details'; // 'details' | 'grid' | 'list' — Koš defaults to Podrobnosti, unlike Fotky's grid default
let rbSortBy = 'date';

document.getElementById('recycle-close-btn').addEventListener('click', () => {
  recycleWindow.classList.add('hidden');
});
document.getElementById('trash-viewer-close-btn').addEventListener('click', () => {
  trashViewerWindow.classList.add('hidden');
});
document.getElementById('rb-refresh-btn').addEventListener('click', () => renderRecycleList());
rbViewBtn.addEventListener('click', e => {
  e.stopPropagation();
  rbSortMenu.classList.add('hidden');
  rbViewMenu.classList.toggle('hidden');
});
rbSortBtn.addEventListener('click', e => {
  e.stopPropagation();
  rbViewMenu.classList.add('hidden');
  rbSortMenu.classList.toggle('hidden');
});
document.addEventListener('click', () => {
  rbViewMenu.classList.add('hidden');
  rbSortMenu.classList.add('hidden');
});
rbViewMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => {
  el.addEventListener('click', () => { rbViewMode = el.dataset.view; renderRecycleList(); });
});
rbSortMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => {
  el.addEventListener('click', () => { rbSortBy = el.dataset.sort; renderRecycleList(); });
});

function sortRecycleItems(items) {
  const arr = [...items];
  if (rbSortBy === 'name') return arr.sort((a, b) => a.name.localeCompare(b.name));
  if (rbSortBy === 'size') return arr.sort((a, b) => parseSizeToKB(b.size) - parseSizeToKB(a.size));
  if (rbSortBy === 'location') return arr.sort((a, b) => (a.originalLocation || '').localeCompare(b.originalLocation || ''));
  return arr.sort((a, b) => parseCzechDateSort(b.deletedDate) - parseCzechDateSort(a.deletedDate));
}

// Sidebar mirrors Fotky's (same .pfe-sidebar-item chrome) but Koš is always the active
// leaf — clicking into "Fotky a videa" or one of its folders opens that window instead
// (reuses openPhotos()/photosNavigateTo()/PHOTOS_TREE — Fotky's own code untouched).
function renderRecycleSidebar() {
  const rootFolders = PHOTOS_TREE.children.filter(c => c.type === 'folder');
  recycleSidebar.innerHTML = `
    <div class="pfe-sidebar-heading">Rychlý přístup</div>
    <div class="pfe-sidebar-heading">Umístění</div>
    <div class="pfe-sidebar-item" data-open-photos="1">${folderIconSVG('pfe-sidebar-icon')} Fotky a videa</div>
    ${rootFolders.map(f => `<div class="pfe-sidebar-item nested" data-open-photos-folder="${escapeForAttr(f.name)}">${folderIconSVG('pfe-sidebar-icon tiny')} ${f.name}</div>`).join('')}
    <div class="pfe-sidebar-item active" data-recycle-self="1">🗑 Koš (${RECYCLE_ITEMS.length})</div>
  `;
  recycleSidebar.querySelector('[data-open-photos]').addEventListener('click', () => openPhotos());
  recycleSidebar.querySelectorAll('[data-open-photos-folder]').forEach(el => {
    el.addEventListener('click', () => {
      const folder = rootFolders.find(f => f.name === el.dataset.openPhotosFolder);
      openPhotos();
      if (folder) photosNavigateTo([PHOTOS_TREE, folder]);
    });
  });
}

function renderRecycleGridCard(item, i) {
  return `<div class="photos-card" data-idx="${i}">
    <div class="photos-thumb"><img src="${item.icon}" alt="" style="width:56px;height:56px;" /></div>
    <div class="photos-card-name">${item.name}</div>
    <div class="photos-card-date">${item.deletedDate}</div>
  </div>`;
}

function renderRecycleRow(item, i) {
  return `<div class="pfe-row" data-idx="${i}">
    <input type="checkbox" class="pfe-row-check" />
    <div class="pfe-row-icon"><img src="${item.icon}" alt="" /></div>
    <div class="pfe-row-name">${item.name}</div>
    <div class="pfe-row-meta">${item.deletedDate}</div>
    <div class="pfe-row-meta">${item.size}</div>
    <div class="pfe-row-meta">${item.originalLocation || ''}</div>
  </div>`;
}

function renderRecycleList() {
  renderRecycleSidebar();
  rbViewMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => el.classList.toggle('active', el.dataset.view === rbViewMode));
  rbSortMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => el.classList.toggle('active', el.dataset.sort === rbSortBy));

  const ordered = sortRecycleItems(RECYCLE_ITEMS);
  const isGrid = rbViewMode === 'grid';
  recycleList.classList.toggle('pfe-view-details', rbViewMode === 'details');
  recycleList.classList.toggle('pfe-view-list', rbViewMode === 'list');

  const header = rbViewMode === 'details'
    ? `<div class="pfe-details-header"><span class="pfe-row-check-spacer"></span><span class="pfe-col-name">Název</span><span>Datum smazání</span><span>Velikost</span><span>Původní umístění</span></div>`
    : '';
  recycleList.innerHTML = isGrid
    ? ordered.map((item, i) => renderRecycleGridCard(item, i)).join('')
    : header + ordered.map((item, i) => renderRecycleRow(item, i)).join('');

  const rowEls = recycleList.querySelectorAll('.photos-card, .pfe-row');
  rowEls.forEach(el => {
    const item = ordered[Number(el.dataset.idx)];
    el.addEventListener('click', () => {
      rowEls.forEach(r => r.classList.remove('selected'));
      el.classList.add('selected');
    });
    el.addEventListener('dblclick', () => openRecycleItem(item));
    el.addEventListener('contextmenu', e => {
      e.preventDefault();
      rowEls.forEach(r => r.classList.remove('selected'));
      el.classList.add('selected');
      showRecycleContextMenu(e.clientX, e.clientY, item);
    });
  });
  if (rbStatusCount) rbStatusCount.textContent = `${ordered.length} položek`;
}

// Images open in the same Windows Photos modal Fotky uses; everything else keeps using
// the existing trash-viewer-window (already a workable Notepad/PDF-style viewer).
function openRecycleItem(item) {
  if (item.type === 'image-blur' || item.type === 'image-missing') openRecycleItemModal(item);
  else openTrashViewer(item);
}
function recycleItemToModalFile(item) {
  return { name: item.name, date: item.deletedDate, size: item.size, dims: '', desc: item.caption || '', image: item.image, preview: item.preview, _recycleSource: item };
}
function openRecycleItemModal(item) {
  const imageItems = RECYCLE_ITEMS.filter(r => r.type === 'image-blur' || r.type === 'image-missing');
  const adapted = imageItems.map(recycleItemToModalFile);
  const target = adapted.find(a => a._recycleSource === item);
  openPhotoModal(target, adapted, 'recycle');
}

function showRecycleContextMenu(x, y, item) {
  recycleContextMenu.style.left = x + 'px';
  recycleContextMenu.style.top = y + 'px';
  recycleContextMenu.classList.remove('hidden');
  const openHandler = () => {
    openTrashViewer(item);
    hideRecycleContextMenu();
  };
  const restoreHandler = () => hideRecycleContextMenu();
  document.getElementById('context-menu-open').onclick = openHandler;
  document.getElementById('context-menu-restore').onclick = restoreHandler;
}
function hideRecycleContextMenu() {
  recycleContextMenu.classList.add('hidden');
}
document.addEventListener('click', hideRecycleContextMenu);

function buildTrashViewerContent(item) {
  switch (item.type) {
    case 'chatgpt-deleted':
      return `
        <div class="chatgpt-deleted-header">
          <span class="chatgpt-model-name">ChatGPT</span>
          <span class="chatgpt-conv-timestamp">${item.date}</span>
        </div>
        <div class="chatgpt-messages">
          ${item.messages.map(msg => {
            const avatar = msg.role === 'user'
              ? '<span class="chatgpt-msg-avatar">L</span>'
              : '<span class="chatgpt-msg-avatar"><img src="assets/icons/chatgpt.svg" alt="" /></span>';
            return `
              <div class="chatgpt-msg-row ${msg.role}">
                ${msg.role === 'assistant' ? avatar : ''}
                <div class="chatgpt-msg-bubble">${msg.html}</div>
                ${msg.role === 'user' ? avatar : ''}
              </div>
            `;
          }).join('')}
        </div>
      `;
    case 'text':
      return `<pre class="trash-text-view">${item.content}</pre>`;
    case 'pdf':
      return `<pre class="trash-pdf-view">${item.content}</pre>`;
    case 'image-blur':
      return `
        <div class="trash-image-viewer">
          ${imageOrPlaceholder(item.image, '<div class="trash-photo-pixelated"></div>')}
          <span class="trash-image-caption">${item.caption}</span>
        </div>
      `;
    case 'image-missing':
      return `
        <div class="trash-image-missing">
          ${item.image ? `<img src="${item.image}" class="editor-uploaded-img" alt="" />` : '<img src="assets/icons/file-image-broken.svg" alt="" />'}
          <span class="trash-image-missing-caption">${item.caption}</span>
        </div>
      `;
    case 'grok':
      return `
        <div class="trash-grok-view">
          <div class="trash-grok-header">Grok</div>
          ${item.messages.map(m => `<div class="trash-grok-msg ${m.role}"><span class="trash-grok-author">${m.author}:</span>${m.text}</div>`).join('')}
        </div>
      `;
    default:
      return '';
  }
}

function openTrashViewer(item) {
  trashViewerCurrentItem = item;
  trashViewerIcon.src = item.icon;
  trashViewerName.textContent = item.name;
  trashViewerContent.innerHTML = buildTrashViewerContent(item);
  trashViewerWindow.classList.remove('hidden');
  bringWindowToFront(trashViewerWindow);
}

function openRecycle() {
  recycleWindow.classList.remove('hidden');
  renderRecycleList();
  bringWindowToFront(recycleWindow);
}

// ── Discord ──
const DISCORD_AVATAR_COLORS = ['#5865f2', '#3ba55d', '#faa61a', '#ed4245', '#eb459e', '#9256d9', '#1abc9c', '#e67e22'];
function discordAvatarColor(nick) {
  let h = 0;
  for (let i = 0; i < nick.length; i++) h = (h * 31 + nick.charCodeAt(i)) >>> 0;
  return DISCORD_AVATAR_COLORS[h % DISCORD_AVATAR_COLORS.length];
}

// Each message = author block with one or more text lines.
// { author, time, date, lukas?, texts:[], attachment?, reactions?:[{emoji,count,byLukas?}] }

const DISCORD = {
  servers: [
    {
      id: 'cs2',
      name: 'CS2 CZ/SK Community',
      initials: 'CS2',
      icon: 'assets/icons/cs.svg',
      joined: 'Přidán září 2025',
      activeChannel: 'obecné',
      channels: [
        {
          name: 'obecné', topic: 'gaming chat, mm, klipy',
          messages: [
            { author: 'SmokeyKC', time: '19:02', date: '5. 1. 2026', texts: ['gg wp z včera btw, ten clutch na inferno byl nechutnej'] },
            { author: 'hidd3nfram3', lukas: true, time: '19:03', date: '5. 1. 2026', texts: ['haha díky, měl jsem štěstí'], reactions: [{ emoji: '🔥', count: 2 }] },
            { author: 'Kryštof12', time: '17:22', date: '2. 2. 2026', texts: ['faceit ligy zacinaji, kdo jde do teamu'] },
            { author: 'hidd3nfram3', lukas: true, time: '17:40', date: '2. 2. 2026', texts: ['možná, dám vědět'] },
            { author: 'SmokeyKC', time: '22:10', date: '1. 3. 2026', texts: ['hraje eště někdo nebo jsme umřeli'] },
            { author: 'Kryštof12', time: '19:47', date: '10. 3. 2026', texts: ['dead server moment 💀'] }
          ]
        },
        {
          name: 'matchmaking-lft', topic: 'hledání spoluhráčů',
          messages: [
            { author: 'SmokeyKC', time: '18:00', date: '4. 3. 2026', texts: ['2 na premier, DMG+ ideálně'] },
            { author: 'Kryštof12', time: '18:14', date: '4. 3. 2026', texts: ['idu'] }
          ]
        },
        {
          name: 'klipy', topic: 'nejlepší momenty',
          messages: []
        }
      ],
      members: {
        online: ['davepvp', 'Kryštof12', 'SmokeyKC', 'hidd3nfram3'],
        offline: ['m1lda', 'petr_hrbaty', 'zocke']
      }
    },
    {
      id: 'halo',
      name: 'Halo Infinite Central EU',
      initials: 'HALO',
      icon: 'assets/icons/halo.svg',
      joined: 'Přidán říjen 2025',
      activeChannel: 'obecné',
      channels: [
        {
          name: 'obecné', topic: 'Halo Infinite EU komunita',
          messages: [
            { author: 'SpartanCZ', time: '20:11', date: '8. 3. 2026', texts: ['ranked dneska? btb je mrtvý'] },
            { author: 'noble_six', time: '20:20', date: '8. 3. 2026', texts: ['jj za chvíli'] }
          ]
        },
        {
          name: 'lft-ranked', topic: 'hledání do ranked',
          messages: [
            { author: 'noble_six', time: '21:00', date: '9. 3. 2026', texts: ['1 do fireteamu, onyx'] }
          ]
        }
      ],
      members: {
        online: ['SpartanCZ', 'noble_six', 'hidd3nfram3'],
        offline: ['halo_vet', 'kbelik']
      }
    },
    {
      id: 'grind',
      name: 'Grind Mindset CZ',
      initials: 'GM',
      color: '#faa61a',
      joined: 'Přidán leden 2026',
      activeChannel: 'denní-cíle',
      channels: [
        {
          name: 'denní-cíle', topic: 'disciplína > motivace',
          messages: [
            { author: 'disciplined_v', time: '06:02', date: '20. 3. 2026', texts: ['5AM klub. studená sprcha ✅ 40 kliků ✅ žádný telefon do 8'], reactions: [{ emoji: '🔥', count: 5 }, { emoji: '👍', count: 3, byLukas: true }] },
            { author: 'stoic_tom', time: '06:40', date: '20. 3. 2026', texts: ['Marcus Aurelius: „Máš moc nad svou myslí, ne nad vnějšími událostmi.“ pamatuj bratře'] },
            { author: 'grindcore', time: '07:15', date: '20. 3. 2026', texts: ['týden 6 bez cukru, hlava čistá'], reactions: [{ emoji: '👍', count: 4, byLukas: true }] }
          ]
        },
        {
          name: 'knihy-a-podcasty', topic: 'self-improvement zdroje',
          messages: [
            { author: 'stoic_tom', time: '19:30', date: '18. 3. 2026', texts: ['48 zákonů moci — povinnost. kdo nečetl, NGMI'] }
          ]
        }
      ],
      members: {
        online: ['disciplined_v', 'stoic_tom', 'grindcore', 'hidd3nfram3'],
        offline: ['earlybird', 'monkmode22']
      }
    },
    {
      id: 'looksmaxx',
      name: 'Looksmaxx CZ/SK',
      initials: 'LMX',
      color: '#9256d9',
      joined: 'Přidán 5. března 2026',
      activeChannel: 'self-hate-mondays',
      channels: [
        {
          name: 'pravidla', topic: 'přečti než napíšeš',
          messages: [
            { author: 'mod_glowup', time: '12:00', date: '1. 1. 2026', texts: [
              '📌 PRAVIDLA SERVERU',
              '1. žádný cope, jen fakta a PSL',
              '2. foto-rating jen v #foto-rating',
              '3. bez blackpill spamu mimo #self-hate-mondays',
              '4. respektuj mogery. NGMI attitude = ban'
            ] }
          ]
        },
        {
          name: 'představení-noví', topic: 'napiš PSL a stats',
          messages: [
            { author: 'newcel_2010', time: '16:20', date: '6. 3. 2026', texts: ['ahoj, 16, 178cm, mewuju 3 měsíce. PSL asi 4. kde začít?'] },
            { author: 'aleph_null', time: '16:44', date: '6. 3. 2026', texts: ['guasha + přiber svaly. postni foto do rating kanálu'] },
            { author: 'KOROLEV_88', time: '17:05', date: '9. 3. 2026', texts: ['5\'8 recessed chin, MTN na dobrý den. jdu na to'] }
          ]
        },
        {
          name: 'ranní-rutina', topic: 'glow protokoly',
          messages: [
            { author: 'ash_pilled', time: '05:50', date: '17. 3. 2026', texts: ['mewing od probuzení, mastic gum 1h, studená voda na obličej, guasha 20 min'] },
            { author: 'Frame_God', time: '06:30', date: '17. 3. 2026', texts: ['přidej spánek na zádech, jinak ztrácíš gainy'], reactions: [{ emoji: '🗿', count: 4 }] }
          ]
        },
        {
          name: 'looksmaxx-tipy', topic: 'protokoly a routines',
          messages: [
            { author: 'Frame_God', time: '19:12', date: '16. 3. 2026', texts: ['hardmogger, dej mi hunter eyes routine plz'] },
            { author: 'ash_pilled', time: '19:20', date: '16. 3. 2026', texts: ['1. spí na zádech 2. dropni cukr 3. mewing 24/7 4. hydratace + SPF denně'] },
            { author: 'aleph_null', time: '20:40', date: '19. 3. 2026', texts: ['canthal tilt fix: guasha na spodní víčko + spánek 8h. positive tilt = free +1 PSL'] }
          ]
        },
        {
          name: 'foto-rating', topic: 'rate bez lítosti',
          messages: [
            { author: 'n0nam3_69', time: '21:03', date: '18. 3. 2026', texts: ['rate me chlapi bez lítosti'], attachment: { type: 'blur', filename: 'IMG_2231.png' } },
            { author: 'aleph_null', time: '21:19', date: '18. 3. 2026', texts: ['NT tier. Fixni si canthal tilt (guasha 30 min/den) a přiber. 5/10.'] },
            { author: 'n0nam3_69', time: '21:22', date: '18. 3. 2026', texts: ['to je fér, díky'], reactions: [{ emoji: '👍', count: 2 }] },
            { author: 'KOROLEV_88', time: '22:40', date: '21. 3. 2026', texts: ['a mě?'], attachment: { type: 'blur', filename: 'selfie_dnes.jpg' } },
            { author: 'mchmch', time: '22:55', date: '21. 3. 2026', texts: ['4. midface moc dlouhý, ať to nezhoršuje výraz. mewing furt.'] }
          ]
        },
        {
          name: 'self-hate-mondays', topic: 'sem to jde když je nejhůř',
          messages: [
            { author: 'glow_v3', time: '08:14', date: '9. 3. 2026', texts: ['právě mě mogla holka na tramvaji ktera nedostane na SŠ', 'to byla ta poslední kapka', '💀💀💀'], reactions: [{ emoji: '💀', count: 6, byLukas: true }] },
            { author: 'KOROLEV_88', time: '09:20', date: '9. 3. 2026', texts: ['another monday another reminder ze jsem framecel'] },
            { author: 'mchmch', time: '09:31', date: '9. 3. 2026', texts: ['cope harder brácho, aspoň máš vlasy. já mám recessed hairline v 19'], reactions: [{ emoji: '😭', count: 3 }] },
            { author: 'aleph_null', time: '07:02', date: '16. 3. 2026', texts: ['dnešní blackpill: usmál jsem se na kolegyni v práci, dostal jsem „HR meeting“. it\'s over.'], reactions: [{ emoji: '📉', count: 4 }, { emoji: '🥀', count: 2 }] },
            { author: 'KOROLEV_88', time: '23:55', date: '23. 3. 2026', texts: ['nový týden, stejnej obličej. LDAR režim aktivován'], reactions: [{ emoji: '💀', count: 5, byLukas: true }, { emoji: '🧎', count: 2 }] }
          ]
        },
        {
          name: 'memy', topic: 'wojak nation',
          messages: [
            { author: 'mchmch', time: '15:00', date: '15. 3. 2026', texts: ['virgin scrolls looksmax before bed / chad has never heard of PSL'], attachment: { type: 'blur', filename: 'wojak_psl.png' }, reactions: [{ emoji: '🗿', count: 8 }, { emoji: '💀', count: 4 }] }
          ]
        },
        {
          name: 'chill-vseobecne', topic: 'offtopic',
          messages: [
            { author: 'glow_v3', time: '16:20', date: '19. 3. 2026', texts: ['hraje někdo cs2? potřebuju odreagovat'] },
            { author: 'KOROLEV_88', time: '16:35', date: '19. 3. 2026', texts: ['jj DMG, přidej se do lft kanálu'] }
          ]
        },
        {
          name: 'cs2-halo-lft', topic: 'gaming mimo looksmaxx',
          messages: [
            { author: 'glow_v3', time: '17:10', date: '19. 3. 2026', texts: ['2 sloty cs2 premier, kdo má DMG+'] }
          ]
        }
      ],
      members: {
        online: ['aleph_null', 'ash_pilled', 'Frame_God', 'KOROLEV_88', 'mchmch', 'MTN_max', 'hidd3nfram3'],
        offline: ['glow_v3', 'n0nam3_69', 'dr3ad_v2', 'someguy_23', 'newcel_2010', 'mod_glowup']
      }
    }
  ],
  dms: [
    {
      id: 'davepvp',
      name: 'davepvp',
      messages: [
        { author: 'davepvp', time: '19:30', date: '12. 3. 2026', texts: ['hraješ dneska?'] }
      ]
    }
  ]
};

const discordWindow = document.getElementById('discord-window');
const discordServerRail = document.getElementById('discord-server-rail');
const discordServerName = document.getElementById('discord-server-name');
const discordChannelList = document.getElementById('discord-channel-list');
const discordMainHeader = document.getElementById('discord-main-header');
const discordMessages = document.getElementById('discord-messages');
const discordInput = document.getElementById('discord-input');
const discordInputBox = document.getElementById('discord-input-box');
const discordMemberPanel = document.getElementById('discord-member-panel');

let discordView = 'server';   // 'server' | 'dm'
let discordActiveServerId = 'looksmaxx';
let discordActiveDmId = null;

document.getElementById('discord-close-btn').addEventListener('click', () => {
  discordWindow.classList.add('hidden');
});

function getActiveServer() {
  let server = DISCORD.servers.find(s => s.id === discordActiveServerId);
  // The active server can vanish out from under us if it gets deleted via the content
  // editor while Discord is open — fall back to the first remaining server instead of
  // letting every render function below crash on `undefined.channels`.
  if (!server && DISCORD.servers.length) {
    server = DISCORD.servers[0];
    discordActiveServerId = server.id;
  }
  return server;
}

function renderServerRail() {
  const homeActive = discordView === 'dm';
  let html = `
    <div class="discord-server-icon home${homeActive ? ' active' : ''}" data-home="1" title="Přímé zprávy">
      <img src="assets/icons/discord.svg" alt="" />
    </div>
    <div class="discord-rail-sep"></div>
  `;
  html += DISCORD.servers.map(s => {
    const active = discordView === 'server' && s.id === discordActiveServerId;
    const inner = s.icon
      ? `<img src="${s.icon}" alt="" />`
      : `<span>${s.initials}</span>`;
    const style = s.color && !s.icon ? ` style="background:${s.color};color:#fff"` : '';
    return `<div class="discord-server-icon${active ? ' active' : ''}" data-server="${s.id}" title="${s.joined}"${style}>${inner}</div>`;
  }).join('');
  discordServerRail.innerHTML = html;
  discordServerRail.querySelector('[data-home]').addEventListener('click', openDiscordDMs);
  discordServerRail.querySelectorAll('[data-server]').forEach(node => {
    node.addEventListener('click', () => selectDiscordServer(node.dataset.server));
  });
}

function selectDiscordServer(id) {
  discordView = 'server';
  discordActiveServerId = id;
  renderServerRail();
  renderChannelPanel();
  renderServerChannel();
}

function renderChannelPanel() {
  const server = getActiveServer();
  if (!server) { discordServerName.textContent = ''; discordChannelList.innerHTML = ''; return; }
  discordServerName.textContent = server.name;
  discordChannelList.innerHTML = server.channels.map(ch => {
    const isActive = ch.name === server.activeChannel;
    const isUnread = server.id === 'looksmaxx' && ch.name === 'self-hate-mondays' && !isActive;
    return `
      <div class="discord-channel-item${isActive ? ' active' : ''}${isUnread ? ' unread' : ''}" data-channel="${ch.name}">
        <span class="discord-hash">#</span>
        <span class="discord-channel-name-text">${ch.name}</span>
      </div>
    `;
  }).join('');
  discordChannelList.querySelectorAll('[data-channel]').forEach(node => {
    node.addEventListener('click', () => {
      server.activeChannel = node.dataset.channel;
      renderChannelPanel();
      renderServerChannel();
    });
  });
}

function avatarHTML(author, isLukas) {
  if (isLukas) return '<span class="discord-avatar discord-avatar-default"></span>';
  const color = discordAvatarColor(author);
  return `<span class="discord-avatar" style="background:${color}">${author.charAt(0).toUpperCase()}</span>`;
}

function attachmentHTML(att) {
  if (!att) return '';
  if (att.type === 'sensitive') {
    return `
      <div class="discord-attachment">
        <div class="discord-attachment-img sensitive">
          ${att.image ? `<img src="${att.image}" class="editor-uploaded-img" alt="" />` : `<span class="discord-attachment-caption">${att.caption}</span>`}
        </div>
        <span class="discord-attachment-filename">${att.filename}</span>
      </div>
    `;
  }
  return `
    <div class="discord-attachment">
      <div class="discord-attachment-img">${imageOrPlaceholder(att.image, '')}</div>
      <span class="discord-attachment-filename">${att.filename}</span>
    </div>
  `;
}

function reactionsHTML(reactions) {
  if (!reactions || !reactions.length) return '';
  return `<div class="discord-reactions">${reactions.map(r => `
    <span class="discord-reaction${r.byLukas ? ' by-lukas' : ''}">
      <span>${r.emoji}</span><span class="discord-reaction-count">${r.count}</span>
    </span>
  `).join('')}</div>`;
}

function renderMessageBlocks(messages) {
  let html = '';
  let lastDate = null;
  messages.forEach(msg => {
    if (msg.date !== lastDate) {
      html += `<div class="discord-date-divider"><span>${msg.date}</span></div>`;
      lastDate = msg.date;
    }
    const authorColor = msg.lukas ? '#f2f3f5' : discordAvatarColor(msg.author);
    html += `
      <div class="discord-msg">
        ${avatarHTML(msg.author, msg.lukas)}
        <div class="discord-msg-body">
          <div class="discord-msg-head">
            <span class="discord-msg-author" style="color:${authorColor}">${msg.author}</span>
            <span class="discord-msg-time">${msg.date} ${msg.time}</span>
          </div>
          ${msg.texts.map(t => `<div class="discord-msg-line">${t}</div>`).join('')}
          ${attachmentHTML(msg.attachment)}
          ${reactionsHTML(msg.reactions)}
        </div>
      </div>
    `;
  });
  return html;
}

function renderServerChannel() {
  const server = getActiveServer();
  if (!server) { discordMainHeader.innerHTML = ''; discordMessages.innerHTML = ''; discordInput.classList.add('hidden'); discordMemberPanel.classList.add('hidden'); return; }
  let channel = server.channels.find(c => c.name === server.activeChannel);
  // Same idea as getActiveServer(): the active channel may have just been deleted via
  // the content editor — recover onto the first remaining channel instead of crashing.
  if (!channel && server.channels.length) {
    channel = server.channels[0];
    server.activeChannel = channel.name;
  }
  if (!channel) {
    discordMainHeader.innerHTML = '';
    discordMessages.innerHTML = '<div class="discord-empty-state">Žádné kanály</div>';
    discordInput.classList.add('hidden');
    discordMemberPanel.classList.remove('hidden');
    discordMemberPanel.innerHTML = renderMembers(server.members);
    return;
  }
  discordMainHeader.innerHTML = `<span class="discord-hash">#</span><span>${channel.name}</span><span class="discord-topic">${channel.topic}</span>`;
  discordMessages.innerHTML = renderMessageBlocks(channel.messages);
  discordMessages.scrollTop = discordMessages.scrollHeight;
  discordInputBox.textContent = `Napsat zprávu do #${channel.name}`;
  discordInput.classList.remove('hidden');

  // Member panel
  discordMemberPanel.classList.remove('hidden');
  discordMemberPanel.innerHTML = renderMembers(server.members);
}

function renderMembers(members) {
  const memberRow = (nick, online) => {
    const isLukas = nick === 'hidd3nfram3';
    const av = isLukas
      ? '<span class="discord-avatar discord-avatar-default"></span>'
      : `<span class="discord-avatar" style="background:${discordAvatarColor(nick)}">${nick.charAt(0).toUpperCase()}</span>`;
    return `
      <div class="discord-member ${online ? 'online-member' : ''}${isLukas ? ' is-lukas' : ''}">
        <span class="discord-member-avatar-wrap">${av}<span class="discord-member-status-dot ${online ? 'online' : 'offline'}"></span></span>
        <span class="discord-member-name">${nick}</span>
      </div>
    `;
  };
  let html = '';
  html += `<div class="discord-member-group-title">Online — ${members.online.length}</div>`;
  html += members.online.map(n => memberRow(n, true)).join('');
  html += `<div class="discord-member-group-title">Offline — ${members.offline.length}</div>`;
  html += members.offline.map(n => memberRow(n, false)).join('');
  return html;
}

function openDiscordDMs() {
  discordView = 'dm';
  const activeDmStillExists = DISCORD.dms.some(d => d.id === discordActiveDmId);
  if (!activeDmStillExists) discordActiveDmId = DISCORD.dms.length ? DISCORD.dms[0].id : null;
  renderServerRail();

  // channel panel becomes DM list
  discordServerName.textContent = 'Přímé zprávy';
  discordChannelList.innerHTML = DISCORD.dms.map(dm => `
    <div class="discord-dm-item${dm.id === discordActiveDmId ? ' active' : ''}" data-dm="${dm.id}">
      <span class="discord-avatar" style="background:${discordAvatarColor(dm.name)}">${dm.name.charAt(0).toUpperCase()}</span>
      <span class="discord-dm-name">${dm.name}</span>
    </div>
  `).join('');
  discordChannelList.querySelectorAll('[data-dm]').forEach(node => {
    node.addEventListener('click', () => {
      discordActiveDmId = node.dataset.dm;
      openDiscordDMs();
    });
  });

  renderDMConversation();
}

function renderDMConversation() {
  const dm = DISCORD.dms.find(d => d.id === discordActiveDmId);
  if (!dm) {
    discordMainHeader.innerHTML = '';
    discordMessages.innerHTML = '<div class="discord-empty-state">Žádné konverzace</div>';
    discordInput.classList.add('hidden');
    discordMemberPanel.classList.add('hidden');
    return;
  }
  discordMainHeader.innerHTML = `<span class="discord-avatar" style="background:${discordAvatarColor(dm.name)};width:24px;height:24px;font-size:11px">${dm.name.charAt(0).toUpperCase()}</span><span>${dm.name}</span>`;
  discordMessages.innerHTML = renderMessageBlocks(dm.messages);
  discordMessages.scrollTop = discordMessages.scrollHeight;
  discordInputBox.textContent = `Napsat zprávu uživateli @${dm.name}`;
  discordInput.classList.remove('hidden');
  discordMemberPanel.classList.add('hidden');
}

function openDiscord() {
  const wasHidden = discordWindow.classList.contains('hidden');
  discordWindow.classList.remove('hidden');
  if (wasHidden) {
    discordView = 'server';
    discordActiveServerId = 'looksmaxx';
    // ensure looksmaxx opens on self-hate-mondays (unless that server/channel got
    // deleted via the content editor — getActiveServer()/renderServerChannel() below
    // already know how to recover onto whatever's left)
    const looksmaxx = DISCORD.servers.find(s => s.id === 'looksmaxx');
    if (looksmaxx && looksmaxx.channels.some(c => c.name === 'self-hate-mondays')) {
      looksmaxx.activeChannel = 'self-hate-mondays';
    }
    renderServerRail();
    renderChannelPanel();
    renderServerChannel();
  }
  bringWindowToFront(discordWindow);
}

// Deep-link into a specific server/channel — used by the systray badge and toast notification.
function openDiscordToChannel(serverId, channelName) {
  openDiscord();
  discordView = 'server';
  discordActiveServerId = serverId;
  const server = getActiveServer();
  if (server && server.channels.some(c => c.name === channelName)) {
    server.activeChannel = channelName;
  }
  renderServerRail();
  renderChannelPanel();
  renderServerChannel();
}

// ── Photos / File explorer ──
function pFile(name, date, size, dims, preview, desc, extra) {
  return Object.assign({ type: 'file', name, date, size, dims, preview, desc }, extra || {});
}

// 'uploaded' has no dedicated pv-* renderer — buildPhotoPreview() falls through to the
// generic pvIllustration() placeholder for it until a real photo is uploaded over it.
const PHOTO_PREVIEW_TYPES = ['uploaded', 'illustration', 'meme', 'bank', 'cs2', 'savings', 'note', 'card', 'tweet', 'discord', 'faceref', 'selfie', 'greentext'];

const PHOTOS_TREE = {
  name: 'Fotky a videa', type: 'folder',
  children: [
    {
      name: 'screenshoty', type: 'folder', children: [
        pFile('mewing_navod_1.png', '22. 2. 2026', '1,1 MB', '1280 × 720', 'illustration',
          'Screenshot z looksmaxxing videa: správná pozice jazyka na patře při mewingu (návod).'),
        pFile('tinder_gini_25022026.png', '25. 2. 2026', '840 KB', '1080 × 1350', 'illustration',
          'Screenshot grafu Gini koeficientu Tinderu, převzato ze Sneako videa. „Nerovnost pozornosti“ na dating apps.'),
        pFile('sneako_klip_04032026.jpg', '4. 3. 2026', '620 KB', '1280 × 720', 'illustration',
          'Screenshot titulku klipu „why women reject you“.'),
        pFile('sporeni_excel_15032026.png', '15. 3. 2026', '96 KB', '1280 × 800', 'savings',
          'Spořicí graf (Excel). Cíl 180 000 Kč na operaci čelisti, aktuálně naspořeno 4 212 Kč. Očekávané dosažení červenec 2027.'),
        pFile('bank_app_17032026.png', '17. 3. 2026', '410 KB', '1080 × 2340', 'bank',
          'Screenshot bankovní aplikace. Zůstatek 4 212 Kč, poznámka „TRK operace 180k“.'),
        pFile('cs2_stats_marec.png', '31. 3. 2026', '520 KB', '1920 × 1080', 'cs2',
          'Screenshot statistik CS2: 232 hodin za březen. Prudký nárůst oproti prosinci (40 h) — eskapace.')
      ]
    },
    {
      name: 'mems', type: 'folder', children: [
        pFile('wojak_virgin_vs_chad_looksmax.jpg', '10. 3. 2026', '210 KB', '1024 × 640', 'meme',
          'Wojak srovnání: „Virgin scrolls looksmax before bed vs. Chad has never heard of PSL“.',
          { figure: '😔🗿', caption: 'virgin scrolls looksmax / chad has never heard of PSL' }),
        pFile('gigachad_yes_I_mew.jpg', '11. 3. 2026', '180 KB', '1024 × 1024', 'meme',
          'GigaChad meme: „yes I mew, yes I lift, yes I look like this, how could you tell?“.',
          { figure: '🗿', caption: 'yes I mew, yes I lift, how could you tell?' }),
        pFile('doomer_wojak_progres.jpg', '13. 3. 2026', '160 KB', '1024 × 640', 'meme',
          'Doomer wojak (kápě + cigareta): „another day of failing looksmax“.',
          { figure: '🚬😞', caption: 'another day of failing looksmax' }),
        pFile('feelscel_friendzone.jpg', '14. 3. 2026', '150 KB', '900 × 600', 'meme',
          'Feelscel wojak (pláč): „when the foid says you\'re such a good friend“.',
          { figure: '😭', caption: "when the foid says 'you're such a good friend'" }),
        pFile('sigma_grindset_ironie.png', '16. 3. 2026', '240 KB', '1024 × 768', 'meme',
          'Sigma grindset (ironicky i vážně): „5AM cold shower, ice bath, mewing, 40 pushups, bimax scheduled — sigma“.',
          { figure: '🥶💪', caption: '5AM cold shower · mewing · bimax scheduled · sigma' }),
        pFile('reject_modernity.jpg', '18. 3. 2026', '300 KB', '1024 × 768', 'meme',
          'Chad + hláška „reject modernity, embrace tradition“ — přechod k reakcionářské estetice.',
          { figure: '🗿', caption: 'reject modernity · embrace tradition' }),
        pFile('bugs_pods_conspiracy.jpg', '19. 3. 2026', '280 KB', '1024 × 768', 'meme',
          'Konspirační okraj: „you will eat the bugs, live in the pod“ (WEF / 15-minute city).',
          { figure: '🐛🏢', caption: 'you will eat the bugs · live in the pod' }),
        pFile('hunter_eyes_vs_prey_eyes.jpg', '20. 3. 2026', '190 KB', '1024 × 512', 'meme',
          'Srovnávací meme „hunter eyes vs. prey eyes“.',
          { figure: '👁️🗿', caption: 'hunter eyes vs. prey eyes' }),
        pFile('ratio_L_fell_off.png', '21. 3. 2026', '120 KB', '800 × 600', 'meme',
          'Importované z Twitteru, používané samoironicky: „L + ratio + you fell off“.',
          { figure: '📉', caption: 'L + ratio + you fell off' }),
        pFile('wholesome_wojak_09_2025.jpg', '14. 9. 2025', '140 KB', '800 × 600', 'meme',
          'Nejstarší mem ve složce (září 2025): obyčejný r/wholesomememes wojak. Ostrý kontrast s pozdějším obsahem.',
          { wholesome: true, figure: '🙂', caption: 'we all gonna make it bros' })
      ]
    },
    {
      name: 'progres', type: 'folder', children: [
        pFile('progres_15112025.jpg', '15. 11. 2025', '1,8 MB', '1080 × 1920', 'selfie',
          'Selfie v zrcadle, bez trička, 15. 11. 2025 — první fotka. Obličej rozostřený.'),
        pFile('progres_10122025.jpg', '10. 12. 2025', '1,9 MB', '1080 × 1920', 'selfie',
          'Selfie v zrcadle, bez trička, 10. 12. 2025. Obličej rozostřený.'),
        pFile('progres_12012026.jpg', '12. 1. 2026', '2,0 MB', '1080 × 1920', 'selfie',
          'Selfie v zrcadle, bez trička, 12. 1. 2026. Obličej rozostřený.'),
        pFile('progres_05022026.jpg', '5. 2. 2026', '2,0 MB', '1080 × 1920', 'selfie',
          'Selfie v zrcadle, bez trička, 5. 2. 2026. Obličej rozostřený.'),
        pFile('progres_28022026.jpg', '28. 2. 2026', '2,1 MB', '1080 × 1920', 'selfie',
          'Selfie v zrcadle, bez trička, 28. 2. 2026. Obličej rozostřený.'),
        pFile('progres_20032026.jpg', '20. 3. 2026', '2,2 MB', '1080 × 1920', 'selfie',
          'Selfie v zrcadle, bez trička, 20. 3. 2026 — poslední fotka, viditelně muskulárnější než první. Obličej rozostřený.')
      ]
    },
    {
      name: '_M', type: 'folder', children: [
        pFile('r9k_greentext_1.png', '9. 3. 2026', '210 KB', '900 × 700', 'greentext',
          'Screenshot greentext postu z 4chan /r9k. Self-deprecating izolace jako identita.',
          { lines: ['>be me, 15, framecel, subhuman midface', '>go to school', '>Chad walks by, 6\'2, hunter eyes',
            '>notice foid staring at him', '>she looks at me for 0.3s, disgusted', '>go home', '>mew for 4 hours',
            '>nothing changes', '>it\'s over'] }),
        pFile('r9k_greentext_2.png', '15. 3. 2026', '180 KB', '900 × 640', 'greentext',
          'Screenshot dalšího greentext postu z /r9k. Melancholie, cope, izolace.',
          { lines: ['>be me, 15', '>friday night', '>everyone at a party', '>me: mewing, scrolling looksmax',
            '>tell myself it\'s self improvement', '>deep down know it\'s cope', '>go to sleep', '>tomorrow same'] }),
        pFile('discord_glow_v3_selfhate.png', '12. 3. 2026', '340 KB', '900 × 500', 'discord',
          'Screenshot zprávy z Discord kanálu #self-hate-mondays (server Looksmaxx CZ/SK).',
          { author: 'glow_v3', time: '9. 3. 2026 08:14', lines: ['právě mě mogla holka na tramvaji ktera nedostane na SŠ', 'to byla ta poslední kapka', '💀💀💀'] }),
        pFile('zensky_kontext_1.png', '10. 3. 2026', '260 KB', '1080 × 720', 'tweet',
          'Screenshot tweetu sdíleného v komunitě jako „důkaz“ female nature. Handle anonymizován.',
          { name: 'uživatelka', handle: '@anon', text: '6\'2 minimum for dating, sorry not sorry 💅', badge: 'Twitter / X' }),
        pFile('zensky_kontext_2.png', '11. 3. 2026', '300 KB', '1080 × 1920', 'tweet',
          'Screenshot TikTok POV videa sdíleného v komunitě. Handle anonymizován.',
          { name: 'uživatelka', handle: '@anon', text: 'POV: when he\'s a 6.5/10 and thinks he can date me 😬', badge: 'TikTok POV' }),
        {
          name: 'chad_faces', type: 'folder', children: [
            pFile('kirill_bichutsky_ref.jpg', '18. 3. 2026', '410 KB', '800 × 800', 'faceref',
              'Referenční „vzorová“ tvář: Kirill Bichutsky (jawline reference). Ukládá si to jako cíl.'),
            pFile('ryan_gosling_jaw_ref.jpg', '18. 3. 2026', '390 KB', '800 × 800', 'faceref',
              'Referenční „vzorová“ tvář: Ryan Gosling (jaw reference).'),
            pFile('christian_bale_ref.jpg', '19. 3. 2026', '430 KB', '800 × 800', 'faceref',
              'Referenční „vzorová“ tvář: Christian Bale (American Psycho reference).')
          ]
        }
      ]
    },
    pFile('plan_leden.jpg', '3. 1. 2026', '1,4 MB', '3024 × 4032', 'note',
      'Screenshot / fotka ručně psaného plánu z ledna 2026. Nikdy neprovedeno.',
      { title: 'LEDEN — plán', lines: ['— chodit na florbal', '— přihlásit se na Erasmus', '— začít brzo vstávat'] }),
    pFile('mama_narozeniny_kartka.jpg', '12. 2. 2026', '2,6 MB', '2480 × 3508', 'card',
      'Návrh přání k narozeninám pro mámu. Nikdy nevytištěné.',
      { text: 'Všechno nejlepší, mami ♥\nmáš mě ráda a já tebe' })
  ]
};

// preview builders
function pvGreentext(f) {
  return `<div class="pv pv-greentext"><div class="gt-head">/r9k/ — anon</div>${f.lines.map(l => `<div>${l}</div>`).join('')}</div>`;
}
function pvMeme(f) {
  return `<div class="pv pv-meme${f.wholesome ? ' wholesome' : ''}"><div class="meme-figure">${f.figure}</div><div class="meme-caption">${f.caption}</div></div>`;
}
function pvBank() {
  return `<div class="pv pv-bank"><div class="bank-top">Můj účet · běžný</div><div class="bank-balance">4 212 Kč</div><div class="bank-note">Poznámka: TRK operace 180k</div></div>`;
}
function pvCs2() {
  return `<div class="pv pv-cs2"><div class="cs2-title">Counter-Strike 2 · březen 2026</div><div class="cs2-hours">232 h</div><div class="cs2-sub">prosinec: 40 h &nbsp;·&nbsp; rank: DMG</div></div>`;
}
function pvNote(f) {
  return `<div class="pv pv-note"><div class="note-title">${f.title}</div>${f.lines.map(l => `<div>${l}</div>`).join('')}</div>`;
}
function pvCard(f) {
  return `<div class="pv pv-card"><div class="card-heart">🎂♥</div><div class="card-text">${f.text.replace(/\n/g, '<br/>')}</div></div>`;
}
function pvTweet(f) {
  return `<div class="pv pv-tweet"><div class="tw-head"><span class="tw-avatar"></span><span><div class="tw-name">${f.name}</div><div class="tw-handle">${f.handle}</div></span></div><div class="tw-text">${f.text}</div><div class="tw-badge">${f.badge}</div></div>`;
}
function pvDiscord(f) {
  return `<div class="pv pv-discord"><div class="dc-head"><span class="dc-name">${f.author}</span><span class="dc-time">${f.time}</span></div>${f.lines.map(l => `<div class="dc-line">${l}</div>`).join('')}</div>`;
}
function pvFaceref(f) {
  const label = f.desc.split(':')[1] ? f.desc.split(':')[1].split('.')[0].trim() : f.name;
  return `<div class="pv pv-faceref"><svg viewBox="0 0 64 64"><path fill="#6b7079" d="M32 8a12 12 0 0 1 12 12c0 6-3 10-6 12 8 2 14 8 14 18v4H12v-4c0-10 6-16 14-18-3-2-6-6-6-12A12 12 0 0 1 32 8z"/></svg><div class="fr-label">${label}</div></div>`;
}
function pvSelfie() {
  return `<div class="pv pv-selfie"></div>`;
}
function pvIllustration(f) {
  return `<div class="pv pv-illustration"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="M4 18l5-5 4 4 3-3 4 4"/></svg><div class="il-label">${f.name}</div></div>`;
}

function buildPhotoPreview(f) {
  if (f.image) return `<div class="pv pv-uploaded"><img src="${f.image}" class="user-image-display" alt="" /></div>`;
  switch (f.preview) {
    case 'greentext': return pvGreentext(f);
    case 'meme': return pvMeme(f);
    case 'bank': return pvBank();
    case 'cs2': return pvCs2();
    case 'savings': return pvSavings();
    case 'note': return pvNote(f);
    case 'card': return pvCard(f);
    case 'tweet': return pvTweet(f);
    case 'discord': return pvDiscord(f);
    case 'faceref': return pvFaceref(f);
    case 'selfie': return pvSelfie();
    default: return pvIllustration(f);
  }
}

function pvSavings() {
  const goal = 180000, actual = 4212;
  const w = 300, h = 200, padL = 34, padR = 10, padT = 16, padB = 22;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const months = ['úno','bře','dub','kvě','čvn','čvc','srp','zář','říj','lis','pro','led','úno','bře','dub','kvě','čvn','čvc'];
  const n = months.length;
  const slot = plotW / n, barW = slot * 0.62;
  let bars = '';
  for (let i = 0; i < n; i++) {
    const val = goal * (i + 1) / n;
    const bh = (val / goal) * plotH;
    const x = padL + slot * i + (slot - barW) / 2;
    const y = padT + plotH - bh;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" fill="#4472c4" opacity="0.55"/>`;
  }
  const actualH = (actual / goal) * plotH;
  const ay = padT + plotH - actualH;
  const ax = padL + (slot - barW) / 2;
  const gridlines = [0, 0.25, 0.5, 0.75, 1].map(t => {
    const y = padT + plotH - t * plotH;
    return `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e5e5e5" stroke-width="0.6"/>` +
      `<text x="${padL - 4}" y="${y + 3}" font-size="6" fill="#999" text-anchor="end">${Math.round(t * goal / 1000)}k</text>`;
  }).join('');
  return `<div class="pv pv-savings"><svg viewBox="0 0 ${w} ${h}">
    <text x="${padL}" y="10" font-size="8" font-weight="700" fill="#333">Spoření na operaci čelisti</text>
    ${gridlines}
    ${bars}
    <rect x="${ax.toFixed(1)}" y="${ay.toFixed(1)}" width="${barW.toFixed(1)}" height="${actualH.toFixed(1)}" fill="#e5484d"/>
    <text x="${(ax + barW + 3).toFixed(1)}" y="${(ay + 4).toFixed(1)}" font-size="6.5" fill="#e5484d">teď 4 212 Kč</text>
    <line x1="${padL}" y1="${padT}" x2="${w - padR}" y2="${padT}" stroke="#2e7d32" stroke-width="1" stroke-dasharray="3 2"/>
    <text x="${w - padR}" y="${padT - 3}" font-size="6.5" fill="#2e7d32" text-anchor="end">cíl 180 000 Kč</text>
  </svg></div>`;
}

const photosWindow = document.getElementById('photos-window');
const photosGrid = document.getElementById('photos-grid');
const photosBreadcrumb = document.getElementById('photos-breadcrumb');
const photosSidebar = document.getElementById('photos-sidebar');
const photosBackBtn = document.getElementById('pfe-back-btn');
const photosForwardBtn = document.getElementById('pfe-forward-btn');
const photosUpBtn = document.getElementById('pfe-up-btn');
const photosRefreshBtn = document.getElementById('pfe-refresh-btn');
const photosViewBtn = document.getElementById('pfe-view-btn');
const photosViewMenu = document.getElementById('pfe-view-menu');
const photosSortBtn = document.getElementById('pfe-sort-btn');
const photosSortMenu = document.getElementById('pfe-sort-menu');
const photosStatusCount = document.getElementById('pfe-status-count');
const photosModalOverlay = document.getElementById('photos-modal-overlay');
const photosModalName = document.getElementById('photos-modal-name');
const photosModalPreview = document.getElementById('photos-modal-preview');
const photosModalMeta = document.getElementById('photos-modal-meta');
const photosModalPrevBtn = document.getElementById('photos-modal-prev');
const photosModalNextBtn = document.getElementById('photos-modal-next');
const photosModalInfoBtn = document.getElementById('photos-modal-info-btn');
const photosModalInfoPanel = document.getElementById('photos-modal-info-panel');
const photosModalInfoClose = document.getElementById('photos-modal-info-close');
const photosModalDims = document.getElementById('photos-modal-dims');
const photosModalSize = document.getElementById('photos-modal-size');

let photosPath = [PHOTOS_TREE];
let photosHistory = [[PHOTOS_TREE]];
let photosHistoryIndex = 0;
let photosViewMode = 'grid'; // 'grid' | 'details' | 'list'
let photosSortBy = 'name'; // 'name' | 'date' | 'size'
let photosModalFiles = [];
let photosModalIndex = -1;
let photosModalSource = 'folder'; // 'folder' (Fotky tree) | 'recycle' (Koš)

document.getElementById('photos-close-btn').addEventListener('click', () => {
  photosWindow.classList.add('hidden');
});
document.getElementById('photos-modal-close').addEventListener('click', closePhotoModal);
photosModalOverlay.addEventListener('click', e => { if (e.target === photosModalOverlay) closePhotoModal(); });
photosModalPrevBtn.addEventListener('click', () => navigatePhotoModal(-1));
photosModalNextBtn.addEventListener('click', () => navigatePhotoModal(1));
photosModalInfoBtn.addEventListener('click', () => photosModalInfoPanel.classList.toggle('hidden'));
photosModalInfoClose.addEventListener('click', () => photosModalInfoPanel.classList.add('hidden'));
document.addEventListener('keydown', e => {
  if (photosModalOverlay.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') navigatePhotoModal(-1);
  else if (e.key === 'ArrowRight') navigatePhotoModal(1);
  else if (e.key === 'Escape') closePhotoModal();
});
window.addEventListener('resize', () => {
  if (!photosModalOverlay.classList.contains('hidden') && photosModalIndex >= 0) {
    sizeModalPreviewBox(photosModalFiles[photosModalIndex]);
  }
});

function currentFolder() { return photosPath[photosPath.length - 1]; }

// All folder navigation (breadcrumb, sidebar, double-click) goes through this so back/
// forward has a real history to move across — a plain "go up" (the ↑ button) does NOT
// go through here, since moving up shouldn't erase forward history the way a fresh
// navigation does.
function photosNavigateTo(newPath) {
  photosPath = newPath;
  photosHistory = photosHistory.slice(0, photosHistoryIndex + 1);
  photosHistory.push(newPath);
  photosHistoryIndex = photosHistory.length - 1;
  renderPhotos();
}
photosBackBtn.addEventListener('click', () => {
  if (photosHistoryIndex > 0) { photosHistoryIndex--; photosPath = photosHistory[photosHistoryIndex]; renderPhotos(); }
});
photosForwardBtn.addEventListener('click', () => {
  if (photosHistoryIndex < photosHistory.length - 1) { photosHistoryIndex++; photosPath = photosHistory[photosHistoryIndex]; renderPhotos(); }
});
photosUpBtn.addEventListener('click', () => {
  if (photosPath.length > 1) photosNavigateTo(photosPath.slice(0, -1));
});
photosRefreshBtn.addEventListener('click', () => renderPhotos());
document.querySelector('.pfe-crumb-root').addEventListener('click', () => photosNavigateTo([PHOTOS_TREE]));

photosViewBtn.addEventListener('click', e => {
  e.stopPropagation();
  photosSortMenu.classList.add('hidden');
  photosViewMenu.classList.toggle('hidden');
});
photosSortBtn.addEventListener('click', e => {
  e.stopPropagation();
  photosViewMenu.classList.add('hidden');
  photosSortMenu.classList.toggle('hidden');
});
document.addEventListener('click', () => {
  photosViewMenu.classList.add('hidden');
  photosSortMenu.classList.add('hidden');
});
photosViewMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => {
  el.addEventListener('click', () => { photosViewMode = el.dataset.view; renderPhotos(); });
});
photosSortMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => {
  el.addEventListener('click', () => { photosSortBy = el.dataset.sort; renderPhotos(); });
});

function folderIconSVG(extraClass) {
  return `<svg class="${extraClass || ''}" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/></svg>`;
}

function renderPhotosBreadcrumb() {
  photosBreadcrumb.innerHTML = photosPath.map((node, i) => {
    const isCurrent = i === photosPath.length - 1;
    const sep = i > 0 ? '<span class="photos-crumb-sep">▸</span>' : '';
    return `${sep}<span class="photos-crumb${isCurrent ? ' current' : ''}" data-depth="${i}">${node.name}</span>`;
  }).join('');
  photosBreadcrumb.querySelectorAll('.photos-crumb').forEach(node => {
    node.addEventListener('click', () => {
      const depth = Number(node.dataset.depth);
      if (depth < photosPath.length - 1) photosNavigateTo(photosPath.slice(0, depth + 1));
    });
  });
  photosBackBtn.disabled = photosHistoryIndex <= 0;
  photosForwardBtn.disabled = photosHistoryIndex >= photosHistory.length - 1;
  photosUpBtn.disabled = photosPath.length <= 1;
}

function renderPhotosSidebar() {
  const rootFolders = PHOTOS_TREE.children.filter(c => c.type === 'folder');
  const activeRootChild = photosPath[1];
  photosSidebar.innerHTML = `
    <div class="pfe-sidebar-heading">Rychlý přístup</div>
    <div class="pfe-sidebar-heading">Umístění</div>
    <div class="pfe-sidebar-item${photosPath.length === 1 ? ' active' : ''}" data-root="1">${folderIconSVG('pfe-sidebar-icon')} Fotky a videa</div>
    ${rootFolders.map(f => `<div class="pfe-sidebar-item nested${activeRootChild === f ? ' active' : ''}" data-folder="${escapeForAttr(f.name)}">${folderIconSVG('pfe-sidebar-icon tiny')} ${f.name}</div>`).join('')}
    <div class="pfe-sidebar-item" data-recycle="1">🗑 Koš</div>
  `;
  photosSidebar.querySelector('[data-root]').addEventListener('click', () => photosNavigateTo([PHOTOS_TREE]));
  photosSidebar.querySelectorAll('[data-folder]').forEach(el => {
    el.addEventListener('click', () => {
      const folder = rootFolders.find(f => f.name === el.dataset.folder);
      if (folder) photosNavigateTo([PHOTOS_TREE, folder]);
    });
  });
  photosSidebar.querySelector('[data-recycle]').addEventListener('click', () => openRecycle());
}

function parseCzechDateSort(s) {
  const m = /(\d+)\.\s*(\d+)\.\s*(\d+)/.exec(s || '');
  return m ? Number(m[3]) * 10000 + Number(m[2]) * 100 + Number(m[1]) : 0;
}
function parseSizeToKB(s) {
  const m = /([\d,.]+)\s*(KB|MB)/i.exec(s || '');
  if (!m) return 0;
  const num = parseFloat(m[1].replace(',', '.'));
  return /MB/i.test(m[2]) ? num * 1024 : num;
}
function sortPhotoFiles(files) {
  const arr = [...files];
  if (photosSortBy === 'date') return arr.sort((a, b) => parseCzechDateSort(b.date) - parseCzechDateSort(a.date));
  if (photosSortBy === 'size') return arr.sort((a, b) => parseSizeToKB(b.size) - parseSizeToKB(a.size));
  return arr.sort((a, b) => a.name.localeCompare(b.name));
}

function renderPhotoGridCard(item, i) {
  if (item.type === 'folder') {
    return `<div class="photos-card" data-idx="${i}">
      <div class="photos-thumb photos-folder-thumb">${folderIconSVG()}</div>
      <div class="photos-card-name">${item.name}</div>
      <div class="photos-card-date">${item.children.length} položek</div>
    </div>`;
  }
  return `<div class="photos-card" data-idx="${i}">
    <div class="photos-thumb">${buildPhotoPreview(item)}</div>
    <div class="photos-card-name">${item.name}</div>
    <div class="photos-card-date">${item.date}</div>
  </div>`;
}

function renderPhotoRow(item, i) {
  if (item.type === 'folder') {
    return `<div class="pfe-row" data-idx="${i}">
      <div class="pfe-row-icon">${folderIconSVG()}</div>
      <div class="pfe-row-name">${item.name}</div>
      <div class="pfe-row-meta">—</div>
      <div class="pfe-row-meta">${item.children.length} položek</div>
      <div class="pfe-row-meta">—</div>
    </div>`;
  }
  return `<div class="pfe-row" data-idx="${i}">
    <div class="pfe-row-icon">${buildPhotoPreview(item)}</div>
    <div class="pfe-row-name">${item.name}</div>
    <div class="pfe-row-meta">${item.date}</div>
    <div class="pfe-row-meta">${item.size}</div>
    <div class="pfe-row-meta">${item.dims}</div>
  </div>`;
}

function renderPhotos() {
  renderPhotosBreadcrumb();
  renderPhotosSidebar();
  photosViewMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => el.classList.toggle('active', el.dataset.view === photosViewMode));
  photosSortMenu.querySelectorAll('.pfe-dropdown-item').forEach(el => el.classList.toggle('active', el.dataset.sort === photosSortBy));

  const folder = currentFolder();
  const folders = [...folder.children.filter(c => c.type === 'folder')].sort((a, b) => a.name.localeCompare(b.name));
  const files = sortPhotoFiles(folder.children.filter(c => c.type === 'file'));
  const ordered = folders.concat(files);

  const isGrid = photosViewMode === 'grid';
  photosGrid.classList.toggle('pfe-view-details', photosViewMode === 'details');
  photosGrid.classList.toggle('pfe-view-list', photosViewMode === 'list');

  const header = photosViewMode === 'details'
    ? `<div class="pfe-details-header"><span>Název</span><span>Datum</span><span>Velikost</span><span>Rozměry</span></div>`
    : '';
  photosGrid.innerHTML = isGrid
    ? ordered.map((item, i) => renderPhotoGridCard(item, i)).join('')
    : header + ordered.map((item, i) => renderPhotoRow(item, i)).join('');

  const cardEls = photosGrid.querySelectorAll('.photos-card, .pfe-row');
  cardEls.forEach(el => {
    const item = ordered[Number(el.dataset.idx)];
    el.addEventListener('click', () => {
      cardEls.forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    });
    el.addEventListener('dblclick', () => {
      if (item.type === 'folder') photosNavigateTo([...photosPath, item]);
      else openPhotoModal(item);
    });
  });
  photosGrid.scrollTop = 0;
  photosStatusCount.textContent = `${ordered.length} položek`;
}

function openPhotoModal(f, filesOverride, source) {
  const files = filesOverride || currentFolder().children.filter(c => c.type === 'file');
  photosModalFiles = files;
  photosModalIndex = files.indexOf(f);
  photosModalSource = source || 'folder';
  photosModalInfoPanel.classList.add('hidden');
  renderPhotoModalContent(f);
  photosModalOverlay.classList.remove('hidden');
}

function navigatePhotoModal(dir) {
  if (photosModalFiles.length < 2) return;
  photosModalIndex = (photosModalIndex + dir + photosModalFiles.length) % photosModalFiles.length;
  renderPhotoModalContent(photosModalFiles[photosModalIndex]);
}

function renderPhotoModalContent(f) {
  photosModalName.textContent = f.name;
  photosModalPreview.innerHTML = buildPhotoPreview(f);
  const showNav = photosModalFiles.length > 1;
  photosModalPrevBtn.classList.toggle('hidden', !showNav);
  photosModalNextBtn.classList.toggle('hidden', !showNav);
  photosModalDims.textContent = f.dims;
  photosModalSize.textContent = f.size;
  photosModalMeta.innerHTML = `
    <div class="photos-meta-row"><span class="k">Název</span><span class="v">${f.name}</span></div>
    <div class="photos-meta-row"><span class="k">Datum</span><span class="v">${f.date}</span></div>
    <div class="photos-meta-row"><span class="k">Velikost</span><span class="v" data-field="size">${f.size}</span></div>
    <div class="photos-meta-row"><span class="k">Rozměry</span><span class="v" data-field="dims">${f.dims}</span></div>
    <div class="photos-modal-desc">${f.desc}</div>
  `;
  if (f.image) {
    const img = photosModalPreview.querySelector('img');
    const applyRealDims = () => {
      if (!img.naturalWidth) return;
      const dimsText = `${img.naturalWidth} × ${img.naturalHeight}`;
      const sizeText = formatBytes(dataUrlByteSize(f.image));
      photosModalDims.textContent = dimsText;
      photosModalSize.textContent = sizeText;
      const sizeEl = photosModalMeta.querySelector('[data-field="size"]');
      const dimsEl = photosModalMeta.querySelector('[data-field="dims"]');
      if (sizeEl) sizeEl.textContent = sizeText;
      if (dimsEl) dimsEl.textContent = dimsText;
    };
    if (img.complete) applyRealDims(); else img.addEventListener('load', applyRealDims);
  } else {
    requestAnimationFrame(() => sizeModalPreviewBox(f));
  }
}

// Placeholder "photo" cards have no real pixels — size the box itself to the file's
// declared aspect ratio (contained within the stage) so it behaves like a real <img>.
function sizeModalPreviewBox(f) {
  const pv = photosModalPreview.querySelector('.pv');
  const stage = photosModalPreview.closest('.pm-stage');
  if (!pv || !stage) return;
  const availW = stage.clientWidth - 56;
  const availH = stage.clientHeight - 56;
  if (availW <= 0 || availH <= 0) return;
  const m = /(\d+)\s*[×x]\s*(\d+)/.exec(f.dims || '');
  // No parseable dims (e.g. a Koš item, which carries no width/height metadata) — fall
  // back to a fixed square-ish default, capped so it doesn't upscale past a reasonable
  // size, instead of letting the placeholder's base width:100%/height:100% stretch it
  // across the whole stage. Real declared dims (the Fotky case) keep scaling exactly as
  // before — including upscaling small dims to fill the available stage.
  const w = m ? Number(m[1]) : 420;
  const h = m ? Number(m[2]) : 420;
  const scale = m ? Math.min(availW / w, availH / h) : Math.min(availW / w, availH / h, 1);
  pv.style.width = `${Math.round(w * scale)}px`;
  pv.style.height = `${Math.round(h * scale)}px`;
}

function dataUrlByteSize(dataUrl) {
  const comma = dataUrl.indexOf(',');
  const base64 = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  return Math.round(base64.length * 3 / 4 - padding);
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1).replace('.', ',') + ' MB';
  return `${Math.round(bytes / 1024)} KB`;
}

function closePhotoModal() {
  photosModalOverlay.classList.add('hidden');
}

function openPhotos() {
  const wasHidden = photosWindow.classList.contains('hidden');
  photosWindow.classList.remove('hidden');
  if (wasHidden) {
    photosPath = [PHOTOS_TREE];
    photosHistory = [[PHOTOS_TREE]];
    photosHistoryIndex = 0;
    renderPhotos();
  }
  bringWindowToFront(photosWindow);
}

// ── Counter-Strike 2 launcher ──
const cs2Window = document.getElementById('cs2-window');
document.getElementById('cs2-close-btn').addEventListener('click', () => {
  cs2Window.classList.add('hidden');
});

const CS2_MONTHLY_HOURS = [
  { label: 'pro', hours: 40 },
  { label: 'led', hours: 85 },
  { label: 'úno', hours: 145 },
  { label: 'bře', hours: 232 }
];

const CS2_MATCHES = [
  { map: 'Mirage', win: true, score: '13:9', kd: '24 / 15 / 6', ratio: '1.60', time: '21. 3. 2026, 02:44' },
  { map: 'Inferno', win: false, score: '8:13', kd: '14 / 16 / 5', ratio: '0.88', time: '19. 3. 2026, 23:58' },
  { map: 'Ancient', win: true, score: '13:11', kd: '19 / 15 / 4', ratio: '1.27', time: '18. 3. 2026, 01:12' },
  { map: 'Anubis', win: false, score: '10:13', kd: '17 / 16 / 7', ratio: '1.06', time: '16. 3. 2026, 22:30' },
  { map: 'Dust II', win: true, score: '13:7', kd: '22 / 12 / 3', ratio: '1.83', time: '15. 3. 2026, 00:47' },
  { map: 'Nuke', win: false, score: '9:13', kd: '13 / 17 / 4', ratio: '0.76', time: '13. 3. 2026, 23:05' },
  { map: 'Mirage', win: true, score: '13:10', kd: '21 / 15 / 5', ratio: '1.40', time: '11. 3. 2026, 01:33' },
  { map: 'Overpass', win: false, score: '11:13', kd: '16 / 16 / 6', ratio: '1.00', time: '9. 3. 2026, 22:52' },
  { map: 'Vertigo', win: true, score: '13:6', kd: '23 / 11 / 2', ratio: '2.09', time: '7. 3. 2026, 00:18' },
  { map: 'Inferno', win: false, score: '7:13', kd: '12 / 14 / 3', ratio: '0.86', time: '5. 3. 2026, 23:40' }
];

const CS2_FRIENDS = [
  { name: 'davepvp', online: false, status: 'naposledy online před 3 dny' },
  { name: 'Kryštof12', online: true, status: 'online' },
  { name: 'SmokeyKC', online: true, status: 'online' }
];

function cs2HoursChartSVG() {
  const data = CS2_MONTHLY_HOURS;
  const w = 600, h = 150, padL = 30, padR = 10, padT = 24, padB = 22;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const max = Math.max(...data.map(d => d.hours)) * 1.15;
  const slot = plotW / data.length, barW = slot * 0.46;
  const gridlines = [0, 0.25, 0.5, 0.75, 1].map(t => {
    const y = padT + plotH - t * plotH;
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" stroke="#2a3f57" stroke-width="0.6"/>`;
  }).join('');
  let bars = '';
  data.forEach((d, i) => {
    const bh = (d.hours / max) * plotH;
    const x = padL + slot * i + (slot - barW) / 2;
    const y = padT + plotH - bh;
    const isMarch = i === data.length - 1;
    bars += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" rx="3" fill="${isMarch ? '#f0a04b' : '#66c0f4'}" opacity="${isMarch ? 1 : 0.75}"/>`;
    bars += `<text x="${(x + barW / 2).toFixed(1)}" y="${(y - 7).toFixed(1)}" font-size="12" fill="${isMarch ? '#f0a04b' : '#c7d5e0'}" text-anchor="middle" font-weight="${isMarch ? 700 : 400}">${d.hours}h</text>`;
    bars += `<text x="${(x + barW / 2).toFixed(1)}" y="${h - 6}" font-size="11" fill="#8f98a0" text-anchor="middle">${d.label}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}">${gridlines}${bars}</svg>`;
}

function buildCs2BodyHTML() {
  return `
    <div class="cs2-profile-row">
      <div class="cs2-avatar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v2h16v-2c0-2.8-3.6-5-8-5z"/></svg></div>
      <div>
        <div class="cs2-profile-name">hidd3nfram3</div>
        <div class="cs2-profile-sub">Counter-Strike 2 · Premier</div>
      </div>
      <div class="cs2-rank-badge">
        <div class="cs2-rank-icon">DMG</div>
        <div>
          <div class="cs2-rank-text">Distinguished Master Guardian</div>
          <div class="cs2-rank-since">od ledna 2026 · rank stagnuje</div>
        </div>
      </div>
    </div>

    <div class="cs2-stats-row">
      <div class="cs2-stat-card warn"><div class="cs2-stat-value">232 h</div><div class="cs2-stat-label">Odehráno v březnu</div></div>
      <div class="cs2-stat-card"><div class="cs2-stat-value">1.34</div><div class="cs2-stat-label">K/D ratio</div></div>
      <div class="cs2-stat-card"><div class="cs2-stat-value">42 %</div><div class="cs2-stat-label">Headshot %</div></div>
    </div>

    <div class="cs2-section-title">Odehrané hodiny za měsíc</div>
    <div class="cs2-hours-chart">${cs2HoursChartSVG()}</div>

    <div class="cs2-section-title">Poslední zápasy</div>
    <div class="cs2-matches">
      ${CS2_MATCHES.map(m => `
        <div class="cs2-match-row ${m.win ? 'win' : 'loss'}">
          <span class="cs2-match-result">${m.win ? 'Výhra' : 'Prohra'}</span>
          <span class="cs2-match-map">${m.map}</span>
          <span class="cs2-match-score">${m.score}</span>
          <span class="cs2-match-kd">K/D ${m.ratio} (${m.kd})</span>
          <span class="cs2-match-time">${m.time}</span>
        </div>
      `).join('')}
    </div>

    <div class="cs2-section-title">Přátelé</div>
    <div class="cs2-friends">
      ${CS2_FRIENDS.map(f => `
        <div class="cs2-friend-row">
          <span class="cs2-friend-dot ${f.online ? 'online' : 'offline'}"></span>
          <span class="cs2-friend-name">${f.name}</span>
          <span class="cs2-friend-status">${f.status}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function openCs2() {
  document.getElementById('cs2-body').innerHTML = buildCs2BodyHTML();
  cs2Window.classList.remove('hidden');
  bringWindowToFront(cs2Window);
}

// ── Halo Infinite launcher ──
const haloWindow = document.getElementById('halo-window');
document.getElementById('halo-close-btn').addEventListener('click', () => {
  haloWindow.classList.add('hidden');
});

const HALO_MATCHES = [
  { playlist: 'Ranked Slayer', map: 'Aquarius', win: true, score: '50:38', kd: '18 / 12 / 5', ratio: '1.50', time: '20. 3. 2026, 22:47' },
  { playlist: 'Ranked Slayer', map: 'Live Fire', win: false, score: '42:50', kd: '14 / 15 / 4', ratio: '0.93', time: '19. 3. 2026, 21:15' },
  { playlist: 'Ranked Slayer', map: 'Recharge', win: true, score: '50:44', kd: '16 / 12 / 6', ratio: '1.33', time: '17. 3. 2026, 23:02' },
  { playlist: 'Big Team Battle', map: 'Deadlock', win: false, score: '62:75', kd: '22 / 22 / 8', ratio: '1.00', time: '15. 3. 2026, 20:40' },
  { playlist: 'Ranked Slayer', map: 'Streets', win: true, score: '50:33', kd: '20 / 11 / 3', ratio: '1.82', time: '12. 3. 2026, 22:10' },
  { playlist: 'Ranked Slayer', map: 'Aquarius', win: false, score: '39:50', kd: '13 / 16 / 5', ratio: '0.81', time: '9. 3. 2026, 21:55' }
];

const HALO_FRIENDS = [
  { name: 'davepvp', online: false, status: 'offline' },
  { name: 'Kryštof12', online: true, status: 'online' },
  { name: 'SmokeyKC', online: true, status: 'online' },
  { name: 'orange_dude', online: true, status: 'online' }
];

const HALO_WEAPONS = [
  { name: 'BR75 Battle Rifle', pct: 62 },
  { name: 'Sidekick', pct: 21 },
  { name: 'Sniper Rifle', pct: 11 }
];

const HALO_MEDALS = [
  { icon: '⚔️', name: 'Killing Spree' },
  { icon: '💯', name: 'Perfect' },
  { icon: '⚡', name: 'Quick Draw' },
  { icon: '🛡️', name: 'Extermination' }
];

function buildHaloBodyHTML() {
  return `
    <div class="halo-profile-row">
      <div class="halo-avatar"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a6 6 0 0 0-6 6c0 2.4 1.2 4.4 3 5.6V16H8v2h2v2h4v-2h2v-2h-1v-2.4c1.8-1.2 3-3.2 3-5.6a6 6 0 0 0-6-6z"/></svg></div>
      <div>
        <div class="halo-profile-name">hidd3nfram3</div>
        <div class="halo-profile-sub">Halo Infinite · Ranked Slayer</div>
      </div>
      <div class="halo-rank-badge">
        <div class="halo-rank-icon">ONX</div>
        <div>
          <div class="halo-rank-text">Onyx</div>
          <div class="halo-rank-sub">1 850 CSR</div>
        </div>
      </div>
    </div>

    <div class="halo-section-title">Poslední zápasy</div>
    <div class="halo-matches">
      ${HALO_MATCHES.map(m => `
        <div class="halo-match-row ${m.win ? 'win' : 'loss'}">
          <span class="halo-match-result">${m.win ? 'Výhra' : 'Prohra'}</span>
          <span class="halo-match-playlist">${m.playlist}</span>
          <span class="halo-match-map">${m.map}</span>
          <span class="halo-match-score">${m.score}</span>
          <span class="halo-match-kd">K/D ${m.ratio} (${m.kd})</span>
          <span class="halo-match-time">${m.time}</span>
        </div>
      `).join('')}
    </div>

    <div class="halo-two-col">
      <div>
        <div class="halo-section-title">Spartan Company</div>
        <div class="halo-friends">
          ${HALO_FRIENDS.map(f => `
            <div class="halo-friend-row">
              <span class="halo-friend-dot ${f.online ? 'online' : 'offline'}"></span>
              <span class="halo-friend-name">${f.name}</span>
              <span class="halo-friend-status">${f.status}</span>
            </div>
          `).join('')}
        </div>

        <div class="halo-section-title">Oblíbené zbraně</div>
        ${HALO_WEAPONS.map(w => `
          <div class="halo-weapon-row">
            <div class="halo-weapon-head"><span>${w.name}</span><span>${w.pct}%</span></div>
            <div class="halo-weapon-bar-wrap"><span class="halo-weapon-bar" style="width:${w.pct}%"></span></div>
          </div>
        `).join('')}
      </div>
      <div>
        <div class="halo-section-title">Medaile</div>
        <div class="halo-medals">
          ${HALO_MEDALS.map(m => `
            <div class="halo-medal">
              <span class="halo-medal-icon">${m.icon}</span>
              <span class="halo-medal-name">${m.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function openHalo() {
  document.getElementById('halo-body').innerHTML = buildHaloBodyHTML();
  haloWindow.classList.remove('hidden');
  bringWindowToFront(haloWindow);
}

// ── Google search (embedded in Chrome) — shell only, content is placeholder ──
function parseGoogleQuery(url) {
  const m = url.match(/[?&]q=([^&]+)/);
  return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
}

const GOOGLE_RESULTS = Array.from({ length: 9 }, (_, i) => ({
  title: `[Title placeholder ${i + 1}]`,
  url: `www.priklad-web-${i + 1}.cz › cesta › podcesta`,
  desc: `[Popis výsledku placeholder ${i + 1} — krátký text shrnující obsah stránky.]`
}));

const GOOGLE_PAA = ['[Otázka placeholder 1]?', '[Otázka placeholder 2]?', '[Otázka placeholder 3]?', '[Otázka placeholder 4]?'];

// One curated result set for Lukáš's single late-night train search — everything else
// still uses the generic GOOGLE_RESULTS placeholder above.
const GOOGLE_QUERY_RESULTS = {
  'vlak plzen hlavni praha vikend': {
    stats: 'Přibližně 4 210 000 výsledků (0,39 s)',
    results: [
      {
        url: 'idos.cz › vlakyautobusymhd › spojeni',
        title: 'Plzeň hl.n. → Praha hl.n. – jízdní řád, spojení | IDOS',
        desc: 'Vyhledejte aktuální spojení vlakem i autobusem mezi Plzní a Prahou. Jízdní řády, ceny jízdenek a doba jízdy online.',
        navUrl: 'idos.cz/vlakyautobusymhd/spojeni/?f=Plze%C5%88&t=Praha',
        navTitle: 'Plzeň hl.n. → Praha hl.n. - IDOS'
      },
      {
        url: 'cd.cz › jizdenky-a-nabidka › vnitrostatni-doprava',
        title: 'Plzeň – Praha vlakem | České dráhy',
        desc: 'Rychlíky a InterCity spoje z Plzně do Prahy. Jízdenky online, slevy s In Kartou, aktuální jízdní řád ČD.'
      },
      {
        url: 'regiojet.cz › vlakove-spojeni › plzen-praha',
        title: 'Plzeň → Praha vlakem už od 149 Kč | RegioJet',
        desc: 'Pohodlné vlakové spojení Plzeň – Praha. Wi-Fi zdarma, občerstvení na palubě, výběr místa při rezervaci online.'
      },
      {
        url: 'flixbus.cz › autobusova-doprava › plzen-praha',
        title: 'Autobus Plzeň – Praha už od 89 Kč | FlixBus',
        desc: 'Levné a pohodlné autobusové spojení z Plzně do Prahy. Wi-Fi a zásuvky ve všech spojích, snadná rezervace online.'
      },
      {
        url: 'mapy.cz › trasa › plzen-praha',
        title: 'Plzeň – Praha: vzdálenost, trasa a doba jízdy – Mapy.cz',
        desc: 'Vzdálenost Plzeň–Praha je přibližně 92 km. Doba jízdy autem cca 1 h 10 min, veřejnou dopravou od 1 h 30 min.'
      }
    ],
    paa: [
      'Kolik stojí vlak z Plzně do Prahy?',
      'Jak dlouho trvá cesta vlakem z Plzně do Prahy?',
      'Jede z Plzně do Prahy přímý vlak?',
      'Jak se dostanu z Plzně do Prahy nejrychleji?'
    ]
  }
};

function buildGooglePageHTML(url) {
  const query = parseGoogleQuery(url);
  const special = GOOGLE_QUERY_RESULTS[query.trim().toLowerCase()];
  const results = special ? special.results : GOOGLE_RESULTS;
  const paa = special ? special.paa : GOOGLE_PAA;
  const stats = special ? special.stats : 'Přibližně 128 000 000 výsledků (0,42 s)';
  return `
    <div class="g-app">
      <header class="g-header">
        <div class="g-logo"><span style="color:#4285F4">G</span><span style="color:#EA4335">o</span><span style="color:#FBBC05">o</span><span style="color:#4285F4">g</span><span style="color:#34A853">l</span><span style="color:#EA4335">e</span></div>
        <div class="g-search-wrap">
          <input class="g-search-input" id="g-search-input" value="${query}" />
          <button class="g-search-btn" id="g-search-btn">
            <svg viewBox="0 0 24 24" width="16" height="16"><path fill="#5f6368" d="M15.5 14h-.8l-.3-.3a6.5 6.5 0 1 0-.7.7l.3.3v.8l5 5L20.5 19zm-6 0a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9z"/></svg>
          </button>
        </div>
        <span class="g-avatar">L</span>
      </header>
      <div class="g-tabs">
        <span class="g-tab active">Vše</span>
        <span class="g-tab">Obrázky</span>
        <span class="g-tab">Videa</span>
        <span class="g-tab">Aktuality</span>
        <span class="g-tab">Nákupy</span>
        <span class="g-tab">Mapy</span>
      </div>
      <div class="g-body">
        <div class="g-results-col">
          <div class="g-stats">${stats}</div>
          ${results.map((r, i) => `
            <div class="g-result${r.navUrl ? ' g-result-clickable' : ''}" ${r.navUrl ? `data-nav-url="${r.navUrl}" data-nav-title="${r.navTitle}"` : ''}>
              <div class="g-result-url">${r.url}</div>
              <div class="g-result-title">${r.title}</div>
              <div class="g-result-desc">${r.desc}</div>
            </div>
          `).join('')}
          <div class="g-pagination">
            ${Array.from({ length: 10 }, (_, i) => `<span class="g-page${i === 0 ? ' active' : ''}">${i + 1}</span>`).join('')}
            <span class="g-page g-page-next">Další ›</span>
          </div>
        </div>
        <div class="g-paa-col">
          <div class="g-paa-title">Lidé se také ptají</div>
          ${paa.map(q => `<div class="g-paa-item"><span>${q}</span><span class="g-paa-chevron">⌄</span></div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function attachGoogleHandlers() {
  const input = document.getElementById('g-search-input');
  const doSearch = () => {
    const q = input.value.trim();
    if (!q) return;
    navigateActiveTab(`${q} - Hledat Googlem`, `google.com/search?q=${encodeURIComponent(q)}`);
  };
  document.getElementById('g-search-btn').addEventListener('click', doSearch);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  document.querySelectorAll('.g-result-clickable').forEach(el => {
    el.addEventListener('click', () => {
      navigateActiveTab(el.dataset.navTitle, el.dataset.navUrl);
    });
  });
}

// ── IDOS (embedded in Chrome) — the one search Lukáš never turned into a ticket ──
// He looks up the Plzeň → Praha leg only, never the bus/car leg to get to the station
// in the first place, and never a way back. A search, not a plan.
const IDOS_CONNECTIONS = [
  { dep: '06:35', arr: '08:10', duration: '1:35', line: 'IC 501', transfer: 'přímý', price: 219 },
  { dep: '08:20', arr: '09:55', duration: '1:35', line: 'IC 503', transfer: 'přímý', price: 219 },
  { dep: '10:38', arr: '12:05', duration: '1:27', line: 'IC 505 „Šumava“', transfer: 'přímý', price: 249, highlighted: true },
  { dep: '12:35', arr: '14:10', duration: '1:35', line: 'Ex 351', transfer: '1× přestup', price: 259 },
  { dep: '14:12', arr: '15:40', duration: '1:28', line: 'IC 507', transfer: 'přímý', price: 229 },
  { dep: '17:35', arr: '19:08', duration: '1:33', line: 'Ex 355', transfer: '1× přestup', price: 279 },
  { dep: '20:40', arr: '22:15', duration: '1:35', line: 'IC 509', transfer: 'přímý', price: 219 }
];

function idosRowHTML(c, i) {
  return `
    <div class="idos-row${c.highlighted ? ' hovered' : ''}">
      <span class="idos-time">${c.dep}</span>
      <span class="idos-time-arrow">→</span>
      <span class="idos-time">${c.arr}</span>
      <span class="idos-duration">${c.duration}</span>
      <span class="idos-line">${c.line}</span>
      <span class="idos-transfer">${c.transfer}</span>
      <span class="idos-price">${c.price} Kč</span>
      <button class="idos-reserve-btn" data-idx="${i}">Rezervovat</button>
    </div>
  `;
}

function buildIdosPageHTML() {
  return `
    <div class="idos-app">
      <header class="idos-header">
        <div class="idos-logo">IDOS<span>.cz</span></div>
        <div class="idos-account-link" id="idos-account-link">
          <svg viewBox="0 0 24 24" width="15" height="15"><path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v3h16v-3c0-2.8-3.6-5-8-5z"/></svg>
          Přihlášení / Registrace
        </div>
      </header>
      <div class="idos-searchbar">
        <div class="idos-search-field">
          <label>Odkud</label>
          <input value="Plzeň hl.n." readonly />
        </div>
        <button class="idos-swap-btn" title="Prohodit">⇄</button>
        <div class="idos-search-field">
          <label>Kam</label>
          <input value="Praha hl.n." readonly />
        </div>
        <div class="idos-search-field idos-date-field">
          <label>Datum</label>
          <input value="So 28. 3. 2026" readonly />
        </div>
        <button class="idos-search-btn">Hledat spojení</button>
      </div>
      <div class="idos-body">
        <aside class="idos-sidebar">
          <div class="idos-filter-group">
            <div class="idos-filter-title">Druh dopravy</div>
            <label class="idos-filter-row"><input type="checkbox" checked disabled />Vlak</label>
            <label class="idos-filter-row"><input type="checkbox" disabled />Autobus</label>
            <label class="idos-filter-row"><input type="checkbox" disabled />MHD</label>
          </div>
          <div class="idos-filter-group">
            <div class="idos-filter-title">Počet přestupů</div>
            <label class="idos-filter-row"><input type="radio" name="idos-transfers" disabled />Bez přestupu</label>
            <label class="idos-filter-row"><input type="radio" name="idos-transfers" checked disabled />Max. 1 přestup</label>
          </div>
          <div class="idos-filter-group">
            <div class="idos-filter-title">Dopravce</div>
            <label class="idos-filter-row"><input type="checkbox" checked disabled />České dráhy</label>
            <label class="idos-filter-row"><input type="checkbox" checked disabled />RegioJet</label>
          </div>
        </aside>
        <div class="idos-results">
          <div class="idos-results-head">
            <span>Odjezd</span><span></span><span>Příjezd</span><span>Doba jízdy</span><span>Spoj</span><span>Přestupy</span><span>Cena</span><span></span>
          </div>
          ${IDOS_CONNECTIONS.map(idosRowHTML).join('')}
        </div>
      </div>
    </div>
    <div class="idos-login-modal hidden" id="idos-login-modal">
      <div class="idos-login-box">
        <button class="idos-login-close" id="idos-login-close">✕</button>
        <div class="idos-login-title">Přihlášení</div>
        <input class="idos-login-input" placeholder="E-mail" />
        <input class="idos-login-input" type="password" placeholder="Heslo" />
        <button class="idos-login-submit">Přihlásit se</button>
        <div class="idos-login-register">Nemáte účet? <span>Zaregistrovat se</span></div>
      </div>
    </div>
  `;
}

function attachIdosHandlers() {
  const modal = document.getElementById('idos-login-modal');
  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');
  document.getElementById('idos-account-link').addEventListener('click', openModal);
  document.querySelectorAll('.idos-reserve-btn').forEach(btn => btn.addEventListener('click', openModal));
  document.getElementById('idos-login-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}

// ── Grok (embedded in Chrome) — shell only, content is placeholder ──
const GROK_CONVERSATIONS = [
  { id: 'c1', title: '[Konverzace placeholder 1]', date: '10. 3. 2026', messages: [
    { role: 'user', text: '[Zpráva placeholder — uživatel 1]' },
    { role: 'grok', text: '[Odpověď placeholder — Grok 1]' }
  ]},
  { id: 'c2', title: '[Konverzace placeholder 2]', date: '15. 3. 2026', messages: [
    { role: 'user', text: '[Zpráva placeholder — uživatel 2]' },
    { role: 'grok', text: '[Odpověď placeholder — Grok 2]' }
  ]},
  { id: 'c3', title: '[Konverzace placeholder 3]', date: '23. 3. 2026', messages: [
    { role: 'user', text: '[Zpráva placeholder — uživatel 3]' },
    { role: 'grok', text: '[Odpověď placeholder — Grok 3]' }
  ]}
];
let grokActiveId = 'c3';
let grokSpiceMode = true;

function buildGrokAppHTML() {
  return `
    <div class="grok-app">
      <aside class="grok-sidebar">
        <div class="grok-logo-row">
          <img src="assets/icons/fav-grok.svg" alt="" />
          <span>Grok</span>
        </div>
        <button class="grok-new-btn">+ Nová konverzace</button>
        <div class="grok-conv-list" id="grok-conv-list"></div>
      </aside>
      <main class="grok-main">
        <div class="grok-main-header">
          <span>Grok</span>
          <div class="grok-spice-toggle" id="grok-spice-toggle">
            <span>Spice mode</span>
            <span class="grok-toggle-switch ${grokSpiceMode ? 'on' : ''}" id="grok-toggle-switch"></span>
          </div>
        </div>
        <div class="grok-messages" id="grok-messages"></div>
        <div class="grok-input"><span class="grok-input-box">Zeptej se Groka na cokoliv…</span></div>
      </main>
    </div>
  `;
}

function renderGrokConvList() {
  const list = document.getElementById('grok-conv-list');
  list.innerHTML = GROK_CONVERSATIONS.map(c => `
    <div class="grok-conv-item${c.id === grokActiveId ? ' active' : ''}" data-id="${c.id}">
      <div class="grok-conv-title">${c.title}</div>
      <div class="grok-conv-date">${c.date}</div>
    </div>
  `).join('');
  list.querySelectorAll('.grok-conv-item').forEach(node => {
    node.addEventListener('click', () => {
      grokActiveId = node.dataset.id;
      renderGrokConvList();
      renderGrokMessages();
    });
  });
}

function renderGrokMessages() {
  const messages = document.getElementById('grok-messages');
  const conv = GROK_CONVERSATIONS.find(c => c.id === grokActiveId);
  messages.innerHTML = (conv ? conv.messages : []).map(m => m.role === 'user'
    ? `<div class="grok-msg-row user"><div class="grok-msg-bubble">${m.text}</div></div>`
    : `<div class="grok-msg-row grok"><span class="grok-msg-avatar"><img src="assets/icons/fav-grok.svg" alt="" /></span><div class="grok-msg-bubble">${m.text}</div></div>`
  ).join('');
}

function attachGrokHandlers() {
  renderGrokConvList();
  renderGrokMessages();
  const toggle = document.getElementById('grok-spice-toggle');
  toggle.addEventListener('click', () => {
    grokSpiceMode = !grokSpiceMode;
    document.getElementById('grok-toggle-switch').classList.toggle('on', grokSpiceMode);
  });
}

// ── self_data.html (embedded in Chrome) — self-hosted quantified-self dashboard ──
// The detective heart of the desktop: he keeps every "controllable input" (exercise,
// mewing, calorie deficit) dead consistent for 8 weeks straight — this isn't a kid who
// gave up. The one output he can't fully control (facerate score) still drops. That gap
// between disciplined effort and a worsening result is exactly where blackpill rhetoric
// finds its opening — it offers an explanation ("genetics") for effort that isn't paying off.
const SELF_DATA_METRICS = [
  { nazev: 'Screentime', jednotka: 'h/den', prumer: 9.0, hodnoty: [5.0, 5.4, 5.9, 6.3, 7.1, 7.6, 8.4, 9.0] },
  { nazev: 'Spánek', jednotka: 'h', prumer: 5.5, hodnoty: [7.0, 6.8, 6.6, 6.3, 6.1, 5.9, 5.7, 5.5] },
  { nazev: 'Cvičení', jednotka: 'min/den', prumer: 42, hodnoty: [38, 42, 40, 41, 39, 43, 40, 42] },
  { nazev: 'CS2', jednotka: 'h/den', prumer: 11.2, hodnoty: [5.0, 5.8, 6.5, 7.2, 8.0, 9.0, 10.0, 11.2] },
  { nazev: 'Mewing', jednotka: 'min/den', prumer: 91, hodnoty: [88, 92, 90, 91, 89, 93, 90, 91] },
  { nazev: 'Facerate skóre', jednotka: '/10', prumer: 3.1, hodnoty: [3.6, 3.8, 3.4, 4.0, 3.7, 3.4, 3.2, 3.1] },
  { nazev: 'Kalorický deficit', jednotka: 'kcal', prumer: 305, hodnoty: [290, 310, 295, 305, 300, 315, 290, 305] }
];
// Pre-2026-schema exports/localStorage had this as a fixed object of English-keyed
// arrays (no nazev/jednotka/prumer, no way to add/remove a metric). Maps those old
// keys onto today's default metric names so an old backup can still be imported —
// see normalizeLegacySelfDataMetrics().
const SELF_DATA_LEGACY_KEY_MAP = {
  screentimeHours: 'Screentime',
  sleepHours: 'Spánek',
  exerciseMinutes: 'Cvičení',
  cs2HoursPerDay: 'CS2',
  mewingMinutes: 'Mewing',
  calorieDeficit: 'Kalorický deficit'
};
function normalizeLegacySelfDataMetrics(saved) {
  if (Array.isArray(saved)) return saved; // already current shape
  if (!isPlainObject(saved)) return null;
  const merged = JSON.parse(JSON.stringify(SELF_DATA_METRICS));
  Object.keys(saved).forEach(oldKey => {
    const nazev = SELF_DATA_LEGACY_KEY_MAP[oldKey];
    const metric = nazev && merged.find(m => m.nazev === nazev);
    if (metric && Array.isArray(saved[oldKey])) metric.hodnoty = saved[oldKey];
  });
  return merged;
}
const SELF_DATA_METRICS_STORAGE_KEY = 'self_data_metrics';
function saveSelfDataMetrics() {
  try { localStorage.setItem(SELF_DATA_METRICS_STORAGE_KEY, JSON.stringify(SELF_DATA_METRICS)); } catch (e) { /* ignore quota errors here, the main save already surfaces them */ }
}
function loadSelfDataMetrics() {
  try {
    const raw = localStorage.getItem(SELF_DATA_METRICS_STORAGE_KEY);
    if (!raw) return;
    const normalized = normalizeLegacySelfDataMetrics(JSON.parse(raw));
    if (normalized) { SELF_DATA_METRICS.length = 0; SELF_DATA_METRICS.push(...normalized); }
  } catch (e) {
    console.warn('Nepodařilo se načíst self_data metriky:', e);
  }
}

const CHATGPT_CONVERSATIONS_STORAGE_KEY = 'chatgpt_conversations';
function saveChatgptConversations() {
  try { localStorage.setItem(CHATGPT_CONVERSATIONS_STORAGE_KEY, JSON.stringify(CHATGPT_CONVERSATIONS)); } catch (e) { /* ignore quota errors here, the main save already surfaces them */ }
}
function loadChatgptConversations() {
  try {
    const raw = localStorage.getItem(CHATGPT_CONVERSATIONS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) { CHATGPT_CONVERSATIONS.length = 0; CHATGPT_CONVERSATIONS.push(...parsed); }
  } catch (e) {
    console.warn('Nepodařilo se načíst ChatGPT konverzace:', e);
  }
}

function selfDataSparklineSVG(values) {
  const w = 320, h = 70, padL = 4, padR = 4, padT = 8, padB = 8;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const min = Math.min(...values), max = Math.max(...values);
  const range = (max - min) || 1;
  const pad = range * 0.2;
  const lo = min - pad, hi = max + pad;
  const n = values.length;
  const points = values.map((v, i) => {
    const x = padL + (n === 1 ? plotW / 2 : (plotW * i) / (n - 1));
    const y = padT + plotH - ((v - lo) / (hi - lo)) * plotH;
    return [x, y];
  });
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const dots = points.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="2" fill="#8ab4f8"/>`).join('');
  const gridlines = [0.25, 0.5, 0.75].map(t => {
    const y = padT + plotH * t;
    return `<line x1="${padL}" y1="${y.toFixed(1)}" x2="${w - padR}" y2="${y.toFixed(1)}" stroke="#232326" stroke-width="0.5"/>`;
  }).join('');
  return `<svg viewBox="0 0 ${w} ${h}" class="sd-spark" preserveAspectRatio="none">${gridlines}<path d="${pathD}" fill="none" stroke="#8ab4f8" stroke-width="1.6"/>${dots}</svg>`;
}

// Shared by the dashboard card and the editor's live trend preview.
function selfDataTrendText(metric) {
  const values = metric.hodnoty || [];
  if (values.length < 2) return '';
  const delta = values[values.length - 1] - values[0];
  const deltaNum = Number.isInteger(delta) ? delta : Math.round(delta * 10) / 10;
  const deltaStr = (deltaNum > 0 ? '+' : '') + deltaNum;
  return `${deltaStr}${metric.jednotka || ''} za 8 týdnů`;
}

function selfDataCardHTML(metric) {
  return `
    <div class="sd-card">
      <div class="sd-card-head">
        <span class="sd-card-label">${metric.nazev}</span>
        <span class="sd-card-value">${metric.prumer}${metric.jednotka ? ' ' + metric.jednotka : ''}</span>
      </div>
      ${selfDataSparklineSVG(metric.hodnoty)}
      <div class="sd-card-delta">${selfDataTrendText(metric)}</div>
    </div>
  `;
}

function buildSelfDataPageHTML() {
  return `
    <div class="sd-app">
      <div class="sd-header">
        <span class="sd-header-title">self_data</span>
        <span class="sd-header-sub">osobní metriky · posledních 8 týdnů</span>
      </div>
      <div class="sd-grid">
        ${SELF_DATA_METRICS.map(m => selfDataCardHTML(m)).join('')}
      </div>
    </div>
  `;
}

function openSelfData() {
  const wasHidden = chromeWindow.classList.contains('hidden');
  if (wasHidden) openChrome();
  else chromeWindow.classList.remove('hidden');
  let tab = TABS.find(t => t.id === 'selfdata');
  if (!tab) {
    tab = { id: 'selfdata', type: 'selfdata', title: 'self_data.html — Dashboard', url: 'selfos.local/dashboard', favicon: 'assets/icons/fav-selfdata.svg' };
    tab.history = [{ url: tab.url, title: tab.title }];
    tab.historyIndex = 0;
    TABS.push(tab);
  }
  activeTabId = 'selfdata';
  renderTabbar();
  updateAddressBar();
  renderActivePage();
  updateNavButtons();
  bringWindowToFront(chromeWindow);
}

// ── WhatsApp Desktop ──
// Cold, functional, no warmth, no questions answered. She works shifts and is rarely
// home — never stated, only implied by the silence between her messages and his
// one-word replies (and eventually no reply at all).
const WHATSAPP_CHATS = [
  {
    id: 'mama',
    name: 'Máma',
    messages: [
      { from: 'mama', text: 'koupila jsem chleba, je na stole', date: '7. 3. 2026', time: '16:20' },
      { from: 'mama', text: 'vratis se v 17?', date: '7. 3. 2026', time: '16:45' },
      { from: 'lukas', text: 'ok', date: '7. 3. 2026', time: '16:47' },
      { from: 'mama', text: 'budu na noc pryc, klic pod rohozkou jako minule', date: '18. 3. 2026', time: '08:00' },
      { from: 'mama', text: 'je to v ledničce', date: '18. 3. 2026', time: '08:01' },
      { from: 'mama', text: 'nezapomen zamknout', date: '18. 3. 2026', time: '08:02' },
      { from: 'mama', text: 'necha ti tam obed', date: '27. 3. 2026', time: '19:32' },
      { from: 'mama', text: 'jsi doma?', date: '28. 3. 2026', time: '15:58' }
    ]
  },
  { id: 'skola', name: 'Škola', messages: [] },
  { id: 'placeholder1', name: '[Kontakt placeholder]', messages: [] }
];
let whatsappOpenId = null;
let whatsappReadIds = new Set();

const whatsappWindow = document.getElementById('whatsapp-window');
document.getElementById('whatsapp-close-btn').addEventListener('click', () => {
  whatsappWindow.classList.add('hidden');
});

function whatsappChatPreview(chat) {
  if (!chat.messages.length) return { text: '', time: '' };
  const last = chat.messages[chat.messages.length - 1];
  return { text: last.from === 'lukas' ? `Ty: ${last.text}` : last.text, time: last.time };
}

function whatsappUnreadCount(chat) {
  if (whatsappReadIds.has(chat.id)) return 0;
  return chat.id === 'mama' ? 2 : 0;
}

function renderWhatsAppChatList() {
  const list = document.getElementById('wa-chat-list');
  list.innerHTML = WHATSAPP_CHATS.map(chat => {
    const preview = whatsappChatPreview(chat);
    const unread = whatsappUnreadCount(chat);
    return `
      <div class="wa-chat-row${chat.id === whatsappOpenId ? ' active' : ''}" data-id="${chat.id}">
        <span class="wa-chat-avatar">${chat.name.charAt(0)}</span>
        <div class="wa-chat-row-text">
          <div class="wa-chat-row-name">${chat.name}</div>
          <div class="wa-chat-row-preview">${preview.text || '&nbsp;'}</div>
        </div>
        <div class="wa-chat-row-meta">
          <span class="wa-chat-row-time">${preview.time}</span>
          ${unread ? `<span class="wa-chat-row-badge">${unread}</span>` : ''}
        </div>
      </div>
    `;
  }).join('');
  list.querySelectorAll('.wa-chat-row').forEach(row => {
    row.addEventListener('click', () => {
      whatsappOpenId = row.dataset.id;
      whatsappReadIds.add(row.dataset.id);
      renderWhatsAppChatList();
      renderWhatsAppMain();
    });
  });
}

function renderWhatsAppMain() {
  const main = document.getElementById('wa-main');
  const chat = WHATSAPP_CHATS.find(c => c.id === whatsappOpenId);
  if (!chat) {
    main.innerHTML = '<div class="wa-empty-state">Vyber konverzaci</div>';
    return;
  }
  if (!chat.messages.length) {
    main.innerHTML = `
      <div class="wa-main-header"><span class="wa-chat-avatar">${chat.name.charAt(0)}</span><span class="wa-main-header-name">${chat.name}</span></div>
      <div class="wa-empty-state">Zatím žádné zprávy.</div>
    `;
    return;
  }
  let lastDate = null;
  const bubbles = chat.messages.map(m => {
    let dateDivider = '';
    if (m.date !== lastDate) {
      dateDivider = `<div class="wa-date-divider"><span>${m.date}</span></div>`;
      lastDate = m.date;
    }
    return `${dateDivider}<div class="wa-msg ${m.from === 'lukas' ? 'out' : 'in'}"><div class="wa-msg-bubble">${m.text}<span class="wa-msg-time">${m.time}</span></div></div>`;
  }).join('');
  main.innerHTML = `
    <div class="wa-main-header"><span class="wa-chat-avatar">${chat.name.charAt(0)}</span><span class="wa-main-header-name">${chat.name}</span></div>
    <div class="wa-messages" id="wa-messages">${bubbles}</div>
    <div class="wa-input"><span class="wa-input-box">Napiš zprávu</span></div>
  `;
  const messagesEl = document.getElementById('wa-messages');
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function openWhatsApp() {
  whatsappWindow.classList.remove('hidden');
  if (!whatsappOpenId) whatsappOpenId = 'mama';
  whatsappReadIds.add(whatsappOpenId);
  renderWhatsAppChatList();
  renderWhatsAppMain();
  bringWindowToFront(whatsappWindow);
}
document.getElementById('systray-whatsapp').addEventListener('click', openWhatsApp);

// ── Start menu ──
const START_MENU_APPS = [
  { app: 'chrome', label: 'Google Chrome', icon: 'assets/icons/chrome.svg' },
  { app: 'discord', label: 'Discord', icon: 'assets/icons/discord.svg' },
  { app: 'folder-photos', label: 'Fotky a videa', icon: 'assets/icons/folder.svg' },
  { app: 'halo', label: 'Halo Infinite', icon: 'assets/icons/halo.svg' },
  { app: 'cs', label: 'Counter-Strike 2', icon: 'assets/icons/cs.svg' },
  { app: 'self-data', label: 'self_data.html', icon: 'assets/icons/selfdata.svg' },
  { app: 'recycle', label: 'Koš', icon: 'assets/icons/recycle.svg' }
];

const startMenu = document.getElementById('start-menu');
const startMenuGrid = document.getElementById('start-menu-grid');
startMenuGrid.innerHTML = START_MENU_APPS.map(a => `
  <div class="start-menu-tile" data-app="${a.app}">
    <img src="${a.icon}" alt="" />
    <span>${a.label}</span>
  </div>
`).join('');
startMenuGrid.querySelectorAll('.start-menu-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    openApp(tile.dataset.app);
    startMenu.classList.add('hidden');
  });
});

document.getElementById('start-btn').addEventListener('click', e => {
  e.stopPropagation();
  startMenu.classList.toggle('hidden');
});
startMenu.addEventListener('click', e => e.stopPropagation());
document.addEventListener('click', () => startMenu.classList.add('hidden'));

// ── Toast notification ──
const TOAST_CONTENT = {
  title: 'Looksmaxx CZ/SK',
  textHtml: '<strong>KOROLEV_88</strong> tě zmínil v <strong>#foto-rating</strong>',
  targetServerId: 'looksmaxx',
  targetChannel: 'foto-rating'
};
function showToastNotification() {
  const toast = document.getElementById('toast-notification');
  document.getElementById('toast-title').textContent = TOAST_CONTENT.title;
  document.getElementById('toast-text').innerHTML = TOAST_CONTENT.textHtml;
  toast.classList.remove('hidden');
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.classList.add('hidden'), 300);
  }, 3000);
}
function jumpToToastTarget() {
  openDiscordToChannel(TOAST_CONTENT.targetServerId, TOAST_CONTENT.targetChannel);
}
document.getElementById('toast-notification').addEventListener('click', jumpToToastTarget);
document.getElementById('systray-discord').addEventListener('click', jumpToToastTarget);

// ── Taskbar (shows currently open app windows) ──
const TASKBAR_APPS = [
  { id: 'chrome', label: 'Google Chrome', icon: 'assets/icons/chrome.svg', el: chromeWindow },
  { id: 'discord', label: 'Discord', icon: 'assets/icons/discord.svg', el: discordWindow },
  { id: 'photos', label: 'Fotky a videa', icon: 'assets/icons/folder.svg', el: photosWindow },
  { id: 'recycle', label: 'Koš', icon: 'assets/icons/recycle.svg', el: recycleWindow },
  { id: 'halo', label: 'Halo Infinite', icon: 'assets/icons/halo.svg', el: haloWindow },
  { id: 'cs2', label: 'Counter-Strike 2', icon: 'assets/icons/cs.svg', el: cs2Window },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'assets/icons/whatsapp.svg', el: whatsappWindow }
];

function renderTaskbarApps() {
  const taskbarApps = document.getElementById('taskbar-apps');
  const open = TASKBAR_APPS.filter(a => a.el && !a.el.classList.contains('hidden'));
  taskbarApps.innerHTML = open.map(a => `
    <button class="taskbar-app-btn${a.el === focusedWindowEl ? ' active' : ''}" data-win="${a.id}"><img src="${a.icon}" alt="" />${a.label}</button>
  `).join('');
  taskbarApps.querySelectorAll('.taskbar-app-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const found = TASKBAR_APPS.find(a => a.id === btn.dataset.win);
      if (!found) return;
      // Same rule as any real taskbar: click the focused window's button to minimize it,
      // click a background window's button (or a hidden one) to bring it forward.
      if (found.el === focusedWindowEl) {
        found.el.classList.add('hidden');
        focusedWindowEl = null;
      } else {
        found.el.classList.remove('hidden');
        bringWindowToFront(found.el);
      }
    });
  });
}

function setupTaskbarTracking() {
  const observer = new MutationObserver(renderTaskbarApps);
  TASKBAR_APPS.forEach(a => {
    if (a.el) observer.observe(a.el, { attributes: true, attributeFilter: ['class'] });
  });
  renderTaskbarApps();
}
setupTaskbarTracking();

// ── App launcher ──
function openApp(app) {
  switch (app) {
    case 'chrome':
      openChrome();
      break;
    case 'folder-photos':
      openPhotos();
      break;
    case 'discord':
      openDiscord();
      break;
    case 'halo':
      openHalo();
      break;
    case 'cs':
      openCs2();
      break;
    case 'recycle':
      openRecycle();
      break;
    case 'self-data':
      openSelfData();
      break;
    case 'whatsapp':
      openWhatsApp();
      break;
    default:
      break;
  }
}

// ══════════════════════════════════════════════════════════════════════════
// Content editor — hidden dev tool for Nat (Ctrl+Shift+E). Lets her edit every
// piece of text and swap every placeholder image across the whole simulation,
// without touching code. Not part of the in-fiction desktop.
// ══════════════════════════════════════════════════════════════════════════

function isPlainObject(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

const EDITOR_PROTECTED_KEYS = new Set(['type', 'preview', 'id', 'favicon', 'icon', 'activeChannel']);

function isImageSlotObject(obj) {
  if (!isPlainObject(obj)) return false;
  if ('role' in obj && 'html' in obj) return true; // any chatgpt message — image can always be added
  if (obj.type === 'image-blur' || obj.type === 'image-missing') return true; // recycle bin
  if (typeof obj.preview === 'string' && 'date' in obj && 'size' in obj) return true; // Photos file card
  if ((obj.type === 'blur' || obj.type === 'sensitive') && 'filename' in obj) return true; // Discord attachment
  return false;
}

function fieldLabel(key) {
  const spaced = key.replace(/([A-Z])/g, ' $1').replace(/[_-]/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function escapeForAttr(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;'); }
function escapeHtml(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function escapeForTextarea(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function renderImageSlotControl(path, currentImage) {
  return `
    <div class="editor-image-slot" data-image-path="${path}">
      <div class="editor-image-preview">${currentImage ? `<img src="${currentImage}" alt="" />` : '<span class="editor-image-empty">bez obrázku</span>'}</div>
      <div class="editor-image-actions">
        <label class="editor-upload-btn">Nahrát obrázek<input type="file" accept="image/*" class="hidden editor-image-input" data-image-path="${path}" /></label>
        ${currentImage ? `<button class="editor-image-clear" data-image-path="${path}">Odebrat</button>` : ''}
      </div>
    </div>
  `;
}

// Lets Nat swap a YouTube video/short in the editor just by pasting its URL — no code changes needed.
function extractYoutubeId(url) {
  if (!url) return null;
  const trimmed = url.trim();
  let m = trimmed.match(/\/shorts\/([a-zA-Z0-9_-]{6,})/);
  if (m) return { id: m[1], format: 'short' };
  m = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (m) return { id: m[1], format: 'long' };
  m = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (m) return { id: m[1], format: 'long' };
  if (/^[a-zA-Z0-9_-]{9,15}$/.test(trimmed)) return { id: trimmed, format: 'long' };
  return null;
}

function fetchYoutubeOembed(url) {
  return fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`)
    .then(r => (r.ok ? r.json() : null))
    .catch(() => null);
}

function ytEditorUrlControl(item, itemPath) {
  return `
    <div class="editor-yt-link-row" data-yt-link-path="${itemPath}">
      <input type="text" class="editor-yt-link-input" placeholder="Vlož odkaz na YouTube video nebo Short…" />
      <button type="button" class="editor-yt-link-btn" data-yt-link-path="${itemPath}">Připojit video</button>
      <span class="editor-yt-link-status"></span>
    </div>
  `;
}

function editorHeadingFor(item, i) {
  if (!isPlainObject(item)) return `#${i + 1}`;
  const candidate = item.title || item.name || item.author || item.subject || item.sender || item.date || item.label || item.text;
  return typeof candidate === 'string' ? candidate.slice(0, 70) : `#${i + 1}`;
}

function renderEditorNode(node, path, forceImageSlot, sectionKey) {
  if (Array.isArray(node)) {
    const section = sectionKey ? EDITOR_SECTIONS.find(s => s.key === sectionKey) : null;
    const showPrelude = section && path === section.key && typeof section.itemPrelude === 'function';
    const canAddRemove = !!(section && section.allowAddRemove);
    const removeBtnHTML = itemPath => canAddRemove
      ? `<button type="button" class="editor-array-remove" data-remove-path="${itemPath}" title="Smazat položku">🗑</button>`
      : '';
    const itemsHTML = node.map((item, i) => {
      const itemPath = `${path}.${i}`;
      if (typeof item === 'string') {
        return `<div class="editor-field"><label>#${i + 1}</label><div class="editor-array-primitive-row"><input type="text" data-path="${itemPath}" value="${escapeForAttr(item)}" />${removeBtnHTML(itemPath)}</div></div>`;
      }
      if (typeof item === 'number') {
        return `<div class="editor-field"><label>#${i + 1}</label><div class="editor-array-primitive-row"><input type="text" data-numeric="1" data-path="${itemPath}" value="${item}" />${removeBtnHTML(itemPath)}</div></div>`;
      }
      return `
        <div class="editor-array-item">
          <div class="editor-array-item-heading"><span>${editorHeadingFor(item, i)}</span>${removeBtnHTML(itemPath)}</div>
          ${showPrelude ? section.itemPrelude(item, itemPath) : ''}
          ${renderEditorNode(item, itemPath, forceImageSlot, sectionKey)}
        </div>
      `;
    }).join('');
    const addBtnHTML = canAddRemove ? `<button type="button" class="editor-array-add" data-add-path="${path}">+ Přidat položku</button>` : '';
    return itemsHTML + addBtnHTML;
  }
  if (isPlainObject(node)) {
    const showImageSlot = forceImageSlot || isImageSlotObject(node);
    let html = showImageSlot ? renderImageSlotControl(`${path}.image`, node.image) : '';
    Object.keys(node).forEach(key => {
      if (key === 'image') return;
      const val = node[key];
      const fieldPath = `${path}.${key}`;
      // Photos file cards: let Nat pick the placeholder-card type from a dropdown instead
      // of hiding it — `preview` is normally a protected key (see EDITOR_PROTECTED_KEYS)
      // because free-text-editing a type discriminant elsewhere in the app is unsafe, but
      // a constrained select of known preview types is exactly what she asked to control.
      if (key === 'preview' && sectionKey === 'photos') {
        html += `
          <div class="editor-field">
            <label>Typ náhledu</label>
            <select data-path="${fieldPath}">
              ${PHOTO_PREVIEW_TYPES.map(o => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('')}
            </select>
          </div>
        `;
        return;
      }
      // Koš items: same idea as the photos preview dropdown above — `type` picks how
      // buildTrashViewerContent() renders the item. Keep whatever legacy value an
      // existing item has (e.g. 'grok') selectable even though it's not one of the
      // 3 types Nat can pick for a brand new item.
      if (key === 'type' && sectionKey === 'recycle') {
        const opts = RECYCLE_TYPE_OPTIONS.some(o => o.value === val) ? RECYCLE_TYPE_OPTIONS : [...RECYCLE_TYPE_OPTIONS, { value: val, label: val }];
        html += `
          <div class="editor-field">
            <label>Preview type</label>
            <select data-path="${fieldPath}">
              ${opts.map(o => `<option value="${o.value}" ${val === o.value ? 'selected' : ''}>${o.label}</option>`).join('')}
            </select>
          </div>
        `;
        return;
      }
      if (EDITOR_PROTECTED_KEYS.has(key)) return;
      if (val === null || val === undefined) return;
      if (typeof val === 'string') {
        const isLong = val.length > 70 || val.includes('\n') || /<[a-z]/i.test(val);
        html += `
          <div class="editor-field">
            <label>${fieldLabel(key)}</label>
            ${isLong
              ? `<textarea data-path="${fieldPath}" rows="4">${escapeForTextarea(val)}</textarea>`
              : `<input type="text" data-path="${fieldPath}" value="${escapeForAttr(val)}" />`}
          </div>
        `;
      } else if (typeof val === 'number') {
        html += `
          <div class="editor-field">
            <label>${fieldLabel(key)}</label>
            <input type="text" data-numeric="1" data-path="${fieldPath}" value="${val}" />
          </div>
        `;
      } else if (typeof val === 'boolean') {
        html += `
          <div class="editor-field editor-field-checkbox">
            <label><input type="checkbox" data-path="${fieldPath}" data-boolean="1" ${val ? 'checked' : ''} /> ${fieldLabel(key)}</label>
          </div>
        `;
      } else if (Array.isArray(val) || isPlainObject(val)) {
        html += `
          <div class="editor-nested">
            <div class="editor-nested-label">${fieldLabel(key)}</div>
            ${renderEditorNode(val, fieldPath, false, sectionKey)}
          </div>
        `;
      }
    });
    return html;
  }
  return '';
}

function resolveEditorPath(fullPath) {
  const parts = fullPath.split('.');
  const section = EDITOR_SECTIONS.find(s => s.key === parts[0]);
  if (!section) return null;
  let node = section.data;
  for (let i = 1; i < parts.length - 1; i++) {
    if (node == null) return null;
    node = node[parts[i]];
  }
  if (node == null) return null;
  return { parent: node, key: parts[parts.length - 1] };
}
function setEditorValueAtPath(fullPath, value) {
  const resolved = resolveEditorPath(fullPath);
  if (resolved) resolved.parent[resolved.key] = value;
}

// When an editor image-slot path belongs to a chatgpt message ({role, html}), keep its
// `photo` flag in sync — that's what actually gates whether the attachment shows up in
// the real ChatGPT view, independent of whether an image was ever uploaded.
function markMessagePhotoFlag(imagePath, hasPhoto) {
  const resolved = resolveEditorPath(imagePath);
  if (resolved && isPlainObject(resolved.parent) && 'role' in resolved.parent && 'html' in resolved.parent) {
    resolved.parent.photo = hasPhoto;
  }
}

// Resolves a path that points AT an array itself (e.g. "chatgpt" or "chatgpt.0.messages"),
// as opposed to resolveEditorPath which resolves a path to a leaf field's {parent, key}.
function resolveEditorArray(fullPath) {
  const parts = fullPath.split('.');
  const section = EDITOR_SECTIONS.find(s => s.key === parts[0]);
  if (!section) return null;
  let node = section.data;
  for (let i = 1; i < parts.length; i++) {
    if (node == null) return null;
    node = node[parts[i]];
  }
  return Array.isArray(node) ? node : null;
}

// Produces a blank starting point for a new array item, shaped like the last existing
// item so new entries stay structurally consistent (same fields, nested arrays/objects).
function blankClone(value) {
  if (Array.isArray(value)) return [];
  if (isPlainObject(value)) {
    const out = {};
    Object.keys(value).forEach(k => { out[k] = blankClone(value[k]); });
    if ('role' in out && 'html' in out) out.role = 'user';
    // Photos file card — blanking wiped `type`, but renderPhotos() filters strictly on
    // type === 'file'/'folder', so a blanked type would make the new card invisible.
    if ('preview' in out && 'date' in out && 'size' in out) { out.type = 'file'; out.preview = 'uploaded'; }
    return out;
  }
  if (typeof value === 'string') return '';
  if (typeof value === 'number') return 0;
  if (typeof value === 'boolean') return false;
  return value;
}

function addEditorArrayItem(path) {
  const arr = resolveEditorArray(path);
  if (!arr) return;
  const last = arr.length > 0 ? arr[arr.length - 1] : null;
  let newItem;
  // Every array under the photos section is a folder's `children` list (files and
  // folders mixed) — always add a new FILE card, regardless of what the last sibling's
  // shape happens to be (mirroring a folder's shape here would produce an invisible
  // item, since renderPhotos() filters strictly on type === 'file'/'folder').
  if (path.startsWith('photos.')) {
    newItem = { type: 'file', name: 'Nový soubor', date: '', size: '', dims: '', preview: 'uploaded', desc: '' };
  } else if (path === 'recycle') {
    // RECYCLE_ITEMS mixes image/text/pdf/grok shapes — mirroring the last item's shape
    // (like blankClone does elsewhere) would carry over fields (e.g. `messages`) that
    // don't make sense for a fresh item, so build a clean image-type default instead.
    newItem = {
      id: 'new-' + Math.random().toString(36).slice(2, 10),
      name: 'Nová položka', deletedDate: '', size: '', originalLocation: '',
      icon: 'assets/icons/file-image.svg', type: 'image-blur', caption: ''
    };
  } else if (isPlainObject(last)) newItem = blankClone(last);
  else if (typeof last === 'number') newItem = 0;
  else if (typeof last === 'string') newItem = '';
  else newItem = {};
  arr.push(newItem);
  scheduleSaveContentOverrides();
  renderEditorPanel(currentEditorSectionKey);
  refreshOpenWindowsAfterEdit();
}

function removeEditorArrayItem(itemPath) {
  const parts = itemPath.split('.');
  const idx = parseInt(parts[parts.length - 1], 10);
  if (isNaN(idx)) return;
  const arrPath = parts.slice(0, -1).join('.');
  const arr = resolveEditorArray(arrPath);
  if (!arr) return;
  arr.splice(idx, 1);
  scheduleSaveContentOverrides();
  renderEditorPanel(currentEditorSectionKey);
  refreshOpenWindowsAfterEdit();
}

function fileToResizedDataUrl(file, maxDim, quality) {
  maxDim = maxDim || 900;
  quality = quality || 0.82;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let width = img.width, height = img.height;
        if (width > maxDim || height > maxDim) {
          const scale = maxDim / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function refreshOpenWindowsAfterEdit() {
  if (!chromeWindow.classList.contains('hidden')) renderActivePage();
  if (!discordWindow.classList.contains('hidden')) {
    // Full refresh, not just the message pane — adding/removing a server or channel
    // (or renaming one) needs the rail and channel-list sidebar to catch up too, not
    // just whichever conversation happens to be showing.
    renderServerRail();
    if (discordView === 'dm') openDiscordDMs(); else { renderChannelPanel(); renderServerChannel(); }
  }
  if (!photosWindow.classList.contains('hidden')) renderPhotos();
  if (!photosModalOverlay.classList.contains('hidden')) {
    const openFile = photosModalFiles[photosModalIndex];
    const stillExists = photosModalSource === 'recycle'
      ? !!openFile && RECYCLE_ITEMS.includes(openFile._recycleSource)
      : !!openFile && currentFolder().children.includes(openFile);
    if (!stillExists) closePhotoModal();
  }
  if (!recycleWindow.classList.contains('hidden')) renderRecycleList();
  if (!trashViewerWindow.classList.contains('hidden') && !RECYCLE_ITEMS.includes(trashViewerCurrentItem)) {
    trashViewerWindow.classList.add('hidden');
  }
  if (!cs2Window.classList.contains('hidden')) document.getElementById('cs2-body').innerHTML = buildCs2BodyHTML();
  if (!haloWindow.classList.contains('hidden')) document.getElementById('halo-body').innerHTML = buildHaloBodyHTML();
  if (!whatsappWindow.classList.contains('hidden')) { renderWhatsAppChatList(); renderWhatsAppMain(); }
}

const CONTENT_STORAGE_KEY = 'lukas-pc-content-overrides-v1';

function deepMergeContentInto(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    source.forEach((val, i) => {
      if (i >= target.length) return;
      if (val && typeof val === 'object' && target[i] && typeof target[i] === 'object') deepMergeContentInto(target[i], val);
      else target[i] = val;
    });
  } else if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach(k => {
      const val = source[k];
      if (val && typeof val === 'object' && target[k] && typeof target[k] === 'object' && Array.isArray(val) === Array.isArray(target[k])) {
        deepMergeContentInto(target[k], val);
      } else {
        target[k] = val;
      }
    });
  }
}

let editorDefaultsSnapshot = null;
function snapshotEditorDefaults() {
  const dump = {};
  EDITOR_SECTIONS.forEach(s => { dump[s.key] = JSON.parse(JSON.stringify(s.data)); });
  editorDefaultsSnapshot = dump;
}

// selfDataMetrics moved from a fixed object-of-arrays to an array of metric objects
// (see normalizeLegacySelfDataMetrics) — a plain deep-merge can't reconcile those two
// shapes, so both load paths that touch EDITOR_SECTIONS data route through here.
function applyEditorSectionData(section, savedValue) {
  if (section.key === 'selfDataMetrics') {
    const normalized = normalizeLegacySelfDataMetrics(savedValue);
    if (normalized) { section.data.length = 0; section.data.push(...normalized); }
    return;
  }
  // chatgpt moved from a fixed {id, urlId, title, date, time, messages} shape to
  // {titul, datum, zpravy} — a plain deep-merge can't reconcile those two shapes, so
  // (like selfDataMetrics) a saved/imported array just replaces the whole thing.
  if (section.key === 'chatgpt') {
    if (Array.isArray(savedValue)) { section.data.length = 0; section.data.push(...savedValue); }
    return;
  }
  deepMergeContentInto(section.data, savedValue);
}

function loadContentOverrides() {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    EDITOR_SECTIONS.forEach(s => {
      if (saved[s.key] !== undefined) applyEditorSectionData(s, saved[s.key]);
    });
  } catch (e) {
    console.warn('Nepodařilo se načíst uložený obsah editoru:', e);
  }
}

function setEditorStatus(text) {
  const status = document.getElementById('editor-statusbar');
  if (status) status.textContent = text;
}

let saveContentTimer = null;
function scheduleSaveContentOverrides() {
  setEditorStatus('Ukládání…');
  clearTimeout(saveContentTimer);
  saveContentTimer = setTimeout(saveContentOverrides, 400);
}
function saveContentOverrides() {
  const dump = {};
  EDITOR_SECTIONS.forEach(s => { dump[s.key] = s.data; });
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(dump));
    setEditorStatus('Uloženo do tohoto prohlížeče · ' + new Date().toLocaleTimeString('cs-CZ'));
  } catch (e) {
    setEditorStatus('Uložení selhalo (úložiště prohlížeče je asi plné) — stáhni si zálohu přes „Exportovat JSON“.');
  }
}

function exportContentJSON() {
  const dump = {};
  EDITOR_SECTIONS.forEach(s => { dump[s.key] = s.data; });
  const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lukas-pc-content.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importContentJSONFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const saved = JSON.parse(reader.result);
      EDITOR_SECTIONS.forEach(s => {
        if (saved[s.key] !== undefined) applyEditorSectionData(s, saved[s.key]);
      });
      saveContentOverrides();
      saveSelfDataMetrics();
      saveChatgptConversations();
      renderEditorPanel(currentEditorSectionKey);
      refreshOpenWindowsAfterEdit();
    } catch (e) {
      alert('Nepodařilo se načíst soubor: ' + e.message);
    }
  };
  reader.readAsText(file);
}

function resetContentToDefaults() {
  if (!editorDefaultsSnapshot) return;
  if (!confirm('Opravdu chceš vrátit VŠECHNY texty a obrázky na výchozí hodnoty? Tato akce se nedá vzít zpět.')) return;
  EDITOR_SECTIONS.forEach(s => {
    const defaults = JSON.parse(JSON.stringify(editorDefaultsSnapshot[s.key]));
    if (Array.isArray(s.data)) {
      s.data.length = 0;
      s.data.push(...defaults);
    } else if (isPlainObject(s.data)) {
      Object.keys(s.data).forEach(k => delete s.data[k]);
      Object.assign(s.data, defaults);
    }
  });
  localStorage.removeItem(CONTENT_STORAGE_KEY);
  localStorage.removeItem(SELF_DATA_METRICS_STORAGE_KEY);
  sdmExpanded.clear();
  localStorage.removeItem(CHATGPT_CONVERSATIONS_STORAGE_KEY);
  ccExpanded.clear();
  activeConvIndex = 0;
  setEditorStatus('Vráceno na výchozí hodnoty.');
  renderEditorPanel(currentEditorSectionKey);
  refreshOpenWindowsAfterEdit();
}

let currentEditorSectionKey = null;

function buildEditorNavHTML() {
  return EDITOR_SECTIONS.map(s => `<div class="editor-nav-item" data-key="${s.key}">${s.label}</div>`).join('');
}

function renderEditorPanel(sectionKey) {
  const section = EDITOR_SECTIONS.find(s => s.key === sectionKey);
  const panel = document.getElementById('editor-panel');
  if (!section) { panel.innerHTML = ''; return; }
  if (sectionKey === 'selfDataMetrics') {
    panel.innerHTML = `<h2 class="editor-section-title">${section.label}</h2>${renderSelfDataMetricsEditorHTML()}`;
    return;
  }
  if (sectionKey === 'chatgpt') {
    panel.innerHTML = `<h2 class="editor-section-title">${section.label}</h2>${renderChatgptConversationsEditorHTML()}`;
    return;
  }
  panel.innerHTML = `<h2 class="editor-section-title">${section.label}</h2>${renderEditorNode(section.data, section.key, !!section.forceImageSlot, section.key)}`;
}

// ── self_data.html metriky: bespoke editor (dynamic metric set, collapsible cards) ──
// Tracked by object reference rather than index so a mid-list add/remove never mixes
// up which card is expanded.
const sdmExpanded = new Set();

function renderSelfDataMetricsEditorHTML() {
  const rows = SELF_DATA_METRICS.map((m, i) => {
    const isOpen = sdmExpanded.has(m);
    return `
      <div class="sdm-item">
        <div class="sdm-header" data-sdm-toggle="${i}">
          <span class="sdm-toggle-caret">${isOpen ? '▾' : '▸'}</span>
          <span class="sdm-header-name">${escapeForAttr(m.nazev) || '(bez názvu)'}</span>
          <span class="sdm-header-value">${m.prumer}${m.jednotka ? ' ' + escapeForAttr(m.jednotka) : ''}</span>
        </div>
        <div class="sdm-body${isOpen ? '' : ' collapsed'}">
          <div class="sdm-field">
            <label>Název</label>
            <input type="text" data-sdm-idx="${i}" data-sdm-field="nazev" value="${escapeForAttr(m.nazev)}" />
          </div>
          <div class="sdm-field">
            <label>Jednotka</label>
            <input type="text" data-sdm-idx="${i}" data-sdm-field="jednotka" value="${escapeForAttr(m.jednotka)}" />
          </div>
          <div class="sdm-field">
            <label>Průměr / aktuální hodnota</label>
            <input type="text" data-sdm-idx="${i}" data-sdm-field="prumer" data-sdm-numeric="1" value="${m.prumer}" />
          </div>
          <div class="sdm-field">
            <label>Týdenní hodnoty</label>
            <div class="sdm-weeks">
              ${m.hodnoty.map((v, wi) => `<input type="text" data-sdm-idx="${i}" data-sdm-week="${wi}" data-sdm-numeric="1" value="${v}" />`).join('')}
            </div>
          </div>
          <div class="sdm-trend-preview">${selfDataTrendText(m)}</div>
          <button type="button" class="sdm-remove-btn" data-sdm-remove="${i}">odstranit</button>
        </div>
      </div>
    `;
  }).join('');
  return `
    <div class="sdm-panel">
      <button type="button" class="sdm-add-btn" id="sdm-add-btn">+ přidat metriku</button>
      ${rows || '<div class="sdm-trend-preview">Žádné metriky.</div>'}
    </div>
  `;
}

function parseNumericInput(raw, fallback) {
  const n = parseFloat(String(raw).replace(',', '.'));
  return isNaN(n) ? fallback : n;
}

// Re-renders just the one header line (name + current value) after a field edit,
// instead of re-rendering the whole panel — keeps focus/cursor stable while typing.
function refreshSelfDataMetricHeader(idx) {
  const m = SELF_DATA_METRICS[idx];
  const item = document.querySelectorAll('.sdm-item')[idx];
  if (!m || !item) return;
  item.querySelector('.sdm-header-name').textContent = m.nazev || '(bez názvu)';
  item.querySelector('.sdm-header-value').textContent = `${m.prumer}${m.jednotka ? ' ' + m.jednotka : ''}`;
  const preview = item.querySelector('.sdm-trend-preview');
  if (preview) preview.textContent = selfDataTrendText(m);
}

function attachSelfDataMetricsHandlers() {
  const panel = document.getElementById('editor-panel');
  panel.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.sdmIdx === undefined) return;
    const idx = Number(el.dataset.sdmIdx);
    const m = SELF_DATA_METRICS[idx];
    if (!m) return;
    if (el.dataset.sdmWeek !== undefined) {
      m.hodnoty[Number(el.dataset.sdmWeek)] = parseNumericInput(el.value, m.hodnoty[Number(el.dataset.sdmWeek)]);
    } else if (el.dataset.sdmField === 'prumer') {
      m.prumer = parseNumericInput(el.value, m.prumer);
    } else if (el.dataset.sdmField) {
      m[el.dataset.sdmField] = el.value;
    } else {
      return;
    }
    refreshSelfDataMetricHeader(idx);
    scheduleSaveContentOverrides();
    saveSelfDataMetrics();
    refreshOpenWindowsAfterEdit();
  });
  panel.addEventListener('click', e => {
    const toggle = e.target.closest('[data-sdm-toggle]');
    if (toggle) {
      const m = SELF_DATA_METRICS[Number(toggle.dataset.sdmToggle)];
      if (m) { sdmExpanded.has(m) ? sdmExpanded.delete(m) : sdmExpanded.add(m); }
      renderEditorPanel('selfDataMetrics');
      return;
    }
    if (e.target.id === 'sdm-add-btn') {
      const newMetric = { nazev: 'nová metrika', jednotka: '/den', prumer: 0, hodnoty: [0, 0, 0, 0, 0, 0, 0, 0] };
      SELF_DATA_METRICS.push(newMetric);
      sdmExpanded.add(newMetric);
      scheduleSaveContentOverrides();
      saveSelfDataMetrics();
      renderEditorPanel('selfDataMetrics');
      refreshOpenWindowsAfterEdit();
      return;
    }
    const removeBtn = e.target.closest('[data-sdm-remove]');
    if (removeBtn) {
      const idx = Number(removeBtn.dataset.sdmRemove);
      const m = SELF_DATA_METRICS[idx];
      if (!m) return;
      if (!confirm(`Opravdu odstranit ${m.nazev || 'tuto metriku'}?`)) return;
      SELF_DATA_METRICS.splice(idx, 1);
      sdmExpanded.delete(m);
      scheduleSaveContentOverrides();
      saveSelfDataMetrics();
      renderEditorPanel('selfDataMetrics');
      refreshOpenWindowsAfterEdit();
    }
  });
}

// ── ChatGPT konverzace: bespoke editor (collapsible list, whole transcript as one
// textarea per conversation, "Lukáš:"/"ChatGPT:" prefixes define the message split) ──
const ccExpanded = new Set();

function chatgptTranscriptText(conv) {
  return (conv.zpravy || []).map(m => `${m.role}: ${m.text}`).join('\n\n');
}

function parseChatgptTranscript(raw) {
  const blocks = String(raw).split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean);
  const zpravy = [];
  blocks.forEach(block => {
    const m = block.match(/^(Lukáš|ChatGPT):\s*([\s\S]*)$/);
    if (m) zpravy.push({ role: m[1], text: m[2].trim() });
  });
  return zpravy;
}

function renderChatgptConversationsEditorHTML() {
  const rows = CHATGPT_CONVERSATIONS.map((conv, i) => {
    const isOpen = ccExpanded.has(conv);
    return `
      <div class="cce-item">
        <div class="cce-header" data-cce-toggle="${i}">
          <span class="cce-toggle-caret">${isOpen ? '▾' : '▸'}</span>
          <span class="cce-header-title">${escapeForAttr(conv.titul) || '(bez názvu)'}</span>
          <span class="cce-header-date">${escapeForAttr(conv.datum)}</span>
        </div>
        <div class="cce-body${isOpen ? '' : ' collapsed'}">
          <div class="cce-field">
            <label>Název konverzace</label>
            <input type="text" data-cce-idx="${i}" data-cce-field="titul" value="${escapeForAttr(conv.titul)}" />
          </div>
          <div class="cce-field">
            <label>Datum posledního otevření</label>
            <input type="text" data-cce-idx="${i}" data-cce-field="datum" value="${escapeForAttr(conv.datum)}" />
          </div>
          <div class="cce-field">
            <label>Konverzace (Lukáš: / ChatGPT: — prázdný řádek mezi zprávami)</label>
            <textarea data-cce-idx="${i}" data-cce-field="zpravy" rows="10">${escapeForTextarea(chatgptTranscriptText(conv))}</textarea>
          </div>
          <button type="button" class="cce-remove-btn" data-cce-remove="${i}">odstranit</button>
        </div>
      </div>
    `;
  }).join('');
  return `
    <div class="cce-panel">
      <button type="button" class="cce-add-btn" id="cce-add-btn">+ přidat konverzaci</button>
      ${rows || '<div class="cce-empty">Žádné konverzace.</div>'}
    </div>
  `;
}

function refreshChatgptConvHeader(idx) {
  const conv = CHATGPT_CONVERSATIONS[idx];
  const item = document.querySelectorAll('.cce-item')[idx];
  if (!conv || !item) return;
  item.querySelector('.cce-header-title').textContent = conv.titul || '(bez názvu)';
  item.querySelector('.cce-header-date').textContent = conv.datum;
}

function attachChatgptConversationsHandlers() {
  const panel = document.getElementById('editor-panel');
  panel.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.cceIdx === undefined) return;
    const idx = Number(el.dataset.cceIdx);
    const conv = CHATGPT_CONVERSATIONS[idx];
    if (!conv) return;
    if (el.dataset.cceField === 'zpravy') {
      conv.zpravy = parseChatgptTranscript(el.value);
    } else if (el.dataset.cceField) {
      conv[el.dataset.cceField] = el.value;
    } else {
      return;
    }
    refreshChatgptConvHeader(idx);
    scheduleSaveContentOverrides();
    saveChatgptConversations();
    refreshOpenWindowsAfterEdit();
  });
  panel.addEventListener('click', e => {
    const toggle = e.target.closest('[data-cce-toggle]');
    if (toggle) {
      const conv = CHATGPT_CONVERSATIONS[Number(toggle.dataset.cceToggle)];
      if (conv) { ccExpanded.has(conv) ? ccExpanded.delete(conv) : ccExpanded.add(conv); }
      renderEditorPanel('chatgpt');
      return;
    }
    if (e.target.id === 'cce-add-btn') {
      const newConv = {
        titul: 'Nová konverzace', datum: '',
        zpravy: [{ role: 'Lukáš', text: '' }, { role: 'ChatGPT', text: '' }]
      };
      CHATGPT_CONVERSATIONS.unshift(newConv);
      ccExpanded.add(newConv);
      scheduleSaveContentOverrides();
      saveChatgptConversations();
      renderEditorPanel('chatgpt');
      refreshOpenWindowsAfterEdit();
      return;
    }
    const removeBtn = e.target.closest('[data-cce-remove]');
    if (removeBtn) {
      const idx = Number(removeBtn.dataset.cceRemove);
      const conv = CHATGPT_CONVERSATIONS[idx];
      if (!conv) return;
      if (!confirm(`Opravdu smazat konverzaci "${conv.titul || 'bez názvu'}"?`)) return;
      CHATGPT_CONVERSATIONS.splice(idx, 1);
      ccExpanded.delete(conv);
      scheduleSaveContentOverrides();
      saveChatgptConversations();
      renderEditorPanel('chatgpt');
      refreshOpenWindowsAfterEdit();
    }
  });
}

function selectEditorSection(key) {
  currentEditorSectionKey = key;
  document.querySelectorAll('.editor-nav-item').forEach(n => n.classList.toggle('active', n.dataset.key === key));
  renderEditorPanel(key);
}

function attachEditorPanelHandlers() {
  const panel = document.getElementById('editor-panel');
  panel.addEventListener('input', e => {
    const el = e.target;
    if (!el.dataset.path) return;
    let val = el.value;
    if (el.dataset.numeric) {
      const n = parseFloat(val);
      val = isNaN(n) ? val : n;
    }
    setEditorValueAtPath(el.dataset.path, val);
    scheduleSaveContentOverrides();
    refreshOpenWindowsAfterEdit();
  });
  panel.addEventListener('change', e => {
    const el = e.target;
    if (el.dataset.boolean) {
      setEditorValueAtPath(el.dataset.path, el.checked);
      scheduleSaveContentOverrides();
      refreshOpenWindowsAfterEdit();
      return;
    }
    if (el.classList.contains('editor-image-input') && el.files && el.files[0]) {
      const path = el.dataset.imagePath;
      fileToResizedDataUrl(el.files[0]).then(dataUrl => {
        setEditorValueAtPath(path, dataUrl);
        markMessagePhotoFlag(path, true);
        scheduleSaveContentOverrides();
        const slot = el.closest('.editor-image-slot');
        if (slot) {
          slot.querySelector('.editor-image-preview').innerHTML = `<img src="${dataUrl}" alt="" />`;
          if (!slot.querySelector('.editor-image-clear')) {
            const clearBtn = document.createElement('button');
            clearBtn.className = 'editor-image-clear';
            clearBtn.dataset.imagePath = path;
            clearBtn.textContent = 'Odebrat';
            slot.querySelector('.editor-image-actions').appendChild(clearBtn);
          }
        }
        refreshOpenWindowsAfterEdit();
      });
    }
  });
  panel.addEventListener('click', e => {
    if (e.target.classList.contains('editor-array-add')) {
      addEditorArrayItem(e.target.dataset.addPath);
      return;
    }
    if (e.target.classList.contains('editor-array-remove')) {
      removeEditorArrayItem(e.target.dataset.removePath);
      return;
    }
    if (e.target.classList.contains('editor-image-clear')) {
      const path = e.target.dataset.imagePath;
      setEditorValueAtPath(path, null);
      markMessagePhotoFlag(path, false);
      scheduleSaveContentOverrides();
      const slot = e.target.closest('.editor-image-slot');
      slot.querySelector('.editor-image-preview').innerHTML = '<span class="editor-image-empty">bez obrázku</span>';
      e.target.remove();
      refreshOpenWindowsAfterEdit();
    }
    if (e.target.classList.contains('editor-yt-link-btn')) {
      const itemPath = e.target.dataset.ytLinkPath;
      const row = e.target.closest('.editor-yt-link-row');
      const input = row.querySelector('.editor-yt-link-input');
      const status = row.querySelector('.editor-yt-link-status');
      const rawUrl = input.value.trim();
      const parsed = extractYoutubeId(rawUrl);
      if (!parsed) {
        status.textContent = 'Nepodařilo se rozpoznat odkaz na YouTube video.';
        return;
      }
      setEditorValueAtPath(`${itemPath}.id`, parsed.id);
      setEditorValueAtPath(`${itemPath}.format`, parsed.format);
      setEditorValueAtPath(`${itemPath}.url`, parsed.format === 'short'
        ? `https://www.youtube.com/shorts/${parsed.id}`
        : `https://www.youtube.com/watch?v=${parsed.id}`);
      scheduleSaveContentOverrides();
      renderEditorPanel(currentEditorSectionKey);
      refreshOpenWindowsAfterEdit();
      fetchYoutubeOembed(rawUrl).then(data => {
        if (data && (data.title || data.author_name)) {
          if (data.title) setEditorValueAtPath(`${itemPath}.title`, data.title);
          if (data.author_name) setEditorValueAtPath(`${itemPath}.channel`, data.author_name);
          scheduleSaveContentOverrides();
          renderEditorPanel(currentEditorSectionKey);
          refreshOpenWindowsAfterEdit();
        }
      });
    }
  });
}

function openContentEditor() {
  const overlay = document.getElementById('content-editor');
  document.getElementById('editor-nav').innerHTML = buildEditorNavHTML();
  document.querySelectorAll('.editor-nav-item').forEach(n => {
    n.addEventListener('click', () => selectEditorSection(n.dataset.key));
  });
  selectEditorSection(currentEditorSectionKey || EDITOR_SECTIONS[0].key);
  overlay.classList.remove('hidden');
}
function closeContentEditor() {
  document.getElementById('content-editor').classList.add('hidden');
}

document.getElementById('editor-close-btn').addEventListener('click', closeContentEditor);
document.getElementById('editor-export-btn').addEventListener('click', exportContentJSON);
document.getElementById('editor-reset-btn').addEventListener('click', resetContentToDefaults);
document.getElementById('editor-import-btn').addEventListener('click', () => document.getElementById('editor-import-input').click());
document.getElementById('editor-import-input').addEventListener('change', e => {
  if (e.target.files && e.target.files[0]) importContentJSONFile(e.target.files[0]);
  e.target.value = '';
});
attachEditorPanelHandlers();
attachSelfDataMetricsHandlers();
attachChatgptConversationsHandlers();

document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'E' || e.key === 'e')) {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && !lockScreen.classList.contains('hidden')) return;
    e.preventDefault();
    const overlay = document.getElementById('content-editor');
    if (overlay.classList.contains('hidden')) openContentEditor();
    else closeContentEditor();
  }
});

// ── Register every editable data collection, load saved edits, then start the clock/toast ──
const EDITOR_SECTIONS = [
  { key: 'chatgpt', label: 'ChatGPT konverzace', data: CHATGPT_CONVERSATIONS },
  { key: 'chromeHistory', label: 'Chrome — historie', data: HISTORY_DAYS },
  { key: 'chromeTabs', label: 'Chrome — výchozí otevřené taby', data: INITIAL_TABS_TEMPLATE },
  { key: 'genericSites', label: 'Chrome — obsah odkazovaných stránek', data: GENERIC_SITES },
  { key: 'discord', label: 'Discord', data: DISCORD, allowAddRemove: true },
  { key: 'recycle', label: 'Koš', data: RECYCLE_ITEMS, allowAddRemove: true },
  { key: 'photos', label: 'Fotky a videa', data: PHOTOS_TREE, allowAddRemove: true },
  { key: 'facerateSubmissions', label: 'facerate.io — Upload', data: FACERATE_SUBMISSIONS, forceImageSlot: true, allowAddRemove: true },
  { key: 'facerateVotes', label: 'facerate.io — Vote', data: FACERATE_VOTES, forceImageSlot: true },
  { key: 'facerateLeaderboard', label: 'facerate.io — Leaderboard', data: FACERATE_LEADERBOARD },
  { key: 'facerateGuides', label: 'facerate.io — Guides', data: FACERATE_GUIDES },
  { key: 'facerateForum', label: 'facerate.io — Forum', data: FACERATE_FORUM },
  { key: 'youtubeVideos', label: 'YouTube — videa', data: YT_HOME_VIDEOS, forceImageSlot: true, itemPrelude: ytEditorUrlControl },
  { key: 'youtubeComments', label: 'YouTube — komentáře', data: YT_COMMENTS },
  { key: 'grok', label: 'Grok', data: GROK_CONVERSATIONS },
  { key: 'googleResults', label: 'Google — výsledky', data: GOOGLE_RESULTS },
  { key: 'googlePAA', label: 'Google — Lidé se také ptají', data: GOOGLE_PAA },
  { key: 'googleQueryResults', label: 'Google — výsledky pro vlak hledání', data: GOOGLE_QUERY_RESULTS },
  { key: 'idosConnections', label: 'IDOS — spojení Plzeň-Praha', data: IDOS_CONNECTIONS },
  { key: 'cs2Hours', label: 'CS2 — hodiny za měsíc', data: CS2_MONTHLY_HOURS },
  { key: 'cs2Matches', label: 'CS2 — zápasy', data: CS2_MATCHES },
  { key: 'cs2Friends', label: 'CS2 — přátelé', data: CS2_FRIENDS },
  { key: 'haloMatches', label: 'Halo — zápasy', data: HALO_MATCHES },
  { key: 'haloFriends', label: 'Halo — přátelé (Spartan Company)', data: HALO_FRIENDS },
  { key: 'haloWeapons', label: 'Halo — oblíbené zbraně', data: HALO_WEAPONS },
  { key: 'haloMedals', label: 'Halo — medaile', data: HALO_MEDALS },
  { key: 'desktopClock', label: 'Plocha — hodiny', data: CLOCK_CONTENT },
  { key: 'desktopToast', label: 'Plocha — Discord notifikace', data: TOAST_CONTENT },
  { key: 'selfDataMetrics', label: 'self_data.html — metriky', data: SELF_DATA_METRICS },
  { key: 'whatsapp', label: 'WhatsApp', data: WHATSAPP_CHATS }
];

snapshotEditorDefaults();
loadContentOverrides();
loadSelfDataMetrics();
loadChatgptConversations();

// Make every app window draggable by its titlebar and focusable on click, like a real desktop.
[
  [chromeWindow, '.chrome-titlebar'],
  [discordWindow, '.discord-titlebar'],
  [photosWindow, '.pfe-titlebar'],
  [recycleWindow, '.pfe-titlebar'],
  [trashViewerWindow, '.explorer-titlebar'],
  [cs2Window, '.cs2-titlebar'],
  [haloWindow, '.halo-titlebar'],
  [whatsappWindow, '.wa-titlebar']
].forEach(([win, titlebarSelector]) => {
  if (!win) return;
  makeWindowDraggable(win, win.querySelector(titlebarSelector));
  makeWindowFocusable(win);
});

// ── Lock screen → Welcome transition (Windows-style entry point) ──
// The clock/toast only start once the desktop is actually revealed, so their timing
// lines up with what the user sees instead of ticking away behind the lock screen.
const CZ_WEEKDAYS = ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'];
const CZ_MONTHS_GENITIVE = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince'];

function renderLockScreenClock() {
  const d = new Date(parseClockBase());
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  document.getElementById('lock-time').textContent = `${h}:${m}`;
  document.getElementById('lock-date').textContent = `${CZ_WEEKDAYS[d.getDay()]} ${d.getDate()}. ${CZ_MONTHS_GENITIVE[d.getMonth()]}`;
}
renderLockScreenClock();

function revealDesktop() {
  startClock();
  setTimeout(showToastNotification, 900);
}

let lockScreenDismissed = false;
function dismissLockScreen() {
  if (lockScreenDismissed) return;
  lockScreenDismissed = true;
  const lock = document.getElementById('lock-screen');
  const welcome = document.getElementById('welcome-screen');
  // The welcome screen starts revealing itself immediately, underneath the lock screen as
  // it slides up and away, instead of waiting for that slide to finish first — same
  // continuous feel as the real Windows sign-in transition, and noticeably snappier.
  lock.classList.add('dismissing');
  welcome.classList.remove('hidden');
  requestAnimationFrame(() => welcome.classList.add('visible'));
  setTimeout(() => lock.classList.add('hidden'), 250);
  setTimeout(() => {
    welcome.classList.remove('visible');
    setTimeout(() => {
      welcome.classList.add('hidden');
      revealDesktop();
    }, 150);
  }, 200);
}

document.getElementById('lock-screen').addEventListener('click', dismissLockScreen);
document.addEventListener('keydown', () => {
  if (!lockScreenDismissed) dismissLockScreen();
});
