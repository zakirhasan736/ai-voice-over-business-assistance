// import { SimliClient, LogLevel } from 'simli-client';

// let simliClient: SimliClient | null = null;

// export async function connectSimli(
//   videoElement: HTMLVideoElement,
//   audioElement: HTMLAudioElement,
// ) {
//   if (simliClient) return simliClient;

//   const res = await fetch('/api/simli-session');
//   const { session_token } = await res.json();

//   simliClient = new SimliClient(
//     session_token,
//     videoElement,
//     audioElement,
//     null,
//     LogLevel.INFO,
//     'livekit',
//   );

//   await simliClient.start();

//   return simliClient;
// }

// /**
//  * Send raw audio data to Simli
//  */
// export function sendAudioData(audio: Uint8Array) {
//   if (!simliClient) return;

//   simliClient.sendAudioData(audio);
// }

// /**
//  * Optional helper for text
//  */
// export function speakSimli(text: string) {
//   if (!simliClient) return;

//   const encoder = new TextEncoder();
//   const audioData = encoder.encode(text);

//   simliClient.sendAudioData(audioData);
// }
