import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/portfolio';
import { Header, Footer, Label } from '@/components/site-shell';
import { ProjectVisual } from '@/components/project-visual';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.title ?? '作品未找到',
    description: p?.description,
    openGraph: { title: p?.title, description: p?.description, images: [] },
    twitter: {
      card: 'summary',
      title: p?.title,
      description: p?.description,
      images: [],
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const next = projects[(projects.indexOf(p) + 1) % projects.length];
  return (
    <>
      <Header />
      <main id="main" className="wrap detail-page">
        <Link className="text-link back-link" href="/works">
          <ArrowLeft size={16} /> 返回作品集
        </Link>
        <div className="detail-heading">
          <Label>
            作品 {p.number} / {p.category} / {p.year}
          </Label>
          <h1>
            {p.title}
            <span className="serif">.</span>
          </h1>
          <p>{p.description}</p>
          <div className="tags">
            {p.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
            <span>{p.status}</span>
          </div>
        </div>
        <ProjectVisual project={p} />
        {p.sample && (
          <p className="sample-notice">
            此项目为布局示例，尚未替换为你的真实作品；以下内容不代表个人经历。
          </p>
        )}
        <div className="detail-metrics">
          {p.metrics.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
        <section className="case-body">
          <aside>
            <Label>作品背后的故事</Label>
            <h2>
              不只是结果，
              <br />
              还有过程。
            </h2>
            <div className="case-role">
              <span>我的角色</span>
              <p>{p.role}</p>
            </div>
          </aside>
          <div className="case-sections">
            {[
              ['01', '背景与挑战', p.challenge],
              ['02', '思路与实现', p.approach],
              ['03', '成果与复盘', p.result],
            ].map(([n, title, desc]) => (
              <section key={n}>
                <Label>
                  {n} / {title}
                </Label>
                <h3>{title}</h3>
                <p>{desc}</p>
              </section>
            ))}
            <div className="resource-placeholder">
              <span>项目演示 / 源码 / 数据依据</span>
              <p>相关链接待补充</p>
            </div>
          </div>
        </section>
        <Link className="next-project" href={`/works/${next.slug}`}>
          <div>
            <Label>下一个作品</Label>
            <h2>{next.title}</h2>
          </div>
          <ArrowUpRight size={42} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
