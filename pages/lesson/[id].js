import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthProvider, useAuth } from "../../lib/auth";
import { addXP } from "../../lib/xp";
import { completeLesson } from "../../lib/lessons";
import { getLessonById } from "../../data/lessons";
import KanaWord from "../../components/KanaWord";

const T = {
  navy:"#0D2B5E", blue:"#1E88E5", bluePale:"#E3EDF8", blueFaint:"#F0F4FB",
  text:"#0D2B5E", textMid:"#5A7BA8", textLight:"#8BADD4", border:"#D0DFF0", white:"#FFFFFF",
  green:"#1D9E75", greenPale:"#E1F5EE", red:"#E53935", redPale:"#FEF0F0", yellow:"#E8960C",
};

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

// ─── Exercise screens ─────────────────────────────────────────────────────────

function LearnCard({ exercise, onNext }) {
  const isKana = !!exercise.kana;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "20px 0" }}>
      <div style={{ fontSize: 11, color: T.textLight, letterSpacing: "0.15em", textTransform: "uppercase" }}>New character</div>

      {/* Main card */}
      <div style={{ background: T.navy, borderRadius: 24, padding: "40px 32px", textAlign: "center", width: "100%", maxWidth: 340 }}>
        {isKana ? (
          <div style={{ fontSize: 80, fontFamily: "'Noto Sans JP',sans-serif", color: T.white, lineHeight: 1, marginBottom: 16 }}>
            {exercise.kana}
          </div>
        ) : (
          <div style={{ marginBottom: 16 }}>
            <KanaWord text={exercise.kana} fontSize={40} romaSize={16} color={T.white} romaColor="rgba(255,255,255,0.5)" gap={10} />
          </div>
        )}
        <div style={{ fontSize: 22, fontWeight: 700, color: "#4DA8FF", marginBottom: exercise.hint ? 12 : 0 }}>
          {exercise.romaji || exercise.meaning}
        </div>
        {exercise.meaning && exercise.romaji && (
          <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>{exercise.meaning}</div>
        )}
        {exercise.hint && (
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 12, lineHeight: 1.6 }}>
            💡 {exercise.hint}
          </div>
        )}
      </div>

      <button onClick={onNext}
        style={{ width: "100%", maxWidth: 340, padding: "14px", borderRadius: 14, border: "none", background: T.blue, color: T.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        Got it! →
      </button>
    </div>
  );
}

function QuizCard({ exercise, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const isKanaToRomaji = exercise.type === "kana_to_romaji";
  const isRomajiToKana = exercise.type === "romaji_to_kana";
  const isMeaningQuiz = exercise.type === "meaning_quiz";

  const handlePick = (opt) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === exercise.answer;
    setTimeout(() => onAnswer(correct), 900);
  };

  const question = isKanaToRomaji ? exercise.kana : isRomajiToKana ? exercise.romaji : (exercise.kana || exercise.japanese);
  const questionLabel = isKanaToRomaji ? "What is this?" : isRomajiToKana ? "Which character?" : "What does this mean?";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ fontSize: 11, color: T.textLight, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "center" }}>{questionLabel}</div>

      <div style={{ background: T.navy, borderRadius: 20, padding: "32px 24px", textAlign: "center" }}>
        {(isKanaToRomaji || isMeaningQuiz) ? (
          exercise.kana ? (
            <KanaWord text={exercise.kana} fontSize={isKanaToRomaji ? 60 : 36} romaSize={isKanaToRomaji ? 0 : 14} color={T.white} romaColor="rgba(255,255,255,0.4)" gap={10} />
          ) : (
            <div style={{ fontSize: 20, fontFamily: "'Noto Sans JP',sans-serif", color: T.white, lineHeight: 1.6 }}>{exercise.japanese}</div>
          )
        ) : (
          <div style={{ fontSize: 32, fontWeight: 700, color: T.white, letterSpacing: "0.08em" }}>{question}</div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {exercise.options.map(opt => {
          let bg = T.white, border = T.border, color = T.text;
          if (selected) {
            if (opt === exercise.answer) { bg = T.greenPale; border = T.green; color = T.green; }
            else if (opt === selected) { bg = T.redPale; border = T.red; color = T.red; }
          }
          return (
            <button key={opt} onClick={() => handlePick(opt)}
              style={{ padding: "16px 10px", borderRadius: 12, border: `1.5px solid ${border}`, background: bg, color, fontSize: isRomajiToKana ? 24 : 13, fontFamily: isRomajiToKana ? "'Noto Sans JP',sans-serif" : "'DM Sans',sans-serif", cursor: selected ? "default" : "pointer", transition: "all 0.18s", fontWeight: 500, lineHeight: 1.4 }}>
              {opt}
            </button>
          );
        })}
      </div>

      {selected && (
        <div style={{ padding: "12px 16px", borderRadius: 10, background: selected === exercise.answer ? T.greenPale : T.redPale, border: `1px solid ${selected === exercise.answer ? T.green : T.red}`, fontSize: 13, color: selected === exercise.answer ? T.green : T.red, fontWeight: 500, textAlign: "center" }}>
          {selected === exercise.answer ? "✓ Correct!" : `✗ The answer is: ${exercise.answer}`}
        </div>
      )}
    </div>
  );
}

