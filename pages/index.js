import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { AuthProvider, useAuth } from "../lib/auth";
import { getProgress, masteryColor } from "../lib/progress";
import { addXP, checkAndUpdateStreak, getXPProgress, XP_REWARDS } from "../lib/xp";
import { getUserLessons } from "../lib/lessons";
import { worlds, allLessons, isLessonUnlocked } from "../data/lessons";
import CatAvatar from "../components/CatAvatar";
import XPToast from "../components/XPToast";
import LevelUpModal from "../components/LevelUpModal";

const T = {
  navy:"#0D2B5E", blue:"#1E88E5", bluePale:"#E3EDF8", blueFaint:"#F0F4FB",
  text:"#0D2B5E", textMid:"#5A7BA8", textLight:"#8BADD4", border:"#D0DFF0", white:"#FFFFFF",
  green:"#1D9E75", greenPale:"#E1F5EE", yellow:"#E8960C", red:"#E53935",
};

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

function Card({ children, style = {} }) {
  return <div style={{ background: T.white, borderRadius: 16, border: `1px solid ${T.border}`, padding: 16, ...style }}>{children}</div>;
}

function ProgressBar({ value, max, color = T.blue }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ background: T.bluePale, borderRadius: 999, height: 5, overflow: "hidden" }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.5s ease" }} />
    </div>
  );
}

