# Agent instructions

For AI coding assistants (Claude Code, GitHub Copilot, Codex, Cursor and others) working in this repository.
People should start with [CONTRIBUTING.md](CONTRIBUTING.md).

## What this is

A Home Assistant dashboard card (Lit and TypeScript, bundled by Rollup, distributed through HACS) that draws
the tide curve and labels every high and low. It reads the [Mare](https://github.com/olivierouellet/Mare)
integration's tide level sensor, or downloads DFO predictions directly (Canadian stations only).

## Before you finish

```bash
corepack enable && yarn install   # once
yarn build                        # lint, translations, type check, tests, then dist/mare-tide-card.js
```

`yarn build` must pass; CI runs the same, plus HACS validation. For a visible change, look at it with
`yarn start` (`http://localhost:5050/?dark&lang=fr&tf=24&width=320&direct&only=editor`) in light and dark, and at 320 px.

## Conventions

* **English first.** Every document is bilingual, English section first; a change users see goes in both.
* `src/localize/languages/en.json` is the reference: `yarn lint` checks that every other language (fr, es,
  es-419, nl, nb) has the same keys and `{placeholders}`. Add every string to all of them.
* Tests use the DFO predictions for Halifax recorded in `dev/`, never the network.
* The predictions are DFO's or the integration's: never adjust heights or times.
* Nothing from the network is inserted as HTML: no `unsafeHTML` or `innerHTML`; let Lit escape the text.
* `dist/` is never committed; the release workflow builds `mare-tide-card.js` from the tag and attaches it.
* A release bumps `package.json` and `CARD_VERSION` in `src/const.ts` in a `[Card]` commit, then a GitHub
  release tagged `vX.Y.Z`.

## Commits and publishing

* Commit titles read `[Topic] What changed`, one topic per commit. Topics in use: `[Card]`, `[Tests]`, `[Tooling]`, `[Docs]`.
* **Never commit, push, tag, publish a release, or open an issue or pull request unless asked.** Approval for
  one of these is not approval for the next.
* `main` is protected against force-pushes and deletion: never rewrite history that is already pushed.
* Never post comments on issues or pull requests on the user's behalf without their review.

## AI policy

This project follows its [AI policy](AI_POLICY.md): a person reviews and understands every change, no
autonomous contributions, and nothing is posted on someone's behalf without their review.
