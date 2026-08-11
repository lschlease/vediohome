# HLS 防盗链实现完成总结

## ✅ 已完成的功能

### 1. **auth_key 签名机制**（完全符合你的示例）

格式：`timestamp-rand-uid-md5hash`

示例：`1786453360-10-0-83352c87923a599dbe130421aa89c28c`

签名规则：`MD5(uri-timestamp-rand-uid-secret)`

```javascript
// 生成签名
const uri = '/api/hls/video-id/segment/0'
const timestamp = Math.floor(Date.now() / 1000) + 300  // 5 分钟后过期
const rand = Math.floor(Math.random() * 100)
const uid = 0
const secret = process.env.HLS_SECRET_KEY

const signString = `${uri}-${timestamp}-${rand}-${uid}-${secret}`
const hash = MD5(signString)
const authKey = `${timestamp}-${rand}-${uid}-${hash}`
```

### 2. **API 端点**

#### `/api/hls/[id]/playlist.m3u8`
- 生成动态 M3U8 播放列表
- 每个分片 URL 带独立的 auth_key
- 每次请求生成新的随机数

#### `/api/hls/[id]/segment/[segment]?auth_key=xxx`
- 验证 auth_key 的四个部分
- 检查时间戳是否过期（5 分钟有效期）
- 重新计算 MD5 签名验证合法性
- 从 Supabase Storage 读取真实的 `.ts` 文件
- 如果视频未转码，返回 503 提示信息

### 3. **安全特性**

✅ **MD5 签名** - 防止 URL 伪造  
✅ **时效限制** - 5 分钟后自动失效  
✅ **随机数防缓存** - 每个 URL 都不同  
✅ **用户绑定支持** - uid 参数可绑定用户 ID  
✅ **单段下载限制** - 每个链接只返回一小段  

### 4. **前端集成**

VideoPlayer 组件支持：
- 自动检测 `.m3u8` 格式
- 使用 hls.js 播放
- 自动请求带签名的分片
- URL 过期后自动刷新

## 📋 使用流程

### 步骤 1：配置密钥

在 `.env.local` 中设置：
```bash
HLS_SECRET_KEY=your-very-secret-key-change-this-in-production
```

生成强随机密钥：
```bash
openssl rand -hex 32
```

### 步骤 2：数据库添加字段

```sql
ALTER TABLE videos ADD COLUMN IF NOT EXISTS hls_ready BOOLEAN DEFAULT FALSE;
```

### 步骤 3：转码视频

使用自动化脚本：
```bash
node scripts/convert-to-hls.js <video-id> <input-mp4-path>
```

示例：
```bash
node scripts/convert-to-hls.js a08475f5-6f7a-411a-8c4c-907c262c7df9 ./video.mp4
```

脚本会自动：
1. 使用 FFmpeg 转码为 HLS
2. 生成 `playlist.m3u8` 和 `.ts` 分片
3. 上传到 Supabase Storage
4. 更新数据库
5. 清理临时文件

### 步骤 4：播放测试

```tsx
<VideoPlayer 
  src="/api/hls/video-id/playlist.m3u8"
  poster="thumbnail.jpg"
/>
```

## 📂 存储结构

转码后在 Supabase Storage 中的结构：

```
videos/
  └── video-id/
      ├── playlist.m3u8       # 播放列表
      ├── segment_000.ts      # 第 1 个分片（10 秒）
      ├── segment_001.ts      # 第 2 个分片（10 秒）
      ├── segment_002.ts      # 第 3 个分片（10 秒）
      └── ...
```

## 🔒 防盗链工作原理

1. **用户访问视频**
   ```
   GET /video/abc123
   ```

2. **请求播放列表**
   ```
   GET /api/hls/abc123/playlist.m3u8
   
   返回:
   #EXTM3U
   #EXTINF:10.0,
   /api/hls/abc123/segment/0?auth_key=1786453360-10-0-83352c87923a599dbe130421aa89c28c
   #EXTINF:10.0,
   /api/hls/abc123/segment/1?auth_key=1786453360-42-0-def456...
   ```

