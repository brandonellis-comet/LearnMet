# LearnMet

Study tool for the CAF Meteorological Technician occupation transfer.
Live at `https://brandonellis-comet.github.io/LearnMet/` once GitHub Pages is enabled.

## What it does

| Tab | Purpose |
|-----|---------|
| Home | Overall progress, exam status, next lesson, missed-question review |
| Study | 9 domains, 48 topics. Open a lesson, take a quiz, set your level, keep notes |
| Tests | One test per domain. 15 questions, answers shown at the end. Pass mark 75% |
| Exam | Quarterly exam. 40 questions across all domains, weighted by domain size. Timed (elapsed). Pass mark 75% |
| Stats | Attempt history, backup (Export / Import) |

Content: 48 lessons and 240 questions (5 per topic) in `content/`.

## How scoring feeds the tracker

- Topic quiz: 75% or higher sets the topic to Solid. 50 to 74% sets Learning. Below 50% sets Needs review.
- Domain tests and the exam list the topics you missed. One button marks them Needs review.
- Missed questions go into a review pool. A question leaves the pool after two correct answers in a row.

## Study routine

1. Study: read the lesson, write notes, take the topic quiz.
2. Weekly: take a domain test for the domains you finished.
3. Each quarter: take the exam (Q1 Jan-Mar, Q2 Apr-Jun, Q3 Jul-Sep, Q4 Oct-Dec).
4. Review missed questions from Home until the pool is clear.
5. Export from Stats and give the file to Claude to commit as `progress.json`.

## Layout

| Path | Purpose |
|------|---------|
| `index.html`, `css/`, `js/` | The app (no build step, no dependencies) |
| `content/*.json` | Lessons and questions, one file per domain |
| `progress.json` | Committed backup of progress and quiz history |
| `notes/` | Your own notes by domain (`_template.md`) |
| `quizzes/` | Extra question banks you write |
| `reference/` | Cheat sheets (METAR quick reference) |

## Content format

Each domain file: `{ "title", "topics": [ { "title", "lesson", "terms", "questions" } ] }`.
Lesson blocks: a plain string (paragraph), `{ "h" }`, `{ "list" }`, `{ "formula" }`, `{ "note" }`.
Question: `{ "q", "c": [4 choices], "a": index of correct choice, "e": explanation }`. Choices are shuffled when shown.
Topic order must stay the same, because progress is saved by topic position.

## Storage

Progress and quiz history save in the browser (localStorage). It is per device and can be cleared.
Use Export and Import on the Stats page to move or back up. On a fresh browser the app loads the committed `progress.json`.

## Hosting

GitHub Pages: Settings, Pages, Source = Deploy from a branch, branch `main`, folder `/ (root)`.
The app must be served over http. Opening `index.html` directly from a file will not load the content.

## Accuracy

Content was written by Claude as a study aid. It has not been checked against the official CFS Met course, MANOBS, or ECCC/NAV CANADA documents.
Items most likely to differ from official sources: cloud level heights, ECCC alert criteria (they vary by region), TAF and METAR details, model resolutions.
When a lesson disagrees with your course material, trust the course material and correct the lesson file.

## Rules

- Public repo: no personal, operational or classified information. Open sources only.
- Study notes in your own words.
