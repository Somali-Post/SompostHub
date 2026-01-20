'use client';

import { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const isStandaloneMode = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window.navigator as any).standalone === true
  );
};

type PwaInstallButtonProps = {
  variant?: 'mobile' | 'desktop';
  className?: string;
};

export default function PwaInstallButton({
  variant = 'desktop',
  className = '',
}: PwaInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      if (!isStandaloneMode()) {
        setIsVisible(true);
      }
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsVisible(false);
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

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible || !deferredPrompt) return null;

  const isMobile = variant === 'mobile';
  const containerClass = isMobile
    ? 'rounded-2xl border border-white/50 bg-white/95 px-4 py-3 shadow-[0_8px_20px_rgba(0,0,0,0.08)]'
    : 'rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3';

  const buttonClass = isMobile
    ? 'rounded-full bg-[#0D9488] px-4 py-2 text-xs font-bold text-white shadow-[0_6px_12px_rgba(13,148,136,0.35)]'
    : 'rounded-lg bg-[#1a3a44] px-4 py-2 text-xs font-bold text-white shadow-sm';

  return (
    <div className={`${containerClass} ${className}`}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            isMobile ? 'bg-[#1a3a44]/10 text-[#1a3a44]' : 'bg-white text-[#1a3a44]'
          }`}
        >
          <Download size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900">
            Install Somali Post Staff Hub
          </p>
          <p className="text-xs text-slate-500">
            Faster access and a full-screen experience.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={handleInstall} className={buttonClass}>
            Install
          </button>
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            className="text-xs font-semibold text-slate-400 hover:text-slate-600"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