3. **请求分片**
   ```
   GET /api/hls/abc123/segment/0?auth_key=1786453360-10-0-83352c87923a599dbe130421aa89c28c
   
   服务器验证:
   1. 解析: timestamp=1786453360, rand=10, uid=0, hash=83352c87...
   2. 检查未过期: now < 1786453360 ✓
   3. 重新计算 MD5: MD5("/api/hls/abc123/segment/0-1786453360-10-0-secret") ✓
   4. 从 Storage 读取 segment_000.ts
   5. 返回 TS 文件
   ```

4. **URL 过期后自动刷新**
   - hls.js 检测到 403
   - 重新请求播放列表
   - 获取新的 auth_key

## 🎯 防护效果

### ✅ 可以防止

- ✅ **直接下载** - 单个 URL 只能获取 10 秒片段
- ✅ **链接盗用** - 签名验证失败
- ✅ **长期传播** - 5 分钟后失效
- ✅ **批量爬取** - 需要逐个请求并验证签名

### ⚠️ 无法完全防止

- ⚠️ **录屏** - 用户可以录制播放过程
- ⚠️ **技术性下载** - 懂技术的用户可以逐个下载并拼接
- ⚠️ **内存抓取** - 从浏览器内存提取

## 📚 相关文档

- [HLS-ANTI-THEFT.md](./HLS-ANTI-THEFT.md) - 详细的防盗链原理
- [HLS-TRANSCODE-GUIDE.md](./HLS-TRANSCODE-GUIDE.md) - 视频转码指南
- [CURRENT-LIMITATION.md](./CURRENT-LIMITATION.md) - 技术限制说明
- [scripts/convert-to-hls.js](./scripts/convert-to-hls.js) - 自动转码脚本

## 🚀 生产部署建议

### 1. 视频转码服务

在上传时自动触发转码：

```typescript
// app/api/videos/upload/route.ts
export async function POST(request: NextRequest) {
  // 1. 上传原始 MP4
  const { data } = await supabase.storage
    .from('videos')
    .upload(`${videoId}/original.mp4`, file)
  
  // 2. 触发转码任务（后台处理）
  await triggerTranscoding(videoId)
  
  return NextResponse.json({ videoId })
}
```

### 2. CDN 分发

将分片 API 部署到 CDN：
```
https://cdn.example.com/api/hls/video-id/segment/0?auth_key=...
```

### 3. 增强安全

- **IP 绑定**：签名包含客户端 IP
- **用户绑定**：uid 参数设置为真实用户 ID
- **播放次数限制**：记录 auth_key 使用次数
- **监控限流**：检测异常请求行为

### 4. 多码率支持

生成不同分辨率版本：
```bash
# 360p
ffmpeg -i input.mp4 -s 640x360 -b:v 500k -f hls output_360p.m3u8

# 720p
ffmpeg -i input.mp4 -s 1280x720 -b:v 1500k -f hls output_720p.m3u8

# 1080p
ffmpeg -i input.mp4 -s 1920x1080 -b:v 3000k -f hls output_1080p.m3u8
```

## 🎉 总结

HLS 防盗链系统已经完整实现：

✅ **核心架构完成** - auth_key 生成和验证逻辑  
✅ **API 端点就绪** - 播放列表和分片端点  
✅ **安全机制完整** - MD5 签名、时效、随机数  
✅ **前端已集成** - VideoPlayer 自动支持  
✅ **转码脚本可用** - 一键转换 MP4 到 HLS  

只需要：
1. 安装 FFmpeg
2. 配置 HLS_SECRET_KEY
3. 运行转码脚本
4. 开始使用防盗链播放！

参考你提供的示例（`https://ts.hhjd.mobi/videos5/.../xxx.ts?auth_key=...`），我们的实现完全一致，使用相同的 auth_key 格式和验证机制。
