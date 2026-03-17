import React, { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import AQIGauge from './components/AQIGauge';
import PollutantCard from './components/PollutantCard';
import TrendsChart from './components/TrendsChart';
import SensorMap from './components/SensorMap';
import { useAutoRefresh, useParticles } from './hooks/useAirQuality';
import { SENSORS, getAQILevel, AQI_LEVELS } from './data/mockData';

export default function App() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedSensorId, setSelectedSensorId] = useState('sensor-001');
  const [showBanner, setShowBanner] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const canvasRef = useRef(null);

  // Auto-refreshing sensor data
  const { sensors, countdown, isRefreshing, refresh } = useAutoRefresh(SENSORS, 30000);

  const selectedSensor = sensors.find(s => s.id === selectedSensorId) || sensors[0];
  const aqiLevel = getAQILevel(selectedSensor.aqi);
  const levelData = AQI_LEVELS[aqiLevel];
  const showHealthBanner = selectedSensor.aqi > 150 && showBanner;

  // Particle background based on AQI level
  useParticles(canvasRef, aqiLevel);

  const handleSelectSensor = useCallback((id) => {
    setSelectedSensorId(id);
  }, []);

  // Stats: averages across all sensors
  const avgAQI = Math.round(sensors.reduce((a, s) => a + s.aqi, 0) / sensors.length);
  const maxAQI = Math.max(...sensors.map(s => s.aqi));
  const minAQI = Math.min(...sensors.map(s => s.aqi));

  return (
    <div className="app-layout">
      {/* Particle canvas background */}
      <canvas ref={canvasRef} className="particle-canvas" />
      <div className="haze-overlay" />

      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        sensors={sensors}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <main className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(prev => !prev)}>
              ☰
            </button>
            <div className="topbar-title">
              {activeView === 'overview' && <>Air Quality Overview<span>Downtown Central</span></>}
              {activeView === 'pollutants' && 'Pollutant Breakdown'}
              {activeView === 'trends' && 'Historical Trends'}
              {activeView === 'map' && 'Sensor Network Map'}
            </div>
          </div>

          <div className="topbar-right">
            {/* Auto-refresh countdown */}
            <div className="refresh-timer">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={`refresh-icon ${!isRefreshing ? 'paused' : ''}`}
                style={{ animation: isRefreshing ? 'spin 0.6s linear infinite' : 'none' }}>
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Refreshing in {countdown}s
            </div>

            {/* Manual refresh */}
            <button
              onClick={refresh}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                padding: '5px 10px',
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseOver={e => e.target.style.borderColor = 'var(--accent-blue)'}
              onMouseOut={e => e.target.style.borderColor = 'var(--border-subtle)'}
            >
              Refresh Now
            </button>

            {/* AQI chip */}
            <div className="topbar-chip" style={{ color: levelData.color, borderColor: `${levelData.color}44` }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: levelData.color, flexShrink: 0, boxShadow: `0 0 6px ${levelData.color}` }} />
              AQI {selectedSensor.aqi}
            </div>

            {/* Time */}
            <div className="topbar-chip" style={{ display: 'none', '@media(min-width: 640px)': { display: 'flex' } }}>
              🕒 {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="page-content">
          {/* Health Advisory Banner */}
          {showHealthBanner && (
            <div className="health-banner">
              <div className="health-banner-icon">⚠️</div>
              <div>
                <div className="health-banner-title">Health Advisory — AQI {selectedSensor.aqi}: {levelData.label}</div>
                <div className="health-banner-msg">
                  {aqiLevel === 'unhealthy' && 'Everyone should reduce prolonged outdoor exertion. Sensitive groups should avoid outdoor activity.'}
                  {aqiLevel === 'veryUnhealthy' && 'Everyone should avoid prolonged outdoor exertion and stay indoors where possible.'}
                  {aqiLevel === 'hazardous' && '🚨 Health emergency — Avoid all outdoor physical activity. Remain indoors with windows closed.'}
                </div>
              </div>
              <button className="health-banner-close" onClick={() => setShowBanner(false)}>✕</button>
            </div>
          )}

          {/* ========== OVERVIEW VIEW ========== */}
          {activeView === 'overview' && (
            <div className="fade-in">
              {/* Overview grid: AQI + stats */}
              <div className="overview-grid">
                {/* AQI Gauge */}
                <AQIGauge
                  aqi={selectedSensor.aqi}
                  sensorName={selectedSensor.name}
                  lastUpdated={selectedSensor.lastUpdated}
                />

                {/* Stats column */}
                <div className="stats-column">
                  {/* Mini stat cards */}
                  <div className="stat-mini-row">
                    <div className="stat-mini">
                      <div className="stat-mini-label">Network Avg AQI</div>
                      <div className="stat-mini-value">{avgAQI}</div>
                      <div className="stat-mini-change neutral">Across 6 sensors</div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-mini-label">Peak AQI</div>
                      <div className="stat-mini-value" style={{ color: 'var(--aqi-unhealthy)' }}>{maxAQI}</div>
                      <div className="stat-mini-change up">▲ N. Industrial</div>
                    </div>
                    <div className="stat-mini">
                      <div className="stat-mini-label">Lowest AQI</div>
                      <div className="stat-mini-value" style={{ color: 'var(--aqi-good)' }}>{minAQI}</div>
                      <div className="stat-mini-change down">▼ Green Park</div>
                    </div>
                  </div>

                  {/* Quick sensor overview */}
                  <div className="card" style={{ flex: 1 }}>
                    <div className="card-header">
                      <div className="card-title">All Sensors Overview</div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {sensors.map(s => {
                        const lvl = getAQILevel(s.aqi);
                        const col = AQI_LEVELS[lvl]?.color;
                        const pct = Math.min(s.aqi / 300, 1) * 100;
                        return (
                          <div
                            key={s.id}
                            onClick={() => handleSelectSensor(s.id)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                              padding: '6px 8px',
                              borderRadius: 'var(--radius-sm)',
                              background: s.id === selectedSensorId ? 'var(--bg-elevated)' : 'transparent',
                              transition: 'background 0.15s',
                            }}
                          >
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: col, flexShrink: 0, boxShadow: `0 0 6px ${col}55` }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {s.name}
                              </div>
                              <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 999, marginTop: 4, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: col, borderRadius: 999, transition: 'width 0.8s' }} />
                              </div>
                            </div>
                            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: '0.95rem', color: col, flexShrink: 0 }}>
                              {s.aqi}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Pollutant cards */}
              <div className="section-header">
                <div className="section-title">Pollutant Breakdown</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedSensor.name} · WHO/EPA thresholds
                </div>
              </div>
              <div className="pollutants-grid">
                {Object.entries(selectedSensor.pollutants).map(([key, val]) => (
                  <PollutantCard key={key} pollutant={key} value={val} />
                ))}
              </div>

              {/* Trends chart */}
              <div className="section-header">
                <div className="section-title">Historical Trends</div>
              </div>
              <TrendsChart />
            </div>
          )}

          {/* ========== POLLUTANTS VIEW ========== */}
          {activeView === 'pollutants' && (
            <div className="fade-in">
              <div className="section-header">
                <div className="section-title">Full Pollutant Analysis</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {selectedSensor.name} · WHO/EPA guidance
                </div>
              </div>

              <div className="pollutants-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
                {Object.entries(selectedSensor.pollutants).map(([key, val]) => (
                  <PollutantCard key={key} pollutant={key} value={val} />
                ))}
              </div>

              {/* WHO reference table */}
              <div className="card" style={{ marginTop: '16px' }}>
                <div className="card-header">
                  <div className="card-title">WHO Air Quality Guidelines Reference</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        {['Pollutant', 'Current Value', 'WHO Safe Limit', 'Status', 'Health Risk'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'pm25', name: 'PM2.5', safe: 15, unit: 'µg/m³', risk: 'Cardiovascular & respiratory' },
                        { key: 'pm10', name: 'PM10', safe: 45, unit: 'µg/m³', risk: 'Respiratory tract damage' },
                        { key: 'no2', name: 'NO₂', safe: 25, unit: 'µg/m³', risk: 'Airway inflammation' },
                        { key: 'o3', name: 'O₃', safe: 100, unit: 'µg/m³', risk: 'Lung function reduction' },
                        { key: 'so2', name: 'SO₂', safe: 40, unit: 'µg/m³', risk: 'Bronchospasm' },
                        { key: 'co2', name: 'CO₂', safe: 1000, unit: 'ppm', risk: 'Cognitive impairment' },
                      ].map(row => {
                        const val = selectedSensor.pollutants[row.key];
                        const pct = val / row.safe;
                        const status = pct <= 0.6 ? { label: 'Safe', color: 'var(--aqi-good)' }
                          : pct <= 1.0 ? { label: 'Warning', color: 'var(--aqi-sensitive)' }
                          : { label: 'Danger', color: 'var(--aqi-unhealthy)' };
                        return (
                          <tr key={row.key} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Space Grotesk' }}>{row.name}</td>
                            <td style={{ padding: '10px 12px', color: status.color, fontFamily: 'Space Grotesk', fontWeight: 600 }}>{val} {row.unit}</td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{row.safe} {row.unit}</td>
                            <td style={{ padding: '10px 12px' }}>
                              <span style={{
                                background: `${status.color}22`,
                                color: status.color,
                                padding: '2px 8px',
                                borderRadius: '999px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                              }}>{status.label}</span>
                            </td>
                            <td style={{ padding: '10px 12px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{row.risk}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========== TRENDS VIEW ========== */}
          {activeView === 'trends' && (
            <div className="fade-in">
              <TrendsChart />
            </div>
          )}

          {/* ========== MAP VIEW ========== */}
          {activeView === 'map' && (
            <SensorMap
              sensors={sensors}
              selectedSensorId={selectedSensorId}
              onSelectSensor={handleSelectSensor}
            />
          )}
        </div>
      </main>
    </div>
  );
}
