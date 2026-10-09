import type { Project } from '@/lib/portfolio';

export function ProjectMetrics({ metrics }: { metrics: Project['metrics'] }) {
  if (!metrics.length) return null;

  return (
    <dl className="project-metrics" aria-label="项目数据">
      {metrics.map((metric) => (
        <div key={`${metric.value}-${metric.label}`}>
          <dt>{metric.value}</dt>
          <dd>{metric.label}</dd>
        </div>
      ))}
    </dl>
  );
}
