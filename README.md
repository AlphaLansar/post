# POSTE AI — Plateforme d'Intelligence Décisionnelle

> **Prototype de démonstration — Données synthétiques — Version conceptuelle**
> Aucune donnée réelle de La Poste du Mali. Destiné à une présentation à la Direction Générale.

POSTE AI est un **système d'intelligence décisionnelle** (avec assistant IA intégré, ce n'est pas un chatbot)
qui transforme des données opérationnelles, financières, commerciales et territoriales en
**informations exploitables, prévisions et recommandations**.

`Data → Analyse → IA → Prévision → Détection des risques → Recommandation → Décision`

## Démo en ligne

Après activation de GitHub Pages : **https://alphalansar.github.io/post/**

## Modules

| # | Module | Contenu |
|---|--------|---------|
| 01 | Vue générale | Tableau de bord exécutif, KPI consolidés, AI Insights, alertes prioritaires |
| 02 | Performance | CA, transactions, colis, courrier, dépenses, agents, fréquentation — filtres région/agence/service |
| 03 | Agences | Intelligence du réseau (30 agences), score, rentabilité, risque + fiche agence détaillée avec diagnostic IA |
| 04 | Courrier & Colis | Intelligence logistique : volumes, délais, top 10 corridors, alertes |
| 05 | Finance | Revenus/dépenses, marge, budget vs réalisé, rentabilité par agence, AI Financial Insights |
| 06 | Prévisions | Forecasting 30 j / 90 j avec intervalle de confiance (modèle simulé) |
| 07 | Risques & Alertes | Matrice probabilité × impact, détection d'anomalies, alertes |
| 08 | Intelligence IA | POSTE AI Copilot — questions en langage naturel, réponses analytiques |
| 09 | Scénarios | Decision Simulator — sliders d'investissement/personnel/logistique/digitalisation |
| 10 | Rapports | Rapports exécutifs (quotidien → trimestriel), génération / export simulés |
| — | Réseau postal | Carte schématique du réseau |
| — | Vision de déploiement | Roadmap Phase 1 → 5 et architecture cible |
| — | À propos | Objectif, périmètre, données, hypothèses, limites |

## Stack

React 19 · TypeScript · Vite · Tailwind CSS · Recharts · Lucide · React Router (HashRouter).

Aucun backend : données synthétiques déterministes + moteur analytique simulé (scores, prévisions,
détection d'anomalies, copilote). Architecture prévue pour la Phase 2 : PostgreSQL → API → Data
Warehouse → ML → LLM/RAG.

## Développement

```bash
npm install
npm run dev      # http://localhost:5173/post/
npm run build    # bundle de production dans dist/
npm run preview
```

## Architecture du code

```
src/
  config/      pondérations du moteur analytique, navigation, métadonnées produit
  types/       types du domaine
  data/        rng · regions · dataset (générateur) · narrative (insights, alertes, rapports)
  services/    analytics · forecasting · risk · anomaly · ai/copilot
  lib/         formatage FR / FCFA
  components/  ui · kpi · charts · cards · AIChat · Layout
  pages/       Landing + 13 pages
```

Les pondérations (score de performance, score de risque, seuils, horizons de prévision) sont
centralisées dans `src/config/weights.ts` pour être ajustées sans toucher au code métier.

## Déploiement

Push sur `main` → GitHub Actions build + publie sur GitHub Pages
(voir `.github/workflows/deploy.yml`). Activer une fois : *Settings → Pages → Source : GitHub Actions*.