function ResultScreen({ lesson, score, total, stars, onContinue }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, padding: "32px 0", textAlign: "center" }}>
      <div style={{ fontSize: 56 }}>{stars === 3 ? "🏆" : stars === 2 ? "⭐" : "📚"}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: T.navy }}>
        {stars === 3 ? "Perfect!" : stars === 2 ? "Great job!" : "Keep going!"}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {[1, 2, 3].map(s => (
          <span key={s} style={{ fontSize: 32, opacity: s <= stars ? 1 : 0.2 }}>⭐</span>
        ))}
      </div>

      <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px 32px", width: "100%" }}>
        <div style={{ fontSize: 36, fontWeight: 700, color: T.blue, marginBottom: 4 }}>{pct}%</div>
        <div style={{ fontSize: 13, color: T.textMid }}>{score} / {total} correct</div>
        <div style={{ marginTop: 12, fontSize: 14, color: T.green, fontWeight: 600 }}>+{lesson.xpReward} XP earned!</div>
      </div>

      <button onClick={onContinue}
        style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: T.navy, color: T.white, fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
        Continue →
      </button>
    </div>
  );
}

// ─── Main Lesson Page ─────────────────────────────────────────────────────────
function LessonPageInner() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = router.query;
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [stars, setStars] = useState(0);

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading]);

  useEffect(() => {
    if (id) {
      const l = getLessonById(id);
      if (!l) { router.replace("/"); return; }
      setLesson(l);
      // Filter only quiz exercises, keep learn cards first then shuffle quizzes
      const learns = l.exercises.filter(e => e.type === "learn");
      const quizzes = shuffle(l.exercises.filter(e => e.type !== "learn"));
      setExercises([...learns, ...quizzes]);
    }
  }, [id]);

  const handleNext = () => {
    if (currentIdx + 1 >= exercises.length) {
      finishLesson();
    } else {
      setCurrentIdx(i => i + 1);
    }
  };

  const handleAnswer = (correct) => {
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (currentIdx + 1 >= exercises.length) finishLesson(correct);
      else setCurrentIdx(i => i + 1);
    }, 600);
  };

  const finishLesson = async () => {
    const quizzes = exercises.filter(e => e.type !== "learn");
    const total = quizzes.length || 1;
    const s = score === total ? 3 : score >= total * 0.7 ? 2 : 1;
    setStars(s);
    setDone(true);
    if (user && lesson) {
      await completeLesson(user.id, lesson.id, score, total);
      await addXP(user.id, lesson.xpReward, `Completed: ${lesson.title}`);
    }
  };

  if (!lesson) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.blueFaint }}>
      <div style={{ color: T.textLight }}>Loading...</div>
    </div>
  );

  const quizExercises = exercises.filter(e => e.type !== "learn");
  const currentExercise = exercises[currentIdx];
  const isLearn = currentExercise?.type === "learn";
  const progressValue = currentIdx;
  const progressMax = exercises.length;

  return (
    <>
      <Head><title>{lesson.title} — Nihongo Master</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.blueFaint}; font-family: 'DM Sans', sans-serif; }
        button:active { opacity: 0.85; }
      `}</style>

      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px 40px", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0" }}>
          <button onClick={() => router.push("/")}
            style={{ width: 36, height: 36, borderRadius: 10, border: `1px solid ${T.border}`, background: T.white, color: T.textMid, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            ✕
          </button>

          {/* Progress bar */}
          {!done && (
            <div style={{ flex: 1, background: T.white, borderRadius: 999, height: 10, overflow: "hidden", border: `1px solid ${T.border}` }}>
              <div style={{ width: `${Math.round((progressValue / progressMax) * 100)}%`, height: "100%", background: T.blue, borderRadius: 999, transition: "width 0.3s ease" }} />
            </div>
          )}

          <div style={{ fontSize: 12, color: T.textLight, flexShrink: 0 }}>
            {!done && `${currentIdx + 1}/${exercises.length}`}
          </div>
        </div>

        {/* Lesson title */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: T.navy }}>{lesson.title}</div>
          <div style={{ fontSize: 13, color: T.textLight }}>{lesson.subtitle}</div>
        </div>

        {/* Content */}
        {done ? (
          <ResultScreen
            lesson={lesson}
            score={score}
            total={quizExercises.length || 1}
            stars={stars}
            onContinue={() => router.push("/")}
          />
        ) : currentExercise ? (
          isLearn ? (
            <LearnCard exercise={currentExercise} onNext={handleNext} />
          ) : (
            <QuizCard exercise={currentExercise} onAnswer={handleAnswer} />
          )
        ) : null}
      </div>
    </>
  );
}

export default function LessonPage() {
  return <AuthProvider><LessonPageInner /></AuthProvider>;
}
