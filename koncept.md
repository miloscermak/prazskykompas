# Kompas Praha 2026: koncept k debatě

Verze 0.3, sobota 3. 10. 2026. **Rozhodnuto: jdeme do sprintu (varianta A), launch v pondělí 5. 10.** Otázky obou os jsou finální (`otazky.md`), web je postavený ve složce `web/` a kroky k nasazení jsou v `predavaci-protokol.md`. Rozhodnutí 3. 10.: deset subjektů, popisné názvy kvadrantů s městem v závorce (Paříž, Kodaň, Varšava, Mnichov), dotazník stranám se neposílá, doména `prazskykompas.inspiruj.se`.

Podklady: `reserse.md` (fakta a zdroje), `otazky.md` (20 výroků, náhradníci, předběžné kódování stran).

---

## 0. Nejdřív to nepříjemné: kalendář

Volby do zastupitelstva hlavního města jsou **v pátek a sobotu 9. a 10. října 2026**. Tedy za týden. Kandiduje 24 subjektů, 1 060 lidí, hraje se o 65 mandátů.

Z toho plynou dvě možné cesty:

**A) Sprint.** Launch v pondělí 5. 10. večer, nejpozději v úterý 6. 10. ráno. Dává to tři dny sdílení před volbami. Zní to šíleně, ale: kód máme (Český kompas běží, stačí vyměnit data a výsledkovku), programy stran jsou venku, lídři už odpověděli na desítky konkrétních otázek v anketách Echa, Deníku, CNN Prima a iROZHLASu. Nejdražší část projektu, tedy osy a otázky, je tenhle dokument. Harmonogram je v sekci 9.

**B) Evergreen.** Pustit to až po volbách jako „Pražský kompas": kde jsi ty, kde jsou strany, a za pár týdnů i kde je nová koalice. Bez stresu, ale bez volebního momentu. Slabší zásah, delší život.

Můj názor: A, s vědomím, že kódování stran bude narychlo, a proto musí být od první minuty veřejné a opravitelné stranami samotnými. Varianta B zůstává jako záložní plán, pokud se v sobotu ukáže, že to nestíháme. A je dobrá i jako pokračování po volbách (viz sekce 11).

---

## 1. Co stavíme (jedna věta)

Dvacet výroků o konkrétních pražských věcech, bod na mapě Prahy se dvěma osami, název kvadrantu, „tvůj primátor" (nejbližší kandidující subjekt s procentem shody a pořadím všech ostatních), dva bonusové rozstřely a sdílecí kartička. Hra, ne sociologie, ale s otevřenou metodikou, kterou si může každý ověřit.

Stejný engine jako Český kompas: vanilla JS, data v jednom souboru, průchod pod tři minuty, žádné cookies.

---

## 2. Co už existuje (a proč děláme něco jiného)

- **Kalkulačka Echa**: sedm lídrů odpovědělo osobně, výstup je procento shody s každým. Dobře udělané, ale bez mapy a bez vize.
- **Volební kalkulačka (KohoVolit): Inventura hlasování Praha**: 25 skutečných hlasování zastupitelstva 2022 až 2026. Poctivé, ale měří minulost a zahrnuje jen strany, které v zastupitelstvu seděly.
- **programydovoleb.cz**: přehled programů všech 24 subjektů, žádná interakce.

Naše odlišnost: nedáváme procento, dáváme **místo na mapě**. Výsledek není „shoduješ se na 61 % se STAN", ale „jsi v Kodani, ne ve Varšavě, a nejblíž máš k Praze sobě". Kvadranty, humor, kartička na Instagram. A kompletní kódovací tabulka se zdroji, kterou nikdo z těch tří nemá.

Mimochodem: odpovědi lídrů z kalkulačky Echa a jejich textových anket jsou pro nás surovina. Nemusíme hádat, co si Portlík myslí o parkování, on to řekl.

---

## 3. Osy: proč zrovna tyhle dvě

Z rešerše vypadly čtyři skutečné pražské štěpné linie:

