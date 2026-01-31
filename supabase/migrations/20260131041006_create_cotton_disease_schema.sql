/*
  # Cotton Leaf Disease Prediction System Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `password_hash` (text)
      - `created_at` (timestamptz)
    
    - `predictions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `image_url` (text)
      - `disease_name` (text)
      - `category` (text)
      - `confidence_score` (numeric)
      - `severity_level` (text)
      - `intensity_percentage` (numeric)
      - `visual_symptoms` (jsonb)
      - `natural_cure` (jsonb)
      - `chemical_cure` (jsonb)
      - `prevention_tips` (jsonb)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  disease_name text NOT NULL,
  category text NOT NULL,
  confidence_score numeric NOT NULL,
  severity_level text NOT NULL,
  intensity_percentage numeric NOT NULL,
  visual_symptoms jsonb DEFAULT '[]'::jsonb,
  natural_cure jsonb DEFAULT '[]'::jsonb,
  chemical_cure jsonb DEFAULT '[]'::jsonb,
  prevention_tips jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view own predictions"
  ON predictions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions"
  ON predictions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions"
  ON predictions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);