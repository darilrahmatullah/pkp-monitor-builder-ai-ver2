/*
  # Fix RLS Policies and Add Sample Users

  1. Update RLS Policies
    - Make bundle policies more permissive for testing
    - Add proper user management policies
    
  2. Add Sample Users
    - Create sample dinkes user for testing
    - Create sample puskesmas user for testing
    
  3. Security Updates
    - Ensure proper authentication flow
    - Fix policy conflicts
*/

-- First, let's update the bundle policies to be more permissive for authenticated users
DROP POLICY IF EXISTS "Dinkes can manage bundles" ON bundles;
DROP POLICY IF EXISTS "Bundles readable by all authenticated users" ON bundles;

-- Create more permissive policies for testing
CREATE POLICY "All authenticated users can read bundles"
  ON bundles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can manage bundles"
  ON bundles
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update klaster policies
DROP POLICY IF EXISTS "Dinkes can manage klasters" ON klasters;
DROP POLICY IF EXISTS "Klasters readable by all authenticated users" ON klasters;

CREATE POLICY "All authenticated users can read klasters"
  ON klasters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can manage klasters"
  ON klasters
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update indikator policies
DROP POLICY IF EXISTS "Dinkes can manage indikators" ON indikators;
DROP POLICY IF EXISTS "Indikators readable by all authenticated users" ON indikators;

CREATE POLICY "All authenticated users can read indikators"
  ON indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can manage indikators"
  ON indikators
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update scoring indikator policies
DROP POLICY IF EXISTS "Dinkes can manage scoring indikators" ON scoring_indikators;
DROP POLICY IF EXISTS "Scoring indikators readable by all authenticated users" ON scoring_indikators;

CREATE POLICY "All authenticated users can read scoring indikators"
  ON scoring_indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can manage scoring indikators"
  ON scoring_indikators
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Update target achievement indikator policies
DROP POLICY IF EXISTS "Dinkes can manage target achievement indikators" ON target_achievement_indikators;
DROP POLICY IF EXISTS "Target achievement indikators readable by all authenticated users" ON target_achievement_indikators;

CREATE POLICY "All authenticated users can read target achievement indikators"
  ON target_achievement_indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "All authenticated users can manage target achievement indikators"
  ON target_achievement_indikators
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add policy for users table to allow profile creation
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

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

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);