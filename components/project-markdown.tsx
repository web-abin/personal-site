'use client';

import { isValidElement, useEffect, useId, useRef, useState, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MermaidProps = {
  chart: string;
};

let mermaidInitialized = false;

function MermaidDiagram({ chart }: MermaidProps) {
  const id = `mermaid-${useId().replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function renderDiagram() {
      try {
        const { default: mermaid } = await import('mermaid');

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'dark',
            themeVariables: {
              background: '#141414',
              primaryColor: '#d9f587',
              primaryTextColor: '#101110',
              primaryBorderColor: '#d9f587',
              lineColor: '#aab29e',
              secondaryColor: '#20261b',
              tertiaryColor: '#181818',
              fontFamily: 'Arial, PingFang SC, Microsoft YaHei, sans-serif',
            },
          });
          mermaidInitialized = true;
        }

        const { svg, bindFunctions } = await mermaid.render(id, chart.trim());
        if (!active || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        bindFunctions?.(containerRef.current);
        setError('');
      } catch (renderError) {
        if (!active) return;
        setError(renderError instanceof Error ? renderError.message : '图表渲染失败');
      }
    }

    void renderDiagram();
    return () => {
      active = false;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="mermaid-error" role="alert">
        <strong>Mermaid 图表解析失败</strong>
        <span>{error}</span>
        <pre><code>{chart}</code></pre>
      </div>
    );
  }

  return <div ref={containerRef} className="mermaid-diagram" aria-label="Mermaid 图表" />;
}

function MarkdownPre({ children }: { children?: ReactNode }) {
  if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
    const className = children.props.className ?? '';
    if (className.split(' ').includes('language-mermaid')) {
      const codeChildren = children.props.children;
      const chart = typeof codeChildren === 'string'
        ? codeChildren
        : Array.isArray(codeChildren)
          ? codeChildren.filter((part): part is string => typeof part === 'string').join('')
          : '';
      return <MermaidDiagram chart={chart} />;
    }
  }

  return <pre>{children}</pre>;
}

export function ProjectMarkdown({ content }: { content: string }) {
  return (
    <article className="md-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: MarkdownPre,
          a: ({ children, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
