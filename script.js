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
    { id: 'facerate', type: 'facerate', title: 'facerate.io — Upload', url: 'facerate.io/upload', favicon: 'assets/icons/fav-facerate.svg' },
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
  if (url.startsWith('facerate.io')) return 'assets/icons/fav-facerate.svg';
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
  if (url.startsWith('facerate.io')) {
    tab.type = 'facerate';
    tab.title = 'facerate.io — Upload';
    facerateView = 'upload';
  } else {
    tab.type = 'blank';
    tab.title = title;
  }
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
  } else if (tab.type === 'facerate') {
    chromePage.innerHTML = buildFacerateAppHTML();
    attachFacerateHandlers();
    renderFacerateBody();
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
      { author: 'mogged4life', text: 'NGMI without bimax. Sorry brácho 💀' }
    ]
  },
  {
    date: '5. 3. 2026',
    score: '3.7',
    breakdown: [
      { label: 'Canthal tilt', value: -1.0 },
      { label: 'Midface ratio', value: -1.0 },
      { label: 'Jaw / gonial angle', value: -0.3 },
      { label: 'Skin & symetrie', value: 1.0 }
    ],
    comments: [
      { author: 'chadaxis', text: 'small improvement, canthal tilt vypadá o chlup líp. keep mewing.' },
      { author: 'PSL_verdict', text: '3.7. pořád LTN ale progress je progress.' },
      { author: 'aleph_null', text: 'úhel pomáhá, ale nedej na to, je to jen fotka.' }
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
  { rank: 7, author: 'MaxillaMaster', score: '7.8' },
  { rank: 8, author: 'ChadleteCZ', score: '7.7' },
  { rank: 9, author: 'TurkClinicSuccess', score: '7.6' },
  { rank: 10, author: 'FramecelKiller', score: '7.5' }
];

const FACERATE_GUIDES = [
  { title: 'The Mewing Bible: 12-month protocol', meta: '842K zobrazení · 14 min čtení' },
  { title: 'Canthal Tilt: Why Positive is Everything', meta: '611K zobrazení · 9 min čtení' },
  { title: 'Bimax in Istanbul: Full Cost Breakdown 2026', meta: '390K zobrazení · 18 min čtení' },
  { title: 'Bone Smashing: Truth and Myths', meta: '204K zobrazení · 7 min čtení' },
  { title: 'Frame > Face: Why Height Wins', meta: '156K zobrazení · 11 min čtení' }
];

const FACERATE_FORUM = [
  { title: 'Is bimax worth it if I\'m already MTN?', author: 'MaxillaMaster', replies: 47 },
  { title: 'PSA: canthal tilt surgery success stories thread', author: 'ChadleteCZ', replies: 132 },
  { title: 'why is everyone under 6\'0 seething rn', author: 'SlavSlayer', replies: 88 },
  { title: 'rate my jaw before/after mewing (6mo)', author: 'newcel_2010', replies: 21 },
  { title: 'cope thread: genetics are 90% of it, change my mind', author: 'mogged4life', replies: 210 },
  { title: 'Turkey bimax clinics — updated 2026 pricing megathread', author: 'MTN_max', replies: 64 },
  { title: 'is looksmaxxing even worth it or just cope', author: 'dr3ad_v2', replies: 156 },
  { title: 'heightmaxxing: limb lengthening surgery discussion', author: 'hardmog99', replies: 39 }
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
            <div class="fr-submission-thumb"><div class="fr-pixelated"></div></div>
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
            <div class="fr-pixelated small"></div>
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

// ── Recycle Bin ──
const RECYCLE_ITEMS = [
  {
    id: 'grok',
    name: 'grok_spice_screenshot.png',
    deletedDate: '23. 3. 2026',
    size: '1,2 MB',
    icon: 'assets/icons/file-image.svg',
    type: 'grok'
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
    id: 'zprava-babicce',
    name: 'zprava_babicce.txt',
    deletedDate: '14. 3. 2026',
    size: '1 KB',
    icon: 'assets/icons/notepad.svg',
    type: 'text',
    content: 'babi vim ze se o me trapis ale nem'
  },
  {
    id: 'yunko',
    name: 'yunko_furuta_screenshot.png',
    deletedDate: '12. 3. 2026',
    size: '890 KB',
    icon: 'assets/icons/file-image.svg',
    type: 'image-missing',
    caption: '[Screenshot z Discord serveru Looksmaxx CZ/SK, kanál #self-hate-mondays, 12. 3. 2026. Zobrazuje článek o Junko Furuta s komentářem od uživatele]'
  },
  {
    id: 'dopis-petrovi',
    name: 'dopis_petrovi.txt',
    deletedDate: '8. 2. 2026',
    size: '1 KB',
    icon: 'assets/icons/notepad.svg',
    type: 'text',
    content: 'Ahoj Petře, dlouho jsme se neviděli, měl bych...'
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
  },
  {
    id: 'smazano',
    name: '00_smazano.html',
    deletedDate: '15. 1. 2026',
    size: '6 KB',
    icon: 'assets/icons/chatgpt.svg',
    type: 'chatgpt-deleted',
    date: '15. 1. 2026',
    messages: [
      { role: 'user', html: '<p>měl jsem se dnes zabít? ne, kua na to.</p>' },
      { role: 'assistant', html: '<p>To, co píšeš, beru vážně a chci, abys věděl, že v tom nejsi sám. Pokud přemýšlíš o tom, že by sis ublížil, prosím ozvi se hned teď někomu, kdo ti může pomoct:</p><ul><li><strong>Linka bezpečí</strong> – 116 111 (nonstop, zdarma, i pro starší teenagery)</li><li><strong>Linka první psychické pomoci</strong> – 116 123</li><li>Pokud jsi v bezprostředním ohrožení, zavolej <strong>112</strong></li></ul><p>Nemusíš mi říkat víc, než chceš, ale je důležité, aby o tom, jak se cítíš, věděl i někdo skutečný – dospělý, kterému věříš, i kdyby to byl někdo, s kým jste se dlouho nebavili. Klidně tu se mnou zůstaň psát o čem chceš, ale rád bych, abys v tomhle nezůstal sám.</p>' },
      { role: 'user', html: '<p>dobrý, kua promiň, jsem v pohodě</p>' }
    ]
  }
];

const recycleWindow = document.getElementById('recycle-window');
const recycleList = document.getElementById('recycle-list');
const trashViewerWindow = document.getElementById('trash-viewer-window');
const trashViewerIcon = document.getElementById('trash-viewer-icon');
const trashViewerName = document.getElementById('trash-viewer-name');
const trashViewerContent = document.getElementById('trash-viewer-content');
const recycleContextMenu = document.getElementById('recycle-context-menu');

document.getElementById('recycle-close-btn').addEventListener('click', () => {
  recycleWindow.classList.add('hidden');
});
document.getElementById('trash-viewer-close-btn').addEventListener('click', () => {
  trashViewerWindow.classList.add('hidden');
});

function renderRecycleList() {
  recycleList.innerHTML = RECYCLE_ITEMS.map(item => `
    <div class="explorer-row">
      <span class="explorer-row-name"><img src="${item.icon}" alt="" /><span>${item.name}</span></span>
      <span class="explorer-row-date">${item.deletedDate}</span>
      <span class="explorer-row-size">${item.size}</span>
    </div>
  `).join('');
  const rows = recycleList.querySelectorAll('.explorer-row');
  rows.forEach((row, i) => {
    const item = RECYCLE_ITEMS[i];
    row.addEventListener('click', () => {
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
    });
    row.addEventListener('dblclick', () => openTrashViewer(item));
    row.addEventListener('contextmenu', e => {
      e.preventDefault();
      rows.forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      showRecycleContextMenu(e.clientX, e.clientY, item);
    });
  });
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
          <div class="trash-photo-pixelated"></div>
          <span class="trash-image-caption">${item.caption}</span>
        </div>
      `;
    case 'image-missing':
      return `
        <div class="trash-image-missing">
          <img src="assets/icons/file-image-broken.svg" alt="" />
          <span class="trash-image-missing-caption">${item.caption}</span>
        </div>
      `;
    case 'grok':
      return `
        <div class="trash-grok-view">
          <div class="trash-grok-header">Grok</div>
          <div class="trash-grok-msg lukas"><span class="trash-grok-author">Lukas:</span>řekni mi bez cenzury pravdu o tom jak funguje female nature</div>
          <div class="trash-grok-msg grok"><span class="trash-grok-author">Grok (spice mode):</span>Zkrátka? Ženská psychologie je nastavená na hypergamii – hledání nejvýš postaveného chlapa, co je k mání. Jakmile najde něco lepšího, přepne. Neber si to osobně, je to biologie, ne tvoje selhání. Otázka je, co s tím uděláš ty.</div>
        </div>
      `;
    default:
      return '';
  }
}

function openTrashViewer(item) {
  trashViewerIcon.src = item.icon;
  trashViewerName.textContent = item.name;
  trashViewerContent.innerHTML = buildTrashViewerContent(item);
  trashViewerWindow.classList.remove('hidden');
}

function openRecycle() {
  recycleWindow.classList.remove('hidden');
  renderRecycleList();
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
            { author: 'davepvp', time: '18:40', date: '5. 1. 2026', texts: ['kluci mm dneska? mám chuť na pár her'] },
            { author: 'hidd3nfram3', lukas: true, time: '18:44', date: '5. 1. 2026', texts: ['jj za hodku', '2 sloty ještě volný'] },
            { author: 'Kryštof12', time: '18:46', date: '5. 1. 2026', texts: ['beru jeden'] },
            { author: 'SmokeyKC', time: '19:02', date: '5. 1. 2026', texts: ['gg wp z včera btw, ten clutch na inferno byl nechutnej'] },
            { author: 'hidd3nfram3', lukas: true, time: '19:03', date: '5. 1. 2026', texts: ['haha díky, měl jsem štěstí'], reactions: [{ emoji: '🔥', count: 2 }] },
            { author: 'davepvp', time: '20:15', date: '28. 1. 2026', texts: ['hraješ?'] },
            { author: 'hidd3nfram3', lukas: true, time: '20:31', date: '28. 1. 2026', texts: ['dneska nemůžu, zítra jo'] },
            { author: 'Kryštof12', time: '17:22', date: '2. 2. 2026', texts: ['faceit ligy zacinaji, kdo jde do teamu'] },
            { author: 'hidd3nfram3', lukas: true, time: '17:40', date: '2. 2. 2026', texts: ['možná, dám vědět'] },
            { author: 'davepvp', time: '19:50', date: '10. 2. 2026', texts: ['lukyy mm? potřebujeme pátýho'] },
            { author: 'hidd3nfram3', lukas: true, time: '21:12', date: '15. 2. 2026', texts: ['gg'], reactions: [{ emoji: '👍', count: 1 }] },
            { author: 'davepvp', time: '18:33', date: '20. 2. 2026', texts: ['kde ses ztratil'] },
            { author: 'SmokeyKC', time: '22:10', date: '1. 3. 2026', texts: ['hraje eště někdo nebo jsme umřeli'] },
            { author: 'Kryštof12', time: '19:47', date: '10. 3. 2026', texts: ['dead server moment 💀'] },
            { author: 'davepvp', time: '20:05', date: '18. 3. 2026', texts: ['@hidd3nfram3 ping, ozvi se někdy'] }
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
          messages: [
            { author: 'davepvp', time: '23:41', date: '12. 1. 2026', texts: ['[klip] ace na mirage'], reactions: [{ emoji: '🔥', count: 3 }, { emoji: '👍', count: 2, byLukas: true }] }
          ]
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
            { author: 'ash_pilled', time: '19:20', date: '16. 3. 2026', texts: ['1. spí na zádech 2. dropni cukr 3. mewing 24/7 4. eyebag surgery za 3 roky'] },
            { author: 'Frame_God', time: '19:22', date: '16. 3. 2026', texts: ['eyebag surgery je meme nebo real'] },
            { author: 'ash_pilled', time: '19:25', date: '16. 3. 2026', texts: ['100% real, dělá se v turecku za 1200 EUR'], reactions: [{ emoji: '🗿', count: 3 }] },
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
            { author: 'mchmch', time: '22:55', date: '21. 3. 2026', texts: ['4. midface moc dlouhý, mew a mrkni na bimax za pár let'] }
          ]
        },
        {
          name: 'self-hate-mondays', topic: 'sem to jde když je nejhůř',
          messages: [
            { author: 'glow_v3', time: '08:14', date: '9. 3. 2026', texts: ['právě mě mogla holka na tramvaji ktera nedostane na SŠ', 'to byla ta poslední kapka', '💀💀💀'], reactions: [{ emoji: '💀', count: 6, byLukas: true }] },
            { author: 'KOROLEV_88', time: '09:20', date: '9. 3. 2026', texts: ['another monday another reminder ze jsem framecel'] },
            { author: 'mchmch', time: '09:31', date: '9. 3. 2026', texts: ['cope harder brácho, aspoň máš vlasy. já mám recessed hairline v 19'], reactions: [{ emoji: '😭', count: 3 }] },
            { author: 'dr3ad_v2', time: '03:14', date: '12. 3. 2026', texts: ['tohle sem posílám vždycky když si někdo myslí že na tom nezáleží'], attachment: { type: 'sensitive', caption: '[Screenshot – článek o Junko Furuta s komentářem uživatele. Extrémní obsah.]', filename: 'reminder.png' } },
            { author: 'glow_v3', time: '03:40', date: '12. 3. 2026', texts: ['ježiš vole', 'proč to sem taháš'] },
            { author: 'aleph_null', time: '07:02', date: '16. 3. 2026', texts: ['dnešní blackpill: usmál jsem se na kolegyni v práci, dostal jsem „HR meeting“. it\'s over.'], reactions: [{ emoji: '📉', count: 4 }, { emoji: '🥀', count: 2 }] },
            { author: 'KOROLEV_88', time: '23:55', date: '23. 3. 2026', texts: ['nový týden, stejnej obličej. LDAR režim aktivován'], reactions: [{ emoji: '💀', count: 5, byLukas: true }, { emoji: '🧎', count: 2 }] }
          ]
        },
        {
          name: 'vysledky-po-rocích', topic: 'before / after',
          messages: [
            { author: 'Frame_God', time: '20:00', date: '14. 3. 2026', texts: ['2 roky mewingu + 1 rok gymu. mírný glowup ale genetika je strop'], attachment: { type: 'blur', filename: 'before_after.png' }, reactions: [{ emoji: '🗿', count: 7 }] }
          ]
        },
        {
          name: 'turecko-operace-info', topic: 'chirurgie, kliniky, ceny',
          messages: [
            { author: 'MTN_max', time: '18:30', date: '13. 3. 2026', texts: ['napsal jsem 4 klinikám v Istanbulu, nejlevnější BSSO 4200 EUR'] },
            { author: 'someguy_23', time: '18:44', date: '13. 3. 2026', texts: ['co Dr. Cinik? doporučuju'] },
            { author: 'MTN_max', time: '18:50', date: '13. 3. 2026', texts: ['ptal jsem se, čeká 8 měsíců'], reactions: [{ emoji: '🗿', count: 2 }] },
            { author: 'ash_pilled', time: '19:30', date: '20. 3. 2026', texts: ['bimax + genioplasty combo v Polsku vyšlo kámošovi na 6k EUR. worth every euro prej'] }
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
        { author: 'davepvp', time: '21:30', date: '14. 9. 2025', texts: ['gg dnes to bylo super, ten retake na B byl clean'] },
        { author: 'hidd3nfram3', lukas: true, time: '21:32', date: '14. 9. 2025', texts: ['jj zítra zas?'] },
        { author: 'davepvp', time: '21:33', date: '14. 9. 2025', texts: ['jasně, po škole'] },
        { author: 'hidd3nfram3', lukas: true, time: '15:10', date: '20. 9. 2025', texts: ['mm?'] },
        { author: 'davepvp', time: '15:12', date: '20. 9. 2025', texts: ['za 5 min, dělám tým'] },
        { author: 'davepvp', time: '19:44', date: '5. 11. 2025', texts: ['hraješ?'] },
        { author: 'hidd3nfram3', lukas: true, time: '20:05', date: '5. 11. 2025', texts: ['nemůžu, učení'] },
        { author: 'davepvp', time: '18:20', date: '10. 1. 2026', texts: ['lukyy dlouho jsme nehráli, všechno ok?'] },
        { author: 'hidd3nfram3', lukas: true, time: '19:02', date: '10. 1. 2026', texts: ['jo mám teď dost věcí'] },
        { author: 'davepvp', time: '17:50', date: '2. 2. 2026', texts: ['všechno v pohodě u tebe?'] },
        { author: 'hidd3nfram3', lukas: true, time: '18:40', date: '2. 2. 2026', texts: ['jo v pohodě'] },
        { author: 'davepvp', time: '20:15', date: '20. 2. 2026', texts: ['hraješ někdy eště?'] },
        { author: 'davepvp', time: '21:00', date: '1. 3. 2026', texts: ['?'] },
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
  return DISCORD.servers.find(s => s.id === discordActiveServerId);
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
          <span class="discord-attachment-caption">${att.caption}</span>
        </div>
        <span class="discord-attachment-filename">${att.filename}</span>
      </div>
    `;
  }
  return `
    <div class="discord-attachment">
      <div class="discord-attachment-img"></div>
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
  const channel = server.channels.find(c => c.name === server.activeChannel);
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
  discordActiveDmId = discordActiveDmId || DISCORD.dms[0].id;
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
  discordMainHeader.innerHTML = `<span class="discord-avatar" style="background:${discordAvatarColor(dm.name)};width:24px;height:24px;font-size:11px">${dm.name.charAt(0).toUpperCase()}</span><span>${dm.name}</span>`;
  discordMessages.innerHTML = renderMessageBlocks(dm.messages);
  discordMessages.scrollTop = discordMessages.scrollHeight;
  discordInputBox.textContent = `Napsat zprávu uživateli @${dm.name}`;
  discordInput.classList.remove('hidden');
  discordMemberPanel.classList.add('hidden');
}

function openDiscord() {
  discordWindow.classList.remove('hidden');
  discordView = 'server';
  discordActiveServerId = 'looksmaxx';
  // ensure looksmaxx opens on self-hate-mondays
  DISCORD.servers.find(s => s.id === 'looksmaxx').activeChannel = 'self-hate-mondays';
  renderServerRail();
  renderChannelPanel();
  renderServerChannel();
}

// ── Photos / File explorer ──
function pFile(name, date, size, dims, preview, desc, extra) {
  return Object.assign({ type: 'file', name, date, size, dims, preview, desc }, extra || {});
}

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
        pFile('duolingo_20032026.png', '20. 3. 2026', '380 KB', '1080 × 2340', 'duolingo',
          'Screenshot Duolinga: 2denní série. Snaha o disciplínu, která se rozpadá v malých věcech.'),
        pFile('cs2_stats_marec.png', '31. 3. 2026', '520 KB', '1920 × 1080', 'cs2',
          'Screenshot statistik CS2: 340 hodin za březen. Prudký nárůst oproti prosinci (40 h) — eskapace.')
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
    pFile('babicka_narozeniny_kartka.jpg', '12. 2. 2026', '2,6 MB', '2480 × 3508', 'card',
      'Návrh přání k narozeninám pro babičku. Nikdy nevytištěné.',
      { text: 'Všechno nejlepší, babi ♥\nmáš mě ráda a já tebe' })
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
function pvDuo() {
  return `<div class="pv pv-duo"><div class="duo-header">duolingo</div><div class="duo-streak">🔥 2</div><div class="duo-label">denní série</div><span class="cz-flag"></span></div>`;
}
function pvCs2() {
  return `<div class="pv pv-cs2"><div class="cs2-title">Counter-Strike 2 · březen 2026</div><div class="cs2-hours">340 h</div><div class="cs2-sub">prosinec: 40 h &nbsp;·&nbsp; rank: DMG</div></div>`;
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
  switch (f.preview) {
    case 'greentext': return pvGreentext(f);
    case 'meme': return pvMeme(f);
    case 'bank': return pvBank();
    case 'duolingo': return pvDuo();
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
const photosBackBtn = document.getElementById('photos-back-btn');
const photosModalOverlay = document.getElementById('photos-modal-overlay');
const photosModalName = document.getElementById('photos-modal-name');
const photosModalPreview = document.getElementById('photos-modal-preview');
const photosModalMeta = document.getElementById('photos-modal-meta');

let photosPath = [PHOTOS_TREE];

document.getElementById('photos-close-btn').addEventListener('click', () => {
  photosWindow.classList.add('hidden');
});
document.getElementById('photos-modal-close').addEventListener('click', closePhotoModal);
photosModalOverlay.addEventListener('click', e => { if (e.target === photosModalOverlay) closePhotoModal(); });
photosBackBtn.addEventListener('click', () => {
  if (photosPath.length > 1) { photosPath.pop(); renderPhotos(); }
});

function currentFolder() { return photosPath[photosPath.length - 1]; }

function renderPhotosBreadcrumb() {
  photosBreadcrumb.innerHTML = photosPath.map((node, i) => {
    const isCurrent = i === photosPath.length - 1;
    const sep = i > 0 ? '<span class="photos-crumb-sep">›</span>' : '';
    return `${sep}<span class="photos-crumb${isCurrent ? ' current' : ''}" data-depth="${i}">${node.name}</span>`;
  }).join('');
  photosBreadcrumb.querySelectorAll('.photos-crumb').forEach(node => {
    node.addEventListener('click', () => {
      const depth = Number(node.dataset.depth);
      if (depth < photosPath.length - 1) { photosPath = photosPath.slice(0, depth + 1); renderPhotos(); }
    });
  });
  photosBackBtn.disabled = photosPath.length <= 1;
}

function renderPhotos() {
  renderPhotosBreadcrumb();
  const folder = currentFolder();
  const folders = folder.children.filter(c => c.type === 'folder');
  const files = folder.children.filter(c => c.type === 'file');
  const ordered = folders.concat(files);
  photosGrid.innerHTML = ordered.map((item, i) => {
    if (item.type === 'folder') {
      return `<div class="photos-card" data-idx="${i}">
        <div class="photos-thumb photos-folder-thumb"><img src="assets/icons/folder.svg" alt="" /></div>
        <div class="photos-card-name">${item.name}</div>
        <div class="photos-card-date">${item.children.length} položek</div>
      </div>`;
    }
    return `<div class="photos-card" data-idx="${i}">
      <div class="photos-thumb">${buildPhotoPreview(item)}</div>
      <div class="photos-card-name">${item.name}</div>
      <div class="photos-card-date">${item.date}</div>
    </div>`;
  }).join('');
  photosGrid.querySelectorAll('.photos-card').forEach(card => {
    const item = ordered[Number(card.dataset.idx)];
    card.addEventListener('click', () => {
      if (item.type === 'folder') { photosPath.push(item); renderPhotos(); }
      else openPhotoModal(item);
    });
  });
  photosGrid.scrollTop = 0;
}

function openPhotoModal(f) {
  photosModalName.textContent = f.name;
  photosModalPreview.innerHTML = buildPhotoPreview(f);
  photosModalMeta.innerHTML = `
    <h4>Informace o souboru</h4>
    <div class="photos-meta-row"><span class="k">Název</span><span class="v">${f.name}</span></div>
    <div class="photos-meta-row"><span class="k">Datum</span><span class="v">${f.date}</span></div>
    <div class="photos-meta-row"><span class="k">Velikost</span><span class="v">${f.size}</span></div>
    <div class="photos-meta-row"><span class="k">Rozměry</span><span class="v">${f.dims}</span></div>
    <div class="photos-modal-desc">${f.desc}</div>
  `;
  photosModalOverlay.classList.remove('hidden');
}
function closePhotoModal() {
  photosModalOverlay.classList.add('hidden');
}

function openPhotos() {
  photosPath = [PHOTOS_TREE];
  photosWindow.classList.remove('hidden');
  renderPhotos();
}

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
      showUpdateModal('Halo Infinite', 'Stahování aktualizace…', '12,4 GB');
      break;
    case 'cs':
      showUpdateModal('Counter-Strike 2', 'Stahování aktualizace…', '8,1 GB');
      break;
    case 'recycle':
      openRecycle();
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
