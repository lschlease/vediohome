import { getSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'

// 验证 auth_key
// 格式: timestamp-rand-uid-md5hash
// 例如: 1786453360-10-0-83352c87923a599dbe130421aa89c28c
function verifyAuthKey(
  videoId: string,
  segmentIndex: string,
  authKey: string
): { valid: boolean; expired?: boolean } {
  const parts = authKey.split('-')
  if (parts.length !== 4) {
    return { valid: false }
  }

  const [timestamp, rand, uid, hash] = parts
  const secret = process.env.HLS_SECRET_KEY || 'your-secret-key-change-this'

  // 验证是否过期
  const now = Math.floor(Date.now() / 1000)
  const expiresAt = parseInt(timestamp, 10)
  if (now > expiresAt) {
    return { valid: false, expired: true }
  }

  // 生成期望的 MD5 签名
  // 签名规则: MD5(uri-timestamp-rand-uid-secret)
  const uri = `/api/hls/${videoId}/segment/${segmentIndex}`
  const signString = `${uri}-${timestamp}-${rand}-${uid}-${secret}`
  const expectedHash = createHash('md5').update(signString).digest('hex')

  if (hash !== expectedHash) {
    return { valid: false }
  }

  return { valid: true }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; segment: string }> }
) {
  try {
    const { id, segment } = await params
    const url = new URL(request.url)
    const authKey = url.searchParams.get('auth_key')

    // 验证参数
    if (!authKey) {
      console.log('❌ Missing auth_key')
      return NextResponse.json({ error: 'Missing auth_key' }, { status: 403 })
    }

    // 验证 auth_key
    const verification = verifyAuthKey(id, segment, authKey)

    if (!verification.valid) {
      if (verification.expired) {
        console.log('❌ URL expired')
        return NextResponse.json({ error: 'URL expired' }, { status: 403 })
      }
      console.log('❌ Invalid auth_key')
      return NextResponse.json({ error: 'Invalid auth_key' }, { status: 403 })
    }

    const supabase = getSupabaseClient()

    // Get video metadata
    const { data: video, error } = await supabase
      .from('videos')
      .select('video_key, duration, hls_ready')
      .eq('id', id)
      .single()

    if (error || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    const segmentIndex = parseInt(segment, 10)

    // 检查视频是否已转码为 HLS
    if (video.hls_ready) {
      // 从 Storage 读取真实的 .ts 文件
      const videoDir = video.video_key.replace('/playlist.m3u8', '')
      const segmentPath = `${videoDir}/segment_${segmentIndex.toString().padStart(3, '0')}.ts`

      console.log(`📦 Fetching TS file: ${segmentPath}`)

      const { data: tsFile, error: downloadError } = await supabase.storage
        .from('videos')
        .download(segmentPath)

      if (downloadError || !tsFile) {
        console.error('❌ TS file not found:', segmentPath, downloadError)
        return NextResponse.json({ error: 'Segment not found' }, { status: 404 })
      }

      const arrayBuffer = await tsFile.arrayBuffer()
      console.log(`✅ Serving TS segment ${segmentIndex}: ${(arrayBuffer.byteLength / 1024).toFixed(1)} KB`)

      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'video/mp2t',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Accept-Ranges': 'bytes',
        },
      })
    } else {
      // 视频未转码为 HLS 格式
      console.log('⚠️  Video not in HLS format')
      return NextResponse.json({
        error: 'Video not ready',
        message: 'This video has not been converted to HLS format yet. Please run: node scripts/convert-to-hls.js ' + id,
        videoId: id
      }, { status: 503 })
    }
  } catch (error) {
    console.error('Segment serving error:', error)
    return NextResponse.json(
      { error: 'Failed to serve segment' },
      { status: 500 }
    )
  }
}
