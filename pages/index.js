import { useState, useEffect, useCallback, useRef } from "react";
import Head from "next/head";
import { hiraganaGroups, allCharacters, mnemonics, exampleWords } from "../data/hiragana";

// ─── Progress helpers ──────────────────────────────────────────────────────
function loadProgress() {
  try {
    const raw = localStorage.getItem("hiragana_progress");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem("hiragana_progress", JSON.stringify(p)); } catch {}
}

// ─── Fisher-Yates shuffle ──────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Generate quiz question ───────────────────────────────────────────────
function makeQuestion(chars, mode) {
  const correct = chars[Math.floor(Math.random() * chars.length)];
  const wrong = shuffle(allCharacters.filter((c) => c.kana !== correct.kana)).slice(0, 3);
  const options = shuffle([correct, ...wrong]);
  return { correct, options, mode };
}

// ─── Components ───────────────────────────────────────────────────────────

function ProgressBar({ value, max, color = "#e74c3c" }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: "#1a1a2e", borderRadius: 999, height: 6, overflow: "hidden" }}>
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 999,
          transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

function KanaCard({ char, progress, onClick, compact }) {
  const p = progress[char.kana] || { correct: 0, attempts: 0 };
  const mastery = p.attempts > 0 ? Math.min(1, p.correct / Math.max(p.attempts, 3)) : 0;
  const masteryColor =
    mastery >= 0.8 ? "#2ecc71" : mastery >= 0.4 ? "#f1c40f" : p.attempts > 0 ? "#e74c3c" : "#2d2d4a";

  return (
    <div
      onClick={() => onClick && onClick(char)}
      style={{
        background: "#16213e",
        border: `1.5px solid ${masteryColor}33`,
        borderRadius: 12,
        padding: compact ? "10px 6px" : "16px 10px",
        cursor: onClick ? "pointer" : "default",
        textAlign: "center",
        transition: "all 0.2s",
        position: "relative",
        overflow: "hidden",
      }}
      className="kana-card"
    >
      {p.attempts > 0 && (
        <div
          style={{
            position: "absolute",
            top: 4,
            right: 6,
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: masteryColor,
          }}
        />
      )}
      <div style={{ fontSize: compact ? 26 : 34, lineHeight: 1, color: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
        {char.kana}
      </div>
      <div style={{ fontSize: 11, color: "#8888aa", marginTop: 4, letterSpacing: "0.05em" }}>
        {char.romaji}
      </div>
    </div>
  );
}

function FlashCard({ char, progress }) {
  const [flipped, setFlipped] = useState(false);
  const example = exampleWords[char.kana];
  const mnemonic = mnemonics[char.kana];
  const p = progress[char.kana] || { correct: 0, attempts: 0 };

  useEffect(() => { setFlipped(false); }, [char]);

  return (
    <div
      onClick={() => setFlipped((f) => !f)}
      style={{
        perspective: 1000,
        cursor: "pointer",
        width: "100%",
        maxWidth: 360,
        margin: "0 auto",
        height: 260,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.55s cubic-bezier(.4,0,.2,1)",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #16213e 0%, #1a1a3e 100%)",
            border: "1.5px solid #2d2d6a",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 96, lineHeight: 1, color: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
            {char.kana}
          </div>
          <div style={{ fontSize: 13, color: "#555577", marginTop: 16 }}>tap to reveal</div>
        </div>
        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "linear-gradient(135deg, #0d1b2a 0%, #1a2a1a 100%)",
            border: "1.5px solid #2d5a2d",
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            gap: 10,
          }}
        >
          <div style={{ fontSize: 52, lineHeight: 1, color: "#fff", fontFamily: "'Noto Sans JP', sans-serif" }}>
            {char.kana}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#e74c3c", letterSpacing: "0.1em" }}>
            {char.romaji}
          </div>
          {mnemonic && (
            <div style={{ fontSize: 12, color: "#8888aa", textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>
              {mnemonic}
            </div>
          )}
          {example && (
            <div
              style={{
                background: "#ffffff0a",
                borderRadius: 10,
                padding: "8px 16px",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 18, color: "#f1c40f", fontFamily: "'Noto Sans JP', sans-serif" }}>
                {example.word}
              </span>
              <span style={{ fontSize: 12, color: "#8888aa", marginLeft: 8 }}>
                {example.reading} — {example.meaning}
              </span>
            </div>
          )}
          {p.attempts > 0 && (
            <div style={{ fontSize: 11, color: "#555577" }}>
              {p.correct}/{p.attempts} correct
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuizMode({ chars, progress, onUpdateProgress }) {
  const [q, setQ] = useState(() => makeQuestion(chars, "kana-to-romaji"));
  const [selected, setSelected] = useState(null);
  const [streak, setStreak] = useState(0);
  const [total, setTotal] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mode, setMode] = useState("kana-to-romaji");

  const nextQuestion = useCallback((m) => {
    setQ(makeQuestion(chars, m || mode));
    setSelected(null);
  }, [chars, mode]);

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const isCorrect = opt.kana === q.correct.kana;
    setTotal((t) => t + 1);
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    const prev = progress[q.correct.kana] || { correct: 0, attempts: 0 };
    onUpdateProgress(q.correct.kana, {
      correct: prev.correct + (isCorrect ? 1 : 0),
      attempts: prev.attempts + 1,
    });
    setTimeout(() => nextQuestion(mode), 1100);
  };

  const switchMode = (m) => {
    setMode(m);
    nextQuestion(m);
  };

  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

  return (
    <div>
      {/* Mode switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["kana-to-romaji", "romaji-to-kana"].map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: `1.5px solid ${mode === m ? "#e74c3c" : "#2d2d4a"}`,
              background: mode === m ? "#e74c3c22" : "transparent",
              color: mode === m ? "#e74c3c" : "#8888aa",
              fontSize: 12,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {m === "kana-to-romaji" ? "Kana → Romaji" : "Romaji → Kana"}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 20, marginBottom: 28, fontSize: 13 }}>
        <div style={{ color: "#8888aa" }}>
          Score <span style={{ color: "#2ecc71", fontWeight: 700 }}>{correct}</span>/{total}
        </div>
        <div style={{ color: "#8888aa" }}>
          Accuracy <span style={{ color: "#f1c40f", fontWeight: 700 }}>{accuracy}%</span>
        </div>
        {streak >= 3 && (
          <div style={{ color: "#e74c3c", fontWeight: 700, animation: "pulse 0.6s ease" }}>
            🔥 {streak} streak!
          </div>
        )}
      </div>

      {/* Question */}
      <div
        style={{
          background: "#16213e",
          border: "1.5px solid #2d2d6a",
          borderRadius: 20,
          padding: "40px 24px",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        {mode === "kana-to-romaji" ? (
          <div style={{ fontSize: 80, color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: 1 }}>
            {q.correct.kana}
          </div>
        ) : (
          <div style={{ fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>
            {q.correct.romaji}
          </div>
        )}
      </div>

      {/* Options */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {q.options.map((opt) => {
          const isSelected = selected?.kana === opt.kana;
          const isCorrectOpt = opt.kana === q.correct.kana;
          let bg = "#16213e";
          let border = "#2d2d4a";
          let color = "#ccc";
          if (selected) {
            if (isCorrectOpt) { bg = "#2ecc7122"; border = "#2ecc71"; color = "#2ecc71"; }
            else if (isSelected) { bg = "#e74c3c22"; border = "#e74c3c"; color = "#e74c3c"; }
          }
          return (
            <button
              key={opt.kana}
              onClick={() => handleAnswer(opt)}
              style={{
                padding: "18px 12px",
                borderRadius: 12,
                border: `1.5px solid ${border}`,
                background: bg,
                color,
                fontSize: mode === "kana-to-romaji" ? 18 : 28,
                fontFamily: mode === "romaji-to-kana" ? "'Noto Sans JP', sans-serif" : "inherit",
                cursor: selected ? "default" : "pointer",
                transition: "all 0.2s",
                fontWeight: 600,
                letterSpacing: mode === "kana-to-romaji" ? "0.08em" : 0,
              }}
            >
              {mode === "kana-to-romaji" ? opt.romaji : opt.kana}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function WritingMode({ char }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches?.[0];
    const clientX = touch ? touch.clientX : e.clientX;
    const clientY = touch ? touch.clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const pos = getPos(e, canvas);
    setDrawing(true);
    setHasDrawing(true);
    lastPos.current = pos;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#e74c3c";
    ctx.fill();
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  useEffect(() => { clear(); }, [char]);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 72, color: "#ffffff22", fontFamily: "'Noto Sans JP', sans-serif", marginBottom: 4 }}>
          {char.kana}
        </div>
        <div style={{ fontSize: 13, color: "#8888aa" }}>Trace over the character</div>
      </div>

      <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
        {/* Guide character behind canvas */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 160,
            color: "#ffffff0a",
            fontFamily: "'Noto Sans JP', sans-serif",
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {char.kana}
        </div>
        <canvas
          ref={canvasRef}
          width={280}
          height={280}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{
            border: "1.5px solid #2d2d6a",
            borderRadius: 16,
            cursor: "crosshair",
            background: "#16213e",
            touchAction: "none",
          }}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button
          onClick={clear}
          style={{
            padding: "8px 20px",
            borderRadius: 8,
            border: "1.5px solid #e74c3c44",
            background: "transparent",
            color: "#e74c3c",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          marginTop: 20,
          background: "#16213e",
          border: "1.5px solid #2d2d4a",
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 12,
          color: "#8888aa",
          lineHeight: 1.8,
        }}
      >
        <div style={{ color: "#fff", marginBottom: 4, fontWeight: 600 }}>
          {char.kana} ({char.romaji}) — {char.stroke_order}
        </div>
        {mnemonics[char.kana] && <div>{mnemonics[char.kana]}</div>}
        {exampleWords[char.kana] && (
          <div style={{ marginTop: 6, color: "#f1c40f", fontFamily: "'Noto Sans JP', sans-serif", fontSize: 14 }}>
            {exampleWords[char.kana].word}{" "}
            <span style={{ color: "#8888aa", fontFamily: "inherit", fontSize: 11 }}>
              ({exampleWords[char.kana].reading} — {exampleWords[char.kana].meaning})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────
export default function Home() {
  const [progress, setProgress] = useState({});
  const [activeTab, setActiveTab] = useState("chart"); // chart | flashcard | quiz | write
  const [selectedChar, setSelectedChar] = useState(allCharacters[0]);
  const [selectedGroup, setSelectedGroup] = useState(null); // null = all
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashQueue, setFlashQueue] = useState(() => shuffle(allCharacters));

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const updateProgress = useCallback((kana, data) => {
    setProgress((prev) => {
      const next = { ...prev, [kana]: data };
      saveProgress(next);
      return next;
    });
  }, []);

  const masteredCount = Object.values(progress).filter(
    (p) => p.attempts >= 3 && p.correct / p.attempts >= 0.8
  ).length;

  const activeChars = selectedGroup
    ? hiraganaGroups.find((g) => g.group === selectedGroup)?.characters || allCharacters
    : allCharacters;

  // flashcard navigation
  const prevFlash = () => setFlashIndex((i) => Math.max(0, i - 1));
  const nextFlash = () => setFlashIndex((i) => Math.min(flashQueue.length - 1, i + 1));
  const shuffleFlash = () => {
    setFlashQueue(shuffle(activeChars));
    setFlashIndex(0);
  };

  useEffect(() => {
    setFlashQueue(shuffle(activeChars));
    setFlashIndex(0);
  }, [selectedGroup]);

  const tabs = [
    { id: "chart", label: "Chart", icon: "◉" },
    { id: "flashcard", label: "Flashcards", icon: "⧉" },
    { id: "quiz", label: "Quiz", icon: "⬡" },
    { id: "write", label: "Writing", icon: "✏" },
  ];

  return (
    <>
      <Head>
        <title>Hiragana Master — Learn Japanese</title>
        <meta name="description" content="Master Japanese Hiragana with interactive flashcards, quizzes, and writing practice." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Space+Mono:wght@400;700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700;1,9..40,400&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0a0a1a;
          color: #ddd;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }
        .kana-card:hover { transform: translateY(-2px); border-color: #e74c3c44 !important; }
        .tab-btn:hover { background: #ffffff08 !important; }
        .group-pill:hover { border-color: #e74c3c88 !important; background: #e74c3c11 !important; }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.4s ease; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2d2d4a; border-radius: 3px; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 16px 80px" }}>
        {/* Header */}
        <header style={{ padding: "32px 0 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 11, color: "#e74c3c", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 6 }}>
              日本語
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
              Hiragana Master
            </h1>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#2ecc71" }}>{masteredCount}</div>
            <div style={{ fontSize: 11, color: "#8888aa", letterSpacing: "0.05em" }}>
              / {allCharacters.length} mastered
            </div>
          </div>
        </header>

        {/* Progress bar */}
        <ProgressBar value={masteredCount} max={allCharacters.length} />

        {/* Navigation Tabs */}
        <nav style={{ display: "flex", gap: 4, margin: "24px 0", background: "#16213e", borderRadius: 12, padding: 4 }}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className="tab-btn"
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1,
                padding: "9px 4px",
                borderRadius: 9,
                border: "none",
                background: activeTab === t.id ? "#0a0a1a" : "transparent",
                color: activeTab === t.id ? "#fff" : "#8888aa",
                fontSize: 13,
                fontWeight: activeTab === t.id ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span style={{ marginRight: 6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Group Filter */}
        {(activeTab === "chart" || activeTab === "quiz" || activeTab === "flashcard") && (
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 24,
            }}
          >
            <button
              className="group-pill"
              onClick={() => setSelectedGroup(null)}
              style={{
                padding: "4px 12px",
                borderRadius: 999,
                border: `1.5px solid ${selectedGroup === null ? "#e74c3c" : "#2d2d4a"}`,
                background: selectedGroup === null ? "#e74c3c22" : "transparent",
                color: selectedGroup === null ? "#e74c3c" : "#8888aa",
                fontSize: 11,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              All
            </button>
            {hiraganaGroups.map((g) => (
              <button
                key={g.group}
                className="group-pill"
                onClick={() => setSelectedGroup(g.group)}
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  border: `1.5px solid ${selectedGroup === g.group ? "#e74c3c" : "#2d2d4a"}`,
                  background: selectedGroup === g.group ? "#e74c3c22" : "transparent",
                  color: selectedGroup === g.group ? "#e74c3c" : "#8888aa",
                  fontSize: 11,
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                  transition: "all 0.15s",
                }}
              >
                {g.group}
              </button>
            ))}
          </div>
        )}

        {/* ── CHART TAB ── */}
        {activeTab === "chart" && (
          <div className="fade-in">
            {(selectedGroup
              ? [hiraganaGroups.find((g) => g.group === selectedGroup)].filter(Boolean)
              : hiraganaGroups
            ).map((group) => (
              <div key={group.group} style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{group.group}</span>
                  <span style={{ fontSize: 11, color: "#555577", letterSpacing: "0.08em" }}>{group.romaji_group}</span>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
                    gap: 8,
                  }}
                >
                  {group.characters.map((char) => (
                    <KanaCard
                      key={char.kana}
                      char={char}
                      progress={progress}
                      compact
                      onClick={(c) => {
                        setSelectedChar(c);
                        setActiveTab("write");
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div
              style={{
                marginTop: 8,
                display: "flex",
                gap: 20,
                fontSize: 11,
                color: "#555577",
              }}
            >
              {[
                { color: "#2ecc71", label: "Mastered (≥80%)" },
                { color: "#f1c40f", label: "Learning" },
                { color: "#e74c3c", label: "Struggling" },
                { color: "#2d2d4a", label: "Not studied" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FLASHCARD TAB ── */}
        {activeTab === "flashcard" && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: "#8888aa" }}>
                {flashIndex + 1} / {flashQueue.length}
              </span>
              <button
                onClick={shuffleFlash}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #2d2d4a",
                  background: "transparent",
                  color: "#8888aa",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                ↺ Shuffle
              </button>
            </div>

            <FlashCard char={flashQueue[flashIndex]} progress={progress} />

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 28 }}>
              <button
                onClick={prevFlash}
                disabled={flashIndex === 0}
                style={{
                  padding: "12px 28px",
                  borderRadius: 10,
                  border: "1.5px solid #2d2d4a",
                  background: "transparent",
                  color: flashIndex === 0 ? "#333355" : "#fff",
                  fontSize: 14,
                  cursor: flashIndex === 0 ? "default" : "pointer",
                }}
              >
                ← Prev
              </button>
              <button
                onClick={nextFlash}
                disabled={flashIndex === flashQueue.length - 1}
                style={{
                  padding: "12px 28px",
                  borderRadius: 10,
                  border: "1.5px solid #e74c3c44",
                  background: "#e74c3c22",
                  color: flashIndex === flashQueue.length - 1 ? "#555577" : "#e74c3c",
                  fontSize: 14,
                  cursor: flashIndex === flashQueue.length - 1 ? "default" : "pointer",
                }}
              >
                Next →
              </button>
            </div>

            {/* Progress dots */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                marginTop: 16,
                flexWrap: "wrap",
                maxWidth: 360,
                margin: "16px auto 0",
              }}
            >
              {flashQueue.slice(0, 20).map((_, i) => (
                <div
                  key={i}
                  onClick={() => setFlashIndex(i)}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: i === flashIndex ? "#e74c3c" : "#2d2d4a",
                    cursor: "pointer",
                    transition: "background 0.2s",
                  }}
                />
              ))}
              {flashQueue.length > 20 && (
                <span style={{ fontSize: 10, color: "#555577" }}>+{flashQueue.length - 20}</span>
              )}
            </div>
          </div>
        )}

        {/* ── QUIZ TAB ── */}
        {activeTab === "quiz" && (
          <div className="fade-in">
            <QuizMode
              chars={activeChars}
              progress={progress}
              onUpdateProgress={updateProgress}
            />
          </div>
        )}

        {/* ── WRITE TAB ── */}
        {activeTab === "write" && (
          <div className="fade-in">
            {/* Character picker */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(52px, 1fr))",
                gap: 6,
                marginBottom: 24,
                maxHeight: 140,
                overflowY: "auto",
              }}
            >
              {allCharacters.map((c) => (
                <button
                  key={c.kana}
                  onClick={() => setSelectedChar(c)}
                  style={{
                    padding: "8px 4px",
                    borderRadius: 8,
                    border: `1.5px solid ${selectedChar?.kana === c.kana ? "#e74c3c" : "#2d2d4a"}`,
                    background: selectedChar?.kana === c.kana ? "#e74c3c22" : "#16213e",
                    color: "#fff",
                    fontSize: 18,
                    fontFamily: "'Noto Sans JP', sans-serif",
                    cursor: "pointer",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                >
                  {c.kana}
                </button>
              ))}
            </div>

            {selectedChar && <WritingMode char={selectedChar} />}
          </div>
        )}
      </div>
    </>
  );
}
