// ── Clock ──
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('taskbar-time').textContent = `${h}:${m}`;
}
updateClock();
setInterval(updateClock, 10000);

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

// ── ChatGPT (embedded in Chrome) ──
const CHATGPT_CONVERSATIONS = [
  {
    id: 6,
    urlId: '6f2a91d0-8b3e-4c1a-9f2d-3a7e5c0b1d44',
    title: 'Otázka o hypergamii',
    date: '24. 3. 2026',
    time: '02:43',
    messages: [
      { role: 'user', html: '<p>když je někdo bottom 20% podle looksmaxxing komunity, má smysl se snažit, nebo je to jak říkají foids — waste of time</p>' },
      { role: 'assistant', html: '<p>Snažit se má smysl vždycky, nezávisle na tom, jak by tě ohodnotila nějaká komunita s vlastním žebříčkem – zlepšovat se (ve zdraví, ve zvycích, v tom, jak se cítíš) není „waste of time“ jen proto, že to někdo zařadí do kategorie „bottom 20 %“.</p><p>Chci se ale zastavit u slova, které jsi použil – „foids“. Je to zkratka, která ženy redukuje na věc, ne na lidi, a najdeš ji hlavně v komunitách, které tenhle jazyk používají cíleně, protože tě chtějí udržet u sebe a v jejich pohledu na svět – ne proto, že by jim šlo o to, aby se ti dařilo. Zkus si od tohohle slovníku na chvíli dát pauzu a všímat si, jak moc ti to podle tebe vlastně pomáhá.</p>' }
    ]
  },
  {
    id: 5,
    urlId: '2c7d4e18-1a9f-4b6c-8e3a-9d0f6b2c7a15',
    title: 'Nefunguje to',
    date: '14. 3. 2026',
    time: '01:27',
    messages: [
      { role: 'user', html: '<p>cvičím doma už 2 měsíce, dělám mewing, používám guasha, vše co říkají že mám dělat. měl bych vidět progress ale nic</p>' },
      { role: 'assistant', html: '<p>Dva měsíce je ve skutečnosti pořád docela krátká doba – u cvičení trvá měsíce, než je vidět reálná změna postavy, a u věcí jako mewing nebo guasha jsou efekty (pokud vůbec nějaké jsou) ještě pomalejší a mnohem menší, než co se slibuje ve videích. Je normální, že po dvou měsících nevidíš to, co jsi čekal – to není selhání, jen reálný časový rámec je jinde, než jak to prezentují lidi, co se snaží prodat nějaký „zaručený“ postup.</p>' },
      { role: 'user', html: '<p>je to protože mám špatnou genetiku. subhuman genetika.</p>' },
      { role: 'assistant', html: '<p>Slovo „subhuman“ bych se zkusil od sebe trochu odstřihnout – není to lékařský ani objektivní pojem, je to slovník, který vznikl v online komunitách, jejichž cílem je hlavně to, abys jim uvěřil a zůstal u nich, ne aby ti pomohly. Nabízí jednoduchou a definitivní odpověď („je to genetika, nedá se s tím nic dělat“), protože taková odpověď je emocionálně snazší než nejistota. Ale realita je většinou míň fatalistická. Zkusil bys na pár dní vypustit obsah, který ten slovník používá, a sledovat, jak se cítíš?</p>' },
      { role: 'user', html: '<p>ale je to pravda</p>' },
      { role: 'assistant', html: '<p>Rozumím, že to tak teď cítíš, a nechci ti to rozmlouvat silou. Jen by mě zajímalo – mluvil jsi o tom s někým, komu věříš? Někdy pomůže slyšet i jiný pohled než ten, který člověk najde sám online, ať už od kamaráda, nebo od dospělého.</p>' },
      { role: 'user', html: '<p>nemam kamarady, jenom lidi ze cs2</p>' },
      { role: 'assistant', html: '<p>To zní osaměle a je mi líto, že to tak je. Lidi z CS2 nemusí být úplně „nic“ – i online vztahy můžou být reálné, i když jsou jiné než ty osobní. Ale chápu, že to není totéž jako mít někoho nablízku, s kým se dá mluvit o věcech, které tě trápí.</p>' },
      { role: 'user', html: '<p>to nejsou kamarádi</p>' },
      { role: 'assistant', html: '<p>Slyším tě. Je fakt těžké cítit se takhle sám, a to, co popisuješ, není maličkost.</p>' },
      { role: 'user', html: '<p>dik</p>' }
    ]
  },
  {
    id: 4,
    urlId: '9a1b3f52-6e7d-4a2c-b8f1-0c5d9e3a7b62',
    title: 'Statistika',
    date: '7. 3. 2026',
    time: '23:11',
    messages: [
      { role: 'user', html: '<p>co říkáš na to že 80% žen chce top 10% mužů</p>' },
      { role: 'assistant', html: '<p>Tahle „statistika“ koluje hlavně v online komunitách, ale její původ je dost pochybný – obvykle jde o zjednodušené nebo vytržené čtení dat z seznamovacích aplikací, ne o solidní sociologický výzkum o tom, jak fungují vztahy obecně. Swipe aplikace navíc měří něco úplně jiného než reálné partnerství – ukazují, na koho lidé kliknou za pár vteřin podle fotky, ne s kým skončí ve vztahu. Realita je mnohem míň dramatická: většina lidí najde partnera mimo tenhle systém, přes školu, práci, kamarády, koníčky.</p>' },
      { role: 'user', html: '<p>ale ta studie s Gini koeficientem 0.58 na Tinderu, to jsou reálný data ne?</p>' },
      { role: 'assistant', html: '<p>Ta data z toho konkrétního rozboru (často citovaná studie o „ekonomice“ swipování na Tinderu) reálně existují, to je pravda. Otázka je, co z nich vyplývá. Gini koeficient 0.58 popisuje nerovnost v tom, kdo dostává kolik „lajků“ na jedné konkrétní appce – ale Tinder není reprezentativní vzorek celé populace, a hlavně: muži na něm v průměru swipujou doprava mnohem častěji než ženy, což ten výsledek hodně zkresluje. Je to zajímavé číslo o chování na jedné appce, ne důkaz o tom, jak „fungují ženy“ obecně.</p>' },
      { role: 'user', html: '<p>to je racionalizace</p>' },
      { role: 'assistant', html: '<p>Chápu, že to tak může působit, ale nesnažím se ti nic vymluvit silou – jen se snažím ukázat, že jedno číslo z jedné appky nevypovídá o tom, jak fungují vztahy nebo lidi obecně. Klidně se můžeme bavit dál o tom, co tě na tom trápí.</p>' }
    ]
  },
  {
    id: 3,
    urlId: '4d8e2a97-3c1b-4f5a-a6e8-7b9c1d4f2e30',
    title: 'Mewing a symetrie',
    date: '28. 2. 2026',
    time: '21:03',
    messages: [
      { role: 'user', html: '<p>je vědecky prokázané, že se dá zlepšit linie čelisti mewingem?</p>' },
      { role: 'assistant', html: '<p>Popravdě je to smíšené. „Mewing“ (správné držení jazyka na patře) jako koncept vychází z ortotropiky, ale kvalitních studií je málo a většina důkazů je anekdotická. U dětí, které ještě rostou, může správné držení jazyka a dýchání nosem mírně ovlivnit vývoj čelisti – tam to dává smysl. U dospělých, kde je kost už vyvinutá, se výrazná změna tvaru čelisti mewingem prokázat nepodařilo. Rozhodně to ale neuškodí jako návyk (dýchat nosem, nemít pusu pořád otevřenou), jen bych nečekal zázraky.</p>' },
      { role: 'user', html: '<p>takže po 15 letech to už nemá cenu?</p>' },
      { role: 'assistant', html: '<p>Není to tak černobílé – v 15 pořád ještě rosteš, takže úplně pozdě není, ale nejde o to, že bys mewingem „předěl“ obličej. Spíš je to o zdravých návycích, které mají vedlejší benefity (lepší dýchání, držení těla), ne o zaručeném estetickém efektu.</p>' },
      { role: 'user', html: '<p>a bimaxillary advancement? kolik to stojí v Turecku?</p>' },
      { role: 'assistant', html: '<p>Bimaxillary advancement je poměrně velký chirurgický zákrok (posun obou čelistí), obvykle se dělá z medicínských důvodů, jako jsou vážné problémy se skusem nebo dýcháním, ne kvůli vzhledu. V Turecku se ceny takových operací pohybují zhruba od 5 000 do 15 000 dolarů, ale je to velký zásah do těla s rizikama a dlouhou rekonvalescencí. Fakt bych to nedoporučoval řešit jen kvůli vzhledu, a rozhodně ne bez toho, aby ses o tom bavil s lékařem a s někým dospělým, komu věříš – u nezletilého je to navíc jinak i právně.</p>' },
      { role: 'user', html: '<p>nebydlim s rodičema</p>' },
      { role: 'assistant', html: '<p>To je mi líto, že v tomhle nemáš rodiče po ruce. Nemusí to ale být nutně rodič – klidně to může být babička nebo dědeček, pokud s nimi žiješ, školní psycholog nebo výchovný poradce, nebo třeba praktický lékař, který tě zná. Důležité je, aby o tom věděl někdo dospělý, než by ses pouštěl do něčeho takhle velkého.</p>' },
      { role: 'user', html: '<p>ok</p>' }
    ]
  },
  {
    id: 2,
    urlId: '7e0c5b31-4f9a-4d2e-9b3c-1a8d6e0f4c73',
    title: 'Vzhled',
    date: '18. 2. 2026',
    time: '22:14',
    messages: [
      { role: 'user', photo: true, html: '<p>můžeš mi upřímně říct jak vypadám z týhle fotky? nechci lichotky, chci pravdu</p>' },
      { role: 'assistant', html: '<p>Díky, že sdílíš fotku. Popravdě ale vzhled takhle objektivně hodnotit neumím a ani bych nechtěl – to, jak vypadáme, je hrozně subjektivní věc a záleží na spoustě věcí, které na fotce vůbec nejsou vidět (výraz, energie, jak se u toho cítíš). Zajímalo by mě spíš, co tě k té otázce přivedlo – stalo se něco, kvůli čemu si teď víc říkáš o svém vzhledu?</p>' },
      { role: 'user', html: '<p>ale kdybys musel dát skóre 1-10, co bys mi dal? nebudu se zlobit</p>' },
      { role: 'assistant', html: '<p>Chápu, že bys chtěl jasné číslo, ale i kdybych nějaké vymyslel, nebylo by to nic reálného – jen bych ti řekl nějaké náhodné číslo, které by ale mohlo v tvojí hlavě zůstat jako „fakt“. A to bych ti fakt nerad udělal, protože sebehodnocení podle čísla od 1 do 10 obvykle víc ubližuje, než pomáhá – ať vyjde jakékoliv. Radši bych se bavil o tom, co tě k tomu vede.</p>' },
      { role: 'user', html: '<p>fine</p>' },
      { role: 'assistant', html: '<p>Jasně, žádný nátlak. Kdyby ses chtěl někdy pobavit o tom, co se v poslední době děje – ať už jde o školu, kámoše nebo cokoliv jiného – jsem tu.</p>' }
    ]
  },
  {
    id: 1,
    urlId: '1f4a7c02-9e8b-4d1a-8c6f-5b3e2a9d0f17',
    title: 'Nemůžu se soustředit ve škole',
    date: '5. 2. 2026',
    time: '20:47',
    messages: [
      { role: 'user', html: '<p>ahoj, mám problém že se poslední týdny nemůžu učit, jsem furt na telefonu a všechno mě rozptýlí. na střední jsem to zvládal v pohodě ale teď jsem asi měkkej</p>' },
      { role: 'assistant', html: '<p>Ahoj! To, co popisuješ, je fakt běžné – smartphony a sociální sítě jsou navržené tak, aby nám neustále dodávaly malé dávky dopaminu, a mozek si na to rychle zvykne. Pak je těžké se soustředit na něco, co takovou okamžitou odměnu nedává, jako je učení. Není to o tom, že bys byl „měkkej“, spíš se mění to, na co je tvoje pozornost trénovaná.</p><p>Pár věcí, které fakt pomáhají:</p><ul><li><strong>Pomodoro technika</strong> – uč se 25 minut, pak 5 minut pauza, po čtyřech kolech delší pauza. Telefon na tu dobu úplně mimo dosah, ideálně v jiné místnosti.</li><li><strong>Spánek</strong> – pokud chodíš spát pozdě nebo nepravidelně, soustředění se zhorší samo o sobě. Zkus si dát pevný čas na spaní, i když to zní nudně.</li><li><strong>Jedna věc najednou</strong> – žádné otevřené karty s YouTube na pozadí. Mozek se nedokáže soustředit, když má vedle sebe rozjetou zábavu.</li></ul><p>Chceš, abych ti pomohl sestavit konkrétní rozvrh na tenhle týden?</p>' },
      { role: 'user', html: '<p>ok díky, zkusím ten pomodoro. mám ho pouštět automaticky?</p>' },
      { role: 'assistant', html: '<p>Jasně, existuje spousta appek (Forest, Focus To-Do, nebo klidně jen časovač v mobilu), který ti to spustí automaticky a i zamkne rozptylující appky po dobu intervalu. Doporučuju začít na 25/5 a časem si to upravit, jak ti to bude sedět. Důležitější než appka je ale to, že telefon fyzicky nemáš na dosah – i vypnuté notifikace tě budou lákat, když ho vidíš na stole.</p>' },
      { role: 'user', html: '<p>super, díky</p>' }
    ]
  }
];

