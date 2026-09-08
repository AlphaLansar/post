#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""POSTE AI — présentation exécutive en PDF (mêmes contenus que le PPTX)."""
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit

W, H = 960, 540  # 13.333 x 7.5 in @ 72dpi
NAVY  = Color(0x0B/255, 0x1F/255, 0x3A/255)
GOLD  = Color(0xC9/255, 0xA2/255, 0x27/255)
INK   = Color(0x1B/255, 0x24/255, 0x30/255)
MUTED = Color(0x5B/255, 0x66/255, 0x75/255)
LIGHT = Color(0xF5/255, 0xF6/255, 0xF8/255)
WHITE = Color(1, 1, 1)
GREYB = Color(0xC9/255, 0xCD/255, 0xD6/255)

OUT = "/home/anonymous/Documents/AI_WORK/POSTE_AI/POSTE_AI_presentation_DG.pdf"
c = canvas.Canvas(OUT, pagesize=(W, H))

F  = "Helvetica"
FB = "Helvetica-Bold"
FI = "Helvetica-Oblique"


def wrap(txt, font, size, maxw):
    return simpleSplit(txt, font, size, maxw)


def para(x, y, txt, font, size, color, maxw, leading=None, align="l"):
    leading = leading or size * 1.3
    c.setFont(font, size)
    c.setFillColor(color)
    for ln in wrap(txt, font, size, maxw):
        if align == "c":
            c.drawCentredString(x, y, ln)
        else:
            c.drawString(x, y, ln)
        y -= leading
    return y


def footer(n):
    c.setFont(F, 8)
    c.setFillColor(MUTED)
    c.drawString(40, 20, "POSTE AI  ·  Prototype de démonstration — Données synthétiques — Version conceptuelle")
    c.drawRightString(W - 40, 20, str(n))


def header(kicker, title):
    c.setFillColor(NAVY); c.rect(0, H - 90, W, 90, stroke=0, fill=1)
    c.setFillColor(GOLD); c.rect(0, H - 93, W, 3, stroke=0, fill=1)
    c.setFont(FB, 10); c.setFillColor(GOLD)
    c.drawString(40, H - 34, kicker.upper())
    c.setFont(FB, 22); c.setFillColor(WHITE)
    c.drawString(40, H - 66, title)


def bullets(x, y, items, maxw):
    for it in items:
        lvl, txt = it if isinstance(it, tuple) else (0, it)
        if lvl == 2:
            y -= 4
            y = para(x, y, txt, FB, 13, NAVY, maxw, leading=18)
            y -= 4
        elif lvl == 1:
            c.setFont(F, 11); c.setFillColor(MUTED); c.drawString(x + 16, y, "–")
            y = para(x + 32, y, txt, F, 11, MUTED, maxw - 32, leading=15)
            y -= 4
        else:
            c.setFont(FB, 13); c.setFillColor(GOLD); c.drawString(x, y, "▸")
            y = para(x + 18, y, txt, F, 13, INK, maxw - 18, leading=17)
            y -= 6
    return y


def content(kicker, title, items=None, two_col=None):
    c.setFillColor(LIGHT); c.rect(0, 0, W, H, stroke=0, fill=1)
    header(kicker, title)
    if two_col:
        (lt, li), (rt, ri) = two_col
        for cx, ct, ci in ((40, lt, li), (500, rt, ri)):
            c.setFillColor(NAVY); c.rect(cx, H - 150, 420, 34, stroke=0, fill=1)
            c.setFont(FB, 12); c.setFillColor(WHITE); c.drawString(cx + 14, H - 138, ct)
            bullets(cx + 6, H - 178, ci, 410)
    else:
        bullets(48, H - 130, items, W - 100)


PAGE = [0]
def newpage():
    c.showPage(); PAGE[0] += 1

def fnum():
    footer(PAGE[0] + 1)

# ---------------------------------------------------------------- 1 Couverture
c.setFillColor(NAVY); c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(GOLD); c.rect(0, 0, 26, H, stroke=0, fill=1)
c.setFillColor(GOLD); c.roundRect(70, H - 150, 62, 62, 8, stroke=0, fill=1)
c.setFont("Times-Bold", 34); c.setFillColor(NAVY); c.drawCentredString(101, H - 133, "P")
c.setFont(FB, 26); c.setFillColor(WHITE); c.drawString(150, H - 118, "POSTE AI")
c.setFont(FB, 11); c.setFillColor(GOLD); c.drawString(151, H - 138, "PLATEFORME D'INTELLIGENCE DÉCISIONNELLE")
c.setFont(FB, 40); c.setFillColor(WHITE)
c.drawString(70, H - 250, "L'intelligence des données")
c.drawString(70, H - 298, "au service de la décision")
para(70, H - 350, "Transformer les données opérationnelles, financières, commerciales et territoriales de "
     "La Poste du Mali en informations exploitables, prévisions et recommandations.",
     F, 13, Color(0.78, 0.83, 0.88), W - 220, leading=19)
