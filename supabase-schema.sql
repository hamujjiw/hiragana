-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  level TEXT DEFAULT 'unset' CHECK (level IN ('unset', 'beginner', 'elementary', 'intermediate')),
  placement_done BOOLEAN DEFAULT FALSE,
  xp INT DEFAULT 0,
  cat_level INT DEFAULT 1,
  cat_name TEXT DEFAULT 'Neko-chan',
  streak INT DEFAULT 0,
  last_login DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS xp INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cat_level INT DEFAULT 1;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cat_name TEXT DEFAULT 'Neko-chan';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS streak INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login DATE;

CREATE TABLE IF NOT EXISTS progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL CHECK (item_type IN ('kana', 'vocab', 'phrase', 'sentence')),
  correct INT DEFAULT 0,
  attempts INT DEFAULT 0,
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id)
);

CREATE TABLE IF NOT EXISTS level_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  from_level TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  passed BOOLEAN NOT NULL,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS xp_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount INT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own progress" ON progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON progress;
DROP POLICY IF EXISTS "Users can update own progress" ON progress;
DROP POLICY IF EXISTS "Users can view own level tests" ON level_tests;
DROP POLICY IF EXISTS "Users can insert own level tests" ON level_tests;
DROP POLICY IF EXISTS "Users can view own xp log" ON xp_log;
DROP POLICY IF EXISTS "Users can insert own xp log" ON xp_log;

CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own level tests" ON level_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own level tests" ON level_tests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own xp log" ON xp_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp log" ON xp_log FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER SECURITY DEFINER SET search_path = public
LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
