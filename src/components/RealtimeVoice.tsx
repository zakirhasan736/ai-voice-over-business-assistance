'use client';
import { useEffect } from 'react';

export default function RealtimeVoice() {
  async function start() {
    const session = await fetch('/api/realtime').then(r => r.json());

    const pc = new RTCPeerConnection();

    const audio = document.createElement('audio');
    audio.autoplay = true;

    pc.ontrack = e => {
      audio.srcObject = e.streams[0];
    };

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    stream.getTracks().forEach(track => pc.addTrack(track, stream));

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

    const answer = {
      type: 'answer',
      sdp: await res.text(),
    };

    await pc.setRemoteDescription(answer);
  }

  useEffect(() => {
    start();
  }, []);

  return null;
}
