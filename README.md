# VedioHome

A modern video streaming platform built with Next.js and Supabase.

## Features

- 🎥 Video streaming with custom player
- 📊 View counting and analytics
- 🎨 Modern dark theme UI
- 📱 Fully responsive design
- ⚡ Fast and optimized with Next.js 15
- 💾 Database powered by Supabase

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up Supabase database:

Run the SQL schema in your Supabase project (found in `supabase/schema.sql`):
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy and paste the contents of `supabase/schema.sql`
- Run the query

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
vediohome/
├── app/
│   ├── api/
│   │   └── videos/
│   │       ├── route.ts          # List all videos
│   │       └── [id]/route.ts     # Get single video
│   ├── video/
│   │   └── [id]/page.tsx         # Video player page
│   └── page.tsx                  # Home page
├── components/
│   ├── VideoCard.tsx             # Video thumbnail card
│   └── VideoPlayer.tsx           # Custom video player
├── lib/
│   └── supabase.ts               # Supabase client
└── supabase/
    └── schema.sql                # Database schema
```

## API Routes

### GET /api/videos
Returns all videos

### GET /api/videos/[id]
Returns a single video by ID and increments view count

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Adding Videos

Videos can be added directly to the Supabase database. For now, use external video URLs (e.g., test videos, CDN URLs).

Example video record:
```sql
INSERT INTO videos (title, description, thumbnail_url, video_url, duration)
VALUES (
  'My Video Title',
  'Video description',
  'https://images.unsplash.com/photo-1234567890',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4',
  10
);
```

## License

MIT
