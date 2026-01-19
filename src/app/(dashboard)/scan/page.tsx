'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Box, CheckCircle, Camera, X } from 'lucide-react';
import { toast } from 'sonner';
import { parseS9, type S9Data } from '@/lib/s9';
import { Html5Qrcode } from 'html5-qrcode';

type ScannedItem = {
  barcode: string;
  timestamp: Date;
};

export default function ScanPage() {
  const [currentBag, setCurrentBag] = useState<S9Data | null>(null);
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    let scanner: Html5Qrcode | null = null;
    let timer: NodeJS.Timeout;

    if (isScanning) {
      // Small delay to ensure DOM is ready and 'reader' div is mounted
      timer = setTimeout(() => {
        try {
          // Check if element exists
          if (!document.getElementById('reader')) {
             console.error("Reader element not found");
             return;
          }

          scanner = new Html5Qrcode('reader');
          scannerRef.current = scanner;

          scanner
            .start(
              { facingMode: 'environment' },
              {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
              },
              (decodedText) => {
                // Success
                handleScanSuccess(decodedText);
              },
              (errorMessage) => {
                // ignore errors during scanning
              }
            )
            .catch((err) => {
              console.error('Failed to start scanner', err);
              setIsScanning(false);
              toast.error('Camera start failed. Please allow camera access.');
            });
        } catch (e) {
          console.error("Error initializing Html5Qrcode", e);
          setIsScanning(false);
        }
      }, 300); // 300ms delay to be safe
    }

    return () => {
        clearTimeout(timer);
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear();
                scannerRef.current = null;
            }).catch(err => {
                console.error("Cleanup failed", err); 
            });
        }
    };
  }, [isScanning]);

  const processCode = (val: string) => {
    const raw = val.trim().toUpperCase();

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

  const handleScanSuccess = (decodedText: string) => {
    // Stop scanning immediately
    if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
           scannerRef.current?.clear();
           setIsScanning(false);
           setInput(decodedText);
           processCode(decodedText);
        }).catch((err) => {
            console.error("Failed to stop scanner", err);
            setIsScanning(false);
            // Even if stop fails, proceed to process
            setInput(decodedText);
            processCode(decodedText);
        });
    } else {
        setIsScanning(false);
        setInput(decodedText);
        processCode(decodedText);
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    processCode(input);
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
    <div className="flex flex-col md:flex-row h-full bg-slate-50 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden relative">
      
      {/* Scanner Overlay */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm bg-black rounded-xl overflow-hidden relative aspect-square">
             <div id="reader" className="w-full h-full"></div>
             {/* Visual guide */}
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[80%] h-[80%] border-2 border-white/50 rounded-lg"></div>
             </div>
          </div>
          <p className="text-white mt-4 text-sm opacity-80 text-center">
            Point camera at a barcode.<br/>
            Supports S9 (Bag) and S10 (Item) labels.
          </p>
          <button 
            onClick={() => setIsScanning(false)} 
            className="mt-8 bg-white text-black px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-slate-200"
          >
            <X size={20} /> Stop Scanning
          </button>
        </div>
      )}

      <div className="shrink-0 md:hidden flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Scan Station</h1>
          <p className="text-slate-500 text-xs">
            {currentBag ? 'Bag Open' : 'Scan Bag to Start'}
          </p>
        </div>
        {currentBag && <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded">ACTIVE</span>}
      </div>

      <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden">
        {/* Mobile Camera Button */}
        <button
          className="md:hidden flex-1 max-h-64 bg-slate-900 text-white rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl active:scale-95 transition-transform"
          onClick={() => setIsScanning(true)}
        >
          <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
            <Camera size={40} />
          </div>
          <span className="font-bold text-lg uppercase tracking-widest text-white/80">Tap to Scan</span>
        </button>

        <div className="hidden md:block">
          <h1 className="text-2xl font-black text-slate-900">Scan Station</h1>
          <p className="text-slate-500">
            {currentBag ? 'Scanning items inside bag...' : 'Scan a Receptacle Label to begin.'}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className={`p-4 md:p-8 rounded-2xl border-4 shadow-sm transition-all ${currentBag ? 'bg-white border-auth-button' : 'bg-slate-200 border-slate-300'
              }`}
          >
            <form onSubmit={handleScan} className="flex gap-4">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="flex-1 text-2xl md:text-3xl font-mono font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-400 min-w-0"
                placeholder={currentBag ? 'SCAN ITEM...' : 'SCAN BAG (S9)...'}
                autoFocus
              />
              <button type="submit" className="bg-slate-900 text-white p-3 md:p-4 rounded-xl shrink-0">
                <ArrowRight />
              </button>
            </form>
          </div>

          {currentBag && (
            <div className="bg-auth-sidebarFrom text-white p-4 md:p-6 rounded-xl shadow-lg flex justify-between items-center animate-in slide-in-from-bottom-4">
              <div>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest">
                  Current Scans
                </p>
                <div className="flex gap-4 mt-1 text-sm opacity-80">
                  <p className="font-mono font-bold">{currentBag.id.slice(0, 10)}...</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">{items.length}</p>
                <p className="text-xs opacity-60 uppercase">Items</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex w-96 bg-white rounded-xl border border-slate-200 flex-col overflow-hidden">
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
  );
}
