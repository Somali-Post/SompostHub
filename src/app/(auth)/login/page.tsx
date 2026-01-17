'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Delete, Check, ArrowRight, User, Lock, Mail, ShieldCheck, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PinKeypad from '@/components/auth/pin-keypad';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'staff' | 'admin'>('staff');

  const [staffUsername, setStaffUsername] = useState('');
  const [pin, setPin] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      <div className="md:hidden fixed inset-0 flex flex-col bg-[#1a3a44]">
        <div className="h-[30%] flex flex-col items-center justify-center relative">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          ></div>

          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/10">
              <Image src="/logos/logo.png" alt="Somali Post" width={50} height={50} className="object-contain" priority />
            </div>
            <div className="text-center text-white">
              <h1 className="text-2xl font-black tracking-tight leading-none">Somali Post</h1>
              <p className="text-[10px] text-[#C2A44D] font-bold uppercase tracking-[0.25em] mt-1.5">
                Employee Hub
              </p>
            </div>
          </div>
        </div>

        <div className="h-[70%] bg-white rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden">
          <div className="flex justify-center pt-8 pb-6">
            <div className="flex bg-slate-100 p-1.5 rounded-2xl w-72 shadow-inner">
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                  activeTab === 'staff'
                    ? 'bg-white text-[#1a3a44] shadow-md transform scale-105'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                STAFF LOGIN
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${
                  activeTab === 'admin'
                    ? 'bg-white text-[#1a3a44] shadow-md transform scale-105'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ADMIN LOGIN
              </button>
            </div>
          </div>

          <div className="flex-1 px-8 pb-6 flex flex-col min-h-0 overflow-y-auto">
            {activeTab === 'staff' && (
              <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-300">
                <div className="space-y-5 mb-4 shrink-0">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                      Username
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:border-[#2e7585] focus-within:ring-1 focus-within:ring-[#2e7585] transition-all shadow-sm">
                      <User className="text-slate-400" size={20} />
                      <input
                        className="bg-transparent border-none w-full text-base font-bold text-slate-800 placeholder:text-slate-300 focus:ring-0 p-0"
                        placeholder="Enter username"
                        value={staffUsername}
                        onChange={(e) => setStaffUsername(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1">
                      Access PIN
                    </label>
                    <div className="flex justify-center gap-6">
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

                <div className="flex-1 grid grid-cols-3 gap-3 place-content-center mt-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      onClick={() => handlePinPress(num.toString())}
                      className="h-14 rounded-xl bg-slate-50 text-xl font-bold text-slate-700 active:bg-slate-200 active:scale-95 transition-all shadow-sm border-b border-slate-200"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    onClick={handlePinDelete}
                    className="h-14 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center active:bg-slate-200 active:scale-95 transition-all"
                  >
                    <Delete size={22} />
                  </button>
                  <button
                    onClick={() => handlePinPress('0')}
                    className="h-14 rounded-xl bg-slate-50 text-xl font-bold text-slate-700 active:bg-slate-200 active:scale-95 transition-all shadow-sm border-b border-slate-200"
                  >
                    0
                  </button>
                  <button
                    onClick={() => handleLogin()}
                    disabled={loading}
                    className="h-14 rounded-xl bg-[#2e7585] text-white flex items-center justify-center active:bg-[#245f6c] active:scale-95 transition-all shadow-md shadow-[#2e7585]/20"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check size={24} />
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'admin' && (
              <form onSubmit={handleLogin} className="flex flex-col h-full animate-in slide-in-from-left-8 duration-300">
                <div className="space-y-6 mt-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                      Email Address
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:border-[#2e7585] focus-within:ring-1 focus-within:ring-[#2e7585] transition-all shadow-sm">
                      <Mail className="text-slate-400" size={20} />
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">
                      Password
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 flex items-center gap-3 focus-within:border-[#2e7585] focus-within:ring-1 focus-within:ring-[#2e7585] transition-all shadow-sm">
                      <Lock className="text-slate-400" size={20} />
                      <input
                        type="password"
                        className="bg-transparent border-none w-full text-base font-medium text-slate-800 placeholder:text-slate-300 focus:ring-0 p-0"
                        placeholder="••••••••"
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

                <div className="mt-auto pb-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 bg-[#1a3a44] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-[#1a3a44]/20 active:scale-95 transition-all"
                  >
                    {loading ? 'Signing In...' : (
                      <>
                        Sign In <ArrowRight />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            <div className="mt-4 flex items-center justify-center gap-2 opacity-50">
              <ShieldCheck size={12} className="text-[#1a3a44]" />
              <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                Official Government Portal
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-full h-full">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-100">
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

          {activeTab === 'staff' && (
            <form onSubmit={(e) => handleLogin(e)} className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Username</label>
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
