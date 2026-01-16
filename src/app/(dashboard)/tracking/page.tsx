'use client';

import { useState } from 'react';
import {
  Search,
  Truck,
  FileText,
  History,
  CheckCircle,
  AlertTriangle,
  Package,
  ArrowRight,
  Activity,
  MapPin,
} from 'lucide-react';
import { countryCodeToFlag } from '@/lib/tracking-utils';

export default function TrackingPage() {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/tracking/${query}`);
      const result = await res.json();

      if (!result.found && !result.error) {
        setError(result.message || 'Item not found.');
      } else if (result.error) {
        setError(result.error);
      } else {
        setData(result);
      }
    } catch (err) {
      setError('Connection failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-6 md:p-8 gap-8">
      <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full text-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Track & Trace</h1>
          <p className="text-slate-500">Global UPU Network Intelligence.</p>
        </div>

        <div className="relative w-full shadow-xl shadow-slate-200/50 rounded-2xl">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={28} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            maxLength={13}
            className="w-full h-20 pl-16 pr-36 rounded-2xl border-2 border-slate-200 text-3xl font-bold text-slate-900 focus:border-auth-button focus:ring-0 placeholder:text-slate-300 font-mono uppercase transition-all"
            placeholder="RR123456789SO"
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 bg-auth-sidebarFrom text-white px-8 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Activity className="animate-spin" /> : <ArrowRight />}
            {loading ? 'Tracing' : 'Trace'}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-center justify-center gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle />
            <p className="font-bold">{error}</p>
          </div>
        )}
      </div>

      {data && (
        <div className="max-w-6xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-6">
          <div className="bg-auth-sidebarFrom text-white p-8 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            ></div>

            <div className="flex items-center gap-6 relative z-10">
              <div className="bg-white/10 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                <Truck size={40} className="text-auth-accent" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-1">
                  Current Status
                </p>
                <h3 className="text-3xl font-black tracking-tight">{data.status}</h3>
              </div>
            </div>

            <div className="flex gap-12 md:border-l md:border-white/20 md:pl-12 relative z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Origin</p>
                <p className="text-xl font-bold uppercase flex items-center gap-2">
                  {countryCodeToFlag(data.originCode)} {data.origin}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 mb-1">Destination</p>
                <p className="text-xl font-bold uppercase flex items-center gap-2">
                  {countryCodeToFlag(data.destinationCode)} {data.destination}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <FileText size={18} className="text-slate-500" />
                <h2 className="text-slate-700 text-sm font-bold uppercase tracking-widest">Item Dossier</h2>
              </div>
              <div className="p-6 space-y-6 flex-1">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Tracking ID</p>
                  <p className="text-2xl font-mono font-bold text-slate-900 tracking-wider">
                    {data.trackingId}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <Package className="text-blue-600 shrink-0" size={20} />
                    <div>
                      <p className="text-xs font-bold text-blue-800 uppercase">Latest Update</p>
                      <p className="text-xs text-blue-600 mt-1">
                        {data.history[0]?.explanation || 'Processing in network'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm lg:col-span-2 flex flex-col">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                <History size={18} className="text-slate-500" />
                <h2 className="text-slate-700 text-sm font-bold uppercase tracking-widest">Event History</h2>
              </div>
              <div className="p-8 flex-1">
                <div className="space-y-0">
                  {data.history.map((event: any, i: number) => (
                    <div key={i} className="relative pl-10 pb-10 last:pb-0 group">
                      <div className="absolute left-[11px] top-3 bottom-0 w-[2px] bg-slate-200 last:hidden group-hover:bg-slate-300 transition-colors"></div>

                      <div
                        className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 ${
                          i === 0 ? 'bg-auth-button' : 'bg-slate-300'
                        }`}
                      ></div>

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <div>
                          <h4 className={`text-base font-bold ${i === 0 ? 'text-slate-900' : 'text-slate-600'}`}>
                            {event.status}
                          </h4>
                          <p className="text-sm text-slate-500 flex items-center gap-1">
                            <MapPin size={12} /> {event.location} ({event.countryCode})
                          </p>
                        </div>
                        <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold border border-slate-200">
                          {event.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
