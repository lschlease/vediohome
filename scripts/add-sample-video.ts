import { config } from 'dotenv'
import { resolve } from 'path'
import { getSupabaseClient } from '../lib/supabase'

config({ path: resolve(process.cwd(), '.env.local') })

async function addSampleVideo() {
  const supabase = getSupabaseClient()

  // 使用公共 URL 而不是签名 URL
  const publicUrl = 'https://itfyhavlybfjeaqjabzs.supabase.co/storage/v1/object/public/test/sample1.mp4'

  console.log('🎬 添加示例视频到数据库...')

  const { data, error } = await supabase
    .from('videos')
    .insert({
      title: '示例视频',
      description: '这是一个测试视频，用于演示视频播放功能',
      video_key: publicUrl,
      thumbnail_url: 'https://images.unsplash.com/photo-1574267432644-f610fa4bc2b0?w=1280&h=720&fit=crop',
      duration: 60,
    })
    .select()
    .single()

  if (error) {
    console.error('❌ 添加失败:', error.message)
    
    // 如果是公共访问的问题，尝试使用签名 URL
    console.log('\n尝试使用签名 URL...')
    const signedUrl = 'https://itfyhavlybfjeaqjabzs.supabase.co/storage/v1/object/sign/test/sample1.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yODU4MTk1OS0zNTMwLTQ5MDctOWMzMC1kYjkzYTdhZGE5ZjIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0ZXN0L3NhbXBsZTEubXA0Iiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NjQ1MTUwMSwiZXhwIjoxNzg5MDQzNTAxfQ.9diyRXev5zsF_mQG5T8VrrxofwDlfS9msyO2Hx7I2D4'
    
    const { data: data2, error: error2 } = await supabase
      .from('videos')
      .insert({
        title: '示例视频',
        description: '这是一个测试视频，用于演示视频播放功能',
        video_key: signedUrl,
        thumbnail_url: 'https://images.unsplash.com/photo-1574267432644-f610fa4bc2b0?w=1280&h=720&fit=crop',
        duration: 60,
      })
      .select()
      .single()
    
    if (error2) {
      console.error('❌ 仍然失败:', error2.message)
      process.exit(1)
    }
    
    console.log('✅ 视频添加成功（使用签名 URL）')
    console.log('ID:', data2.id)
    console.log('URL:', data2.video_key)
    console.log('\n⚠️  注意：签名 URL 会在 2025-05-10 过期，之后需要重新生成')
    return
  }

  console.log('✅ 视频添加成功')
  console.log('ID:', data.id)
  console.log('标题:', data.title)
  console.log('URL:', data.video_key)
  console.log('\n🎉 现在可以运行 npm run dev 查看视频了！')
}

addSampleVideo().catch(console.error)
