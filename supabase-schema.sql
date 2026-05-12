-- Run this in your Supabase SQL Editor
-- Go to: supabase.com → your project → SQL Editor → New Query → paste & run

-- User profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  level TEXT DEFAULT 'unset' CHECK (level IN ('unset', 'beginner', 'elementary', 'intermediate')),
  placement_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Progress tracking per item (vocab/phrase/sentence/kana)
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

-- Level test results
CREATE TABLE IF NOT EXISTS level_tests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  from_level TEXT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  passed BOOLEAN NOT NULL,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_tests ENABLE ROW LEVEL SECURITY;

-- Policies: users can only access their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON progress FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own level tests" ON level_tests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own level tests" ON level_tests FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
