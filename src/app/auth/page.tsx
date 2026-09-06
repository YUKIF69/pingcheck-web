'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/components/AuthContext';
import axios from 'axios';

export default function Auth() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'login' | 'register'>(
    searchParams.get('tab') === 'register' ? 'register' : 'login',
  );

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login } = useAuth();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token);
      router.push('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', { email, password, name });
      login(response.data.access_token);
      router.push('/dashboard');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Registration failed');
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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Логотип */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-foreground">PingCheck</h1>
          <p className="text-sm text-text-dim mt-1">Monitor your websites 24/7</p>
        </div>

        {/* Карточка */}
        <div className="bg-surface border border-line rounded-xl p-6">
          {/* Таби */}
          <div className="flex bg-surface-2 rounded-lg p-1 mb-6">
            <button
              onClick={() => {
                setTab('login');
                setError(null);
                setEmail('');
                setPassword('');
                setName('');
              }}
              className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
                tab === 'login'
                  ? 'bg-surface text-foreground'
                  : 'text-text-dim hover:text-foreground'
              }`}
            >
              Log in
            </button>
            <button
              onClick={() => {
                setTab('register');
                setError(null);
                setEmail('');
                setPassword('');
                setName('');
              }}
              className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
                tab === 'register'
                  ? 'bg-surface text-foreground'
                  : 'text-text-dim hover:text-foreground'
              }`}
            >
              Register
            </button>
          </div>

          {/* Login форма */}
          {tab === 'login' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />

              {error && <p className="text-xs text-low">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-1"
              >
                {isLoading ? 'Loading...' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Register форма */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />

              {error && <p className="text-xs text-low">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent hover:bg-accent/90 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors mt-1"
              >
                {isLoading ? 'Loading...' : 'Create account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
