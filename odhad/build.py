#!/usr/bin/env python3
"""Sestaví ../index.html (hlavní stránku webu) z template.html + odhad.json (+ volitelně vysledky.json se skutečnými výsledky).

vysledky.json (doplnit po sečtení):
{
  "shares": {"Spolu pro Prahu": 0.0, "ANO": 0.0, "Piráti": 0.0, "STAN": 0.0, "Praha sobě": 0.0, "SPD a spol.": 0.0, "Motoristé sobě": 0.0},
  "seats":  {"Spolu pro Prahu": 0, ...},
  "turnout": 0.0,
  "source": "volby.cz, 10. 10. 2026",
  "comment": "volitelný komentář (HTML)"
}
"""
import json, os, re
HERE=os.path.dirname(os.path.abspath(__file__))
d=json.load(open(f"{HERE}/odhad.json",encoding="utf-8"))
vp=f"{HERE}/vysledky.json"
if os.path.exists(vp):
    d["actual"]=json.load(open(vp,encoding="utf-8"))
tpl=open(f"{HERE}/template.html",encoding="utf-8").read()
data=json.dumps(d,ensure_ascii=False).replace("</","<\\/")
html=tpl.replace("__DATA__",data)
REDIRECT='<script>if(/(^|[?&])r=/.test(location.search))location.replace("/kompas/"+location.search);</script>\n'
site_html=html.replace("<head>\n","<head>\n"+REDIRECT,1)
open(f"{HERE}/../index.html","w",encoding="utf-8").write(site_html)   # hlavní stránka webu
# varianta pro artefakt (bez vlastní kostry dokumentu)
inner=re.sub(r"^.*?<head>\s*","",html,flags=re.S)
inner=re.sub(r"<meta charset[^>]*>\s*|<meta name=\"viewport\"[^>]*>\s*","",inner)
inner=inner.replace("</head>\n<body>","").replace("</body>\n</html>","")
open(f"{HERE}/artifact.html","w",encoding="utf-8").write(inner.strip()+"\n")
print("ok, actual =", "ano" if d["actual"] else "ne", "| ../index.html", len(site_html)//1024, "kB")
