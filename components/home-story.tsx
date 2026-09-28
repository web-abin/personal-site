import { ArrowUpRight } from 'lucide-react';
import type { CSSProperties } from 'react';
import { InteractiveWordmark } from '@/components/interactive-wordmark';
import { RipplePortrait } from '@/components/ripple-portrait';
import { WorkCylinder } from '@/components/work-cylinder';

const skills = [
  { name: 'Vue', level: 5 },
  { name: 'React', level: 5 },
  { name: 'Next.js', level: 5 },
  { name: 'Nuxt', level: 5 },
  { name: 'TypeScript', level: 5 },
  { name: 'Vite', level: 4 },
  { name: 'SSR', level: 5 },
  { name: 'Tailwind CSS', level: 4 },
  { name: 'Puppeteer', level: 4 },
  { name: 'WebSocket', level: 4 },
  { name: 'SSE', level: 5 },
  { name: 'Service Worker', level: 4 },
  { name: 'PWA', level: 4 },
  { name: 'Web Workers', level: 4 },
  { name: '性能优化', level: 5 },
  { name: 'SEO 优化', level: 5 },
  { name: 'Node.js', level: 4 },
  { name: 'Express', level: 3 },
  { name: 'Go', level: 2 },
  { name: 'Python', level: 4 },
  { name: 'FastAPI', level: 4 },
  { name: 'REST API', level: 4 },
  { name: 'Pydantic', level: 4 },
  { name: 'JSON Schema', level: 5 },
  { name: 'PostgreSQL', level: 2 },
  { name: 'MySQL', level: 4 },
  { name: 'Milvus', level: 2 },
  { name: 'RabbitMQ', level: 2 },
  { name: 'Kafka', level: 2 },
  { name: 'CI / CD', level: 4 },
  { name: 'Git', level: 5 },
  { name: 'Docker', level: 4 },
  { name: 'Nginx', level: 4 },
  { name: 'Jenkins', level: 3 },
  { name: 'Kubernetes', level: 2 },
  { name: 'Cloudflare', level: 3 },
  { name: 'OpenTelemetry', level: 2 },
  { name: 'Sentry', level: 3 },
  { name: 'LLM', level: 3 },
  { name: 'Agent', level: 4 },
  { name: 'RAG', level: 4 },
  { name: 'LangChain', level: 4 },
  { name: 'LangGraph', level: 4 },
  { name: 'Tool Calling', level: 4 },
  { name: 'Memory', level: 3 },
  { name: 'MCP', level: 4 },
  { name: 'Skills', level: 4 },
  { name: 'Context Engineering', level: 4 },
  { name: 'Agent Workflow', level: 4 },
  { name: 'Multimodal', level: 3 },
  { name: 'Agent Evaluation', level: 4 },
  { name: 'Guardrails', level: 3 },
];

const influence = [
  { value: '150+', label: '技术文章', note: '把实际项目中的问题、方法与结论持续沉淀为内容。' },
  { value: '78K+', label: '单篇最高阅读', note: '获得年度人气作者等社区认可。' },
  { value: '40+', label: '蓝桥杯省赛前端组命题', note: '累计设计 40 余道赛题，并交付标准答案与自动化检测脚本。' },
  { value: '20+', label: '独立产品与开源工具', note: '覆盖小游戏、AI 工具、开发者工具与内容自动化。' },
  { value: '40K+', label: '独立产品用户', note: '从产品构思、开发到上线运营，独立完成产品闭环。' },
  { value: 'JUEJIN', label: '掘金签约作者', note: '长期分享前端、AI 与独立产品实践。' },
  { value: 'CSDN', label: '博客专家', note: '稳定输出可复用的技术方法与工程经验。' },
  { value: 'ANNUAL', label: '掘金年度人气作者', note: '技术内容的持续输出与社区影响获得年度认可。' },
  { value: '16K+', label: '全网技术博客粉丝', note: '通过长期技术写作，全网技术博客粉丝累计超过 16,000。' },
];

