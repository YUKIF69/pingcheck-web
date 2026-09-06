'use client';

import api from '@/lib/api';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddMonitor() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [intervalMinutes, setIntervalMinutes] = useState(5);
  const [isPublic, setIsPublic] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  async function hendleMonitor(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !url || !intervalMinutes) {
      setError('All fields are required');
      return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('URL must start with http:// or https://');
      return;
    }

    if (intervalMinutes < 1 || intervalMinutes > 60) {
      setError('Interval must be between 1 and 60 minutes');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await api.post('/monitors', { name, url, intervalMinutes, isPublic });
      router.push('/dashboard');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to create monitor');
      } else {
        setError('Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = `
    w-full bg-surface-2 border border-line rounded-lg px-4 py-2.5
    text-sm text-foreground placeholder:text-text-dim
    focus:outline-none focus:border-accent transition-colors
  `;

  const labelClass = 'text-xs text-text-dim uppercase tracking-widest';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">New monitor</h1>
          <p className="text-sm text-text-dim mt-1">Add a website or service to monitor</p>
        </div>

        <div className="bg-surface border border-line rounded-xl p-6">
          <form onSubmit={hendleMonitor} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Name</label>
              <input
                type="text"
                placeholder="My App"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>URL</label>
              <input
                type="url"
                placeholder="https://myapp.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Check interval</label>
              <div className="relative">
                <select
                  value={intervalMinutes}
                  onChange={(e) => setIntervalMinutes(Number(e.target.value))}
                  onClick={() => setIsOpen((prev) => !prev)}
                  onBlur={() => setIsOpen(false)}
                  onMouseLeave={() => setIsOpen(false)}
                  className={`${inputClass} appearance-none cursor-pointer pr-10`}
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
              onClick={() => setIsPublic((prev) => !prev)}
            >
              <div>
                <p className="text-sm text-foreground">Public monitor</p>
                <p className="text-xs text-text-dim mt-0.5">
                  Anyone can view this monitors status page
                </p>
              </div>
              <div
                className={`w-10 h-6 rounded-full transition-colors relative ${isPublic ? 'bg-accent' : 'bg-line'}`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPublic ? 'left-5' : 'left-1'}`}
                />
              </div>
            </div>

            {error && <p className="text-xs text-low">{error}</p>}

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-surface-2 hover:bg-line text-foreground text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !name || !url}
                className="flex-1 bg-accent hover:bg-accent/90 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                {isLoading ? 'Creating...' : 'Create monitor'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
