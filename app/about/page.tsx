import type { Metadata } from 'next';
import './about.css';
import {
  GitFork,
  Mail,
  MapPin,
  GraduationCap,
  BookOpen,
  Code2,
  ArrowUpRight,
} from 'lucide-react';
import { Header, Footer, Label } from '@/components/site-shell';
import { RevealPage } from '@/components/reveal-page';
export const metadata: Metadata = {
  title: '关于我',
  description: '王俊彬，专注 Agent 应用开发与 AI 全栈，了解我的工作经历、技术实践与联系方式。',
};
export default function About() {
  return (
    <>
      <Header />
      <RevealPage id="main" className="wrap about-page">
        <section className="page-heading about-heading" data-reveal>
          <Label>多了解我一点</Label>
          <div className="heading-row">
            <h1>
              作品之外，
              <br />
              也是<span className="serif">生活。</span>
            </h1>
          </div>
        </section>
        <section className="about-intro" data-reveal>
          <figure className="identity-panel identity-portrait" data-reveal-item>
            <div className="identity-photo">
              <img src="/images/wang-junbin-seaside.jpg" alt="王俊彬在海边夕阳下的剪影" width={1080} height={1440} decoding="async" />
            </div>
            <figcaption className="visual-top">积极向上</figcaption>
          </figure>
          <div className="about-copy" data-reveal-item>
            <Label>很高兴认识你</Label>
            <h2>你好，我是王俊彬。</h2>
            <p>
              我有 6 年软件开发经验、2 年 AI 应用开发经验，专注于 Agent、RAG 与 AI Workflow。从需求分析、架构设计到前后端开发、部署迭代，持续把 AI 能力做成可以使用的产品。
            </p>
            <p>
              目前在北京，具备 Python / FastAPI 与 TypeScript / Next.js 全栈开发能力。我关注 Agent 的可控性与可靠性，通过结构化输出、工具参数校验、执行追踪和失败降级，让 AI 应用更稳妥地服务真实业务。
            </p>
            <div className="facts">
              {[
                [MapPin, '所在城市', '北京'],
                [Code2, '职业方向', 'Agent 应用开发 · AI 全栈'],
                [GraduationCap, '教育背景', '河北工程大学 · 地理信息科学本科'],
              ].map(([Icon, label, value]) => {
                const I = Icon as typeof MapPin;
                return (
                  <div key={String(label)}>
                    <I size={17} />
                    <span>{String(label)}</span>
                    <strong>{String(value)}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section className="section about-journey" data-reveal>
          <div>
            <Label>01 / 我的经历</Label>
            <h2>
              每一站，
              <br />
              <span>都算数。</span>
            </h2>
          </div>
          <div className="journey-list">
            {[
              ['2022.05 — 2026.07', '心言集团 · AI 应用开发', '在北京力拓飞远科技有限公司参与海内外 AI 产品研发，涵盖 ClipZap、TiKie、AI 角色与 AI 助手。负责需求抽象、技术方案和 Agent 工作流设计，推进产品上线与持续迭代。'],
              ['2021.04 — 2022.05', '中科软 · 多端应用开发', '参与文旅方向 Web、App、小程序与 H5 开发，从 0 到 1 建设企业级中后台系统，落实权限设计与复杂业务流程。'],
              ['2020.07 — 2021.04', '山维科技 · 企业应用开发', '参与 ERP、OA 系统及移动办公应用建设，完成需求分析、技术方案、系统开发与项目文档。'],
              ['2016 — 2020', '河北工程大学 · 地理信息科学本科', '2016 年入学，2020 年完成本科学业。'],
            ].map(([date, title, description]) => <div key={date}>
              <span className="journey-dot" />
              <span className="mono">{date}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>)}
          </div>
        </section>
        <section className="section about-expertise" data-reveal>
          <Label>02 / 技术与实践</Label>
          <div className="section-head"><h2>从能力，<span>到产品。</span></h2></div>
          <div className="about-skill-grid">
            {[
              ['Agent 与工作流', 'LangGraph、LangChain、MCP、Tool Calling 与多 Agent 协作；将任务规划、工具调用、校验和执行组织成可观测的状态流。'],
              ['RAG 与知识服务', '文档解析、语义切分、Embedding、混合检索与 Rerank，结合问题改写、引用溯源和质量评估，提升回答的可靠性。'],
              ['AI 全栈工程', 'Python、FastAPI、Pydantic、Redis，以及 TypeScript、React、Next.js、Vue / Nuxt；通过 SSE 与 WebSocket 实现流式交互。'],
              ['AI Native 研发', '使用 Claude Code、Cursor、AIGC 与自定义 Skill / Prompt 模板，覆盖产品设计、编码、检查、测试及资源生产。'],
            ].map(([title, description]) => <article data-reveal-item key={title}><h3>{title}</h3><p>{description}</p></article>)}
          </div>
          <div className="about-practice">
            <h3>做过的产品</h3>
            <p>参与 ClipZap 多模态内容生产工作流平台、企业知识库 Agent 和 TiKie AI 角色互动平台研发；独立设计、开发并上线微信小游戏「开心点连连看」，上线约 3 个月累计用户约 2 万。</p>
          </div>
          <div className="about-practice">
            <h3>技术写作与分享</h3>
            <p>掘金签约作者、年度人气作者，CSDN 博客专家。累计发布技术文章 150+ 篇，单篇最高阅读量 78 万+；主导蓝桥杯省赛前端组命题，负责题目、标准答案及自动化检测脚本，曾获码上掘金编程挑战赛第二名。</p>
          </div>
        </section>
        <section id="contact" className="section contact-section" data-reveal>
          <div className="section-head">
            <div>
              <Label>03 / 在这里找到我</Label>
              <h2>
                在别处，<span>找到我。</span>
              </h2>
            </div>
          </div>
          <div className="contact-grid">
            {[
              { Icon: Mail, title: '电子邮箱', description: '工作交流与合作', value: 'wellxabin@gmail.com', href: 'mailto:wellxabin@gmail.com' },
              { Icon: GitFork, title: 'GitHub', description: '代码与开源项目', value: 'github.com/web-abin', href: 'https://github.com/web-abin' },
              { Icon: BookOpen, title: '掘金', description: '技术文章与思考', value: '签约作者 · 年度人气作者', href: 'https://juejin.cn/user/994399097982728/posts' },
              { Icon: Code2, title: 'CSDN', description: '学习记录与分享', value: '博客专家', href: 'https://blog.csdn.net/qq_38974163?type=blog' },
            ].map(({ Icon, title, description, value, href }) => (
              <div className="contact-card" data-reveal-item key={title}>
                <div className="contact-card-top"><Icon size={25} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                {href ? <a className="about-contact-link" href={href}
                  target={href.startsWith('https://') ? '_blank' : undefined}
                  rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
                  aria-label={href.startsWith('mailto:') ? '发送邮件至 wellxabin@gmail.com' : `${title}（在新标签页打开）`}>
                  <span>{value}</span><ArrowUpRight size={17} aria-hidden="true" />
                </a> : <span className="about-contact-label">{value}</span>}
              </div>
            ))}
          </div>
        </section>
      </RevealPage>
      <Footer hideCallout />
    </>
  );
}
