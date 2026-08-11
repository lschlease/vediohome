# 部署检查清单

在部署 VedioHome 到生产环境之前，请完成以下步骤：

## ✅ 开发环境设置

- [ ] 安装 Node.js 18 或更高版本
- [ ] 克隆或创建项目
- [ ] 运行 `npm install` 安装依赖
- [ ] 创建 `.env.local` 文件（从 `.env.example` 复制）

## ✅ Supabase 配置

- [ ] 创建 Supabase 账户和项目
- [ ] 在 Supabase SQL Editor 中运行 `supabase/schema.sql`
- [ ] 验证 `videos` 表已创建
- [ ] 从项目设置中获取 `NEXT_PUBLIC_SUPABASE_URL`
- [ ] 从项目设置中获取 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] 将这些值添加到 `.env.local`

## ✅ Cloudflare R2 配置

- [ ] 创建 Cloudflare 账户
- [ ] 启用 R2 存储
- [ ] 创建新的 R2 bucket（例如：`vediohome-videos`）
- [ ] 生成 R2 API 令牌（Admin Read & Write 权限）
- [ ] 获取以下值：
  - [ ] `R2_ACCOUNT_ID`（在 R2 页面右侧）
  - [ ] `R2_ACCESS_KEY_ID`（创建令牌时生成）
  - [ ] `R2_SECRET_ACCESS_KEY`（创建令牌时生成）
  - [ ] `R2_BUCKET_NAME`（你创建的 bucket 名称）
- [ ] 将这些值添加到 `.env.local`
- [ ] （可选）配置自定义域名并设置 `R2_PUBLIC_URL`

## ✅ 上传视频内容

- [ ] 准备视频文件（推荐 MP4 格式，H.264 编码）
- [ ] 上传视频到 R2 bucket
- [ ] 记录每个视频的 key（路径）
- [ ] 在 Supabase 中为每个视频添加记录

示例 SQL：
```sql
INSERT INTO videos (title, description, thumbnail_url, video_key, duration)
VALUES (
  '我的视频标题',
  '视频描述',
  'https://example.com/thumbnail.jpg',
  'videos/my-video.mp4',
  300
);
```

## ✅ 本地测试

- [ ] 运行 `npm run dev` 启动开发服务器
- [ ] 访问 http://localhost:3000
- [ ] 验证视频列表正确显示
- [ ] 点击视频卡片，确认可以跳转到播放页面
- [ ] 测试视频播放功能
- [ ] 检查控制栏功能（播放、暂停、进度条、音量、全屏）
- [ ] 验证观看次数是否正确增加

## ✅ 构建验证

- [ ] 运行 `npm run build` 确保项目可以成功构建
- [ ] 检查构建输出没有错误
- [ ] 运行 `npm start` 测试生产构建

## ✅ Git 和 GitHub

- [ ] 初始化 Git 仓库（如果还没有）
- [ ] 确保 `.env.local` 在 `.gitignore` 中
- [ ] 提交所有代码到 Git
- [ ] 推送到 GitHub

```bash
git add .
git commit -m "Initial commit: VedioHome video streaming platform"
git push origin main
```

## ✅ Vercel 部署

- [ ] 登录 [Vercel](https://vercel.com)
- [ ] 点击 "Import Project"
- [ ] 选择 GitHub 仓库
- [ ] 在环境变量中添加所有 `.env.local` 中的变量：
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `R2_ACCOUNT_ID`
  - [ ] `R2_ACCESS_KEY_ID`
  - [ ] `R2_SECRET_ACCESS_KEY`
  - [ ] `R2_BUCKET_NAME`
  - [ ] `R2_PUBLIC_URL`（如果有）
- [ ] 点击 "Deploy"
- [ ] 等待部署完成

## ✅ 部署后测试

- [ ] 访问 Vercel 提供的生产 URL
- [ ] 测试视频列表加载
- [ ] 测试视频播放
- [ ] 在移动设备上测试响应式设计
- [ ] 检查浏览器控制台是否有错误
- [ ] 验证观看次数功能

## ✅ 性能优化（可选）

- [ ] 在 Cloudflare 中启用 R2 CDN
- [ ] 配置视频缩略图的优化（使用 Cloudflare Images 或其他服务）
- [ ] 启用 Vercel Analytics
- [ ] 设置自定义域名

## ✅ 安全配置（推荐）

- [ ] 在 Supabase 中启用 Row Level Security (RLS)
- [ ] 配置 CORS 设置
- [ ] 审查 API 路由的错误处理
- [ ] 设置 rate limiting（如果需要）

## 🎉 完成！

恭喜！你的 VedioHome 视频平台已经成功部署。

### 后续步骤：

1. 监控应用性能和错误日志
2. 根据用户反馈进行优化
3. 考虑添加新功能（见 PROJECT_SUMMARY.md 的"未来扩展"部分）
4. 定期备份 Supabase 数据库

### 有用的链接：

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://app.supabase.com
- Cloudflare Dashboard: https://dash.cloudflare.com
- 项目文档: README.md
- 设置指南: SETUP.md
- 项目总结: PROJECT_SUMMARY.md
