# 智印联创 Web 应用

印刷行业 AI 智能撮合与纸价预测平台 —— 将原微信小程序的能力完整迁移到 Web 端，提供订单大厅、产能发布、集采商城、AI 纸价预测、创业孵化等全链路服务。

## 项目简介

智印联创 Web 应用是原微信小程序「智印联创」的 Web 端实现，技术栈升级为 Next.js 16 + TypeScript + Tailwind CSS v4 + Supabase + Zustand + Recharts，并接入智谱 GLM-4.7-Flash 提供 AI 能力。所有小程序页面均已映射到 Web 端路由，无功能遗漏。

核心能力：

- **AI 纸价预测**：多纸种价格趋势看板 + 智谱 AI 智能解读
- **订单大厅**：印厂订单发布 / 投标撮合 / 产能发布
- **集采商城**：拼团集采 + 倒计时 + AI 采购建议
- **创业孵化**：行业文章 / 创业导师 / 案例库 / 投资计算器
- **消息中心**：系统通知 + 订单消息
- **个人中心**：企业实名认证 / 我的订单 / 我的报价 / 资料编辑

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 16（App Router） |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS v4 |
| 后端即服务 | Supabase（Postgres + Auth + Storage） |
| 状态管理 | Zustand 5（persist 中间件） |
| 图表 | Recharts 3 |
| 动效 | Framer Motion 12 |
| 表单 | react-hook-form 7 + zod 4 |
| AI | 智谱 GLM-4.7-Flash（Chat / 价格分析 / 采购建议 / 文章摘要） |
| 包管理 | pnpm 9 |
| 部署 | Vercel（香港区域 hkg1） |

## 本地开发

### 环境要求

- Node.js 18+
- pnpm 9+（`npm install -g pnpm`）

### 启动步骤

```bash
# 1. 安装依赖
pnpm install

# 2. 复制环境变量模板并填入凭证
cp .env.local.example .env.local
# 编辑 .env.local 填入 Supabase / 智谱凭证

# 3. 启动开发服务器
pnpm dev
```

