'use client'

import { useEffect, useState } from 'react'
import VideoCard from '@/components/VideoCard'
import { Play } from 'lucide-react'

type Video = {
  id: string
  title: string
  description: string
  thumbnail_url: string
  video_key: string
  duration: number
  views: number
  created_at: string
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/videos')
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array
        setVideos(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load videos:', err)
        setVideos([])
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-[#05070C]">
      <header className="sticky top-0 z-50 bg-[#0A0D12]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#38BDF8] to-[#6EE7B7] flex items-center justify-center">
                <Play className="w-5 h-5 text-[#05070C]" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">VedioHome</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-white mb-2 tracking-tight">
            Discover Videos
          </h2>
          <p className="text-white/60 text-lg">
            Explore our collection of amazing content
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#0F131C] rounded-2xl overflow-hidden">
                  <div className="aspect-video bg-[#161D2B]" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-[#161D2B] rounded-full w-3/4" />
                    <div className="h-3 bg-[#161D2B] rounded-full w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#0F131C] flex items-center justify-center mx-auto mb-4">
              <Play className="w-10 h-10 text-white/40" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No videos yet</h3>
            <p className="text-white/60">Check back soon for new content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnail_url}
                duration={video.duration}
                views={video.views}
                createdAt={video.created_at}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
