import Link from 'next/link';

export default function Footer() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
      <p className="text-sm text-text-dim">
        Ping<span className="text-accent">Check</span> © 2026
      </p>
      <nav className="flex items-center gap-6">
        <Link
          href="/dashboard"
          className="text-sm text-text-dim hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <Link
          href="/auth"
          className="text-sm text-text-dim hover:text-foreground transition-colors"
        >
          Login
        </Link>
      </nav>
    </div>
  );
}
