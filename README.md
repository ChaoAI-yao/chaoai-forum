# 潮 AI 智能体社区

面向 AI 智能体开发者、OpenClaw 使用者及 Token 经济关注者的中文交流社区。当前阶段聚焦社区基础：账号、帖子与评论、搜索、收藏及内容管理；智能体市场、实时互动和 Token 功能属于后续规划。

## 当前功能

- 邮箱注册、登录和退出；密码使用 bcrypt 哈希保存，登录态使用 HttpOnly Cookie。
- 个人资料页，展示用户发布的公开内容。
- 帖子创建、编辑、删除，支持草稿、分类和标签。
- 评论、收藏，以及按关键词和分类筛选帖子。
- 管理员审核帖子（发布/隐藏）及封禁、解封用户。
- 响应式中文界面与服务端数据校验。

## 技术栈

- Next.js 15、React 19、TypeScript
- Prisma ORM、SQLite（本地开发默认；生产环境建议 PostgreSQL）
- Zod、bcryptjs、jose

## 本地运行

要求 Node.js 20 或更高版本。复制 `.env.example` 为 `.env`，设置随机 `SESSION_SECRET`（至少 32 个字符）；如需管理员账户，设置 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD`。

```bash
npm install
cp .env.example .env
# 编辑 .env 中的密钥和管理员信息
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

打开 http://localhost:3000。管理员通过 seed 脚本创建，不要在公开注册流程中授予管理员权限。

## 主要路由

- `/` 社区首页、搜索和分类筛选
- `/register`、`/login` 账号注册与登录
- `/posts/new` 发布帖子
- `/posts/[id]` 帖子详情与评论
- `/profile/[id]` 个人主页
- `/admin` 管理员审核台

## API 概览

- `POST /api/auth/register`、`POST /api/auth/login`、`POST /api/auth/logout`
- `GET /api/posts?q=&category=`、`POST /api/posts`
- `GET|PATCH|DELETE /api/posts/:id`；`POST /api/posts/:id/comments`
- `POST /api/posts/:id/save` 收藏/取消收藏
- `GET /api/admin/posts`、`PATCH /api/admin/posts/:id`、`PATCH /api/admin/users/:id`

所有写操作由服务端验证身份、角色、输入和资源归属。公开读取只返回已发布帖子。

## 部署注意事项

SQLite 适用于本地试用；多实例生产部署请改用 PostgreSQL，并在托管环境配置 `DATABASE_URL`、`SESSION_SECRET`、`ADMIN_EMAIL`、`ADMIN_PASSWORD`。部署前执行 Prisma schema migration，并启用 HTTPS。管理员初始密码应在首次登录后更换。

生产化前还应补充：邮件验证与密码重置、登录/发帖限流、CSRF 与安全审计、举报工作流、自动化测试、日志与监控、备份恢复演练。当前实现不包含真实 Token 钱包、链上交易或用户代码托管。

## 路线图

1. 社区基础：账号、内容、搜索、收藏与审核（当前阶段）
2. 关注、私信、通知、在线状态与邮件服务
3. 智能体展示、评分、版本管理和 OpenClaw 资源中心
4. 积分任务、签到、排行榜及运营分析
5. 在单独完成合规、安全和威胁建模后评估钱包、链上功能与沙箱托管
