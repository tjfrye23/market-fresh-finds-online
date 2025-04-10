
-- Create vendor-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('vendor-images', 'Vendor Profile Images', true)
ON CONFLICT (id) DO NOTHING;

-- Create a policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload vendor images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'vendor-images');

-- Create a policy to allow users to update their own images
CREATE POLICY "Users can update their own vendor images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'vendor-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create a policy to allow users to delete their own images
CREATE POLICY "Users can delete their own vendor images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'vendor-images' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Create a policy to allow public access to read vendor images
CREATE POLICY "Public can view vendor images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'vendor-images');
