'use client';

import { useState } from 'react';
import { Camera, CheckCircle, Package, User } from 'lucide-react';

export default function DeliveryPage() {
  const [trackingId, setTrackingId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (!trackingId || !customerName) {
      alert('Please fill in required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsConfirmed(true);
  };

  const resetForm = () => {
    setTrackingId('');
    setCustomerName('');
    setIdNumber('');
    setIsConfirmed(false);
  };

  return (
    <div className="relative flex h-full flex-col gap-8 overflow-y-auto p-6 pb-12 md:p-8 xl:flex-row">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-auth-sidebarFrom">Delivery Verification</h1>
            <p className="text-slate-500">Scan ID and confirm handover.</p>
          </div>
        </div>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-auth-button px-2 py-1 text-xs font-bold text-white">01</span>
            <h2 className="text-xl font-bold text-slate-900">Proof of Delivery</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 transition-all hover:border-auth-button hover:bg-auth-button/5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 group-hover:bg-white">
                <Camera className="text-slate-400 group-hover:text-auth-button" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900">Capture Package</p>
                <p className="text-xs text-slate-500">Photo of label &amp; condition</p>
              </div>
            </div>
            <div className="group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-white p-8 transition-all hover:border-auth-button hover:bg-auth-button/5">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 group-hover:bg-white">
                <User className="text-slate-400 group-hover:text-auth-button" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900">Capture Recipient ID</p>
                <p className="text-xs text-slate-500">National ID / Passport</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded bg-auth-button px-2 py-1 text-xs font-bold text-white">02</span>
            <h2 className="text-xl font-bold text-slate-900">Verification Details</h2>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(event) => setTrackingId(event.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold uppercase focus:border-auth-button focus:ring-auth-button"
                  placeholder="RR123456789SO"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium focus:border-auth-button focus:ring-auth-button"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-bold uppercase text-slate-400">
                  ID Number
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(event) => setIdNumber(event.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium focus:border-auth-button focus:ring-auth-button"
                  placeholder="Optional"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside className="flex w-full flex-col gap-6 xl:w-96">
        <div className="sticky top-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-slate-900">
            <CheckCircle className="text-auth-button" /> Finalize Delivery
          </h3>

          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-lg border border-slate-100 bg-slate-50 p-4">
              <div className="flex size-12 items-center justify-center rounded bg-white text-slate-400 shadow-sm">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Package</p>
                <p className="text-sm font-bold text-slate-900">{trackingId || '---'}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <label className="mb-6 flex cursor-pointer gap-3">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-slate-300 text-auth-button focus:ring-auth-button"
                />
                <span className="text-xs leading-tight text-slate-600">
                  I confirm that I have verified the Recipient ID matches the person present.
                </span>
              </label>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!trackingId || !customerName || isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-auth-button py-4 text-lg font-black text-white shadow-xl transition-all hover:bg-auth-buttonHover disabled:opacity-50 disabled:shadow-none"
              >
                {isSubmitting ? 'Processing...' : 'CONFIRM DELIVERY'}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {isConfirmed ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mb-2 text-3xl font-black text-slate-900">Delivery Confirmed</h2>
            <p className="mb-8 text-center text-slate-500">
              Package{' '}
              <span className="font-mono font-bold text-slate-700">{trackingId}</span> has been
              successfully marked as delivered.
            </p>
            <button
              type="button"
              onClick={resetForm}
              className="rounded-xl bg-auth-button px-8 py-3 font-bold text-white shadow-lg transition-all hover:bg-auth-buttonHover"
            >
              Process Next Delivery
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
