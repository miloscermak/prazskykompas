// ============================================================
// Pražský kompas 2026: DATA
// Tenhle soubor můžeš upravovat bez znalosti programování.
// Návod je v README.md. Logika se ničeho tady nedotýká.
// ============================================================

// --- Otázky ---
// axis: 1 = Auta/Lidé (X), 2 = Domov/Metropole (Y)
// pole: +1 když souhlas táhne ke kladnému pólu osy (Lidé, Metropole),
//       -1 když souhlas táhne k zápornému pólu (Auta, Domov)
const QUESTIONS = [
  // Osa X: AUTA vs LIDÉ
  { id: 1,  axis: 1, text: "Cyklopruhy na hlavních tazích, jako je magistrála nebo Plzeňská, by měly zmizet.", pole: -1 },
  { id: 2,  axis: 1, text: "Rezidentní parkování za 1 200 korun ročně je skoro zadarmo. Mělo by stát aspoň tolik co roční Lítačka.", pole: 1 },
  { id: 3,  axis: 1, text: "Z Malé Strany a Smetanova nábřeží mají auta nerezidentů zmizet, ať už zákazem vjezdu, nebo mýtem.", pole: 1 },
  { id: 4,  axis: 1, text: "V obytných ulicích mimo hlavní tahy má platit třicítka.", pole: 1 },
  { id: 5,  axis: 1, text: "Když se v ulici nevejde všechno, má ustoupit auto: o pruh míň a místo něj širší chodník nebo cyklopruh.", pole: 1 },
  { id: 6,  axis: 1, text: "Magistrála má být normální městská třída: přechody, stromy, dva pruhy v každém směru. Že se po ní pojede pomaleji, je v pořádku.", pole: 1 },
  { id: 7,  axis: 1, text: "Zácpy se řeší stavbou nových silnic a tunelů. Blanka Praze pomohla, potřebujeme víc takových staveb.", pole: -1 },
  { id: 8,  axis: 1, text: "Parkovací místa na ulicích v centru mají postupně mizet: auta do garáží, místo nich stromy a širší chodníky.", pole: 1 },
  { id: 9,  axis: 1, text: "Dvorecký most je správně jen pro tramvaje, autobusy, kola a pěší. Auta tam nepatří.", pole: 1 },
  { id: 10, axis: 1, text: "Pražan s rezidentní kartou by měl smět parkovat v modré zóně kdekoli v Praze, ne jen ve své čtvrti.", pole: -1 },
  // Osa Y: DOMOV vs METROPOLE
  { id: 11, axis: 2, text: "Praha potřebuje mrakodrapy. Mimo historické centrum klidně i přes sto metrů.", pole: 1 },
  { id: 12, axis: 2, text: "Když se v Praze uvolní pozemek (viz Bubny nebo Nákladové nádraží Žižkov), je lepší na něm udělat park nebo zahrádky než postavit byty.", pole: -1 },
  { id: 13, axis: 2, text: "Airbnb v bytových domech by mělo být zakázané, nebo omezené na pár týdnů v roce.", pole: -1 },
  { id: 14, axis: 2, text: "Večerky v centru by po desáté večer neměly prodávat alkohol.", pole: -1 },
  { id: 15, axis: 2, text: "Turisté mají Praze platit víc: poplatek za nocleh ze současných padesáti korun na dvě stě. A turistické vláčky a hop-on-hop-off autobusy z centra pryč.", pole: -1 },
  { id: 16, axis: 2, text: "Vltavská filharmonie za 12 miliard se má postavit, i kdyby ji Praha zaplatila celou sama.", pole: 1 },
  { id: 17, axis: 2, text: "Kdo chce v Praze stavět, má mít povolení do roka. Když to úřad nestihne, platí automaticky.", pole: 1 },
  { id: 18, axis: 2, text: "Praha má růst: deset tisíc nových bytů ročně, i kdyby to znamenalo hustší zástavbu v mé čtvrti.", pole: 1 },
  { id: 19, axis: 2, text: "Sdílené koloběžky do centra Prahy patří.", pole: 1 },
  { id: 20, axis: 2, text: "Kdo spí v parku nebo v metru, má být strážníky vykázán, i když nemá kam jít.", pole: -1 },
];

