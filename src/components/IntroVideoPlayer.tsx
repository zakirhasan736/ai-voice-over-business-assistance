'use client';
import { motion } from 'framer-motion';

export default function IntroVideoPlayer({ onComplete }) {
  return (
    <motion.div className="fixed inset-0 z-50 bg-black">
      <video
        src="https://app.vbizme.com/storage/ecard/videos/91/Animation%20Vertical-2.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        className="w-full h-full object-cover"
      />
      <button
        onClick={onComplete}
        className="absolute bottom-10 right-10 text-white"
      >
        Skip
      </button>
    </motion.div>
  );
}