1. **Auta versus lidé** (cyklopruhy, modré zóny, vjezd do centra, třicítka, magistrála). Nejviditelnější spor období 2022 až 2026, koalice se na parkovací reformě ani ceně kupónu nedohodla za celé čtyři roky.
2. **Růst versus klid** (mrakodrapy, zahušťování, Airbnb, turisté, noční život, filharmonie, povolování).
3. **Peníze** (180 miliard na účtech, zdražit MHD a parkování, nebo nezdražovat nic, má město samo stavět byty).
4. **Pořádek** (feťáci, bezdomovci, strážníci, nulová tolerance, alkohol ve večerkách).

Kompas unese dvě osy. Linie 1 je jasná. Pro druhou osu jsem zvažoval tři kandidáty:

- **Peníze / role města** (město jako hráč versus město jako správce). Vypadá lákavě, jenže s osou aut silně koreluje: Piráti, Praha sobě a STAN jsou „lidé + město staví", Spolu, Motoristé a SPD „auta + trh". Mapa by se sesypala na diagonálu a kvadrant „lidé + trh" by zůstal prázdný. Stejný problém, který jsme u Českého kompasu řešili s osou Brusel/Trump a kavárna/zbytek.
- **Pořádek** sám o sobě. Silně dělí (ANO, SPD, Motoristé versus Piráti, Praha sobě), ale je to jedno téma, ne vize města. Dávám ho do rozstřelu a jednou otázkou do osy Y.
- **Růst versus klid** jako vize: Praha jako rostoucí metropole, nebo Praha jako domov těch, kdo tu bydlí? Tohle je skutečná otázka „jak si představuješ hlavní město". A s osou aut se kříží, ne překrývá: Motoristé jsou auta + metropole, ANO auta + klid a pořádek, Piráti lidé + otevřené velkoměsto, Praha sobě lidé + sousedství.

**Osa X: AUTA ↔ LIDÉ.** Komu patří ulice. Vlevo Praha, kde se autem dá všude dojet a zaparkovat. Vpravo Praha, kde má přednost tramvaj, kolo a chodník, a auto ustupuje.

**Osa Y: METROPOLE ↔ DOMOV.** Jak rychle a pro koho má Praha růst. Nahoře velkoměsto: stavět výš, hustěji a rychleji, velké projekty, otevřené turistům, nočnímu životu i nově příchozím. Dole město pro ty, kdo tu žijí: klid, zeleň, pořádek, limity pro developery, Airbnb i rozlučkové párty.

Předběžné kódování z programů a výroků (detail v `otazky.md`, škála −20 až +20) dává tuhle mapu:

| Subjekt (lídr) | X auta/lidé | Y domov/metropole | Kvadrant |
|---|---|---|---|
| Motoristé sobě (Sovová) | −20 | +11 | auta + metropole |
| Spolu, ODS a TOP 09 (Portlík) | −12 | +4 | auta + metropole |
| SPD, Trikolora, PRO, Přísaha (Urban) | −14 | 0 | auta, na hraně |
| ANO (Hušbauer) | −18 | −1 | auta, na hraně domova |
| STAN (Hlaváček) | +9 | +3 | lidé, střed |
| Piráti (Nislerová) | +17 | +1 | lidé, střed |
| Praha sobě, Zelení, KDU-ČSL (Scheinherr) | +11 | −8 | lidé + domov |

(Stav po revizi otázek 3. 10., finální znění.)

Dvě poctivé poznámky. Za prvé, osa X funguje skvěle, rozestup je od −20 do +18. Za druhé, osa Y je zatím úzká: čtyři subjekty sedí u nuly, protože jsou v reálu rozpolcené (ANO chce mrakodrapy i zákaz alkoholu po desáté, Piráti chtějí nové čtvrti pro 200 tisíc lidí i zákaz Airbnb). To není chyba osy, to je realita. Ale znamená to, že u Y rozhodnou detaily kódování a odpovědi stran na náš dotazník. Po nasazení pustíme `sim.js` a zkontrolujeme, že žádný subjekt nedominuje a každý je dosažitelný.

