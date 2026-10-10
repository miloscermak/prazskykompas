# Odhad výsledku voleb z dat Pražského kompasu

Hlavní stránka webu (`../index.html`) se generuje odsud.

- `odhad.py`: čištění, měkké afinity, raking na Prahu, bootstrap, mandáty → `odhad.json` (zafixovaný výstup, včetně SHA-256 otisku zdrojového exportu)
- `template.html` + `build.py` → `../index.html` (jeden soubor s vloženými daty)
- `data/kompas-export.csv`: export z Google Sheets (stav 10. 10. 2026 ráno). Do veřejného repa nejde (`.gitignore`: `*.csv`), otisk je v `odhad.json`; na vyžádání ho poskytneme.
- `vysledky.json`: doplnit po sečtení (formát v hlavičce `build.py`), pak `python3 build.py`

Spuštění: `python3 odhad.py && python3 build.py` (numpy).
