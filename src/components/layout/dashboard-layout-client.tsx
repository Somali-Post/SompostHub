'use client';

import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import MobileNav from './mobile-nav';
import { Menu, X, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardLayoutClient({ children, user }: { children: React.ReactNode; user?: any }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [resolvedUser, setResolvedUser] = useState(user);

    useEffect(() => {
        setResolvedUser(user);
    }, [user]);

    useEffect(() => {
        let isActive = true;

        const loadProfile = async () => {
            if (!user?.id) return;
            try {
                const res = await fetch('/api/me', { cache: 'no-store' });
                if (!res.ok) return;
                const data = await res.json();
                if (isActive) {
                    setResolvedUser(data);
                }
            } catch (error) {
                console.error('PROFILE LOAD ERROR:', error);
            }
        };

        loadProfile();

        return () => {
            isActive = false;
        };
    }, [user?.id]);

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col h-full shrink-0">
                <Sidebar user={resolvedUser} />
            </div>

            <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
                {/* Desktop Topbar */}
                <div className="hidden md:block shrink-0">
                    <Topbar />
                </div>

                {/* Mobile Header */}
                <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between z-40 shadow-sm">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="font-bold text-lg text-slate-900 tracking-tight">Somali Post</Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full relative">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                        <Link href="/profile" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                            <User size={16} className="text-slate-500" />
                        </Link>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden md:p-0 pt-14 pb-24 relative">
                    {children}
                </main>

                {/* Mobile Nav */}
                <div className="md:hidden">
                    <MobileNav onMenuClick={() => setMobileMenuOpen(true)} />
                </div>
            </div>

            {/* Mobile Drawer (Visual adaptation of Sidebar logic) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-[85%] max-w-xs bg-slate-900 z-50 shadow-2xl overflow-hidden md:hidden"
                        >
                            <div className="flex flex-col h-full relative">
                                <div className="absolute top-4 right-4 z-[60]">
                                    <button
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Reuse Sidebar but override styles to fit drawer */}
                                <div className="flex-1 overflow-y-auto [&_aside]:!w-full [&_aside]:!h-full [&_aside]:!static [&_aside]:!bg-transparent [&_aside]:!shadow-none">
                                    <Sidebar user={resolvedUser} onNavigate={() => setMobileMenuOpen(false)} />
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
