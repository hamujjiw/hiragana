import { supabase } from "./supabase";

export async function getUserLessons(userId) {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("*")
    .eq("user_id", userId);
  if (error) return {};
  return Object.fromEntries(data.map(r => [r.lesson_id, r]));
}

export async function completeLesson(userId, lessonId, score, total) {
  const stars = score === total ? 3 : score >= total * 0.7 ? 2 : 1;
  const { error } = await supabase.from("user_lessons").upsert(
    { user_id: userId, lesson_id: lessonId, completed: true, stars, score, completed_at: new Date().toISOString() },
    { onConflict: "user_id,lesson_id" }
  );
  return { stars, error };
}
