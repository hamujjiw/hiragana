// ─── VOCABULARY ───────────────────────────────────────────────────────────────
export const vocabulary = {
  beginner: [
    // Greetings & basics
    { id: "v_b_001", kana: "はい", romaji: "hai", meaning: "yes", category: "basics" },
    { id: "v_b_002", kana: "いいえ", romaji: "iie", meaning: "no", category: "basics" },
    { id: "v_b_003", kana: "ありがとう", romaji: "arigatou", meaning: "thank you", category: "basics" },
    { id: "v_b_004", kana: "すみません", romaji: "sumimasen", meaning: "excuse me / sorry", category: "basics" },
    { id: "v_b_005", kana: "おねがい", romaji: "onegai", meaning: "please", category: "basics" },
    // People
    { id: "v_b_006", kana: "ひと", romaji: "hito", meaning: "person", category: "people" },
    { id: "v_b_007", kana: "わたし", romaji: "watashi", meaning: "I / me", category: "people" },
    { id: "v_b_008", kana: "あなた", romaji: "anata", meaning: "you", category: "people" },
    { id: "v_b_009", kana: "ともだち", romaji: "tomodachi", meaning: "friend", category: "people" },
    { id: "v_b_010", kana: "せんせい", romaji: "sensei", meaning: "teacher", category: "people" },
    // Nature
    { id: "v_b_011", kana: "みず", romaji: "mizu", meaning: "water", category: "nature" },
    { id: "v_b_012", kana: "ひ", romaji: "hi", meaning: "fire / sun", category: "nature" },
    { id: "v_b_013", kana: "やま", romaji: "yama", meaning: "mountain", category: "nature" },
    { id: "v_b_014", kana: "うみ", romaji: "umi", meaning: "sea", category: "nature" },
    { id: "v_b_015", kana: "そら", romaji: "sora", meaning: "sky", category: "nature" },
    { id: "v_b_016", kana: "はな", romaji: "hana", meaning: "flower", category: "nature" },
    { id: "v_b_017", kana: "き", romaji: "ki", meaning: "tree", category: "nature" },
    // Animals
    { id: "v_b_018", kana: "ねこ", romaji: "neko", meaning: "cat", category: "animals" },
    { id: "v_b_019", kana: "いぬ", romaji: "inu", meaning: "dog", category: "animals" },
    { id: "v_b_020", kana: "とり", romaji: "tori", meaning: "bird", category: "animals" },
    // Numbers
    { id: "v_b_021", kana: "いち", romaji: "ichi", meaning: "one (1)", category: "numbers" },
    { id: "v_b_022", kana: "に", romaji: "ni", meaning: "two (2)", category: "numbers" },
    { id: "v_b_023", kana: "さん", romaji: "san", meaning: "three (3)", category: "numbers" },
    { id: "v_b_024", kana: "し / よん", romaji: "shi / yon", meaning: "four (4)", category: "numbers" },
    { id: "v_b_025", kana: "ご", romaji: "go", meaning: "five (5)", category: "numbers" },
    // Colors
    { id: "v_b_026", kana: "あか", romaji: "aka", meaning: "red", category: "colors" },
    { id: "v_b_027", kana: "あお", romaji: "ao", meaning: "blue", category: "colors" },
    { id: "v_b_028", kana: "しろ", romaji: "shiro", meaning: "white", category: "colors" },
    { id: "v_b_029", kana: "くろ", romaji: "kuro", meaning: "black", category: "colors" },
    { id: "v_b_030", kana: "きいろ", romaji: "kiiro", meaning: "yellow", category: "colors" },
  ],
  elementary: [
    // Food
    { id: "v_e_001", kana: "たべもの", romaji: "tabemono", meaning: "food", category: "food" },
    { id: "v_e_002", kana: "のみもの", romaji: "nomimono", meaning: "drink", category: "food" },
    { id: "v_e_003", kana: "ごはん", romaji: "gohan", meaning: "rice / meal", category: "food" },
    { id: "v_e_004", kana: "みそしる", romaji: "misoshiru", meaning: "miso soup", category: "food" },
    { id: "v_e_005", kana: "すし", romaji: "sushi", meaning: "sushi", category: "food" },
    { id: "v_e_006", kana: "おちゃ", romaji: "ocha", meaning: "green tea", category: "food" },
    { id: "v_e_007", kana: "パン", romaji: "pan", meaning: "bread", category: "food" },
    { id: "v_e_008", kana: "たまご", romaji: "tamago", meaning: "egg", category: "food" },
    // Time
    { id: "v_e_009", kana: "いま", romaji: "ima", meaning: "now", category: "time" },
    { id: "v_e_010", kana: "きょう", romaji: "kyou", meaning: "today", category: "time" },
    { id: "v_e_011", kana: "あした", romaji: "ashita", meaning: "tomorrow", category: "time" },
    { id: "v_e_012", kana: "きのう", romaji: "kinou", meaning: "yesterday", category: "time" },
    { id: "v_e_013", kana: "あさ", romaji: "asa", meaning: "morning", category: "time" },
    { id: "v_e_014", kana: "ひる", romaji: "hiru", meaning: "noon / daytime", category: "time" },
    { id: "v_e_015", kana: "よる", romaji: "yoru", meaning: "night", category: "time" },
    // Places
    { id: "v_e_016", kana: "いえ", romaji: "ie", meaning: "house / home", category: "places" },
    { id: "v_e_017", kana: "がっこう", romaji: "gakkou", meaning: "school", category: "places" },
    { id: "v_e_018", kana: "えき", romaji: "eki", meaning: "train station", category: "places" },
    { id: "v_e_019", kana: "みせ", romaji: "mise", meaning: "shop / store", category: "places" },
    { id: "v_e_020", kana: "びょういん", romaji: "byouin", meaning: "hospital", category: "places" },
    // Verbs (dictionary form)
    { id: "v_e_021", kana: "たべる", romaji: "taberu", meaning: "to eat", category: "verbs" },
    { id: "v_e_022", kana: "のむ", romaji: "nomu", meaning: "to drink", category: "verbs" },
    { id: "v_e_023", kana: "みる", romaji: "miru", meaning: "to see / watch", category: "verbs" },
    { id: "v_e_024", kana: "きく", romaji: "kiku", meaning: "to listen / ask", category: "verbs" },
    { id: "v_e_025", kana: "はなす", romaji: "hanasu", meaning: "to speak", category: "verbs" },
    { id: "v_e_026", kana: "いく", romaji: "iku", meaning: "to go", category: "verbs" },
    { id: "v_e_027", kana: "くる", romaji: "kuru", meaning: "to come", category: "verbs" },
    { id: "v_e_028", kana: "かう", romaji: "kau", meaning: "to buy", category: "verbs" },
    { id: "v_e_029", kana: "よむ", romaji: "yomu", meaning: "to read", category: "verbs" },
    { id: "v_e_030", kana: "かく", romaji: "kaku", meaning: "to write", category: "verbs" },
  ],
  intermediate: [
    // Adjectives
    { id: "v_i_001", kana: "おおきい", romaji: "ookii", meaning: "big / large", category: "adjectives" },
    { id: "v_i_002", kana: "ちいさい", romaji: "chiisai", meaning: "small", category: "adjectives" },
    { id: "v_i_003", kana: "たかい", romaji: "takai", meaning: "tall / expensive", category: "adjectives" },
    { id: "v_i_004", kana: "やすい", romaji: "yasui", meaning: "cheap / easy", category: "adjectives" },
    { id: "v_i_005", kana: "はやい", romaji: "hayai", meaning: "fast / early", category: "adjectives" },
    { id: "v_i_006", kana: "おそい", romaji: "osoi", meaning: "slow / late", category: "adjectives" },
    { id: "v_i_007", kana: "あたらしい", romaji: "atarashii", meaning: "new", category: "adjectives" },
    { id: "v_i_008", kana: "ふるい", romaji: "furui", meaning: "old (things)", category: "adjectives" },
    { id: "v_i_009", kana: "たのしい", romaji: "tanoshii", meaning: "fun / enjoyable", category: "adjectives" },
    { id: "v_i_010", kana: "むずかしい", romaji: "muzukashii", meaning: "difficult", category: "adjectives" },
    // Body
    { id: "v_i_011", kana: "あたま", romaji: "atama", meaning: "head", category: "body" },
    { id: "v_i_012", kana: "め", romaji: "me", meaning: "eye", category: "body" },
    { id: "v_i_013", kana: "みみ", romaji: "mimi", meaning: "ear", category: "body" },
    { id: "v_i_014", kana: "くち", romaji: "kuchi", meaning: "mouth", category: "body" },
    { id: "v_i_015", kana: "て", romaji: "te", meaning: "hand", category: "body" },
    // Emotions
    { id: "v_i_016", kana: "うれしい", romaji: "ureshii", meaning: "happy / glad", category: "emotions" },
    { id: "v_i_017", kana: "かなしい", romaji: "kanashii", meaning: "sad", category: "emotions" },
    { id: "v_i_018", kana: "こわい", romaji: "kowai", meaning: "scary / afraid", category: "emotions" },
    { id: "v_i_019", kana: "すき", romaji: "suki", meaning: "like / love", category: "emotions" },
    { id: "v_i_020", kana: "きらい", romaji: "kirai", meaning: "dislike", category: "emotions" },
    // Weather
    { id: "v_i_021", kana: "てんき", romaji: "tenki", meaning: "weather", category: "weather" },
    { id: "v_i_022", kana: "あめ", romaji: "ame", meaning: "rain", category: "weather" },
    { id: "v_i_023", kana: "ゆき", romaji: "yuki", meaning: "snow", category: "weather" },
    { id: "v_i_024", kana: "かぜ", romaji: "kaze", meaning: "wind", category: "weather" },
    { id: "v_i_025", kana: "はれ", romaji: "hare", meaning: "sunny / clear", category: "weather" },
    // Transportation
    { id: "v_i_026", kana: "でんしゃ", romaji: "densha", meaning: "train", category: "transport" },
    { id: "v_i_027", kana: "バス", romaji: "basu", meaning: "bus", category: "transport" },
    { id: "v_i_028", kana: "くるま", romaji: "kuruma", meaning: "car", category: "transport" },
    { id: "v_i_029", kana: "じてんしゃ", romaji: "jitensha", meaning: "bicycle", category: "transport" },
    { id: "v_i_030", kana: "ひこうき", romaji: "hikouki", meaning: "airplane", category: "transport" },
  ],
};

