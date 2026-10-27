# Industrial Editorial Visual Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将智印联创的关键公开页面统一为克制、可信、移动端可用的印刷产业工作台视觉，并保留现有真实数据和业务流程。

**Architecture:** 在 `globals.css` 中补充可复用的工业编辑式视觉令牌和辅助类；页面继续使用 Tailwind v4 CSS 变量和现有 `Container`/`Button` 原语。首页承担品牌与服务导航，订单、集采、纸价与反馈遵循同一“标题区 + 工具区 + 内容区”的页面节奏，不改变 Supabase 查询、认证或 API 合约。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、Tailwind CSS v4、lucide-react、Supabase、Playwright CLI。

---

### Task 1: 建立全局编辑式视觉令牌

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/ui/Button.tsx`
- Test: 浏览器中的按钮悬停、键盘聚焦和禁用状态

- [ ] **Step 1: 在 `:root` 增加中性白底、结构蓝、操作橙和边框灰令牌**

```css
:root {
  --surface-page: #ffffff;
  --surface-work: #f6f7f8;
  --ink-strong: #172033;
  --ink-body: #425066;
  --line-subtle: #d9dee6;
  --brand-structure: #173b63;
  --brand-action: #d97706;
}
```

- [ ] **Step 2: 添加 `print-rule`、`print-index`、`workbench-panel` 三个低装饰性辅助类**

```css
.print-rule { border-top: 2px solid var(--brand-structure); }
.print-index { color: var(--brand-structure); font-variant-numeric: tabular-nums; }
.workbench-panel { border: 1px solid var(--line-subtle); background: var(--surface-page); }
```

- [ ] **Step 3: 收敛 `Button` 的圆角、位移和阴影**

将各 `variantStyles` 的 `hover:-translate-y-0.5`、渐变和彩色阴影替换为边框或背景色变化；将 `md`、`lg`、`icon` 圆角改为 `rounded-sm`。

- [ ] **Step 4: 执行类型和规范检查**

Run: `pnpm exec tsc --noEmit && pnpm run lint`

Expected: TypeScript 无错误；lint 不新增错误。

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/ui/Button.tsx
git commit -m "style: add editorial industrial design tokens"
```

### Task 2: 重构全局导航与公共页面框架

**Files:**
- Modify: `src/components/layout/Header.tsx`
- Modify: `src/components/layout/Footer.tsx`
- Modify: `src/components/layout/Container.tsx`
- Test: `/`、`/orders` 的 1440px 和 390px 截图

- [ ] **Step 1: 为 Header 建立清晰的单行导航层级**

保留 Logo、7 个现有导航入口和登录/入驻行为；桌面端仅以细线和文字权重表示当前页，移动端保留抽屉按钮，不添加额外营销按钮或徽章。

- [ ] **Step 2: 将 Footer 收敛为规则信息列**

保留现有服务链接、隐私/协议链接和真实的测试预览提示；去除装饰性图标容器和不必要圆角，不新增备案号、联系地址或服务承诺。

- [ ] **Step 3: 固化内容容器与移动端内边距**

保持 `Container` 现有尺寸 API，在 `px-4 sm:px-6 lg:px-8` 基础上确保标题区和工具区对齐。

- [ ] **Step 4: 使用 Playwright 捕获双视口页面**

Run: `npx --yes --package @playwright/cli playwright-cli -s=visual-shell open http://localhost:3001/orders --mobile`

Expected: 390px 下只显示 Logo 和“打开菜单”按钮；无横向滚动或重叠。

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Footer.tsx src/components/layout/Container.tsx
git commit -m "style: refine shared navigation shell"
```

### Task 3: 改造首页为服务索引而非营销卡片墙

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/HeroBackground.tsx`（如仍被使用，移除未来感主视觉用途）
- Test: `/` 桌面/移动截图与键盘焦点检查

- [ ] **Step 1: 重组首屏为品牌主张与服务索引**

保留 `PUBLIC_PLATFORM_PROFILE`、`PUBLIC_PARTNERS` 和现有链接；使用 `print-rule`、连续编号和细分隔线，禁止增长数据、预测结论、伪控制面板和大面积渐变。

- [ ] **Step 2: 用不等宽内容区替代重复卡片网格**

角色入口、核心服务、产业链、数据状态和合作流程使用编辑式分段与列表；保留所有当前 `href`，不删除服务入口。

- [ ] **Step 3: 移除或停止引用人工智能感的首页背景组件**

页面不再将 `hero_bg.jpg`、霓虹波纹或未来感机器插画作为首屏主体；无授权生产现场素材时以 Logo、文字与代码原生印刷标记表现品牌。

- [ ] **Step 4: 浏览器视觉核验**

Run: `npx --yes --package @playwright/cli playwright-cli -s=visual-home open http://localhost:3001 --mobile`

