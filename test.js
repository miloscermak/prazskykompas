// ============================================================
// Pražský kompas 2026: testy dat, skórování a párování
// Spuštění: node test.js
// ============================================================

const { QUESTIONS, ORDER, SHOOTOUTS, QUADRANTS, SUBJECTS, DEMOGRAPHICS } = require("./data.js");
const S = require("./scoring.js");

let failed = 0;
let passed = 0;

function assertEq(actual, expected, msg) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
    console.log("  OK  " + msg);
  } else {
    failed++;
    console.log("  FAIL " + msg);
    console.log("       očekáváno: " + e);
    console.log("       dostáno:   " + a);
  }
}

// Pomocník: odpověď se stejnou hodnotou na všechny otázky
function allAnswers(value) {
  const a = {};
  for (const q of QUESTIONS) a[q.id] = value;
  return a;
}

console.log("Integrita dat:");
assertEq(QUESTIONS.length, 20, "20 otázek");
assertEq(ORDER.length, 20, "pořadí má 20 položek");
assertEq([...ORDER].sort((x, y) => x - y), QUESTIONS.map((q) => q.id).sort((x, y) => x - y), "pořadí obsahuje každou otázku právě jednou");
assertEq(QUESTIONS.every((q) => q.pole === 1 || q.pole === -1), true, "každá otázka má pole +1 nebo -1");
assertEq([1, 2].map((ax) => QUESTIONS.filter((q) => q.axis === ax).length), [10, 10], "10 otázek na každou osu");
const axisOf = (id) => QUESTIONS.find((q) => q.id === id).axis;
assertEq(ORDER.every((id, i) => i === 0 || axisOf(id) !== axisOf(ORDER[i - 1])), true, "v pořadí se osy střídají (žádné dvě stejné za sebou)");
assertEq(QUESTIONS.filter((q) => q.axis === 1 && q.pole === -1).map((q) => q.id), [1, 7, 10], "osa X má obrácené výroky 1, 7, 10");
assertEq(QUESTIONS.filter((q) => q.axis === 2 && q.pole === -1).map((q) => q.id), [12, 13, 14, 15, 20], "osa Y má obrácené výroky 12, 13, 14, 15, 20");
assertEq(SHOOTOUTS.length, 2, "2 rozstřelové otázky");
assertEq(SHOOTOUTS[0].options.length, 5, "největší problém má 5 možností");
assertEq(SHOOTOUTS[1].options.length, 4, "180 miliard má 4 možnosti");
assertEq(Object.keys(QUADRANTS).sort(), ["center", "klid", "kolo", "sousedstvi", "volant"], "pět kvadrantů (čtyři + střed)");
assertEq(DEMOGRAPHICS.find((d) => d.id === "district").options.length, 25, "městské části: Praha 1 až 22 + jinde + mimo + prázdná volba");

