'use client';

import { useRef, useState } from 'react';
import { ArrowRight, Box, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { parseS9, type S9Data } from '@/lib/s9';

type ScannedItem = {
  barcode: string;
  timestamp: Date;
};

export default function ScanPage() {
  const [currentBag, setCurrentBag] = useState<S9Data | null>(null);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;

    const raw = input.trim().toUpperCase();

    if (!currentBag) {
      if (raw.length === 29) {
        const s9 = parseS9(raw);
        if (s9.isValid) {
          setCurrentBag(s9);
          toast.success(`Opened Bag: ${s9.origin} -> ${s9.destination}`);
          setInput('');
        } else {
          toast.error('Invalid Receptacle ID format');
        }
      } else {
        toast.warning('Please scan a Receptacle Label (29 chars) first.');
      }
      return;
    }

    if (raw.length === 13) {
      if (items.find((item) => item.barcode === raw)) {
        toast.error('Item already scanned in this bag');
        setInput('');
        return;
      }

      setItems((prev) => [{ barcode: raw, timestamp: new Date() }, ...prev]);
      toast.success(`Item ${raw} added`);
      setInput('');
      return;
    }

    toast.error('Invalid Item ID. Expecting 13 characters.');
  };

  const handleFinishBag = async () => {
    if (!currentBag) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/scan/receptacle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receptacle: currentBag,
          items,
        }),
      });

      if (res.ok) {
        toast.success('Receptacle & Items Saved!');
        setCurrentBag(null);
        setItems([]);
        setInput('');
        inputRef.current?.focus();
      } else {
        toast.error('Failed to save.');
      }
    } catch (e) {
      toast.error('Connection Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6 gap-6 overflow-hidden">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Scan Station</h1>
        <p className="text-slate-500">
          {currentBag ? 'Scanning items inside bag...' : 'Scan a Receptacle Label to begin.'}
        </p>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-6">
          <div
            className={`p-8 rounded-2xl border-4 shadow-sm transition-all ${
              currentBag ? 'bg-white border-auth-button' : 'bg-slate-200 border-slate-300'
            }`}
          >
            <form onSubmit={handleScan} className="flex gap-4">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="flex-1 text-3xl font-mono font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-400"
                placeholder={currentBag ? 'SCAN ITEM (S10)...' : 'SCAN BAG (S9)...'}
                autoFocus
              />
              <button type="submit" className="bg-slate-900 text-white p-4 rounded-xl">
                <ArrowRight />
              </button>
            </form>
          </div>

          {currentBag && (
            <div className="bg-auth-sidebarFrom text-white p-6 rounded-xl shadow-lg flex justify-between items-center animate-in slide-in-from-bottom-4">
              <div>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                  Current Receptacle
                </p>
                <p className="text-xl font-mono font-bold mt-1">{currentBag.id}</p>
                <div className="flex gap-4 mt-2 text-sm opacity-80">
                  <span>From: {currentBag.origin}</span>
                  <span>Weight: {currentBag.weightKg} kg</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">{items.length}</p>
                <p className="text-xs opacity-60 uppercase">Items Scanned</p>
              </div>
            </div>
          )}
        </div>

        <div className="w-96 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700 flex justify-between">
            <span>Manifest</span>
            {currentBag && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                OPEN
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Box size={48} className="mb-2 opacity-20" />
                <p className="text-sm">No items scanned yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.barcode}
                    className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
                  >
                    <span className="font-mono font-bold text-slate-800">
                      {item.barcode}
                    </span>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={handleFinishBag}
              disabled={!currentBag || isSubmitting}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2"
            >
              {isSubmitting ? 'Saving...' : 'Close Bag & Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
