/*
  # Fix RLS Policies for Bundle Management

  1. Update RLS policies to allow bundle creation
  2. Ensure proper permissions for authenticated users
  3. Fix any policy conflicts
*/

-- Drop existing policies that might be conflicting
DROP POLICY IF EXISTS "All authenticated users can manage bundles" ON bundles;
DROP POLICY IF EXISTS "All authenticated users can read bundles" ON bundles;

-- Create new, more permissive policies for development
CREATE POLICY "Authenticated users can read bundles"
  ON bundles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert bundles"
  ON bundles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bundles"
  ON bundles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bundles"
  ON bundles
  FOR DELETE
  TO authenticated
  USING (true);

-- Also update klasters policies to ensure they work with bundles
DROP POLICY IF EXISTS "All authenticated users can manage klasters" ON klasters;
DROP POLICY IF EXISTS "All authenticated users can read klasters" ON klasters;

CREATE POLICY "Authenticated users can read klasters"
  ON klasters
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert klasters"
  ON klasters
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update klasters"
  ON klasters
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete klasters"
  ON klasters
  FOR DELETE
  TO authenticated
  USING (true);

-- Update indikators policies
DROP POLICY IF EXISTS "All authenticated users can manage indikators" ON indikators;
DROP POLICY IF EXISTS "All authenticated users can read indikators" ON indikators;

CREATE POLICY "Authenticated users can read indikators"
  ON indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert indikators"
  ON indikators
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update indikators"
  ON indikators
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete indikators"
  ON indikators
  FOR DELETE
  TO authenticated
  USING (true);

-- Update scoring_indikators policies
DROP POLICY IF EXISTS "All authenticated users can manage scoring indikators" ON scoring_indikators;
DROP POLICY IF EXISTS "All authenticated users can read scoring indikators" ON scoring_indikators;

CREATE POLICY "Authenticated users can read scoring indikators"
  ON scoring_indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert scoring indikators"
  ON scoring_indikators
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update scoring indikators"
  ON scoring_indikators
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete scoring indikators"
  ON scoring_indikators
  FOR DELETE
  TO authenticated
  USING (true);

-- Update target_achievement_indikators policies
DROP POLICY IF EXISTS "All authenticated users can manage target achievement indikators" ON target_achievement_indikators;
DROP POLICY IF EXISTS "All authenticated users can read target achievement indikators" ON target_achievement_indikators;

CREATE POLICY "Authenticated users can read target achievement indikators"
  ON target_achievement_indikators
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert target achievement indikators"
  ON target_achievement_indikators
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update target achievement indikators"
  ON target_achievement_indikators
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete target achievement indikators"
  ON target_achievement_indikators
  FOR DELETE
  TO authenticated
  USING (true);