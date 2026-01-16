'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Lock, User, X, Check } from 'lucide-react';

export default function StaffManagementPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState('OFFICE_STAFF');
  const [newPhone, setNewPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateUser = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          fullName: newName,
          username: newUsername,
          role: newRole,
          phone: newPhone,
        }),
      });

      if (res.ok) {
        alert('User Created Successfully! PIN is 0000.');
        setIsDrawerOpen(false);
        setNewName('');
        setNewUsername('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      alert('Connection Error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-4rem)]">
      <div className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Staff Management</h1>
          <p className="text-slate-500 text-sm">Manage access, roles, and PIN resets.</p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center gap-2 bg-auth-button text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-auth-buttonHover transition-colors"
        >
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search staff..."
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-auth-button/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-white">
              <Filter size={16} /> Role
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-3 border-b border-slate-200">Employee</th>
                  <th className="px-6 py-3 border-b border-slate-200">Role</th>
                  <th className="px-6 py-3 border-b border-slate-200">Status</th>
                  <th className="px-6 py-3 border-b border-slate-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
                        AA
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Abdi Aziz</p>
                        <p className="text-xs text-slate-500">@abdi</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold border border-blue-100">
                      STAFF
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedUser({ name: 'Abdi Aziz', id: '1' })}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Reset PIN"
                    >
                      <Lock size={16} />
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center font-bold text-purple-600 text-xs">
                        SA
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">Said Ahmed</p>
                        <p className="text-xs text-slate-500">@admin</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs font-bold border border-purple-100">
                      ADMIN
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span> Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-300 cursor-not-allowed">
                      <Lock size={16} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {selectedUser && (
          <div className="w-80 bg-white rounded-xl border border-slate-200 shadow-lg p-6 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 text-slate-900">
              <div className="p-2 bg-auth-button/10 rounded-lg text-auth-button">
                <Lock size={20} />
              </div>
              <h3 className="font-bold">Reset PIN</h3>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg text-sm text-amber-800">
              <p className="mb-2">
                Are you sure you want to reset PIN for <strong>{selectedUser.name}</strong>?
              </p>
              <p className="text-xs opacity-80">
                It will be set to <span className="font-mono font-bold">0000</span>.
              </p>
            </div>

            <div className="flex flex-col gap-2 mt-auto">
              <button className="w-full py-2 bg-auth-button text-white font-bold rounded-lg hover:bg-auth-buttonHover">
                Confirm Reset
              </button>
              <button
                onClick={() => setSelectedUser(null)}
                className="w-full py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">New Staff User</h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-auth-button hover:text-auth-button cursor-pointer transition-colors">
                  <User size={32} />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase">Upload Photo</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button"
                    placeholder="e.g. Jamaal Abdi"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Username
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button"
                    placeholder="@username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                    Phone
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button"
                    placeholder="+252 61 000 0000"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button bg-white"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="OFFICE_STAFF">Staff Member</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="DELIVERY">Delivery Driver</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3">
                <div className="mt-0.5 text-blue-600">
                  <Check size={16} />
                </div>
                <div className="text-xs text-blue-800">
                  <p className="font-bold mb-1">Initial Authentication</p>
                  <p>
                    User will be created with PIN <span className="font-mono font-bold">0000</span>.
                    They must change it on first login.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
              <button
                onClick={handleCreateUser}
                disabled={isLoading}
                className="flex-1 bg-auth-button text-white py-3 rounded-lg font-bold text-sm hover:bg-auth-buttonHover shadow-sm disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create User'}
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-600 py-3 rounded-lg font-bold text-sm hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
