import { getSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = getSupabaseClient()

    const { data: video, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !video) {
      console.error('Database error:', error?.message)
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Increment view count (don't await, fire and forget)
    supabase
      .from('videos')
      .update({ views: video.views + 1 })
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error('Failed to update views:', error.message)
      })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Failed to fetch video:', error)
    return NextResponse.json(
      { error: 'Failed to fetch video' },
      { status: 500 }
    )
  }
}
