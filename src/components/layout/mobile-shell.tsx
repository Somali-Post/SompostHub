'use client';

import { useState } from 'react';
import MobileNav from './mobile-nav';
import Sidebar from './sidebar'; // Reusing sidebar as drawer for now
import { Menu, X, Bell, User } from 'lucide-react';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

export default function MobileShell({ children }: { children: React.ReactNode }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 md:hidden">
            {/* Mobile Header */}
            <header className="fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 flex items-center justify-between z-40">
                <div className="flex items-center gap-2">
                    <img src="/logos/logo-icon.png" alt="Logo" className="w-8 h-8 object-contain" onError={(e) => e.currentTarget.style.display = 'none'} />
                    <span className="font-bold text-lg text-slate-900">Somali Post</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
                        <Bell size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                        {/* Placeholder Avatar */}
                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                            <User size={16} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area - padded for header and footer */}
            <main className="flex-1 pt-14 pb-24 overflow-y-auto overflow-x-hidden min-h-0">
                {children}
            </main>

            {/* Bottom Navigation */}
            <MobileNav onMenuClick={() => setIsMenuOpen(true)} />

            {/* Drawer Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl overflow-hidden"
                        >
                            <div className="relative h-full">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="absolute top-4 right-4 z-50 p-2 bg-white/10 rounded-full text-white hover:bg-white/20"
                                >
                                    <X size={20} />
                                </button>
                                {/* Reusing Sidebar Logic but forcing it to be visible/expanded. 
                     Note: Sidebar component expects to be on left usually, but we can wrap it.
                     However, the Sidebar component has specific styling (h-screen, fixed usually, but here likely flex).
                     Let's check Sidebar implementation again. It renders an <aside>.
                     If we render <Sidebar /> inside here, it might have layout issues if it assumes it is the only thing.
                     The Sidebar has `h-screen`. 
                     Let's actually just recreate a simple menu list here for the 'Drawer' to avoid conflict with the desktop sidebar's state 
                     or just put the Sidebar here and override styles?
                     The Sidebar code sets width based on 'isCollapsed'.
                     It uses `h-screen`. 
                     Let's try to just render the existing Sidebar component but wrapped.
                     Actually, Sidebar has `fixed` or `sticky` usually? 
                     In the file it says: `relative flex flex-col h-screen`. It is NOT fixed. Good.
                     It sets width explicitly.
                 */}
                                <div className="h-full overflow-y-auto">
                                    <Sidebar />
                                    {/* We might need to adjust Sidebar to be full width of container or handle mobile mode. 
                        Currently Sidebar has specific width classes. 
                        We can probably just use it and let it be.
                    */}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
