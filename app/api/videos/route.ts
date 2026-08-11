import { getSupabaseClient } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = getSupabaseClient()

    const { data: videos, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Database error:', error.message)
      return NextResponse.json([], { status: 200 })
    }

    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Failed to fetch videos:', error)
    return NextResponse.json([], { status: 200 })
  }
}
