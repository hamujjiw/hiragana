// Splits a Japanese word into mora (syllable) pairs with romaji
// e.g. "たべる" → [{kana:"た",roma:"ta"},{kana:"べ",roma:"be"},{kana:"る",roma:"ru"}]

const KANA_MAP = {
  // Hiragana
  "あ":"a","い":"i","う":"u","え":"e","お":"o",
  "か":"ka","き":"ki","く":"ku","け":"ke","こ":"ko",
  "さ":"sa","し":"shi","す":"su","せ":"se","そ":"so",
  "た":"ta","ち":"chi","つ":"tsu","て":"te","と":"to",
  "な":"na","に":"ni","ぬ":"nu","ね":"ne","の":"no",
  "は":"ha","ひ":"hi","ふ":"fu","へ":"he","ほ":"ho",
  "ま":"ma","み":"mi","む":"mu","め":"me","も":"mo",
  "や":"ya","ゆ":"yu","よ":"yo",
  "ら":"ra","り":"ri","る":"ru","れ":"re","ろ":"ro",
  "わ":"wa","を":"wo","ん":"n",
  "が":"ga","ぎ":"gi","ぐ":"gu","げ":"ge","ご":"go",
  "ざ":"za","じ":"ji","ず":"zu","ぜ":"ze","ぞ":"zo",
  "だ":"da","ぢ":"di","づ":"du","で":"de","ど":"do",
  "ば":"ba","び":"bi","ぶ":"bu","べ":"be","ぼ":"bo",
  "ぱ":"pa","ぴ":"pi","ぷ":"pu","ぺ":"pe","ぽ":"po",
  // Small kana (combine with previous)
  "っ":"tt","ー":"-","〜":"~",
};

export function splitKana(text) {
  if (!text) return [];
  const chars = [...text];
  const result = [];
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    const roma = KANA_MAP[c] || c;
    result.push({ kana: c, roma });
  }
  return result;
}

export default function KanaWord({ text, fontSize = 22, romaSize = 11, color = "#0D2B5E", romaColor = "#8BADD4", gap = 6 }) {
  const parts = splitKana(text);
  return (
    <div style={{ display: "inline-flex", gap, alignItems: "flex-end" }}>
      {parts.map((p, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span style={{ fontSize, fontFamily: "'Noto Sans JP', sans-serif", color, lineHeight: 1 }}>
            {p.kana}
          </span>
          <span style={{ fontSize: romaSize, color: romaColor, fontWeight: 500, lineHeight: 1, letterSpacing: "0.02em" }}>
            {p.roma}
          </span>
        </div>
      ))}
    </div>
  );
}
