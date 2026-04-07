// 'use client';
// import { useRef, useEffect } from 'react';

// export default function SecondVideoPlayer({ onComplete }) {
//   const ref = useRef(null);

//   useEffect(() => {
//     ref.current?.play().catch(() => {});
//   }, []);

//   return (
//     <div className="fixed bottom-6 right-6 w-72 z-40">
//       <video
//         ref={ref}
//         src="https://vbiz-me.netlify.app/images/AI%20vid%20intro%20final.mp4"
//         onEnded={onComplete}
//         className="rounded-xl"
//       />
//     </div>
//   );
// }
'use client';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { VolumeX } from 'lucide-react';
export function SecondVideoPlayer({ onComplete }: { onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMutedFallback, setIsMutedFallback] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      // Ensure we try to play unmuted first
      videoRef.current.muted = false;
      const playPromise = videoRef.current.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Browser blocked unmuted autoplay.', error);
          // Browser blocked sound. We must mute it to allow it to autoplay visually.
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().catch(() => onComplete());
            setIsMutedFallback(true);
          }
        });
      }
    }
  }, [onComplete]);

  const handleUnmute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMutedFallback(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed bottom-8 right-8 z-40 w-64 h-36 md:w-80 md:h-48 bg-black rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
    >
      <video
        ref={videoRef}
        src="https://vbiz-me.netlify.app/images/AI%20vid%20intro%20final.mp4"
        playsInline
        onEnded={onComplete}
        className="w-full h-full object-cover"
      />
      {/* Tap to Unmute Overlay */}
      {isMutedFallback && (
        <button
          onClick={handleUnmute}
          className="absolute inset-0 w-full h-full bg-black/10 flex flex-col items-center justify-center hover:bg-black/30 transition-colors z-10 group"
        >
          <div className="bg-black/60 text-white p-3 rounded-full backdrop-blur-md mb-2 group-hover:scale-110 transition-transform">
            <VolumeX size={24} />
          </div>
          <span className="text-white text-xs font-bold drop-shadow-md bg-black/50 px-2 py-1 rounded backdrop-blur-md">
            Tap to Unmute
          </span>
        </button>
      )}
      <button
        onClick={onComplete}
        className="absolute cursor-pointer top-3 right-3 bg-black/50 hover:bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md transition-colors"
      >
        Skip
      </button>
    </motion.div>
  );
}
