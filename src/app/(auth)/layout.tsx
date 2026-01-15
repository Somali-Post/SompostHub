import React from "react";
import Image from "next/image";
import { ShieldCheck, HelpCircle, FileText } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans text-slate-900">
      <div className="relative w-full lg:w-[45%] p-12 flex flex-col justify-between text-white overflow-hidden bg-gradient-to-br from-auth-sidebarFrom to-auth-sidebarTo">
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

        <div className="relative z-10 flex flex-col h-full justify-center pl-2">
          <div className="flex flex-col items-start mb-10">
            <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-6 shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 transform hover:scale-105 transition-transform duration-500">
              <Image
                src="/logos/logo.png"
                alt="Somali Post Logo"
                width={90}
                height={90}
                className="object-contain drop-shadow-md"
                priority
              />
            </div>

            <h1 className="text-4xl font-bold mb-2 tracking-tight">Somali Post</h1>
            <h2 className="text-lg font-medium opacity-80 uppercase tracking-[0.25em]">
              Employee Hub
            </h2>
          </div>

          <div className="w-16 h-1.5 bg-auth-accent rounded-full mb-8"></div>

          <div className="space-y-5 text-lg leading-relaxed text-white/90 max-w-lg">
            <p className="font-semibold text-xl text-white">
              Welcome to your new digital partner.
            </p>
            <p className="text-base opacity-80 font-light leading-7">
              This Hub replaces paperwork with instant scanning, speeds up delivery with
              simple photo proof, and keeps the whole team connected.
            </p>
            <p className="text-base opacity-80 font-light leading-7">
              We built this to make your job{" "}
              <strong>faster, easier, and error-free</strong> so you can focus on
              what matters.
            </p>
          </div>
        </div>

        <div className="relative z-10 mt-8 pl-2">
          <div className="flex items-center gap-2 text-sm font-medium text-white/60">
            <ShieldCheck className="text-auth-accent w-5 h-5" />
            <span>Official Government Portal</span>
          </div>
          <p className="text-[10px] text-white/30 mt-2 tracking-wide">
            © 2024 Somali Post Operations. All rights reserved.
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
