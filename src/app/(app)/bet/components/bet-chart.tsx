'use client';

import { useEffect, useState } from 'react';
import { getBetChartData } from '../actions';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface BetChartProps {
  betId: string;
}

const COLORS = [
  '#f59e0b', // amber-500
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

export function BetChart({ betId }: BetChartProps) {
  const [data, setData] = useState<{ date: string;[key: string]: any }[]>([]);
  const [lineKeys, setLineKeys] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const result = await getBetChartData(betId);
      if (result.success) {
        setData(result.data.history);
        setLineKeys(result.data.lineKeys);
      }
      setLoading(false);
    }
    load();
  }, [betId]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center animate-pulse rounded-2xl border border-white/10 bg-white/5">
        <span className="text-white/40">Diagramm wird geladen...</span>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm text-white/40">
        Noch keine Einsatzhistorie vorhanden
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-sm font-semibold text-white/70">Win/Loss Ratio über Zeit (Quoten)</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#ffffff40"
              fontSize={12}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis
              stroke="#ffffff40"
              fontSize={12}
              tickFormatter={(val) => `${val}%`}
              domain={[0, 100]}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#111827',
                borderColor: '#ffffff20',
                borderRadius: '8px',
                color: '#fff',
              }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#ffffff80', marginBottom: '4px' }}
            />
            {lineKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
