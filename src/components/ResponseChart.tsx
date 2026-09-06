'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface Props {
  logs: { responseMs: number; checkedAt: string; isUp: boolean }[];
}

export default function ResponseChart({ logs }: Props) {
  const data = logs.map((l) => ({
    time: new Date(l.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    ms: l.isUp ? l.responseMs : null, // null коли DOWN — розрив на графіку
  }));

  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <p className="text-sm font-medium text-foreground mb-4">Response time</p>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
          <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            tickLine={false}
            unit=" ms"
            domain={[0, 2000]}
          />
          <Tooltip
            contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#6366f1' }}
          />
          <Line
            type="monotone"
            dataKey="ms"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
