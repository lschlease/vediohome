# VedioHome - Setup Guide

## 设置步骤

### 1. Supabase 配置

1. 访问 [supabase.com](https://supabase.com) 并创建新项目
2. 在项目设置中获取：
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon/Public Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
3. 进入 SQL Editor，运行 `supabase/schema.sql` 中的 SQL 语句创建数据库表

### 2. Cloudflare R2 配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 R2 存储
3. 创建新的 bucket（例如：`vediohome-videos`）
4. 生成 API 令牌：
   - 进入 "Manage R2 API Tokens"
   - 创建新令牌，选择 "Admin Read & Write" 权限
   - 保存 Access Key ID 和 Secret Access Key
5. 获取 Account ID（在 R2 页面右侧可以看到）
6. （可选）设置自定义域名以便公开访问视频

### 3. 环境变量

在项目根目录创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=vediohome-videos
R2_PUBLIC_URL=https://your-custom-domain.com (可选)
```

### 4. 上传视频

使用 Cloudflare R2 控制台或 API 上传视频文件：

#### 使用控制台：
1. 进入你的 R2 bucket
2. 点击 "Upload" 上传视频文件
3. 记录文件的 key（路径）

#### 使用 Wrangler CLI：
```bash
npx wrangler r2 object put vediohome-videos/videos/my-video.mp4 --file ./my-video.mp4
```

### 5. 添加视频记录到数据库

在 Supabase SQL Editor 中运行：

```sql
INSERT INTO videos (title, description, thumbnail_url, video_key, duration)
VALUES (
  '视频标题',
  '视频描述',
  'https://images.unsplash.com/photo-1234567890',
  'videos/my-video.mp4',
  300
);
```

### 6. 运行项目

```bash
npm run dev
```

访问 http://localhost:3000 查看网站

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 添加所有环境变量
4. 点击部署

## 常见问题

### 视频无法播放
- 检查 R2 bucket 权限设置
- 确认视频文件格式（推荐 MP4/H.264）
- 验证环境变量是否正确

### 数据库连接失败
- 确认 Supabase URL 和 Key 是否正确
- 检查 Supabase 项目是否处于活跃状态

### R2 存储连接失败
- 验证 Account ID 和 API 令牌
- 确保 API 令牌有足够的权限
