// Simulace: projede mřížku možných výsledků (obě osy -20..20, krok 1)
// a spočítá, jak často každý subjekt vyhrává jako "tvůj primátor" a v jakém kvadrantu sedí.
// Spuštění: node sim.js
const { QUESTIONS, SUBJECTS: ALL, QUADRANTS } = require("./data.js");
const S = require("./scoring.js");

// Simuluje se jen to, co se zobrazuje (active: false v data.js subjekt vypne)
const SUBJECTS = ALL.filter((s) => s.active !== false);
const off = ALL.filter((s) => s.active === false).map((s) => s.name);
if (off.length) console.log("Vypnuté subjekty (active: false): " + off.join(", ") + "\n");

const wins = {};
SUBJECTS.forEach((s) => (wins[s.key] = 0));
let total = 0;

for (let x = -20; x <= 20; x++)
  for (let y = -20; y <= 20; y++) {
    const m = S.findMatches([x, y], SUBJECTS, QUESTIONS)[0];
    wins[m.key]++;
    total++;
  }

console.log("Podíl výher jako 'tvůj primátor' (mřížka " + total + " bodů):");
Object.entries(wins)
  .sort((a, b) => b[1] - a[1])
  .forEach(([key, n]) => {
    const s = SUBJECTS.find((g) => g.key === key);
    const sc = S.subjectScores(s, QUESTIONS);
    const q = S.getQuadrant(sc, QUADRANTS).name;
    console.log(
      (100 * n / total).toFixed(1).padStart(5) + " %  " +
      s.name.padEnd(18) + JSON.stringify(sc).padEnd(12) + q
    );
  });

// Pokrytí kvadrantů subjekty
console.log("\nSubjekty podle kvadrantu (X = Auta/Lidé, Y = Domov/Metropole):");
const byQuad = {};
SUBJECTS.forEach((s) => {
  const sc = S.subjectScores(s, QUESTIONS);
  const q = S.getQuadrant(sc, QUADRANTS).name;
  (byQuad[q] = byQuad[q] || []).push(s.name + " [" + sc + "]");
});
Object.entries(byQuad).forEach(([q, names]) => {
  console.log("\n" + q + " (" + names.length + "):");
  names.forEach((n) => console.log("  " + n));
});

// Nejbližší dvojice subjektů (hlídá "dvojčata")
console.log("\nNejbližší dvojice subjektů:");
const pairs = [];
for (let i = 0; i < SUBJECTS.length; i++)
  for (let j = i + 1; j < SUBJECTS.length; j++) {
    const a = S.subjectScores(SUBJECTS[i], QUESTIONS), b = S.subjectScores(SUBJECTS[j], QUESTIONS);
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    pairs.push({ d, label: SUBJECTS[i].name + " × " + SUBJECTS[j].name });
  }
pairs.sort((a, b) => a.d - b.d).slice(0, 5).forEach((p) => console.log("  " + p.d.toFixed(1).padStart(5) + "  " + p.label));

// Podíl odhadů (O) v kódování každého subjektu
console.log("\nPodíl odhadů v kódování (čím víc, tím víc by pomohl dotazník straně):");
SUBJECTS.forEach((s) => {
  const vals = Object.values(s.conf);
  const o = vals.filter((c) => c === "O").length;
  console.log("  " + s.name.padEnd(18) + o + "/" + vals.length + " odhadů (" + s.source + ")");
});
