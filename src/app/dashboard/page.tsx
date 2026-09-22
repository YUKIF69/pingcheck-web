'use client';

import api from '@/lib/api';
import { Monitor } from '@/lib/types';
import { useEffect, useState } from 'react';
import { useMonitorSocket } from '@/hooks/useMonitorSocket';
import { useSubscription } from '@/hooks/useSubscription';
import MonitorCard from '@/components/MonitorCard';

export default function DashboardPage() {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { statuses } = useMonitorSocket();
  const { isPremium } = useSubscription();

  useEffect(() => {
    const fetchMonitors = async () => {
      try {
        const response = await api.get('/monitors');
        setMonitors(response.data);
      } catch {
        setError('Failed to load monitors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonitors();
  }, []);

  async function handleUpgrade() {
    const res = await api.post('/stripe/checkout');
    window.location.href = res.data.url;
  }

  return (
    <div>
      {isLoading && <div className="text-sm text-text-dim font-mono">Loading...</div>}

      {error && (
        <div className="flex items-center justify-center h-64 text-low text-sm font-mono">
          {error}
        </div>
      )}

      <main className="flex-1 p-6 gap-8">
        <div className="flex flex-col gap-4.5">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground font-semibold text-3xl">Monitoring</h1>
              <p className="text-foreground font-light text-lg">
                Monitor your websites and services
              </p>
            </div>

            {/* Premium badge або кнопка Upgrade */}
            {isPremium ? (
              <span className="px-3 py-1 bg-accent/10 text-accent border border-accent/20 text-xs font-medium rounded-full">
                Premium
              </span>
            ) : (
              <button
                onClick={handleUpgrade}
                className="px-4 py-2 bg-accent hover:bg-accent/80 text-white text-sm rounded-lg transition-colors"
              >
                Upgrade to Premium
              </button>
            )}
          </div>

          {!isLoading && !error && (
            <div className="grid grid-cols-2 gap-3">
              {monitors.map((monitor) => {
                const currentStatus = statuses[monitor.id];
                return (
                  <MonitorCard key={monitor.id} monitor={monitor} currentStatus={currentStatus} />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
