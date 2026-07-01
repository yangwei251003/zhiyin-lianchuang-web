# 智印联创 Web 端 · 视觉规范与开发规则

> **每次开发前必读本文件！** 本文件是项目视觉规范、设计系统和开发规则的唯一权威来源。

---

## 📌 一、项目概览

| 字段 | 值 |
|------|-----|
| 项目名 | 智印联创 Web 端 |
| 定位 | 印刷行业 AI 智能撮合 + 纸价预测平台 |
| 技术栈 | Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Supabase · 智谱AI (GLM-4.7-Flash) |
| 部署平台 | Vercel |
| 数据库 | Supabase (PostgreSQL · 13 张业务表) |
| 状态管理 | Zustand (auth-store / ui-store) |
| 动画库 | Framer Motion |
| 字体 | Inter (拉丁) + Noto Sans SC (中文) |

---

## 🎨 二、视觉资源生成铁律（必须执行）

项目拥有 generate_image 多模态图像生成能力。**开发前端页面时，严禁使用 emoji、灰色占位图、placeholder 链接**敷衍视觉，必须按以下规则主动生图。

### 2.1 触发条件（满足任一即必须生图）

- 需要 logo / favicon / 品牌标识
- 需要 Hero 主视觉、Banner、卡片封面
- 需要功能图标（替代 lucide / heroicons 等通用图标库的特色图标）
- 需要空状态插图、引导页插图、404 页插图
- 需要 3D 插画、IP 形象、角色立绘
- 需要营销页背景、渐变抽象图、纹理
- 集采商城商品图片（必须真实商品感，不得用纯色占位）

### 2.2 生图前必做

1. 先确认项目主色板（蓝 #2A6CDB，绿 #2BAE6E，橙 #F08035）、字体风格
2. 确认设计语言：现代商业感 + 轻玻璃拟物 + 渐变 + 简洁留白
3. 一次批量生成该页面所需的所有图（避免来回切工具）
4. Prompt 模板：[主体内容], [场景/背景], commercial photography style, clean background, [主色调], professional, high quality

### 2.3 质量要求

- 风格统一（同一页面内主色、笔触一致）
- 留白充足，不堆元素
- 商业可发布级，不接受 AI 痕迹明显的"塑料感"
- 生成后必须做视觉自检：尺寸、构图、清晰度、风格一致性
- 任何与产品定位不符的图必须重生成
- **生成不了图片时**：去 Unsplash / Pexels 等免费图库抓取对应内容图片，确保图文匹配

### 2.4 工具调用策略

`
优先：generate_image 工具（项目已配置）
备用：从 Unsplash/Pexels/Pixabay 抓取免费图片（需图文匹配）
禁止：使用任何占位符、纯色块、emoji 代替真实图片
`

---

## 🖌️ 三、设计系统（Design Tokens）

### 3.1 品牌主色

`
品牌蓝（经济价值）  #2A6CDB  → primary
品牌绿（环境价值）  #2BAE6E  → environment / success
品牌橙（社会价值）  #F08035  → society / accent
`

### 3.2 完整色板（对应 tailwind.config.ts）

| Token | 色值 | 用途 |
|-------|------|------|
| primary.DEFAULT | #2A6CDB | 主要按钮、链接、高亮 |
| primary.light | #4A85E6 | 悬停状态 |
| primary.bg | #E8F1FB | 浅蓝背景块 |
| environment.DEFAULT | #2BAE6E | 绿色成功、环境相关 |
| society.DEFAULT | #F08035 | 橙色社会价值、警示 |
| danger.DEFAULT | #E55541 | 错误、删除、危险操作 |
| warning.DEFAULT | #F0A040 | 警告提示 |
| ink.primary | #1E293B | 主要文字 |
| ink.secondary | #64748B | 次要文字 |
| ink.tertiary | #94A3B8 | 辅助文字、占位 |
| canvas.DEFAULT | #F1F5F9 | 页面背景 |
| line.DEFAULT | #E2E8F0 | 分割线、边框 |

### 3.3 渐变规范

`css
/* 主渐变（Hero / 按钮） */
linear-gradient(135deg, #2A6CDB 0%, #4A85E6 100%)

/* 创业孵化 Hero */
linear-gradient(135deg, #F08035 0%, #E26B2C 45%, #7C3AED 100%)

/* 预测页 Hero */
linear-gradient(135deg, #2A6CDB 0%, #5B5CD9 55%, #8B5CF6 100%)

/* 集采商城 Hero */
linear-gradient(135deg, #2A6CDB 0%, #4A85E6 60%, #5B8FE8 100%)

/* 页面背景（全局 body） */
linear-gradient(180deg, #E8F1FB 0%, #F0F6FD 30%, #F5F9FE 60%, #F1F5F9 100%)
`

