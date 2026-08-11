import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'

type VideoCardProps = {
  id: string
  title: string
  thumbnail: string
  duration: number
  views: number
  createdAt: string
}

export default function VideoCard({
  id,
  title,
  thumbnail,
  duration,
  views,
  createdAt,
}: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <Link href={`/video/${id}`} className="group block">
      <div className="bg-[#0F131C] rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#161D2B] hover:scale-[1.02]">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#38BDF8] flex items-center justify-center">
              <Play className="w-8 h-8 text-[#05070C] ml-1" />
            </div>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded-lg text-xs text-white font-mono">
            {formatDuration(duration)}
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-medium mb-2 line-clamp-2 group-hover:text-[#38BDF8] transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span>{formatViews(views)} views</span>
            <span>•</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
