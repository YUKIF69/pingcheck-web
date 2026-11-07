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
  // Годинні точки, які віддає бекенд (поле chart)
  logs: { checkedAt: string; responseMs: number; isUp: boolean }[];
}

export default function ResponseChart({ logs }: Props) {
  const data = logs.map((l) => ({
    // Дата і година, бо графік тепер охоплює 30 днів
    time: new Date(l.checkedAt).toLocaleString([], {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
    }),
    // null у години без жодного успішного пінгу: на графіку розрив
    ms: l.isUp ? l.responseMs : null,
  }));

  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <p className="text-sm font-medium text-foreground mb-4">Response time</p>
      {data.length === 0 ? (
        <p className="text-sm text-text-dim py-16 text-center">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3a" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              minTickGap={40}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 11 }}
              tickLine={false}
              unit=" ms"
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{ background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: 8 }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#6366f1' }}
            />
            <Line
              type="monotone"
              dataKey="ms"
              name="Avg response (ms)"
              stroke="#6366f1"
              strokeWidth={2}
              dot={data.length === 1}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
