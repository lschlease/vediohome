'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import VideoPlayer from '@/components/VideoPlayer'
import { ArrowLeft, Eye, Calendar } from 'lucide-react'

type Video = {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_url: string
  duration: number
  views: number
  created_at: string
}

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then((p) => {
      setId(p.id)
      fetch(`/api/videos/${p.id}`)
        .then((res) => res.json())
        .then((data) => {
          setVideo(data)
          setLoading(false)
        })
        .catch((err) => {
          console.error('Failed to load video:', err)
          setLoading(false)
        })
    })
  }, [params])

  const formatViews = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-[#05070C] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Video not found</h2>
          <p className="text-white/60 mb-6">The video you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#38BDF8] text-[#05070C] rounded-full font-medium hover:bg-[#38BDF8]/80 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#05070C]">
      <header className="sticky top-0 z-50 bg-[#0A0D12]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <VideoPlayer src={video.video_url} poster={video.thumbnail_url} />
        </div>

        <div className="bg-[#0F131C] rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">
            {video.title}
          </h1>

          <div className="flex items-center gap-6 mb-6 text-white/60">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              <span>{formatViews(video.views)} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(video.created_at)}</span>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <h2 className="text-lg font-semibold text-white mb-3">Description</h2>
            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
