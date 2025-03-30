-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create posts table for job listings
CREATE TABLE posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_logo_url TEXT,
    location VARCHAR(255),
    job_type VARCHAR(50), -- e.g., 'Full-time', 'Contract', 'Part-time'
    salary_range VARCHAR(100),
    description TEXT NOT NULL,
    requirements TEXT,
    category UUID REFERENCES categories(id),
    tags TEXT[], -- Array of tags for AI-related skills
    apply_url TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster category searches
CREATE INDEX idx_posts_category ON posts(category);

-- Create index for tag searches
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('AI Data Trainer', 'Roles focused on data labeling, dataset curation, and training data preparation for AI models'),
    ('AI Ethics', 'Positions focusing on responsible AI development and ethical considerations'),
    ('AI Quality Assurance', 'Jobs involving testing and quality assurance of AI systems'),
    ('AI Infrastructure', 'Roles managing AI computing infrastructure and hardware optimization'),
    ('Conversational AI', 'Positions working with chatbots and conversational agents'),
    ('AI Education', 'Teaching and training roles in AI and machine learning'),
    ('AI Healthcare', 'AI applications in healthcare and medical technology'),
    ('AI Finance', 'AI roles in financial technology and quantitative analysis'),
    ('Machine Learning', 'Jobs related to machine learning, deep learning, and neural networks'),
    ('Data Science', 'Roles focusing on data analysis, visualization, and statistical modeling'),
    ('AI Engineering', 'Positions for building and maintaining AI infrastructure and systems'),
    ('Computer Vision', 'Jobs involving image processing and visual AI applications'),
    ('NLP', 'Natural Language Processing and text analysis positions'),
    ('MLOps', 'Machine Learning Operations and AI infrastructure roles'),
    ('AI Research', 'Research positions in artificial intelligence and related fields'),
    ('Robotics', 'AI-powered robotics and automation positions'),
    ('AI Product', 'Product management roles for AI products and services'),
    ('AI Consulting', 'Consulting roles specializing in AI implementation');

-- Create a function to search posts by tags
CREATE OR REPLACE FUNCTION search_posts_by_tags(search_tags TEXT[])
RETURNS SETOF posts AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT p.*
    FROM posts p
    WHERE p.tags && search_tags
    ORDER BY p.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to get featured posts
CREATE OR REPLACE FUNCTION get_featured_posts(limit_count INTEGER DEFAULT 5)
RETURNS SETOF posts AS $$
BEGIN
    RETURN QUERY
    SELECT *
    FROM posts
    WHERE is_featured = true
    ORDER BY created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create RLS (Row Level Security) policies
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to posts
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
TO public
USING (true);

-- Create policy for public creation of posts
CREATE POLICY "Anyone can create posts"
ON posts FOR INSERT
TO public
WITH CHECK (true);

-- Create policy for public read access to categories
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT
TO public
USING (true);

-- Only allow authenticated users to insert posts
CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only allow post owners or admins to update/delete posts
CREATE POLICY "Users can update their own posts"
ON posts FOR UPDATE
TO authenticated
USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE is_admin = true
)); 