import Link from 'next/link';
import { Monitor } from '@/lib/types';

interface MonitorCardProps {
  monitor: Monitor;
  currentStatus?: { isUp: boolean; responseMs: number };
}

export default function MonitorCard({ monitor, currentStatus }: MonitorCardProps) {
  const isUp = currentStatus?.isUp ?? monitor.pingLogs?.[0]?.isUp ?? true;
  const responseMs = currentStatus?.responseMs ?? monitor.pingLogs?.[0]?.responseMs;
  const logs = monitor.pingLogs?.slice(0, 30) ?? [];
  const uptime = logs.length
    ? Math.round((logs.filter((l) => l.isUp).length / logs.length) * 100)
    : null;

  return (
    <Link href={`/dashboard/${monitor.id}`}>
      <article className="bg-surface border border-line rounded-xl p-5 hover:border-accent/40 transition-colors cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div className="min-w-0 pr-3">
            <h2 className="text-sm font-medium text-foreground truncate">{monitor.name}</h2>
            <p className="text-xs text-text-dim mt-0.5 truncate">{monitor.url}</p>
          </div>

          <span
            className={`shrink-0 flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
              isUp ? 'bg-green/10 text-green border-green/20' : 'bg-low/10 text-low border-low/20'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isUp ? 'bg-green' : 'bg-low'}`} />
            {isUp ? 'UP' : 'DOWN'}
          </span>
        </div>

        <div className="flex items-end gap-0.5 h-8 mb-4">
          {logs.length > 0 ? (
            logs.map((log, i) => (
              <div
                key={i}
                title={`${log.responseMs}ms`}
                className={`flex-1 rounded-sm transition-all ${log.isUp ? 'bg-green/60' : 'bg-low/70'}`}
                style={{ height: `${Math.max(15, Math.min(100, (log.responseMs / 800) * 100))}%` }}
              />
            ))
          ) : (
            // Placeholder поки немає логів
            <div className="w-full h-1 bg-line rounded-full self-center" />
          )}
        </div>

        <div className="border-t border-line pt-3 flex justify-between items-center">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-dim mb-0.5">Uptime 24h</p>
            <p className="text-sm font-medium text-foreground font-mono">
              {uptime !== null ? `${uptime}%` : '--'}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-text-dim mb-0.5">Response</p>
            <p className="text-sm font-medium text-foreground font-mono">
              {responseMs ? `${responseMs} ms` : '--'}
            </p>
          </div>
          <div className="text-xs text-text-dim">every {monitor.intervalMinutes} min</div>
        </div>
      </article>
    </Link>
  );
}
