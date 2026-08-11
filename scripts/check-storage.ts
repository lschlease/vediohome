import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// 加载 .env.local
config({ path: resolve(process.cwd(), '.env.local') })

async function listStorage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 缺少环境变量')
    console.log('请确保 .env.local 中配置了:')
    console.log('  - NEXT_PUBLIC_SUPABASE_URL')
    console.log('  - NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  console.log('🔍 检查 Supabase Storage 配置...\n')

  try {
    // 列出所有存储桶
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error('❌ 无法获取存储桶:', bucketsError.message)
      return
    }

    console.log('📦 可用的存储桶:')
    buckets.forEach((bucket: any) => {
      console.log(`   - ${bucket.name} (${bucket.public ? '公开' : '私有'})`)
    })

    // 检查 test 存储桶中的文件
    console.log('\n📁 test 存储桶中的文件:')
    const { data: files, error: filesError } = await supabase.storage
      .from('test')
      .list()

    if (filesError) {
      console.error('❌ 无法列出文件:', filesError.message)
      return
    }

    if (files && files.length > 0) {
      files.forEach((file: any) => {
        const publicUrl = supabase.storage
          .from('test')
          .getPublicUrl(file.name).data.publicUrl

        console.log(`   📹 ${file.name}`)
        console.log(`      🔗 ${publicUrl}`)
      })
    } else {
      console.log('   (空)')
    }

    // 生成正确的公开 URL
    console.log('\n✅ 使用这个公开 URL:')
    const correctUrl = supabase.storage
      .from('test')
      .getPublicUrl('sample1.mp4').data.publicUrl
    console.log(`   ${correctUrl}`)

  } catch (error) {
    console.error('❌ 错误:', error)
  }
}

listStorage()
