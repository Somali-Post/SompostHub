"use client";

import { Check, Delete } from "lucide-react";

interface PinKeypadProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export default function PinKeypad({
  onKeyPress,
  onDelete,
  onSubmit,
  disabled,
}: PinKeypadProps) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] mx-auto mt-6">
      {keys.map((key) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onKeyPress(key)}
          className="h-12 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-lg transition-colors active:scale-95 disabled:opacity-50"
        >
          {key}
        </button>
      ))}

      <button
        type="button"
        disabled={disabled}
        onClick={onDelete}
        className="h-12 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
      >
        <Delete size={20} />
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onKeyPress("0")}
        className="h-12 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-lg transition-colors active:scale-95 disabled:opacity-50"
      >
        0
      </button>

      <button
        type="button"
        disabled={disabled}
        onClick={onSubmit}
        className="h-12 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors active:scale-95 disabled:opacity-50"
      >
        <Check size={20} />
      </button>
    </div>
  );
}
