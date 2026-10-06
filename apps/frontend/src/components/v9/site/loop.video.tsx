'use client';
// V9 Social: silent looping product video for the public site.
// Autoplays muted; stays on the poster for visitors who prefer reduced motion.
import { useEffect, useRef } from 'react';

export const LoopVideo = ({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      if (mq.matches) {
        // load() resets to the poster; frame 0 is the black loop fade-in.
        video.pause();
        video.load();
      } else {
        video.play().catch(() => undefined);
      }
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return (
    <video
      ref={ref}
      className="block w-full h-auto"
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      width={1920}
      height={1080}
    />
  );
};
