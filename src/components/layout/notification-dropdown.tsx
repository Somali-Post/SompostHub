'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, Bell, CheckCircle, Info } from 'lucide-react';
import Link from 'next/link';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-auth-button"
      >
        <Bell size={20} />
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-4">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            <button type="button" className="text-xs font-bold text-auth-button hover:underline">
              Mark all as read
            </button>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            <div className="relative flex cursor-pointer gap-3 border-b border-slate-50 p-4 transition-colors hover:bg-slate-50">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-red-500"></div>
              <div className="mt-1 text-red-500">
                <AlertCircle size={16} />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex justify-between">
                  <span className="text-[10px] font-bold uppercase text-red-600">Urgent Alert</span>
                  <span className="text-[10px] text-slate-400">2m ago</span>
                </div>
                <p className="text-sm font-bold leading-tight text-slate-900">
                  Task overdue: Mogadishu Sort Center
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  High priority shipment #SP-4412 has missed the window.
                </p>
              </div>
            </div>

            <div className="relative flex cursor-pointer gap-3 border-b border-slate-50 p-4 transition-colors hover:bg-slate-50">
              <div className="absolute bottom-0 left-0 top-0 w-1 bg-amber-400"></div>
              <div className="mt-1 text-amber-500">
                <CheckCircle size={16} />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex justify-between">
                  <span className="text-[10px] font-bold uppercase text-amber-600">
                    Action Required
                  </span>
                  <span className="text-[10px] text-slate-400">1h ago</span>
                </div>
                <p className="text-sm font-bold leading-tight text-slate-900">
                  Delivery proof pending
                </p>
                <p className="mt-1 text-xs text-slate-500">Item #SP-9928 needs verification.</p>
              </div>
            </div>

            <div className="flex cursor-pointer gap-3 p-4 opacity-70 transition-colors hover:bg-slate-50">
              <div className="mt-1 text-slate-400">
                <Info size={16} />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex justify-between">
                  <span className="text-[10px] font-bold uppercase text-slate-500">System Info</span>
                  <span className="text-[10px] text-slate-400">3h ago</span>
                </div>
                <p className="text-sm font-medium leading-tight text-slate-900">
                  New system update available
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 bg-slate-50 p-3">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-auth-button py-2 text-sm font-bold text-white transition-colors hover:bg-auth-buttonHover"
            >
              View all in Notification Center <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
