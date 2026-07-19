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
    { time: '22:00', title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
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
    { time: '01:50', title: 'operace čelisti Turecko - recenze - YouTube', url: 'youtube.com/watch?v=op049' },
    { time: '01:15', title: 'bimax turecko klinika cena - Hledat Googlem', url: 'google.com/search?q=bimax+turecko+klinika+cena' },
    { time: '00:40', title: 'facerate.io/upload', url: 'facerate.io/upload' }
  ]},
  { date: '12. 3. 2026', items: [
    { time: '01:15', title: 'The Enigma of Amygdala: why looks matter - YouTube', url: 'youtube.com/watch?v=ea048' },
    { time: '00:50', title: 'operace čelisti Turecko cena - Hledat Googlem', url: 'google.com/search?q=operace+celisti+turecko+cena' },
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
    { time: '18:20', title: 'Bosley Bones: how to fix mid face - YouTube', url: 'youtube.com/watch?v=bb034' },
    { time: '17:44', title: 'bimaxillary advancement cena - Hledat Googlem', url: 'google.com/search?q=bimaxillary+advancement+cena' }
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
    { time: '20:33', title: 'jak si zvýšit sebevědomí - Hledat Googlem', url: 'google.com/search?q=jak+si+zvysit+sebevedomi' }
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
  ]}
];

// ── Bookmarks bar ──
const BOOKMARKS_BAR = [
  { name: 'Škola', items: [
    { title: 'Rozvrh hodin – Moodle', url: 'moodle.skola.cz/rozvrh' },
    { title: 'Google Classroom – 1.A', url: 'classroom.google.com' }
  ]},
  { name: 'Home Gym', items: [
    { title: 'Kalisthenika pro začátečníky – plán', url: 'homegym-plan.cz/kalisthenika' },
    { title: 'Street workout progression guide', url: 'streetworkout.cz/progression' },
    { title: 'Domácí posilovna bez vybavení', url: 'fitness-doma.cz/bez-vybaveni' }
  ]},
  { name: 'Grind', items: [
    { title: 'Ranní rutina 5 AM', url: 'grindmindset.cz/ranni-rutina' },
    { title: 'The Real World — landing page', url: 'jointherealworld.com' },
    { title: 'High Value Man checklist', url: 'highvaluemale.co/checklist' }
  ]},
  { name: '_M', items: [
    { title: 'facerate.io', url: 'facerate.io' },
    { title: 'looksmaxx-tips.com', url: 'looksmaxx-tips.com' },
    { title: 'chadrating.co', url: 'chadrating.co' },
    { title: 'looksmax.org', url: 'looksmax.org' },
    { title: 'reddit.com/r/orthotropics', url: 'reddit.com/r/orthotropics' },
    { title: 'reddit.com/r/looksmax', url: 'reddit.com/r/looksmax' }
  ]}
];

// ── Tabs ──
function makeInitialTabs() {
  return [
    { id: 'chatgpt', type: 'chatgpt', title: 'ChatGPT', url: 'chat.openai.com/c/6f2a91d0-8b3e-4c1a-9f2d-3a7e5c0b1d44', favicon: 'assets/icons/chatgpt.svg' },
    { id: 'facerate', type: 'blank', title: 'facerate.io', url: 'facerate.io/upload', favicon: 'assets/icons/fav-globe.svg' },
    { id: 'youtube', type: 'blank', title: "why 6'0 is the new 5'8 - YouTube", url: 'youtube.com/watch?v=w6057', favicon: 'assets/icons/fav-youtube.svg' },
    { id: 'duolingo', type: 'blank', title: 'Duolingo', url: 'duolingo.com/learn', favicon: 'assets/icons/fav-duolingo.svg' },
    { id: 'google-search', type: 'blank', title: 'vlak plzeň hlavní praha víkend - Hledat Googlem', url: 'google.com/search?q=vlak+plzen+hlavni+praha+vikend', favicon: 'assets/icons/fav-google.svg' },
    { id: 'gmail', type: 'blank', title: 'Doručená pošta – Gmail', url: 'mail.google.com/mail/u/0/#inbox', favicon: 'assets/icons/fav-gmail.svg' }
  ];
}

function faviconForUrl(url) {
  if (url.startsWith('chat.openai.com')) return 'assets/icons/chatgpt.svg';
  if (url.startsWith('mail.google.com')) return 'assets/icons/fav-gmail.svg';
  if (url.startsWith('google.com')) return 'assets/icons/fav-google.svg';
  if (url.startsWith('youtube.com')) return 'assets/icons/fav-youtube.svg';
  if (url.startsWith('reddit.com')) return 'assets/icons/fav-reddit.svg';
  if (url.startsWith('duolingo.com')) return 'assets/icons/fav-duolingo.svg';
  return 'assets/icons/fav-globe.svg';
}

const chromeWindow = document.getElementById('chrome-window');
const chromeTabbar = document.getElementById('chrome-tabbar');
const chromeBookmarksBar = document.getElementById('chrome-bookmarks-bar');
const chromePage = document.getElementById('chrome-page');
const chromeAddressText = document.getElementById('chrome-address-text');
const chromeStatusbar = document.getElementById('chrome-statusbar');
const chromeMenuBtn = document.getElementById('chrome-menu-btn');
const chromeMenuDropdown = document.getElementById('chrome-menu-dropdown');

let TABS = makeInitialTabs();
let activeTabId = 'chatgpt';
let activeConvId = 6;

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
  chromeAddressText.textContent = tab.type === 'history' ? 'chrome://history' : tab.url;
}

