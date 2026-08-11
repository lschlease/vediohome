-- VedioHome Database Schema
-- Run this in your Supabase SQL Editor

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  video_key TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_videos_created_at ON videos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_views ON videos(views DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_videos_updated_at ON videos;
CREATE TRIGGER update_videos_updated_at
    BEFORE UPDATE ON videos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data (optional - remove if you want to add your own videos)
INSERT INTO videos (title, description, thumbnail_url, video_key, duration, views) VALUES
  (
    'Getting Started with Next.js',
    'Learn the basics of Next.js and build your first application. This comprehensive tutorial covers routing, data fetching, and deployment.',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
    'videos/sample-1.mp4',
    1245,
    15420
  ),
  (
    'Building with Supabase',
    'Discover how to integrate Supabase into your projects. We''ll cover authentication, database operations, and real-time subscriptions.',
    'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=450&fit=crop',
    'videos/sample-2.mp4',
    982,
    8930
  ),
  (
    'Cloudflare R2 Storage Guide',
    'Master cloud storage with Cloudflare R2. Learn about file uploads, signed URLs, and optimizing video delivery at scale.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=450&fit=crop',
    'videos/sample-3.mp4',
    1567,
    21340
  ),
  (
    'TypeScript Best Practices',
    'Enhance your TypeScript skills with proven patterns and practices for building robust applications.',
    'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop',
    'videos/sample-4.mp4',
    892,
    12450
  ),
  (
    'React Performance Optimization',
    'Deep dive into React performance optimization techniques including memoization, lazy loading, and code splitting.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop',
    'videos/sample-5.mp4',
    1123,
    18920
  ),
  (
    'Tailwind CSS Mastery',
    'Build beautiful, responsive UIs quickly with Tailwind CSS. Learn advanced techniques and custom configurations.',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=450&fit=crop',
    'videos/sample-6.mp4',
    756,
    9340
  );

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (optional)
-- CREATE POLICY "Public videos are viewable by everyone"
--   ON videos FOR SELECT
--   USING (true);

-- Verify the data was inserted
SELECT COUNT(*) as total_videos FROM videos;
