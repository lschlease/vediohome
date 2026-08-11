# VedioHome 视频平台

一个使用 Next.js、Supabase 和 Cloudflare R2 构建的现代视频流媒体平台。

## ✨ 特性

- 🎥 流畅的视频播放体验
- 📊 观看次数统计
- 🎨 现代化深色主题设计
- 📱 完全响应式，支持移动端
- ⚡ 基于 Next.js 15，性能优异
- 🔒 使用 Cloudflare R2 安全存储视频
- 💾 Supabase 数据库支持

## 🚀 快速开始

### 前置要求

- Node.js 18 或更高版本
- Supabase 账户
- Cloudflare 账户（启用 R2）

### 安装步骤

1. **克隆项目并安装依赖**

```bash
git clone <your-repo-url>
cd vediohome
npm install
```

2. **配置环境变量**

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入你的配置：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_supabase_密钥

R2_ACCOUNT_ID=你的_账户id
R2_ACCESS_KEY_ID=你的_访问密钥
R2_SECRET_ACCESS_KEY=你的_密钥
R2_BUCKET_NAME=你的_bucket名称
R2_PUBLIC_URL=你的_公开域名（可选）
```

3. **设置数据库**

在 Supabase SQL Editor 中运行 `supabase/schema.sql` 中的 SQL 语句。

4. **启动开发服务器**

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 📚 详细文档

- **[SETUP.md](SETUP.md)** - 详细的设置指南
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - 快速参考手册
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - 部署检查清单
- **[PROJECT_COMPLETE.md](PROJECT_COMPLETE.md)** - 项目完成说明

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **数据库**: Supabase (PostgreSQL)
- **存储**: Cloudflare R2
- **样式**: Tailwind CSS 4
- **图标**: Lucide React
- **语言**: TypeScript

## 📁 项目结构

```
vediohome/
├── app/                    # Next.js 应用
│   ├── api/videos/        # API 路由
│   ├── video/[id]/        # 视频播放页
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── VideoCard.tsx     # 视频卡片
│   └── VideoPlayer.tsx   # 播放器
├── lib/                   # 工具库
│   ├── supabase.ts       # Supabase 客户端
│   └── r2.ts             # R2 客户端
└── supabase/             # 数据库
    └── schema.sql        # 表结构
```

## 🎯 主要功能

### 视频列表
- 网格布局展示所有视频
- 显示缩略图、标题、时长、观看次数
- 响应式设计

### 视频播放
- 自定义播放器
- 播放/暂停控制
- 进度条拖拽
- 音量调节
- 全屏模式
- 自动增加观看次数

## 📤 上传视频

### 使用 Cloudflare Dashboard
1. 登录 Cloudflare
2. 进入 R2 存储
3. 选择你的 bucket
4. 上传视频文件

### 添加到数据库

在 Supabase SQL Editor 中：

```sql
INSERT INTO videos (title, description, thumbnail_url, video_key, duration)
VALUES (
  '视频标题',
  '视频描述',
  'https://example.com/thumbnail.jpg',
  'videos/my-video.mp4',
  300
);
```

## 🚢 部署

### 部署到 Vercel

1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 添加所有环境变量
4. 部署

详细步骤请查看 [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

## 🎨 设计特点

- **深色主题**: 多层次深色调，从 #05070C 到 #161D2B
- **青色强调**: #38BDF8 作为主要交互色
- **流畅动画**: 所有交互都有平滑过渡
- **圆角设计**: 现代化的视觉风格
- **响应式**: 完美适配所有设备

## 🔧 常用命令

```bash
npm run dev          # 开发服务器
npm run build        # 构建生产版本
npm start            # 运行生产服务器
npm run type-check   # TypeScript 检查
npm run lint         # 代码检查
npm run clean        # 清除构建文件
```

## 🐛 故障排除

### 视频无法播放
- 检查 R2 bucket 权限
- 确认视频格式为 MP4 (H.264)
- 验证环境变量配置

### 数据库连接失败
- 确认 Supabase URL 和密钥正确
- 检查 Supabase 项目是否活跃
- 验证数据库表已创建

更多问题请查看 [QUICK_REFERENCE.md](QUICK_REFERENCE.md) 的故障排除部分。

## 📊 数据库表结构

```sql
videos
├── id (UUID, 主键)
├── title (TEXT, 标题)
├── description (TEXT, 描述)
├── thumbnail_url (TEXT, 缩略图)
├── video_key (TEXT, R2 存储键)
├── duration (INTEGER, 时长/秒)
├── views (INTEGER, 观看次数)
├── created_at (TIMESTAMP, 创建时间)
└── updated_at (TIMESTAMP, 更新时间)
```

## 🌟 未来功能

- [ ] 用户认证系统
- [ ] 视频上传界面
- [ ] 评论和互动
- [ ] 搜索和筛选
- [ ] 播放列表
- [ ] 视频推荐
- [ ] 分类标签
- [ ] 管理后台

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org)
- [Supabase](https://supabase.com)
- [Cloudflare R2](https://developers.cloudflare.com/r2/)
- [Tailwind CSS](https://tailwindcss.com)

---

如有问题或建议，欢迎提交 Issue 或 Pull Request！
