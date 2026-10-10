#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Pražský kompas 2026: odhad výsledku komunálních voleb z dat kompasu.

Vstup:  data/kompas-export.csv (export z Google Sheets)
Výstup: odhad.json (zafixovaná čísla s časovým razítkem), použitý dashboardem.

Vrstvy odhadu:
  A  "Co říká kompas"            : nejbližší subjekt, bez vážení (jen bydlící v Praze, vyčištěno)
  A2 "Kompas, měkké afinity"     : každý respondent rozdělen mezi subjekty podle vzdálenosti
  B  "Kompas převážený na Prahu" : měkké afinity + raking na věk × pohlaví × vzdělání × zóna
                                   jen respondenti, kteří vyplnili demografii (HLAVNÍ ODHAD)
  B2 "B s dopočtenou demografií" : demografie u zbytku imputována z nejpodobnějších respondentů
  B3 "B s 20D vzdáleností"       : jako B, ale vzdálenost přes všech 20 odpovědí místo 2D mapy
  C  "Kompas + průzkumy"         : B smíchané s průměrem zveřejněných průzkumů (jen pro srovnání)
"""
import csv, json, math, hashlib, datetime, random
from collections import Counter, defaultdict
import numpy as np

random.seed(2026); np.random.seed(2026)

HERE = __import__("os").path.dirname(__import__("os").path.abspath(__file__))
SRC = f"{HERE}/data/kompas-export.csv"

# ---------------------------------------------------------------- data.js (opsáno 1:1)
QUESTIONS = [
  (1,1,-1),(2,1,1),(3,1,1),(4,1,1),(5,1,1),(6,1,1),(7,1,-1),(8,1,1),(9,1,1),(10,1,-1),
  (11,2,1),(12,2,-1),(13,2,-1),(14,2,-1),(15,2,-1),(16,2,1),(17,2,1),(18,2,1),(19,2,1),(20,2,-1),
]
QTEXT = {
 1:"Cyklopruhy na hlavních tazích by měly zmizet.",
 2:"Rezidentní parkování má stát aspoň tolik co roční Lítačka.",
 3:"Auta nerezidentů mají z Malé Strany a nábřeží zmizet.",
 4:"V obytných ulicích má platit třicítka.",
 5:"Když se nevejde všechno, má ustoupit auto.",
 6:"Magistrála má být normální městská třída.",
 7:"Zácpy se řeší novými silnicemi a tunely.",
 8:"Parkovací místa v centru mají postupně mizet.",
 9:"Dvorecký most je správně bez aut.",
 10:"Rezidentní karta má platit v celé Praze.",
 11:"Praha potřebuje mrakodrapy.",
 12:"Na uvolněném pozemku raději park než byty.",
 13:"Airbnb v bytových domech zakázat nebo omezit.",
 14:"Večerky v centru po desáté bez alkoholu.",
 15:"Turisté mají platit víc (200 Kč za noc).",
 16:"Vltavskou filharmonii postavit, i kdyby ji Praha platila sama.",
 17:"Stavební povolení do roka, jinak platí automaticky.",
 18:"Deset tisíc bytů ročně, i za cenu hustší zástavby.",
 19:"Sdílené koloběžky do centra patří.",
 20:"Kdo spí v parku nebo v metru, má být vykázán.",
}
SUBJECTS = {
 "Spolu pro Prahu": {"color":"#1450b4","key":"spolu","answers":{1:1,2:-1,3:-2,4:-1,5:-1,6:-1,7:2,8:-1,9:0,10:2,11:1,12:-1,13:0,14:1,15:1,16:1,17:2,18:2,19:0,20:1}},
 "ANO":             {"color":"#1a8fb5","key":"ano","answers":{1:2,2:-2,3:-1,4:-1,5:-2,6:-2,7:2,8:-2,9:-2,10:2,11:2,12:-1,13:1,14:2,15:0,16:-1,17:1,18:1,19:0,20:2}},
 "Piráti":          {"color":"#1c1b33","key":"pirati","answers":{1:-2,2:2,3:2,4:2,5:2,6:2,7:-1,8:1,9:2,10:-1,11:0,12:-1,13:2,14:-1,15:0,16:0,17:-1,18:2,19:-2,20:-2}},
 "STAN":            {"color":"#b45309","key":"stan","answers":{1:-1,2:1,3:1,4:1,5:1,6:1,7:1,8:2,9:1,10:-1,11:-1,12:-2,13:1,14:1,15:1,16:2,17:1,18:2,19:-1,20:-1}},
 "Praha sobě":      {"color":"#b3271d","key":"prahasobe","answers":{1:-1,2:0,3:1,4:2,5:1,6:2,7:0,8:1,9:2,10:-1,11:-2,12:1,13:2,14:1,15:2,16:1,17:-1,18:0,19:-1,20:-1}},
 "SPD a spol.":     {"color":"#6b4f2a","key":"spd","answers":{1:1,2:-2,3:-2,4:-1,5:-1,6:-2,7:2,8:-1,9:-1,10:1,11:2,12:-2,13:1,14:1,15:1,16:-2,17:2,18:2,19:-1,20:2}},
 "Motoristé sobě":  {"color":"#374151","key":"motoriste","answers":{1:2,2:-2,3:-2,4:-2,5:-2,6:-2,7:2,8:-2,9:-2,10:2,11:1,12:-2,13:-2,14:-2,15:-2,16:-1,17:2,18:1,19:1,20:1}},
}
PARTIES = list(SUBJECTS.keys())
P = len(PARTIES)

def scores(ans):
    s=[0,0]
    for qid,axis,pole in QUESTIONS:
        a=ans.get(qid)
        if isinstance(a,(int,float)): s[axis-1]+=a*pole
    return s

SUBJ_XY = np.array([scores(SUBJECTS[p]["answers"]) for p in PARTIES], dtype=float)      # (P,2)
SUBJ_20 = np.array([[SUBJECTS[p]["answers"][q] for q,_,_ in QUESTIONS] for p in PARTIES], dtype=float)  # (P,20)

# ---------------------------------------------------------------- cílové struktury (pražský elektorát)
# Zdroje a předpoklady viz metodika v dashboardu. Hodnoty jsou podíly VOLIČŮ (po korekci na účast).
TARGET_AGE   = {"u25":0.055, "26_40":0.215, "41_60":0.340, "60p":0.390}
TARGET_GEN   = {"muz":0.475, "zena":0.525}
TARGET_EDU   = {"zs":0.10, "ss":0.52, "vs":0.38}
ZONE_OF = {**{f"p{i}":"centrum" for i in (1,2,3,7)},
           **{f"p{i}":"vnitrni" for i in (4,5,6,8,9,10)},
           **{f"p{i}":"sidliste" for i in (11,12,13,14,15,17,18)},
           **{f"p{i}":"okraj" for i in (16,19,20,21,22)}, "jinde":"okraj"}
ZONE_POP = {"centrum":199, "vnitrni":605, "sidliste":335, "okraj":208}  # tis. obyvatel, přibližně
_zs=sum(ZONE_POP.values()); TARGET_ZONE={k:v/_zs for k,v in ZONE_POP.items()}
ZONE_LABEL = {"centrum":"Centrum (P1, 2, 3, 7)","vnitrni":"Vnitřní město (P4, 5, 6, 8, 9, 10)",
              "sidliste":"Sídliště a vnější čtvrti (P11 až 15, 17, 18)","okraj":"Okraj a malé MČ (P16, 19 až 22, jinde)"}

# průzkumy z rešerše (reserse.md), pro vrstvu C
POLLS = {
  "Median (31. 8. až 3. 9.)": {"ANO":23.3,"STAN":22.6,"Spolu pro Prahu":13.9,"Praha sobě":12.9,"Piráti":10.8,"SPD a spol.":5.4,"Motoristé sobě":5.0},
  "Ipsos pro ODS (srpen)":    {"Spolu pro Prahu":23.4,"STAN":17.9,"ANO":17.6,"Piráti":11.9,"Praha sobě":11.9},
}
RESULTS_2022 = {"Spolu pro Prahu":24.72,"ANO":19.34,"Piráti":17.73,"Praha sobě":14.73,"STAN":7.77,"SPD a spol.":5.17,"Motoristé sobě":2.29}
RESULTS_PS2025_PRAHA = {"Spolu pro Prahu":33.94,"ANO":19.90,"Piráti":16.85,"STAN":13.37,"SPD a spol.":5.24,"Motoristé sobě":5.16}

# ---------------------------------------------------------------- načtení a čištění
rows=list(csv.DictReader(open(SRC,encoding="utf-8")))
N_RAW=len(rows)
clean=[]; drop=Counter()
for r in rows:
    ans={int(k):v for k,v in json.loads(r["answers_json"]).items()}
    dur=int(r["duration_sec"] or 0)
    if dur and dur<20: drop["pod 20 sekund"]+=1; continue
    if len(set(ans.values()))==1: drop["všechny odpovědi stejné"]+=1; continue
    if r["district"]=="mimo": drop["bydlí mimo Prahu"]+=1; continue
    r["ans"]=ans; r["xy"]=scores(ans)
    clean.append(r)
N_CLEAN=len(clean)

def has_demo(r): return bool(r["age"] and r["education"] and r["district"] and r["gender"] in ("muz","zena"))
demo=[r for r in clean if has_demo(r)]
nodemo=[r for r in clean if not has_demo(r)]

# ---------------------------------------------------------------- afinity
XY = np.array([r["xy"] for r in clean],dtype=float)
A20 = np.array([[r["ans"].get(q,0) for q,_,_ in QUESTIONS] for r in clean],dtype=float)
D2 = np.linalg.norm(XY[:,None,:]-SUBJ_XY[None,:,:],axis=2)       # (N,P)
D20 = np.linalg.norm(A20[:,None,:]-SUBJ_20[None,:,:],axis=2)

def soft(D, tau):
    W=np.exp(-(D-D.min(axis=1,keepdims=True))/tau)
    return W/W.sum(axis=1,keepdims=True)

def calibrate_tau(D, target_top=0.55):
    lo,hi=0.1,50.0
    for _ in range(60):
        mid=(lo+hi)/2
        top=soft(D,mid).max(axis=1).mean()
        if top>target_top: lo=mid
        else: hi=mid
    return (lo+hi)/2
TAU2=calibrate_tau(D2); TAU20=calibrate_tau(D20)
S2=soft(D2,TAU2); S20=soft(D20,TAU20)
HARD=np.zeros_like(S2); HARD[np.arange(len(clean)),D2.argmin(axis=1)]=1
idx={id(r):i for i,r in enumerate(clean)}

# ---------------------------------------------------------------- raking
def rake(recs, cap=8.0, iters=60):
    """Vrátí váhy (sum = len(recs)) srovnané na věk, pohlaví, vzdělání, zónu. Ořez na cap, pak znovu."""
    n=len(recs); w=np.ones(n)
    dims=[("age",TARGET_AGE,[r["age"] for r in recs]),
          ("gender",TARGET_GEN,[r["gender"] for r in recs]),
          ("education",TARGET_EDU,[r["education"] for r in recs]),
          ("zone",TARGET_ZONE,[ZONE_OF.get(r["district"],"okraj") for r in recs])]
    for it in range(iters):
        for name,target,vals in dims:
            vals_a=np.array(vals)
            for cat,share in target.items():
                m=(vals_a==cat)
                cur=w[m].sum()
                if cur>0: w[m]*=share*n/cur
        w=np.minimum(w,cap*w.mean())
        w*=n/w.sum()
    return w

def kish(w): return w.sum()**2/(w**2).sum()

def shares(mat, w=None):
    w=np.ones(len(mat)) if w is None else w
    s=(mat*w[:,None]).sum(axis=0); return 100*s/s.sum()

def dhondt(shares_pct, seats=65, threshold=5.0):
    elig={p:v for p,v in shares_pct.items() if v>=threshold}
    out={p:0 for p in shares_pct}
    for _ in range(seats):
        best=max(elig,key=lambda p: elig[p]/(out[p]+1)); out[best]+=1
    return out

def dist(vec): return {p:round(float(v),2) for p,v in zip(PARTIES,vec)}

# ---- A, A2 (celý vyčištěný vzorek, bez vážení)
A_hard=shares(HARD); A_soft=shares(S2)

# ---- B (jen s demografií)
di=np.array([idx[id(r)] for r in demo])
wB=rake(demo)
B=shares(S2[di],wB); B_hard=shares(HARD[di],wB); B3=shares(S20[di],wB)
B_unweighted=shares(S2[di])

# ---- B2: imputace demografie z 10 nejpodobnějších respondentů (podle 20 odpovědí)
def impute(nodemo_recs, donors, k=10):
    Dn=np.array([[r["ans"].get(q,0) for q,_,_ in QUESTIONS] for r in nodemo_recs],dtype=float)
    Dd=np.array([[r["ans"].get(q,0) for q,_,_ in QUESTIONS] for r in donors],dtype=float)
    out=[]
    for i,r in enumerate(nodemo_recs):
        d=np.linalg.norm(Dd-Dn[i],axis=1)
        nn=np.argsort(d)[:k]; donor=donors[int(np.random.choice(nn))]
        rr=dict(r); rr["age"]=donor["age"]; rr["gender"]=donor["gender"]; rr["education"]=donor["education"]; rr["district"]=donor["district"]
        out.append(rr)
    return out
# dárci: i ti, co bydlí mimo Prahu (aby imputace mohla někoho vyřadit) -> vezmeme z původních řádků
donors=[r for r in rows if r["age"] and r["education"] and r["district"] and r["gender"] in ("muz","zena")]
for r in donors:
    if "ans" not in r: r["ans"]={int(k):v for k,v in json.loads(r["answers_json"]).items()}
imp=impute(nodemo,donors)
imp_in=[r for r in imp if r["district"]!="mimo"]
allB2=demo+imp_in
di2=np.array([idx[id(clean[idx[id(r)]])] if id(r) in idx else None for r in demo])  # placeholder (nepoužito)
# matice afinit pro B2: pro demo řádky máme index, pro imputované najdeme původní řádek podle submission_id
sid2i={r["submission_id"]:idx[id(r)] for r in clean}
di_all=np.array([sid2i[r["submission_id"]] for r in allB2])
wB2=rake(allB2)
B2=shares(S2[di_all],wB2)

# ---- bootstrap pro B (90 % interval) a A
def boot(recs, mat_idx, mat, weighted, n_boot=600):
    n=len(recs); res=[]
    for _ in range(n_boot):
        pick=np.random.randint(0,n,n)
        sub=[recs[i] for i in pick]
        w=rake(sub) if weighted else None
        res.append(shares(mat[mat_idx[pick]],w))
    res=np.array(res)
    return np.percentile(res,5,axis=0), np.percentile(res,95,axis=0)
B_lo,B_hi=boot(demo,di,S2,True)
A_lo,A_hi=boot(clean,np.arange(len(clean)),S2,False,300)
B2_lo,B2_hi=boot(allB2,di_all,S2,True,300)

# ---- C: B smíchané s průzkumy (jen pro srovnání)
poll_avg={p:float(np.mean([v[p] for v in POLLS.values() if p in v])) for p in PARTIES}
poll_sum=sum(poll_avg.values()); poll_other=100-poll_sum
Bd=dict(zip(PARTIES,B))
C={}
for p in PARTIES:
    cov=Bd[p]/poll_avg[p]; wk=min(cov,1/cov)
    C[p]=wk*Bd[p]+(1-wk)*poll_avg[p]
# ostatní subjekty z průzkumů, přeškálovat na 100
scale=(100-poll_other)/sum(C.values()); C={p:v*scale for p,v in C.items()}

# ---------------------------------------------------------------- popisné statistiky (vážené B)
def wcount(recs,w,key):
    c=defaultdict(float)
    for r,wi in zip(recs,w): c[key(r)]+=wi
    tot=sum(c.values()); return {k:round(100*v/tot,1) for k,v in sorted(c.items(),key=lambda kv:-kv[1])}
def quadrant(xy):
    x,y=xy
    if abs(x)<=4 and abs(y)<=4: return "Pražský kompromis"
    if x>=0 and y>=0: return "Velkoměsto na kole"
    if x>=0 and y<0: return "Sousedství s tramvají"
    if x<0 and y>=0: return "Metropole za volantem"
    return "Klid s parkovacím místem"
quad_raw=wcount(clean,np.ones(len(clean)),lambda r:quadrant(r["xy"]))
quad_w=wcount(demo,wB,lambda r:quadrant(r["xy"]))
problem_raw=wcount(clean,np.ones(len(clean)),lambda r:r["problem"]); problem_w=wcount(demo,wB,lambda r:r["problem"])
mil_raw=wcount(clean,np.ones(len(clean)),lambda r:r["miliardy"]); mil_w=wcount(demo,wB,lambda r:r["miliardy"])

# souhlas s výroky: podíl souhlasících (1,2) raw vs vážený
agree=[]
for q,axis,pole in QUESTIONS:
    raw=np.array([r["ans"].get(q,0) for r in clean]); dm=np.array([r["ans"].get(q,0) for r in demo])
    agree.append({"id":q,"text":QTEXT[q],"axis":axis,
                  "agree_raw":round(100*float((raw>0).mean()),1),"disagree_raw":round(100*float((raw<0).mean()),1),
                  "agree_w":round(100*float(((dm>0)*wB).sum()/wB.sum()),1),"disagree_w":round(100*float(((dm<0)*wB).sum()/wB.sum()),1),
                  "mean_raw":round(float(raw.mean()),2),"mean_w":round(float((dm*wB).sum()/wB.sum()),2)})

# vzorek vs. Praha
def dist_of(recs,key,cats):
    c=Counter(key(r) for r in recs); n=sum(c[k] for k in cats)
    return {k:round(100*c[k]/n,1) for k in cats}
sample_vs={
  "age":{"sample":dist_of(demo,lambda r:r["age"],list(TARGET_AGE)),"target":{k:round(100*v,1) for k,v in TARGET_AGE.items()},
         "labels":{"u25":"do 25","26_40":"26 až 40","41_60":"41 až 60","60p":"přes 60"}},
  "gender":{"sample":dist_of(demo,lambda r:r["gender"],list(TARGET_GEN)),"target":{k:round(100*v,1) for k,v in TARGET_GEN.items()},
         "labels":{"muz":"muži","zena":"ženy"}},
  "education":{"sample":dist_of(demo,lambda r:r["education"],list(TARGET_EDU)),"target":{k:round(100*v,1) for k,v in TARGET_EDU.items()},
         "labels":{"zs":"základní","ss":"střední","vs":"vysokoškolské"}},
  "zone":{"sample":dist_of(demo,lambda r:ZONE_OF.get(r["district"],"okraj"),list(TARGET_ZONE)),"target":{k:round(100*v,1) for k,v in TARGET_ZONE.items()},
         "labels":ZONE_LABEL},
}
# kdo má nejblíž podle skupin (nevážené, jen demo)
by_group={}
for dim,cats in (("age",list(TARGET_AGE)),("gender",list(TARGET_GEN)),("education",list(TARGET_EDU))):
    by_group[dim]={}
    for c in cats:
        sel=np.array([i for i,r in zip(di,demo) if r[dim]==c])
        if len(sel): by_group[dim][c]={"n":int(len(sel)),"shares":dist(shares(S2[sel]))}
# po městských částech (nevážené, soft), jen kde n>=15
by_district={}
for d in sorted(set(r["district"] for r in demo)):
    sel=np.array([i for i,r in zip(di,demo) if r["district"]==d])
    if len(sel)>=15: by_district[d]={"n":int(len(sel)),"shares":dist(shares(S2[sel])),"xy":[round(float(XY[sel,0].mean()),1),round(float(XY[sel,1].mean()),1)]}

# denní objem
per_day=Counter(r["timestamp"][:10] for r in rows)

# průměrná váha po skupinách (pro transparenci)
wstats={}
for dim,key in (("age",lambda r:r["age"]),("gender",lambda r:r["gender"]),("education",lambda r:r["education"]),("zone",lambda r:ZONE_OF.get(r["district"],"okraj"))):
    acc=defaultdict(list)
    for r,wi in zip(demo,wB): acc[key(r)].append(wi)
    wstats[dim]={k:round(float(np.mean(v)),2) for k,v in acc.items()}

# ---------------------------------------------------------------- výstup
def pack(vec,lo=None,hi=None):
    out={}
    for i,p in enumerate(PARTIES):
        out[p]={"share":round(float(vec[i]),1)}
        if lo is not None: out[p]["lo"]=round(float(lo[i]),1); out[p]["hi"]=round(float(hi[i]),1)
    return out

estimates={
 "A":  {"name":"Co říká kompas","desc":"Nejbližší subjekt, nevážené, všichni bydlící v Praze po vyčištění.","n":N_CLEAN,"shares":pack(A_hard),"seats":dhondt(dict(zip(PARTIES,A_hard)))},
 "A2": {"name":"Kompas, měkké afinity","desc":"Každý respondent rozdělen mezi subjekty podle vzdálenosti na mapě, nevážené.","n":N_CLEAN,"shares":pack(A_soft,A_lo,A_hi),"seats":dhondt(dict(zip(PARTIES,A_soft)))},
 "B":  {"name":"Kompas převážený na Prahu","desc":"Měkké afinity, jen respondenti s demografií, převážené na strukturu pražského elektorátu (věk, pohlaví, vzdělání, část Prahy).","n":len(demo),"neff":round(float(kish(wB))),"shares":pack(B,B_lo,B_hi),"seats":dhondt(dict(zip(PARTIES,B))),"headline":True},
 "B2": {"name":"B s dopočtenou demografií","desc":"Jako B, ale respondentům bez demografie je dopočtena z deseti nejpodobnějších (podle odpovědí). Citlivostní zkouška.","n":len(allB2),"neff":round(float(kish(wB2))),"shares":pack(B2,B2_lo,B2_hi),"seats":dhondt(dict(zip(PARTIES,B2)))},
 "B3": {"name":"B přes 20 odpovědí","desc":"Jako B, ale vzdálenost k subjektům měřená přes všech 20 odpovědí, ne přes 2D mapu.","n":len(demo),"shares":pack(B3),"seats":dhondt(dict(zip(PARTIES,B3)))},
 "Bh": {"name":"B s tvrdým přiřazením","desc":"Jako B, ale každý respondent celý nejbližšímu subjektu (bez měkkých afinit).","n":len(demo),"shares":pack(B_hard),"seats":dhondt(dict(zip(PARTIES,B_hard)))},
 "C":  {"name":"Kompas + průzkumy","desc":"B smíchané s průměrem zveřejněných průzkumů; váha kompasu u každé strany podle toho, jak moc se s průzkumy shoduje. Jen pro srovnání.","n":len(demo),"shares":pack(np.array([C[p] for p in PARTIES])),"seats":dhondt(dict(C)),"other":round(poll_other,1)},
}
out={
 "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds"),
 "source_sha256": hashlib.sha256(open(SRC,"rb").read()).hexdigest(),
 "source_rows": N_RAW, "first_ts": min(r["timestamp"] for r in rows), "last_ts": max(r["timestamp"] for r in rows),
 "cleaning": {"dropped":dict(drop),"kept":N_CLEAN,"with_demo":len(demo),"without_demo":len(nodemo),"imputed_in_prague":len(imp_in)},
 "parties": PARTIES, "colors": {p:SUBJECTS[p]["color"] for p in PARTIES},
 "subject_xy": {p:[float(x) for x in SUBJ_XY[i]] for i,p in enumerate(PARTIES)},
 "tau": {"xy":round(float(TAU2),2),"q20":round(float(TAU20),2),"target_top_prob":0.55,
         "mean_top_prob_xy":round(float(S2.max(axis=1).mean()),3)},
 "targets": {"age":TARGET_AGE,"gender":TARGET_GEN,"education":TARGET_EDU,"zone":TARGET_ZONE,"zone_label":ZONE_LABEL},
 "weights": {"cap":8,"mean_by_group":wstats,"max":round(float(wB.max()),2),"min":round(float(wB.min()),2)},
 "sample_vs_prague": sample_vs,
 "estimates": estimates,
 "B_unweighted_demo_only": dist(B_unweighted),
 "polls": POLLS, "poll_avg": {p:round(v,1) for p,v in poll_avg.items()}, "results_2022": RESULTS_2022, "results_ps2025_praha": RESULTS_PS2025_PRAHA,
 "quadrants": {"raw":quad_raw,"weighted":quad_w},
 "problem": {"raw":problem_raw,"weighted":problem_w}, "miliardy": {"raw":mil_raw,"weighted":mil_w},
 "agree": agree, "by_group": by_group, "by_district": by_district,
 "per_day": dict(sorted(per_day.items())),
 "actual": None,
}
json.dump(out,open(f"{HERE}/odhad.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)

# konzolový souhrn
print(f"řádků {N_RAW}, po čištění {N_CLEAN} (vyřazeno {dict(drop)}), s demografií {len(demo)}, imputováno v Praze {len(imp_in)}")
print(f"tau2={TAU2:.2f} tau20={TAU20:.2f}  Kish n_eff B={kish(wB):.0f} (z {len(demo)}), B2={kish(wB2):.0f}; max váha {wB.max():.2f}")
print(f"{'strana':16s} {'A':>6s} {'A2':>6s} {'B':>6s} {'B lo':>6s} {'B hi':>6s} {'B2':>6s} {'B3':>6s} {'Bh':>6s} {'C':>6s} {'polls':>6s} {'2022':>6s}")
for i,p in enumerate(PARTIES):
    print(f"{p:16s} {A_hard[i]:6.1f} {A_soft[i]:6.1f} {B[i]:6.1f} {B_lo[i]:6.1f} {B_hi[i]:6.1f} {B2[i]:6.1f} {B3[i]:6.1f} {B_hard[i]:6.1f} {C[p]:6.1f} {poll_avg[p]:6.1f} {RESULTS_2022[p]:6.1f}")
print("mandáty B:",estimates["B"]["seats"])
print("váhy:",wstats)
