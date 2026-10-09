'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';

type AdjacentProject = {
  slug: string;
  title: string;
};

export function ProjectBackButton() {
  const router = useRouter();
  const source = useSearchParams().get('from');

  function goBack() {
    if (source === 'home') router.push('/');
    else if (source === 'about') router.push('/about');
    else router.push('/works');
  }

  return (
    <button className="detail-back-link" type="button" onClick={goBack}>
      <ArrowLeft size={16} aria-hidden="true" />
      返回
    </button>
  );
}

export function ProjectPager({ previous, next }: { previous: AdjacentProject; next: AdjacentProject }) {
  const source = useSearchParams().get('from');
  const sourceQuery = source ? `?from=${encodeURIComponent(source)}` : '';

  return (
    <nav className="project-pager" aria-label="作品切换">
      <Link href={`/works/${previous.slug}${sourceQuery}`} className="project-pager-link project-pager-link--previous">
        <ArrowLeft size={20} aria-hidden="true" />
        <span>
          <small>上一个作品</small>
          <strong>{previous.title}</strong>
        </span>
      </Link>
      <Link href={`/works/${next.slug}${sourceQuery}`} className="project-pager-link project-pager-link--next">
        <span>
          <small>下一个作品</small>
          <strong>{next.title}</strong>
        </span>
        <ArrowRight size={20} aria-hidden="true" />
      </Link>
    </nav>
  );
}