// ─── PHRASES ──────────────────────────────────────────────────────────────────
export const phrases = {
  beginner: [
    { id: "p_b_001", japanese: "おはようございます。", romaji: "Ohayou gozaimasu.", meaning: "Good morning.", situation: "greeting" },
    { id: "p_b_002", japanese: "こんにちは。", romaji: "Konnichiwa.", meaning: "Hello / Good afternoon.", situation: "greeting" },
    { id: "p_b_003", japanese: "こんばんは。", romaji: "Konbanwa.", meaning: "Good evening.", situation: "greeting" },
    { id: "p_b_004", japanese: "おやすみなさい。", romaji: "Oyasumi nasai.", meaning: "Good night.", situation: "greeting" },
    { id: "p_b_005", japanese: "さようなら。", romaji: "Sayounara.", meaning: "Goodbye.", situation: "greeting" },
    { id: "p_b_006", japanese: "はじめまして。", romaji: "Hajimemashite.", meaning: "Nice to meet you.", situation: "introduction" },
    { id: "p_b_007", japanese: "わたしは [なまえ] です。", romaji: "Watashi wa [name] desu.", meaning: "I am [name].", situation: "introduction" },
    { id: "p_b_008", japanese: "ありがとうございます。", romaji: "Arigatou gozaimasu.", meaning: "Thank you very much.", situation: "manners" },
    { id: "p_b_009", japanese: "どういたしまして。", romaji: "Dou itashimashite.", meaning: "You're welcome.", situation: "manners" },
    { id: "p_b_010", japanese: "すみません。", romaji: "Sumimasen.", meaning: "Excuse me.", situation: "manners" },
  ],
  elementary: [
    { id: "p_e_001", japanese: "これはなんですか？", romaji: "Kore wa nan desu ka?", meaning: "What is this?", situation: "asking" },
    { id: "p_e_002", japanese: "いくらですか？", romaji: "Ikura desu ka?", meaning: "How much is it?", situation: "shopping" },
    { id: "p_e_003", japanese: "どこですか？", romaji: "Doko desu ka?", meaning: "Where is it?", situation: "directions" },
    { id: "p_e_004", japanese: "えきはどこですか？", romaji: "Eki wa doko desu ka?", meaning: "Where is the station?", situation: "directions" },
    { id: "p_e_005", japanese: "わかりません。", romaji: "Wakarimasen.", meaning: "I don't understand.", situation: "communication" },
    { id: "p_e_006", japanese: "もういちどおねがいします。", romaji: "Mou ichido onegaishimasu.", meaning: "Please say that again.", situation: "communication" },
    { id: "p_e_007", japanese: "にほんごがすこしわかります。", romaji: "Nihongo ga sukoshi wakarimasu.", meaning: "I understand a little Japanese.", situation: "communication" },
    { id: "p_e_008", japanese: "いただきます。", romaji: "Itadakimasu.", meaning: "Let's eat! (before meal)", situation: "food" },
    { id: "p_e_009", japanese: "ごちそうさまでした。", romaji: "Gochisousama deshita.", meaning: "Thank you for the meal.", situation: "food" },
    { id: "p_e_010", japanese: "おなかがすきました。", romaji: "Onaka ga sukimashita.", meaning: "I'm hungry.", situation: "food" },
  ],
  intermediate: [
    { id: "p_i_001", japanese: "〜をください。", romaji: "~ wo kudasai.", meaning: "Please give me ~.", situation: "shopping" },
    { id: "p_i_002", japanese: "〜はありますか？", romaji: "~ wa arimasu ka?", meaning: "Do you have ~?", situation: "shopping" },
    { id: "p_i_003", japanese: "でんしゃはなんじにきますか？", romaji: "Densha wa nanji ni kimasu ka?", meaning: "What time does the train come?", situation: "transport" },
    { id: "p_i_004", japanese: "よやくをしたいのですが。", romaji: "Yoyaku wo shitai no desu ga.", meaning: "I'd like to make a reservation.", situation: "formal" },
    { id: "p_i_005", japanese: "ちょっとまってください。", romaji: "Chotto matte kudasai.", meaning: "Please wait a moment.", situation: "general" },
    { id: "p_i_006", japanese: "だいじょうぶですか？", romaji: "Daijoubu desu ka?", meaning: "Are you okay?", situation: "general" },
    { id: "p_i_007", japanese: "たのしかったです！", romaji: "Tanoshikatta desu!", meaning: "It was fun!", situation: "feelings" },
    { id: "p_i_008", japanese: "にほんごをべんきょうしています。", romaji: "Nihongo wo benkyou shite imasu.", meaning: "I am studying Japanese.", situation: "study" },
    { id: "p_i_009", japanese: "〜がすきです。", romaji: "~ ga suki desu.", meaning: "I like ~.", situation: "feelings" },
    { id: "p_i_010", japanese: "おげんきですか？", romaji: "Ogenki desu ka?", meaning: "How are you?", situation: "greeting" },
  ],
};