### 3.4 字体规范

`
主字体：Inter（拉丁）+ Noto Sans SC（中文）
备用字体：-apple-system, SF Pro Text, PingFang SC, Microsoft YaHei
字号基准：base = 14px | sm = 13px | lg = 16px | xl = 18px
`

### 3.5 间距 & 圆角

`
圆角规范：xs=3px, sm=5px, md=8px, lg=12px, xl=16px
卡片圆角：rounded-xl (16px)
按钮圆角：rounded-lg (12px)
`

### 3.6 阴影规范

`
sm: 0 1px 4px rgba(15,41,92,0.06)  — 基础卡片
md: 0 2px 8px rgba(15,41,92,0.08)  — 悬浮/Hover
lg: 0 4px 16px rgba(15,41,92,0.10) — 弹出层
蓝色: 0 4px 12px rgba(42,108,219,0.20) — 主色按钮
`

---

## 🏗️ 四、组件规范

### 4.1 统一组件库 src/components/ui/

| 组件 | 文件 | 用途 |
|------|------|------|
| Button | Button.tsx | 主/次/幽灵/危险四种变体 |
| Input | Input.tsx | 含 label、图标、错误提示 |
| Modal | Modal.tsx | 通用弹窗 |
| Toast | Toast.tsx | 全局提示（成功/错误/警告） |
| Pagination | Pagination.tsx | 分页器 |
| Tabs | Tabs.tsx | 标签页切换 |
| Select | Select.tsx | 下拉选择 |
| Badge | Badge.tsx | 状态徽标 |
| EmptyState | EmptyState.tsx | 空状态 |
| Spinner | Spinner.tsx | 加载动画 |
| Skeleton | Skeleton.tsx | 骨架屏 |

### 4.2 卡片设计原则

`
背景：bg-white
边框：border border-line
圆角：rounded-xl
阴影：shadow-sm → hover:shadow-lg
悬浮：hover:-translate-y-1
过渡：transition-all duration-base ease-out-expo
顶部色条（主题标识）：h-1.5 w-full bg-{theme}
`

### 4.3 Hero 区设计原则

`
最低高度：min-h-[70vh] (首页) 或 py-12 sm:py-16 (内页)
背景：主题渐变 + 装饰圆（radial-gradient 白色光晕）
文字：text-white / text-white/80 / text-white/70
CTA：白色实心按钮 + 半透明边框按钮组合
`

---

## 📐 五、页面结构规范

### 5.1 路由结构

`
/                       首页
/orders                 订单大厅
/orders/publish         发布订单（需认证）
/orders/publish-capacity 发布产能（需认证）
/orders/[id]            订单详情
/orders/capacities      产能大厅
/purchase               集采商城
/purchase/[id]          集采活动详情
/purchase/mine          我的集采（需登录）
/purchase/history       历史集采
/startup                创业孵化
/startup/articles       创业文章
/startup/mentors        创业导师
/startup/cases          创业案例
/startup/calculator     投资计算器
/prediction/[paperType] AI 纸价预测（铜版纸/双胶纸/白卡纸/哑粉铜版纸/轻涂纸/新闻纸）
/ai-chat                AI 智能助手（需登录）
/messages               消息中心（需登录）
/mine                   我的中心（需登录）
/mine/profile           编辑资料
/mine/auth              企业认证
/mine/orders            我的订单
/mine/bids              我的报价
/login                  登录
/register               注册
/forgot-password        忘记密码
`

### 5.2 布局规范

`
全局：Header + main + Footer + BottomNav（移动端）
main: flex-1 pb-14 md:pb-0 (为移动底栏预留空间)
容器：Container (max-w-7xl / max-w-5xl / max-w-3xl 三种尺寸)
响应式断点：sm=640px, md=768px, lg=1024px, xl=1280px
`

---

## 🔐 六、数据库规范

### 6.1 13 张业务表

