// 'use client';

// import { useEffect, useRef } from 'react';

// export default function RealtimeVoice() {
//   const started = useRef(false);

//   useEffect(() => {
//     if (started.current) return;
//     started.current = true;

//     start();
//   }, []);

//   async function start() {
//     const session = await fetch('/api/realtime').then(r => r.json());

//     const pc = new RTCPeerConnection();

//     const audioEl = document.createElement('audio');
//     audioEl.autoplay = true;

//     let aiSpeaking = false;

//     pc.ontrack = e => {
//       audioEl.srcObject = e.streams[0];
//       aiSpeaking = true;

//       audioEl.onended = () => {
//         aiSpeaking = false;
//       };
//     };

//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: {
//         echoCancellation: true,
//         noiseSuppression: true,
//         autoGainControl: true,
//       },
//     });

//     const micTrack = stream.getAudioTracks()[0];
//     pc.addTrack(micTrack, stream);

//     const dc = pc.createDataChannel('oai-events');

//     dc.onopen = () => {
//       // Greeting
//       dc.send(
//         JSON.stringify({
//           type: 'response.create',
//           response: {
//             instructions:
//               "Hi! I'm Michaelangelo's AI assistant. How can I help?",
//             modalities: ['audio', 'text'],
//           },
//         }),
//       );
//     };

//     dc.onmessage = e => {
//       const msg = JSON.parse(e.data);

//       // Detect AI speaking
//       if (msg.type === 'response.output_audio.started') {
//         aiSpeaking = true;
//       }

//       if (msg.type === 'response.output_audio.completed') {
//         aiSpeaking = false;
//       }

//       // User interrupt
//       if (msg.type === 'input_audio_buffer.speech_started') {
//         if (aiSpeaking) {
//           dc.send(
//             JSON.stringify({
//               type: 'response.cancel',
//             }),
//           );
//         }
//       }
//     };

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     const res = await fetch(
//       `https://api.openai.com/v1/realtime?model=gpt-realtime-mini`,
//       {
//         method: 'POST',
//         body: offer.sdp,
//         headers: {
//           Authorization: `Bearer ${session.client_secret.value}`,
//           'Content-Type': 'application/sdp',
//         },
//       },
//     );

//     const answer = {
//       type: 'answer',
//       sdp: await res.text(),
//     };

//     await pc.setRemoteDescription(answer);
//   }

//   return null;
// }
// 'use client';

// import { useEffect, useRef } from 'react';

// export default function RealtimeVoice({
//   onSpeaking,
//   onThinking,
//   onListening,
// }: {
//   onSpeaking?: () => void;
//   onThinking?: () => void;
//   onListening?: () => void;
// }) {
//   const started = useRef(false);

//   useEffect(() => {
//     if (started.current) return;
//     started.current = true;

//     start();
//   }, []);

//   async function start() {
//     const session = await fetch('/api/realtime').then(r => r.json());

//     const pc = new RTCPeerConnection();

//     const audioEl = document.createElement('audio');
//     audioEl.autoplay = true;

//     pc.ontrack = e => {
//       audioEl.srcObject = e.streams[0];
//     };

//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: {
//         echoCancellation: true,
//         noiseSuppression: true,
//         autoGainControl: true,
//         channelCount: 1,
//         sampleRate: 16000,
//       },
//     });

//     pc.addTrack(stream.getAudioTracks()[0], stream);

//     const dc = pc.createDataChannel('oai-events');

//   dc.onopen = () => {
//     setTimeout(() => {
//       onThinking?.();

//       dc.send(
//         JSON.stringify({
//           type: 'response.create',
//           response: {
//             conversation: 'default',
//             modalities: ['audio'],
//             input: [
//               {
//                 role: 'assistant',
//                 content: [
//                   {
//                     type: 'output_text',
//                     text: "Hi! I'm Michaelangelo's AI assistant. I can help you explore this vBiz Me card, learn about the services, or connect with the business. What would you like to know?",
//                   },
//                 ],
//               },
//             ],

//           },
//         }),
//       );
//     }, 100);
//   };

//     dc.onmessage = e => {
//       const msg = JSON.parse(e.data);

//       if (msg.type === 'response.output_audio.started') {
//         onSpeaking?.();
//       }

//       if (msg.type === 'response.output_audio.completed') {
//         onListening?.();
//       }

//       if (msg.type === 'input_audio_buffer.speech_started') {
//         onListening?.();
//       }

//       if (msg.type === 'response.created') {
//         onThinking?.();
//       }
//     };

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     const res = await fetch(
//       `https://api.openai.com/v1/realtime?model=gpt-realtime-mini`,
//       {
//         method: 'POST',
//         body: offer.sdp,
//         headers: {
//           Authorization: `Bearer ${session.client_secret.value}`,
//           'Content-Type': 'application/sdp',
//         },
//       },
//     );

//     const answer = {
//       type: 'answer',
//       sdp: await res.text(),
//     };

//     await pc.setRemoteDescription(answer);

//     onListening?.();
//   }

//   return null;
// }
'use client';

import { useEffect, useRef } from 'react';

export default function RealtimeVoice({
  onSpeaking,
  onThinking,
  onListening,
}: {
  onSpeaking?: () => void;
  onThinking?: () => void;
  onListening?: () => void;
}) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    playGreeting();
  }, []);

  function playGreeting() {
    const text =
      "Hi! I'm Michaelangelo's AI assistant. How can I help you today?";

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.onstart = () => {
      onSpeaking?.();
    };

    utterance.onend = () => {
      startRealtime();
    };

    speechSynthesis.speak(utterance);
  }

  async function startRealtime() {
    onListening?.();

    const session = await fetch('/api/realtime').then(r => r.json());

    const pc = new RTCPeerConnection();

    const audioEl = document.createElement('audio');
    audioEl.autoplay = true;

    pc.ontrack = e => {
      audioEl.srcObject = e.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    const dc = pc.createDataChannel('oai-events');

    dc.onmessage = e => {
      const msg = JSON.parse(e.data);

      if (msg.type === 'response.created') {
        onThinking?.();
      }

      if (msg.type === 'response.output_audio.started') {
        onSpeaking?.();
      }

      if (msg.type === 'response.output_audio.completed') {
        onListening?.();
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const res = await fetch(
      `https://api.openai.com/v1/realtime?model=gpt-realtime-mini`,
      {
        method: 'POST',
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${session.client_secret.value}`,
          'Content-Type': 'application/sdp',
        },
      },
    );

    const answer: RTCSessionDescriptionInit = {
      type: 'answer',
      sdp: await res.text(),
    };

    await pc.setRemoteDescription(answer);
  }

  return null;
}