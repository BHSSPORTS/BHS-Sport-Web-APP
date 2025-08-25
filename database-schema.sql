-- BHS Sports Hub Database Schema
-- This file contains all the SQL commands to set up the database structure

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'coach', 'viewer');
CREATE TYPE match_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE result_type AS ENUM ('win', 'loss', 'draw', 'forfeit');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'viewer',
  department TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sports table
CREATE TABLE public.sports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams table
CREATE TABLE public.teams (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  sport_id UUID REFERENCES public.sports(id) ON DELETE SET NULL,
  year_group TEXT,
  logo_url TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teachers/Coaches table
CREATE TABLE public.teachers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  department TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Students table
CREATE TABLE public.students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  year_group TEXT NOT NULL,
  form_group TEXT,
  date_of_birth DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kit items table
CREATE TABLE public.kit_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Match results table
CREATE TABLE public.match_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sport_id UUID REFERENCES public.sports(id) ON DELETE SET NULL,
  home_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  away_team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  home_score INTEGER,
  away_score INTEGER,
  match_date DATE NOT NULL,
  match_time TIME,
  venue TEXT,
  status match_status DEFAULT 'scheduled',
  result_type result_type,
  notes TEXT,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Player performances table
CREATE TABLE public.player_performances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  match_id UUID REFERENCES public.match_results(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  minutes_played INTEGER,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team sheets table
CREATE TABLE public.team_sheets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  sport_id UUID REFERENCES public.sports(id) ON DELETE SET NULL,
  match_date DATE NOT NULL,
  match_time TIME,
  venue TEXT,
  opponent TEXT,
  notes TEXT,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team sheet players table
CREATE TABLE public.team_sheet_players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  team_sheet_id UUID REFERENCES public.team_sheets(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  position TEXT,
  is_starting BOOLEAN DEFAULT false,
  is_substitute BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kit marks table
CREATE TABLE public.kit_marks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  kit_id UUID REFERENCES public.kit_items(id) ON DELETE CASCADE,
  date_awarded DATE NOT NULL,
  awarded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PE groups table
CREATE TABLE public.pe_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  year_group TEXT NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PE group students table
CREATE TABLE public.pe_group_students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pe_group_id UUID REFERENCES public.pe_groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  joined_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photos table
CREATE TABLE public.photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  category TEXT,
  description TEXT,
  uploaded_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swimming records table
CREATE TABLE public.swimming_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  stroke TEXT NOT NULL,
  distance INTEGER NOT NULL,
  time_seconds DECIMAL(8,2) NOT NULL,
  date_achieved DATE NOT NULL,
  is_personal_best BOOLEAN DEFAULT false,
  is_school_record BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Athletics records table
CREATE TABLE public.athletics_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  result_value DECIMAL(8,2) NOT NULL,
  result_unit TEXT NOT NULL,
  date_achieved DATE NOT NULL,
  is_personal_best BOOLEAN DEFAULT false,
  is_school_record BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calendar events table
CREATE TABLE public.calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  venue TEXT,
  sport_id UUID REFERENCES public.sports(id) ON DELETE SET NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  event_type TEXT,
  is_all_day BOOLEAN DEFAULT false,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_match_results_date ON public.match_results(match_date);
CREATE INDEX idx_match_results_teams ON public.match_results(home_team_id, away_team_id);
CREATE INDEX idx_match_results_sport ON public.match_results(sport_id);
CREATE INDEX idx_player_performances_match ON public.player_performances(match_id);
CREATE INDEX idx_player_performances_student ON public.player_performances(student_id);
CREATE INDEX idx_team_sheets_date ON public.team_sheets(match_date);
CREATE INDEX idx_team_sheets_team ON public.team_sheets(team_id);
CREATE INDEX idx_kit_marks_student ON public.kit_marks(student_id);
CREATE INDEX idx_kit_marks_date ON public.kit_marks(date_awarded);
CREATE INDEX idx_pe_groups_year ON public.pe_groups(year_group);
CREATE INDEX idx_photos_category ON public.photos(category);
CREATE INDEX idx_photos_uploaded_by ON public.photos(uploaded_by);
CREATE INDEX idx_calendar_events_date ON public.calendar_events(start_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sports_updated_at BEFORE UPDATE ON public.sports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kit_items_updated_at BEFORE UPDATE ON public.kit_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_match_results_updated_at BEFORE UPDATE ON public.match_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_player_performances_updated_at BEFORE UPDATE ON public.player_performances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_sheets_updated_at BEFORE UPDATE ON public.team_sheets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kit_marks_updated_at BEFORE UPDATE ON public.kit_marks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pe_groups_updated_at BEFORE UPDATE ON public.pe_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_swimming_records_updated_at BEFORE UPDATE ON public.swimming_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_athletics_records_updated_at BEFORE UPDATE ON public.athletics_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO public.sports (name, icon, description) VALUES
  ('Football', '⚽', 'Association football'),
  ('Rugby', '🏉', 'Rugby union'),
  ('Cricket', '🏏', 'Cricket'),
  ('Athletics', '🏃', 'Track and field athletics'),
  ('Swimming', '🏊', 'Swimming'),
  ('Netball', '🏐', 'Netball'),
  ('Hockey', '🏑', 'Field hockey'),
  ('Tennis', '🎾', 'Lawn tennis');

-- Insert sample teams
INSERT INTO public.teams (name, sport_id, year_group) VALUES
  ('U11A Football', (SELECT id FROM public.sports WHERE name = 'Football'), 'Year 6'),
  ('U11B Football', (SELECT id FROM public.sports WHERE name = 'Football'), 'Year 6'),
  ('U13A Rugby', (SELECT id FROM public.sports WHERE name = 'Rugby'), 'Year 8'),
  ('U13B Rugby', (SELECT id FROM public.sports WHERE name = 'Rugby'), 'Year 8'),
  ('U11 Cricket', (SELECT id FROM public.sports WHERE name = 'Cricket'), 'Year 6'),
  ('U13 Cricket', (SELECT id FROM public.sports WHERE name = 'Cricket'), 'Year 8');

-- Insert sample kit items
INSERT INTO public.kit_items (name, category, description) VALUES
  ('Football Kit', 'Team Kit', 'Full football kit including shirt, shorts, and socks'),
  ('Rugby Kit', 'Team Kit', 'Full rugby kit including shirt, shorts, and socks'),
  ('Cricket Whites', 'Team Kit', 'Traditional cricket whites'),
  ('Swimming Kit', 'Individual Kit', 'Swimming costume and goggles'),
  ('Athletics Kit', 'Individual Kit', 'Athletics vest and shorts'),
  ('Hockey Stick', 'Equipment', 'Hockey stick'),
  ('Tennis Racket', 'Equipment', 'Tennis racket');

-- Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.player_performances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_sheet_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kit_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pe_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pe_group_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swimming_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletics_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (can be customized based on requirements)
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);

-- Allow authenticated users to read most data
CREATE POLICY "Authenticated users can read sports" ON public.sports FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read teams" ON public.teams FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read match results" ON public.match_results FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can read team sheets" ON public.team_sheets FOR SELECT USING (auth.role() = 'authenticated');

-- Allow teachers and admins to create/edit data
CREATE POLICY "Teachers and admins can create match results" ON public.match_results FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);

CREATE POLICY "Teachers and admins can update match results" ON public.match_results FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'teacher')
  )
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
