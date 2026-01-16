'use client';

import {
  Calendar,
  ChevronRight,
  Download,
  Eye,
  Printer,
  ThumbsDown,
  ThumbsUp,
  User,
} from 'lucide-react';

export default function ArticlePage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2 text-xs text-slate-500">
        <span>Knowledge Base</span>
        <ChevronRight size={12} />
        <span>International Shipping</span>
        <ChevronRight size={12} />
        <span className="font-bold text-auth-button">Registered Mail Processing</span>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 md:flex-row">
        <div>
          <h1 className="mb-3 text-3xl font-black text-slate-900">
            Standard Procedure for International Registered Mail
          </h1>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Calendar size={14} /> Updated: Oct 24, 2023
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> Reviewer: HQ Ops
            </span>
            <span className="flex items-center gap-1">
              <Eye size={14} /> 1.2k Views
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50"
          >
            <Printer size={16} /> Print
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-auth-button px-4 py-2 text-sm font-bold text-white hover:bg-auth-buttonHover"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-4">
        <div className="space-y-12 xl:col-span-3">
          <section>
            <h2 className="mb-4 border-b-2 border-slate-100 pb-2 text-xl font-bold text-slate-900">
              1. Introduction
            </h2>
            <p className="leading-relaxed text-slate-600">
              This procedure outlines the mandatory steps for handling international registered
              mail items. Ensuring the integrity of the tracking chain and compliance with UPU
              standards is critical.
            </p>
          </section>

          <section>
            <h2 className="mb-6 border-b-2 border-slate-100 pb-2 text-xl font-bold text-slate-900">
              2. Step-by-Step Flow
            </h2>
            <div className="relative space-y-6 border-l-2 border-slate-100 pl-8">
              <div className="relative">
                <div className="absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-auth-button text-sm font-bold text-white">
                  1
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="mb-2 font-bold text-slate-900">Arrival &amp; Verification</h3>
                  <p className="text-sm text-slate-600">
                    Inspect the external seals of the mail bag. Verify that the bag label matches
                    the manifest (CN 31/32).
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[41px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-auth-button text-sm font-bold text-white">
                  2
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <h3 className="mb-2 font-bold text-slate-900">Scanning &amp; Weight Entry</h3>
                  <p className="text-sm text-slate-600">
                    Scan each individual item. Ensure weight matches label. Discrepancies &gt;5g
                    must be flagged.
                  </p>
                  <div className="mt-4 border-l-4 border-amber-500 bg-amber-50 p-3 text-xs text-amber-800">
                    Warning: Never manually type a tracking number unless barcode is unreadable.
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-xs font-bold uppercase text-slate-400">Table of Contents</h4>
            <nav className="space-y-3 text-sm">
              <a href="#" className="block font-bold text-auth-button">
                1. Introduction
              </a>
              <a href="#" className="block text-slate-600 hover:text-auth-button">
                2. Step-by-Step Flow
              </a>
              <a href="#" className="block text-slate-600 hover:text-auth-button">
                3. Exception Handling
              </a>
            </nav>
          </div>

          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
            <p className="mb-3 text-xs font-bold text-slate-700">Did this help?</p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                className="rounded border border-slate-200 bg-white p-2 hover:text-green-600"
              >
                <ThumbsUp size={16} />
              </button>
              <button
                type="button"
                className="rounded border border-slate-200 bg-white p-2 hover:text-red-600"
              >
                <ThumbsDown size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