// ─── SENTENCES ────────────────────────────────────────────────────────────────
export const sentences = {
  beginner: [
    { id: "s_b_001", japanese: "これはねこです。", romaji: "Kore wa neko desu.", meaning: "This is a cat.", breakdown: [{ word: "これは", meaning: "this (topic)" }, { word: "ねこ", meaning: "cat" }, { word: "です", meaning: "is (polite)" }] },
    { id: "s_b_002", japanese: "わたしはがくせいです。", romaji: "Watashi wa gakusei desu.", meaning: "I am a student.", breakdown: [{ word: "わたしは", meaning: "I (topic)" }, { word: "がくせい", meaning: "student" }, { word: "です", meaning: "is (polite)" }] },
    { id: "s_b_003", japanese: "あれはやまです。", romaji: "Are wa yama desu.", meaning: "That over there is a mountain.", breakdown: [{ word: "あれは", meaning: "that (over there)" }, { word: "やま", meaning: "mountain" }, { word: "です", meaning: "is" }] },
    { id: "s_b_004", japanese: "そらはあおいです。", romaji: "Sora wa aoi desu.", meaning: "The sky is blue.", breakdown: [{ word: "そらは", meaning: "sky (topic)" }, { word: "あおい", meaning: "blue" }, { word: "です", meaning: "is" }] },
    { id: "s_b_005", japanese: "いぬがいます。", romaji: "Inu ga imasu.", meaning: "There is a dog.", breakdown: [{ word: "いぬが", meaning: "dog (subject)" }, { word: "います", meaning: "exists (animate)" }] },
  ],
  elementary: [
    { id: "s_e_001", japanese: "わたしはごはんをたべます。", romaji: "Watashi wa gohan wo tabemasu.", meaning: "I eat rice.", breakdown: [{ word: "わたしは", meaning: "I (topic)" }, { word: "ごはんを", meaning: "rice (object)" }, { word: "たべます", meaning: "eat (polite)" }] },
    { id: "s_e_002", japanese: "まいにちがっこうにいきます。", romaji: "Mainichi gakkou ni ikimasu.", meaning: "I go to school every day.", breakdown: [{ word: "まいにち", meaning: "every day" }, { word: "がっこうに", meaning: "to school" }, { word: "いきます", meaning: "go (polite)" }] },
    { id: "s_e_003", japanese: "きのうえいがをみました。", romaji: "Kinou eiga wo mimashita.", meaning: "Yesterday I watched a movie.", breakdown: [{ word: "きのう", meaning: "yesterday" }, { word: "えいがを", meaning: "movie (object)" }, { word: "みました", meaning: "watched (past)" }] },
    { id: "s_e_004", japanese: "おちゃをのみたいです。", romaji: "Ocha wo nomitai desu.", meaning: "I want to drink green tea.", breakdown: [{ word: "おちゃを", meaning: "green tea (object)" }, { word: "のみたい", meaning: "want to drink" }, { word: "です", meaning: "(polite)" }] },
    { id: "s_e_005", japanese: "ともだちとはなしました。", romaji: "Tomodachi to hanashimashita.", meaning: "I talked with a friend.", breakdown: [{ word: "ともだちと", meaning: "with friend" }, { word: "はなしました", meaning: "talked (past)" }] },
  ],
  intermediate: [
    { id: "s_i_001", japanese: "あしたはれたら、こうえんにいきましょう。", romaji: "Ashita haretara, kouen ni ikimashou.", meaning: "If it's sunny tomorrow, let's go to the park.", breakdown: [{ word: "あした", meaning: "tomorrow" }, { word: "はれたら", meaning: "if it's sunny" }, { word: "こうえんに", meaning: "to the park" }, { word: "いきましょう", meaning: "let's go" }] },
    { id: "s_i_002", japanese: "にほんごをべんきょうしているので、むずかしいです。", romaji: "Nihongo wo benkyou shite iru node, muzukashii desu.", meaning: "Because I'm studying Japanese, it's difficult.", breakdown: [{ word: "にほんごを", meaning: "Japanese (object)" }, { word: "べんきょうしているので", meaning: "because I'm studying" }, { word: "むずかしい", meaning: "difficult" }] },
    { id: "s_i_003", japanese: "このえいがはとてもたのしかったです。", romaji: "Kono eiga wa totemo tanoshikatta desu.", meaning: "This movie was very fun.", breakdown: [{ word: "このえいがは", meaning: "this movie (topic)" }, { word: "とても", meaning: "very" }, { word: "たのしかった", meaning: "was fun (past adj)" }] },
    { id: "s_i_004", japanese: "でんしゃがおくれているので、おそくなります。", romaji: "Densha ga okurete iru node, osoku narimasu.", meaning: "Because the train is delayed, I'll be late.", breakdown: [{ word: "でんしゃが", meaning: "train (subject)" }, { word: "おくれているので", meaning: "because it's delayed" }, { word: "おそくなります", meaning: "will be late" }] },
    { id: "s_i_005", japanese: "すきなたべものはすしです。", romaji: "Suki na tabemono wa sushi desu.", meaning: "My favorite food is sushi.", breakdown: [{ word: "すきな", meaning: "favorite / liked" }, { word: "たべものは", meaning: "food (topic)" }, { word: "すし", meaning: "sushi" }, { word: "です", meaning: "is" }] },
  ],
};

