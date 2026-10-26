(() => {
"use strict";

// ---------- Config ----------
const DOMAINS = ["foundations", "wind", "moisture", "airmass", "synoptic", "severe", "obs", "codes", "applied"];
const PASS = 75;            // pass mark, percent
const TOPIC_QUIZ_LEN = 6;
const DOMAIN_TEST_LEN = 15; // questions per domain test
const EXAM_LEN = 40;        // questions per quarterly exam
const LEVELS = [
  { id: "none", label: "Not started" },
  { id: "learning", label: "Learning" },
  { id: "solid", label: "Solid" },
  { id: "review", label: "Needs review" }
];
const KEYS = { progress: "learnmet-progress-v1", quiz: "learnmet-quiz-v1" };

// ---------- DOM helper ----------
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  if (props) {
    for (const [k, v] of Object.entries(props)) {
      if (v == null || v === false) continue;
      if (k === "class") e.className = v;
      else if (k === "text") e.textContent = v;
      else if (k === "value") e.value = v;
      else if (k.startsWith("on")) e[k] = v;
      else if (v === true) e.setAttribute(k, "");
      else e.setAttribute(k, v);
    }
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    e.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
  }
  return e;
}

// ---------- Storage ----------
const mem = {};
function lsGet(k) {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return mem[k] ?? null; }
}
function lsSet(k, v) {
  try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { mem[k] = v; flash("Browser storage unavailable. Use Export on the Stats page."); }
}
let progress = lsGet(KEYS.progress) || {};
let quiz = lsGet(KEYS.quiz) || { attempts: [], q: {} };
if (!Array.isArray(quiz.attempts)) quiz.attempts = [];
if (!quiz.q || typeof quiz.q !== "object") quiz.q = {};
const saveProgress = () => lsSet(KEYS.progress, progress);
const saveQuiz = () => lsSet(KEYS.quiz, quiz);

// ---------- Content ----------
let DATA = [];
const QBY = {};
async function loadContent() {
  DATA = await Promise.all(DOMAINS.map(async id => {
    const r = await fetch(`content/${id}.json`, { cache: "no-cache" });
    if (!r.ok) throw new Error("Missing content/" + id + ".json");
    const d = await r.json();
    d.id = id;
    d.topics.forEach((t, ti) => {
      t.ti = ti; t.did = id;
      t.qs = (t.questions || []).map((q, qi) => {
        const o = { ...q, id: `${id}:${ti}:${qi}`, did: id, ti };
        QBY[o.id] = o;
        return o;
      });
    });
    return d;
  }));
}
const domainOf = id => DATA.find(d => d.id === id);
const allQ = d => d.topics.flatMap(t => t.qs);
const tkey = (did, ti) => `${did}:${ti}`;
const getP = (did, ti) => progress[tkey(did, ti)] || { level: "none", note: "" };
const lvlLabel = id => (LEVELS.find(l => l.id === id) || LEVELS[0]).label;
function setP(did, ti, patch) {
  progress[tkey(did, ti)] = { ...getP(did, ti), ...patch };
  saveProgress();
}

