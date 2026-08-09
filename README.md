# Projekt "Lukasovo PC"

Webová simulace pracovní plochy 15letého chlapce Lukase pro **detektivní workshop pro děti 2. stupně ZŠ a SŠ** o digitální osamělosti, algoritmické radikalizaci a manosphere/looksmaxxing/blackpill diskurzu.

**Deploy:** [lukas-comp.vercel.app](https://lukas-comp.vercel.app/)

## Kontext projektu

AI dětem — vzdělávací workshop postavený kolem fiktivního teenagera Lukase, přes jehož pracovní plochu účastníci detektivním způsobem rekonstruují cestu od benigního self-improvementu k hranici blackpill diskurzu. **Bez explicitního moralizování.** Cíl: mediální gramotnost, kritické myšlení o algoritmech a AI companions, empatie vůči vrstevníkům v podobné situaci.

## Dokumenty v tomto repu

| Soubor | Účel |
|---|---|
| `context/LUKAS_KONTEXT.md` | **Master brief pro Claude Code.** Kompletní kreativní, pedagogický a designový kontext pro implementaci simulace. Obsahuje časovou osu, obsah jednotlivých aplikací, ChatGPT konverzace slovo od slova, designové principy a styleguide manosphere komunit. |
| `context/LUKAS_PROFIL.md` | **Definitivní psychologický profil postavy.** Zdroj pravdy o Lukasově osobnosti. V případě konfliktu s KONTEXT.md má tento soubor přednost. |
| `context/DETEKTIVNI_SCENAR.md` | **Průvodce průběhem workshopu z pohledu dítěte-detektiva.** Fáze objevování, cross-references, otázky do diskuze, cheat sheet pro facilitátora. |

## Klíčová designová rozhodnutí

1. **Lukas se neidentifikuje jako incel/blackpiller.** Zůstává v polovědomém stádiu — testuje, jestli mu manosphere framework sedí jako vysvětlení.
2. **Otevřený konec.** Workshop nekončí intervencí ani katastrofou. Lukas právě odešel od PC, nikdo neví, kam.
3. **Absence Lukasovy tváře.** Pixelizace, silueta, blur — děti mají hodnotit jazyk a chování, ne vzhled.
4. **Bez chirurgie, Turecka, suicide markerů.** Vědomé škrty pro workshopové publikum 13–17.
5. **Pravda v koši, ne na povrchu.** Detektivní princip — Lukasova skutečná vulnerabilita je vidět jen v tom, co se snažil smazat.

## Aktuální stav implementace

Web `lukas-comp.vercel.app` obsahuje:
- Desktop s ikonami (Fotky, Chrome, Discord, Halo, CS2, self_data.html, Koš)
- Chrome s ChatGPT rozhraním, historií, WhatsApp Desktop v systray
- Discord (4 servery)
- self_data.html tracking dashboard
- facerate.io fake stránka
- YouTube shell (homepage, watch, search, shorts)
- Google search, Gmail, Grok shells
- IDOS.cz-styled vlakové spojení Plzeň–Praha (detektivní artefakt vlakového hledání)
- Vestavěný **editor obsahu** (Ctrl+Shift+E) pro úpravu textu bez re-buildu

## Použití při workshopu

1. Před workshopem: facilitátor si projde všechny 3 dokumenty v `context/`
2. Zahájení: účastníci dostanou instrukci bez kontextu
3. Aktivní zkoumání: 40 min ve dvojicích/trojicích
4. Sdílení: 15 min mezi skupinami
5. Závěrečná diskuze: 20–30 min podle šablony v `context/DETEKTIVNI_SCENAR.md`

## Kontakt

Projekt je součástí iniciativy **AI dětem**. Zpětnou vazbu, návrhy a otázky lze zaslat autorům.

---

*Tento repozitář obsahuje citlivé pedagogické materiály. Použití mimo workshopové prostředí konzultovat s autory.*
