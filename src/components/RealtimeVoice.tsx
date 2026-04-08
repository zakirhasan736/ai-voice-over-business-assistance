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

// dc.onopen = () => {
//   setTimeout(() => {
//     onThinking?.();

//     // start conversation without user speaking
//     dc.send(
//       JSON.stringify({
//         type: 'input_audio_buffer.commit',
//       }),
//     );

//     // now trigger greeting
//     dc.send(
//       JSON.stringify({
//         type: 'response.create',
//         response: {
//           conversation: 'default',
//           modalities: ['audio'],
//           instructions:
//             "Hi! I'm Michaelangelo's AI assistant. How can I help you today?",
//         },
//       }),
//     );
//   }, 400);
// };
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

//     playGreeting();
//   }, []);

//   function playGreeting() {
//     const text =
//       "Hi! I'm Michaelangelo's AI assistant. How can I help you today?";

//     const utterance = new SpeechSynthesisUtterance(text);

//     utterance.onstart = () => {
//       onSpeaking?.();
//     };

//     utterance.onend = () => {
//       startRealtime();
//     };

//     speechSynthesis.speak(utterance);
//   }

//   async function startRealtime() {
//     onListening?.();

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
//       },
//     });

//     stream.getTracks().forEach(track => pc.addTrack(track, stream));

//     const dc = pc.createDataChannel('oai-events');

//     dc.onmessage = e => {
//       const msg = JSON.parse(e.data);

//       if (msg.type === 'response.created') {
//         onThinking?.();
//       }

//       if (msg.type === 'response.output_audio.started') {
//         onSpeaking?.();
//       }

//       if (msg.type === 'response.output_audio.completed') {
//         onListening?.();
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

//     const answer: RTCSessionDescriptionInit = {
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
//     const dc = pc.createDataChannel('oai-events');

//     // const audioEl = document.createElement('audio');
//     // audioEl.autoplay = true;

//     // pc.ontrack = e => {
//     //   audioEl.srcObject = e.streams[0];
//     // };

//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     stream.getTracks().forEach(track => pc.addTrack(track, stream));

//     dc.addEventListener('open', () => {
//       onThinking?.();

//       // AI greeting immediately when connected
//       dc.send(
//         JSON.stringify({
//           type: 'response.create',
//           response: {
//             modalities: ['text'],
//             instructions:
//               "Say: Hi! I'm Michaelangelo's AI assistant. How can I help you explore this vBiz Me card today?",
//           },
//         }),
//       );
//     });

//     dc.addEventListener('message', e => {
//       const msg = JSON.parse(e.data);
//       if (msg.type === 'response.output_text.delta') {
//         simliAvatar.speak({
//           text: msg.delta,
//         });
//       }
//       if (msg.type === 'response.output_audio.started') {
//         onSpeaking?.();
//       }

//       if (msg.type === 'response.output_audio.completed') {
//         onListening?.();
//       }

//       if (msg.type === 'response.created') {
//         onThinking?.();
//       }
//     });

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
// import { speakSimli } from '@/lib/simliClient';

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
//     const dc = pc.createDataChannel('oai-events');

//     // USER MIC
//     const stream = await navigator.mediaDevices.getUserMedia({
//       audio: true,
//     });

//     stream.getTracks().forEach(track => pc.addTrack(track, stream));

//     let buffer = '';

//     dc.onopen = () => {
//       console.log('OpenAI connected');

//       // greeting
//       dc.send(
//         JSON.stringify({
//           type: 'response.create',
//           response: {
//             modalities: ['text'],
//             instructions:
//               "Hi! I'm Michaelangelo's AI assistant. How can I help you explore this vBiz Me card today?",
//           },
//         }),
//       );
//     };

//     dc.onmessage = e => {
//       const msg = JSON.parse(e.data);

//       if (msg.type === 'response.output_text.delta') {
//         buffer += msg.delta;
//       }

//       if (msg.type === 'response.output_text.done') {
//         console.log('AI response:', buffer);

//         // send text to Simli
//         speakSimli(buffer);

//         buffer = '';
//       }
//     };

//     const offer = await pc.createOffer();
//     await pc.setLocalDescription(offer);

//     const res = await fetch(
//       'https://api.openai.com/v1/realtime?model=gpt-realtime-mini',
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