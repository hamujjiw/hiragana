import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth, AuthProvider } from "../lib/auth";
import { completePlacement } from "../lib/progress";
import { placementQuestions } from "../data/content";

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

const QUESTIONS = shuffle(placementQuestions);

function determineLevel(answers) {
  // answers: array of { question, correct }
  const byLevel = { beginner: { correct: 0, total: 0 }, elementary: { correct: 0, total: 0 }, intermediate: { correct: 0, total: 0 } };
  answers.forEach(({ question, correct }) => {
    const l = question.level;
    byLevel[l].total++;
    if (correct) byLevel[l].correct++;
  });
  const score = (l) => byLevel[l].total > 0 ? byLevel[l].correct / byLevel[l].total : 0;
  if (score("intermediate") >= 0.7) return "intermediate";
  if (score("elementary") >= 0.7) return "elementary";
  return "beginner";
}

function PlacementTestInner() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;

  const handleAnswer = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.answer;
    setTimeout(async () => {
      const newAnswers = [...answers, { question: q, correct }];
      if (idx + 1 >= total) {
        const level = determineLevel(newAnswers);
        setResult({ level, answers: newAnswers });
        setDone(true);
      } else {
        setAnswers(newAnswers);
        setIdx(idx + 1);
        setSelected(null);
      }
    }, 900);
  };

  const handleFinish = async () => {
    if (!user) return;
    setSaving(true);
    await completePlacement(user.id, result.level);
    await refreshProfile();
    router.replace("/");
  };

  const levelInfo = {
    beginner: { label: "🌱 Beginner", desc: "You're just starting out! We'll begin with the fundamentals — hiragana, basic vocab, and essential phrases.", color: "#2ecc71" },
    elementary: { label: "🌿 Elementary", desc: "You have some foundation! We'll build on your knowledge with daily vocab, common phrases, and simple sentences.", color: "#f1c40f" },
    intermediate: { label: "🌳 Intermediate", desc: "Impressive! You already know quite a bit. We'll challenge you with richer vocab, conversational phrases, and complex sentences.", color: "#e74c3c" },
  };

  return (
    <>
      <Head><title>Placement Test — Nihongo Master</title></Head>
      <div style={{ minHeight: "100vh", background: "#0a0a1a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 520 }}>

          {!done ? (
            <>
              {/* Header */}
              <div style={{ marginBottom: 32, textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#e74c3c", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 8 }}>Placement Test</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>Where are you right now?</div>
                <div style={{ fontSize: 13, color: "#555577", marginTop: 4 }}>Question {idx + 1} of {total}</div>
              </div>

              {/* Progress bar */}
              <div style={{ background: "#1a1a2e", borderRadius: 999, height: 4, overflow: "hidden", marginBottom: 32 }}>
                <div style={{ width: `${((idx) / total) * 100}%`, height: "100%", background: "#e74c3c", borderRadius: 999, transition: "width 0.4s ease" }} />
              </div>

              {/* Question card */}
              <div style={{ background: "#16213e", border: "1.5px solid #2d2d6a", borderRadius: 20, padding: 32, marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: "#555577", marginBottom: 12, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {q.type === "kana" ? "Hiragana Reading" : q.type === "vocab" ? "Vocabulary" : q.type === "phrase" ? "Phrase" : "Sentence"}
                </div>
                {q.kana ? (
                  <div style={{ textAlign: "center", marginBottom: 8 }}>
                    <div style={{ fontSize: 72, fontFamily: "'Noto Sans JP', sans-serif", color: "#fff", lineHeight: 1 }}>{q.kana}</div>
                  </div>
                ) : (
                  <div style={{ fontSize: 18, color: "#fff", marginBottom: 8, fontFamily: q.type === "sentence" || q.type === "phrase" ? "'Noto Sans JP', sans-serif" : "inherit", lineHeight: 1.6 }}>
                    {q.question}
                  </div>
                )}
                {q.kana && <div style={{ fontSize: 14, color: "#8888aa", textAlign: "center" }}>{q.question}</div>}
              </div>

              {/* Options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {q.options.map((opt) => {
                  let bg = "#16213e", border = "#2d2d4a", color = "#ccc";
                  if (selected) {
                    if (opt === q.answer) { bg = "#2ecc7122"; border = "#2ecc71"; color = "#2ecc71"; }
                    else if (opt === selected) { bg = "#e74c3c22"; border = "#e74c3c"; color = "#e74c3c"; }
                  }
                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      style={{ padding: "16px 12px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontSize: 14, cursor: selected ? "default" : "pointer", transition: "all 0.2s", fontWeight: 500, textAlign: "center" }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Result */
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
              <div style={{ fontSize: 13, color: "#555577", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Your Level</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: levelInfo[result.level].color, marginBottom: 16 }}>
                {levelInfo[result.level].label}
              </div>
              <div style={{ background: "#16213e", border: "1.5px solid #2d2d6a", borderRadius: 16, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: "#aaa", lineHeight: 1.7 }}>{levelInfo[result.level].desc}</div>
                <div style={{ marginTop: 16, fontSize: 13, color: "#555577" }}>
                  Score: {result.answers.filter((a) => a.correct).length} / {result.answers.length}
                </div>
              </div>
              <button onClick={handleFinish} disabled={saving}
                style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: saving ? "#333355" : "#e74c3c", color: "#fff", fontSize: 16, fontWeight: 700, cursor: saving ? "default" : "pointer" }}>
                {saving ? "Saving..." : "Start Learning →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function PlacementTest() {
  return <AuthProvider><PlacementTestInner /></AuthProvider>;
}
