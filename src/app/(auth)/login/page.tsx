'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Delete, Check, ArrowRight, User, Lock, Mail, ShieldCheck, Info } from 'lucide-react';
import PinKeypad from '@/components/auth/pin-keypad';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'staff' | 'admin'>('staff');

  // State
  const [staffUsername, setStaffUsername] = useState('');
  const [pin, setPin] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Handlers
  const handlePinPress = (key: string) => {
    if (pin.length < 4) setPin((prev) => prev + key);
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const payload =
        activeTab === 'staff'
          ? { username: staffUsername, pin }
          : { adminEmail: adminEmail, adminPassword: adminPassword };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = data.redirect || '/chat';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* =========================================================================
          MOBILE LAYOUT (Native App Style)
         ========================================================================= */}
      <div className="md:hidden fixed inset-0 flex flex-col bg-white overflow-hidden font-sans">
        {/* 1. Header with Grid & Wave */}
        <div className="relative bg-[#1a3a44] pt-12 pb-24 px-6 flex flex-col items-center justify-center shrink-0">
          {/* Dot Grid Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Logo & Brand */}
          <div className="relative z-10 flex flex-col items-center gap-3">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl ring-4 ring-white/10 mb-2">
              <Image
                src="/logos/logo.png"
                alt="Somali Post"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black text-white tracking-tight">Somali Post</h1>
              <p className="text-[10px] text-[#C2A44D] font-bold uppercase tracking-[0.25em]">
                Employee Hub
              </p>
            </div>
          </div>

          {/* Wavy Bottom SVG */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-[calc(100%+1.3px)] h-[50px]"
              data-name="Layer 1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                fill="#ffffff"
              ></path>
            </svg>
          </div>
        </div>

        {/* 2. Main Content Area */}
        <div className="flex-1 flex flex-col px-6 pb-6 -mt-6 bg-white relative z-10">
          {/* Toggle Pills */}
          <div className="bg-slate-50 p-1.5 rounded-xl flex mb-6 shadow-inner mx-auto w-full max-w-[280px]">
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'staff' ? 'bg-white text-[#1a3a44] shadow-sm' : 'text-slate-400'
              }`}
            >
              Staff
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'admin' ? 'bg-white text-[#1a3a44] shadow-sm' : 'text-slate-400'
              }`}
            >
              Admin
            </button>
          </div>

          {/* STAFF VIEW */}
          {activeTab === 'staff' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Inputs */}
              <div className="space-y-4 mb-auto">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Username
                  </label>
                  <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl mt-1 focus-within:ring-2 focus-within:ring-[#2e7585]/20 focus-within:border-[#2e7585] transition-all">
                    <User size={18} className="text-slate-400" />
                    <input
                      className="bg-transparent border-none w-full text-base font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0 p-0"
                      placeholder="Enter ID"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Security PIN
                  </label>
                  <div className="flex justify-center gap-4 mt-3">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          i < pin.length ? 'bg-[#2e7585] scale-110' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinPress(num.toString())}
                    className="h-14 bg-slate-50 rounded-xl text-xl font-bold text-slate-700 shadow-sm border-b-2 border-slate-100 active:border-b-0 active:translate-y-[2px] transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handlePinDelete}
                  className="h-14 flex items-center justify-center text-slate-400 active:text-slate-600 transition-colors"
                >
                  <Delete size={24} />
                </button>
                <button
                  onClick={() => handlePinPress('0')}
                  className="h-14 bg-slate-50 rounded-xl text-xl font-bold text-slate-700 shadow-sm border-b-2 border-slate-100 active:border-b-0 active:translate-y-[2px] transition-all"
                >
                  0
                </button>
                <button
                  onClick={() => handleLogin()}
                  disabled={loading}
                  className="h-14 bg-[#1a3a44] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1a3a44]/20 active:scale-95 transition-all"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check size={28} />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ADMIN VIEW */}
          {activeTab === 'admin' && (
            <form onSubmit={handleLogin} className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-5 mt-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Email
                  </label>
                  <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl mt-1 focus-within:ring-2 focus-within:ring-[#2e7585]/20 focus-within:border-[#2e7585] transition-all">
                    <Mail size={18} className="text-slate-400" />
                    <input
                      type="email"
                      className="bg-transparent border-none w-full text-base font-medium text-slate-800 placeholder:text-slate-300 focus:ring-0 p-0"
                      placeholder="admin@somalipost.gov.so"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Password
                  </label>
                  <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl mt-1 focus-within:ring-2 focus-within:ring-[#2e7585]/20 focus-within:border-[#2e7585] transition-all">
                    <Lock size={18} className="text-slate-400" />
                    <input
                      type="password"
                      className="bg-transparent border-none w-full text-base font-medium text-slate-800 placeholder:text-slate-300 focus:ring-0 p-0"
                      placeholder="********"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-right mt-2">
                    <button type="button" className="text-xs font-bold text-[#2e7585]">
                      Forgot Password?
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-[#1a3a44] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-[#1a3a44]/20 active:scale-95 transition-all"
                >
                  {loading ? (
                    'Signing In...'
                  ) : (
                    <>
                      Sign In <ArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 opacity-40">
            <ShieldCheck size={12} className="text-[#1a3a44]" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Official Government Portal
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP LAYOUT (Unchanged)
         ========================================================================= */}
      <div className="hidden md:flex w-full h-full">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-100">
          {/* Tab Switcher */}
          <div className="flex bg-slate-50 p-1 rounded-lg mb-8 border border-slate-100">
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'staff'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Staff Login
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-slate-800 shadow-sm border border-slate-200'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Admin Login
            </button>
          </div>

          {/* STAFF FORM DESKTOP */}
          {activeTab === 'staff' && (
            <form onSubmit={(e) => handleLogin(e)} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    autoComplete="username"
                    placeholder="Enter staff username"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button transition-all text-sm"
                    value={staffUsername}
                    onChange={(e) => setStaffUsername(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-500">4-Digit PIN</label>
                    <button type="button" className="text-xs text-auth-button hover:underline font-medium">
                      Forgot PIN?
                    </button>
                  </div>
                  <input
                    type="password"
                    name="pin"
                    autoComplete="current-password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex justify-center gap-3 mb-2 py-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full border transition-all ${
                          i < pin.length ? 'bg-slate-800 border-slate-800' : 'bg-white border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <PinKeypad onKeyPress={handlePinPress} onDelete={handlePinDelete} onSubmit={() => handleLogin()} />
              <button
                type="submit"
                className="w-full mt-8 bg-auth-button hover:bg-auth-buttonHover text-white py-3 rounded-lg font-semibold shadow-sm transition-all active:scale-[0.98]"
              >
                Access Hub
              </button>
            </form>
          )}

          {/* ADMIN FORM DESKTOP */}
          {activeTab === 'admin' && (
            <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Admin Email</label>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="admin@somalipost.gov.so"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button transition-all text-sm"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-semibold text-slate-500">Password</label>
                    <button type="button" className="text-xs text-auth-button hover:underline font-medium">
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Enter secure password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button transition-all text-sm"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-8 bg-auth-button hover:bg-auth-buttonHover text-white py-3 rounded-lg font-semibold shadow-sm transition-all active:scale-[0.98]"
              >
                Admin Sign In
              </button>
            </form>
          )}

          <div className="mt-8 bg-slate-50 border border-slate-100 rounded-lg p-3 flex gap-3">
            <Info className="text-yellow-600 shrink-0 mt-0.5" size={16} />
            <p className="text-[11px] text-slate-500 leading-relaxed">
              <span className="font-semibold text-slate-700">Notice:</span> Authorized personnel only.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