// ─── Skill Tree ───────────────────────────────────────────────────────────────
function SkillTree({ userLessons, onSelectLesson }) {
  const completedIds = Object.keys(userLessons).filter(id => userLessons[id]?.completed);

  return (
    <div style={{ paddingBottom: 40 }}>
      {worlds.map((world, wi) => {
        const worldLessons = world.units.flatMap(u => u.lessons);
        const worldCompleted = worldLessons.filter(l => completedIds.includes(l.id)).length;
        const worldTotal = worldLessons.length;
        const worldUnlocked = wi === 0 || worlds[wi - 1].units.flatMap(u => u.lessons).every(l => completedIds.includes(l.id));

        return (
          <div key={world.id} style={{ marginBottom: 32, opacity: worldUnlocked ? 1 : 0.5 }}>
            {/* World header */}
            <div style={{ background: world.color, borderRadius: 16, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 28 }}>{world.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: T.white }}>{world.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{world.subtitle}</div>
                <div style={{ marginTop: 6, background: "rgba(255,255,255,0.2)", borderRadius: 999, height: 4, overflow: "hidden" }}>
                  <div style={{ width: `${Math.round((worldCompleted / worldTotal) * 100)}%`, height: "100%", background: T.white, borderRadius: 999, transition: "width 0.5s ease" }} />
                </div>
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{worldCompleted}/{worldTotal}</div>
            </div>

            {/* Units */}
            {world.units.map((unit, ui) => {
              const unitLessons = unit.lessons;
              const unitCompleted = unitLessons.filter(l => completedIds.includes(l.id)).length;

              return (
                <div key={unit.id} style={{ marginBottom: 24 }}>
                  {/* Unit label */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, padding: "0 8px" }}>
                    <div style={{ width: 1, flex: 1, background: T.border }} />
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: T.white, border: `1px solid ${T.border}`, borderRadius: 999, padding: "4px 12px" }}>
                      <span style={{ fontSize: 14 }}>{unit.emoji}</span>
                      <span style={{ fontSize: 11, fontWeight: 600, color: T.textMid }}>{unit.title}</span>
                      <span style={{ fontSize: 10, color: T.textLight }}>{unitCompleted}/{unitLessons.length}</span>
                    </div>
                    <div style={{ width: 1, flex: 1, background: T.border }} />
                  </div>

                  {/* Lesson nodes - path style */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
                    {unitLessons.map((lesson, li) => {
                      const completed = completedIds.includes(lesson.id);
                      const unlocked = isLessonUnlocked(lesson.id, completedIds);
                      const stars = userLessons[lesson.id]?.stars || 0;
                      const isLeft = li % 2 === 0;

                      return (
                        <div key={lesson.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                          {/* Connector line */}
                          {li > 0 && (
                            <div style={{ width: 3, height: 20, background: completed ? world.color : T.border, borderRadius: 999, marginBottom: 0 }} />
                          )}

                          {/* Node row */}
                          <div style={{ display: "flex", alignItems: "center", justifyContent: isLeft ? "flex-start" : "flex-end", width: "100%", padding: "0 20px" }}>
                            {!isLeft && <div style={{ flex: 1 }} />}

                            <div
                              onClick={() => unlocked && onSelectLesson(lesson)}
                              style={{
                                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                                cursor: unlocked ? "pointer" : "default",
                              }}
                            >
                              {/* Node circle */}
                              <div style={{
                                width: 72, height: 72, borderRadius: "50%",
                                background: completed ? world.color : unlocked ? T.white : "#E8EEF5",
                                border: `3px solid ${completed ? world.color : unlocked ? world.color : T.border}`,
                                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                                boxShadow: unlocked ? `0 4px 16px ${world.color}33` : "none",
                                transition: "all 0.2s",
                                position: "relative",
                              }}>
                                {completed ? (
                                  <span style={{ fontSize: 28 }}>✓</span>
                                ) : unlocked ? (
                                  <span style={{ fontSize: 24 }}>
                                    {lesson.type === "kana" ? "あ" : lesson.type === "vocab" ? "📖" : lesson.type === "phrase" ? "💬" : "✏️"}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: 24 }}>🔒</span>
                                )}
                              </div>

                              {/* Stars */}
                              {completed && (
                                <div style={{ display: "flex", gap: 2 }}>
                                  {[1, 2, 3].map(s => (
                                    <span key={s} style={{ fontSize: 12, opacity: s <= stars ? 1 : 0.3 }}>⭐</span>
                                  ))}
                                </div>
                              )}

                              {/* Label */}
                              <div style={{ textAlign: "center", maxWidth: 90 }}>
                                <div style={{ fontSize: 11, fontWeight: 600, color: completed ? world.color : unlocked ? T.navy : T.textLight, lineHeight: 1.3 }}>
                                  {lesson.title}
                                </div>
                                {unlocked && !completed && (
                                  <div style={{ fontSize: 9, color: T.textLight, marginTop: 2 }}>+{lesson.xpReward} XP</div>
                                )}
                              </div>
                            </div>

                            {isLeft && <div style={{ flex: 1 }} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// ─── Cat Tab ──────────────────────────────────────────────────────────────────
function CatTab({ profile, onNameChange }) {
  const catLevel = profile?.cat_level || 1;
  const xp = profile?.xp || 0;
  const stage = catLevel <= 10 ? "kitten" : catLevel <= 20 ? "teen" : "adult";
  const stageLabel = catLevel <= 10 ? "Kitten" : catLevel <= 20 ? "Teen" : "Adult Cat";
  const { current, needed, pct } = getXPProgress(xp, catLevel);
  const [mood, setMood] = useState("happy");
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.cat_name || "Neko-chan");

  return (
    <div>
      <Card style={{ textAlign: "center", marginBottom: 14, padding: "24px 16px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <CatAvatar catLevel={catLevel} mood={mood} size={140} animate={true} />
        </div>
        {editingName ? (
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 8 }}>
            <input value={nameInput} onChange={e => setNameInput(e.target.value)}
              style={{ padding: "6px 12px", borderRadius: 8, border: `1.5px solid ${T.blue}`, fontSize: 14, color: T.navy, fontFamily: "'DM Sans',sans-serif", width: 140, outline: "none" }} />
            <button onClick={() => { setEditingName(false); onNameChange && onNameChange(nameInput); }}
              style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: T.blue, color: T.white, fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>✓</button>
          </div>
        ) : (
          <div onClick={() => setEditingName(true)} style={{ fontSize: 17, fontWeight: 600, color: T.navy, marginBottom: 4, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6 }}>
            {nameInput} <span style={{ fontSize: 12, color: T.textLight }}>✎</span>
          </div>
        )}
        <div style={{ fontSize: 12, color: T.textMid, marginBottom: 14 }}>Level {catLevel} · {stageLabel}</div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: T.textLight, marginBottom: 5 }}>
            <span>{current} XP</span><span>{needed} XP to next level</span>
          </div>
          <ProgressBar value={pct} max={100} color={stage === "kitten" ? T.blue : stage === "teen" ? T.yellow : T.navy} />
        </div>
        <div style={{ display: "flex", gap: 7, justifyContent: "center", marginTop: 14, flexWrap: "wrap" }}>
          {[["happy", "😸", "Happy"], ["sleep", "😴", "Sleepy"], ["bored", "😒", "Bored"]].map(([m, e, l]) => (
            <button key={m} onClick={() => setMood(m)}
              style={{ padding: "6px 12px", borderRadius: 999, border: `1.5px solid ${mood === m ? T.blue : T.border}`, background: mood === m ? T.bluePale : T.white, fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
              {e} {l}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 12 }}>Milestones</div>
        {[
          { level: 1, label: "Start the journey", emoji: "🐾" },
          { level: 5, label: "Getting smarter", emoji: "📚" },
          { level: 10, label: "Kitten graduate", emoji: "🎓" },
          { level: 11, label: "Entering Teen stage", emoji: "✨" },
          { level: 20, label: "Teen graduate", emoji: "🏆" },
          { level: 21, label: "Adult cat", emoji: "👑" },
          { level: 30, label: "Nihongo Master", emoji: "🎌" },
        ].map(m => (
          <div key={m.level} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${T.border}`, opacity: catLevel >= m.level ? 1 : 0.4 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: catLevel >= m.level ? T.bluePale : T.blueFaint, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>
              {catLevel >= m.level ? m.emoji : "🔒"}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: catLevel >= m.level ? T.navy : T.textLight, fontWeight: catLevel >= m.level ? 500 : 400 }}>{m.label}</div>
              <div style={{ fontSize: 10, color: T.textLight }}>Level {m.level}</div>
            </div>
            {catLevel >= m.level && <span style={{ fontSize: 10, color: T.green, fontWeight: 500 }}>✓</span>}
          </div>
        ))}
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 10 }}>Stats</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {[{ label: "Total XP", value: xp }, { label: "Cat Level", value: catLevel }, { label: "Streak", value: `${profile?.streak || 0}d` }].map(s => (
            <div key={s.label} style={{ background: T.blueFaint, borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 18, fontWeight: 600, color: T.navy }}>{s.value}</div>
              <div style={{ fontSize: 10, color: T.textLight, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Progress Tab ─────────────────────────────────────────────────────────────
function ProgressTab({ profile, userLessons }) {
  const completedIds = Object.keys(userLessons).filter(id => userLessons[id]?.completed);
  const totalLessons = allLessons.length;
  const totalCompleted = completedIds.length;

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        {[
          { label: "Lessons Done", value: `${totalCompleted}/${totalLessons}`, color: T.blue },
          { label: "Total XP", value: profile?.xp || 0, color: T.green },
          { label: "Cat Level", value: `Lv. ${profile?.cat_level || 1}`, color: T.yellow },
          { label: "Streak", value: `${profile?.streak || 0} days`, color: T.red },
        ].map(s => (
          <Card key={s.label}>
            <div style={{ fontSize: 10, color: T.textLight, marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</div>
          </Card>
        ))}
      </div>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.navy, marginBottom: 8 }}>Overall Progress</div>
        <ProgressBar value={totalCompleted} max={totalLessons} />
        <div style={{ fontSize: 11, color: T.textLight, marginTop: 6, textAlign: "right" }}>{Math.round((totalCompleted / totalLessons) * 100)}% complete</div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {worlds.map(world => {
            const wLessons = world.units.flatMap(u => u.lessons);
            const wDone = wLessons.filter(l => completedIds.includes(l.id)).length;
            return (
              <div key={world.id}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: T.navy, fontWeight: 500 }}>{world.emoji} {world.title}</span>
                  <span style={{ color: T.textLight }}>{wDone}/{wLessons.length}</span>
                </div>
                <ProgressBar value={wDone} max={wLessons.length} color={world.color} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function AppInner() {
  const { user, profile, loading, signOut, refreshProfile } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();
  const [mainTab, setMainTab] = useState("learn");
  const [userLessons, setUserLessons] = useState({});
  const [progLoading, setProgLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const [levelUpModal, setLevelUpModal] = useState({ show: false, catLevel: 1 });
  const dailyDone = useRef(false);

  useEffect(() => { if (!loading && !user) router.replace("/login"); }, [user, loading]);
  useEffect(() => { if (!loading && user && profile && !profile.placement_done) router.replace("/placement"); }, [user, profile, loading]);

  useEffect(() => {
    if (user && !dailyDone.current) {
      dailyDone.current = true;
      getUserLessons(user.id).then(l => { setUserLessons(l); setProgLoading(false); });
      checkAndUpdateStreak(user.id).then(({ streak, bonus }) => {
        const amount = bonus > 0 ? bonus : XP_REWARDS.daily_login;
        const msg = bonus > 0 ? `${streak} day streak! +${bonus} XP 🔥` : "+20 XP — Welcome back!";
        addXP(user.id, amount, bonus > 0 ? "Streak bonus" : "Daily login").then(result => {
          if (result?.leveledUp) setLevelUpModal({ show: true, catLevel: result.newCatLevel });
          refreshProfile();
        });
        showToast(msg);
      });
    }
  }, [user]);

  const showToast = (msg) => setToast({ visible: true, message: msg });

  const handleXP = useCallback(async (amount, reason) => {
    if (!user) return;
    const result = await addXP(user.id, amount, reason);
    if (result?.leveledUp) setLevelUpModal({ show: true, catLevel: result.newCatLevel });
    await refreshProfile();
  }, [user]);

  const handleSelectLesson = (lesson) => {
    router.push(`/lesson/${lesson.id}`);
  };

  const handleCatNameChange = async (name) => {
    if (!user) return;
    const { supabase } = await import("../lib/supabase");
    await supabase.from("profiles").update({ cat_name: name }).eq("id", user.id);
    await refreshProfile();
  };

  if (loading || progLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: T.blueFaint }}>
      <div style={{ color: T.textLight, fontSize: 14 }}>Loading...</div>
    </div>
  );
  if (!user || !profile) return null;

  const mainTabs = [
    { id: "learn", label: "Learn", icon: "🗾" },
    { id: "cat", label: "My Cat", icon: "🐱" },
    { id: "progress", label: "Progress", icon: "📊" },
  ];

  const SidebarNav = () => (
    <div style={{ width: 220, background: T.navy, minHeight: "100vh", padding: "24px 0", display: "flex", flexDirection: "column", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <CatAvatar catLevel={profile?.cat_level || 1} mood="happy" size={36} animate={false} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.white }}>{profile.display_name || profile.email?.split("@")[0]}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>Lv.{profile?.cat_level || 1} · {profile?.xp || 0} XP</div>
          </div>
        </div>
      </div>
      {mainTabs.map(t => (
        <button key={t.id} onClick={() => setMainTab(t.id)}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 20px", fontSize: 13, color: mainTab === t.id ? T.white : "rgba(255,255,255,0.5)", cursor: "pointer", border: "none", background: mainTab === t.id ? "rgba(255,255,255,0.08)" : "transparent", borderLeft: `3px solid ${mainTab === t.id ? T.blue : "transparent"}`, transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif", textAlign: "left", width: "100%" }}>
          <span style={{ fontSize: 18 }}>{t.icon}</span>{t.label}
        </button>
      ))}
      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        {profile.streak > 0 && <div style={{ background: "rgba(232,150,12,0.2)", color: T.yellow, fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 999, marginBottom: 8, display: "inline-block" }}>🔥 {profile.streak} day streak</div>}
        <button onClick={signOut} style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", background: "transparent", border: "none", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", padding: 0 }}>Sign out</button>
      </div>
    </div>
  );

  const contentStyle = isMobile
    ? { padding: "0 16px 100px", maxWidth: 480, margin: "0 auto" }
    : { marginLeft: 220, padding: "0 40px 60px", maxWidth: 860 };

  return (
    <>
      <Head><title>Nihongo Master</title></Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.blueFaint}; font-family: 'DM Sans', sans-serif; color: ${T.navy}; -webkit-tap-highlight-color: transparent; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.3s ease; }
        button:active { opacity: 0.85; }
      `}</style>

      {!isMobile && <SidebarNav />}

      <div style={contentStyle}>
        {/* Mobile header */}
        {isMobile && (
          <header style={{ padding: "14px 0 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CatAvatar catLevel={profile?.cat_level || 1} mood="happy" size={30} animate={false} />
              <div>
                <div style={{ fontSize: 11, color: T.textLight }}>{profile.display_name || profile.email?.split("@")[0]}</div>
                <div style={{ fontSize: 10, color: T.blue, fontWeight: 600 }}>{profile.xp || 0} XP · Lv.{profile.cat_level || 1}</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {profile.streak > 0 && <div style={{ background: "#FEF3DC", color: T.yellow, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 999 }}>🔥 {profile.streak}</div>}
              <button onClick={signOut} style={{ padding: "4px 10px", borderRadius: 7, border: `1px solid ${T.border}`, background: T.white, color: T.textLight, fontSize: 11, cursor: "pointer" }}>Out</button>
            </div>
          </header>
        )}

        {!isMobile && (
          <div style={{ padding: "28px 0 16px" }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.navy }}>{mainTabs.find(t => t.id === mainTab)?.label}</div>
          </div>
        )}

        {mainTab === "learn" && (
          <div className="fade-up">
            <SkillTree userLessons={userLessons} onSelectLesson={handleSelectLesson} />
          </div>
        )}

        {mainTab === "cat" && (
          <div className="fade-up" style={!isMobile ? { maxWidth: 480 } : {}}>
            <CatTab profile={profile} onNameChange={handleCatNameChange} />
          </div>
        )}

        {mainTab === "progress" && (
          <div className="fade-up">
            <ProgressTab profile={profile} userLessons={userLessons} />
          </div>
        )}
      </div>

      {isMobile && (
        <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: T.white, borderTop: `1px solid ${T.border}`, padding: "8px 0 12px", display: "flex", justifyContent: "space-around", zIndex: 100 }}>
          {mainTabs.map(t => (
            <button key={t.id} onClick={() => setMainTab(t.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 16px", borderRadius: 10, border: "none", background: mainTab === t.id ? T.bluePale : "transparent", cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans',sans-serif" }}>
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ fontSize: 10, color: mainTab === t.id ? T.blue : T.textLight, fontWeight: mainTab === t.id ? 600 : 400 }}>{t.label}</span>
            </button>
          ))}
        </nav>
      )}

      <XPToast message={toast.message} visible={toast.visible} onHide={() => setToast(t => ({ ...t, visible: false }))} />
      <LevelUpModal show={levelUpModal.show} catLevel={levelUpModal.catLevel} onClose={() => setLevelUpModal({ show: false, catLevel: 1 })} />
    </>
  );
}

export default function Home() {
  return <AuthProvider><AppInner /></AuthProvider>;
}