c.setFont(FB, 10); c.setFillColor(GOLD)
c.drawString(70, 46, "Prototype de démonstration — Données synthétiques — À présenter à la Direction Générale")
fnum(); newpage()

# ---------------------------------------------------------------- 2
content("Contexte", "Pourquoi maintenant", [
    (2, "Un patrimoine de données riche, mais dispersé"),
    "Les données d'activité, de finance, de logistique et de réseau existent, mais restent cloisonnées et exploitées manuellement.",
    "Le pilotage repose sur des rapports périodiques, tardifs et hétérogènes.",
    "Les signaux faibles (sous-performance d'agence, dérive de coûts, retards logistiques) sont détectés trop tard.",
    (2, "Ce que la Direction attend d'un outil de pilotage"),
    "Voir en temps quasi réel, comprendre les causes, anticiper, et disposer de recommandations actionnables — au même endroit.",
]); fnum(); newpage()

# ---------------------------------------------------------------- 3
c.setFillColor(LIGHT); c.rect(0, 0, W, H, stroke=0, fill=1)
header("Le produit", "Un système d'intelligence décisionnelle")
bullets(48, H - 130, [
    (2, "POSTE AI n'est pas un chatbot"),
    "C'est une plateforme de pilotage pour la Direction Générale et les responsables habilités, avec un assistant IA intégré.",
    "Elle couvre 10 modules : vue générale, performance, agences, courrier & colis, finance, prévisions, risques & alertes, intelligence IA, scénarios, rapports.",
], W - 100)
chain = ["DONNÉES", "ANALYSE", "IA", "PRÉVISION", "RISQUES", "RECOMMAND.", "DÉCISION"]
bw, gap, x0, y0 = 116, 12, 44, 150
for i, s in enumerate(chain):
    xx = x0 + i * (bw + gap)
    col = GOLD if s == "DÉCISION" else NAVY
    c.setFillColor(col); c.rect(xx, y0, bw, 46, stroke=0, fill=1)
    c.setFont(FB, 9); c.setFillColor(NAVY if s == "DÉCISION" else WHITE)
    c.drawCentredString(xx + bw / 2, y0 + 19, s)
    if i < len(chain) - 1:
        c.setFillColor(GOLD); c.setFont(FB, 12)
        c.drawCentredString(xx + bw + gap / 2, y0 + 17, "▶")
c.setFont(FI, 11); c.setFillColor(MUTED)
c.drawString(44, 120, "De la donnée brute à la décision informée — une seule chaîne, un seul outil.")
fnum(); newpage()

# ---------------------------------------------------------------- 4
content("Utilisateurs", "Conçu pour les décideurs", two_col=(
    ("Directions", ["Direction Générale", "Direction des opérations", "Direction financière",
                    "Direction commerciale", "Direction informatique"]),
    ("Réseau & analyse", ["Responsables régionaux", "Responsables d'agences",
                          "Analystes / contrôle de gestion",
                          (1, "Accès par rôle (RBAC) : ADMIN, DIRECTION_GÉNÉRALE, DIRECTION_FINANCIÈRE, DIRECTION_OPÉRATIONS, RESPONSABLE_RÉGIONAL, ANALYSTE")]),
)); fnum(); newpage()

