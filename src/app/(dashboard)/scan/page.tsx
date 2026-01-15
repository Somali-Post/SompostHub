"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  History,
  Package,
  ScanBarcode,
} from "lucide-react";

export default function ScanPage() {
  const [barcode, setBarcode] = useState("RR123456789SO");
  const [weight, setWeight] = useState("0.45");

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-8rem)]">
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              High-Volume Scanning
            </h1>
            <p className="text-slate-500 text-sm">
              Optimize for rapid item processing and UPU S10 verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border-2 border-auth-button/50 shadow-sm relative overflow-hidden">
            <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <label className="block text-auth-button text-xs font-bold uppercase tracking-widest mb-3">
              UPU S10 Scan Input (Always Focused)
            </label>
            <div className="flex items-center gap-4 bg-slate-50 rounded-lg border border-slate-200 p-2">
              <input
                type="text"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-slate-900 text-3xl font-mono font-bold flex-1 px-4 placeholder:text-slate-300 uppercase"
                placeholder="SCAN BARCODE..."
                autoFocus
              />
              <div className="bg-auth-button/10 text-auth-button p-3 rounded-md">
                <ScanBarcode size={32} />
              </div>
            </div>
            <div className="mt-4 flex gap-6 text-[10px] text-slate-400 font-bold uppercase">
              <span className="flex items-center gap-1">
                <span className="text-auth-button">[ENTER]</span> Process
              </span>
              <span className="flex items-center gap-1">
                <span className="text-auth-button">[ESC]</span> Clear
              </span>
            </div>
          </div>

          <div className="flex-1 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-slate-100 relative flex items-center justify-center border-r border-slate-100">
              <Package size={80} className="text-slate-300" />
              <div className="absolute bottom-4 left-4 bg-auth-button text-white px-2 py-1 text-[10px] font-bold uppercase rounded">
                Standard Parcel
              </div>
            </div>

            <div className="flex-1 p-8 flex flex-col justify-between">
              <div>
                <p className="text-auth-button text-xs font-bold uppercase tracking-wider mb-1">
                  Detected Item Type
                </p>
                <h2 className="text-slate-900 text-4xl font-black tracking-tighter leading-none mb-6">
                  REGISTERED MAIL
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                      Destination
                    </p>
                    <p className="text-slate-900 text-lg font-bold">
                      Mogadishu District 4
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase">
                      Service Level
                    </p>
                    <p className="text-slate-900 text-lg font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />{" "}
                      Priority
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-end gap-6">
                <div className="flex-1">
                  <label className="block text-slate-400 text-[10px] font-bold uppercase mb-2">
                    Weight (kg)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="bg-slate-50 border-2 border-slate-200 focus:border-auth-button rounded-lg text-slate-900 text-4xl font-black w-full px-4 py-2 focus:ring-0"
                      step="0.01"
                    />
                    <span className="text-slate-400 text-2xl font-black uppercase">
                      KG
                    </span>
                  </div>
                </div>
                <button className="flex-1 h-[68px] bg-auth-button hover:bg-auth-buttonHover text-white font-black text-xl rounded-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-auth-button/20">
                  <span>PROCESS</span>
                  <ArrowRight strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full xl:w-96 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm h-full">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-700 flex items-center gap-2">
              <History size={18} className="text-auth-button" /> Recent Activity
            </h3>
            <span className="bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold">
              BATCH: 124
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="bg-auth-button/5 border border-auth-button/20 p-3 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="text-auth-button font-mono font-bold text-sm">
                  RR123456789SO
                </span>
                <span className="bg-auth-button text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  JUST NOW
                </span>
              </div>
              <p className="text-slate-700 text-xs font-medium">
                Standard Parcel • 1.25 kg
              </p>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-green-600 font-bold">
                <CheckCircle size={12} /> VALIDATED &amp; SORTED
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-3 rounded-lg opacity-75">
              <div className="flex justify-between items-start mb-1">
                <span className="text-slate-600 font-mono font-bold text-sm">
                  EE987654321SO
                </span>
                <span className="text-slate-400 text-[10px] font-bold">
                  2 MIN AGO
                </span>
              </div>
              <p className="text-slate-500 text-xs font-medium">
                Express Document • 0.20 kg
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
