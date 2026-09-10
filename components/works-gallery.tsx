import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/lib/portfolio';
export function WorksGallery() {
  return <div className="works-directory">
    <h1 className="sr-only">我的作品</h1>
    <div className="works-masonry">
      {projects.map((project, index) => <article className="works-masonry-card" data-reveal key={project.slug}>
        <Link href={`/works/${project.slug}`} aria-label={`查看${project.title}详情`}>
          <div className="works-masonry-image"><img src={project.cover} alt={`${project.title}完整封面`} loading="lazy" /></div>
          <div className="works-masonry-copy">
            <div className="works-masonry-meta"><span>{String(index + 1).padStart(2, '0')} / {project.category}</span><ArrowUpRight size={18} /></div>
            <h2>{project.title}</h2><p>{project.description}</p>
            <div className="works-masonry-tags">
              {[...new Set([...project.tags, ...project.techStack])].slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            {project.sample && <span className="works-example">示例作品</span>}
          </div>
        </Link>
      </article>)}
    </div>
  </div>;
}
