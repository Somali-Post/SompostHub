'use client';

import { useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function PwaRegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.error('Service worker registration failed:', error);
    });

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as BeforeInstallPromptEvent;
      (window as Window & { __pwaInstallPrompt?: BeforeInstallPromptEvent }).__pwaInstallPrompt =
        promptEvent;
      window.dispatchEvent(new Event('pwa:prompt-available'));
    };

    const handleAppInstalled = () => {
      (window as Window & { __pwaInstallPrompt?: BeforeInstallPromptEvent }).__pwaInstallPrompt =
        undefined;
      window.dispatchEvent(new Event('pwa:app-installed'));
    };

    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstall as EventListener
    );
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall as EventListener
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  return null;
}