Expected: 首屏主操作可见，下一节内容在桌面和移动端首屏底部露出，文本无截断。

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/components/home/HeroBackground.tsx
git commit -m "style: redesign home as service index"
```

### Task 4: 统一订单与集采工作台

**Files:**
- Modify: `src/app/orders/page.tsx`
- Modify: `src/app/purchase/page.tsx`
- Modify: `src/components/order/OrderList.tsx`
- Modify: `src/components/order/OrderCard.tsx`
- Modify: `src/components/purchase/PurchaseList.tsx`
- Modify: `src/components/purchase/PurchaseCard.tsx`
- Test: `/orders`、`/purchase` 空状态和筛选条

- [ ] **Step 1: 对齐两个页面的标题、操作和说明区**

标题使用连续编号与简洁面包屑；主要操作使用橙色，辅助操作使用线框。采购声明保留为左侧结构线说明，不使用彩色提示卡。

- [ ] **Step 2: 将筛选与计数收敛为工作台工具条**

`OrderList` 和 `PurchaseList` 保持现有 URL 查询参数及请求行为，调整为统一的标签、输入、选择框和计数位置。

- [ ] **Step 3: 调整列表卡片和空状态**

数据存在时突出标题、规格/地区/时间和实际状态；数据为空时仅给出下一步链接，不生成示例订单、价格、人数或节省额。

- [ ] **Step 4: 使用 Playwright 检查两个空状态**

Run: `npx --yes --package @playwright/cli playwright-cli -s=visual-market open http://localhost:3001/orders --mobile`

Expected: “暂未收录公开需求”完整可见；切换到 `/purchase` 后“暂未收录公开采购信息”完整可见。

- [ ] **Step 5: Commit**

```bash
git add src/app/orders/page.tsx src/app/purchase/page.tsx src/components/order src/components/purchase
git commit -m "style: unify supply and procurement workbenches"
```

### Task 5: 强化纸价与反馈页面的可信交互

**Files:**
- Modify: `src/app/prediction/[paperType]/page.tsx`
- Modify: `src/components/prediction/PaperTypeTabs.tsx`
- Modify: `src/app/feedback/page.tsx`
- Test: `/prediction/白卡纸`、`/feedback` 及未登录反馈 API

- [ ] **Step 1: 将纸价报价区改为可扫描的信息单据**

按“价格、单位、规格、区域、来源、时间、原始链接”顺序重排；保留 `latestIsFresh` 判断、Supabase 查询和数据不足逻辑，不将价格放大为营销数字。

- [ ] **Step 2: 将纸种切换改为紧凑的横向可滚动标签**

保留 URL 路由和选中态，移动端允许横向滚动而不缩小文字或换成两行。

- [ ] **Step 3: 将反馈表单改为有明确选中态的输入工作区**

保留分类、模块、评分、文本、联系方式、成功状态和 `/api/feedback` 请求；去除过大圆角和卡片套卡片，保证错误、禁用和保存状态清晰。

- [ ] **Step 4: 验证数据和认证边界**

Run: `curl.exe -i -X POST http://localhost:3001/api/feedback -H "Content-Type: application/json" -d "{\"category\":\"建议\",\"content\":\"测试\"}"`

Expected: 未登录返回 `401`；纸价页显示现有已验证数据的来源与规格，不显示预测值。

- [ ] **Step 5: Commit**

```bash
git add src/app/prediction src/components/prediction/PaperTypeTabs.tsx src/app/feedback/page.tsx
git commit -m "style: improve trusted data and feedback flows"
```

### Task 6: 全量验证与发布

**Files:**
- Modify: `docs/superpowers/specs/2026-07-12-industrial-editorial-visual-design.md`（仅在验收规则确有变化时）
- Test: 生产构建、核心桌面/移动截图、GitHub、Vercel

- [ ] **Step 1: 执行质量检查**

Run: `pnpm exec tsc --noEmit && pnpm run lint && pnpm run build -- --webpack`

Expected: 无 TypeScript 或 build 错误；仅保留记录在交付说明中的既有 lint 警告。

- [ ] **Step 2: 捕获并审查核心页面截图**

对 `/`、`/orders`、`/purchase`、`/prediction/白卡纸` 和 `/feedback` 分别以桌面与 390px 视口检查。每张图核对无渐变主视觉、无横向溢出、无文字遮挡、无假数据。

- [ ] **Step 3: 仅暂存与本次项目交付相关的源文件**

明确排除 `.workbuddy/`、`scf_bootstrap`、`home-desktop.png`、`home-mobile.png` 及未知来源的 Docker 文件；暂存 `src/`、`supabase/`、必要配置、锁文件和 `docs/` 中经本任务验证的更改。

- [ ] **Step 4: 提交并推送 GitHub**

```bash
git add src supabase package.json pnpm-lock.yaml next.config.ts eslint.config.mjs tailwind.config.ts docs
git commit -m "feat: complete compliant platform redesign"
git push origin master
```

- [ ] **Step 5: 部署 Vercel 生产环境并检查运行结果**

Run: `vercel --prod --yes`

Expected: 返回生产 URL；访问页面并确认反馈 API、纸价数据与静态页面正常加载。
