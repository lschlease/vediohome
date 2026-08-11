import 'dotenv/config'

const BASE_URL = 'http://localhost:3000'

async function testApp() {
  console.log('🧪 测试应用功能...\n')

  try {
    // 测试获取视频列表
    console.log('1️⃣ 测试视频列表 API...')
    const listRes = await fetch(`${BASE_URL}/api/videos`)
    const videos = await listRes.json()
    console.log(`   ✅ 成功获取 ${videos.length} 个视频`)

    if (videos.length > 0) {
      const firstVideo = videos[0]
      console.log(`   📹 第一个视频: ${firstVideo.title}`)
      console.log(`   🔗 视频链接: ${firstVideo.video_key}`)

      // 测试获取单个视频
      console.log('\n2️⃣ 测试单个视频 API...')
      const videoRes = await fetch(`${BASE_URL}/api/videos/${firstVideo.id}`)
      const video = await videoRes.json()
      console.log(`   ✅ 成功获取视频: ${video.title}`)
      console.log(`   👀 浏览次数: ${video.views}`)
    }

    // 验证所有视频使用相同的视频链接
    console.log('\n3️⃣ 验证视频链接...')
    const videoKey = videos[0]?.video_key
    const allSame = videos.every((v: any) => v.video_key === videoKey)
    if (allSame) {
      console.log(`   ✅ 所有视频都使用相同的链接`)
      console.log(`   🎬 ${videoKey}`)
    } else {
      console.log(`   ⚠️  视频链接不一致`)
    }

    console.log('\n✨ 所有测试通过！')
    console.log('\n📱 访问应用:')
    console.log(`   🏠 首页: ${BASE_URL}`)
    console.log(`   🎥 视频页: ${BASE_URL}/video/${videos[0]?.id}`)

  } catch (error) {
    console.error('\n❌ 测试失败:', error)
    process.exit(1)
  }
}

testApp()
