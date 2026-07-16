# Design QA — 智印大脑工作台

**Comparison target**

- Source visual truth: `C:\Users\yangwei\.codex\generated_images\019f627a-bd0e-7771-9311-2afa32328658\exec-00667b66-8bf5-4eb6-8bdf-cd955d125c21.png`
- Implementation: `http://localhost:3001/brain`（Chrome 浏览器渲染捕获）
- Viewport/state: 桌面工作台、访客状态、协同总览；实现捕获为 1536 × 730，参考稿按相同宽度归一后并排比较。
- Primary interactions checked: 三角色切换、场景切换、输入后生成待确认草稿、减少动态偏好下媒体暂停。
- Console errors checked: 应用没有可归因的错误；浏览器扩展注入内容不计入应用结果。

**Full-view comparison evidence**

已将参考稿与实现截图合成为同一张并排图像后检查。两者均以印刷设备实拍作为深色首屏背景，首屏下方放置三角色协同带，并以海军蓝工作区和印刷橙完成“角色选择 → 证据边界 → 待确认草稿”的阅读顺序。实现保留全站统一导航，因此首屏垂直空间略少于单页概念稿；这是全站信息架构的有意约束，而非裁切或层级缺失。

**Focused region comparison evidence**

重点检查了角色协同带与下方工作台。实现的需求方、印刷厂、原料供应商选择态均有明确橙色/深蓝对比，工作台按历史、可核验证据、对话与草稿分栏，且草稿的确认按钮明确标注“前往真实表单”，没有将演示或模型输出伪装为真实业务记录。需要聚焦检查，因为这些区域承载方案的核心交互与信息密度。

**Findings**

- 无 P0、P1 或 P2 差异。
- [P3] 全局导航占据了概念稿没有的首屏高度。
  - Location: `/brain` 顶部导航。
  - Evidence: 概念稿为聚焦式单页工作台；实现必须与其他页面共享全站导航。
  - Impact: 降低少量首屏工作台露出面积，但换取一致的跨页面导航和可返回业务入口。
  - Follow-up: 后续若把 `/brain` 作为独立展示模式，可增加无导航的专注演示入口；不影响当前交付。

**Required fidelity surfaces**

- Fonts and typography: 使用项目统一无衬线字体与紧凑标签层级；标题、角色和证据标签的字重清晰，桌面捕获未见截断。
- Spacing and layout rhythm: 首屏、角色带、上下文标签和三列工作台的间距形成连续阅读节奏；边框与低圆角符合工业编辑式基线。
- Colors and visual tokens: 结构海军蓝承担背景与可信信息，唯一操作强调色为印刷橙；文本与背景对比清晰，未引入霓虹渐变。
- Image quality and asset fidelity: 使用已有授权范围内的印刷现场图和设备视频；画面主体、暗色遮罩和裁切均服务于工作台阅读，不用 CSS/占位图替代媒体。
- Copy and content: 文案明确区分“证据边界”“待确认草稿”“前往真实表单”；没有宣称实时价格、未来价格或不存在的业务结果。
- Icons, states and accessibility: 复用项目图标系统；角色、场景和草稿状态可见；媒体在减少动态偏好下停止自动播放，关键控件采用语义按钮和可见焦点。
- Responsiveness: 将在全站 390px、768px、1440px 浏览器回归中复核；本设计比较没有发现阻断性的桌面布局问题。

**Comparison history**

- Iteration 1: 参考稿与本地实现以同宽并排方式比较。未发现需要修正的 P0/P1/P2 差异，因此没有视觉返工迭代。

**Implementation checklist**

1. 保持 `/brain` 使用已登记的本地媒体，不直接热链外部资源。
2. 在发布前完成全站响应式、交互、类型、Lint、测试和生产构建回归。

final result: passed