function Skills() {
  return (
    <section id="skills" className="home-skills" aria-labelledby="skills-title" data-reveal-section>
      <div className="home-section-inner">
        <header className="home-skills__header">
          <h2 id="skills-title">Skills</h2>
        </header>

        <p className="home-skills__statement">
          <span className="home-skills__statement-line">
            I build <mark>design-driven</mark> digital products powered by
          </span>
          <span className="home-skills__statement-line">
            <mark>creative technology</mark> and <mark>AI-native systems</mark>.
          </span>
        </p>

        <div className="home-skills__cloud" aria-label="Skills weighted by proficiency">
          {skills.map((skill, index) => (
            <span className={`skill-word skill-word--${skill.level}`} data-skill-word key={skill.name} style={{ '--skill-index': index } as CSSProperties}>
              {skill.name}
            </span>
          ))}
        </div>

        <div className="home-skills__legend">
          <span>EXPERTISE</span><i /><span>EXPLORATION</span>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="home-simple-about" aria-labelledby="about-title" data-reveal-section>
      <div className="home-section-inner">
        <header className="home-simple-about__heading"><h2 id="about-title">About</h2></header>
        <div className="home-simple-about__content">
          <RipplePortrait />
          <div className="home-simple-about__copy">
            <p className="home-simple-about__lead">你好，我是王俊彬，一名拥有 6 年软件开发经验的 AI 全栈工程师。我喜欢把产品判断、交互体验、工程交付与 AI 能力放进同一个闭环，更关心一个系统能否被真正使用、观测和持续迭代。</p>
            <p>职业前半程，我主要投入在 Web、H5、App 混合开发与跨端工程，处理多端一致性、复杂业务流程和工程效率问题。近两年则深入同构 SSR，围绕渲染链路、缓存策略、Core Web Vitals 与技术 SEO 做了大量实战。</p>
            <div className="home-about-proof" aria-label="SSR、SEO 与性能优化成果">
              <div><strong>99%</strong><span>Google Search Console · 有效索引率</span></div>
              <div><strong>7.4</strong><span>Search Console · 核心非品牌词平均排名</span></div>
              <div><strong>2,500+</strong><span>Google Search · 每周自然搜索流量</span></div>
              <div><strong>2.3s → 0.6s</strong><span>PageSpeed Insights · 移动端实验室 LCP</span></div>
            </div>
            <p>近两年，我的工作重心已转向 AI 全栈与 Agent：做过 AI 互动小说、AI 角色产品，也做过 ClipZap 这类涵盖文本、图像与视频的多模态工作流。我也会为自己的高频工作搭建 Agent，让它们完成信息搜集、任务拆解、工具调用与结果验证，把效率提升落到可重复的流程里。</p>
            <p className="home-simple-about__principle"><span>WHY AGENT, NOT JUST SKILLS?</span>Skills 适合封装边界明确、可重复调用的知识与动作；Agent 则能理解目标、规划步骤，按上下文选择和组合 Skills 与工具，并根据执行结果继续决策。我不用 Agent 替代 Skills，而是让 Skills 成为稳定的能力单元，由 Agent 负责编排和闭环执行。</p>
            <p>我想做的也不是 Demo 级 Agent。从任务成功率、评测集与回归测试，到 trace、成本、延迟、权限边界与审计日志，我更关注它在真实业务中是否可控、可评估、可追溯。</p>
            <div className="home-simple-about__facts"><span>BEIJING · CHINA</span><span>AVAILABLE FOR SELECTED PROJECTS</span></div>
          </div>
        </div>
      </div>
      <div className="home-section-inner home-influence">
        <header className="home-influence__heading">
          <h3>Technical Influence</h3>
        </header>
        <div className="home-influence__grid">
          {influence.map((item) => (
            <article data-reveal-item key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
              <p>{item.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <footer id="contact" className="home-simple-contact" data-reveal-section>
      <div className="home-section-inner">
        <h2>Contact</h2>
        <p className="home-simple-contact__intro">
          I’d love to hear from you! Whether it’s a project idea, a collaboration, or just a hello, feel free to reach out.
        </p>
        <div className="home-simple-contact__links">
          <ContactLink brand="mail" label="Email" href="mailto:wellxabin@gmail.com" />
          <ContactLink brand="github" label="GitHub" href="https://github.com/web-abin" />
          <ContactLink brand="juejin" label="掘金" href="https://juejin.cn/user/994399097982728/posts" />
          <ContactLink brand="csdn" label="CSDN" href="https://blog.csdn.net/qq_38974163?type=blog" />
        </div>
        <div className="home-simple-contact__foot"><span>© 2026 JUNBIN WANG</span><span>DESIGNED &amp; BUILT WITH CURIOSITY</span></div>
      </div>
    </footer>
  );
}

function ContactLink({ brand, label, href }: { brand: 'mail' | 'github' | 'juejin' | 'csdn'; label: string; href: string }) {
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}>
      <ContactLogo brand={brand} /><span>{label}</span><ArrowUpRight />
    </a>
  );
}

function ContactLogo({ brand }: { brand: 'mail' | 'github' | 'juejin' | 'csdn' }) {
  if (brand === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="1.8" d="M3 5h18v14H3zM3 6l9 7 9-7"/></svg>;
  if (brand === 'github') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
  if (brand === 'juejin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2.5 8.8 6.3-2.4 1.7-6.4-4.6-6.4 4.6-2.4-1.7Zm-7.1 9.2L12 16.8l7.1-5.1 1.7 1.2L12 19.3l-8.8-6.4Zm0 4L12 20.8l7.1-5.1 1.7 1.2L12 23.3l-8.8-6.4Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c3.1 0 5.87-1.41 7.7-3.62l-3.2-2.45A5.95 5.95 0 0 1 12 18a6 6 0 1 1 4.52-9.95l3.16-2.49A9.98 9.98 0 0 0 12 2Z"/><path d="M11 8h2v8h-2zm-3 3h8v2H8z"/></svg>;
}

export function HomeStory() {
  return <div className="home-story">
    <Skills />
    <div className="home-work-influence-stage">
      <WorkCylinder />
      <About />
    </div>
    <Contact />
    <InteractiveWordmark />
  </div>;
}
