"use client";

import {
  AlertTriangle,
  CheckCircle,
  Package,
  Upload,
  User,
} from "lucide-react";

export default function DeliveryPage() {
  return (
    <div className="h-full overflow-y-auto p-6 md:p-8">
      <div className="flex flex-col xl:flex-row gap-8 pb-12">
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-auth-sidebarFrom">
                Delivery Verification
              </h1>
              <p className="text-slate-500">
                Process package{" "}
                <span className="font-mono font-bold">SP-9928-881</span> for
                final dispatch.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                Save Draft
              </button>
              <button className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">
                Flag Issue
              </button>
            </div>
          </div>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-auth-button text-white text-xs font-bold px-2 py-1 rounded">
                01
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Verification Uploads
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-auth-button hover:bg-auth-button/5 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-white">
                  <Upload className="text-slate-400 group-hover:text-auth-button" />
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-bold">Item ID / Barcode</p>
                  <p className="text-slate-500 text-xs">
                    Take photo of tracking label
                  </p>
                </div>
              </div>
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:border-auth-button hover:bg-auth-button/5 transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-white">
                  <User className="text-slate-400 group-hover:text-auth-button" />
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-bold">Customer ID</p>
                  <p className="text-slate-500 text-xs">
                    Take photo of National ID
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-auth-button text-white text-xs font-bold px-2 py-1 rounded">
                02
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                Extracted Data Verification
              </h2>
              <span className="ml-auto text-green-600 flex items-center gap-1 text-sm font-medium">
                <CheckCircle size={16} /> OCR Complete
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold uppercase text-slate-500">
                    Package Details
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                    98% Match
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Tracking Number
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-lg font-mono font-bold text-slate-900">
                        SP-9928-881
                      </p>
                      <CheckCircle className="text-green-500" size={18} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Weight
                    </label>
                    <p className="text-base font-medium text-slate-900">
                      1.45 kg
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                  <h3 className="text-sm font-bold uppercase text-slate-500">
                    Recipient ID
                  </h3>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                    Review
                  </span>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">
                      Full Name (OCR)
                    </label>
                    <input
                      type="text"
                      defaultValue="Ahmed Warsame Farah"
                      className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-auth-button focus:border-auth-button"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        ID Number
                      </label>
                      <input
                        type="text"
                        defaultValue="G8831002"
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-auth-button focus:border-auth-button"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">
                        Expiry
                      </label>
                      <input
                        type="text"
                        defaultValue="12/10/2026"
                        className="w-full mt-1 px-3 py-2 bg-slate-50 border-red-300 rounded-lg text-sm font-medium focus:ring-auth-button focus:border-auth-button"
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>
                      Expiry date OCR confidence low. Please verify manually.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="w-full xl:w-96 flex flex-col gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CheckCircle className="text-auth-button" /> Finalize Delivery
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                <div className="bg-white size-12 rounded flex items-center justify-center shadow-sm text-slate-400">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Package
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    SP-9928-881
                  </p>
                  <p className="text-xs text-slate-500">Mogadishu Central</p>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Recipient</span>
                  <span className="font-medium text-slate-900">
                    Ahmed Warsame
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Location</span>
                  <span className="font-medium text-slate-900">
                    Hodan District
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Service</span>
                  <span className="font-bold text-auth-button">Doorstep</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100">
                <label className="flex gap-3 mb-6 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 rounded border-slate-300 text-auth-button focus:ring-auth-button"
                  />
                  <span className="text-xs text-slate-600 leading-tight">
                    I confirm that I have physically verified the ID and the
                    tracking label matches.
                  </span>
                </label>
                <button className="w-full bg-auth-button text-white py-4 rounded-lg font-black text-lg shadow-xl shadow-auth-button/20 hover:bg-auth-buttonHover transition-all flex items-center justify-center gap-2">
                  CONFIRM DELIVERY
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
