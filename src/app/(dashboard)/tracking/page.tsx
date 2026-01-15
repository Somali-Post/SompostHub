"use client";

import {
  Box,
  Camera,
  FileText,
  History,
  MapPin,
  Printer,
  Scale,
  Search,
  Share,
  Truck,
} from "lucide-react";

export default function TrackingPage() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col gap-8 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-auth-button/10 text-auth-button text-[10px] font-bold px-2 py-0.5 rounded border border-auth-button/20 uppercase tracking-wider">
                Priority Logistics
              </span>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                Investigative Hold
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              Dossier:{" "}
              <span className="font-mono text-2xl text-slate-600">
                SP-99283-X
              </span>
            </h1>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
              <Printer size={16} /> Print Manifest
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-auth-button text-white rounded-lg text-sm font-bold shadow-sm hover:bg-auth-buttonHover">
              <Share size={16} /> Export Report
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={24} />
          </div>
          <input
            type="text"
            className="w-full h-16 pl-14 pr-4 rounded-xl border-2 border-slate-200 text-xl font-bold text-slate-900 focus:border-auth-button focus:ring-0 placeholder:text-slate-300 font-mono"
            placeholder="Search UPU S10 ID (e.g. RR123456789SO)..."
            defaultValue="RR123456789SO"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-auth-sidebarFrom text-white px-6 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors">
            Execute Trace
          </button>
        </div>

        <div className="bg-auth-sidebarFrom text-white p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-md">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-3 rounded-lg">
              <Truck size={32} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Operational Status
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                IN TRANSIT - MOGADISHU HUB
              </h3>
            </div>
          </div>
          <div className="flex gap-12 md:border-l md:border-white/20 md:pl-12">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Assigned Handler
              </p>
              <p className="text-lg font-semibold uppercase">
                Ahmed Ali (SP-8842)
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                Last Scan
              </p>
              <p className="text-lg font-semibold uppercase">Departure Scan</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                <h2 className="text-slate-700 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} /> Item Intelligence
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Origin
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Istanbul (IST)
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Destination
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Mogadishu (MGQ)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Weight
                    </p>
                    <p className="text-lg font-bold text-slate-900">1.25 kg</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">
                      Service
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      Express Mail
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-auth-button/5 border border-auth-button/20 rounded-xl p-5">
              <p className="text-xs font-bold text-auth-button flex items-center gap-2 mb-2">
                <Scale size={16} /> AI Prediction Model
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Based on historical clearance times at Terminal MRT-01, this
                item is likely to release within{" "}
                <span className="font-bold text-auth-button">3.2 hours</span>.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-700 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <History size={16} /> Audit Trail
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto space-y-8">
              <div className="relative pl-8 border-l-2 border-slate-200 pb-8 last:pb-0 last:border-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-auth-button border-2 border-white shadow-sm" />
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-900">
                      OUT FOR DELIVERY
                    </h4>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      09:15
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mogadishu Distribution Center
                  </p>
                  <div className="mt-2 text-[10px] font-mono uppercase text-slate-400">
                    STAFF: A. ALI
                  </div>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-slate-200 pb-8 last:pb-0 last:border-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-700">
                      RECEIVED AT HUB
                    </h4>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      Yesterday
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mogadishu Main Sorting Office
                  </p>
                </div>
              </div>
              <div className="relative pl-8 border-l-2 border-slate-200 pb-0 last:pb-0 last:border-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-300 border-2 border-white shadow-sm" />
                <div>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold text-slate-700">
                      DEPARTURE SCAN
                    </h4>
                    <span className="text-[10px] font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                      Oct 22
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Istanbul (IST) Transit
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
              <h2 className="text-slate-700 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <Camera size={16} /> Digital Evidence
              </h2>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="aspect-video bg-slate-200 rounded-lg relative overflow-hidden group">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Box size={40} />
                  </div>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Intake Condition
                  </span>
                  <span className="text-slate-400">Terminal MRT-01</span>
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-200 rounded-lg aspect-video flex flex-col items-center justify-center gap-2 bg-slate-50">
                <Camera className="text-slate-300" size={32} />
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  Awaiting Delivery Proof
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
