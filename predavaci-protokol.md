# Pražský kompas 2026: předávací protokol

Sobota 3. 10. 2026, dopoledne. Předává Claude (Cowork), přebírá Miloš s Claude Code. Cíl: launch v pondělí 5. 10. na `prazskykompas.inspiruj.se`.

## 1. Co je hotové

Složka `kompas-praha/web/` je kompletní, nasaditelný web. Fork Českého kompasu se stejným enginem (vanilla HTML/CSS/JS, bez buildu, funguje přes `file://` i https).

| Soubor | Stav |
|---|---|
| `data.js` | 20 finálních výroků (po obou revizích), pořadí střídá osy, 2 rozstřely, 5 kvadrantů s městy v závorce, 10 subjektů (7 aktivních, 3 vypnuté) s odpověďmi na všech 20 otázek + jistota kódování (P/V/H/O) + odpovědi na rozstřely, demografie včetně městské části (rozbalovací seznam). `WEBHOOK_URL` je prázdný. |
| `scoring.js` | Skóre, body subjektů (počítají se z odpovědí, nikde ručně), pořadí všech, kvadrant, „stejně to vidí", kódování odkazu `?r=` (4 byty). |
| `app.js` | Celý průchod, výsledkovka: kvadrant + město, mapa s body všech subjektů (přepínač skrýt/ukázat), „Tvůj primátor" (lídr, subjekt, %), pořadí všech deseti, oba rozstřely s „Stejně to vidí: …", kartička 1080×1350 (mapa s body stran, primátor, oba rozstřely, URL), sdílený odkaz, demografie, klávesnice. |
| `index.html` | Texty intra, disclaimer, OG meta, odkaz „Jak to počítáme". |
| `style.css` | Původní vzhled + body subjektů na mapě, pořadí, rozstřely, select, tabulky metodiky. |
| `metodika.html` | Veřejná metodika. Tabulky (kvadranty, výroky, pozice subjektů, kompletní kódovací tabulka 20×10, rozstřely) se **kreslí z `data.js`**, takže po každé úpravě dat jsou automaticky aktuální. Text článku je návrh k revizi. |
| `test.js` | 61 testů, všechny procházejí (`node test.js`). Hlídají i skóre každého subjektu proti tabulce v `otazky.md`. |
| `sim.js` | Simulace pokrytí mapy (`node sim.js`): podíl výher, obsazení kvadrantů, dvojčata, podíl odhadů v kódování. |
| `apps-script/webhook.gs` | Upravený webhook: list `praha`, sloupce pro primátora, oba rozstřely a městskou část. |
| `README.md`, `CLAUDE.md`, `netlify.toml`, `.gitignore` | Návod pro editaci dat, kontext pro Claude Code, konfigurace Netlify. |

Ověřeno v headless Chromiu (mobil 390 px i desktop): celý průchod, výsledkovka, kartička, sdílený odkaz, metodika. Žádné chyby v konzoli. Náhledy jsou v `kompas-praha/nahledy/`. Payload bez metodiky cca 64 kB.

## 2. Rozhodnutí o subjektech (uzavřeno 3. 10. dopoledne)

Simulace ukázala, že menší subjekty s kódováním převážně z odhadů deformují mapu: Spojená levice (18/20 odhad) „vyhrávala" 20 % mapy, protože v kvadrantu auta + domov seděla uvnitř sama; Svobodní (13/20 odhad) byli dvojče Motoristů a brali jim 7 %; SEN (17/20 odhad) dvojče Prahy sobě. Miloš rozhodl Levici a Svobodné vypnout, SEN jsem vypnul ze stejného důvodu a do metodiky doplnil veřejné kritérium: **na mapě je subjekt, u kterého jsme bez odhadu obsadili aspoň polovinu výroků.** Test to hlídá (`aktivní subjekt má aspoň polovinu odpovědí bez odhadu`). Všechny tři vypnuté subjekty zůstávají v `data.js` s `active: false`, v metodice jsou vidět jako „vypnuto" a zapnou se jedním řádkem (pak ale uprav i větu s kritériem v `metodika.html` a test).

Na mapě je tedy sedm subjektů: Spolu, ANO, Piráti, STAN, Praha sobě, SPD a spol., Motoristé sobě.

Jedna věc k vědomí: v kvadrantu auta + domov vyhrává častěji SPD (12 % mapy) než ANO (10 %), protože ANO je kódované jako nejvíc proautové ze všech (X = −18) a sedí až na kraji, zatímco SPD je blíž středu (−14, 0). Není to chyba, je to výsledek kódování; kdybys chtěl ANO posunout víc do středu, jsou to otázky 3, 4 a 6, kde je u ANO odhad (O).

**Texty.** Intro, disclaimer, popisky kvadrantů, „Tohle neříká žádná ze stran. Jsi originál." u rozstřelu bez shody a článek v `metodika.html` jsou návrhy ve tvém hlase; Miloš je bere zatím jako OK a upraví po testování na reálných lidech.

## 3. Nasazení (odhad: hodina, nic z toho nevyžaduje kód)

### Git a GitHub

Doporučuju variantu A, je nejrychlejší:

**A) Složka v repu `kompas`.** `kompas-praha/` včetně `web/` prostě commitni a pushni do `github.com/miloscermak/kompas`. Repo je veřejné, takže `koncept.md`, `otazky.md` a `reserse.md` budou veřejné taky, což je přesně ta transparentnost, kterou slibujeme (metodika na ně odkazuje: `#repo-link` v `metodika.html` míří na `github.com/miloscermak/kompas/tree/main/kompas-praha`).

```
cd ~/kompas
git add kompas-praha
git commit -m "Pražský kompas 2026: koncept, otázky, rešerše a web"
git push
```

