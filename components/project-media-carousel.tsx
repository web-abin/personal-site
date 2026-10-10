'use client';

/* oxlint-disable next/no-img-element */

import { useEffect, useMemo, useState } from 'react';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { LoadingImage } from '@/components/loading-image';

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
  const media = useMemo(() => {
    const galleryMedia = [...new Set(gallery.filter(Boolean))];
    return galleryMedia.length > 0 ? galleryMedia : [cover];
  }, [cover, gallery]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  useEffect(() => {
    if (!api || media.length < 2 || isPaused) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) api.scrollNext();
    }, 2500);
    return () => window.clearInterval(timer);
  }, [api, isPaused, media.length]);

  if (media.length === 1) {
    return (
      <div className={`${compact ? 'project-dialog-media' : 'detail-full-cover'} project-media-frame`}>
        <img className="project-media-backdrop" src={media[0]} alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <LoadingImage
          className={`${compact ? 'project-dialog-cover' : ''} project-media-image`}
          frameClassName="project-media-loader"
          src={media[0]}
          alt={`${title}作品图片`}
        />
      </div>
    );
  }

  return (
    <div
      className={compact ? 'project-dialog-carousel' : 'detail-carousel'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false);
      }}
    >
      <Carousel setApi={setApi} opts={{ loop: true }} aria-label={`${title}作品图片`}>
        <CarouselContent>
          {media.map((image, index) => (
            <CarouselItem key={image}>
              <div className={`${compact ? 'project-dialog-media' : 'detail-full-cover'} project-media-frame`}>
                <img className="project-media-backdrop" src={image} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <LoadingImage
                  className={`${compact ? 'project-dialog-cover' : ''} project-media-image`}
                  frameClassName="project-media-loader"
                  src={image}
                  alt={`${title}介绍图 ${index + 1}`}
                />
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