# ---------------------------------------------------------------- 5 Philosophie
c.setFillColor(LIGHT); c.rect(0, 0, W, H, stroke=0, fill=1)
header("Philosophie", "SEE · UNDERSTAND · PREDICT · RECOMMEND · DECIDE")
steps = [
    ("SEE", "Voir ce qui se passe", "KPI consolidés, performance par région et par agence."),
    ("UNDERSTAND", "Comprendre pourquoi", "AI Insights : causes, contributions, tendances."),
    ("PREDICT", "Anticiper", "Prévisions 30 / 90 jours avec intervalle de confiance."),
    ("RECOMMEND", "Recommander", "Actions prioritaires générées et traçables."),
    ("DECIDE", "Décider", "Simulateur de scénarios avant l'arbitrage."),
]
y = H - 135
for k, t, d in steps:
    c.setFillColor(NAVY); c.rect(48, y - 24, 150, 34, stroke=0, fill=1)
    c.setFont(FB, 12); c.setFillColor(GOLD); c.drawCentredString(123, y - 12, k)
    c.setFont(FB, 13); c.setFillColor(NAVY); c.drawString(214, y - 8, t + "  —  ")
    c.setFont(F, 12); c.setFillColor(MUTED); c.drawString(214 + c.stringWidth(t + "  —  ", FB, 13), y - 8, d)
    y -= 62
fnum(); newpage()

# ---------------------------------------------------------------- 6..14 modules
modules = [
 ("Module 01", "Vue générale — Tableau de bord exécutif", [
    "KPI consolidés : chiffre d'affaires, colis, transactions, courrier, agences actives, taux de service.",
    "Graphique d'évolution multi-métriques + performance par région avec badges (Excellent -> Critique).",
    "AI Insights automatiques et panneau d'alertes prioritaires.",
    (1, "En < 10 s : où en est La Poste, ce qui va bien, ce qui pose problème, ce qui risque d'arriver."),
 ]),
 ("Modules 02-03", "Performance & Réseau d'agences", [
    "Analyse par CA, transactions, colis, courrier, dépenses, agents, fréquentation — filtres région / agence / service.",
    "Table de 30 agences : score, croissance, coût, rentabilité, risque, statut.",
    "Fiche agence : score /100, historique, diagnostic IA et recommandations ciblées.",
    (1, "« Nous pouvons descendre jusqu'au niveau opérationnel. »"),
 ]),
 ("Module 04", "Courrier & Colis — Intelligence logistique", [
    "Colis entrants / sortants, livraisons, retards, taux de livraison, délai moyen.",
    "Volumes et délais sur 12 mois, répartition par région, Top 10 des corridors.",
    "Alertes logistiques (ex. corridor Nord : délais anormaux).",
 ]),
 ("Module 05", "Finance — Intelligence financière", [
    "Revenus, dépenses, marge, coûts opérationnels, budget, écart budgétaire.",
    "Revenus vs dépenses, budget vs réalisé, rentabilité par agence.",
    "AI Financial Insights : « les coûts opérationnels progressent plus vite que les revenus dans certaines agences ».",
 ]),
 ("Module 06", "Prévisions — Forecasting & Predictive Intelligence", [
    "Projection du CA, des colis, des transactions et du courrier à 30 et 90 jours.",
    "Intervalle de confiance à 90 % et indicateur de fiabilité du modèle.",
    (1, "Libellé explicite : MODÈLE SIMULÉ — DONNÉES DE DÉMONSTRATION."),
 ]),
 ("Module 07", "Risques & Anomalies", [
    "Matrice probabilité x impact par catégorie (opérationnel, financier, commercial, logistique, réseau).",
    "Détection d'anomalies : valeur attendue vs observée, écart, sévérité.",
    "Alertes prioritaires : date, niveau, objet, impact, statut.",
 ]),
 ("Module 08", "POSTE AI Copilot — Intelligence IA", [
    "Questions en langage naturel : « Quelles agences présentent les plus grands risques ? »",
    "Réponses analytiques : synthèse chiffrée, graphiques intégrés, causes probables, recommandations.",
    (1, "Aide à la décision — pas de décision automatique. Traçabilité et validation humaine."),
 ]),
 ("Module 09", "Decision Simulator — Scénarios", [
    "Leviers : investissement, personnel, horaires, capacité logistique, digitalisation.",
    "Impact estimé sur CA, transactions, colis, coûts et rentabilité, en temps réel.",
    (1, "Simulation indicative basée sur des données synthétiques."),
 ]),
 ("Module 10", "Rapports exécutifs", [
    "Rapports quotidien, hebdomadaire, mensuel, trimestriel.",
    "Aperçu, génération et export PDF (simulés dans le prototype).",
    "Centre de notifications : alertes, anomalies, prévisions, rapports disponibles.",
 ]),
 ("Sécurité", "Accès sécurisé — écran de connexion", [
    "Entrée de la plateforme protégée : identité Direction Générale (P. Haidara) + mot de passe.",
    "Contrôle d'accès par rôle (RBAC), session isolée, déconnexion depuis la barre latérale.",
    (1, "Prototype : authentification simulée. En production : annuaire d'entreprise / SSO + MFA + journal d'audit."),
 ]),
]
for k, t, b in modules:
    content(k, t, b); fnum(); newpage()

