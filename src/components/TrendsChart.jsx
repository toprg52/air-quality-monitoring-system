import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { HISTORICAL_DATA } from '../data/mockData';

const TIME_RANGES = [
  { key: '24h', label: '24 Hours' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
];

const SERIES = [
  { key: 'aqi', label: 'AQI', color: '#60a5fa', strokeWidth: 2.5 },
  { key: 'pm25', label: 'PM2.5', color: '#f97316', strokeWidth: 1.5 },
  { key: 'pm10', label: 'PM10', color: '#a855f7', strokeWidth: 1.5 },
  { key: 'no2', label: 'NO₂', color: '#eab308', strokeWidth: 1.5 },
  { key: 'o3', label: 'O₃', color: '#22c55e', strokeWidth: 1.5 },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="custom-tooltip">
      <div className="custom-tooltip-time">{label}</div>
      {payload.map((entry) => (
        <div className="custom-tooltip-item" key={entry.dataKey}>
          <div className="custom-tooltip-label">
            <div className="custom-tooltip-dot" style={{ background: entry.color }} />
            {SERIES.find(s => s.key === entry.dataKey)?.label || entry.dataKey}
          </div>
          <div className="custom-tooltip-value">{entry.value?.toFixed(1)}</div>
        </div>
      ))}
    </div>
  );
}

export default function TrendsChart() {
  const [range, setRange] = useState('24h');
  const [activeKeys, setActiveKeys] = useState(new Set(['aqi', 'pm25', 'pm10']));

  const data = useMemo(() => HISTORICAL_DATA[range] || [], [range]);

  const toggleKey = (key) => {
    setActiveKeys(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        if (next.size > 1) next.delete(key); // keep at least one
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="chart-section fade-in">
      <div className="chart-header">
        <div>
          <div className="chart-title">Historical Air Quality Trends</div>
          <div className="chart-subtitle">AQI and pollutant levels over time — Downtown Central</div>
        </div>

        {/* Time range selector */}
        <div className="time-range-selector">
          {TIME_RANGES.map(({ key, label }) => (
            <button
              key={key}
              className={`time-range-btn ${range === key ? 'active' : ''}`}
              onClick={() => setRange(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            {SERIES.map(s => (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={s.color} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#4a6280', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#4a6280', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />

          {SERIES.filter(s => activeKeys.has(s.key)).map(s => (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              stroke={s.color}
              strokeWidth={s.strokeWidth}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              animationDuration={600}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend / Filter */}
      <div className="chart-legend" style={{ marginTop: '16px' }}>
        {SERIES.map(s => (
          <div
            key={s.key}
            className="legend-item"
            style={{
              cursor: 'pointer',
              opacity: activeKeys.has(s.key) ? 1 : 0.35,
              transition: 'opacity 0.2s',
            }}
            onClick={() => toggleKey(s.key)}
          >
            <div className="legend-dot" style={{ background: s.color }} />
            {s.label}
          </div>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          Click legend to show/hide
        </span>
      </div>
    </div>
  );
}
