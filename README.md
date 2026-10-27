# 智印联创 · 印刷产业协同 Web 项目

**把印刷需求、生产能力和来源清晰的行业信息放在同一条协作路径上。** 项目包含供需发布、产能与报价、企业资料、纸价信息、AI 助手及创业学习等页面和服务接口。

[在线项目导览](https://yangwei251003.github.io/zhiyin-lianchuang-web/) · [自有源码 MIT](LICENSE) · [第三方与媒体范围](THIRD_PARTY_NOTICES.md)

![本机真实运行的公开首页](docs/site/assets/product.png)

## 当前状态与边界

项目开发中。GitHub Pages 只发布静态项目导览、真实画面和运行步骤；订单、认证、模型、数据库与权限服务需要自行部署 Node/Supabase，不由 Pages 提供。不会把可浏览的业务样例当作真实成交或预测能力。

市场数据接入以授权和来源为前提；源码内标明部分纸价来源仍待授权，不伪造最新报价或投资建议。真实订单、公司证照、账号与财产数据不随仓库分发。

**尚未验收的真实业务限制：** 企业执照上传当前实现使用 `company-licenses` 的公开 URL 方案。不要向该开发实现上传真实证照；完整上线前应改为私有对象存储、最小权限和短期签名访问，并在独立测试项目验证 RLS。本轮没有创建真实账号、提交证照或运行交易。

## 技术栈与结构

| 模块 | 实现 |
|---|---|
| 应用 | Next.js16 / React19 / TypeScript5 |
| UI | Tailwind CSS4、Framer Motion、Lucide、Recharts |
| 数据与身份 | Supabase Postgres/Auth/Storage、服务端权限守卫 |
| 状态/表单 | Zustand、React Hook Form、Zod |
| AI | 智谱兼容接口；密钥只在自己的服务端环境配置 |
| 测试 | Vitest、TypeScript、Next生产构建；另有 Playwright 测试入口 |

```text
src/app/          页面与服务端 API
src/components/   界面、认证、业务与 AI 组件
src/lib/          权限、输入校验、数据库与行业信息服务
src/store/        客户端状态
supabase/         迁移、开发种子与权限测试 SQL
docs/             来源、架构、设计、测试与部署记录
docs/site/        可独立发布的静态导览
public/           项目既有媒体（第三方范围见说明）
```

## 快速开始

本轮复现环境为 Node.js24 LTS、pnpm10.33.2。完整服务需要由你管理的 Supabase 测试项目和模型账号。

```bash
git clone https://github.com/yangwei251003/zhiyin-lianchuang-web.git
cd zhiyin-lianchuang-web
pnpm install --frozen-lockfile
```

复制 `.env.local.example` 为 `.env.local`：PowerShell 使用 `Copy-Item .env.local.example .env.local`；macOS/Linux 使用 `cp .env.local.example .env.local`。只填自己的设置，勿提交该文件。

- 数据库：配置 `NEXT_PUBLIC_SUPABASE_URL`、`NEXT_PUBLIC_SUPABASE_ANON_KEY`、仅服务端的 `SUPABASE_SERVICE_ROLE_KEY`。按编号审阅并在隔离测试项目执行 `supabase/migrations/`，确认全部迁移和 RLS 策略。`seed.sql` 与迁移中的历史示例不是可登录的真实账号，也不提供默认密码。
- 模型：配置 `ZHIPU_API_KEY`，可按需设置 `ZHIPU_API_URL`；接口用量和权限由自己的服务账号承担。
- 评审/采集：如需受控评审或采集任务，自行设置模板中的访问码、会话签名密钥与任务密钥；不要使用模板占位符部署。
- 对象存储：头像与营业执照需分别设计公开/私有访问策略。证照现有实现的限制见上方，勿按旧文档创建公开证照桶。

```bash
pnpm dev
# http://localhost:3000

pnpm test
pnpm typecheck
pnpm build
```

未填 Supabase 时，公开介绍页面可以显示，登录页明确提示“未配置”；这不提供假账号、假数据或可用的后台服务。

## 部署与 Pages

Pages 工作流仅上传 `docs/site/`，无数据库或商业交易接口。完整源码可部署到支持 Next.js 的环境，仓库根目录就是应用根目录，导入时不要再填写不存在的 `web` 子目录。

项目配置 `output: standalone`。生产构建后，将 `public` 和 `.next/static` 同步到 standalone 输出对应路径，再运行 `.next/standalone/server.js`；或使用本轮新增的无凭证 `Dockerfile` 模板。公开前端 Supabase URL/anon key 在构建阶段提供；service role、模型等私钥只通过运行环境注入，不能写入镜像层。**容器模板本轮未实际构建验收**，不能以它代替本轮已完成的 Next 构建检查。

## 本轮检查与后续

2026-10-26：在独立副本正常安装依赖；更新到 Next16.4.3、Vitest4.1.12 等修补版本并固定安全的传递依赖；80 个现有测试、类型检查、Next生产构建（60个页面/路由条目）通过，最终依赖审计为0项。为无数据库配置时的公开首页/登录访问添加明确处理，避免直接抛出客户端凭证异常。

真实账号、数据库迁移/RLS、证照上传、模型回答、订单撮合、采集任务和生产容器没有在本轮连接验证。现有设计/测试档案中的历史结论仅作参考。后续优先完成私有证照存储、隔离测试数据库与端到端权限回归、媒体授权证据补全，再进行实际服务上线验收。

本地完整历史的提交作者显示为同一用户身份的两个名称，本轮按项目所有者授权为自有源码添加 MIT，并保留团队署名。学校/企业标识与设备媒体不因此变成 MIT 素材，复用前查阅第三方说明。