console.log("\nSubjekty:");
assertEq(SUBJECTS.length, 10, "10 kandidujících subjektů");
assertEq(new Set(SUBJECTS.map((s) => s.key)).size, SUBJECTS.length, "klíče subjektů jsou unikátní");
const ids = QUESTIONS.map((q) => q.id);
assertEq(SUBJECTS.every((s) => ids.every((id) => typeof s.answers[id] === "number" && s.answers[id] >= -2 && s.answers[id] <= 2)), true, "každý subjekt má odpověď -2..+2 na všech 20 otázek");
assertEq(SUBJECTS.every((s) => ids.every((id) => ["P", "V", "H", "O"].includes(s.conf[id]))), true, "každá odpověď má jistotu P/V/H/O");
assertEq(SUBJECTS.every((s) => Array.isArray(s.shootouts) && s.shootouts[0] >= 0 && s.shootouts[0] < 5 && s.shootouts[1] >= 0 && s.shootouts[1] < 4), true, "každý subjekt má platné odpovědi na oba rozstřely");
assertEq(SUBJECTS.every((s) => /^#[0-9a-f]{6}$/i.test(s.color)), true, "každý subjekt má barvu");
assertEq(SUBJECTS.every((s) => ["program", "autorizováno"].includes(s.source)), true, "zdroj kódování je program nebo autorizováno");
const active = SUBJECTS.filter((s) => s.active !== false);
assertEq(["spolu", "ano", "pirati", "stan", "prahasobe", "spd", "motoriste"].every((k) => active.some((s) => s.key === k)), true, "sedm hlavních subjektů je vždy aktivních");
assertEq(active.every((s) => Object.values(s.conf).filter((c) => c !== "O").length >= 10), true, "aktivní subjekt má aspoň polovinu odpovědí bez odhadu (kritérium z metodiky)");
// Kontrola proti kódovací tabulce v otazky.md (verze 0.3)
const sc = (key) => S.subjectScores(SUBJECTS.find((s) => s.key === key), QUESTIONS);
assertEq(sc("spolu"), [-12, 4], "Spolu [-12, 4]");
assertEq(sc("ano"), [-18, -1], "ANO [-18, -1]");
assertEq(sc("pirati"), [17, 1], "Piráti [17, 1]");
assertEq(sc("stan"), [9, 3], "STAN [9, 3]");
assertEq(sc("prahasobe"), [11, -8], "Praha sobě [11, -8]");
assertEq(sc("spd"), [-14, 0], "SPD [-14, 0]");
assertEq(sc("motoriste"), [-20, 11], "Motoristé [-20, 11]");
assertEq(sc("sen"), [10, -5], "SEN [10, -5]");
assertEq(sc("levice"), [-9, -9], "Spojená levice [-9, -9]");
assertEq(sc("svobodni"), [-17, 9], "Svobodní [-17, 9]");

console.log("\nSkórování:");
// Očekávání spočítané ručně ze sloupce "pole" v datech:
// osa X: poles -1+1+1+1+1+1-1+1+1-1 = +4 → ×2 = +8
// osa Y: poles +1-1-1-1-1+1+1+1+1-1 =  0 → ×2 =  0
assertEq(S.computeScores(allAnswers(2), QUESTIONS), [8, 0], "samé 'Rozhodně souhlasím' → [8, 0]");
assertEq(S.computeScores(allAnswers(-2), QUESTIONS), [-8, 0], "samé 'Rozhodně nesouhlasím' → opačná znaménka");
assertEq(S.computeScores(allAnswers(0), QUESTIONS), [0, 0], "samé 'Nevím' → nuly");
// Reverse scoring: souhlas s otázkou 1 (cyklopruhy pryč, pole -1) táhne k Autům
assertEq(S.computeScores({ 1: 2 }, QUESTIONS), [-2, 0], "souhlas s otázkou 1 → X = -2 (reverse scoring)");
// Reverse scoring na ose Y: souhlas s otázkou 13 (Airbnb zakázat, pole -1) táhne k Domovu
assertEq(S.computeScores({ 13: 2 }, QUESTIONS), [0, -2], "souhlas s otázkou 13 → Y = -2 (reverse scoring)");
// Krajní hodnoty: obě osy dosažitelné v plném rozsahu -20 až +20
const proLide = {};
QUESTIONS.filter((q) => q.axis === 1).forEach((q) => (proLide[q.id] = 2 * q.pole));
assertEq(S.computeScores(proLide, QUESTIONS)[0], 20, "odpovědi po směru pólů → X = +20 (mapa pokrytá do kraje)");
const proMetropole = {};
QUESTIONS.filter((q) => q.axis === 2).forEach((q) => (proMetropole[q.id] = 2 * q.pole));
assertEq(S.computeScores(proMetropole, QUESTIONS)[1], 20, "odpovědi po směru pólů → Y = +20 (mapa pokrytá do kraje)");

console.log("\nTvůj primátor:");
const pirati = SUBJECTS.find((s) => s.key === "pirati");
const exact = S.findMatches(S.subjectScores(pirati, QUESTIONS), SUBJECTS, QUESTIONS);
assertEq(exact[0].key, "pirati", "přesná shoda skóre → nejbližší je ten subjekt");
assertEq(exact[0].match, 100, "přesná shoda → 100 %");
assertEq(exact[0].leader, "Tereza Nislerová", "výsledek nese jméno lídra");
assertEq(exact.length, SUBJECTS.length, "vrací pořadí všech subjektů");
const far = S.findMatches([20, 20], SUBJECTS, QUESTIONS);
assertEq(far.every((m, i) => i === 0 || m.dist >= far[i - 1].dist), true, "výsledky seřazené podle vzdálenosti");
// Ruční kontrola procenta: bod [0,0] vs STAN [9,3] → d = sqrt(90), max = sqrt(3200)
const origin = S.findMatches([0, 0], SUBJECTS, QUESTIONS);
const stan = origin.find((m) => m.key === "stan");
assertEq(stan.match, Math.round(100 * (1 - Math.sqrt(90) / Math.sqrt(3200))), "výpočet procenta shody podle vzorce");

console.log("\nRozstřely:");
assertEq(S.sameShootout(0, 0, SUBJECTS).map((s) => s.key), ["pirati", "stan", "prahasobe", "levice"], "'Drahé byty' říkají Piráti, STAN, Praha sobě, Levice");
assertEq(S.sameShootout(1, 2, SUBJECTS).map((s) => s.key), ["spolu", "stan", "svobodni"], "'Šetřit dál' říkají Spolu, STAN, Svobodní");

console.log("\nKvadranty:");
assertEq(S.getQuadrant([10, 10], QUADRANTS).name, "Velkoměsto na kole", "Lidé + Metropole");
assertEq(S.getQuadrant([10, -10], QUADRANTS).name, "Sousedství s tramvají", "Lidé + Domov");
assertEq(S.getQuadrant([-10, 10], QUADRANTS).name, "Metropole za volantem", "Auta + Metropole");
assertEq(S.getQuadrant([-10, -10], QUADRANTS).name, "Klid s parkovacím místem", "Auta + Domov");
assertEq(S.getQuadrant([4, -4], QUADRANTS).name, "Pražský kompromis", "|X| <= 4 a |Y| <= 4 → střed");
assertEq(S.getQuadrant([4, 10], QUADRANTS).name, "Velkoměsto na kole", "|X| <= 4, ale |Y| > 4 → není střed");

console.log("\nKódování výsledku do URL:");
const code = S.encodeResult([8, 0], 3, 1);
assertEq(S.decodeResult(code), { scores: [8, 0], s1: 3, s2: 1 }, "encode → decode vrátí totéž");
const code2 = S.encodeResult([-20, -20], 0, 0);
assertEq(S.decodeResult(code2), { scores: [-20, -20], s1: 0, s2: 0 }, "krajní hodnoty projdou");
const code3 = S.encodeResult([20, 20], 4, 3);
assertEq(S.decodeResult(code3), { scores: [20, 20], s1: 4, s2: 3 }, "horní krajní hodnoty projdou");
assertEq(S.decodeResult(S.encodeResult([0, 0], 5, 0)), null, "index rozstřelu mimo rozsah → null");
assertEq(S.decodeResult(S.encodeResult([0, 0], 0, 4)), null, "index druhého rozstřelu mimo rozsah → null");
assertEq(S.decodeResult("nesmysl!!!"), null, "neplatný řetězec → null");
assertEq(S.decodeResult(""), null, "prázdný řetězec → null");
assertEq(code.includes("+") || code.includes("/") || code.includes("="), false, "kód je URL-safe");

console.log("\n" + passed + " prošlo, " + failed + " selhalo");
process.exit(failed > 0 ? 1 : 0);
