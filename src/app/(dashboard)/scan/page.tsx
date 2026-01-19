'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Box, CheckCircle, Camera, Layers, X } from 'lucide-react';
import { toast } from 'sonner';
import { parseS9, type S9Data } from '@/lib/s9';
import { Html5Qrcode } from 'html5-qrcode';

type ScannedItem = {
  barcode: string;
  timestamp: Date;
};

type SessionBag = S9Data & {
  items: ScannedItem[];
};

export default function ScanPage() {
  const [sessionBags, setSessionBags] = useState<SessionBag[]>([]);
  const [currentBag, setCurrentBag] = useState<S9Data | null>(null);
  const [currentItems, setCurrentItems] = useState<ScannedItem[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isReviewing, setIsReviewing] = useState(false);
  const [lastScan, setLastScan] = useState('');
  const [isOcrProcessing, setIsOcrProcessing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartingRef = useRef(false);

  const totalItems = sessionBags.reduce((sum, bag) => sum + bag.items.length, 0) + currentItems.length;
  const totalBags = sessionBags.length + (currentBag ? 1 : 0);

  const normalizeBarcode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const extractIdsFromText = (text: string) => {
    const normalized = normalizeBarcode(text);
    const s9s: string[] = [];
    const s10s: string[] = [];
    const seen = new Set<string>();

    for (let i = 0; i <= normalized.length - 29; i += 1) {
      const candidate = normalized.slice(i, i + 29);
      const parsed = parseS9(candidate);
      if (parsed.isValid && !seen.has(parsed.id)) {
        s9s.push(parsed.id);
        seen.add(parsed.id);
      }
    }

    const s10Matches = normalized.match(/[A-Z]{2}[0-9]{9}[A-Z]{2}/g) ?? [];
    for (const match of s10Matches) {
      if (!seen.has(match)) {
        s10s.push(match);
        seen.add(match);
      }
    }

    return { s9s, s10s };
  };

  const applyOcrResults = (s9s: string[], s10s: string[]) => {
    let activeBag = currentBag;
    let items = currentItems;
    let openedBag: S9Data | null = null;

    if (!activeBag && s9s.length > 0) {
      const nextId = s9s.find((id) => !sessionBags.some((bag) => bag.id === id));
      if (nextId) {
        const parsed = parseS9(nextId);
        if (parsed.isValid) {
          activeBag = parsed;
          items = [];
          openedBag = parsed;
        } else {
          setLastScan('Invalid bag scan');
        }
      } else {
        setLastScan('Duplicate bag ignored');
      }
    } else if (activeBag && s9s.length > 0) {
      setLastScan('Close bag before new receptacle');
      toast.warning('Close the current bag before scanning another receptacle.');
    }

    const addedItems: ScannedItem[] = [];
    if (activeBag && s10s.length > 0) {
      const existing = new Set(items.map((item) => item.barcode));
      for (const code of s10s) {
        if (!existing.has(code)) {
          existing.add(code);
          addedItems.push({ barcode: code, timestamp: new Date() });
        }
      }
      if (addedItems.length > 0) {
        items = [...addedItems, ...items];
      }
    } else if (!activeBag && s10s.length > 0) {
      setLastScan('Waiting for bag scan');
      toast.warning('Scan a Receptacle (S9) to start a bag.');
    }

    if (openedBag) {
      setCurrentBag(openedBag);
      setCurrentItems(items);
      setInput('');
      setLastScan(`Bag opened: ${openedBag.id}`);
      toast.success('Bag Opened');
    } else if (activeBag && addedItems.length > 0) {
      setCurrentItems(items);
      setInput('');
      setLastScan(`OCR added ${addedItems.length} items`);
      toast.success(`${addedItems.length} item${addedItems.length === 1 ? '' : 's'} added`);
    } else if (!openedBag && addedItems.length === 0 && s9s.length === 0 && s10s.length === 0) {
      setLastScan('No IDs found in image');
      toast.error('No IDs found in image.');
    }
  };

  const stopScanner = async () => {
    if (!scannerRef.current) return;
    try {
      if (scannerRef.current.isScanning) {
        await scannerRef.current.stop();
      }
    } catch (err) {
      console.error('Failed to stop scanner', err);
    }
    try {
      scannerRef.current.clear();
    } catch (err) {
      console.error('Failed to clear scanner', err);
    }
    scannerRef.current = null;
  };

  const processCode = (val: string) => {
    const raw = normalizeBarcode(val);
    if (!raw) return;

    if (!currentBag) {
      const s9 = parseS9(raw);
      if (s9.isValid) {
        if (sessionBags.some((bag) => bag.id === s9.id)) {
          toast.error('Bag already scanned in this session');
          setLastScan('Duplicate bag ignored');
          return;
        }
        setCurrentBag(s9);
        setCurrentItems([]);
        setInput('');
        setLastScan(`Bag opened: ${s9.id}`);
        inputRef.current?.focus();
        toast.success('Bag Opened');
        return;
      }

      if (raw.length === 13) {
        toast.warning('Scan a Receptacle (S9) to start a bag.');
        setLastScan('Waiting for bag scan');
        return;
      }

      toast.error('Invalid Receptacle ID (S9)');
      setLastScan('Invalid bag scan');
      return;
    }

    if (raw.length === 29) {
      toast.warning('Close the current bag before scanning another receptacle.');
      setLastScan('Close bag before new receptacle');
      return;
    }

    if (raw.length === 13) {
      if (currentItems.some((item) => item.barcode === raw)) {
        toast.warning('Item already scanned');
        setInput('');
        setLastScan('Duplicate item ignored');
        return;
      }
      setCurrentItems((prev) => [{ barcode: raw, timestamp: new Date() }, ...prev]);
      setInput('');
      setLastScan(`Item added: ${raw}`);
      toast.success('Item Added');
      return;
    }

    toast.error('Invalid Item ID (S10)');
    setLastScan('Invalid item scan');
  };

  const handleScanSuccess = (decodedText: string) => {
    const normalized = normalizeBarcode(decodedText);
    stopScanner()
      .catch(() => {})
      .finally(() => {
        setIsScanning(false);
        setInput(normalized);
        processCode(normalized);
      });
  };

  const startScanner = async () => {
    if (isStartingRef.current) return;
    if (scannerRef.current?.isScanning) return;

    isStartingRef.current = true;
    try {
      if (!document.getElementById('reader')) {
        console.error('Reader element not found');
        return;
      }

      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode('reader');
      }

      await scannerRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 12,
          qrbox: { width: 260, height: 260 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleScanSuccess(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error('Failed to start scanner', err);
      toast.error('Camera start failed. Try again.');
    } finally {
      isStartingRef.current = false;
    }
  };

  const handleManualScan = async () => {
    if (!isScanning) {
      setIsScanning(true);
      return;
    }
    await stopScanner();
    await startScanner();
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isScanning) {
      timer = setTimeout(() => {
        void startScanner();
      }, 250);
    }

    return () => {
      clearTimeout(timer);
      void stopScanner();
    };
  }, [isScanning]);

  const handleOcrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsOcrProcessing(true);
    const toastId = toast.loading('Reading image...');

    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng');
      const result = await worker.recognize(file);
      await worker.terminate();
      toast.dismiss(toastId);

      const { s9s, s10s } = extractIdsFromText(result.data.text || '');
      applyOcrResults(s9s, s10s);
    } catch (err) {
      console.error('OCR failed', err);
      toast.dismiss(toastId);
      toast.error('Could not read IDs from image.');
      setLastScan('OCR failed');
    } finally {
      setIsOcrProcessing(false);
      e.target.value = '';
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input) return;
    processCode(input);
  };

  const closeBag = () => {
    if (!currentBag) return;

    const newBagEntry: SessionBag = {
      ...currentBag,
      items: currentItems,
    };

    setSessionBags((prev) => [newBagEntry, ...prev]);
    setLastScan(`Bag closed: ${currentBag.id}`);
    setCurrentBag(null);
    setCurrentItems([]);
    setInput('');
    inputRef.current?.focus();
    toast.success('Bag Closed & Added to Session');
  };

  const handleNextBag = () => {
    inputRef.current?.focus();
  };

  const openReview = () => {
    if (currentBag) {
      toast.warning('Close the current bag before reviewing.');
      return;
    }
    if (sessionBags.length === 0) {
      toast.warning('No bags to review yet.');
      return;
    }
    setIsReviewing(true);
  };

  const submitSession = async () => {
    if (sessionBags.length === 0) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/scan/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bags: sessionBags }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(`Session Saved! (${data.count} bags)`);
        setSessionBags([]);
        setIsReviewing(false);
        setCurrentBag(null);
        setCurrentItems([]);
        setInput('');
        setLastScan('');
        inputRef.current?.focus();
      } else {
        toast.error('Failed to save session');
      }
    } catch (e) {
      toast.error('Connection Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReviewing) {
    return (
      <div className="flex flex-col h-full bg-slate-50 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Review Session</h1>
            <p className="text-slate-500 text-sm">
              {sessionBags.length} bags, {totalItems} items
            </p>
          </div>
          <button
            onClick={() => setIsReviewing(false)}
            className="hidden md:inline-flex px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50"
          >
            Back to Scanning
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200">
          {sessionBags.map((bag, i) => (
            <div key={bag.id} className="p-4 border-b border-slate-100 last:border-b-0">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-xs font-bold text-slate-500">BAG {i + 1}</p>
                  <p className="font-mono text-sm text-slate-800 break-all">{bag.id}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {bag.origin} to {bag.destination}
                  </p>
                </div>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold shrink-0">
                  {bag.items.length} Items
                </span>
              </div>
              {bag.items.length > 0 ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bag.items.map((item) => (
                    <div
                      key={`${bag.id}-${item.barcode}-${item.timestamp.toISOString()}`}
                      className="flex justify-between items-center p-2 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <span className="font-mono text-xs text-slate-800">{item.barcode}</span>
                      <CheckCircle size={14} className="text-green-500" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-xs text-slate-400">Empty bag</p>
              )}
            </div>
          ))}
          {sessionBags.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
              <Box size={40} className="mb-2 opacity-20" />
              <p className="text-sm">No bags in this session.</p>
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <button
            onClick={() => setIsReviewing(false)}
            className="md:hidden w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-bold hover:bg-slate-50"
          >
            Back to Scanning
          </button>
          <button
            onClick={submitSession}
            disabled={sessionBags.length === 0 || isSubmitting}
            className="w-full md:w-auto md:ml-auto px-6 py-3 rounded-xl bg-green-600 text-white font-bold shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Submit Session'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-6 gap-4 md:gap-6 overflow-hidden relative">
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept="image/*"
        capture="environment"
        onChange={handleOcrUpload}
      />
      <div
        className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4 transition-opacity ${
          isScanning ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-sm bg-black rounded-xl overflow-hidden relative aspect-square">
          <div id="reader" className="w-full h-full"></div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[80%] h-[80%] border-2 border-white/50 rounded-lg"></div>
          </div>
        </div>
        <p className="text-white mt-4 text-sm opacity-80 text-center">
          Point camera at a barcode.
          <br />
          Auto-detect is on. Tap Scan to retry.
        </p>

        <div className="flex flex-col gap-3 mt-6 w-full max-w-xs">
          <button
            onClick={() => void handleManualScan()}
            className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-slate-200 active:scale-95 transition-all"
          >
            <Camera size={20} /> Scan
          </button>

          <button
            onClick={() => setIsScanning(false)}
            className="bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/30 active:scale-95 transition-all"
          >
            <X size={20} /> Stop Scanning
          </button>
        </div>
      </div>

      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Scan Session</h1>
          <p className="text-slate-500 text-sm">
            {currentBag ? 'Scanning items...' : 'Ready for next bag.'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase">Total Bags</p>
          <p className="text-3xl font-black text-auth-button">{totalBags}</p>
          <p className="text-xs text-slate-400 mt-1">{totalItems} items</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 gap-4 md:gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 md:gap-6 overflow-hidden">
          <button
            className="md:hidden h-36 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
            onClick={() => setIsScanning(true)}
          >
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <Camera size={28} />
            </div>
            <span className="font-bold text-sm uppercase tracking-widest text-white/80">Tap to Scan</span>
          </button>

          <div
            className={`p-4 md:p-6 rounded-2xl border-4 shadow-sm transition-all ${
              currentBag ? 'bg-white border-auth-button' : 'bg-slate-200 border-slate-300'
            }`}
          >
            <form onSubmit={handleScan} className="flex gap-4">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                className="flex-1 text-2xl md:text-3xl font-mono font-bold bg-transparent border-none focus:ring-0 placeholder:text-slate-400 min-w-0"
                placeholder={currentBag ? 'SCAN ITEM (S10)' : 'SCAN BAG (S9)'}
                autoFocus
              />
              <button type="submit" className="bg-slate-900 text-white p-3 md:p-4 rounded-xl shrink-0">
                <ArrowRight />
              </button>
            </form>
          </div>
          {lastScan && (
            <p className="text-xs text-slate-500 px-1" aria-live="polite">
              Last scan: {lastScan}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isOcrProcessing}
              className="w-full md:w-auto px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-bold uppercase tracking-wide hover:bg-slate-50 disabled:opacity-60"
            >
              {isOcrProcessing ? 'Processing OCR...' : 'Upload Image (OCR)'}
            </button>
            {isOcrProcessing && (
              <span className="text-xs text-slate-400">This can take a few seconds.</span>
            )}
          </div>

          {currentBag ? (
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm animate-in slide-in-from-bottom-2">
              <div className="p-4 bg-auth-button text-white flex justify-between items-center gap-3">
                <div>
                  <p className="text-xs font-bold opacity-80 uppercase">Active Receptacle</p>
                  <p className="font-mono font-bold text-lg truncate max-w-[200px] md:max-w-none">
                    {currentBag.id}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-1 rounded-full">
                    {currentItems.length} Items
                  </span>
                  <button
                    onClick={closeBag}
                    className="bg-white text-auth-button px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100"
                  >
                    Close Bag
                  </button>
                </div>
              </div>
              <div className="max-h-60 md:max-h-[60vh] overflow-y-auto p-2 space-y-2">
                {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                    <div
                      key={`${item.barcode}-${item.timestamp.toISOString()}`}
                      className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100"
                    >
                      <span className="font-mono font-bold text-slate-800">{item.barcode}</span>
                      <CheckCircle size={16} className="text-green-500" />
                    </div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400">
                    <Box size={32} className="mb-2 opacity-20" />
                    <p className="text-sm">Empty Bag (Scan items or Close)</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl text-slate-400">
              <Layers size={48} className="mb-4 opacity-20" />
              <p className="font-bold">Scan a Bag Label to Start</p>
              {sessionBags.length > 0 && (
                <button
                  onClick={handleNextBag}
                  className="mt-4 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold uppercase tracking-widest"
                >
                  Next Bag
                </button>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex w-96 bg-white rounded-xl border border-slate-200 flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
            Session Manifest
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {currentBag && (
              <div className="p-3 border border-auth-button/20 rounded-lg bg-auth-button/5">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-auth-button">ACTIVE BAG</span>
                  <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold">
                    {currentItems.length} Items
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-800 truncate">{currentBag.id}</p>
              </div>
            )}
            {sessionBags.map((bag, i) => (
              <div
                key={bag.id}
                className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-slate-500">BAG {i + 1}</span>
                  <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold">
                    {bag.items.length} Items
                  </span>
                </div>
                <p className="font-mono text-xs text-slate-800 truncate">{bag.id}</p>
              </div>
            ))}
            {sessionBags.length === 0 && !currentBag && (
              <p className="text-center text-xs text-slate-400 py-8">No bags closed yet.</p>
            )}
          </div>
          <div className="p-4 border-t border-slate-100">
            {currentBag ? (
              <button
                onClick={closeBag}
                className="w-full py-3 mb-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
              >
                Close Bag
              </button>
            ) : (
              sessionBags.length > 0 && (
                <button
                  onClick={handleNextBag}
                  className="w-full py-3 mb-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
                >
                  Next Bag
                </button>
              )
            )}
            <button
              onClick={openReview}
              disabled={sessionBags.length === 0 || isSubmitting || !!currentBag}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Review & Submit
            </button>
            {currentBag && (
              <p className="text-xs text-slate-400 mt-2">Close the active bag to review.</p>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 font-bold text-slate-700">
          Session Manifest
        </div>
        <div className="max-h-40 overflow-y-auto p-2 space-y-2">
          {currentBag && (
            <div className="p-3 border border-auth-button/20 rounded-lg bg-auth-button/5">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-auth-button">ACTIVE BAG</span>
                <span className="text-[10px] bg-white px-2 py-0.5 rounded-full font-bold">
                  {currentItems.length} Items
                </span>
              </div>
              <p className="font-mono text-xs text-slate-800 truncate">{currentBag.id}</p>
            </div>
          )}
          {sessionBags.map((bag, i) => (
            <div
              key={bag.id}
              className="p-3 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-xs text-slate-500">BAG {i + 1}</span>
                <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full font-bold">
                  {bag.items.length} Items
                </span>
              </div>
              <p className="font-mono text-xs text-slate-800 truncate">{bag.id}</p>
            </div>
          ))}
          {sessionBags.length === 0 && !currentBag && (
            <p className="text-center text-xs text-slate-400 py-4">No bags closed yet.</p>
          )}
        </div>
        <div className="p-4 border-t border-slate-100">
          {currentBag ? (
            <button
              onClick={closeBag}
              className="w-full py-3 mb-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50"
            >
              Close Bag
            </button>
          ) : (
            sessionBags.length > 0 && (
              <button
                onClick={handleNextBag}
                className="w-full py-3 mb-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800"
              >
                Next Bag
              </button>
            )
          )}
          <button
            onClick={openReview}
            disabled={sessionBags.length === 0 || isSubmitting || !!currentBag}
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Review & Submit
          </button>
          {currentBag && (
            <p className="text-xs text-slate-400 mt-2">Close the active bag to review.</p>
          )}
        </div>
      </div>
    </div>
  );
}
