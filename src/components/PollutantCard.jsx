import React from 'react';
import { WHO_THRESHOLDS } from '../data/mockData';

const STATUS_MAP = (pct) => {
  if (pct <= 0.6) return { label: 'Safe', cls: 'safe' };
  if (pct <= 1.0) return { label: 'Warning', cls: 'warning' };
  return { label: 'Danger', cls: 'danger' };
};

const COLOR_MAP = {
  safe: '#22c55e',
  warning: '#f97316',
  danger: '#ef4444',
};

export default function PollutantCard({ pollutant, value }) {
  const threshold = WHO_THRESHOLDS[pollutant];
  if (!threshold) return null;

  const pct = value / threshold.safe;
  const limitPct = Math.min(pct, 2); // cap at 2x safe limit for display
  const barWidth = Math.min((limitPct / 2) * 100, 100); // normalize to 100%
  const status = STATUS_MAP(pct);
  const color = COLOR_MAP[status.cls];

  return (
    <div className={`pollutant-card ${status.cls}`}>
      <div className="pollutant-header">
        <div>
          <div className="pollutant-name">{threshold.name}</div>
          <div className="pollutant-fullname">{threshold.fullName}</div>
        </div>
        <div className={`pollutant-status-chip ${status.cls}`}>{status.label}</div>
      </div>

      <div className="pollutant-value" style={{ color }}>
        {value.toLocaleString('en-US', { maximumFractionDigits: 1 })}
      </div>
      <div className="pollutant-meta">
        {threshold.unit} &nbsp;·&nbsp; Safe limit: <strong>{threshold.safe} {threshold.unit}</strong>
      </div>

      {/* Progress bar */}
      <div className="progress-bar-container">
        <div className={`progress-bar-labels ${pct > 1 ? 'danger' : ''}`}>
          <span>0</span>
          <span>{pct > 1 ? `${(pct * 100).toFixed(0)}% of limit` : `${(pct * 100).toFixed(0)}% of limit`}</span>
          <span>{threshold.safe * 2}</span>
        </div>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{
              width: `${barWidth}%`,
              background: pct <= 0.6
                ? `linear-gradient(90deg, #22c55e, #16a34a)`
                : pct <= 1.0
                ? `linear-gradient(90deg, #f97316, #ea580c)`
                : `linear-gradient(90deg, #ef4444, #b91c1c)`,
            }}
          />
        </div>
        {/* Safe threshold marker */}
        <div style={{ position: 'relative', marginTop: 2 }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              width: 1,
              height: 6,
              background: 'rgba(255,255,255,0.2)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
