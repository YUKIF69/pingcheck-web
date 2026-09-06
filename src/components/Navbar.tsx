'use client';

import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

export default function Navbar() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <nav className="max-w-7xl mx-auto border border-line rounded-xl px-6 py-3 flex items-center justify-between backdrop-blur-[4px] bg-surface/80">
      {/* Логотип */}
      <Link href="/" className="text-foreground font-semibold tracking-tight text-2xl">
        Ping<span className="text-accent">Check</span>
      </Link>

      {/* Лінки */}
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="text-sm text-text-dim hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/add-monitor"
              className="text-sm text-text-dim hover:text-foreground transition-colors"
            >
              Add Monitor
            </Link>
            <button
              onClick={logout}
              className="text-sm text-text-dim hover:text-low transition-colors cursor-pointer"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              href="/auth"
              className="text-sm text-text-dim hover:text-foreground transition-colors"
            >
              Log in
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
