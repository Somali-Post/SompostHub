'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Delete, User, Lock, Mail, ShieldCheck } from 'lucide-react';
import PinKeypad from '@/components/auth/pin-keypad';
import PwaInstallButton from '@/components/pwa/pwa-install-button';

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
          MOBILE LAYOUT (Polished Native App Feel - No Scroll)
         ========================================================================= */}
      <div className="md:hidden fixed inset-0 flex flex-col bg-slate-50 font-sans overflow-hidden h-[100dvh]">
        {/* 1. Compact Header with Integrated PWA Button */}
        <div className="relative bg-gradient-to-br from-[#1a3a44] to-[#2e7585] pt-[calc(env(safe-area-inset-top)+0.75rem)] pb-10 px-6 shrink-0 z-10 shadow-lg">
          {/* PWA Install Button (Top Right, Icon Only) */}
          <div className="absolute top-[calc(env(safe-area-inset-top)+0.5rem)] right-4 z-50">
            <PwaInstallButton variant="icon" showWhenUnavailable={false} />
          </div>

          {/* Dot Grid Overlay */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-2 mt-4">
            {/* Logo */}
            <div className="w-14 h-14 flex items-center justify-center bg-white/10 rounded-2xl backdrop-blur-sm shadow-inner border border-white/10">
              <Image
                src="/logos/logo.png"
                alt="Somali Post"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-white tracking-tight">Staff Portal</h1>
              <p className="text-[10px] text-teal-100/80 font-medium tracking-widest uppercase">
                Authorized Access Only
              </p>
            </div>
          </div>

          {/* Shorter Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 translate-y-[1px]">
            <svg className="relative block w-full h-8" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path
                fill="#f8fafc"
                fillOpacity="1"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* 2. Main Content (Flex Column to fill remaining height) */}
        <div className="flex-1 flex flex-col px-5 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] relative z-20 min-h-0">
          {/* Toggle Pills */}
          <div className="flex justify-center mb-4 shrink-0">
            <div className="flex bg-slate-200/60 p-1 rounded-xl w-56 shadow-inner">
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'staff' ? 'bg-white text-[#1a3a44] shadow-sm' : 'text-slate-500'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${
                  activeTab === 'admin' ? 'bg-white text-[#1a3a44] shadow-sm' : 'text-slate-500'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* STAFF VIEW */}
          {activeTab === 'staff' && (
            <div className="flex flex-col flex-1 h-full animate-in fade-in zoom-in-95 duration-300">
              {/* Top Section: Inputs */}
              <div className="space-y-3 shrink-0">
                {/* Username Input */}
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                    <User size={16} />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[9px] font-bold text-slate-400 uppercase">Staff ID</label>
                    <input
                      className="w-full bg-transparent border-none p-0 text-slate-800 font-bold text-sm focus:ring-0 placeholder:text-slate-300 placeholder:font-normal"
                      placeholder="Enter ID"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                    />
                  </div>
                </div>

                {/* PIN Visualizer */}
                <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-2">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Security PIN</label>
                  <div className="flex gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          i < pin.length
                            ? 'bg-[#0D9488] shadow-[0_0_8px_#0D9488]'
                            : 'bg-slate-100 shadow-inner'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Spacer to push keypad down */}
              <div className="flex-1"></div>

              {/* Integrated Keypad (Fills bottom space) */}
              <div className="grid grid-cols-3 gap-2 mb-2 shrink-0">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinPress(num.toString())}
                    className="h-12 bg-white rounded-xl text-xl font-semibold text-slate-700 shadow-[0_2px_0_#e2e8f0] active:shadow-none active:translate-y-[2px] active:bg-slate-50 transition-all border border-slate-100"
                  >
                    {num}
                  </button>
                ))}

                {/* Delete Button */}
                <button
                  onClick={handlePinDelete}
                  className="h-12 flex items-center justify-center text-slate-400 active:text-slate-600 active:scale-95 transition-all"
                >
                  <Delete size={20} />
                </button>

                {/* Zero */}
                <button
                  onClick={() => handlePinPress('0')}
                  className="h-12 bg-white rounded-xl text-xl font-semibold text-slate-700 shadow-[0_2px_0_#e2e8f0] active:shadow-none active:translate-y-[2px] active:bg-slate-50 transition-all border border-slate-100"
                >
                  0
                </button>

                {/* ACCESS BUTTON (Integrated into Grid) */}
                <button
                  onClick={() => handleLogin()}
                  disabled={loading}
                  className="h-12 bg-[#0D9488] text-white rounded-xl shadow-[0_2px_0_#0f766e] active:shadow-none active:translate-y-[2px] active:brightness-110 transition-all font-bold text-xs flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    'ENTER'
                  )}
                </button>
              </div>

              {/* Micro Footer */}
              <div className="text-center pb-2">
                <button className="text-[10px] font-medium text-slate-400 hover:text-[#0D9488]">
                  Forgot Credentials?
                </button>
              </div>
            </div>
          )}

          {/* ADMIN VIEW (Standard Form) */}
          {activeTab === 'admin' && (
            <form onSubmit={handleLogin} className="flex flex-col flex-1 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-white rounded-2xl p-5 space-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none text-slate-900 focus:ring-2 focus:ring-[#1a3a44]/20 font-medium text-sm"
                    placeholder="admin@somalipost.gov.so"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none text-slate-900 focus:ring-2 focus:ring-[#1a3a44]/20 font-medium text-sm"
                    placeholder="********"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-[#1a3a44] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#1a3a44]/20 active:scale-95 transition-all"
                >
                  {loading ? 'Verifying...' : 'Authenticate'}
                </button>
              </div>

              <div className="mt-auto pb-4 text-center">
                <p className="text-[10px] text-slate-300">System Version 2.4.0</p>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* =========================================================================
          DESKTOP LAYOUT (Hidden on small screens)
         ========================================================================= */}
      <div className="hidden md:flex w-full h-full items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-xl border border-slate-100">
          <div className="flex bg-slate-50 p-1.5 rounded-xl mb-10 border border-slate-100">
            <button
              onClick={() => setActiveTab('staff')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'staff'
                  ? 'bg-white text-[#1a3a44] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Staff Login
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
                activeTab === 'admin'
                  ? 'bg-white text-[#1a3a44] shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Admin Login
            </button>
          </div>

          <PwaInstallButton variant="desktop" className="mb-8" />

          {activeTab === 'staff' && (
            <form onSubmit={(e) => handleLogin(e)} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">Username</label>
                  <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#2e7585]/20 focus-within:border-[#2e7585] transition-all">
                    <User className="text-slate-400" size={20} />
                    <input
                      type="text"
                      name="username"
                      autoComplete="username"
                      placeholder="Enter staff username"
                      className="bg-transparent border-none w-full text-base font-semibold text-slate-800 placeholder:text-slate-400 focus:ring-0 p-0"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">4-Digit PIN</label>
                    <button type="button" className="text-xs text-[#2e7585] font-bold hover:underline">
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

                  <div className="flex justify-center gap-4 mb-4 py-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                          i < pin.length
                            ? 'bg-[#1a3a44] border-[#1a3a44] scale-110'
                            : 'bg-transparent border-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-center w-full my-6">
                <PinKeypad
                  onKeyPress={handlePinPress}
                  onDelete={handlePinDelete}
                  onSubmit={() => handleLogin()}
                />
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-[#1a3a44] hover:bg-[#151f25] text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
              >
                Access Hub
              </button>
            </form>
          )}

          {activeTab === 'admin' && (
            <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1">
                    Admin Email
                  </label>
                  <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#2e7585]/20 focus-within:border-[#2e7585] transition-all">
                    <Mail className="text-slate-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="admin@somalipost.gov.so"
                      className="bg-transparent border-none w-full text-base font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0 p-0"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                    <button type="button" className="text-xs text-[#2e7585] font-bold hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus-within:ring-2 focus-within:ring-[#2e7585]/20 focus-within:border-[#2e7585] transition-all">
                    <Lock className="text-slate-400" size={20} />
                    <input
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="Enter secure password"
                      className="bg-transparent border-none w-full text-base font-medium text-slate-800 placeholder:text-slate-400 focus:ring-0 p-0"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-10 h-14 bg-[#1a3a44] hover:bg-[#151f25] text-white rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-all"
              >
                Admin Sign In
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-center gap-2 opacity-60">
            <ShieldCheck className="text-[#1a3a44]" size={16} />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
