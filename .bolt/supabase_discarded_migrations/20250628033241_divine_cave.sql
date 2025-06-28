/*
  # PKP Monitor Database Schema

  1. New Tables
    - `bundles` - Bundle PKP (tahun, judul, status)
    - `klasters` - Klaster dalam bundle (promosi kesehatan, lingkungan, dll)
    - `indikators` - Indikator penilaian dalam setiap klaster
    - `scoring_indikators` - Detail scoring untuk indikator tipe scoring (0,4,7,10)
    - `target_achievement_indikators` - Detail target untuk indikator tipe target achievement
    - `puskesmas` - Data puskesmas
    - `penilaians` - Hasil penilaian per indikator per puskesmas
    - `evaluasis` - Evaluasi triwulanan per puskesmas
    - `verifikasis` - Status verifikasi dari dinkes
    - `users` - User management (puskesmas/dinkes)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access (puskesmas vs dinkes)
    - Puskesmas can only access their own data
    - Dinkes can access all data for verification

  3. Relationships
    - Bundle -> Klaster (1:many)
    - Klaster -> Indikator (1:many)
    - Indikator -> Scoring/Target details (1:1)
    - Puskesmas -> Penilaian (1:many)
    - Puskesmas -> Evaluasi (1:many)
    - Penilaian -> Verifikasi (1:1)
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('puskesmas', 'dinkes');
CREATE TYPE bundle_status AS ENUM ('draft', 'active', 'completed');
CREATE TYPE indikator_type AS ENUM ('scoring', 'target_achievement');
CREATE TYPE periodicity_type AS ENUM ('annual', 'monthly');
CREATE TYPE verifikasi_status AS ENUM ('pending', 'approved', 'revision');

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'puskesmas',
  nama text NOT NULL,
  puskesmas_id integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Puskesmas table
CREATE TABLE IF NOT EXISTS puskesmas (
  id serial PRIMARY KEY,
  nama text NOT NULL,
  kode text UNIQUE NOT NULL,
  alamat text,
  telepon text,
  email text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Bundle PKP table
CREATE TABLE IF NOT EXISTS bundles (
  id serial PRIMARY KEY,
  tahun integer NOT NULL,
  judul text NOT NULL,
  status bundle_status DEFAULT 'draft',
  deskripsi text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tahun)
);

-- Klaster table
CREATE TABLE IF NOT EXISTS klasters (
  id serial PRIMARY KEY,
  bundle_id integer NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  nama_klaster text NOT NULL,
  deskripsi text,
  urutan integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indikator table
CREATE TABLE IF NOT EXISTS indikators (
  id serial PRIMARY KEY,
  klaster_id integer NOT NULL REFERENCES klasters(id) ON DELETE CASCADE,
  nama_indikator text NOT NULL,
  definisi_operasional text NOT NULL,
  type indikator_type NOT NULL,
  urutan integer NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scoring indikator details
CREATE TABLE IF NOT EXISTS scoring_indikators (
  id serial PRIMARY KEY,
  indikator_id integer NOT NULL REFERENCES indikators(id) ON DELETE CASCADE,
  skor_0 text NOT NULL,
  skor_4 text NOT NULL,
  skor_7 text NOT NULL,
  skor_10 text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(indikator_id)
);

-- Target achievement indikator details
CREATE TABLE IF NOT EXISTS target_achievement_indikators (
  id serial PRIMARY KEY,
  indikator_id integer NOT NULL REFERENCES indikators(id) ON DELETE CASCADE,
  target_percentage integer NOT NULL CHECK (target_percentage >= 0 AND target_percentage <= 100),
  total_sasaran integer NOT NULL CHECK (total_sasaran > 0),
  satuan text NOT NULL,
  periodicity periodicity_type NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(indikator_id)
);

-- Penilaian table
CREATE TABLE IF NOT EXISTS penilaians (
  id serial PRIMARY KEY,
  puskesmas_id integer NOT NULL REFERENCES puskesmas(id) ON DELETE CASCADE,
  bundle_id integer NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  indikator_id integer NOT NULL REFERENCES indikators(id) ON DELETE CASCADE,
  periode text NOT NULL, -- Format: "2024-Q1", "2024-06", etc
  score integer CHECK (score >= 0 AND score <= 10),
  actual_achievement integer CHECK (actual_achievement >= 0),
  calculated_percentage numeric(5,2) CHECK (calculated_percentage >= 0 AND calculated_percentage <= 100),
  catatan text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(puskesmas_id, bundle_id, indikator_id, periode)
);

-- Evaluasi triwulanan table
CREATE TABLE IF NOT EXISTS evaluasis (
  id serial PRIMARY KEY,
  puskesmas_id integer NOT NULL REFERENCES puskesmas(id) ON DELETE CASCADE,
  bundle_id integer NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  triwulan integer NOT NULL CHECK (triwulan >= 1 AND triwulan <= 4),
  tahun integer NOT NULL,
  analisis text NOT NULL,
  hambatan text NOT NULL,
  rencana text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(puskesmas_id, bundle_id, triwulan, tahun)
);

-- Verifikasi table
CREATE TABLE IF NOT EXISTS verifikasis (
  id serial PRIMARY KEY,
  puskesmas_id integer NOT NULL REFERENCES puskesmas(id) ON DELETE CASCADE,
  bundle_id integer NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  periode text NOT NULL,
  status verifikasi_status DEFAULT 'pending',
  komentar text,
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(puskesmas_id, bundle_id, periode)
);

-- Add foreign key constraint for users.puskesmas_id
ALTER TABLE users ADD CONSTRAINT fk_users_puskesmas 
  FOREIGN KEY (puskesmas_id) REFERENCES puskesmas(id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bundles_tahun ON bundles(tahun);
CREATE INDEX IF NOT EXISTS idx_bundles_status ON bundles(status);
CREATE INDEX IF NOT EXISTS idx_klasters_bundle_id ON klasters(bundle_id);
CREATE INDEX IF NOT EXISTS idx_indikators_klaster_id ON indikators(klaster_id);
CREATE INDEX IF NOT EXISTS idx_indikators_type ON indikators(type);
CREATE INDEX IF NOT EXISTS idx_penilaians_puskesmas_bundle ON penilaians(puskesmas_id, bundle_id);
CREATE INDEX IF NOT EXISTS idx_penilaians_periode ON penilaians(periode);
CREATE INDEX IF NOT EXISTS idx_evaluasis_puskesmas_bundle ON evaluasis(puskesmas_id, bundle_id);
CREATE INDEX IF NOT EXISTS idx_evaluasis_tahun_triwulan ON evaluasis(tahun, triwulan);
CREATE INDEX IF NOT EXISTS idx_verifikasis_status ON verifikasis(status);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_puskesmas_id ON users(puskesmas_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE puskesmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE klasters ENABLE ROW LEVEL SECURITY;
ALTER TABLE indikators ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_indikators ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_achievement_indikators ENABLE ROW LEVEL SECURITY;
ALTER TABLE penilaians ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluasis ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifikasis ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Puskesmas policies
CREATE POLICY "Puskesmas readable by all authenticated users"
  ON puskesmas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dinkes can manage puskesmas"
  ON puskesmas
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Bundle policies
CREATE POLICY "Bundles readable by all authenticated users"
  ON bundles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dinkes can manage bundles"
  ON bundles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Klaster policies
CREATE POLICY "Klasters readable by all authenticated users"
  ON klasters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dinkes can manage klasters"
  ON klasters
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Indikator policies
CREATE POLICY "Indikators readable by all authenticated users"
  ON indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dinkes can manage indikators"
  ON indikators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Scoring indikator policies
CREATE POLICY "Scoring indikators readable by all authenticated users"
  ON scoring_indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dinkes can manage scoring indikators"
  ON scoring_indikators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Target achievement indikator policies
CREATE POLICY "Target achievement indikators readable by all authenticated users"
  ON target_achievement_indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Dinkes can manage target achievement indikators"
  ON target_achievement_indikators
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Penilaian policies
CREATE POLICY "Puskesmas can read own penilaians"
  ON penilaians
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.puskesmas_id = penilaians.puskesmas_id
    )
  );

CREATE POLICY "Puskesmas can manage own penilaians"
  ON penilaians
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.puskesmas_id = penilaians.puskesmas_id
    )
  );

CREATE POLICY "Dinkes can read all penilaians"
  ON penilaians
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Evaluasi policies
CREATE POLICY "Puskesmas can read own evaluasis"
  ON evaluasis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.puskesmas_id = evaluasis.puskesmas_id
    )
  );

CREATE POLICY "Puskesmas can manage own evaluasis"
  ON evaluasis
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.puskesmas_id = evaluasis.puskesmas_id
    )
  );

CREATE POLICY "Dinkes can read all evaluasis"
  ON evaluasis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Verifikasi policies
CREATE POLICY "Puskesmas can read own verifikasis"
  ON verifikasis
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.puskesmas_id = verifikasis.puskesmas_id
    )
  );

CREATE POLICY "Dinkes can manage all verifikasis"
  ON verifikasis
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role = 'dinkes'
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_puskesmas_updated_at BEFORE UPDATE ON puskesmas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bundles_updated_at BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_klasters_updated_at BEFORE UPDATE ON klasters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_indikators_updated_at BEFORE UPDATE ON indikators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scoring_indikators_updated_at BEFORE UPDATE ON scoring_indikators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_target_achievement_indikators_updated_at BEFORE UPDATE ON target_achievement_indikators FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_penilaians_updated_at BEFORE UPDATE ON penilaians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_evaluasis_updated_at BEFORE UPDATE ON evaluasis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verifikasis_updated_at BEFORE UPDATE ON verifikasis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();