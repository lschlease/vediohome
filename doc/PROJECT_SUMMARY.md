# VedioHome 项目总结

## 项目概述

VedioHome 是一个现代化的视频流媒体平台，使用 Next.js 15、Supabase 和 Cloudflare R2 构建。

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **存储**: Cloudflare R2
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **语言**: TypeScript

## 项目结构

```
vediohome/
├── app/
│   ├── api/
│   │   └── videos/
│   │       ├── route.ts              # 获取所有视频列表
│   │       └── [id]/route.ts         # 获取单个视频并增加浏览量
│   ├── video/
│   │   └── [id]/page.tsx             # 视频播放页面
│   ├── page.tsx                      # 首页（视频列表）
│   └── layout.tsx                    # 根布局
├── components/
│   ├── VideoCard.tsx                 # 视频卡片组件
│   └── VideoPlayer.tsx               # 自定义视频播放器
├── lib/
│   ├── supabase.ts                   # Supabase 客户端配置
│   └── r2.ts                         # Cloudflare R2 客户端配置
├── supabase/
│   └── schema.sql                    # 数据库表结构
├── .env.local                        # 环境变量（需要配置）
├── SETUP.md                          # 详细设置指南
└── README.md                         # 项目文档
```

## 主要功能

### 1. 视频列表页面 (/)
- 显示所有视频的网格布局
- 视频卡片包含缩略图、标题、时长、观看次数和发布时间
- 响应式设计，支持移动端和桌面端
- 悬停效果和平滑过渡动画

### 2. 视频播放页面 (/video/[id])
- 自定义视频播放器，支持：
  - 播放/暂停
  - 进度条拖拽
  - 音量控制
  - 全屏模式
  - 自动隐藏控制栏
- 显示视频详细信息（标题、描述、观看次数、发布日期）
- 自动增加观看计数

### 3. API 路由
- `GET /api/videos`: 返回所有视频及其签名 URL
- `GET /api/videos/[id]`: 返回单个视频详情并增加观看次数

## 设计特色

- **深色主题**: 采用多层次的深色调（#05070C, #0A0D12, #0F131C, #161D2B）
- **青色强调色**: 使用 #38BDF8 作为主要交互色
- **流畅动画**: 所有交互都有平滑的过渡效果
- **响应式布局**: 完全适配移动端、平板和桌面
- **现代化 UI**: 圆角设计、毛玻璃效果、渐变背景

## 数据库结构

### videos 表
```sql
- id: UUID (主键)
- title: TEXT (视频标题)
- description: TEXT (视频描述)
- thumbnail_url: TEXT (缩略图 URL)
- video_key: TEXT (R2 存储键)
- duration: INTEGER (时长，秒)
- views: INTEGER (观看次数)
- created_at: TIMESTAMP (创建时间)
- updated_at: TIMESTAMP (更新时间)
```

## 部署步骤

### 1. 配置 Supabase
1. 创建 Supabase 项目
2. 运行 `supabase/schema.sql` 创建数据库表
3. 获取项目 URL 和 API 密钥

### 2. 配置 Cloudflare R2
1. 创建 R2 bucket
2. 生成 API 令牌
3. （可选）配置自定义域名

### 3. 设置环境变量
复制 `.env.local` 并填入实际的配置值

### 4. 部署到 Vercel
```bash
# 推送到 GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 在 Vercel 导入项目并添加环境变量
```

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 环境变量

需要在 `.env.local` 中配置以下变量：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_r2_public_url  # 可选
```

## 性能优化

- 使用 Next.js Image 组件优化图片加载
- 视频通过 R2 CDN 分发
- 使用签名 URL 保护视频资源
- 静态生成首页，动态渲染视频页面
- Tailwind CSS 生产构建时自动清除未使用的样式

## 安全特性

- 环境变量保护敏感信息
- R2 签名 URL 限时访问
- Supabase Row Level Security (可选配置)
- HTTPS 加密传输

## 未来扩展

可以考虑添加的功能：
- 用户认证和个人资料
- 视频上传功能
- 评论和点赞系统
- 搜索和筛选功能
- 播放列表
- 相关视频推荐
- 视频分类和标签
- 管理后台

## 故障排除

详见 `SETUP.md` 中的常见问题部分。

## 构建状态

✅ 项目已成功构建并通过验证

## 许可证

MIT License
