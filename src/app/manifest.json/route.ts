import { NextResponse } from 'next/server';

export function GET() {
  const manifest = {
    name: 'Somali Post Staff Hub',
    short_name: 'Post Hub',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a3a44',
    theme_color: '#1a3a44',
    icons: [
      {
        src: '/logos/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logos/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}
