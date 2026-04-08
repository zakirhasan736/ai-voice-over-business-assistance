import { NextResponse } from 'next/server';
import { generateSimliSessionToken } from 'simli-client';

export async function GET() {
  const session = await generateSimliSessionToken({
    apiKey: process.env.SIMLI_API_KEY!,
    config: {
      faceId: process.env.SIMLI_FACE_ID!,
      maxSessionLength: 600,
      maxIdleTime: 180,
    },
  });

  return NextResponse.json(session);
}
