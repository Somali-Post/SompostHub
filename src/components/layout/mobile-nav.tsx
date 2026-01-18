'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    MessageSquare,
    CheckSquare,
    ScanBarcode,
    Menu,
    Box
} from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';
import { NAV_SECTIONS } from '@/config/navigation';
import { User } from 'lucide-react'; // Fallback icon

// We'll define the primary mobile tabs here
const MOBILE_TABS = [
    { label: 'Chat', href: '/chat', icon: MessageSquare },
    { label: 'Tasks', href: '/tasks', icon: CheckSquare },
    { label: 'Scan', href: '/scan', icon: ScanBarcode, primary: true }, // Highlighted center button
    { label: 'Track', href: '/tracking', icon: Box },
];

interface MobileNavProps {
    onMenuClick: () => void;
}

export default function MobileNav({ onMenuClick }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 pt-2 z-50 md:hidden pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-between">
                {MOBILE_TABS.map((tab) => {
                    const isActive = pathname.startsWith(tab.href);

                    if (tab.primary) {
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className="relative -top-6 flex flex-col items-center justify-center"
                            >
                                <div className={clsx(
                                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95",
                                    isActive
                                        ? "bg-slate-900 text-white"
                                        : "bg-blue-600 text-white"
                                )}>
                                    <tab.icon size={24} />
                                </div>
                                <span className="text-[10px] font-medium text-slate-600 mt-1">
                                    {tab.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-1 min-w-[60px] transition-colors",
                                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
                            )}
                        >
                            <tab.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">
                                {tab.label}
                            </span>
                        </Link>
                    );
                })}

                <button
                    onClick={onMenuClick}
                    className="flex flex-col items-center justify-center gap-1 min-w-[60px] text-slate-400 hover:text-slate-600"
                >
                    <Menu size={24} />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>
            </div>
        </div>
    );
}
