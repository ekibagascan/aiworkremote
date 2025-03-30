-- After creating a user through the Supabase dashboard, make them an admin
-- Replace the UUID below with the user's UUID from the dashboard
INSERT INTO user_metadata (id, is_admin)
VALUES ('replace-with-user-uuid', true);

-- Verify the admin was created
SELECT 
    au.email,
    um.is_admin,
    um.created_at
FROM auth.users au
JOIN user_metadata um ON au.id = um.id
WHERE um.is_admin = true; 