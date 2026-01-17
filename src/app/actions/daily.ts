'use server';

const DAILY_API_KEY = process.env.DAILY_API_KEY;

export async function createDailyRoom() {
  if (!DAILY_API_KEY) {
    throw new Error('Missing Daily API Key');
  }

  const res = await fetch('https://api.daily.co/v1/rooms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    },
    body: JSON.stringify({
      properties: {
        enable_chat: true,
        enable_screenshare: true,
        exp: Math.round(Date.now() / 1000) + 3600,
      },
    }),
  });

  if (!res.ok) {
    const details = await res.text();
    throw new Error(`Daily API error: ${details}`);
  }

  const data = await res.json();
  return data.url as string;
}
