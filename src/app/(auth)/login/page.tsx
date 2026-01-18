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
          MOBILE LAYOUT (Final Native App Style - White Body & Clay Shadows)
         ========================================================================= */}
      <div className="md:hidden fixed inset-0 flex flex-col bg-slate-50 font-sans overflow-hidden">
        {/* 1. Curved Header with Wave & Gradient */}
        <div className="relative bg-linear-to-br from-[#1a3a44] to-[#2e7585] pt-12 pb-28 px-6 shrink-0 z-10">
          {/* Dot Grid Overlay */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-3">
            {/* Transparent Logo */}
            <div className="w-20 h-20 flex items-center justify-center mb-1">
              <Image
                src="/logos/logo.png"
                alt="Somali Post"
                width={64}
                height={64}
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Staff Login</h1>
              <p className="text-xs text-teal-100/90 font-medium tracking-wide">
                Official Internal Portal
              </p>
            </div>
          </div>

          {/* Smooth Bezier Wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
            <svg className="relative block w-full h-15" viewBox="0 0 1440 320" preserveAspectRatio="none">
              <path
                fill="#f8fafc"
                fillOpacity="1"
                d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* 2. Main Content */}
        <div className="flex-1 flex flex-col px-6 -mt-12 relative z-20 overflow-y-auto">
          {/* Toggle Pills (Clay Shadow) */}
          <div className="flex justify-center mb-6">
            <div className="flex bg-white p-1 rounded-xl w-64 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.05),0_4px_10px_rgba(0,0,0,0.05)]">
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'staff' ? 'bg-[#1a3a44] text-white shadow-md' : 'text-slate-400'
                }`}
              >
                Staff
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'admin' ? 'bg-[#1a3a44] text-white shadow-md' : 'text-slate-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* STAFF VIEW */}
          {activeTab === 'staff' && (
            <div className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Floating Input Card */}
              <div className="bg-white rounded-2xl p-5 mb-4 space-y-5 shadow-[0_10px_20px_rgba(0,0,0,0.05),inset_0_-2px_0_rgba(0,0,0,0.05)] border border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Username
                  </label>
                  <div className="relative bg-slate-50 rounded-xl border border-slate-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.03)]">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 font-semibold text-base"
                      placeholder="Enter staff ID"
                      value={staffUsername}
                      onChange={(e) => setStaffUsername(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    Security PIN
                  </label>
                  <div className="flex justify-center gap-5">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full transition-all duration-200 ${
                          i < pin.length
                            ? 'bg-[#0D9488] scale-110 shadow-[0_0_10px_rgba(13,148,136,0.5)]'
                            : 'bg-slate-200 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-center mt-3">
                    <button className="text-xs font-bold text-[#0D9488]">Forgot PIN?</button>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Request a reset from Admin
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrated Keypad */}
              <div className="mt-auto grid grid-cols-3 gap-3 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    onClick={() => handlePinPress(num.toString())}
                    className="h-14 bg-white rounded-xl text-2xl font-medium text-slate-700 shadow-[0_2px_5px_rgba(0,0,0,0.05)] border-b-2 border-slate-100 active:bg-slate-50 active:scale-95 active:border-b-0 transition-all"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={handlePinDelete}
                  className="h-14 flex items-center justify-center text-slate-400 active:text-slate-600 active:scale-95 transition-all"
                >
                  <Delete size={24} />
                </button>
                <button
                  onClick={() => handlePinPress('0')}
                  className="h-14 bg-white rounded-xl text-2xl font-medium text-slate-700 shadow-[0_2px_5px_rgba(0,0,0,0.05)] border-b-2 border-slate-100 active:bg-slate-50 active:scale-95 active:border-b-0 transition-all"
                >
                  0
                </button>

                {/* Action Button */}
                <button
                  onClick={() => handleLogin()}
                  disabled={loading}
                  className="h-14 bg-[#0D9488] text-white rounded-xl shadow-[0_4px_14px_rgba(13,148,136,0.4)] active:scale-95 transition-all font-bold text-sm flex items-center justify-center border-t border-white/20"
                >
                  {loading ? '...' : 'ACCESS'}
                </button>
              </div>
            </div>
          )}

          {/* ADMIN VIEW */}
          {activeTab === 'admin' && (
            <form onSubmit={handleLogin} className="flex flex-col flex-1 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-white rounded-2xl p-6 space-y-5 mt-2 shadow-[0_10px_20px_rgba(0,0,0,0.05),inset_0_-2px_0_rgba(0,0,0,0.05)] border border-slate-100">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <div className="relative bg-slate-50 rounded-xl border border-slate-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.03)]">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 font-medium"
                      placeholder="admin@somalipost.gov.so"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <div className="relative bg-slate-50 rounded-xl border border-slate-100 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.03)]">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:ring-0 font-medium"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                  </div>
                  <div className="text-right mt-2">
                    <button type="button" className="text-xs font-bold text-[#0D9488]">
                      Forgot?
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#1a3a44] text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(26,58,68,0.3)] active:scale-95 transition-all border-t border-white/10"
                >
                  {loading ? (
                    'Signing In...'
                  ) : (
                    <>
                      Sign In <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="mt-auto py-4 text-center shrink-0">
            <div className="flex items-center justify-center gap-1.5 mb-2 opacity-60">
              <ShieldCheck size={12} className="text-slate-400" />
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                Authorized personnel only
              </p>
            </div>
            <div className="flex justify-center gap-3 text-[10px] text-slate-400 mb-1">
              <span className="hover:text-[#0D9488] cursor-pointer">Privacy Policy</span>
              <span className="text-slate-300">|</span>
              <span className="hover:text-[#0D9488] cursor-pointer">Terms of Service</span>
            </div>
            <p className="text-[10px] text-slate-300">© Somali Post Operations</p>
          </div>
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
