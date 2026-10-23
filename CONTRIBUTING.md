# Contributing · Contribuer

**[English](#english) · [Français](#français)**

---

## English

Thanks for your interest! By participating you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). Using AI tools? Read the [AI policy](AI_POLICY.md).
Issues and pull requests are welcome in English or French.

### Setup

```bash
corepack enable
yarn install
yarn build   # lint, translations, type check, tests, then dist/mare-tide-card.js
yarn start   # test page at http://localhost:5050/ (?dark&lang=fr&tf=24&width=320&direct&only=editor)
```

Tests use DFO predictions for Halifax recorded in `dev/` (also used by the test page).

### Conventions

* **Interface text**: `src/localize/languages/en.json` is the reference: `yarn lint` checks that every other
  language has the same keys and `{placeholders}`.
* **Documentation** is bilingual, English then French.
* **Commits**: `[Topic] What changed`, one topic each (for example `[Card]`, `[Docs]`, `[Tooling]`).
* **Predictions stay DFO’s, or the integration’s.** The card never adjusts heights or times.

---

## Français

Merci de votre intérêt! En participant, vous acceptez le [code de conduite](CODE_OF_CONDUCT.md). Vous utilisez l’IA? Lisez la [politique sur l’IA](AI_POLICY.md).
Les issues et les demandes de tirage sont bienvenues en anglais ou en français.

### Installation

```bash
corepack enable
yarn install
yarn build   # lint, traductions, vérification des types, tests, puis dist/mare-tide-card.js
yarn start   # page de test sur http://localhost:5050/ (?dark&lang=fr&tf=24&width=320&direct&only=editor)
```

Les tests utilisent des prédictions du MPO pour Halifax enregistrées dans `dev/` (aussi utilisées par la
page de test).

### Conventions

* **Textes de l’interface** : `src/localize/languages/en.json` est la référence : `yarn lint` vérifie que
  chaque autre langue a les mêmes clés et les mêmes `{variables}`.
* **La documentation** est bilingue, l’anglais puis le français.
* **Commits** : `[Sujet] Ce qui a changé`, un sujet par commit (par exemple `[Card]`, `[Docs]`, `[Tooling]`).
* **Les prédictions restent celles du MPO ou de l’intégration.** La carte ne corrige jamais les hauteurs ni les heures.
