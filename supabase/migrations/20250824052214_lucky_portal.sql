/*
  # Initial Schema for AI Resume Ranker

  1. New Tables
    - `job_descriptions`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `required_skills` (text array)
      - `experience_level` (text)
      - `salary_range` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `candidates` 
      - `id` (uuid, primary key)
      - `candidate_name` (text)
      - `contact_info` (jsonb)
      - `skills` (text array)
      - `experience_years` (integer)
      - `education` (text)
      - `certifications` (text array)
      - `notable_companies` (text array)
      - `summary` (text)
      - `matched_skills` (text array)
      - `missing_skills` (text array)
      - `match_score` (integer)
      - `recommendation` (text)
      - `is_relevant` (boolean)
      - `issues_detected` (text array)
      - `strengths` (text array)
      - `weaknesses` (text array)
      - `interview_questions` (text array)
      - `salary_range` (text)
      - `hire_probability` (real)
      - `experience_level` (text)
      - `skill_diversity` (real)
      - `company_prestige` (real)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `analysis_results`
      - `id` (uuid, primary key)
      - `job_description_id` (uuid, foreign key)
      - `candidate_ids` (uuid array)
      - `total_candidates` (integer)
      - `relevant_candidates` (integer)
      - `average_score` (integer)
      - `top_candidates` (integer)
      - `analysis_date` (timestamp)
      - `processing_time` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access (since this is a demo)
*/

-- Job descriptions table
CREATE TABLE IF NOT EXISTS job_descriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  required_skills text[] DEFAULT '{}',
  experience_level text DEFAULT 'Mid Level',
  salary_range text DEFAULT 'Competitive',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to job_descriptions"
  ON job_descriptions
  FOR ALL
  TO public
  USING (true);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name text NOT NULL,
  contact_info jsonb DEFAULT '{"email": "", "phone": ""}',
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  education text DEFAULT 'Not specified',
  certifications text[] DEFAULT '{}',
  notable_companies text[] DEFAULT '{}',
  summary text DEFAULT '',
  matched_skills text[] DEFAULT '{}',
  missing_skills text[] DEFAULT '{}',
  match_score integer DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 100),
  recommendation text DEFAULT '',
  is_relevant boolean DEFAULT true,
  issues_detected text[] DEFAULT '{}',
  strengths text[] DEFAULT '{}',
  weaknesses text[] DEFAULT '{}',
  interview_questions text[] DEFAULT '{}',
  salary_range text DEFAULT 'Not specified',
  hire_probability real DEFAULT 0.0 CHECK (hire_probability >= 0.0 AND hire_probability <= 1.0),
  experience_level text DEFAULT 'Entry Level',
  skill_diversity real DEFAULT 0.0 CHECK (skill_diversity >= 0.0 AND skill_diversity <= 1.0),
  company_prestige real DEFAULT 0.0 CHECK (company_prestige >= 0.0 AND company_prestige <= 1.0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to candidates"
  ON candidates
  FOR ALL
  TO public
  USING (true);

-- Analysis results table
CREATE TABLE IF NOT EXISTS analysis_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_description_id uuid REFERENCES job_descriptions(id) ON DELETE CASCADE,
  candidate_ids uuid[] DEFAULT '{}',
  total_candidates integer DEFAULT 0,
  relevant_candidates integer DEFAULT 0,
  average_score integer DEFAULT 0,
  top_candidates integer DEFAULT 0,
  analysis_date timestamptz DEFAULT now(),
  processing_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE analysis_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to analysis_results"
  ON analysis_results
  FOR ALL
  TO public
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_candidates_match_score ON candidates(match_score DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_experience_years ON candidates(experience_years);
CREATE INDEX IF NOT EXISTS idx_candidates_is_relevant ON candidates(is_relevant);
CREATE INDEX IF NOT EXISTS idx_candidates_hire_probability ON candidates(hire_probability DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_created_at ON job_descriptions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analysis_results_created_at ON analysis_results(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_job_descriptions_updated_at ON job_descriptions;
CREATE TRIGGER update_job_descriptions_updated_at
  BEFORE UPDATE ON job_descriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;
CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_analysis_results_updated_at ON analysis_results;
CREATE TRIGGER update_analysis_results_updated_at
  BEFORE UPDATE ON analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();