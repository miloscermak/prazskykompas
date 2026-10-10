# Pražský kompas 2026

Klikací webová aplikace pro pražské komunální volby 9. a 10. 10. 2026: 20 výroků + 2 bonusové rozstřely → pozice na mapě Prahy, „tvůj primátor" (nejbližší kandidující subjekt) a sdílecí kartička (PNG). Hra, ne sociologie, ne volební doporučení. Celý průchod pod 3 minuty.

Fork Českého kompasu (`github.com/miloscermak/kompas`); tento repozitář je samostatný (`github.com/miloscermak/prazskykompas`). **Koncept, otázky s kódováním a rešerše jsou v `koncept.md`, `otazky.md` a `reserse.md`; předávací protokol v `predavaci-protokol.md`. Před prací na featurách je přečti.**

## Stack a struktura

- Vanilla HTML + CSS + JS. **Žádný framework, žádný build krok, žádné externí knihovny** (kartička přes Canvas API).
- **Po volbách (od 10. 10. 2026 14:00):** hlavní stránka `index.html` je odhad výsledku voleb (generuje se z `odhad/`, viz `odhad/README.md`); kompas samotný běží na `kompas/index.html` (skripty a styl bere z kořene přes `../`). Staré sdílené odkazy `?r=` na kořeni přesměrovává `_redirects` i skript v hlavičce.
- Soubory: `kompas/index.html` (aplikace), `style.css`, `app.js`, `scoring.js`, `data.js` (otázky + subjekty jako JS modul kvůli file://), `metodika.html` (generuje se z `data.js`), `README.md` (návod na editaci dat pro neprogramátora).
- Hosting: Netlify, bez build kroku (`netlify.toml`, publish `.`). Cílová doména `prazskykompas.inspiruj.se`.
- **Musí fungovat přes `file://` i https**, proto data v `data.js`, ne fetch JSON.

## Tvrdá omezení

- Žádné cookies, žádné sledování, žádná analytika třetích stran. Výsledky anonymně do Google Sheetu přes Apps Script webhook (`apps-script/webhook.gs`, URL v `data.js` jako `WEBHOOK_URL`, list `praha`); demografie dobrovolná. Když webhook selže nebo chybí, web funguje dál.
- Mobil first: primární viewport 390 px. Payload pod 200 kB. Systémový font stack.
- Přístupnost: klávesy 1–5 pro odpovědi, Enter pro pokračování, kontrast AA, aria-labely.
- Žádná loga stran ani fotky lídrů (autorská práva): iniciály v barevném kolečku, barvy v `data.js`.
- Žádná celostátní politika v otázkách. Žádné dlouhé pomlčky v textech (ani v komentářích v kódu).

## Logika

- 2 osy: X = Auta (−) / Lidé (+), Y = Domov (−) / Metropole (+), 10 otázek na osu. Škála odpovědí −2 až +2, každá otázka má `pole` (+1/−1) pro reverse scoring. Obrácené výroky: 1, 7, 10 (X) a 12, 13, 14, 15, 20 (Y).
- Skóre osy = součet (odpověď × pole), rozsah −20 až +20.
- **Subjekty mají `answers` na všech 20 otázek; jejich bod se počítá stejným vzorcem (`subjectScores`). Souřadnice se nikdy nezadávají ručně.** `conf` = jistota kódování (P/V/H/O), `source` = program/autorizováno, `active: false` subjekt vypne.
- „Tvůj primátor" = subjekt s nejmenší euklidovskou vzdáleností; shoda = `round(100 × (1 − d/56,57))`. Výsledkovka ukazuje pořadí všech aktivních subjektů.
- Střed (|X| ≤ 4 a |Y| ≤ 4) = „Pražský kompromis", ne kvadrant. Kvadranty: `kolo` (Lidé+Metropole), `sousedstvi` (Lidé+Domov), `volant` (Auta+Metropole), `klid` (Auta+Domov); každý má `nick` (město v závorce).
- Dva rozstřely mimo skóre: největší problém (5 možností) a 180 miliard (4 možnosti); u každého „Stejně to vidí: …" podle `shootouts` subjektů.
- Sdílení: `?r=` + base64 ze 2 skóre + 2 indexů rozstřelů (4 byty). `decodeResult` dostává limity z `SHOOTOUTS`.

## Zásady práce

- Editace otázek a subjektů v `data.js` nesmí vyžadovat zásah do logiky. Po změně subjektů spustit `node sim.js` (pokrytí, dominance, dvojčata, podíl odhadů).
- `node test.js` musí projít (61 testů). Testy skóre subjektů jsou napsané proti tabulce v `otazky.md`; při změně kódování je přepiš vědomě.
- Texty a mikrocopy: `index.html` (intro, disclaimer, popisky), `data.js` (kvadranty, rozstřely), `metodika.html` (článek). Miloš je reviduje; neměnit tón bez zadání.
- Žádné souhrnné statistiky z uložených výsledků před volbami (zákon o volbách do zastupitelstev obcí zakazuje zveřejňovat průzkumy od 3. dne před volbami; kompas není průzkum, ale souhrny „jak odpovídala Praha" až po volbách).

## Ověření

- `node test.js`, `node sim.js`, proklik na mobilu (390 px) i desktopu, sdílený odkaz `?r=`, kartička na iOS Safari / Android Chrome / desktop, `metodika.html` (tabulky se vykreslí z dat), Lighthouse mobile ≥ 90.
