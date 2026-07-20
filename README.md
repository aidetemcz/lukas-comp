# Lukas-PC

Statická webová simulace plochy Windows (ikony, taskbar, poznámkový blok,
falešné dialogy aktualizací) sloužící jako demonstrační scénář.

## Obsah

- `index.html`, `style.css`, `script.js` – simulovaná plocha, taskbar a okna
- `content/denik.md` – text deníku zobrazený v poznámkovém bloku
- `assets/icons/` – ikony aplikací a složek
- `editor.js` – vestavěný editor obsahu (viz níže)

## Editor obsahu

V pravém horním rohu je tlačítko ✏️, které zapne režim úprav:

- libovolný text v appce (názvy ikon, čas, texty deníku, texty dialogů…)
  lze kliknutím přímo přepsat,
- kliknutím na jakoukoli ikonu/obrázek lze nahrát vlastní fotku z počítače,
- tlačítko „Změnit pozadí plochy“ vymění tapetu,
- změny se ukládají do `localStorage` prohlížeče a přežijí obnovení stránky,
- tlačítko „Obnovit výchozí obsah“ vše vrátí na výchozí stav.

Mimo režim úprav vypadá a funguje appka úplně stejně jako předtím.

## Spuštění lokálně

Statický obsah, stačí libovolný HTTP server, např.:

```bash
python3 -m http.server 8000
```

a otevřít `http://localhost:8000`.

## Nasazení

Nasazováno přes Vercel (`vercel.json` nastavuje hlavičky pro `content/`).
