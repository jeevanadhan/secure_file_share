/*
  # Storage bucket and policies setup

  1. Storage
    - Create "files" bucket for file storage
    - Set up RLS policies for secure access

  2. Security
    - Enable RLS on storage bucket
    - Add policies for authenticated users to:
      - Upload files
      - Download their own files
      - Delete their own files
*/

-- Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name)
VALUES ('files', 'files')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for uploading files
CREATE POLICY "Users can upload files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'files' AND auth.uid() = owner);

-- Policy for viewing own files
CREATE POLICY "Users can view own files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'files' AND auth.uid() = owner);

-- Policy for deleting own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'files' AND auth.uid() = owner);