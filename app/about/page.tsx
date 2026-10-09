import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Code2, GraduationCap, MapPin } from 'lucide-react';
import { Header, Footer, Label } from '@/components/site-shell';
import { RevealPage } from '@/components/reveal-page';
import { AboutTimeline, type TimelineItem } from '@/components/about-timeline';
import './about.css';

export const metadata: Metadata = {
  title: '关于我',
  description: '王俊彬，专注 Agent 应用开发与 AI 全栈，了解我的工作经历、技术实践与联系方式。',
};

const timeline: TimelineItem[] = [
  { date: '2016 — 2020', kind: 'EDUCATION', title: '河北工程大学 · 地理信息科学', description: '从空间信息与数据世界出发，完成本科学习，也在这里开始把编程变成长期的实践。' },
  { date: '2020.07 — 2021.04', kind: 'ENGINEERING', title: '山维科技 · 企业应用开发', description: '参与 ERP、OA 系统及移动办公应用建设，完成需求分析、技术方案、系统开发与项目文档。' },
  { date: '2021.04 — 2022.05', kind: 'PRODUCT', title: '中科软 · 多端应用开发', description: '参与文旅方向 Web、App、小程序与 H5 开发，从 0 到 1 建设企业级中后台，落实权限与复杂业务流程。' },
  { date: '2022.05 — 2026.07', kind: 'AI PRODUCT', title: '心言集团 · AI 应用开发', description: '参与海内外 AI 产品研发，涵盖 ClipZap、TiKie、AI 角色与 AI 助手，负责需求抽象、技术方案与 Agent 工作流。' },
  { date: '2026.07 — NOW', kind: 'INDEPENDENT', title: '独立产品 · Agent 实践', description: '持续构建 AMG Agent、AMG 与独立产品，将 AI Native 方法、全栈交付和产品判断放进同一个迭代回路。' },
];

const products = [
  { title: 'ClipZap', meta: '多模态内容工作流', image: '/images/gallery/clipzap.png', href: '/works/clipzap?from=about' },
  { title: 'TiKie', meta: 'AI 角色互动平台', image: '/images/gallery/tikie-gallery.png', href: '/works/tikie?from=about' },
  { title: '开心点连连看', meta: '独立微信小游戏', image: '/images/kaixin-lianliankan.jpg', href: '/works/kaixin-lianliankan?from=about' },
  { title: 'RAGLab', meta: '知识检索与评测', image: '/images/gallery/raglab.png', href: '/works/raglab?from=about' },
];

function BrandLogo({ brand }: { brand: 'mail' | 'github' | 'juejin' | 'csdn' }) {
  if (brand === 'mail') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M3 5.5 12 12l9-6.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path fill="#EA4335" d="M3 5.5A2.5 2.5 0 0 1 6.9 3.4L12 7.1l5.1-3.7A2.5 2.5 0 0 1 21 5.5L12 12Z"/><path fill="#34A853" d="M3 8.1 7 11v10H5a2 2 0 0 1-2-2Z"/><path fill="#FBBC04" d="m21 8.1-4 2.9v10h2a2 2 0 0 0 2-2Z"/></svg>;
  if (brand === 'github') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#fff" d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.6 9.6 0 0 1 12 6.82a9.5 9.5 0 0 1 2.5.34c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/></svg>;
  if (brand === 'juejin') return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#1E80FF" d="m12 2.5 8.8 6.3-2.4 1.7-6.4-4.6-6.4 4.6-2.4-1.7Zm-7.1 9.2L12 16.8l7.1-5.1 1.7 1.2L12 19.3l-8.8-6.4Zm0 4L12 20.8l7.1-5.1 1.7 1.2L12 23.3l-8.8-6.4Z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#FC5531" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c3.1 0 5.87-1.41 7.7-3.62l-3.2-2.45A5.95 5.95 0 0 1 12 18a6 6 0 1 1 4.52-9.95l3.16-2.49A9.98 9.98 0 0 0 12 2Z"/><path fill="#fff" d="M11 8h2v8h-2zm-3 3h8v2H8z"/></svg>;
}

