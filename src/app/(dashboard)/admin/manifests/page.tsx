'use client';

import { useEffect, useState } from 'react';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

type ManifestItem = {
  id: string;
  barcode: string;
};

type ManifestBag = {
  id: string;
  originImpc: string;
  destImpc: string;
  createdAt: string;
  items: ManifestItem[];
};

export default function ManifestsPage() {
  const [bags, setBags] = useState<ManifestBag[]>([]);
  const [selectedBag, setSelectedBag] = useState<ManifestBag | null>(null);

  useEffect(() => {
    fetch('/api/admin/manifests')
      .then((res) => res.json())
      .then(setBags);
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy.');
    }
  };

  const getIPSFormat = (items: ManifestItem[]) => items.map((item) => item.barcode).join('\n');

  return (
    <div className="flex gap-6 h-full p-6 overflow-hidden">
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-100 font-bold">Scanned Receptacles</div>
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Receptacle ID</th>
                <th className="px-6 py-3">Origin</th>
                <th className="px-6 py-3">Items</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bags.map((bag) => (
                <tr key={bag.id} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-mono font-bold">{bag.id}</td>
                  <td className="px-6 py-3">{bag.originImpc}</td>
                  <td className="px-6 py-3">{bag.items.length}</td>
                  <td className="px-6 py-3 text-slate-500">
                    {new Date(bag.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => setSelectedBag(bag)}
                      className="text-auth-button font-bold hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {bags.length === 0 && (
                <tr>
                  <td className="px-6 py-10 text-center text-slate-400" colSpan={5}>
                    No manifests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBag && (
        <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-xl flex flex-col overflow-hidden animate-in slide-in-from-right">
          <div className="p-6 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-lg text-slate-900">Receptacle Details</h3>
            <p className="font-mono text-xs text-slate-500 break-all mt-1">{selectedBag.id}</p>
            <button
              onClick={() => copyToClipboard(selectedBag.id)}
              className="mt-3 w-full flex items-center justify-center gap-2 bg-white border border-slate-300 py-2 rounded-lg text-xs font-bold hover:bg-slate-100"
            >
              <Copy size={14} /> Copy Receptacle ID
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-sm text-slate-700">
                Items ({selectedBag.items.length})
              </h4>
              <button
                onClick={() => copyToClipboard(getIPSFormat(selectedBag.items))}
                className="text-xs text-auth-button font-bold flex items-center gap-1 hover:underline"
              >
                <Copy size={12} /> Copy List for IPS
              </button>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 font-mono text-xs text-slate-600 h-full overflow-y-auto">
              {selectedBag.items.map((item) => (
                <div key={item.id} className="mb-1">
                  {item.barcode}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100">
            <button
              onClick={() => setSelectedBag(null)}
              className="w-full py-2 bg-slate-100 text-slate-600 font-bold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