---

## 4. Kvadranty: dvě varianty názvů

Varianta A, města (moje favoritka: každý ví, co to znamená, a nikoho to neuráží, maximálně Mnichov):

| Kvadrant | Název | Popisek (návrh) |
|---|---|---|
| Lidé + metropole | **Berlín na Vltavě** | Ať to tu žije: tramvaje, kola, kluby, nové čtvrti. Auto je pro tebe věc, kterou si půjčíš na dovolenou. |
| Lidé + domov | **Kodaň na Vltavě** | Město krátkých vzdáleností: pekárna, školka a tramvaj do deseti minut, Airbnb a pivní kola ať jdou jinam. |
| Auta + metropole | **Varšava na Vltavě** | Praha má růst, stavět výš a hlavně rychleji. Modré zóny a cyklopruhy jsou brzda, ne vize. |
| Auta + domov | **Mnichov na Vltavě** | Pořádek, čistota, parkovací místo před domem. Praha nemá experimentovat, má fungovat. |
| Střed (|X| ≤ 4 a |Y| ≤ 4) | **Pražský kompromis** | Chápeš cyklistu i řidiče, developera i zahrádkáře. Buď jsi moudrý, nebo ses ještě nerozhodl. |

Varianta B, popisná (bezpečnější, méně vtipná):

| Kvadrant | Název |
|---|---|
| Lidé + metropole | Velkoměsto na kole |
| Lidé + domov | Sousedství s tramvají |
| Auta + metropole | Metropole za volantem |
| Auta + domov | Klid s parkovacím místem |
| Střed | Pražský kompromis |

K debatě: Berlín je pro část lidí nadávka a pro část kompliment, což je přesně to, co u Českého kompasu fungovalo (dezoláti, lepšolidi). Varšava je naopak pro ODS voliče spíš lichotka (mrakodrapy, tempo). Mnichov je jediný, kde si nejsem jistý, jestli ho lidi čtou jako „pořádek a bohatství", nebo jako „nuda". Alternativy pro auta + domov: Vídeň (ale ta je dnes spíš město MHD), Brno (vtip, který by se nám vrátil).

---

## 5. Otázky: zásady a přehled

Zásady stejné jako u Českého kompasu, plus dvě pražské:

- Jeden výrok, jedna věc. Žádné „cyklopruhy a parkování".
- Konkrétní pražská reálie, ne abstrakce: magistrála, Smetanovo nábřeží, Dvorecký most, večerky po desáté, 1 200 korun za rezidentní kartu.
- Výrok musí dělit kandidující subjekty, ne jen voliče. Pokud s něčím souhlasí všichni (metro D, P+R, víc školek), do testu to nepatří.
- Část výroků obrácených, aby „souhlasím se vším" nevyhrálo.
- Žádná celostátní politika. Nulová zmínka o Babišovi, Fialovi, Rusku nebo euru. Kdo chce, najde ideologii v cyklopruhu sám.

Osa X (auta ↔ lidé), deset výroků (po Milošově revizi 3. 10.):

1. Cyklopruhy na hlavních tazích, jako je magistrála nebo Plzeňská, by měly zmizet.
2. Rezidentní parkování za 1 200 korun ročně je skoro zadarmo. Mělo by stát aspoň tolik co roční Lítačka.
3. Z Malé Strany a Smetanova nábřeží mají auta nerezidentů zmizet, ať už zákazem vjezdu, nebo mýtem.
4. V obytných ulicích mimo hlavní tahy má platit třicítka.
5. Když se v ulici nevejde všechno, má ustoupit auto: o pruh míň a místo něj širší chodník nebo cyklopruh.
6. Magistrála má být normální městská třída: přechody, stromy, dva pruhy v každém směru. Že se po ní pojede pomaleji, je v pořádku.
7. Zácpy se řeší stavbou nových silnic a tunelů. Blanka Praze pomohla, potřebujeme víc takových staveb.
8. Parkovací místa na ulicích v centru mají postupně mizet: auta do garáží, místo nich stromy a širší chodníky.
9. Dvorecký most je správně jen pro tramvaje, autobusy, kola a pěší. Auta tam nepatří.
10. Pražan s rezidentní kartou by měl smět parkovat v modré zóně kdekoli v Praze, ne jen ve své čtvrti.

