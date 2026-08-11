import { getSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

// 生成 auth_key
// 格式: timestamp-rand-uid-md5hash
function generateAuthKey(videoId: string, segmentIndex: number): string {
  const secret = process.env.HLS_SECRET_KEY || 'your-secret-key-change-this'
  const timestamp = Math.floor(Date.now() / 1000) + 300 // 5 分钟有效期
  const rand = Math.floor(Math.random() * 100) // 随机数 0-99
  const uid = 0 // 用户 ID，可以根据实际需求设置

  // 生成 URI
  const uri = `/api/hls/${videoId}/segment/${segmentIndex}`

  // 生成 MD5 签名
  // 签名规则: MD5(uri-timestamp-rand-uid-secret)
  const signString = `${uri}-${timestamp}-${rand}-${uid}-${secret}`
  const hash = createHash('md5').update(signString).digest('hex')

  return `${timestamp}-${rand}-${uid}-${hash}`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()

    // Get video metadata
    const { data: video, error } = await supabase
      .from('videos')
      .select('video_key, duration')
      .eq('id', id)
      .single()

    if (error || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // 生成 HLS 播放列表
    // 假设每个分片是 10 秒
    const SEGMENT_DURATION = 10
    const numSegments = Math.ceil(video.duration / SEGMENT_DURATION)

    // 生成 M3U8 播放列表
    let playlist = '#EXTM3U\n'
    playlist += '#EXT-X-VERSION:3\n'
    playlist += `#EXT-X-TARGETDURATION:${SEGMENT_DURATION}\n`
    playlist += '#EXT-X-MEDIA-SEQUENCE:0\n'
    playlist += '#EXT-X-PLAYLIST-TYPE:VOD\n\n'

    for (let i = 0; i < numSegments; i++) {
      const authKey = generateAuthKey(id, i)
      const segmentUrl = `/api/hls/${id}/segment/${i}?auth_key=${authKey}`
      playlist += `#EXTINF:${SEGMENT_DURATION}.0,\n`
      playlist += `${segmentUrl}\n`
    }

    playlist += '#EXT-X-ENDLIST\n'

    console.log(`📋 Generated HLS playlist for video ${id}: ${numSegments} segments`)

    return new NextResponse(playlist, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.apple.mpegurl',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch (error) {
    console.error('Playlist generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate playlist' },
      { status: 500 }
    )
  }
}
