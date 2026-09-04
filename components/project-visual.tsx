import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/portfolio';
export function ProjectVisual({ project: p }: { project: Project }) {
  return (
    <div className={`project-visual ${p.theme}`}>
      <div className="visual-top">
        <span>{p.english}</span>
        <ArrowUpRight size={23} />
      </div>
      {p.theme === 'sage' ? (
        <div className="site-type">
          一个空间
          <br />
          <em>属于自己。</em>
        </div>
      ) : p.theme === 'lavender' ? (
        <div className="product-type">
          <span>
            如果想法<span className="tiny-star">✳</span>
          </span>
          <em>成为现实？</em>
          <div className="visual-caption">从一个好问题开始。</div>
        </div>
      ) : (
        <div className="experiment-type">
          <span>探索。</span>
          <span>构建。</span>
          <span>
            再出发<span className="tiny-star">*</span>
          </span>
        </div>
      )}
      <div className="visual-bottom">
        <span>{p.sample ? '示例作品' : '设计与开发'}</span>
        <span>
          {p.number} / {p.year}
        </span>
      </div>
    </div>
  );
}