// ---------- Utilities ----------
function shuffle(a) {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
function pickSpread(qs, n) {
  const groups = {};
  qs.forEach(q => (groups[q.did + ":" + q.ti] = groups[q.did + ":" + q.ti] || []).push(q));
  const lists = shuffle(Object.values(groups).map(g => shuffle(g)));
  const out = [];
  while (out.length < n && lists.some(l => l.length)) {
    for (const l of lists) { if (out.length >= n) break; if (l.length) out.push(l.pop()); }
  }
  return shuffle(out);
}
function quarterInfo(date = new Date()) {
  const y = date.getFullYear(), q = Math.floor(date.getMonth() / 3) + 1;
  const end = new Date(y, q * 3, 1);
  return { label: `${y}-Q${q}`, pretty: `Q${q} ${y}`, daysLeft: Math.max(0, Math.ceil((end - date) / 86400000)) };
}
const fmtDate = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-CA"); };
const fmtTime = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
let msgTimer;
function flash(t) {
  const m = document.getElementById("msg"); if (!m) return;
  m.textContent = t; clearTimeout(msgTimer); msgTimer = setTimeout(() => { m.textContent = ""; }, 5000);
}
function levelCounts() {
  const c = { none: 0, learning: 0, solid: 0, review: 0, all: 0 };
  DATA.forEach(d => d.topics.forEach(t => { c[getP(d.id, t.ti).level]++; c.all++; }));
  return c;
}
function progressBar(c) {
  const p = n => (c.all ? (n / c.all) * 100 : 0).toFixed(1);
  return h("div", { class: "bar" },
    h("span", { class: "b-solid", style: `width:${p(c.solid)}%` }),
    h("span", { class: "b-review", style: `width:${p(c.review)}%` }),
    h("span", { class: "b-learn", style: `width:${p(c.learning)}%` }));
}
function topicStats(d, t) {
  let s = 0, w = 0;
  t.qs.forEach(q => { const st = quiz.q[q.id]; if (st) { s += st.s; w += st.w; } });
  return { s, w };
}
function reviewPool() {
  return Object.keys(quiz.q).filter(id => QBY[id] && quiz.q[id].w > 0 && (quiz.q[id].c || 0) < 2)
    .sort((a, b) => quiz.q[b].w - quiz.q[a].w);
}
function bestFor(type, id) {
  const a = quiz.attempts.filter(x => x.t === type && x.id === id);
  return a.length ? Math.max(...a.map(x => x.pct)) : null;
}

// ---------- App shell ----------
const app = () => document.getElementById("app");
let timer = null;
function mount(...nodes) { app().replaceChildren(...nodes.flat(Infinity).filter(Boolean)); window.scrollTo(0, 0); }

function navBar(active) {
  const tabs = [["", "Home"], ["study", "Study"], ["tests", "Tests"], ["exam", "Exam"], ["stats", "Stats"]];
  return h("nav", { class: "tabs" }, tabs.map(([href, label]) =>
    h("a", { href: "#/" + href, class: href === active ? "on" : "" }, label)));
}
function shell(active, ...content) {
  mount(navBar(active), h("div", { id: "msg" }), content);
}

// ---------- Router ----------
function route() {
  clearInterval(timer);
  const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [v, a, b] = parts;
  try {
    if (!v) return viewHome();
    if (v === "study") return viewStudy(a);
    if (v === "topic") return viewTopic(a, Number(b));
    if (v === "quiz") return startRun(topicRun(a, Number(b)));
    if (v === "tests") return viewTests();
    if (v === "test") return startRun(domainRun(a));
    if (v === "exam") return a === "start" ? startRun(examRun()) : viewExam();
    if (v === "review") return startRun(reviewRun());
    if (v === "stats") return viewStats();
  } catch (e) { console.error(e); }
  viewHome();
}

// ---------- Home ----------
function viewHome() {
  const c = levelCounts();
  const qi = quarterInfo();
  const examTries = quiz.attempts.filter(x => x.t === "exam" && x.quarter === qi.label);
  const bestExam = examTries.length ? Math.max(...examTries.map(x => x.pct)) : null;
  let next = null;
  outer: for (const d of DATA) for (const t of d.topics) { if (getP(d.id, t.ti).level !== "solid") { next = { d, t }; break outer; } }
  const pool = reviewPool();
  const weak = [];
  DATA.forEach(d => d.topics.forEach(t => { const s = topicStats(d, t); if (s.s >= 2 && s.w > 0) weak.push({ d, t, rate: s.w / s.s }); }));
  weak.sort((x, y) => y.rate - x.rate);

  shell("",
    h("h1", { text: "LearnMet" }),
    h("div", { class: "sub", text: "Met Tech self-study: lessons, quizzes, domain tests, quarterly exam." }),
    h("div", { class: "card" },
      h("h2", { text: "Overall progress" }), progressBar(c),
      h("div", { class: "stats" },
        h("span", { text: `${c.all} topics` }), h("span", { text: `Solid: ${c.solid}` }),
        h("span", { text: `Needs review: ${c.review}` }), h("span", { text: `Learning: ${c.learning}` }),
        h("span", { text: `Not started: ${c.none}` }))),
    h("div", { class: "card" },
      h("div", { class: "row" },
        h("div", { class: "grow" },
          h("h2", { text: `${qi.pretty} exam` }),
          h("div", { class: "muted", text: bestExam == null ? "Not taken yet." : `Best this quarter: ${bestExam}% (${bestExam >= PASS ? "pass" : "below pass mark"})` }),
          h("div", { class: "muted small", text: `${qi.daysLeft} days left in the quarter. ${EXAM_LEN} questions, pass mark ${PASS}%.` })),
        h("a", { class: "btn primary", href: "#/exam", text: bestExam == null ? "Open exam" : "Exam page" }))),
    next && h("div", { class: "card" },
      h("div", { class: "row" },
        h("div", { class: "grow" }, h("h2", { text: "Next up" }),
          h("div", { text: next.t.title }), h("div", { class: "muted small", text: next.d.title })),
        h("a", { class: "btn primary", href: `#/topic/${next.d.id}/${next.t.ti}`, text: "Start lesson" }))),
    pool.length > 0 && h("div", { class: "card" },
      h("div", { class: "row" },
        h("div", { class: "grow" }, h("h2", { text: "Review missed questions" }),
          h("div", { class: "muted", text: `${pool.length} question${pool.length === 1 ? "" : "s"} waiting. A question clears after two correct answers in a row.` })),
        h("a", { class: "btn", href: "#/review", text: "Start review" }))),
    weak.length > 0 && h("div", { class: "card" },
      h("h2", { text: "Weakest topics" }),
      weak.slice(0, 5).map(w => h("div", { class: "row", style: "margin-bottom:6px" },
        h("a", { class: "grow", href: `#/topic/${w.d.id}/${w.t.ti}`, text: w.t.title }),
        h("span", { class: "muted small", text: `${Math.round(w.rate * 100)}% missed` })))),
    h("div", { class: "hint", text: "Content is a study aid written by Claude. Verify against official CFS Met and ECCC course material before relying on it." }));
}

// ---------- Study (tracker) ----------
let studyFilter = { q: "", level: "all" };
function viewStudy(openId) {
  const statsEl = h("div");
  function renderStats() {
    const c = levelCounts();
    statsEl.replaceChildren(progressBar(c),
      h("div", { class: "stats" }, h("span", { text: `Solid: ${c.solid}` }), h("span", { text: `Needs review: ${c.review}` }),
        h("span", { text: `Learning: ${c.learning}` }), h("span", { text: `Not started: ${c.none}` })));
  }
  const listEl = h("div");
  function renderList() {
    const q = studyFilter.q.trim().toLowerCase(), f = studyFilter.level;
    const openIds = new Set([...listEl.querySelectorAll("details.cat[open]")].map(x => x.dataset.id));
    const nodes = [];
    DATA.forEach(d => {
      const rows = d.topics.filter(t => {
        const p = getP(d.id, t.ti);
        return (f === "all" || p.level === f) && (!q || t.title.toLowerCase().includes(q) || p.note.toLowerCase().includes(q));
      });
      if (!rows.length) return;
      const solid = d.topics.filter(t => getP(d.id, t.ti).level === "solid").length;
      const det = h("details", { class: "cat", "data-id": d.id },
        h("summary", {}, h("span", { text: d.title }), h("span", { class: "muted small", text: `${solid}/${d.topics.length} solid` })));
      if (openId === d.id || openIds.has(d.id) || q || f !== "all") det.open = true;
      rows.forEach(t => {
        const p = getP(d.id, t.ti);
        const btn = h("button", { class: "lvl " + p.level, text: lvlLabel(p.level), title: "Tap to change level" });
        btn.onclick = () => {
          const idx = (LEVELS.findIndex(l => l.id === p.level) + 1) % LEVELS.length;
          setP(d.id, t.ti, { level: LEVELS[idx].id });
          renderList(); renderStats();
        };
        const ta = h("textarea", { class: "note", placeholder: "Notes / notebook ref", rows: 1, value: p.note });
        ta.onchange = () => setP(d.id, t.ti, { note: ta.value });
        det.append(h("div", { class: "topic" },
          h("div", { class: "row" },
            h("div", { class: "tname" }, h("a", { href: `#/topic/${d.id}/${t.ti}`, text: t.title })),
            h("a", { class: "btn small", href: `#/quiz/${d.id}/${t.ti}`, text: "Quiz" }), btn),
          ta));
      });
      det.append(h("div", { class: "domfoot" }, h("a", { class: "btn", href: `#/test/${d.id}`, text: `Domain test (${Math.min(DOMAIN_TEST_LEN, allQ(d).length)} questions)` })));
      nodes.push(det);
    });
    listEl.replaceChildren(...(nodes.length ? nodes : [h("div", { class: "muted", text: "No topics match." })]));
  }
  const search = h("input", { type: "text", placeholder: "Filter topics", value: studyFilter.q });
  search.oninput = () => { studyFilter.q = search.value; renderList(); };
  const sel = h("select", {}, h("option", { value: "all", text: "All levels" }), LEVELS.map(l => h("option", { value: l.id, text: l.label })));
  sel.value = studyFilter.level;
  sel.onchange = () => { studyFilter.level = sel.value; renderList(); };
  shell("study",
    h("h1", { text: "Study" }),
    h("div", { class: "sub", text: "Open a topic for the lesson. Quiz updates your level. Tap a level to set it by hand." }),
    statsEl,
    h("div", { class: "tools" }, search, sel),
    listEl);
  renderStats();
  renderList();
}

// ---------- Lesson ----------
function viewTopic(did, ti) {
  const d = domainOf(did); const t = d && d.topics[ti];
  if (!t) return viewHome();
  const p = getP(did, ti);
  const lesson = h("div", { class: "lesson" });
  (t.lesson || []).forEach(b => {
    if (typeof b === "string") lesson.append(h("p", { text: b }));
    else if (b.h) lesson.append(h("h3", { text: b.h }));
    else if (b.list) lesson.append(h("ul", {}, b.list.map(x => h("li", { text: x }))));
    else if (b.formula) lesson.append(h("div", { class: "formula", text: b.formula }));
    else if (b.note) lesson.append(h("div", { class: "callout", text: b.note }));
  });
  const flat = DATA.flatMap(x => x.topics.map(y => ({ d: x, t: y })));
  const i = flat.findIndex(x => x.d.id === did && x.t.ti === ti);
  const prev = flat[i - 1], next = flat[i + 1];
  const btn = h("button", { class: "lvl " + p.level, text: lvlLabel(p.level) });
  btn.onclick = () => {
    const cur = getP(did, ti).level;
    const nl = LEVELS[(LEVELS.findIndex(l => l.id === cur) + 1) % LEVELS.length].id;
    setP(did, ti, { level: nl });
    btn.className = "lvl " + nl; btn.textContent = lvlLabel(nl);
  };
  const ta = h("textarea", { class: "note", placeholder: "Notes / notebook ref", rows: 2, value: p.note });
  ta.onchange = () => setP(did, ti, { note: ta.value });
  const stats = topicStats(d, t);
  shell("study",
    h("div", { class: "small" }, h("a", { href: "#/study/" + did, text: "Study" }), " / ", d.title),
    h("h1", { text: t.title }),
    h("div", { class: "row", style: "margin-bottom:10px" },
      h("span", { class: "muted small", text: stats.s ? `Quiz history: ${stats.s - stats.w}/${stats.s} correct` : "No quiz taken yet" }), btn),
    h("div", { class: "card" }, lesson),
    t.terms && t.terms.length > 0 && h("div", { class: "card" }, h("h2", { text: "Key terms" }),
      h("dl", { class: "terms" }, t.terms.map(([k, v]) => [h("dt", { text: k }), h("dd", { text: v })]))),
    h("div", { class: "actions" },
      t.qs.length > 0 && h("a", { class: "btn primary", href: `#/quiz/${did}/${ti}`, text: `Quiz this topic (${t.qs.length})` })),
    h("h3", { text: "Your notes" }), ta,
    h("div", { class: "actions" },
      prev && h("a", { class: "btn", href: `#/topic/${prev.d.id}/${prev.t.ti}`, text: "Previous" }),
      next && h("a", { class: "btn", href: `#/topic/${next.d.id}/${next.t.ti}`, text: "Next topic" })),
    h("div", { class: "hint", text: "Study aid written by Claude. Verify against official course material." }));
}

// ---------- Tests ----------
function viewTests() {
  shell("tests",
    h("h1", { text: "Domain tests" }),
    h("div", { class: "sub", text: `${DOMAIN_TEST_LEN} questions drawn across the domain. Answers shown at the end. Pass mark ${PASS}%.` }),
    DATA.map(d => {
      const best = bestFor("domain", d.id);
      const last = quiz.attempts.filter(x => x.t === "domain" && x.id === d.id).slice(-1)[0];
      return h("div", { class: "card" }, h("div", { class: "row" },
        h("div", { class: "grow" }, h("h3", { style: "margin:0", text: d.title }),
          h("div", { class: "muted small", text: best == null ? "Not taken" : `Best ${best}%, last ${last.pct}% on ${fmtDate(last.when)}` })),
        best != null && h("span", { class: "badge " + (best >= PASS ? "pass" : "fail"), text: best >= PASS ? "PASSED" : "NOT YET" }),
        h("a", { class: "btn primary", href: `#/test/${d.id}`, text: "Start" })));
    }));
}

// ---------- Exam ----------
function viewExam() {
  const qi = quarterInfo();
  const tries = quiz.attempts.filter(x => x.t === "exam");
  const thisQ = tries.filter(x => x.quarter === qi.label);
  const best = thisQ.length ? Math.max(...thisQ.map(x => x.pct)) : null;
  const c = levelCounts();
  shell("exam",
    h("h1", { text: `${qi.pretty} quarterly exam` }),
    h("div", { class: "card" },
      h("div", { text: `${EXAM_LEN} questions across all ${DATA.length} domains, weighted by domain size. No feedback until you finish. Pass mark ${PASS}%. Elapsed time is recorded.` }),
      h("div", { class: "muted", style: "margin-top:8px", text: `${qi.daysLeft} days left in this quarter. Topics marked Solid: ${c.solid}/${c.all}.` }),
      best != null && h("div", { style: "margin-top:8px" }, "Best this quarter: ", h("strong", { text: best + "%" }), " ",
        h("span", { class: "badge " + (best >= PASS ? "pass" : "fail"), text: best >= PASS ? "PASSED" : "BELOW PASS MARK" })),
      h("div", { class: "actions" }, h("a", { class: "btn primary", href: "#/exam/start", text: thisQ.length ? "Retake exam" : "Start exam" }))),
    h("h2", { text: "Exam history" }),
    tries.length === 0 ? h("div", { class: "muted", text: "No exams taken yet." }) :
      h("div", { class: "card" }, h("table", {},
        h("thead", {}, h("tr", {}, ["Quarter", "Date", "Score", "Time", ""].map(x => h("th", { text: x })))),
        h("tbody", {}, tries.slice().reverse().map(x => h("tr", {},
          h("td", { text: x.quarter }), h("td", { text: fmtDate(x.when) }),
          h("td", { text: `${x.score}/${x.total} (${x.pct}%)` }), h("td", { text: x.secs != null ? fmtTime(x.secs) : "" }),
          h("td", {}, h("span", { class: "badge " + (x.pct >= PASS ? "pass" : "fail"), text: x.pct >= PASS ? "PASS" : "FAIL" }))))))));
}

// ---------- Quiz runner ----------
let run = null;
function makeItems(qs) { return qs.map(q => ({ q, order: shuffle(q.c.map((_, i) => i)), pick: null })); }
function topicRun(did, ti) {
  const d = domainOf(did), t = d && d.topics[ti];
  if (!t || !t.qs.length) return null;
  const score = q => { const st = quiz.q[q.id]; return (!st || st.s === 0 ? 3 : (st.w > 0 && (st.c || 0) < 2 ? 2 : 1)) + Math.random(); };
  const pick = t.qs.map(q => ({ q, k: score(q) })).sort((a, b) => b.k - a.k).slice(0, TOPIC_QUIZ_LEN).map(x => x.q);
  return { type: "topic", id: tkey(did, ti), did, ti, title: t.title, sub: d.title, items: makeItems(shuffle(pick)), immediate: true };
}
function domainRun(did) {
  const d = domainOf(did); if (!d) return null;
  const qs = pickSpread(allQ(d), DOMAIN_TEST_LEN);
  return { type: "domain", id: did, title: d.title + " test", sub: "Domain test", items: makeItems(qs), immediate: false };
}
function examRun() {
  const total = DATA.reduce((s, d) => s + d.topics.length, 0);
  const alloc = DATA.map(d => ({ d, n: Math.max(2, Math.round(EXAM_LEN * d.topics.length / total)) }));
  let sum = alloc.reduce((s, a) => s + a.n, 0);
  while (sum > EXAM_LEN) { const a = alloc.filter(x => x.n > 2).sort((x, y) => y.n - x.n)[0]; if (!a) break; a.n--; sum--; }
  while (sum < EXAM_LEN) { alloc.sort((x, y) => (y.d.topics.length / y.n) - (x.d.topics.length / x.n))[0].n++; sum++; }
  const qs = shuffle(alloc.flatMap(a => pickSpread(allQ(a.d), Math.min(a.n, allQ(a.d).length))));
  const qi = quarterInfo();
  return { type: "exam", id: "exam", quarter: qi.label, title: `${qi.pretty} exam`, sub: "Quarterly exam", items: makeItems(qs), immediate: false, start: Date.now() };
}
function reviewRun() {
  const ids = reviewPool().slice(0, 15);
  if (!ids.length) return null;
  return { type: "review", id: "review", title: "Review missed questions", sub: "Review", items: makeItems(shuffle(ids.map(i => QBY[i]))), immediate: true };
}
function startRun(r) {
  if (!r || !r.items.length) { flash("Nothing to quiz here yet."); return viewHome(); }
  run = { ...r, idx: 0, done: false, start: r.start || Date.now() };
  renderRun();
}
function origPick(it) { return it.pick == null ? null : it.order[it.pick]; }

function renderRun() {
  clearInterval(timer);
  if (run.done) return renderResults();
  const it = run.items[run.idx], q = it.q;
  const answered = it.pick != null;
  const reveal = run.immediate && answered;
  const timerEl = run.type === "exam" ? h("span", { text: "Time " + fmtTime(Math.floor((Date.now() - run.start) / 1000)) }) : null;
  if (timerEl) timer = setInterval(() => { timerEl.textContent = "Time " + fmtTime(Math.floor((Date.now() - run.start) / 1000)); }, 1000);

  const choices = it.order.map((orig, di) => {
    let cls = "choice";
    if (reveal) cls += orig === q.a ? " right" : (di === it.pick ? " wrong" : "");
    else if (di === it.pick) cls += " sel";
    return h("button", { class: cls, text: q.c[orig], disabled: reveal ? true : null, onclick: () => { it.pick = di; renderRun(); } });
  });
  const last = run.idx === run.items.length - 1;
  const next = h("button", { class: "primary", text: last ? "Finish" : "Next", disabled: answered ? null : true,
    onclick: () => { if (last) { run.done = true; } else { run.idx++; } renderRun(); } });
  const back = h("button", { text: "Back", disabled: run.idx === 0 || run.immediate ? true : null, onclick: () => { run.idx--; renderRun(); } });
  const quit = h("a", { class: "btn", href: run.type === "exam" ? "#/exam" : "#/study", text: "Quit", onclick: () => { clearInterval(timer); } });

  mount(
    h("div", { class: "small" }, run.sub),
    h("h1", { text: run.title }),
    h("div", { class: "qmeta" }, h("span", { text: `Question ${run.idx + 1} of ${run.items.length}` }), timerEl),
    h("div", { class: "card" }, h("p", { class: "qtext", text: q.q }), choices,
      reveal && h("div", { class: "explain" },
        h("strong", { text: origPick(it) === q.a ? "Correct. " : "Incorrect. " }), q.e || "")),
    h("div", { class: "actions" }, run.immediate ? null : back, next, quit));
  if (reveal) { const ex = document.querySelector(".explain"); if (ex && ex.scrollIntoView) ex.scrollIntoView({ block: "nearest" }); }
}

function renderResults() {
  clearInterval(timer);
  const items = run.items;
  const correct = items.filter(it => origPick(it) === it.q.a);
  const missed = items.filter(it => origPick(it) !== it.q.a);
  const total = items.length, score = correct.length, pct = Math.round((score / total) * 100);
  const secs = Math.floor((Date.now() - run.start) / 1000);

  // Record once per run
  if (!run.recorded) {
    run.recorded = true;
    items.forEach(it => {
      const st = quiz.q[it.q.id] || { s: 0, w: 0, c: 0 };
      st.s++;
      if (origPick(it) === it.q.a) st.c = (st.c || 0) + 1; else { st.w++; st.c = 0; }
      quiz.q[it.q.id] = st;
    });
    const attempt = { t: run.type, id: run.id, when: new Date().toISOString(), score, total, pct, secs, missed: missed.map(m => m.q.id) };
    if (run.quarter) attempt.quarter = run.quarter;
    quiz.attempts.push(attempt);
    if (quiz.attempts.length > 300) quiz.attempts = quiz.attempts.slice(-300);
    saveQuiz();
    // Topic quiz: update level
    if (run.type === "topic") {
      const newLevel = pct >= PASS ? "solid" : pct >= 50 ? "learning" : "review";
      setP(run.did, run.ti, { level: newLevel });
      run.levelMsg = `Level set to ${lvlLabel(newLevel)}. You can change it on the Study page.`;
    }
  }
  const levelMsg = run.levelMsg || null;
  // Breakdown by domain (tests and exam)
  let breakdown = null;
  if (run.type === "exam" || run.type === "domain") {
    const rows = DATA.map(d => {
      const its = items.filter(it => it.q.did === d.id);
      return its.length ? { d, n: its.length, ok: its.filter(it => origPick(it) === it.q.a).length } : null;
    }).filter(Boolean);
    breakdown = h("div", { class: "card" }, h("h2", { text: "By domain" }), h("table", {},
      h("tbody", {}, rows.map(r => h("tr", {}, h("td", { text: r.d.title }), h("td", { text: `${r.ok}/${r.n}` }))))));
  }
  // Topics to review
  const weakTopics = [];
  const seen = new Set();
  missed.forEach(m => { const k = tkey(m.q.did, m.q.ti); if (!seen.has(k)) { seen.add(k); weakTopics.push({ d: domainOf(m.q.did), t: domainOf(m.q.did).topics[m.q.ti] }); } });
  const markBtn = h("button", { text: "Mark these topics Needs review" });
  markBtn.onclick = () => { weakTopics.forEach(w => setP(w.d.id, w.t.ti, { level: "review" })); markBtn.disabled = true; markBtn.textContent = "Marked"; };

  const passed = pct >= PASS;
  const again = h("button", { class: "primary", text: run.type === "review" ? "Back to home" : "Try again", onclick: () => {
    if (run.type === "topic") startRun(topicRun(run.did, run.ti));
    else if (run.type === "domain") startRun(domainRun(run.id));
    else if (run.type === "exam") startRun(examRun());
    else { location.hash = "#/"; }
  } });
  mount(
    h("div", { class: "small" }, run.sub),
    h("h1", { text: run.title }),
    h("div", { class: "card" },
      h("div", { class: "score", text: `${score}/${total} (${pct}%)` }),
      run.type !== "review" && h("span", { class: "badge " + (passed ? "pass" : "fail"), text: passed ? "PASS" : `BELOW ${PASS}% PASS MARK` }),
      run.type === "exam" && h("div", { class: "muted", style: "margin-top:6px", text: "Time " + fmtTime(secs) }),
      levelMsg && h("div", { class: "muted", style: "margin-top:6px", text: levelMsg }),
      h("div", { class: "actions" }, again,
        h("a", { class: "btn", href: run.type === "exam" ? "#/exam" : run.type === "domain" ? "#/tests" : "#/study", text: "Done" }))),
    breakdown,
    missed.length === 0 ? h("div", { class: "card" }, "No missed questions.") :
      h("div", { class: "card" }, h("h2", { text: `Missed (${missed.length})` }),
        missed.map(m => h("div", { class: "missed" },
          h("div", { style: "font-weight:600", text: m.q.q }),
          h("div", { class: "small", text: m.pick == null ? "Your answer: none" : "Your answer: " + m.q.c[origPick(m)] }),
          h("div", { class: "small", style: "color:var(--good-fg)", text: "Correct: " + m.q.c[m.q.a] }),
          h("div", { class: "small muted", text: m.q.e || "" })))),
    weakTopics.length > 0 && run.type !== "topic" && h("div", { class: "card" }, h("h2", { text: "Review these topics" }),
      weakTopics.map(w => h("div", {}, h("a", { href: `#/topic/${w.d.id}/${w.t.ti}`, text: w.t.title }))),
      h("div", { class: "actions" }, markBtn)));
}

// ---------- Stats ----------
function viewStats() {
  const att = quiz.attempts;
  const totalQ = Object.values(quiz.q).reduce((s, x) => s + x.s, 0);
  const totalW = Object.values(quiz.q).reduce((s, x) => s + x.w, 0);
  const file = h("input", { type: "file", accept: "application/json", hidden: true });
  file.onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data.progress || typeof data.progress !== "object") throw new Error("bad");
        progress = data.progress; saveProgress();
        if (data.quiz && Array.isArray(data.quiz.attempts)) { quiz = { attempts: data.quiz.attempts, q: data.quiz.q || {} }; saveQuiz(); }
        flash("Imported"); viewStats();
      } catch (err) { flash("Import failed: not a valid progress file"); }
    };
    r.readAsText(f); e.target.value = "";
  };
  const exp = h("button", { text: "Export", onclick: () => {
    const blob = new Blob([JSON.stringify({ version: 2, exported: new Date().toISOString(), progress, quiz }, null, 2)], { type: "application/json" });
    const a = h("a", { href: URL.createObjectURL(blob), download: "progress.json" }); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); flash("Exported progress.json");
  } });
  const reset = h("button", { text: "Clear quiz history", onclick: () => {
    if (confirm("Clear all quiz history and missed-question tracking? Levels and notes are kept.")) { quiz = { attempts: [], q: {} }; saveQuiz(); viewStats(); }
  } });
  shell("stats",
    h("h1", { text: "Stats" }),
    h("div", { class: "card" },
      h("div", { text: `${att.length} quizzes and tests taken. ${totalQ} questions answered, ${totalQ ? Math.round(((totalQ - totalW) / totalQ) * 100) : 0}% correct overall.` })),
    h("h2", { text: "Recent attempts" }),
    att.length === 0 ? h("div", { class: "muted", text: "Nothing yet." }) :
      h("div", { class: "card" }, h("table", {},
        h("thead", {}, h("tr", {}, ["Date", "Type", "Score"].map(x => h("th", { text: x })))),
        h("tbody", {}, att.slice(-15).reverse().map(x => h("tr", {},
          h("td", { text: fmtDate(x.when) }), h("td", { text: x.t + (x.t === "topic" || x.t === "domain" ? ": " + attLabel(x) : "") }),
          h("td", { text: `${x.score}/${x.total} (${x.pct}%)` })))))),
    h("h2", { text: "Backup" }),
    h("div", { class: "card" },
      h("div", { class: "muted small", text: "Progress and quiz history live in this browser only. Export regularly. Send the file to Claude to commit it as progress.json in the repo." }),
      h("div", { class: "actions" }, exp, h("button", { text: "Import", onclick: () => file.click() }), reset, file)));
}
function attLabel(x) {
  if (x.t === "domain") { const d = domainOf(x.id); return d ? d.title : x.id; }
  const [did, ti] = x.id.split(":"); const d = domainOf(did); const t = d && d.topics[Number(ti)];
  return t ? t.title : x.id;
}

// ---------- Boot ----------
(async function boot() {
  mount(h("div", { class: "muted", text: "Loading..." }));
  try { await loadContent(); }
  catch (e) {
    mount(h("div", { class: "card" }, h("h2", { text: "Content did not load" }),
      h("div", { text: "Open this page through GitHub Pages or a web server. Opening index.html directly from a file will not work." }),
      h("div", { class: "muted small", text: String(e.message || e) })));
    return;
  }
  if (!Object.keys(progress).length && !quiz.attempts.length) {
    try {
      const res = await fetch("progress.json", { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        if (d.progress) { progress = d.progress; saveProgress(); }
        if (d.quiz && Array.isArray(d.quiz.attempts)) { quiz = { attempts: d.quiz.attempts, q: d.quiz.q || {} }; saveQuiz(); }
      }
    } catch (e) {}
  }
  window.addEventListener("hashchange", route);
  route();
})();
})();
