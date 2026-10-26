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
let LINKS = { resources: {}, topics: {} };
const QBY = {};
async function loadContent() {
  try { const lr = await fetch("content/links.json", { cache: "no-cache" }); if (lr.ok) LINKS = await lr.json(); } catch (e) {}
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
  const tabs = [["", "Home"], ["study", "Study"], ["tests", "Tests"], ["exam", "Exam"], ["links", "Links"], ["stats", "Stats"]];
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
    if (v === "weak") return startRun(weakRun());
    if (v === "decode") return startRun(decodeRun(a === "taf" ? "taf" : "metar"));
    if (v === "stats") return viewStats();
    if (v === "links") return viewLinks();
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
    weakTopicList().length > 0 && h("div", { class: "card" },
      h("div", { class: "row" },
        h("div", { class: "grow" }, h("h2", { text: "Weak-area drill" }), h("div", { class: "muted", text: `${WEAK_LEN} questions from your weakest topics, missed ones first.` })),
        h("a", { class: "btn primary", href: "#/weak", text: "Start drill" }))),
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
    (LINKS.topics[tkey(did, ti)] || []).length > 0 && h("div", { class: "card" }, h("h2", { text: "Further reading (free, public)" }),
      LINKS.topics[tkey(did, ti)].map(id => linkItem(id)), h("div", { class: "muted small", text: "Opens in a new tab. Checked " + (LINKS.checked || "") + "." })),
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
    h("div", { class: "card" }, h("h2", { text: "Drills" }),
      h("div", { class: "muted", text: "Weak-area drill: 15 questions from your weakest topics (appears once you have a weak topic). METAR and TAF drills: 10 generated practice questions each. Answers shown after each question." }),
      h("div", { class: "actions" }, weakTopicList().length ? h("a", { class: "btn primary", href: "#/weak", text: "Weak-area drill" }) : null, h("a", { class: "btn primary", href: "#/decode/metar", text: "METAR drill" }), h("a", { class: "btn primary", href: "#/decode/taf", text: "TAF drill" }))),
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
const WEAK_LEN = 15;
function weakTopicList() {
  const out = [];
  DATA.forEach(d => d.topics.forEach(t => {
    const lvl = (progress[tkey(d.id, t.ti)] || {}).level, st = topicStats(d, t);
    const rate = st.s ? st.w / st.s : 0;
    const wt = (lvl === "review" ? 3 : lvl === "learning" ? 2 : 0) + rate * 3;
    if (wt > 0) out.push({ d, t, wt });
  }));
  return out.sort((a, b) => b.wt - a.wt);
}
function weakRun() {
  const topics = weakTopicList().slice(0, 8);
  if (!topics.length) return null;
  const cands = [];
  topics.forEach(x => x.t.qs.forEach(q => {
    const st = quiz.q[q.id];
    const qk = !st ? 1 : (st.w > 0 && (st.c || 0) < 2 ? 3 : 0);
    cands.push({ q, tk: tkey(x.d.id, x.t.ti), k: x.wt + qk + Math.random() * 1.5 });
  }));
  cands.sort((a, b) => b.k - a.k);
  const cap = Math.max(3, Math.ceil(WEAK_LEN / topics.length)), per = {}, picked = [];
  for (const c of cands) { if ((per[c.tk] || 0) >= cap) continue; per[c.tk] = (per[c.tk] || 0) + 1; picked.push(c.q); if (picked.length >= WEAK_LEN) break; }
  const names = topics.slice(0, 3).map(x => x.t.title).join("; ");
  return { type: "weak", id: "weak", title: "Weak-area drill", sub: "Targets: " + names + (topics.length > 3 ? " and more" : ""), items: makeItems(shuffle(picked)), immediate: true };
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
  const quit = h("a", { class: "btn", href: run.type === "exam" ? "#/exam" : (run.type === "decode" || run.type === "weak") ? "#/tests" : "#/study", text: "Quit", onclick: () => { clearInterval(timer); } });

  mount(
    h("div", { class: "small" }, run.sub),
    h("h1", { text: run.title }),
    h("div", { class: "qmeta" }, h("span", { text: `Question ${run.idx + 1} of ${run.items.length}` }), timerEl),
    h("div", { class: "card" }, q.code && h("pre", { class: "code", text: q.code }), h("p", { class: "qtext", text: q.q }), choices,
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
      if (it.q.gen) return;
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
    else if (run.type === "weak") startRun(weakRun());
    else if (run.type === "decode") startRun(decodeRun(run.id));
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
        h("a", { class: "btn", href: run.type === "exam" ? "#/exam" : (run.type === "domain" || run.type === "decode" || run.type === "weak") ? "#/tests" : "#/study", text: "Done" }))),
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

// ---------- Links ----------
function linkItem(id) {
  const r = LINKS.resources[id]; if (!r) return null;
  return h("div", { class: "link" },
    h("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", text: r.title }),
    h("div", { class: "muted small", text: r.org }),
    h("div", { class: "small", text: r.note }));
}
function viewLinks() {
  const ids = Object.keys(LINKS.resources);
  const groups = [["Canadian standards and manuals", ["manobs", "manair", "tc-aim-met", "nc-aws"]],
    ["ECCC public weather", ["eccc-alerts", "eccc-hurricane", "eccc-radar", "project-atm"]],
    ["Marine", ["eccc-beaufort", "eccc-marine", "eccc-marine-atl", "eccc-marine-nat"]],
    ["Free courses and references", ["meted", "wmo-ca", "jet", "jet-atm", "jet-global", "jet-clouds", "jet-upper"]]];
  shell("links",
    h("h1", { text: "Study links" }),
    h("div", { class: "sub", text: LINKS.note || "Public sources only." }),
    groups.map(([t, list]) => h("div", { class: "card" }, h("h2", { text: t }), list.filter(i => ids.includes(i)).map(linkItem))),
    h("div", { class: "hint", text: "Official CFS Met course material is controlled. It stays out of this public repo; keep it on approved systems." }));
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
// ---------- Decoding drills (generated; practice data only, not real observations) ----------
function rnd(n) { return Math.floor(Math.random() * n); }
function pickOne(a) { return a[rnd(a.length)]; }
function fmtFt(n) { return n.toLocaleString("en-US") + " ft"; }
function pad(n, w) { return String(n).padStart(w, "0"); }
function uniq(correct, wrongs) {
  const out = [correct];
  wrongs.forEach(w => { if (!out.includes(w)) out.push(w); });
  let i = 0;
  while (out.length < 4) out.push("None of the above" + (i++ ? " (" + i + ")" : ""));
  return out.slice(0, 4);
}
function genQ(code, ti, text, correct, wrongs, e) {
  return { id: "gen:" + Math.random().toString(36).slice(2), gen: true, did: "codes", ti, code, q: text, c: uniq(correct, shuffle(wrongs)), a: 0, e };
}
const DEC_STNS = ["CYHZ", "CYAW", "CYQY", "CYYT", "CYSJ", "CYFC", "CYQM", "CYYG"];
const VIS_OPTS = [["15SM", "15 SM"], ["10SM", "10 SM"], ["6SM", "6 SM"], ["4SM", "4 SM"], ["2 1/2SM", "2 1/2 SM"], ["1SM", "1 SM"], ["1/2SM", "1/2 SM"], ["1/4SM", "1/4 SM"]];
const WX_OPTS = [["-RA", "light rain"], ["RA", "moderate rain"], ["+RA", "heavy rain"], ["-SN", "light snow"], ["SN", "moderate snow"], ["BR", "mist"], ["FG", "fog"], ["TSRA", "thunderstorm with moderate rain"], ["-DZ", "light drizzle"], ["FZRA", "freezing rain"], ["-SHRA", "light rain showers"], ["BLSN", "blowing snow"]];
function cloudWord(t) { return { FEW: "few (1/8 to 2/8)", SCT: "scattered (3/8 to 4/8)", BKN: "broken (5/8 to 7/8)", OVC: "overcast (8/8)" }[t]; }
function flightCat(ceilFt, visSM) {
  if (ceilFt < 500 || visSM < 1) return "LIFR";
  if (ceilFt < 1000 || visSM < 3) return "IFR";
  if (ceilFt <= 3000 || visSM <= 5) return "MVFR";
  return "VFR";
}
function visNum(s) { const m = s.replace("SM", "").trim().split(" "); return m.reduce((t, x) => t + (x.includes("/") ? (+x.split("/")[0]) / (+x.split("/")[1]) : +x), 0); }

function genMetar() {
  const stn = pickOne(DEC_STNS), day = 1 + rnd(28), hr = rnd(24), min = pickOne([0, 0, 0, 30, 53]);
  const dir = pickOne([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]) * 10;
  const spd = pickOne([3, 5, 8, 10, 12, 15, 18, 20, 25]), gust = Math.random() < 0.4 ? spd + pickOne([8, 10, 12, 15]) : 0;
  const calm = Math.random() < 0.1, vrb = !calm && spd <= 5 && Math.random() < 0.4;
  const wind = calm ? "00000KT" : vrb ? `VRB${pad(spd, 2)}KT` : `${pad(dir === 0 ? 360 : dir, 3)}${pad(spd, 2)}${gust ? "G" + gust : ""}KT`;
  const vis = pickOne(VIS_OPTS), wx = Math.random() < 0.65 ? pickOne(WX_OPTS) : null;
  const nl = 1 + rnd(2), layers = [];
  let base = pickOne([5, 8, 12, 20, 30, 45, 80]);
  const types = ["FEW", "SCT", "BKN", "OVC"];
  for (let i = 0; i < nl; i++) { layers.push([types[Math.min(3, rnd(4) + i)], base]); base += pickOne([10, 20, 40]); }
  layers.sort((a, b) => a[1] - b[1]);
  const t = rnd(35) - 15, dd = t - pickOne([0, 1, 2, 4, 8, 12]);
  const tf = v => (v < 0 ? "M" : "") + pad(Math.abs(v), 2);
  const alt = 2950 + rnd(100);
  const cloudStr = layers.map(l => l[0] + pad(l[1], 3)).join(" ");
  const code = `METAR ${stn} ${pad(day, 2)}${pad(hr, 2)}${pad(min, 2)}Z ${wind} ${vis[0]}${wx ? " " + wx[0] : ""} ${cloudStr} ${tf(t)}/${tf(dd)} A${alt}`;
  const qs = [];
  const windTxt = calm ? "calm" : vrb ? `variable direction at ${spd} kt` : `from ${pad(dir === 0 ? 360 : dir, 3)} degrees at ${spd} kt${gust ? ", gusting " + gust + " kt" : ""}`;
  const wWrong = [
    calm ? "from 360 degrees at 5 kt" : `from ${pad(((dir + 90) % 360) || 360, 3)} degrees at ${spd} kt${gust ? ", gusting " + gust + " kt" : ""}`,
    calm ? "variable at 3 kt" : `from ${pad(dir === 0 ? 360 : dir, 3)} degrees at ${spd + 5} kt`,
    calm ? "light and variable at 5 kt" : `toward ${pad(dir === 0 ? 360 : dir, 3)} degrees at ${spd} kt`,
    calm ? "from the north at 3 kt" : `variable direction at ${spd + 2} kt`];
  qs.push(genQ(code, 0, "What is the wind?", windTxt, wWrong, "Wind: three digits for direction in degrees true (the direction it blows FROM), two for speed in knots, G for gusts. 00000KT is calm; VRB is variable."));
  qs.push(genQ(code, 0, "What is the visibility?", vis[1], VIS_OPTS.map(v => v[1]).filter(x => x !== vis[1]), "Canadian METAR visibility is in statute miles, so 15SM is 15 miles."));
  const lowCeil = layers.find(l => l[0] === "BKN" || l[0] === "OVC");
  const ceilTxt = lowCeil ? fmtFt(lowCeil[1] * 100) : "No ceiling (no broken or overcast layer)";
  const cw = [fmtFt(layers[0][1] * 100), fmtFt(layers[layers.length - 1][1] * 100 + 1000), fmtFt((lowCeil ? lowCeil[1] : layers[0][1]) * 1000), fmtFt((lowCeil ? lowCeil[1] : layers[0][1]) * 10), "No ceiling (no broken or overcast layer)", "1,000 ft", "2,500 ft", "6,000 ft"].filter(x => x !== ceilTxt);
  qs.push(genQ(code, 0, "What is the ceiling?", ceilTxt, cw, "Cloud heights are in hundreds of feet AGL. The ceiling is the lowest BKN or OVC layer (or vertical visibility). FEW and SCT do not make a ceiling."));
  const l0 = layers[0];
  qs.push(genQ(code, 0, `What does ${l0[0]}${pad(l0[1], 3)} mean?`, `${cloudWord(l0[0])} at ${l0[1] * 100} ft AGL`,
    types.filter(x => x !== l0[0]).map(x => `${cloudWord(x)} at ${l0[1] * 100} ft AGL`).concat([`${cloudWord(l0[0])} at ${l0[1] * 1000} ft AGL`]), "Cloud group: amount code then height in hundreds of feet AGL."));
  const td = `temperature ${t} C, dew point ${dd} C`;
  qs.push(genQ(code, 0, "What are the temperature and dew point?", td,
    [`temperature ${-t} C, dew point ${-dd} C`, `temperature ${dd} C, dew point ${t} C`, `temperature ${t} C, dew point ${dd + (dd > t - 3 ? -3 : 3)} C`, `temperature ${t + 2} C, dew point ${dd + 2} C`, `temperature ${t + 5} C, dew point ${dd - 1} C`], "Temperature/dew point in whole degrees C. The M prefix means minus. Dew point is never above the temperature."));
  const aStr = `${(alt / 100).toFixed(2)} inHg`;
  qs.push(genQ(code, 0, "What is the altimeter setting?", aStr, [`${((alt + 30) / 100).toFixed(2)} inHg`, `${((alt - 40) / 100).toFixed(2)} inHg`, `${(alt / 10).toFixed(1)} hPa`, `${((alt + 100) / 100).toFixed(2)} inHg`], "A followed by four digits gives inches of mercury with an implied decimal point."));
  if (wx) qs.push(genQ(code, 0, `What does ${wx[0]} mean?`, wx[1], WX_OPTS.map(w => w[1]).filter(x => x !== wx[1]), "Present weather: - light, none moderate, + heavy; then the type (RA rain, SN snow, DZ drizzle, BR mist, FG fog, TS thunderstorm, SH showers)."));
  const vn = visNum(vis[0]), ceilFt = lowCeil ? lowCeil[1] * 100 : 99999;
  const cat = flightCat(ceilFt, vn), cats = ["VFR", "MVFR", "IFR", "LIFR"];
  qs.push(genQ(code, 0, "What is the flight category? (VFR: ceiling above 3,000 ft and visibility above 5 SM; MVFR: 1,000 to 3,000 ft or 3 to 5 SM; IFR: 500 to below 1,000 ft or 1 to below 3 SM; LIFR: below 500 ft or below 1 SM.)", cat, cats.filter(c => c !== cat), "Flight category uses the worse of the ceiling and the visibility."));
  return qs;
}

function genTaf() {
  const stn = pickOne(DEC_STNS), day = 1 + rnd(27), issue = pickOne([5, 11, 17, 23]);
  const vStart = pickOne([6, 12, 18, 0]), nd = vStart === 0 ? day + 1 : day;
  const endDay = nd + 1;
  const valid = `${pad(nd, 2)}${pad(vStart, 2)}/${pad(endDay, 2)}${pad(vStart, 2)}`;
  const d1 = pickOne([8, 12, 18, 24, 27, 30, 33]) * 10, s1 = pickOne([6, 10, 12, 15]);
  const v1 = pickOne(["P6SM", "6SM", "4SM"]), c1 = pickOne(["FEW040", "SCT030", "BKN050", "FEW020 BKN080"]);
  const chgType = pickOne(["BECMG", "TEMPO", "PROB30", "FM"]);
  const h1 = (vStart + 3 + rnd(6)) % 24, h2 = (h1 + 3) % 24;
  const chDay = h1 < vStart ? endDay : nd;
  const chPer = `${pad(chDay, 2)}${pad(h1, 2)}${pad(h2 === 0 ? 24 : h2, 2)}`;
  const chPerFull = `${pad(chDay, 2)}${pad(h1, 2)}/${pad(chDay, 2)}${pad(h2, 2)}`;
  const d2 = pickOne([18, 24, 30, 33]) * 10, s2 = s1 + pickOne([5, 8, 10]), g2 = s2 + pickOne([8, 10]);
  const chWx = pickOne([["2SM -RA BKN012", "visibility 2 SM in light rain with a broken ceiling at 1,200 ft"], ["1SM -SN OVC008", "visibility 1 SM in light snow with an overcast ceiling at 800 ft"], ["1/2SM FG VV002", "visibility 1/2 SM in fog with vertical visibility 200 ft"], ["3SM BR BKN015", "visibility 3 SM in mist with a broken ceiling at 1,500 ft"]]);
  const chg = chgType === "FM" ? `FM${pad(chDay, 2)}${pad(h1, 2)}00 ${pad(d2, 3)}${pad(s2, 2)}KT ${chWx[0]}`
    : chgType === "PROB30" ? `PROB30 ${chPerFull} ${chWx[0]}`
    : `${chgType} ${chPerFull} ${chgType === "BECMG" ? `${pad(d2, 3)}${pad(s2, 2)}G${g2}KT ` : ""}${chWx[0]}`;
  const code = `TAF ${stn} ${pad(day, 2)}${pad(issue, 2)}40Z ${valid} ${pad(d1, 3)}${pad(s1, 2)}KT ${v1} ${c1}\n${chg}`.replace("\\n", "\n");
  const qs = [];
  const pv = x => `${pad(+x.slice(0, 2), 2)}/${x.slice(2, 4)}00Z`;
  const vs = `day ${nd} at ${pad(vStart, 2)}00 UTC to day ${endDay} at ${pad(vStart, 2)}00 UTC`;
  qs.push(genQ(code, 1, "What period does this TAF cover?", vs,
    [`day ${nd} at ${pad(vStart, 2)}00 UTC to day ${nd} at ${pad((vStart + 12) % 24, 2)}00 UTC`, `day ${endDay} at ${pad(vStart, 2)}00 UTC to day ${endDay + 1} at ${pad(vStart, 2)}00 UTC`, `day ${nd} at ${pad(vStart, 2)}00 local to day ${endDay} at ${pad(vStart, 2)}00 local`, `day ${nd} at ${pad((vStart + 6) % 24, 2)}00 UTC to day ${endDay} at ${pad((vStart + 6) % 24, 2)}00 UTC`],
    "Valid period is DDHH/DDHH in UTC. Most Canadian TAFs cover 24 hours or more."));
  qs.push(genQ(code, 1, "What is the initial forecast wind?", `from ${pad(d1, 3)} degrees at ${s1} kt`,
    [`from ${pad((d1 + 90) % 360 || 360, 3)} degrees at ${s1} kt`, `from ${pad(d1, 3)} degrees at ${s1 + 10} kt`, `toward ${pad(d1, 3)} degrees at ${s1} kt`, `from ${pad((d1 + 180) % 360 || 360, 3)} degrees at ${s1} kt`], "TAF winds use the same format as METAR winds."));
  const lowest = c1.split(" ").find(x => /^(BKN|OVC)/.test(x));
  const tCeil = lowest ? fmtFt(+lowest.slice(3) * 100) : "No ceiling (no broken or overcast layer)";
  qs.push(genQ(code, 1, "In the initial forecast, what is the ceiling?", tCeil,
    ["No ceiling (no broken or overcast layer)", "2,000 ft", "3,000 ft", "4,000 ft", "5,000 ft", "800 ft", "20,000 ft"].filter(x => x !== tCeil),
    "Ceiling is the lowest BKN or OVC layer. FEW and SCT are not ceilings."));
  const meaning = {
    BECMG: [`conditions change gradually during ${chPerFull.replace("/", " to ")} and stay changed`, "a brief fluctuation lasting under an hour at a time", "a 30% chance of the conditions", "an abrupt change at one time"],
    TEMPO: [`temporary fluctuations during ${chPerFull.replace("/", " to ")}, each lasting under an hour`, "a gradual, lasting change", "a 30% chance of the conditions", "an abrupt, lasting change"],
    PROB30: [`a 30% chance of ${chWx[1]} during ${chPerFull.replace("/", " to ")}`, "a gradual, lasting change", "a temporary fluctuation under an hour", "a forecast issued 30 minutes after the hour"],
    FM: [`an abrupt, lasting change from the stated time, with ${chWx[1]}`, "a gradual change over several hours", "a temporary fluctuation under an hour", "a 30% chance of the conditions"],
  }[chgType];
  qs.push(genQ(code, 1, `What does the ${chgType === "FM" ? "FM" : chgType} group mean?`, meaning[0], meaning.slice(1).concat(["an amendment to a previous forecast"]),
    "BECMG: gradual lasting change. TEMPO: temporary fluctuations under an hour each and less than half the period in total. PROB30: 30% chance. FM: abrupt change from the stated time."));
  qs.push(genQ(code, 1, "In the second group, what is the forecast weather and ceiling/visibility?", chWx[1],
    ["clear skies with visibility over 6 SM", "visibility 6 SM in haze with few clouds at 4,000 ft", "visibility 5 SM in light rain with scattered cloud at 3,000 ft", "visibility 1/4 SM in heavy snow with an overcast ceiling at 200 ft"].filter(x => x !== chWx[1]).concat(["visibility 2 SM in light rain with a broken ceiling at 1,500 ft"]).filter(x => x !== chWx[1]).slice(0, 3),
    "Read the visibility, weather and cloud groups in order. VV is vertical visibility into an obscured sky."));
  const vv = chWx[0].includes("VV") ? "IFR" : null;
  const cc = chWx[0].match(/(BKN|OVC|VV)(\d{3})/), ch = cc ? +cc[2] * 100 : 99999, vi = visNum(chWx[0].split(" ")[0]);
  const cat = flightCat(ch, vi), cats = ["VFR", "MVFR", "IFR", "LIFR"];
  qs.push(genQ(code, 1, "What flight category does the second group forecast? (VFR: ceiling above 3,000 ft and visibility above 5 SM; MVFR: 1,000 to 3,000 ft or 3 to 5 SM; IFR: 500 to below 1,000 ft or 1 to below 3 SM; LIFR: below 500 ft or below 1 SM.)", cat, cats.filter(c => c !== cat), "Use the worse of ceiling and visibility."));
  return qs;
}

function decodeRun(kind) {
  const pool = [];
  while (pool.length < 10) {
    const set = shuffle(kind === "taf" ? genTaf() : genMetar());
    const n = kind === "taf" ? 2 : 3;
    // one report yields several questions; take a few per report
    set.slice(0, n).forEach(q => pool.push(q));
  }
  const qs = pool.slice(0, 10);
  return { type: "decode", id: kind, title: kind === "taf" ? "TAF decoding drill" : "METAR decoding drill", sub: "Decoding drill (generated practice reports)", items: makeItems(qs), immediate: true };
}

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
