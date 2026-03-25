import React, { useMemo } from 'react';
import { AQI_LEVELS, getAQILevel } from '../data/mockData';

const RADIUS = 80;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Animated SVG gauge/dial for AQI display
 */
export default function AQIGauge({ aqi, sensorName, lastUpdated }) {
  const level = getAQILevel(aqi);
  const levelData = AQI_LEVELS[level];

  // Map AQI 0–500 to 0–100% of gauge arc
  const pct = Math.min(aqi / 500, 1);
  const offset = CIRCUMFERENCE * (1 - pct * 0.75); // 75% of circle used as arc

  const timeStr = useMemo(() => {
    if (!lastUpdated) return 'N/A';
    const d = new Date(lastUpdated);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }, [lastUpdated]);

  const recommendation = {
    good: 'Air quality is satisfactory. Enjoy outdoor activities freely.',
    moderate: 'Unusually sensitive individuals should consider reducing prolonged exertion.',
    sensitive: 'Sensitive groups should limit outdoor exertion and keep medicine handy.',
    unhealthy: 'Everyone should reduce prolonged outdoor exertion.',
    veryUnhealthy: 'Everyone should avoid prolonged outdoor exertion. Stay indoors if possible.',
    hazardous: '⚠ Health emergency. Avoid all outdoor activity. Remain indoors.',
  }[level];

  // Scale bar colors
  const scaleSegments = [
    { color: '#22c55e', label: 'Good' },
    { color: '#eab308', label: 'Moderate' },
    { color: '#f97316', label: 'Sensitive' },
    { color: '#ef4444', label: 'Unhealthy' },
    { color: '#a855f7', label: 'Very' },
    { color: '#be123c', label: 'Haz.' },
  ];

  return (
    <div className="aqi-panel fade-in" style={{ '--aqi-color': levelData.color }}>


      {/* Gauge SVG */}
      <div className="aqi-gauge-container">
        <svg className="aqi-gauge-svg" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={levelData.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={levelData.color} stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Background track */}
          <circle
            className="aqi-gauge-track"
            cx="100" cy="100" r={RADIUS}
            strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * 0.125}
          />
          {/* Animated fill */}
          <circle
            className="aqi-gauge-fill"
            cx="100" cy="100" r={RADIUS}
            stroke="url(#gaugeGrad)"
            filter="url(#glow)"
            strokeDasharray={`${CIRCUMFERENCE * 0.75} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * 0.125 + CIRCUMFERENCE * 0.75 * (1 - pct)}
          />
          {/* Tick marks */}
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0].map((t, i) => {
            const angle = (-225 + t * 270) * (Math.PI / 180);
            const r1 = 92, r2 = 96;
            return (
              <line
                key={i}
                x1={100 + r1 * Math.cos(angle)}
                y1={100 + r1 * Math.sin(angle)}
                x2={100 + r2 * Math.cos(angle)}
                y2={100 + r2 * Math.sin(angle)}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="aqi-gauge-center">
          <div className="aqi-score" style={{ color: levelData.color }}>
            {aqi}
          </div>
          <div className="aqi-score-label">AQI</div>
        </div>
      </div>

      {/* Status badge */}
      <div
        className="aqi-status-badge"
        style={{
          background: `${levelData.color}22`,
          color: levelData.color,
          border: `1px solid ${levelData.color}44`,
        }}
      >
        {levelData.label}
      </div>

      {/* Recommendation */}
      <p className="aqi-recommendation">{recommendation}</p>

      {/* AQI Scale Bar */}
      <div className="aqi-scale" style={{ width: '100%', marginTop: '16px' }}>
        {scaleSegments.map((seg, i) => (
          <div
            key={i}
            className="aqi-scale-segment"
            style={{ background: seg.color, opacity: i === ['good','moderate','sensitive','unhealthy','veryUnhealthy','hazardous'].indexOf(level) ? 1 : 0.25 }}
            title={seg.label}
          />
        ))}
      </div>

      {/* Last updated */}
      <div className="aqi-last-updated">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        Updated at {timeStr}
      </div>
    </div>
  );
}
