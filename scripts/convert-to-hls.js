/**
 * 将 MP4 视频转换为 HLS 格式并上传到 Supabase Storage
 *
 * 使用方法:
 * node scripts/convert-to-hls.js <video-id> <input-mp4-path>
 *
 * 示例:
 * node scripts/convert-to-hls.js abc123 ./video.mp4
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// 读取环境变量
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function convertToHLS(videoId, inputPath) {
  console.log(`🎬 开始转换视频: ${videoId}`)

  // 创建临时目录
  const tempDir = path.join(__dirname, '../temp', videoId)
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  // FFmpeg 转码参数
  const outputPath = path.join(tempDir, 'playlist.m3u8')
  const segmentPattern = path.join(tempDir, 'segment_%03d.ts')

  console.log('📹 正在转码...')

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', inputPath,                    // 输入文件
      '-c:v', 'libx264',                  // 视频编码器
      '-c:a', 'aac',                      // 音频编码器
      '-f', 'hls',                        // 输出格式
      '-hls_time', '10',                  // 每个分片 10 秒
      '-hls_list_size', '0',              // 播放列表包含所有分片
      '-hls_segment_filename', segmentPattern,  // 分片文件名模板
      outputPath                          // 输出播放列表
    ])

    ffmpeg.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`)
    })

    ffmpeg.stderr.on('data', (data) => {
      // FFmpeg 输出到 stderr
      process.stdout.write('.')
    })

    ffmpeg.on('close', (code) => {
      console.log('\n')
      if (code === 0) {
        console.log('✅ 转码完成')
        resolve()
      } else {
        reject(new Error(`FFmpeg 退出码: ${code}`))
      }
    })

    ffmpeg.on('error', (err) => {
      reject(err)
    })
  })

  // 上传所有文件到 Supabase Storage
  console.log('📤 正在上传文件...')

  const files = fs.readdirSync(tempDir)

  for (const file of files) {
    const filePath = path.join(tempDir, file)
    const fileBuffer = fs.readFileSync(filePath)
    const storagePath = `${videoId}/${file}`

    console.log(`  上传: ${file}`)

    const { error } = await supabase.storage
      .from('videos')
      .upload(storagePath, fileBuffer, {
        contentType: file.endsWith('.m3u8')
          ? 'application/vnd.apple.mpegurl'
          : 'video/mp2t',
        cacheControl: '31536000',  // 1 年缓存
      })

    if (error) {
      console.error(`❌ 上传失败: ${file}`, error)
    } else {
      console.log(`  ✅ ${file}`)
    }
  }

  // 更新数据库
  console.log('💾 更新数据库...')

  const { error: dbError } = await supabase
    .from('videos')
    .update({
      video_key: `${videoId}/playlist.m3u8`,
      hls_ready: true,
    })
    .eq('id', videoId)

  if (dbError) {
    console.error('❌ 数据库更新失败:', dbError)
  } else {
    console.log('✅ 数据库更新成功')
  }

  // 清理临时文件
  console.log('🧹 清理临时文件...')
  fs.rmSync(tempDir, { recursive: true })

  console.log(`\n🎉 完成！视频 ${videoId} 已转换为 HLS 格式`)
  console.log(`播放 URL: /api/hls/${videoId}/playlist.m3u8`)
}

// 主函数
async function main() {
  const [,, videoId, inputPath] = process.argv

  if (!videoId || !inputPath) {
    console.error('用法: node scripts/convert-to-hls.js <video-id> <input-mp4-path>')
    console.error('示例: node scripts/convert-to-hls.js abc123 ./video.mp4')
    process.exit(1)
  }

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ 文件不存在: ${inputPath}`)
    process.exit(1)
  }

  try {
    await convertToHLS(videoId, inputPath)
  } catch (error) {
    console.error('❌ 转换失败:', error)
    process.exit(1)
  }
}

main()
