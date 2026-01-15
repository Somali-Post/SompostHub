"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Info } from "lucide-react";
import PinKeypad from "@/components/auth/pin-keypad";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"staff" | "admin">("staff");

  const [staffUsername, setStaffUsername] = useState("");
  const [pin, setPin] = useState("");

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handlePinPress = (key: string) => {
    if (pin.length < 4) {
      setPin((prev) => prev + key);
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleStaffSubmit = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: staffUsername, pin }),
      });

      if (res.ok) {
        window.location.href = "/chat";
      } else {
        alert("Invalid Username or PIN");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdminSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          adminEmail: adminEmail,
          adminPassword: adminPassword,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        window.location.href = data.redirect || "/chat";
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Connection error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md border border-slate-100">
      <div className="flex bg-slate-50 p-1 rounded-lg mb-8 border border-slate-100">
        <button
          type="button"
          onClick={() => setActiveTab("staff")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "staff"
              ? "bg-white text-slate-800 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Staff Login
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("admin")}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
            activeTab === "admin"
              ? "bg-white text-slate-800 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Admin Login
        </button>
      </div>

      {activeTab === "staff" && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="Enter staff username"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button transition-all text-sm"
                value={staffUsername}
                onChange={(e) => setStaffUsername(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-500">
                  4-Digit PIN
                </label>
                <button
                  type="button"
                  className="text-xs text-auth-button hover:underline font-medium"
                >
                  Forgot PIN?
                </button>
              </div>

              <div className="flex justify-center gap-3 mb-2 py-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      i < pin.length
                        ? "bg-slate-800 border-slate-800"
                        : "bg-white border-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <PinKeypad
            onKeyPress={handlePinPress}
            onDelete={handlePinDelete}
            onSubmit={handleStaffSubmit}
          />

          <button
            type="button"
            onClick={handleStaffSubmit}
            className="w-full mt-8 bg-auth-button hover:bg-auth-buttonHover text-white py-3 rounded-lg font-semibold shadow-sm transition-all active:scale-[0.98]"
          >
            Access Hub
          </button>
        </div>
      )}

      {activeTab === "admin" && (
        <form
          onSubmit={handleAdminSubmit}
          className="animate-in fade-in slide-in-from-left-4 duration-300"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                placeholder="admin@somalipost.gov.so"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button transition-all text-sm"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-slate-500">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs text-auth-button hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="Enter secure password"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-auth-button/20 focus:border-auth-button transition-all text-sm"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                Password must be at least 8 characters and include a number and
                a special character.
              </p>
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
          <span className="font-semibold text-slate-700">Notice:</span> Staff
          access is for authorized Somali Post personnel only. Admin access is
          for management and system oversight. Unauthorized access attempts may
          be logged.
        </p>
      </div>
    </div>
  );
}
