-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Note tags junction table
CREATE TABLE note_tags (
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (note_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_note_tags_tag_id ON note_tags(tag_id);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users: only view own user
CREATE POLICY "Users can view own profile" ON users 
  FOR SELECT USING (auth.uid()::uuid = id);

-- Notes: only view/edit own notes
CREATE POLICY "Users can view own notes" ON notes 
  FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can insert own notes" ON notes 
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own notes" ON notes 
  FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete own notes" ON notes 
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Tags: only view/edit own tags
CREATE POLICY "Users can view own tags" ON tags 
  FOR SELECT USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can insert own tags" ON tags 
  FOR INSERT WITH CHECK (auth.uid()::uuid = user_id);
CREATE POLICY "Users can update own tags" ON tags 
  FOR UPDATE USING (auth.uid()::uuid = user_id);
CREATE POLICY "Users can delete own tags" ON tags 
  FOR DELETE USING (auth.uid()::uuid = user_id);

-- Note tags: allow access based on note ownership
CREATE POLICY "Users can manage note tags" ON note_tags 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM notes WHERE notes.id = note_tags.note_id AND notes.user_id = auth.uid()::uuid)
  );
