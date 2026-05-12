import { supabase } from "./supabase";

export async function getProgress(userId) {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);
  if (error) return {};
  return Object.fromEntries(data.map((r) => [r.item_id, r]));
}

export async function upsertProgress(userId, itemId, itemType, correct, attempts) {
  const { error } = await supabase.from("progress").upsert(
    { user_id: userId, item_id: itemId, item_type: itemType, correct, attempts, last_seen: new Date().toISOString() },
    { onConflict: "user_id,item_id" }
  );
  return !error;
}

export async function updateLevel(userId, level) {
  const { error } = await supabase
    .from("profiles")
    .update({ level, updated_at: new Date().toISOString() })
    .eq("id", userId);
  return !error;
}

export async function completePlacement(userId, level) {
  const { error } = await supabase
    .from("profiles")
    .update({ level, placement_done: true, updated_at: new Date().toISOString() })
    .eq("id", userId);
  return !error;
}

export async function saveLevelTest(userId, fromLevel, score, total, passed) {
  const { error } = await supabase.from("level_tests").insert({
    user_id: userId,
    from_level: fromLevel,
    score,
    total,
    passed,
  });
  return !error;
}

export function masteryColor(item) {
  if (!item || item.attempts === 0) return "#2d2d4a";
  const r = item.correct / item.attempts;
  if (r >= 0.8) return "#2ecc71";
  if (r >= 0.4) return "#f1c40f";
  return "#e74c3c";
}

export function masteryLabel(item) {
  if (!item || item.attempts === 0) return "Not studied";
  const r = item.correct / item.attempts;
  if (r >= 0.8) return "Mastered";
  if (r >= 0.4) return "Learning";
  return "Struggling";
}