// ─── PLACEMENT TEST ───────────────────────────────────────────────────────────
export const placementQuestions = [
  // Hiragana reading (beginner)
  { id: "pt_01", type: "kana", question: "What is this character?", kana: "あ", options: ["a", "i", "u", "e"], answer: "a", level: "beginner" },
  { id: "pt_02", type: "kana", question: "What is this character?", kana: "さ", options: ["ka", "sa", "ta", "na"], answer: "sa", level: "beginner" },
  { id: "pt_03", type: "kana", question: "What is this character?", kana: "み", options: ["mi", "ni", "ri", "hi"], answer: "mi", level: "beginner" },
  // Basic vocabulary (beginner)
  { id: "pt_04", type: "vocab", question: "What does ねこ mean?", options: ["dog", "bird", "cat", "fish"], answer: "cat", level: "beginner" },
  { id: "pt_05", type: "vocab", question: "What does みず mean?", options: ["fire", "water", "earth", "wind"], answer: "water", level: "beginner" },
  // Intermediate vocab
  { id: "pt_06", type: "vocab", question: "What does たべる mean?", options: ["to drink", "to eat", "to sleep", "to run"], answer: "to eat", level: "elementary" },
  { id: "pt_07", type: "vocab", question: "What does がっこう mean?", options: ["hospital", "park", "school", "station"], answer: "school", level: "elementary" },
  { id: "pt_08", type: "vocab", question: "What does あした mean?", options: ["yesterday", "today", "tomorrow", "now"], answer: "tomorrow", level: "elementary" },
  // Phrases (elementary)
  { id: "pt_09", type: "phrase", question: "What does いただきます mean?", options: ["Good night", "Excuse me", "Let's eat!", "Thank you"], answer: "Let's eat!", level: "elementary" },
  { id: "pt_10", type: "phrase", question: "What does わかりません mean?", options: ["I don't understand", "I'm hungry", "I'm sorry", "Please wait"], answer: "I don't understand", level: "elementary" },
  // Intermediate
  { id: "pt_11", type: "vocab", question: "What does むずかしい mean?", options: ["easy", "fun", "difficult", "boring"], answer: "difficult", level: "intermediate" },
  { id: "pt_12", type: "vocab", question: "What does うれしい mean?", options: ["sad", "angry", "afraid", "happy"], answer: "happy", level: "intermediate" },
  { id: "pt_13", type: "phrase", question: "What does 〜がすきです mean?", options: ["I need ~", "I like ~", "I have ~", "I want ~"], answer: "I like ~", level: "intermediate" },
  { id: "pt_14", type: "sentence", question: "Translate: わたしはがくせいです", options: ["I am a teacher", "You are a student", "I am a student", "She is a student"], answer: "I am a student", level: "beginner" },
  { id: "pt_15", type: "sentence", question: "Translate: まいにちがっこうにいきます", options: ["I go to school every day", "I went to school yesterday", "I will go to school", "I don't go to school"], answer: "I go to school every day", level: "elementary" },
];

