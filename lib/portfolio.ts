export type ProjectSection = {
  title?: string;
  text?: string;
  items?: string[];
  image?: string;
  alt?: string;
};

export type Project = {
  cover: string;
  gallery?: string[];
  techStack: string[];
  experienceUrl?: string;
  articleUrl?: string;
  sections?: ProjectSection[];
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
  theme: string;
  sample: boolean;
  role: string;
  challenge: string;
  approach: string;
  result: string;
};

const placeholder = (index: number) => `/images/gallery/demo-${String(index).padStart(2, '0')}.webp`;

export const projects: Project[] = [
  {
    slug: 'kaixin-lianliankan', number: '01', title: '开心点连连看', english: 'Kaixin Link',
    category: '微信小游戏', year: '', status: '个人作品', cover: '/images/kaixin-lianliankan.jpg',
    description: '在经典连连看玩法上加入好友对战与趣味攻击道具，支持随时随地离线游玩。',
    tags: ['个人作品', 'AI Native', '微信小游戏'], techStack: ['PixiJS'],
    metrics: [], theme: 'clay', sample: false, role: '产品设计与开发', challenge: '', approach: '', result: '',
    sections: [
      { title: '作品介绍', text: '一款轻松有趣的微信小游戏。在经典连连看的基础上，用好友对战和攻击道具增加互动感，同时保留离线单人游玩能力。' },
      { title: '核心亮点', items: ['好友对战，让休闲消除变成轻竞技互动', '可向对手丢出趣味攻击道具', '支持离线游玩，随时开始一局'] },
    ],
  },
  {
    slug: 'clipzap', number: '02', title: 'ClipZap', english: 'AI Agentic Workflow',
    category: 'AI 内容生产平台', year: '', status: '商业项目', cover: placeholder(1), experienceUrl: 'https://www.clipzap.ai/',
    description: '面向全球创作者与企业的多模态 AI 内容生产平台，通过可视化节点编排文本、图像、音频和视频工作流。',
    tags: ['Web 平台', 'AI Agent', '多模态内容'], techStack: ['Go', 'LangGraph', 'LLM', 'Next.js', 'React Flow', 'WebSocket'],
    metrics: [{ value: '41万+', label: '累计注册用户' }, { value: '3万+', label: '月注册用户' }], theme: 'lavender', sample: false,
    role: 'AI Workflow 执行体系、可视化编辑器与 Workflow Agent 核心开发', challenge: '', approach: '', result: '',
    sections: [
      { title: '项目介绍', text: 'ClipZap 将模型调用、图像与视频生成、条件判断及数据处理统一抽象为可编排的 Node / Skill Tool，让复杂内容生产流程可复用、追踪与自动执行。' },
      { title: '核心工作', items: ['建设标准化 Node / Skill Tool 体系与工具 Schema', '基于 React Flow 与 WebSocket 实现可视化编辑、状态同步和异常处理', '设计 Workflow DSL，支持节点、边、映射、执行条件、持久化与版本管理', '用 LangGraph 构建目标分析、工具检索、规划、生成、校验与执行状态流', '加入 Schema 校验、Human-in-the-loop 确认与 Trace ID 全链路追踪'] },
    ],
  },
  {
    slug: 'enterprise-knowledge-agent', number: '03', title: '企业级知识库 Agent', english: 'Enterprise Knowledge Agent',
    category: 'AI Agent', year: '', status: '企业项目', cover: placeholder(2),
    description: '面向企业内部知识查询与业务协作，构建具备 RAG、工具调用、结果校验和多轮上下文能力的统一智能入口。',
    tags: ['企业级', 'RAG', 'AI Agent'], techStack: ['Python', 'FastAPI', 'LangGraph', 'Vector DB', 'Redis', 'LLM'], metrics: [], theme: 'sage', sample: false,
    role: 'Agent 架构、RAG Pipeline 与服务 API 设计开发', challenge: '', approach: '', result: '',
    sections: [
      { title: '项目介绍', text: '区别于传统的“检索 + 问答”，依托 LangGraph 打通企业文档、业务数据与外部工具，根据问题动态选择知识检索、工具调用或直接回答。' },
      { title: '核心工作', items: ['用 LangGraph 构建 Query Analysis、Retrieval、Tool Calling、Answer Generation 与 Reflection 状态图', '搭建文档解析、语义切分、Embedding、Hybrid Search 与 Rerank 流水线', '设计 Query Rewrite / Retrieval Router，减少无效检索与模型幻觉', '建立 Memory、Citation、结果可信性检查与失败降级机制', '基于 FastAPI 提供 Agent API，并通过 SSE 流式输出'] },
    ],
  },
  {
    slug: 'tikie', number: '04', title: 'Tikie', english: 'AI Interactive Storytelling', category: 'AI 互动内容平台', year: '', status: '商业项目', cover: placeholder(3), experienceUrl: 'https://taptale.ai/zh',
    description: '面向海外用户的 AI 角色互动与沉浸式叙事产品，融合角色聊天、角色创建与互动剧本。',
    tags: ['Web', '海外产品', 'AI Character'], techStack: ['LLM', 'Prompt Engineering', 'Nuxt 3', 'SSE', 'SEO'],
    metrics: [{ value: '100万+', label: 'Google Play 累计下载' }, { value: '90+', label: 'PageSpeed PC' }, { value: '80+', label: 'PageSpeed 移动端' }], theme: 'lavender', sample: false,
    role: 'Web 端整体架构与 AI 互动核心业务开发', challenge: '', approach: '', result: '',
    sections: [
      { title: '项目介绍', text: '用户可与不同 AI 角色进行角扮对话，也可自定义角色外观、性格、背景和故事线，在长对话中保持人设稳定和剧情连续。' },
      { title: '核心工作', items: ['负责 Web 端技术架构，落地 AI Character、互动剧情、角色创建与内容编辑', '基于 SSE 建设 AI 对话流式交互与统一状态管理', '封装角色、人格、世界观、剧情、用户信息和历史会话的上下文组装逻辑', '建设可维护的角色 Prompt 与互动剧本配置能力', '优化长对话、异常降级、国际化、响应式、SEO 与前端性能'] },
    ],
  },
  {
    slug: 'frontend-helper', number: '05', title: '前端助手', english: 'Frontend Helper', category: '导航工具站', year: '', status: '个人作品', cover: placeholder(4), experienceUrl: 'https://web-abin.github.io/abinWeb/tools/',
    description: '为前端开发者整理的实用工具导航，集中收录开发、调试与效率工具，减少反复搜索成本。',
    tags: ['个人作品', 'Web', '工具导航'], techStack: ['Nuxt 3'], metrics: [], theme: 'sage', sample: false,
    role: '产品设计与前端开发', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '按开发场景归类常用前端工具与效率工具，提供简洁、可快速扫描的导航入口。' }],
  },
  {
    slug: 'css-mid-autumn-card', number: '06', title: '纯 CSS 中秋贺卡', english: 'CSS Mid-Autumn Card', category: '前端创意实验', year: '2023', status: '比赛作品', cover: placeholder(5),
    experienceUrl: 'https://code.juejin.cn/pen/7278966711116627983', articleUrl: 'https://juejin.cn/post/7279585277831856165',
    description: '零图片素材的中秋互动贺卡，仅使用 CSS 和现代 Web 特性完成画面、层次与动效。',
    tags: ['比赛作品', 'Web', '纯 CSS'], techStack: ['CSS', 'CSS Animation', 'Modern CSS'], metrics: [], theme: 'clay', sample: false,
    role: '创意设计与前端实现', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '不使用任何图片，通过 CSS 图形、渐变、遮罩与动画组合还原中秋氛围，也是一次对 CSS 新特性的集中实验。' }],
  },
  {
    slug: 'dingtalk-home-effect', number: '07', title: '钉钉首页特效', english: 'DingTalk Home Effect', category: '前端动效复刻', year: '2023', status: '个人作品', cover: placeholder(6),
    experienceUrl: 'https://code.juejin.cn/pen/7273415188765179962', articleUrl: 'https://juejin.cn/post/7274149231367798803',
    description: '使用纯 CSS 还原钉钉首页的核心视觉与动效，拆解多层元素的节奏、轨迹和组合关系。',
    tags: ['个人作品', 'Web', '动效复刻'], techStack: ['CSS', 'CSS Animation'], metrics: [], theme: 'lavender', sample: false,
    role: '效果拆解与前端实现', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '对原首页的动画组成进行拆解，用 CSS 实现关键视觉、时序与运动轨迹，达成轻量且接近原效果的复刻。' }],
  },
  {
    slug: 'apex-mpa', number: '08', title: 'Apex MPA', english: 'Vue Multi-page Starter', category: '开源脚手架', year: '', status: '开源项目', cover: placeholder(7), experienceUrl: 'https://github.com/web-abin/Apex-MPA',
    description: '面向 Vue 3 多页面应用的开箱即用脚手架，预置工程化、代码规范与 Git 提交质量链路。',
    tags: ['开源', 'Web', 'MPA'], techStack: ['Vite', 'Vue 3', 'TypeScript', 'ESLint', 'Prettier', 'Stylelint', 'Husky', 'lint-staged', 'Commitlint'], metrics: [], theme: 'sage', sample: false,
    role: '脚手架设计与开源维护', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '对多页面入口、TypeScript 与常用质量工具进行统一预置，让新项目可以快速启动，同时保持一致的格式、校验和提交规范。' }],
  },
  {
    slug: 'raglab', number: '09', title: 'RAGLab', english: 'RAG Pipeline Playground', category: 'RAG 调试工具', year: '2026', status: '个人作品', cover: '/images/raglab-cover.png', experienceUrl: 'https://raglab-playground.wellxabin.chatgpt.site/',
    description: '可视化 RAG 检索流水线调试台，通过参数调整、节点追踪与指标对比，快速验证检索方案。',
    tags: ['个人作品', 'Web', 'RAG'], techStack: ['React', 'TypeScript', 'PDF.js', 'BM25', 'Dense Retrieval', 'RRF', 'Rerank', 'OpenAI Sites'], metrics: [], theme: 'lavender', sample: false,
    role: '产品设计与全栈开发', challenge: '', approach: '', result: '',
    sections: [
      { title: '作品介绍', text: '面向 RAG 方案设计与调优的可交互实验平台。支持 PDF 解析、文本分块与真实 BM25 检索，并用可视化节点展示完整检索链路。' },
      { title: '核心能力', items: ['上传并解析 PDF，调整 Chunk Size、Overlap 与 Top K', '对比 BM25、Dense Retrieval、RRF 融合与 Rerank 的节点结果', '查看每一步的输入、输出、文本块与组装上下文', '用 Recall、Precision、Faithfulness、Latency 和 Cost 组织评估维度'] },
    ],
  },
  {
    slug: 'wechat-publisher', number: '10', title: '公众号自动发布', english: 'WeChat Publisher', category: '内容自动化', year: '', status: '个人作品', cover: placeholder(8), experienceUrl: 'http://49.233.191.112:3030/',
    description: '面向微信公众号的内容发布自动化工具，将重复的编辑与发送流程收敛为可执行任务。',
    tags: ['个人作品', 'Web', '微信公众号'], techStack: ['Automation'], metrics: [], theme: 'clay', sample: false,
    role: '产品设计与开发', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '将公众号内容的处理、排版与发送流程自动化，降低高频内容运营中的重复操作成本。' }],
  },
  {
    slug: 'metastaff', number: '11', title: 'MetaStaff 数字员工', english: 'MetaStaff', category: 'AI 数字员工', year: '', status: '项目作品', cover: placeholder(9),
    description: '面向业务协作场景的 AI 数字员工实践，让 Agent 围绕明确目标理解任务、调用工具并交付结果。',
    tags: ['AI Agent', '数字员工', '业务自动化'], techStack: ['LLM', 'Agentic Workflow'], metrics: [], theme: 'sage', sample: false,
    role: '产品与技术实践', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '聚焦数字员工在业务任务中的自主规划、工具调用与结果交付。当前先展示项目方向，后续可继续补充具体场景、技术栈与成果。' }],
  },
  {
    slug: 'miniprogram-mcp', number: '12', title: '微信小程序 MCP', english: 'Mini Program MCP', category: 'MCP 工具', year: '', status: '个人作品', cover: placeholder(10),
    description: '将微信小程序开发和调试能力封装为 MCP 工具，为 AI Agent 提供标准化的操作接口。',
    tags: ['个人作品', 'MCP', '微信小程序'], techStack: ['Model Context Protocol', 'Mini Program'], metrics: [], theme: 'lavender', sample: false,
    role: '工具协议设计与开发', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '把小程序工程中可被自动化的操作抽象为 MCP Tool，让 Agent 能以统一协议读取状态并执行任务。' }],
  },
  {
    slug: 'auto-control-miniprogram', number: '13', title: 'auto-control-miniprogram', english: 'Mini Program CI', category: '开源 CI 工具', year: '', status: '开源项目', cover: placeholder(11), experienceUrl: 'https://github.com/web-abin/auto-control-miniprogram',
    description: '微信小程序 / 小游戏自动化 CI 工具，一行命令完成代码上传并生成体验版二维码。',
    tags: ['开源', 'CLI', '微信小程序', '微信小游戏'], techStack: ['Node.js', 'miniprogram-ci'], metrics: [], theme: 'clay', sample: false,
    role: '工具设计与开源维护', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '对官方 miniprogram-ci 进行更易用的封装，简化上传、体验版二维码生成等高频 CI 流程。' }],
  },
  {
    slug: 'nuxtify', number: '14', title: 'Nuxtify', english: 'Nuxt 3 Starter', category: '开源脚手架', year: '', status: '开源项目', cover: placeholder(12), experienceUrl: 'https://github.com/web-abin/Nuxtify',
    description: '为实际业务开发准备的 Nuxt 3 开箱即用脚手架，将常用工程化约定与项目基础能力统一预置。',
    tags: ['开源', 'Web', '脚手架'], techStack: ['Nuxt 3', 'Vue 3', 'TypeScript'], metrics: [], theme: 'sage', sample: false,
    role: '脚手架设计与开源维护', challenge: '', approach: '', result: '', sections: [{ title: '作品介绍', text: '以“开箱即用”为目标，整合 Nuxt 3 与 Vue 3 的项目基础结构和工程化配置，减少新项目的重复搭建成本。' }],
  },
  {
    slug: 'code-helper', number: '15', title: 'Code Helper', english: 'AI Code Assistant', category: 'VS Code 插件', year: '', status: '个人作品', cover: placeholder(1),
    description: '为 VS Code 用户设计的 AI 前端代码助手，将代码优化、错误分析、逻辑解读和代码生成集成进编辑器右键菜单。',
    tags: ['个人作品', 'VS Code', 'AI 开发工具'], techStack: ['VS Code Extension API', 'ChatGPT'], metrics: [], theme: 'lavender', sample: false,
    role: '插件设计与开发', challenge: '', approach: '', result: '',
    sections: [
      { title: '核心功能', items: ['分析选中代码或当前文件，给出可执行的优化建议', '检查代码逻辑并辅助定位错误', '用自然语言解读代码职责，帮助快速接手项目', '根据需求生成代码初稿，在编辑器中继续调整'] },
      { title: '使用方式', text: '安装 .vsix 后，在编辑器中选中代码并从右键菜单调用对应功能；未选中时默认分析当前文件。' },
    ],
  },
];
