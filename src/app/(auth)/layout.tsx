import React from 'react';
import Image from 'next/image';
import { ShieldCheck, HelpCircle, FileText, Lock } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans text-slate-900">
      <div className="relative w-full lg:w-[45%] flex flex-col justify-between p-12 lg:p-16 text-white overflow-hidden bg-gradient-to-br from-auth-sidebarFrom to-auth-sidebarTo">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg shadow-black/20 shrink-0">
            <Image
              src="/logos/logo.png"
              alt="Somali Post Logo"
              width={40}
              height={40}
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold leading-none tracking-tight">Somali Post</h2>
            <p className="text-xs font-medium opacity-70 uppercase tracking-[0.15em] mt-1.5">
              Federal Government of Somalia
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col justify-center max-w-lg">
          <h1 className="text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-tight">
            Employee<br />Hub
          </h1>

          <div className="w-20 h-1.5 bg-auth-accent rounded-full mb-8"></div>

          <h3 className="text-xl font-semibold text-white mb-4">
            Secure. Integrated. Efficient.
          </h3>

          <p className="text-base text-white/75 leading-relaxed">
            Access the central operations workspace to manage logistics, track shipments, and process
            deliveries. This system ensures data integrity and operational continuity across all
            regional hubs.
          </p>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-sm font-medium text-white/90 bg-white/10 w-fit px-4 py-2 rounded-lg border border-white/10 backdrop-blur-sm">
            <Lock className="w-4 h-4 text-auth-accent" />
            <span>Authorized Personnel Only</span>
          </div>
          <p className="text-[10px] text-white/40 mt-4 tracking-wide">
            System ID: SP-OPS-2024 - Somali Post Operations Directorate
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center bg-auth-bg p-6">
        {children}

        <div className="mt-8 flex justify-center gap-8 text-sm text-neutral-500">
          <button className="hover:text-auth-button transition-colors flex items-center gap-1">
            <HelpCircle size={16} />
            <span>Technical Support</span>
          </button>
          <button className="hover:text-auth-button transition-colors flex items-center gap-1">
            <FileText size={16} />
            <span>Security Policy</span>
          </button>
        </div>
      </div>
    </div>
  );
}
