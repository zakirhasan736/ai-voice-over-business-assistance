// 'use client';

// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import Lottie from 'lottie-react';
// import avatar from '../../public/images/avatar.json';
// import RealtimeVoice from './RealtimeVoice';

// export default function AvatarGuide({ state }: { state: string }) {
//   const [mode, setMode] = useState<
//     'idle' | 'listening' | 'thinking' | 'speaking'
//   >('idle');

//   useEffect(() => {
//     if (state === 'chat') {
//       setMode('listening');
//     }
//   }, [state]);
// useEffect(() => {
//   if (state === 'chat') {
//     startGreeting();
//   }
// }, [state]);
//   return (
//     <motion.div
//       className="fixed bottom-6 right-6 z-50 flex flex-col items-center"
//       initial={{ x: '120vw' }}
//       animate={{ x: 0 }}
//       transition={{ duration: 0.8 }}
//     >
//       {/* thinking dots */}

//       {mode === 'thinking' && (
//         <div className="flex gap-2 mb-2">
//           {[0, 1, 2].map(i => (
//             <motion.div
//               key={i}
//               className="w-2.5 h-2.5 bg-blue-500 rounded-full"
//               animate={{ y: [0, -6, 0] }}
//               transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
//             />
//           ))}
//         </div>
//       )}

//       {/* speaking waves */}

//       {mode === 'speaking' && (
//         <div className="flex h-8 gap-1 mb-2">
//           {[1, 2, 3, 4, 5].map(i => (
//             <motion.div
//               key={i}
//               className="w-1.5 bg-blue-500 rounded-full"
//               animate={{ height: ['20%', '100%', '20%'] }}
//               transition={{
//                 repeat: Infinity,
//                 duration: 0.5 + Math.random() * 0.3,
//                 delay: Math.random() * 0.2,
//               }}
//             />
//           ))}
//         </div>
//       )}

//       {/* avatar */}

//       <div className="relative w-32 h-32">
//         {mode === 'listening' && (
//           <motion.div
//             className={`absolute inset-0 rounded-full border-4 ${mode === 'listening' ? 'border-blue-500' : 'border-green-400'}`}
//             animate={
//               mode === 'listening'
//                 ? { scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }
//                 : { scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }
//             }
//             transition={{
//               repeat: Infinity,
//               duration: mode === 'listening' ? 0.8 : 2,
//             }}
//           />
//         )}

//         <Lottie
//           animationData={avatar}
//           loop
//           className="w-full h-full relative z-10"
//         />
//       </div>

//       {/* greeting */}

//       {state === 'idle' && (
//         <div className="bg-black text-white px-3 py-2 rounded mt-2 text-sm text-center max-w-[200px]">
//           Hi! I'm Michaelangelo's AI assistant. How can I help?
//         </div>
//       )}

//       {/* realtime AI */}

//       {state === 'chat' && (
//         <RealtimeVoice
//           onSpeaking={() => setMode('speaking')}
//           onThinking={() => setMode('thinking')}
//           onListening={() => setMode('listening')}
//         />
//       )}
//     </motion.div>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import avatar from '../../public/images/avatar.json';
import RealtimeVoice from './RealtimeVoice';

export default function AvatarGuide({ state }: { state: string }) {
  const [mode, setMode] = useState<
    'idle' | 'listening' | 'thinking' | 'speaking'
  >('idle');
  const [randomValues] = useState(() =>
    Array.from({ length: 5 }, () => ({
      duration: 0.5 + Math.random() * 0.3,
      delay: Math.random() * 0.2,
    }))
  );

useEffect(() => {
  if (state === 'chat') {
   setMode('thinking');
  }
}, [state]);

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center"
      initial={{ x: '120vw' }}
      animate={{ x: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* thinking dots */}
      {mode === 'thinking' && (
        <div className="flex gap-2 mb-2">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-blue-500 rounded-full"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
            />
          ))}
        </div>
      )}

      {/* speaking sound waves */}
      {mode === 'speaking' && (
        <div className="flex h-8 gap-1 mb-2">
          {[1, 2, 3, 4, 5].map(i => (
            <motion.div
              key={i}
              className="w-1.5 bg-blue-500 rounded-full"
              animate={{ height: ['20%', '100%', '20%'] }}
              transition={{
                repeat: Infinity,
                duration: randomValues[i - 1].duration,
                delay: randomValues[i - 1].delay,
              }}
            />
          ))}
        </div>
      )}

      {/* avatar */}
      <div className="relative w-32 h-32">
        {mode === 'listening' && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-500"
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
          />
        )}

        <Lottie
          animationData={avatar}
          loop
          className="w-full h-full relative z-10"
        />
      </div>
      {/* {state === 'idle' && (
        <div className="bg-black text-white px-3 py-2 rounded mt-2 text-sm text-center max-w-[200px]">
          Hi! I'm Michaelangelo's AI assistant. How can I help?
        </div>
      )} */}
      {/* realtime AI */}
      {state === 'chat' && (
        <RealtimeVoice
          onSpeaking={() => setMode('speaking')}
          onThinking={() => setMode('thinking')}
          onListening={() => setMode('listening')}
        />
      )}
    </motion.div>
  );
}