浏览器访问 [http://localhost:3000](http://localhost:3000)。

## Supabase 配置

### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com) 注册并新建项目
2. 在 `Project Settings → API` 获取：
   - **Project URL**：`https://xxx.supabase.co`
   - **anon key**：`eyJxxx`（公开密钥，可暴露到前端）
   - **service role key**：`eyJxxx`（服务端密钥，**严禁**暴露到前端）

### 2. 执行数据库迁移

在 Supabase Dashboard → `SQL Editor` 中按顺序执行：

1. `supabase/migrations/0001_init_schema.sql` —— 创建全部表结构与索引
2. `supabase/migrations/0002_rls_policies.sql` —— 启用 Row Level Security 与策略

### 3. 执行种子数据

```bash
# 在 Supabase SQL Editor 中执行
supabase/seed.sql
```

种子数据包含测试账户、纸种、订单、集采、文章、导师、案例等基础数据。

### 4. 创建 Storage Bucket

在 Supabase Dashboard → `Storage` 中创建以下 Bucket：

| Bucket 名 | 公开 | 用途 |
|---|---|---|
| `avatars` | ✅ public | 用户头像 |
| `company-licenses` | ✅ public | 企业营业执照附件 |

### 5. 配置 Auth

1. `Authentication → Providers` 启用 **Email** 认证
2. `Authentication → Email Templates` 配置注册确认 / 密码重置邮件模板
3. （可选）`Authentication → URL Configuration` 设置 Site URL 与 Redirect URLs

## 环境变量清单

| 变量名 | 说明 | 必填 | 示例 |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | 是 | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | 是 | `eyJxxx` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key（仅服务端） | 是 | `eyJxxx` |
| `ZHIPU_API_KEY` | 智谱 AI API Key | 是 | `177d6c670cdd4c218625d528067aa323.iMFLcCh1VBW53eMh` |
| `ZHIPU_API_URL` | 智谱 API 地址 | 否 | `https://open.bigmodel.cn/api/paas/v4` |
| `NEXT_PUBLIC_APP_URL` | 应用 URL | 否 | `http://localhost:3000` |

> ⚠️ `SUPABASE_SERVICE_ROLE_KEY` 仅可在服务端使用（Server Components / Route Handlers），切勿加 `NEXT_PUBLIC_` 前缀。

## Vercel 部署步骤

1. **推送代码到 GitHub**：将本项目推送到 GitHub 仓库
2. **导入项目**：访问 [https://vercel.com/new](https://vercel.com/new)，选择对应仓库
3. **配置 Root Directory**：在 Vercel 项目设置中将 Root Directory 设为 `web`
4. **配置环境变量**：在 `Settings → Environment Variables` 中填入上表中的所有「必填」变量（`NEXT_PUBLIC_APP_URL` 改为生产域名）
5. **点击 Deploy**：Vercel 会自动识别 Next.js 项目并执行 `pnpm install` + `pnpm build`
6. **访问域名**：部署完成后访问 Vercel 分配的域名（可绑定自定义域名）

> 项目根目录的 `vercel.json` 已配置：
> - 部署区域 `hkg1`（香港）适配中国用户
> - 构建命令 `pnpm build`
> - 安装命令 `pnpm install`

## 测试账户

种子数据中预置了两个测试账户：

| 邮箱 | 默认密码 |
|---|---|
| `test1@zhiyin.com` | 需在 Supabase Studio → Authentication → Users 中重置 |
| `test2@zhiyin.com` | 需在 Supabase Studio → Authentication → Users 中重置 |

> 由于 Supabase 种子脚本不会以明文形式存储密码，请在 Supabase Studio 手动为测试账户重置密码后再登录。

## 常用命令

| 命令 | 作用 |
|---|---|
| `pnpm dev` | 启动开发服务器（热更新） |
| `pnpm build` | 生产构建 |
| `pnpm start` | 启动生产服务器（需先 `pnpm build`） |
| `pnpm lint` | ESLint 代码检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm format` | Prettier 代码格式化 |

## 目录结构

```
web/
├── public/                 # 静态资源
├── src/
│   ├── app/                # Next.js App Router 路由
│   │   ├── api/ai/         # AI Route Handlers（智谱 GLM）
│   │   ├── prediction/     # AI 纸价预测
│   │   ├── orders/         # 订单大厅
│   │   ├── purchase/       # 集采商城
│   │   ├── startup/        # 创业孵化
│   │   ├── messages/       # 消息中心
│   │   ├── mine/           # 个人中心
│   │   ├── login/          # 登录
│   │   ├── register/       # 注册
│   │   ├── ai-chat/        # AI 对话助手
│   │   └── ...
│   ├── components/         # React 组件（按业务域分组）
│   ├── lib/                # 工具库（supabase / ai / auth）
│   ├── store/              # Zustand 状态
│   ├── types/              # TypeScript 类型
│   └── middleware.ts       # Next.js 中间件（路由守卫）
├── supabase/               # Supabase 配置与迁移
│   ├── migrations/         # 数据库迁移 SQL
│   └── seed.sql            # 种子数据
├── docs/                   # 项目文档
│   ├── feature-mapping.md  # 小程序 → Web 功能对照表
│   └── test-report.md      # 自测报告
├── .env.local.example      # 环境变量模板
├── next.config.ts          # Next.js 配置
├── tailwind.config.ts      # Tailwind 配置
├── tsconfig.json           # TypeScript 配置
└── vercel.json             # Vercel 部署配置
```

## 相关文档

- [功能对照表](docs/feature-mapping.md)：小程序页面 → Web 端路由映射
- [自测报告](docs/test-report.md)：静态检查与功能测试结果

## License

私有项目，版权所有 © 智印联创团队。
