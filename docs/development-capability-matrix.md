# 智印联创开发能力矩阵

| 任务 | 优先 Skill / 插件 | 触发条件 | 交付物 | 禁用与检查 |
|---|---|---|---|---|
| 总体任务编排 | `skill-orchestration-brain` | 跨前端、数据库、采集或发布 | 阶段顺序与数据流 | 不为简单任务堆叠无关技能 |
| 文档依据 | `documents` | 读取商业计划书、问诊清单 | 可追溯需求与限定条件 | 不凭摘要替代原文 |
| 前端页面 | `frontend-dev`、`design-taste-frontend` | 首页、营销页、核心业务页 | 响应式页面与完整状态 | 禁止霓虹 AI 模板、假数据、占位媒体 |
| React 动效 | `web-animation-design` | 滚动叙事、角色切换、布局状态 | 动效规范与 reduced-motion 回退 | 只动画 transform/opacity；禁用无意义循环 |
| Next.js | `vercel:nextjs` | 路由、Server Component、API、缓存 | App Router 实现 | 客户端边界最小化；服务端重验权限 |
| Supabase | `supabase:supabase` | 迁移、RLS、认证、Storage | 可回滚迁移与权限测试 | 不依赖中间件作为唯一安全边界 |
| Postgres 审核 | `supabase:supabase-postgres-best-practices` | 新表、索引、策略、查询 | 索引与 RLS 审核 | 禁止匿名写入敏感表 |
| 联网与采集 | `web-access` | 搜索、抓取、许可核验 | 来源记录与待审内容 | 不绕过登录、付费墙或反爬限制 |
| 浏览器验证 | `playwright` | 交互、响应式、无障碍流程 | 截图、快照与流程证据 | 先 snapshot，再交互；不污染真实数据 |
| 发布前验证 | `vercel:verification` | 阶段交付与生产部署前 | 完整验证报告 | 不以单一 build 代替全故事验证 |

## 当前项目选择

- 视觉：工业编辑式，白/浅灰工作区、结构蓝、印刷橙、少量已核验绿色。
- 动效：Motion for React；进入/退出用 ease-out，已在屏幕上的位移用 ease-in-out，产品交互不超过 300ms。
- 媒体：项目现有授权素材优先，外部素材必须许可证清晰并保存到本地。
- 数据：真实业务、评审演示、采集待审三类数据严格隔离。
