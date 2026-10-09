import type { Project } from '@/lib/portfolio';

export function ProjectHighlights({ highlights }: { highlights?: Project['highlights'] }) {
  if (!highlights?.length) return null;

  return (
    <section className="project-highlights" aria-labelledby="project-highlights-title">
      <div className="project-highlights-heading">
        <span>ENGINEERING HIGHLIGHTS</span>
        <h2 id="project-highlights-title">难点与亮点</h2>
      </div>
      <div className="project-highlights-grid">
        {highlights.map((highlight, index) => (
          <article key={highlight.title} className="project-highlight-card">
            <span className="project-highlight-index">0{index + 1}</span>
            <h3>{highlight.title}</h3>
            <p>{highlight.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
