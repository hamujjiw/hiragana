import { supabase } from "./supabase";

export const XP_REWARDS = {
  quiz_correct: 10,
  quiz_perfect: 25,
  lesson_complete: 50,
  daily_login: 20,
  streak_7: 100,
  streak_30: 500,
  level_test_pass: 300,
};

// Cat level thresholds — 1-10 Kitten, 11-20 Remaja, 21-30 Adult
export const CAT_LEVEL_XP = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,      // 1-10 Kitten
  3300, 4000, 4800, 5700, 6700, 7800, 9000, 10300, 11700, 13200, // 11-20 Remaja
  14800, 16500, 18300, 20200, 22200, 24300, 26500, 28800, 31200, 33700, // 21-30 Adult
];

export function getCatStage(catLevel) {
  if (catLevel <= 10) return "kitten";
  if (catLevel <= 20) return "teen";
  return "adult";
}

export function getCatLevelFromXP(xp) {
  let level = 1;
  for (let i = CAT_LEVEL_XP.length - 1; i >= 0; i--) {
    if (xp >= CAT_LEVEL_XP[i]) { level = i + 1; break; }
  }
  return Math.min(level, 30);
}

export function getXPForNextLevel(catLevel) {
  if (catLevel >= 30) return CAT_LEVEL_XP[29];
  return CAT_LEVEL_XP[catLevel];
}

export function getXPProgress(xp, catLevel) {
  const current = CAT_LEVEL_XP[catLevel - 1] || 0;
  const next = getXPForNextLevel(catLevel);
  const progress = next > current ? (xp - current) / (next - current) : 1;
  return { current: xp - current, needed: next - current, pct: Math.min(100, Math.round(progress * 100)) };
}

export async function addXP(userId, amount, reason) {
  // Get current profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("xp, cat_level, streak, last_login")
    .eq("id", userId)
    .single();

  if (error) return null;

  const newXP = (profile.xp || 0) + amount;
  const newCatLevel = getCatLevelFromXP(newXP);
  const leveledUp = newCatLevel > (profile.cat_level || 1);

  // Update profile
  await supabase.from("profiles").update({
    xp: newXP,
    cat_level: newCatLevel,
    updated_at: new Date().toISOString(),
  }).eq("id", userId);

  // Log XP
  await supabase.from("xp_log").insert({ user_id: userId, amount, reason });

  return { newXP, newCatLevel, leveledUp };
}

export async function checkAndUpdateStreak(userId) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("streak, last_login")
    .eq("id", userId)
    .single();

  if (!profile) return { streak: 0, bonus: 0 };

  const today = new Date().toISOString().split("T")[0];
  const lastLogin = profile.last_login;

  if (lastLogin === today) return { streak: profile.streak, bonus: 0 };

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak = lastLogin === yesterday ? (profile.streak || 0) + 1 : 1;

  let bonus = 0;
  if (newStreak % 30 === 0) bonus = XP_REWARDS.streak_30;
  else if (newStreak % 7 === 0) bonus = XP_REWARDS.streak_7;

  await supabase.from("profiles").update({
    streak: newStreak,
    last_login: today,
    updated_at: new Date().toISOString(),
  }).eq("id", userId);

  return { streak: newStreak, bonus };
}