export default function About() {
  const contacts = [
    { brand: 'mail' as const, title: 'EMAIL', value: 'wellxabin@gmail.com', href: 'mailto:wellxabin@gmail.com' },
    { brand: 'github' as const, title: 'GITHUB', value: '@web-abin', href: 'https://github.com/web-abin' },
    { brand: 'juejin' as const, title: '掘金', value: '签约作者', href: 'https://juejin.cn/user/994399097982728/posts' },
    { brand: 'csdn' as const, title: 'CSDN', value: '博客专家', href: 'https://blog.csdn.net/qq_38974163?type=blog' },
  ];
  return (
    <>
      <Header />
      <RevealPage id="main" className="wrap about-page">
        <section className="page-heading about-heading" data-reveal><Label>多了解我一点</Label><div className="heading-row"><h1>作品之外，<br />也是<span className="serif">生活。</span></h1></div></section>
        <section className="about-intro" data-reveal>
          <figure className="identity-panel identity-portrait" data-reveal-item><div className="identity-photo"><Image src="/images/wang-junbin-seaside.jpg" alt="王俊彬在海边夕阳下的剪影" width={1080} height={1440} /></div><figcaption className="visual-top">积极向上</figcaption></figure>
          <div className="about-copy" data-reveal-item>
            <Label>很高兴认识你</Label><h2>你好，我是王俊彬。</h2>
            <p>我有 6 年软件开发经验。从 Web、H5、App 混合开发与跨端工程起步，到近两年深入同构 SSR、性能优化与技术 SEO，我一直在处理“复杂能力如何成为稳定产品”这件事。</p>
            <p>在 ClipZap 的 SSR 与 SEO 实践中，Google Search Console 记录的全站有效索引率达到 99%，核心非品牌关键词平均排名达到 7.4，每周自然搜索流量超过 2,500。同时，PageSpeed Insights 移动端实验室数据中，代表页面的 LCP 由 2.3s 降至 0.6s。这些结果来自渲染链路、资源优先级、缓存、结构化数据、内外链策略与爬虫可达性的系统优化。</p>
            <p>近两年，我的重心已转向 AI 全栈与 Agent，涵盖 AI 互动小说、AI 角色产品、RAG，以及 ClipZap 这类文本、图像、视频串联的多模态工作流。我也持续为自己搭建 Agent，把信息搜集、分析、执行和验证变成可重复的工作系统。</p>
            <p className="about-principle"><b>Agent 不是 Skills 的替代品。</b> Skills 封装边界明确、可复用的知识与动作；Agent 负责理解目标、规划步骤，按上下文选择和组合 Skills 与工具，再根据结果继续决策。我关注的不是一个“能跑”的 Demo，而是包含评测集、回归测试、trace、成本与延迟观测、权限边界和审计日志的可控 Agent 系统。</p>
            <div className="facts">{[[MapPin, '所在城市', '北京'], [Code2, '职业方向', 'Agent 应用开发 · AI 全栈'], [GraduationCap, '教育背景', '河北工程大学 · 地理信息科学本科']].map(([Icon, label, value]) => { const I = Icon as typeof MapPin; return <div key={String(label)}><I size={17}/><span>{String(label)}</span><strong>{String(value)}</strong></div>; })}</div>
          </div>
        </section>

        <section className="section about-journey"><AboutTimeline items={timeline} /></section>

        <section className="section about-products" data-reveal>
          <div className="section-head"><div><Label>PROJECTS / PRODUCTS</Label><h2>做过的，<span>正在发生。</span></h2></div></div>
          <div className="product-strip">{products.map((product, index) => <Link href={product.href} className="product-tile" data-reveal-item key={product.title}><Image src={product.image} alt="" width={720} height={520}/><span>{String(index + 1).padStart(2, '0')} / {product.meta}</span><h3>{product.title}</h3><ArrowUpRight size={20}/></Link>)}</div>
        </section>

        <section className="section influence-section" data-reveal>
          <div className="section-head"><div><Label>TECHNICAL INFLUENCE</Label><h2>技术<span>影响力。</span></h2></div></div>
          <div className="influence-grid">
            <article data-reveal-item><strong>150+</strong><span>技术文章</span><p>长期写作，把实践整理成可复用的知识。</p></article>
            <article data-reveal-item><strong>78K+</strong><span>单篇最高阅读</span><p>获得年度人气作者等技术社区认可。</p></article>
            <article data-reveal-item><strong>40+</strong><span>蓝桥杯省赛前端组命题</span><p>累计设计 40 余道赛题，并交付标准答案与自动化检测脚本。</p></article>
            <article data-reveal-item><strong>20+</strong><span>独立产品与开源工具</span><p>覆盖小游戏、AI 工具、开发者工具与内容自动化。</p></article>
            <article data-reveal-item><strong>40K+</strong><span>独立产品用户</span><p>从产品构思、开发到上线运营，独立完成产品闭环。</p></article>
            <article data-reveal-item><strong>JUEJIN</strong><span>掘金签约作者</span><p>长期分享前端、AI 与独立产品实践。</p></article>
            <article data-reveal-item><strong>CSDN</strong><span>博客专家</span><p>稳定输出可复用的技术方法与工程经验。</p></article>
            <article data-reveal-item><strong>ANNUAL</strong><span>掘金年度人气作者</span><p>技术内容的持续输出与社区影响获得年度认可。</p></article>
            <article data-reveal-item><strong>16K+</strong><span>全网技术博客粉丝</span><p>通过长期技术写作，全网技术博客粉丝累计超过 16,000。</p></article>
          </div>
        </section>

        <section id="contact" className="section contact-section" data-reveal>
          <div className="contact-brand-row">{contacts.map((contact) => <a className={`contact-brand contact-brand--${contact.brand}`} href={contact.href} target={contact.href.startsWith('https://') ? '_blank' : undefined} rel={contact.href.startsWith('https://') ? 'noopener noreferrer' : undefined} key={contact.title}><span className="contact-brand__logo"><BrandLogo brand={contact.brand}/></span><span><b>{contact.title}</b><small>{contact.value}</small></span><ArrowUpRight size={15}/></a>)}</div>
        </section>
      </RevealPage>
      <Footer hideCallout />
    </>
  );
}