// Pevné pořadí otázek (střídání os X a Y, aby nešly za sebou otázky stejné osy)
const ORDER = [1, 11, 2, 12, 3, 13, 4, 14, 5, 15, 6, 16, 7, 17, 8, 18, 9, 19, 10, 20];

// Škála odpovědí (shora dolů na mobilu, zleva doprava na desktopu, klávesy 1–5 ve stejném pořadí):
// od nesouhlasu k souhlasu, aby souhlas byl vpravo
const ANSWER_SCALE = [
  { label: "Rozhodně nesouhlasím",  value: -2 },
  { label: "Spíš nesouhlasím",      value: -1 },
  { label: "Nevím / je mi to jedno", value: 0 },
  { label: "Spíš souhlasím",        value:  1 },
  { label: "Rozhodně souhlasím",    value:  2 },
];

// Rozstřely (mimo skóre): dvě bonusové otázky za sebou.
// `card` je zkrácený popisek na kartičku a výsledkovku.
const SHOOTOUTS = [
  { key: "problem", text: "Co je největší problém Prahy?", card: "Největší problém Prahy", options: [
    { label: "Drahé byty",                        icon: "🏠" },
    { label: "Doprava a parkování",               icon: "🚗" },
    { label: "Feťáci, bezdomovci a nepořádek",    icon: "💉" },
    { label: "Turisté a Airbnb",                  icon: "🧳" },
    { label: "Pomalý magistrát, nic se nestaví",  icon: "🐌" },
  ]},
  { key: "miliardy", text: "Praha má na účtech přes 180 miliard. Co s nimi?", card: "180 miliard na účtech", options: [
    { label: "Utratit za byty",                               icon: "🏗️" },
    { label: "Utratit za okruh a metro",                      icon: "🛣️" },
    { label: "Šetřit dál, velké stavby teprve přijdou",       icon: "🏦" },
    { label: "Vrátit Pražanům: levná MHD a parkování",        icon: "🎟️" },
  ]},
];

// Kvadranty (x = osa Auta/Lidé, y = osa Domov/Metropole)
// nick = město v závorce (jeden řádek k úpravě, kdyby se nehodilo)
// POZOR: popisky (desc) jsou první návrhy, Miloš je zreviduje.
const QUADRANTS = {
  kolo:       { name: "Velkoměsto na kole",      nick: "Paříž",   desc: "Ať to tu žije: tramvaje, kola, kluby, nové čtvrti. Auto je pro tebe věc, kterou si půjčíš na dovolenou." },
  sousedstvi: { name: "Sousedství s tramvají",   nick: "Kodaň",   desc: "Město krátkých vzdáleností: pekárna, školka a tramvaj do deseti minut. Airbnb a pivní kola ať jdou jinam." },
  volant:     { name: "Metropole za volantem",   nick: "Varšava", desc: "Praha má růst, stavět výš a hlavně rychleji. Modré zóny a cyklopruhy jsou brzda, ne vize." },
  klid:       { name: "Klid s parkovacím místem", nick: "Mnichov", desc: "Pořádek, čistota, parkovací místo před domem. Praha nemá experimentovat, má fungovat." },
  center:     { name: "Pražský kompromis",       nick: "",        desc: "Chápeš cyklistu i řidiče, developera i zahrádkáře. Buď jsi moudrý, nebo ses ještě nerozhodl." },
};

// --- Ukládání výsledků (Google Apps Script) ---
// URL webhooku z nasazení apps-script/webhook.gs (návod v README.md).
// Prázdný řetězec = nic se neodesílá (vývojový režim, payload jde do konzole).
const WEBHOOK_URL = "";

