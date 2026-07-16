# 智印大脑全站体验升级 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将智印大脑升级为安全、可解释、可确认的全站决策层，并以方案 3 统一智印联创全站视觉与交互。

**Architecture:** 新增私有大脑会话与草稿表，服务端在显式请求时组合最小场景上下文并调用既有模型；评审请求固定返回演示证据和草稿。前端以统一的决策带、证据条、草稿单和页面框架连接首页、业务页与评审页，既有业务 API 和 RLS 不变。

**Tech Stack:** Next.js 16 App Router、React 19、TypeScript、Supabase、Motion、Vitest、Playwright。

## Global Constraints

- 数据与演示严格隔离；任何智印大脑操作都不得直接写订单、报价、集采或运营统计。
- 价格页面仅展示核验行情和来源，智能建议只能解释已公开的来源边界，不能输出具体未来价格。
- 使用结构蓝与印刷橙；无紫色渐变、玻璃拟态、虚构指标或未授权媒体。
- 每项行为变更先写失败测试；完成前运行测试、类型检查、lint、生产构建和核心浏览器流程。

---

### Task 1: 建立智印大脑私有数据与安全服务

**Files:** `supabase/migrations/0013_brain_private_workspace.sql`、`src/lib/brain/*`、`src/app/api/brain/**`、对应 Vitest 测试。

- [ ] 写会话归属、场景净化、演示隔离、草稿确认的失败测试并确认失败。
- [ ] 创建会话、消息、草稿与用量记录，启用 RLS；仅本人或服务端可读写，评审态不持久化。
- [ ] 提供会话列表、会话消息、响应、草稿确认 API；服务端重新校验登录、角色和场景数据，模型调用只携带最小必要上下文。
- [ ] 跑新测试和完整单元测试。

### Task 2: 构建方案 3 的智印大脑工作区

**Files:** `src/app/brain/page.tsx`、`src/components/brain/*`、`src/app/ai-chat/page.tsx`、`src/lib/navigation.ts`、测试。

- [ ] 写“选场景后可产生待确认草稿”“评审固定响应不调用真实业务 API”“未登录不保存历史”的失败测试。
- [ ] 实现全宽生产媒体标题、三角色决策带、证据流、对话区与可编辑草稿单；使用有意义的状态动效和减少动态策略。
- [ ] 让 `/ai-chat` 重定向到 `/brain`，将智印大脑加入桌面导航、移动导航和首页入口。
- [ ] 完成工作区、键盘交互与移动端测试。

### Task 3: 将决策层接入真实业务与评审演示

**Files:** 订单、集采、纸价、产教、我的工作台、评审组件及其测试。

- [ ] 写每个场景上下文只读传递、草稿必须显式确认、评审不产生真实业务请求的失败测试。
- [ ] 在业务页加入紧凑的场景触发器和右侧/底部草稿面板；订单、报价、供货、集采、纸价、产教使用对应提示与字段，不补造数据。
- [ ] 在评审工作台加入确定性“证据—决策—草稿”演示层，三角色状态与原有校园宣传物料故事同步。
- [ ] 跑角色、RLS、草稿和评审回归测试。

### Task 4: 同步全站视觉与交互系统

**Files:** `globals.css`、布局组件、首页、公开业务页、详情/表单/认证/账户页面、全站共用 UI。

- [ ] 写导航包含智印大脑、主要页面均有统一标题/状态样式、减少动态停用自动视频的失败测试。
- [ ] 添加全局工作台令牌与可复用 `PageLead`、`DecisionRibbon`、`EvidenceStrip`、`ContextLauncher`；用它们统一页面标题、筛选、空状态、表单、消息和移动端底栏。
- [ ] 首页重排为生产媒体、三角色、决策层、协同闭环、事实证据、三项业务能力、产教和信任；其余页面不改变真实数据查询与授权逻辑。
- [ ] 收敛旧紫色 AI 样式、过大圆角、嵌套卡片和无信息动效；保留可访问焦点、语义和颜色对比。
- [ ] 检查 390px、768px、1440px 下无横向溢出与遮挡。

### Task 5: 合规素材、质量验证与上线

**Files:** `public/images/external/*`、`docs/media-sources.md`、Playwright 与设计 QA 报告。

- [ ] 在白名单许可来源中挑选与印刷生产直接相关的实拍图片/视频，记录原始链接、作者、许可、下载时间和使用页面；缺少明确许可即不用。
- [ ] 使用响应式图片、压缩视频与封面；低性能或减少动态状态仅显示静态封面。
- [ ] 用浏览器比较方案 3 参考图与桌面工作区实现，修复所有 P0/P1/P2 差异并形成 `design-qa.md`。
- [ ] 运行单元测试、RLS 测试、类型检查、lint、生产构建与 Playwright；仅在全部通过后提交、推送 GitHub、部署受控预览并升级生产环境。
