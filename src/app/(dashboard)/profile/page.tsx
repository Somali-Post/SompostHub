"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Camera,
  FileText,
  Info,
  MapPin,
  Save,
  Shield,
  User,
} from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) return;
        setUser(data);
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setAvatar(data.avatar || "");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, phone, location, avatar }),
    });
    if (res.ok) {
      alert("Profile Saved!");
      window.location.reload();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return <div className="h-full overflow-y-auto p-6 md:p-8">Loading Profile...</div>;
  }

  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col lg:flex-row gap-8 pb-12">
        <aside className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-40 h-40 rounded-full border-4 border-slate-50 shadow-md overflow-hidden relative">
                <Image
                  src={
                    avatar ||
                    `https://ui-avatars.com/api/?name=${user?.fullName}&background=1a3a44&color=fff`
                  }
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {user?.fullName}
            </h2>
            <p className="text-auth-button font-medium text-sm mb-6">
              {user?.jobTitle}
            </p>

            <label className="w-full bg-auth-button hover:bg-auth-buttonHover text-white text-sm font-bold py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer">
              <Camera size={18} />
              <span>Update Photo</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>

            <div className="w-full space-y-4 pt-6 mt-6 border-t border-slate-100">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                  Username
                </label>
                <div className="text-slate-600 text-sm font-medium">
                  @{user?.username}
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                  Role
                </label>
                <div className="text-slate-600 text-sm font-medium">
                  {user?.role}
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-auth-button/10 text-auth-button font-bold text-sm text-left">
              <User size={18} />
              Personal Details
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition-colors text-sm font-medium text-left">
              <Shield size={18} />
              Security &amp; Access
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition-colors text-sm font-medium text-left">
              <Bell size={18} />
              Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-white hover:text-slate-900 transition-colors text-sm font-medium text-left">
              <FileText size={18} />
              Directives &amp; Policy
            </button>
          </nav>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 py-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Profile Information
            </h3>
            <button
              onClick={handleSave}
              className="px-6 py-2 text-sm font-bold bg-auth-button text-white rounded-lg hover:bg-auth-buttonHover transition-all shadow-sm flex items-center gap-2"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h4 className="font-bold text-slate-900">Contact Information</h4>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Work Email
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  Work Phone
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">
                  Office Location
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button text-sm font-medium text-slate-900 bg-white"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center gap-2">
              <Shield className="text-slate-400" size={20} />
              <h4 className="font-bold text-slate-700">System Information</h4>
              <span className="ml-auto text-[10px] bg-slate-200 text-slate-600 px-2 py-1 rounded font-bold uppercase">
                Read-Only
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                  Staff Unique ID
                </label>
                <div className="text-slate-700 font-mono font-medium">
                  SP-99201-MG
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                  Department
                </label>
                <div className="text-slate-700 font-medium">
                  Logistics &amp; Postal Ops
                </div>
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block mb-2">
                  Joined Date
                </label>
                <div className="text-slate-700 font-medium">
                  January 14, 2021
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100 flex gap-3">
              <Info className="text-yellow-600 shrink-0" size={18} />
              <p className="text-xs text-yellow-700 leading-relaxed">
                System information is managed by the Federal Ministry of Posts.
                To request corrections, please contact{" "}
                <span className="font-bold underline cursor-pointer">
                  HR Administration
                </span>
                .
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-red-600 flex items-center gap-2">
                <AlertTriangle size={18} />
                Account Deactivation
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Deactivating your profile will revoke all access to postal
                systems.
              </p>
            </div>
            <button className="px-4 py-2 text-sm font-bold border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
              Request Deactivation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
