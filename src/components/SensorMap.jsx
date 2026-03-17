import React, { useEffect, useRef, useState } from 'react';
import { AQI_LEVELS, getAQILevel } from '../data/mockData';

// Leaflet is loaded via CDN in index.html, accessed via window.L
// We create the map imperatively

const getMarkerColor = (aqi) => {
  const level = getAQILevel(aqi);
  const colors = {
    good: '#22c55e',
    moderate: '#eab308',
    sensitive: '#f97316',
    unhealthy: '#ef4444',
    veryUnhealthy: '#a855f7',
    hazardous: '#be123c',
  };
  return colors[level] || '#60a5fa';
};

const getTopPollutant = (pollutants) => {
  const thresholds = { pm25: 15, pm10: 45, no2: 25, o3: 100, so2: 40, co2: 1000 };
  let worst = null;
  let worstRatio = 0;
  Object.entries(pollutants).forEach(([key, val]) => {
    if (thresholds[key]) {
      const ratio = val / thresholds[key];
      if (ratio > worstRatio) {
        worstRatio = ratio;
        worst = key;
      }
    }
  });
  const nameMap = { pm25: 'PM2.5', pm10: 'PM10', co2: 'CO₂', no2: 'NO₂', o3: 'O₃', so2: 'SO₂' };
  return worst ? nameMap[worst] : 'PM2.5';
};

export default function SensorMap({ sensors, selectedSensorId, onSelectSensor }) {
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (!window.L || leafletMapRef.current) return;

    const L = window.L;
    const map = L.map(mapRef.current, {
      center: [28.6139, 77.2090],
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    leafletMapRef.current = map;

    // Apply dark overlay to the map
    const style = document.createElement('style');
    style.textContent = `.leaflet-tile-pane { filter: brightness(0.55) saturate(0.3) hue-rotate(180deg); }`;
    document.head.appendChild(style);

    return () => {
      map.remove();
      leafletMapRef.current = null;
    };
  }, []);

  // Update markers when sensors change
  useEffect(() => {
    const L = window.L;
    if (!L || !leafletMapRef.current) return;
    const map = leafletMapRef.current;

    // Remove old markers
    Object.values(markersRef.current).forEach(m => m.remove());
    markersRef.current = {};

    sensors.forEach(sensor => {
      const color = getMarkerColor(sensor.aqi);
      const level = getAQILevel(sensor.aqi);
      const levelLabel = AQI_LEVELS[level]?.label || 'Unknown';
      const topPollutant = getTopPollutant(sensor.pollutants);
      const isSelected = sensor.id === selectedSensorId;

      const icon = L.divIcon({
        className: '',
        html: `
          <div style="
            width:${isSelected ? 52 : 44}px;
            height:${isSelected ? 52 : 44}px;
            background:${color};
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:${isSelected ? '3px solid white' : '2px solid rgba(255,255,255,0.3)'};
            box-shadow:0 4px 16px rgba(0,0,0,0.5), 0 0 0 ${isSelected ? 6 : 0}px ${color}44;
            display:flex;align-items:center;justify-content:center;
            transition:all 0.3s;
          ">
            <span style="
              transform:rotate(45deg);
              font-family:'Space Grotesk',sans-serif;
              font-weight:800;
              font-size:${isSelected ? 13 : 11}px;
              color:white;
              text-shadow:0 1px 3px rgba(0,0,0,0.6);
            ">${sensor.aqi}</span>
          </div>`,
        iconSize: [isSelected ? 52 : 44, isSelected ? 52 : 44],
        iconAnchor: [isSelected ? 26 : 22, isSelected ? 52 : 44],
        popupAnchor: [0, -(isSelected ? 56 : 48)],
      });

      const lastUpdDate = new Date(sensor.lastUpdated);
      const timeStr = lastUpdDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

      const marker = L.marker([sensor.lat, sensor.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;min-width:180px;padding:4px;">
            <div style="display:flex;align-items:baseline;gap:8px;margin-bottom:6px;">
              <span style="font-family:'Space Grotesk',sans-serif;font-size:2rem;font-weight:800;color:${color};line-height:1">${sensor.aqi}</span>
              <span style="font-size:0.75rem;font-weight:700;color:${color};background:${color}22;padding:2px 8px;border-radius:999px">${levelLabel}</span>
            </div>
            <div style="font-size:0.9rem;font-weight:700;color:#e8f0fe;margin-bottom:2px;">${sensor.name}</div>
            <div style="font-size:0.75rem;color:#8ba3c7;margin-bottom:8px;">${sensor.location}</div>
            <div style="font-size:0.78rem;color:#8ba3c7;padding-top:8px;border-top:1px solid rgba(255,255,255,0.06);">
              Top pollutant: <strong style="color:#e8f0fe">${topPollutant}</strong>
              &nbsp;·&nbsp; ${timeStr}
            </div>
          </div>
        `, {
          maxWidth: 260,
          className: 'dark-popup',
        });

      marker.on('click', () => onSelectSensor(sensor.id));
      markersRef.current[sensor.id] = marker;
    });
  }, [sensors, selectedSensorId, onSelectSensor]);

  return (
    <div className="map-section fade-in">
      <div className="section-header">
        <div className="section-title">Sensor Network Map</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aqi-good)', display: 'inline-block' }} />
          Good
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aqi-moderate)', display: 'inline-block', marginLeft: 6 }} />
          Moderate
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aqi-unhealthy)', display: 'inline-block', marginLeft: 6 }} />
          Unhealthy
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--aqi-very-unhealthy)', display: 'inline-block', marginLeft: 6 }} />
          Very Unhealthy
        </div>
      </div>

      <div className="map-container" ref={mapRef} />

      {/* Sensor cards below map */}
      <div className="sensor-list" style={{ marginTop: '16px' }}>
        {sensors.map(sensor => {
          const level = getAQILevel(sensor.aqi);
          const color = getMarkerColor(sensor.aqi);
          const timeStr = new Date(sensor.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={sensor.id}
              className={`sensor-card ${sensor.id === selectedSensorId ? 'selected' : ''}`}
              onClick={() => onSelectSensor(sensor.id)}
            >
              <div className="sensor-aqi-badge" style={{ background: `${color}22`, border: `1px solid ${color}44` }}>
                <div className="aqi-num" style={{ color }}>{sensor.aqi}</div>
                <div className="aqi-label" style={{ color }}>AQI</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sensor-info-name">{sensor.name}</div>
                <div className="sensor-info-location">{sensor.location}</div>
                <div className="sensor-info-updated">Updated {timeStr}</div>
              </div>
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
                boxShadow: `0 0 6px ${color}`,
              }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
