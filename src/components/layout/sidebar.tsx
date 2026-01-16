'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Settings, LogOut } from 'lucide-react';
import { NAV_SECTIONS } from '@/config/navigation';
import Image from 'next/image';
import clsx from 'clsx';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/me')
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => {
        if (data) setUser(data);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  const userRole = user?.role || 'OFFICE_STAFF';

  return (
    <aside
      className={clsx(
        'relative flex flex-col h-screen transition-all duration-300 ease-in-out bg-gradient-to-br from-auth-sidebarFrom to-auth-sidebarTo text-white shadow-xl z-50',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-sidebar" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-sidebar)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col h-full">
        <div
          className={clsx(
            'flex flex-col items-center justify-center transition-all duration-300 border-b border-white/10 relative overflow-hidden',
            isCollapsed ? 'h-20' : 'h-48'
          )}
        >
          <div
            className={clsx(
              'relative transition-all duration-300 ease-in-out',
              isCollapsed ? 'w-10 h-10' : 'w-28 h-28 mb-4'
            )}
          >
            <Image
              src="/logos/logo-transparent.png"
              alt="SP"
              fill
              className="object-contain"
              priority
              sizes="33vw"
            />
          </div>
          <div
            className={clsx(
              'text-center transition-all duration-300 absolute bottom-6 w-full',
              isCollapsed ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'
            )}
          >
            <span className="block font-bold text-xl leading-none tracking-tight whitespace-nowrap">
              Somali Post
            </span>
            <span className="block text-[10px] text-auth-accent uppercase tracking-[0.2em] mt-1.5">
              Staff Hub
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {NAV_SECTIONS.map((section) => {
            const visibleItems = section.items.filter(
              (item) => !item.roles || item.roles.includes(userRole)
            );
            if (visibleItems.length === 0) return null;
            return (
              <div key={section.title}>
                {!isCollapsed && (
                  <h3 className="px-3 mb-2 text-[10px] font-bold text-white/50 uppercase tracking-wider truncate">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {visibleItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={clsx(
                          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative',
                          isActive
                            ? 'bg-white text-auth-sidebarFrom shadow-lg font-bold'
                            : 'text-white/80 hover:bg-white/10 hover:text-white',
                          isCollapsed && 'justify-center'
                        )}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <item.icon
                          size={22}
                          className={clsx(
                            'shrink-0',
                            isActive
                              ? 'text-auth-sidebarFrom'
                              : 'text-white/70 group-hover:text-white'
                          )}
                        />
                        <span
                          className={clsx(
                            'text-sm transition-all duration-300 overflow-hidden whitespace-nowrap',
                            isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto p-4 mx-2 mb-4 bg-black/20 rounded-xl border border-white/5 overflow-hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/settings"
              className={clsx(
                'flex items-center gap-3 text-white/70 hover:text-white transition-colors',
                isCollapsed && 'justify-center'
              )}
            >
              <Settings size={20} className="shrink-0" />
              <span
                className={clsx(
                  'text-sm font-medium transition-all duration-300 overflow-hidden whitespace-nowrap',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                Settings
              </span>
            </Link>

            <Link
              href="/profile"
              className={clsx(
                'flex items-center gap-3 pt-4 border-t border-white/10',
                isCollapsed && 'justify-center'
              )}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-auth-accent border-2 border-auth-accent overflow-hidden relative">
                  <Image
                    src={
                      user?.avatar ||
                      `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=C2A44D&color=fff`
                    }
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-auth-sidebarFrom rounded-full"></div>
              </div>
              <div
                className={clsx(
                  'flex flex-col overflow-hidden transition-all duration-300',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                <span className="text-sm font-bold truncate">{user?.fullName || 'Loading...'}</span>
                <span className="text-[10px] text-white/60 truncate">
                  {user?.jobTitle || user?.role}
                </span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className={clsx(
                'flex items-center gap-3 pt-4 border-t border-white/10 text-red-300 hover:text-red-100 transition-colors w-full text-left',
                isCollapsed && 'justify-center'
              )}
              title="Log Out"
            >
              <LogOut size={20} className="shrink-0" />
              <span
                className={clsx(
                  'text-sm font-bold transition-all duration-300 overflow-hidden whitespace-nowrap',
                  isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                )}
              >
                Log Out
              </span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 bg-auth-sidebarTo border border-white/20 text-white p-1 rounded-full shadow-lg hover:bg-auth-sidebarFrom transition-colors z-50"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </aside>
  );
}
