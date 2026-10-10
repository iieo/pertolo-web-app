'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getUserPointHistory } from '../actions';
import { ACCENT, tooltipStyle } from './styles';

interface PointHistoryChartProps {
  userId?: string;
  initialData?: Array<{ date: string; balance: number }>;
}

export function PointHistoryChart({ userId, initialData }: PointHistoryChartProps) {
  const [data, setData] = useState<Array<{ date: string; balance: number }>>(initialData ?? []);
  const [loading, setLoading] = useState(initialData === undefined && !!userId);

  useEffect(() => {
    if (initialData !== undefined || !userId) return;
    getUserPointHistory(userId).then((result) => {
      if (result.success) setData(result.data);
      setLoading(false);
    });
  }, [userId, initialData]);

  if (loading) {
    return (
      <div
        className="h-48 animate-pulse rounded-xl bg-white/5 motion-reduce:animate-none md:h-64"
        role="status"
        aria-label="Lädt"
      />
    );
  }

  if (data.length === 0) {
    return <p className="text-base text-white/60">Noch kein Verlauf vorhanden</p>;
  }

  return (
    <div className="h-48 w-full md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <XAxis dataKey="date" hide />
          <YAxis hide domain={['dataMin', 'dataMax']} />
          <Tooltip
            {...tooltipStyle}
            formatter={(value: number | undefined) => [
              `${(value ?? 0).toLocaleString()} Punkte`,
              'Kontostand',
            ]}
            labelFormatter={(label) => new Date(String(label)).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey="balance"
            stroke={ACCENT}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