// --- Demografický průzkum (dobrovolný, na výsledkovce) ---
// type: "pills" (tlačítka, výchozí) nebo "select" (rozbalovací seznam pro dlouhé výčty)
const DEMOGRAPHICS = [
  { id: "age", label: "Kolik ti je?", options: [
    { value: "u25",   label: "Do 25" },
    { value: "26_40", label: "26–40" },
    { value: "41_60", label: "41–60" },
    { value: "60p",   label: "Přes 60" },
  ]},
  { id: "gender", label: "Jsi…", options: [
    { value: "muz",  label: "Muž" },
    { value: "zena", label: "Žena" },
    { value: "jine", label: "Jiné" },
    { value: "na",   label: "Nechci uvést" },
  ]},
  { id: "district", label: "Kde v Praze bydlíš?", type: "select", options: [
    { value: "",      label: "Vyber…" },
    { value: "p1",  label: "Praha 1" },  { value: "p2",  label: "Praha 2" },  { value: "p3",  label: "Praha 3" },
    { value: "p4",  label: "Praha 4" },  { value: "p5",  label: "Praha 5" },  { value: "p6",  label: "Praha 6" },
    { value: "p7",  label: "Praha 7" },  { value: "p8",  label: "Praha 8" },  { value: "p9",  label: "Praha 9" },
    { value: "p10", label: "Praha 10" }, { value: "p11", label: "Praha 11" }, { value: "p12", label: "Praha 12" },
    { value: "p13", label: "Praha 13" }, { value: "p14", label: "Praha 14" }, { value: "p15", label: "Praha 15" },
    { value: "p16", label: "Praha 16" }, { value: "p17", label: "Praha 17" }, { value: "p18", label: "Praha 18" },
    { value: "p19", label: "Praha 19" }, { value: "p20", label: "Praha 20" }, { value: "p21", label: "Praha 21" },
    { value: "p22", label: "Praha 22" },
    { value: "jinde", label: "Jinde v Praze (malá městská část)" },
    { value: "mimo",  label: "Mimo Prahu" },
  ]},
  { id: "education", label: "Nejvyšší dokončené vzdělání?", options: [
    { value: "zs", label: "Základní" },
    { value: "ss", label: "Střední" },
    { value: "vs", label: "Vysokoškolské" },
  ]},
];

