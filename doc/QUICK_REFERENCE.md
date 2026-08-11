# 快速参考指南

## 🚀 快速开始

```bash
# 1. 克隆项目
git clone <your-repo-url>
cd vediohome

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入真实的配置

# 4. 启动开发服务器
npm run dev
```

## 📁 项目结构

```
vediohome/
├── app/                    # Next.js App Router
│   ├── api/videos/        # API 路由
│   ├── video/[id]/        # 视频播放页面
│   ├── page.tsx           # 首页
│   └── layout.tsx         # 根布局
├── components/            # React 组件
│   ├── VideoCard.tsx     # 视频卡片
│   └── VideoPlayer.tsx   # 视频播放器
├── lib/                   # 工具库
│   ├── supabase.ts       # Supabase 客户端
│   └── r2.ts             # R2 存储客户端
└── supabase/             # 数据库
    └── schema.sql        # 数据库表结构
```

## 🎯 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (localhost:3000)
npm run build        # 构建生产版本
npm start            # 运行生产服务器
npm run lint         # 代码检查

# Git
git status           # 查看状态
git add .            # 添加所有文件
git commit -m "msg"  # 提交
git push             # 推送到远程
```

## 🔧 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJ...` |
| `R2_ACCOUNT_ID` | Cloudflare 账户 ID | `abc123...` |
| `R2_ACCESS_KEY_ID` | R2 访问密钥 ID | `...` |
| `R2_SECRET_ACCESS_KEY` | R2 密钥 | `...` |
| `R2_BUCKET_NAME` | R2 存储桶名称 | `vediohome-videos` |
| `R2_PUBLIC_URL` | R2 公开 URL（可选） | `https://cdn.example.com` |

## 📊 数据库操作

### 添加视频

```sql
INSERT INTO videos (title, description, thumbnail_url, video_key, duration)
VALUES (
  '视频标题',
  '视频描述',
  'https://example.com/thumb.jpg',
  'videos/my-video.mp4',
  300  -- 时长（秒）
);
```

### 查询所有视频

```sql
SELECT * FROM videos ORDER BY created_at DESC;
```

### 更新观看次数

```sql
UPDATE videos SET views = views + 1 WHERE id = 'video-id';
```

### 删除视频

```sql
DELETE FROM videos WHERE id = 'video-id';
```

## 📤 上传视频到 R2

### 使用 Cloudflare Dashboard

1. 登录 Cloudflare Dashboard
2. 进入 R2 存储
3. 选择你的 bucket
4. 点击 "Upload" 上传文件

### 使用 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录
wrangler login

# 上传文件
wrangler r2 object put <BUCKET_NAME>/videos/my-video.mp4 --file ./my-video.mp4

# 列出文件
wrangler r2 object list <BUCKET_NAME>

# 删除文件
wrangler r2 object delete <BUCKET_NAME>/videos/my-video.mp4
```

## 🎨 UI 组件

### VideoCard

显示视频缩略图、标题、时长等信息的卡片组件。

**Props:**
- `video`: Video 对象（包含 id, title, thumbnail_url 等）

### VideoPlayer

自定义视频播放器，支持播放控制、进度条、音量、全屏等功能。

**Props:**
- `videoUrl`: 视频 URL
- `className?`: 可选的 CSS 类名

## 🌐 API 路由

### GET /api/videos

返回所有视频列表及其签名 URL。

**响应:**
```json
[
  {
    "id": "uuid",
    "title": "视频标题",
    "description": "描述",
    "thumbnail_url": "缩略图 URL",
    "video_key": "R2 存储键",
    "video_url": "签名的视频 URL",
    "duration": 300,
    "views": 1234,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

### GET /api/videos/[id]

获取单个视频详情并增加观看次数。

**响应:**
```json
{
  "id": "uuid",
  "title": "视频标题",
  "video_url": "签名的视频 URL",
  ...
}
```

## 🐛 故障排除

### 视频无法播放

- ✅ 检查 R2 bucket 权限
- ✅ 确认视频文件格式（推荐 MP4/H.264）
- ✅ 验证环境变量配置
- ✅ 查看浏览器控制台错误

### 数据库连接失败

- ✅ 确认 Supabase URL 和密钥正确
- ✅ 检查 Supabase 项目状态
- ✅ 验证表是否已创建

### 构建失败

- ✅ 运行 `npm install` 重新安装依赖
- ✅ 检查 TypeScript 错误
- ✅ 清除缓存：`rm -rf .next && npm run build`

### 部署失败

- ✅ 确认所有环境变量已在 Vercel 中设置
- ✅ 检查构建日志
- ✅ 验证 Node.js 版本兼容性

## 📚 相关文档

- [README.md](README.md) - 项目概述
- [SETUP.md](SETUP.md) - 详细设置指南
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - 项目总结
- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - 部署检查清单
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)

## 💡 提示

- 视频文件推荐使用 MP4 格式，H.264 编码
- 缩略图推荐尺寸：800x450 或 16:9 比例
- 定期备份 Supabase 数据库
- 监控 R2 存储使用量
- 使用 Vercel Analytics 跟踪性能

## 🆘 获取帮助

- 检查项目文档
- 查看 GitHub Issues
- 访问 Supabase Discord
- Cloudflare 社区论坛
