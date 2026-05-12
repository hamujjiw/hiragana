import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthProvider, useAuth } from "../lib/auth";
import { getProgress, upsertProgress, updateLevel, saveLevelTest, masteryColor } from "../lib/progress";
import { hiraganaGroups, allHiragana, mnemonics } from "../data/hiragana";
import { vocabulary, phrases, sentences, levelTests } from "../data/content";

// ─── Utilities ────────────────────────────────────────────────────────────────
function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

// ─── Shared UI ────────────────────────────────────────────────────────────────
const C = { bg: "#0a0a1a", card: "#16213e", border: "#2d2d4a", accent: "#e74c3c", green: "#2ecc71", yellow: "#f1c40f", text: "#ddd", muted: "#8888aa", dark: "#555577" };

function Btn({ children, onClick, disabled, variant = "primary", style = {} }) {
  const base = { padding: "11px 22px", borderRadius: 11, border: "none", fontSize: 14, fontWeight: 600, cursor: disabled ? "default" : "pointer", fontFamily: "'DM Sans',sans-serif", transition: "opacity 0.15s", opacity: disabled ? 0.5 : 1, ...style };
  const variants = {
    primary: { background: C.accent, color: "#fff" },
    ghost: { background: "transparent", border: `1.5px solid ${C.border}`, color: C.muted },
    success: { background: "#2ecc7122", border: `1.5px solid ${C.green}`, color: C.green },
  };
  return <button onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant] }}>{children}</button>;
}

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 999, height: 5, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: C.accent, borderRadius: 999, transition: "width 0.5s cubic-bezier(.4,0,.2,1)" }} />
    </div>
  );
}