// --- Kandidující subjekty ---
// Každý subjekt "odpověděl" na stejných 20 výroků jako volič (answers: id otázky → -2..+2).
// Jeho bod na mapě se z toho POČÍTÁ stejným vzorcem, nic se nezadává ručně.
// conf = jistota kódování u každé odpovědi:
//   P = je to v programu, V = veřejný výrok lídra/strany, H = hlasování nebo skutek, O = odhad z obecné linie
// source: "program" (naše kódování z programů a výroků) | "autorizováno" (strana poslala vlastní odpovědi)
// shootouts: [index v R1, index v R2]: jak by subjekt odpověděl na rozstřely (pro "Stejně to vidí: ...")
// active: false = subjekt se nikde nezobrazuje a nepočítá (zůstane jen v metodice jako "vypnuto")
// Zdroje a zdůvodnění každé buňky: otazky.md v repu.
const SUBJECTS = [
  {
    key: "spolu", name: "Spolu pro Prahu", full: "Spolu pro Prahu (ODS a TOP 09)", leader: "Tomáš Portlík",
    desc: "ODS a TOP 09. Dáme Praze tempo.", color: "#1450b4", source: "program", shootouts: [4, 2],
    answers: { 1: 1, 2: -1, 3: -2, 4: -1, 5: -1, 6: -1, 7: 2, 8: -1, 9: 0, 10: 2, 11: 1, 12: -1, 13: 0, 14: 1, 15: 1, 16: 1, 17: 2, 18: 2, 19: 0, 20: 1 },
    conf:    { 1: "V", 2: "V", 3: "H", 4: "V", 5: "V", 6: "H", 7: "P", 8: "P", 9: "O", 10: "P", 11: "P", 12: "P", 13: "V", 14: "V", 15: "P", 16: "V", 17: "P", 18: "P", 19: "H", 20: "H" },
  },
  {
    key: "ano", name: "ANO", full: "ANO 2011", leader: "Jan Hušbauer",
    desc: "Peníze Prahy patří Pražanům.", color: "#1a8fb5", source: "program", shootouts: [2, 0],
    answers: { 1: 2, 2: -2, 3: -1, 4: -1, 5: -2, 6: -2, 7: 2, 8: -2, 9: -2, 10: 2, 11: 2, 12: -1, 13: 1, 14: 2, 15: 0, 16: -1, 17: 1, 18: 1, 19: 0, 20: 2 },
    conf:    { 1: "V", 2: "V", 3: "O", 4: "O", 5: "V", 6: "O", 7: "P", 8: "V", 9: "V", 10: "P", 11: "V", 12: "V", 13: "V", 14: "V", 15: "O", 16: "V", 17: "P", 18: "P", 19: "O", 20: "V" },
  },
  {
    key: "pirati", name: "Piráti", full: "Česká pirátská strana", leader: "Tereza Nislerová",
    desc: "Ať to tu žije. Primátorka pro bydlení.", color: "#1c1b33", source: "program", shootouts: [0, 0],
    answers: { 1: -2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: -1, 8: 1, 9: 2, 10: -1, 11: 0, 12: -1, 13: 2, 14: -1, 15: 0, 16: 0, 17: -1, 18: 2, 19: -2, 20: -2 },
    conf:    { 1: "P", 2: "P", 3: "V", 4: "P", 5: "H", 6: "H", 7: "P", 8: "P", 9: "H", 10: "O", 11: "V", 12: "P", 13: "V", 14: "H", 15: "P", 16: "V", 17: "P", 18: "P", 19: "H", 20: "P" },
  },
  {
    key: "stan", name: "STAN", full: "Starostové a nezávislí", leader: "Petr Hlaváček",
    desc: "Autor Metropolitního plánu.", color: "#b45309", source: "program", shootouts: [0, 2],
    answers: { 1: -1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 2, 9: 1, 10: -1, 11: -1, 12: -2, 13: 1, 14: 1, 15: 1, 16: 2, 17: 1, 18: 2, 19: -1, 20: -1 },
    conf:    { 1: "V", 2: "V", 3: "P", 4: "H", 5: "V", 6: "H", 7: "P", 8: "P", 9: "H", 10: "O", 11: "H", 12: "V", 13: "V", 14: "P", 15: "P", 16: "V", 17: "P", 18: "V", 19: "P", 20: "P" },
  },
  {
    key: "prahasobe", name: "Praha sobě", full: "Praha sobě, Zelení a KDU-ČSL", leader: "Adam Scheinherr",
    desc: "Pro Prahu první poslední.", color: "#b3271d", source: "program", shootouts: [0, 0],
    answers: { 1: -1, 2: 0, 3: 1, 4: 2, 5: 1, 6: 2, 7: 0, 8: 1, 9: 2, 10: -1, 11: -2, 12: 1, 13: 2, 14: 1, 15: 2, 16: 1, 17: -1, 18: 0, 19: -1, 20: -1 },
    conf:    { 1: "P", 2: "P", 3: "P", 4: "P", 5: "P", 6: "H", 7: "P", 8: "P", 9: "H", 10: "O", 11: "O", 12: "P", 13: "P", 14: "P", 15: "P", 16: "V", 17: "P", 18: "P", 19: "O", 20: "O" },
  },
  {
    key: "spd", name: "SPD a spol.", full: "SPD, Trikolora, PRO a Přísaha", leader: "Milan Urban",
    desc: "Vyženeme aktivisty z magistrátu.", color: "#6b4f2a", source: "program", shootouts: [2, 3],
    answers: { 1: 1, 2: -2, 3: -2, 4: -1, 5: -1, 6: -2, 7: 2, 8: -1, 9: -1, 10: 1, 11: 2, 12: -2, 13: 1, 14: 1, 15: 1, 16: -2, 17: 2, 18: 2, 19: -1, 20: 2 },
    conf:    { 1: "V", 2: "V", 3: "O", 4: "O", 5: "O", 6: "V", 7: "V", 8: "O", 9: "O", 10: "O", 11: "V", 12: "V", 13: "V", 14: "O", 15: "V", 16: "V", 17: "V", 18: "V", 19: "O", 20: "V" },
  },
  {
    key: "motoriste", name: "Motoristé sobě", full: "Motoristé sobě", leader: "Klára Sovová",
    desc: "My vám Prahu zprůjezdníme.", color: "#374151", source: "program", shootouts: [1, 1],
    answers: { 1: 2, 2: -2, 3: -2, 4: -2, 5: -2, 6: -2, 7: 2, 8: -2, 9: -2, 10: 2, 11: 1, 12: -2, 13: -2, 14: -2, 15: -2, 16: -1, 17: 2, 18: 1, 19: 1, 20: 1 },
    conf:    { 1: "V", 2: "V", 3: "V", 4: "V", 5: "V", 6: "V", 7: "V", 8: "V", 9: "O", 10: "P", 11: "O", 12: "V", 13: "V", 14: "V", 15: "O", 16: "V", 17: "V", 18: "V", 19: "O", 20: "V" },
  },
  {
    key: "sen", name: "SEN pro Prahu", full: "SEN pro Prahu (SEN 21 s podporou HPP 11)", leader: "Václav Láska",
    desc: "Praha nesmí být kulisou pro turisty.", color: "#c2410c", source: "program", shootouts: [3, 0], active: false,
    answers: { 1: -1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: -1, 8: 1, 9: 1, 10: -1, 11: -1, 12: 0, 13: 2, 14: 0, 15: 2, 16: 0, 17: -1, 18: 1, 19: -1, 20: -1 },
    conf:    { 1: "O", 2: "O", 3: "O", 4: "O", 5: "O", 6: "O", 7: "O", 8: "O", 9: "O", 10: "O", 11: "O", 12: "O", 13: "P", 14: "O", 15: "P", 16: "O", 17: "O", 18: "P", 19: "O", 20: "O" },
  },
  {
    key: "levice", name: "Spojená levice", full: "Spojená levice pro Prahu (KSČM, ČSSD a KSČ)", leader: "Petr Vlček",
    desc: "Obecní byty s nákladovým nájemným.", color: "#7f1d1d", source: "program", shootouts: [0, 0], active: false,
    answers: { 1: 1, 2: -2, 3: -1, 4: 0, 5: -1, 6: -1, 7: 1, 8: -1, 9: 0, 10: 1, 11: 0, 12: 1, 13: 2, 14: 1, 15: 1, 16: -2, 17: -2, 18: 1, 19: -1, 20: 0 },
    conf:    { 1: "O", 2: "P", 3: "O", 4: "O", 5: "O", 6: "O", 7: "O", 8: "O", 9: "O", 10: "O", 11: "O", 12: "O", 13: "O", 14: "O", 15: "O", 16: "O", 17: "O", 18: "P", 19: "O", 20: "O" },
  },
  {
    key: "svobodni", name: "Svobodní", full: "Svobodní", leader: "Bedřich Laube",
    desc: "Praha má fungovat a nechat lidi žít.", color: "#15803d", source: "program", shootouts: [4, 2], active: false,
    answers: { 1: 1, 2: -2, 3: -2, 4: -2, 5: -2, 6: -2, 7: 2, 8: -2, 9: -1, 10: 1, 11: 1, 12: -1, 13: -2, 14: -2, 15: -2, 16: -2, 17: 2, 18: 1, 19: 1, 20: 1 },
    conf:    { 1: "O", 2: "P", 3: "P", 4: "P", 5: "O", 6: "O", 7: "P", 8: "P", 9: "O", 10: "O", 11: "O", 12: "O", 13: "O", 14: "O", 15: "O", 16: "O", 17: "O", 18: "P", 19: "O", 20: "P" },
  },
];

// Export pro node (testy); v prohlížeči jsou proměnné globální
if (typeof module !== "undefined") {
  module.exports = { QUESTIONS, ORDER, ANSWER_SCALE, SHOOTOUTS, QUADRANTS, SUBJECTS, DEMOGRAPHICS, WEBHOOK_URL };
}