**B) Samostatné repo `prazsky-kompas`.** Čistší pro Netlify, ale musíš založit repo a zkopírovat i dokumenty. Pak uprav `#repo-link` v `metodika.html`.

### Netlify

1. Netlify → Add new site → Import from GitHub → repo `kompas`.
2. **Base directory:** `kompas-praha/web`. **Publish directory:** `kompas-praha/web` (Netlify ho předvyplní podle `netlify.toml` v base adresáři). Build command prázdný.
3. Deploy. Zkontroluj dočasnou URL: průchod, kartička (na kartičce se tiskne skutečná doména), `metodika.html`.
4. Domain settings → Add custom domain `prazskykompas.inspiruj.se` → u registrátora inspiruj.se přidej CNAME na adresu Netlify webu (stejně jako u Českého kompasu). HTTPS Netlify vystaví sám.

### Ukládání výsledků

1. script.google.com → New project → vlož `apps-script/webhook.gs`.
2. `SPREADSHEET_ID` je výchozí z Českého kompasu, list `praha` se vytvoří sám při prvním zápisu. Pokud chceš oddělenou tabulku, vytvoř ji a ID přepiš.
3. Deploy → New deployment → Web app, Execute as Me, Who has access Anyone → zkopíruj URL.
4. V `data.js` nastav `WEBHOOK_URL`, pushni. Spusť v editoru `testSubmission()` a smaž testovací řádek.

### Před launchem

- Projít na skutečném iPhonu a Androidu: průchod, stažení kartičky, zkopírování odkazu.
- Lighthouse mobile (performance a accessibility ≥ 90).
- Volitelné: statický OG obrázek 1200×630 pro náhled odkazu (teď jsou jen textové OG meta tagy).
- Volitelné: Český kompas má na webu odkaz „Jak kompas vznikl"; sem by se hodil křížový odkaz z Českého kompasu na pražský.

## 4. Jak se dělají běžné úpravy (pro Claude Code i pro tebe)

- **Změna znění otázky:** `data.js` → `QUESTIONS` → `text`. Když se otočí smysl, otoč i `pole`. Pak `node test.js` (test obrácených výroků hlídá 1, 7, 10 a 12, 13, 14, 15, 20).
- **Posun subjektu na mapě:** nikdy neměnit souřadnice, ty neexistují. Změň jeho `answers` (a `conf`), spusť `node test.js` (přepiš očekávané skóre v sekci „Subjekty", je tam vědomě natvrdo) a `node sim.js`.
- **Strana poslala vlastní odpovědi:** přepiš `answers` jejími hodnotami, `conf` nastav všude na `"P"` (nebo nech), `source: "autorizováno"`. Metodika to zobrazí sama.
- **Vypnout subjekt:** `active: false`.
- **Kvadranty, města v závorce:** `QUADRANTS`, pole `nick`.
- **Rozstřely:** `SHOOTOUTS`; při změně počtu možností uprav i `shootouts` u subjektů a testy.

## 5. Co jsem nestihl nebo vědomě vynechal

- Dotazník stranám jsme se rozhodli neposílat. V metodice zůstává věta, že strana může poslat vlastní odpovědi a my je do 24 hodin nasadíme; mechanismus je připravený (`source: "autorizováno"`).
- Otázka 15 (turisté) má dvě části (poplatek + vláčky). Kódování je podle poplatku, k vláčkům nemá žádná strana výrok. V metodice to není zmíněné, případně dopiš větu.
- Rezervy města jsou v rozstřelu jako „přes 180 miliard"; zdroje se pohybují 175 až 205 podle metodiky počítání (viz `reserse.md`).
- Souhrnné statistiky z uložených výsledků před volbami nezveřejňovat (moratorium na průzkumy od 3. dne před volbami; přesné znění paragrafu jsem neověřil, viz koncept).
- Analytické skripty z Českého kompasu (`analyza/`) jsem nepřenášel; po volbách se dají použít s novými názvy sloupců.

## 6. Čísla ze simulace (stav kódování 3. 10., sedm aktivních subjektů)

| Subjekt | Bod | Kvadrant | Podíl mapy | Odhadů v kódování |
|---|---|---|---|---|
| Praha sobě | +11 / −8 | Sousedství s tramvají | 24,2 % | 4/20 |
| STAN | +9 / +3 | Velkoměsto na kole | 22,4 % | 1/20 |
| Spolu | −12 / +4 | Metropole za volantem | 13,8 % | 1/20 |
| SPD a spol. | −14 / 0 | Metropole za volantem | 12,4 % | 8/20 |
| ANO | −18 / −1 | Klid s parkovacím místem | 9,6 % | 5/20 |
| Piráti | +17 / +1 | Velkoměsto na kole | 9,3 % | 1/20 |
| Motoristé | −20 / +11 | Metropole za volantem | 8,4 % | 4/20 |

Vypnuto (`active: false`): SEN pro Prahu (+10 / −5, 17/20 odhad), Spojená levice (−9 / −9, 18/20), Svobodní (−17 / +9, 13/20).

Nejbližší dvojice: ANO × SPD (4,1), Spolu × SPD (4,5), Spolu × ANO (7,8), Piráti × STAN (8,2). Žádná dvojčata pod 4 body.

## 7. Harmonogram do pondělí

| Kdy | Co |
|---|---|
| So 3. 10. | Rozhodnutí z bodu 2, revize textů, push, Netlify, doména, webhook. Test na telefonech. |
| Ne 4. 10. | Proklik pěti kamarády, opravy, kartička na socky, texty do newsletteru a podcastu. |
| Po 5. 10. | Launch. |
| St 7. 10. | Od tohoto dne žádné souhrnné statistiky. |
| Po volbách | Článek „Jak odpovídala Praha", srovnání s výsledkem, bod „koalice" na mapě. |
