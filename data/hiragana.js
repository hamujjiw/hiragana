export const hiraganaGroups = [
  { group: "Vowels", romaji: "a i u e o", chars: [{ k: "あ", r: "a" }, { k: "い", r: "i" }, { k: "う", r: "u" }, { k: "え", r: "e" }, { k: "お", r: "o" }] },
  { group: "K-row", romaji: "ka ki ku ke ko", chars: [{ k: "か", r: "ka" }, { k: "き", r: "ki" }, { k: "く", r: "ku" }, { k: "け", r: "ke" }, { k: "こ", r: "ko" }] },
  { group: "S-row", romaji: "sa shi su se so", chars: [{ k: "さ", r: "sa" }, { k: "し", r: "shi" }, { k: "す", r: "su" }, { k: "せ", r: "se" }, { k: "そ", r: "so" }] },
  { group: "T-row", romaji: "ta chi tsu te to", chars: [{ k: "た", r: "ta" }, { k: "ち", r: "chi" }, { k: "つ", r: "tsu" }, { k: "て", r: "te" }, { k: "と", r: "to" }] },
  { group: "N-row", romaji: "na ni nu ne no", chars: [{ k: "な", r: "na" }, { k: "に", r: "ni" }, { k: "ぬ", r: "nu" }, { k: "ね", r: "ne" }, { k: "の", r: "no" }] },
  { group: "H-row", romaji: "ha hi fu he ho", chars: [{ k: "は", r: "ha" }, { k: "ひ", r: "hi" }, { k: "ふ", r: "fu" }, { k: "へ", r: "he" }, { k: "ほ", r: "ho" }] },
  { group: "M-row", romaji: "ma mi mu me mo", chars: [{ k: "ま", r: "ma" }, { k: "み", r: "mi" }, { k: "む", r: "mu" }, { k: "め", r: "me" }, { k: "も", r: "mo" }] },
  { group: "Y-row", romaji: "ya yu yo", chars: [{ k: "や", r: "ya" }, { k: "ゆ", r: "yu" }, { k: "よ", r: "yo" }] },
  { group: "R-row", romaji: "ra ri ru re ro", chars: [{ k: "ら", r: "ra" }, { k: "り", r: "ri" }, { k: "る", r: "ru" }, { k: "れ", r: "re" }, { k: "ろ", r: "ro" }] },
  { group: "W-row & N", romaji: "wa wo n", chars: [{ k: "わ", r: "wa" }, { k: "を", r: "wo" }, { k: "ん", r: "n" }] },
  { group: "G-row", romaji: "ga gi gu ge go", chars: [{ k: "が", r: "ga" }, { k: "ぎ", r: "gi" }, { k: "ぐ", r: "gu" }, { k: "げ", r: "ge" }, { k: "ご", r: "go" }] },
  { group: "Z-row", romaji: "za ji zu ze zo", chars: [{ k: "ざ", r: "za" }, { k: "じ", r: "ji" }, { k: "ず", r: "zu" }, { k: "ぜ", r: "ze" }, { k: "ぞ", r: "zo" }] },
  { group: "B-row", romaji: "ba bi bu be bo", chars: [{ k: "ば", r: "ba" }, { k: "び", r: "bi" }, { k: "ぶ", r: "bu" }, { k: "べ", r: "be" }, { k: "ぼ", r: "bo" }] },
  { group: "P-row", romaji: "pa pi pu pe po", chars: [{ k: "ぱ", r: "pa" }, { k: "ぴ", r: "pi" }, { k: "ぷ", r: "pu" }, { k: "ぺ", r: "pe" }, { k: "ぽ", r: "po" }] },
];

export const allHiragana = hiraganaGroups.flatMap((g) => g.chars);

export const mnemonics = {
  あ: "Looks like an 'A' with extra strokes", い: "Two parallel strokes like 'ii'", う: "A face with small mouth", え: "A dancer — 'eh'", お: "A bowing person — 'oh'",
  か: "A kite flying — 'ka'", き: "A key with cuts — 'ki'", く: "The beak of a crow — 'ku'", け: "Shaped like a K — 'ke'", こ: "Two horizontal strokes — 'ko'",
  さ: "A person crossing — 'sa'", し: "A fishing hook — 'shi'", す: "A swirl of water — 'su'", せ: "SE combined — 'se'", そ: "A Z with a curl — 'so'",
  た: "A cross with a flag — 'ta'", ち: "A cheerleader — 'chi'", つ: "A tsunami wave — 'tsu'", て: "A hand reaching — 'te'", と: "A toe with a nail — 'to'",
  な: "A noodle bowl — 'na'", に: "A bending knee — 'ni'", ぬ: "Noodles in a bowl — 'nu'", ね: "A sleeping cat — 'ne'", の: "N with a loop — 'no'",
  は: "Person with hat — 'ha'", ひ: "A smiling face — 'hi'", ふ: "Mt. Fuji — 'fu'", へ: "A mountain peak — 'he'", ほ: "A walking figure — 'ho'",
  ま: "A fishhook — 'ma'", み: "A flowing stream — 'mi'", む: "A moose face — 'mu'", め: "A whirlpool — 'me'", も: "Hook with worm — 'mo'",
  や: "A yacht sail — 'ya'", ゆ: "A goldfish — 'yu'", よ: "A yoyo string — 'yo'",
  ら: "A rabbit ear — 'ra'", り: "Two lines leaning right — 'ri'", る: "A loop-the-loop — 'ru'", れ: "A bending reed — 're'", ろ: "A curving road — 'ro'",
  わ: "A bowing waiter — 'wa'", を: "A wo'rm — 'wo'", ん: "An N shape with a hook",
};
