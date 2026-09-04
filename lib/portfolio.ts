export type Project = {
  cover?: string;
  techStack?: string[];
  experienceUrl?: string;
  sections?: { title?: string; text?: string; image?: string; alt?: string }[];
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
export const projects: Project[] = [
  {
    slug: 'kaixin-lianliankan', number: '01', title: '开心点连连看',
    english: '开心点连连看', category: '微信小游戏', year: '', status: '个人作品',
    description: '点一点，快乐连连看。一款轻松消除、休闲闯关的微信小游戏。',
    cover: '/images/kaixin-lianliankan.jpg',
    tags: ['微信小游戏', '休闲益智', '消除闯关'], techStack: [],
    metrics: [], theme: 'clay', sample: false,
    role: '', challenge: '', approach: '', result: '',
    sections: [
      { title: '轻松消除，欢乐无限', text: '在轻松明快的氛围里，享受连连看与消除闯关的乐趣。' },
      { title: '在微信里，开始一局', text: '可以使用微信扫描封面中的小程序码体验。' },
    ],
  },
  {
    slug: 'personal-site',
    cover: '/images/gallery/demo-05.webp',
    techStack: ['React', 'TypeScript', 'GSAP', 'Vite'],
    number: '01',
    title: '我的个人网站',
    english: '个人空间',
    category: '网站开发',
    year: '2026',
    status: '持续构建中',
    description: '把经历、作品与思考，放进一个属于自己的数字空间。',
    tags: ['个人品牌', '响应式设计', '网站开发'],
    metrics: [
      { value: '03', label: '核心页面' },
      { value: '第一版', label: '当前版本' },
      { value: '待记录', label: '访问数据' },
    ],
    theme: 'sage',
    sample: false,
    role: '个人网站的策划与内容组织；使用 AI 辅助完成第一版实现。',
    challenge:
      '如何让第一次到访的人，快速了解我的背景，并沿着作品看到具体的能力和贡献。',
    approach:
      '围绕首页、作品与关于我三个入口组织内容。首页提供整体介绍，作品页呈现项目背景与成果，关于我集中展示联系方式。',
    result:
      '第一版已建立页面框架、作品分类和项目详情。访问量、访客反馈等真实数据将在上线后逐步补充。',
  },
  {
    slug: 'product-example',
    cover: '/images/gallery/demo-06.webp',
    number: '02',
    title: '下一个产品故事',
    english: '产品思考',
    category: '产品实践',
    year: '待补充',
    status: '示例展示',
    description:
      '这里将展示一个真实产品：从发现问题，到设计方案，再到验证结果。',
    tags: ['示例项目', '产品设计', '业务价值'],
    metrics: [
      { value: '—', label: '用户规模待补充' },
      { value: '—', label: '核心指标待补充' },
      { value: '—', label: '我的贡献待补充' },
    ],
    theme: 'lavender',
    sample: true,
    role: '待补充：你在项目中承担的具体角色，以及你独立负责的部分。',
    challenge: '待补充：目标用户是谁，他们遇到了什么问题，为什么值得解决。',
    approach: '待补充：你的判断、实施过程、关键取舍，以及遇到的困难。',
    result:
      '这是用于预览布局的示例项目，不代表真实经历。后续替换为实际数据、计算口径和统计时间。',
  },
  {
    slug: 'experiment-example',
    cover: '/images/gallery/demo-03.webp',
    number: '03',
    title: '保持好奇的实验',
    english: '保持好奇',
    category: '探索实验',
    year: '待补充',
    status: '示例展示',
    description:
      '留给个人探索的空间。一个工具、一段交互，或者一次新的技术尝试。',
    tags: ['示例项目', '创意开发', '个人探索'],
    metrics: [
      { value: '—', label: '技术成果待补充' },
      { value: '—', label: '使用反馈待补充' },
      { value: '—', label: '开源数据待补充' },
    ],
    theme: 'clay',
    sample: true,
    role: '待补充：实验的发起原因与个人贡献。',
    challenge: '待补充：你想验证的想法，或想掌握的技术。',
    approach: '待补充：原型、技术路径、迭代过程与关键发现。',
    result:
      '这是用于预览布局的示例项目，不代表真实经历。后续可补充演示视频、源码链接与真实成果。',
  },
];
