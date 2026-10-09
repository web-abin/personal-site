export type Project = {
  cover: string;
  gallery?: string[];
  techStack: string[];
  experienceUrl?: string;
  experienceText?: string;
  articleUrl?: string;
  content: string;
  slug: string;
  number: string;
  title: string;
  english: string;
  category: string;
  year: string;
  status: string;
  description: string;
  tags: string[];
  metrics: { value: string; label: string }[];
  highlights?: { title: string; description: string }[];
  theme: string;
  sample: boolean;
  role: string;
  challenge: string;
  approach: string;
  result: string;
};

const projectCatalog: Project[] = [
  {
    slug: 'kaixin-lianliankan', number: '01', title: '开心点连连看', english: 'Kaixin Link',
    category: '微信小游戏', year: '', status: '个人作品', cover: '/images/kaixin-lianliankan.jpg',
    gallery: [
      '/images/kxd/1.jpg',
      '/images/kxd/2.jpg',
      '/images/kxd/3.jpg',
      '/images/kxd/4.jpg',
      '/images/kxd/5.jpg',
      '/images/kxd/6.jpg',
      '/images/kxd/7.jpg',
      '/images/kxd/8.jpg',
      '/images/kxd/9.jpg',
    ],
    description: '以 SDD 和自进化 AI Coding 工作流独立完成的微信小游戏，融合好友对战、趣味道具与离线玩法。',
    experienceText: '微信搜索「开心点连连看」',
    tags: ['个人作品', 'AI Native', 'SDD', '微信小游戏'], techStack: ['PixiJS', 'TypeScript', 'Claude Code'],
    metrics: [
      { value: '5 个月', label: '上线时间' },
      { value: '4 万+', label: '累计用户' },
      { value: '40%', label: '活跃用户留存' },
      { value: '20%', label: '新增用户留存' },
    ], theme: 'clay', sample: false, role: '产品设计与开发', challenge: '', approach: '', result: '',
    content: `## 作品介绍

一款轻松有趣的微信小游戏。在经典连连看的基础上，用好友对战和攻击道具增加互动感，同时保留离线单人游玩能力。

## AI 原生开发方法

采用 **SDD（需求驱动开发）**：先把用户故事、交互状态和验收条件固化为 Spec，再让 AI 按最小变更实现，并用自动化门禁解决三类常见问题：

| 问题 | 解法 |
| --- | --- |
| **API 幻觉** | 以类型检查、构建和测试的确定性报错为证据；Hook 调用小模型完成归因，将不存在的 API、错误类型与正确替代写入本地规则库，由 \`CLAUDE.md\` 在每次编码前加载。**同一类幻觉只犯一次，越用越准。** |
| **连锁 Bug** | 根据 Git Diff 做依赖影响分析，定向执行关联测试，再用核心玩法 Smoke Test 和全量 Type Check 兜底，防止“修一处、坏一片”。 |
| **过度设计 / Happy Path** | 用“最小变更”约束抽象范围，并将空状态、断网、异常输入、性能与安全加入 Spec 验收矩阵，不让测试只覆盖理想路径。 |

## 核心亮点

- 好友对战，让休闲消除变成轻竞技互动
- 可向对手丢出趣味攻击道具
- 支持离线游玩，随时开始一局`,
  },
  {
    slug: 'clipzap', number: '02', title: 'ClipZap', english: 'AI Agentic Workflow',
    category: 'AI 内容生产平台', year: '', status: '商业项目', cover: '/images/gallery/clipzap.png',
    gallery: [
      '/images/clipzap/1.png',
      '/images/clipzap/2.png',
      '/images/clipzap/3.png',
      '/images/clipzap/4.png',
    ],
    experienceUrl: 'https://www.clipzap.ai/',
    description: '面向全球创作者与企业的多模态 AI 内容生产平台，通过可视化节点编排文本、图像、音频和视频工作流。',
    tags: ['Web 平台', 'AI Agent', '多模态内容'], techStack: ['Go', 'LangGraph', 'LLM', 'Next.js', 'React Flow', 'WebSocket'],
    metrics: [{ value: '41万+', label: '累计注册用户' }, { value: '3万+', label: '月注册用户' }], theme: 'lavender', sample: false,
    role: 'AI Workflow 执行体系、可视化编辑器与 Workflow Agent 核心开发', challenge: '', approach: '', result: '',
    content: `## 项目介绍

ClipZap 将模型调用、图像与视频生成、条件判断及数据处理统一抽象为可编排的 **Node / Skill Tool**，让复杂内容生产流程可复用、追踪与自动执行。

## 系统架构

系统将“辅助搭建”与“稳定执行”彻底分离：**Workflow Agent 只服务于创作阶段**，它理解自然语言目标，调用创建节点、编辑节点、连接边和配置参数等建图工具，降低专业工作流的搭建门槛；发布后则由确定性的 **Workflow Engine** 依照固化 DSL 执行，Agent 不进入运行链路，从而保证流程的可预期性、稳定性与可追踪性。

\`\`\`mermaid
flowchart TB
  subgraph UX["用户交互层"]
    Prompt["自然语言搭建<br/>描述目标 · 补充约束 · 迭代调整"]
    Editor["React Flow 可视化编辑器<br/>手动搭建 · Agent 生成结果可编辑"]
    Console["运行态控制台<br/>进度 · 日志 · 节点状态 · 异常"]
  end

  subgraph BUILD["创作期 · Workflow Agent 辅助建图"]
    Agent["LangGraph Builder Agent<br/>目标理解 → 步骤拆解 → 节点选型 → 结果自检"]
    Catalog["节点目录与 Schema<br/>能力描述 · 输入输出 · 配置约束"]
    BuildTools["建图工具集<br/>创建 / 编辑节点 · 连接边 · 配置参数"]
    Draft["共享 Workflow 草稿<br/>Agent 与画布操作同一份图模型"]
    Check{"Schema / DAG 校验<br/>类型匹配 · 必填参数 · 环路 · 可达性"}
    Publish["审阅与发布<br/>人工确认 · 版本固化"]
    DSL["已发布 Workflow DSL<br/>节点 · 边 · 数据映射 · 执行条件"]
  end

  subgraph RUN["运行期 · 确定性 Workflow Engine（Agent 不参与执行）"]
    Orchestrator["工作流编排器<br/>加载已发布版本 · 构建执行图"]
    Scheduler["依赖调度与条件路由<br/>按固化拓扑推进 · 上下文传递"]
    Runtime["Node Runtime<br/>统一输入输出 · 状态回写 · 异常边界"]
    Recovery["执行可靠性<br/>超时 · 重试 · 降级 · 断点恢复"]
  end

  subgraph CAP["执行能力层 · 由 Workflow 节点调用"]
    LLM["LLM / VLM<br/>文本理解与生成"]
    Media["多模态生成<br/>图像 · 音频 · 视频"]
    Tools["数据与业务工具<br/>API · 转换 · 条件处理"]
  end

  subgraph DATA["状态、资产与可观测性"]
    Definition[("Workflow 定义与版本")]
    State[("执行状态与上下文")]
    Artifact[("多模态产物与结果引用")]
    Trace[("Trace ID · 日志 · 节点耗时 · 错误链路")]
  end

  Prompt --> Agent
  Agent <-->|"查询可用节点"| Catalog
  Agent -->|"调用"| BuildTools --> Draft
  Editor <-->|"可视化编辑"| Draft
  Catalog --> Check
  Draft --> Check --> Publish --> DSL
  DSL <--> Definition
  DSL --> Orchestrator --> Scheduler --> Runtime
  Runtime --> LLM
  Runtime --> Media
  Runtime --> Tools
  Scheduler <--> State
  Runtime <--> Artifact
  Orchestrator --> Trace
  Runtime --> Trace
  Runtime -. "异常策略" .-> Recovery
  Recovery -. "恢复执行" .-> Scheduler
  Scheduler -- "WebSocket 事件流" --> Console
\`\`\`

## 核心工作

- 建设标准化 Node / Skill Tool 体系与工具 Schema
- 基于 React Flow 与 WebSocket 实现可视化编辑、状态同步和异常处理
- 设计 Workflow DSL，支持节点、边、映射、执行条件、持久化与版本管理
- 用 LangGraph 构建目标分析、节点检索、拓扑规划、建图工具调用与结果自检状态流
- 加入 Schema 校验、Human-in-the-loop 确认与 Trace ID 全链路追踪`,
  },
  {
    slug: 'enterprise-knowledge-agent', number: '03', title: '企业级知识库 Agent', english: 'Enterprise Knowledge Agent',
    category: 'AI Agent', year: '2026', status: '企业项目', cover: '/images/company-rag/architecture-cover.png',
    gallery: [
      '/images/company-rag/architecture-cover.png',
      '/images/company-rag/1.png',
    ],
    description: '面向生产架构的多租户企业知识问答系统，将身份、权限、可靠摄取、混合检索与可验证引用收敛为完整闭环。',
    tags: ['企业级', '多租户', 'RAG', 'AI Agent'],
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'OpenSearch', 'Redis Streams', 'MinIO', 'Keycloak', 'Docling'],
    metrics: [
      { value: '3', label: '独立扩缩容进程' },
      { value: '2 路', label: '混合检索召回' },
      { value: '2 层', label: '租户隔离防线' },
      { value: '1024 维', label: '向量索引契约' },
    ],
    highlights: [
      { title: '权限进入检索内核', description: 'JWT、租户成员、知识库 ACL 与 PostgreSQL RLS 共同限定召回范围，候选 Chunk 进入 Prompt 前再次鉴权。' },
      { title: '可恢复的异步摄取', description: 'Transactional Outbox、Redis Consumer Group 与数据库任务租约协作，覆盖重复投递、Worker 崩溃、重试和死信。' },
      { title: '结构感知知识加工', description: '保留页码、标题层级和表格语义，按 Token 预算切片；Embedding 数量、顺序、维度与有限值均有契约校验。' },
      { title: '答案必须可追溯', description: 'pgvector 与 BM25 经 RRF 融合、可选重排，再执行时效过滤、上下文预算与引用白名单校验。' },
    ],
    theme: 'sage', sample: false,
    role: '系统架构、RAG Pipeline、可靠任务链路与服务 API 设计开发', challenge: '', approach: '', result: '',
    content: `## 项目定位

这不是把文件塞进向量库后直接调用大模型的问答 Demo，而是一套围绕 **多租户安全、数据一致性、任务可靠性与答案可验证性** 设计的企业知识基础设施。系统支持 PDF、DOCX、Markdown、TXT 与 HTML 摄取，并通过 API 和飞书机器人复用同一套权限与检索链路。

## 系统架构

系统拆成可独立部署和扩缩容的 **API、Outbox Dispatcher、Ingestion Worker** 三类进程，并把数据分为权威数据与可重建派生索引：

| 层级 | 核心职责 | 关键设计 |
| --- | --- | --- |
| 接入与安全 | FastAPI、OIDC/JWT、租户成员、知识库 ACL、用户级限流 | 应用查询显式携带 tenant_id，PostgreSQL RLS 在事务层兜底 |
| 可靠摄取 | 不可变原文、任务编排、解析、切片、Embedding、版本发布 | Outbox 保证任务不因跨系统双写而丢失；Redis Pending 与数据库租约支持崩溃接管 |
| 检索与生成 | pgvector 语义召回、OpenSearch BM25、RRF、可选 Rerank、LLM | 检索前收窄权限，Prompt 前二次鉴权，生成后校验引用白名单 |
| 数据与运维 | PostgreSQL、MinIO、OpenSearch、Redis、Prometheus | PostgreSQL 与 MinIO 保存权威数据；OpenSearch 可从 PostgreSQL 全量重建 |

### 文档摄取链路

1. 上传阶段同时校验扩展名、MIME、文件签名、大小与 SHA-256；对象键由服务端生成，原文以不可变对象写入 MinIO。
2. 文档版本、摄取任务和 Outbox 事件在同一 PostgreSQL 事务提交；Dispatcher 再以至少一次语义投递到 Redis Streams。
3. Worker 通过 Consumer Group 与数据库租约领取任务，持续心跳；崩溃后可由其他实例接管，瞬时故障指数退避，毒消息进入 DLQ。
4. Docling / OCR 保留 PDF 阅读顺序、页码、标题和表格结构；超长语义块才按 Token 预算切分，并保留受控 overlap。
5. 新版本完成 pgvector 与 OpenSearch 写入后才原子发布；失败期间旧版本继续提供查询，不暴露半成品索引。

### 带引用问答链路

1. 先根据当前租户身份与知识库 ACL 得到可检索范围，再并行执行 pgvector 语义召回和 OpenSearch BM25 关键词召回。
2. 使用 RRF 按排名稳定融合两路结果；Reranker 仅作为质量增强，异常时可降级而不阻断主链路。
3. 候选 Chunk 回到 PostgreSQL 做权限与发布状态复核，再按上下文 Token 预算组装 Prompt，并把文档内容视为不可信输入以隔离 Prompt Injection。
4. LLM 只允许引用本次上下文中的 citation_id；返回前校验引用存在性与白名单，因此系统选择完整 JSON 响应，不提前流出未经验证的 Token。

## 关键工程取舍

- **权威数据单向派生**：PostgreSQL 保存业务数据、Chunk 与向量，MinIO 保存原文；OpenSearch 损坏后重建，不允许反向覆盖权威数据。
- **至少一次而非伪“精确一次”**：承认消息可能重复，通过幂等键、请求指纹、确定性 Chunk ID 与终态检查让重放安全。
- **跨存储显式补偿**：MinIO 与 PostgreSQL 无法共享事务，数据库失败或请求取消时执行对象清理，缩小孤儿文件窗口。
- **版本原子切换**：新版本完全就绪后再归档旧版本，保证摄取过程中的查询连续性。

## 质量与可运维性

项目提供 Alembic 迁移、Ruff、mypy strict、pytest、集成测试、JSONL 回归评测、Prometheus 指标、结构化日志、Request ID、存活/就绪探针，以及从 PostgreSQL 重建 OpenSearch 的运维命令。`,
  },
  {
    slug: 'tikie', number: '04', title: 'Tikie', english: 'AI Interactive Storytelling', category: 'AI 互动内容平台', year: '', status: '商业项目', cover: '/images/tikie/4.png', gallery: [
      '/images/tikie/4.png',
      '/images/tikie/1.gif',
      '/images/tikie/2.png',
      '/images/tikie/5.jpg',
      '/images/tikie/6.jpg',
      '/images/tikie/3.jpg',
    ], experienceUrl: 'https://taptale.ai/zh',
    description: '面向海外用户的 AI 角色互动与沉浸式叙事产品，融合角色聊天、互动短剧与可视化创作。',
    tags: ['Web', '海外产品', 'AI Character'], techStack: ['LLM', 'Prompt Engineering', 'Nuxt 3', 'SSE', 'SEO'],
    metrics: [
      { value: '100万+', label: 'Google Play 下载' },
      { value: '96', label: 'PageSpeed · PC' },
      { value: '0.6s', label: 'PC 首屏' },
      { value: '1.2s', label: '移动端首屏' },
    ],
    highlights: [
      { title: '互动短剧', description: '把剧情分支、角色切换与对话插入组成可编辑的叙事流。' },
      { title: '小说编辑器', description: '支持可视化编排、片段重写与图文混排，让 AI 内容可继续精修。' },
      { title: 'SSE 断线恢复', description: '网络中断后恢复未完成回复，避免流式内容重复或丢失。' },
      { title: '长对话稳定性', description: '分层组装人设、世界观、剧情与记忆，保持角色和故事连续。' },
    ], theme: 'lavender', sample: false,
    role: 'Web 端整体架构与 AI 互动核心业务开发', challenge: '', approach: '', result: '',
    content: `## 项目定位

面向海外用户的 AI 角色与互动叙事平台。用户既能与角色长线对话，也能创建角色、编排剧情并发布互动内容。

## 我的负责

- 负责 Web 端整体架构与 AI 互动核心业务
- 交付角色聊天、互动短剧、小说编辑器与角色创建
- 优化 SSR、按需加载、缓存和 CDN 策略，将 PC PageSpeed 提升至 **96 分**`,
  },
  {
    slug: 'frontend-helper', number: '05', title: '前端助手', english: 'Frontend Helper', category: '导航工具站', year: '', status: '个人作品', cover: '/images/gallery/frontend-helper.png', experienceUrl: 'https://web-abin.github.io/abinWeb/tools/',
    description: '为前端开发者整理的实用工具导航，集中收录开发、调试与效率工具，减少反复搜索成本。',
    tags: ['个人作品', 'Web', '工具导航'], techStack: ['Nuxt 3'],
    metrics: [
      { value: '1209 天', label: '建站时间' },
      { value: '41,980', label: '浏览量' },
      { value: '13,269', label: '访客数' },
    ],
    theme: 'sage', sample: false,
    role: '产品设计与前端开发', challenge: '', approach: '', result: '', content: `## 作品介绍

按开发场景归类常用前端工具与效率工具，提供简洁、可快速扫描的导航入口。`,
  },
  {
    slug: 'css-mid-autumn-card', number: '06', title: '纯 CSS 中秋贺卡', english: 'CSS Mid-Autumn Card', category: '前端创意实验', year: '2023', status: '比赛作品', cover: '/images/gallery/css-mid-autumn-card.gif',
    experienceUrl: 'https://code.juejin.cn/pen/7278966711116627983', articleUrl: 'https://juejin.cn/post/7279585277831856165',
    description: '零图片素材的中秋互动贺卡，用多层径向渐变、混合模式与 @property 完成画面和动效。',
    tags: ['比赛作品', 'Web', '纯 CSS'], techStack: ['CSS', 'CSS Animation', 'Modern CSS'],
    metrics: [{ value: '第 2 名', label: '中秋挑战赛决赛' }],
    highlights: [
      { title: '祥云背景', description: '多组 radial-gradient 反复叠加，用纯 CSS 组成连续的祥云纹理。' },
      { title: '混合模式', description: '通过 mix-blend-mode 实现中间的镜空月亮，透出下层祥云背景。' },
      { title: '@property', description: '注册带类型的 CSS 自定义属性，让渐变参数可以平滑过渡和动画。' },
      { title: '零图片素材', description: '全部视觉由渐变、遮罩、伪元素与动画组合完成。' },
    ], theme: 'clay', sample: false,
    role: '创意设计与前端实现', challenge: '', approach: '', result: '', content: `## 作品介绍

不使用任何图片素材：多层 **radial-gradient** 叠加出祥云背景，再通过 **mix-blend-mode** 做出透露底层祥云的镜空月亮；同时使用 **@property** 注册渐变参数，实现可平滑过渡的 CSS 动画。

作品最终获得 **中秋挑战赛决赛第 2 名**。`,
  },
  {
    slug: 'dingtalk-home-effect', number: '07', title: '钉钉首页特效', english: 'DingTalk Home Effect', category: '前端动效复刻', year: '2023', status: '个人作品', cover: '/images/gallery/dingtalk-home-effect.gif',
    experienceUrl: 'https://code.juejin.cn/pen/7273415188765179962', articleUrl: 'https://juejin.cn/post/7274149231367798803',
    description: '使用纯 CSS 还原钉钉首页的核心视觉与动效，拆解多层元素的节奏、轨迹和组合关系。',
    tags: ['个人作品', 'Web', '动效复刻'], techStack: ['CSS', 'CSS Animation', 'Scroll Timeline'], metrics: [], theme: 'lavender', sample: false,
    role: '效果拆解与前端实现', challenge: '', approach: '', result: '', content: `## 作品介绍

钉钉原首页的核心动效会跟随页面滚动进度连续变化。这类效果通常需要用 JavaScript 监听滚动并驱动动画，或借助 GSAP 等动画方案实现。

出于对 CSS 新特性的兴趣，这个作品没有使用 JavaScript 控制动画，而是采用 **CSS Scroll-driven Animations** 中的 **Scroll Timeline**，将页面滚动进度直接映射为动画时间轴，用纯 CSS 还原原本需要 JavaScript 才能完成的滚动联动效果。`,
  },
  {
    slug: 'apex-mpa', number: '08', title: 'Apex MPA', english: 'Vue Multi-page Starter', category: '开源脚手架', year: '', status: '开源项目', cover: '/images/gallery/apex-mpa.png', experienceUrl: 'https://github.com/web-abin/Apex-MPA',
    description: '面向 Vue 3 中后台与活动集合场景的多页面工程脚手架，打通页面生成、按需调试、独立构建和提交质量门禁。',
    tags: ['开源', 'Web', 'MPA'], techStack: ['Vite', 'Vue 3', 'TypeScript', 'ESLint', 'Prettier', 'Stylelint', 'Husky', 'lint-staged', 'Commitlint'], metrics: [], theme: 'sage', sample: false,
    highlights: [
      { title: '子项目一键生成', description: '通过 CLI 根据页面名称与描述生成完整目录，并可选 JavaScript 或 TypeScript 模板。' },
      { title: '按页开发与构建', description: '支持启动或打包指定子项目，也可一次处理全部页面，兼顾本地效率与集中发布。' },
      { title: '产物隔离', description: '各子项目独立生成构建 chunk，避免无关页面相互耦合，缩小改动和发布的影响面。' },
      { title: '工程质量内建', description: 'ESLint、Prettier 与 Stylelint 统一规范，Husky、lint-staged 和 Commitlint 把检查前置到 Git 提交阶段。' },
    ],
    role: '脚手架设计、构建脚本开发与开源维护', challenge: '', approach: '', result: '', content: `## 项目定位

Apex MPA 不只是一份 Vue 3 + Vite 初始模板，而是一套面向多子项目场景的开发与发布工作流。它将页面元数据、入口发现、代码模板和构建命令收敛到同一套约定中，适合多个运营活动、独立页面或子应用共仓管理。

## 核心能力

- 通过 \`npm run new:page\` 交互式生成子项目，并可选 JavaScript / TypeScript 模板，减少复制目录和手工改配置。
- 通过 \`--page\` 参数启动或打包指定子项目，同时保留全量开发与全量构建能力。
- 不同子项目的构建产物保持独立，降低页面间的隐式耦合，也为分页部署与故障隔离提供基础。
- 内置 Composition API 自动引入、组件自动注册、构建产物分析与压缩，减少常规工程配置。

## 工程化设计

项目同时配置 ESLint、Prettier 和 Stylelint，统一脚本、格式与样式规范；再通过 Husky、lint-staged 与 Commitlint 把校验放进 Git 提交链路。这让脚手架不仅解决“项目能跑起来”，也处理了多人协作中的风格一致性与提交质量问题。`,
  },
  {
    slug: 'raglab', number: '09', title: 'RAGLab', english: 'RAG Pipeline Playground', category: 'RAG 调试工具', year: '2026', status: '个人作品', cover: '/images/gallery/raglab.png', experienceUrl: 'https://raglab-playground.wellxabin.chatgpt.site/',
    description: '可视化 RAG 检索流水线调试台，通过参数调整、节点追踪与指标对比，快速验证检索方案。',
    tags: ['个人作品', 'Web', 'RAG'], techStack: ['React', 'TypeScript', 'PDF.js', 'BM25', 'Dense Retrieval', 'RRF', 'Rerank', 'OpenAI Sites'], metrics: [], theme: 'lavender', sample: false,
    role: '产品设计与全栈开发', challenge: '', approach: '', result: '',
    content: `## 作品介绍

面向 RAG 方案设计与调优的可交互实验平台。支持 PDF 解析、文本分块与真实 BM25 检索，并用可视化节点展示完整检索链路。

## 检索流水线

\`\`\`mermaid
flowchart LR
  A[PDF 文档] --> B[解析与分块]
  B --> C[BM25]
  B --> D[Dense Retrieval]
  C --> E[RRF 融合]
  D --> E
  E --> F[Rerank]
  F --> G[上下文组装]
\`\`\`

## 核心能力

- 上传并解析 PDF，调整 Chunk Size、Overlap 与 Top K
- 对比 BM25、Dense Retrieval、RRF 融合与 Rerank 的节点结果
- 查看每一步的输入、输出、文本块与组装上下文
- 用 Recall、Precision、Faithfulness、Latency 和 Cost 组织评估维度`,
  },
  {
    slug: 'wechat-publisher', number: '10', title: '公众号自动发布', english: 'WeChat Publisher', category: '内容自动化', year: '', status: '个人作品', cover: '/images/gallery/wechat-publisher.png',
    gallery: [
      '/images/gallery/wechat-publisher.png',
      '/images/mp/1.png',
    ],
    experienceUrl: 'http://49.233.191.112:3030/',
    description: '面向微信公众号的内容发布自动化工具，将重复的编辑与发送流程收敛为可执行任务。',
    tags: ['个人作品', 'Web', '微信公众号'], techStack: ['Automation'], metrics: [], theme: 'clay', sample: false,
    role: '产品设计与开发', challenge: '', approach: '', result: '', content: `## 作品介绍

将公众号内容的处理、排版与发送流程自动化，降低高频内容运营中的重复操作成本。`,
  },
  {
    slug: 'metastaff', number: '11', title: 'MetaStaff 数字员工', english: 'MetaStaff', category: 'AI 数字员工', year: '2026', status: '个人作品', cover: '/images/meta-staff/1.png',
    gallery: [
      '/images/meta-staff/1.png',
      '/images/meta-staff/2.png',
    ],
    description: '部署在远程服务器上的 AI 团队工作流平台：数字员工持续分析、写代码、测试与部署，人只在需要判断的节点收到通知并完成审批。',
    tags: ['个人作品', 'AI Agent', '数字员工', 'Human-in-the-loop'],
    techStack: ['Next.js', 'React Flow', 'Go', 'PostgreSQL', 'pgvector', 'WebSocket', 'SSE'],
    metrics: [
      { value: '10 步', label: '默认开发工作流' },
      { value: '3 类', label: 'AI / 人工 / 自动化节点' },
      { value: '5 类', label: '产品到运维数字岗位' },
      { value: '2 路', label: 'WebSocket / SSE 实时状态' },
    ],
    highlights: [
      { title: '服务器持续执行', description: '工作流与 Agent 运行在远程服务器，可持续分析需求、修改代码、执行测试并推进部署，不依赖人工盯守本地终端。' },
      { title: '人只处理决策', description: '人工节点可绑定真实协作者；流程到达需求校对、测试确认或上线会签时，通过 IM 发送待办与上下文。' },
      { title: '数字岗位可编排', description: '产品、测试、开发、运维与客服等员工模板封装 Prompt、工具和技能，可拖入 DAG 组成新的业务流程。' },
      { title: '产物可追溯可打回', description: '每个节点的输出版本化保存；人可从任意节点打回并 fork 新分支，原产物留存供对比。' },
    ],
    theme: 'sage', sample: false,
    role: '产品设计、系统架构与全栈开发', challenge: '', approach: '', result: '', content: `## 项目定位

MetaStaff 把互联网团队中的产品、客服、测试、开发和运维抽象为可配置的数字员工，再用 **DAG 工作流**将它们与真实协作者组织在同一条交付链路中。

平台部署在远程服务器后，AI 节点可持续读取任务上下文、调用工具、写代码、跑测试和执行部署。人不需要跟踪代码细节，只需要在流程到达人工节点时，根据附带的产物和上下文做出 **通过、打回或补充意见**。

## 人机协作闭环

默认开发链路从收单开始，依次完成 AI 分析、PRD 整理、需求校对、测试用例、AI 编码、三方会签、自动部署和推送验收。

\`\`\`mermaid
flowchart LR
  A["提交需求 / Bug"] --> B["PM Agent<br/>分析与 PRD"]
  B --> C{"人工校对"}
  C -->|"通过"| D["QA Agent<br/>测试用例"]
  C -->|"打回"| B
  D --> E["Dev Agent<br/>编码与测试"]
  E --> F{"PM / QA / DEV<br/>三方会签"}
  F -->|"通过"| G["Ops Agent<br/>自动部署"]
  F -->|"修改意见"| E
  G --> H["IM 推送验收"]
\`\`\`

## 人工节点与 IM 通知

- 人工节点可绑定真实员工，流程到达时自动创建待办并发送 IM 通知
- 通知携带任务背景、上游产物与决策入口，审批者不需要读代码
- 当前接入飞书 Webhook，通知层保留企业微信、Slack 等通道的扩展位
- 审批结果回写节点状态，通过后自动继续，打回则携带意见进入新的产物分支

## 系统设计

| 层级 | 职责 |
| --- | --- |
| 工作台 | 任务看板、数字员工管理、DAG 可视化编辑与节点配置 |
| 工作流引擎 | 维护 pending、running、awaiting_human、done、failed 与 rolled_back 状态流转 |
| 员工执行器 | 统一执行 AI、人工和自动化节点，向 Agent 注入角色、Prompt、工具与技能 |
| 产物与版本 | 持久化每个节点的输入输出，支持比对、回退和分支 |
| 实时与通知 | 通过 WebSocket / SSE 更新运行状态，通过 IM 把人工决策点送到负责人 |

## 关键取舍

- **人机边界显式化**：确定性、可重复的工作交给 Agent；创意、判断与验收保留人工决策权。
- **打回而不是覆盖**：任意一步都能基于历史产物创建新分支，保留完整决策轨迹。
- **编排与执行分离**：工作流定义人机协作关系，各类执行器负责具体任务，方便替换模型、工具或通知渠道。`,
  },
  {
    slug: 'miniprogram-mcp', number: '12', title: '微信小游戏 MCP', english: 'WeChat Mini-Game MCP', category: 'MCP 开发工具', year: '2026', status: '开源项目',
    cover: '/images/wegame-mcp/architecture-cover.png',
    gallery: [
      '/images/wegame-mcp/architecture-cover.png',
      '/images/wegame-mcp/1.png',
    ],
    experienceUrl: 'https://github.com/web-abin/wxgame-mcp',
    description: '让 AI Agent 直接驱动微信小游戏开发者工具，建立从观察、操作到诊断的自动化闭环。',
    tags: ['开源', 'MCP', '微信小游戏', 'AI Coding'],
    techStack: ['TypeScript', 'Model Context Protocol', 'Node.js', 'miniprogram-automator', 'Zod', 'esbuild'],
    metrics: [
      { value: '46', label: 'MCP 工具' },
      { value: '11', label: '能力模块' },
      { value: '5', label: '游戏引擎探测' },
      { value: '0', label: '运行时业务依赖' },
    ],
    highlights: [
      { title: '观察—操作—诊断闭环', description: '截图、点按、日志、网络、性能和场景树共用同一会话，Agent 能从发现问题直接进入复现与定位。' },
      { title: '控制面与数据面分离', description: '外部会话层负责 IDE 生命周期和 WebSocket 连接；轻量 Shim 负责采集 AppService 运行时信号。' },
      { title: '面向游戏的深度可观测', description: '除通用自动化外，还能审计 PIXI 场景树与纹理、量化长帧和堆内存，并追踪广告与音频实例。' },
      { title: '可降级的工程边界', description: '有界环形缓冲、安全序列化与载荷截断控制调试数据规模；引擎增强失败时不阻断基础工具。' },
    ],
    theme: 'lavender', sample: false,
    role: 'MCP 协议设计、运行时可观测与开发者工具自动化', challenge: '', approach: '', result: '', content: `## 项目定位

\`wxgame-mcp\` 是面向 **微信小游戏** 开发者工具的 MCP Server。它不是简单的点按脚本，而是把 IDE 生命周期、画面感知、交互注入、运行时观测与故障诊断统一为 **46 个 MCP Tool**，让 Claude Code 等 AI 编程客户端能在不改造游戏业务代码的前提下，完成“观察 → 操作 → 等待 → 采集 → 诊断”闭环。

## 系统架构

系统将稳定的外部控制与游戏内部的运行时采集拆成两个平面：控制面管理开发者工具和会话，数据面通过幂等 Shim 提供游戏内部信号。

\`\`\`mermaid
flowchart LR
  Agent["AI 编程客户端<br/>自然语言任务"] -->|MCP stdio| Server["MCP Server<br/>工具注册·Schema·统一错误边界"]

  subgraph Control["控制面"]
    Session["会话管理器<br/>存活检查·项目切换·连接复用"]
    Lifecycle["IDE 生命周期<br/>端口探测·CLI 拉起·信任项目"]
    Automator["miniprogram-automator<br/>WebSocket 会话"]
  end

  subgraph Runtime["数据面 · AppService 运行时"]
    Shim["幂等 Shim v2<br/>零业务依赖·按需启用"]
    Buffers["有界环形缓冲<br/>日志·错误·网络·长帧"]
    Trackers["运行时追踪<br/>性能·引擎·广告·音频"]
  end

  Server --> Session --> Lifecycle --> Automator
  Automator -->|evaluate 注入| Shim
  Shim --> Buffers
  Shim --> Trackers
  Buffers -->|JSON / MCP Image| Server
  Trackers -->|JSON| Server
  Server -->|Agent 继续决策| Agent
\`\`\`

## 核心设计

### 1. 复用 IDE，避免自动化抖动

\`wxgame_ensure\` 先探测默认 \`9421\` 端口，已开启则直接复用当前 IDE；只在端口关闭时通过新版 \`cli auto\` 拉起开发者工具。会话管理器每次复用前先执行轻量 \`evaluate\` 存活检查，死连接自动重建，切换项目时主动断开旧会话。

### 2. 幂等、零依赖的运行时探针

Shim 以纯 JavaScript 字符串注入 AppService，通过版本号保证重复注入安全。它不依赖具体游戏引擎或业务符号，只在某个工具被调用时暴露对应调试能力，不会在未请求时改变游戏行为。

### 3. 有界可观测，不让调试本身成为负担

日志、错误、网络、长帧和 FPS 数据都使用有上限的环形缓冲；对象安全序列化，请求与响应预览截断至可控大小。Shim 内部尽量捕获异常、避免向业务链路抛错，使可观测能力在长时间调试中仍保持可预期。

## 能力地图

| 能力域 | Agent 可执行的任务 |
| --- | --- |
| 画面与交互 | 截图可直接以 MCP Image 返回给模型；合成点按、滑动，或按 PIXI 节点名称点击 |
| 日志与异常 | 按级别、正则和时间窗口读取 \`console.*\`、\`wx.onError\` 与未处理 Promise 拒绝 |
| 网络调试 | 采集 \`request / download / upload / WebSocket\`，记录状态、耗时与载荷预览，并支持 URL 正则 Mock |
| 性能与内存 | 统计 FPS 的 avg / min / max / p95，记录超阈值长帧，采样 JS Heap 趋势 |
| 引擎内省 | 探测 PIXI、Laya、Cocos、Phaser 和 Three；对 PIXI 深入提供场景树、命中测试、UI 审计与纹理显存估算 |
| 游戏专项 | 追踪激励视频、插屏、Banner、自定义广告和 InnerAudioContext 实例状态 |

## 面向 Agent 的可组合工作流

工具设计不停留在单次 API 调用，而是支持 Agent 组合出可重复的诊断链路。例如：

1. 复用 IDE 并重启游戏，等待 “scene-ready” 日志出现。
2. 截图后扫描 PIXI 场景树，定位越屏元素或过小的交互热区。
3. 按节点名查找按钮并点击，同时记录网络请求、控制台日志和异常。
4. 在复现操作窗口中采样 FPS 和 Heap，再按时间戳将长帧、请求和错误串联归因。

## 工程交付

项目以 TypeScript 实现，通过 esbuild 输出可独立运行的单文件 Bundle，同时支持 \`npx wxgame-mcp\` 接入。仓库提供 Launch Smoke Test 与“ensure → screenshot → console → perf → disconnect”端到端测试，覆盖生命周期复用、Shim 幂等性和核心观测链路。`,
  },
  {
    slug: 'auto-control-miniprogram', number: '13', title: 'auto-control-miniprogram', english: 'Mobile Mini-Game Delivery', category: '微信 CI 工具', year: '2026', status: '开源项目',
    cover: '/images/auto-control-miniprogram/architecture-cover.png',
    description: '把 AI 编码、自动构建、体验版上传与手机验收连成闭环，让微信小游戏从开发到提审都能在手机端推进。',
    tags: ['开源', 'AI Coding', 'CLI', '微信小程序', '微信小游戏'],
    techStack: ['TypeScript', 'Node.js', 'Commander', 'cosmiconfig', 'miniprogram-ci', 'tsup'],
    metrics: [
      { value: '1 行', label: '体验版上传' },
      { value: '4 类', label: '微信项目类型' },
      { value: '3 种', label: '二维码输出' },
      { value: '0', label: '桌面开发者工具' },
    ],
    highlights: [
      { title: '手机驱动的开发闭环', description: '用手机向 AI 下达任务，代码完成后由 CLI 自动构建并上传体验版，扫码验收后继续反馈修改。' },
      { title: '屏蔽官方 CI 复杂度', description: '将配置加载、构建命令、项目创建、进度回调和 miniprogram-ci 参数收敛为简单命令。' },
      { title: '体验与发版分流', description: 'preview 直接产出终端、图片或 Base64 二维码；upload 则携带版本号和描述进入开发版列表。' },
      { title: '明确的人机边界', description: '构建、上传和体验版生成交给自动化；自开发账号的提审与发布保留为手机后台人工确认。' },
    ],
    theme: 'clay', sample: false,
    role: '手机端 AI 开发工作流、CLI 架构与微信 CI 链路设计', challenge: '', approach: '', result: '', content: `## 项目定位

\`auto-control-miniprogram\` 解决的不只是“少输入几条命令”，而是把 **手机指挥 AI 开发** 与微信体验版交付链路连在一起。开发者在手机上描述需求，AI 在开发环境中写代码和修改项目；完成后直接触发构建与体验版上传，再回到手机扫码验收。

如果体验发现问题，在手机上把反馈继续交给 AI；如果验收通过，则在手机端登录微信公众平台后台手动提审，审核通过后再发布。这套流程不需要打开桌面微信开发者工具。

## 手机端交付架构

\`\`\`mermaid
flowchart LR
  Phone["手机指挥 AI<br/>需求·修改意见"] --> Agent["AI 编码 Agent<br/>修改代码·执行测试"]
  Agent --> Workspace["开发环境<br/>项目源码与构建产物"]

  subgraph ACMP["auto-control-miniprogram"]
    Config["配置解析<br/>AppID·项目类型·私钥·编译设置"]
    Build["可选构建阶段<br/>pnpm / npm / 自定义命令"]
    Project["标准项目实例<br/>小程序·小游戏·插件"]
    SDK["官方 miniprogram-ci<br/>进度回调·错误边界"]
    Config --> Build --> Project --> SDK
  end

  Workspace --> Config
  SDK -->|preview| QR["体验版二维码<br/>终端·图片·Base64"]
  QR --> Test["手机扫码验收"]
  Test -->|"有问题：反馈修改"| Phone
  SDK -->|upload| Dev["微信后台开发版<br/>版本号·版本描述"]
  Test -->|"验收通过"| Review["手机后台人工提审<br/>审核通过后发布"]
  Dev --> Review
\`\`\`

## CLI 分层

| 层级 | 职责 |
| --- | --- |
| 接入层 | Commander 提供 \`init\`、\`preview\`、\`upload\` 和 \`pack-npm\` 四类命令，也暴露 TypeScript 编程 API |
| 配置层 | cosmiconfig 搜索多种配置文件，补全默认值、解析绝对路径，并在执行前校验 AppID、私钥与产物目录 |
| 编排层 | 按需执行业务项目的 build 命令，再根据 miniProgram、miniGame 或插件类型创建标准 CI Project |
| 适配层 | 向官方 miniprogram-ci 透传编译设置、忽略规则和 Robot 编号，统一处理上传进度与错误输出 |

## 两条交付通道

### 快速验收：Preview

\`acmp preview\` 在构建完成后上传体验版，二维码可输出为终端 ASCII、图片或 Base64。这使 AI 可以把体验入口直接返回到手机对话中，开发者扫码即可进入实机验收。

### 准备提审：Upload

\`acmp upload --ver <version> --desc <desc>\` 将已验收产物上传到微信后台的“开发版”列表。自开发账号没有提审和发布 API，因此这两个高风险动作明确保留为手机后台人工确认，而不是伪装成“全自动发布”。

## 安全与工程化

- \`acmp init\` 自动生成配置、创建 \`.keys/\` 目录，并把私钥目录与二维码产物写入 \`.gitignore\`，降低凭证误提交风险。
- 私钥既可来自文件路径，也可以字符串形式从 CI Secret 注入，兼容本地开发与远程执行环境。
- 配置、CLI 和编程 API 共用同一组 TypeScript 类型，再由 tsup 同时输出 ESM、CommonJS 与类型声明。`,
  },
  {
    slug: 'nuxtify', number: '14', title: 'Nuxtify', english: 'Nuxt 3 Starter', category: '开源脚手架', year: '', status: '开源项目', cover: '/images/gallery/nuxtify.png', experienceUrl: 'https://github.com/web-abin/Nuxtify',
    description: '面向生产型 SSR 站点的 Nuxt 3 脚手架，预置请求层、状态持久化、内容 SEO、UI 体系与 Node / PM2 部署链路。',
    tags: ['开源', 'Web', 'SSR', '脚手架'], techStack: ['Nuxt 3', 'Vue 3', 'TypeScript', 'Pinia', 'UnoCSS', 'Nuxt Content', 'Arco Design', 'PM2'], metrics: [],
    highlights: [
      { title: 'SSR 请求层', description: '基于 $fetch 封装 useHttp 组合式 API，配合 runtimeConfig 统一处理环境参数与服务端请求。' },
      { title: '状态可持久化', description: '集成 Pinia 与 pinia-plugin-persistedstate，提供可直接复用的全局状态和客户端持久化基础。' },
      { title: '内容与 SEO 就绪', description: '整合 Nuxt Content 与动态 Sitemap，支持内容驱动页面和可被搜索引擎发现的路由输出。' },
      { title: '从开发到部署', description: '提供多环境配置、GZIP 压缩、Dockerfile 与 PM2 cluster 配置，打通 Nuxt 产物的服务端运行链路。' },
    ], theme: 'sage', sample: false,
    role: '脚手架架构、通用能力封装与部署链路设计', challenge: '', approach: '', result: '', content: `## 项目定位

Nuxtify 面向需要 SSR、内容发布与 SEO 的业务站点，把新项目反复搭建的请求层、状态管理、样式体系、内容模块和部署配置统一收敛到一套 Nuxt 3 约定中。它解决的不只是“快速创建项目”，而是从开发、内容组织到服务端部署的基础链路。

## 核心能力

- 封装基于 \`$fetch\` 的 \`useHttp\` 组合式 API，并使用 \`runtimeConfig\` 区分公开与服务端环境参数，为 SSR 场景提供统一的数据请求入口。
- 通过 Pinia 与 persistedstate 支持全局状态及持久化，同时预留 plugins、middleware、server 和 composables 等 Nuxt 标准分层。
- 集成 UnoCSS、Arco Design 与组件自动引入，并内置 VueUse、Lodash、Lottie 和 DPlayer 等常用能力。
- 通过 Nuxt Content 承载内容页面，配合 Sitemap 动态生成增强搜索友好性。

## 工程与交付

脚手架包含 development、test 和 production 多环境配置，提供 typecheck、ESLint、Prettier、Husky 与 lint-staged 质量检查；构建阶段支持 GZIP 压缩与产物分析，产物可直接使用 Node 启动，也可通过 PM2 cluster 或 Docker 进入部署环境。`,
  },
];

