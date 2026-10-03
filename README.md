# Pražský kompas 2026

Klikací test pro pražské komunální volby (9. a 10. 10. 2026): 20 výroků + 2 bonusové rozstřely → tvoje místo na mapě Prahy (Auta ↔ Lidé, Domov ↔ Metropole), „tvůj primátor" (nejbližší kandidující subjekt) a sdílecí kartička.

Fork [Českého kompasu](https://github.com/miloscermak/kompas): stejný engine, nová data a výsledkovka. Funguje bez serveru, stačí otevřít `index.html` v prohlížeči.

## Jak upravit otázky, strany a texty (bez znalosti kódu)

Všechna data jsou v souboru **`data.js`**. Otevři ho v libovolném textovém editoru.

### Otázky

```js
{ id: 3, axis: 1, text: "Z Malé Strany a Smetanova nábřeží mají auta nerezidentů zmizet…", pole: 1 },
```

- `text`: znění výroku (můžeš libovolně přepsat)
- `pole`: **pozor:** `1` když souhlas táhne ke kladnému pólu osy (Lidé / Metropole), `-1` když k zápornému (Auta / Domov). Když měníš smysl otázky, zkontroluj i pole!
- `axis` a `id` neměň (musí zůstat 10 otázek na osu, osa 1 = Auta/Lidé, osa 2 = Domov/Metropole)

### Kandidující subjekty

Každý subjekt má v sekci `SUBJECTS` **svoje odpovědi na všech 20 otázek** (`answers`, hodnoty −2 až +2) a u každé odpovědi jistotu (`conf`: P program, V výrok, H hlasování, O odhad). Bod subjektu na mapě se z odpovědí **počítá**, nikde se nezadává ručně. Když chceš subjekt posunout, změň jeho odpovědi, ne souřadnice.

```js
{
  key: "stan", name: "STAN", full: "Starostové a nezávislí", leader: "Petr Hlaváček",
  desc: "Autor Metropolitního plánu.", color: "#b45309", source: "program", shootouts: [0, 2],
  answers: { 1: -1, 2: 1, ... 20: -1 },
  conf:    { 1: "V", 2: "V", ... 20: "P" },
},
```

- `source`: `"program"` (naše kódování) nebo `"autorizováno"` (strana poslala vlastní odpovědi); zobrazuje se v metodice
- `shootouts`: indexy odpovědí na oba rozstřely (0 = první možnost), pro „Stejně to vidí: …"
- `active: false`: subjekt vypne (nezobrazí se na mapě ani v pořadí, v metodice bude „vypnuto")
- Smazání: smaž celý blok včetně čárky. Přidání: zkopíruj blok a vyplň všech 20 odpovědí.

Po úpravě subjektů spusť `node sim.js`: vypíše, jak často který subjekt vychází jako „tvůj primátor", obsazení kvadrantů, nejbližší dvojice (dvojčata) a podíl odhadů v kódování.

### Kvadranty, rozstřely, demografie

- Názvy, města v závorce a popisky kvadrantů jsou v `QUADRANTS` (`nick` = město; prázdný řetězec = bez závorky).
- Oba rozstřely v `SHOOTOUTS` (`card` je zkrácený popisek na kartičku). Když změníš počet možností, uprav i `shootouts` u subjektů a test.
- Demografické otázky v `DEMOGRAPHICS`; `type: "select"` udělá rozbalovací seznam (městské části).

## Po každé úpravě

1. Ulož soubor.
2. Otevři (nebo obnov) `index.html` v prohlížeči a proklikej test.
3. Spusť `node test.js` (všechny řádky musí hlásit OK) a `node sim.js`.

## Metodika pro veřejnost

`metodika.html` se **kreslí přímo z `data.js`**: osy, kvadranty, výroky, pozice subjektů, kompletní kódovací tabulka a rozstřely. Nic se tam nepřepisuje ručně, stačí upravit data. Odkaz na repozitář se zdroji (`otazky.md`, `reserse.md`) je v patičce stránky (`#repo-link`).

## Ukládání výsledků (Google Sheets)

Stejný mechanismus jako u Českého kompasu: po dokončení testu web anonymně odešle výsledek do Google Sheetu přes Apps Script webhook (`apps-script/webhook.gs`). Zapisuje do listu `praha`.

1. Otevři [script.google.com](https://script.google.com) → **New project** a vlož celý obsah `apps-script/webhook.gs`.
2. Zkontroluj `SPREADSHEET_ID` (výchozí je tabulka Českého kompasu, list `praha` se vytvoří sám; nebo vytvoř novou tabulku a ID přepiš).
3. **Deploy → New deployment → Web app**, Execute as: **Me**, Who has access: **Anyone**. Zkopíruj URL.
4. V `data.js` vlož URL do `WEBHOOK_URL` a pushni.

Dokud je `WEBHOOK_URL` prázdné, nikam se nic neposílá (payload se jen vypíše do konzole prohlížeče).

## Struktura projektu

| Soubor | Co dělá |
|---|---|
| `index.html` | struktura stránky |
| `style.css` | vzhled |
| `app.js` | logika aplikace (obrazovky, mapa, pořadí, kartička) |
| `scoring.js` | výpočet skóre, bodů subjektů a „tvého primátora" |
| `data.js` | **otázky, subjekty, texty, tohle edituj** |
| `metodika.html` | veřejná metodika, generuje se z `data.js` |
| `test.js` | testy (`node test.js`) |
| `sim.js` | simulace pokrytí mapy (`node sim.js`) |
| `apps-script/webhook.gs` | ukládání výsledků do Google Sheets |

## Repozitář a nasazení

- Web i podklady jsou v kořeni repa: `koncept.md`, `otazky.md` (kódování), `reserse.md`, `predavaci-protokol.md` (stav projektu), `nahledy/` (screenshoty).
- Netlify: Import from GitHub → `prazskykompas`, nic dalšího nenastavuj. `netlify.toml` publikuje kořen repa bez build kroku.
