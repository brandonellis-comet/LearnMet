# LearnMet

Study repository for the CAF Meteorological Technician occupation transfer.

## Layout

| Path | Purpose |
|------|---------|
| `index.html` | Study tracker web app (9 domains, confidence level and notes per topic) |
| `progress.json` | Saved tracker progress (committed copy) |
| `notes/` | One markdown file per domain, digitized from notebooks |
| `quizzes/` | Question banks by domain |
| `reference/` | Cheat sheets and quick references |

## Routine

1. Open the tracker. Set each topic: Not started, Learning, Solid, Needs review.
2. Study a topic. Write notes in `notes/<domain>.md` using `notes/_template.md`.
3. Quiz on the topic. Add missed questions to `quizzes/`.
4. Weekly: export progress from the tracker, send to Claude, commit as `progress.json`.

## Tracker storage

The tracker saves to the browser (localStorage). That is per device and can be cleared.
Export/Import moves progress between devices and into this repo.
On a fresh browser with no saved data, the tracker loads the committed `progress.json`.

## Hosting

Enable GitHub Pages: Settings, Pages, Source = Deploy from a branch, branch `main`, folder `/ (root)`.
The tracker is then served at `https://brandonellis-comet.github.io/LearnMet/`.

## Rules

- Public repo: no personal, operational or classified information. Open sources only.
- Study notes in your own words.
