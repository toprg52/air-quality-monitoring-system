import React, { useEffect, useRef } from 'react';

/**
 * BangaloreMap component integration
 * Displays local AQI from Firebase and WAQI network on a Leaflet map.
 */
export default function BangaloreMap() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Check if scripts are loaded
    if (!window.L) {
      console.error('Leaflet script not found. Make sure it is included in index.html');
      return;
    }

    if (!mapRef.current || mapInstance.current) return;

    // Initialize map centered on Bangalore
    const L = window.L;
    const map = L.map(mapRef.current).setView([12.9716, 77.5946], 11);
    mapInstance.current = map;

    // OpenStreetMap layer with dark theme contrast
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO'
    }).addTo(map);

    const KEY = '355c78561df6cc71edae14e6487260fee633a5fe';
    const FIREBASE_URL = 'https://air-quality-monitor-83ae8-default-rtdb.firebaseio.com/air_quality.json';

    // Provided calculation logic
   function calculateAQI(pm25) {

  if (pm25 === undefined || pm25 === null) {
    return { value: 0, label: "No Data", color: "gray" };
  }

  const value = Math.min(500, Math.round(pm25 * 2.5));

  let label = "Good";
  let color = "green";

  if (value > 150) {
    label = "Unhealthy";
    color = "red";
  } else if (value > 100) {
    label = "Unhealthy (Sensitive)";
    color = "orange";
  } else if (value > 50) {
    label = "Moderate";
    color = "yellow";
  }

  return { value, label, color };
}

    function getAQIColor(val) {
      if (val < 50) return "green";
      if (val < 100) return "yellow";
      if (val < 150) return "orange";
      return "red";
    }

    function createMarker(lat, lng, label, aqi, status, color) {
        const icon = L.divIcon({
          className: 'bangalore-map-marker',
          html: `<div style="background:${color}; width:28px; height:28px; border-radius:50%; border:2px solid white; display:flex; align-items:center; justify-content:center; color:white; font-size:11px; font-weight:800; box-shadow:0 3px 8px rgba(0,0,0,0.5)">${aqi}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });
        L.marker([lat, lng], {icon: icon})
          .addTo(map)
          .bindPopup(`
            <div style="font-family: 'Inter', sans-serif; padding: 4px;">
              <strong style="display:block; margin-bottom:4px; font-size:0.9rem">${label}</strong>
              <div style="color:${color}; font-weight:700; font-size:1.1rem">AQI: ${aqi}</div>
              <div style="font-size:0.75rem; color:#666">${status}</div>
            </div>
          `);
    }

    // Initialize markers
    // 1. Firebase Our Sensor (MIT BLR)
    fetch(FIREBASE_URL)
      .then(res => res.json())
      .then(data => {
        if (data && data.pm25 !== undefined) {
          const aqiData = calculateAQI(data.pm25);
          // Placing red marker as requested by user
          createMarker(12.9716, 77.5946, "Our Sensor (MIT BLR)", aqiData.value, aqiData.label, aqiData.color);
        }
      }).catch(e => console.error("Firebase fetch failed", e));

    // 2. WAQI Network Stations
   const stations = [
  'bangalore',
  'delhi',
  'mumbai',
  'chennai',
  'kolkata'
];

    stations.forEach(station => {
      fetch(`https://api.waqi.info/feed/${station}/?token=${KEY}`)
        .then(res => res.json())
        .then(resData => {
            if (resData.status === 'ok') {
                const d = resData.data;
                const aqi = d.aqi;
                const color = getAQIColor(aqi);
                const aqiData = calculateAQI(d.aqi);
                createMarker(d.city.geo[0], d.city.geo[1], d.city.name, aqi, status, color);
            }
        }).catch(e => console.error(`WAQI fetch failed for ${station}`, e));
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="fade-in" style={{ marginTop: '32px' }}>
      <div className="section-header">
        <div className="section-title">Bangalore AQI Map (Network Comparison)</div>
      </div>
      <div id="map" ref={mapRef} style={{ 
          height: '400px', 
          borderRadius: '14px', 
          marginTop: '20px', 
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          zIndex: 1
      }}></div>
    </div>
  );
}
