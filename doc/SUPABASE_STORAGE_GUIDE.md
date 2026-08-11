# Supabase Storage 手动上传指南

## 1. 创建存储桶

1. 打开 Supabase 控制台: https://supabase.com/dashboard
2. 选择你的项目: `itfyhavlybfjeaqjabzs`
3. 左侧菜单点击 **Storage**
4. 点击 **New bucket**
5. 配置存储桶:
   - **Name**: `videos`
   - **Public bucket**: ✅ 勾选（这样视频可以直接访问）
   - 点击 **Create bucket**

## 2. 上传文件

### 上传视频
1. 点击 `videos` 存储桶
2. 创建文件夹 `videos/` （可选，用于组织文件）
3. 点击 **Upload file**
4. 选择你的视频文件上传
5. 上传完成后，点击文件名
6. 复制 **Public URL**（例如：`https://itfyhavlybfjeaqjabzs.supabase.co/storage/v1/object/public/videos/your-video.mp4`）

### 上传缩略图
1. 在 `videos` 存储桶中创建 `thumbnails/` 文件夹
2. 上传图片文件
3. 复制图片的 **Public URL**

## 3. 添加视频到数据库

在 Supabase SQL Editor 中运行：

```sql
INSERT INTO videos (title, description, video_url, thumbnail_url, duration)
VALUES (
  '测试视频标题',
  '这是一个测试视频',
  'https://itfyhavlybfjeaqjabzs.supabase.co/storage/v1/object/public/videos/your-video.mp4',
  'https://itfyhavlybfjeaqjabzs.supabase.co/storage/v1/object/public/videos/thumbnails/your-thumbnail.jpg',
  120  -- 视频时长（秒）
);
```

## 4. 存储限制

Supabase 免费套餐:
- 存储空间: 1 GB
- 带宽: 2 GB/月

建议:
- 视频压缩到合理大小（720p 或 480p）
- 缩略图压缩到 100KB 以内
- 只存几个测试视频用于开发

## 5. 验证

运行验证脚本查看存储桶:
```bash
npm run verify
```

或者直接访问:
```
http://localhost:3000
```

视频应该可以正常播放了！
