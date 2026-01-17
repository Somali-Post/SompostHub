'use client';

import { useState } from 'react';
import { User, Bell, Shield, Server, Save, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const userRole = 'ADMIN';

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) {
      toast.warning('Please fill in all fields');
      return;
    }
    setPassLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ oldPassword: oldPass, newPassword: newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password updated successfully');
        setOldPass('');
        setNewPass('');
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (e) {
      toast.error('Connection error');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      <div className="p-8 pb-0">
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="text-slate-500 mt-1">Manage your preferences and system configuration.</p>
      </div>

      <div className="px-8 mt-6 border-b border-slate-200 flex gap-6 shrink-0">
        <TabButton
          id="general"
          label="General"
          icon={<User size={18} />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabButton
          id="notifications"
          label="Notifications"
          icon={<Bell size={18} />}
          active={activeTab}
          onClick={setActiveTab}
        />
        <TabButton id="system" label="System" icon={<Server size={18} />} active={activeTab} onClick={setActiveTab} />
      </div>

      <div className="p-8 max-w-3xl">
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Appearance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-700">Theme Preference</p>
                  <p className="text-xs text-slate-500">Choose how the app looks to you.</p>
                </div>
                <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm p-2">
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                  <option>System Default</option>
                </select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock size={18} className="text-auth-button" /> Security
              </h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button"
                    placeholder="Min 8 chars, 1 Upper, 1 Number"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Must contain 8+ chars, 1 uppercase, 1 number, 1 special char.
                  </p>
                </div>
                <button
                  onClick={handleChangePassword}
                  disabled={passLoading}
                  className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 disabled:opacity-50"
                >
                  {passLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3 text-amber-800">
              <Shield className="shrink-0" />
              <div className="text-sm">
                <p className="font-bold">Restricted Area</p>
                <p>Changes here affect the entire Somali Post operational network.</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4">Global Configuration</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div>
                    <p className="text-sm font-medium text-slate-700">Maintenance Mode</p>
                    <p className="text-xs text-slate-500">Disable staff login for updates.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-auth-button"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ id, label, icon, active, onClick }: any) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-colors ${
        active === id ? 'border-auth-button text-auth-button' : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      {icon} {label}
    </button>
  );
}