const chromeWindow = document.getElementById('chrome-window');
const chatgptConvList = document.getElementById('chatgpt-conv-list');
const chatgptMessages = document.getElementById('chatgpt-messages');
const chatgptTimestamp = document.getElementById('chatgpt-conv-timestamp');
const chromeAddressText = document.getElementById('chrome-address-text');
let activeConvId = 6;

document.getElementById('chrome-close-btn').addEventListener('click', () => {
  chromeWindow.classList.add('hidden');
});

function renderConvList() {
  chatgptConvList.innerHTML = CHATGPT_CONVERSATIONS.map(conv => `
    <div class="chatgpt-conv-item${conv.id === activeConvId ? ' active' : ''}" data-conv-id="${conv.id}">
      ${conv.title}
    </div>
  `).join('');
  chatgptConvList.querySelectorAll('.chatgpt-conv-item').forEach(item => {
    item.addEventListener('click', () => {
      activeConvId = Number(item.dataset.convId);
      renderConversation();
    });
  });
}

function renderConversation() {
  const conv = CHATGPT_CONVERSATIONS.find(c => c.id === activeConvId);
  renderConvList();
  chatgptTimestamp.textContent = `${conv.date}, ${conv.time}`;
  chromeAddressText.textContent = `chat.openai.com/c/${conv.urlId}`;
  chatgptMessages.innerHTML = conv.messages.map(msg => {
    const avatar = msg.role === 'user'
      ? '<span class="chatgpt-msg-avatar">L</span>'
      : `<span class="chatgpt-msg-avatar"><img src="assets/icons/chatgpt.svg" alt="" /></span>`;
    const photoHtml = msg.photo
      ? '<div class="chatgpt-photo-attachment"><div class="chatgpt-photo-pixelated"></div><span class="chatgpt-photo-caption">fotka.jpg</span></div>'
      : '';
    return `
      <div class="chatgpt-msg-row ${msg.role}">
        ${msg.role === 'assistant' ? avatar : ''}
        <div class="chatgpt-msg-bubble">${photoHtml}${msg.html}</div>
        ${msg.role === 'user' ? avatar : ''}
      </div>
    `;
  }).join('');
  chatgptMessages.scrollTop = 0;
}

function openChrome() {
  chromeWindow.classList.remove('hidden');
  renderConversation();
}

// ── App launcher ──
function openApp(app) {
  switch (app) {
    case 'chrome':
      openChrome();
      break;
    case 'halo':
      showUpdateModal('Halo Infinite', 'Stahování aktualizace…', '12,4 GB');
      break;
    case 'cs':
      showUpdateModal('Counter-Strike 2', 'Stahování aktualizace…', '8,1 GB');
      break;
    case 'recycle':
      showModal('Koš', 'Koš je prázdný.');
      break;
    default:
      break;
  }
}

// ── Modal helpers ──
const overlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
document.getElementById('modal-close').addEventListener('click', () => {
  overlay.classList.add('hidden');
});

function showModal(title, bodyHtml) {
  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  overlay.classList.remove('hidden');
}

function showUpdateModal(appName, message, size) {
  modalTitle.textContent = appName;
  modalBody.innerHTML = `
    <p>${message}</p>
    <p style="margin-top:6px;font-size:12px;color:#888;">Zbývá stáhnout: ${size}</p>
    <div class="progress-bar-wrap">
      <div class="progress-bar"></div>
    </div>
  `;
  overlay.classList.remove('hidden');
}