# ---------------------------------------------------------------- Architecture
content("Sous le capot", "Architecture cible & sécurité", two_col=(
    ("Chaîne de traitement (Phase 2+)", [
        "Sources -> Data Integration Layer",
        "Data Lake / Data Warehouse (PostgreSQL)",
        "Analytics Engine (KPI, scores, classements)",
        "ML Engine (prévision, anomalies, risques)",
        "AI / LLM Layer (copilote, RAG, explications)",
        "Decision Engine -> Dashboard · Copilot · Reports",
    ]),
    ("Sécurité & IA responsable", [
        "RBAC, moindre privilège, journaux d'audit",
        "Chiffrement, authentification des API, gouvernance",
        "Traçabilité des recommandations, niveau de confiance",
        "Explication des prédictions, validation humaine",
        (1, "Aucune décision critique automatisée sans contrôle humain — DECISION SUPPORT, pas AUTOMATED DECISION MAKER."),
    ]),
)); fnum(); newpage()

# ---------------------------------------------------------------- Roadmap
c.setFillColor(LIGHT); c.rect(0, 0, W, H, stroke=0, fill=1)
header("Trajectoire", "Vision de déploiement")
phases = [
    ("Phase 1", "Prototype", "Maquette sur données synthétiques — validation de la valeur (en cours)."),
    ("Phase 2", "Pilote données réelles", "Un périmètre pilote + Data Warehouse + premiers modèles ML."),
    ("Phase 3", "Connexion aux SI", "Intégration des applications métier, finance, logistique, réseau."),
    ("Phase 4", "Déploiement institutionnel", "Généralisation, formation, exploitation en continu."),
    ("Phase 5", "Prédictif avancé", "Recommandations proactives, LLM + RAG sur le patrimoine de données."),
]
y = H - 135
for i, (p, t, d) in enumerate(phases):
    col = GOLD if i == 0 else NAVY
    c.setFillColor(col); c.rect(48, y - 24, 140, 34, stroke=0, fill=1)
    c.setFont(FB, 11); c.setFillColor(NAVY if i == 0 else WHITE); c.drawCentredString(118, y - 12, p)
    c.setFont(FB, 13); c.setFillColor(NAVY); c.drawString(206, y - 8, t + "  —  ")
    c.setFont(F, 11.5); c.setFillColor(MUTED); c.drawString(206 + c.stringWidth(t + "  —  ", FB, 13), y - 8, d)
    y -= 62
fnum(); newpage()

# ---------------------------------------------------------------- Prochaines étapes
content("Décision attendue", "Prochaines étapes", [
    (2, "Ce que nous proposons"),
    "Valider le principe d'un système d'intelligence décisionnelle pour La Poste du Mali.",
    "Désigner un périmètre pilote (une direction ou une région) et un référent métier.",
    "Donner accès à un premier jeu de données réelles pour la Phase 2.",
    (2, "Ce que la Phase 2 démontrera"),
    "Les mêmes écrans, alimentés par les vrais chiffres, avec prévisions recalées quotidiennement.",
    "Un cadre de gouvernance et de sécurité opérationnel.",
]); fnum(); newpage()

# ---------------------------------------------------------------- Clôture
c.setFillColor(NAVY); c.rect(0, 0, W, H, stroke=0, fill=1)
c.setFillColor(GOLD); c.rect(0, 0, 26, H, stroke=0, fill=1)
c.setFont(FB, 28); c.setFillColor(WHITE)
c.drawString(70, H - 230, "« Voici à quoi pourrait ressembler le futur")
c.drawString(70, H - 268, "système d'intelligence décisionnelle de La Poste du Mali. »")
c.setFont(FB, 12); c.setFillColor(GOLD)
c.drawString(72, H - 320, "POSTE AI — SEE · UNDERSTAND · PREDICT · RECOMMEND · DECIDE")
c.setFont(F, 9); c.setFillColor(Color(0.78, 0.83, 0.88))
c.drawString(72, 46, "Prototype de démonstration — Données synthétiques — Aucune donnée réelle de La Poste du Mali.")
fnum()
c.showPage()
c.save()
print("OK ->", OUT, "|", PAGE[0] + 1, "pages")
