'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getUserPointHistory } from '../actions';

interface PointHistoryChartProps {
  userId: string;
}

export function PointHistoryChart({ userId }: PointHistoryChartProps) {
  const [data, setData] = useState<Array<{ date: string; balance: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserPointHistory(userId).then((result) => {
      if (result.success) {
        setData(result.data);
      }
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl bg-white/5" />;
  }

  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-white/10 bg-white/5">
        <p className="text-sm text-white/30">No history yet</p>
      </div>
    );
  }

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
            formatter={(value: number | undefined) => [
              `${(value ?? 0).toLocaleString()} pts`,
              'Balance',
            ]}
            labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
          />
          <Line type="monotone" dataKey="balance" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
