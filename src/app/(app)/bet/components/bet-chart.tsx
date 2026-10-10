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
import { ACCENT, sectionTitleClass, tooltipStyle } from './styles';

interface BetChartProps {
  data: Array<{ date: string; [key: string]: any }>;
  lineKeys: string[];
}

// Solid series colors that stay readable on black.
const COLORS = [ACCENT, '#4CC9F0', '#FFB703', '#F15BB5', '#FB8500', '#B197FC'];

export function BetChart({ data, lineKeys }: BetChartProps) {
  return (
    <section aria-labelledby="chart-heading" className="flex flex-col gap-6">
      <h2 id="chart-heading" className={sectionTitleClass}>
        Quotenverlauf
      </h2>
      {data.length === 0 ? (
        <p className="text-base text-white/60">Noch keine Einsatzhistorie vorhanden</p>
      ) : (
        <div className="h-64 w-full md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickMargin={8}
                minTickGap={32}
              />
              <YAxis
                stroke="rgba(255,255,255,0.6)"
                fontSize={12}
                tickFormatter={(val) => `${val}%`}
                domain={[0, 100]}
                width={40}
              />
              <Tooltip {...tooltipStyle} />
              {lineKeys.map((key, index) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={COLORS[index % COLORS.length]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
