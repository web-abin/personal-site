'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export function ProjectMediaCarousel({
  title,
  cover,
  gallery = [],
  compact = false,
}: {
  title: string;
  cover: string;
  gallery?: string[];
  compact?: boolean;
}) {
  const media = useMemo(() => [...new Set([cover, ...gallery].filter(Boolean))], [cover, gallery]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const update = () => setCurrent(api.selectedScrollSnap());
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  if (media.length === 1) {
    return (
      <div className={compact ? 'project-dialog-media' : 'detail-full-cover'}>
        <img className={compact ? 'project-dialog-cover' : undefined} src={media[0]} alt={`${title}封面`} />
      </div>
    );
  }

  return (
    <div className={compact ? 'project-dialog-carousel' : 'detail-carousel'}>
      <Carousel setApi={setApi} opts={{ loop: true }} aria-label={`${title}作品图片`}>
        <CarouselContent>
          {media.map((image, index) => (
            <CarouselItem key={image}>
              <div className={compact ? 'project-dialog-media' : 'detail-full-cover'}>
                <img className={compact ? 'project-dialog-cover' : undefined} src={image} alt={`${title}介绍图 ${index + 1}`} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="project-carousel-previous" />
        <CarouselNext className="project-carousel-next" />
      </Carousel>
      <div className="project-carousel-status" aria-live="polite">
        {current + 1} / {media.length}
      </div>
    </div>
  );
}
