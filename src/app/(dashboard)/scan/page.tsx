'use client';

import { useState, useRef } from 'react';
import {
  ScanBarcode,
  Camera,
  CheckCircle,
  Package,
  Scale,
  Trash2,
  ArrowRight,
  Save,
  RotateCcw,
} from 'lucide-react';
import { toast } from 'sonner';

type ScannedItem = {
  id: string;
  barcode: string;
  type: string;
  origin: string;
  weight: string;
  timestamp: Date;
  status: 'valid' | 'invalid';
};

export default function ScanPage() {
  const [batch, setBatch] = useState<ScannedItem[]>([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [weightInput, setWeightInput] = useState('');
  const [isProcessingImg, setIsProcessingImg] = useState(false);
  const [scanMode, setScanMode] = useState<'INBOUND' | 'OUTBOUND'>('INBOUND');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const weightRef = useRef<HTMLInputElement>(null);

  const parseBarcode = (code: string) => {
    const clean = code.toUpperCase().trim();
    const isS10 = /^[A-Z]{2}[0-9]{9}[A-Z]{2}$/.test(clean);

    let type = 'Unknown';
    let origin = 'Unknown';

    if (isS10) {
      const prefix = clean.substring(0, 2);
      const suffix = clean.substring(11, 13);

      if (prefix.startsWith('E')) type = 'EMS Express';
      else if (prefix.startsWith('C')) type = 'Parcel';
      else if (prefix.startsWith('R')) type = 'Registered Mail';
      else if (prefix.startsWith('L')) type = 'Untracked Letter';

      origin = suffix;
    }

    return { barcode: clean, type, origin, status: isS10 ? 'valid' : 'invalid' };
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;

    weightRef.current?.focus();
  };

  const handleWeightSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput) return;

    const details = parseBarcode(barcodeInput);
    const newItem: ScannedItem = {
      id: Date.now().toString(),
      barcode: details.barcode,
      type: details.type,
      origin: details.origin,
      weight: weightInput || '0.00',
      timestamp: new Date(),
      status: details.status as ScannedItem['status'],
    };

    setBatch([newItem, ...batch]);

    setBarcodeInput('');
    setWeightInput('');
    barcodeRef.current?.focus();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingImg(true);

    setTimeout(() => {
      const mockResult = 'RR123456789SO';
      setBarcodeInput(mockResult);
      setIsProcessingImg(false);
      weightRef.current?.focus();
    }, 1500);
  };

  const removeItem = (id: string) => {
    setBatch(batch.filter((item) => item.id !== id));
  };

  const submitBatch = async () => {
    if (batch.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/scan/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: batch }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Batch submitted to database (${data.count} items).`);
        setBatch([]);
      } else {
        toast.error('Failed to save batch. Please try again.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Connection error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <ScanBarcode className="text-auth-button" /> Scan Station
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Batch ID: <span className="font-mono text-slate-700">#B-9921</span> -
            <span className="ml-2 text-green-600">Scanner Ready</span>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setScanMode('INBOUND')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                scanMode === 'INBOUND'
                  ? 'bg-white text-auth-button shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Inbound
            </button>
            <button
              onClick={() => setScanMode('OUTBOUND')}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                scanMode === 'OUTBOUND'
                  ? 'bg-white text-auth-button shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Outbound
            </button>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-400 uppercase">Items in Batch</p>
            <p className="text-2xl font-black text-slate-900 leading-none">{batch.length}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col lg:flex-row">
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl border-2 border-auth-button/30 shadow-lg relative overflow-hidden">
            {isProcessingImg && (
              <div className="absolute inset-0 bg-white/90 z-20 flex flex-col items-center justify-center text-auth-button">
                <ScanBarcode className="w-12 h-12 animate-pulse mb-2" />
                <p className="font-bold animate-pulse">Processing Image...</p>
              </div>
            )}

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  1. Scan Barcode (or Upload)
                </label>
                <div className="flex gap-3">
                  <form onSubmit={handleBarcodeSubmit} className="flex-1">
                    <input
                      ref={barcodeRef}
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className="w-full h-16 px-6 text-3xl font-mono font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-auth-button focus:ring-4 focus:ring-auth-button/10 outline-none transition-all placeholder:text-slate-300 uppercase"
                      placeholder="SCAN ID..."
                      autoFocus
                    />
                  </form>

                  <label className="w-16 h-16 bg-slate-800 text-white rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-700 active:scale-95 transition-all shadow-md">
                    <Camera size={28} />
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              <div
                className={`transition-all duration-300 ${
                  barcodeInput ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-2'
                }`}
              >
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                  2. Enter Weight (kg)
                </label>
                <form onSubmit={handleWeightSubmit} className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      ref={weightRef}
                      type="number"
                      step="0.01"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      className="w-full h-16 pl-6 pr-16 text-3xl font-bold text-slate-900 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-auth-button focus:ring-4 focus:ring-auth-button/10 outline-none transition-all"
                      placeholder="0.00"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                      KG
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!barcodeInput}
                    className="w-32 bg-auth-button text-white rounded-xl font-bold text-lg shadow-md hover:bg-auth-buttonHover disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    ADD <ArrowRight size={20} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {batch.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-6 flex items-center gap-6 animate-in slide-in-from-top-4 fade-in duration-300">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100 text-green-600">
                <CheckCircle size={40} />
              </div>
              <div>
                <p className="text-xs font-bold text-green-600 uppercase mb-1">Successfully Added</p>
                <h2 className="text-3xl font-black text-slate-900 font-mono">
                  {batch[0].barcode}
                </h2>
                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Package size={14} /> {batch[0].type}
                  </span>
                  <span className="flex items-center gap-1">
                    <Scale size={14} /> {batch[0].weight} kg
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-xl min-h-[200px]">
              <Package size={48} className="mb-2" />
              <p className="font-bold">Ready for first scan</p>
            </div>
          )}
        </div>

        <div className="w-full lg:w-96 bg-white border-l border-slate-200 flex flex-col h-[400px] lg:h-auto shrink-0">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Current Batch</h3>
            <button
              onClick={() => setBatch([])}
              className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
            >
              <RotateCcw size={12} /> Clear
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {batch.map((item) => (
              <div
                key={item.id}
                className="group flex justify-between items-center p-3 rounded-lg border border-slate-100 bg-white hover:border-auth-button/30 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-mono font-bold text-slate-800">{item.barcode}</p>
                  <p className="text-[10px] text-slate-500 uppercase">
                    {item.type} - {item.weight} kg
                  </p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {batch.length === 0 && (
              <p className="text-center text-xs text-slate-400 py-10">No items in batch yet.</p>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-slate-500">Total Items</span>
              <span className="font-bold text-slate-900">{batch.length}</span>
            </div>
            <button
              onClick={submitBatch}
              disabled={batch.length === 0 || isSubmitting}
              className="w-full py-3 bg-auth-sidebarFrom text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save size={18} /> Submit Batch
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
