'use client';
import { useRef, useEffect } from 'react';

export default function SecondVideoPlayer({ onComplete }) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.play().catch(() => {});
  }, []);

  return (
    <div className="fixed bottom-6 right-6 w-72 z-40">
      <video
        ref={ref}
        src="https://vbiz-me.netlify.app/images/AI%20vid%20intro%20final.mp4"
        onEnded={onComplete}
        className="rounded-xl"
      />
    </div>
  );
}
