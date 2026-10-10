'use client';

/* oxlint-disable next/no-img-element */

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ForwardedRef,
  type ImgHTMLAttributes,
} from 'react';

type LoadingImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  frameClassName?: string;
};

function assignRef<T>(ref: ForwardedRef<T>, value: T | null) {
  if (typeof ref === 'function') ref(value);
  else if (ref) ref.current = value;
}

export const LoadingImage = forwardRef<HTMLImageElement, LoadingImageProps>(
  function LoadingImage(
    {
      alt = '',
      className = '',
      frameClassName = '',
      loading = 'lazy',
      decoding = 'async',
      onLoad,
      onError,
      ...props
    },
    forwardedRef,
  ) {
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');

    useEffect(() => {
      const image = imageRef.current;
      if (image?.complete) setState(image.naturalWidth > 0 ? 'loaded' : 'error');
    }, [props.src]);

    return (
      <span
        className={`image-loader image-loader--${state} ${frameClassName}`.trim()}
        aria-busy={state === 'loading' ? 'true' : undefined}
      >
        <img
          {...props}
          ref={(node) => {
            imageRef.current = node;
            assignRef(forwardedRef, node);
          }}
          alt={alt}
          className={className}
          loading={loading}
          decoding={decoding}
          onLoad={(event) => {
            setState('loaded');
            onLoad?.(event);
          }}
          onError={(event) => {
            setState('error');
            onError?.(event);
          }}
        />
      </span>
    );
  },
);
