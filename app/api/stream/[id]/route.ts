import { getSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()

    // Get video metadata from database
    const { data: video, error } = await supabase
      .from('videos')
      .select('video_key')
      .eq('id', id)
      .single()

    if (error || !video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Check if video_key is a full URL or a storage path
    const isFullUrl = video.video_key.startsWith('http://') || video.video_key.startsWith('https://')

    let videoResponse: Response

    if (isFullUrl) {
      // Fetch from external URL with forced chunking
      const range = request.headers.get('range')
      const CHUNK_SIZE = 512 * 1024 // 512 KB per chunk

      console.log('📥 Browser request:', range || 'no range header')

      // Always fetch the full file and slice it ourselves for precise control
      const fullResponse = await fetch(video.video_key)

      if (!fullResponse.ok) {
        console.error('Failed to fetch video:', fullResponse.status, fullResponse.statusText)
        return NextResponse.json({ error: 'Failed to fetch video' }, { status: fullResponse.status })
      }

      const arrayBuffer = await fullResponse.arrayBuffer()
      const fileSize = arrayBuffer.byteLength

      console.log(`📦 Downloaded full file: ${fileSize} bytes`)

      // Parse range request
      let start = 0
      let end = fileSize - 1

      if (range) {
        const parts = range.replace(/bytes=/, '').split('-')
        start = parseInt(parts[0], 10)

        if (parts[1]) {
          end = parseInt(parts[1], 10)
        } else {
          // Browser requested open-ended range, limit to chunk size
          end = Math.min(start + CHUNK_SIZE - 1, fileSize - 1)
        }
      } else {
        // No range header, return first chunk
        end = Math.min(CHUNK_SIZE - 1, fileSize - 1)
      }

      const chunk = arrayBuffer.slice(start, end + 1)
      const chunkSize = end - start + 1

      console.log(`📤 Sending chunk: bytes ${start}-${end}/${fileSize} (${(chunkSize / 1024).toFixed(1)} KB)`)

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': fullResponse.headers.get('content-type') || 'video/mp4',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    } else {
      // Handle Supabase Storage path
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('videos')
        .download(video.video_key)

      if (downloadError || !fileData) {
        console.error('Storage error:', downloadError)
        return NextResponse.json({ error: 'Video file not found' }, { status: 404 })
      }

      const arrayBuffer = await fileData.arrayBuffer()
      const fileSize = arrayBuffer.byteLength
      const range = request.headers.get('range')

      if (!range) {
        console.log('📥 Full file request')
        console.log(`📤 Sending full file: ${fileSize} bytes`)
        return new NextResponse(arrayBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Length': fileSize.toString(),
            'Accept-Ranges': 'bytes',
          },
        })
      }

      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = end - start + 1
      const chunk = arrayBuffer.slice(start, end + 1)

      console.log('📥 Range request:', range)
      console.log(`📤 Sending chunk: ${start}-${end}/${fileSize} (${chunkSize} bytes)`)

      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': 'video/mp4',
        },
      })
    }
  } catch (error) {
    console.error('Stream error:', error)
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    )
  }
}
