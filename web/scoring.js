// ============================================================
// Pražský kompas 2026: SKÓROVÁNÍ (čistá logika bez DOM)
// Funkce jsou testovatelné v node (viz test.js).
// ============================================================

// Spočítá skóre na 2 osách z odpovědí.
// answers: objekt { idOtázky: hodnota -2..+2 }
// Vrací pole [x, y]: x = Auta/Lidé, y = Domov/Metropole, každá -20 až +20.
function computeScores(answers, questions) {
  const scores = [0, 0];
  for (const q of questions) {
    const a = answers[q.id];
    if (typeof a === "number") {
      scores[q.axis - 1] += a * q.pole;
    }
  }
  return scores;
}

// Bod subjektu na mapě: počítá se z jeho odpovědí stejným vzorcem jako u voliče.
function subjectScores(subject, questions) {
  return computeScores(subject.answers, questions);
}

// Seřadí subjekty podle euklidovské vzdálenosti ve 2D od bodu uživatele.
// match = round(100 × (1 - d / MAX_DIST)), kde MAX_DIST je úhlopříčka mapy.
function findMatches(scores, subjects, questions) {
  const MAX_DIST = Math.sqrt(2 * 40 * 40); // ≈ 56,57 (úhlopříčka čtverce 40×40)
  return subjects
    .map((s) => {
      const sc = subjectScores(s, questions);
      const d = Math.sqrt(sc.reduce((sum, v, i) => sum + (v - scores[i]) ** 2, 0));
      return {
        key: s.key, name: s.name, full: s.full, leader: s.leader, desc: s.desc, color: s.color,
        source: s.source, shootouts: s.shootouts,
        scores: sc, dist: d, match: Math.round(100 * (1 - d / MAX_DIST)),
      };
    })
    .sort((a, b) => a.dist - b.dist || a.name.localeCompare(b.name, "cs"));
}

// Určí kvadrant podle os X a Y.
// Když je |skóre| na obou osách <= 4, je to střed ("Pražský kompromis").
function getQuadrant(scores, quadrants) {
  const x = scores[0];
  const y = scores[1];
  if (Math.abs(x) <= 4 && Math.abs(y) <= 4) return quadrants.center;
  if (x >= 0 && y >= 0) return quadrants.kolo;        // Lidé + Metropole
  if (x >= 0 && y < 0) return quadrants.sousedstvi;   // Lidé + Domov
  if (x < 0 && y >= 0) return quadrants.volant;       // Auta + Metropole
  return quadrants.klid;                              // Auta + Domov
}

// Subjekty, které na rozstřel odpověděly stejně jako uživatel (pro "Stejně to vidí: ...")
function sameShootout(shootoutIndex, optionIndex, subjects) {
  return subjects.filter((s) => s.shootouts && s.shootouts[shootoutIndex] === optionIndex);
}

// --- Kódování výsledku do URL (?r=...) ---
// 2 skóre (posunutá o +20 do rozsahu 0..40) + index v rozstřelu 1 + index v rozstřelu 2 → base64 (URL-safe)

function toBase64(str) {
  if (typeof btoa === "function") return btoa(str);
  return Buffer.from(str, "binary").toString("base64");
}

function fromBase64(str) {
  if (typeof atob === "function") return atob(str);
  return Buffer.from(str, "base64").toString("binary");
}

function encodeResult(scores, s1, s2) {
  const bytes = scores.map((s) => s + 20).concat([s1, s2]);
  const raw = String.fromCharCode(...bytes);
  return toBase64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Vrací { scores, s1, s2 } nebo null, když je řetězec neplatný.
// limits = počet možností v rozstřelech (výchozí 5 a 4 podle SHOOTOUTS).
function decodeResult(code, limits) {
  const lim = limits || [5, 4];
  try {
    const b64 = code.replace(/-/g, "+").replace(/_/g, "/");
    const raw = fromBase64(b64);
    if (raw.length !== 4) return null;
    const bytes = Array.from(raw, (c) => c.charCodeAt(0));
    const scores = bytes.slice(0, 2).map((b) => b - 20);
    const s1 = bytes[2];
    const s2 = bytes[3];
    if (scores.some((s) => s < -20 || s > 20)) return null;
    if (s1 < 0 || s1 >= lim[0]) return null;
    if (s2 < 0 || s2 >= lim[1]) return null;
    return { scores, s1, s2 };
  } catch (e) {
    return null;
  }
}

// Export pro node (testy); v prohlížeči jsou funkce globální
if (typeof module !== "undefined") {
  module.exports = { computeScores, subjectScores, findMatches, getQuadrant, sameShootout, encodeResult, decodeResult };
}