const projectOrder = [
  'clipzap',
  'enterprise-knowledge-agent',
  'metastaff',
  'miniprogram-mcp',
  'raglab',
  'kaixin-lianliankan',
  'tikie',
  'auto-control-miniprogram',
  'wechat-publisher',
  'nuxtify',
  'apex-mpa',
  'css-mid-autumn-card',
  'frontend-helper',
  'dingtalk-home-effect',
] as const;

const projectsBySlug = new Map(projectCatalog.map((project) => [project.slug, project]));

export const projects: Project[] = projectOrder.map((slug, index) => {
  const project = projectsBySlug.get(slug);
  if (!project) throw new Error(`Unknown project slug in portfolio order: ${slug}`);

  return {
    ...project,
    number: String(index + 1).padStart(2, '0'),
  };
});

export function getProjectMarkdownContent(project: Project) {
  const experienceLinkText = project.experienceUrl && /^https?:\/\/(?:www\.)?github\.com\//i.test(project.experienceUrl)
    ? 'GitHub 仓库'
    : '在线体验';
  const relatedLinks = [
    project.experienceUrl ? `- [${experienceLinkText}](${project.experienceUrl})` : undefined,
    project.experienceText ? `- ${project.experienceText}` : undefined,
    project.articleUrl ? `- [项目文章](${project.articleUrl})` : undefined,
  ].filter((item): item is string => Boolean(item));

  if (!relatedLinks.length) return project.content;

  return `${project.content}\n\n## 相关链接\n\n${relatedLinks.join('\n')}`;
}
