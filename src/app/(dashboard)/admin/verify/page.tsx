'use client';

import { useState, useEffect } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function VerificationPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [activeSession, setActiveSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [inputId, setInputId] = useState('');
  const [inputWeight, setInputWeight] = useState('');

  useEffect(() => {
    fetch('/api/admin/verify/list')
      .then((res) => res.json())
      .then((data) => {
        setSessions(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load sessions');
        setLoading(false);
      });
  }, []);

  const handleVerifyItem = async () => {
    if (!inputId) return toast.warning('Enter ID');

    if (activeSession) {
      if (currentImageIndex < activeSession.images.length - 1) {
        setCurrentImageIndex((prev) => prev + 1);
        setInputId('');
        setInputWeight('');
      } else {
        toast.success('Session Complete!');
        setActiveSession(null);
      }
    }

    // TODO: Persist verified item via API.
  };

  return (
    <div className="flex h-full overflow-hidden bg-slate-50">
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-slate-100 font-bold text-slate-700">Pending Verification</div>
        {loading ? (
          <div className="p-4">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => {
                setActiveSession(session);
                setCurrentImageIndex(0);
              }}
              className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${
                activeSession?.id === session.id ? 'bg-blue-50 border-l-4 border-l-auth-button' : ''
              }`}
            >
              <p className="font-bold text-sm text-slate-900">
                {new Date(session.createdAt).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 mt-1">{session.submitter.fullName}</p>
              <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full mt-2 inline-block">
                {session.images.length} Images
              </span>
            </div>
          ))
        )}
      </div>

      {activeSession ? (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
            <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-md">
              Image {currentImageIndex + 1} of {activeSession.images.length} •{' '}
              {activeSession.images[currentImageIndex].type}
            </div>

            <img
              src={activeSession.images[currentImageIndex].base64}
              className="max-w-full max-h-full object-contain"
              alt="Verification Evidence"
            />
          </div>

          <div className="w-96 bg-white border-l border-slate-200 p-6 flex flex-col gap-6 shadow-xl z-20">
            <div>
              <h2 className="text-xl font-black text-slate-900">Verify Data</h2>
              <p className="text-slate-500 text-sm">Transcribe the label from the image.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                  {activeSession.images[currentImageIndex].type === 'BAG'
                    ? 'Receptacle ID (S9)'
                    : 'Item ID (S10)'}
                </label>
                <input
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value.toUpperCase())}
                  className="w-full text-2xl font-mono font-bold border-2 border-slate-200 rounded-xl p-3 focus:border-auth-button focus:ring-0 uppercase"
                  placeholder="Scanning..."
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
                <input
                  value={inputWeight}
                  onChange={(e) => setInputWeight(e.target.value)}
                  className="w-full text-xl font-bold border-2 border-slate-200 rounded-xl p-3 focus:border-auth-button focus:ring-0"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleVerifyItem}
                className="flex-1 bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 flex items-center justify-center gap-2 shadow-lg"
              >
                <Check /> Verify & Next
              </button>
            </div>

            <div className="text-center">
              <button className="text-red-500 text-xs font-bold hover:underline">Mark Image as Unreadable</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-slate-400 bg-slate-50">
          <p>Select a session to begin verification.</p>
        </div>
      )}
    </div>
  );
}