function selectTab(id) {
  activeTabId = id;
  renderTabbar();
  updateAddressBar();
  renderActivePage();
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

function renderBookmarksBar() {
  chromeBookmarksBar.innerHTML = BOOKMARKS_BAR.map(folder => `
    <div class="chrome-bookmark-folder">
      <svg class="chrome-bookmark-folder-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M10 4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/></svg>
      <span>${folder.name}</span>
    </div>
  `).join('');
  const nodes = chromeBookmarksBar.querySelectorAll('.chrome-bookmark-folder');
  nodes.forEach((node, i) => {
    node.addEventListener('click', e => {
      e.stopPropagation();
      toggleBookmarkDropdown(i, node);
    });
  });
}

function toggleBookmarkDropdown(idx, folderEl) {
  const existing = chromeBookmarksBar.querySelector('.chrome-bookmark-dropdown');
  const wasOpenForThis = folderEl.classList.contains('open');
  if (existing) existing.remove();
  chromeBookmarksBar.querySelectorAll('.chrome-bookmark-folder').forEach(f => f.classList.remove('open'));
  if (wasOpenForThis) return;

  const folder = BOOKMARKS_BAR[idx];
  const dropdown = document.createElement('div');
  dropdown.className = 'chrome-bookmark-dropdown';
  dropdown.style.left = folderEl.offsetLeft + 'px';
  dropdown.innerHTML = folder.items.map(item => `
    <div class="chrome-bookmark-item">
      <img src="${faviconForUrl(item.url)}" alt="" />
      <span>${item.title}</span>
    </div>
  `).join('');
  chromeBookmarksBar.appendChild(dropdown);
  folderEl.classList.add('open');

  const itemNodes = dropdown.querySelectorAll('.chrome-bookmark-item');
  itemNodes.forEach((node, i) => {
    const item = folder.items[i];
    node.addEventListener('click', () => {
      navigateActiveTab(item.title, item.url);
      dropdown.remove();
      folderEl.classList.remove('open');
    });
  });
  attachHoverPreview(itemNodes, i => folder.items[i].url);
}

document.addEventListener('click', () => {
  const dropdown = chromeBookmarksBar && chromeBookmarksBar.querySelector('.chrome-bookmark-dropdown');
  if (dropdown) {
    dropdown.remove();
    chromeBookmarksBar.querySelectorAll('.chrome-bookmark-folder').forEach(f => f.classList.remove('open'));
  }
});

function navigateActiveTab(title, url) {
  const tab = TABS.find(t => t.id === activeTabId);
  if (!tab) return;
  tab.type = 'blank';
  tab.title = title;
  tab.url = url;
  tab.favicon = faviconForUrl(url);
  renderTabbar();
  updateAddressBar();
  renderActivePage();
}

function openHistory() {
  let tab = TABS.find(t => t.id === 'history');
  if (!tab) {
    tab = { id: 'history', type: 'history', title: 'Historie', url: 'chrome://history', favicon: 'assets/icons/fav-history.svg' };
    TABS.push(tab);
  } else {
    tab.type = 'history';
    tab.title = 'Historie';
    tab.url = 'chrome://history';
    tab.favicon = 'assets/icons/fav-history.svg';
  }
  activeTabId = 'history';
  renderTabbar();
  updateAddressBar();
  renderActivePage();
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
          </div>
        </div>
      </aside>
      <main class="chatgpt-main">
        <div class="chatgpt-main-header">
          <span class="chatgpt-model-name">ChatGPT</span>
          <span class="chatgpt-conv-timestamp" id="chatgpt-conv-timestamp"></span>
        </div>
        <div class="chatgpt-messages" id="chatgpt-messages"></div>
      </main>
    </div>
  `;
}

function renderConvList() {
  const list = document.getElementById('chatgpt-conv-list');
  list.innerHTML = CHATGPT_CONVERSATIONS.map(conv => `
    <div class="chatgpt-conv-item${conv.id === activeConvId ? ' active' : ''}">
      ${conv.title}
    </div>
  `).join('');
  const nodes = list.querySelectorAll('.chatgpt-conv-item');
  nodes.forEach((node, i) => {
    node.addEventListener('click', () => {
      activeConvId = CHATGPT_CONVERSATIONS[i].id;
      renderConversation();
    });
  });
}

function renderConversation() {
  const conv = CHATGPT_CONVERSATIONS.find(c => c.id === activeConvId);
  renderConvList();
  document.getElementById('chatgpt-conv-timestamp').textContent = `${conv.date}, ${conv.time}`;

  const chatgptTab = TABS.find(t => t.id === 'chatgpt');
  chatgptTab.url = `chat.openai.com/c/${conv.urlId}`;
  if (activeTabId === 'chatgpt') updateAddressBar();

  const messages = document.getElementById('chatgpt-messages');
  messages.innerHTML = conv.messages.map(msg => {
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
  messages.scrollTop = 0;
}

function renderActivePage() {
  const tab = TABS.find(t => t.id === activeTabId);
  if (!tab) return;
  if (tab.type === 'chatgpt') {
    chromePage.innerHTML = buildChatGptAppHTML();
    renderConversation();
  } else if (tab.type === 'history') {
    chromePage.innerHTML = buildHistoryPageHTML();
    attachHistoryHandlers();
  } else {
    chromePage.innerHTML = buildErrorPageHTML(tab.url);
  }
}

function openChrome() {
  chromeWindow.classList.remove('hidden');
  TABS = makeInitialTabs();
  activeTabId = 'chatgpt';
  activeConvId = 6;
  renderTabbar();
  renderBookmarksBar();
  updateAddressBar();
  renderActivePage();
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
