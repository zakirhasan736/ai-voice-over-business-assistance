'use client';
import { motion } from 'framer-motion';

interface IntroVideoPlayerProps {
  onComplete: () => void;
}

export default function IntroVideoPlayer({ onComplete }: IntroVideoPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
    >
      <video
        src="https://app.vbizme.com/storage/ecard/videos/91/Animation%20Vertical-2.mp4"
        muted
        autoPlay
        playsInline
        onEnded={onComplete}
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <h1 className="text-white text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
          vBiz Me
        </h1>
        <p className="text-white text-xl md:text-3xl drop-shadow-xl font-light">
          Your Digital Identity
        </p>
      </div>
      <button
        onClick={onComplete}
        className="absolute cursor-pointer bottom-12 right-8 md:right-12 bg-white/20 hover:bg-white/40 text-white px-8 py-3 rounded-full backdrop-blur-md transition-colors text-lg font-medium border border-white/30 shadow-2xl"
      >
        Skip Intro
      </button>
    </motion.div>
  );
}
