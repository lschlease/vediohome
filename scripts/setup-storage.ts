import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

config({ path: resolve(process.cwd(), '.env.local') })

async function setupStorage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少环境变量')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔧 设置 Supabase Storage...\n')

  // 创建公开的 videos 存储桶
  const { data, error } = await supabase.storage.createBucket('videos', {
    public: true,
    fileSizeLimit: 524288000, // 500MB
    allowedMimeTypes: ['video/mp4', 'video/webm', 'video/ogg']
  })

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ videos 存储桶已存在')
    } else {
      console.error('❌ 创建存储桶失败:', error.message)
    }
  } else {
    console.log('✅ 成功创建 videos 存储桶（公开访问）')
  }

  console.log('\n📝 下一步:')
  console.log('1. 访问 Supabase 控制台上传视频')
  console.log('2. 或者将 test 存储桶改为公开访问')
}

setupStorage()
