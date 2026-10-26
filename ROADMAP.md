# LearnMet Roadmap

## Purpose

Naval Communicators know where information lives and which publication holds it. The problem is finding one excerpt across four or five pubs while the work waits.

LearnMet aims to do that for meteorology: a study centre and quick reference that helps junior and senior meteorologists learn, and gives them something to look back on. Long term, it should be a civilian-level aid anyone can use.

Rules that do not change:
- Public, unclassified sources only.
- Link to publications. Do not copy their text (Crown copyright).
- Every claim traces to a named source.
- Study aid only. Not for operational decisions.

## Phase 1: Make the content trustworthy

Status: in progress. Observations, Codes, Severe, Foundations, Wind, Moisture, Air masses and Synoptic checked 2026-10-26 (see `VERIFICATION.md`). One domain remains.

- [x] Lessons in Observations, Codes, Severe, Foundations, Wind, Moisture, Air masses and Synoptic show the sources checked and the items not confirmed. Other domains still to do.
- [ ] Check every lesson against MANOBS, MANAIR, the TC AIM MET chapter, the NAV CANADA guide and ECCC pages.
- [x] Rewrite the warning-criteria lesson and questions around the Impact Guides (done 2026-10-26).
- [ ] Get review from working Met Techs or forecasters. Use the CFS Met course as a check once enrolled, and keep course material itself out of this repo.
- [ ] Show an edition date and "last verified" date on each lesson.

## Phase 2: "Where is it" index

The core idea. Answers "where does the standard say X?"

- [ ] Search box across lessons, terms and a pub index.
- [ ] Index entries: topic, publication, section, public link.
- [ ] Glossary with the source for each definition.
- [ ] Quick-reference sheets (METAR, TAF, cloud types, units) with sources.

## Phase 3: Working tools

- [ ] METAR/TAF decoder: paste any report, see the plain-language version (reuse the drill logic).
- [ ] Calculators: crosswind and headwind, dew point and RH, LCL, ISA, unit conversions.
- [ ] Skew-T plotter from a pasted sounding.
- [ ] Flight category checker.

## Phase 4: Live data and visuals (later)

Same idea as IdahoArea for HF propagation: one page that gathers the data and explains it.

- [ ] Station page: current METAR and TAF, raw and decoded, with trend graphs.
- [ ] Charts, radar and satellite with plain-language "how to read this" notes.
- [ ] Lessons that link to live examples ("this is a cold front on today's analysis").
- [ ] Two-way links with the weather-engine repo: its map shows the live weather, LearnMet explains what you are looking at.
- [ ] Share the decoder code between the two repos.

Open question: confirm which ECCC open data sources can be read from a browser page, and their limits, before building. NAV CANADA has no open feed that we know of.

## Phase 5: Beyond one user

- [ ] Accounts or shared progress; instructor view.
- [ ] Contributions and review through GitHub.
- [ ] English and French.
- [ ] Accessibility and mobile polish.
- [ ] Offline use.

## Phase 6: Governance

- [ ] Add a clear study-aid disclaimer in the app.
- [ ] Choose licences for code and content.
- [ ] Check with chain of command or Public Affairs before presenting it publicly as related to the CAF. No CAF or DND crests or branding.
- [ ] Re-check all external links on a schedule.

## Order of work

1. Phase 1 (accuracy and sources)
2. Phase 2 (index)
3. Phase 3 (tools)
4. Phase 4 (live data), once the weather-engine is where you want it
5. Phases 5 and 6 as the audience grows. Phase 6 items on the disclaimer and chain of command come before any public launch.
