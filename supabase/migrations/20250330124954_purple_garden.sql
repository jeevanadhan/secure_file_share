/*
  # Share Links Table and Policies

  1. New Tables
    - `share_links`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `file_path` (text, not null)
      - `expires_at` (timestamptz, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on share_links table
    - Add policies for:
      - Creating share links (authenticated users only)
      - Reading share links (public access for valid links)
      - Deleting share links (owner only)
*/

-- Create share_links table
CREATE TABLE share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  file_path text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

-- Enable RLS
ALTER TABLE share_links ENABLE ROW LEVEL SECURITY;

-- Policy for creating share links
CREATE POLICY "Users can create share links"
  ON share_links
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for reading share links
CREATE POLICY "Anyone can read unexpired share links"
  ON share_links
  FOR SELECT
  TO public
  USING (expires_at > now());

-- Policy for deleting share links
CREATE POLICY "Users can delete own share links"
  ON share_links
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster expiry checks
CREATE INDEX share_links_expiry_idx ON share_links (expires_at);