`
profiles          - 用户档案
companies         - 企业认证
orders            - 印刷订单
bids              - 报价记录
capacities        - 产能发布
purchases         - 集采活动
purchase_orders   - 集采订单
messages          - 站内消息
articles          - 创业文章
cases             - 创业案例
mentors           - 创业导师
mentor_bookings   - 导师预约
price_predictions - AI 纸价预测
`

### 6.2 Supabase 客户端使用规范

`	ypescript
// 服务端（Server Component / API Route）
import { createClient } from '@/lib/supabase/server'
const supabase = await createClient()

// 客户端（Client Component）
import { createClient } from '@/lib/supabase/client'
const supabase = createClient()
`

### 6.3 认证权限说明

`
protectedPaths（需登录）: /orders/publish, /mine, /messages, /purchase/mine, /ai-chat
verifiedPaths（需企业认证）: /orders/publish, /orders/publish-capacity
`

---

## 🤖 七、AI 接口规范

### 7.1 接入的 AI 服务

`
服务商：智谱 AI
模型：GLM-4.7-Flash
API URL: https://open.bigmodel.cn/api/paas/v4
API Key: ZHIPU_API_KEY（环境变量）
`

### 7.2 AI API 路由清单

`
/api/ai/chat           - AI 对话（智印大脑）
/api/ai/price_analysis - 纸价 AI 分析
/api/ai/purchase_advice - 集采 AI 建议
/api/ai/article_summary - 文章 AI 摘要
`

---

## ⚠️ 八、已知 Bug 与待修复问题清单

> 开发前先看此清单，确认修复方向。【高→中→低 优先级排序】

### 【高优先级 - Bug】

1. **登录注册无法使用**：Supabase URL 和 ANON_KEY 为空，需填入真实环境变量
2. **技术培训/创业孵化入口冲突**：首页「技术培训」（href: /startup/articles）与「创业孵化」（href: /startup）功能重叠，用户体验混乱，需独立拆分

### 【中优先级 - 功能缺失】

3. **用户数据持久化**：交易信息、报价、消息需真实存入 Supabase，登录后有存档
4. **集采商城商品图片**：product_image 字段大量为 null，需生成真实商品图
5. **AI 预测数据**：price_predictions 表可能无数据，需填充种子数据
6. **视频内容缺失**：网站缺乏视频展示区块

### 【低优先级 - UI 优化】

7. **整体 UI 精细化提升**：部分页面视觉元素需按本规范提升
8. **平台集采数据**：需添加真实或演示用集采数据
9. **技术培训独立页**：需创建独立的 /training 页面

---

## 🚀 九、开发工作流规范

### 9.1 开发前检查清单

`
□ 阅读本文件（VISUAL_SPEC.md）
□ 阅读全局规则（~/.gemini/config/AGENTS.md）
□ 确认 .env.local 环境变量是否需要更新
□ 确认改动是否涉及数据库 schema（需更新 supabase/migrations/）
□ 确认改动是否影响 TypeScript 类型（需更新 src/types/database.ts）
□ 确认图片资源是否完备（禁用占位符）
`

### 9.2 图片资源处理原则

`
1. 优先用 generate_image 工具生成（商业级品质）
2. 生成失败时从 Unsplash/Pexels 抓取（图文匹配）
3. 图片存放路径：public/ 目录或 Supabase Storage
4. 禁止使用任何占位符（灰色方块、emoji、placeholder URL）
`

### 9.3 组件开发规范

`	ypescript
// ✅ 正确：使用设计系统 Token
className="rounded-xl border border-line bg-white shadow-sm"

// ❌ 错误：使用硬编码颜色
className="rounded-[16px] border border-gray-200 bg-white shadow"

// ✅ 正确：使用 cn() 工具合并类名
import { cn } from '@/lib/utils'
className={cn('base-class', conditional && 'conditional-class')}
`

---

## 🌐 十、SEO 规范

每个页面必须包含：

`	ypescript
export const metadata: Metadata = {
  title: '[页面名称] · 智印联创',
  description: '[80-160字的页面描述]',
}
`

- 标题层级：每页只有一个 h1，其余用 h2 / h3
- 语义化 HTML：使用 main / section / nav / article / footer 等语义标签

---

## 📋 十一、变更日志

| 日期 | 版本 | 内容 |
|------|------|------|
| 2026-07-01 | v1.0 | 初版视觉规范创建，完整梳理项目结构、设计系统、Bug 清单 |

---

> **记住**：每次开发前先看本文件，每次开发后更新变更日志。
> 视觉质量代表产品质量，不接受"先做出来再说"的心态。
