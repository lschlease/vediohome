import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// 加载 .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function verifySupabase() {
  console.log('🔍 验证 Supabase 配置...\n')

  // 检查环境变量
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少环境变量')
    console.log('请确保 .env.local 中配置了:')
    console.log('  - NEXT_PUBLIC_SUPABASE_URL')
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  console.log('✅ 环境变量已配置')
  console.log(`   URL: ${supabaseUrl}`)
  console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`)

  // 创建客户端
  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 测试连接
    console.log('🔗 测试数据库连接...')
    const { data, error } = await supabase
      .from('videos')
      .select('count')
      .limit(1)

    if (error) {
      if (error.message.includes('relation "public.videos" does not exist')) {
        console.log('⚠️  videos 表不存在，需要创建数据库表')
        console.log('   运行以下 SQL 创建表:\n')
        console.log(`CREATE TABLE videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT NOT NULL,
  video_key TEXT NOT NULL,
  duration INTEGER NOT NULL,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_videos_created_at ON videos(created_at DESC);`)
      } else {
        throw error
      }
    } else {
      console.log('✅ 数据库连接成功')
      console.log(`   当前视频数量: ${data?.length || 0}\n`)
    }

    // 测试存储桶
    console.log('📦 检查存储桶...')
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.log('⚠️  无法访问存储桶:', bucketsError.message)
    } else {
      console.log('✅ 存储桶访问正常')
      console.log('   已有存储桶:', buckets.map(b => b.name).join(', ') || '(无)')
    }

    console.log('\n🎉 Supabase 配置验证完成！')

  } catch (err) {
    console.error('❌ 验证失败:', err)
    process.exit(1)
  }
}

verifySupabase()
