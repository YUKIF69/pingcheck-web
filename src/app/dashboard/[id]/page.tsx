'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Monitor } from '@/lib/types';
import StatCard from '@/components/StatCard';
import { getTimeAgo, uptimeColor } from '@/lib/utils';
import ResponseChart from '@/components/ResponseChart';
import { IconSettings } from '@tabler/icons-react';

interface Stats {
  uptime24h: number | null;
  uptime7d: number | null;
  uptime30d: number | null;
  incidents24h: number;
  incidents7d: number;
  incidents30d: number;
  logs: { id: string; responseMs: number; isUp: boolean; checkedAt: string }[];
  monitor: Monitor;
}

const DAY_MS = 24 * 60 * 60 * 1000;

function EditForm({ monitor, onClose }: { monitor: Monitor; onClose: () => void }) {
  const [editInterval, setEditInterval] = useState(monitor.intervalMinutes);
  const [editIsPublic, setEditIsPublic] = useState(monitor.isPublic);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  async function handleSave() {
    setIsLoading(true);
    try {
      await api.patch(`/monitors/${monitor.id}`, {
        intervalMinutes: editInterval,
        isPublic: editIsPublic,
      });
      onClose();
      router.refresh();
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Модальне вікно */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-surface border border-line rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Settings</h3>
          <button
            onClick={onClose}
            className="text-text-dim hover:text-foreground transition-colors text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-text-dim uppercase tracking-widest">Check interval</label>
          <div className="relative">
            <select
              value={editInterval}
              onChange={(e) => setEditInterval(Number(e.target.value))}
              onClick={() => setIsOpen((prev) => !prev)}
              onBlur={() => setIsOpen(false)}
              onMouseLeave={() => setIsOpen(false)}
              className="w-full bg-surface-2 border border-line rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer pr-10"
            >
              <option value={1}>Every 1 minute</option>
              <option value={5}>Every 5 minutes</option>
              <option value={10}>Every 10 minutes</option>
              <option value={30}>Every 30 minutes</option>
              <option value={60}>Every 60 minutes</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className={`text-text-dim transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              >
                <path
                  d="M4 6L8 10L12 6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div
          className="flex items-center justify-between bg-surface-2 border border-line rounded-lg px-4 py-3 cursor-pointer"
          onClick={() => setEditIsPublic((prev) => !prev)}
        >
          <div>
            <p className="text-sm text-foreground">Public monitor</p>
            <p className="text-xs text-text-dim mt-0.5">Anyone can view this status page</p>
          </div>
          <div
            className={`w-10 h-6 rounded-full transition-colors relative ${editIsPublic ? 'bg-accent' : 'bg-line'}`}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editIsPublic ? 'left-5' : 'left-1'}`}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-surface-2 hover:bg-line text-foreground text-sm py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex-1 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            {isLoading ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </>
  );
}

export default function MonitorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    api
      .get(`/monitors/${id}/stats`)
      .then((r) => setStats(r.data))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <div className="p-6 text-text-dim">Loading...</div>;
  if (!stats) return <div className="p-6 text-low">Failed to load</div>;

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
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface-2 hover:border-accent/40 transition-colors text-sm text-text-dim hover:text-foreground w-fit"
        >
          ← Dashboard
        </Link>
        <button
          onClick={() => setIsEditing((prev) => !prev)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface-2 hover:border-accent/40 transition-colors text-sm text-text-dim hover:text-foreground cursor-pointer"
        >
          <IconSettings size={16} />
          Edit
        </button>
      </div>

      {isEditing && <EditForm monitor={stats.monitor} onClose={() => setIsEditing(false)} />}

      <div className="flex flex-col gap-7">
        <div>
          <h1 className="text-2xl font-bold">{stats.monitor.name}</h1>
          <h2 className="text-text-mid">
            HTTP/S monitor for{' '}
            <a className="hover:text-foreground transition-colors" href={stats.monitor.url}>
              {stats.monitor.url}
            </a>
          </h2>
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
          <div className="grid grid-cols-3 gap-6">
            <StatCard
              label="last 7 days"
              value={`${stats.uptime7d ?? '--'}%`}
              subValue={`${stats.incidents7d} incidents`}
              valueColor={uptimeColor(stats.uptime7d)}
            />
            <StatCard
              label="last 30 days"
              value={`${stats.uptime30d ?? '--'}%`}
              subValue={`${stats.incidents30d} incidents`}
              valueColor={uptimeColor(stats.uptime30d)}
            />
          </div>
        </div>

        <ResponseChart logs={stats.logs} />
      </div>
    </div>
  );
}
