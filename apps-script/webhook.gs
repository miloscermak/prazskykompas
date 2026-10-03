/**
 * Pražský kompas 2026: Apps Script webhook
 *
 * Co tenhle skript dělá:
 *   doPost(e): přijme JSON z webu a zapíše řádek do Google Sheets.
 *               Dva typy zpráv:
 *                 type: "result": hotový výsledek testu (zapíše nový řádek)
 *                 type: "demo":   dobrovolná demografie (doplní existující řádek
 *                                  podle submission_id)
 *   doGet(e):  vrátí JSON s počtem uložených výsledků.
 *
 * Fork webhooku Českého kompasu (v2). Zapisuje do listu "praha" ve stejné
 * tabulce (SPREADSHEET_ID níž), takže data Českého kompasu zůstávají netknutá.
 * Pokud chceš samostatnou tabulku, vytvoř prázdný Sheet a přepiš SPREADSHEET_ID.
 *
 * NASAZENÍ (nový projekt, cca 5 minut):
 *   1. script.google.com → New project → vlož celý tento soubor.
 *   2. Zkontroluj SPREADSHEET_ID.
 *   3. Deploy → New deployment → Web app, Execute as: Me, Who has access: Anyone.
 *   4. Vygenerovanou URL vlož do data.js jako WEBHOOK_URL a pushni.
 *   5. V editoru spusť testSubmission() a zkontroluj, že se v tabulce objevil
 *      list "praha" s jedním testovacím řádkem (pak ho smaž).
 *
 * Neukládá se nic osobního: žádné IP adresy, žádná jména, žádné cookies.
 */

// ════════════════════════════════════════════════════════════════════════
// CONFIG
// ════════════════════════════════════════════════════════════════════════

const SPREADSHEET_ID = '1unsS3-o_t-V5ej9KyX-v90b59p-nkX0PDXymHF9-qvI'; // tabulka Českého kompasu; list "praha" se vytvoří sám
const SHEET_NAME = 'praha';

// Pořadí sloupců MUSÍ odpovídat appendRow v processResult níž
const SHEET_HEADERS = [
  'submission_id', 'timestamp',
  'score_auta_lide', 'score_domov_metropole',
  'quadrant', 'subject', 'leader', 'match', 'problem', 'miliardy',
  'duration_sec', 'answers_json',
  'age', 'gender', 'district', 'education',
  'user_agent', 'version',
];

// ════════════════════════════════════════════════════════════════════════
// HTTP HANDLERS
// ════════════════════════════════════════════════════════════════════════

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const result = (payload.type === 'demo')
      ? processDemo(payload)
      : processResult(payload);
    return jsonResponse({ ok: true, ...result });
  } catch (err) {
    console.error('doPost error:', err);
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  try {
    const sheet = getSheet();
    return jsonResponse({ ok: true, count: Math.max(0, sheet.getLastRow() - 1) });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ════════════════════════════════════════════════════════════════════════
// ZPRACOVÁNÍ
// ════════════════════════════════════════════════════════════════════════

function processResult(payload) {
  const scores = payload.scores;
  if (!Array.isArray(scores) || scores.length !== 2
      || scores.some(function (s) { return typeof s !== 'number' || s < -20 || s > 20; })) {
    throw new Error('Neplatné skóre.');
  }

  const row = [
    String(payload.submissionId || '').slice(0, 16),
    payload.timestamp || new Date().toISOString(),
    scores[0], scores[1],
    String(payload.quadrant || '').slice(0, 50),
    String(payload.subject || '').slice(0, 50),
    String(payload.leader || '').slice(0, 50),
    Number(payload.match) || '',
    String(payload.problem || '').slice(0, 50),
    String(payload.miliardy || '').slice(0, 50),
    Number(payload.durationSec) || '',
    JSON.stringify(payload.answers || {}).slice(0, 2000),
    '', '', '', '',                              // demografie se doplní později
    String(payload.userAgent || '').slice(0, 200),
    String(payload.version || '').slice(0, 10),
  ];

  getSheet().appendRow(row);
  return { saved: 'result' };
}

// Doplní demografii k dřív zapsanému řádku (hledá submission_id v 1. sloupci)
function processDemo(payload) {
  const id = String(payload.submissionId || '').slice(0, 16);
  if (!id) throw new Error('Chybí submission_id.');

  const sheet = getSheet();
  const finder = sheet.getRange(2, 1, Math.max(1, sheet.getLastRow() - 1), 1)
    .createTextFinder(id).matchEntireCell(true).findNext();
  if (!finder) throw new Error('Záznam nenalezen.');

  const rowIndex = finder.getRow();
  const col = function (name) { return SHEET_HEADERS.indexOf(name) + 1; };
  const clean = function (v) { return String(v || '').slice(0, 20); };

  sheet.getRange(rowIndex, col('age')).setValue(clean(payload.age));
  sheet.getRange(rowIndex, col('gender')).setValue(clean(payload.gender));
  sheet.getRange(rowIndex, col('district')).setValue(clean(payload.district));
  sheet.getRange(rowIndex, col('education')).setValue(clean(payload.education));

  return { saved: 'demo' };
}

// ════════════════════════════════════════════════════════════════════════
// SHEET I/O
// ════════════════════════════════════════════════════════════════════════

function getSheet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(SHEET_HEADERS);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ════════════════════════════════════════════════════════════════════════
// LOCAL TEST: spustit ručně z editoru pro ověření zápisu
// ════════════════════════════════════════════════════════════════════════

function testSubmission() {
  const fake = {
    type: 'result',
    submissionId: 'test' + new Date().getTime().toString(36).slice(-4),
    version: 'test',
    timestamp: new Date().toISOString(),
    durationSec: 123,
    scores: [8, 0],
    quadrant: 'Velkoměsto na kole',
    subject: 'STAN',
    leader: 'Petr Hlaváček',
    match: 82,
    problem: 'Drahé byty',
    miliardy: 'Utratit za byty',
    answers: { 1: 2, 2: -1, 3: 0 },
    userAgent: 'apps-script-test/praha',
  };
  console.log(processResult(fake));
  console.log(processDemo({ type: 'demo', submissionId: fake.submissionId, age: '41_60', gender: 'muz', district: 'p7', education: 'vs' }));
}
