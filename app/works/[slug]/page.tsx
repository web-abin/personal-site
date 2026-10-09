import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/lib/portfolio';
import { ProjectMarkdown } from '@/components/project-markdown';
import { ProjectMediaCarousel } from '@/components/project-media-carousel';
import { ProjectMetrics } from '@/components/project-metrics';
import { ProjectBackButton, ProjectPager } from '@/components/project-detail-navigation';
import './detail.css';
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return {
    title: p?.title ?? '作品未找到',
    description: p?.description,
    openGraph: { title: p?.title, description: p?.description, images: p?.cover ? [p.cover] : [] },
    twitter: {
      card: 'summary',
      title: p?.title,
      description: p?.description,
      images: p?.cover ? [p.cover] : [],
    },
  };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  if (!p) notFound();
  const projectIndex = projects.indexOf(p);
  const previous = projects[(projectIndex - 1 + projects.length) % projects.length];
  const next = projects[(projectIndex + 1) % projects.length];
  const introContent = `# ${p.title}\n\n> ${p.description}`;

  return (
    <main id="main" className="detail-page">
      <ProjectBackButton />
      <div className="md-content-shell">
        <ProjectMarkdown content={introContent} />
        <div className="tag-group" aria-label="作品标签">
          {[...new Set([...p.tags, ...p.techStack, p.status])].map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        <ProjectMediaCarousel title={p.title} cover={p.cover} gallery={p.gallery} />
        <ProjectMetrics metrics={p.metrics} />
        <ProjectMarkdown content={p.content} />
      </div>
      <ProjectPager previous={previous} next={next} />
    </main>
  );
}