// ─── Quiz component (reusable for vocab / phrases / sentences / level test) ──
function QuizPanel({ items, onAnswer, mode = "meaning" }) {
  // mode: "meaning" (show kana/japanese, pick meaning) | "kana" (show meaning, pick kana)
  const [q, setQ] = useState(null);
  const [selected, setSelected] = useState(null);

  const makeQ = useCallback(() => {
    if (!items || items.length < 4) return;
    const correct = items[Math.floor(Math.random() * items.length)];
    const wrong = shuffle(items.filter((i) => i.id !== correct.id)).slice(0, 3);
    const options = shuffle([correct, ...wrong]);
    setQ({ correct, options });
    setSelected(null);
  }, [items]);

  useEffect(() => { makeQ(); }, [makeQ]);

  if (!q) return <div style={{ color: C.muted, fontSize: 13 }}>Not enough items for a quiz.</div>;

  const handlePick = (opt) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt.id === q.correct.id;
    onAnswer && onAnswer(q.correct, isCorrect);
    setTimeout(() => makeQ(), 1100);
  };

  const questionText = mode === "meaning"
    ? (q.correct.kana || q.correct.japanese)
    : q.correct.meaning;

  const optionText = (opt) => mode === "meaning" ? opt.meaning : (opt.kana || opt.japanese);

  return (
    <div>
      <div style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "32px 24px", textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: q.correct.kana ? 52 : 22, fontFamily: q.correct.kana || q.correct.japanese ? "'Noto Sans JP',sans-serif" : "inherit", color: "#fff", lineHeight: 1.4 }}>
          {questionText}
        </div>
        {q.correct.romaji && mode === "meaning" && (
          <div style={{ fontSize: 12, color: C.dark, marginTop: 8 }}>{q.correct.romaji}</div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {q.options.map((opt) => {
          let bg = C.card, border = C.border, color = C.text;
          if (selected) {
            if (opt.id === q.correct.id) { bg = "#2ecc7122"; border = C.green; color = C.green; }
            else if (selected.id === opt.id) { bg = "#e74c3c22"; border = C.accent; color = C.accent; }
          }
          return (
            <button key={opt.id} onClick={() => handlePick(opt)}
              style={{ padding: "15px 10px", borderRadius: 11, border: `1.5px solid ${border}`, background: bg, color, fontSize: 13, cursor: selected ? "default" : "pointer", transition: "all 0.2s", fontWeight: 500 }}>
              {optionText(opt)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Flashcard component ──────────────────────────────────────────────────────
function Flashcard({ item, onNext, onPrev, idx, total, progress }) {
  const [flipped, setFlipped] = useState(false);
  useEffect(() => setFlipped(false), [item]);
  if (!item) return null;
  const p = progress[item.id];
  const mc = masteryColor(p);
  const isVocab = !!item.kana;
  const isPhrase = !!item.japanese && !item.breakdown;
  const isSentence = !!item.breakdown;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 12, color: C.muted }}>{idx + 1} / {total}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: mc }} />
          <span style={{ fontSize: 11, color: C.dark }}>{p ? `${p.correct}/${p.attempts}` : "unseen"}</span>
        </div>
      </div>

      <div onClick={() => setFlipped(f => !f)} style={{ perspective: 1000, cursor: "pointer", height: 220, marginBottom: 20 }}>
        <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.5s cubic-bezier(.4,0,.2,1)", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
          {/* Front */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(135deg,#16213e,#1a1a3e)", border: `1.5px solid ${C.border}`, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{ fontSize: isVocab ? 52 : 20, fontFamily: "'Noto Sans JP',sans-serif", color: "#fff", lineHeight: 1.4, textAlign: "center", padding: "0 24px" }}>
              {isVocab ? item.kana : item.japanese}
            </div>
            {isVocab && <div style={{ fontSize: 12, color: C.dark }}>{item.romaji}</div>}
            <div style={{ fontSize: 12, color: "#333355", marginTop: 4 }}>tap to reveal</div>
          </div>
          {/* Back */}
          <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg,#0d1b2a,#1a2a1a)", border: "1.5px solid #2d5a2d", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, gap: 10 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: C.accent, textAlign: "center" }}>{item.meaning}</div>
            {isVocab && item.romaji && <div style={{ fontSize: 14, color: C.muted }}>{item.romaji}</div>}
            {isSentence && item.breakdown && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {item.breakdown.map((b, i) => (
                  <div key={i} style={{ background: "#ffffff08", borderRadius: 7, padding: "4px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 13, fontFamily: "'Noto Sans JP',sans-serif", color: "#fff" }}>{b.word}</div>
                    <div style={{ fontSize: 10, color: C.dark }}>{b.meaning}</div>
                  </div>
                ))}
              </div>
            )}
            {isPhrase && <div style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>{item.romaji}</div>}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
        <Btn onClick={onPrev} disabled={idx === 0} variant="ghost">← Prev</Btn>
        <Btn onClick={onNext} disabled={idx === total - 1}>Next →</Btn>
      </div>
    </div>
  );
}

// ─── Level Test Panel ─────────────────────────────────────────────────────────
function LevelTestPanel({ level, onComplete }) {
  const [questions] = useState(() => shuffle(levelTests[level] || []));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (!questions.length) return <div style={{ color: C.muted }}>No test available for this level.</div>;

  const q = questions[idx];
  const PASS_THRESHOLD = 0.7;

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.answer;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) setDone(true);
      else { setIdx(i => i + 1); setSelected(null); }
    }, 900);
  };

  if (done) {
    const pct = score / questions.length;
    const passed = pct >= PASS_THRESHOLD;
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>{passed ? "🎉" : "📚"}</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: passed ? C.green : C.yellow, marginBottom: 8 }}>
          {passed ? "Level Up!" : "Keep Practicing"}
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 20 }}>
          Score: {score}/{questions.length} ({Math.round(pct * 100)}%)
          {passed ? " — You passed! 🏆" : ` — Need ${Math.round(PASS_THRESHOLD * 100)}% to pass.`}
        </div>
        <Btn onClick={() => onComplete(passed, score, questions.length)}>
          {passed ? "Continue →" : "Back to Study"}
        </Btn>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted }}>
        <span>Level Test — {level}</span>
        <span>Question {idx + 1}/{questions.length}</span>
      </div>
      <ProgressBar value={idx} max={questions.length} />
      <div style={{ marginTop: 20, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 18, padding: "28px 20px", marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: C.dark, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>{q.type}</div>
        <div style={{ fontSize: 16, color: "#fff", lineHeight: 1.6, fontFamily: q.type === "sentence" || q.type === "phrase" ? "'Noto Sans JP',sans-serif" : "inherit" }}>
          {q.question}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
        {q.options.map((opt) => {
          let bg = C.card, border = C.border, color = C.text;
          if (selected) {
            if (opt === q.answer) { bg = "#2ecc7122"; border = C.green; color = C.green; }
            else if (opt === selected) { bg = "#e74c3c22"; border = C.accent; color = C.accent; }
          }
          return (
            <button key={opt} onClick={() => handleAnswer(opt)}
              style={{ padding: "14px 10px", borderRadius: 10, border: `1.5px solid ${border}`, background: bg, color, fontSize: 13, cursor: selected ? "default" : "pointer", transition: "all 0.2s" }}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Hiragana section ─────────────────────────────────────────────────────────
function HiraganaSection({ progress, onUpdateProgress }) {
  const [subTab, setSubTab] = useState("chart"); // chart | flashcard | quiz | write
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [flashQueue, setFlashQueue] = useState(() => shuffle(allHiragana));
  const [flashIdx, setFlashIdx] = useState(0);
  const [flashFlipped, setFlashFlipped] = useState(false);
  const [writeChar, setWriteChar] = useState(allHiragana[0]);
  const canvasRef = useRef(null);
  const [quizKey, setQuizKey] = useState(0);

  const activeChars = selectedGroup
    ? hiraganaGroups.find(g => g.group === selectedGroup)?.chars || allHiragana
    : allHiragana;

  const masteredCount = allHiragana.filter(c => { const p = progress[`kana_${c.k}`]; return p && p.attempts >= 3 && p.correct / p.attempts >= 0.8; }).length;

  const mc2 = (kana) => masteryColor(progress[`kana_${kana}`]);

  // Quiz items formatted
  const quizItems = activeChars.map(c => ({ id: `kana_${c.k}`, kana: c.k, romaji: c.r, meaning: c.r }));

  const clearCanvas = () => { const c = canvasRef.current; if (c) c.getContext("2d").clearRect(0, 0, c.width, c.height); };
  useEffect(() => { clearCanvas(); }, [writeChar]);

  let drawing = false, lastPos = null;
  const attachCanvas = (canvas) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const gp = (e) => { const r = canvas.getBoundingClientRect(); const t = e.touches?.[0]; return { x: (t ? t.clientX : e.clientX) - r.left, y: (t ? t.clientY : e.clientY) - r.top }; };
    canvas.onmousedown = canvas.ontouchstart = (e) => { e.preventDefault(); drawing = true; lastPos = gp(e); };
    canvas.onmousemove = canvas.ontouchmove = (e) => { e.preventDefault(); if (!drawing) return; const pos = gp(e); ctx.beginPath(); ctx.moveTo(lastPos.x, lastPos.y); ctx.lineTo(pos.x, pos.y); ctx.strokeStyle = C.accent; ctx.lineWidth = 3; ctx.lineCap = "round"; ctx.stroke(); lastPos = pos; };
    canvas.onmouseup = canvas.onmouseleave = canvas.ontouchend = () => { drawing = false; };
  };

  const subTabs = ["chart", "flashcard", "quiz", "write"];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        {subTabs.map(t => (
          <button key={t} onClick={() => setSubTab(t)}
            style={{ padding: "6px 14px", borderRadius: 8, border: `1.5px solid ${subTab === t ? C.accent : C.border}`, background: subTab === t ? "#e74c3c22" : "transparent", color: subTab === t ? C.accent : C.muted, fontSize: 12, cursor: "pointer", textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 12, color: C.muted, alignSelf: "center" }}>
          {masteredCount}/{allHiragana.length} mastered
        </div>
      </div>

      {/* Group filter */}
      {(subTab === "chart" || subTab === "quiz" || subTab === "flashcard") && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          {[null, ...hiraganaGroups.map(g => g.group)].map((g) => (
            <button key={g || "all"} onClick={() => { setSelectedGroup(g); if (subTab === "flashcard") { setFlashQueue(shuffle(g ? hiraganaGroups.find(x => x.group === g).chars : allHiragana)); setFlashIdx(0); } }}
              style={{ padding: "3px 10px", borderRadius: 999, border: `1.5px solid ${selectedGroup === g ? C.accent : C.border}`, background: selectedGroup === g ? "#e74c3c22" : "transparent", color: selectedGroup === g ? C.accent : C.muted, fontSize: 11, cursor: "pointer" }}>
              {g || "All"}
            </button>
          ))}
        </div>
      )}

      {/* Chart */}
      {subTab === "chart" && (
        <div>
          {(selectedGroup ? [hiraganaGroups.find(g => g.group === selectedGroup)] : hiraganaGroups).map(group => (
            <div key={group.group} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}><b style={{ color: "#fff" }}>{group.group}</b> <span style={{ fontSize: 11, color: C.dark }}>{group.romaji}</span></div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(70px,1fr))", gap: 6 }}>
                {group.chars.map(c => (
                  <div key={c.k} onClick={() => { setWriteChar(c); setSubTab("write"); }}
                    style={{ background: C.card, border: `1.5px solid ${mc2(c.k)}33`, borderRadius: 10, padding: "9px 5px", textAlign: "center", cursor: "pointer", position: "relative" }}>
                    {progress[`kana_${c.k}`]?.attempts > 0 && <div style={{ position: "absolute", top: 3, right: 4, width: 5, height: 5, borderRadius: "50%", background: mc2(c.k) }} />}
                    <div style={{ fontSize: 24, fontFamily: "'Noto Sans JP',sans-serif", color: "#fff" }}>{c.k}</div>
                    <div style={{ fontSize: 10, color: C.muted }}>{c.r}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Flashcard */}
      {subTab === "flashcard" && (
        <div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button onClick={() => { setFlashQueue(shuffle(activeChars)); setFlashIdx(0); setFlashFlipped(false); }}
              style={{ padding: "5px 12px", borderRadius: 7, border: `1.5px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 12, cursor: "pointer" }}>↺ Shuffle</button>
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginBottom: 12 }}>{flashIdx + 1} / {flashQueue.length}</div>
          <div onClick={() => setFlashFlipped(f => !f)} style={{ perspective: 1000, cursor: "pointer", height: 220, marginBottom: 20 }}>
            <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.5s cubic-bezier(.4,0,.2,1)", transform: flashFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: "linear-gradient(135deg,#16213e,#1a1a3e)", border: `1.5px solid ${C.border}`, borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: 88, fontFamily: "'Noto Sans JP',sans-serif", color: "#fff", lineHeight: 1 }}>{flashQueue[flashIdx]?.k}</div>
                <div style={{ fontSize: 12, color: "#333355", marginTop: 8 }}>tap to reveal</div>
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(135deg,#0d1b2a,#1a2a1a)", border: "1.5px solid #2d5a2d", borderRadius: 20, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                <div style={{ fontSize: 52, fontFamily: "'Noto Sans JP',sans-serif", color: "#fff" }}>{flashQueue[flashIdx]?.k}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: C.accent }}>{flashQueue[flashIdx]?.r}</div>
                {mnemonics[flashQueue[flashIdx]?.k] && <div style={{ fontSize: 12, color: C.muted, textAlign: "center", maxWidth: 240, padding: "0 16px" }}>{mnemonics[flashQueue[flashIdx]?.k]}</div>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Btn onClick={() => { setFlashIdx(i => Math.max(0, i - 1)); setFlashFlipped(false); }} disabled={flashIdx === 0} variant="ghost">← Prev</Btn>
            <Btn onClick={() => { setFlashIdx(i => Math.min(flashQueue.length - 1, i + 1)); setFlashFlipped(false); }} disabled={flashIdx === flashQueue.length - 1}>Next →</Btn>
          </div>
        </div>
      )}

      {/* Quiz */}
      {subTab === "quiz" && (
        <QuizPanel key={quizKey} items={quizItems} onAnswer={(item, correct) => {
          const prev = progress[item.id] || { correct: 0, attempts: 0 };
          onUpdateProgress(item.id, "kana", prev.correct + (correct ? 1 : 0), prev.attempts + 1);
        }} />
      )}

      {/* Write */}
      {subTab === "write" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(46px,1fr))", gap: 5, marginBottom: 18, maxHeight: 130, overflowY: "auto" }}>
            {allHiragana.map(c => (
              <button key={c.k} onClick={() => setWriteChar(c)}
                style={{ padding: "7px 2px", borderRadius: 7, border: `1.5px solid ${writeChar.k === c.k ? C.accent : C.border}`, background: writeChar.k === c.k ? "#e74c3c22" : C.card, color: "#fff", fontSize: 17, fontFamily: "'Noto Sans JP',sans-serif", cursor: "pointer" }}>
                {c.k}
              </button>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 12, color: C.muted, marginBottom: 10 }}>Draw: {writeChar.k} ({writeChar.r})</div>
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontSize: 140, color: "#ffffff07", fontFamily: "'Noto Sans JP',sans-serif", pointerEvents: "none", lineHeight: 1 }}>{writeChar.k}</div>
            <canvas ref={(el) => { canvasRef.current = el; attachCanvas(el); }} width={260} height={260}
              style={{ border: `1.5px solid ${C.border}`, borderRadius: 14, cursor: "crosshair", background: C.card, touchAction: "none" }} />
          </div>
          <div style={{ textAlign: "center", marginTop: 12 }}>
            <button onClick={clearCanvas} style={{ padding: "6px 16px", borderRadius: 7, border: `1.5px solid ${C.accent}44`, background: "transparent", color: C.accent, fontSize: 12, cursor: "pointer" }}>Clear</button>
          </div>
          {mnemonics[writeChar.k] && (
            <div style={{ marginTop: 14, background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "11px 14px", fontSize: 12, color: C.muted }}>{mnemonics[writeChar.k]}</div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const [mainTab, setMainTab] = useState("learn"); // learn | hiragana | progress
  const [learnSection, setLearnSection] = useState("vocab"); // vocab | phrases | sentences | leveltest
  const [learnMode, setLearnMode] = useState("flashcard"); // flashcard | quiz
  const [progress, setProgress] = useState({});
  const [progLoading, setProgLoading] = useState(true);
  const [flashItems, setFlashItems] = useState([]);
  const [flashIdx, setFlashIdx] = useState(0);
  const [testDone, setTestDone] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user && profile && !profile.placement_done) router.replace("/placement");
  }, [user, profile, loading]);

  useEffect(() => {
    if (user) {
      getProgress(user.id).then((p) => { setProgress(p); setProgLoading(false); });
    }
  }, [user]);

  const level = profile?.level || "beginner";
  const vocabItems = vocabulary[level] || [];
  const phraseItems = phrases[level] || [];
  const sentenceItems = sentences[level] || [];

  useEffect(() => {
    const map = { vocab: vocabItems, phrases: phraseItems, sentences: sentenceItems };
    setFlashItems(shuffle(map[learnSection] || vocabItems));
    setFlashIdx(0);
  }, [learnSection, level]);

  const handleUpdateProgress = useCallback(async (itemId, itemType, correct, attempts) => {
    setProgress(prev => ({ ...prev, [itemId]: { ...prev[itemId], correct, attempts } }));
    if (user) await upsertProgress(user.id, itemId, itemType, correct, attempts);
  }, [user]);

  const handleLevelTestComplete = async (passed, score, total) => {
    if (!user) return;
    const nextLevel = { beginner: "elementary", elementary: "intermediate" };
    await saveLevelTest(user.id, level, score, total, passed);
    if (passed && nextLevel[level]) {
      await updateLevel(user.id, nextLevel[level]);
      await refreshProfile();
    }
    setTestDone(false);
    setLearnSection("vocab");
  };

  const masteredVocab = vocabItems.filter(v => { const p = progress[v.id]; return p && p.attempts >= 3 && p.correct / p.attempts >= 0.8; }).length;
  const masteredPhrases = phraseItems.filter(v => { const p = progress[v.id]; return p && p.attempts >= 3 && p.correct / p.attempts >= 0.8; }).length;

  const levelColors = { beginner: C.green, elementary: C.yellow, intermediate: C.accent };
  const levelLabels = { beginner: "🌱 Beginner", elementary: "🌿 Elementary", intermediate: "🌳 Intermediate" };

  if (loading || progLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
      <div style={{ color: C.dark, fontSize: 14 }}>Loading...</div>
    </div>
  );

  if (!user || !profile) return null;

  const mainTabs = [
    { id: "learn", label: "Learn", icon: "◎" },
    { id: "hiragana", label: "Hiragana", icon: "あ" },
    { id: "progress", label: "Progress", icon: "◈" },
  ];

  const learnSections = [
    { id: "vocab", label: "Vocabulary" },
    { id: "phrases", label: "Phrases" },
    { id: "sentences", label: "Sentences" },
    ...(level !== "intermediate" ? [{ id: "leveltest", label: "Level Test 🏆" }] : []),
  ];

  const currentItems = { vocab: vocabItems, phrases: phraseItems, sentences: sentenceItems }[learnSection] || [];

  return (
    <>
      <Head><title>Nihongo Master</title></Head>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Header */}
        <header style={{ padding: "24px 0 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: C.accent, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 4 }}>日本語</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>Nihongo Master</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: levelColors[level] }}>{levelLabels[level]}</div>
              <div style={{ fontSize: 11, color: C.dark }}>{profile.display_name || profile.email}</div>
            </div>
            <button onClick={signOut} style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${C.border}`, background: "transparent", color: C.muted, fontSize: 11, cursor: "pointer" }}>Logout</button>
          </div>
        </header>

        {/* Nav tabs */}
        <nav style={{ display: "flex", gap: 3, background: "#16213e", borderRadius: 12, padding: 4, marginBottom: 22 }}>
          {mainTabs.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              style={{ flex: 1, padding: "8px 4px", borderRadius: 9, border: "none", background: mainTab === t.id ? C.bg : "transparent", color: mainTab === t.id ? "#fff" : C.muted, fontSize: 13, fontWeight: mainTab === t.id ? 600 : 400, cursor: "pointer" }}>
              <span style={{ marginRight: 5 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>

        {/* ── LEARN TAB ── */}
        {mainTab === "learn" && (
          <div>
            {/* Section tabs */}
            <div style={{ display: "flex", gap: 7, marginBottom: 20, flexWrap: "wrap" }}>
              {learnSections.map(s => (
                <button key={s.id} onClick={() => { setLearnSection(s.id); setTestDone(false); }}
                  style={{ padding: "6px 14px", borderRadius: 9, border: `1.5px solid ${learnSection === s.id ? C.accent : C.border}`, background: learnSection === s.id ? "#e74c3c22" : "transparent", color: learnSection === s.id ? C.accent : C.muted, fontSize: 12, cursor: "pointer" }}>
                  {s.label}
                </button>
              ))}
            </div>

            {learnSection === "leveltest" ? (
              <LevelTestPanel level={level} onComplete={handleLevelTestComplete} />
            ) : (
              <>
                {/* Flashcard / Quiz toggle */}
                <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                  {["flashcard", "quiz"].map(m => (
                    <button key={m} onClick={() => setLearnMode(m)}
                      style={{ padding: "5px 14px", borderRadius: 8, border: `1.5px solid ${learnMode === m ? C.accent : C.border}`, background: learnMode === m ? "#e74c3c22" : "transparent", color: learnMode === m ? C.accent : C.muted, fontSize: 11, cursor: "pointer", textTransform: "capitalize" }}>
                      {m}
                    </button>
                  ))}
                  <div style={{ marginLeft: "auto", fontSize: 11, color: C.dark, alignSelf: "center" }}>
                    {currentItems.length} items
                  </div>
                </div>

                {learnMode === "flashcard" ? (
                  <Flashcard
                    item={flashItems[flashIdx]}
                    idx={flashIdx}
                    total={flashItems.length}
                    progress={progress}
                    onNext={() => setFlashIdx(i => Math.min(flashItems.length - 1, i + 1))}
                    onPrev={() => setFlashIdx(i => Math.max(0, i - 1))}
                  />
                ) : (
                  <QuizPanel
                    items={currentItems}
                    onAnswer={(item, correct) => {
                      const prev = progress[item.id] || { correct: 0, attempts: 0 };
                      handleUpdateProgress(item.id, learnSection === "vocab" ? "vocab" : learnSection === "phrases" ? "phrase" : "sentence", prev.correct + (correct ? 1 : 0), prev.attempts + 1);
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* ── HIRAGANA TAB ── */}
        {mainTab === "hiragana" && (
          <HiraganaSection progress={progress} onUpdateProgress={handleUpdateProgress} />
        )}

        {/* ── PROGRESS TAB ── */}
        {mainTab === "progress" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12, marginBottom: 24 }}>
              {[
                { label: "Current Level", value: levelLabels[level], color: levelColors[level] },
                { label: "Vocab Mastered", value: `${masteredVocab}/${vocabItems.length}`, color: C.green },
                { label: "Phrases Mastered", value: `${masteredPhrases}/${phraseItems.length}`, color: C.yellow },
                { label: "Hiragana Mastered", value: `${allHiragana.filter(c => { const p = progress[`kana_${c.k}`]; return p && p.attempts >= 3 && p.correct / p.attempts >= 0.8; }).length}/${allHiragana.length}`, color: C.accent },
              ].map(stat => (
                <div key={stat.label} style={{ background: C.card, border: `1.5px solid ${C.border}`, borderRadius: 14, padding: "18px 16px" }}>
                  <div style={{ fontSize: 11, color: C.dark, marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Vocab progress list */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 10 }}>Vocabulary Progress</div>
              <ProgressBar value={masteredVocab} max={vocabItems.length} />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 6, marginTop: 12 }}>
                {vocabItems.map(v => {
                  const p = progress[v.id];
                  const mc = masteryColor(p);
                  return (
                    <div key={v.id} style={{ background: C.card, border: `1.5px solid ${mc}33`, borderRadius: 9, padding: "9px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14, fontFamily: "'Noto Sans JP',sans-serif", color: "#fff" }}>{v.kana}</div>
                        <div style={{ fontSize: 10, color: C.dark }}>{v.meaning}</div>
                      </div>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: mc, flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, fontSize: 11, color: C.dark, flexWrap: "wrap" }}>
              {[[C.green, "Mastered"], [C.yellow, "Learning"], [C.accent, "Struggling"], [C.border, "Unseen"]].map(([col, lbl]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 5 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: col }} />{lbl}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function Home() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