// ─── LEVEL TEST ───────────────────────────────────────────────────────────────
export const levelTests = {
  beginner: [
    { id: "lt_b_01", type: "vocab", question: "What does ともだち mean?", options: ["teacher", "student", "friend", "family"], answer: "friend" },
    { id: "lt_b_02", type: "vocab", question: "What does あか mean?", options: ["blue", "red", "yellow", "white"], answer: "red" },
    { id: "lt_b_03", type: "phrase", question: "How do you say 'Good morning'?", options: ["こんにちは", "おはようございます", "こんばんは", "さようなら"], answer: "おはようございます" },
    { id: "lt_b_04", type: "sentence", question: "Translate: そらはあおいです", options: ["The sea is blue", "The sky is blue", "The flower is blue", "The mountain is blue"], answer: "The sky is blue" },
    { id: "lt_b_05", type: "kana", question: "Read this: ありがとう", options: ["ohayou", "konnichiwa", "arigatou", "sayounara"], answer: "arigatou" },
    { id: "lt_b_06", type: "vocab", question: "What does やま mean?", options: ["sea", "sky", "mountain", "river"], answer: "mountain" },
    { id: "lt_b_07", type: "phrase", question: "What does はじめまして mean?", options: ["Goodbye", "Thank you", "Nice to meet you", "Good night"], answer: "Nice to meet you" },
    { id: "lt_b_08", type: "sentence", question: "Translate: これはいぬです", options: ["This is a cat", "This is a bird", "This is a dog", "This is a fish"], answer: "This is a dog" },
    { id: "lt_b_09", type: "vocab", question: "What does わたし mean?", options: ["you", "he/she", "we", "I / me"], answer: "I / me" },
    { id: "lt_b_10", type: "vocab", question: "What does さん mean?", options: ["one", "two", "three", "four"], answer: "three (3)" },
  ],
  elementary: [
    { id: "lt_e_01", type: "vocab", question: "What does たべる mean?", options: ["to drink", "to eat", "to sleep", "to walk"], answer: "to eat" },
    { id: "lt_e_02", type: "vocab", question: "What does でんしゃ mean?", options: ["bus", "car", "train", "airplane"], answer: "train" },
    { id: "lt_e_03", type: "phrase", question: "What does いくらですか mean?", options: ["Where is it?", "What is this?", "How much is it?", "What time is it?"], answer: "How much is it?" },
    { id: "lt_e_04", type: "sentence", question: "Translate: まいにちがっこうにいきます", options: ["I go to the park every day", "I go to school every day", "I went to school", "I will go to school tomorrow"], answer: "I go to school every day" },
    { id: "lt_e_05", type: "vocab", question: "What does きのう mean?", options: ["today", "tomorrow", "yesterday", "now"], answer: "yesterday" },
    { id: "lt_e_06", type: "phrase", question: "What does もういちどおねがいします mean?", options: ["Thank you again", "Please say that again", "Please come again", "I understand now"], answer: "Please say that again" },
    { id: "lt_e_07", type: "sentence", question: "Translate: おちゃをのみたいです", options: ["I want to drink water", "I want to eat sushi", "I want to drink green tea", "I want to buy tea"], answer: "I want to drink green tea" },
    { id: "lt_e_08", type: "vocab", question: "What does よむ mean?", options: ["to write", "to listen", "to read", "to speak"], answer: "to read" },
    { id: "lt_e_09", type: "vocab", question: "What does びょういん mean?", options: ["school", "hospital", "station", "store"], answer: "hospital" },
    { id: "lt_e_10", type: "phrase", question: "What does ごちそうさまでした mean?", options: ["Let's eat!", "I'm hungry", "It was delicious", "Thank you for the meal"], answer: "Thank you for the meal" },
  ],
};
