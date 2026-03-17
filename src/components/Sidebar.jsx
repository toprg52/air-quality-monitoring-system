import React from 'react';

const NAV_ITEMS = [
  {
    id: 'overview',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
    label: 'Overview',
  },
  {
    id: 'pollutants',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 0 1 10 10v.5a.5.5 0 0 1-.5.5H2.5a.5.5 0 0 1-.5-.5V12A10 10 0 0 1 12 2z"/>
        <line x1="12" y1="12" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/>
      </svg>
    ),
    label: 'Pollutants',
  },
  {
    id: 'trends',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    label: 'Trends',
  },
  {
    id: 'map',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
        <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
      </svg>
    ),
    label: 'Sensor Map',
  },
];

const SENSOR_NAV = [
  { id: 'sensor-001', label: 'Downtown Central', aqi: null },
  { id: 'sensor-002', label: 'North Industrial', aqi: null, alert: true },
  { id: 'sensor-003', label: 'Green Park', aqi: null },
  { id: 'sensor-004', label: 'East Highway', aqi: null },
  { id: 'sensor-005', label: 'University Campus', aqi: null },
  { id: 'sensor-006', label: 'Airport Terminal', aqi: null },
];

export default function Sidebar({ activeView, onViewChange, sensors, isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 99, backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">🌬️</div>
          <div className="sidebar-logo-text">Air<span>Watch</span></div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Dashboard</div>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              className={`sidebar-nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => { onViewChange(item.id); onClose(); }}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}

          <div className="sidebar-section-label">Sensors</div>
          {SENSOR_NAV.map(sensor => {
            const sensorData = sensors?.find(s => s.id === sensor.id);
            const aqi = sensorData?.aqi;
            const isAlert = aqi > 150;
            return (
              <div
                key={sensor.id}
                className="sidebar-nav-item"
                onClick={() => { onViewChange('overview'); onClose(); }}
                style={{ fontSize: '0.8rem' }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: aqi
                    ? aqi <= 50 ? 'var(--aqi-good)'
                      : aqi <= 100 ? 'var(--aqi-moderate)'
                      : aqi <= 150 ? 'var(--aqi-sensitive)'
                      : aqi <= 200 ? 'var(--aqi-unhealthy)'
                      : 'var(--aqi-very-unhealthy)'
                    : 'var(--text-muted)',
                  boxShadow: isAlert ? `0 0 6px var(--aqi-unhealthy)` : 'none',
                }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  {sensor.label}
                </span>
                {aqi && (
                  <span style={{
                    fontSize: '0.7rem',
                    fontFamily: 'Space Grotesk',
                    fontWeight: 700,
                    color: isAlert ? 'var(--aqi-unhealthy)' : 'var(--text-muted)',
                    flexShrink: 0,
                  }}>
                    {aqi}
                  </span>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom status */}
        <div className="sidebar-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="sidebar-status-dot" />
            <div className="sidebar-status-text">6 sensors online</div>
          </div>
          <div style={{ marginTop: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Data refreshes every 30s
          </div>
        </div>
      </aside>
    </>
  );
}
