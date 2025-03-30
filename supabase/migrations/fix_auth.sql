-- Create a table for user roles and metadata
CREATE TABLE user_metadata (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    is_admin BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for updated_at
CREATE TRIGGER update_user_metadata_updated_at
    BEFORE UPDATE ON user_metadata
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Drop the existing policy that was causing the error
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;

-- Create new policy using the user_metadata table
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_metadata
        WHERE user_metadata.id = auth.uid()
        AND user_metadata.is_admin = true
    )
);

-- Create policy for deleting posts
CREATE POLICY "Users can delete their own posts"
ON posts FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM user_metadata
        WHERE user_metadata.id = auth.uid()
        AND user_metadata.is_admin = true
    )
);

-- Insert a test admin user (replace 'USER_ID' with an actual user ID once you have one)
-- You'll need to run this manually with your user ID
-- INSERT INTO user_metadata (id, is_admin) VALUES ('USER_ID', true); 