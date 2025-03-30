-- Drop the problematic policies first
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

-- Recreate the policies with correct references to user_metadata
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_metadata 
        WHERE user_metadata.id = auth.uid() 
        AND user_metadata.is_admin = true
    )
);

CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 
        FROM user_metadata 
        WHERE user_metadata.id = auth.uid() 
        AND user_metadata.is_admin = true
    )
);

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'posts'; 