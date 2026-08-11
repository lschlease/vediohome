import { config } from 'dotenv'
import { resolve } from 'path'
import { getSupabaseClient } from '../lib/supabase'

config({ path: resolve(process.cwd(), '.env.local') })

async function checkSchema() {
  const supabase = getSupabaseClient()

  console.log('🔍 检查 videos 表结构...\n')

  // 查询现有数据
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .limit(1)

  if (error) {
    console.error('❌ 查询失败:', error.message)
    process.exit(1)
  }

  if (data && data.length > 0) {
    console.log('✅ 表结构（字段名）:')
    console.log(Object.keys(data[0]))
    console.log('\n示例数据:')
    console.log(JSON.stringify(data[0], null, 2))
  } else {
    console.log('⚠️  表是空的，无法确定字段名')
  }
}

checkSchema().catch(console.error)
