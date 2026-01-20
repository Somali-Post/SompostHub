import { NextResponse } from 'next/server';

export function GET() {
  const manifest = {
    id: '/',
    name: 'Somali Post Staff Hub',
    short_name: 'Post Hub',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#1a3a44',
    theme_color: '#1a3a44',
    icons: [
      {
        src: '/logos/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logos/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  return new NextResponse(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/manifest+json',
    },
  });
}
