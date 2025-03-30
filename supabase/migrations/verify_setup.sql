-- Verify admin user exists and has correct permissions
SELECT 
    au.email,
    au.id as user_uuid,
    um.is_admin,
    um.created_at,
    'User exists in auth.users' as status
FROM auth.users au
JOIN user_metadata um ON au.id = um.id
WHERE au.email = 'ekibagas99@gmail.com'
AND um.is_admin = true;

-- Verify policies are correctly set
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'posts'
ORDER BY policyname; 