Osa Y (domov ↔ metropole), deset výroků (po Milošově revizi 3. 10.):

11. Praha potřebuje mrakodrapy. Mimo historické centrum klidně i přes sto metrů.
12. Když se v Praze uvolní pozemek (viz Bubny nebo Nákladové nádraží Žižkov), je lepší na něm udělat park nebo zahrádky než postavit byty.
13. Airbnb v bytových domech by mělo být zakázané, nebo omezené na pár týdnů v roce.
14. Večerky v centru by po desáté večer neměly prodávat alkohol.
15. Turisté mají Praze platit víc: poplatek za nocleh ze současných padesáti korun na dvě stě. A turistické vláčky a hop-on-hop-off autobusy z centra pryč.
16. Vltavská filharmonie za 12 miliard se má postavit, i kdyby ji Praha zaplatila celou sama.
17. Kdo chce v Praze stavět, má mít povolení do roka. Když to úřad nestihne, platí automaticky.
18. Praha má růst: deset tisíc nových bytů ročně, i kdyby to znamenalo hustší zástavbu v mé čtvrti.
19. Sdílené koloběžky do centra Prahy patří.
20. Kdo spí v parku nebo v metru, má být strážníky vykázán, i když nemá kam jít.

Pořadí v testu střídá osy (1, 11, 2, 12...), stejně jako u Českého kompasu. Polarity, zdůvodnění a kódování každé otázky jsou v `otazky.md`, včetně náhradníků (parkovací domy na sídlištích, paralelní dráha letiště, aplikační místnost, Housing First, limit lidí na Karlově mostě, moderní architektura v centru, místní referendum o výstavbě a další).

---

## 6. Rozstřely (mimo skóre)

Dva bonusy, které se nepočítají do mapy, ale ukazují se na výsledkovce i kartičce, a u každého napíšeme, které strany odpovídají stejně.

**Rozstřel 1: Co je největší problém Prahy?**
🏠 Drahé byty · 🚗 Doprava a parkování · 💉 Feťáci, bezdomovci a nepořádek · 🧳 Turisté a Airbnb · 🐌 Pomalý magistrát, nic se nestaví

