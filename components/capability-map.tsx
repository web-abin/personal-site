'use client';

import { useState } from 'react';

const groups = [
  { id: 'frontend', number: '01', title: 'Frontend', skills: ['Vue', 'React', 'Next.js', 'Nuxt', 'TypeScript', 'State'] },
  { id: 'web', number: '02', title: 'Web Systems', skills: ['Performance', 'SEO', 'Web Vitals', 'Browser Engine', 'A11y', '工程文化'] },
  { id: 'backend', number: '03', title: 'Backend', skills: ['Node.js', 'Python', 'FastAPI', 'Go', 'REST', 'WebSocket'] },
  { id: 'agent', number: '04', title: 'AI Agent', skills: ['LangGraph', 'Tool Calling', 'MCP', 'Multi-Agent', 'Memory', 'Guardrails'] },
  { id: 'retrieval', number: '05', title: 'Retrieval', skills: ['RAG', 'Embedding', 'Vector Search', 'Hybrid Search', 'Rerank', 'Evaluation'] },
  { id: 'delivery', number: '06', title: 'Data & Ops', skills: ['PostgreSQL', 'Redis', 'Docker', 'CI / CD', 'Linux', 'Observability'] },
] as const;

const points = [
  ['frontend', 500, 375, 500, 100],
  ['web', 500, 375, 170, 180],
  ['agent', 500, 375, 830, 180],
  ['backend', 500, 375, 830, 570],
  ['retrieval', 500, 375, 500, 650],
  ['delivery', 500, 375, 170, 570],
] as const;

export function CapabilityMap() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const active = hovered ?? pinned;
  const selected = groups.find((group) => group.id === active);

  return (
    <div className="capability-canvas" data-home-reveal-item onMouseLeave={() => setHovered(null)}>
      <svg className="capability-links" viewBox="0 0 1000 750" preserveAspectRatio="none" aria-hidden="true">
        <circle cx="500" cy="375" r="120" />
        <circle cx="500" cy="375" r="275" />
        <circle cx="500" cy="375" r="360" />
        {points.map(([id, x1, y1, x2, y2]) => (
          <g key={id} data-active={active === null || active === id}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} />
            <circle cx={x2} cy={y2} r="5" />
          </g>
        ))}
      </svg>

      <div className="capability-core" aria-live="polite">
        <span>{selected ? `${selected.number} / ACTIVE` : 'FULL-STACK × AI'}</span>
        <strong>{selected ? selected.title : <><i>IDEA</i><i>SYSTEM</i><i>PRODUCT</i></>}</strong>
        <small>{selected ? `${selected.skills.length} CONNECTED NODES` : 'THINK / BUILD / SHIP'}</small>
      </div>

      {groups.map((group) => (
        <div key={group.id} className={`capability-cluster capability-cluster--${group.id}`}
          data-muted={active !== null && active !== group.id}>
          <button type="button" className="capability-domain" aria-pressed={pinned === group.id}
            onClick={() => setPinned((current) => current === group.id ? null : group.id)}
            onMouseEnter={() => setHovered(group.id)} onFocus={() => setHovered(group.id)} onBlur={() => setHovered(null)}>
            <span>{group.number}</span><strong>{group.title}</strong>
          </button>
          <div className="capability-satellites" aria-label={`${group.title} 相关技术`}>
            {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </div>
      ))}
    </div>
  );
}
