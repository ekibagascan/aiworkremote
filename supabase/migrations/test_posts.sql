-- Get category IDs for reference
WITH category_ids AS (
    SELECT id, name FROM categories
),
-- Insert test posts
test_posts AS (
    INSERT INTO posts (
        title,
        company_name,
        company_logo_url,
        location,
        job_type,
        salary_range,
        description,
        requirements,
        category,
        tags,
        apply_url,
        is_verified,
        is_featured
    ) VALUES
    -- Machine Learning Engineer position
    (
        'Senior Machine Learning Engineer',
        'Runway',
        'https://registry.npmmirror.com/@lobehub/icons-static-png/1.39.0/files/light/runway.png',
        'Remote (Worldwide)',
        'Full-time',
        '$120,000 - $180,000',
        'We are seeking an experienced Machine Learning Engineer to join our team and help build state-of-the-art AI solutions. You will work on developing and deploying machine learning models that power our core products.',
        'Requirements:
        - 5+ years of experience in Machine Learning
        - Strong Python programming skills
        - Experience with PyTorch or TensorFlow
        - Background in deep learning
        - Experience with MLOps tools
        - Masters or PhD in Computer Science or related field preferred',
        (SELECT id FROM category_ids WHERE name = 'Machine Learning'),
        ARRAY['Python', 'PyTorch', 'TensorFlow', 'Deep Learning', 'MLOps'],
        'https://example.com/apply/ml-engineer',
        true,
        true
    ),
    -- AI Data Trainer position
    (
        'AI Data Training Specialist',
        'Google AI',
        'https://upload.wikimedia.org/wikipedia/commons/0/01/Google_AI.png',
        'Remote (US/EU)',
        'Contract',
        '$40-60 per hour',
        'Join our team as an AI Data Training Specialist to help improve our machine learning models through high-quality data labeling and curation. You will work directly with our AI teams to ensure the highest quality training data.',
        'Requirements:
        - 2+ years experience in data labeling or annotation
        - Understanding of machine learning concepts
        - Attention to detail
        - Experience with data labeling tools
        - Strong communication skills
        - Background in computer vision or NLP a plus',
        (SELECT id FROM category_ids WHERE name = 'AI Data Trainer'),
        ARRAY['Data Labeling', 'Data Curation', 'Quality Assurance', 'Computer Vision', 'NLP'],
        'https://example.com/apply/data-trainer',
        true,
        false
    ),
    -- NLP Engineer position
    (
        'NLP Research Engineer',
        'X AI',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/XAI_Logo.svg/2560px-XAI_Logo.svg.png',
        'Remote (Asia/Pacific)',
        'Full-time',
        '$90,000 - $140,000',
        'We are looking for an NLP Research Engineer to join our team working on cutting-edge language models and applications. You will be responsible for developing and improving our natural language processing systems.',
        'Requirements:
        - 3+ years experience in NLP
        - Strong background in transformer architectures
        - Experience with large language models
        - Proficiency in Python and PyTorch
        - Published research papers in NLP is a plus
        - Masters or PhD preferred',
        (SELECT id FROM category_ids WHERE name = 'NLP'),
        ARRAY['NLP', 'Transformers', 'LLM', 'Python', 'PyTorch', 'BERT', 'GPT'],
        'https://example.com/apply/nlp-engineer',
        true,
        true
    ),
    -- AI Ethics Researcher position
    (
        'AI Ethics Researcher',
        'Kling AI',
        'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/XAI_Logo.svg/2560px-XAI_Logo.svg.png',
        'Remote (EU)',
        'Part-time',
        '€45,000 - €65,000',
        'Join our team as an AI Ethics Researcher to help ensure responsible AI development. You will work on developing frameworks and guidelines for ethical AI implementation.',
        'Requirements:
        - Background in ethics, philosophy, or related field
        - Understanding of AI/ML technologies
        - Experience in policy writing
        - Strong analytical and research skills
        - Excellent communication abilities
        - Published work in AI ethics is a plus',
        (SELECT id FROM category_ids WHERE name = 'AI Ethics'),
        ARRAY['AI Ethics', 'Policy', 'Responsible AI', 'Research', 'Governance'],
        'https://example.com/apply/ethics-researcher',
        true,
        false
    ),
    -- MLOps Engineer position
    (
        'Senior MLOps Engineer',
        'Meta AI',
        'https://logowik.com/content/uploads/images/new-facebook-meta6114.jpg',
        'Remote (US)',
        'Full-time',
        '$130,000 - $180,000',
        'We are seeking an experienced MLOps Engineer to help build and maintain our ML infrastructure. You will be responsible for the entire ML lifecycle, from development to production.',
        'Requirements:
        - 5+ years of experience in DevOps/MLOps
        - Strong Python and Shell scripting
        - Experience with Docker and Kubernetes
        - Familiar with ML frameworks
        - Experience with cloud platforms (AWS/GCP/Azure)
        - Understanding of ML workflows',
        (SELECT id FROM category_ids WHERE name = 'MLOps'),
        ARRAY['MLOps', 'DevOps', 'Python', 'Kubernetes', 'Docker', 'AWS', 'CI/CD'],
        'https://example.com/apply/mlops-engineer',
        true,
        true
    )
    RETURNING id
)
SELECT 'Test posts created successfully' as message; 