(Piráti, STAN a Praha sobě říkají byty, Motoristé doprava, ANO a SPD nepořádek, Spolu pomalý magistrát: „Dáme Praze tempo".)

**Rozstřel 2: Praha má na účtech přes 180 miliard. Co s nimi?**
🏗️ Utratit za byty · 🛣️ Utratit za okruh a metro · 🏦 Šetřit dál, velké stavby teprve přijdou · 🎟️ Vrátit Pražanům: levná MHD a parkování

(Byty: ANO, Piráti, Praha sobě. Okruh: Motoristé. Šetřit: Spolu, STAN. Levná MHD: SPD, Motoristé.)

Náhradní rozstřely: „Kolik má stát roční Lítačka?" (nula, tisícovka, 3 650 jako dnes, 4 750 jako v roce 2015, víc) a „Kdo má v Praze stavět byty?" (město samo, developeři, družstva s podporou města). Oba krásně mapují na strany, Lítačka je asi nejsdílenější otázka celé kampaně. Můžeme je dát místo prvních dvou, nebo zvážit tři rozstřely.

---

## 7. Jak se pozná „tvůj primátor" (metodika)

**Subjekty.** Sedm hlavních (Spolu, ANO, Piráti, STAN, Praha sobě + Zelení + KDU-ČSL, SPD + Trikolora + PRO + Přísaha, Motoristé sobě). K debatě, zda přidat menší se zveřejněným programem: SEN pro Prahu (Václav Láska), Spojená levice pro Prahu (KSČM + ČSSD), Svobodní, Jsme Praha (Komrsková). Navrhuju přidat SEN, Levici a Svobodné: mají program a každý sedí jinde na mapě (Levice je lidé + domov + město staví, Svobodní auta + metropole + trh). GEN a Jsme Praha program nemají, těžko kódovat. Kritérium zveřejníme: „subjekty, které mají veřejný program nebo nám odpověděly na dotazník".

**Kódování.** Každý subjekt „odpoví" na stejných 20 výroků na stejné škále (−2 až +2). Odpověď odvodíme z programu, veřejných výroků lídra a hlasování v zastupitelstvu, a ke každé buňce tabulky dáme zdroj (odkaz nebo citace) a míru jistoty (program / výrok lídra / odhad). Součet dává bod subjektu na mapě, stejně jako u voliče. Žádné váhy, žádná magie.

**Dotazník stranám.** V sobotu ráno pošleme všem subjektům stejných 20 výroků a dva rozstřely s deadlinem pondělí 12:00. Kdo odpoví, tomu nahradíme náš odhad jeho odpověďmi a označíme „autorizováno". Kdo neodpoví, zůstane s naším kódováním a poznámkou. Tohle je nejdůležitější transparentní prvek: strany si za svou pozici na mapě ručí samy, nebo ji mohly opravit a neudělaly to.

**Koalice.** Praha sobě + Zelení + KDU-ČSL kódujeme podle společného programu; kde se Zelení liší (zahrádky, alkohol, MHD zdarma do 18 let), bereme linii lídra kandidátky a rozdíl poznamenáme. Stejně SPD a spol.

**Shoda.** Euklidovská vzdálenost ve 2D jako v Českém kompasu, `match = round(100 × (1 − d / 56,57))`. Výsledkovka ukáže „tvůj primátor" (jméno lídra, subjekt, procento) a pod ním pořadí všech ostatních. Pořadí všech je důležité: u sedmi až deseti bodů na mapě je „nejbližší" hrubý nástroj a čtenář má vidět, že druhý v pořadí je o dva body dál.

**Limity, které napíšeme nahlas.** Dvacet otázek, dvě osy, tři minuty. Dva subjekty ve stejném kvadrantu dělí jen vzdálenost. Kompas neměří důvěryhodnost, kompetenci ani to, kdo s kým po volbách půjde do koalice. Není to volební doporučení.

---

## 8. Transparentnost

- Stránka **„Jak to počítáme"** (obdoba `jak-vznikl-kompas.md`): osy a proč, všech 20 otázek s polaritou, kompletní kódovací tabulka subjekt × otázka se zdroji, kdo odpověděl na dotazník a kdo ne, co se ukládá (anonymní výsledek, nic osobního).
- Veřejné repo na GitHubu včetně `data.js`, takže si kdokoli může kódování přepočítat nebo navrhnout opravu.
- Opravný mechanismus: strana, která nesouhlasí s kódováním, pošle vlastní odpovědi a my je do 24 hodin nasadíme s označením změny. Historii změn zveřejníme.
- **Právní poznámka k ověření:** zákon o volbách do zastupitelstev obcí (491/2001 Sb., § 30) zakazuje zveřejňovat výsledky předvolebních průzkumů od třetího dne před volbami do konce hlasování, tedy zhruba od středy 7. 10. Kompas sám není průzkum, je to hra, kterou si člověk hraje sám se sebou. Ale souhrnné statistiky typu „jak odpovídala Praha" nebo „kolik lidí má nejblíž k ANO" bych od středy nezveřejňoval a nechal je až na článek po volbách. Přesné znění paragrafu ověřit (nepodařilo se mi dnes dostat k textu zákona).

---

## 9. Harmonogram sprintu (varianta A)

| Kdy | Co |
|---|---|
| Pá 2. 10. večer | Rozhodnutí sprint / evergreen. Debata o osách, kvadrantech, názvech. Škrtání a přepisování otázek. |
| So 3. 10. | Finální znění 20 výroků a rozstřelů. Rozeslání dotazníku stranám (volební štáby + lídři, deadline Po 12:00). Fork repa, `data.js`, úprava výsledkovky (subjekty místo figur, pořadí všech, „tvůj primátor"), nové rozstřely. Kódovací tabulka se zdroji. |
| Ne 4. 10. | Testování na lidech, `sim.js` (pokrytí, dominance), kartička, stránka metodiky, webhook do nového listu. |
| Po 5. 10. | Zapracování odpovědí stran. Launch odpoledne. Newsletter, sítě, podcast. |
| Út 6. 10. až Čt 8. 10. | Opravy, reakce stran, PR. Od středy žádné souhrnné statistiky (viz sekce 8). |
| Po volbách | Článek „Jak odpovídala Praha" se srovnáním s výsledkem. Jakmile vznikne koalice, přidat na mapu bod „koalice" (vážený průměr podle mandátů) a nabídnout „jak daleko máš k nové radě". |

Odhad práce: otázky a texty jeden den (ten nejdražší), kód půl dne až den v Claude Code, kódování stran půl dne, testování půl dne. Je to stejný rozsah, jaký měl Český kompas, jen se nedá nic odložit.

---

## 10. Technika (fork, ne nový projekt)

- Stejný stack: vanilla HTML/CSS/JS, bez buildu, `file://` i https, Netlify. Buď nová složka v repu `kompas` (cesta `/praha`), nebo nové repo `kompas-praha`. Navrhuju nové repo, aby šlo nasadit na vlastní subdoménu a aby Český kompas zůstal netknutý.
- `data.js`: `QUESTIONS` (20, nové osy), `SUBJECTS` místo `FIGURES` (název, lídr, krátký popis, barva, `scores: [x, y]`, odpovědi na rozstřely, `source: "autorizováno" | "program" | "odhad"`), `QUADRANTS`, `SHOOTOUTS`.
- `app.js`: výsledkovka ukáže subjekt + lídra, procento, pořadí všech; body subjektů na mapě s přepínačem (byl to V2 nápad, tady má smysl od začátku); u rozstřelů „stejně odpovídá: ...".
- Kartička: název kvadrantu, mini mapa, „Můj primátor: Adam Scheinherr (Praha sobě), 81 %", oba rozstřely, URL.
- Ukládání: stejný Apps Script, nový list. Demografie dobrovolná, plus jedna otázka navíc: „Ve které městské části bydlíš?" (pro článek po volbách je to zlato).
- Testy: `test.js` přepsat na nová data, `sim.js` na subjekty.

---

## 11. Otevřené otázky k debatě

1. ~~Sprint, nebo evergreen?~~ Rozhodnuto 3. 10.: sprint, evergreen jako pokračování po volbách.
2. Osa Y: metropole/domov, nebo radši peníze/role města, i za cenu diagonály? Nebo úplně jiná?
3. Názvy kvadrantů: města (Berlín, Kodaň, Varšava, Mnichov), nebo popisné?
4. Kolik subjektů: sedm, nebo deset (plus SEN, Levice, Svobodní)?
5. Rozstřely: problém + 180 miliard, nebo Lítačka + kdo staví byty? Nebo tři?
6. Dotazník stranám: posílat, nebo ne? (Já: rozhodně posílat, i když většina neodpoví. Samotné odeslání je součást metodiky.)
7. „Tvůj primátor" se jménem lídra, nebo jen název subjektu? (Jméno je sdílenější, ale u SPD a Motoristů lídry nikdo nezná.)
8. Název webu: Kompas Praha, Pražský kompas, Praha kompas 2026? Doména?
9. Ton: stejná drzost jako u Českého kompasu, nebo o stupeň mírněji, protože je to týden před volbami a strany budou citlivé?
10. Otázka 20 (kdo spí v parku nebo v metru) je jediná „pořádková" otázka v ose Y a tahá ANO a SPD k domovu. Bez ní by ANO i SPD byly na nule nebo nad ní. Nechat v ose (můj názor: ano, je to skutečné dilema a dělí strany), nebo jen v rozstřelu?
