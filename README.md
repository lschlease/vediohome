# VedioHome

A modern video streaming platform built with Next.js, Supabase, and Cloudflare R2.

## Features

- 🎥 Video streaming with custom player
- 📊 View counting and analytics
- 🎨 Modern dark theme UI
- 📱 Fully responsive design
- ⚡ Fast and optimized with Next.js 15
- 🔒 Secure video storage with Cloudflare R2
- 💾 Database powered by Supabase

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **Storage**: Cloudflare R2
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Supabase account and project
- Cloudflare account with R2 enabled

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

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_r2_public_url
```

3. Set up Supabase database:

Run the SQL schema in your Supabase project (found in `supabase/schema.sql`):
- Go to your Supabase project dashboard
- Navigate to SQL Editor
- Copy and paste the contents of `supabase/schema.sql`
- Run the query

4. Configure Cloudflare R2:

- Create an R2 bucket in your Cloudflare dashboard
- Generate API tokens with read/write permissions
- (Optional) Set up a custom domain for public access

5. Run the development server:
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
│   ├── supabase.ts               # Supabase client
│   └── r2.ts                     # R2 storage client
└── supabase/
    └── schema.sql                # Database schema
```

## API Routes

### GET /api/videos
Returns all videos with signed URLs

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
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | R2 access key ID |
| `R2_SECRET_ACCESS_KEY` | R2 secret access key |
| `R2_BUCKET_NAME` | R2 bucket name |
| `R2_PUBLIC_URL` | (Optional) R2 public domain URL |

## Uploading Videos

Videos are stored in Cloudflare R2. To upload videos:

1. Use the Cloudflare dashboard or R2 API
2. Store the video key in Supabase `videos` table
3. Use a thumbnail URL (can be from any CDN or R2)

Example video record:
```sql
INSERT INTO videos (title, description, thumbnail_url, video_key, duration)
VALUES (
  'My Video Title',
  'Video description',
  'https://example.com/thumbnail.jpg',
  'videos/my-video.mp4',
  300
);
```

## License

MIT
