import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useAuth, AuthProvider } from "../lib/auth";
import { completePlacement } from "../lib/progress";
import { placementQuestions } from "../data/content";

function shuffle(a) { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; }

const T = {
  navy: "#0D2B5E", navyMid: "#1E3A6E", blue: "#1E88E5", blueLight: "#4DA8FF",
  bluePale: "#E3EDF8", blueFaint: "#F0F4FB", text: "#0D2B5E", textMid: "#5A7BA8",
  textLight: "#8BADD4", border: "#D0DFF0", white: "#FFFFFF",
  green: "#1D9E75", greenPale: "#E1F5EE", red: "#E53935", redPale: "#FEF0F0",
};

const QUESTIONS = shuffle(placementQuestions);

function determineLevel(answers) {
  const byLevel = { beginner: { correct: 0, total: 0 }, elementary: { correct: 0, total: 0 }, intermediate: { correct: 0, total: 0 } };
  answers.forEach(({ question, correct }) => {
    byLevel[question.level].total++;
    if (correct) byLevel[question.level].correct++;
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
  const pct = Math.round((idx / total) * 100);

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
    beginner: { label: "Beginner", desc: "Kamu baru mulai — sempurna! Kita akan mulai dari dasar hiragana, vocab sederhana, dan frasa sehari-hari.", color: T.green },
    elementary: { label: "Elementary", desc: "Kamu sudah punya dasar yang bagus! Kita akan perkuat vocab harian, frasa situasional, dan kalimat sederhana.", color: "#E8960C" },
    intermediate: { label: "Intermediate", desc: "Kamu sudah cukup jauh! Kita akan fokus ke vocab yang lebih kaya, percakapan, dan kalimat yang lebih kompleks.", color: T.blue },
  };

  const typeLabel = { kana: "Hiragana", vocab: "Kosakata", phrase: "Frasa", sentence: "Kalimat" };

  return (
    <>
      <Head><title>Placement Test</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.blueFaint}; font-family: 'DM Sans', sans-serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.35s ease; }
        button { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div style={{ minHeight: "100vh", background: T.blueFaint, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ width: "100%", maxWidth: 520 }} className="fade-up">

          {!done ? (
            <>
              {/* Header */}
              <div style={{ textAlign: "center", marginBottom: 28 }}>
                <div style={{ display: "inline-block", background: T.bluePale, color: T.blue, fontSize: 11, fontWeight: 600, padding: "4px 14px", borderRadius: 999, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
                  Placement Test
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.navy }}>Di mana level kamu sekarang?</div>
                <div style={{ fontSize: 13, color: T.textLight, marginTop: 4 }}>Soal {idx + 1} dari {total}</div>
              </div>

              {/* Progress bar */}
              <div style={{ background: T.white, borderRadius: 999, height: 5, overflow: "hidden", marginBottom: 28, border: `1px solid ${T.border}` }}>
                <div style={{ width: `${pct}%`, height: "100%", background: T.blue, borderRadius: 999, transition: "width 0.4s ease" }} />
              </div>

              {/* Question card */}
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 18, padding: "32px 24px", marginBottom: 16, textAlign: "center" }}>
                <div style={{ display: "inline-block", fontSize: 10, color: T.textLight, letterSpacing: "0.1em", textTransform: "uppercase", background: T.blueFaint, padding: "3px 10px", borderRadius: 999, marginBottom: 16 }}>
                  {typeLabel[q.type] || q.type}
                </div>
                {q.kana ? (
                  <div style={{ fontSize: 72, fontFamily: "'Noto Sans JP',sans-serif", color: T.navy, lineHeight: 1 }}>{q.kana}</div>
                ) : (
                  <div style={{ fontSize: 18, color: T.navy, lineHeight: 1.6, fontFamily: (q.type === "sentence" || q.type === "phrase") ? "'Noto Sans JP',sans-serif" : "inherit" }}>
                    {q.question}
                  </div>
                )}
                {q.kana && <div style={{ fontSize: 13, color: T.textLight, marginTop: 8 }}>{q.question}</div>}
              </div>

              {/* Options */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {q.options.map(opt => {
                  let bg = T.white, border = T.border, color = T.text;
                  if (selected) {
                    if (opt === q.answer) { bg = T.greenPale; border = T.green; color = T.green; }
                    else if (opt === selected) { bg = T.redPale; border = T.red; color = T.red; }
                  }
                  return (
                    <button key={opt} onClick={() => handleAnswer(opt)}
                      style={{ padding: "15px 12px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontSize: 14, cursor: selected ? "default" : "pointer", transition: "all 0.18s", fontWeight: 500 }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Result */
            <div style={{ textAlign: "center" }}>
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 20, padding: "40px 32px", marginBottom: 16 }}>
                <div style={{ fontSize: 13, color: T.textLight, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Hasil Placement</div>
                <div style={{ display: "inline-block", background: levelInfo[result.level].color + "22", color: levelInfo[result.level].color, fontSize: 20, fontWeight: 700, padding: "8px 24px", borderRadius: 999, border: `1.5px solid ${levelInfo[result.level].color}44`, marginBottom: 16 }}>
                  {levelInfo[result.level].label}
                </div>
                <div style={{ fontSize: 14, color: T.textMid, lineHeight: 1.7, maxWidth: 340, margin: "0 auto 16px" }}>
                  {levelInfo[result.level].desc}
                </div>
                <div style={{ fontSize: 13, color: T.textLight }}>
                  Skor: {result.answers.filter(a => a.correct).length}/{result.answers.length}
                </div>
              </div>
              <button onClick={handleFinish} disabled={saving}
                style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: saving ? T.textLight : T.blue, color: T.white, fontSize: 15, fontWeight: 700, cursor: saving ? "default" : "pointer" }}>
                {saving ? "Menyimpan..." : "Mulai Belajar →"}
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
