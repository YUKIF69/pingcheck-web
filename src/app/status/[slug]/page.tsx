'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import StatCard from '@/components/StatCard';
import ResponseChart from '@/components/ResponseChart';
import { getTimeAgo, uptimeColor } from '@/lib/utils';

interface PublicStats {
  monitor: {
    name: string;
    url: string;
    intervalMinutes: number;
  };
  uptime24h: number | null;
  uptime7d: number | null;
  uptime30d: number | null;
  incidents24h: number;
  incidents7d: number;
  incidents30d: number;
  logs: { id: string; responseMs: number; isUp: boolean; checkedAt: string }[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

export default function StatusPage() {
  const { slug } = useParams<{ slug: string }>();
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Використовуємо axios без токена — публічний endpoint
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/monitors/public/${slug}`)
      .then((r) => setStats(r.data))
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [slug]);

  if (isLoading) return <div className="p-6 text-text-dim">Loading...</div>;
  if (notFound)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-low text-lg">Monitor not found or not public</p>
        <Link href="/" className="text-accent text-sm hover:underline">
          Go to PingCheck
        </Link>
      </div>
    );
  if (!stats) return null;

  const lastLog = stats.logs[stats.logs.length - 1];
  const currentStatus = lastLog?.isUp ? 'UP' : 'DOWN';
  const lastCheckAgo = lastLog ? getTimeAgo(lastLog.checkedAt) : '--';

  const logs24h = stats.logs
    .filter((l) => {
      const checkedAt = new Date(l.checkedAt).getTime();
      const logAge = new Date(stats.logs[stats.logs.length - 1].checkedAt).getTime() - checkedAt;
      return logAge < DAY_MS;
    })
    .map((l) => ({ isUp: l.isUp }))
    .slice(-48);

  return (
    <div className="max-w-5xl mx-auto p-6 flex flex-col gap-7">
      <div>
        <h1 className="text-2xl font-bold">{stats.monitor.name}</h1>
        <a
          href={stats.monitor.url}
          className="text-text-mid hover:text-foreground transition-colors text-sm"
        >
          {stats.monitor.url}
        </a>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <StatCard
          label="Current status"
          value={currentStatus}
          subValue={`checked every ${stats.monitor.intervalMinutes} min`}
          valueColor={lastLog?.isUp ? 'text-green' : 'text-low'}
        />
        <StatCard
          label="Last check"
          value={lastCheckAgo}
          subValue={lastLog?.checkedAt ? new Date(lastLog.checkedAt).toLocaleTimeString() : '--'}
        />
        <StatCard
          label="Last 24h"
          value={`${stats.uptime24h ?? '--'}%`}
          subValue={`${stats.incidents24h} incidents`}
          valueColor={uptimeColor(stats.uptime24h)}
          bars={logs24h}
        />
      </div>

      <div className="flex flex-col gap-5">
        <h3 className="text-xl font-medium">Uptime stats.</h3>
        <div className="grid grid-cols-2 gap-6">
          <StatCard
            label="Last 7 days"
            value={`${stats.uptime7d ?? '--'}%`}
            subValue={`${stats.incidents7d} incidents`}
            valueColor={uptimeColor(stats.uptime7d)}
          />
          <StatCard
            label="Last 30 days"
            value={`${stats.uptime30d ?? '--'}%`}
            subValue={`${stats.incidents30d} incidents`}
            valueColor={uptimeColor(stats.uptime30d)}
          />
        </div>
      </div>

      <ResponseChart logs={stats.logs} />

      <div className="text-center pt-4 border-t border-line">
        <Link href="/" className="text-text-dim text-xs hover:text-foreground transition-colors">
          Powered by <span className="text-accent">PingCheck</span>
        </Link>
      </div>
    </div>
  );
}
