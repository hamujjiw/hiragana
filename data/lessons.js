// ─── LESSON STRUCTURE ─────────────────────────────────────────────────────────
// World → Unit → Lesson → Exercises

export const worlds = [
  {
    id: "world_1",
    title: "Survive",
    subtitle: "Week 1 in Japan",
    emoji: "🗾",
    color: "#1E88E5",
    colorLight: "#E3EDF8",
    units: [
      {
        id: "unit_1_1",
        title: "Hiragana Basics",
        subtitle: "Learn to read Japanese",
        emoji: "あ",
        lessons: [
          {
            id: "lesson_1_1_1",
            title: "Vowels",
            subtitle: "あ い う え お",
            type: "kana",
            xpReward: 20,
            exercises: [
              { type: "learn", kana: "あ", romaji: "a", hint: "Looks like an 'A' with extra strokes" },
              { type: "learn", kana: "い", romaji: "i", hint: "Two parallel strokes like 'ii'" },
              { type: "learn", kana: "う", romaji: "u", hint: "A face with a small mouth" },
              { type: "learn", kana: "え", romaji: "e", hint: "A dancer — 'eh'" },
              { type: "learn", kana: "お", romaji: "o", hint: "A bowing person — 'oh'" },
              { type: "kana_to_romaji", kana: "あ", options: ["a","i","u","e"], answer: "a" },
              { type: "kana_to_romaji", kana: "い", options: ["a","i","u","e"], answer: "i" },
              { type: "kana_to_romaji", kana: "う", options: ["a","i","u","e"], answer: "u" },
              { type: "kana_to_romaji", kana: "え", options: ["a","i","u","e"], answer: "e" },
              { type: "kana_to_romaji", kana: "お", options: ["a","i","u","e"], answer: "o" },
              { type: "romaji_to_kana", romaji: "a", options: ["あ","い","う","え"], answer: "あ" },
              { type: "romaji_to_kana", romaji: "i", options: ["あ","い","う","え"], answer: "い" },
            ],
          },
          {
            id: "lesson_1_1_2",
            title: "K-row",
            subtitle: "か き く け こ",
            type: "kana",
            xpReward: 20,
            exercises: [
              { type: "learn", kana: "か", romaji: "ka", hint: "A kite flying" },
              { type: "learn", kana: "き", romaji: "ki", hint: "A key with cuts" },
              { type: "learn", kana: "く", romaji: "ku", hint: "The beak of a crow" },
              { type: "learn", kana: "け", romaji: "ke", hint: "Shaped like a K" },
              { type: "learn", kana: "こ", romaji: "ko", hint: "Two horizontal strokes" },
              { type: "kana_to_romaji", kana: "か", options: ["ka","ki","ku","ke"], answer: "ka" },
              { type: "kana_to_romaji", kana: "き", options: ["ka","ki","ku","ko"], answer: "ki" },
              { type: "kana_to_romaji", kana: "く", options: ["ka","ku","ke","ko"], answer: "ku" },
              { type: "kana_to_romaji", kana: "け", options: ["ki","ku","ke","ko"], answer: "ke" },
              { type: "kana_to_romaji", kana: "こ", options: ["ka","ki","ke","ko"], answer: "ko" },
              { type: "romaji_to_kana", romaji: "ka", options: ["か","き","く","け"], answer: "か" },
              { type: "romaji_to_kana", romaji: "ku", options: ["か","き","く","こ"], answer: "く" },
            ],
          },
          {
            id: "lesson_1_1_3",
            title: "S-row",
            subtitle: "さ し す せ そ",
            type: "kana",
            xpReward: 20,
            exercises: [
              { type: "learn", kana: "さ", romaji: "sa", hint: "A person crossing a road" },
              { type: "learn", kana: "し", romaji: "shi", hint: "A fishing hook" },
              { type: "learn", kana: "す", romaji: "su", hint: "A swirl of water" },
              { type: "learn", kana: "せ", romaji: "se", hint: "SE combined" },
              { type: "learn", kana: "そ", romaji: "so", hint: "A Z with a curl" },
              { type: "kana_to_romaji", kana: "さ", options: ["sa","shi","su","se"], answer: "sa" },
              { type: "kana_to_romaji", kana: "し", options: ["sa","shi","su","so"], answer: "shi" },
              { type: "kana_to_romaji", kana: "す", options: ["sa","shi","su","se"], answer: "su" },
              { type: "kana_to_romaji", kana: "せ", options: ["sa","shi","se","so"], answer: "se" },
              { type: "kana_to_romaji", kana: "そ", options: ["sa","su","se","so"], answer: "so" },
              { type: "romaji_to_kana", romaji: "shi", options: ["さ","し","す","せ"], answer: "し" },
              { type: "romaji_to_kana", romaji: "so", options: ["さ","す","せ","そ"], answer: "そ" },
            ],
          },
        ],
      },
      {
        id: "unit_1_2",
        title: "Greetings",
        subtitle: "First words in Japanese",
        emoji: "👋",
        lessons: [
          {
            id: "lesson_1_2_1",
            title: "Hello & Goodbye",
            subtitle: "Basic greetings",
            type: "vocab",
            xpReward: 30,
            exercises: [
              { type: "learn", kana: "おはようございます", romaji: "ohayou gozaimasu", meaning: "Good morning" },
              { type: "learn", kana: "こんにちは", romaji: "konnichiwa", meaning: "Hello / Good afternoon" },
              { type: "learn", kana: "こんばんは", romaji: "konbanwa", meaning: "Good evening" },
              { type: "learn", kana: "さようなら", romaji: "sayounara", meaning: "Goodbye" },
              { type: "learn", kana: "おやすみなさい", romaji: "oyasumi nasai", meaning: "Good night" },
              { type: "meaning_quiz", kana: "こんにちは", romaji: "konnichiwa", options: ["Good morning","Hello","Good night","Goodbye"], answer: "Hello / Good afternoon" },
              { type: "meaning_quiz", kana: "さようなら", romaji: "sayounara", options: ["Hello","Good morning","Goodbye","Good evening"], answer: "Goodbye" },
              { type: "meaning_quiz", kana: "おはようございます", romaji: "ohayou gozaimasu", options: ["Good evening","Good night","Goodbye","Good morning"], answer: "Good morning" },
              { type: "meaning_quiz", kana: "おやすみなさい", romaji: "oyasumi nasai", options: ["Good morning","Hello","Good night","Goodbye"], answer: "Good night" },
            ],
          },
          {
            id: "lesson_1_2_2",
            title: "Polite Phrases",
            subtitle: "Thank you & sorry",
            type: "vocab",
            xpReward: 30,
            exercises: [
              { type: "learn", kana: "ありがとうございます", romaji: "arigatou gozaimasu", meaning: "Thank you very much" },
              { type: "learn", kana: "すみません", romaji: "sumimasen", meaning: "Excuse me / Sorry" },
              { type: "learn", kana: "はい", romaji: "hai", meaning: "Yes" },
              { type: "learn", kana: "いいえ", romaji: "iie", meaning: "No" },
              { type: "learn", kana: "どういたしまして", romaji: "dou itashimashite", meaning: "You're welcome" },
              { type: "meaning_quiz", kana: "ありがとうございます", romaji: "arigatou gozaimasu", options: ["Sorry","You're welcome","Thank you very much","Excuse me"], answer: "Thank you very much" },
              { type: "meaning_quiz", kana: "すみません", romaji: "sumimasen", options: ["Thank you","Yes","No","Excuse me / Sorry"], answer: "Excuse me / Sorry" },
              { type: "meaning_quiz", kana: "はい", romaji: "hai", options: ["No","Maybe","Yes","Okay"], answer: "Yes" },
            ],
          },
          {
            id: "lesson_1_2_3",
            title: "Introduction",
            subtitle: "Nice to meet you",
            type: "phrase",
            xpReward: 30,
            exercises: [
              { type: "learn", kana: "はじめまして", romaji: "hajimemashite", meaning: "Nice to meet you" },
              { type: "learn", kana: "わたしは〜です", romaji: "watashi wa ~ desu", meaning: "I am ~" },
              { type: "learn", kana: "よろしくおねがいします", romaji: "yoroshiku onegaishimasu", meaning: "Please treat me well" },
              { type: "meaning_quiz", kana: "はじめまして", romaji: "hajimemashite", options: ["Goodbye","Nice to meet you","Thank you","Sorry"], answer: "Nice to meet you" },
              { type: "meaning_quiz", kana: "よろしくおねがいします", romaji: "yoroshiku onegaishimasu", options: ["Nice to meet you","Thank you","Please treat me well","Goodbye"], answer: "Please treat me well" },
            ],
          },
        ],
      },
      {
        id: "unit_1_3",
        title: "Transportation",
        subtitle: "Getting around Japan",
        emoji: "🚃",
        lessons: [
          {
            id: "lesson_1_3_1",
            title: "At the Station",
            subtitle: "Train & ticket vocab",
            type: "vocab",
            xpReward: 35,
            exercises: [
              { type: "learn", kana: "えき", romaji: "eki", meaning: "Station" },
              { type: "learn", kana: "でんしゃ", romaji: "densha", meaning: "Train" },
              { type: "learn", kana: "きっぷ", romaji: "kippu", meaning: "Ticket" },
              { type: "learn", kana: "ホーム", romaji: "hoomu", meaning: "Platform" },
              { type: "learn", kana: "のりかえ", romaji: "norikae", meaning: "Transfer" },
              { type: "meaning_quiz", kana: "えき", romaji: "eki", options: ["Train","Bus","Station","Airport"], answer: "Station" },
              { type: "meaning_quiz", kana: "きっぷ", romaji: "kippu", options: ["Station","Platform","Ticket","Transfer"], answer: "Ticket" },
              { type: "meaning_quiz", kana: "でんしゃ", romaji: "densha", options: ["Bus","Train","Taxi","Airplane"], answer: "Train" },
            ],
          },
          {
            id: "lesson_1_3_2",
            title: "Asking Directions",
            subtitle: "Where is...?",
            type: "phrase",
            xpReward: 35,
            exercises: [
              { type: "learn", kana: "〜はどこですか？", romaji: "~ wa doko desu ka?", meaning: "Where is ~?" },
              { type: "learn", kana: "みぎ", romaji: "migi", meaning: "Right" },
              { type: "learn", kana: "ひだり", romaji: "hidari", meaning: "Left" },
              { type: "learn", kana: "まっすぐ", romaji: "massugu", meaning: "Straight ahead" },
              { type: "learn", kana: "ちかい", romaji: "chikai", meaning: "Near / Close" },
              { type: "meaning_quiz", kana: "みぎ", romaji: "migi", options: ["Left","Straight","Right","Far"], answer: "Right" },
              { type: "meaning_quiz", kana: "まっすぐ", romaji: "massugu", options: ["Right","Left","Far","Straight ahead"], answer: "Straight ahead" },
            ],
          },
        ],
      },
      {
        id: "unit_1_4",
        title: "Food & Drink",
        subtitle: "Eating in Japan",
        emoji: "🍜",
        lessons: [
          {
            id: "lesson_1_4_1",
            title: "At the Restaurant",
            subtitle: "Ordering food",
            type: "phrase",
            xpReward: 35,
            exercises: [
              { type: "learn", kana: "いただきます", romaji: "itadakimasu", meaning: "Let's eat! (before meal)" },
              { type: "learn", kana: "ごちそうさまでした", romaji: "gochisousama deshita", meaning: "Thank you for the meal" },
              { type: "learn", kana: "〜をください", romaji: "~ wo kudasai", meaning: "Please give me ~" },
              { type: "learn", kana: "おいしい", romaji: "oishii", meaning: "Delicious" },
              { type: "learn", kana: "おかいけい", romaji: "okaikei", meaning: "The bill / check" },
              { type: "meaning_quiz", kana: "いただきます", romaji: "itadakimasu", options: ["Thank you","Delicious","Let's eat!","The bill"], answer: "Let's eat! (before meal)" },
              { type: "meaning_quiz", kana: "おいしい", romaji: "oishii", options: ["Spicy","Delicious","Expensive","Hot"], answer: "Delicious" },
            ],
          },
          {
            id: "lesson_1_4_2",
            title: "Food Vocabulary",
            subtitle: "Common Japanese foods",
            type: "vocab",
            xpReward: 35,
            exercises: [
              { type: "learn", kana: "ごはん", romaji: "gohan", meaning: "Rice / Meal" },
              { type: "learn", kana: "みず", romaji: "mizu", meaning: "Water" },
              { type: "learn", kana: "おちゃ", romaji: "ocha", meaning: "Green tea" },
              { type: "learn", kana: "すし", romaji: "sushi", meaning: "Sushi" },
              { type: "learn", kana: "ラーメン", romaji: "raamen", meaning: "Ramen" },
              { type: "meaning_quiz", kana: "みず", romaji: "mizu", options: ["Tea","Juice","Water","Soda"], answer: "Water" },
              { type: "meaning_quiz", kana: "ごはん", romaji: "gohan", options: ["Bread","Noodles","Rice / Meal","Soup"], answer: "Rice / Meal" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "world_2",
    title: "Living",
    subtitle: "Your apartment & neighborhood",
    emoji: "🏠",
    color: "#1D9E75",
    colorLight: "#E1F5EE",
    units: [
      {
        id: "unit_2_1",
        title: "Your Apartment",
        subtitle: "Home vocabulary",
        emoji: "🛋️",
        lessons: [
          {
            id: "lesson_2_1_1",
            title: "Rooms & Furniture",
            subtitle: "Around the house",
            type: "vocab",
            xpReward: 40,
            exercises: [
              { type: "learn", kana: "へや", romaji: "heya", meaning: "Room" },
              { type: "learn", kana: "だいどころ", romaji: "daidokoro", meaning: "Kitchen" },
              { type: "learn", kana: "おふろ", romaji: "ofuro", meaning: "Bath" },
              { type: "learn", kana: "まど", romaji: "mado", meaning: "Window" },
              { type: "learn", kana: "ドア", romaji: "doa", meaning: "Door" },
              { type: "meaning_quiz", kana: "へや", romaji: "heya", options: ["Kitchen","Bathroom","Room","Window"], answer: "Room" },
              { type: "meaning_quiz", kana: "だいどころ", romaji: "daidokoro", options: ["Bedroom","Kitchen","Living room","Bathroom"], answer: "Kitchen" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "world_3",
    title: "Working",
    subtitle: "Office life in Japan",
    emoji: "💼",
    color: "#E8960C",
    colorLight: "#FEF3DC",
    units: [
      {
        id: "unit_3_1",
        title: "Keigo Basics",
        subtitle: "Polite business Japanese",
        emoji: "🎩",
        lessons: [
          {
            id: "lesson_3_1_1",
            title: "Formal Greetings",
            subtitle: "At the office",
            type: "phrase",
            xpReward: 50,
            exercises: [
              { type: "learn", kana: "おせわになっております", romaji: "osewa ni natte orimasu", meaning: "Thank you for your continued support" },
              { type: "learn", kana: "よろしくおねがいいたします", romaji: "yoroshiku onegai itashimasu", meaning: "I humbly ask for your cooperation" },
              { type: "learn", kana: "かしこまりました", romaji: "kashikomarimashita", meaning: "Understood (very formal)" },
              { type: "meaning_quiz", kana: "かしこまりました", romaji: "kashikomarimashita", options: ["Sorry","Thank you","Understood (very formal)","Good morning"], answer: "Understood (very formal)" },
            ],
          },
        ],
      },
    ],
  },
];

export const allLessons = worlds.flatMap(w => w.units.flatMap(u => u.lessons.map(l => ({ ...l, unitId: u.id, worldId: w.id }))));

export function getLessonById(id) {
  return allLessons.find(l => l.id === id);
}

export function isLessonUnlocked(lessonId, completedLessons) {
  const allIds = allLessons.map(l => l.id);
  const idx = allIds.indexOf(lessonId);
  if (idx === 0) return true;
  return completedLessons.includes(allIds[idx - 1]);
}
