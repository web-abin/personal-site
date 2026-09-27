import Link from 'next/link';
import { projects } from '@/lib/portfolio';

const selected = projects.filter((project) => !project.sample).slice(0, 10);
const lanes = [
  selected.slice(0, 6),
  [...selected.slice(3, 9)].reverse(),
  [...selected.slice(1, 7)].reverse(),
];

export function HomeGallery() {
  return (
    <div className="portfolio-flow" aria-label="Selected work">
      <div className="portfolio-flow__grain" aria-hidden="true" />
      {lanes.map((lane, laneIndex) => {
        const repeated = [...lane, ...lane];
        return (
          <div
            className={`portfolio-flow-lane portfolio-flow-lane--${laneIndex + 1}`}
            data-flow-lane={laneIndex % 2 === 0 ? 'left' : 'right'}
            key={laneIndex}
          >
            <div className="portfolio-flow-lane__scroll">
              <div className="portfolio-flow-track">
                {repeated.map((project, index) => (
                  <Link
                    className="portfolio-flow-card"
                    href={`/works/${project.slug}`}
                    key={`${project.slug}-${index}`}
                    aria-hidden={index >= lane.length}
                    tabIndex={index >= lane.length ? -1 : undefined}
                  >
                    <img src={project.cover} alt={index < lane.length ? project.title : ''} draggable={false} />
                    <span className="portfolio-flow-card__meta">
                      <b>{project.english}</b>
                      <i>{project.category}</i>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
