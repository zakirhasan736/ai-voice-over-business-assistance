export async function GET() {
  const r = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-realtime-mini',
      voice: 'alloy',
      instructions: `
You are an AI assistant for Michaelangelo Casanova.
You are embedded in a digital business card.
Speak naturally, short, and friendly like a human.
Always guide the user.
`,
    }),
  });

  const data = await r.json();
  return Response.json(data);
}
