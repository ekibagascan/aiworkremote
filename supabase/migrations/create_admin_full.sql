-- Create a new user in auth.users
-- Note: The password will be 'admin123' (you should change this)
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(), -- Generates a new UUID
    'authenticated',
    'authenticated',
    'ekibagas99@gmail.com', -- Change this email
    crypt('EkibagasProoyeah122@', gen_salt('bf')), -- Change this password
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
) RETURNING id;  -- This will return the UUID we need

-- Now use the returned UUID to create the admin in user_metadata
WITH new_user AS (
    SELECT id FROM auth.users WHERE email = 'ekibagas99@gmail.com'
)
INSERT INTO user_metadata (id, is_admin)
SELECT id, true FROM new_user;

-- Verify the admin was created
SELECT 
    au.email,
    au.id as user_uuid,
    um.is_admin,
    um.created_at
FROM auth.users au
JOIN user_metadata um ON au.id = um.id
WHERE au.email = 'ekibagas99@gmail.com'; 